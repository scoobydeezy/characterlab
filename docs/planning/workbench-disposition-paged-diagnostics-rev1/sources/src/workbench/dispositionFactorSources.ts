import type {TimelineEvent} from './contracts';
import {inspectDispositionReasons} from './dispositionReasonDiagnostics';
import {ExactRational as Q} from '../substrate/exactMath';
const obj=(v:unknown):Record<string,unknown>=>{if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Factor record required');return v as Record<string,unknown>;};
const rec=(v:unknown,type:string)=>{const r=obj(v);if(r.record!==type)throw Error('Factor record version mismatch');return r;};
const list=(v:unknown)=>{if(!Array.isArray(v))throw Error('Factor list required');return v as unknown[];};
const fraction=(v:unknown)=>{if(typeof v!=='string'||v.length>256||! /^-?\d+\/[1-9]\d*$/.test(v))throw Error('Factor rational required');const [n,d]=v.split('/').map(BigInt);return {text:v,q:Q.of(n,d)};};
/** Joins only recorded source keys. Never infer a causal state source from equal numbers. */
export function dispositionFactorSources(event:TimelineEvent){
 if(event.output.length>16_000_000)throw Error('Factor output exceeds explicit diagnostic bound');
 const diagnostic=inspectDispositionReasons(event);
 if(!diagnostic.emitted)return {version:'disposition-factor-sources/0.1',eventId:event.id,emitted:false as const,rows:[],nuclei:[]};
 const output=list(JSON.parse(event.output)),reasons=rec(output[1],'IdentityTaskReasons#1430/1'),context=rec(reasons['Reasons [5]'],'TaskReasonContext#408/1'),raw=rec(reasons['Raw [4]'],'TaskRawSignalContext#403/1');
 if(JSON.stringify(raw)!==JSON.stringify(context['RawSignalContext [2]']))throw Error('Factor raw-context lineage mismatch');
 const signals=list(raw['Signals [3]']);if(signals.length>6)throw Error('Factor signal bound exceeded');
 const rows=signals.map(v=>{
  const s=rec(v,'TaskRawSignal#402/1'),key=rec(s['Key [1]'],'TaskRawSignalKey#401/1'),role=key['SourceRole [3]'];
  if(typeof role!=='string'||!['1','2','3'].includes(role))throw Error('Unknown factor source role');
  const strength=fraction(s['SignedStrength [2]']),basis=rec(s['EvidenceBasis [3]'],'ReasonEvidenceBasis#400/1'),weights=list(basis['Weights [1]']);if(weights.length>64)throw Error('Factor basis bound exceeded');
  return {key:JSON.stringify(key),role:role==='1'?'base':role==='2'?'situational':'standing',strength:strength.text,basis:JSON.stringify(basis),coverage:[] as {nucleus:number;raw:string;overlap:string;independent:string;effective:string}[]};
 });
 if(new Set(rows.map(r=>r.key)).size!==rows.length)throw Error('Duplicate factor source');
 const nuclei=diagnostic.nuclei.map((n,index)=>{
  const coverage=list(JSON.parse(n.coverage));
  for(const value of coverage){
   const c=rec(value,'CoverageResult#405/1'),key=JSON.stringify(c['SourceKey [1]']),row=rows.find(r=>r.key===key);if(!row)throw Error('Factor coverage has no raw source');
   if(row.coverage.length)throw Error('Ambiguous factor coverage source');
   const raw=fraction(c['RawMagnitude [2]']),overlap=fraction(c['OverlapWithPrior [3]']),independent=fraction(c['IndependentFraction [4]']),effective=fraction(c['EffectiveMagnitude [5]']),strength=fraction(row.strength).q;
   if(!raw.q.equals(Q.of(strength.numerator<0n?-strength.numerator:strength.numerator,strength.denominator))||!independent.q.equals(Q.of(1n).subtract(overlap.q))||!effective.q.equals(raw.q.multiply(independent.q)))throw Error('Factor coverage arithmetic mismatch');
   row.coverage.push({nucleus:index+1,raw:raw.text,overlap:overlap.text,independent:independent.text,effective:effective.text});
  }
  return {index:index+1,key:n.key,baseNet:n.baseNet,standingNet:n.standingNet,situationalNet:n.situationalNet,relevance:n.relevance,baseDie:n.baseDie,standingModifier:n.standingModifier,situationalModifier:n.situationalModifier,distribution:JSON.parse(n.distribution)};
 });
 return {version:'disposition-factor-sources/0.1',eventId:event.id,emitted:true as const,rows,nuclei,
  reads:event.reads.map(r=>({path:r.path,exact:r.exact})),
  scope:'Exact raw sources joined to recorded coverage by source key. Empty evidence basis is preserved, not corroboration. Sources without coverage remain explicit; they may be zero or belong to an inactive nucleus. State reads belong to this evaluation, but no source-to-state causal join is inferred from numerical equality. Recorded die and modifiers are mechanical, not subjective uncertainty.'};
}
