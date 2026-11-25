import {it,expect,afterEach} from 'vitest';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Lossless evidence.
import {deflateSync,inflateSync} from 'node:zlib';
// @ts-expect-error Hashing.
import {createHash} from 'node:crypto';
import {fixture,names,start,through,finish,rec,f,uint,items,key,decode,list,text,q,outputs,taskA,taskB,actionA,actionB,type Run,type CanonicalValue} from './fixtures/assembledProspectionCurrent';
import {restoreAuthoritativeState} from '../substrate/state';
import {restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {PRIORITY_MOTIVE} from '../assembled/priority';
import {forecastPath,forecastValue} from '../assembled/horizon';
const file='docs/planning/ASSEMBLED_CHARACTER_M264_EVIDENCE.json',hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')});
const store=(k:string,v:unknown)=>{k='corrected-strength-'+k;v=JSON.parse(JSON.stringify(v,(_k,x)=>typeof x==='bigint'?String(x):x));const e=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};if(e[k])expect(e[k]).toEqual(v);else{e[k]=v;writeFileSync(file,JSON.stringify(e,null,2)+'\n');}};
let active:Run|undefined;
const capture=(r:Run)=>{const s=r.snapshot();return {at:String(s.clock),state:zip(s.state),outputs:zip(s.outputs),trace:zip(s.trace),save:hash(r.save())};};
afterEach(ctx=>{if(ctx.task.result?.state==='fail'&&active){const e=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};store('failure-'+Object.keys(e).filter(k=>k.startsWith('failure-')).length,{test:ctx.task.name,...capture(active)});}active=undefined;});
const at=(v:CanonicalValue)=>(v as {value:bigint}).value,state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const reports=(r:Run,tag:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const operand=(r:Run,t:number)=>{const p=reports(r,PRIORITY_MOTIVE).find(v=>uint(v[1])===BigInt(t));expect(p,'live motive '+t).toBeDefined();return items(p![2],'list').map(v=>items(v,'list')).find(v=>key(v[0])===key(taskA));};
const goal=(r:Run,task:CanonicalValue)=>state(r).read({rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:task}]}).value;
function decision(r:Run,t:number){const d=outputs(r.snapshot().outputs,409n).find(v=>at(f(v,2n))===BigInt(t));expect(d,'live decision '+t).toBeDefined();const res=rec(f(d!,4n),419n),kind=uint(f(res,1n));if(kind!==3n)return {d,kind,action:null,p:'none'};const data=rec(f(res,2n),420n),action=f(rec(f(data,1n),395n),2n);const row=items(f(data,2n),'list').map(v=>rec(v,421n)).find(v=>key(f(rec(f(v,1n),395n),2n))===key(actionA));const p=uint(f(data,8n))===1n?(key(action)===key(actionA)?'1':'0'):row?key(f(row,2n)):'0';expect(outputs(r.snapshot().outputs,433n).some(v=>{const intent=rec(f(rec(f(rec(f(v,2n),432n),2n),431n),2n),425n);return key(f(intent,2n))===key(d!);}),'actual execution').toBe(true);return {d,kind,action:key(action),p};}
function gate(r:Run,t:number){const o=operand(r,t),d=decision(r,t),a=goal(r,taskA),b=goal(r,taskB);return {at:t,operand:o?key(list(o)):null,value:o?.[3],factor:o?items(o[6],'list')[5]:null,goalA:a?key(a):null,goalB:b?key(b):null,action:d.action,p:d.p};}
it('family264 postponement consumes perceived opportunity and retains future goal',async()=>{
 const all=[];
 for(const name of ['available','unavailable'] as const){const x=await start(fixture(name));active=x.r;const rows=[];for(const t of [3,5,7]){await through(x.r,t);rows.push(gate(x.r,t));store(name+'-'+t,{...capture(x.r),row:rows.at(-1)});}await finish(x.r);store(name+'-terminal',{save:hash(x.r.save()),at:x.r.snapshot().clock});all.push(rows);}
 expect(all[0][0].factor).toEqual(q(1,4));expect(all[1][0].factor).toEqual(q(1,1));expect(all[0][0].value).toEqual(q(1,4));expect(all[1][0].value).toEqual(q(1,1));expect(all[0][0].p).not.toBe(all[1][0].p);
 expect(all[0][0].action).toBe(key(actionB));expect(all[0][0].goalA).toBe(all[1][0].goalA);expect(all[0][1].factor).toEqual(q(1,1));expect(all[0][2].action).toBe(key(actionA));console.info('M264 future opportunity -> live motive/probability -> postpone -> later pursuit PASS');
},590000);
it('family264 unknown denied corrected and absent competing motive or route',async()=>{
 const all=new Map<string,{r:Run,rows:ReturnType<typeof gate>[]}>();
 for(const name of names.slice(2)){const x=await start(fixture(name));active=x.r;const rows=[];for(const t of [3,5,7]){await through(x.r,t);rows.push(gate(x.r,t));}store(name,{...capture(x.r),rows});await finish(x.r);store(name+'-terminal',{save:hash(x.r.save()),at:x.r.snapshot().clock});all.set(name,{r:x.r,rows});}
 for(const name of ['unknown','deniedAvailable','deniedUnavailable'])expect(state(all.get(name)!.r).read(forecastPath(taskA)).presence).toBe(false);
 const a=all.get('deniedAvailable')!.r,b=all.get('deniedUnavailable')!.r;expect(hash(a.snapshot().state)).toBe(hash(b.snapshot().state));expect(hash(a.snapshot().outputs)).toBe(hash(b.snapshot().outputs));
 const rows=all.get('corrected')!.rows;expect(rows[0].factor).toEqual(q(1,4));expect(rows[1].factor).toEqual(q(1,1));expect(forecastValue(state(all.get('corrected')!.r).read(forecastPath(taskA)).value!,1000000n).observedAt).toBe(3n);
 expect(all.get('noImmediate')!.rows[0].action).not.toBe(key(actionB));expect(all.get('noRoute')!.rows[0].action).not.toBe(key(actionA));console.info('M264 knowledge absence/privacy/correction/motive/feasibility boundaries PASS');
},590000);
it('family264 exact independent repeat and continuation',async()=>{
 const x=await start(fixture('corrected'));active=x.r;const y=await start(fixture('corrected'));await through(x.r,3);await through(y.r,3);expect(hash(y.r.save())).toBe(hash(x.r.save()));const restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.r.save()}));
 const checks=[];for(let n=0;n<128;n++){const more=await x.r.settleNextInstant();expect(await y.r.settleNextInstant()).toBe(more);expect(await restored.settleNextInstant()).toBe(more);for(const r of [y.r,restored]){for(const k of ['state','outputs','trace'] as const)expect(hash(r.snapshot()[k])).toBe(hash(x.r.snapshot()[k]));expect(hash(r.save())).toBe(hash(x.r.save()));}checks.push(String(x.r.snapshot().clock));if(!more)break;if(n===127)throw Error('queue cap');}
 store('continuation',{...capture(x.r),checks,repeat:true,restore:true});console.info('M264 repeat/full-byte continuation PASS');
},590000);

