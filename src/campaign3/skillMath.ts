import {list,map,set,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {ONE,ZERO,readQ,qValue,compileReasonNuclei,readDistribution,analyzeOptions,absolute,expectation} from '../campaign2/cognitiveMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {skillRecord as r} from './skillCodecs';
import {receivingRecord as old} from './receivingCodecs';
import {TASK,OPTION,type SkillCompiled,type SkillSettings} from './skillModel';
const min=(a:Q,b:Q)=>a.compare(b)<0?a:b,max=(a:Q,b:Q)=>a.compare(b)>0?a:b;
export function skillRaw(app:CanonicalValue,adopted:boolean,occ:CanonicalValue){return r(789,[occ,app,list(adopted?[old(402,[old(401,[OPTION,TASK,u(1)]),qValue(ONE),old(400,[map([])])])]:[])]);}
export function skillReasons(model:SkillCompiled,raw:CanonicalValue,occ:CanonicalValue){return r(790,[occ,raw,list(compileReasonNuclei(items(f(rec(raw,789n),3n),'list'),f(model.content,5n)))]);}
export function skillDecision(reasons:CanonicalValue,occ:CanonicalValue){
 const nuclei=items(f(rec(reasons,790n),3n),'list'),distribution=nuclei.length?readDistribution(f(rec(nuclei[0],407n),7n)):new Map([[0n,ONE]]);
 // A single option has contest=0 for every distribution. Any admissible positive
 // roll threshold gives Auto; use1, never the invalid zero threshold.
 const analysis=analyzeOptions([{key:OPTION,distribution,reasonMass:absolute(expectation(distribution))}],ONE,ZERO);if(analysis.mode!=='Auto')throw Error('SKILL_SINGLE_OPTION_MODE');
 return r(791,[occ,reasons,list(analysis.probabilities.map(p=>old(421,[p.key,qValue(p.probability)]))),...(nuclei.length?[OPTION]:[])]);
}
export function skillExecute(settings:SkillSettings,attempt:CanonicalValue,original:CanonicalValue,skill:CanonicalValue,belief:CanonicalValue|undefined,occ:CanonicalValue){
 const src=rec(original,783n),plan=rec(f(rec(attempt,795n),2n),794n),k=readQ(f(rec(skill,784n),1n)),i=readQ(f(src,2n)),d=readQ(f(src,3n)),engaged=plan.fields.has(3n)&&f(src,4n)===true;
 const actual=settings.executionLaw===3?(belief?readQ(f(rec(belief,786n),1n)):ZERO):k,e=settings.executionLaw===2?max(ZERO,actual.subtract(i)):actual.multiply(ONE.subtract(i));
 return r(796,[occ,attempt,skill,qValue(i),qValue(d),engaged,engaged&&(settings.executionLaw===4||e.compare(d)>=0),engaged&&f(src,5n)===true,qValue(e)]);
}
export function skillObserve(outcome:CanonicalValue,original:CanonicalValue,occ:CanonicalValue){
 const out=rec(outcome,796n),src=rec(original,783n),visible=f(src,6n)===true,engaged=visible&&f(out,6n)===true,report=uint(f(src,7n));
 return r(797,[occ,f(src,1n),engaged,...(engaged?[report===0n?f(out,7n):report===1n]:[])]);
}
export function adaptSkill(settings:SkillSettings,prior:CanonicalValue,practice:CanonicalValue){
 const p=rec(prior,784n),e=rec(practice,798n),k=readQ(f(p,1n)),i=readQ(f(e,5n)),exposed=f(e,3n)===true&&f(e,4n)===true&&settings.practiceLaw!==3;
 let next=settings.permanent?max(ZERO,k.subtract(i)):k;
 if(exposed)next=settings.practiceLaw===1?min(ONE,next.add(Q.of(1n,4n))):next.add(ONE.subtract(next).divide(Q.of(2n)));
 return {next:r(784,[qValue(next),u(uint(f(p,2n))+(exposed?1n:0n))]),applied:exposed||next.compare(k)!==0};
}
export function learnSkill(settings:SkillSettings,prior:CanonicalValue|undefined,observation:CanonicalValue){
 const o=rec(observation,797n);if(f(o,3n)!==true||!o.fields.has(4n)||settings.beliefLaw===3)return {next:prior,applied:false};
 const b=prior?rec(prior,786n):undefined,support=b?items(f(b,3n),'set'):[],id=f(o,1n);if(support.some(x=>key(x)===key(id))||support.length>=8)throw Error('SKILL_DUPLICATE_OR_BOUND');
 const n=BigInt(support.length),x=f(o,4n)===true?ONE:ZERO,mean=b&&settings.beliefLaw===1?readQ(f(b,1n)).multiply(Q.of(n)).add(x).divide(Q.of(n+1n)):x;
 return {next:r(786,[qValue(mean),u(n+1n),set([...support,id])]),applied:true};
}
