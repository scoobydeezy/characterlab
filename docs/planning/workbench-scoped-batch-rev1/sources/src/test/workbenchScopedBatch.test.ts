import {expect,it} from 'vitest';
import {createScopedBatchRun,type ScopedBatchJob} from '../workbench/scopedBatch';
import catalog from '../workbench/batchCatalogV12.json';
const jobs=catalog.jobs.slice(1072) as ScopedBatchJob[];
it('rejects incorrect boundary,seed and program declarations before execution',async()=>{
 for(const id of ['bio','sem']){
  const job=jobs.find(j=>j.experimentId===id)!;
  for(const change of [{executionKind:undefined},{executionKind:id==='bio'?'fixed-scheduler-harness':'composed-component'},
   {seedHex:undefined},{seedHex:'0d'.repeat(32)},{seed:255},{name:'invented'},{law:'invented'},{numeric:1},{appraisal:'invented'}])
   await expect(createScopedBatchRun({...job,...change} as ScopedBatchJob)).rejects.toThrow('frozen');
 }
});
it('preserves absent component clock and genuine harness clock with detached native views',async()=>{
 for(const id of ['bio','sem']){
  const job=jobs.find(j=>j.experimentId===id)!,run=await createScopedBatchRun(job),initial=run.view();
  expect(initial.saveHash).toBe(job.expectedSaveHashes[0]);expect(initial.clock).toBe(id==='bio'?null:'0');
  initial.prefix=999;expect(run.view().prefix).toBe(0);expect(await run.advance()).toBe(true);
  expect(run.view().clock).toBe(id==='bio'?null:'1');expect(run.view().saveHash).toBe(job.expectedSaveHashes[1]);
 }
},600000);
