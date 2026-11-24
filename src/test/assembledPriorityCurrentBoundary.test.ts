import {replay248,evidence248,hash248} from './fixtures/assembledPriorityReplay';
import {it,expect} from 'vitest';
import {start,through,capture,decode,items,key,list,rec,f,q,type Run} from './fixtures/assembledPriorityCurrent';
import {restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {importancePath} from '../assembled/priority';
import {restoreAuthoritativeState} from '../substrate/state';
import {NEED_MOTIVE} from '../assembled/need';
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const prefixes:{clock:string;save:string}[]=[];
const exact=(a:Run,b:Run)=>{const {state:xs,outputs:xo,trace:xt,...xm}=a.snapshot(),{state:ys,outputs:yo,trace:yt,...ym}=b.snapshot();expect(ym).toEqual(xm);bytes(xs,ys);bytes(xo,yo);bytes(xt,yt);bytes(a.save(),b.save());if(replay248)prefixes.push({clock:String(a.snapshot().clock),save:hash248(a.save())});};
it('priority222 evidence controls preserve zero unknown and privacy',async()=>{
 const zero=await start({importance:0}),absent=await start({importance:null});
 for(const x of [zero,absent]){await through(x.run,2n);const c=capture(x.run,x.b.task,2);expect(c.operand[3]).toEqual(q(0,1));expect(c.ns.length).toBeGreaterThan(0);
  const referent=f(rec(x.b.task,371n),2n);expect(c.ns.filter(n=>{const k=rec(f(rec(n,407n),1n),404n);return key(f(k,2n))!==key(NEED_MOTIVE)&&key(f(k,3n))===key(referent);})).toHaveLength(0);
 }
 for(const [name,x] of [['zero',zero],['absent',absent]] as const)evidence248(name,x.b,x.run,{operand:capture(x.run,x.b.task,2).operand});
 expect(capture(zero.run,zero.b.task,2).operand[1]).toEqual(list([q(0,1)]));
 expect(capture(absent.run,absent.b.task,2).operand[1]).toEqual(list([]));
 expect(restoreAuthoritativeState(decode(zero.run.snapshot().state)).read(importancePath(zero.b.task)).presence).toBe(true);
 expect(restoreAuthoritativeState(decode(absent.run.snapshot().state)).read(importancePath(absent.b.task)).presence).toBe(false);
 for(const mode of ['adoption','urgency'] as const){
  const a=await start(mode==='adoption'?{importance:1000,adoptionVisible:false}:{initialUrgency:1000,urgencyVisible:false});
  const b=await start(mode==='adoption'?{importance:500,adoptionVisible:false}:{initialUrgency:0,urgencyVisible:false});
  await through(a.run,2n);await through(b.run,2n);const x=capture(a.run,a.b.task,2),y=capture(b.run,b.b.task,2);
  expect(x.operand.slice(1,4)).toEqual(y.operand.slice(1,4));expect(x.operand[mode==='adoption'?1:2]).toEqual(list([]));expect(x.operand[3]).toEqual(q(0,1));
  expect(x.raw).toEqual(y.raw);expect(x.ns).toEqual(y.ns);expect(x.prob).toEqual(y.prob);
  evidence248(mode+'/a',a.b,a.run,{operand:x.operand,probabilities:x.prob});evidence248(mode+'/b',b.b,b.run,{operand:y.operand,probabilities:y.prob});
  console.info('M222 PRIVACY',mode,'different hidden declarations, equal permitted receiving/probabilities');
 }
 const gap=await start({omitAt:3});await through(gap.run,3n);const missing=capture(gap.run,gap.b.task,3);expect(missing.operand[1]).toEqual(list([q(1,1)]));expect(missing.operand[2]).toEqual(list([]));expect(missing.operand[3]).toEqual(q(0,1));
 await through(gap.run,5n);const returned=capture(gap.run,gap.b.task,5);expect(returned.operand[2]).toEqual(list([q(1,1)]));expect(returned.operand[3]).toEqual(q(1,1));
 evidence248('gap-return',gap.b,gap.run,{missing:missing.operand,returned:returned.operand});
 console.info('M222 EVIDENCE PASS zero/absent importance; denied adoption/urgency; omitted display clears urgency; later return');
},590000);
it('priority222 exact repeat and both continuation checkpoints preserve current character',async()=>{
 const a=await start({importance:500}),b=await start({importance:500});
 await through(a.run,1n);await through(b.run,1n);exact(a.run,b.run);
 const restore=async()=>cachedMemory(await restorePreparedCharacterRun(a.m,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()}));
 const early=await restore();bytes(early.save(),a.run.save());
 for(let n=0;a.run.snapshot().clock<5n;n++){expect(n).toBeLessThan(32);expect(await a.run.settleNextInstant()).toBe(true);for(const r of [b.run,early]){expect(await r.settleNextInstant()).toBe(true);exact(a.run,r);}}
 const late=await restore();bytes(late.save(),a.run.save());let done=false;
 for(let n=0;n<40;n++){const more=await a.run.settleNextInstant();for(const r of [early,late]){expect(await r.settleNextInstant()).toBe(more);exact(a.run,r);}if(!more){done=true;break;}}
 expect(done).toBe(true);expect(a.run.diagnostic()).toBeUndefined();
 evidence248('persistence',a.b,a.run,{checkpoints:[1,5],prefixes,repeatAndContinuationExact:true});
 console.info('M222 PERSISTENCE PASS exact repeat; restore1 and5; every settled state/output/trace/save through terminal',String(a.run.snapshot().clock));
},590000);

import {compileDescribedReasons} from '../assembled/reasons';
import {definition} from './fixtures/assembledMultiComparison';
import {text} from '../substrate/canonicalEncoding';
it('priority222 actual receiving classifies the lower-motive null and reaches execution',async()=>{
 const receipts=[];
 for(const I of [500,1000]){
  const x=await start({importance:I,initialUrgency:1000});await through(x.run,2n);const c=capture(x.run,x.b.task,2),referent=f(rec(x.b.task,371n),2n);
  expect(c.operand[3],'live positive compared motive').toEqual(q(I,1000));
  const signals=items(f(c.raw,3n),'set').filter(v=>{const s=rec(f(rec(v,402n),1n),401n);return key(f(s,2n))===key(x.b.task)&&key(f(s,3n))===key({kind:'unsigned',value:1n});});
  expect(signals,'live consumed task Base').toHaveLength(1);expect(f(rec(signals[0],402n),2n)).toEqual(q(I,1000));
  const compiled=compileDescribedReasons(c.raw,definition(x.b.s),4,'SourceCoverage',true,true);expect(compiled.nuclei).toEqual(c.ns);
  const rows=items(items(compiled.report,'list')[1],'list').map(v=>items(v,'list')).filter(row=>key(f(rec(row[0],404n),3n))===key(referent));
  expect(rows,'actual task receiving classification').toHaveLength(1);
  expect(c.os.some(o=>typeof o!=='boolean'&&o.kind==='record'&&o.schema.typeId===433n&&key(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n))===key(c.d)),'actual decision -> intent -> attempt -> execution').toBe(true);
  const receipt={I,status:rows[0][1],relevance:rows[0][2],prob:c.prob};evidence248('receiving/'+I,x.b,x.run,receipt);receipts.push(receipt);
 }
 console.info('M222 RECEIVING',JSON.stringify(receipts,(_,v)=>typeof v==='bigint'?String(v):v));
 expect(receipts[0].status).toEqual(text('BelowThreshold'));expect(receipts[1].status).toEqual(text('Active'));expect(receipts[0].prob).not.toEqual(receipts[1].prob);
},590000);
