import decision from '../../docs/formal/DECISION_PUBLIC_ALLOCATION_TABLE.json';
import cognitive from '../../docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json';
import {OPTIONS} from '../campaign3/decisionModel';
import {readable} from './canonical';
export const DECISION_RENDERER='decision-character-explanation/0.1';
type R=Record<string,unknown>;
const definitions=[...decision.records,...cognitive.records];
function rec(v:unknown,id:number):R{
 const d=definitions.find(d=>d.typeId===id)!;
 if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Invalid DECISION record');const r=v as R;
 if(r.record!==`${d.name}#${id}/1`||Object.keys(r).some(k=>k!=='record'&&!d.fields.some(f=>k===`${f.name} [${f.id}]`))||d.fields.some(f=>f.required&&!( `${f.name} [${f.id}]` in r)))throw Error('Unknown DECISION record schema');return r;
}
const f=(r:R,n:number)=>{const key=Object.keys(r).find(k=>k.endsWith(` [${n}]`));if(!key)throw Error('Missing DECISION field');return r[key];};
const list=(v:unknown):unknown[]=>{if(!Array.isArray(v))throw Error('Invalid DECISION list');return v;};
const integer=(v:unknown)=>{if(typeof v!=='string'||! /^-?(0|[1-9][0-9]*)$/.test(v))throw Error('Invalid DECISION integer');return v;};
const q=(v:unknown)=>{if(typeof v!=='string'||! /^-?(0|[1-9][0-9]*)\/[1-9][0-9]*$/.test(v))throw Error('Invalid DECISION rational');return v;};
const options=OPTIONS.map(o=>JSON.stringify(readable(o)));
function option(v:unknown){const i=options.indexOf(JSON.stringify(v));if(i<0)throw Error('Unknown DECISION option');return `option ${i===0?'A':'B'}`;}
const forbidden=new Set([110,410,411,422,423,932,935,936,937,938,939,940,942,949,950]);
function inspect(v:unknown):void{if(Array.isArray(v))v.forEach(inspect);else if(v&&typeof v==='object'){const r=v as R;if(typeof r.record==='string'){const match=/#([0-9]+)\/1$/.exec(r.record);if(!match||forbidden.has(Number(match[1])))throw Error('Private or unknown-version DECISION record');}Object.values(r).forEach(inspect);}}
export interface DecisionExplanation {sourceIndex:number;kind:string;occurrence:unknown;text:string;factors:string[];exact:string;}
/** Only the native closed character JSON projection; never current state or research outputs. */
export function explainDecisionCharacter(exact:string){
 const values=list(JSON.parse(exact));inspect(values);const cards:DecisionExplanation[]=[];
 values.forEach((value,sourceIndex)=>{
  const name=(value as R)?.record;if(typeof name!=='string')throw Error('Unknown DECISION output');const id=Number(/#([0-9]+)\/1$/.exec(name)?.[1]);
  if(![933,934,941,943,944,945,948].includes(id))throw Error('Unknown DECISION character output');const r=rec(value,id);let text='',kind='',factors:string[]=[];
  if(id===933){kind='Current observation';const slot=integer(f(r,4));if(slot!=='1'&&slot!=='2')throw Error('Unknown DECISION observed option');text=`At instant ${integer(f(r,3))}, the admitted current observation for option ${slot==='1'?'A':'B'} records contextual evidence ${q(f(r,5))}. This is observed evidence, not an unobserved world value.`;}
  if(id===934&&list(f(r,2)).length===0){kind='Current evidence unavailable';text='No current observation was admitted in this frozen context. Missing evidence is not an observed zero.';}
  if(id===941){kind='Consequence observation';if(typeof f(r,4)!=='boolean')throw Error('Invalid DECISION completion');text=`At instant ${integer(f(r,3))}, an admitted consequence observation reports ${f(r,4)?'completion':'non-completion'}. This observation is separate from the earlier selected intent.`;}
  if(id===944){
   kind='Selected intent and factors';const intent=rec(f(r,2),943),mode=integer(f(r,10));if(!['1','2','3'].includes(mode))throw Error('Unknown DECISION mode');
   const probabilities=list(f(r,4)).map(v=>{const p=rec(v,421);return `${option(f(p,1))} ${q(f(p,2))}`;});
   const context=rec(f(r,3),408),nuclei=list(f(context,3));
   factors=nuclei.map(v=>{const n=rec(v,407),key=rec(f(n,1),404),roles=rec(f(n,2),406),direction=integer(f(key,4));if(!['1','2'].includes(direction))throw Error('Unknown DECISION direction');return `A recorded reason ${direction==='1'?'supports':'opposes'} ${option(f(key,1))}: base ${q(f(roles,1))}, standing ${q(f(roles,2))}, situational ${q(f(roles,3))}, relevance ${q(f(n,3))}; compiled die d${integer(f(n,4))}, standing modifier ${integer(f(n,5))}, situational modifier ${integer(f(n,6))}. Exact ground, source coverage and score distribution remain in this report.`;});
   const channels=list(f(r,11)).map(v=>{const c=rec(v,427);return `Recorded channel ${JSON.stringify(f(c,1))} alignment ${q(f(c,2))}.`;});
   text=`The selected intent is ${option(f(intent,2))}. Recorded mode: ${['','Auto','QuietRoll','PlayerFacingRoll'][Number(mode)]}; analytical option probabilities: ${probabilities.join('; ')}. Recorded margin ${q(f(r,5))}, contest ${q(f(r,6))}, conflict mass ${q(f(r,7))}, stake ${q(f(r,8))}, and authorship potential ${q(f(r,9))}. These are the recorded profile's factors; they do not establish epistemic certainty, realized random scores, execution success or an observed consequence. ${channels.join(' ')}`;
  }
  if(text)cards.push({sourceIndex,kind,occurrence:f(r,1),text,factors,exact:JSON.stringify(value,null,2)});
 });
 return {version:DECISION_RENDERER,cards,scope:'Current observations, selected intent with recorded factors, and admitted consequence observations. History applications remain exact records, not newly inferred recollections. Analytical probabilities do not prove realized choice frequencies for retained alternative laws.',empty:cards.length?null:'No supported character evaluation has been recorded at this prefix.'};
}
