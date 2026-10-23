import {decodeLongitudinal as decode} from '../campaign3/longitudinalCodecs';
import {OBSERVER} from '../campaign3/longitudinalModel';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {canonicalEncode,bytesToHex,type CanonicalValue} from '../substrate/canonicalEncoding';
import {digest,exactText} from './canonical';
export const LONG_LANGUAGE_VERSION='long-observer-description/0.1';
const rational=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('Expected exact LONG rational');return `${v.numerator}/${v.denominator}`;};
const integer=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='unsigned')throw Error('Expected LONG count');return String(v.value);};
/** Only closed observer bytes enter this renderer. No model, seed, original input,
 * research snapshot, archived output or trace is available to template selection. */
export async function explainLongObserver(input:Uint8Array){
 const bytes=input.slice(),view=rec(decode(bytes),881n);if(bytesToHex(canonicalEncode(f(view,1n)))!==bytesToHex(canonicalEncode(OBSERVER)))throw Error('Unsupported LONG observer');
 const observerHash=await digest(bytes),skill=rec(f(view,3n),784n),relationship=rec(f(view,4n),851n),episodes=items(f(rec(f(view,5n),866n),1n),'list');
 const rows:{id:string;field:string;authority:'native-closed-observer';text:string;exact:string|null;present:boolean}[]=[];
 const add=(id:string,field:string,text:string,value?:CanonicalValue)=>rows.push({id,field,authority:'native-closed-observer',text,exact:value===undefined?null:exactText(value),present:value!==undefined});
 add('identity','881/2',`Retained identity strength is ${rational(f(view,2n))}.`,f(view,2n));
 add('skill','881/3',`Recorded competence is ${rational(f(skill,1n))}; recorded practice count is ${integer(f(skill,2n))}. This does not by itself establish success on a particular attempt.`,f(view,3n));
 const rupture=f(relationship,2n);if(typeof rupture!=='boolean')throw Error('Invalid LONG rupture');
 add('relationship','881/4',`The retained relationship summary records ${integer(f(relationship,1n))} cooperative interactions and rupture ${rupture?'true':'false'}. This is retained evidence, not a guarantee about the other person's current state.`,f(view,4n));
 add('episodes','881/5',`The current view exposes ${episodes.length} retained episodes. This count alone does not show whether earlier episodes existed or why any are absent.`,f(view,5n));
 if(view.fields.has(6n)){const person=f(view,6n),estimate=f(rec(person,869n),1n);if(typeof estimate!=='boolean')throw Error('Invalid LONG person estimate');add('person','881/6',`The current person estimate records ${estimate?'true':'false'}. It is an estimate and does not rewrite retained interaction history.`,person);}else add('person','881/6','No current person estimate is exposed. Absence is not a false estimate.');
 if(view.fields.has(7n)){const detail=f(view,7n),entries=items(f(rec(detail,866n),1n),'list');add('detail','881/7',`A detailed relationship journal is exposed with ${entries.length} entries. Its detail is distinct from the retained relationship summary.`,detail);}else add('detail','881/7','No detailed relationship journal is exposed by this view. This does not imply that the relationship summary is absent.');
 return{version:LONG_LANGUAGE_VERSION,observerHash,rows,scope:'Deterministic descriptions of current native observer fields only. No hidden-truth attribution, reason-factor explanation, causal reconstruction, forgetting history or general memory equivalence is inferred.'};
}
