/** Actual reward regulation and C1 evidence inside the shared scheduler/state. */
import {list,text,unsigned as u,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {roundEven} from '../substrate/exactMath';
import {ContractReadProjection,type AuthoritativeState,type StatePath,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission,type EventHandlerContext} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {simInstant} from '../substrate/time';
import {dataItems as items,dataRecord as rec,dataField as f,dataText as txt,dataUnsigned as uint,dataKey as key,dataIdentity as id} from '../campaign2/canonicalData';
import {admitObservationLane,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {assemblePreRecognitionExperience} from '../semanticBinding/perceptualEventFiles';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {bodyId,BODY_OWNER,BODY_OBSERVER} from './bodyIdentifiers';
import {ACTION_BODY,ACTION_BODY_EVENT,selectedBodyEffect,type ActionBodyDeclaration} from './actionBody';
import {pattern} from './skill';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const REWARD='assembled-reward-experience/0.1',REWARD_VERSION=REWARD+'-candidate',REWARD_SAMPLE=REWARD+'/sample',REWARD_RECEIPT=REWARD+'/receipt';
export const REWARD_SOURCE=bodyId(1001,'event/assembled-reward-source'),REWARD_APPLY=bodyId(1001,'event/assembled-reward-apply');
const phases=[11n,12n,13n,14n,20n,120n,121n,122n,123n,124n],events=phases.map(p=>bodyId(1001,'event/assembled-reward-'+p));
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','reward: '+s);};
const integer=(v:CanonicalValue)=>{const x=uint(v);if(x>1000n)fail('integer domain');return Number(x);};
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<0n||v.value>1000001n)fail('time');return (v as {value:bigint}).value;};
const clamp=(v:number)=>Math.max(0,Math.min(1000,v)),fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
export function compileReward(v:CanonicalValue){const a=items(v,'list');if(a.length!==7||txt(a[0])!==REWARD)fail('declaration');const [baseline,decay,dose,resolution]=a.slice(3).map(integer);if(!resolution||1000%resolution)fail('resolution');return Object.freeze({action:a[1],task:a[2],baseline,decay,dose,resolution});}
export type RewardDeclaration=ReturnType<typeof compileReward>;
export const rewardBodyPath=(C:CanonicalValue):StatePath=>({rootStateTypeId:455n,fieldId:4n,selectors:[{kind:'mapKey',key:C}]});
export function rewardAnchor(v:CanonicalValue){const a=items(v,'list');if(a.length!==3||txt(a[0])!==REWARD)fail('anchor');return {at:time(a[1]),level:integer(a[2])};}
export const rewardValue=(at:bigint,level:number)=>list([text(REWARD),signed(at),u(level)]);
export function rewardTransition(value:CanonicalValue,at:bigint,d:RewardDeclaration,applied=false){const p=rewardAnchor(value);if(at<p.at||at>1000000n)fail('time order');let level=p.level;const terms:CanonicalValue[]=[],quant:CanonicalValue[]=[];
 for(let t=p.at;t<at;t++){const numerator=BigInt(d.baseline-level)*BigInt(d.decay),delta=roundEven(numerator,1000n),after=clamp(level+Number(delta));quant.push(list([text('ties-even'),signed(numerator),u(1000),signed(delta)]));terms.push(list([text('elapsed'),signed(t+1n),u(level),signed(delta),u(after)]));if(after===level){if(t+1n<at)terms.push(list([text('fixed-point'),u(at-t-1n),u(level)]));break;}level=after;}
 const before=level,dose=applied?d.dose:0;level=clamp(level+dose);terms.push(list([text('consequence'),u(before),u(dose),u(level)]));return {value:rewardValue(at,level),terms,quant};}
