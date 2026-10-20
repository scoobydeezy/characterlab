import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {OPTIONS,TASKS,PROPOSITIONS,type AffectSettings} from '../campaign3/affectModel';
import {AFFECT_CANDIDATES} from '../campaign3/affectFactorComparison';
import {explainBelief} from './beliefExplanations';
import {exactKey,exactText} from './canonical';
export const AFFECT_RENDERER='affect-evaluation-explanation/0.1';
export interface AffectExplanation {id:string;renderer:string;kind:'Learning'|'Appraisal'|'Decision';at:string;headline:string;human:string;provenance:string;}
type Profile=Pick<AffectSettings,'candidate'|'controlLaw'|'learningLaw'|'feedback'>;
const q=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('AFFECT explanation requires rational');return `${v.numerator}/${v.denominator}`;};
const integer=(v:CanonicalValue)=>{if(typeof v==='boolean'||!['signed','unsigned'].includes(v.kind))throw Error('AFFECT explanation requires integer');return String((v as Extract<CanonicalValue,{kind:'signed'|'unsigned'}>).value);};
const actions=OPTIONS.map(exactKey),grounds=TASKS.map(t=>exactKey(f(rec(t,371n),2n)));
const action=(v:CanonicalValue)=>{const i=actions.indexOf(exactKey(v));if(i<0)throw Error('Unknown AFFECT option');return ['mitigate danger','continue the obligation'][i];};
const ground=(v:CanonicalValue)=>{const i=grounds.indexOf(exactKey(v));if(i<0)throw Error('Unknown AFFECT ground');return ['adopted safety goal','adopted competing obligation'][i];};
/** Only evaluation records. No current-state resolver, trace, seed or physical-world input. */
export function explainAffect(outputs:readonly CanonicalValue[],profile:Profile):AffectExplanation[]{
 if(![1,2,3].includes(profile.candidate)||![1,2].includes(profile.controlLaw)||![1,2,3].includes(profile.learningLaw)||typeof profile.feedback!=='boolean')throw Error('Unknown AFFECT explanation profile');
 const cards:AffectExplanation[]=[];
 for(const output of outputs){
  if(typeof output==='boolean'||output.kind!=='record'||output.schema.schemaVersion!==1n||![741n,742n,750n,751n,752n,754n,755n,756n,757n,758n,759n,760n,761n,762n].includes(output.schema.typeId))throw Error('Unclassified AFFECT output');
  // Physical outcome762 is deliberately classified but not narrated as character knowledge.
  if(output.schema.typeId===742n){const e=explainBelief([output],profile.learningLaw)[0],target=PROPOSITIONS.map(exactKey).indexOf(e.proposition);if(target<0)throw Error('Unknown AFFECT learning target');cards.push({id:e.id,renderer:AFFECT_RENDERER,kind:'Learning',at:e.at!,headline:`Learning about ${['current-cue outcome','baseline outcome','mitigation outcome'][target]}`,human:e.human,provenance:e.provenance});continue;}
  if(output.schema.typeId===754n){
   const a=rec(output,754n),at=integer(f(a,2n)),optional=(n:bigint)=>a.fields.has(n)?q(f(a,n)):'unavailable (not zero)',raw=items(f(a,5n),'list').map(q),coords=items(f(a,6n),'list').map(q);
   const context=a.fields.has(7n)?rec(f(a,7n),750n):null,catalogue=context?integer(f(context,9n)):'0';if(!['0','1','2'].includes(catalogue))throw Error('Unknown AFFECT catalogue');
   const availability=['Action availability is unknown.','The observed catalogue contains no available mitigation action.','The observed catalogue lists mitigation as available.'][Number(catalogue)];
   const control=profile.controlLaw===1?'RelativeReduction expresses efficacy relative to the baseline estimate.':'AbsoluteReduction expresses efficacy as a probability reduction; its units differ from RelativeReduction.';
   const hasPrevious=a.fields.has(11n)||a.fields.has(12n)||a.fields.has(13n);
   if(hasPrevious&&(!profile.feedback||![11n,12n,13n].every(n=>a.fields.has(n))))throw Error('Incomplete AFFECT feedback provenance');
   const feedback=hasPrevious?`Feedback references the completed appraisal at instant ${integer(f(a,12n))}, with recorded feedback magnitude ${q(f(a,13n))}.`:'No prior appraisal feedback is recorded.';
   const coordinates=coords.length?`${AFFECT_CANDIDATES[profile.candidate-1]} records raw coordinates [${raw.join(', ')}] and resulting coordinates [${coords.join(', ')}].`:`${AFFECT_CANDIDATES[profile.candidate-1]} records unavailable coordinates; this is not a zero-valued affect.`;
   cards.push({id:exactKey(f(a,1n)),renderer:AFFECT_RENDERER,kind:'Appraisal',at,headline:'Recorded affect factors',human:`At appraisal ${at}, likelihood is ${optional(8n)}, goal severity ${q(f(a,4n))}, vulnerability ${optional(9n)}, and control ${optional(10n)}. Recorded mitigation efficacy is ${optional(14n)}. ${availability} ${control} ${coordinates} ${feedback} These coordinates are derived evaluations, not independent stored emotion state.`,provenance:exactText(a)});
  }else if(output.schema.typeId===757n){
   const d=rec(output,757n),at=integer(f(d,2n)),reasons=rec(f(d,3n),756n),nuclei=items(f(reasons,3n),'list'),mode=integer(f(d,5n));if(!['1','2','3'].includes(mode))throw Error('Unknown AFFECT decision mode');
   const bases=nuclei.map(v=>{const n=rec(v,407n),k=rec(f(n,1n),404n),roles=rec(f(n,2n),406n),direction=integer(f(k,4n));if(!['1','2'].includes(direction))throw Error('Unknown AFFECT reason direction');return `The ${ground(f(k,3n))} ${direction==='1'?'supports':'opposes'} ${action(f(k,1n))}: base contribution ${q(f(roles,1n))}, standing contribution ${q(f(roles,2n))}, situational contribution ${q(f(roles,3n))}; compiled die d${integer(f(n,4n))}, standing modifier ${integer(f(n,5n))}, situational modifier ${integer(f(n,6n))}.`;});
   const probabilities=items(f(d,4n),'list').map(v=>{const p=rec(v,421n);return `${action(f(p,1n))}: ${q(f(p,2n))}`;}).join('; '),draws=items(f(d,6n),'list');
   const chosen=d.fields.has(8n)?`The selected option is ${action(f(d,8n))}.`:'No option was selected.';
   const scoreMap=f(d,7n);if(typeof scoreMap==='boolean'||scoreMap.kind!=='map')throw Error('Invalid AFFECT scores');
   const scores=mode!=='1'&&draws.length?` Recorded realized scores: ${scoreMap.entries.map(([k,v])=>`${action(k)} ${integer(v)}`).join('; ')}.`:'';
   cards.push({id:exactKey(f(d,1n)),renderer:AFFECT_RENDERER,kind:'Decision',at,headline:chosen,human:`At decision ${at}, ${['','Auto','QuietRoll','PlayerFacingRoll'][Number(mode)]} arbitration records analytical option probabilities ${probabilities}. ${chosen} ${bases.length?bases.join(' '):'There are no compiled reason nuclei.'} ${draws.length} addressed random draws were recorded.${scores} Mechanical randomness is not evidence uncertainty. Selection does not establish execution success or an observed consequence.`,provenance:exactText(d)});
  }
 }
 return cards;
}
