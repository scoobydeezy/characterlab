export type BatchExecutionKind='public-run'|'composed-component'|'fixed-scheduler-harness';
export interface BoundaryDeclaration {experimentId:string;executionKind?:string;}
export interface BatchExecutionBoundary {
 kind:BatchExecutionKind;label:string;step:string;clock:'native'|'unavailable';qualification:string;
}

/** Diagnostic transport classification never upgrades the underlying execution contract. */
export function batchExecutionBoundary(job:BoundaryDeclaration):BatchExecutionBoundary{
 if(job.experimentId==='bio'){
  if(job.executionKind!=='composed-component')throw Error('BIO requires its frozen component execution boundary');
  return {kind:'composed-component',label:'BIO composed components',step:'One original component step',clock:'unavailable',
   qualification:'No scheduler clock or public factory admission. Early, probe, nondecision and contrary seeds retain their original routing.'};
 }
 if(job.experimentId==='sem'){
  if(job.executionKind!=='fixed-scheduler-harness')throw Error('SEM requires its frozen fixed-harness execution boundary');
  return {kind:'fixed-scheduler-harness',label:'SEM fixed scheduler harness',step:'One original observer instant',clock:'native',
   qualification:'Native clock; no campaign factory admission. The original ordered-input commitment is empty; the fixed schedule is inserted incrementally.'};
 }
 if(job.executionKind!==undefined)throw Error('Unexpected execution boundary on a public-run declaration');
 return {kind:'public-run',label:'Public run',step:'One complete native instant',clock:'native',
  qualification:'The named public run contract and original program determine execution.'};
}

export function validBatchClock(job:BoundaryDeclaration,clock:unknown):boolean{
 const boundary=batchExecutionBoundary(job);
 return boundary.clock==='unavailable'?clock===null:typeof clock==='string'&&clock.length<=80;
}