export function rewardSource(v:CanonicalValue){const a=items(v,'list');if(a.length!==5||txt(a[0])!==REWARD||[1,3,4].some(i=>typeof a[i]!=='boolean')||typeof a[2]==='boolean'||a[2].kind!=='signed'||a[2].value< -1000n||a[2].value>1000n)fail('source');return {permitted:a[1]===true,bias:Number((a[2] as {value:bigint}).value),learn:a[3]===true,practice:a[4]===true};}
export function rewardSense(level:number,d:RewardDeclaration,s:ReturnType<typeof rewardSource>){return s.permitted?Math.floor(clamp(Math.max(0,level-d.baseline)+s.bias)/d.resolution)*d.resolution:undefined;}
export interface RewardReceipt {id:CanonicalValue;at:bigint;delta:number|undefined;performed:boolean;allowed:boolean;receipt:CanonicalValue;}
export function createRewardExecution(d:RewardDeclaration,C:CanonicalValue,stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue,actuator:ActionBodyDeclaration){
 const path=rewardBodyPath(C);let active=false,at=0n,unbound=0,setting:ReturnType<typeof rewardSource>|undefined,current:CanonicalValue|undefined,before:number|undefined,actual:CanonicalValue|undefined,applied=false,seenEffect=false;
 let reservations:ExperienceReservation[]=[],staged:StagedSemanticExperience[]=[];const used=new Set<bigint>(),pending=new Set<string>();
 const read=(state:AuthoritativeState,p:StatePath)=>{const projection=new ContractReadProjection(state,[pattern(p)],{value:{kind:'direct',accessorId:bodyId(1028,'accessor/reward-physical'),path:p}}),value=projection.read('value');if(!value)fail('required anchor/binding');return {value:value!,reads:[...projection.actualReadRecords()]};};
 function bind(parent:ScheduledEvent,emissions:EventEmission[]){let bound=false;unbound++;return (children:readonly ScheduledEvent[])=>{if(!active||bound||children.length!==emissions.length)fail('child lifecycle');children.forEach((child,i)=>{const expected={...emissions[i],eventId:child.eventId,eventSequence:child.eventSequence,causalParentEventIds:[parent.eventId]};if(child.eventSequence<=parent.eventSequence||fp(child)!==fp(expected)||pending.has(fp(child)))fail('child association');pending.add(fp(child));});bound=true;unbound--;};}
 return {
  begin(t:bigint){if(active)fail('already active');active=true;at=t;unbound=0;setting=undefined;current=undefined;before=undefined;actual=undefined;applied=false;seenEffect=false;pending.clear();used.clear();reservations=[];staged=[];},
  current:()=>({receipt:current,practice:setting?.practice===true}),
  eventTypes:()=>[REWARD_SOURCE,REWARD_APPLY,...events],
  observeEffect(parent:ScheduledEvent,outputs:readonly CanonicalValue[]){if(!active||parent.dueAt!==at||parent.phase!==110n||key(parent.eventTypeId)!==key(ACTION_BODY_EVENT)||seenEffect)fail('actual effect lifecycle');seenEffect=true;
   const effect=selectedBodyEffect(parent.payload,C,actuator),row=outputs.find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(ACTION_BODY)));if(!row)fail('actual effect missing');const a=items(row!,'list');if(key(a[1])!==key(effect.outcomeId)||key(a[2])!==key(effect.attemptId)||key(a[3])!==key(effect.action))fail('actual effect association');
   if(key(effect.action)!==key(d.action))return undefined;actual=effect.outcomeId;applied=key(a[5])===key(text('Applied'));const emissions:EventEmission[]=[{dueAt:parent.dueAt,phase:110n,eventTypeId:REWARD_APPLY,payload:list([actual,applied]),dependencies:list([])}];return {emissions,bind:bind(parent,emissions)};
  },
  execute(context:EventHandlerContext<AuthoritativeState>){const {event:e,state}=context,source=key(e.eventTypeId)===key(REWARD_SOURCE),effect=key(e.eventTypeId)===key(REWARD_APPLY),index=events.findIndex(x=>key(x)===key(e.eventTypeId));
   if(!active||e.dueAt!==at||used.has(e.eventId)||(source?(e.phase!==10n||setting||!originals.some(x=>fp(x)===fp(e))):(!pending.delete(fp(e))||(effect?e.phase!==110n:index<0||e.phase!==phases[index]))))fail('source/child authentication');used.add(e.eventId);
   let nextState=state,outputs:CanonicalValue[]=[],quant:CanonicalValue[]=[],emissions:EventEmission[]=[],reads:ActualReadRecord[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[],receipt:RewardReceipt|undefined;
   const emit=(i:number,payload:CanonicalValue)=>emissions.push({dueAt:simInstant(at),phase:phases[i],eventTypeId:events[i],payload,dependencies:list([])});
   function write(impulse:boolean){const prior=read(state,path),result=rewardTransition(prior.value,at,d,impulse);reads.push(...prior.reads);quant.push(...result.quant);patch={operations:[{kind:'set',path,expected:{presence:true,value:prior.value},newValue:result.value}]};const changed=stateModel.applyPatch(state,patch,BODY_OWNER,{writableRoots:[455n],targetPaths:[path]});nextState=changed.state;diffs=changed.diffs;outputs.push(list([text(REWARD+'/physical'),prior.value,result.value,list(result.terms)]));return rewardAnchor(result.value).level;}
   function sample(level:number,lane:'Current'|'Consequence'){const s=setting??fail('missing sensor'),value=rewardSense(level,d,s),observation=typedIdentifier(1115,u(context.allocateRuntimeId())),reservation=admitObservationLane({observerId:txt(BODY_OBSERVER.payload),lane,dueAt:at,emitsCharacterAccessibleEvidence:true},()=>context.allocateRuntimeId()).reservation!;reservations.push(reservation);if(value!==undefined)quant.push(list([text('reward-sensor-floor'),u(level),u(d.baseline),signed(s.bias),u(d.resolution),u(value)]));const sample=list([text(REWARD_SAMPLE),observation,C,signed(at),list(value===undefined?[]:[u(value)]),text(lane)]);outputs.push(sample);emit(lane==='Current'?0:6,list([sample,u(reservation.experienceId)]));}
   if(source){setting=rewardSource(e.payload);const roster:StatePath={rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:BODY_OBSERVER}]},binding=read(state,roster);if(key(f(rec(binding.value,267n),1n))!==key(C))fail('observer binding');reads.push(...binding.reads);sample(write(false),'Current');emit(5,list([]));}
   else if(effect){if(!actual||key(e.payload)!==key(list([actual,applied])))fail('effect receipt');write(applied);}
   else if(index===5){const prior=read(state,path);reads.push(...prior.reads);if(rewardAnchor(prior.value).at!==at)fail('consequence clock');sample(rewardAnchor(prior.value).level,'Consequence');}
   else {const carrier=items(e.payload,'list'),sample=items(carrier[0],'list');if(carrier.length!==2||sample.length!==6||txt(sample[0])!==REWARD_SAMPLE||time(sample[3])!==at||key(sample[2])!==key(C))fail('carrier');
    if([0,1,2,6,7,8].includes(index))emit(index+1,e.payload);
    else if(index===3||index===9){const experienceId=uint(carrier[1]),reservation=reservations.find(r=>r.experienceId===experienceId);if(!reservation)fail('experience reservation');const experience=assemblePreRecognitionExperience({experienceId,observerId:txt(BODY_OBSERVER.payload),occurredAt:at,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:[{observerId:txt(BODY_OBSERVER.payload),observationId:uint(id(sample[1]).payload)}],transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'}),frozen=freezeAndStageSemanticExperience(reservation!,experience,e.phase);staged.push(frozen);const value=preRecognitionSemanticExperienceValue(frozen.experience);outputs.push(value);
     if(index===3)emit(4,list([carrier[0],value]));else {const v=items(sample[4],'list'),after=v.length?integer(v[0]):undefined,delta=before===undefined||after===undefined?undefined:Math.max(0,after-before),occurrence=typedIdentifier(1164,u(context.allocateRuntimeId())),safe=list([text(REWARD_RECEIPT),occurrence,signed(at),current??list([]),carrier[0],value,list(delta===undefined?[]:[u(delta)]),list(actual?[actual]:[]),applied]);outputs.push(safe);receipt={id:occurrence,at,delta,performed:applied,allowed:setting!.learn,receipt:safe};}
    }else if(index===4){if(current)fail('duplicate current');current=list([text(REWARD_RECEIPT),sample[1],signed(at),carrier[0],carrier[1]]);const value=items(sample[4],'list');before=value.length?integer(value[0]):undefined;outputs.push(current);}else fail('phase');
   }
   const bindChildren=bind(e,emissions);return {nextState,outputs,receipt,emittedEvents:emissions,traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){bindChildren(children);return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event:e,seamId:bodyId(1036,'seam/assembled-reward-experience'),seamVersion:REWARD_VERSION,recordKind:e.eventTypeId,subjectIds:[id(C),BODY_OBSERVER],sourceRecordIds:[],registeredReadDomain:reads.map(r=>pattern(r.path)),actualReadRecords:reads,inputProjection:e.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:quant,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];}};
  },
  prepareCommit(){if(!active||pending.size||unbound||originals.some(e=>e.dueAt===at&&!used.has(e.eventId)))fail('unfinished instant');validateSuccessfulExperienceSettlement(reservations,staged);},
  close(){active=false;pending.clear();used.clear();current=undefined;setting=undefined;reservations=[];staged=[];unbound=0;}
 };
}
