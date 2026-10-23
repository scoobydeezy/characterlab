import {expect,it} from 'vitest';
import {BatchSession,BATCH_LIMITS} from '../workbench/batchSession';
import {createBatchRun,type BatchJob} from '../workbench/experimentRegistry';
import {batchReport} from '../workbench/BatchWorkbench';
import catalog from '../workbench/batchCatalogV8.json';
import previous from '../workbench/batchCatalogV7.json';
import long from '../workbench/longCatalog.json';
const job=(name:string)=>catalog.jobs.find(j=>j.id==='long/'+name)! as BatchJob;
it('retains prior roles and admits the complete original LONG source census',()=>{
 expect(catalog.jobs.slice(0,915)).toEqual(previous.jobs);
 expect(catalog.jobs).toHaveLength(947);expect(BATCH_LIMITS.jobs).toBe(947);
 expect(catalog.jobs.reduce((n,j)=>n+j.expectedSaveHashes.length,0)).toBe(6388);
 expect(catalog.jobs.filter(j=>j.experimentId==='long').map(j=>j.name)).toEqual(long.programs.map(p=>p.name));
});
it('executes empty and maximum-time programs through batch boundaries and exports exact originals',async()=>{
 const jobs=[job('empty'),job('maximum-time')],batch=new BatchSession(jobs);await batch.run();
 const snapshot=batch.snapshot();expect(snapshot.status).toBe('complete');expect(snapshot.results.map(r=>r.prefixes.length)).toEqual([1,2]);
 const report=batchReport(snapshot);
 expect(report.originals.long.programs).toEqual(long.programs.filter(p=>jobs.some(j=>j.name===p.name)));
 expect(report.originals.long.models).toEqual(long.models.filter(m=>report.originals.long.programs.some(p=>p.model===m.name)));
 expect(snapshot.results.every(r=>r.prefixes.every(p=>p.matchesFrozenSave))).toBe(true);
},600000);
it('preserves the original nonzero seed and rejects altered LONG declarations',async()=>{
 const frozen=job('seed-1'),run=await createBatchRun(frozen);
 expect(run.view().saveHash).toBe(frozen.expectedSaveHashes[0]);await run.advance();expect(run.view().saveHash).toBe(frozen.expectedSaveHashes[1]);
 expect(long.programs.find(p=>p.name==='seed-1')!.runSeed).toBe('00'.repeat(31)+'01');
 for(const change of [{seed:2},{name:'empty'},{law:'invented'},{numeric:1},{appraisal:'invented'},{expectedSaveHashes:['0'.repeat(64)]}])await expect(createBatchRun({...frozen,...change})).rejects.toThrow('frozen');
},600000);
