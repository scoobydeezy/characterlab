import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {exactKey,exactText} from './canonical';
export const BELIEF_RENDERER='belief-evaluation-explanation/0.1';
export interface BeliefExplanation {id:string;renderer:string;kind:'Learning'|'Appraisal';proposition:string;at:string|null;human:string;known:boolean;provenance:string;}
const q=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('BELIEF explanation requires rational');return `${v.numerator}/${v.denominator}`;};
const weight=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='unsigned')throw Error('BELIEF explanation requires weight');return String(v.value);};
/** Native admitted output records only; no current state or truth-side resolver. */
export function explainBelief(outputs:readonly CanonicalValue[],law:number):BeliefExplanation[]{
 if(![1,2,3].includes(law))throw Error('Unknown BELIEF explanation law');
 const cards:BeliefExplanation[]=[];
 for(const output of outputs){
  if(typeof output==='boolean'||output.kind!=='record'||![737n,741n,742n,743n,744n].includes(output.schema.typeId))throw Error('Unclassified BELIEF output');
  if(output.schema.typeId===742n){
   const application=rec(output,742n),evidence=rec(f(application,2n),741n),sample=rec(f(evidence,2n),737n),classification=f(evidence,3n),at=f(sample,4n),applied=f(application,5n);
   if(typeof classification==='boolean'||classification.kind!=='unsigned'||classification.value<1n||classification.value>4n||typeof at==='boolean'||at.kind!=='signed'||typeof applied!=='boolean')throw Error('Invalid BELIEF learning record');
   const before=application.fields.has(3n)?rec(f(application,3n),739n):null,after=application.fields.has(4n)?rec(f(application,4n),739n):null;
   const evidenceText=['','The display reports an outcome with an opportunity and complete monitoring.','The display reports no outcome with an opportunity and complete monitoring.','The display indicates an opportunity but incomplete monitoring; absence of an outcome is not established.','The display indicates no opportunity; this is not evidence of an unsuccessful outcome.'][Number(classification.value)];
   const prior=before?`The prior estimate was ${q(f(before,1n))}, with evidence weight ${weight(f(before,2n))}.`:'No prior estimate was available; unknown is not zero.';
   const posterior=after?`The retained estimate is ${q(f(after,1n))}, with evidence weight ${weight(f(after,2n))}.`:'The estimate remains unknown, with no belief leaf stored.';
   cards.push({id:exactKey(f(application,1n)),renderer:BELIEF_RENDERER,kind:'Learning',proposition:exactKey(f(sample,3n)),at:String(at.value),known:!!after,
    human:`${evidenceText} ${prior} ${['','EvidenceMean','LastObservation','NoLearning'][law]} ${applied?'applied':'did not apply'} this observation. ${posterior} These are display-relative estimates, not access to physical truth. Evidence weight is not calibrated confidence.`,provenance:exactText(application)});
  }else if(output.schema.typeId===743n){
   const appraisal=rec(output,743n),key=rec(f(appraisal,2n),738n),prior=appraisal.fields.has(4n)?rec(f(appraisal,4n),739n):null,goal=q(f(appraisal,3n));
   const human=prior?`At this appraisal, the recorded estimate was ${q(f(prior,1n))}, with evidence weight ${weight(f(prior,2n))}. Goal sign ${goal} gives recorded signed expected outcome ${q(f(appraisal,5n))}. The confidence diagnostic is ${q(f(appraisal,6n))}; it measures accumulated evidence weight, not calibrated correctness. Goal sign does not rewrite the learned belief.`:`At this appraisal, no estimate was available. Goal sign ${goal} does not supply a missing belief; expected outcome and confidence diagnostic remain unavailable, not zero.`;
   cards.push({id:exactKey(f(appraisal,1n)),renderer:BELIEF_RENDERER,kind:'Appraisal',proposition:exactKey(f(key,2n)),at:null,human,known:!!prior,provenance:exactText(appraisal)});
  }
 }
 return cards;
}
