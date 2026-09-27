/** multisource-source-join/0.1-candidate. Trusted transaction, not public model ingress. */
import {canonicalEncode as enc,cloneCanonicalValue,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath} from '../substrate/state';
import {simInstant} from '../substrate/time';
import {ExactRational as Q} from '../substrate/exactMath';
import {decodeReceiving} from './receivingCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {workspaceOutput,appraisalOutput,concernOutput,motiveOutput,candidateOutput,rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {observeLocalReserveOpportunity} from './localReserveObservation';
import type {LocalReserveSource} from './localReserveSource';
import {selectLocalReserveSignals,closeInteroceptiveSignals} from './interoceptiveSignalSelection';
import {produceMultisourceSelectedSource,type ReserveCriterion,type TaskReserveCriterion} from './multisourceSelectedSource';
import {receivingRecord as r} from './receivingCodecs';
import {readQ,ZERO,ONE} from '../campaign2/cognitiveMath';

export const MULTISOURCE_SOURCE_JOIN_VERSION='multisource-source-join/0.1-candidate';
export interface MultisourceJoinDeclaration {
 readonly observer:CanonicalValue;readonly holder:CanonicalValue;readonly taskKey:CanonicalValue;
 readonly taskSpec:CanonicalValue;readonly taskInstruction:CanonicalValue;readonly action:CanonicalValue;readonly bodyInstruction:CanonicalValue;
 readonly workspaceId:CanonicalValue;readonly workspaceDefinition:CanonicalValue;readonly concernDefinition:CanonicalValue;readonly motiveDefinition:CanonicalValue;
 readonly activeFrom:bigint;readonly deadline:bigint;
 readonly channels:readonly {readonly channel:string;readonly signal:string}[];readonly capacity:number;
 readonly body:ReserveCriterion;readonly task:TaskReserveCriterion;
}
export interface MultisourceJoinProfile {readonly kind:'MultisourceJoinProfile'}
const profiles=new WeakMap<MultisourceJoinProfile,MultisourceJoinDeclaration>();
const copy=(v:CanonicalValue)=>decodeReceiving(enc(v));
function identity(v:CanonicalValue,ns:bigint){const c=copy(v);if(typeof c==='boolean'||c.kind!=='typedIdentifier'||c.namespaceId!==ns)throw Error('MULTISOURCE_JOIN_IDENTITY');return c;}
const threshold=(q:Q)=>{if(!(q instanceof Q)||q.compare(Q.of(0n))<=0)throw Error('MULTISOURCE_JOIN_THRESHOLD');return Q.of(q.numerator,q.denominator);};
export function compileMultisourceJoin(declaration:MultisourceJoinDeclaration):MultisourceJoinProfile {
 const d=declaration,observer=identity(d.observer,1000n),holder=copy(d.holder),taskKey=rec(copy(d.taskKey),371n);
 if(key(f(taskKey,1n))!==key(holder))throw Error('MULTISOURCE_JOIN_TASK_HOLDER');
 const workspaceDefinition=rec(copy(d.workspaceDefinition),378n),concernDefinition=rec(copy(d.concernDefinition),385n),motiveDefinition=rec(copy(d.motiveDefinition),392n);
 if(uint(f(workspaceDefinition,2n))!==1n||f(workspaceDefinition,3n)!==true||f(workspaceDefinition,4n)!==false)throw Error('MULTISOURCE_JOIN_WORKSPACE_PROFILE');
 const pressure=readQ(f(motiveDefinition,1n)),gain=readQ(f(concernDefinition,1n));
 if(pressure.compare(ZERO)<=0||pressure.compare(ONE)>0||gain.compare(ZERO)<0||gain.compare(ONE)>0)throw Error('MULTISOURCE_JOIN_PARAMETER');
 simInstant(d.activeFrom);simInstant(d.deadline);if(d.deadline<=d.activeFrom)throw Error('MULTISOURCE_JOIN_WINDOW');
 if(!Array.isArray(d.channels)||d.channels.length!==3||!Number.isSafeInteger(d.capacity)||d.capacity<0||d.capacity>3)throw Error('MULTISOURCE_JOIN_CHANNELS');
 const channels=Array.from(d.channels,c=>{if(!c||!/^channel\/[A-Za-z0-9_-]+$/.test(c.channel)||!/^interoceptive-signal\/[A-Za-z0-9_-]+$/.test(c.signal))throw Error('MULTISOURCE_JOIN_CHANNEL');return {...c};});
 if(new Set(channels.map(c=>c.channel)).size!==3||new Set(channels.map(c=>c.signal)).size!==3)throw Error('MULTISOURCE_JOIN_MAPPING');
 if(!channels.some(c=>c.signal===d.body.signal)||!channels.some(c=>c.signal===d.task.signal)||!['FavorBelow','DisfavorBelow'].includes(d.task.direction))throw Error('MULTISOURCE_JOIN_CRITERION');
 const value:MultisourceJoinDeclaration={observer,holder,taskKey,taskSpec:identity(d.taskSpec,1027n),taskInstruction:identity(d.taskInstruction,1027n),action:identity(d.action,1027n),bodyInstruction:identity(d.bodyInstruction,1027n),workspaceId:identity(d.workspaceId,1027n),workspaceDefinition,concernDefinition,motiveDefinition,activeFrom:d.activeFrom,deadline:d.deadline,channels,capacity:d.capacity,body:{signal:d.body.signal,threshold:threshold(d.body.threshold)},task:{signal:d.task.signal,threshold:threshold(d.task.threshold),direction:d.task.direction}};
 const token:MultisourceJoinProfile=Object.freeze({kind:'MultisourceJoinProfile'});profiles.set(token,value);return token;
}

