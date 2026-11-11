/** M85 fixed native declarations: M82 quiet, three physical tasks/no people,
 * body30/cap100/rate10, delivery90 at9, importance3/5, urgency1, threat1/2, seed0.
 * Only a governed restatement label differs; no authored psychological input. */
import {expect} from 'vitest';
import {list,set,text,unsigned as u,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {fixture as prior} from './assembledDecisionHistory';
import {REASON_SOURCES_RULES,REASON_SOURCES_REGISTRY} from '../../assembled/model';
import {REASON_SOURCES,REASON_SOURCE_REPORT,REASON_SOURCES_VERSION,descriptionIdentity} from '../../assembled/reasons';
import {receivingRecord as rec,decodeCognitive as decode} from '../../assembled/codecs';
import {dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../../campaign2/canonicalData';
import {canonicalEncode as enc} from '../../substrate/canonicalEncoding';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {snap,through} from './assembledAffectReceiving';
import {outputs,signedValue,type Run} from './assembledComparison';
import {nativeProjection,originalProjection,definition,compile,originalNuclei} from './assembledReasonCorrespondence';
import {reasonRecord as rr} from '../../campaign3/reasonCodecs';
import {sid} from '../../assembled/skill';
import {convolve,expectation,absolute,readDistribution,readQ,ZERO,ONE} from '../../campaign2/cognitiveMath';
import {analyzeOptions} from '../../assembled/configurationMath';
import {PRIORITY_OBS} from '../../assembled/priority';
export function fixture(labels:string[]=[],hidden=false){
 const b=prior(true,true,'quiet',hidden);
 return {old:b.s,s:{...b.s,rulesVersion:REASON_SOURCES_RULES,registrySchemaVersion:REASON_SOURCES_REGISTRY,registry:enc(list([...items(decode(b.s.registry),'list'),list([text(REASON_SOURCES),list(labels.map(text))])]))},d:b.d};
}
export async function create(labels:string[]=[],at=10n,hidden=false){
 const b=fixture(labels,hidden),run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(run,at);return {b,run};
}
export function capture(run:Run,extra:boolean){
 const d=outputs(snap(run).outputs,409n).find(v=>signedValue(f(v,2n))===10n);expect(d,'actual decision10').toBeDefined();
 const status=rec(f(d!,4n),419n);expect(uint(f(status,1n)),'live decision').toBe(3n);
 const data=rec(f(status,2n),420n),context=f(d!,3n),raw=rec(f(rec(context,408n),2n),403n),ns=items(f(rec(context,408n),3n),'list').map(v=>rec(v,407n));
 const candidates=items(f(rec(f(raw,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n));expect(candidates).toHaveLength(2);
 const A=candidates.find(v=>key(f(rec(v,395n),2n))===key(sid(1027,'definition/protocol-contact-one')))!,B=candidates.find(v=>key(f(rec(v,395n),2n))===key(sid(1027,'definition/protocol-contact-two')))!;
 expect(A).toBeDefined();expect(B).toBeDefined();
 expect(outputs(snap(run).outputs,433n).some(o=>key(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n))===key(d!)),'decision reaches actual execution').toBe(true);
 const p={d:d!,data,context,raw,ns,A,B};expect(raw.schema.schemaVersion).toBe(3n);
 // Citation repair changes only base evidence after the affect source stage.
 const rawTrace=outputs(snap(run).trace,160n).find(t=>key(f(t,6n))===key(text(REASON_SOURCES_VERSION))&&signedValue(f(rec(f(t,4n),130n),2n))===10n&&typeof f(t,13n)!=='boolean'&&(f(t,13n) as {kind:string}).kind==='record');
 expect(rawTrace).toBeDefined();expect(f(rawTrace!,13n)).toEqual(raw);
 const receiving=outputs(snap(run).trace,160n).find(t=>key(f(t,5n))===key(sid(1036,'seam/assembled-reason-sources'))&&key(f(t,13n))===key(raw));expect(receiving).toBeDefined();
 const supportReport=items(f(receiving!,12n),'list')[2];expect(items(decode(snap(run).outputs),'list').some(v=>key(v)===key(supportReport)),'source uses actual generated priority report').toBe(true);
 const priorRaw=rec(items(f(receiving!,12n),'list')[0],403n),before=items(f(priorRaw,3n),'set').map(v=>rec(v,402n));
 expect(f(raw,2n)).toEqual(f(priorRaw,2n));expect(f(raw,4n)).toEqual(f(priorRaw,4n));
 for(const signal of items(f(raw,3n),'set')){const v=rec(signal,402n),old=before.find(o=>key(f(o,1n))===key(f(v,1n)))!;expect(old).toBeDefined();expect(f(v,2n)).toEqual(f(old,2n));if(uint(f(rec(f(v,1n),401n),3n))!==1n)expect(f(v,3n)).toEqual(f(old,3n));}


 expect(uint(f(p.data,8n))).toBe(2n);expect(p.ns).toHaveLength(2);
 const descriptions=items(f(raw,6n),'list'),primary=descriptions.filter(v=>key(items(v,'list')[0])===key(text('primary'))),aliases=descriptions.filter(v=>key(items(v,'list')[0])===key(text('restatement')));
 expect(aliases).toHaveLength(extra?2:0);
 const bases=primary.filter(v=>uint(f(rec(f(rec(items(v,'list')[2],402n),1n),401n),3n))===1n);
 expect(bases).toHaveLength(2);
 const observations=items(decode(snap(run).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(PRIORITY_OBS))).map(v=>items(v,'list')[1]);
 for(const d of bases){const signal=rec(items(d,'list')[2],402n),basis=f(rec(f(signal,3n),400n),1n);
  expect(readQ(f(signal,2n)).compare(ZERO)).toBeGreaterThan(0);
  if(typeof basis==='boolean'||basis.kind!=='map')throw Error('basis');expect(basis.entries.length).toBeGreaterThan(0);
  for(const [atom] of basis.entries){const observation=f(rec(f(rec(atom,399n),2n),237n),2n);expect(observations.some(v=>key(v)===key(observation)),'basis cites actual priority observation').toBe(true);}
 }
 const report=items(decode(snap(run).outputs),'list').find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(REASON_SOURCE_REPORT)));
 expect(report).toBeDefined();
 const groupReports=items(items(report!,'list')[1],'list').map(v=>items(v,'list'));
 const coverage=groupReports.flatMap(v=>items(v[3],'list').map(v=>items(v,'list')));
 for(const alias of aliases){const row=coverage.find(v=>key(v[0])===key(descriptionIdentity(alias)));expect(row).toBeDefined();expect(row![4]).toEqual(q(1,1));expect(row![6]).toEqual(q(0,1));}
 const trace=outputs(snap(run).trace,160n).find(v=>{const out=f(v,13n);return key(f(v,6n))===key(text(REASON_SOURCES_VERSION))&&signedValue(f(rec(f(v,4n),130n),2n))===10n&&typeof out!=='boolean'&&out.kind==='list';});
 expect(trace,'actual new compiler trace').toBeDefined();expect(f(trace!,12n)).toEqual(raw);expect(items(f(trace!,13n),'list')).toEqual([p.context,report]);
 return {...p,descriptions,report:report!,coverage};
}
export function originalComparison(p:ReturnType<typeof capture>,s:ReturnType<typeof fixture>['s']){
 const groups=new Map<string,CanonicalValue[]>();
 for(const value of p.descriptions){
  const d=items(value,'list'),signal=rec(d[2],402n),source=rec(f(signal,1n),401n),task=rec(f(source,2n),371n);
  if(readQ(f(signal,2n)).equals(ZERO))continue;
  const descriptor=rr(916,[sid(1027,'M85/'+key(descriptionIdentity(value))),f(source,1n),d[1],f(task,2n),f(source,3n),q(1,1),set([])]);
  const mapped=rr(919,[descriptor,f(signal,2n),f(signal,3n),list([])]),groupKey=key(list([f(source,1n),d[1],f(task,2n)])),group=groups.get(groupKey)??[];group.push(mapped);groups.set(groupKey,group);
 }
 const original=(law:number)=>[...groups.values()].flatMap(group=>originalNuclei(compile(group,definition(s),law)));
 const aggregate=original(1),perFact=original(4);
 expect(key(set(aggregate.map(originalProjection)))).toBe(key(set(p.ns.map(nativeProjection))));
 expect(perFact.filter(n=>uint(f(n,7n))>0n).length).toBe(4);
 const analyze=(nuclei:typeof aggregate)=>{
  const options=[p.A,p.B].map(candidate=>{
   let distribution=new Map([[0n,ONE]]),reasonMass=ZERO;
   for(const n of nuclei.filter(n=>key(f(rec(f(n,1n),922n),1n))===key(candidate))){const d=readDistribution(f(n,11n));distribution=convolve(distribution,d);reasonMass=reasonMass.add(absolute(expectation(d)));}
   return {key:candidate,distribution,reasonMass};
  });
  return analyzeOptions(options,readQ(q(1,2)),readQ(q(1,2)),3).probabilities.map(v=>v.probability);
 };
 const baseline=analyze(aggregate),alternative=analyze(perFact);
 expect(baseline.map(v=>v.numerator+'/'+v.denominator)).not.toEqual(alternative.map(v=>v.numerator+'/'+v.denominator));
 console.info('M85 ORIGINAL '+JSON.stringify({aggregateNuclei:aggregate.length,perFactNuclei:perFact.length,aggregateProb:baseline.map(v=>v.numerator+'/'+v.denominator),perFactProb:alternative.map(v=>v.numerator+'/'+v.denominator),actualCapturedSources:true}));
}
export {nativeProjection,definition,decode,items,key,enc};
