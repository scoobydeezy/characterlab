/** Test-only complete-input alternatives, formal0.112 comparison correspondence. */
import {expect} from 'vitest';
import {ExactRational as Q} from '../../substrate/exactMath';
import {compileDescribedReasons,descriptionIdentity} from '../../assembled/reasons';
import {analyzeOptions} from '../../assembled/configurationMath';
import {readQ,qValue,ZERO,ONE,absolute,convolve,expectation,readDistribution} from '../../campaign2/cognitiveMath';
import {compareMultisourceCoverage,type CoverageLaw} from '../../campaign3/multisourceComparison';
import {rec,f,uint,items,key,decode,list,text,q,u,set,type CanonicalValue} from './assembledMultiReceipts';
import {record,map} from '../../substrate/canonicalEncoding';
import {sid} from '../../assembled/skill';
export const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('record');const r=v;return record(r.schema,new Map([...r.fields].map(([k,a])=>[k,k===n?x:a])));};
export function withDescriptions(raw:CanonicalValue,descriptions:CanonicalValue[]){const ds=descriptions.map(v=>items(v,'list'));return replace(replace(replace(raw,6n,list(descriptions)),3n,set(ds.filter(d=>key(d[1])===key(sid(1040,'Commitment'))).map(d=>d[2]))),5n,set(ds.filter(d=>key(d[1])===key(sid(1040,'Value'))).map(d=>d[2])));}
export function definition(source:{registry:Uint8Array},name='task-reason-dice'){const row=items(items(decode(source.registry),'list')[0],'set').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(sid(1027,'definition/'+name)))!;return f(rec(row,171n),4n);}
export function rows(raw:CanonicalValue){return items(f(rec(raw,403n),6n),'list').map(v=>{const d=items(v,'list'),s=rec(d[2],402n),sk=rec(f(s,1n),401n),basis=f(rec(f(s,3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map')throw Error('basis');return {v,d,s,sk,id:key(descriptionIdentity(v)),candidate:f(sk,1n),family:key(d[1]),ground:key(list([f(sk,1n),d[1],f(rec(f(sk,2n),371n),2n)])),role:uint(f(sk,3n)),strength:readQ(f(s,2n)),basis:new Map(basis.entries.map(([a,w])=>[key(a),readQ(w)]))};});}
const min=(a:typeof ONE,b:typeof ONE)=>a.compare(b)<0?a:b,max=(a:typeof ONE,b:typeof ONE)=>a.compare(b)>0?a:b;
const sum=(xs:typeof ONE[])=>xs.reduce((a,b)=>a.add(b),ZERO);
const overlap=(a:Map<string,typeof ONE>,b:Map<string,typeof ONE>)=>{let i=ZERO,u=ZERO;for(const k of new Set([...a.keys(),...b.keys()])){i=i.add(min(a.get(k)??ZERO,b.get(k)??ZERO));u=u.add(max(a.get(k)??ZERO,b.get(k)??ZERO));}return u.equals(ZERO)?ZERO:i.divide(u);};
export function compare(raw:CanonicalValue,source:{registry:Uint8Array},law:CoverageLaw){
 const rs=rows(raw);expect(rs.length).toBeLessThanOrEqual(64);for(const r of rs)expect(r.basis.size).toBeLessThanOrEqual(64);
 const families=new Map<string,Set<string>>();for(const r of rs)for(const a of r.basis.keys()){const k=key(r.candidate)+'/'+a,s=families.get(k)??new Set();s.add(r.family);families.set(k,s);}
 const witnesses:{row:typeof rs[number];normalization:typeof ONE;overlap:typeof ONE;effective:typeof ONE}[]=[],groups=new Map<string,typeof rs>();
 for(const r of rs){const k=r.ground+'/'+r.role+'/'+r.strength.compare(ZERO),g=groups.get(k)??[];g.push(r);groups.set(k,g);}
 for(const group of groups.values()){
  const sorted=group.map(row=>{const normalization=law==='FamilyNormalized'&&row.basis.size?sum([...row.basis].map(([k,w])=>w.divide(Q.of(BigInt(families.get(key(row.candidate)+'/'+k)!.size))))).divide(sum([...row.basis.values()])):ONE;return {row,normalization,scaled:absolute(row.strength).multiply(normalization)};}).sort((a,b)=>b.scaled.compare(a.scaled)||(a.row.id<b.row.id?-1:1));
  const aggregate=new Map<string,typeof ONE>(),prior:Map<string,typeof ONE>[]=[];
  for(const s of sorted){const shared=law==='GroundUncovered'?ZERO:law==='GroundPairwise'?prior.reduce((a,b)=>max(a,overlap(s.row.basis,b)),ZERO):overlap(s.row.basis,aggregate),effective=s.scaled.multiply(ONE.subtract(shared));witnesses.push({row:s.row,normalization:s.normalization,overlap:shared,effective});for(const [k,w]of s.row.basis)aggregate.set(k,max(w,aggregate.get(k)??ZERO));prior.push(s.row.basis);}
 }
 // No source disappears: replace every strength by its exact signed effective part.
 const descriptions=rs.map(row=>{const w=witnesses.find(w=>w.row===row)!;return list([row.d[0],row.d[1],replace(replace(row.s,2n,qValue(row.strength.compare(ZERO)<0?ZERO.subtract(w.effective):w.effective)),3n,replace(f(row.s,3n),1n,map([])))]);});
 const compiled=compileDescribedReasons(withDescriptions(raw,descriptions),definition(source),3,'SourceCoverage',true,true);
 return {witnesses,compiled,analysis:analyze(raw,compiled.nuclei,source)};
}
export function analyze(raw:CanonicalValue,nuclei:readonly CanonicalValue[],source:{registry:Uint8Array}){
 const options=items(f(rec(f(rec(raw,403n),2n),398n),3n),'list').map(v=>f(rec(v,397n),1n)),def=rec(definition(source,'task-arbitration'),440n);
 return analyzeOptions(options.map(candidate=>{let distribution=new Map([[0n,ONE]]),reasonMass=ZERO;for(const v of nuclei.filter(n=>key(f(rec(f(rec(n,407n),1n),404n),1n))===key(candidate))){const d=readDistribution(f(rec(v,407n),7n));distribution=convolve(distribution,d);reasonMass=reasonMass.add(absolute(expectation(d)));}return {key:candidate,distribution,reasonMass};}),readQ(f(def,1n)),readQ(f(def,2n)),3);
}
export function descriptionDice(raw:CanonicalValue,source:{registry:Uint8Array}){const ns=rows(raw).filter(r=>r.role===1n).flatMap(r=>compileDescribedReasons(withDescriptions(raw,[r.v]),definition(source),3,'SourceCoverage',true,true).nuclei);return {count:ns.length,analysis:analyze(raw,ns,source)};}
export function originalCorrespondence(raw:CanonicalValue,source:{registry:Uint8Array}){
 const rs=rows(raw).filter(r=>!r.strength.equals(ZERO));let crossFamily=0;
 for(const candidate of new Set(rs.map(r=>key(r.candidate)))){
  const subset=rs.filter(r=>key(r.candidate)===candidate);if(subset.length>5||subset.some(r=>![1n,2n].includes(r.role)||r.basis.size>4))continue;
  if(new Set(subset.map(r=>r.family)).size===2)crossFamily++;
  const ids=[...new Set(subset.flatMap(r=>[...r.basis.keys()]))].sort(),grounds=[...new Set(subset.map(r=>r.ground))].sort();
  const converted=subset.map(r=>({source:'s'+rs.indexOf(r).toString().padStart(2,'0'),ground:'g'+grounds.indexOf(r.ground),family:(r.family===key(sid(1040,'Value'))?'Body':'Task') as 'Body'|'Task',role:(r.role===1n?'Base':'Situation') as 'Base'|'Situation',strength:r.strength,basis:[...r.basis].map(([k,w])=>['a'+ids.indexOf(k),w] as const)}));
  // Actual description ordering is preserved by ordinal source labels.
  const ordered=[...subset].sort((a,b)=>a.id<b.id?-1:1);converted.forEach((r,i)=>r.source='s'+ordered.indexOf(subset[i]).toString().padStart(2,'0'));
  for(const law of ['GroundAggregate','GroundPairwise','GroundUncovered','FamilyNormalized'] as const){const native=compare(raw,source,law),old=compareMultisourceCoverage(converted,law);for(const w of old.witnesses){const row=subset[converted.findIndex(x=>x.source===w.source)],n=native.witnesses.find(x=>x.row.id===row.id)!;expect([n.effective,n.overlap,n.normalization]).toEqual([w.effective,w.overlap,w.normalization]);}}
 }
 return crossFamily;
}
