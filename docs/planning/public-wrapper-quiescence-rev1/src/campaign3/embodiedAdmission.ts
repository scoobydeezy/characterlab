/** embodied-source-admission/0.1-candidate and embodied-pressure-admission/0.1-candidate.
 * Private original/child capabilities. None of these functions is a public run surface. */
import {canonicalEncode as enc,list,set,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createRunIdentity,type StructuralIdentity} from '../substrate/identity';
import {scheduledEventValue} from '../substrate/persistence';
import {simInstant} from '../substrate/time';
import {SchedulerContractError,type ScheduledEvent} from '../substrate/scheduler';
import {dataItems as items,dataRecord as rec,dataField as f,dataIdentity as id,dataKey as key,dataText as str} from '../campaign2/canonicalData';
import {decodeEmbodied as decode,embodiedRecord} from './embodiedCodecs';
import {receivingInputFacts,type ReceivingInputCompilation} from './receivingInputs';
declare const originalBrand:unique symbol;
export interface EmbodiedInputCompilation{readonly [originalBrand]:true;}
declare const tokenBrand:unique symbol;
export interface EmbodiedAdmittedInput{readonly [tokenBrand]:true;}
type Original={events:ScheduledEvent[];runIdentity:StructuralIdentity<'RunIdentity'>;inputBytes:Uint8Array};
const originals=new WeakMap<object,Original>();
const facts=new WeakMap<object,{event:ScheduledEvent;registration:Uint8Array;active:()=>boolean}>();
function fail(message:string):never{throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);}
export async function compileEmbodiedInputs(orderedBytes:Uint8Array,initialBytes:Uint8Array,model:StructuralIdentity<'ModelIdentity'>,seed:Uint8Array):Promise<EmbodiedInputCompilation>{
 const ordered=decode(orderedBytes),initial=decode(initialBytes),modelSnapshot=structuredClone(model),seedSnapshot=new Uint8Array(seed),seen=new Set<string>();
 const events=items(ordered,'list').map((row,index):ScheduledEvent=>{
  const fields=items(row,'list');if(fields.length!==5)fail('five-position EMB input required');const [time,phase,eventType,payload,dependencies]=fields;
  if(typeof time==='boolean'||time.kind!=='signed'||time.value<=0n||time.value>9223372036854775807n||typeof phase==='boolean'||phase.kind!=='unsigned')fail('input time/phase domain');
  const event=id(eventType),name=str(event.payload);if(event.namespaceId!==1001n||!['event/embodied-level-sample','event/embodied-reserve-replenishment'].includes(name))fail('unadmitted original event');
  const sample=name==='event/embodied-level-sample';if((phase as {value:bigint}).value!==(sample?10n:110n)||key(dependencies)!==key(list([])))fail('input phase/dependency mismatch');
  const input=rec(payload,sample?459n:478n);
  if(sample){const observer=id(f(input,1n)),definition=id(f(input,2n));if(observer.namespaceId!==1000n||str(observer.payload)!=='observer/embodied-subject'||definition.namespaceId!==1027n||str(definition.payload)!=='definition/embodied-level-channel')fail('source observer/channel outside model');const k=String((time as {value:bigint}).value);if(seen.has(k))fail('duplicate same-instant sampling');seen.add(k);}
  else{const definition=id(f(input,1n));if(definition.namespaceId!==1027n||!['definition/embodied-delivery-30','definition/embodied-delivery-5','definition/embodied-delivery-60'].includes(str(definition.payload)))fail('unadmitted delivery definition');}
  return {eventId:BigInt(index),eventSequence:BigInt(index),dueAt:simInstant((time as {value:bigint}).value),phase:(phase as {value:bigint}).value,eventTypeId:event,payload,dependencies,causalParentEventIds:[]};
 });
 const runIdentity=await createRunIdentity({modelIdentity:modelSnapshot,initialState:await commitManifest(initial),orderedInputSequence:await commitManifest(ordered),runSeed:seedSnapshot});
 const token=Object.freeze({}) as EmbodiedInputCompilation;originals.set(token,{events:structuredClone(events),runIdentity,inputBytes:enc(ordered)});return token;
}
export function embodiedInputFacts(compilation:EmbodiedInputCompilation){const o=originals.get(compilation);if(!o)return fail('not a compiled original input sequence');return {events:structuredClone(o.events),runIdentity:structuredClone(o.runIdentity),inputBytes:o.inputBytes.slice()};}
export function embodiedAdmittedInputFacts(token:EmbodiedAdmittedInput){const v=facts.get(token);if(!v||!v.active())return fail('missing or expired EMB admission');return {event:structuredClone(v.event),registration:v.registration.slice(),payload:structuredClone(v.event.payload)};}
export function beginEmbodiedIngress(compilation:EmbodiedInputCompilation,instant:bigint,sourceRegistration:Uint8Array,presentRegistration:Uint8Array,unavailableRegistration:Uint8Array){
 const original=originals.get(compilation);if(!original)fail('uncompiled input source');
 return beginBodyIngress(original!.events,instant,sourceRegistration,presentRegistration,unavailableRegistration);
}
/** Reuse the exact body/SEM authority with authenticated receiving originals.
 * Preserve their allocated coordinates and full receiving RunIdentity. */
