import type {AffectExplanation} from './affectExplanations';
import {ExactRational as Q} from '../substrate/exactMath';
type RecordValue=Record<string,unknown>;
function record(v:unknown,name:string):RecordValue{if(!v||typeof v!=='object'||Array.isArray(v)||(v as RecordValue).record!==name)throw Error(`Expected ${name}`);return v as RecordValue;}
function list(v:unknown):unknown[]{if(!Array.isArray(v))throw Error('Expected source list');return v;}
function fraction(v:unknown){if(typeof v!=='string'||v.length>256||! /^-?\d+\/[1-9]\d*$/.test(v))throw Error('Invalid source fraction');const [n,d]=v.split('/').map(BigInt);return {text:v,q:Q.of(n,d),n,d};}
function integer(v:unknown){if(typeof v!=='string'||! /^-?\d+$/.test(v))throw Error('Invalid source integer');return v;}
const stable=(v:unknown):string=>v===null||typeof v!=='object'?JSON.stringify(v):Array.isArray(v)?'['+v.map(stable).join(',')+']':'{'+Object.entries(v).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,x])=>JSON.stringify(k)+':'+stable(x)).join(',')+'}';
/** Detached decision-time provenance only; no current-state or physical-world resolver. */
export function affectReasonSources(card:AffectExplanation){
 if(card.kind!=='Decision'||card.renderer!=='affect-evaluation-explanation/0.1')throw Error('Unsupported AFFECT decision source');
 const d=record(JSON.parse(card.provenance),'AffectDecision#757/1');if(d['At [2]']!==card.at)throw Error('Decision instant mismatch');
 const reasons=record(d['Reasons [3]'],'AffectReasons#756/1'),raw=record(reasons['Raw [2]'],'AffectRawReasons#755/1');
 const rows=list(raw['Signals [3]']).map((v,index)=>{const s=record(v,'TaskRawSignal#402/1'),key=record(s['Key [1]'],'TaskRawSignalKey#401/1'),role=key['SourceRole [3]'];if(typeof role!=='string'||!['1','2','3'].includes(role))throw Error('Unknown source role');const basis=record(s['EvidenceBasis [3]'],'ReasonEvidenceBasis#400/1');list(basis['Weights [1]']);return {index,key:stable(key),role:role==='1'?'base':role==='2'?'situational':'standing',strength:fraction(s['SignedStrength [2]']).text,basis,coverage:[] as {nucleus:number;raw:string;overlap:string;independent:string;effective:string}[]};});
 if(new Set(rows.map(r=>r.key)).size!==rows.length)throw Error('Duplicate raw source');
 const nuclei=list(reasons['Nuclei [3]']).map((v,index)=>{const n=record(v,'CompiledReasonNucleus#407/1'),key=record(n['Key [1]'],'ReasonNucleusKey#404/1'),roles=record(n['RoleSummary [2]'],'ReasonRoleSummary#406/1');
  for(const value of list(roles['CoverageResults [4]'])){const c=record(value,'CoverageResult#405/1'),source=rows.find(r=>r.key===stable(c['SourceKey [1]']));if(!source||source.coverage.length)throw Error('Missing or ambiguous coverage source');const rawMagnitude=fraction(c['RawMagnitude [2]']),overlap=fraction(c['OverlapWithPrior [3]']),independent=fraction(c['IndependentFraction [4]']),effective=fraction(c['EffectiveMagnitude [5]']),strength=fraction(source.strength);if(!rawMagnitude.q.equals(Q.of(strength.n<0n?-strength.n:strength.n,strength.d))||!independent.q.equals(Q.of(1n).subtract(overlap.q))||!effective.q.equals(rawMagnitude.q.multiply(independent.q)))throw Error('Coverage arithmetic mismatch');source.coverage.push({nucleus:index,raw:rawMagnitude.text,overlap:overlap.text,independent:independent.text,effective:effective.text});}
  const direction=key['Direction [4]'];if(direction!=='1'&&direction!=='2')throw Error('Unknown nucleus polarity');
  return {index,key,polarity:direction==='1'?'supports':'opposes',base:fraction(roles['BaseNet [1]']).text,standing:fraction(roles['StandingNet [2]']).text,situational:fraction(roles['SituationalNet [3]']).text,relevance:fraction(n['Relevance [3]']).text,die:integer(n['BaseDie [4]']),standingModifier:integer(n['StandingModifier [5]']),situationalModifier:integer(n['SituationalModifier [6]'])};
 });
 return {version:'affect-reason-sources/0.1',at:card.at,rows,nuclei,uncovered:rows.filter(r=>!r.coverage.length).map(r=>r.index),scope:'Decision-time raw signals joined to recorded overlap adjustments by exact source key. Empty evidence basis is not corroboration. Uncovered sources remain explicit. Compiled contributions and dice are not subjective certainty; no state-source causal join is inferred from numeric equality.'};
}
