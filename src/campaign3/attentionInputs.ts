/** attention-ordered-input/0.1-candidate: one original; generated stages never enter here. */
import {canonicalEncode as enc,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createRunIdentity} from '../substrate/identity';
import {simInstant} from '../substrate/time';
import {SchedulerContractError,type ScheduledEvent} from '../substrate/scheduler';
import {dataField as f,dataItems as items,dataRecord as rec,dataIdentity as id,dataText as text,dataKey as key,dataUnsigned as u} from '../campaign2/canonicalData';
import {decodeAttention as decode} from './attentionCodecs';
import type {AttentionCompiledModel} from './attentionModel';
export async function compileAttentionInputs(bytes:Uint8Array,initial:Uint8Array,seed:Uint8Array,model:AttentionCompiledModel){
 const fail=(why:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',why);};
 const value=decode(bytes),rows=items(value,'list');if(rows.length!==1)fail('exactly one attention original');const parts=items(rows[0],'list');if(parts.length!==5)fail('five original positions');
 const [at,phase,kind,payload,deps]=parts;if(typeof at==='boolean'||at.kind!=='signed'||at.value<=0n)fail('positive instant');if(u(phase)!==0n||id(kind).namespaceId!==1001n||text(id(kind).payload)!=='event/attention-world'||key(deps)!==key(list([])))fail('original kind/phase/dependencies');
 const p=rec(payload,517n);if(key(f(p,1n))!==key(at)||id(f(p,2n)).namespaceId!==1027n)fail('original inner/outer mismatch');const scene=model.definition(text(id(f(p,2n)).payload));rec(scene,516n);
 const time=simInstant((at as Extract<CanonicalValue,{kind:'signed'}>).value),event:ScheduledEvent={eventId:0n,eventSequence:0n,dueAt:time,phase:0n,eventTypeId:id(kind),payload:p,dependencies:deps,causalParentEventIds:[]};
 return Object.freeze({event:structuredClone(event),scene:decode(enc(scene)),runIdentity:await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initial)),orderedInputSequence:await commitManifest(value),runSeed:seed.slice()})});
}
export type AttentionInputs=Awaited<ReturnType<typeof compileAttentionInputs>>;
