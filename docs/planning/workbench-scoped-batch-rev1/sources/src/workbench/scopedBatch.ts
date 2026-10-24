import type {BatchJob,BatchRunView} from './experimentRegistry';
import catalog from './batchCatalogV12.json';

export type ScopedBatchJob=Omit<BatchJob,'experimentId'>&{experimentId:'bio'|'sem';executionKind:'composed-component'|'fixed-scheduler-harness';seedHex:string};
export type ScopedBatchView=Omit<BatchRunView,'clock'>&{clock:string|null};
export interface ScopedBatchRun {advance():Promise<boolean>;view():ScopedBatchView;}

/** Prepared transport keeps component clock absence separate from scheduler time. */
export async function createScopedBatchRun(job:ScopedBatchJob):Promise<ScopedBatchRun>{
 const frozen=catalog.jobs.find(j=>j.id===job.id) as ScopedBatchJob|undefined;
 if(!frozen||!['bio','sem'].includes(job.experimentId)||
  (['experimentId','name','law','seed','seedHex','executionKind','numeric','appraisal','expectedSaveHashes'] as const)
   .some(k=>JSON.stringify(frozen[k])!==JSON.stringify(job[k])))throw Error('Batch job differs from frozen scoped-execution declaration');
 if(job.experimentId==='bio'){
  const run=await (await import('./bioAdapter')).BioWorkbenchRun.create(job.name);
  return {advance:()=>run.advance(),view:()=>{const {prefix,complete,modelHash,runHash,stateHash,saveHash}=run.snapshot();return {prefix,total:frozen.expectedSaveHashes.length-1,complete,clock:null,modelHash,runHash,stateHash,saveHash};}};
 }
 const run=await (await import('./semAdapter')).SemWorkbenchRun.create();
 return {advance:()=>run.advance(),view:()=>{const {prefix,complete,clock,modelHash,runHash,stateHash,saveHash}=run.snapshot();return {prefix,total:frozen.expectedSaveHashes.length-1,complete,clock,modelHash,runHash,stateHash,saveHash};}};
}
