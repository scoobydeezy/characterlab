/** M108 plan3fd6003c. Diagnostic operands only; never injected into a native run. */
import {expect} from 'vitest';
import {replace} from './assembledBiographyHistory';
import {map,set} from '../../substrate/canonicalEncoding';
import {cognitiveRecord as r} from '../../assembled/codecs';
import {compileDescribedReasons} from '../../assembled/reasons';
import {appendFormation,formationValue,formationSignals} from '../../assembled/formation';
import {analyzeOptions} from '../../assembled/configurationMath';
import {convolve,expectation,absolute,readDistribution,ONE,qValue} from '../../campaign2/cognitiveMath';
import {dataIdentity as id,dataText as txt} from '../../campaign2/canonicalData';
import {definition,arbitrationDefinition} from './assembledStandingRounding';
import {fixture,create,live,learned,reinterpret,enumerate,ablation,rec,f,uint,items,key,decode,enc,list,text,signed,q,readQ,ZERO,snap,through,finish,bytes,qualificationParts,fraction,Q,type Run,type CanonicalValue} from './assembledBiographyHistory';
export const laws=['Earned','AuthoredTrait','DisplayOnly','HistoryOnly','RecomputedHistory','Refold'] as const;
export type Law=typeof laws[number];
const role=(v:CanonicalValue)=>uint(f(rec(f(rec(v,402n),1n),401n),3n));
const nonstanding=(v:CanonicalValue)=>list(items(f(rec(v,403n),6n),'list').filter(v=>role(items(v,'list')[2])!==3n));
export function action(candidate:CanonicalValue){const name=txt(id(f(rec(candidate,395n),2n)).payload);expect(['definition/protocol-contact-one','definition/protocol-contact-two']).toContain(name);return name.endsWith('-one')?'A':'B';}
export function analysis(context:CanonicalValue,source:ReturnType<typeof fixture>['s']){
 const ctx=rec(context,408n),ns=items(f(ctx,3n),'list'),raw=rec(f(ctx,2n),403n),candidates=items(f(rec(f(raw,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n));
 const options=candidates.map(candidate=>{let distribution=new Map([[0n,ONE]]),reasonMass=ZERO;for(const v of ns){const n=rec(v,407n);if(key(f(rec(f(n,1n),404n),1n))===key(candidate)){const d=readDistribution(f(n,7n));distribution=convolve(distribution,d);reasonMass=reasonMass.add(absolute(expectation(d)));}}return {key:candidate,distribution,reasonMass};});
 const def=rec(arbitrationDefinition(source),440n);return analyzeOptions(options,readQ(f(def,1n)),readQ(f(def,2n)),3);
}
export function prefix(run:Run,at:bigint){
 const l=learned(run);let value:CanonicalValue|undefined;const journal=l.journal.filter(v=>qualificationParts(v).at.value<at),entries=l.formation.entries.filter(v=>uint(items(v,'list')[1])<at);
 expect(journal).toHaveLength(entries.length);for(const [i,v]of journal.entries()){const qual=qualificationParts(v),entry=items(entries[i],'list');expect(entry[0]).toEqual(qual.id);expect(entry[2]).toEqual(qual.contribution);value=appendFormation(value,qual.id,qual.at.value,readQ(qual.contribution),Number(uint(entry[3]))).value;}
 return {value,journal,P:formationValue(value).P};
}
export function altered(p:ReturnType<typeof live>,strength:(signal:CanonicalValue)=>Q,authored=false){
 const change=(signal:CanonicalValue)=>role(signal)!==3n?signal:r(402,[f(rec(signal,402n),1n),qValue(strength(signal)),authored?r(400,[map([])]):f(rec(signal,402n),3n)]);
 return rec(replace(replace(p.raw,3n,set(items(f(p.raw,3n),'set').map(change))),6n,list(items(f(p.raw,6n),'list').map(v=>{const d=items(v,'list');return list([d[0],d[1],change(d[2])]);}))),403n);
}
export function alternatives(run:Run,p:ReturnType<typeof live>,source:ReturnType<typeof fixture>['s'],at:bigint,reversedAt=26n){
 const before=prefix(run,at);expect(formationValue(before.value)).toEqual(formationValue(p.input[1]));expect(formationSignals(p.input[0],before.value).output).toEqual(p.source);
 const absent=ablation(p,source),wrong=at===reversedAt?reinterpret(run,p):before.P;
 return laws.map(law=>{
  const raw=law==='DisplayOnly'||law==='HistoryOnly'?absent.raw:law==='AuthoredTrait'?altered(p,s=>action(f(rec(f(rec(s,402n),1n),401n),1n))==='A'?Q.of(1n,2n):Q.of(-1n,2n),true):law==='RecomputedHistory'&&at===reversedAt?altered(p,s=>readQ(f(rec(s,402n),2n)).multiply(wrong).divide(before.P)):p.raw;
  expect(nonstanding(raw)).toEqual(nonstanding(p.raw));for(const n of [1n,2n,4n,5n])expect(f(raw,n)).toEqual(f(p.raw,n));
  expect(set(items(f(raw,3n),'set').filter(v=>role(v)!==3n))).toEqual(set(items(f(p.raw,3n),'set').filter(v=>role(v)!==3n)));
  const ns=compileDescribedReasons(raw,definition(source),3,'SourceCoverage',true,true).nuclei;expect(ns).toHaveLength(2);for(const n of ns)expect(uint(f(rec(n,407n),4n))).toBe(4n);
  const context=r(408,[f(p.context,1n),raw,list(ns)]),display=law==='HistoryOnly'?list([]):list([qValue(law==='AuthoredTrait'?Q.of(1n,2n):law==='RecomputedHistory'?wrong:before.P)]);
  return {law,raw,context,display,history:list(before.journal),analytical:analysis(context,source)};
 });
}
export {fixture,create,live,learned,enumerate,rec,f,uint,items,key,decode,enc,list,text,signed,q,readQ,ZERO,snap,through,finish,bytes,qualificationParts,fraction,Q,appendFormation,formationValue};
export type {Run,CanonicalValue};
