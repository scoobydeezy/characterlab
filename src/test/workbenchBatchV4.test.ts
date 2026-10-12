import {expect,it} from 'vitest';
import {BatchSession} from '../workbench/batchSession';
import {createBatchRun,type BatchJob} from '../workbench/experimentRegistry';
import {batchReport} from '../workbench/BatchWorkbench';
import catalog from '../workbench/batchCatalogV4.json';
const jobs=['decision/1/continued','commit/1/main'].map(id=>catalog.jobs.find(j=>j.id===id)! as BatchJob);
it('executes new public seams and exports exact originals for each selected law',async()=>{
 const batch=new BatchSession(jobs);await batch.run();const s=batch.snapshot();expect(s.status).toBe('complete');expect(s.results.map(r=>r.prefixes.length)).toEqual([4,7]);expect(s.results.every(r=>r.prefixes.every(p=>p.matchesFrozenSave))).toBe(true);
 const r=batchReport(s);expect(r.originals.decision.runs.map(x=>`${x.law}/${x.name}`)).toEqual(['1/continued']);expect(r.originals.commit.runs.map(x=>`${x.law}/${x.name}`)).toEqual(['1/main']);expect(r.originals.commit.runSeed).toBe('07'.repeat(32));expect(r.originals.decision.initialState).toBe(r.originals.commit.initialState);
},600000);
it('rejects altered original metadata for both new routes',async()=>{
 for(const job of jobs){await expect(createBatchRun({...job,seed:job.seed+1})).rejects.toThrow('frozen');await expect(createBatchRun({...job,law:99})).rejects.toThrow('frozen');await expect(createBatchRun({...job,name:'invented'})).rejects.toThrow('frozen');}
});