it('family264 captured traces bind prior forecast and distinct goals to actual reasons',()=>{
 const evidence=JSON.parse(readFileSync(file,'utf8')),sources=[];
 for(const name of names){const b=fixture(name);sources.push({name,registry:hash(b.s.registry),parameters:hash(b.s.parameters),initial:hash(b.d.initialState),ordered:hash(b.d.orderedInputs),seed:hash(b.d.runSeed)});}
 for(const name of ['available','unavailable']){
  const e=evidence['corrected-strength-'+name+'-3'];expect(e).toBeDefined();
  const unzip=(v:{deflate:string})=>new Uint8Array(inflateSync(Uint8Array.from(atob(v.deflate),c=>c.charCodeAt(0))));
  const out=unzip(e.outputs),trace=unzip(e.trace),d=outputs(out,409n).find(v=>at(f(v,2n))===3n)!;
  const raw=rec(f(rec(f(d,3n),408n),2n),403n),signals=items(f(raw,3n),'set').map(v=>rec(v,402n));
  for(const task of [taskA,taskB]){const own=signals.filter(v=>{const source=rec(f(v,1n),401n);return key(f(source,2n))===key(task)&&uint(f(source,3n))===1n;});expect(own,'actual distinct task ground').toHaveLength(1);const strength=f(own[0],2n);expect(typeof strength!=='boolean'&&strength.kind==='rational'&&strength.numerator>0n).toBe(true);}
  const tr=outputs(trace,160n).find(v=>at(f(rec(f(v,4n),130n),2n))===3n&&uint(f(rec(f(v,4n),130n),3n))===60n&&items(f(v,13n),'list').some(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(PRIORITY_MOTIVE))))!;
  expect(tr,'actual motive trace').toBeDefined();expect(items(f(tr,11n),'list').length).toBeGreaterThan(1);expect(items(f(tr,9n),'list').length).toBeGreaterThan(1);
  const st=restoreAuthoritativeState(decode(unzip(e.state))),prior=st.read(forecastPath(taskA));expect(prior.presence).toBe(true);expect(forecastValue(prior.value!,1000000n).observedAt).toBe(1n);
  for(const task of [taskA,taskB])expect(uint(f(rec(st.read({rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:task}]}).value!,372n),1n))).toBe(1n);
 }
 store('provenance',{sources,liveIndependentRawGrounds:true,priorOnlyForecast:true,unchosenGoalRetained:true});
});

it('family264 correction changes later behavior before the predicted opening',async()=>{
 const all=[];for(const name of ['corrected','available'] as const){const x=await start(fixture(name,7));active=x.r;const rows=[];for(const t of [3,5,7]){await through(x.r,t);rows.push(gate(x.r,t));}store('opening7-'+name,{...capture(x.r),rows});await finish(x.r);store('opening7-'+name+'-terminal',{save:hash(x.r.save()),at:x.r.snapshot().clock});all.push(rows);}
 expect(all[0][0].factor).toEqual(q(1,4));expect(all[1][0].factor).toEqual(q(1,4));expect(all[0][1].factor).toEqual(q(1,1));expect(all[1][1].factor).toEqual(q(1,4));expect(all[0][1].action).toBe(key(actionA));expect(all[1][1].action).toBe(null);expect(all[0][2].factor).toEqual(q(1,1));expect(all[1][2].factor).toEqual(q(1,1));console.info('M264 forecast correction causes later live motive/action change before opening PASS');
},590000);
