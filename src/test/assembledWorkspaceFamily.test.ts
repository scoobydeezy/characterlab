import {carryPath,compareCarry,carryMetadata,replay269} from './fixtures/assembledActivationCarry';
import {it,expect,afterEach} from 'vitest';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Lossless evidence.
import {deflateSync} from 'node:zlib';
// @ts-expect-error Hashing.
import {createHash} from 'node:crypto';
import {fixture,reappraisal,start as baseStart,through,finish,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,taskA,actionA,actionB,type Run,type CanonicalValue} from './fixtures/assembledWorkspaceFamily';
import {restoreAuthoritativeState} from '../substrate/state';
import {restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {WORK} from '../assembled/workMaintenance';
import {WORKSPACE} from '../assembled/workspace';
import {CONTROL_VIEW,CONTROL_OPTIONS} from '../assembled/control';
import {habitPath} from '../assembled/habit';
import {STRATEGY_EVAL} from '../assembled/strategy';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {SHARED_AFFECT_APPRAISAL,reappraisalPath,framePath,reappraisalFrame,REAPPRAISAL_MOTIVE} from '../assembled/reappraisal';
const originalFile='docs/planning/ASSEMBLED_CHARACTER_M263_EVIDENCE.json',file=carryPath(originalFile),hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')});
const store=(k:string,v:unknown)=>{v=JSON.parse(JSON.stringify(v,(_k,x)=>typeof x==='bigint'?String(x):x));const e=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};compareCarry(originalFile,k,v);if(replay269)e._activationCarry=carryMetadata(originalFile);if(e[k])expect(e[k]).toEqual(v);else{e[k]=v;writeFileSync(file,JSON.stringify(e,null,2)+'\n');}};
let active:Run|undefined;
async function start<T extends Parameters<typeof baseStart>[0]>(b:T){const x=await baseStart(b);active=x.r;return x;}
afterEach(ctx=>{if(ctx.task.result?.state==='fail'&&active){const e=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{},n=Object.keys(e).filter(k=>k.startsWith('failure-')).length;store('failure-'+n,{test:ctx.task.name,...capture(active)});}active=undefined;});
const at=(v:CanonicalValue)=>(v as {value:bigint}).value,state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const labels=(r:Run,tag:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const decision=(r:Run,t:number)=>outputs(r.snapshot().outputs,409n).find(v=>at(f(v,2n))===BigInt(t))!;
function outcome(r:Run,t:number){const d=decision(r,t);expect(d,'live decision'+t).toBeDefined();const result=rec(f(d,4n),419n),kind=uint(f(result,1n));return {d,kind,data:kind===3n?rec(f(result,2n),420n):undefined};}
function action(r:Run,t:number){const o=outcome(r,t);if(!o.data)return undefined;const a=f(rec(f(o.data,1n),395n),2n);expect(outputs(r.snapshot().outputs,433n).some(v=>{const intent=rec(f(rec(f(rec(f(v,2n),432n),2n),431n),2n),425n);return key(f(intent,2n))===key(o.d);}),'actual execution').toBe(true);return a;}
function probability(r:Run,t:number,target=actionB){const o=outcome(r,t);expect(o.kind,'resolved choice').toBe(3n);const d=o.data!;if(uint(f(d,8n))===1n)return key(f(rec(f(d,1n),395n),2n))===key(target)?'1':'0';const row=items(f(d,2n),'list').map(v=>rec(v,421n)).find(v=>key(f(rec(f(v,1n),395n),2n))===key(target));return row?key(f(row,2n)):'0';}
const goal=(r:Run)=>state(r).read({rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:taskA}]}).value;
const capture=(r:Run)=>{const s=r.snapshot();return {at:String(s.clock),state:zip(s.state),outputs:zip(s.outputs),trace:zip(s.trace),save:hash(r.save())};};
async function saveResult(name:string,r:Run,rows:unknown){store(name+'-gate',{...capture(r),rows});await finish(r);store(name+'-terminal',{clock:String(r.snapshot().clock),save:hash(r.save())});}
function work(r:Run,t:number){const a=labels(r,WORK).find(v=>v.length===10&&uint(v[1])===BigInt(t))!;expect(a,'live selection').toBeDefined();const w=rec(a[9],381n),selected=items(a[4],'list').map(v=>Number(uint(v))),o=outcome(r,t),raw=rec(f(rec(f(o.d,3n),408n),2n),403n),signals=items(f(raw,3n),'set');if(items(f(w,4n),'list').length){const joint=labels(r,JOINT_APPRAISAL).find(v=>key(f(rec(v[1],384n),2n))===key(w));expect(joint,'live receiving appraisal').toBeDefined();expect(items(joint![4],'list').length).toBeGreaterThan(0);expect(signals.length,'actual reasons').toBeGreaterThan(0);action(r,t);}return {selected,signals,kind:String(o.kind),probability:o.data?probability(r,t):null};}
it('family263 workspace capacity distraction protection and reminder',async()=>{
 const cases=[[false,3,2],[true,3,2],[false,1,2],[true,1,2],[false,3,3]] as const,runs=[];
 for(const [support,load,cap] of cases){const x=await start(fixture('work',support,load,cap)),rows=[];for(const t of[6,7,8,9,10]){await through(x.r,t);rows.push({at:t,...work(x.r,t),goal:goal(x.r)?key(goal(x.r)!):null});}runs.push({x,rows});}
 expect(runs.map(x=>x.rows[1].selected)).toEqual([[2],[1],[1],[1],[2,1]]);
 expect(runs[0].rows[1].probability).toBe('1');expect(runs[1].rows[1].probability).toBe('0');expect(runs[4].rows[1].probability).not.toBe(runs[0].rows[1].probability);
 for(const {x,rows}of runs){expect(rows[0].selected).toContain(1);expect(rows[2].selected).toContain(1);expect(rows[4].selected).not.toContain(1);expect(rows[4].kind).not.toBe('3');expect(rows[0].goal).toBe(rows[1].goal);await saveResult('work-'+x.b.mode+'-'+runs.indexOf(runs.find(a=>a.x===x)!),x.r,rows);}
 console.info('M263 workspace five arms: selection, live reasons, probability, retained goal, cue and expiry PASS');
},590000);
function control(r:Run,t:number){const v=labels(r,CONTROL_VIEW).find(a=>uint(a[1])===BigInt(t))!;expect(v,'live control').toBeDefined();expect(v[2]).toBe(true);expect(v[3]).toBe(true);const options=labels(r,CONTROL_OPTIONS).find(a=>uint(a[1])===BigInt(t))!;expect(options,'offered/filter report').toBeDefined();const ct=outputs(r.snapshot().trace,160n).find(tr=>at(f(rec(f(tr,4n),130n),2n))===BigInt(t)&&uint(f(rec(f(tr,4n),130n),3n))===70n&&typeof f(tr,13n)!=='boolean'&&(f(tr,13n) as Exclude<CanonicalValue,boolean>).kind==='list'&&items(f(tr,13n),'list').some(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(CONTROL_OPTIONS))));expect(ct,'actual control trace').toBeDefined();const candidates=items(f(rec(items(f(ct!,12n),'list')[0],398n),3n),'list');expect(candidates.some(v=>key(f(rec(f(rec(v,397n),1n),395n),2n))===key(actionA)),'target offered before inhibition').toBe(true);expect(items(options[3],'list').length).toBe(v[9]?1:0);expect(items(v[13],'list')[1]).toEqual(text('Known'));const draws=outputs(r.snapshot().trace,160n).filter(v=>at(f(rec(f(v,4n),130n),2n))===BigInt(t)).flatMap(v=>items(f(v,14n),'list'));expect(draws).toHaveLength(0);return {at:t,inhibit:v[9],spare:String(uint(v[8])),fatigue:items(v[11],'list')[3],recurrence:items(v[12],'list')[8],action:action(r,t)?key(action(r,t)!):null};}
it('family263 acquired habit fatigue recovery and neutral load',async()=>{
 const runs=[];for(const mode of ['rested','fatigue','load'] as const){const x=await start(fixture(mode));await through(x.r,4);const history=state(x.r).read(habitPath(C));expect(history.presence,'earned history').toBe(true);expect(items(history.value!,'list').length).toBeGreaterThan(0);const rows=[];for(const t of[5,7,9,11]){await through(x.r,t);rows.push(control(x.r,t));expect(state(x.r).read(habitPath(C))).toEqual(history);}runs.push({x,rows});}
 expect(runs[0].rows.map(r=>r.inhibit)).toEqual([true,true,true,true]);expect(runs[1].rows.map(r=>r.inhibit)).toEqual([false,false,true,true]);expect(runs[2].rows.map(r=>r.inhibit)).toEqual([true,false,true,true]);
 for(const {x,rows}of runs){for(const row of rows)expect(row.action).toBe(row.inhibit?null:key(actionA));await saveResult('control-'+x.b.mode,x.r,rows);}console.info('M263 earned habit/rested/fatigue/recovery/neutral-load PASS');
},590000);
it('family263 rumination interruption rebound and resolution with exact continuation',async()=>{
 const runs=[];for(const mode of ['rumination','unbroken'] as const){const x=await start(fixture(mode));await through(x.r,4);const history=state(x.r).read(habitPath(C));expect(history.presence).toBe(true);const rows=[];let restored:Run|undefined;
 for(const t of[5,7,9,11]){await through(x.r,t);rows.push(control(x.r,t));expect(state(x.r).read(habitPath(C))).toEqual(history);if(t===7&&mode==='rumination')restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.r.save()}));if(restored){await through(restored,t);for(const k of ['state','outputs','trace'] as const)expect(hash(restored.snapshot()[k])).toBe(hash(x.r.snapshot()[k]));expect(hash(restored.save())).toBe(hash(x.r.save()));}}
 expect(rows.map(r=>r.inhibit)).toEqual(mode==='rumination'?[false,true,false,true]:[false,false,false,true]);for(const row of rows)expect(row.action).toBe(row.inhibit?null:key(actionA));await saveResult(mode,x.r,rows);if(restored){await finish(restored);expect(hash(restored.save())).toBe(hash(x.r.save()));store('continuation',{fullStateOutputTraceSave:true,checkpoint:7,terminal:String(x.r.snapshot().clock)});}runs.push(rows);}console.info('M263 recurrence/interruption/rebound/resolution/full continuation PASS');
},590000);
it('family263 performance monitoring switches actual route',async()=>{
 for(const mode of ['failure','success'] as const){const x=await start(fixture(mode)),rows=[];for(const t of[3,5,7]){await through(x.r,t);const p=labels(x.r,STRATEGY_EVAL).find(v=>uint(v[2])===BigInt(t))!,row=items(items(p[3],'list').find(v=>key(items(v,'list')[0])===key(taskA))!,'list'),mon=items(row[3],'list');expect(uint(f(rec(goal(x.r)!,372n),1n))).toBe(1n);rows.push({at:t,count:Number(uint(mon[5])),action:key(action(x.r,t)!)});expect(probability(x.r,t,mode==='failure'&&t===7?actionB:actionA)).toBe('1');}expect(rows.map(r=>r.count)).toEqual(mode==='failure'?[0,1,2]:[0,0,0]);expect(rows.map(r=>r.action)).toEqual([key(actionA),key(actionA),key(mode==='failure'?actionB:actionA)]);await saveResult('monitor-'+mode,x.r,rows);}console.info('M263 prior own outcomes -> monitoring -> actual changed route PASS');
},590000);
it('family263 chosen reappraisal changes later affect',async()=>{
 const runs=[];for(const mode of ['complete','interrupted'] as const){const x=await start(reappraisal(mode));await through(x.r,11);const before=labels(x.r,SHARED_AFFECT_APPRAISAL).find(a=>uint(a[1])===10n)!,after=labels(x.r,SHARED_AFFECT_APPRAISAL).find(a=>uint(a[1])===11n)!,motive=labels(x.r,REAPPRAISAL_MOTIVE).find(a=>uint(a[1])===10n)!;expect(before,'live prior appraisal').toBeDefined();expect(after,'live later appraisal').toBeDefined();expect(motive[3]).toBe(true);expect(motive[6]).toEqual(q(1,1));expect(action(x.r,10)).toBeDefined();expect(action(x.r,11)).toBeDefined();const frame=reappraisalFrame(state(x.r).read(framePath(C)).value,1000000n);expect(frame.at).toBe(mode==='complete'?10n:0n);runs.push({x,before,after,knowledge:key(state(x.r).read(reappraisalPath(C)).value!),p:probability(x.r,11)});}
 expect(runs[0].knowledge).toBe(runs[1].knowledge);expect(runs[0].before[6]).toEqual(runs[1].before[6]);expect(runs[0].after[6]).not.toEqual(runs[1].after[6]);expect(runs[0].p).not.toBe(runs[1].p);for(const [i,x]of runs.entries())await saveResult('reappraisal-'+i,x.x.r,{before:key(list(x.before)),after:key(list(x.after)),probability:x.p});console.info('M263 chosen operation -> frame -> later affect/actual probability PASS');
},590000);
