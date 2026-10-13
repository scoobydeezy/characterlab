import {expect,it} from 'vitest';
import {BatchSession} from '../workbench/batchSession';
import {createBatchRun,type BatchJob} from '../workbench/experimentRegistry';
import {batchReport} from '../workbench/BatchWorkbench';
import catalog from '../workbench/batchCatalogV5.json';
import old from '../workbench/batchCatalogV4.json';
import work from '../workbench/workCatalog.json';
const jobs=['work/c1-k1-s1','work/draw-1-1'].map(id=>catalog.jobs.find(j=>j.id===id)! as BatchJob);
it('preserves prior jobs and exports WORK native initial state and byte0 seed policy',async()=>{
 expect(catalog.jobs.slice(0,688)).toEqual(old.jobs);
 const batch=new BatchSession(jobs);await batch.run();const s=batch.snapshot();expect(s.status).toBe('complete');expect(s.results.every(r=>r.prefixes.every(p=>p.matchesFrozenSave))).toBe(true);
 const report=batchReport(s);expect(report.originals.work.programs).toEqual(work.programs.filter(r=>jobs.some(j=>j.name===r.name)));expect(report.originals.work.models).toEqual(work.models.filter(m=>report.originals.work.programs.some(r=>r.model===m.name)));expect(report.originals.work.seedEncoding).toBe('Byte0 is the declared seed; bytes1..31 are zero');expect(report.originals.work.models.every(m=>m.initialState.length>4)).toBe(true);
},600000);
it('rejects altered WORK program, model, seed and expected native hashes',async()=>{
 for(const job of jobs)for(const change of [{seed:job.seed+1},{law:'c6-k3-s0'},{name:'invented'},{expectedSaveHashes:job.expectedSaveHashes.map(()=> '0'.repeat(64))}])await expect(createBatchRun({...job,...change})).rejects.toThrow('frozen');
});
