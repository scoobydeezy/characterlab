import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {REASON_READING,CONTEXT_EVIDENCE} from '../assembled/reasonEvidence';
import {PRIORITY_DISPLAY} from '../assembled/priority';
import * as reasons from '../assembled/reasons';
import {exact,bytes} from './fixtures/assembledAffectReceiving';
import {fixture as prior,capture,sourceCorrespondence,originalComparison,originalOperands,analyzeOriginal,frac,
 snap,through,decode,enc,items,key,rec,r,f,uint,q,list,set,text,u,signed,taskB,readQ} from './fixtures/assembledReasonKeys';
import {fixture as standingFixture,mapping,correspondence} from './fixtures/assembledStandingSources';
import {compile,originalNuclei,originalProjection,definition} from './fixtures/assembledReasonCorrespondence';
import {projection} from './fixtures/assembledContextReasons';
import type {CanonicalValue} from '../substrate/canonicalEncoding';

/** M92: M91 physical/no-person scenario, seed0, body30/cap100/rate10,
 * delivery90 at9, A/B importance3/5 and urgency1, threat1/2.
 * Both permitted channel descriptions target action A/task B at gain2/3.
 * Only physical reading signs change. No authored intermediate or alternate run. */
type Case='positive'|'cancel'|'negative';
function fixture(kind:Case='cancel',hidden=false,permitted=true){
 const b=prior('split',hidden,permitted),slots=[...items(decode(b.s.registry),'list')];
 const descriptors=b.descriptors.map(v=>{const d=[...items(v,'list')];d[2]=taskB;d[3]=q(2,3);return list(d);});
 slots[45]=list([text(CONTEXT_EVIDENCE),list(descriptors)]);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const row=[...items(v,'list')];if(key(row[2])===key(REASON_READING)){
   const p=[...items(row[3],'list')];p[0]=q(kind==='negative'?-1:1,1);p[1]=q(kind==='positive'?1:-1,1);row[3]=list(p);
  }return list(row);
 });
 return {s:{...b.s,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
async function create(kind:Case='cancel',hidden=false,permitted=true,at=10n){
 const b=fixture(kind,hidden,permitted),run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(run,at);return {b,run};
}
let cancel:Awaited<ReturnType<typeof create>>;
it('M92 cancellation: signed raw evidence cancels before bounding and die creation',async()=>{
 const positive=await create('positive');cancel=await create();const negative=await create('negative');
 const runs=[positive,cancel,negative],ps=runs.map(a=>capture(a.run,a.b.s));
 const matches=ps.map((p,i)=>{
  expect(p.samples).toHaveLength(2);expect(p.produced).toHaveLength(2);expect(p.rejected).toHaveLength(0);
  sourceCorrespondence(p);return originalComparison(p,runs[i].b.s);
 });
 expect(positive.b.s).toEqual(cancel.b.s);expect(cancel.b.s).toEqual(negative.b.s);
 const primary=(p:typeof ps[number])=>items(f(p.raw,6n),'list').filter(v=>key(items(v,'list')[0])===key(text('primary')));
 for(const p of ps){expect(primary(p)).toEqual(primary(ps[0]));for(const i of [1n,2n,4n,5n])expect(f(p.raw,i)).toEqual(f(ps[0].raw,i));}
 for(const [a,b,changed] of [[0,1,1],[1,2,0]] as const){
  const before=items(decode(runs[a].b.d.orderedInputs),'list'),after=items(decode(runs[b].b.d.orderedInputs),'list');
  const diffs=before.map((v,i)=>key(v)===key(after[i])?-1:i).filter(i=>i>=0);expect(diffs).toHaveLength(1);
  const x=items(before[diffs[0]],'list'),y=items(after[diffs[0]],'list');expect(x[2]).toEqual(REASON_READING);
  x.forEach((v,i)=>{if(i!==3)expect(v).toEqual(y[i]);});
  const xp=items(x[3],'list'),yp=items(y[3],'list');xp.forEach((v,i)=>{if(i!==changed)expect(v).toEqual(yp[i]);});
  expect(xp[changed]).toEqual(q(1,1));expect(yp[changed]).toEqual(q(-1,1));
  expect(ps[a].probabilities).not.toEqual(ps[b].probabilities);
 }
 const groups=ps.map(p=>{
  const sk=rec(f(rec(items(items(p.produced[0],'list')[1],'list')[2],402n),1n),401n);
  const g=p.groups.find(g=>{const k=rec(g[0],404n);return key(f(k,1n))===key(f(sk,1n))&&key(f(k,3n))===key(f(rec(taskB,371n),2n));})!;
  expect(g,'live compared group including rejected zero').toBeDefined();return g;
 });
 expect(ps.map(p=>p.ns.length)).toEqual([3,2,3]);
 expect(groups.map(g=>g[1])).toEqual([text('Active'),text('ZeroBase'),text('Active')]);
 expect(uint(f(rec(groups[0][0],404n),4n))).toBe(1n);expect(uint(f(rec(groups[2][0],404n),4n))).toBe(2n);
 expect(groups.map(g=>g[2])).toEqual([q(4,7),q(0,1),q(4,7)]);
 const zeroCoverage=items(groups[1][3],'list').map(v=>items(v,'list'));
 expect(zeroCoverage).toHaveLength(2);expect(zeroCoverage.map(v=>key(v[2])).sort()).toEqual([signed(-1),signed(1)].map(key).sort());
 for(const v of zeroCoverage){expect(v[3]).toEqual(q(2,3));expect(v[4]).toEqual(q(0,1));expect(v[6]).toEqual(q(2,3));}
 const rejected=items(f(rec(matches[1].result,924n),4n),'list');expect(rejected).toHaveLength(1);expect(f(rec(rejected[0],928n),4n)).toEqual(q(0,1));
 const alternative=originalNuclei(compile(matches[1].rows,definition(cancel.b.s),4));
 expect(alternative).toHaveLength(4);expect(matches[1].analyze(alternative)).not.toEqual(ps[1].probabilities.map(readQ));
 console.info('M92 CANCELLATION PASS '+JSON.stringify(ps.map((p,i)=>({case:['positive','cancel','negative'][i],nuclei:p.ns.length,probabilities:p.probabilities.map(v=>frac(readQ(v))),mode:String(uint(f(p.data,8n))),draws:items(f(p.data,9n),'list').length}))));
 console.info('M92 PERFACT '+JSON.stringify({sources:matches[1].rows.length,active:[2,alternative.length],reference:ps[1].probabilities.map(v=>frac(readQ(v))),alternative:matches[1].analyze(alternative).map(frac),alsoSeparatesModifiers:true}));
},570000);
it('M92 privacy: hidden truth is inert and denial removes opposing evidence',async()=>{
 const a=cancel??await create(),hidden=await create('cancel',true),denied=await create('cancel',false,false);
 const p=capture(a.run,a.b.s),h=capture(hidden.run,hidden.b.s),d=capture(denied.run,denied.b.s);
 expect(p.raw).toEqual(h.raw);expect(p.data).toEqual(h.data);
 expect(d.samples).toHaveLength(1);expect(d.produced).toHaveLength(1);sourceCorrespondence(d);
 expect(d.rejected).toHaveLength(1);expect(items(d.rejected[0],'list')[1]).toEqual(text('MissingEvidence'));
 expect(d.ns).toHaveLength(3);expect(d.probabilities).not.toEqual(p.probabilities);
 console.info('M92 PRIVACY PASS exact hidden raw/decision; denied negative sample removes its source and restores live base');
},570000);
it('M92 standing: original independent-die alternative loses actual weak-base rescue',async()=>{
 // Exact M90 eligible scenario, reconstructed from the unchanged M89 source.
 const old=standingFixture();let changed=0;
 const rows=items(decode(old.d.orderedInputs),'list').map(v=>{
  const row=[...items(v,'list')];if(key(row[0])===key(signed(12))&&key(row[2])===key(PRIORITY_DISPLAY)){
   const p=items(row[3],'list');row[3]=list([p[0],list(items(p[1],'list').map(v=>{
    const t=[...items(v,'list')];if(key(t[0])===key(taskB)){expect(t[1]).toEqual(list([]));expect(t[3]).toEqual(list([q(1,1)]));expect(t[4]).toBe(true);t[3]=list([q(19,20)]);changed++;}return list(t);
   }))]);
  }return list(row);
 });expect(changed).toBe(1);
 const d={...old.d,orderedInputs:enc(list(rows))},run=await createCharacterRun(await prepareCharacterModel(old.s),d);await through(run,12n);
 const p=mapping(run);expect(p.probabilities).toEqual([q(55,64),q(9,64)]);expect(frac(p.formation.P)).toBe('98775/3572128');
 const before=run.snapshot(),save=run.save();correspondence(p,old.s);
 const {rows:all}=originalOperands(p.raw);expect(all).toHaveLength(7);
 const groups=new Map<string,CanonicalValue[]>();
 for(const row of all){const desc=rec(f(row,1n),916n),k=key(list([f(desc,2n),f(desc,3n),f(desc,4n)]));groups.set(k,[...(groups.get(k)??[]),row]);}
 expect([...groups.values()].map(g=>g.length).sort()).toEqual([2,5]);expect([...groups.values()].flat()).toHaveLength(7);
 const results=(law:number)=>[...groups.values()].map(g=>{expect(g.length).toBeLessThanOrEqual(6);return compile(g,definition(old.s),law);});
 const reference=results(1),alternative=results(5),ns=reference.flatMap(originalNuclei),alt=alternative.flatMap(originalNuclei);
 expect(key(set(ns.map(originalProjection)))).toBe(key(set(p.ns.map(projection))));expect(ns).toHaveLength(2);expect(alt).toHaveLength(1);
 expect(analyzeOriginal(p.raw,old.s,ns)).toEqual(p.probabilities.map(readQ));
 expect(analyzeOriginal(p.raw,old.s,alt)).toEqual([q(1,1),q(0,1)].map(readQ));
 const rejected=alternative.flatMap(v=>items(f(rec(v,924n),4n),'list')).map(v=>rec(v,928n));
 const separate=rejected.filter(v=>rec(f(v,1n),922n).fields.has(5n));expect(separate).toHaveLength(2);
 for(const v of separate){expect(uint(f(v,2n))).toBe(2n);expect(readQ(f(v,4n)).numerator).not.toBe(0n);}
 expect(rejected).toHaveLength(3); // Two subthreshold standing bases and the unrescued B base.
 const after=run.snapshot();for(const k of ['state','outputs','trace'] as const)bytes(before[k],after[k]);bytes(save,run.save());
 console.info('M92 IDENTITY CONTROL PASS '+JSON.stringify({sources:all.length,groups:[5,2],reference:[2,'55/64','9/64'],independent:[1,'1/1','0/1'],separateStandingRejected:2,lostWeakRescue:true,nativeMutated:false}));
},570000);
it('M92 persistence: exact cancelled-reason continuation and atomic rollback',async()=>{
 const a=await create('cancel',false,true,9n),b=await create('cancel',false,true,9n);exact(a.run,b.run);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);
 const checkpoints:bigint[]=[];
 for(let n=0;;n++){
  expect(n).toBeLessThan(32);const results=[];for(const run of [a.run,b.run,restored])results.push(await run.settleNextInstant());
  expect(results[1]).toBe(results[0]);expect(results[2]).toBe(results[0]);const x=a.run.snapshot();
  for(const run of [b.run,restored]){const y=run.snapshot();expect([x.clock,x.status]).toEqual([y.clock,y.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.run.save(),run.save());bytes(a.run.runIdentity(),run.runIdentity());}
  if(!results[0])break;checkpoints.push(x.clock);
 }
 expect(checkpoints).toContain(10n);expect(a.run.snapshot().clock).toBe(101n);for(const run of [a.run,b.run,restored])expect(run.diagnostic()).toBeUndefined();
 const fault=await create('cancel',false,true,9n),before=fault.run.snapshot(),original=reasons.compileDescribedReasons;let reached=false;
 const spy=vi.spyOn(reasons,'compileDescribedReasons').mockImplementation((...args)=>{const out=original(...args);expect(out.nuclei).toHaveLength(2);expect(items(items(out.report,'list')[1],'list').some(v=>key(items(v,'list')[1])===key(text('ZeroBase')))).toBe(true);reached=true;throw Error('M92 after cancelled reason');});
 try{await expect(fault.run.settleNextInstant()).rejects.toThrow('M92 after cancelled reason');}finally{spy.mockRestore();}
 expect(reached).toBe(true);expect({...fault.run.snapshot(),status:before.status}).toEqual(before);
 console.info('M92 PERSISTENCE PASS repeat9/restore9 every settlement '+checkpoints.join(',')+'; cancelled-reason post-compiler rollback');
},570000);
