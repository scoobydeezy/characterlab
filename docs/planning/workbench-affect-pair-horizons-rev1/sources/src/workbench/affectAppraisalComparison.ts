import type {AffectExplanation} from './affectExplanations';
import {affectFactorView,AFFECT_FACTOR_AXES} from './affectFactorProjection';
/** Align evaluation instants, never occurrence counters or array positions. */
export function compareAffectAppraisals(a:readonly AffectExplanation[],b:readonly AffectExplanation[]){
 const index=(cards:readonly AffectExplanation[])=>{const out=new Map<string,ReturnType<typeof affectFactorView>[number]>();for(const row of affectFactorView(cards)){if(!/^-?\d+$/.test(row.at)||out.has(row.at))throw Error('Ambiguous appraisal instant');out.set(row.at,row);}return out;};
 const left=index(a),right=index(b),times=[...new Set([...left.keys(),...right.keys()])].sort((a,b)=>BigInt(a)<BigInt(b)?-1:BigInt(a)>BigInt(b)?1:0);
 const rows=times.map(at=>{const a=left.get(at)??null,b=right.get(at)??null;
  const changed:string[]=!a||!b?['Evaluation presence']:AFFECT_FACTOR_AXES.filter(k=>a.factors[k]?.exact!==b.factors[k]?.exact);
  if(a&&b){if(JSON.stringify(a.raw.map(v=>v.exact))!==JSON.stringify(b.raw.map(v=>v.exact)))changed.push('Raw coordinates');if(JSON.stringify(a.result.map(v=>v.exact))!==JSON.stringify(b.result.map(v=>v.exact)))changed.push('Resulting coordinates');}
  return {at,changed,a,b};
 });
 return {version:'affect-appraisal-comparison/0.1',rows,firstDifference:rows.find(r=>r.changed.length)?.at??null,scope:'Recorded likelihood, severity, vulnerability, control and raw/resulting coordinate differences. Presence remains distinct from zero. No scalar subtraction or equivalence is inferred across candidate dimensions or control units. This is not the first changed choice, all appraisal operands, subjective experience or causal necessity.'};
}
