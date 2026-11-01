/** Permitted self report -> existing knowledge owner -> strictly later appraisal. */
import {list,text,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {type AuthoritativeState,type StatePath,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {type ScheduledEvent,SchedulerContractError} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataRecord as rec,dataField as f, dataItems as items,dataText as txt,dataUnsigned as uint,dataKey as key,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {readQ,qValue} from '../campaign2/cognitiveMath';
import {compareAffectFactors} from '../campaign3/affectFactorComparison';
import {qualificationParts} from './identityEligibility';
import {sid,pattern} from './skill';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const SELF='assembled-self-belief/0.1',SELF_OBS=SELF+'/observation',SELF_APPRAISAL=SELF+'/appraisal',SELF_VERSION='assembled-character-self-belief/0.1-candidate';
export const SELF_CONTEXT=sid(1001,'event/assembled-self-context');
const require=(b:boolean,s:string)=>{if(!b)invalidModel('self belief '+s);};
const integer=(v:CanonicalValue)=>{require(typeof v!=='boolean'&&v.kind==='signed','signed value');return (v as Extract<CanonicalValue,{kind:'signed'}>).value;};
export const selfPath=(C:CanonicalValue):StatePath=>({rootStateTypeId:1000n,fieldId:5n,selectors:[{kind:'mapKey',key:C}]});
export function compileSelf(v:CanonicalValue){const a=items(v,'list');require(a.length===1&&txt(a[0])===SELF,'declaration');}
export function selfContext(v:CanonicalValue){const a=items(v,'list');require(a.length===3&&txt(a[0])===SELF&&typeof a[1]==='boolean','context grammar');const goal=integer(a[2]);require(goal===1n||goal===-1n,'goal domain');return {visible:a[1]===true,goal};}
export function selfEvidence(v:CanonicalValue,C:CanonicalValue){const a=items(v,'list');require(a.length===6&&txt(a[0])===SELF_OBS&&key(a[1])===key(C)&&key(a[2])===key(C)&&txt(a[3])==='positive-task-fidelity','evidence subject/proposition');const ticket=uint(a[4]),polarity=integer(a[5]);require(ticket>=1n&&ticket<=100n&&polarity>=-1n&&polarity<=1n,'evidence domain');return {ticket,polarity};}
export function selfBelief(v:CanonicalValue|undefined,C:CanonicalValue){
 if(v===undefined)return {history:[] as CanonicalValue[],mean:undefined as Q|undefined};
 const a=items(v,'list');require(a.length===3&&txt(a[0])===SELF,'state grammar');const history=[...items(a[1],'list')];require(history.length>0&&history.length<=16,'capacity');let last=0n,sum=0n;for(const o of history){const e=selfEvidence(o,C);require(e.ticket>last,'ticket order');last=e.ticket;sum+=e.polarity;}const mean=Q.of(sum,BigInt(history.length));require(mean.equals(readQ(a[2])),'mean fold');return {history,mean:mean as Q|undefined};
}
export function appendSelf(prior:CanonicalValue|undefined,observation:CanonicalValue,C:CanonicalValue){const before=selfBelief(prior,C),next=[...before.history,observation],mean=Q.of(next.reduce((n,o)=>n+selfEvidence(o,C).polarity,0n),BigInt(next.length)),v=list([text(SELF),list(next),qValue(mean)]);selfBelief(v,C);return v;}
export function appraiseSelf(mean:Q|undefined,goal:bigint){require(goal===1n||goal===-1n,'appraisal goal');if(mean===undefined)return {adverse:undefined as Q|undefined,affect:[] as Q[]};require(mean.compare(Q.of(-1n))>=0&&mean.compare(Q.of(1n))<=0,'estimate domain');const p=Q.of(1n).add(mean).divide(Q.of(2n)),adverse=goal===1n?Q.of(1n).subtract(p):p,affect=compareAffectFactors({likelihood:adverse,severity:Q.of(1n),vulnerability:Q.of(1n),control:Q.of(0n)},'SplitExposure');return {adverse:adverse as Q|undefined,affect:affect.status==='Known'?[...affect.coordinates]:[]};}
/** Source capability only; the learner below accepts the resulting safe value. */
export function projectSelf(qualification:CanonicalValue,visible:boolean,C:CanonicalValue){const q=qualificationParts(qualification);require(key(q.subject)===key(C),'source subject');if(!visible||!q.accepted)return undefined;const c=readQ(q.contribution);return list([text(SELF_OBS),C,C,text('positive-task-fidelity'),unsigned(q.at.value),signed(c.numerator>0n?1:-1)]);}
export function createSelfBeliefExecution(C:CanonicalValue,stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue){
 const path=selfPath(C),fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));let decisionChosen:boolean|undefined;let active=false,at=0n,setting:ScheduledEvent|undefined,qualified:ScheduledEvent|undefined,qualification:CanonicalValue|undefined,safe:CanonicalValue|undefined,appraised=false,prepared=false,admitted:string|undefined;
 const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','self belief '+s);};
 const read=(s:AuthoritativeState)=>{const v=stateModel.read(s,path);return {...v,record:{accessorId:sid(1028,'accessor/self-belief'),path,presence:v.presence,value:v.value,derivedSources:[]} as ActualReadRecord};};
 const trace=(event:ScheduledEvent,input:CanonicalValue,output:CanonicalValue,reads:readonly ActualReadRecord[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[])=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:sid(1036,'seam/assembled-self-belief'),seamVersion:SELF_VERSION,recordKind:event.eventTypeId,subjectIds:[id(C)],sourceRecordIds:[],registeredReadDomain:reads.map(r=>pattern(r.path)),actualReadRecords:reads,inputProjection:input,outputProjection:output,randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:[],invariantResults:[]});
 return Object.freeze({
 begin(instant:bigint){decisionChosen=undefined;if(active)fail('already active');active=true;at=instant;setting=undefined;qualified=undefined;qualification=undefined;safe=undefined;appraised=false;prepared=false;admitted=undefined;},
 close(){decisionChosen=undefined;active=false;setting=undefined;qualified=undefined;qualification=undefined;safe=undefined;},
 context(e:ScheduledEvent){if(!active||setting||e.dueAt!==at||e.phase!==30n||!originals.some(x=>fp(x)===fp(e)))fail('unbound context');selfContext(e.payload);setting=structuredClone(e);return trace(e,e.payload,list([]));},
 appraise(e:ScheduledEvent,s:AuthoritativeState){if(!active||!setting||appraised||e.dueAt!==at||e.phase!==50n)fail('appraisal lifecycle');appraised=true;const prior=read(s),b=selfBelief(prior.value,C);if(b.history.some(o=>selfEvidence(o,C).ticket>=at))fail('same-instant belief');const goal=selfContext(setting!.payload).goal,a=appraiseSelf(b.mean,goal),report=list([text(SELF_APPRAISAL),C,unsigned(at),signed(goal),b.mean?qValue(b.mean):list([]),unsigned(b.history.length),a.adverse?qValue(a.adverse):list([]),list(a.affect.map(qValue))]);return {report,trace:()=>trace(e,list([signed(goal),prior.value??list([])]),report,[prior.record])};},
 decision(e:ScheduledEvent,resolution:CanonicalValue){if(!active||!appraised||decisionChosen!==undefined||e.dueAt!==at||e.phase!==80n||key(e.eventTypeId)!==key(sid(1001,'event/task-arbitration')))fail('decision lifecycle');const result=rec(resolution,409n),time=f(result,2n),status=uint(f(rec(f(result,4n),419n),1n));if(typeof time==='boolean'||time.kind!=='signed'||time.value!==at||![1n,2n,3n].includes(status))fail('decision association');decisionChosen=status===3n;},
 project(e:ScheduledEvent,q:CanonicalValue){if(!active||!setting||decisionChosen!==true||qualified||e.dueAt!==at||e.phase!==130n)fail('projection lifecycle');qualified=structuredClone(e);qualification=q;safe=projectSelf(q,selfContext(setting!.payload).visible,C);return {report:safe,trace:()=>trace(e,list([q,setting!.payload]),list(safe?[safe]:[]))};},
 parents:()=>setting?[setting.eventId]:[],
 preflight(e:ScheduledEvent){if(!active||!qualified||admitted||e.dueAt!==at||e.phase!==140n||!e.causalParentEventIds.includes(qualified!.eventId)||key(e.payload)!==key(qualification!))fail('learning preflight');stateModel.validatePath(path);admitted=fp(e);},
 prepare(e:ScheduledEvent,B0:AuthoritativeState){if(admitted!==fp(e)||!active||!qualified||prepared||e.dueAt!==at||e.phase!==140n||!e.causalParentEventIds.includes(qualified!.eventId)||key(e.payload)!==key(qualification!))fail('learning association');prepared=true;stateModel.validatePath(path);const prior=read(B0),patch:StatePatch={operations:safe?[{kind:'set',path,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:appendSelf(prior.value,safe,C)}]:[]};return {patch,trace:(diffs:ReturnType<typeof stateModel.applyPatch>['diffs'])=>trace(e,list(safe?[safe]:[]),list([]),[prior.record],patch,diffs)};},
 prepareCommit(){const expected=originals.some(e=>e.dueAt===at);if(!active||expected&&(!setting||!appraised||decisionChosen===undefined||(decisionChosen?(!qualified||!prepared):(!!qualified||prepared))))fail('unfinished instant');},
 });
}
