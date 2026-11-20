/** Own causal evidence in the common knowledge authority; no scheduler or factory. */
import {list,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataKey as key,dataIdentity as id,dataUnsigned as uint,dataField as f,invalidModel} from '../campaign2/canonicalData';
import {traceRecordValue} from '../substrate/trace';
import {scheduledEventValue} from '../substrate/persistence';
import {SchedulerContractError,type ScheduledEvent,type EventEmission,type EventHandlerContext} from '../substrate/scheduler';
import type {AuthoritativeState,StatePath,ActualReadRecord,StatePatch} from '../substrate/state';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
import type {SocialWitness} from './socialWitness';
import {bodyId} from './bodyIdentifiers';
import {pattern} from './skill';
import {KNOWLEDGE_OWNER} from './strategy';
import {PERFORMANCE_OBSERVE} from './performance';
import {receivingRecord as rec} from './codecs';
import type {TimeLimit} from './timeDomain';
export const SK='stakeholder-knowledge/0.1',SK_OBS=SK+'/observation',SK_EVID=SK+'/evidence',SK_UPDATE=SK+'/update',SK_PROBE=SK+'/probe';
export const SK_QUERY=bodyId(1001,'event/stakeholder-query'),SK_REPORT=bodyId(1001,'event/stakeholder-report'),SK_EVIDENCE=bodyId(1001,'event/stakeholder-evidence'),SK_LEARN=bodyId(1001,'event/stakeholder-learn');
export const stakeholderEvents=[SK_QUERY,SK_REPORT,SK_EVIDENCE,SK_LEARN];
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b),fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
const require=(b:boolean,m:string)=>{if(!b)invalidModel('stakeholder knowledge '+m);};
type Observer=SocialWitness['observers'][number];
export const stakeholderPath=(o:Observer):StatePath=>({rootStateTypeId:1000n,fieldId:9n,selectors:[{kind:'mapKey',key:list([o.holder,o.target])}]});
export function stakeholderReportSlots(v:CanonicalValue,at?:bigint){
 const slots=items(v,'list');require(slots.length===2,'report slots');
 return slots.map(v=>{const r=items(v,'list');require(r.length===0||r.length===3&&uint(r[0])>=1n&&(!at||uint(r[0])<at)&&uint(r[1])>=1n&&uint(r[1])<=16n&&typeof r[2]==='boolean','report grammar/time');return r;});
}
function sourceKey(v:CanonicalValue){const a=items(v,'list');return uint(a[5])===2n?'receipt/'+uint(a[6]):uint(a[4])+'/'+uint(a[5]);}
export function stakeholderJournal(v:CanonicalValue|undefined,o:Observer,limit:TimeLimit){
 if(v===undefined)return [] as CanonicalValue[];
 const a=items(v,'list');require(a.length===2&&eq(a[0],text(SK)),'journal');
 const rows=items(a[1],'list'),seen=new Set<string>();require(rows.length>0&&rows.length<=48,'capacity');let last=0n;
 for(const v of rows){const x=items(v,'list');require(x.length===9&&eq(x[0],text(SK_OBS))&&eq(x[1],o.holder)&&eq(x[2],o.target),'own observation');
 const at=uint(x[3]),episode=uint(x[4]),kind=uint(x[5]),receipt=uint(x[6]),actor=items(x[8],'list');require(at>=last&&at>=1n&&at<=limit&&episode>=1n&&episode<=at&&kind<=2n&&typeof x[7]==='boolean','observation domain/order');last=at;
 require(kind===2n?episode<at&&receipt>=1n&&receipt<=16n&&actor.length===0:episode===at&&receipt===0n&&(kind===0n?actor.length===0:x[7]===true&&actor.length===1&&!!o.actors?.some(p=>eq(p.local,actor[0]))),'source/actor');
 const sk=sourceKey(v);require(!seen.has(sk),'duplicate source');seen.add(sk);
 }return [...rows];
}
export function stakeholderMerge(prior:readonly CanonicalValue[],added:readonly CanonicalValue[]){
 const rows=[...prior];for(const v of added){const old=rows.find(o=>sourceKey(o)===sourceKey(v));if(old){const a=items(old,'list'),b=items(v,'list');require(eq(list([...a.slice(0,3),...a.slice(4)]),list([...b.slice(0,3),...b.slice(4)])),'conflicting source');}else rows.push(v);}return rows;
}
export function stakeholderBeliefs(rows:readonly CanonicalValue[]){
 const groups=new Map<bigint,{n:bigint;d:bigint}>();for(const v of rows){const a=items(v,'list');if(uint(a[5])===0n)continue;const episode=uint(a[4]),g=groups.get(episode)??{n:0n,d:0n};g.n+=a[7]===true?1n:0n;g.d++;groups.set(episode,g);}
 return list([...groups].sort((a,b)=>a[0]<b[0]?-1:1).map(([e,g])=>list([u(e),u(g.n),u(g.d)])));
}
export function stakeholderKnowledgeView(outputs:readonly CanonicalValue[],s:SocialWitness,index:number){
 require(Number.isInteger(index)&&index>=0&&index<2,'view selector');const o=s.observers[index];
 return list([text(SK+'/view'),o.holder,o.target,list(outputs.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>=5&&[SK_OBS,SK_EVID,SK_UPDATE,SK_PROBE].some(t=>eq(v.items[0],text(t)))&&eq(v.items[1],o.holder)&&eq(v.items[2],o.target)))]);
}
export function createStakeholderKnowledge(C:CanonicalValue,s:SocialWitness,model:CanonicalValue,run:CanonicalValue,stateModel:ReturnType<typeof compileCampaign2StateModel>,limit:TimeLimit){
 let active=false,at=0n,used=false,unbound=0;const pending=new Set<string>();
 const fail=(m:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','stakeholder knowledge: '+m);};
 const read=(state:AuthoritativeState,o:Observer)=>{const path=stakeholderPath(o),v=stateModel.read(state,path);return {...v,record:{accessorId:bodyId(1028,'accessor/stakeholder-knowledge'),path,presence:v.presence,value:v.value,derivedSources:[]} as ActualReadRecord};};
 const trace=(event:ScheduledEvent,outputs:CanonicalValue[],children:readonly ScheduledEvent[],reads:ActualReadRecord[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[])=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:bodyId(1036,'seam/stakeholder-knowledge'),seamVersion:SK+'-candidate',recordKind:event.eventTypeId,subjectIds:[id(C)],sourceRecordIds:[],registeredReadDomain:reads.map(r=>pattern(r.path)),actualReadRecords:reads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});
 const emit=(phase:bigint,eventTypeId:ReturnType<typeof bodyId>,payload:CanonicalValue):EventEmission=>({dueAt:at as ScheduledEvent['dueAt'],phase,eventTypeId,payload,dependencies:list([])});
 function plan(e:ScheduledEvent,outputs:CanonicalValue[],emissions:EventEmission[],reads:ActualReadRecord[]=[]){unbound++;return {outputs,emissions,bind(children:readonly ScheduledEvent[]){if(!active||children.length!==emissions.length)fail('child lifecycle');children.forEach((c,i)=>{const expected={...emissions[i],eventId:c.eventId,eventSequence:c.eventSequence,causalParentEventIds:[e.eventId]};if(c.eventId===e.eventId||c.eventSequence<=e.eventSequence||fp(c)!==fp(expected)||pending.has(fp(c)))fail('child binding');pending.add(fp(c));});unbound--;},trace:(children:readonly ScheduledEvent[])=>trace(e,outputs,children,reads)};}
 function result(context:EventHandlerContext<AuthoritativeState>,p:ReturnType<typeof plan>){return {nextState:context.state,outputs:p.outputs,emittedEvents:p.emissions,traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){p.bind(children);return [p.trace(children)];}};}
 function admit(e:ScheduledEvent,phase:bigint){if(!active||e.dueAt!==at||e.phase!==phase||!pending.delete(fp(e)))fail('unbound generated event');}
 function observations(v:CanonicalValue){const slots=items(v,'list');if(slots.length!==2)fail('slots');return slots.map((v,i)=>{const rows=items(v,'list');if(rows.length>2)fail('slot capacity');for(const r of rows)stakeholderJournal(list([text(SK),list([r])]),s.observers[i],limit);return rows;});}
 return {
  begin(t:bigint){if(active)fail('already active');active=true;at=t;used=false;unbound=0;pending.clear();},
  close(){active=false;unbound=0;pending.clear();},
  prepareCommit(){if(!active||unbound||pending.size)fail('unfinished instant');},
  source(context:EventHandlerContext<AuthoritativeState>,reports:CanonicalValue){if(!active||context.event.dueAt!==at||context.event.phase!==30n)fail('source lifecycle');stakeholderReportSlots(reports,at);return result(context,plan(context.event,[],[emit(40n,SK_QUERY,list([])),emit(120n,SK_REPORT,reports)]));},
  observe(e:ScheduledEvent,task:CanonicalValue,access:readonly boolean[],causes:readonly boolean[]=[],blocker?:CanonicalValue){
   if(!active||used||e.dueAt!==at||e.phase!==120n||!eq(e.eventTypeId,PERFORMANCE_OBSERVE)||access.length!==2||causes.length!==2)fail('observation lifecycle');used=true;
   const a=items(e.payload,'list');if(typeof a[1]!=='boolean')fail('physical outcome');const matching=items(a[2],'list').some(v=>eq(items(v,'list')[0],task));
   const slots=s.observers.map((o,i)=>{const rows:CanonicalValue[]=[];const common=[text(SK_OBS),o.holder,o.target,u(at),u(at)];
    if(matching&&access[i])rows.push(list([...common,u(0),u(0),a[1],list([])]));
    if(matching&&causes[i]&&blocker){const local=o.actors?.find(p=>eq(p.world,blocker))?.local;if(!local)fail('local actor mapping');rows.push(list([...common,u(1),u(0),true,list([local!])]));}return list(rows);});
   return plan(e,slots.flatMap(v=>items(v,'list')),[emit(130n,SK_EVIDENCE,list(slots))]);
  },
  execute(context:EventHandlerContext<AuthoritativeState>){
   const e=context.event;
   if(eq(e.eventTypeId,SK_QUERY)){admit(e,40n);const reads:ActualReadRecord[]=[],outputs=s.observers.map(o=>{const v=read(context.state,o);reads.push(v.record);return list([text(SK_PROBE),o.holder,o.target,u(at),stakeholderBeliefs(stakeholderJournal(v.value,o,limit))]);});return result(context,plan(e,outputs,[],reads));}
   if(eq(e.eventTypeId,SK_REPORT)){admit(e,120n);const slots=stakeholderReportSlots(e.payload,at).map((r,i)=>list(r.length?[list([text(SK_OBS),s.observers[i].holder,s.observers[i].target,u(at),r[0],u(2),r[1],r[2],list([])])]:[]));return result(context,plan(e,slots.flatMap(v=>items(v,'list')),[emit(130n,SK_EVIDENCE,list(slots))]));}
   if(!eq(e.eventTypeId,SK_EVIDENCE))fail('event type');admit(e,130n);const slots=observations(e.payload),outputs=slots.flat().map(v=>list([text(SK_EVID),...items(v,'list').slice(1)]));return result(context,plan(e,outputs,[emit(140n,SK_LEARN,e.payload)]));
  },
  isLearning:(e:ScheduledEvent)=>eq(e.eventTypeId,SK_LEARN),
  prepare(events:readonly ScheduledEvent[],B0:AuthoritativeState){
   const all=events.map(e=>{if(!eq(e.eventTypeId,SK_LEARN))fail('learning type');admit(e,140n);return observations(e.payload);});
   const reads:ActualReadRecord[]=[],ops:StatePatch['operations'][number][]=[],updates:CanonicalValue[]=[];
   for(let i=0;i<2;i++){const added=all.flatMap(slots=>slots[i]);if(!added.length)continue;const o=s.observers[i],v=read(B0,o),old=stakeholderJournal(v.value,o,limit),next=stakeholderMerge(old,added);reads.push(v.record);
    updates.push(list([text(SK_UPDATE),o.holder,o.target,u(at),stakeholderBeliefs(next)]));if(next.length!==old.length)ops.push({kind:'set',path:stakeholderPath(o),expected:v.presence?{presence:true,value:v.value!}:{presence:false},newValue:list([text(SK),list(next)])});}
   const patch:StatePatch={operations:ops};let cursor=0,finished=false,traces:CanonicalValue[]=[];
   return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=events.length||fp(context.event)!==fp(events[cursor++]))fail('stage order');return {nextState:B0,outputs:cursor===events.length?updates:[],emittedEvents:[],traceContributions:[]};},
    finish(state:AuthoritativeState){if(finished||cursor!==events.length)fail('incomplete stage');finished=true;const result=stateModel.applyPatch(state,patch,KNOWLEDGE_OWNER,{writableRoots:[1000n],targetPaths:ops.map(o=>o.path)});traces=events.map((e,i)=>trace(e,i===events.length-1?updates:[],[],i===events.length-1?reads:[],i===events.length-1?patch:{operations:[]},i===events.length-1?result.diffs:[]));return result.state;},
    traces(){if(!finished)fail('trace before finish');return traces;}
   };
  }
 };
}
