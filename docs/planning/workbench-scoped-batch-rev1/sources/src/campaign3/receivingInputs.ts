/** embodied-receiving-ordered-input/0.1-candidate.
 * Original pairs and private deadline origin; no generated record is public input. */
import {canonicalEncode as enc,list,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createRunIdentity,type StructuralIdentity} from '../substrate/identity';
import {simInstant} from '../substrate/time';
import {SchedulerContractError,type ScheduledEvent} from '../substrate/scheduler';
import {decodeReceiving as decode} from './receivingCodecs';
import {dataField as f,dataIdentity as id,dataKey as key,dataText as str} from '../campaign2/canonicalData';
declare const inputBrand:unique symbol;
export interface ReceivingInputCompilation {readonly [inputBrand]:true;}
type Facts={events:ScheduledEvent[];runIdentity:StructuralIdentity<'RunIdentity'>;inputBytes:Uint8Array;suppliedCount:number};
const compiled=new WeakMap<object,Facts>();
function fail(message:string):never {throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);}
function values(v:CanonicalValue){if(typeof v==='boolean'||v.kind!=='list')return fail('ordered input requires lists');return v.items;}
function record(v:CanonicalValue,type:bigint){if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==type||v.schema.schemaVersion!==1n)return fail('original record schema');return v;}
const atom=(ns:number,s:string)=>typedIdentifier(ns,text(s));
export async function compileReceivingInputs(inputBytes:Uint8Array,initialBytes:Uint8Array,model:StructuralIdentity<'ModelIdentity'>,seed:Uint8Array,taskKey:CanonicalValue):Promise<ReceivingInputCompilation>{
 const ordered=decode(inputBytes),initial=decode(initialBytes),task=record(decode(enc(taskKey)),371n),modelSnapshot=structuredClone(model),seedSnapshot=seed.slice();
 const rows=values(ordered);if(rows.length>100)fail('at most100 supplied originals');
 const pairs=new Map<bigint,{sample:number;workspace:number}>(),seen=new Set<string>();
 const events=rows.map((row,index):ScheduledEvent=>{
  const fields=values(row);if(fields.length!==5)fail('five input positions');const [time,phase,eventType,payload,dependencies]=fields;
  if(typeof time==='boolean'||time.kind!=='signed'||time.value<1n||time.value>100n||typeof phase==='boolean'||phase.kind!=='unsigned')fail('bounded original time/phase');
  if(typeof eventType==='boolean'||eventType.kind!=='typedIdentifier'||eventType.namespaceId!==1001n||typeof eventType.payload==='boolean'||eventType.payload.kind!=='text')fail('event identity');
  const name=eventType.payload.value,sample=name==='event/embodied-level-sample',workspace=name==='event/embodied-receiving-workspace',delivery=name==='event/embodied-reserve-replenishment';
  if(!sample&&!workspace&&!delivery)fail('generated/unadmitted original event');
  if(phase.value!==(sample?10n:workspace?40n:110n)||key(dependencies)!==key(list([])))fail('phase/dependency mismatch');
  const value=record(payload,sample?459n:workspace?377n:478n);
  if(sample||workspace){if(key(f(value,1n))!==key(atom(1000,'observer/embodied-subject'))||key(f(value,2n))!==key(atom(1027,sample?'definition/embodied-level-channel':'definition/task-workspace')))fail('original observer/definition');
   const pair=pairs.get(time.value)??{sample:0,workspace:0};pair[sample?'sample':'workspace']++;pairs.set(time.value,pair);
  }else{const definition=id(f(value,1n));if(definition.namespaceId!==1027n||!['definition/embodied-delivery-30','definition/embodied-delivery-5','definition/embodied-delivery-60'].includes(str(definition.payload)))fail('delivery vocabulary');}
  const fingerprint=key(row);if(seen.has(fingerprint))fail('duplicate complete original');seen.add(fingerprint);
  return {eventId:BigInt(index),eventSequence:BigInt(index),dueAt:simInstant(time.value),phase:phase.value,eventTypeId:eventType,payload:value,dependencies,causalParentEventIds:[]};
 });
 for(const pair of pairs.values())if(pair.sample!==1||pair.workspace!==1)fail('exact same-instant source pair required');
 const compare=(a:ScheduledEvent,b:ScheduledEvent)=>a.dueAt<b.dueAt?-1:a.dueAt>b.dueAt?1:a.phase<b.phase?-1:a.phase>b.phase?1:key(a.payload)<key(b.payload)?-1:key(a.payload)>key(b.payload)?1:0;
 if(events.some((event,index)=>index>0&&compare(events[index-1],event)>=0))fail('canonical original ordering required');
 const ordinal=BigInt(events.length);
 events.push({eventId:ordinal,eventSequence:ordinal,dueAt:simInstant(100n),phase:140n,eventTypeId:atom(1001,'event/task-deadline'),payload:task,dependencies:list([]),causalParentEventIds:[]});
 const runIdentity=await createRunIdentity({modelIdentity:modelSnapshot,initialState:await commitManifest(initial),orderedInputSequence:await commitManifest(ordered),runSeed:seedSnapshot});
 const token=Object.freeze({}) as ReceivingInputCompilation;compiled.set(token,{events:structuredClone(events),runIdentity,inputBytes:enc(ordered),suppliedCount:rows.length});return token;
}
export function receivingInputFacts(token:ReceivingInputCompilation){const facts=compiled.get(token);if(!facts)return fail('uncompiled receiving originals');return {events:structuredClone(facts.events),runIdentity:structuredClone(facts.runIdentity),inputBytes:facts.inputBytes.slice(),suppliedCount:facts.suppliedCount};}