export function executeMultisourceJoin(profile:MultisourceJoinProfile,state:AuthoritativeState,source:LocalReserveSource,at:bigint,allocate:()=>bigint){
 const d=profiles.get(profile);if(!d)throw Error('MULTISOURCE_JOIN_UNCOMPILED');
 if(!(state instanceof AuthoritativeState))throw Error('MULTISOURCE_JOIN_STATE');
 simInstant(at);if(at<d.activeFrom||at>=d.deadline)throw Error('MULTISOURCE_JOIN_TIME');
 const reads:{name:string;path:StatePath;value:CanonicalValue|undefined}[]=[];
 function read(name:string,root:bigint,field:bigint,selector:CanonicalValue){
  const path:StatePath={rootStateTypeId:root,fieldId:field,selectors:[{kind:'mapKey',key:selector}]};
  const value=state.read(path).value;reads.push({name,path:structuredClone(path),value:value===undefined?undefined:cloneCanonicalValue(value)});return value===undefined?undefined:copy(value);
 }
 const self=read('qualified-holder',268n,1n,d.observer);
 if(self===undefined||key(f(rec(self,267n),1n))!==key(d.holder))throw Error('MULTISOURCE_JOIN_SELF');
 const status=read('task-status',373n,1n,d.taskKey);
 if(status===undefined||uint(f(rec(status,372n),1n))!==1n)throw Error('MULTISOURCE_JOIN_INACTIVE_TASK');
 const plan=read('selected-task-instruction',373n,2n,d.taskKey);
 if(plan===undefined||key(f(rec(plan,390n),1n))!==key(d.taskInstruction))throw Error('MULTISOURCE_JOIN_TASK_PLAN');
 const bodyAdoption=read('adopted-body-instructions',487n,1n,d.holder);
 if(bodyAdoption===undefined||!items(f(rec(bodyAdoption,486n),1n),'set').some(v=>key(v)===key(d.bodyInstruction)))throw Error('MULTISOURCE_JOIN_BODY_PLAN');
 const used=new Set<bigint>(),next=()=>{const n=allocate();if(typeof n!=='bigint'||n<0n||used.has(n))throw Error('MULTISOURCE_JOIN_ALLOCATION');used.add(n);return n;};
 const occurrence=(ns:number)=>typedIdentifier(ns,unsigned(next()));
 const forbidden=():never=>{throw Error('MULTISOURCE_JOIN_FORBIDDEN_READ');};
 const workspace=workspaceOutput(occurrence(1128),d.holder,d.workspaceId,d.workspaceDefinition,[{key:d.taskKey,specId:d.taskSpec,activeFrom:d.activeFrom,deadline:d.deadline}],at,{status:()=>status,prediction:forbidden}).output;
 const appraisal=appraisalOutput(occurrence(1129),workspace,[{taskKey:d.taskKey,specId:d.taskSpec,minimum:Q.of(0n),maximum:Q.of(10n)}]);
 const concern=concernOutput(occurrence(1130),appraisal,d.concernDefinition),motive=motiveOutput(occurrence(1131),concern,d.motiveDefinition);
 const candidates=candidateOutput(occurrence(1132),motive,true,()=>({instructionId:d.taskInstruction,actionId:d.action}));
 const taskRaw=rawSignalOutput(occurrence(1133),candidates,false,Q.of(1n),forbidden).output;
 const observed=observeLocalReserveOpportunity(source,d.observer as Extract<CanonicalValue,{kind:'typedIdentifier'}>,at,d.channels.map(c=>c.channel),'Current',next);
 for(const c of observed.declarations){const expected=d.channels.find(v=>key(typedIdentifier(1005,{kind:'text',value:v.channel}))===key(c.channel));if(!expected||expected.signal!==c.signal)throw Error('MULTISOURCE_JOIN_SOURCE_MAPPING');}
 const selected=selectLocalReserveSignals(observed,{maxSignals:3,maxViewsPerSignal:1,maxBytesPerSignal:4096,capacity:d.capacity});
 try{
  const result=produceMultisourceSelectedSource(selected.view,{observer:d.observer,taskRaw,taskKey:d.taskKey,option:r(395,[d.holder,d.action]),body:d.body,task:d.task});
  return {version:MULTISOURCE_SOURCE_JOIN_VERSION,at,observer:cloneCanonicalValue(d.observer),holder:cloneCanonicalValue(d.holder),reads,taskRaw,sourceAudit:observed,selectionAudit:selected.audit,result};
 }finally{closeInteroceptiveSignals(selected.view);}
}
