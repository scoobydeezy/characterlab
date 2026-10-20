/** ordinary-memory-batch/0.1-candidate; authenticated operations and actual commit remain upstream. */
import {prepareSignificantFormationSettlement,prepareAgeOnlyFormationControl,prepareUseOnlyFormationControl,prepareSharedProtectionFormationControl,type SignificantFormationInput} from './significantFormationSettlement';
import {applyQualifiedSignificantUse,applyQualifiedSignificance,copySignificantMemory} from './directionalSignificanceState';
import type {ChildLoss} from './retentionFragmentation';
type Credits=Parameters<typeof applyQualifiedSignificance>[1];
export interface OrdinaryMemoryBatchInput extends SignificantFormationInput {
 readonly observer:string;readonly character:string;
 readonly useResults:readonly (readonly ChildLoss[])[];
 readonly significance:Credits;
}
export interface OrdinaryMemoryBatchResult {readonly opaque:'ordinary-memory-batch-result'}
export const prepareOrdinaryMemoryBatch=(input:OrdinaryMemoryBatchInput)=>prepare(input,prepareSignificantFormationSettlement);
export const prepareAgeOnlyMemoryBatchControl=(input:OrdinaryMemoryBatchInput)=>prepare(input,prepareAgeOnlyFormationControl);
export const prepareUseOnlyMemoryBatchControl=(input:OrdinaryMemoryBatchInput)=>prepare(input,prepareUseOnlyFormationControl);
export const prepareSharedProtectionMemoryBatchControl=(input:OrdinaryMemoryBatchInput)=>prepare(input,prepareSharedProtectionFormationControl);
function prepare(input:OrdinaryMemoryBatchInput,prepareFormation:typeof prepareSignificantFormationSettlement){
 const x=structuredClone(input),prior=copySignificantMemory(x.priorMemory,x.now);
 if(prior.some(a=>a.acquiredAt>=x.now))throw Error('MEMORY_BATCH_PRIOR_INSTANT');
 if(!Array.isArray(x.useResults)||x.useResults.length>64||Array.from({length:x.useResults.length},(_,i)=>Object.hasOwn(x.useResults,i)).some(v=>!v))throw Error('MEMORY_BATCH_USE_BOUND');
 // Validate each actual result independently, then combine the binary operation.
 let credited=prior;
 for(const use of x.useResults){applyQualifiedSignificantUse(prior,use,x.now);credited=applyQualifiedSignificantUse(credited,use,x.now);}
 credited=applyQualifiedSignificance({observer:x.observer,character:x.character,memory:credited},x.significance,x.now);
 // Retention sees B0 metadata plus uncredited fresh children. Current credit cannot
 // rescue a child in this instant; it is overlaid only on actual surviving children.
 const formation=prepareFormation(x);
 let closed=false,resolved=false,finished=false;
 const results=new WeakMap<object,ReturnType<typeof formation.finish>>(),open=()=>{if(closed)throw Error('MEMORY_BATCH_CLOSED');};
 return Object.freeze({
  resolve():OrdinaryMemoryBatchResult{open();if(resolved)throw Error('MEMORY_BATCH_RESOLVED');resolved=true;
   const result=formation.finish(formation.resolveMemory());
   const memory=result.memory.map(a=>({...a,units:a.units.map(u=>{const old=credited.find(p=>p.id===a.id)?.units.find(v=>v.key===u.key);return old?{...u,useProtection:old.useProtection,outcomeSignificanceDirections:[...old.outcomeSignificanceDirections]}:u;})}));
   const token=Object.freeze({opaque:'ordinary-memory-batch-result' as const});results.set(token,{memory:copySignificantMemory(memory,x.now),protocol:result.protocol});return token;
  },
  finish(token:OrdinaryMemoryBatchResult){open();const result=results.get(token);if(!result||finished)throw Error('MEMORY_BATCH_RESULT');finished=true;results.delete(token);return structuredClone(result);},
  close(){closed=true;formation.close();}
 });
}
