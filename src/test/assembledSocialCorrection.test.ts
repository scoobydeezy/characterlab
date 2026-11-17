import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import * as execution from '../assembled/socialExecution';
import {SOCIAL_PEOPLE,personPath,personMean,personHistory} from '../assembled/social';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {restoreAuthoritativeState} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {readQ} from '../campaign2/cognitiveMath';
import {sid} from '../assembled/skill';
import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {fixture,rec,f,uint,items,key,decode,list,text,signed,q,bytes,outputs,C,exact,target,type Mode} from './fixtures/assembledSocialCorrection';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const belief=(r:Run)=>state(r).read(personPath(C,target)).value;
const reports=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M148 settle cap');}
function judgment(r:Run,b:ReturnType<typeof fixture>,mean:Q){
 expect(personMean(belief(r))).toEqual(mean);
 const social=reports(r,SOCIAL_PEOPLE+'/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(a=>key(a[2])===key(target))!;
 expect(items(social[4],'list'),'live recognized person appraisal').toEqual([q(mean.numerator,mean.denominator)]);
 expect(items(items(social[6],'list')[3],'list'),'no earlier recalled substitute').toHaveLength(0);
 const joint=reports(r,JOINT_APPRAISAL).at(-1)!;
 for(const task of[b.taskA,b.taskB])expect(items(joint[4],'list').map(v=>items(v,'list')).find(a=>key(a[0])===key(task)),'live compared task').toHaveLength(5);
 expect(items(joint[6],'list').slice(1)).toContainEqual(list(social));
 const d=outputs(snap(r).outputs,409n).find(v=>key(f(v,2n))===key(signed(4)))!;expect(d).toBeDefined();
 const result=rec(f(d,4n),419n);expect(uint(f(result,1n)),'resolved actual decision').toBe(3n);
 expect(items(f(rec(f(d,3n),408n),3n),'list').length,'live reasons').toBeGreaterThan(0);
 const data=rec(f(result,2n),420n),isB=(v:CanonicalValue)=>key(f(rec(v,395n),2n))===key(sid(1027,'definition/protocol-contact-two')),row=items(f(data,2n),'list').map(v=>rec(v,421n)).find(v=>isB(f(v,1n)));
 const p=uint(f(data,8n))===1n?Q.of(isB(f(data,1n))?1n:0n):row?readQ(f(row,2n)):Q.of(0n);
 const intent=outputs(snap(r).outputs,425n).find(v=>key(f(v,2n))===key(d))!;expect(intent).toBeDefined();
 const plan=outputs(snap(r).outputs,431n).find(v=>key(f(v,2n))===key(intent))!;expect(plan).toBeDefined();
 const attempt=outputs(snap(r).outputs,432n).find(v=>key(f(v,2n))===key(plan))!;expect(attempt).toBeDefined();
 expect(outputs(snap(r).outputs,433n).some(v=>key(f(v,2n))===key(attempt)),'actual outcome chain').toBe(true);
 return p;
}
const ratio=(v:Q)=>v.numerator+'/'+v.denominator;
it('primary148: selective correction changes live appraisal and exact production choice probability',async()=>{
 const bs=[fixture(),fixture('denied')],m=await prepareCharacterModel(bs[0].s),runs=await Promise.all(bs.map(b=>createCharacterRun(m,b.d)));
 bytes(bs[0].d.initialState,bs[1].d.initialState);bytes(bs[0].d.runSeed,bs[1].d.runSeed);bytes(bs[0].s.registry,bs[1].s.registry);
 for(const r of runs)expect(belief(r)).toBeUndefined();
 for(const [at,mean]of [[1n,Q.of(0n)],[2n,Q.of(1n,2n)],[3n,Q.of(2n,3n)]] as const){
  for(const r of runs)await through(r,at);
  expect(personMean(belief(runs[0]))).toEqual(mean);expect(personMean(belief(runs[1]))).toEqual(Q.of(0n));
 }
 expect(personHistory(belief(runs[0]))).toHaveLength(3);expect(personHistory(belief(runs[1]))).toHaveLength(1);
 for(const r of runs)await through(r,4n);
 const p=runs.map((r,i)=>judgment(r,bs[i],Q.of(i?0n:2n,i?1n:3n)));expect(p[0].compare(p[1])).not.toBe(0);
 expect(outputs(snap(runs[0]).outputs,408n)).not.toEqual(outputs(snap(runs[1]).outputs,408n));
 console.info('M148 PRIMARY '+JSON.stringify({mean:['0 -> 1/2 -> 2/3','0 -> 0 -> 0'],probabilityB:p.map(ratio),proof:'exact production probability, no sampled-winner claim',actionChains:2}));
},590000);
it('controls148: hidden truth, repeated receipts, false explanations and missing receipts',async()=>{
 const b=fixture(),m=await prepareCharacterModel(b.s),base=await createCharacterRun(m,b.d),hidden=await createCharacterRun(m,fixture('corrected',false).d);
 for(const at of[1n,2n,3n]){for(const r of[base,hidden])await through(r,at);bytes(snap(base).state,snap(hidden).state);bytes(snap(base).outputs,snap(hidden).outputs);}
 for(const r of[base,hidden])await through(r,4n);
 expect(judgment(hidden,b,Q.of(2n,3n))).toEqual(judgment(base,b,Q.of(2n,3n)));
 const matrix:[Mode,Q,number][]=[['duplicate',Q.of(1n,2n),2],['false',Q.of(0n),3],['missing',Q.of(0n),1]];
 for(const [mode,mean,count]of matrix){const bs=fixture(mode),r=await createCharacterRun(m,bs.d);await through(r,3n);expect(personMean(belief(r))).toEqual(mean);expect(personHistory(belief(r))).toHaveLength(count);await through(r,4n);judgment(r,bs,mean);}
 console.info('M148 CONTROLS hidden truth ALL state/output bytes equal1/2/3 and same exact probability4; duplicate1/2 vs independent2/3; false explanations remain0 despite source private truth=true; receipt0 cannot teach');
},590000);
it('persistence148: repeat, save2/save4 and correction rollback preserve one continuing character',async()=>{
 const b=fixture(),m=await prepareCharacterModel(b.s),a=await createCharacterRun(m,b.d),repeat=await createCharacterRun(m,b.d);
 for(const r of[a,repeat])await through(r,2n);exact(a,repeat);expect(personMean(belief(a))).toEqual(Q.of(1n,2n));
 const early=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,early);
 for(const at of[3n,4n]){for(const r of[a,repeat,early])await through(r,at);exact(a,repeat);exact(a,early);}
 judgment(a,b,Q.of(2n,3n));
 const late=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,late);await finish(a,[repeat,early,late]);
 let hit=0;const original=execution.createSocialExecution;
 const spy=vi.spyOn(execution,'createSocialExecution').mockImplementation((...args)=>{
  const handler=original(...args);return {...handler,prepare(...xs:Parameters<typeof handler.prepare>){
   const prepared=handler.prepare(...xs);if(xs[0][0].dueAt!==2n)return prepared;
   return {...prepared,finish(...ys:Parameters<typeof prepared.finish>){prepared.finish(...ys);hit++;throw Error('M148 correction rollback');}};
  }};
 });
 try{const r=await createCharacterRun(m,b.d);await through(r,1n);const before=r.snapshot();await expect(advance(r)).rejects.toThrow('M148 correction rollback');expect(hit).toBe(1);expect({...r.snapshot(),status:before.status}).toEqual(before);expect(personMean(belief(r))).toEqual(Q.of(0n));}finally{spy.mockRestore();}
 console.info('M148 PERSISTENCE repeat/save2/save4 exact at every later boundary; actual phase140 finish fault rolls back all state/output/trace/queue changes; terminal '+snap(a).clock);
},590000);
