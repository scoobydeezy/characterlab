/** task-cognitive-path/0.1-candidate character-side transformations.
 * The trusted execution boundary authenticates parent outputs and supplies only
 * these restricted operands. No function here receives a model, world, registry,
 * state iterator, trace archive or execution permission. */
import {list,set,map,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {cognitiveRecord as r,cognitiveNamed as named} from './cognitiveCodecs';
import {ZERO,ONE,readQ,qValue,bounded,foldIdentityHistory} from './cognitiveMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,invalidModel} from './canonicalData';

export interface WorkspaceTask {readonly key:CanonicalValue;readonly specId:CanonicalValue;readonly activeFrom:bigint;readonly deadline:bigint;}
export interface WorkspaceReads {status(task:CanonicalValue):CanonicalValue|undefined;prediction():CanonicalValue|undefined;}
export function workspaceOutput(occurrence:CanonicalValue,character:CanonicalValue,agendaId:CanonicalValue,definition:CanonicalValue,tasks:readonly WorkspaceTask[],at:bigint,reads:WorkspaceReads){
 const d=rec(definition,378n),capacity=uint(f(d,2n));if(capacity>3n||tasks.length>2)invalidModel('workspace finite domain');
 const eligible=f(d,3n)===true?[...tasks].sort((a,b)=>key(a.key)<key(b.key)?-1:1).filter(task=>{
  if(key(f(rec(task.key,371n),1n))!==key(character))invalidModel('workspace foreign task');
  const prior=reads.status(task.key);return prior!==undefined&&uint(f(rec(prior,372n),1n))===1n&&task.activeFrom<=at&&at<task.deadline;
 }).sort((a,b)=>a.deadline<b.deadline?-1:a.deadline>b.deadline?1:key(a.key)<key(b.key)?-1:1):[];
 const selected=capacity===0n?[]:eligible.slice(0,capacity===3n?2:1);
 let forecast=r(380,[u(1)]),unavailable:'NoSelectedTask'|'CapacityExcluded'|'AccessDisabled'|'PriorAbsent'|undefined;
 if(!selected.length)unavailable='NoSelectedTask';
 else if(capacity<2n)unavailable='CapacityExcluded';
 else if(f(d,4n)!==true)unavailable='AccessDisabled';
 else {const prior=reads.prediction();if(prior===undefined)unavailable='PriorAbsent';else forecast=r(380,[u(2),prior]);}
 return {output:r(381,[occurrence,character,agendaId,list(selected.map(t=>r(379,[t.key,t.specId]))),forecast]),unavailable};
}

export interface AppraisalCriterion {readonly taskKey:CanonicalValue;readonly specId:CanonicalValue;readonly minimum:Q;readonly maximum:Q;}
export function appraisalOutput(occurrence:CanonicalValue,workspace:CanonicalValue,criteria:readonly AppraisalCriterion[]){
 const w=rec(workspace,381n),forecast=rec(f(w,5n),380n),mean=uint(f(forecast,1n))===1n?undefined:readQ(f(rec(f(forecast,2n),361n),1n));
 const assessments=items(f(w,4n),'list').map(item=>{
  const task=rec(item,379n),criterion=criteria.find(c=>key(c.taskKey)===key(f(task,1n))&&key(c.specId)===key(f(task,2n)));
  if(!criterion)invalidModel('missing selected task criterion');
  const {minimum:lo,maximum:hi}=criterion;if(lo.compare(ZERO)<0||hi.compare(Q.of(10n))>0||lo.compare(hi)>0)invalidModel('appraisal interval');
  let assessment=r(382,[u(1)]);
  if(mean!==undefined){if(mean.compare(ZERO)<0||mean.compare(Q.of(10n))>0)invalidModel('appraisal forecast domain');
   assessment=mean.compare(lo)<0?r(382,[u(2),qValue(lo.subtract(mean))]):mean.compare(hi)>0?r(382,[u(4),qValue(mean.subtract(hi))]):r(382,[u(3)]);}
  return r(383,[f(task,1n),assessment]);
 });
 return r(384,[occurrence,workspace,list(assessments)]);
}
export function concernOutput(occurrence:CanonicalValue,appraisal:CanonicalValue,definition:CanonicalValue){
 const a=rec(appraisal,384n),d=rec(definition,385n),gain=readQ(f(d,1n));if(gain.compare(ZERO)<0||gain.compare(ONE)>0)invalidModel('concern gain');
 const responses=items(f(a,3n),'list').map(item=>{const i=rec(item,383n),assessment=rec(f(i,2n),382n),tag=uint(f(assessment,1n));
  const response=f(d,2n)!==true||tag===1n?r(386,[u(1)]):r(386,[u(2),qValue(gain.multiply(tag===3n?ZERO:readQ(f(assessment,2n))).divide(Q.of(10n)))]);
  return r(387,[f(i,1n),response]);});
 return r(388,[occurrence,appraisal,list(responses)]);
}
function workspaceFromMotive(motive:CanonicalValue){return rec(f(rec(f(rec(f(rec(motive,394n),2n),388n),2n),384n),2n),381n);}
export function motiveOutput(occurrence:CanonicalValue,concern:CanonicalValue,definition:CanonicalValue){
 const d=rec(definition,392n),pressure=readQ(f(d,1n));if(pressure.compare(ZERO)<=0||pressure.compare(ONE)>0)invalidModel('motive pressure');
 const w=rec(f(rec(f(rec(concern,388n),2n),384n),2n),381n);
 return r(394,[occurrence,concern,list(f(d,2n)===true?items(f(w,4n),'list').map(v=>r(393,[f(rec(v,379n),1n),qValue(pressure)])):[])]);
}
export interface SelectedPlan {readonly instructionId:CanonicalValue;readonly actionId:CanonicalValue;}
export function candidateOutput(occurrence:CanonicalValue,motive:CanonicalValue,enabled:boolean,readPlan:(task:CanonicalValue)=>SelectedPlan|undefined){
 const w=workspaceFromMotive(motive),candidates=new Map<string,{candidate:CanonicalValue;origins:CanonicalValue[]}>();
 if(enabled)for(const value of items(f(w,4n),'list')){const task=f(rec(value,379n),1n),plan=readPlan(task);if(!plan)continue;
  const candidate=r(395,[f(w,2n),plan.actionId]),k=key(candidate),group=candidates.get(k)??{candidate,origins:[]};group.origins.push(r(396,[task,plan.instructionId]));candidates.set(k,group);}
 return r(398,[occurrence,motive,list([...candidates].sort(([a],[b])=>a<b?-1:1).map(([,c])=>r(397,[c.candidate,set(c.origins)])))]);
}

export function rawSignalOutput(occurrence:CanonicalValue,candidateOptions:CanonicalValue,standingEnabled:boolean,identityK:Q,readIdentity:()=>CanonicalValue|undefined){
 const options=rec(candidateOptions,398n),motive=rec(f(options,2n),394n),concern=rec(f(motive,2n),388n),w=workspaceFromMotive(motive),forecast=rec(f(w,5n),380n);
 const history=standingEnabled?readIdentity():undefined,contributions=history===undefined?[]:items(f(rec(history,414n),1n),'list');
 const fold=foldIdentityHistory(contributions,identityK),empty=r(400,[map([])]);
 const standingBasis=r(400,[map(contributions.map(v=>[named(399,{VariantTag:u(2),QualificationOccurrenceId:f(rec(v,413n),1n)}),qValue(ONE)]))]);
 const observationBasis=r(400,[map(uint(f(forecast,1n))===2n?items(f(rec(f(forecast,2n),361n),2n),'set').map(v=>[r(399,[u(1),v]),qValue(ONE)]):[])]);
 const motives=new Map(items(f(motive,3n),'list').map(v=>[key(f(rec(v,393n),1n)),readQ(f(rec(v,393n),2n))]));
 const responses=new Map(items(f(concern,3n),'list').map(v=>{const item=rec(v,387n),response=rec(f(item,2n),386n);return [key(f(item,1n)),uint(f(response,1n))===2n?readQ(f(response,2n)):ZERO];}));
 const signals:CanonicalValue[]=[],meaning:[CanonicalValue,CanonicalValue][]=[];
 for(const value of items(f(options,3n),'list')){const option=rec(value,397n),candidate=f(option,1n);let pressure=ZERO;
  for(const origin of items(f(option,2n),'set')){const task=f(rec(origin,396n),1n),p=motives.get(key(task))??ZERO,x=responses.get(key(task))??ZERO;
   const emit=(role:number,strength:Q,basis:CanonicalValue)=>{if(!strength.equals(ZERO))signals.push(r(402,[r(401,[candidate,task,u(role)]),qValue(strength),basis]));};
   emit(1,p,empty);emit(2,x,observationBasis);emit(3,fold.strength,standingBasis);pressure=pressure.add(p).add(x);
  }
  meaning.push([candidate,qValue(bounded(pressure))]);
 }
 return {output:r(403,[occurrence,candidateOptions,set(signals),map(meaning)]),quantizationOperations:fold.operations};
}
