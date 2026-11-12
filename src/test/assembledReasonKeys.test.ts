import {it,expect,vi} from 'vitest';
import {restoreCharacterRun} from '../assembled/character';
import * as reasons from '../assembled/reasons';
import {exact,bytes} from './fixtures/assembledAffectReceiving';
import {create,capture,fixture,sourceCorrespondence,originalComparison,frac,type Case,
 snap,through,decode,enc,items,key,rec,f,uint,q,list,text,signed,taskA,taskB,readQ} from './fixtures/assembledReasonKeys';
const runs=new Map<Case,Awaited<ReturnType<typeof create>>>();
const group=(p:ReturnType<typeof capture>)=>p.groups.find(g=>{
 const k=rec(g[0],404n);return key(f(rec(f(k,1n),395n),2n))===key(items(fixture().descriptors[0],'list')[1])&&key(f(k,3n))===key(f(rec(taskB,371n),2n));
});
it('M91 native: referent, sign and source role survive one shared decision',async()=>{
 const found=new Map<Case,ReturnType<typeof capture>>();
 for(const kind of ['same','split','negative','modifier'] as const){
  const a=await create(kind);runs.set(kind,a);const p=capture(a.run,a.b.s);found.set(kind,p);
  expect(p.samples).toHaveLength(2);expect(p.produced).toHaveLength(2);expect(p.rejected).toHaveLength(0);
  sourceCorrespondence(p);originalComparison(p,a.b.s,kind==='split');
 }
 const a=found.get('same')!,b=found.get('split')!,n=found.get('negative')!,m=found.get('modifier')!;
 expect(a.ns).toHaveLength(2);expect(b.ns).toHaveLength(3);expect(n.ns).toHaveLength(3);expect(m.ns).toHaveLength(2);
 expect(runs.get('same')!.b.d).toEqual(runs.get('split')!.b.d);
 const sameD=items(runs.get('same')!.b.descriptors[1],'list'),splitD=items(runs.get('split')!.b.descriptors[1],'list'),modD=items(runs.get('modifier')!.b.descriptors[1],'list');
 sameD.forEach((v,i)=>{if(i!==2)expect(v).toEqual(splitD[i]);});
 splitD.forEach((v,i)=>{if(i!==5)expect(v).toEqual(modD[i]);});
 const ordinary=(p:typeof a)=>items(f(p.raw,6n),'list').filter(v=>key(items(v,'list')[0])!==key(text('reading2')));
 for(const p of [b,n,m]){
  for(const i of [1n,2n,4n,5n])expect(f(p.raw,i)).toEqual(f(a.raw,i));
  expect(ordinary(p)).toEqual(ordinary(a));
  expect(items(p.produced[0],'list')).toEqual(items(a.produced[0],'list'));
 }
 expect(a.samples).toEqual(b.samples);expect(b.samples).toEqual(m.samples);
 const ns=items(n.samples[1],'list'),bs=items(b.samples[1],'list');bs.forEach((v,i)=>{if(i!==5)expect(v).toEqual(ns[i]);});expect(ns[5]).toEqual(q(-1,1));
 const source=(p:typeof a)=>rec(items(items(p.produced[1],'list')[1],'list')[2],402n);
 expect(f(source(a),2n)).toEqual(f(source(b),2n));expect(f(source(a),3n)).toEqual(f(source(b),3n));
 expect(f(source(n),2n)).toEqual(q(-2,3));expect(f(source(n),3n)).toEqual(f(source(b),3n));
 expect(f(source(m),2n)).toEqual(q(2,3));expect(f(source(m),3n)).toEqual(f(source(b),3n));
 const bg=group(b)!,ng=group(n)!,mg=group(m)!;
 expect(bg).toBeDefined();expect(ng).toBeDefined();expect(mg).toBeDefined();
 expect(bg[1]).toEqual(text('Active'));expect(ng[1]).toEqual(text('Active'));expect(mg[1]).toEqual(text('ZeroBase'));
 expect(uint(f(rec(bg[0],404n),4n))).toBe(1n);expect(uint(f(rec(ng[0],404n),4n))).toBe(2n);
 expect(mg[2]).toEqual(q(2,5)); // Above activation threshold, still no base => no die.
 for(const p of [b,n,m])expect(p.probabilities).not.toEqual(p===b?a.probabilities:b.probabilities);
 for(const p of found.values())expect(new Set(p.ns.map(v=>key(f(rec(v,407n),1n)))).size).toBe(p.ns.length);
 console.info('M91 NATIVE PASS '+JSON.stringify([...found].map(([kind,p])=>({kind,nuclei:p.ns.length,probabilities:p.probabilities.map(v=>frac(readQ(v))),mode:String(uint(f(p.data,8n))),draws:items(f(p.data,9n),'list').length}))));
},570000);
it('M91 privacy: hidden diagnostic is inert and denied evidence cannot create the extra reason',async()=>{
 const baseline=runs.get('split')??await create('split'),hidden=await create('split',true),denied=await create('split',false,false);
 const a=capture(baseline.run,baseline.b.s),h=capture(hidden.run,hidden.b.s),d=capture(denied.run,denied.b.s);
 expect(a.raw).toEqual(h.raw);expect(a.data).toEqual(h.data);
 expect(d.samples).toHaveLength(1);expect(d.produced).toHaveLength(1);sourceCorrespondence(d);
 expect(d.rejected).toHaveLength(1);expect(items(d.rejected[0],'list')[1]).toEqual(text('MissingEvidence'));
 expect(d.ns).toHaveLength(2);expect(group(d)).toBeUndefined();expect(d.probabilities).not.toEqual(a.probabilities);
 console.info('M91 PRIVACY PASS hidden raw/decision equality; denied channel2 suppresses its source and extra reason');
},570000);
it('M91 persistence: exact continuation and post-compiler atomic rollback',async()=>{
 const a=await create('split',false,true,9n),b=await create('split',false,true,9n);exact(a.run,b.run);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);
 const checkpoints:bigint[]=[];
 for(let n=0;;n++){
  expect(n).toBeLessThan(32);const results=[];for(const run of [a.run,b.run,restored])results.push(await run.settleNextInstant());
  expect(results[1]).toBe(results[0]);expect(results[2]).toBe(results[0]);const x=a.run.snapshot();
  for(const run of [b.run,restored]){const y=run.snapshot();expect([x.clock,x.status]).toEqual([y.clock,y.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.run.save(),run.save());bytes(a.run.runIdentity(),run.runIdentity());}
  if(!results[0])break;checkpoints.push(x.clock);
 }
 expect(checkpoints).toContain(10n);expect(a.run.snapshot().clock).toBe(101n);for(const run of [a.run,b.run,restored])expect(run.diagnostic()).toBeUndefined();
 const fault=await create('split',false,true,9n),before=fault.run.snapshot(),original=reasons.compileDescribedReasons;let reached=false;
 const spy=vi.spyOn(reasons,'compileDescribedReasons').mockImplementation((...args)=>{const value=original(...args);expect(value.nuclei).toHaveLength(3);reached=true;throw Error('M91 after shared compilation');});
 try{await expect(fault.run.settleNextInstant()).rejects.toThrow('M91 after shared compilation');}finally{spy.mockRestore();}
 expect(reached).toBe(true);expect({...fault.run.snapshot(),status:before.status}).toEqual(before);
 console.info('M91 PERSISTENCE PASS repeat9/restore9 every settlement '+checkpoints.join(',')+'; post-compiler whole-instant rollback');
},570000);
