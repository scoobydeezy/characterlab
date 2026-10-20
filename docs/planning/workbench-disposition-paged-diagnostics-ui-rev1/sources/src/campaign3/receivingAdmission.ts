/** embodied-receiving-admission/0.1-candidate. Instant-local graph authority.
 * Joins consume actual products from this invocation; records alone grant no authority. */
import {canonicalEncode as enc,list,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {scheduledEventValue} from '../substrate/persistence';
import {SchedulerContractError,type ScheduledEvent,type EventEmission} from '../substrate/scheduler';
import {dataField as f,dataRecord as rec,dataUnsigned as u,dataText as str,dataKey as key} from '../campaign2/canonicalData';
import {decodeReceiving as decode,receivingRecord as r} from './receivingCodecs';
import {receivingInputFacts,type ReceivingInputCompilation} from './receivingInputs';

declare const brand:unique symbol;
export interface ReceivingAdmittedInput {readonly [brand]:true;}
const facts=new WeakMap<object,{event:ScheduledEvent;registration:Uint8Array;active:()=>boolean}>();
function fail(message:string):never {throw new SchedulerContractError('TRANSITION_INGRESS_VIOLATION',message);}
export function receivingAdmittedInputFacts(token:ReceivingAdmittedInput){const v=facts.get(token);if(!v||!v.active())throw new SchedulerContractError('INPUT_NOT_ADMITTED','missing or expired receiving admission');return {event:structuredClone(v.event),payload:structuredClone(v.event.payload),registration:v.registration.slice()};}
const names=['workspace','appraisal','concern','task-motive','body-options','task-candidates','mixed-candidates','task-raw','mixed-raw','mixed-reasons','resolution','intent','expression','plan','attempt','execution'] as const;
const phases=[40,50,50,60,70,70,70,80,80,80,80,90,90,100,110,110];
const inputs=[377,381,384,388,464,394,491,398,498,499,504,508,509,509,512,513];
const outputs=[381,384,388,394,489,398,492,403,499,504,508,509,511,512,513,514];
const eventId=(name:string)=>typedIdentifier(1001,text('event/embodied-receiving-'+name));
export function beginReceivingIngress(compilation:ReceivingInputCompilation,instant:bigint,registrationBytes:readonly Uint8Array[]){
 const original=receivingInputFacts(compilation),registrations=new Map<string,Uint8Array>();
 for(const bytes of registrationBytes){const v=rec(decode(bytes),515n),index=Number(u(f(v,1n)))-1,name=names[index];if(!name||registrations.has(name)||key(f(v,4n))!==key(eventId(name))||u(f(v,5n))!==BigInt(phases[index])||u(f(rec(f(v,6n),254n),1n))!==BigInt(inputs[index]))fail('receiving registration stage mismatch');registrations.set(name,enc(v));}
 if(registrations.size!==16)fail('complete receiving registration graph required');
 let active=true;const bound=new Map<bigint,ScheduledEvent>(),used=new Set<bigint>(),completed=new Set<bigint>();
 const produced=new Map<string,{event:ScheduledEvent;output:CanonicalValue}>(),expected=new Map<bigint,EventEmission[]>();
 for(const e of original.events.filter(e=>e.dueAt===instant))bound.set(e.eventId,e);
 const exact=(a:CanonicalValue,b:CanonicalValue,message:string)=>{if(key(a)!==key(b))fail(message);};
 function authenticate(event:ScheduledEvent){const e=bound.get(event.eventId);if(!active||!e||used.has(event.eventId)||event.dueAt!==instant)fail('unbound/repeated receiving event');exact(scheduledEventValue(e),scheduledEventValue(event),'receiving event coordinates changed');used.add(event.eventId);}
 function current(event:ScheduledEvent){if(!active||!used.has(event.eventId)||completed.has(event.eventId))fail('unstarted/repeated production');exact(scheduledEventValue(bound.get(event.eventId)!),scheduledEventValue(event),'production source changed');}
 function get(name:string){const p=produced.get(name);if(!p)fail('join prerequisite has not actually completed: '+name);return p;}
 function child(event:ScheduledEvent,name:string,payload:CanonicalValue):EventEmission {const index=names.indexOf(name as typeof names[number]);if(index<0)fail('unknown child');return {dueAt:event.dueAt,phase:BigInt(phases[index]),eventTypeId:eventId(name),payload:decode(enc(payload)),dependencies:list([])};}
 return Object.freeze({
  admit(event:ScheduledEvent){authenticate(event);const name=str(event.eventTypeId.payload).replace('event/embodied-receiving-',''),bytes=registrations.get(name);if(!bytes)fail('not a receiving stage');const index=names.indexOf(name as typeof names[number]);rec(event.payload,BigInt(inputs[index]));const token=Object.freeze({}) as ReceivingAdmittedInput;facts.set(token,{event:structuredClone(event),registration:bytes.slice(),active:()=>active});return token;},
  admitBodyOrDeadline(event:ScheduledEvent){authenticate(event);if(registrations.has(str(event.eventTypeId.payload).replace('event/embodied-receiving-','')))fail('receiving stage bypass');},
  complete(event:ScheduledEvent,output:CanonicalValue){current(event);const name=str(event.eventTypeId.payload).replace('event/embodied-receiving-',''),index=names.indexOf(name as typeof names[number]);if(index<0)fail('not receiving production');const value=rec(decode(enc(output)),BigInt(outputs[index]));if(produced.has(name))fail('duplicate stage at one instant');
   let children:EventEmission[]=[];
   if(name==='task-candidates'){const body=get('body-options');children=[child(event,'task-raw',value),child(event,'mixed-candidates',r(491,[value,body.output]))];}
   else if(name==='task-raw'){const mixed=get('mixed-candidates');exact(f(rec(f(mixed.output as Extract<CanonicalValue,{kind:'record'}>,2n),491n),1n),f(value,2n),'mixed/task raw candidate source differs');children=[child(event,'mixed-raw',r(498,[mixed.output,value]))];}
   else if(name==='resolution'){if(u(f(rec(f(value,4n),507n),1n))===3n)children=[child(event,'intent',value)];}
   else if(name==='intent')children=[child(event,'expression',value),child(event,'plan',value)];
   else {const next:Record<string,string>={workspace:'appraisal',appraisal:'concern',concern:'task-motive','task-motive':'task-candidates','mixed-raw':'mixed-reasons','mixed-reasons':'resolution',plan:'attempt',attempt:'execution'};if(next[name])children=[child(event,next[name],value)];}
   produced.set(name,{event:structuredClone(event),output:value});completed.add(event.eventId);expected.set(event.eventId,children);return structuredClone(children);
  },
  completeBodyOrDeadline(event:ScheduledEvent,bodyChildren:readonly EventEmission[],pressure?:CanonicalValue){current(event);let children=[...bodyChildren];
   if(pressure!==undefined){if(!['event/embodied-pressure-present','event/embodied-pressure-unavailable'].includes(str(event.eventTypeId.payload))||children.length)fail('pressure source mismatch');children=[child(event,'body-options',rec(decode(enc(pressure)),464n))];}
   // The reused body ingress independently validates its 10..60 chain and SEM settlement.
   else if(![10n,11n,12n,13n,14n].includes(event.phase)&&children.length)fail('external delivery/deadline terminal');
   completed.add(event.eventId);expected.set(event.eventId,structuredClone(children));return structuredClone(children);
  },
  bindChildren(parent:ScheduledEvent,children:readonly ScheduledEvent[]){const wanted=expected.get(parent.eventId);if(!active||!wanted||wanted.length!==children.length)fail('wrong/repeated receiving child count');
   children.forEach((e,index)=>{const w=wanted[index];if(bound.has(e.eventId)||e.eventId<=parent.eventId||e.eventSequence<=parent.eventSequence||e.dueAt!==instant||e.phase!==w.phase||e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==parent.eventId)fail('child allocation/parent mismatch');exact(e.eventTypeId,w.eventTypeId,'child type');exact(e.payload,w.payload,'child payload');exact(e.dependencies,list([]),'child dependencies');bound.set(e.eventId,structuredClone(e));});expected.delete(parent.eventId);
  },
  finish(){if(!active||expected.size||bound.size!==used.size||used.size!==completed.size)fail('incomplete receiving instant');active=false;},
  abort(){active=false;bound.clear();produced.clear();expected.clear();},
 });
}
