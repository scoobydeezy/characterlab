import type {BatchJob,InspectableBatchRun} from './experimentRegistry';
import catalog from './batchCatalogV11.json';

export type PersistenceBatchJob=Omit<BatchJob,'experimentId'>&{experimentId:'adapt'|'det'};

/** Original public parent-pair/successor execution; other corpus controls remain separate. */
export async function createPersistenceBatchRun(job:PersistenceBatchJob):Promise<InspectableBatchRun>{
  const frozen=catalog.jobs.find(j=>j.id===job.id) as PersistenceBatchJob|undefined;
  if(!frozen||!['adapt','det'].includes(job.experimentId)||
    (['experimentId','name','law','seed','seedHex','appraisal','numeric','expectedSaveHashes'] as const)
      .some(k=>JSON.stringify(frozen[k])!==JSON.stringify(job[k])))throw Error('Batch job differs from frozen persistence declaration');
  const run=job.experimentId==='adapt'
    ?await (await import('./adaptAdapter')).AdaptWorkbenchRun.create(job.name)
    :await (await import('./detAdapter')).DetWorkbenchRun.create(job.name);
  return {advance:()=>run.advance(),view:()=>{
    const {prefix,complete,clock,modelHash,runHash,stateHash,saveHash}=run.snapshot();
    return {prefix,total:frozen.expectedSaveHashes.length-1,complete,clock,modelHash,runHash,stateHash,saveHash};
  }};
}
