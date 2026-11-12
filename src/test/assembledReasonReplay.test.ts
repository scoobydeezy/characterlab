/** M95: all native cases use0.80, fixed seed0/body30/cap100/rate10/delivery90@9.
 * Three physical tasks, no people. Prior scenarios/calibration are preserved.
 * Counterfactual compiler operands are test-only and never enter native state. */
import {it,expect,vi} from 'vitest';
import {map,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreCharacterRun} from '../assembled/character';
import * as reasons from '../assembled/reasons';
import {REASON_READING,CONTEXT_EVIDENCE} from '../assembled/reasonEvidence';
import {VALUE_MOTIVE_PROVENANCE} from '../assembled/valueReceiving';
import {PERFORMANCE_OBS} from '../assembled/performance';
import {fixture as evidence} from './fixtures/assembledReasonEvidence';
import {fixture as keyFixture,originalOperands,analyzeOriginal,taskA,taskB,frac,readQ} from './fixtures/assembledReasonKeys';
import {fixture as valueFixture,reports} from './fixtures/assembledValueProvenance';
import {mapping} from './fixtures/assembledStandingSources';
import {compile,originalNuclei,originalProjection,valueDice} from './fixtures/assembledReasonCorrespondence';
import {projection} from './fixtures/assembledContextReasons';
import {exact,bytes} from './fixtures/assembledAffectReceiving';
import {promote,create,capture,sourceCorrespondence,standingProbe,replace,snap,through,decode,enc,items,key,rec,r,f,uint,q,list,set,text,u,signed,sid,definition} from './fixtures/assembledReasonReference';
type Captured=ReturnType<typeof capture>;
function cancellation(kind:'positive'|'cancel'|'negative'='cancel',hidden=false,permitted=true){
 const b=keyFixture('split',hidden,permitted),slots=[...items(decode(b.s.registry),'list')];
 slots[45]=list([text(CONTEXT_EVIDENCE),list(b.descriptors.map(v=>{const d=[...items(v,'list')];d[2]=taskB;d[3]=q(2,3);return list(d);}))]);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const row=[...items(v,'list')];if(key(row[2])===key(REASON_READING)){const p=[...items(row[3],'list')];p[0]=q(kind==='negative'?-1:1,1);p[1]=q(kind==='positive'?1:-1,1);row[3]=list(p);}return list(row);});
 return promote({s:{...b.s,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}});
}
function duplicate(on:boolean){const b=evidence(0),slots=[...items(decode(b.s.registry),'list')];slots[44]=list([text(reasons.REASON_SOURCES),list(on?[text('restated')]:[])]);return promote({...b,s:{...b.s,registry:enc(list(slots))}});}
/** Old codec cannot represent399/2. Preserve the evidence-set algebra by an
 * explicit reversible opaque bijection; this never claims observation provenance. */
