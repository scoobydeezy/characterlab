/** Controlled truthful witnesses inside the one communication stage. */
import {list,text,signed,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath,type ActualReadRecord,type StatePatch} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission,type EventHandlerContext} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataItems as items,dataKey as key,dataField as f,dataUnsigned as uint,dataIdentity as id,dataText as txt,invalidModel} from '../campaign2/canonicalData';
import {receivingRecord as rec} from './codecs';
import {sid,pattern} from './skill';
import {KNOWLEDGE_OWNER} from './communication';
import type {createCommunicationExecution} from './communicationExecution';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const WITNESS='assembled-commitment-witness/0.1',WPROBE=WITNESS+'/probe',WOBS=WITNESS+'/observation',WEVID=WITNESS+'/evidence',WUPDATE=WITNESS+'/update';
export const W_SOURCE=sid(1001,'event/assembled-commitment-witness-source'),W_PROBE=sid(1001,'event/assembled-commitment-witness-probe'),W_MESSAGE=sid(1001,'event/assembled-commitment-witness-message'),W_OBSERVE=sid(1001,'event/assembled-commitment-witness-observe'),W_EVIDENCE=sid(1001,'event/assembled-commitment-witness-evidence'),W_LEARN=sid(1001,'event/assembled-commitment-witness-learn');
const kinds=[W_SOURCE,W_PROBE,W_MESSAGE,W_OBSERVE,W_EVIDENCE,W_LEARN],eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b),fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','commitment witness: '+s);};
export const witnessPath=(holder:CanonicalValue,task:CanonicalValue):StatePath=>({rootStateTypeId:1072n,fieldId:2n,selectors:[{kind:'mapKey',key:list([holder,task])}]});
export function witnessSetting(v:CanonicalValue,tasks:readonly CanonicalValue[]){const a=items(v,'list');if(a.length!==4||!tasks.some(t=>eq(t,a[0]))||a.slice(1).some(x=>typeof x!=='boolean'))invalidModel('commitment witness source');return {task:a[0],access:[a[1]===true,a[2]===true]};}
export function lifecycleMetadata(v:CanonicalValue|undefined){if(v===undefined)return list([u(0),u(0),u(0)]);const tag=uint(f(rec(v,372n),1n));if(tag===1n)return list([u(1),u(1),u(0)]);if(![2n,3n,4n].includes(tag))invalidModel('commitment witness status');return list([u(2),u(2),u(tag)]);}
export function validateWitness(v:CanonicalValue,p:StatePath){
 const a=items(v,'list'),target=p.selectors[0];if(a.length!==5||!target||target.kind!=='mapKey'||!eq(target.key,list([a[1],a[3]])))invalidModel('commitment witness target');
 const occ=id(a[0]),at=a[2];if(occ.namespaceId!==1168n||uint(occ.payload)===0n||typeof at==='boolean'||at.kind!=='signed'||at.value<1n||at.value>100n)invalidModel('commitment witness observation');
 const meta=items(a[4],'list');if(meta.length!==3||![[0,0,0],[1,1,0],[2,2,2],[2,2,3],[2,2,4]].some(xs=>eq(list(xs.map(u)),a[4])))invalidModel('commitment witness metadata');
}
export function commitmentObserverView(outputs:readonly CanonicalValue[],recipients:readonly CanonicalValue[],index:number){
 if(!Number.isInteger(index)||index<0||index>=2||recipients.length!==2)invalidModel('commitment observer index');
 return outputs.filter(v=>{if(typeof v==='boolean'||v.kind!=='list'||!v.items.length||typeof v.items[0]==='boolean'||v.items[0].kind!=='text')return false;const a=v.items,tag=txt(a[0]);if(tag===WPROBE)return a.length===4&&eq(a[2],recipients[index]);return [WOBS,WEVID,WUPDATE].includes(tag)&&a.length===2&&eq(items(a[1],'list')[1],recipients[index]);});
}
export function createCommitmentWitness(C:CanonicalValue,tasks:readonly CanonicalValue[],recipients:readonly CanonicalValue[],stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue){
 let active=false,at=0n,used=false,unbound=0,setting:ReturnType<typeof witnessSetting>|undefined,occurrences:CanonicalValue[]=[];
 const pending=new Set<string>(),own=(e:ScheduledEvent)=>kinds.some(k=>eq(k,e.eventTypeId));
 const read=(s:AuthoritativeState,p:StatePath)=>{const v=stateModel.read(s,p);return {...v,record:{accessorId:sid(1028,'accessor/commitment-witness'),path:p,presence:v.presence,value:v.value,derivedSources:[]} as ActualReadRecord};};
 function trace(e:ScheduledEvent,outputs:CanonicalValue[],children:readonly ScheduledEvent[],reads:ActualReadRecord[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[],sources:CanonicalValue[]=[]){return traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event:e,seamId:sid(1036,'seam/assembled-commitment-witness'),seamVersion:WITNESS,recordKind:e.eventTypeId,subjectIds:[id(C)],sourceRecordIds:sources.map(id),registeredReadDomain:reads.map(r=>pattern(r.path)),actualReadRecords:reads,inputProjection:e.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});}
 const emit=(phase:bigint,eventTypeId:ReturnType<typeof sid>,payload:CanonicalValue):EventEmission=>({dueAt:at as ScheduledEvent['dueAt'],phase,eventTypeId,payload,dependencies:list([])});
 function admit(e:ScheduledEvent,phase:bigint){if(!active||e.dueAt!==at||e.phase!==phase||!pending.delete(fp(e)))fail('unbound generated event');}
 function selected(payload:CanonicalValue){const xs=items(payload,'list');if(xs.length!==2)fail('recipient slots');return xs.flatMap((v,i)=>{const a=items(v,'list');if(!a.length)return [];if(a.length!==1)fail('observation option');validateWitness(a[0],witnessPath(recipients[i],setting!.task));const obs=items(a[0],'list');if(!eq(obs[0],occurrences[i])||!eq(obs[2],signed(at)))fail('observation binding');return [a[0]];});}
 return {extend(base:ReturnType<typeof createCommunicationExecution>){return {...base,
 eventTypes:()=>[...base.eventTypes(),...kinds],isLearning:(e:ScheduledEvent)=>eq(e.eventTypeId,W_LEARN)||base.isLearning(e),
 begin(t:bigint){base.begin(t);active=true;at=t;used=false;unbound=0;setting=undefined;occurrences=[];pending.clear();},
 close(){base.close();active=false;pending.clear();setting=undefined;occurrences=[];unbound=0;},
 prepareCommit(){base.prepareCommit();if(!active||pending.size||unbound||originals.some(e=>e.dueAt===at)&&!used)fail('unfinished instant');},
 execute(context:EventHandlerContext<AuthoritativeState>){
  const e=context.event;if(!own(e))return base.execute(context);let outputs:CanonicalValue[]=[],emissions:EventEmission[]=[],reads:ActualReadRecord[]=[],sources:CanonicalValue[]=[];
  if(eq(e.eventTypeId,W_SOURCE)){if(!active||used||e.phase!==30n||e.dueAt!==at||!originals.some(o=>fp(o)===fp(e)))fail('unbound source');used=true;setting=witnessSetting(e.payload,tasks);occurrences=recipients.map(()=>typedIdentifier(1168,u(context.allocateRuntimeId())));emissions=[emit(40n,W_PROBE,list([])),emit(110n,W_MESSAGE,list([]))];}
  else if(eq(e.eventTypeId,W_PROBE)){admit(e,40n);outputs=recipients.map(h=>{const known=tasks.flatMap(t=>{const v=read(context.state,witnessPath(h,t));reads.push(v.record);return v.presence?[v.value!]:[];});return list([text(WPROBE),signed(at),h,list(known)]);});}
  else if(eq(e.eventTypeId,W_MESSAGE)){admit(e,110n);const prior=read(context.state,{rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:setting!.task}]}),meta=lifecycleMetadata(prior.value);reads=[prior.record];outputs=[list([text(WITNESS+'/truth'),signed(at),setting!.task,meta])];emissions=[emit(120n,W_OBSERVE,list(recipients.map((h,i)=>list(setting!.access[i]?[list([occurrences[i],h,signed(at),setting!.task,meta])]:[]))))];}
  else if(eq(e.eventTypeId,W_OBSERVE)||eq(e.eventTypeId,W_EVIDENCE)){const observe=eq(e.eventTypeId,W_OBSERVE);admit(e,observe?120n:130n);const obs=selected(e.payload);outputs=obs.map(o=>list([text(observe?WOBS:WEVID),o]));sources=obs.map(o=>items(o,'list')[0]);emissions=[emit(observe?130n:140n,observe?W_EVIDENCE:W_LEARN,e.payload)];}
  else fail('learning requires prepared stage');
  let bound=false;unbound++;return {nextState:context.state,outputs,emittedEvents:emissions,traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){if(!active||bound||children.length!==emissions.length)fail('child lifecycle');for(const [i,c]of children.entries()){const expected={...emissions[i],eventId:c.eventId,eventSequence:c.eventSequence,causalParentEventIds:[e.eventId]};if(c.eventId===e.eventId||c.eventSequence<=e.eventSequence||fp(c)!==fp(expected)||pending.has(fp(c)))fail('child binding');pending.add(fp(c));}bound=true;unbound--;return [trace(e,outputs,children,reads,{operations:[]},[],sources)];}};
 },
 prepare(events:readonly ScheduledEvent[],B0:AuthoritativeState){
  const ownEvents=events.filter(e=>eq(e.eventTypeId,W_LEARN));if(!ownEvents.length)return base.prepare(events,B0);if(ownEvents.length!==1)fail('learning multiplicity');const e=ownEvents[0];admit(e,140n);const obs=selected(e.payload),others=events.filter(x=>x!==e),prior=others.length?base.prepare(others,B0):undefined,reads:ActualReadRecord[]=[],patch:StatePatch={operations:obs.map(o=>{const a=items(o,'list'),p=witnessPath(a[1],a[3]),old=read(B0,p);reads.push(old.record);return {kind:'set' as const,path:p,expected:old.presence?{presence:true as const,value:old.value!}:{presence:false as const},newValue:o};})};
  let cursor=0,finished=false,rows:CanonicalValue[]=[];
  return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=events.length||fp(context.event)!==fp(events[cursor++]))fail('stage order');return eq(context.event.eventTypeId,W_LEARN)?{nextState:B0,outputs:obs.map(o=>list([text(WUPDATE),o])),emittedEvents:[],traceContributions:[]}:prior!.execute(context);},
   finish(state:AuthoritativeState){if(finished||cursor!==events.length)fail('incomplete stage');finished=true;const next=prior?prior.finish(state):state,result=stateModel.applyPatch(next,patch,KNOWLEDGE_OWNER,{writableRoots:[1072n],targetPaths:patch.operations.map(o=>o.path)});rows=[...(prior?.traces()??[]),trace(e,obs.map(o=>list([text(WUPDATE),o])),[],reads,patch,result.diffs,obs.map(o=>items(o,'list')[0]))];return result.state;},
   traces(){if(!finished)fail('trace before finish');return events.flatMap(e=>rows.filter(v=>uint(f(rec(f(rec(v,160n),4n),130n),1n))===e.eventId));}};
 }
 };}};
}
