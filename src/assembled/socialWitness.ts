/** Passive observers in the shared character composition; no scheduler or factory. */
import {list,text,signed,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {validateSemanticReferent} from '../substrate/referentOrigin';
import {type AuthoritativeState,type StatePath,type ActualReadRecord,type StatePatch} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission,type EventHandlerContext} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataItems as items,dataKey as key,dataField as f,dataUnsigned as uint,dataIdentity as id,dataText as txt,invalidModel} from '../campaign2/canonicalData';
import {receivingRecord as rec} from './codecs';
import {sid,pattern} from './skill';
import {PERSON_OWNER,personPath,personHistory,personMean,personUpdate} from './social';
import {qValue} from '../campaign2/cognitiveMath';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
import type {createCommunicationExecution} from './communicationExecution';
export const SW='assembled-social-witness/0.1',SW_OBS=SW+'/observation',SW_EVID=SW+'/evidence',SW_PROBE=SW+'/probe',SW_UPDATE=SW+'/update';
export const SW_SOURCE=sid(1001,'event/assembled-social-witness-source'),SW_MESSAGE=sid(1001,'event/assembled-social-witness-message'),SW_OBSERVE=sid(1001,'event/assembled-social-witness-observe'),SW_EVIDENCE=sid(1001,'event/assembled-social-witness-evidence'),SW_LEARN=sid(1001,'event/assembled-social-witness-learn'),SW_QUERY=sid(1001,'event/assembled-social-witness-query');
const kinds=[SW_SOURCE,SW_QUERY,SW_MESSAGE,SW_OBSERVE,SW_EVIDENCE,SW_LEARN],eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b),fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
const require=(b:boolean,s:string)=>{if(!b)invalidModel('social witness '+s);};
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','social witness: '+s);};
export function compileSocialWitness(v:CanonicalValue,recipients:readonly CanonicalValue[],tasks:readonly CanonicalValue[]){
 const a=items(v,'list');require(a.length===4&&txt(a[0])===SW&&tasks.some(t=>eq(t,a[1]))&&typeof a[2]==='boolean','declaration/task');
 const observers=items(a[3],'list').map((v,i)=>{const x=items(v,'list');require(x.length===3&&!!recipients[i]&&eq(x[0],recipients[i]),'observer mapping');validateSemanticReferent(x[1]);validateSemanticReferent(x[2]);return {observer:x[0],holder:x[1],target:x[2]};});
 require(observers.length===2&&new Set(observers.flatMap(o=>[key(o.holder),key(o.target)])).size===4,'distinct local identities');
 const main=f(rec(a[1],371n),1n);require(observers.every(o=>!eq(o.holder,main)&&!eq(o.target,main)),'private target identity');
 return {task:a[1],reverse:a[2]===true,observers};
}
export type SocialWitness=ReturnType<typeof compileSocialWitness>;
export function socialWitnessSource(v:CanonicalValue,s:SocialWitness){
 const a=items(v,'list');require(a.length===7&&eq(a[0],s.task)&&[1n,2n].includes(uint(a[1]))&&uint(a[2])<=4n&&uint(a[3])<=8n&&a.slice(4).every(x=>typeof x==='boolean'),'source/declared proposition');
 return {task:a[0],kind:uint(a[1]),mode:uint(a[2]),receipt:uint(a[3]),delivered:a[4]===true,access:[a[5]===true,a[6]===true]};
}
export function socialObserverView(outputs:readonly CanonicalValue[],s:SocialWitness,index:number){
 require(Number.isInteger(index)&&index>=0&&index<2,'view selector');const o=s.observers[index];
 return list([text(SW+'/view'),o.observer,o.target,list(outputs.filter(v=>{
  if(typeof v==='boolean'||v.kind!=='list'||!v.items.length)return false;const a=v.items;
  if(eq(a[0],text(SW_PROBE)))return eq(a[2],o.holder);
  if([SW_OBS,SW_EVID,SW_UPDATE].some(t=>eq(a[0],text(t))))return eq(items(a[1],'list')[1],o.holder);
  return false;
 }))]);
}
export function createSocialWitness(C:CanonicalValue,s:SocialWitness,stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],firstOccurrence:bigint,model:CanonicalValue,run:CanonicalValue){
 let active=false,at=0n,used=false,unbound=0,setting:ReturnType<typeof socialWitnessSource>|undefined,occurrences:CanonicalValue[]=[];
 const pending=new Set<string>(),receipts=new Map<string,boolean|undefined>(),order=s.reverse?[1,0]:[0,1],own=(e:ScheduledEvent)=>kinds.some(k=>eq(k,e.eventTypeId));
 const read=(state:AuthoritativeState,p:StatePath)=>{const v=stateModel.read(state,p);return {...v,record:{accessorId:sid(1028,'accessor/social-witness'),path:p,presence:v.presence,value:v.value,derivedSources:[]} as ActualReadRecord};};
 const trace=(e:ScheduledEvent,outputs:CanonicalValue[],children:readonly ScheduledEvent[],reads:ActualReadRecord[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[],sources:CanonicalValue[]=[])=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event:e,seamId:sid(1036,'seam/assembled-social-witness'),seamVersion:SW,recordKind:e.eventTypeId,subjectIds:[id(C)],sourceRecordIds:sources.map(id),registeredReadDomain:reads.map(r=>pattern(r.path)),actualReadRecords:reads,inputProjection:e.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});
 const emit=(phase:bigint,eventTypeId:ReturnType<typeof sid>,payload:CanonicalValue):EventEmission=>({dueAt:at as ScheduledEvent['dueAt'],phase,eventTypeId,payload,dependencies:list([])});
 function admit(e:ScheduledEvent,p:bigint){if(!active||e.dueAt!==at||e.phase!==p||!pending.delete(fp(e)))fail('unbound generated event');}
 function selected(payload:CanonicalValue){
  const xs=items(payload,'list');if(xs.length!==2)fail('recipient slots');
  return order.flatMap(i=>{const a=items(xs[i],'list');if(!a.length)return [];if(a.length!==1)fail('observation option');
   const o=items(a[0],'list'),h=s.observers[i];if(o.length!==8||!eq(o[0],occurrences[i])||!eq(o[1],h.holder)||!eq(o[2],h.target)||!eq(o[3],signed(at)))fail('observation association');return [a[0]];
  });
 }
 return {extend(base:ReturnType<typeof createCommunicationExecution>){return {...base,
 eventTypes:()=>[...base.eventTypes(),...kinds],isLearning:(e:ScheduledEvent)=>eq(e.eventTypeId,SW_LEARN)||base.isLearning(e),
 begin(t:bigint){base.begin(t);active=true;at=t;used=false;unbound=0;setting=undefined;occurrences=[];pending.clear();},
 close(){base.close();active=false;pending.clear();setting=undefined;occurrences=[];unbound=0;},
 prepareCommit(){base.prepareCommit();if(!active||pending.size||unbound||originals.some(e=>e.dueAt===at)&&!used)fail('unfinished instant');},
 execute(context:EventHandlerContext<AuthoritativeState>){
  const e=context.event;if(!own(e))return base.execute(context);let outputs:CanonicalValue[]=[],emissions:EventEmission[]=[],reads:ActualReadRecord[]=[],sources:CanonicalValue[]=[];
  if(eq(e.eventTypeId,SW_SOURCE)){
   const index=originals.findIndex(o=>fp(o)===fp(e));if(!active||used||e.phase!==30n||e.dueAt!==at||index<0)fail('unbound source');
   used=true;setting=socialWitnessSource(e.payload,s);occurrences=s.observers.map((_,i)=>typedIdentifier(1115,u(firstOccurrence+BigInt(2*index+i))));emissions=[emit(40n,SW_QUERY,list([])),emit(110n,SW_MESSAGE,list([]))];
  }else if(eq(e.eventTypeId,SW_QUERY)){
   admit(e,40n);outputs=order.map(i=>{const o=s.observers[i],prior=read(context.state,personPath(o.holder,o.target));reads.push(prior.record);const mean=personMean(prior.value);return list([text(SW_PROBE),signed(at),o.holder,mean?qValue(mean):list([]),prior.value??list([])]);});
  }else if(eq(e.eventTypeId,SW_MESSAGE)){
   admit(e,110n);const prior=read(context.state,{rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:s.task}]}),truth=prior.presence&&uint(f(rec(prior.value!,372n),1n))===1n;
   reads=[prior.record];const x=setting!,claim=x.mode===0n?undefined:x.mode===1n?truth:x.mode===2n?!truth:x.mode===3n,receipt=x.kind+'/'+x.receipt;
   if(x.receipt){if(receipts.has(receipt)&&receipts.get(receipt)!==claim)fail('receipt changed');receipts.set(receipt,claim);}
   outputs=[list([text(SW+'/truth'),signed(at),s.task,truth,x.delivered])];
   emissions=[emit(120n,SW_OBSERVE,list(s.observers.map((o,i)=>list(x.access[i]&&claim!==undefined?[list([occurrences[i],o.holder,o.target,signed(at),u(x.kind),u(x.receipt),list([claim]),list([x.delivered])])]:[]))))];
  }else if(eq(e.eventTypeId,SW_OBSERVE)||eq(e.eventTypeId,SW_EVIDENCE)){
   const observe=eq(e.eventTypeId,SW_OBSERVE);admit(e,observe?120n:130n);const obs=selected(e.payload);
   outputs=obs.map(o=>list([text(observe?SW_OBS:SW_EVID),o]));sources=obs.map(o=>items(o,'list')[0]);emissions=[emit(observe?130n:140n,observe?SW_EVIDENCE:SW_LEARN,e.payload)];
  }else fail('learning requires prepared stage');
  let bound=false;unbound++;return {nextState:context.state,outputs,emittedEvents:emissions,traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){
   if(!active||bound||children.length!==emissions.length)fail('child lifecycle');
   for(const [i,c]of children.entries()){const expected={...emissions[i],eventId:c.eventId,eventSequence:c.eventSequence,causalParentEventIds:[e.eventId]};if(c.eventId===e.eventId||c.eventSequence<=e.eventSequence||fp(c)!==fp(expected)||pending.has(fp(c)))fail('child binding');pending.add(fp(c));}
   bound=true;unbound--;return [trace(e,outputs,children,reads,{operations:[]},[],sources)];
  }};
 },
 prepare(events:readonly ScheduledEvent[],B0:AuthoritativeState){
  const ownEvents=events.filter(e=>eq(e.eventTypeId,SW_LEARN));if(!ownEvents.length)return base.prepare(events,B0);if(ownEvents.length!==1)fail('learning multiplicity');
  const e=ownEvents[0];admit(e,140n);const obs=selected(e.payload),others=events.filter(x=>x!==e),prior=others.length?base.prepare(others,B0):undefined,reads:ActualReadRecord[]=[],updates:CanonicalValue[]=[],ops:StatePatch['operations'][number][]=[];
  for(const o of obs){const a=items(o,'list'),p=personPath(a[1],a[2]),old=read(B0,p),next=personUpdate(old.value,o);reads.push(old.record);updates.push(list([text(SW_UPDATE),o,next??list([])]));if(next!==old.value)ops.push({kind:'set',path:p,expected:old.presence?{presence:true,value:old.value!}:{presence:false},newValue:next!});}
  const patch:StatePatch={operations:ops};let cursor=0,finished=false,rows:CanonicalValue[]=[];
  return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=events.length||fp(context.event)!==fp(events[cursor++]))fail('stage order');return eq(context.event.eventTypeId,SW_LEARN)?{nextState:B0,outputs:updates,emittedEvents:[],traceContributions:[]}:prior!.execute(context);},
   finish(state:AuthoritativeState){if(finished||cursor!==events.length)fail('incomplete stage');finished=true;const next=prior?prior.finish(state):state,result=stateModel.applyPatch(next,patch,PERSON_OWNER,{writableRoots:[810n],targetPaths:ops.map(o=>o.path)});rows=[...(prior?.traces()??[]),trace(e,updates,[],reads,patch,result.diffs,obs.map(o=>items(o,'list')[0]))];return result.state;},
   traces(){if(!finished)fail('trace before finish');return events.flatMap(e=>rows.filter(t=>uint(f(rec(f(rec(t,160n),4n),130n),1n))===e.eventId));}};
 }
 };}};
}
