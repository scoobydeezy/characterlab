import {expect,it} from 'vitest';
import {BatchSession} from '../workbench/batchSession';
import {createBatchRun,type BatchJob} from '../workbench/experimentRegistry';
import catalog from '../workbench/batchCatalogV2.json';
import {batchReport} from '../workbench/BatchWorkbench';
it('executes EPI and LEARN with their own exact frozen profiles and originals',async()=>{
 const jobs=['epi','learn'].map(id=>catalog.jobs.find(j=>j.experimentId===id&&j.name==='zero'&&j.law===1)! as BatchJob);
 const batch=new BatchSession(jobs);await batch.run();expect(batch.snapshot().status).toBe('complete');
 const report=batchReport(batch.snapshot());expect(report.originals.epi).toHaveLength(1);expect(report.originals.learn).toHaveLength(1);
 expect(report.originals.epi[0].orderedInputs.length).toBeGreaterThan(0);
 await expect(createBatchRun({...jobs[0],seed:0})).rejects.toThrow('profile');
 await expect(createBatchRun({...jobs[1],numeric:3})).rejects.toThrow('profile');
},600000);
