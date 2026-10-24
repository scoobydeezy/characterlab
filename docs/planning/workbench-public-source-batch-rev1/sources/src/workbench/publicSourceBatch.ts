import type {BatchJob,InspectableBatchRun} from './experimentRegistry';
import catalog from './batchCatalogV10.json';

export type PublicSourceBatchJob=Omit<BatchJob,'experimentId'>&{experimentId:'body'|'multisource'};

/** Prepared common transport for original public source calendars; no component ownership execution. */
export async function createPublicSourceBatchRun(job:PublicSourceBatchJob):Promise<InspectableBatchRun>{
  const frozen=catalog.jobs.find(j=>j.id===job.id) as PublicSourceBatchJob|undefined;
  if(!frozen||!['body','multisource'].includes(job.experimentId)||
    (['experimentId','name','law','seed','seedHex','appraisal','numeric','expectedSaveHashes'] as const)
      .some(k=>JSON.stringify(frozen[k])!==JSON.stringify(job[k])))throw Error('Batch job differs from frozen public-source declaration');
  const run=job.experimentId==='body'
    ?await (await import('./bodyAdapter')).BodyWorkbenchRun.create(job.name)
    :await (await import('./multisourceAdapter')).MultisourceWorkbenchRun.create(job.name);
  return {advance:()=>run.advance(),view:()=>{
    const {prefix,complete,clock,modelHash,runHash,stateHash,saveHash}=run.snapshot();
    return {prefix,total:frozen.expectedSaveHashes.length-1,complete,clock,modelHash,runHash,stateHash,saveHash};
  }};
}
