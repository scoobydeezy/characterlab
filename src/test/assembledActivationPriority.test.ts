import {it,expect,afterEach} from 'vitest';
import {priorityFixture,start,through,restore,exact,capture as snapshot,put,saved,gate,original,summary,rec,f,items,key,uint,decode,list,text,q,unpack,failure,tags} from './fixtures/assembledActivationNative';
import {capture as priorityCapture} from './fixtures/assembledPriorityCurrent';
import {importancePath} from '../assembled/priority';
import {NEED_MOTIVE} from '../assembled/need';
import {restoreAuthoritativeState} from '../substrate/state';
afterEach(c=>{if(c.task.result?.state==='fail')failure(c.task.name);});
async function native(name:string,o:Parameters<typeof priorityFixture>[0],at:number){const x=await start(priorityFixture(o));await through(x.r,at);put(name,{...snapshot(x.r),mapping:x.b.mapping});return x;}
function observe(x:Awaited<ReturnType<typeof native>>,t:number){const c=priorityCapture(x.r,x.b.task,t),g=gate(x.r.snapshot().outputs,x.b.s,t);expect(g.result,'live decision/execution').toBeDefined();expect(items(f(c.raw,7n),'list')).toHaveLength(2);expect(c.ns.length).toBeGreaterThan(0);return {c,g,row:{at:t,operand:key(list(c.operand)),motive:key(c.operand[3]),...summary(g)}};}
it('activation267 priority four cells retain importance distinction with all motives active',async()=>{
 const cells=new Map<string,ReturnType<typeof observe>[]>();
 for(const I of [500,1000])for(const U of [0,1000]){
  const name='matrix/'+I+'/'+U,x=await start(priorityFixture({importance:I,initialUrgency:U})),rows=[],old=original(248,name);expect(x.b.mapping.priorRegistry).toBe(old.record.registry);expect(x.b.mapping.inputs).toBe(old.record.input);expect(x.b.mapping.initial).toBe(old.record.initial);
  for(let i=0;i<6;i++){await through(x.r,i+2);const v=observe(x,i+2);rows.push(v);expect(v.c.operand[1]).toEqual(list([q(I,1000)]));expect(v.c.operand[3]).toEqual(q(old.record.summary.controls.Factored[i],1000));
   const prior=gate(old.outputs,x.b.prior,i+2);expect(f(v.c.raw,3n),'actual task producer semantics').toEqual(f(rec(prior.raw,403n),3n));
   const referent=f(rec(x.b.task,371n),2n),receiving=items(items(v.g.compiled.report,'list')[1],'list').map(v=>items(v,'list')).filter(row=>key(f(rec(row[0],404n),3n))===key(referent));
   if(key(v.c.operand[3])===key(q(0,1))){expect(receiving.length).toBeLessThanOrEqual(1);for(const r of receiving)expect(r[1]).toEqual(text('ZeroBase'));expect(v.c.ns.filter(n=>key(f(rec(f(rec(n,407n),1n),404n),3n))===key(referent))).toHaveLength(0);}else{expect(receiving).toHaveLength(1);expect(receiving[0][1]).toEqual(text('Active'));}
  }
  put(name,{...snapshot(x.r),mapping:x.b.mapping,rows:rows.map(v=>v.row),original:old.source,controls:old.record.summary.controls});cells.set(I+'/'+U,rows);
 }
 const a=cells.get('1000/0')!,b=cells.get('500/1000')!;
 expect(a[0].c.operand[3]).toEqual(b[0].c.operand[3]);expect(a[0].g.prob).toEqual(b[0].g.prob);
 expect(a[3].c.operand[3]).not.toEqual(b[3].c.operand[3]);expect(a[3].g.prob,'retained importance still changes actual probabilities').not.toEqual(b[3].g.prob);
 expect(a[2].c.operand[2]).toEqual(list([]));expect(a[2].c.operand[3]).toEqual(q(0,1));
 put('priority-matrix-finding',{initialEqual:true,laterDifferent:true,initial:a[0].g.prob.map(key),laterHigh:a[3].g.prob.map(key),laterLow:b[3].g.prob.map(key),all24Consumed:true,classification:'Factored producer equivalence; global activation-policy changes weak receiving without erasing retained importance'});
 console.info('M267 priority24 native motives/decisions/executions PASS; initial collision and later separation retained');
},590000);
it('activation267 priority boundaries preserve known zero unknown and denied evidence',async()=>{
 const zero=await native('priority-zero',{importance:0},2),absent=await native('priority-absent',{importance:null},2);
 for(const x of [zero,absent]){const {c}=observe(x,2);expect(c.operand[3]).toEqual(q(0,1));const referent=f(rec(x.b.task,371n),2n);expect(c.ns.filter(n=>{const k=rec(f(rec(n,407n),1n),404n);return key(f(k,2n))!==key(NEED_MOTIVE)&&key(f(k,3n))===key(referent);})).toHaveLength(0);}
 expect(observe(zero,2).c.operand[1]).toEqual(list([q(0,1)]));expect(observe(absent,2).c.operand[1]).toEqual(list([]));
 expect(restoreAuthoritativeState(decode(zero.r.snapshot().state)).read(importancePath(zero.b.task)).presence).toBe(true);expect(restoreAuthoritativeState(decode(absent.r.snapshot().state)).read(importancePath(absent.b.task)).presence).toBe(false);
 for(const mode of ['adoption','urgency'] as const){const a=await native(mode+'-a',mode==='adoption'?{importance:1000,adoptionVisible:false}:{initialUrgency:1000,urgencyVisible:false},2),b=await native(mode+'-b',mode==='adoption'?{importance:500,adoptionVisible:false}:{initialUrgency:0,urgencyVisible:false},2);
  const x=observe(a,2),y=observe(b,2);expect(x.c.operand.slice(1,4)).toEqual(y.c.operand.slice(1,4));expect(x.c.operand[mode==='adoption'?1:2]).toEqual(list([]));expect(x.c.operand[3]).toEqual(q(0,1));expect(x.c.raw).toEqual(y.c.raw);expect(x.c.ns).toEqual(y.c.ns);expect(x.g.prob).toEqual(y.g.prob);
 }
 const gap=await start(priorityFixture({omitAt:3}));await through(gap.r,3);const missing=observe(gap,3);expect(missing.c.operand[1]).toEqual(list([q(1,1)]));expect(missing.c.operand[2]).toEqual(list([]));expect(missing.c.operand[3]).toEqual(q(0,1));await through(gap.r,5);const returned=observe(gap,5);expect(returned.c.operand[2]).toEqual(list([q(1,1)]));expect(returned.c.operand[3]).toEqual(q(1,1));put('gap-return',{...snapshot(gap.r),mapping:gap.b.mapping,missing:missing.row,returned:returned.row});
 put('priority-boundaries',{zeroAbsentDistinct:true,deniedAdoptionAndUrgency:true,retainedImportanceSurvivesGap:true,classification:'Equivalent evidence distinctions, independently live Need; no invented motive'});
 console.info('M267 priority7 controls PASS zero/absence, privacy and omission/return');
},590000);
it('activation267 priority repeat restore1 and restore5 match all settled bytes',async()=>{
 const a=await start(priorityFixture({importance:500})),b=await start(priorityFixture({importance:500}));await through(a.r,1);await through(b.r,1);exact(a.r,b.r);const early=await restore(a);exact(a.r,early);const clocks=[];
 while(a.r.snapshot().clock<5n){expect(clocks.length).toBeLessThan(32);const more=await a.r.settleNextInstant();expect(more).toBe(true);for(const r of [b.r,early]){expect(await r.settleNextInstant()).toBe(more);exact(a.r,r);}clocks.push(String(a.r.snapshot().clock));}
 const late=await restore(a);exact(a.r,late);for(let n=0;n<128;n++){const more=await a.r.settleNextInstant();for(const r of [b.r,early,late]){expect(await r.settleNextInstant()).toBe(more);exact(a.r,r);}clocks.push(String(a.r.snapshot().clock));if(!more)break;if(n===127)throw Error('queue cap');}
 put('priority-continuation',{...snapshot(a.r),checkpoints:[1,5],clocks,repeatFullStateOutputTraceSave:true});console.info('M267 priority repeat/save1/save5 through termination PASS');
},590000);
