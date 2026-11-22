/** Maintained protective meaning joins the one reason/identity path. */
import {list,set,map,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import type {AuthoritativeState,ActualReadRecord} from '../substrate/state';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
import {dataItems as items,dataField as f,dataKey as key,dataText as txt,invalidModel} from '../campaign2/canonicalData';
import {readQ,qValue,choiceAlignment,ZERO,ONE} from '../campaign2/cognitiveMath';
import {cognitiveRecord as r,cognitiveNamed as named,receivingRecord as rec} from './codecs';
import {controlGoalPath,maintenancePath,controlValue} from './control';
import {formationPath,formationValue} from './formation';
import {sid} from './skill';
import type {TimeLimit} from './timeDomain';
export const PROTECTION='assembled-protection/0.1',PROTECTION_VERSION='assembled-character-protection/0.1-candidate';
export const PROTECTION_CHANNEL=sid(1041,'Protection'),PROTECTION_GOAL='protectiveGoal',PROTECTION_STANDING='protectiveStanding';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
export function compileProtection(v:CanonicalValue,actions:readonly {action:CanonicalValue;count:bigint}[],tasks:readonly CanonicalValue[],labels:readonly string[]){
 const a=items(v,'list');if(a.length!==4||txt(a[0])!==PROTECTION||!actions.some(x=>eq(x.action,a[1])&&x.count===0n)||!tasks.some(t=>eq(t,a[2]))||labels.some(x=>[PROTECTION_GOAL,PROTECTION_STANDING].includes(x)))invalidModel('protective declaration action/task/label');
 const importance=readQ(a[3]);if(importance.compare(ZERO)<0||importance.compare(ONE)>0)invalidModel('protective importance domain');return {action:a[1],task:a[2],importance};
}
export function protectionMeanings(rawValue:CanonicalValue){
 const raw=rec(rawValue,403n),options=items(f(rec(f(raw,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n)),meaning=new Map(options.map(c=>[key(c),ZERO]));
 if(raw.schema.schemaVersion>=3n)for(const value of items(f(raw,6n),'list')){const d=items(value,'list');if(txt(d[0])!==PROTECTION_GOAL)continue;const s=rec(d[2],402n),candidate=f(rec(f(s,1n),401n),1n);if(!meaning.has(key(candidate)))invalidModel('protective source absent candidate');meaning.set(key(candidate),meaning.get(key(candidate))!.add(readQ(f(s,2n))));}
 return meaning;
}
export function protectiveExpression(expression:CanonicalValue){
 const e=rec(expression,426n),resolution=rec(f(rec(f(e,2n),425n),2n),409n),data=rec(f(rec(f(resolution,4n),419n),2n),420n),raw=f(rec(f(resolution,3n),408n),2n),meanings=protectionMeanings(raw),channels=[...items(f(e,3n),'list')];
 if([...meanings.values()].some(v=>!v.equals(ZERO)))channels.push(r(427,[PROTECTION_CHANNEL,qValue(choiceAlignment(f(data,1n),meanings))],2));
 return r(426,[f(e,1n),f(e,2n),list(channels),f(e,4n)],2);
}
export function protectiveRaw(settings:ReturnType<typeof compileProtection>,input:CanonicalValue,state:AuthoritativeState,stateModel:ReturnType<typeof compileCampaign2StateModel>,timeLimit:TimeLimit,feedback=true,currentGoal?:{active:boolean;receipt:CanonicalValue}){
 const raw=rec(input,403n);if(raw.schema.schemaVersion!==3n)invalidModel('protective described raw required');const C=f(rec(settings.task,371n),1n),reads:ActualReadRecord[]=[];
 const get=(path:ReturnType<typeof formationPath>)=>{const v=stateModel.read(state,path);reads.push({accessorId:sid(1028,'accessor/protective-meaning'),path,presence:v.presence,value:v.value,derivedSources:[]});return v.value;};
 const goal=controlValue(get(controlGoalPath(C)),true,timeLimit),maintained=controlValue(get(maintenancePath(C)),false,timeLimit),prior=formationValue(get(formationPath(C,PROTECTION_CHANNEL)),timeLimit);
 const descriptions=[...items(f(raw,6n),'list')],signals=[...items(f(raw,3n),'set')],options=items(f(rec(f(raw,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n)),candidate=r(395,[C,settings.action]),live=(currentGoal?.active??goal.active)&&maintained.maintained&&options.some(c=>eq(c,candidate));
 const emit=(label:string,role:number,strength:ReturnType<typeof readQ>,basis:CanonicalValue)=>{if(strength.equals(ZERO))return;const s=r(402,[r(401,[candidate,settings.task,u(role)]),qValue(strength),basis]);signals.push(s);descriptions.push(list([text(label),sid(1040,'Commitment'),s]));};
 if(live)emit(PROTECTION_GOAL,1,settings.importance,r(400,[map([])]));
 const staged=r(403,[f(raw,1n),f(raw,2n),set(signals),f(raw,4n),f(raw,5n),list(descriptions)],3),meanings=protectionMeanings(staged),alignment=live?choiceAlignment(candidate,meanings):ZERO,strength=live&&feedback?prior.P.multiply(alignment):ZERO;
 const basis=r(400,[map(prior.entries.map(e=>[named(399,{VariantTag:u(2),QualificationOccurrenceId:items(e,'list')[0]}),qValue(ONE)]))]);emit(PROTECTION_STANDING,3,strength,basis);
 return {output:r(403,[f(raw,1n),f(raw,2n),set(signals),f(raw,4n),f(raw,5n),list(descriptions)],3),reads,report:list([text(PROTECTION),live,settings.task,candidate,qValue(live?settings.importance:ZERO),qValue(prior.P),qValue(alignment),qValue(strength),list(prior.entries.map(e=>items(e,'list')[0])),...(currentGoal?[currentGoal.receipt]:[])])};
}
