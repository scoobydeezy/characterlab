/** Action-indexed operands for the shared habit/reward execution, not a runtime. */
import {list,set,map,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataKey as key,dataItems as items,dataField as f} from '../campaign2/canonicalData';
import {readQ,bounded} from '../campaign2/cognitiveMath';
import {cognitiveRecord as r,receivingRecord as rec} from './codecs';
import {habitPath,rewardPath,habitJournal,rewardValue,cueStrength} from './habit';
import type {RewardDeclaration} from './rewardExperience';
import type {Strategy} from './strategy';
import type {ActualReadRecord,StatePath} from '../substrate/state';
import type {TimeLimit} from './timeDomain';
import {sid,q} from './skill';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b),zero=Q.of(0n);
type Read=(p:StatePath)=>{value?:CanonicalValue;record:ActualReadRecord};
type Current={practice:boolean;practiceAction?:CanonicalValue;receipt?:CanonicalValue};
export const actionRewardSubject=(C:CanonicalValue,action:CanonicalValue)=>list([C,action]);
export function rewardMotive(options:CanonicalValue,task:CanonicalValue){
 const motive=rec(f(rec(options,398n),2n),394n),row=items(f(motive,3n),'list').find(v=>eq(f(rec(v,393n),1n),task));
 return row?readQ(f(rec(row,393n),2n)):zero;
}
export function actionRewardCandidates(C:CanonicalValue,d:RewardDeclaration,routes:Strategy,read:Read,input:CanonicalValue,planner:CanonicalValue,cue:CanonicalValue|undefined,current:Current,at:bigint,timeLimit:TimeLimit,generalHabit=false){
 const a=rec(input,398n),demand=rewardMotive(a,d.task),reads:ActualReadRecord[]=[],reports:CanonicalValue[]=[],offers:CanonicalValue[]=[],c=cue?items(cue,'list'):undefined,visible=!!c&&items(c[3],'list').length===1;
 const options=items(f(a,3n),'list').flatMap(v=>{const o=rec(v,397n),before=items(f(o,2n),'set'),origins=before.filter(v=>!eq(f(rec(v,396n),1n),d.task));return origins.length||!before.length?[r(397,[f(o,1n),set(origins)])]:[];});
 const p=items(items(planner,'list')[3],'list').find(v=>eq(items(v,'list')[0],d.task)),route=routes.find(r=>eq(r.task,d.task))!;
 for(const action of d.actions){
  const subject=actionRewardSubject(C,action),hp=read(habitPath(subject)),bp=read(rewardPath(subject));reads.push(hp.record,bp.record);
  const history=habitJournal(hp.value,timeLimit,d.information?'informed':'observed'),belief=rewardValue(bp.value,timeLimit,d.information?'informed':'observed'),h=visible?cueStrength(history,items(c![3],'list')[0]===true,1,timeLimit,d.information?'informed':'observed'):zero;
  const index=route.plans.findIndex(r=>eq(r.actionId,action)),known=!!p&&eq(items(items(items(p,'list')[2],'list')[index],'list')[0],text('KnownAvailable'));
  const learned=belief?.mean!==undefined&&belief.mean>0n,eligible=current.practice?!!current.practiceAction&&eq(current.practiceAction,action):visible&&(learned||h.compare(Q.of(1n,2n))>=0),admitted=demand.compare(zero)>0&&known&&eligible;
  if(admitted){const candidate=r(395,[C,action]),origin=r(396,[d.task,route.plans[index].instructionId]),i=options.findIndex(v=>eq(f(rec(v,397n),1n),candidate));if(i<0)options.push(r(397,[candidate,set([origin])]));else options[i]=r(397,[candidate,set([...items(f(rec(options[i],397n),2n),'set'),origin])]);}
  // Habit supplies access to other live task routes, never their motivation.
  if(generalHabit&&!current.practice&&visible&&h.compare(Q.of(1n,2n))>=0){
   for(const row of items(items(planner,'list')[3],'list')){
    const pr=items(row,'list'),task=pr[0];
    if(eq(task,d.task)||rewardMotive(a,task).compare(zero)<=0)continue;
    const mapping=routes.find(v=>eq(v.task,task));if(!mapping)continue;
    for(const [i,plan] of mapping.plans.entries()){
     if(!eq(plan.actionId,action)||!eq(items(items(pr[2],'list')[i],'list')[0],text('KnownAvailable')))continue;
     const candidate=r(395,[C,action]),origin=r(396,[task,plan.instructionId]),at=options.findIndex(v=>eq(f(rec(v,397n),1n),candidate));
     const origins=at<0?[]:items(f(rec(options[at],397n),2n),'set'),added=!origins.some(v=>eq(v,origin));
     if(added){const value=r(397,[candidate,set([...origins,origin])]);if(at<0)options.push(value);else options[at]=value;}
     offers.push(list([action,task,plan.instructionId,added]));
    }
   }
  }
  reports.push(list([action,bp.value??list([]),hp.value??list([]),q(h),known,eligible,admitted]));
 }
 return {output:r(398,[f(a,1n),f(a,2n),list(options.sort((a,b)=>key(f(rec(a,397n),1n))<key(f(rec(b,397n),1n))?-1:1))]),reads,
 report:list([text('assembled-action-reward/candidates'),u(at),q(demand),cue??list([]),list(reports),...(generalHabit?[list([text('general-habit/origins'),list(offers)])]:[])])};
}
export function actionRewardRaw(C:CanonicalValue,d:RewardDeclaration,read:Read,input:CanonicalValue,current:Current,at:bigint,timeLimit:TimeLimit){
 const raw=rec(input,403n),options=rec(f(raw,2n),398n),demand=rewardMotive(options,d.task),reads:ActualReadRecord[]=[],reports:CanonicalValue[]=[];
 const isBase=(s:CanonicalValue)=>{const k=rec(f(rec(s,402n),1n),401n);return eq(f(k,2n),d.task)&&eq(f(k,3n),u(1));};
 const signals=items(f(raw,3n),'set').filter(s=>!isBase(s)),descriptions=items(f(raw,6n),'list').filter(v=>!isBase(items(v,'list')[2]));
 for(const action of d.actions){
  const bp=read(rewardPath(actionRewardSubject(C,action)));reads.push(bp.record);const belief=rewardValue(bp.value,timeLimit,d.information?'informed':'observed'),candidate=r(395,[C,action]);
  const present=items(f(options,3n),'list').some(v=>eq(f(rec(v,397n),1n),candidate)&&items(f(rec(v,397n),2n),'set').some(v=>eq(f(rec(v,396n),1n),d.task)));
  const practice=current.practice&&!!current.practiceAction&&eq(current.practiceAction,action),estimate=practice?Q.of(1n):belief?.mean===undefined?zero:Q.of(belief.mean,1000n),strength=demand.multiply(estimate);
  if(present&&strength.numerator){const basis=r(400,[map(practice?[]:belief!.supports.map(v=>[r(399,[u(3),v],2),q(Q.of(1n))]))]),signal=r(402,[r(401,[candidate,d.task,u(1)]),q(strength),basis]);signals.push(signal);descriptions.push(list([text(practice?'instructedPractice':d.information?'learnedReward':'experiencedPleasure'),sid(1040,'Commitment'),signal]));}
  reports.push(list([action,present,practice,bp.value??list([]),q(estimate),q(strength)]));
 }
 const meaning=map(items(f(options,3n),'list').map(v=>{const candidate=f(rec(v,397n),1n),sum=signals.reduce((n,s)=>{const row=rec(s,402n),k=rec(f(row,1n),401n);return eq(f(k,1n),candidate)&&!eq(f(k,3n),u(3))?n.add(readQ(f(row,2n))):n;},zero);return [candidate,q(bounded(sum))];}));
 return {output:r(403,[f(raw,1n),options,set(signals),meaning,f(raw,5n),list(descriptions)],3),reads,
 report:list([text('assembled-action-reward/reasons'),u(at),q(demand),list(reports),current.receipt??list([])])};
}
