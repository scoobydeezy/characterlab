import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import type {TimelineEvent} from './contracts';
import {exactKey,readable} from './canonical';
import {scalar} from './nativeTimeline';
import {equalCanonicalText} from './canonicalTextEquality';
import {inspectDispositionCanonicalReasons} from './dispositionCanonicalReasons';
const json=(v:CanonicalValue)=>JSON.stringify(readable(v));
const fraction=(v:CanonicalValue)=>{
 if(typeof v==='boolean'||v.kind!=='rational')throw Error('Factor rational required');
 const text=`${v.numerator}/${v.denominator}`;if(text.length>256||v.denominator<=0n)throw Error('Factor rational bound exceeded');
 return {text,q:Q.of(v.numerator,v.denominator)};
};
/** Exact factor accounting, with evaluation reads referenced for paging rather than fully formatted. */
export function dispositionCanonicalFactorSources(event:Pick<TimelineEvent,'id'|'instant'|'stage'|'phase'>,output:CanonicalValue,reads:CanonicalValue){
 const diagnostic=inspectDispositionCanonicalReasons(event,output);
 if(!diagnostic.emitted)return {version:'disposition-factor-sources/0.2',eventId:event.id,emitted:false as const,rows:[],nuclei:[]};
 const reasons=rec(items(output,'list')[1],1430n),context=rec(f(reasons,5n),408n),raw=rec(f(reasons,4n),403n);
 if(!equalCanonicalText(raw,f(context,2n)))throw Error('Factor raw-context lineage mismatch');
 const signals=items(f(raw,3n),'list');if(signals.length>6)throw Error('Factor signal bound exceeded');
 const rows=signals.map(value=>{
  const s=rec(value,402n),key=rec(f(s,1n),401n),role=scalar(f(key,3n));if(!['1','2','3'].includes(role))throw Error('Unknown factor source role');
  const strength=fraction(f(s,2n)),basis=rec(f(s,3n),400n);if(items(f(basis,1n),'list').length>64)throw Error('Factor basis bound exceeded');
  return {key:json(key),role:role==='1'?'base':role==='2'?'situational':'standing',strength:strength.text,basis:json(basis),coverage:[] as {nucleus:number;raw:string;overlap:string;independent:string;effective:string}[]};
 });
 if(new Set(rows.map(r=>r.key)).size!==rows.length)throw Error('Duplicate factor source');
 const canonicalNuclei=items(f(context,3n),'list');
 const nuclei=diagnostic.nuclei.map((n,index)=>{
  const roles=rec(f(rec(canonicalNuclei[index],407n),2n),406n);
  for(const value of items(f(roles,4n),'list')){
   const c=rec(value,405n),key=json(f(c,1n)),row=rows.find(r=>r.key===key);if(!row)throw Error('Factor coverage has no raw source');if(row.coverage.length)throw Error('Ambiguous factor coverage source');
   const raw=fraction(f(c,2n)),overlap=fraction(f(c,3n)),independent=fraction(f(c,4n)),effective=fraction(f(c,5n)),[numerator,denominator]=row.strength.split('/').map(BigInt);
   if(!raw.q.equals(Q.of(numerator<0n?-numerator:numerator,denominator))||!independent.q.equals(Q.of(1n).subtract(overlap.q))||!effective.q.equals(raw.q.multiply(independent.q)))throw Error('Factor coverage arithmetic mismatch');
   row.coverage.push({nucleus:index+1,raw:raw.text,overlap:overlap.text,independent:independent.text,effective:effective.text});
  }
  return {index:index+1,key:n.key,baseNet:n.baseNet,standingNet:n.standingNet,situationalNet:n.situationalNet,relevance:n.relevance,baseDie:n.baseDie,standingModifier:n.standingModifier,situationalModifier:n.situationalModifier,distribution:JSON.parse(n.distribution)};
 });
 const readSources=items(reads,'list').map((value,index)=>{const read=rec(value,147n),presence=f(read,3n);if(typeof presence!=='boolean')throw Error('Factor read presence required');return {index,path:exactKey(f(read,2n)),presence};});
 return {version:'disposition-factor-sources/0.2',eventId:event.id,emitted:true as const,rows,nuclei,readSources,
  readSelection:{kind:'event' as const,id:event.id,part:'reads' as const},
  scope:'Exact raw sources joined to recorded coverage by source key. Empty evidence basis is preserved, not corroboration. Sources without coverage remain explicit; they may be zero or belong to an inactive nucleus. Evaluation-time reads are listed by canonical path, presence and zero-based trace-list index; exact values remain in the paged reads record for this event at the owning save revision. No source-to-state causal join is inferred from numerical equality. Recorded die and modifiers are mechanical, not subjective uncertainty.'};
}
