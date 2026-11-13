import {receivingRecord as rec} from './codecs';
/** assembled-character-comparison/0.1: unchanged C2 arbitration mathematics; successor receiving codec. */
import {list,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {cognitiveRecord as r,randomDrawRecord} from './codecs';
import {ZERO,ONE,absolute,convolve,expectation,readDistribution,readQ,qValue} from '../campaign2/cognitiveMath';
import {dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,invalidModel} from '../campaign2/canonicalData';
import {analyzeOptions} from './configurationMath';
import type {StandingDraws} from './random';
import {standingSample,ROUNDING_SPAN} from './standingRounding';
function context(value:CanonicalValue){const reason=rec(value,408n),raw=rec(f(reason,2n),403n),options=rec(f(raw,2n),398n);return {nuclei:items(f(reason,3n),'list'),candidates:items(f(options,3n),'list').map(v=>f(rec(v,397n),1n))};}
export async function arbitrationOutput(occurrence:CanonicalValue,at:bigint,reasonContext:CanonicalValue,definition:CanonicalValue,draws:StandingDraws,maxCandidates=2){
 if(at<=0n)invalidModel('positive resolution time required');
 const {nuclei,candidates}=context(reasonContext),def=rec(definition,440n);
 if(!candidates.length||!nuclei.length)return r(409,[occurrence,signed(at),reasonContext,r(419,[u(candidates.length?2:1)])]);
 const options=candidates.map(candidate=>{const own=nuclei.filter(v=>key(f(rec(f(rec(v,407n),1n),404n),1n))===key(candidate));let distribution=new Map([[0n,ONE]]),reasonMass=ZERO;
  for(const value of own){const d=readDistribution(f(rec(value,407n),7n));distribution=convolve(distribution,d);reasonMass=reasonMass.add(absolute(expectation(d)));}return {key:candidate,distribution,reasonMass};});
 const analytical=analyzeOptions(options,readQ(f(def,1n)),readQ(f(def,2n)),maxCandidates),reasonDraws:CanonicalValue[]=[];
 let chosen=analytical.ranked[0].key,tie=r(423,[u(1)]);
 if(analytical.mode!=='Auto'){
  const scores=new Map(candidates.map(c=>[key(c),0n]));
  for(const value of nuclei){const n=rec(value,407n),nk=rec(f(n,1n),404n),draw=randomDrawRecord(await draws.reason(value)),face=uint(f(draw,3n))+1n;
   const h=f(n,5n),x=f(n,6n),c=n.schema.schemaVersion>=2n?f(n,8n):signed(0);if(typeof h==='boolean'||h.kind!=='signed'||typeof x==='boolean'||x.kind!=='signed'||typeof c==='boolean'||c.kind!=='signed')invalidModel('signed modifiers');
   let realized=h.value;const rounding:CanonicalValue[]=[];
   if(n.schema.schemaVersion===3n){
    if(uint(f(draw,4n))!==uint(f(n,4n))||face<1n||face>uint(f(n,4n)))invalidModel('reason draw span/result');
    const upper=f(n,9n),threshold=uint(f(n,10n));if(typeof upper==='boolean'||upper.kind!=='signed')invalidModel('standing upper');
    let word:bigint|undefined;if(threshold){if(!draws.rounding)invalidModel('missing standing draw capability');const rd=randomDrawRecord(await draws.rounding!(value));if(uint(f(rd,4n))!==ROUNDING_SPAN)invalidModel('standing draw span');word=uint(f(rd,3n));rounding.push(rd);}
    realized=standingSample(h.value,upper.value,threshold,word);
   }
   const contribution=(uint(f(nk,4n))===1n?1n:-1n)*(face+realized+x.value+c.value),candidate=key(f(nk,1n));
   if(!scores.has(candidate))invalidModel('nucleus outside candidate domain');scores.set(candidate,scores.get(candidate)!+contribution);
   reasonDraws.push(r(422,[nk,f(n,4n),h,x,draw,u(face),signed(contribution),...(n.schema.schemaVersion>=2n?[c]:[]),...(n.schema.schemaVersion===3n?[list(rounding),signed(realized)]:[])],Number(n.schema.schemaVersion)));
  }
  const top=[...scores.values()].reduce((a,b)=>a>b?a:b),leaders=candidates.filter(c=>scores.get(key(c))===top).sort((a,b)=>key(a)<key(b)?-1:1);
  chosen=leaders[0];if(leaders.length>1){const draw=randomDrawRecord(await draws.tie(leaders));chosen=leaders[Number(uint(f(draw,3n)))];tie=r(423,[u(2),list(leaders),draw,chosen]);}
 }
 const modes={Auto:1,QuietRoll:2,PlayerFacingRoll:3};
 const data=r(420,[chosen,list(analytical.probabilities.map(p=>r(421,[p.key,qValue(p.probability)]))),qValue(analytical.margin),qValue(analytical.contest),qValue(analytical.conflictMass),qValue(analytical.stake),qValue(analytical.authorshipPotential),u(modes[analytical.mode as keyof typeof modes]),list(reasonDraws),tie]);
 return r(409,[occurrence,signed(at),reasonContext,r(419,[u(3),data])]);
}
