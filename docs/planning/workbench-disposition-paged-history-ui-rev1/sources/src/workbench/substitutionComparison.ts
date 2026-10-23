import plan from '../../docs/planning/SUBSTITUTION_PLAN_REV1.json';
import type {SubstitutionSnapshot} from './substitutionAdapter';
import {digest,fromHex} from './canonical';
export interface SubstitutionContrast{id:string;a:string;b:string;kind:'model'|'input';changed:string;}
const program=(id:string)=>{const p=plan.runs.find(r=>r.law+'/'+r.name===id);if(!p)throw Error('Unknown SUBSTITUTION program');return p;};
const contrasts:SubstitutionContrast[]=[];
for(let i=0;i<plan.runs.length;i++)for(let j=i+1;j<plan.runs.length;j++){
 const a=plan.runs[i],b=plan.runs[j];if(a.law!==b.law&&JSON.stringify(a.input)===JSON.stringify(b.input))contrasts.push({id:`model/${a.law}/${b.law}/${a.name}`,a:a.law+'/'+a.name,b:b.law+'/'+b.name,kind:'model',changed:'Retained candidate law; identical original input calendar.'});
}
for(const p of plan.runs.filter(r=>r.law==='LatestHistory'&&r.name!=='diversified'))contrasts.push({id:'input/'+p.name,a:'LatestHistory/diversified',b:p.law+'/'+p.name,kind:'input',changed:'Original input calendar; inspect exact differences. Multiple changes are not asserted to be a single intervention.'});
for(const [id,a,b]of [['privacy/denied-feedback','deniedFeedback','hiddenBlocked'],['privacy/false-success','falseSuccess','trueSuccess'],['privacy/denied-information','deniedInfo','absentInfo'],['history/equal-estimates','correctedConcentrated','correctedDiversified'],['history/cue','correctedDiversified','otherCue'],['belief/informational-substitute','concentrated','knownAlternative']])contrasts.push({id,a:'LatestHistory/'+a,b:'LatestHistory/'+b,kind:'input',changed:'Named qualification contrast; exact calendars remain authoritative. Equal estimates do not imply equal full belief histories.'});
export const SUBSTITUTION_CONTRASTS:readonly SubstitutionContrast[]=Object.freeze(contrasts.map(c=>Object.freeze(c)));
function differences(a:unknown,b:unknown,path='$'):Array<{path:string;a:unknown;b:unknown}>{
 if(JSON.stringify(a)===JSON.stringify(b))return[];
 if(a!==null&&b!==null&&typeof a==='object'&&typeof b==='object'&&Array.isArray(a)===Array.isArray(b)){const x=a as Record<string,unknown>,y=b as Record<string,unknown>;return [...new Set([...Object.keys(x),...Object.keys(y)])].flatMap(k=>differences(x[k],y[k],path+'/'+k));}
 return[{path,a:a===undefined?{missing:true}:a,b:b===undefined?{missing:true}:b}];
}
export async function compareSubstitution(id:string,a:SubstitutionSnapshot,b:SubstitutionSnapshot){
 const c=SUBSTITUTION_CONTRASTS.find(c=>c.id===id);if(!c||a.program!==c.a||b.program!==c.b)throw Error('SUBSTITUTION requires declared ordered pair');const originals=[program(a.program),program(b.program)],encode=(v:unknown)=>new TextEncoder().encode(JSON.stringify(v));
 for(const [i,s]of [a,b].entries()){
  if(s.seamVersion!==plan.scope||s.boundary!=='standalone-component'||s.law!==originals[i].law)throw Error('SUBSTITUTION version/profile mismatch');
  if(s.modelHash!==await digest(fromHex(originals[i].modelIdentity))||s.runHash!==await digest(fromHex(originals[i].runIdentity)))throw Error('SUBSTITUTION identity mismatch');
  if(!Number.isInteger(s.prefix)||s.prefix<0||s.prefix>8||s.state.at!==s.prefix||s.complete!==(s.prefix===8)||s.observerHash!==await digest(encode(s.observer))||s.stateHash!==await digest(encode(s.state)))throw Error('SUBSTITUTION snapshot commitment mismatch');
 }
 if(c.kind==='model'&&(originals[0].law===originals[1].law||JSON.stringify(originals[0].input)!==JSON.stringify(originals[1].input)))throw Error('SUBSTITUTION model contrast mismatch');
 if(c.kind==='input'&&originals[0].modelIdentity!==originals[1].modelIdentity)throw Error('SUBSTITUTION input contrast mismatch');
 const aligned=a.prefix===b.prefix,summary=(s:SubstitutionSnapshot)=>({program:s.program,prefix:s.prefix,modelHash:s.modelHash,runHash:s.runHash,saveHash:s.saveHash,stateHash:s.stateHash,observerHash:s.observerHash});
 return{version:'substitution-contrast-inspection/0.1',contrast:{...c},aligned,changedSettings:originals[0].law===originals[1].law?[]:['law'],inputDifferences:differences(originals[0].input,originals[1].input),runSeed:plan.seed,
 observerEqual:aligned?a.observerHash===b.observerHash:null,stateEqual:aligned?a.stateHash===b.stateHash:null,saveEqual:aligned?a.saveHash===b.saveHash:null,stateDifferences:aligned?differences(a.state,b.state):[],a:summary(a),b:summary(b),
 alignment:'Equal committed component opportunity; unaligned prefixes withhold equality and state differences.',randomPolicy:'Original seed and addressed RNG retained. Equal seeds do not establish matched draws; inspect resolution and address provenance before attributing choice differences.',scope:'Component diagnostic comparison, not native scheduler admission or standalone save authentication. Observer equality differs from physical delivery and full state/save equality. Equal resolved estimates differ from equal full belief histories. Candidate availability does not establish action or history necessity; no clinical dependence claim.'};
}
