import {simInstant} from '../substrate/time';
/** assembled-regulatory-stress/0.1: one BODY_OWNER leaf; no scheduler or cognition. */
import {list,text,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q,roundEven} from '../substrate/exactMath';
import {ContractReadProjection,type StatePath,type StatePatch,type ActualReadRecord} from '../substrate/state';
import type {ScheduledEvent,EventEmission,EventHandlerContext} from '../substrate/scheduler';
import {SchedulerContractError} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import type {AuthoritativeState} from '../substrate/state';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataKey as key,dataIdentity as id} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {advanceBiology,defaultConstitution,initialBiology,emptyPhysicalInput} from '../campaign3/biologicalDynamics';
import {bodyId,BODY_OWNER} from './bodyIdentifiers';
import {SHARED_AFFECT_APPRAISAL} from './reappraisal';
import {pattern} from './skill';
export const STRESS='assembled-regulatory-stress/0.1';
export const STRESS_QUEUE=bodyId(1001,'event/assembled-stress-queue'),STRESS_APPLY=bodyId(1001,'event/assembled-stress-apply');
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','regulatory stress: '+s);};
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<0n||v.value>1000001n)fail('time');return (v as {value:bigint}).value;};
export function compileStress(value:CanonicalValue){
 const a=items(value,'list');if(a.length!==4||txt(a[0])!==STRESS||typeof a[1]!=='boolean')fail('declaration');
 const baseline=uint(a[2]),decay=uint(a[3]);if(baseline>1000n||decay>1000n)fail('parameter domain');
 return Object.freeze({enabled:a[1] as boolean,baseline:Number(baseline),decay:Number(decay)});
}
export type StressDeclaration=ReturnType<typeof compileStress>;
export const stressPath=(C:CanonicalValue):StatePath=>({rootStateTypeId:455n,fieldId:2n,selectors:[{kind:'mapKey',key:C}]});
export function stressAnchor(value:CanonicalValue){const a=items(value,'list');if(a.length!==3||txt(a[0])!==STRESS)fail('anchor');const at=time(a[1]),level=uint(a[2]);if(level>1000n)fail('level');return {at,level:Number(level)};}
export const stressValue=(at:bigint,level:number)=>list([text(STRESS),signed(at),u(level)]);
function step(level:number,d:StressDeclaration,dose:number,phase:'elapsed'|'consequence'){
 const c=defaultConstitution();c.channels.stress.baseline=d.baseline;c.channels.stress.decay=d.decay;
 const s=initialBiology(c);s.channels.stress.level=level;const input=emptyPhysicalInput();
 if(dose)input.stimuli.push({channel:'stress',exposure:'appraised-threat',dose,direction:1});
 return advanceBiology(s,c,input,'Full',phase).state.channels.stress.level;
}
export function stressTransition(prior:CanonicalValue,at:bigint,uncontrolled:Q|undefined,d:StressDeclaration){
 const anchor=stressAnchor(prior);if(at<anchor.at||at>1000001n)fail('nonmonotone application');
 if(uncontrolled&&(uncontrolled.compare(Q.of(0n))<0||uncontrolled.compare(Q.of(1n))>0))fail('threat domain');
 const quant:CanonicalValue[]=[],terms:CanonicalValue[]=[];let level=anchor.level;
 const quantize=(n:bigint,den:bigint)=>{const r=roundEven(n,den);quant.push(list([text('ties-even'),signed(n),u(den),signed(r)]));return r;};
 for(let elapsed=anchor.at;elapsed<at;elapsed++){
  const before=level,delta=quantize(BigInt(d.baseline-before)*BigInt(d.decay),1000n);level=step(before,d,0,'elapsed');
  if(level!==Math.max(0,Math.min(1000,before+Number(delta))))fail('original decay disagreement');
  terms.push(list([text('elapsed'),signed(elapsed+1n),u(before),signed(delta),u(level)]));
  if(level===before){if(elapsed+1n<at)terms.push(list([text('fixed-point'),u(level),u(at-elapsed-1n)]));break;}
 }
 const threat=uncontrolled?quantize(uncontrolled.numerator*1000n,uncontrolled.denominator):undefined;
 const dose=threat!==undefined&&d.enabled?quantize(threat,2n):0n,before=level;level=step(level,d,Number(dose),'consequence');
 terms.push(list([text('impulse'),u(before),u(dose),u(level)]));
 return {value:stressValue(at,level),threat,dose,quant,terms};
}
export function stressReport(packet:CanonicalValue,prior:CanonicalValue,result:ReturnType<typeof stressTransition>,at:bigint){
 return list([text(STRESS+'/applied'),signed(at),packet,prior,result.value,list(result.threat===undefined?[]:[u(result.threat)]),u(result.dose),list(result.terms)]);
}
const fingerprint=(e:ScheduledEvent)=>key(scheduledEventValue(e));
export function createStressExecution(d:StressDeclaration,C:CanonicalValue,stateModel:ReturnType<typeof compileCampaign2StateModel>,model:CanonicalValue,run:CanonicalValue){
 const path=stressPath(C),p=pattern(path);let active=false,at=0n,unbound=0;
 let committed=new Map<string,ScheduledEvent>(),pending=new Map<string,ScheduledEvent>();const seen=new Set<bigint>();
 function bind(parent:ScheduledEvent,emissions:readonly EventEmission[]){
  unbound++;let bound=false;
  return (children:readonly ScheduledEvent[])=>{
   if(!active||bound||children.length!==emissions.length)fail('child binding lifecycle');
   children.forEach((child,i)=>{const expected={...emissions[i],eventId:child.eventId,eventSequence:child.eventSequence,causalParentEventIds:[parent.eventId]};
    if(child.eventId===parent.eventId||child.eventSequence<=parent.eventSequence||fingerprint(child)!==fingerprint(expected)||pending.has(fingerprint(child)))fail('generated child mismatch');
    pending.set(fingerprint(child),structuredClone(child));
   });bound=true;unbound--;
  };
 }
 function packet(value:CanonicalValue){const a=items(value,'list');if(a.length!==5||txt(a[0])!==STRESS||key(a[1])!==key(C))fail('packet');
  const source=time(a[2]),event=uint(a[3]),report=items(a[4],'list');if(txt(report[0])!==SHARED_AFFECT_APPRAISAL||uint(report[1])!==source||!['Known','Unavailable','Deferred'].includes(txt(report[5])))fail('source report');
  const coordinates=items(report[6],'list');if(txt(report[5])==='Known'?coordinates.length!==2:coordinates.length!==0)fail('source coordinates');
  return {source,event,report,uncontrolled:txt(report[5])==='Known'?readQ(coordinates[1]):undefined};
 }
 return {
  begin(t:bigint){if(active)fail('already active');active=true;at=t;pending=new Map(committed);seen.clear();unbound=0;},
  observe(parent:ScheduledEvent,outputs:readonly CanonicalValue[]){
   const matches=outputs.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(SHARED_AFFECT_APPRAISAL)));
   if(!matches.length)return undefined;
   if(!active||parent.dueAt!==at||parent.phase!==50n||key(parent.eventTypeId)!==key(bodyId(1001,'event/task-appraisal'))||matches.length!==1||seen.has(parent.eventId))fail('producer lifecycle');
   const payload=list([text(STRESS),C,signed(at),u(parent.eventId),matches[0]]);packet(payload);seen.add(parent.eventId);
   const emissions:EventEmission[]=[{dueAt:simInstant(at),phase:51n,eventTypeId:STRESS_QUEUE,payload,dependencies:list([])}];return {emissions,bind:bind(parent,emissions)};
  },
  eventTypes:()=>[STRESS_QUEUE,STRESS_APPLY],
  execute(context:EventHandlerContext<AuthoritativeState>){
   const e=context.event,k=fingerprint(e);if(!active||e.dueAt!==at||!pending.has(k))fail('unauthenticated internal event');pending.delete(k);
   const queue=key(e.eventTypeId)===key(STRESS_QUEUE),a=packet(e.payload);
   if(queue?e.phase!==51n||at!==a.source||e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==a.event:e.phase!==52n||at!==a.source+1n)fail('delivery order');
   let nextState=context.state,outputs:CanonicalValue[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[],reads:ActualReadRecord[]=[],quant:CanonicalValue[]=[],emissions:EventEmission[]=[];
   if(queue)emissions=[{dueAt:simInstant(at+1n),phase:52n,eventTypeId:STRESS_APPLY,payload:e.payload,dependencies:list([])}];
   else{
    const read=new ContractReadProjection(context.state,[p],{stress:{kind:'direct',accessorId:bodyId(1028,'accessor/regulatory-stress'),path}}),prior=read.read('stress');if(!prior)fail('required anchor missing');reads=[...read.actualReadRecords()];
    const result=stressTransition(prior!,at,a.uncontrolled,d);patch={operations:[{kind:'set',path,expected:{presence:true,value:prior!},newValue:result.value}]};
    const applied=stateModel.applyPatch(context.state,patch,BODY_OWNER,{writableRoots:[455n],targetPaths:[path]});nextState=applied.state;diffs=applied.diffs;quant=result.quant;
    outputs=[stressReport(e.payload,prior!,result,at)];
   }
   const bound=bind(e,emissions);
   return {nextState,outputs,emittedEvents:emissions,traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){bound(children);return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event:e,seamId:bodyId(1036,'seam/assembled-regulatory-stress'),seamVersion:STRESS,recordKind:e.eventTypeId,subjectIds:[id(C)],sourceRecordIds:[],registeredReadDomain:queue?[]:[p],actualReadRecords:reads,inputProjection:e.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:quant,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];}};
  },
  prepareCommit(){if(!active||unbound||[...pending.values()].some(e=>e.dueAt<=at))fail('unfinished instant');},
  commit(){if(!active)fail('commit outside instant');committed=new Map(pending);},
  close(){active=false;pending.clear();seen.clear();unbound=0;}
 };
}
