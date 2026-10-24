import {expect,it} from 'vitest';
import {createPublicSourceBatchRun,type PublicSourceBatchJob} from '../workbench/publicSourceBatch';
import catalog from '../workbench/batchCatalogV10.json';
const jobs=catalog.jobs.filter(j=>j.experimentId==='body'||j.experimentId==='multisource') as PublicSourceBatchJob[];
it('rejects altered original source declarations before native execution',async()=>{
 for(const experimentId of ['body','multisource']){
  const job=jobs.find(j=>j.experimentId===experimentId)!;
  for(const change of [{seed:255},{seedHex:'00'.repeat(32)},{law:'invented'},{name:'invented'},
    {numeric:1},{appraisal:'invented'},{expectedSaveHashes:['0'.repeat(64)]}])
    await expect(createPublicSourceBatchRun({...job,...change})).rejects.toThrow('frozen');
 }
});
it('returns detached common views and authentic original initial boundaries',async()=>{
 for(const experimentId of ['body','multisource']){
  const job=jobs.find(j=>j.experimentId===experimentId)!,run=await createPublicSourceBatchRun(job);
  expect(run.view().saveHash).toBe(job.expectedSaveHashes[0]);
  const detached=run.view();detached.prefix=999;expect(run.view().prefix).toBe(0);
  expect(await run.advance()).toBe(true);expect(run.view().saveHash).toBe(job.expectedSaveHashes[1]);
 }
},600000);