export function beginReceivingBodyIngress(compilation:ReceivingInputCompilation,instant:bigint,sourceRegistration:Uint8Array,presentRegistration:Uint8Array,unavailableRegistration:Uint8Array){
 const original=receivingInputFacts(compilation);
 return beginBodyIngress(original.events.filter(e=>['event/embodied-level-sample','event/embodied-reserve-replenishment'].includes(str(e.eventTypeId.payload))),instant,sourceRegistration,presentRegistration,unavailableRegistration);
}
function beginBodyIngress(events:readonly ScheduledEvent[],instant:bigint,sourceRegistration:Uint8Array,presentRegistration:Uint8Array,unavailableRegistration:Uint8Array){
 const registrations=[sourceRegistration,presentRegistration,unavailableRegistration].map(b=>b.slice());let active=true;
 const bound=new Map<bigint,ScheduledEvent>(),used=new Set<bigint>(),started=new Set<bigint>(),finished=new Set<bigint>();
 const pending=new Map<bigint,{root:bigint;sample:CanonicalValue;carrier:CanonicalValue;phase:bigint;settled:boolean}>();
 for(const e of events.filter(e=>e.dueAt===instant))bound.set(e.eventId,structuredClone(e));
 function authenticate(event:ScheduledEvent){const expected=bound.get(event.eventId);if(!active||event.dueAt!==instant||used.has(event.eventId)||!expected||key(scheduledEventValue(expected))!==key(scheduledEventValue(event)))fail('event not the exact live admitted original/child');used.add(event.eventId);}
 function issue(event:ScheduledEvent,registration:Uint8Array){const token=Object.freeze({}) as EmbodiedAdmittedInput;facts.set(token,{event:structuredClone(event),registration:registration.slice(),active:()=>active});return token;}
 return Object.freeze({
  admitSource(event:ScheduledEvent){authenticate(event);if(event.phase!==10n||event.causalParentEventIds.length)fail('not an original sampling opportunity');started.add(event.eventId);return issue(event,registrations[0]);},
  admitDelivery(event:ScheduledEvent){authenticate(event);if(event.phase!==110n||event.causalParentEventIds.length)fail('not an original delivery');},
  sampleProduced(event:ScheduledEvent,sample:CanonicalValue,carrier:CanonicalValue){if(!active||!started.has(event.eventId)||pending.has(event.eventId)||!used.has(event.eventId)||key(scheduledEventValue(bound.get(event.eventId)!))!==key(scheduledEventValue(event)))fail('duplicate/unstarted sample');
   const safe=decode(enc(sample)),container=rec(decode(enc(carrier)),482n),s=rec(safe,(safe as {schema:{typeId:bigint}}).schema.typeId);
   if(![461n,463n].includes(s.schema.typeId)||key(f(container,2n))!==key(s)||key(f(s,2n))!==key(f(rec(event.payload,459n),1n))||(f(s,4n) as {value:bigint}).value!==event.dueAt)fail('sample/carrier differs from source');
   pending.set(event.eventId,{root:event.eventId,sample:s,carrier:container,phase:10n,settled:false});},
  bindChild(parent:ScheduledEvent,child:ScheduledEvent){function fail(message:string):never{throw new SchedulerContractError('TRANSITION_INGRESS_VIOLATION',message);}const p=pending.get(parent.eventId);if(!active||!p||bound.has(child.eventId)||!used.has(parent.eventId)||key(scheduledEventValue(bound.get(parent.eventId)!))!==key(scheduledEventValue(parent)))fail('missing parent or reused child');
   const next=({10:11n,11:12n,12:13n,13:14n,14:60n} as Record<number,bigint>)[Number(p.phase)];
   const present=(p.sample as {schema:{typeId:bigint}}).schema.typeId===461n;
   const name=({11:'tracking-slot',12:'binding-slot',13:'classification-slot',14:'settlement',60:present?'pressure-present':'pressure-unavailable'} as Record<number,string>)[Number(next)];
   const expectedName=next===60n?'event/embodied-'+name:'event/embodied-level-'+name;
   if(!next||child.phase!==next||child.dueAt!==instant||str(child.eventTypeId.payload)!==expectedName||child.eventTypeId.namespaceId!==1001n||key(child.payload)!==key(next===60n?p.sample:p.carrier)||key(child.dependencies)!==key(list([]))||child.causalParentEventIds.length!==1||child.causalParentEventIds[0]!==parent.eventId||child.eventSequence<=parent.eventSequence||next===60n&&!p.settled)fail('wrong allocated child topology/payload');
   pending.delete(parent.eventId);pending.set(child.eventId,{...p,phase:next});bound.set(child.eventId,structuredClone(child));
  },
  admitInternal(event:ScheduledEvent){authenticate(event);const p=pending.get(event.eventId);if(!p||![11n,12n,13n,14n].includes(event.phase)||p.phase!==event.phase)fail('not live internal slot');return {sample:decode(enc(p.sample)),carrier:decode(enc(p.carrier))};},
  settled(event:ScheduledEvent,experience?:CanonicalValue){const p=pending.get(event.eventId);if(!active||!p||p.phase!==14n||p.settled||!used.has(event.eventId)||key(scheduledEventValue(bound.get(event.eventId)!))!==key(scheduledEventValue(event)))fail('duplicate or wrong settlement');const sample=rec(p.sample,(p.sample as {schema:{typeId:bigint}}).schema.typeId);
   if(sample.schema.typeId===461n){if(!experience)fail('present sample requires SEM');const x=rec(experience!,227n),carrier=rec(p.carrier,482n);if(key(f(x,1n))!==key(f(carrier,3n))||key(f(x,2n))!==key(f(sample,2n))||(f(x,3n) as {value:bigint}).value!==(f(sample,4n) as {value:bigint}).value)fail('SEM envelope differs from reservation/sample');
    for(const n of [4n,5n,6n,7n])if(key(f(x,n))!==key(set([])))fail('support-only SEM contains unrelated semantic work');
    if(key(f(x,8n))!==key(set([embodiedRecord(216,[f(sample,2n),f(sample,1n)])]))||str(f(x,9n))!=='semantic-binding/0.1-candidate#SEM-001H')fail('SEM support/version mismatch');
   }
   else if(experience!==undefined)fail('unavailable sample cannot settle SEM');p.settled=true;
  },
  admitPressure(event:ScheduledEvent){authenticate(event);const p=pending.get(event.eventId);if(!p||p.phase!==60n||!p.settled)fail('pressure lacks settled source');return issue(event,registrations[(p.sample as {schema:{typeId:bigint}}).schema.typeId===461n?1:2]);},
  completePressure(event:ScheduledEvent){const p=pending.get(event.eventId);if(!active||!p||!used.has(event.eventId)||p.phase!==60n||key(scheduledEventValue(bound.get(event.eventId)!))!==key(scheduledEventValue(event)))fail('unexecuted pressure');finished.add(p.root);pending.delete(event.eventId);},
  finish(){if(pending.size||started.size!==finished.size||[...bound.keys()].some(k=>!used.has(k)))fail('incomplete EMB instant');active=false;},
  abort(){active=false;pending.clear();bound.clear();},
 });
}
