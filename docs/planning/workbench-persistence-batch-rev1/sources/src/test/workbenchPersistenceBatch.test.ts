import {expect,it} from 'vitest';
import {createPersistenceBatchRun,type PersistenceBatchJob} from '../workbench/persistenceBatch';
import catalog from '../workbench/batchCatalogV11.json';
const jobs=catalog.jobs.filter(j=>j.experimentId==='adapt'||j.experimentId==='det') as PersistenceBatchJob[];
it('rejects altered persistence declarations before native execution',async()=>{
 for(const job of jobs){
  for(const change of [{seed:255},{seedHex:'00'.repeat(32)},{law:'invented'},{name:'invented'},
   {numeric:1},{appraisal:'invented'},{expectedSaveHashes:['0'.repeat(64)]}])
   await expect(createPersistenceBatchRun({...job,...change})).rejects.toThrow('frozen');
 }
});
it('executes all four original programs with detached views and stable terminal no-ops',async()=>{
 for(const job of jobs){
  const run=await createPersistenceBatchRun(job);
  for(const [i,hash]of job.expectedSaveHashes.entries()){
   const view=run.view();expect(view.prefix).toBe(i);expect(view.total).toBe(job.expectedSaveHashes.length-1);
   expect(view.saveHash).toBe(hash);expect(view.complete).toBe(i===view.total);
   view.prefix=999;expect(run.view().prefix).toBe(i);
   const terminal=run.view();expect(await run.advance()).toBe(i<view.total);
   if(i===view.total)expect(run.view()).toEqual(terminal);
  }
 }
},600000);
