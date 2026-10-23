/** longitudinal-personal-loss-component/0.1-candidate. Versioned contract in docs/formal. */
import {canonicalEncode as enc,text,list,signed,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {readQ} from '../campaign2/cognitiveMath';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {relationshipRecord as rr} from './relationshipCodecs';
import {appendRelationship,relationshipSummary} from './relationshipMath';
import {beliefRecord as br} from './beliefCodecs';
import {applyBeliefEvidence,classifyBeliefSample} from './beliefMath';
import {compareAffectFactors} from './affectFactorComparison';
import {ACTOR,OBSERVER,sid} from './longitudinalModel';
import {goalReceivingChoice} from './longitudinalGoalChoice';
import {adoptMaintenanceGoal,settleMaintenanceGoal,readMaintenanceConcern,type MaintenanceGoal} from './bodilyMaintenanceGoal';

export const LOSS_VERSION='longitudinal-personal-loss-component/0.1-candidate';
export const LOSS_LAWS=['Latest','Mean','NoLearning','NoAffect','HistoricalProduct'] as const;
export const LOSS_CONDITIONS=['ReportedLoss','HiddenLoss','NoLoss','FalseLoss','Corrected','Recovered','OneInteraction','MaskedAcquisition','WithdrawnGoal','HighControl','FailedSupport','StrongContinuity'] as const;
export interface LossProfile {law:typeof LOSS_LAWS[number];condition:typeof LOSS_CONDITIONS[number];seed:number}
const zero=Q.of(0n),one=Q.of(1n),domains=new Map([['contact',{lower:zero,upper:one}],['support',{lower:zero,upper:one}]]);
const frac=(q:Q)=>`${q.numerator}/${q.denominator}`;
const target=semanticReferentFromAuthoredContent(sid(1038,'content/personal-loss/partner'));
const settings={candidate:1,law:1,reverse:false};
const goalView=(gs:readonly MaintenanceGoal[])=>gs.map(g=>({id:g.goal,status:g.status,adoptedAt:String(g.adoptedAt),activeFrom:String(g.activeFrom),expiresAt:String(g.expiresAt),changedAt:String(g.changedAt)}));
/** Restricted character-side operands: physical availability is intentionally absent. */
export function assessPersonalLoss(history:CanonicalValue,belief:CanonicalValue|undefined,goals:readonly MaintenanceGoal[],at:number,control:Q,projection:'SplitExposure'|'HistoricalProduct'){
 const summary=relationshipSummary(settings,history),count=Number(uint(f(rec(summary,851n),1n)));
 const continuity=readMaintenanceConcern(goals,'longitudinal-target','continuity',BigInt(at),domains).kind==='Active';
 const support=readMaintenanceConcern(goals,'longitudinal-target','support',BigInt(at),domains).kind==='Active';
 const availability=belief?readQ(f(rec(belief,739n),1n)):undefined,likelihood=availability?one.subtract(availability):undefined;
 const severity=continuity?one:zero,projected=compareAffectFactors({likelihood,severity,vulnerability:one,control},projection);
 return {count,continuity,support,availability:availability?frac(availability):null,likelihood:likelihood?frac(likelihood):null,severity:frac(severity),control:frac(control),coordinates:projected.status==='Known'?projected.coordinates.map(frac):[],modifier:projected.status==='Known'?Number(projected.coordinates.at(-1)!.numerator*1000n/projected.coordinates.at(-1)!.denominator):0};
}
export function createPersonalLossRun(input:LossProfile){
 if(!input||!LOSS_LAWS.includes(input.law)||!LOSS_CONDITIONS.includes(input.condition)||!Number.isInteger(input.seed)||input.seed<0||input.seed>255)throw Error('LOSS_PROFILE');
 const profile=Object.freeze({...input});let prefix=0,busy=false,history:CanonicalValue=rr(847,[list([])]),belief:CanonicalValue|undefined,goals:readonly MaintenanceGoal[]=[];
 const rows:{at:number;historyBefore:string;historyAfter:string;beliefBefore:string|null;beliefAfter:string|null;goalsBefore:ReturnType<typeof goalView>;goalsAfter:ReturnType<typeof goalView>;appraisal:ReturnType<typeof assessPersonalLoss>;choice:Awaited<ReturnType<typeof goalReceivingChoice>>;participated:boolean;admitted:boolean;report:boolean|null;physicalContact:boolean;contactCompleted:boolean;supportCompleted:boolean}[]=[];
 const read=()=>{if(busy)throw Error('LOSS_BUSY');};
 const snapshot=()=>{read();return structuredClone({version:LOSS_VERSION,profile,actor:key(ACTOR),target:key(target),prefix,history:key(history),belief:belief?key(belief):null,goals:goalView(goals),rows});};
 const save=()=>enc(text(JSON.stringify(snapshot())));
 return Object.freeze({snapshot,save,async step(fault?:'after-choice'|'before-commit'){
  if(busy)throw Error('LOSS_CONCURRENT');if(prefix===12)return false;busy=true;
  try{
   const at=prefix+1,c=profile.condition,acquiring=at<=2,offered=acquiring&&!(c==='OneInteraction'&&at===2);
   const appraisal=assessPersonalLoss(history,belief,goals,at,c==='HighControl'?one:zero,profile.law==='HistoricalProduct'?'HistoricalProduct':'SplitExposure');
   const grounds:Parameters<typeof goalReceivingChoice>[1]=acquiring?(offered?[{option:'contact',domain:'joint-invitation',strength:1000}]:[]):[
    ...(appraisal.continuity?[{option:'contact',domain:'continuity',strength:c==='StrongContinuity'?1000:500}]:[]),
    ...(appraisal.support?[{option:'support',domain:'support',strength:250,situation:profile.law==='NoAffect'?0:appraisal.modifier}]:[])];
   const choice=await goalReceivingChoice(acquiring?(offered?['contact']:[]):['contact','support'],grounds,400+at,profile.seed,true);
   if(fault==='after-choice')throw Error('LOSS_INJECTED');
   // Truth-side execution receives intent; it never supplies the appraisal operands.
   const physicalContact=at<4||['NoLoss','FalseLoss','Corrected'].includes(c)||c==='Recovered'&&at>=9;
   const contactCompleted=choice.chosen==='contact'&&physicalContact,supportCompleted=choice.chosen==='support'&&c!=='FailedSupport';
   const participated=acquiring&&offered&&contactCompleted,admitted=participated&&c!=='MaskedAcquisition';
   let nextHistory=history,nextBelief=belief,nextGoals=goals;
   if(acquiring){const observation=rr(845,[typedIdentifier(1156,u(400+at)),OBSERVER,target,signed(at),admitted,participated,u(participated?1:0)]);nextHistory=appendRelationship(history,observation).next;}
   if(at===3){const count=uint(f(rec(relationshipSummary(settings,nextHistory),851n),1n));for(const name of count>=2n?['continuity','support']:['support'])nextGoals=adoptMaintenanceGoal(nextGoals,{character:'longitudinal-target',goal:name,signal:name==='continuity'?'contact':'support',desired:{lower:one,upper:one},adoptedAt:3n,activeFrom:4n,expiresAt:13n},domains);}
   if(at===4&&c==='WithdrawnGoal')nextGoals=settleMaintenanceGoal(nextGoals,'longitudinal-target','continuity',4n,'Withdraw',domains);
   const report=at===3?true:at===4&&!['HiddenLoss','NoLoss'].includes(c)?false:at===8&&['Corrected','Recovered'].includes(c)?true:null;
   if(report!==null){const sample=br(737,[typedIdentifier(1115,u(400+at)),OBSERVER,sid(1027,'proposition/personal-loss/contact'),signed(at),true,true,report]),evidence=br(741,[typedIdentifier(1150,u(400+at)),sample,u(classifyBeliefSample(sample))]);nextBelief=applyBeliefEvidence(belief,evidence,profile.law==='Mean'?1:profile.law==='NoLearning'?3:2).next;}
   const row={at,historyBefore:key(history),historyAfter:key(nextHistory),beliefBefore:belief?key(belief):null,beliefAfter:nextBelief?key(nextBelief):null,goalsBefore:goalView(goals),goalsAfter:goalView(nextGoals),appraisal,choice,participated,admitted,report,physicalContact,contactCompleted,supportCompleted};
   if(fault==='before-commit')throw Error('LOSS_INJECTED');history=nextHistory;belief=nextBelief;goals=nextGoals;rows.push(row);prefix++;return true;
  }finally{busy=false;}
 }});
}
export async function restorePersonalLossRun(profile:LossProfile,prefix:number,saved:Uint8Array){
 if(!Number.isInteger(prefix)||prefix<0||prefix>12)throw Error('LOSS_PREFIX');const r=createPersonalLossRun(profile);for(let i=0;i<prefix;i++)await r.step();const actual=r.save();if(actual.length!==saved.length||actual.some((b,i)=>b!==saved[i]))throw Error('LOSS_SAVE_MISMATCH');return r;
}
