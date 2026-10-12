import {expect,it} from 'vitest';
import {BatchSession} from '../workbench/batchSession';
import {createBatchRun,type BatchJob} from '../workbench/experimentRegistry';
import {batchReport} from '../workbench/BatchWorkbench';
import catalog from '../workbench/batchCatalogV3.json';
const jobs=['belief/misleading-law-1','affect/baseline','affect/interior/candidate-3-feedback-true'].map(id=>catalog.jobs.find(j=>j.id===id)! as BatchJob);
it('executes BELIEF, main AFFECT and supplementary roles with complete original exports',async()=>{
 const batch=new BatchSession(jobs);await batch.run();const s=batch.snapshot();expect(s.status).toBe('complete');expect(s.results.every(r=>r.prefixes.every(p=>p.matchesFrozenSave))).toBe(true);
 const report=batchReport(s);expect(report.originals.belief.runs.map(r=>r.name)).toEqual(['misleading-law-1']);expect(report.originals.belief.runSeed).toBe('07'.repeat(32));expect(report.originals.affect.runs.map(r=>r.name)).toEqual(['baseline']);expect(report.originals.affect.supplementaryRuns.map(r=>r.id)).toEqual(['interior/candidate-3-feedback-true']);expect(report.originals.affect.models.length).toBe(2);
},600000);
it('rejects mismatched frozen metadata before native creation',async()=>{
 for(const job of jobs){await expect(createBatchRun({...job,seed:job.seed+1})).rejects.toThrow('frozen');await expect(createBatchRun({...job,law:'invented'})).rejects.toThrow('frozen');await expect(createBatchRun({...job,expectedSaveHashes:['0'.repeat(64),...job.expectedSaveHashes.slice(1)]})).rejects.toThrow('frozen');}
});
