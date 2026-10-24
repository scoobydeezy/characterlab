import {batchExecutionBoundary,type BoundaryDeclaration} from './batchExecutionBoundary';

export function BatchExecutionBoundaryCell({job}:{job:BoundaryDeclaration}){
 const boundary=batchExecutionBoundary(job);
 return <div data-batch-execution-kind={boundary.kind}><strong>{boundary.label}</strong>
  <small>{boundary.step}. {boundary.clock==='unavailable'?'Scheduler clock unavailable.':'Native scheduler clock.'}</small>
  <small>{boundary.qualification}</small></div>;
}
