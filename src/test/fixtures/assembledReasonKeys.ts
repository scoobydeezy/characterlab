/** M91 governed mappings on M88's current single character; no psychological input.
 * Three physical tasks/no people; body30/cap100/rate10, delivery90 at9.
 * Seed0; importanceA/B3/5, urgency1, threat1/2; two permitted readings10. */
import {expect} from 'vitest';
import {fixture as prior} from './assembledContextReasons';
import {taskA,taskB} from './assembledDecisionRegimes';
import {CONTEXT_EVIDENCE,REASON_READING,REASON_PRODUCED} from '../../assembled/reasonEvidence';
import {compileDescribedReasons,descriptionIdentity} from '../../assembled/reasons';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {capture as decision} from './assembledValueProvenance';
import {snap,through} from './assembledAffectReceiving';
import {outputs} from './assembledComparison';
import {list,set,text,unsigned as u,signed,rational as q,canonicalEncode as enc,typedIdentifier,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {decodeCognitive as decode,receivingRecord as rec,cognitiveRecord as r} from '../../assembled/codecs';
import {dataItems as items,dataField as f,dataKey as key,dataUnsigned as uint} from '../../campaign2/canonicalData';
import {readQ,ZERO,ONE,convolve,absolute,expectation,readDistribution} from '../../campaign2/cognitiveMath';
import {analyzeOptions} from '../../assembled/configurationMath';
import {reasonRaw} from '../../campaign3/reasonMath';
import {reasonRecord as rr} from '../../campaign3/reasonCodecs';
import {sid} from '../../assembled/skill';
import {compile,originalNuclei,originalProjection,definition} from './assembledReasonCorrespondence';
import {projection} from './assembledContextReasons';
export type Case='same'|'split'|'negative'|'modifier';
export function fixture(kind:Case='split',hidden=false,permitted=true){
 const b=prior(false,hidden,true),slots=[...items(decode(b.s.registry),'list')],action=sid(1027,'definition/protocol-contact-one');
 const descriptors=[
  list([text('reading1'),action,taskA,q(3,4),set([u(1)]),u(1)]),
  list([text('reading2'),action,kind==='same'?taskA:taskB,q(2,3),set([u(2)]),u(kind==='modifier'?4:1)])
 ];
 slots[45]=list([text(CONTEXT_EVIDENCE),list(descriptors)]);
 let found=0;
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const row=[...items(v,'list')];if(key(row[2])===key(REASON_READING)){
   expect(row[0]).toEqual(signed(10));const p=[...items(row[3],'list')];
   p[1]=q(kind==='negative'?-1:1,1);p[3]=permitted;row[3]=list(p);found++;
  }return list(row);
 });
 expect(found).toBe(1);return {s:{...b.s,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))},descriptors};
}
export async function create(kind:Case='split',hidden=false,permitted=true,at=10n){
 const b=fixture(kind,hidden,permitted),run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(run,at);return {b,run};
}
export function capture(run:Parameters<typeof snap>[0],source:{registry:Uint8Array}){
 const p=decision(run,10n),all=items(decode(snap(run).outputs),'list');
 const report=all.find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(REASON_PRODUCED))&&key(v.items[1])===key(signed(10)))!;
 expect(report).toBeDefined();const rows=items(report,'list'),frozen=items(rows[2],'list'),samples=items(frozen[2],'list'),produced=items(rows[3],'list'),rejected=items(rows[4],'list');
 const compiled=compileDescribedReasons(p.raw,definition(source),3,'Jaccard',true);
 expect(compiled.nuclei).toEqual(p.ns);
 const traces=outputs(snap(run).trace,160n),trace=traces.find(t=>key(f(t,12n))===key(p.raw)&&key(f(t,13n))===key(list([p.context,compiled.report])));
 expect(trace,'actual compiler input and full output').toBeDefined();
 expect(items(f(rec(f(p.raw,2n),398n),3n),'list')).toHaveLength(2);expect(p.value).toHaveLength(0);
 for(const t of [taskA,taskB])expect(items(f(p.raw,3n),'set').some(v=>key(f(rec(f(rec(v,402n),1n),401n),2n))===key(t)),'live selected task source').toBe(true);
 return {...p,report,frozen,samples,produced,rejected,compiled,groups:items(items(compiled.report,'list')[1],'list').map(v=>items(v,'list'))};
}
export function sourceCorrespondence(p:ReturnType<typeof capture>){
 const descriptors=p.produced.map(v=>{const d=items(items(v,'list')[0],'list');return rr(916,[sid(1027,'M91/'+(d[0] as {value:string}).value),r(395,[f(rec(d[2],371n),1n),d[1]]),sid(1040,'Commitment'),f(rec(d[2],371n),2n),d[5],d[3],d[4]]);});
 const convert=(v:CanonicalValue)=>{const x=items(v,'list');return rr(917,[x[1],x[2],x[3],x[4],x[5]]);};
 const original=reasonRaw(typedIdentifier(1160,u(0)),descriptors,p.samples.map(convert),r(414,[list([])])).output;
 const sources=items(f(rec(original,920n),2n),'list');expect(sources).toHaveLength(p.produced.length);
 p.produced.forEach((v,i)=>{
  const row=items(v,'list'),signal=rec(items(row[1],'list')[2],402n),source=rec(sources[i],919n);
  expect(f(source,2n)).toEqual(f(signal,2n));expect(f(source,3n)).toEqual(f(signal,3n));
  expect(f(source,4n)).toEqual(list(items(row[2],'list').map(convert)));
  expect(items(f(p.raw,6n),'list')).toContainEqual(row[1]);
  for(const sample of items(row[2],'list'))expect(p.samples).toContainEqual(sample);
 });
 return sources;
}
const semanticKey=(n:CanonicalValue,type:bigint)=>{const k=rec(n,type);return list([1n,2n,3n,4n].map(i=>f(k,i)));};
export function originalComparison(p:ReturnType<typeof capture>,source:{registry:Uint8Array},pooled=false){
 const actual=items(f(p.raw,6n),'list').filter(v=>!readQ(f(rec(items(v,'list')[2],402n),2n)).equals(ZERO));
 const rows=actual.map(v=>{
  const d=items(v,'list'),signal=rec(d[2],402n),sk=rec(f(signal,1n),401n),task=rec(f(sk,2n),371n);
  expect(f(rec(f(sk,1n),395n),1n)).toEqual(f(task,1n));
  return rr(919,[rr(916,[sid(1027,'M91/'+key(descriptionIdentity(v))),f(sk,1n),d[1],f(task,2n),f(sk,3n),q(1,1),set([])]),f(signal,2n),f(signal,3n),list([])]);
 });
 expect(rows.length).toBeLessThanOrEqual(6);expect(rows).toHaveLength(5);
 const result=compile(rows,definition(source)),ns=originalNuclei(result),rejected=items(f(rec(result,924n),4n),'list');
 expect(key(set(ns.map(originalProjection)))).toBe(key(set(p.ns.map(projection))));
 const inactive=p.groups.filter(v=>key(v[1])!==key(text('Active')));
 expect(rejected).toHaveLength(inactive.length);
 for(const v of rejected){
  const row=rec(v,928n),group=inactive.find(g=>key(semanticKey(g[0],404n))===key(semanticKey(f(row,1n),922n)))!;
  expect(group).toBeDefined();expect(group[1]).toEqual(text(uint(f(row,2n))===1n?'ZeroBase':'BelowThreshold'));expect(group[2]).toEqual(f(row,3n));
 }
 // All original coverage witnesses map to unchanged native descriptions/bases.
 const witnesses=[...ns.flatMap(n=>items(f(n,12n),'list')),...rejected.flatMap(n=>items(f(rec(n,928n),5n),'list'))];
 const native=p.groups.flatMap(g=>items(g[3],'list').map(v=>items(v,'list')));
 expect(witnesses).toHaveLength(native.length);
 for(const w of witnesses){
  const v=rec(w,921n),d=rec(f(v,1n),916n),index=rows.findIndex(r=>key(f(rec(f(r,1n),916n),1n))===key(f(d,1n)));
  expect(index).toBeGreaterThanOrEqual(0);const n=native.find(n=>key(n[0])===key(descriptionIdentity(actual[index])))!;
  expect(n).toBeDefined();expect(n[1]).toEqual(f(v,6n));expect(n[2]).toEqual(signed(uint(f(v,5n))===1n?1:-1));
  for(const [a,b] of [[3n,2n],[4n,3n],[6n,4n]] as const)expect(n[Number(a)]).toEqual(f(v,b));
  expect(n[7]).toEqual(f(rec(rows[index],919n),3n));
 }
 const candidates=items(f(rec(f(p.raw,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n));
 const registry=items(items(decode(source.registry),'list')[0],'set');
 const arb=f(rec(registry.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(sid(1027,'definition/task-arbitration')))!,171n),4n);
 const analyze=(nuclei:typeof ns)=>analyzeOptions(candidates.map(candidate=>{
  let distribution=new Map([[0n,ONE]]),reasonMass=ZERO;
  for(const n of nuclei.filter(n=>key(f(rec(f(n,1n),922n),1n))===key(candidate))){const d=readDistribution(f(n,11n));distribution=convolve(distribution,d);reasonMass=reasonMass.add(absolute(expectation(d)));}
  return {key:candidate,distribution,reasonMass};
 }),readQ(f(rec(arb,440n),1n)),readQ(f(rec(arb,440n),2n)),3).probabilities.map(v=>v.probability);
 expect(analyze(ns)).toEqual(p.probabilities.map(readQ));
 if(pooled){
  const alternative=originalNuclei(compile(rows,definition(source),2));
  expect(ns).toHaveLength(3);expect(alternative).toHaveLength(2);
  expect(analyze(alternative)).not.toEqual(analyze(ns));
  console.info('M91 POOLED '+JSON.stringify({allSources:rows.length,nuclei:[ns.length,alternative.length],reference:analyze(ns).map(frac),pooled:analyze(alternative).map(frac)}));
 }
}
export const frac=(v:ReturnType<typeof readQ>)=>v.numerator+'/'+v.denominator;
export {snap,through,decode,enc,items,key,rec,r,f,uint,q,list,set,text,u,signed,taskA,taskB,readQ};
