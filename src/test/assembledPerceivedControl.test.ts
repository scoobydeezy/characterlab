import {replay270,start270,path270,metadata270,compare270} from './fixtures/assembledActivationFoundations';
import {it,expect,afterEach} from 'vitest';
// @ts-expect-error Node-only evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Node-only hashing.
import {createHash} from 'node:crypto';
// @ts-expect-error Node-only lossless evidence.
import {deflateSync} from 'node:zlib';
import {createCharacterRun,restorePreparedCharacterRun} from '../assembled/character';
import {reappraisalPath,reappraisalKnowledge,SHARED_AFFECT_APPRAISAL,REAPPRAISAL_OBSERVE} from '../assembled/reappraisal';
import {validateMitigationPacket} from '../assembled/mitigation';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {restoreAuthoritativeState} from '../substrate/state';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {start as historicalStart,fixture,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid,taskA,taskB,type CanonicalValue} from './fixtures/assembledPerceivedControl';
const originalFile='docs/planning/ASSEMBLED_CHARACTER_M256_EVIDENCE.json',file=path270(originalFile),hash=(v:Uint8Array)=>createHash('sha256').update(v).digest('hex'),zip=(v:Uint8Array)=>({hash:hash(v),bytes:v.length,deflate:deflateSync(v).toString('base64')});
const put=(k:string,v:unknown)=>{const e=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};if(replay270)e._activationCarry=metadata270(originalFile);if(e[k]!==undefined){expect(e[k]).toEqual(v);compare270(originalFile,k,v);return;}e[k]=v;writeFileSync(file,JSON.stringify(e,null,2)+'\n');compare270(originalFile,k,v);};
async function start(...args:Parameters<typeof historicalStart>){const x=await(replay270&&!args[2]?start270(fixture(...args)):historicalStart(...args));active=x.run;return x;}
type X=Awaited<ReturnType<typeof start>>;type Run=X['run'];
let active:Run|undefined;
afterEach(ctx=>{if(replay270&&ctx.task.result?.state==='fail'&&active){const e=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};put('failure-'+Object.keys(e).filter(k=>k.startsWith('failure-')).length,{test:ctx.task.name,...capture(active)});}active=undefined;});
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
function exact(a:Run,b:Run){const x=a.snapshot(),y=b.snapshot();expect(x.clock).toBe(y.clock);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());}
const capture=(r:Run)=>{const s=r.snapshot();return {clock:String(s.clock),state:zip(s.state),outputs:zip(s.outputs),trace:zip(s.trace),save:hash(r.save())};};
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const knowledge=(r:Run)=>reappraisalKnowledge(state(r).read(reappraisalPath(C)).value,C,true,true,true,true);
const reports=(r:Run,t:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(t))).map(v=>items(v,'list'));
const at=(v:CanonicalValue)=>(v as {value:bigint}).value,event=(v:CanonicalValue)=>rec(f(rec(v,160n),4n),130n),frac=(v:CanonicalValue)=>{const q=readQ(v);return q.numerator+'/'+q.denominator;};
async function finish(r:Run){for(let n=0;n<128;n++)if(!await r.settleNextInstant())return;throw Error('M256 queue cap');}
function proof(x:X){
 const r=x.run,unknown=x.b.mode==='denied',control=x.b.control,a=reports(r,SHARED_AFFECT_APPRAISAL).find(v=>uint(v[1])===10n)!;expect(a,'live actual appraisal10').toBeDefined();expect(a[5]).toEqual(text(unknown?'Unavailable':'Known'));
 const k=knowledge(r),e=k.efficacy!;expect(e.cue!.mean).toEqual(Q.of(1n));expect(e.cue!.supports).toHaveLength(1);
 const factors=items(items(a[7],'list')[4],'list');expect(factors).toEqual([q(1,1),q(1,1),q(19,100),unknown?list([]):q(control,1)]);
 if(unknown){expect(e.control).toBeUndefined();expect(e.supports).toHaveLength(1);expect(a[6]).toEqual(list([]));}
 else {expect(e.control).toEqual(Q.of(BigInt(control)));expect(e.supports).toHaveLength(2);expect(e.means).toEqual([Q.of(1n),Q.of(control?0n:1n)]);expect(a[6]).toEqual(list([q(119,200),q(control?0:119,200)]));for(const support of e.supports)expect(items(items(support,'list')[1],'list').map(v=>validateMitigationPacket(v).role)).toEqual(['Before','Motion','After']);}
 const traces=outputs(r.snapshot().trace,160n);let packets=0;
 for(const row of k.rows){const packet=items(row,'list')[8];if(!items(packet,'list').length)continue;const p=validateMitigationPacket(packet),producer=traces.find(t=>uint(f(event(t),1n))===p.producer&&typeof f(t,13n)!=='boolean'&&(f(t,13n) as {kind?:string}).kind==='list'&&items(f(t,13n),'list').some(v=>key(v)===key(packet)));expect(producer,'actual safe packet producer').toBeDefined();const receiver=traces.find(t=>key(f(event(t),5n))===key(REAPPRAISAL_OBSERVE)&&key(f(t,13n))===key(row));expect(receiver,'actual knowledge receiver').toBeDefined();expect(items(f(event(receiver!),8n),'list')).toContainEqual(u(p.producer));packets++;}expect(packets).toBeGreaterThan(0);
 const d=outputs(r.snapshot().outputs,409n).find(v=>at(f(v,2n))===10n)!;expect(d,'live decision').toBeDefined();const resolved=rec(f(d,4n),419n);expect(uint(f(resolved,1n))).toBe(3n);
 const data=rec(f(resolved,2n),420n),ctx=rec(f(d,3n),408n),raw=rec(f(ctx,2n),403n),ns=items(f(ctx,3n),'list').map(v=>rec(v,407n)),signals=items(f(raw,3n),'set').map(v=>rec(v,402n));
 const own=(task:CanonicalValue,role:bigint)=>signals.filter(v=>key(f(rec(f(v,1n),401n),2n))===key(task)&&uint(f(rec(f(v,1n),401n),3n))===role);
 expect(items(f(rec(f(raw,2n),398n),3n),'list')).toHaveLength(2);expect(ns).toHaveLength(2);
 for(const task of [taskA,taskB]){expect(own(task,1n),'positive actual base').toHaveLength(1);expect(readQ(f(own(task,1n)[0],2n)).compare(Q.of(0n))).toBeGreaterThan(0);}
 const n=ns.find(v=>key(f(rec(f(v,1n),404n),3n))===key(f(rec(taskA,371n),2n)))!,live=!unknown&&control===0;
 expect(own(taskA,2n)).toHaveLength(live?1:0);if(live)expect(f(own(taskA,2n)[0],2n)).toEqual(q(119,200));expect(f(rec(f(n,2n),406n),3n)).toEqual(live?q(119,319):q(0,1));expect(at(f(n,6n))).toBe(live?3n:0n);
 const consumer=traces.find(t=>at(f(event(t),2n))===10n&&uint(f(event(t),3n))===80n&&typeof f(t,13n)!=='boolean'&&(f(t,13n) as any).schema?.typeId===403n&&typeof f(t,12n)!=='boolean'&&(f(t,12n) as any).kind==='list'&&key(items(f(t,12n),'list')[1])===key(list(a)));expect(consumer,'actual affect-to-reason consumer').toBeDefined();const input=items(f(consumer!,12n),'list');expect(traces.some(t=>uint(f(event(t),1n))===uint(input[2])&&key(f(t,13n))===key(list(a))),'actual appraisal producer').toBe(true);if(live)expect(items(f(rec(f(consumer!,13n),403n),3n),'set')).toContainEqual(own(taskA,2n)[0]);
 const probabilities=items(f(data,2n),'list').map(v=>{const p=rec(v,421n);return {action:key(f(rec(f(p,1n),395n),2n)),probability:frac(f(p,2n))};}).sort((a,b)=>a.action.localeCompare(b.action));
 const probabilityA=probabilities.find(p=>p.action===key(sid(1027,'definition/protocol-contact-one')))!.probability;expect(probabilityA).toBe(live?'7/9':'25/72');
 const actual=outputs(r.snapshot().outputs,433n).find(o=>key(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n))===key(d));expect(actual,'decision reaches real attempt/outcome').toBeDefined();expect(outputs(r.snapshot().outputs,426n).some(v=>key(f(rec(f(v,2n),425n),2n))===key(d))).toBe(true);expect(uint(f(actual!,3n))).toBe(x.b.mode==='failed'?0n:uint(f(rec(f(rec(f(actual!,2n),432n),2n),431n),3n)));if(x.b.mode!=='failed')expect(uint(f(actual!,3n))).toBeGreaterThan(0n);
 return {status:unknown?'Unavailable':'Known',control:unknown?'unknown':String(control),E:unknown?'unknown':'119/200',U:unknown?'unknown':control?'0':'119/200',situation:String(at(f(n,6n))),probabilities,packets,rawSignals:key(f(raw,3n))};
}
it('control256 primary current learned efficacy reaches actual reasons',async()=>{
 const a=await start(0),b=await start(1);expect(a.b.s).toEqual(b.b.s);bytes(a.b.d.initialState,b.b.d.initialState);
 const left=items(decode(a.b.d.orderedInputs),'list'),right=items(decode(b.b.d.orderedInputs),'list'),diff=left.map((v,i)=>key(v)!==key(right[i])?i:-1).filter(i=>i>=0);expect(diff).toHaveLength(1);expect(at(items(left[diff[0]],'list')[0])).toBe(6n);
 await through(a.run,3n);await through(b.run,3n);bytes(a.run.snapshot().state,b.run.snapshot().state);bytes(a.run.snapshot().outputs,b.run.snapshot().outputs);
 for(const [label,x] of [['zero',a],['full',b]] as const){await through(x.run,10n);put(label+'-raw',capture(x.run));put(label+'-proof',proof(x));await finish(x.run);put(label+'-terminal',{save:hash(x.run.save())});}
 console.info('M256 PRIMARY lower control1->0 with fixed E119/200: U0->119/200, actual situation0->3 and probability25/72->7/9; current decision/expression/attempt');
},590000);
it('control256 unknown and failed execution remain distinct',async()=>{
 for(const mode of ['denied','failed'] as const){const x=await start(mode==='denied'?1:0,mode);await through(x.run,9n);const before=state(x.run).read(reappraisalPath(C));await through(x.run,10n);put(mode+'-raw',capture(x.run));const p=proof(x);put(mode+'-proof',p);
  if(mode==='failed'){expect(state(x.run).read(reappraisalPath(C))).toEqual(before);const e=JSON.parse(readFileSync(file,'utf8'))['zero-proof'];expect(p).toEqual(e);}
  await finish(x.run);put(mode+'-terminal',{save:hash(x.run.save())});
 }
 console.info('M256 BOUNDARIES unknown control is Unavailable, known zero produces live reasons; failed completion cannot rewrite prior appraisal/grounds/distribution/learned control');
},590000);
it('control256 original composition correspondence',async()=>{
 const e=JSON.parse(readFileSync(file,'utf8'));
 for(const control of [0,1] as const){const x=await start(control,'normal',true);await through(x.run,10n);put('old'+control+'-raw',capture(x.run));const p=proof(x);expect({...p,rawSignals:null}).toEqual({...e[control?'full-proof':'zero-proof'],rawSignals:null});await finish(x.run);put('old'+control+'-terminal',{save:hash(x.run.save())});}
 console.info('M256 original0.129 and current0.157 primary psychological projections agree, including actual probabilities');
},590000);
it('control256 hidden truth and exact continuation',async()=>{
 const x=await start(0),hidden=await start(0,'hidden'),repeat=cachedMemory(await createCharacterRun(x.m,x.b.d));
 for(const r of [x.run,hidden.run,repeat])await through(r,9n);exact(x.run,repeat);bytes(x.run.snapshot().state,hidden.run.snapshot().state);bytes(x.run.snapshot().outputs,hidden.run.snapshot().outputs);
 const saved=x.run.save(),restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:saved}));exact(x.run,restored);put('privacy9',{main:capture(x.run),hidden:capture(hidden.run)});
 for(let n=0;n<128;n++){const more=await x.run.settleNextInstant();for(const r of [repeat,restored]){expect(await r.settleNextInstant()).toBe(more);exact(x.run,r);}expect(await hidden.run.settleNextInstant()).toBe(more);bytes(x.run.snapshot().state,hidden.run.snapshot().state);bytes(x.run.snapshot().outputs,hidden.run.snapshot().outputs);if(!more){put('continuation',{checkpoint:hash(saved),terminal:hash(x.run.save()),exactRepeatRestore:true,hiddenWholeStateOutputInvariant:true,hidden:capture(hidden.run)});return;}}
 throw Error('M256 continuation cap');
},590000);
