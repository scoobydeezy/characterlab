import {expect,it} from 'vitest';
import {BatchSession,BATCH_LIMITS} from '../workbench/batchSession';
import {createBatchRun,type BatchJob} from '../workbench/experimentRegistry';
import {batchReport} from '../workbench/BatchWorkbench';
import catalog from '../workbench/batchCatalogV9.json';
import previous from '../workbench/batchCatalogV8.json';
import freeze from '../../docs/planning/campaign3-general-attention-model-rev2/FREEZE.json';
const jobs=catalog.jobs.filter(j=>j.experimentId==='general') as BatchJob[];
it('retains V8 and admits each original General recipe exactly once',()=>{
  expect(catalog.jobs.slice(0,947)).toEqual(previous.jobs);
  expect(catalog.jobs).toHaveLength(990);expect(BATCH_LIMITS.jobs).toBe(990);
  expect(jobs.map(j=>j.name)).toEqual(freeze.models.map(m=>m.name));
  expect(jobs.reduce((n,j)=>n+j.expectedSaveHashes.length,0)).toBe(568);
  expect(jobs.every(j=>j.seedHex===freeze.seed)).toBe(true);
});
it('rejects altered seed, model, calendar commitment and declaration before execution',async()=>{
  const job=jobs[0];
  for(const change of [{seed:1},{seedHex:'00'.repeat(32)},{seedHex:undefined},{law:'invented'},
    {name:'invented'},{numeric:1},{appraisal:'invented'},{expectedSaveHashes:['0'.repeat(64)]}])
    await expect(createBatchRun({...job,...change})).rejects.toThrow('frozen');
  expect(()=>new BatchSession([{...job,seedHex:'bad'}])).toThrow();
  await expect(createBatchRun({...previous.jobs[0],seedHex:freeze.seed} as BatchJob)).rejects.toThrow('only admitted');
});
it('executes a complete original General calendar and exports its exact seed and originals',async()=>{
  const job=jobs.find(j=>j.name==='baseline')!,batch=new BatchSession([job]);
  await batch.run();const snapshot=batch.snapshot();expect(snapshot.status).toBe('complete');
  expect(snapshot.results[0].prefixes.map(p=>p.saveHash)).toEqual(job.expectedSaveHashes);
  const report=batchReport(snapshot);
  expect(report.originals.general.programs).toEqual(catalog.general.programs.filter(p=>p.name===job.name));
  expect(report.originals.general.programs[0].runSeed).toBe(freeze.seed);
},600000);
