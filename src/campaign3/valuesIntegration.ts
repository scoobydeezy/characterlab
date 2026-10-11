/** values-integration-component/0.1-candidate. Native ownership is a separate gate. */
import {canonicalEncode as enc,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as field,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {intentOutput,expressionOutput,planOutput,attemptOutput,executionOutput} from '../campaign2/cognitiveChoice';
import {receivingRecord as inherited} from './receivingCodecs';
import {data} from './biologyPublicData';
import {createValuesOwner,restoreValuesOwner,VALUE_LAWS,type ValueLaw,type ValueReceipt,type ValueProjection} from './valuesComponent';
import {probeValue,projectionValue} from './valuesPublicModel';
import {valuesNativeReasons,valuesNativeChoice,valuesPublicRows} from './valuesPublicMath';

export const VERSION='values-integration-component/0.1-candidate';
export type AppraisalLaw='ValueRelative'|'NoValueAppraisal';
export type Mode='ValuesOnly'|'NeedOnly'|'Joint';
export interface IntegrationProfile {law:ValueLaw;appraisal:AppraisalLaw;seed:number;}
export interface IntegrationFrame {
 instant:number;opportunity:boolean;linked:boolean;need:0|1;direction:-1|1;mode:Mode;
 command:'None'|'Adopt'|'Retire';
 world:{permitted:boolean;outcome:-1|0|1};
 observation:{visible:boolean;category:boolean;display:'Actual'|'Positive'|'Neutral'|'Negative';goalVisible:boolean;goalDisplay:'Actual'|'Present'|'Absent';forecast:0|1|null};
}
export interface IntegrationGoal {id:'goal/values-duty';status:'Absent'|'Open'|'Fulfilled'|'Retired';adoptedAt:number|null;changedAt:number|null;}
export interface IntegrationWorld {total:number;executions:number;last:{instant:number;chosen:'A'|'B'|null;executed:boolean;outcome:-1|0|1|null};}
export interface IntegrationObservation {instant:number;chosen:'A'|'B'|null;receipt:ValueReceipt|null;criterion:boolean|null;forecast:0|1|null;}
export const emptyGoal=():IntegrationGoal=>({id:'goal/values-duty',status:'Absent',adoptedAt:null,changedAt:null});
export const emptyWorld=():IntegrationWorld=>({total:0,executions:0,last:{instant:0,chosen:null,executed:false,outcome:null}});
export const fraction=(x:Q)=>`${x.numerator}/${x.denominator}`;
const parse=(s:string)=>{const [n,d]=s.split('/').map(BigInt);return Q.of(n,d);};
const clone=<T>(x:T):T=>structuredClone(x);
export const equalBytes=(a:Uint8Array,b:Uint8Array)=>a.length===b.length&&a.every((x,i)=>x===b[i]);
export const hex=(x:Uint8Array)=>Array.from(x,b=>b.toString(16).padStart(2,'0')).join('');
export function fromHex(s:string){if(!/^(?:[0-9a-f]{2})*$/.test(s))throw Error('VI_HEX');return Uint8Array.from(s.match(/../g)??[],x=>parseInt(x,16));}
function fields(x:object,names:string[]){
 if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('VI_FIELDS');
 const ds=Object.getOwnPropertyDescriptors(x);
 if(Reflect.ownKeys(ds).length!==names.length||names.some(n=>!ds[n]||!('value'in ds[n])))throw Error('VI_FIELDS');
}
export function validateProfile(x:IntegrationProfile){
 data(x);fields(x,['law','appraisal','seed']);
 if(!VALUE_LAWS.includes(x.law)||!['ValueRelative','NoValueAppraisal'].includes(x.appraisal)||!Number.isInteger(x.seed)||x.seed<0||x.seed>255)throw Error('VI_PROFILE');
 return clone(x);
}
export function validateFrame(x:IntegrationFrame){
 data(x);fields(x,['instant','opportunity','linked','need','direction','mode','command','world','observation']);
 fields(x.world,['permitted','outcome']);fields(x.observation,['visible','category','display','goalVisible','goalDisplay','forecast']);
 if(!Number.isInteger(x.instant)||x.instant<1||x.instant>64||![0,1].includes(x.need)||![-1,1].includes(x.direction)||!['ValuesOnly','NeedOnly','Joint'].includes(x.mode)||!['None','Adopt','Retire'].includes(x.command))throw Error('VI_FRAME');
 for(const b of [x.opportunity,x.linked,x.world.permitted,x.observation.visible,x.observation.category,x.observation.goalVisible])if(typeof b!=='boolean')throw Error('VI_BOOLEAN');
 if(![-1,0,1].includes(x.world.outcome)||!['Actual','Positive','Neutral','Negative'].includes(x.observation.display)||!['Actual','Present','Absent'].includes(x.observation.goalDisplay)||![0,1,null].includes(x.observation.forecast))throw Error('VI_SOURCE');
 return clone(x);
}
export function validateFrames(xs:readonly IntegrationFrame[]){
 data(xs);if(!Array.isArray(xs)||xs.length<1||xs.length>64)throw Error('VI_HORIZON');
 let at=0;return xs.map(x=>{const f=validateFrame(x);if(f.instant<=at)throw Error('VI_ORDER');at=f.instant;return f;});
}
export function appraiseValues(view:ValueProjection,forecast:0|1|null,goal:IntegrationGoal,context:Pick<IntegrationFrame,'linked'|'direction'>,law:AppraisalLaw){
 const preference=law==='NoValueAppraisal'?Q.of(0n):parse(view.preference);
 const meaning=forecast===null?null:fraction(preference.multiply(Q.of(BigInt(forecast*context.direction*(context.linked?1:0)))));
 const q=meaning===null?null:parse(meaning),zero=Q.of(0n);
 return {belief:forecast,preference:view.preference,knownValue:view.mean!==null,valueMeaning:meaning,goalRelevance:goal.status==='Open'?1:0,
  anticipatedBenefit:q===null?null:fraction(q.compare(zero)>0?q:zero),anticipatedCost:q===null?null:fraction(q.compare(zero)<0?zero.subtract(q):zero)};
}
/** World-only transition. Cognitive owners receive neither this input nor its result. */
export function advanceValuesWorld(prior:IntegrationWorld,at:number,chosen:'A'|'B'|null,executed:boolean,physical:IntegrationFrame['world']):IntegrationWorld {
 if(executed&&chosen===null)throw Error('VI_WORLD_WITHOUT_ACTION');
 const outcome=chosen===null?null:executed?physical.outcome:-1;
 return {total:prior.total+(executed?physical.outcome:0),executions:prior.executions+(executed?1:0),last:{instant:at,chosen,executed,outcome}};
}
/** Permitted sensor projection; false/withheld displays cannot rewrite physical history. */
export function observeValues(world:IntegrationWorld,source:IntegrationFrame['observation']):IntegrationObservation {
 const w=world.last,report=source.display==='Actual'?w.outcome:source.display==='Positive'?1:source.display==='Negative'?-1:0;
 const receipt:ValueReceipt|null=w.chosen===null||!source.visible?null:{instant:w.instant,id:w.instant,category:source.category?'Care':null,target:w.chosen,outcome:report};
 return {instant:w.instant,chosen:w.chosen,receipt,criterion:!source.goalVisible?null:source.goalDisplay==='Present'?true:source.goalDisplay==='Absent'?false:w.chosen==='B'&&w.executed,forecast:source.forecast};
}
/** Evidence-relative fulfillment, with terminal identity retained. Never reads world truth. */
export function settleValuesGoal(prior:IntegrationGoal,at:number,command:IntegrationFrame['command'],observation:IntegrationObservation):IntegrationGoal {
 if(command==='Adopt'){
  if(prior.status!=='Absent')throw Error('VI_GOAL_REUSE');
  return {...prior,status:'Open',adoptedAt:at,changedAt:at};
 }
 if(command==='Retire'){
  if(prior.status!=='Open')throw Error('VI_GOAL_RETIRE');
  return {...prior,status:'Retired',changedAt:at};
 }
 return prior.status==='Open'&&observation.criterion===true?{...prior,status:'Fulfilled',changedAt:at}:clone(prior);
}
export function integrationReasons(profile:IntegrationProfile,frame:Pick<IntegrationFrame,'instant'|'opportunity'|'linked'|'need'|'mode'>,view:ValueProjection,goal:IntegrationGoal){
 if(!frame.opportunity)return null;
 return valuesNativeReasons(probeValue({instant:frame.instant,seed:profile.seed,currentNeed:frame.need,goal:goal.status==='Open'?1:0,linked:frame.linked,mode:frame.mode}),projectionValue(view));
}
export function actionStages(at:number,resolution:CanonicalValue|null){
 if(!resolution||uint(field(rec(field(rec(resolution,409n),4n),419n),1n))!==3n)return {intent:null,expression:null,plan:null,attempt:null};
 const occ=(ns:number,offset:number)=>typedIdentifier(ns,u(at*100+offset));
 const intent=intentOutput(occ(1136,1),resolution),expression=expressionOutput(occ(1137,2),intent),plan=planOutput(occ(1139,3),intent,inherited(391,[u(1)])),attempt=attemptOutput(occ(1140,4),plan);
 return {intent,expression,plan,attempt};
}
export function executeValuesAttempt(at:number,attempt:CanonicalValue|null,permitted:boolean){
 return attempt?executionOutput(typedIdentifier(1141,u(at*100+5)),attempt,permitted):null;
}
export function createValuesIntegration(profileInput:IntegrationProfile,inputs:readonly IntegrationFrame[]){
 const profile=validateProfile(profileInput),frames=validateFrames(inputs);
 let owner=createValuesOwner(profile.law),goal=emptyGoal(),world=emptyWorld(),forecast:0|1|null=null,prefix=0,busy=false;
 const rows:ReturnType<typeof rowShape>[]=[];
 function rowShape(frame:IntegrationFrame,before:ValueProjection,appraisal:ReturnType<typeof appraiseValues>,chosen:'A'|'B'|null,status:string,observation:IntegrationObservation,action:ReturnType<typeof actionStages>,resolution:CanonicalValue|null){
  return {instant:frame.instant,before,after:owner.view(65),appraisal,chosen,status,observation,goal:clone(goal),forecast,
   intent:action.intent?hex(enc(action.intent)):null,expression:action.expression?hex(enc(action.expression)):null,resolution:resolution?hex(enc(resolution)):null};
 }
 const check=()=>{if(busy)throw Error('VI_BUSY');};
 const save=()=>{check();return enc(data({version:VERSION,profile,frames,prefix,goal,world,forecast,history:hex(owner.save()),rows}));};
 return Object.freeze({save,
  snapshot(){check();return clone({prefix,goal,world,forecast,view:owner.view(65),rows});},
  observerView(){check();return clone({goal,forecast,view:owner.view(65),rows});},
  async step(fault?:'after-choice'|'after-world'|'before-commit'){
   check();if(prefix===frames.length)return false;busy=true;
   const savedOwner=owner.save(),savedGoal=clone(goal),savedWorld=clone(world),savedForecast=forecast;
   try{
    const frame=frames[prefix],before=owner.view(frame.instant),appraisal=appraiseValues(before,forecast,goal,frame,profile.appraisal),operands=integrationReasons(profile,frame,before,goal);
    const choice=operands?await valuesNativeChoice(operands):null,row=choice?valuesPublicRows([choice.output])[0]:null,resolution=row?.resolution??null;
    if(fault==='after-choice')throw Error('VI_INJECTED');
    const action=actionStages(frame.instant,resolution),execution=executeValuesAttempt(frame.instant,action.attempt,frame.world.permitted);
    world=advanceValuesWorld(world,frame.instant,row?.chosen as 'A'|'B'|null??null,!!execution&&uint(field(rec(execution,433n),3n))>0n,frame.world);
    if(fault==='after-world')throw Error('VI_INJECTED');
    const observation=observeValues(world,frame.observation);
    goal=settleValuesGoal(goal,frame.instant,frame.command,observation);
    if(observation.receipt)owner.admit(observation.receipt);
    if(observation.forecast!==null)forecast=observation.forecast;
    if(fault==='before-commit')throw Error('VI_INJECTED');
    rows.push(rowShape(frame,before,appraisal,row?.chosen as 'A'|'B'|null??null,row?.status??'NoOpportunity',observation,action,resolution));prefix++;return true;
   }catch(e){owner=restoreValuesOwner(profile.law,savedOwner);goal=savedGoal;world=savedWorld;forecast=savedForecast;throw e;}
   finally{busy=false;}
  }
 });
}
export async function restoreValuesIntegration(profile:IntegrationProfile,frames:readonly IntegrationFrame[],prefix:number,saved:Uint8Array){
 if(!Number.isInteger(prefix)||prefix<0||prefix>frames.length)throw Error('VI_PREFIX');
 const copy=saved.slice(),run=createValuesIntegration(profile,frames);for(let i=0;i<prefix;i++)await run.step();
 if(!equalBytes(run.save(),copy))throw Error('VI_ORIGINAL_MISMATCH');return run;
}
