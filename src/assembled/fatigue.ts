/** assembled-character-fatigue/0.1-candidate: sensor -> journal -> shared control. */
import {list,text,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {type AuthoritativeState,type StatePath,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission,type EventHandlerContext} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {simInstant} from '../substrate/time';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataIdentity as id,dataKey as key,dataField as f,dataRecord as rec,invalidModel} from '../campaign2/canonicalData';
import {sid,pattern} from './skill';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
import type {createControlExecution} from './controlExecution';
export const FATIGUE='assembled-fatigue/0.1',FATIGUE_OBSERVATION='assembled-fatigue-observation/0.1',FATIGUE_CONTROL='assembled-fatigue-control/0.1',FATIGUE_VERSION='assembled-character-fatigue/0.1-candidate';
export const FATIGUE_SOURCE=sid(1001,'event/assembled-fatigue-source'),FATIGUE_OBSERVE=sid(1001,'event/assembled-fatigue-observe'),FATIGUE_LEARN=sid(1001,'event/assembled-fatigue-learn'),FATIGUE_OWNER=sid(1025,'authority/fatigue-experience');
export type FatigueLaw='SevereThreshold'|'NoFatigue'|'AnyFatigue';
export const fatiguePath=(C:CanonicalValue):StatePath=>({rootStateTypeId:1351n,fieldId:1n,selectors:[{kind:'mapKey',key:C}]});
const require=(b:boolean,s:string)=>{if(!b)invalidModel('fatigue '+s);};
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','fatigue: '+s);};
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b),fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
export function compileFatigue(v:CanonicalValue):FatigueLaw{const a=items(v,'list');require(a.length===2&&txt(a[0])===FATIGUE&&['SevereThreshold','NoFatigue','AnyFatigue'].includes(txt(a[1])),'declaration');return txt(a[1]) as FatigueLaw;}
export function fatigueSource(v:CanonicalValue){const a=items(v,'list');require(a.length===5&&txt(a[0])===FATIGUE&&uint(a[1])<=2n&&uint(a[2])<=3n&&typeof a[3]==='boolean'&&typeof a[4]==='boolean','source');return {physical:uint(a[1]),display:uint(a[2]),visible:a[3]===true,recipient:a[4]===true};}
export function fatigueGrade(s:ReturnType<typeof fatigueSource>):bigint|undefined{return s.visible&&s.recipient?(s.display===0n?s.physical:s.display-1n):undefined;}
export function fatigueObservation(v:CanonicalValue,C:CanonicalValue){const a=items(v,'list');require(a.length===5&&txt(a[0])===FATIGUE_OBSERVATION&&id(a[1]).namespaceId===1164n&&eq(a[2],C)&&uint(a[3])>=1n&&uint(a[3])<=100n,'observation');uint(id(a[1]).payload);const g=items(a[4],'list');require(g.length<=1&&(!g.length||uint(g[0])<=2n),'optional grade');return {at:uint(a[3]),occurrence:key(a[1]),grade:g.length?uint(g[0]):undefined};}
export function fatigueJournal(v:CanonicalValue|undefined,C:CanonicalValue){if(v===undefined)return [];const a=items(v,'list');require(a.length===2&&txt(a[0])===FATIGUE,'journal');const rows=items(a[1],'list');require(rows.length>=1&&rows.length<=16,'journal count');let at=0n;const seen=new Set<string>();for(const v of rows){const o=fatigueObservation(v,C);require(o.grade!==undefined&&o.at>at&&!seen.has(o.occurrence),'journal order/identity');at=o.at;seen.add(o.occurrence);}return rows;}
export function fatigueCondition(v:CanonicalValue|undefined,C:CanonicalValue,law:FatigueLaw){const rows=fatigueJournal(v,C),last=rows.at(-1),grade=last?fatigueObservation(last,C).grade:undefined,known=grade!==undefined,impaired=known&&(law==='SevereThreshold'&&grade===2n||law==='AnyFatigue'&&grade!>=1n);return {known,grade,impaired,report:list([text(FATIGUE_CONTROL),known,list(known?[unsigned(grade!)]:[]),impaired,v??list([])])};}
export function createFatigueExecution(C:CanonicalValue,stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue){
 const path=fatiguePath(C),pending=new Set<string>(),used=new Set<bigint>();let active=false,at=0n,unbound=0,observation:CanonicalValue|undefined;
 const own=(e:ScheduledEvent)=>[FATIGUE_SOURCE,FATIGUE_OBSERVE,FATIGUE_LEARN].some(t=>eq(t,e.eventTypeId));
 const learning=(e:ScheduledEvent)=>eq(e.eventTypeId,FATIGUE_LEARN);
 function trace(event:ScheduledEvent,outputs:CanonicalValue[],children:readonly ScheduledEvent[],reads:ActualReadRecord[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[]){return traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:sid(1036,'seam/assembled-fatigue'),seamVersion:FATIGUE_VERSION,recordKind:event.eventTypeId,subjectIds:[id(C)],sourceRecordIds:learning(event)&&observation?[id(items(observation,'list')[1])]:[],registeredReadDomain:reads.map(x=>pattern(x.path)),actualReadRecords:reads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});}
 function admit(e:ScheduledEvent,phase:bigint){if(!active||e.dueAt!==at||e.phase!==phase||!pending.delete(fp(e)))fail('unauthenticated child');}
 function execute(context:EventHandlerContext<AuthoritativeState>){const {event,state}=context;let outputs:CanonicalValue[]=[],phase:bigint,eventTypeId:ReturnType<typeof sid>,payload:CanonicalValue;
  if(eq(event.eventTypeId,FATIGUE_SOURCE)){if(!active||event.phase!==30n||event.dueAt!==at||used.size||!originals.some(e=>fp(e)===fp(event)))fail('unauthenticated source');used.add(event.eventId);const grade=fatigueGrade(fatigueSource(event.payload));phase=120n;eventTypeId=FATIGUE_OBSERVE;payload=list(grade===undefined?[]:[unsigned(grade)]);}
  else if(eq(event.eventTypeId,FATIGUE_OBSERVE)){admit(event,120n);if(observation)fail('duplicate observation');observation=list([text(FATIGUE_OBSERVATION),typedIdentifier(1164,unsigned(context.allocateRuntimeId())),C,unsigned(at),event.payload]);fatigueObservation(observation!,C);outputs=[observation];phase=140n;eventTypeId=FATIGUE_LEARN;payload=observation;}
  else return fail('learning requires prepared stage');
  const emissions:EventEmission[]=[{dueAt:simInstant(at),phase,eventTypeId,payload,dependencies:list([])}];let bound=false;unbound++;
  return {nextState:state,outputs,emittedEvents:emissions,traceContributions:[],traceFactory(xs:readonly ScheduledEvent[]){if(!active||bound||xs.length!==1)fail('child lifecycle');const e=xs[0],expected={...emissions[0],eventId:e.eventId,eventSequence:e.eventSequence,causalParentEventIds:[event.eventId]};if(e.eventId===event.eventId||e.eventSequence<=event.eventSequence||fp(e)!==fp(expected)||pending.has(fp(e)))fail('child mismatch');pending.add(fp(e));bound=true;unbound--;return [trace(event,outputs,xs)];}};
 }
 return {extend(base:ReturnType<typeof createControlExecution>){return {...base,eventTypes:()=>[...base.eventTypes(),FATIGUE_SOURCE,FATIGUE_OBSERVE,FATIGUE_LEARN],isLearning:(e:ScheduledEvent)=>learning(e)||base.isLearning(e),
 begin(instant:bigint){base.begin(instant);if(active)fail('already active');active=true;at=instant;pending.clear();used.clear();unbound=0;observation=undefined;},
 close(){base.close();active=false;pending.clear();used.clear();unbound=0;observation=undefined;},
 prepareCommit(){base.prepareCommit();if(!active||pending.size||unbound||originals.some(e=>e.dueAt===at&&!used.has(e.eventId)))fail('unfinished instant');},
 execute(context:EventHandlerContext<AuthoritativeState>){return own(context.event)?execute(context):base.execute(context);},
 prepare(events:readonly ScheduledEvent[],B0:AuthoritativeState){
  const ownEvents=events.filter(learning),others=events.filter(e=>!learning(e)),core=others.length?base.prepare(others,B0):undefined;if(ownEvents.length>1)fail('learning multiplicity');
  const event=ownEvents[0],prior=event?stateModel.read(B0,path):undefined;let patch:StatePatch={operations:[]},report:CanonicalValue|undefined;const reads:ActualReadRecord[]=[];
  if(event){admit(event,140n);if(!observation||!eq(event.payload,observation))fail('observation association');const rows=fatigueJournal(prior!.value,C),o=fatigueObservation(observation!,C);const next=o.grade===undefined?prior!.value:list([text(FATIGUE),list([...rows,observation!])]);if(o.grade!==undefined)patch={operations:[{kind:'set',path,expected:prior!.presence?{presence:true,value:prior!.value!}:{presence:false},newValue:next!}]};reads.push({accessorId:sid(1028,'accessor/fatigue-experience'),path,presence:prior!.presence,value:prior!.value,derivedSources:[]});report=list([text(FATIGUE),observation!,prior!.value??list([]),next??list([]),o.grade!==undefined]);}
  let cursor=0,finished=false,rows:CanonicalValue[]=[];return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=events.length||fp(events[cursor++])!==fp(context.event))fail('stage order');return learning(context.event)?{nextState:B0,outputs:[report!],emittedEvents:[],traceContributions:[]}:core!.execute(context);},
  finish(state:AuthoritativeState){if(finished||cursor!==events.length)fail('incomplete stage');finished=true;let next=core?core.finish(state):state;rows=core?[...core.traces()]:[];if(event){const applied=patch.operations.length?stateModel.applyPatch(next,patch,FATIGUE_OWNER,{writableRoots:[1351n],targetPaths:[path]}):{state:next,diffs:[]};next=applied.state;rows.push(trace(event,[report!],[],reads,patch,applied.diffs));}return next;},
  traces(){if(!finished)fail('trace before finish');return events.flatMap(e=>rows.filter(row=>key(f(rec(f(rec(row,160n),4n),130n),1n))===key(unsigned(e.eventId))));}};
 }
 };}};
}
