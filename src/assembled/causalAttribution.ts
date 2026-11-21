import {INTERFERENCE_ACQUISITION,INTERFERENCE_ACQUISITION_VERSION,INTERFERENCE_ACQUIRE,INTERFERENCE_ACQUIRE_LEARN} from './interferenceExpectation';
import {LEGACY_TIME_LIMIT,assertTimeLimit,timeDomainVersion,type TimeLimit} from './timeDomain';
import {PERFORMANCE_OBSERVE,PERFORMANCE_OBS} from './performance';
import {INTERFERENCE_WITNESS} from './interferenceExpectation';
import {INTERFERENCE,INTERFERENCE_OBS,INTERFERENCE_SOURCE,INTERFERENCE_CONTEXT,INTERFERENCE_OBSERVE,INTERFERENCE_EVIDENCE,INTERFERENCE_LEARN,INTERFERENCE_VERSION,interferenceSource,interferenceContext,interferenceObservation,interferenceJournal,interferencePath,appendInterference,interferenceAppraisal} from './interferenceExpectation';
/** assembled-character-causal-attribution/0.1: safe diagnostics -> prior causal appraisal. */
import {list,text,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import type {AuthoritativeState,StatePath,StatePatch,ActualReadRecord} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission,type EventHandlerContext} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {simInstant} from '../substrate/time';
import {ExactRational as Q} from '../substrate/exactMath';
import {compareAffectFactors} from '../campaign3/affectFactorComparison';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataKey as key,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {qValue} from '../campaign2/cognitiveMath';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
import {KNOWLEDGE_OWNER,type Strategy} from './strategy';
import {outcomePath,outcomeJournal} from './performance';
import {sid,pattern} from './skill';
export const CAUSAL_AVAILABILITY='assembled-causal-opportunities/0.1',CAUSAL_OPPORTUNITIES_VERSION='assembled-character-causal-opportunities/0.1-candidate';
export const CAUSAL='assembled-causal/0.1',CAUSAL_OBS=CAUSAL+'/observation',CAUSAL_QUERY=CAUSAL+'/context',CAUSAL_APPRAISAL=CAUSAL+'/appraisal',CAUSAL_VERSION='assembled-character-causal-attribution/0.1-candidate';
export const CAUSAL_SOURCE=sid(1001,'event/assembled-causal-source'),CAUSAL_CONTEXT=sid(1001,'event/assembled-causal-context'),CAUSAL_OBSERVE=sid(1001,'event/assembled-causal-observe'),CAUSAL_EVIDENCE=sid(1001,'event/assembled-causal-evidence'),CAUSAL_LEARN=sid(1001,'event/assembled-causal-learn');
export const causalPath=(task:CanonicalValue):StatePath=>({rootStateTypeId:1000n,fieldId:6n,selectors:[{kind:'mapKey',key:task}]});
const require=(b:boolean,s:string)=>{if(!b)invalidModel('causal '+s);};
export type CausalLaw='JointDiagnostics'|'MotionOnly'|'OutcomeOnly'|'NoLearning';
export const lamp=(v:CanonicalValue):boolean|null=>{if(typeof v==='boolean')return v;require(v.kind==='list'&&v.items.length===0,'optional lamp');return null;};
function task(v:CanonicalValue,routes:Strategy){require(routes.some(r=>key(r.task)===key(v)),'task');}
export function causalSource(v:CanonicalValue,routes:Strategy,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);const a=items(v,'list');require(a.length===7&&txt(a[0])===CAUSAL&&typeof a[4]==='boolean','source');task(a[1],routes);const ticket=uint(a[2]),receipt=uint(a[3]);require(ticket>=1n&&ticket<=timeLimit&&receipt>=1n&&receipt<=16n,'ticket/receipt');return {task:a[1],ticket,receipt,visible:a[4]===true,motion:lamp(a[5]),drag:lamp(a[6])};}
export function causalContext(v:CanonicalValue,routes:Strategy,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);const a=items(v,'list');require(a.length===4&&txt(a[0])===CAUSAL_QUERY,'context');task(a[1],routes);const ticket=uint(a[2]),goal=txt(a[3]);require(ticket>=1n&&ticket<=timeLimit&&['ProtectRoute','RepairCapability'].includes(goal),'query');return {task:a[1],ticket,goal:goal as 'ProtectRoute'|'RepairCapability'};}
export function diagnostic(v:CanonicalValue,expectedTask:CanonicalValue,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);const a=items(v,'list');require(a.length===7&&txt(a[0])===CAUSAL_OBS&&key(a[2])===key(expectedTask),'observation');const at=uint(a[1]),ticket=uint(a[3]),receipt=uint(a[4]),motion=lamp(a[5]),drag=lamp(a[6]);require(at>=1n&&at<=timeLimit&&ticket>=1n&&ticket<at&&receipt>=1n&&receipt<=16n&&(motion!==null||drag!==null),'observation domain');return {at,ticket,receipt,motion,drag};}
export function causalJournal(v:CanonicalValue|undefined,t:CanonicalValue,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);if(v===undefined)return [] as CanonicalValue[];const a=items(v,'list');require(a.length===2&&txt(a[0])===CAUSAL,'journal');const rows=[...items(a[1],'list')];require(rows.length>0&&rows.length<=16,'capacity');let last=0n;for(const row of rows){const o=diagnostic(row,t,timeLimit);require(o.at>last,'order');last=o.at;}return rows;}
export function appendDiagnostic(prior:CanonicalValue|undefined,observation:CanonicalValue,t:CanonicalValue,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);const rows=causalJournal(prior,t,timeLimit),value=list([text(CAUSAL),list([...rows,observation])]);causalJournal(value,t,timeLimit);return value;}
export function inferCause(outcome:boolean|null,diagnostics:readonly {receipt:bigint;motion:boolean|null;drag:boolean|null}[],law:CausalLaw='JointDiagnostics'){
 require(['JointDiagnostics','MotionOnly','OutcomeOnly','NoLearning'].includes(law),'law');
 if(outcome===null||law==='NoLearning')return {status:'Unknown',blockage:null,limitation:null};
 if(outcome)return {status:'NotFailure',blockage:null,limitation:null};
 let motion:boolean|null=null,drag:boolean|null=null;const seen=new Set<bigint>();
 for(const d of diagnostics){if(seen.has(d.receipt))continue;seen.add(d.receipt);if(d.motion!==null)motion=d.motion;if(d.drag!==null)drag=d.drag;}
 let odds=Q.of(1n);for(const v of law==='OutcomeOnly'?[]:law==='MotionOnly'?[motion]:[motion,drag])if(v!==null)odds=odds.multiply(v?Q.of(3n):Q.of(1n,3n));
 const blockage=odds.divide(Q.of(1n).add(odds));return {status:blockage.compare(Q.of(1n,2n))===0?'Ambiguous':blockage.compare(Q.of(1n,2n))>0?'Obstruction':'Limitation',blockage,limitation:Q.of(1n).subtract(blockage)};
}
export function causalAffect(j:ReturnType<typeof inferCause>,goal:'ProtectRoute'|'RepairCapability'){require(['ProtectRoute','RepairCapability'].includes(goal),'appraisal goal');return compareAffectFactors({likelihood:(goal==='ProtectRoute'?j.blockage:j.limitation)??undefined,severity:Q.of(1n),vulnerability:Q.of(1n),control:Q.of(0n)},'SplitExposure');}
export function createCausalExecution(C:CanonicalValue,routes:Strategy,stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue,interference=false,optionalQueries=false,timeLimit:TimeLimit=LEGACY_TIME_LIMIT,witnessPeople?:readonly CanonicalValue[],acquired=false){assertTimeLimit(timeLimit);
 const fp=(e:ScheduledEvent)=>key(scheduledEventValue(e)),fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','causal '+s);};
 let active=false,at=0n,unbound=0,setting:ScheduledEvent|undefined,futureSetting:ScheduledEvent|undefined,appraised=false,witnessSeen=false;const pending=new Map<string,ScheduledEvent>(),used=new Set<bigint>();
 const read=(s:AuthoritativeState,p:StatePath)=>{const v=stateModel.read(s,p);return {...v,record:{accessorId:sid(1028,'accessor/causal'),path:p,presence:v.presence,value:v.value,derivedSources:[]} as ActualReadRecord};};
 const trace=(event:ScheduledEvent,input:CanonicalValue,output:CanonicalValue,children:readonly ScheduledEvent[]=[],reads:readonly ActualReadRecord[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[],future=false)=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:sid(1036,future?'seam/assembled-interference':'seam/assembled-causal-attribution'),seamVersion:timeDomainVersion(future?(acquired?INTERFERENCE_ACQUISITION_VERSION:witnessPeople?'obstruction-witness/0.1-candidate':INTERFERENCE_VERSION):CAUSAL_VERSION,timeLimit),recordKind:event.eventTypeId,subjectIds:[id(C)],sourceRecordIds:[],registeredReadDomain:reads.map(r=>pattern(r.path)),actualReadRecords:reads,inputProjection:input,outputProjection:output,randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});
 const admit=(e:ScheduledEvent,phase:bigint)=>{if(!active||e.dueAt!==at||e.phase!==phase||!pending.delete(fp(e)))fail('unbound generated event');};
 const original=(e:ScheduledEvent,phase:bigint)=>{if(!active||e.dueAt!==at||e.phase!==phase||used.has(e.eventId)||!originals.some(x=>fp(x)===fp(e)))fail('unbound source');used.add(e.eventId);};
 return Object.freeze({
 eventTypes:()=>[CAUSAL_SOURCE,CAUSAL_CONTEXT,CAUSAL_OBSERVE,CAUSAL_EVIDENCE,CAUSAL_LEARN,...(interference?[INTERFERENCE_SOURCE,INTERFERENCE_CONTEXT,INTERFERENCE_OBSERVE,INTERFERENCE_EVIDENCE,INTERFERENCE_LEARN,...(acquired?[INTERFERENCE_ACQUIRE,INTERFERENCE_ACQUIRE_LEARN]:[])]:[])],isLearning:(e:ScheduledEvent)=>[CAUSAL_LEARN,...(interference?[INTERFERENCE_LEARN]:[]),...(acquired?[INTERFERENCE_ACQUIRE_LEARN]:[])].some(t=>key(e.eventTypeId)===key(t)),
 begin(instant:bigint){if(active)fail('already active');active=true;at=instant;unbound=0;setting=undefined;futureSetting=undefined;appraised=false;witnessSeen=false;pending.clear();used.clear();},
 close(){active=false;pending.clear();used.clear();setting=undefined;futureSetting=undefined;unbound=0;},
 parents:()=>[...(setting?[setting.eventId]:[]),...(futureSetting?[futureSetting.eventId]:[])],
 prepareCommit(){if(!active||unbound||pending.size||originals.some(e=>e.dueAt===at&&!used.has(e.eventId))||(setting||futureSetting)&&!appraised)fail('unfinished instant');},
 observeContext(parent:ScheduledEvent,observed:readonly CanonicalValue[]){
  if(!acquired||!active||parent.dueAt!==at||parent.phase!==120n||key(parent.eventTypeId)!==key(PERFORMANCE_OBSERVE))fail('acquisition lifecycle');
  const context=futureSetting?interferenceContext(futureSetting.payload,routes):undefined;
  const observations=observed.map(v=>{const a=items(v,'list');if(txt(a[0])!==PERFORMANCE_OBS)fail('acquisition outcome');
   const scope=context&&key(context.task)===key(a[3])?context.route:null;
   const row=list([text(INTERFERENCE_ACQUISITION),unsigned(at),a[3],v,scope===null?list([]):unsigned(scope)]);
   interferenceObservation(row,a[3],timeLimit,witnessPeople,true);return row;
  });
  if(!observations.length)return undefined;
  const emissions:EventEmission[]=[{dueAt:parent.dueAt,phase:130n,eventTypeId:INTERFERENCE_ACQUIRE,payload:list(observations),dependencies:list([])}];let bound=false;unbound++;
  return {outputs:observations,emissions,bind(children:readonly ScheduledEvent[]){if(!active||bound||children.length!==1)fail('acquisition children');const child=children[0],expected={...emissions[0],eventId:child.eventId,eventSequence:child.eventSequence,causalParentEventIds:[parent.eventId]};if(child.eventSequence<=parent.eventSequence||fp(child)!==fp(expected)||pending.has(fp(child)))fail('acquisition child association');pending.set(fp(child),structuredClone(child));bound=true;unbound--;},trace:(children:readonly ScheduledEvent[])=>trace(parent,list([parent.payload,futureSetting?.payload??list([])]),list(observations),children,[],{operations:[]},[],true)};
 },
 observeObstruction(parent:ScheduledEvent,observed:readonly CanonicalValue[],witness:{task:CanonicalValue;blocker:CanonicalValue}|undefined){
  if(!witnessPeople||!active||witnessSeen||parent.dueAt!==at||parent.phase!==120n||key(parent.eventTypeId)!==key(PERFORMANCE_OBSERVE))fail('witness lifecycle');witnessSeen=true;
  if(!witness)return undefined;
  const targets=items(items(parent.payload,'list')[2],'list').filter(v=>key(items(v,'list')[0])===key(witness.task));if(!targets.length)return undefined;if(targets.length!==1)fail('witness target');
  const outcomes=observed.filter(v=>{const a=items(v,'list');return txt(a[0])===PERFORMANCE_OBS&&key(a[3])===key(witness.task);});if(outcomes.length>1)fail('witness outcome multiplicity');
  const observation=list([text(INTERFERENCE_WITNESS),unsigned(at),witness.task,unsigned(at),unsigned(0n),true,outcomes[0]??list([]),witness.blocker]);interferenceObservation(observation,witness.task,timeLimit,witnessPeople,acquired);
  const emissions:EventEmission[]=[{dueAt:parent.dueAt,phase:130n,eventTypeId:INTERFERENCE_EVIDENCE,payload:observation,dependencies:list([])}];let bound=false;unbound++;
  return {outputs:[observation],emissions,bind(children:readonly ScheduledEvent[]){if(!active||bound||children.length!==1)fail('witness children');const child=children[0],expected={...emissions[0],eventId:child.eventId,eventSequence:child.eventSequence,causalParentEventIds:[parent.eventId]};if(child.eventSequence<=parent.eventSequence||fp(child)!==fp(expected)||pending.has(fp(child)))fail('witness child association');pending.set(fp(child),structuredClone(child));bound=true;unbound--;},trace:(children:readonly ScheduledEvent[])=>trace(parent,parent.payload,list([observation]),children,[],{operations:[]},[],true)};
 },
 execute({event,state}:EventHandlerContext<AuthoritativeState>){
  const kind=key(event.eventTypeId),outputs:CanonicalValue[]=[],emissions:EventEmission[]=[],reads:ActualReadRecord[]=[];const future=interference&&[INTERFERENCE_SOURCE,INTERFERENCE_CONTEXT,INTERFERENCE_OBSERVE,INTERFERENCE_EVIDENCE,...(acquired?[INTERFERENCE_ACQUIRE]:[])].some(t=>key(t)===kind);
  const emit=(phase:bigint,eventTypeId:ReturnType<typeof sid>,payload:CanonicalValue)=>emissions.push({dueAt:simInstant(at),phase,eventTypeId,payload,dependencies:list([])});
  if(acquired&&kind===key(INTERFERENCE_ACQUIRE)){admit(event,130n);emit(140n,INTERFERENCE_ACQUIRE_LEARN,event.payload);}
  else if(future&&kind===key(INTERFERENCE_CONTEXT)){original(event,30n);if(futureSetting)fail('duplicate interference context');interferenceContext(event.payload,routes);futureSetting=structuredClone(event);}
  else if(future&&kind===key(INTERFERENCE_SOURCE)){original(event,10n);const s=interferenceSource(event.payload,routes,timeLimit);if(s.visible)emit(14n,INTERFERENCE_OBSERVE,event.payload);}
  else if(future&&kind===key(INTERFERENCE_OBSERVE)){admit(event,14n);const s=interferenceSource(event.payload,routes,timeLimit),prior=read(state,outcomePath(s.task)),history=outcomeJournal(prior.value,s.task,routes,true,timeLimit);reads.push(prior.record);if(history.some(v=>uint(items(v,'list')[2])>=at))fail('same-instant outcome');const outcome=history.find(v=>uint(items(v,'list')[2])===s.ticket),o=list([text(INTERFERENCE_OBS),unsigned(at),s.task,unsigned(s.ticket),unsigned(s.receipt),s.positive,outcome??list([])]);interferenceObservation(o,s.task,timeLimit,witnessPeople,acquired);outputs.push(o);emit(130n,INTERFERENCE_EVIDENCE,o);}
  else if(future&&kind===key(INTERFERENCE_EVIDENCE)){admit(event,130n);emit(140n,INTERFERENCE_LEARN,event.payload);}
  else if(kind===key(CAUSAL_CONTEXT)){original(event,30n);if(setting)fail('duplicate context');causalContext(event.payload,routes,timeLimit);setting=structuredClone(event);}
  else if(kind===key(CAUSAL_SOURCE)){original(event,10n);const s=causalSource(event.payload,routes,timeLimit);if(s.visible&&(s.motion!==null||s.drag!==null)){const a=items(event.payload,'list');emit(14n,CAUSAL_OBSERVE,list([text(CAUSAL_OBS),unsigned(at),s.task,unsigned(s.ticket),unsigned(s.receipt),a[5],a[6]]));}}
  else if(kind===key(CAUSAL_OBSERVE)){admit(event,14n);diagnostic(event.payload,items(event.payload,'list')[2],timeLimit);outputs.push(event.payload);emit(130n,CAUSAL_EVIDENCE,event.payload);}
  else if(kind===key(CAUSAL_EVIDENCE)){admit(event,130n);emit(140n,CAUSAL_LEARN,event.payload);}
  else fail('learning requires prepared stage');
  let bound=false;unbound++;
  return {nextState:state,outputs,emittedEvents:emissions,traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){if(!active||bound||children.length!==emissions.length)fail('children');for(const [i,c]of children.entries()){const e=emissions[i];if(c.eventId===event.eventId||c.eventSequence<=event.eventSequence||fp(c)!==fp({...e,eventId:c.eventId,eventSequence:c.eventSequence,causalParentEventIds:[event.eventId]}))fail('child association');pending.set(fp(c),structuredClone(c));}bound=true;unbound--;return [trace(event,event.payload,list(outputs),children,reads,{operations:[]},[],future)];}};
 },
 appraise(e:ScheduledEvent,s:AuthoritativeState){
 if(!active||appraised||e.dueAt!==at||e.phase!==50n||key(e.eventTypeId)!==key(sid(1001,'event/task-appraisal')))fail('appraisal lifecycle');
 if(!optionalQueries&&(!setting||interference&&!futureSetting))fail('missing causal context');
 appraised=true;
 const past=setting?(()=>{const ctx=causalContext(setting!.payload,routes,timeLimit),outcomes=read(s,outcomePath(ctx.task)),diagnostics=read(s,causalPath(ctx.task)),rows=outcomeJournal(outcomes.value,ctx.task,routes,true,timeLimit),history=causalJournal(diagnostics.value,ctx.task,timeLimit);if(rows.some(v=>uint(items(v,'list')[2])>=at)||history.some(v=>diagnostic(v,ctx.task,timeLimit).at>=at))fail('same-instant evidence');const observed=rows.find(v=>uint(items(v,'list')[2])===ctx.ticket),selected=history.filter(v=>diagnostic(v,ctx.task,timeLimit).ticket===ctx.ticket),j=inferCause(observed?items(observed,'list')[6]===true:null,selected.map(v=>diagnostic(v,ctx.task,timeLimit))),a=causalAffect(j,ctx.goal),report=list([text(CAUSAL_APPRAISAL),unsigned(at),ctx.task,unsigned(ctx.ticket),text(ctx.goal),text(j.status),j.blockage?qValue(j.blockage):list([]),j.limitation?qValue(j.limitation):list([]),a.status==='Known'?list(a.coordinates.map(qValue)):list([]),observed??list([]),list(selected)]);return {report,trace:()=>trace(e,list([setting!.payload,outcomes.value??list([]),diagnostics.value??list([])]),report,[],[outcomes.record,diagnostics.record])};})():undefined;
 let future:{report:CanonicalValue;trace:()=>CanonicalValue}|undefined;
 if(interference&&futureSetting){const c=interferenceContext(futureSetting.payload,routes),prior=read(s,interferencePath(c.task)),h=interferenceJournal(prior.value,c.task,timeLimit,witnessPeople,acquired),value=interferenceAppraisal(h,c.task,c.route,c.goal,at,timeLimit,witnessPeople,acquired),input=list([futureSetting.payload,prior.value??list([])]);future={report:value,trace:()=>trace(e,input,value,[],[prior.record],{operations:[]},[],true)};}
 let availability:{report:CanonicalValue;trace:()=>CanonicalValue}|undefined;
 if(optionalQueries){const input=list([setting?.payload??list([]),futureSetting?.payload??list([])]),report=list([text(CAUSAL_AVAILABILITY),unsigned(at),!!setting,!!futureSetting]);availability={report,trace:()=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event:e,seamId:sid(1036,'seam/assembled-causal-opportunities'),seamVersion:timeDomainVersion(CAUSAL_OPPORTUNITIES_VERSION,timeLimit),recordKind:e.eventTypeId,subjectIds:[id(C)],sourceRecordIds:[],registeredReadDomain:[],actualReadRecords:[],inputProjection:input,outputProjection:report,randomDrawRecords:[],quantizationOperations:[],statePatch:{operations:[]},structuralMutationDiffs:[],emittedEvents:[],invariantResults:[]})};}
 return [past,future,availability].filter((v):v is {report:CanonicalValue;trace:()=>CanonicalValue}=>v!==undefined);
 },

 prepare(events:readonly ScheduledEvent[],B0:AuthoritativeState){
  if(acquired){
   if(!events.length||events.length>3||new Set(events.map(e=>key(e.eventTypeId))).size!==events.length)fail('scoped learning multiplicity');
   const groups=new Map<string,{p:StatePath;t:CanonicalValue;prior:ReturnType<typeof read>;fresh:CanonicalValue[];future:boolean;last:ScheduledEvent}>();
   for(const e of events){
    const acquisition=key(e.eventTypeId)===key(INTERFERENCE_ACQUIRE_LEARN),future=acquisition||key(e.eventTypeId)===key(INTERFERENCE_LEARN);
    if(!future&&key(e.eventTypeId)!==key(CAUSAL_LEARN))fail('scoped learning event');admit(e,140n);
    const rows=acquisition?items(e.payload,'list'):[e.payload];if(!rows.length)fail('empty acquisition');
    for(const v of rows){const t=items(v,'list')[2],p=future?interferencePath(t):causalPath(t),k=key(list([t,future])),o=future?interferenceObservation(v,t,timeLimit,witnessPeople,true):diagnostic(v,t,timeLimit);
     if(o.at!==at||acquisition&&!(o as ReturnType<typeof interferenceObservation>).acquisition)fail('scoped learning time/kind');
     const g=groups.get(k)??{p,t,prior:read(B0,p),fresh:[],future,last:e};g.fresh.push(v);g.last=e;groups.set(k,g);
    }
   }
   const candidates=[...groups.values()].map(g=>{
    const prior=g.future?interferenceJournal(g.prior.value,g.t,timeLimit,witnessPeople,true):causalJournal(g.prior.value,g.t,timeLimit);
    if(g.future)g.fresh.sort((a,b)=>Number(interferenceObservation(b,g.t,timeLimit,witnessPeople,true).acquisition)-Number(interferenceObservation(a,g.t,timeLimit,witnessPeople,true).acquisition));
    const next=list([text(g.future?INTERFERENCE:CAUSAL),list([...prior,...g.fresh])]);
    if(g.future)interferenceJournal(next,g.t,timeLimit,witnessPeople,true);else causalJournal(next,g.t,timeLimit);
    const patch:StatePatch={operations:[{kind:'set',path:g.p,expected:g.prior.presence?{presence:true,value:g.prior.value!}:{presence:false},newValue:next}]};
    return {...g,next,patch};
   });
   let cursor=0,finished=false,rows:CanonicalValue[]=[];
   return {execute(ctx:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=events.length||fp(ctx.event)!==fp(events[cursor++]))fail('scoped learning association');return {nextState:B0,outputs:[],emittedEvents:[],traceContributions:[]};},
    finish(state:AuthoritativeState){if(cursor!==events.length||finished)fail('scoped learning finish');finished=true;let next=state;
     const applied=candidates.map(c=>{const result=stateModel.applyPatch(next,c.patch,KNOWLEDGE_OWNER,{writableRoots:[1000n],targetPaths:[c.p]});next=result.state;return {c,diffs:result.diffs};});
     rows=events.map(e=>{const own=applied.filter(x=>fp(x.c.last)===fp(e));return trace(e,own.some(x=>x.c.fresh.length>1)?list([e.payload,list(own.flatMap(x=>x.c.fresh))]):e.payload,list(own.map(x=>x.c.next)),[],own.map(x=>x.c.prior.record),{operations:own.flatMap(x=>x.c.patch.operations)},own.flatMap(x=>x.diffs),key(e.eventTypeId)!==key(CAUSAL_LEARN));});return next;},
    traces(){if(!finished)fail('trace before scoped finish');return rows;}
   };
  }
  if(!events.length||events.length>(interference?2:1)||new Set(events.map(e=>key(e.eventTypeId))).size!==events.length)fail('learning multiplicity');
  const candidates=events.map(e=>{const future=interference&&key(e.eventTypeId)===key(INTERFERENCE_LEARN);if(!future&&key(e.eventTypeId)!==key(CAUSAL_LEARN))fail('learning event');admit(e,140n);const t=items(e.payload,'list')[2],p=future?interferencePath(t):causalPath(t),o=future?interferenceObservation(e.payload,t,timeLimit,witnessPeople,acquired):diagnostic(e.payload,t,timeLimit);if(o.at!==at)fail('learning time');const prior=read(B0,p),next=future?appendInterference(prior.value,e.payload,t,timeLimit,witnessPeople,acquired):appendDiagnostic(prior.value,e.payload,t,timeLimit),patch:StatePatch={operations:[{kind:'set',path:p,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:next}]};return {e,p,prior,next,patch,future};});
  let cursor=0,finished=false,rows:CanonicalValue[]=[];
  return {execute(ctx:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=events.length||fp(ctx.event)!==fp(events[cursor++]))fail('learning association');return {nextState:B0,outputs:[],emittedEvents:[],traceContributions:[]};},
   finish(state:AuthoritativeState){if(cursor!==events.length||finished)fail('learning finish');finished=true;let next=state;for(const c of candidates){const result=stateModel.applyPatch(next,c.patch,KNOWLEDGE_OWNER,{writableRoots:[1000n],targetPaths:[c.p]});rows.push(trace(c.e,c.e.payload,c.next,[],[c.prior.record],c.patch,result.diffs,c.future));next=result.state;}return next;},
   traces(){if(!finished)fail('trace before finish');return rows;}
  };
 }
 });
}
