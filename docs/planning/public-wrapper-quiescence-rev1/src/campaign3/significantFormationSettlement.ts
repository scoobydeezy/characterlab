/** significant-formation-settlement/0.1-candidate; trusted owner/protocol composition. */
import type {FormationSettlementInput} from './formationSettlement';
import {copySignificantMemory,type SignificantAcquisition} from './directionalSignificanceState';
import {retainSignificanceFirst,retainSharedProtectionTier} from './significanceFirstRetention';
import {retainByRecency} from './recencyRetention';
import {retainWithUseProtection} from './useProtectedRetention';
import {extendFormationSourceDomain} from './formationSourceDomain';
import {reconcileFormationGovernance} from './formationGovernance';
import {validateFormationProtocolTransition} from './formationProtocolTransition';
export interface SignificantFormationInput extends Omit<FormationSettlementInput,'priorMemory'> {readonly priorMemory:readonly SignificantAcquisition[]}
export interface SignificantFormationResult {readonly opaque:'significant-formation-owner-result'}
type Retention=typeof retainSignificanceFirst;
// Controls change ranking only. Preserve ignored metadata on actual survivors.
type Control=(input:readonly SignificantAcquisition[],now:bigint,capacity:Parameters<Retention>[2])=>ReturnType<typeof retainByRecency>;
function liftControl(control:Control):Retention{
 return (input,now,capacity)=>{const result=control(input,now,capacity);return {...result,acquisitions:result.acquisitions.map(a=>({...a,units:a.units.map(u=>{const original=input.find(p=>p.id===a.id)!.units.find(p=>p.key===u.key)!;return {...u,useProtection:original.useProtection,outcomeSignificanceDirections:[...original.outcomeSignificanceDirections]};})}))};};
}
const ageOnly=liftControl(retainByRecency),useOnly=liftControl(retainWithUseProtection);
export const prepareSignificantFormationSettlement=(input:SignificantFormationInput)=>prepare(input,retainSignificanceFirst);
export const prepareAgeOnlyFormationControl=(input:SignificantFormationInput)=>prepare(input,ageOnly);
export const prepareUseOnlyFormationControl=(input:SignificantFormationInput)=>prepare(input,useOnly);
export const prepareSharedProtectionFormationControl=(input:SignificantFormationInput)=>prepare(input,retainSharedProtectionTier);
function prepare(input:SignificantFormationInput,retain:Retention){
 const x=structuredClone(input),prior=copySignificantMemory(x.priorMemory,x.now);
 validateFormationProtocolTransition(x.priorProtocol,[],[],prior.map(a=>a.id),x.now,x.sourceLimit,x.priorProtocol);
 const domain=extendFormationSourceDomain(x.priorProtocol.domain,x.incoming,x.sourceLimit);
 const priorIds=new Set(prior.map(a=>a.id));
 if(priorIds.size!==prior.length||x.priorProtocol.successes.filter(e=>!e.completeLoss).length!==priorIds.size)throw Error('SIGNIFICANT_FORMATION_PRIOR_COVERAGE');
 for(const a of prior){const row=x.priorProtocol.successes.find(e=>e.acquisition===a.id);if(!row||row.kind!==a.kind||row.formedAt!==a.acquiredAt)throw Error('SIGNIFICANT_FORMATION_PRIOR_BINDING');}
 if(x.freshMemory.length!==x.formed.length)throw Error('SIGNIFICANT_FORMATION_FRESH_COVERAGE');
 const fresh:SignificantAcquisition[]=x.freshMemory.map(a=>{const row=x.formed.find(e=>e.acquisition===a.id);if(!row||row.kind!==a.kind||row.formedAt!==a.acquiredAt)throw Error('SIGNIFICANT_FORMATION_FRESH_BINDING');return {...a,units:a.units.map(u=>{if(Object.hasOwn(u,'useProtection')||Object.hasOwn(u,'outcomeSignificanceDirections'))throw Error('SIGNIFICANT_FORMATION_FRESH_CREDIT');return {...u,useProtection:false,outcomeSignificanceDirections:[]};})};});
 reconcileFormationGovernance(domain,x.priorProtocol.successes,x.formed,[...prior,...fresh].map(a=>a.id),x.now);
 // Validate every fresh unit before exposing a resolvable owner operation.
 const combined=copySignificantMemory([...prior,...fresh],x.now);
 let closed=false,resolved=false,consumed=false;
 const results=new WeakMap<object,SignificantAcquisition[]>(),open=()=>{if(closed)throw Error('SIGNIFICANT_FORMATION_CLOSED');};
 return Object.freeze({
  resolveMemory():SignificantFormationResult{open();if(resolved)throw Error('SIGNIFICANT_FORMATION_ALREADY_RESOLVED');const result=retain(combined,x.now,x.capacity);const token=Object.freeze({opaque:'significant-formation-owner-result' as const});results.set(token,result.acquisitions);resolved=true;return token;},
  finish(token:SignificantFormationResult){open();const memory=results.get(token);if(!memory||consumed)throw Error('SIGNIFICANT_FORMATION_RESULT_BINDING');const survivors=memory.map(a=>a.id),protocol={domain,successes:reconcileFormationGovernance(domain,x.priorProtocol.successes,x.formed,survivors,x.now)};validateFormationProtocolTransition(x.priorProtocol,x.incoming,x.formed,survivors,x.now,x.sourceLimit,protocol);consumed=true;results.delete(token);return {memory:copySignificantMemory(memory,x.now),protocol};},
  close(){closed=true;}
 });
}