function legacyEvidence(raw:CanonicalValue){
 const ds=items(f(rec(raw,403n),6n),'list');
 const bases=ds.map(d=>f(rec(f(rec(items(d,'list')[2],402n),3n),400n),1n));
 if(!bases.some(b=>typeof b!=='boolean'&&b.kind==='map'&&b.entries.some(([a])=>typeof a!=='boolean'&&a.kind==='record'&&a.schema.typeId===399n&&a.schema.schemaVersion===2n)))return raw;
 const inverse=new Map<string,CanonicalValue>(),forward=new Map<string,string>();
 const signal=(v:CanonicalValue)=>{const sig=rec(v,402n),basis=f(rec(f(sig,3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map')throw Error('basis');
  const entries=basis.entries.map(([atom,weight])=>{const surrogate=r(399,[u(1),r(237,[u(1),sid(1115,'M95-opaque-atom/'+key(atom))])]);const k=key(surrogate),old=inverse.get(k);if(old)expect(old).toEqual(atom);inverse.set(k,atom);forward.set(key(atom),k);return [surrogate,weight] as const;});
  expect(map(entries.map(([atom,weight])=>[inverse.get(key(atom))!,weight]))).toEqual(basis);expect(entries).toHaveLength(basis.entries.length);
  return replace(sig,3n,r(400,[map(entries)]));
 };
 const projected=r(403,[f(rec(raw,403n),1n),f(rec(raw,403n),2n),set(items(f(rec(raw,403n),3n),'set').map(signal)),f(rec(raw,403n),4n),set(items(f(rec(raw,403n),5n),'set').map(signal)),list(ds.map(d=>{const x=items(d,'list');return list([x[0],x[1],signal(x[2])]);}))],3);
 expect(forward.size).toBe(inverse.size);expect(forward.size).toBeGreaterThan(0);
 console.info('M95 EVIDENCE BIJECTION '+forward.size+' distinct atoms; inverse/weights exact; diagnostic only');return projected;
}
function original(raw:CanonicalValue,source:{registry:Uint8Array},law=1,grouped=false){
 const {rows}=originalOperands(legacyEvidence(raw));let groups:CanonicalValue[][];
 if(grouped){const m=new Map<string,CanonicalValue[]>();for(const row of rows){const d=rec(f(row,1n),916n),k=key(list([f(d,2n),f(d,3n),f(d,4n)]));m.set(k,[...(m.get(k)??[]),row]);}groups=[...m.values()];}
 else groups=[rows];
 expect(groups.flat()).toHaveLength(rows.length);
 const results=groups.map(g=>{expect(g.length).toBeLessThanOrEqual(6);const d=rec(f(rec(g[0],919n),1n),916n),isValue=key(f(d,3n))===key(sid(1040,'Value'));return compile(g,grouped&&isValue?valueDice:definition(source),law);});
 return {rows,groups,results,ns:results.flatMap(originalNuclei)};
}
function agreement(p:Captured,source:{registry:Uint8Array},grouped=false){const a=original(p.raw,source,1,grouped);expect(a.ns).toHaveLength(p.ns.length);expect(key(set(a.ns.map(originalProjection)))).toBe(key(set(p.ns.map(projection))));expect(analyzeOriginal(p.raw,source,a.ns)).toEqual(p.probabilities.map(readQ));return a;}
const preserve=(run:Parameters<typeof snap>[0])=>{const before=run.snapshot(),save=run.save();return()=>{const after=run.snapshot();for(const k of ['state','outputs','trace'] as const)bytes(before[k],after[k]);bytes(save,run.save());};};
let learnedValue:Awaited<ReturnType<typeof create>>;
it('M95 keys: reference preserves referent, sign, role and duplicate semantics',async()=>{
 const cases=['same','split','negative','modifier'] as const,ps:Captured[]=[];let splitSource:ReturnType<typeof promote>|undefined;
 for(const kind of cases){const x=await create(promote(keyFixture(kind))),p=capture(x.run,x.b.s);sourceCorrespondence(p);agreement(p,x.b.s);ps.push(p);if(kind==='split')splitSource=x.b;}
 expect(ps.map(p=>p.ns.length)).toEqual([2,3,3,2]);
 expect(ps.map(p=>p.probabilities)).toEqual([[q(55,64),q(9,64)],[q(283,288),q(5,288)],[q(43,144),q(101,144)],[q(13,16),q(3,16)]]);
 expect(ps[3].groups.some(g=>key(g[1])===key(text('ZeroBase'))&&key(g[2])===key(q(2,5)))).toBe(true);
 const pooled=original(ps[1].raw,splitSource!.s,2);expect(pooled.ns).toHaveLength(2);expect(analyzeOriginal(ps[1].raw,splitSource!.s,pooled.ns)).toEqual([q(55,64),q(9,64)].map(readQ));
 const a=await create(duplicate(false)),b=await create(duplicate(true)),p=capture(a.run,a.b.s),d=capture(b.run,b.b.s);
 expect(set(p.ns.map(projection))).toEqual(set(d.ns.map(projection)));expect(p.probabilities).toEqual(d.probabilities);expect(items(f(d.raw,6n),'list').length).toBeGreaterThan(items(f(p.raw,6n),'list').length);
 const rows=d.groups.flatMap(g=>items(g[3],'list').map(v=>items(v,'list'))),duplicates=rows.filter(v=>key(items(v[0],'list')[0])===key(text('restated')));expect(duplicates.length).toBeGreaterThan(0);for(const row of duplicates)expect(row[6]).toEqual(q(0,1));
 console.info('M95 KEYS PASS counts2/3/3/2; probabilities retained; pooled loses task key; duplicate descriptions exact zero');
},570000);
it('M95 cancellation: opposing sources resolve before dice; PerFactDie differs',async()=>{
 const ps:Captured[]=[];let cancelled:Awaited<ReturnType<typeof create>>|undefined;
 for(const kind of ['positive','cancel','negative'] as const){const x=await create(cancellation(kind)),p=capture(x.run,x.b.s);sourceCorrespondence(p);agreement(p,x.b.s);ps.push(p);if(kind==='cancel')cancelled=x;}
 expect(ps.map(p=>p.ns.length)).toEqual([3,2,3]);expect(ps.map(p=>p.probabilities)).toEqual([[q(187,192),q(5,192)],[q(23,32),q(9,32)],[q(5,32),q(27,32)]]);
 const p=ps[1],group=p.groups.find(g=>key(f(rec(g[0],404n),3n))===key(f(rec(taskB,371n),2n))&&key(g[1])===key(text('ZeroBase')))!;expect(group).toBeDefined();expect(items(group[3],'list')).toHaveLength(2);
 const untouched=preserve(cancelled!.run),alternative=original(p.raw,cancelled!.b.s,4);expect(alternative.ns).toHaveLength(4);expect(analyzeOriginal(p.raw,cancelled!.b.s,alternative.ns)).toEqual([q(1,2),q(1,2)].map(readQ));untouched();
 console.info('M95 CANCELLATION PASS signed counts3/2/3; exact zero retains both sources; original PerFactDie4 gives1/2,1/2');
},570000);
it('M95 Value: genuine learned motive cites receipts and changes probabilities',async()=>{
 learnedValue=await create(promote(valueFixture()),12n);const no=await create(promote(valueFixture(false)),12n),p=capture(learnedValue.run,learnedValue.b.s,12n),n=capture(no.run,no.b.s,12n);agreement(p,learnedValue.b.s,true);agreement(n,no.b.s,true);
 expect(capture(learnedValue.run,learnedValue.b.s,10n).value).toHaveLength(0);expect(capture(no.run,no.b.s,10n).value).toHaveLength(0);expect(f(p.raw,3n),'all non-Value signals fixed').toEqual(f(n.raw,3n));
 expect(p.value).toHaveLength(1);expect(n.value).toHaveLength(0);expect(p.probabilities).toEqual([q(379,384),q(5,384)]);expect(n.probabilities).toEqual([q(55,64),q(9,64)]);
 const m=reports(learnedValue.run,VALUE_MOTIVE_PROVENANCE).find(v=>uint(items(v[7],'list')[2])===12n)!;expect(m).toBeDefined();expect(m[4]).toEqual(q(1,2));expect(m[6]).toEqual(q(1,2));const receipts=items(m[8],'list');expect(receipts).toHaveLength(1);
 const observation=items(items(receipts[0],'list')[0],'list');expect(observation[2]).toEqual(u(10));expect(observation[6]).toBe(true);expect(reports(learnedValue.run,PERFORMANCE_OBS).map(list)).toContainEqual(list(observation));
 const basis=f(rec(f(rec(p.value[0],402n),3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map')throw Error('basis');expect(basis.entries).toHaveLength(1);const [atom,weight]=basis.entries[0];if(typeof atom==='boolean'||atom.kind!=='record')throw Error('receipt atom');expect([atom.schema.typeId,atom.schema.schemaVersion]).toEqual([399n,2n]);expect(atom.fields.get(1n)).toEqual(u(3));expect(atom.fields.get(2n)).toEqual(observation[1]);expect(weight).toEqual(q(1,1));
 const vk=rec(f(rec(p.ns.find(v=>key(f(rec(f(rec(v,407n),1n),404n),2n))===key(sid(1040,'Value')))!,407n),1n),404n);
 expect(p.ns.some(v=>{const k=rec(f(rec(v,407n),1n),404n);return key(f(k,2n))===key(sid(1040,'Commitment'))&&key(f(k,1n))===key(f(vk,1n))&&key(f(k,3n))===key(f(vk,3n));})).toBe(true);
 const hidden=await create(promote(valueFixture(true,true,true)),12n),denied=await create(promote(valueFixture(true,false)),12n),h=capture(hidden.run,hidden.b.s,12n),d=capture(denied.run,denied.b.s,12n);
 expect(h.raw).toEqual(p.raw);expect(h.data).toEqual(p.data);expect(d.value).toHaveLength(0);
 console.info('M95 VALUE PASS actual receipt10 supports distinct Value/Commitment same referent; A55/64 ->379/384; hidden exact, denied acquisition absent');
},570000);
it('M95 isolated: motive and basis interventions; native-source PairwiseOnly',async()=>{
 const x=await create(promote(evidence())),p=capture(x.run,x.b.s);sourceCorrespondence(p);const untouched=preserve(x.run);
 const pairwise=original(p.raw,x.b.s,3,true),nativeA=rec(p.ns[0],407n),oldA=pairwise.ns.find(n=>key(f(rec(f(n,1n),922n),1n))===key(f(rec(f(nativeA,1n),404n),1n)))!;
 expect(f(rec(f(nativeA,2n),406n),1n)).toEqual(q(121,181));expect(f(oldA,2n)).toEqual(q(257,377));
 const witnesses=pairwise.results.flatMap(result=>[...originalNuclei(result).flatMap(n=>items(f(n,12n),'list')),...items(f(rec(result,924n),4n),'list').flatMap(v=>items(f(rec(v,928n),5n),'list'))]);
 const combined=originalOperands(p.raw).rows.find(v=>{const desc=rec(f(v,1n),916n);return key(f(rec(v,919n),2n))===key(q(1,4));})!;expect(combined).toBeDefined();
 const w=witnesses.map(v=>rec(v,921n)).find(v=>key(f(v,1n))===key(f(rec(combined,919n),1n)))!;expect(w).toBeDefined();expect(f(w,4n)).toEqual(q(1,8));
 expect(analyzeOriginal(p.raw,x.b.s,pairwise.ns)).toEqual(p.probabilities.map(readQ));
 const selected=p.produced.map(v=>items(v,'list')[1]).filter(v=>['reading1','reading2'].some(label=>key(items(v,'list')[0])===key(text(label))));expect(selected).toHaveLength(2);
 const make=(ds:CanonicalValue[])=>r(403,[f(p.raw,1n),f(p.raw,2n),set(ds.filter(v=>key(items(v,'list')[1])===key(sid(1040,'Commitment'))).map(v=>items(v,'list')[2])),f(p.raw,4n),set(ds.filter(v=>key(items(v,'list')[1])===key(sid(1040,'Value'))).map(v=>items(v,'list')[2])),list(ds)],3);
 const first=items(selected[0],'list'),second=items(selected[1],'list'),differentMotive=list([second[0],sid(1040,'Value'),second[2]]),firstBasis=f(rec(first[2],402n),3n),differentBasis=list([second[0],second[1],replace(second[2],3n,firstBasis)]);
 expect(items(differentMotive,'list')[0]).toEqual(second[0]);expect(items(differentMotive,'list')[2]).toEqual(second[2]);expect(f(rec(items(differentBasis,'list')[2],402n),1n)).toEqual(f(rec(second[2],402n),1n));expect(f(rec(items(differentBasis,'list')[2],402n),2n)).toEqual(f(rec(second[2],402n),2n));
 const raws=[make(selected),make([selected[0],differentMotive]),make([selected[0],differentBasis])],compiled=raws.map(raw=>reasons.compileDescribedReasons(raw,definition(x.b.s),3,'SourceCoverage',true));
 expect(compiled.map(c=>c.nuclei.length)).toEqual([1,2,1]);expect(f(rec(f(rec(compiled[0].nuclei[0],407n),2n),406n),1n)).toEqual(q(17,29));expect(f(rec(f(rec(compiled[2].nuclei[0],407n),2n),406n),1n)).toEqual(q(3,7));
 // Common task dice in ORIGINAL isolates grouping, not native Value calibration.
 const old=raws.map(raw=>originalNuclei(compile(originalOperands(raw).rows,definition(x.b.s))));expect(old.map(ns=>ns.length)).toEqual([1,2,1]);
 expect(f(old[0][0],2n)).toEqual(q(17,29));expect(f(old[2][0],2n)).toEqual(q(3,7));
 untouched();console.info('M95 ISOLATED PASS motive-only keys1 ->2; basis-only17/29 ->3/7; all native collective sources retained, original Pairwise residual1/8 vs0 with unchanged quantized probability');
},570000);
it('M95 standing competitor: whole acquired input and separate-die alternative',async()=>{
 const x=await create(standingProbe(),12n),p=capture(x.run,x.b.s,12n);mapping(x.run);const untouched=preserve(x.run),a=agreement(p,x.b.s,true),alt=original(p.raw,x.b.s,5,true);
 expect(a.rows).toHaveLength(7);expect(a.groups.map(g=>g.length).sort()).toEqual([2,5]);expect(p.ns).toHaveLength(2);expect(alt.ns).toHaveLength(1);expect(analyzeOriginal(p.raw,x.b.s,alt.ns)).toEqual([q(1,1),q(0,1)].map(readQ));
 const rejected=alt.results.flatMap(v=>items(f(rec(v,924n),4n),'list')).map(v=>rec(v,928n));expect(rejected).toHaveLength(3);expect(rejected.filter(v=>rec(f(v,1n),922n).fields.has(5n))).toHaveLength(2);untouched();
 console.info('M95 IDENTITY PASS all7 sources/groups5+2; separate standing bases subthreshold, weak rescue lost; probabilities55/64,9/64 ->1,0');
},570000);
it('M95 continuation: learned Value and cancellation survive every settlement',async()=>{
 for(const [fixture,at] of [[promote(valueFixture()),10n],[cancellation(),9n]] as const){
  const a=await create(fixture,at),b=await create(fixture,at);exact(a.run,b.run);const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);const clocks:bigint[]=[];
  for(let i=0;;i++){expect(i).toBeLessThan(32);const steps=[];for(const run of [a.run,b.run,restored])steps.push(await run.settleNextInstant());expect(steps[1]).toBe(steps[0]);expect(steps[2]).toBe(steps[0]);const x=a.run.snapshot();
   for(const run of [b.run,restored]){const y=run.snapshot();expect([y.clock,y.status]).toEqual([x.clock,x.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.run.save(),run.save());bytes(a.run.runIdentity(),run.runIdentity());}if(!steps[0])break;clocks.push(x.clock);
  }expect(a.run.snapshot().clock).toBe(101n);console.info('M95 CONTINUATION '+at+' -> '+clocks.join(','));
 }
 const fault=await create(cancellation(),9n),before=fault.run.snapshot(),original=reasons.compileDescribedReasons;let reached=false;
 const spy=vi.spyOn(reasons,'compileDescribedReasons').mockImplementation((...args)=>{original(...args);reached=true;throw Error('M95 after compiler');});try{await expect(fault.run.settleNextInstant()).rejects.toThrow('M95 after compiler');}finally{spy.mockRestore();}
 expect(reached).toBe(true);expect({...fault.run.snapshot(),status:before.status}).toEqual(before);console.info('M95 ROLLBACK PASS complete cancelled-reason instant');
},570000);
