import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {WORKSPACE} from '../assembled/workspace';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {receivingRecord as rec} from '../assembled/codecs';
import {restoreAuthoritativeState} from '../substrate/state';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {sid} from '../assembled/skill';
import {fixture,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledWorkspaceReceiving';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue;trace?:ReturnType<typeof outputs>}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs),trace=(r:Run)=>view(r).trace??=outputs(snap(r).trace,160n);
const report=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const retained=(r:Run)=>state(r).entries().filter(e=>e.path.rootStateTypeId===373n&&e.path.fieldId===1n);
const taskKey=(e:ReturnType<typeof retained>[number])=>(e.path.selectors[0] as {key:CanonicalValue}).key;
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('full queue did not exhaust');}
async function create(capacity=3,hidden=false){const b=fixture(capacity,hidden),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};}
function projection(r:Run,b:ReturnType<typeof fixture>,at=6){
 const shared=report(r,WORKSPACE).find(a=>key(a[1])===key(signed(at)))!;expect(shared,'actual workspace').toBeDefined();
 const w=rec(shared[3],381n),selected=items(f(w,4n),'list').map(v=>f(rec(v,379n),1n));
 expect(selected).toHaveLength(b.capacity-1);expect(uint(f(rec(f(w,5n),380n),1n)),'live forecast').toBe(2n);
 expect(selected.map(key)).toContain(key(b.taskA));if(b.capacity>=3)expect(selected.map(key)).toContain(key(b.taskB));else expect(selected.map(key)).not.toContain(key(b.taskB));
 expect(selected.length+1+items(shared[4],'list').length).toBeLessThanOrEqual(b.capacity);
 const joint=report(r,JOINT_APPRAISAL).find(a=>key(f(rec(a[1],384n),2n))===key(shared[3]))!;expect(joint,'actual joint consumer').toBeDefined();
 const rows=items(joint[4],'list').map(v=>items(v,'list'));
 for(const task of[b.taskA,...(b.capacity>=3?[b.taskB]:[])])expect(rows.find(row=>key(row[0])===key(task)),'selected task live appraisal').toHaveLength(5);
 if(b.capacity===2)expect(rows.some(row=>key(row[0])===key(b.taskB))).toBe(false);
 const d=outputs(snap(r).outputs,409n).find(v=>key(f(v,2n))===key(signed(at)))!;expect(d,'actual decision').toBeDefined();
 const result=rec(f(d,4n),419n);expect(uint(f(result,1n)),'resolved choice liveness').toBe(3n);
 const data=rec(f(result,2n),420n),context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),nuclei=items(f(context,3n),'list').map(v=>rec(v,407n));
 const signals=items(f(raw,3n),'set').map(v=>rec(v,402n)),base=(task:CanonicalValue)=>signals.filter(v=>{const k=rec(f(v,1n),401n);return key(f(k,2n))===key(task)&&uint(f(k,3n))===1n;}),grounds=(task:CanonicalValue)=>nuclei.filter(v=>key(f(rec(f(v,1n),404n),3n))===key(f(rec(task,371n),2n)));
 for(const task of[b.taskA,...(b.capacity>=3?[b.taskB]:[])]){expect(base(task),'selected task positive base').toHaveLength(1);expect(readQ(f(base(task)[0],2n)).compare(Q.of(0n))).toBeGreaterThan(0);expect(grounds(task),'compiled selected ground').toHaveLength(1);}
 if(b.capacity===2){expect(base(b.taskB)).toHaveLength(0);expect(grounds(b.taskB)).toHaveLength(0);}
 const candidates=items(f(rec(f(raw,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n));expect(candidates,'accessible executable alternatives').toHaveLength(b.capacity===2?1:2);
 const isB=(v:CanonicalValue)=>key(f(rec(v,395n),2n))===key(sid(1027,'definition/protocol-contact-two'));
 if(b.capacity===2)expect(candidates.some(isB)).toBe(false);else expect(candidates.some(isB)).toBe(true);
 const row=items(f(data,2n),'list').map(v=>rec(v,421n)).find(v=>isB(f(v,1n))),lotteryB=row?readQ(f(row,2n)):Q.of(0n);
 const pB=uint(f(data,8n))===1n?Q.of(isB(f(data,1n))?1n:0n):lotteryB;
 const wt=trace(r).find(t=>{const e=rec(f(t,4n),130n),output=f(t,13n);return key(f(e,2n))===key(signed(at))&&uint(f(e,3n))===40n&&typeof output!=='boolean'&&output.kind==='list'&&output.items.some(x=>key(x)===key(shared[3]));})!;
 expect(wt,'workspace producer trace').toBeDefined();
 const taskReads=items(f(wt,11n),'list').map(v=>rec(v,147n)).filter(v=>{const p=rec(f(v,2n),140n);return uint(f(p,1n))===373n&&uint(f(p,2n))===1n;});expect(taskReads).toHaveLength(3);
 expect(taskReads.every(v=>f(v,3n)===true&&uint(f(rec(f(v,4n),372n),1n))===1n)).toBe(true);
 const intent=outputs(snap(r).outputs,425n).find(v=>key(f(v,2n))===key(d))!;expect(intent,'chosen intent').toBeDefined();
 const plan=outputs(snap(r).outputs,431n).find(v=>key(f(v,2n))===key(intent))!,attempt=outputs(snap(r).outputs,432n).find(v=>key(f(v,2n))===key(plan))!,outcome=outputs(snap(r).outputs,433n).find(v=>key(f(v,2n))===key(attempt))!;expect(outcome,'actual execution outcome').toBeDefined();
 return {selected,shared,nuclei,base,grounds,data,pB,lotteryB,taskReads};
}
it('primary127: retained unselected task supplies no reason; larger workspace changes actual choice probability',async()=>{
 const narrow=await create(2),wide=await create(3),all=await create(4);
 expect(narrow.b.d).toEqual(wide.b.d);expect(wide.b.d).toEqual(all.b.d);
 for(const x of[narrow,wide,all])await through(x.r,5n);
 const canonicalTasks=(r:Run)=>key(list(retained(r).map(e=>list([taskKey(e),e.value])))),before=canonicalTasks(narrow.r);expect(retained(narrow.r)).toHaveLength(3);expect(canonicalTasks(wide.r)).toBe(before);expect(canonicalTasks(all.r)).toBe(before);
 for(const x of[narrow,wide,all])await through(x.r,6n);
 const a=projection(narrow.r,narrow.b),b=projection(wide.r,wide.b),c=projection(all.r,all.b);
 for(const x of[narrow,wide,all])expect(canonicalTasks(x.r)).toBe(before);
 expect(4).toBeGreaterThan(narrow.b.capacity);expect(4).toBeGreaterThan(wide.b.capacity);
 console.info('M127 captured modes/probabilities '+[a,b,c].map(p=>uint(f(p.data,8n))+' actual='+p.pB.numerator+'/'+p.pB.denominator+' lottery='+p.lotteryB.numerator+'/'+p.lotteryB.denominator).join('; '));
 expect(a.pB.equals(b.pB),'actual arbitration probability changes').toBe(false);expect(c.pB).toEqual(b.pB);
 console.info('M127 PRIMARY actual probability(action two) '+[a,b,c].map(p=>p.pB.numerator+'/'+p.pB.denominator).join(' / ')+'; selected counts1/2/3 plus forecast; task B retained but no base/ground at capacity2');
 for(const x of[narrow,wide,all])await finish(x.r);
 console.info('M127 PRIMARY PASS full queues; capacity/access is not task erasure; original protection/reminder gates remain open');
},550000);
it('continuation127: exact repeat and save5 restore preserve working access and later execution',async()=>{
 const {b,m,r}=await create(),duplicate=await createCharacterRun(m,b.d);await through(r,5n);await through(duplicate,5n);exact(r,duplicate);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);
 await finish(r,[duplicate,restored]);projection(r,b);
 console.info('M127 CONTINUATION PASS exact state/outputs/trace/save through every settled continuation and full queue');
},550000);
it('privacy127: hidden world facts cannot change working access or its reasons',async()=>{
 const a=await create(),b=await create(3,true);
 for(let n=0;n<96;n++){const more=await advance(a.r);expect(await advance(b.r)).toBe(more);bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);if(!more){projection(a.r,a.b);projection(b.r,b.b);console.info('M127 PRIVACY PASS whole safe state/outputs every boundary/full queue');return;}}
 throw Error('privacy queue did not exhaust');
},550000);
