import {it,expect,vi} from 'vitest';
import * as workModule from '../assembled/workMaintenance';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {createCharacterRuntime} from '../assembled/runtime';
import {compileCharacterInputs} from '../assembled/inputs';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {WORK,WORK_SOURCE,WORK_OBSERVE,WORK_LEARN,selectMaintained,workBoard,workObservation,workKnowledgePath,workAccessPath} from '../assembled/workMaintenance';
import {selectWork,indexedPrior} from '../campaign3/workSelection';
import {workRecord as wr} from '../campaign3/workCodecs';
import {typedIdentifier,unsigned as u} from '../substrate/canonicalEncoding';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {WORKSPACE} from '../assembled/workspace';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {sid} from '../assembled/skill';
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,bytes,outputs,C,exact,type Run,type CanonicalValue} from './fixtures/assembledWorkMaintenance';
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
async function through(r:Run,at:bigint){for(let n=0;r.snapshot().clock<at;n++){expect(n).toBeLessThan(96);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await r.settleNextInstant();for(const p of peers){expect(await p.settleNextInstant()).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M128 queue cap');}
async function create(...args:Parameters<typeof fixture>){const b=fixture(...args),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};}
const retained=(r:Run)=>key(list(restoreAuthoritativeState(decode(r.snapshot().state)).entries().filter(e=>e.path.rootStateTypeId===373n&&e.path.fieldId===1n).map(e=>list([(e.path.selectors[0] as {key:CanonicalValue}).key,e.value]))));
function projection(r:Run,at:number){
 const report=reports(r,WORK).find(a=>a.length===10&&uint(a[1])===BigInt(at))!;expect(report,'work report').toBeDefined();
 const selected=items(report[4],'list').map(v=>Number(uint(v))),w=rec(report[9],381n);
 const shared=reports(r,WORKSPACE).find(a=>key(a[1])===key(signed(at)))!;expect(key(shared[3])).toBe(key(w));
 expect(items(f(w,4n),'list').length+(uint(f(rec(f(w,5n),380n),1n))===2n?1:0)+Number(uint(report[8]))+items(shared[4],'list').length).toBeLessThanOrEqual(Number(uint(shared[2])));
 const d=outputs(r.snapshot().outputs,409n).find(v=>key(f(v,2n))===key(signed(at)))!;expect(d,'actual decision').toBeDefined();
 const result=rec(f(d,4n),419n),context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),grounds=items(f(context,3n),'list');
 const access=items(f(w,4n),'list').map(v=>f(rec(v,379n),1n));
 const joint=reports(r,JOINT_APPRAISAL).find(a=>key(f(rec(a[1],384n),2n))===key(w))!;
 if(access.length){expect(joint,'joint consumer').toBeDefined();for(const t of access)expect(items(joint[4],'list').map(v=>items(v,'list')).find(a=>key(a[0])===key(t)),'live selected appraisal').toHaveLength(5);expect(uint(f(result,1n)),'resolved decision').toBe(3n);}
 const signals=items(f(raw,3n),'set').map(v=>rec(v,402n));
 const base=(task:CanonicalValue)=>signals.filter(v=>{const k=rec(f(v,1n),401n);return key(f(k,2n))===key(task)&&uint(f(k,3n))===1n;});
 const isB=(v:CanonicalValue)=>key(f(rec(v,395n),2n))===key(sid(1027,'definition/protocol-contact-two'));
 let probability=Q.of(0n);
 if(uint(f(result,1n))===3n){const data=rec(f(result,2n),420n),row=items(f(data,2n),'list').map(v=>rec(v,421n)).find(v=>isB(f(v,1n)));probability=uint(f(data,8n))===1n?Q.of(isB(f(data,1n))?1n:0n):row?readQ(f(row,2n)):Q.of(0n);
  const intent=outputs(r.snapshot().outputs,425n).find(v=>key(f(v,2n))===key(d))!,plan=outputs(r.snapshot().outputs,431n).find(v=>key(f(v,2n))===key(intent))!,attempt=outputs(r.snapshot().outputs,432n).find(v=>key(f(v,2n))===key(plan))!;expect(outputs(r.snapshot().outputs,433n).some(v=>key(f(v,2n))===key(attempt)),'actual execution').toBe(true);
 }
 return {report,selected,w,d,result,grounds,base,probability};
}
it('kernel128: exact original rank/protect/cue and fixed-history representations; admission',()=>{
 let count=0;
 for(let a=0;a<4;a++)for(let b=0;b<4;b++)for(let c=0;c<4;c++)for(let capacity=0;capacity<=3;capacity++)for(const support of[false,true])for(const cue of[false,true])for(const prior of[[],[1],[2],[3]]){
 const frame=wr(769,[typedIdentifier(1152,u(1)),signed(1),list([a,b,c].map((p,i)=>wr(770,[u(i+1),u(p)]))),cue]);
 const original=selectWork({candidate:1,capacity,support},frame,prior,2n,[true,true]),current=selectMaintained([a,b,c].map((priority,i)=>({id:i+1,priority})),prior,capacity,support,cue);
 expect(current.selected).toEqual(original.selected);expect(current.control).toBe(original.control);count++;
 }
 const settings={support:true,bindings:[u(1),u(2)]},physical=list([text(WORK),true,true,false,list([list([u(2),false,u(3)]),list([u(1),true,u(2)])])]),safe=workObservation(physical,1n,typedIdentifier(1164,u(1)),settings);
 expect(items(items(safe,'list')[3],'list')).toEqual([list([u(1),u(2)])]);expect(()=>workBoard(list([...items(physical,'list').slice(0,4),list([list([u(1),true,u(0)]),list([u(1),true,u(0)])])]),settings)).toThrow();
 const frames=[0,1,2,3].map((_,i)=>wr(769,[typedIdentifier(1152,u(i+1)),signed(i+1),list([2,i?3:1,0].map((p,j)=>wr(770,[u(j+1),u(p)]))),i===2]));
 let prior:number[]=[];for(let i=0;i<frames.length;i++){expect(prior).toEqual(indexedPrior({candidate:2,capacity:1,support:true},frames.slice(0,i+1)));prior=selectMaintained([2,i?3:1,0].map((priority,j)=>({id:j+1,priority})),prior,1,true,i===2).selected;}
 console.info('M128 KERNEL PASS '+count+' original selector comparisons; fixed-history StoredSet/IndexedReplay and closed source projection');
});
it('primary128: actual distraction/protection, independent capacity, cue recovery and inert expired cue',async()=>{
 const off=await create(false,3),on=await create(true,3),low=await create(false,1),wide=await create(false,3,3);
 for(const x of[off,on,low,wide])await through(x.r,6n);
 const before=retained(off.r);for(const x of[off,on,low,wide]){expect(retained(x.r)).toBe(before);expect(projection(x.r,6).selected).toContain(1);}
 for(const x of[off,on,low,wide])await through(x.r,7n);
 const p=[off,on,low,wide].map(x=>projection(x.r,7));
 expect(p[0].selected).toEqual([2]);expect(p[1].selected).toEqual([1]);expect(p[2].selected).toEqual([1]);expect(p[3].selected).toEqual([2,1]);
 for(const x of[off,on,low,wide])expect(retained(x.r),'retained bytes while displaced').toBe(before);
 expect(p[0].base(off.b.taskA)).toHaveLength(0);expect(p[1].base(on.b.taskA)).toHaveLength(1);
 expect(p[0].probability.equals(p[1].probability),'actual choice probability changes').toBe(false);
 console.info('M128 probability(action two), support off/on/low distract/capacity3: '+p.map(v=>v.probability.numerator+'/'+v.probability.denominator).join(' / '));
 for(const x of[off,on,low,wide]){await through(x.r,8n);expect(projection(x.r,8).selected).toContain(1);expect(retained(x.r)).toBe(before);await through(x.r,10n);const expired=projection(x.r,10);expect(expired.selected).toEqual([3]);expect(expired.base(x.b.taskA)).toHaveLength(0);expect(expired.grounds).toHaveLength(0);await finish(x.r);}
 console.info('M128 PRIMARY PASS overload/displacement/protection/capacity; retained task -> cue -> live appraisal/reason/choice/attempt; expired cue inert; full queues');
},590000);
it('continuation128: exact repeat and save before displacement, all settled boundaries',async()=>{
 const {b,m,r}=await create(true),duplicate=await createCharacterRun(m,b.d);await through(r,6n);await through(duplicate,6n);exact(r,duplicate);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);await finish(r,[duplicate,restored]);
 console.info('M128 CONTINUATION PASS repeat and complete saved prefix; exact every later boundary/full queue');
},590000);
it('privacy128: hidden actual world, truth bit and physical card order cannot change cognition',async()=>{
 const a=await create(),b=await create(false,3,2,true);
 for(let n=0;n<96;n++){const more=await a.r.settleNextInstant();expect(await b.r.settleNextInstant()).toBe(more);bytes(a.r.snapshot().state,b.r.snapshot().state);bytes(a.r.snapshot().outputs,b.r.snapshot().outputs);if(!more){console.info('M128 PRIVACY PASS whole safe state/outputs through full queue');return;}}
 throw Error('privacy cap');
},590000);
it('boundaries128: wrong owner, forged S0, malformed/old input; complete rollback of new seams',async()=>{
 const b=fixture(),model=await compileCharacterModel(b.s),component=await compileCharacterState(model),initial=component.initialState(b.d.initialState);
 const settings=model.workMaintenance!,safe=workObservation(list([text(WORK),true,false,false,list([list([u(1),true,u(2)])])]),1n,typedIdentifier(1164,u(1)),settings),p=workKnowledgePath(C);
 expect(()=>component.initialState(enc(new AuthoritativeState([...initial.entries(),{path:p,value:safe}]).canonicalValue()))).toThrow();
 expect(()=>component.stateModel.applyPatch(initial,{operations:[{kind:'set',path:p,expected:{presence:false},newValue:safe}]},sid(1025,'authority/workspace'),{writableRoots:[1000n],targetPaths:[p]})).toThrow();
 const m=await prepareCharacterModel(b.s);const original=items(decode(b.d.orderedInputs),'list'),board=original.find(v=>key(items(v,'list')[2])===key(WORK_SOURCE))!;
 await expect(createCharacterRun(m,{...b.d,orderedInputs:enc(list([...original,board]))})).rejects.toThrow('work source time');
 await expect(createCharacterRun(await prepareCharacterModel(b.legacy.s),b.d)).rejects.toThrow('work source version');
 for(const target of['source','observe','learn','workspace']){
 const originalFactory=workModule.createWorkMaintenance;let reached=false;
 const fault=()=>{reached=true;throw Error('M128 rollback');};
 const spy=vi.spyOn(workModule,'createWorkMaintenance').mockImplementation((...args)=>{
  const work=originalFactory(...args);return Object.freeze({...work,
   execute(context){const result=work.execute(context);if(target==='source'&&key(context.event.eventTypeId)===key(WORK_SOURCE)||target==='observe'&&key(context.event.eventTypeId)===key(WORK_OBSERVE))fault();return result;},
   workspace(...args){const result=work.workspace(...args);if(target==='workspace')fault();return result;},
   prepare(...args){const stage=work.prepare(...args);return {...stage,finish(state){const result=stage.finish(state);if(target==='learn')fault();return result;}};}
  });
 });
 try{const r=await createCharacterRun(m,b.d);await through(r,target==='workspace'?5n:4n);const before=r.snapshot();await expect(r.settleNextInstant()).rejects.toThrow('M128 rollback');expect(reached).toBe(true);expect({...r.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 }
 console.info('M128 BOUNDARIES PASS old/malformed inputs and owner/S0 rejection; source/observation/selection/consolidation rollback');
},590000);
