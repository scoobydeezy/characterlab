/** One BODY_OWNER sleep leaf and current evidence adapter; no scheduler/save/RNG. */
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
import {stressPath,stressAnchor,stressTransition,type StressDeclaration} from './regulatoryStress';
import {pattern} from './skill';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const SLEEP='assembled-sleep-control/0.1',SLEEP_VERSION=SLEEP+'-candidate',SLEEP_SAMPLE=SLEEP+'/sample',SLEEP_RECEIPT=SLEEP+'/receipt',READINESS=SLEEP+'/readiness';
export const SLEEP_LOAD='assembled-sleep-control/0.2',SLEEP_LOAD_VERSION=SLEEP_LOAD+'-candidate';
export const SLEEP_SOURCE=bodyId(1001,'event/assembled-sleep-source');
const phases=[11n,12n,13n,14n,20n,120n],internal=phases.map(p=>bodyId(1001,'event/assembled-sleep-'+p));
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','sleep: '+s);};
const bounded=(v:CanonicalValue,max=1000n)=>{const n=uint(v);if(n>max)fail('integer domain');return Number(n);};
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<0n||v.value>1000001n)fail('anchor time');return (v as {value:bigint}).value;};
const clamp=(n:number)=>Math.max(0,Math.min(1000,n)),fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
export function compileSleep(value:CanonicalValue,loadEnabled=false){
 const a=items(value,'list');if(a.length!==7||txt(a[0])!==(loadEnabled?SLEEP_LOAD:SLEEP)||typeof a[1]!=='boolean')fail('declaration');
 const [accumulation,recovery,nightDrive,threshold,resolution]=a.slice(2).map(v=>bounded(v));if(!resolution)fail('resolution');
 return Object.freeze({loadEnabled,enabled:a[1] as boolean,accumulation,recovery,nightDrive,threshold,resolution});
}
export type SleepDeclaration=ReturnType<typeof compileSleep>;
export const sleepPath=(C:CanonicalValue):StatePath=>({rootStateTypeId:455n,fieldId:3n,selectors:[{kind:'mapKey',key:C}]});
export function sleepAnchor(v:CanonicalValue){const a=items(v,'list');if(a.length!==6||txt(a[0])!==SLEEP)fail('anchor');return {at:time(a[1]),debt:bounded(a[2]),phase:bounded(a[3],23n),burden:bounded(a[4]),arousal:bounded(a[5])};}
export const sleepValue=(at:bigint,debt:number,phase=8,burden=0,arousal=500)=>list([text(SLEEP),signed(at),u(debt),u(phase),u(burden),u(arousal)]);
/** Exact port of Full elapsed sleep/phase and consequence recovery, without other owners. */
export function sleepElapsed(value:CanonicalValue,at:bigint,d:SleepDeclaration){
 const p=sleepAnchor(value);if(at<p.at||at>1000000n)fail('elapsed time');const dt=Number(at-p.at);
 return sleepValue(at,clamp(p.debt+dt*d.accumulation),(p.phase+dt)%24,p.burden,p.arousal);
}
export function sleepRecover(value:CanonicalValue,asleep:boolean,d:SleepDeclaration){const p=sleepAnchor(value);return sleepValue(p.at,clamp(p.debt-(asleep?d.recovery:0)),p.phase,p.burden,p.arousal);}
export function sleepSource(value:CanonicalValue){
 const a=items(value,'list');if(a.length!==4||txt(a[0])!==SLEEP||typeof a[1]!=='boolean')fail('source');
 const permitted=items(a[2],'list'),bias=items(a[3],'list');if(permitted.length!==4||permitted.some(v=>typeof v!=='boolean')||bias.length!==4)fail('sensor axes');
 const offsets=bias.map(v=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value< -1000n||v.value>1000n)fail('sensor bias');return Number((v as {value:bigint}).value);});
 return {asleep:a[1] as boolean,permitted:permitted as readonly boolean[],bias:offsets};
}
export function readiness(values:readonly (number|undefined)[],d:SleepDeclaration,load:number|undefined=d.loadEnabled?undefined:0){
 if(values.length!==4)fail('readiness operands');const known=values.every(v=>v!==undefined)&&load!==undefined;
 if(load!==undefined&&(!Number.isInteger(load)||load<0||load>1000))fail('readiness load domain');
 for(const v of values)if(v!==undefined&&(!Number.isInteger(v)||v<0||v>1000))fail('readiness domain');
 const sum=known?BigInt(values[0]!+values[1]!+values[2]!+Math.abs(values[3]!-500)):undefined;
 const penalty=sum===undefined?undefined:roundEven(sum,2n),capacity=penalty===undefined?undefined:clamp(1000-Number(penalty)-load!);
 return {known,capacity,allowed:!d.enabled||capacity!==undefined&&capacity>=d.threshold,
  quant:sum===undefined?[]:[list([text('ties-even'),signed(sum),u(2),signed(penalty!)])]};
}
export interface SleepEvidence {receipt:CanonicalValue;values:readonly (number|undefined)[];event:ScheduledEvent;}
export function createSleepExecution(d:SleepDeclaration,stress:StressDeclaration,C:CanonicalValue,stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue){
 const path=sleepPath(C);let active=false,at=0n,unbound=0,current:SleepEvidence|undefined;
 let reservations:ExperienceReservation[]=[],staged:StagedSemanticExperience[]=[];const used=new Set<bigint>(),pending=new Set<string>();
 const read=(state:AuthoritativeState,p:StatePath)=>{const projection=new ContractReadProjection(state,[pattern(p)],{value:{kind:'direct',accessorId:bodyId(1028,'accessor/sleep-physical'),path:p}}),value=projection.read('value');if(!value)fail('required physical anchor');return {value:value!,reads:[...projection.actualReadRecords()]};};
 return {
  begin(t:bigint){if(active)fail('already active');active=true;at=t;unbound=0;current=undefined;pending.clear();used.clear();reservations=[];staged=[];},
  evidence:()=>current,
  eventTypes:()=>[SLEEP_SOURCE,...internal],
  execute(context:EventHandlerContext<AuthoritativeState>){
   const {event:e,state}=context;const source=key(e.eventTypeId)===key(SLEEP_SOURCE),index=internal.findIndex(x=>key(x)===key(e.eventTypeId));
   if(!active||e.dueAt!==at||used.has(e.eventId)||(source?(e.phase!==10n||!originals.some(x=>fp(x)===fp(e))):index<0||e.phase!==phases[index]||!pending.delete(fp(e))))fail('source/child authentication');
   used.add(e.eventId);
   let nextState=state,outputs:CanonicalValue[]=[],emissions:EventEmission[]=[],reads:ActualReadRecord[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[],quant:CanonicalValue[]=[],sources:ReturnType<typeof id>[]=[];
   const emit=(i:number,payload:CanonicalValue)=>emissions.push({dueAt:simInstant(at),phase:phases[i],eventTypeId:internal[i],payload,dependencies:list([])});
   function write(prior:CanonicalValue,value:CanonicalValue){patch={operations:[{kind:'set',path,expected:{presence:true,value:prior},newValue:value}]};const applied=stateModel.applyPatch(state,patch,BODY_OWNER,{writableRoots:[455n],targetPaths:[path]});nextState=applied.state;diffs=applied.diffs;}
   if(source){
    const roster:StatePath={rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:BODY_OBSERVER}]},binding=read(state,roster);if(key(f(rec(binding.value,267n),1n))!==key(C))fail('observer holder binding');reads.push(...binding.reads);
    const setting=sleepSource(e.payload),prior=read(state,path),elapsed=sleepElapsed(prior.value,at,d),physical=sleepAnchor(elapsed);reads.push(...prior.reads);write(prior.value,elapsed);
    let stressLevel:number|undefined;
    if(setting.permitted[1]){const s=read(state,stressPath(C)),transition=stressTransition(s.value,at,undefined,stress);reads.push(...s.reads);stressLevel=stressAnchor(transition.value).level;quant.push(...transition.quant);}
    const truth=[clamp(physical.debt+(physical.phase<6?d.nightDrive:0)),stressLevel,physical.burden,physical.arousal];
    const values=truth.map((v,i)=>setting.permitted[i]?Math.floor(clamp(v!+setting.bias[i])/d.resolution)*d.resolution:undefined);
    for(let i=0;i<4;i++)if(values[i]!==undefined)quant.push(list([text('sleep-sensor-floor'),u(i),u(truth[i]!),signed(setting.bias[i]),u(d.resolution),u(values[i]!)]));
    const observation=typedIdentifier(1115,u(context.allocateRuntimeId())),reservation=admitObservationLane({observerId:txt(BODY_OBSERVER.payload),lane:'Current',dueAt:at,emitsCharacterAccessibleEvidence:true},()=>context.allocateRuntimeId()).reservation!;reservations.push(reservation);
    const sample=list([text(SLEEP_SAMPLE),observation,C,signed(at),list(values.map(v=>list(v===undefined?[]:[u(v)])))]);
    outputs=[sample];emit(0,list([sample,u(reservation.experienceId)]));emit(5,list([text(SLEEP),setting.asleep]));
   }else if(index===5){
    const p=items(e.payload,'list');if(p.length!==2||txt(p[0])!==SLEEP||typeof p[1]!=='boolean')fail('consequence');const prior=read(state,path);if(sleepAnchor(prior.value).at!==at)fail('consequence without elapsed');
    reads=prior.reads;write(prior.value,sleepRecover(prior.value,p[1] as boolean,d));
   }else{
    const carrier=items(e.payload,'list'),sample=items(carrier[0],'list');if(carrier.length!==2||sample.length!==5||txt(sample[0])!==SLEEP_SAMPLE||time(sample[3])!==at||key(sample[2])!==key(C))fail('carrier');sources=[id(sample[1])];
    if(index<3)emit(index+1,e.payload);
    else if(index===3){
     const experienceId=uint(carrier[1]),reservation=reservations.find(r=>r.experienceId===experienceId);if(!reservation)fail('missing experience reservation');
     const obs=id(sample[1]).payload;const experience=assemblePreRecognitionExperience({experienceId,observerId:txt(BODY_OBSERVER.payload),occurredAt:at,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:[{observerId:txt(BODY_OBSERVER.payload),observationId:uint(obs)}],transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'});
     const frozen=freezeAndStageSemanticExperience(reservation!,experience,e.phase);staged.push(frozen);const value=preRecognitionSemanticExperienceValue(frozen.experience);outputs=[value];emit(4,list([carrier[0],value]));
    }else{
     if(current)fail('duplicate delivery');const values=items(sample[4],'list').map(v=>{const a=items(v,'list');if(a.length>1)fail('observation axis');return a.length?bounded(a[0]):undefined;});
     const receipt=list([text(SLEEP_RECEIPT),sample[1],signed(at),carrier[0],carrier[1]]);current={receipt,values,event:structuredClone(e)};outputs=[receipt];
    }
   }
   unbound++;let bound=false;
   return {nextState,outputs,emittedEvents:emissions,traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){
    if(bound||children.length!==emissions.length)fail('child binding');children.forEach((child,i)=>{const expected={...emissions[i],eventId:child.eventId,eventSequence:child.eventSequence,causalParentEventIds:[e.eventId]};if(child.eventSequence<=e.eventSequence||fp(child)!==fp(expected)||pending.has(fp(child)))fail('child mismatch');pending.add(fp(child));});bound=true;unbound--;
    return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event:e,seamId:bodyId(1036,'seam/assembled-sleep'),seamVersion:SLEEP_VERSION,recordKind:e.eventTypeId,subjectIds:[id(C),BODY_OBSERVER],sourceRecordIds:sources,registeredReadDomain:reads.map(r=>pattern(r.path)),actualReadRecords:reads,inputProjection:e.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:quant,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];
   }};
  },
  prepareCommit(){if(!active||pending.size||unbound||originals.some(e=>e.dueAt===at&&!used.has(e.eventId)))fail('unfinished instant');validateSuccessfulExperienceSettlement(reservations,staged);},
  close(){active=false;pending.clear();used.clear();current=undefined;reservations=[];staged=[];unbound=0;}
 };
}
