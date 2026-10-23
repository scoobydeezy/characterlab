import {AFFECT_RENDERER,type AffectExplanation} from './affectExplanations';
export const AFFECT_FACTOR_AXES=['Likelihood','Severity','Vulnerability','Control'] as const;
export type AffectFactorAxis=typeof AFFECT_FACTOR_AXES[number];
export interface AffectFactorValue {exact:string;plot:number}
function value(input:unknown):AffectFactorValue {
 if(typeof input!=='string'||input.length>256||!/^\d+\/[1-9]\d*$/.test(input))throw Error('Invalid appraisal fraction');
 const [n,d]=input.split('/').map(BigInt);if(n>d)throw Error('Appraisal factor outside unit interval');
 // Only the plot is rounded; do not convert potentially huge integers to Number.
 return {exact:input,plot:Number(n*1_000_000_000n/d)/1_000_000_000};
}
/** Reads the already-qualified evaluation snapshot, never current state or world truth. */
export function affectFactorView(cards:readonly AffectExplanation[]){
 const seen=new Set<string>();
 return cards.filter(c=>c.kind==='Appraisal').map(c=>{
  if(c.renderer!==AFFECT_RENDERER||seen.has(c.id))throw Error('Unqualified or duplicate appraisal');seen.add(c.id);
  const r=JSON.parse(c.provenance);if(r.record!=='AffectAppraisal#754/1'||r['At [2]']!==c.at)throw Error('Appraisal identity mismatch');
  const fields={Likelihood:'Likelihood [8]',Severity:'Severity [4]',Vulnerability:'Vulnerability [9]',Control:'Control [10]'};
  const factors=Object.fromEntries(AFFECT_FACTOR_AXES.map(axis=>[axis,Object.hasOwn(r,fields[axis])?value(r[fields[axis]]):null])) as Record<AffectFactorAxis,AffectFactorValue|null>;
  if(!factors.Severity)throw Error('Missing required appraisal severity');
  const coordinates=(key:string)=>{const xs=r[key];if(!Array.isArray(xs)||xs.length>2)throw Error('Invalid appraisal coordinate dimensions');return xs.map(value);};
  const raw=coordinates('RawCoordinates [5]'),result=coordinates('Coordinates [6]');if(raw.length!==result.length)throw Error('Appraisal coordinate dimensions changed');
  return {id:c.id,at:c.at,factors,raw,result,provenance:c.provenance};
 });
}
