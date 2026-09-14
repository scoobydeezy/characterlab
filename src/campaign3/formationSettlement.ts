/** formation-settlement-component/0.1-candidate. Internal trusted transaction composition. */
import {retainByRecency,type TimedAcquisition} from './recencyRetention';
import {extendFormationSourceDomain} from './formationSourceDomain';
import {reconcileFormationGovernance,type FormationSource,type FormationCommit} from './formationGovernance';
import {validateFormationProtocolTransition,type FormationProtocolValue} from './formationProtocolTransition';
import type {RetentionKind} from './retentionFragmentation';
export interface FormationSettlementInput {
 readonly priorProtocol:FormationProtocolValue;readonly priorMemory:readonly TimedAcquisition[];
 readonly incoming:readonly FormationSource[];readonly formed:readonly FormationCommit[];
 readonly freshMemory:readonly TimedAcquisition[];readonly now:bigint;readonly sourceLimit:number;
 readonly capacity:Readonly<Record<RetentionKind,number>>;
}
export interface FormationOwnerResult {readonly opaque:'formation-owner-result'}
export function prepareFormationSettlement(input:FormationSettlementInput){
 const x=structuredClone(input),domain=extendFormationSourceDomain(x.priorProtocol.domain,x.incoming,x.sourceLimit);
 // Validation precedes new enrollment: current admissions cannot repair bad B0.
 validateFormationProtocolTransition(x.priorProtocol,[],[],x.priorMemory.map(a=>a.id),x.now,x.sourceLimit,x.priorProtocol);
 const priorIds=new Set(x.priorMemory.map(a=>a.id));
 if(priorIds.size!==x.priorMemory.length||x.priorProtocol.successes.filter(e=>!e.completeLoss).length!==priorIds.size)throw Error('FORMATION_OWNER_PRIOR_COVERAGE');
 for(const a of x.priorMemory){const row=x.priorProtocol.successes.find(e=>e.acquisition===a.id);if(!row||row.kind!==a.kind||row.formedAt!==a.acquiredAt)throw Error('FORMATION_OWNER_PRIOR_BINDING');}
 if(x.freshMemory.length!==x.formed.length)throw Error('FORMATION_OWNER_FRESH_COVERAGE');
 for(const a of x.freshMemory){const row=x.formed.find(e=>e.acquisition===a.id);if(!row||row.kind!==a.kind||row.formedAt!==a.acquiredAt)throw Error('FORMATION_OWNER_FRESH_BINDING');}
 // Reject replay/duplicate success before computing retention. This does not
 // authenticate the upstream formation carrier; the caller is trusted here.
 reconcileFormationGovernance(domain,x.priorProtocol.successes,x.formed,[...x.priorMemory,...x.freshMemory].map(a=>a.id),x.now);
 let closed=false,resolved=false,consumed=false;
 const results=new WeakMap<object,{memory:TimedAcquisition[];survivors:bigint[]}>();
 const requireOpen=()=>{if(closed)throw Error('FORMATION_OWNER_CLOSED');};
 return Object.freeze({
  resolveMemory():FormationOwnerResult{requireOpen();if(resolved)throw Error('FORMATION_OWNER_ALREADY_RESOLVED');
   const result=retainByRecency([...x.priorMemory,...x.freshMemory],x.now,x.capacity);
   const token=Object.freeze({opaque:'formation-owner-result' as const});results.set(token,{memory:result.acquisitions,survivors:result.acquisitions.map(a=>a.id)});resolved=true;return token;
  },
  finish(token:FormationOwnerResult){requireOpen();const result=results.get(token);if(!result||consumed)throw Error('FORMATION_OWNER_RESULT_BINDING');
   const protocol={domain,successes:reconcileFormationGovernance(domain,x.priorProtocol.successes,x.formed,result.survivors,x.now)};
   validateFormationProtocolTransition(x.priorProtocol,x.incoming,x.formed,result.survivors,x.now,x.sourceLimit,protocol);
   consumed=true;results.delete(token);return {memory:structuredClone(result.memory),protocol};
  },
  close(){closed=true;}
 });
}
