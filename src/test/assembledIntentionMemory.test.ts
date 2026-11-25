// @ts-expect-error Node-only bytes.
import {Buffer} from 'node:buffer';
import {it,expect,vi} from 'vitest';
// @ts-expect-error Node-only evidence.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Node-only lossless evidence.
import {deflateSync,inflateSync} from 'node:zlib';
// @ts-expect-error Node-only hashing.
import {createHash} from 'node:crypto';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {INTENTION_MEMORY,isInstructionPath,instructionPath,instructionEpisode,recallInstructions} from '../assembled/intentionMemory';
import * as memoryModule from '../assembled/memory';
import * as plannerModule from '../assembled/strategyExecution';
import {WORKSPACE} from '../assembled/workspace';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {createCharacterRun,restorePreparedCharacterRun,prepareCharacterModel} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {cognitiveRecord as record} from '../assembled/codecs';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {STRATEGY_EVAL} from '../assembled/strategy';
import {start,fixture,through,rec,f,uint,items,key,decode,list,text,u,enc,outputs,C,sid,taskA,type CanonicalValue} from './fixtures/assembledIntentionMemory';
const file='docs/planning/ASSEMBLED_CHARACTER_M259_EVIDENCE.json';
const hash=(v:Uint8Array)=>createHash('sha256').update(v).digest('hex'),zip=(v:Uint8Array)=>({hash:hash(v),bytes:v.length,deflate:deflateSync(v).toString('base64')});
function put(k:string,v:unknown){const e=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};if(e[k]!==undefined){expect(e[k]).toEqual(v);return;}e[k]=v;writeFileSync(file,JSON.stringify(e,null,2)+'\n');}
const at=(v:CanonicalValue)=>(v as {value:bigint}).value;
type Run=Awaited<ReturnType<typeof start>>['run'];
const reports=(r:Run,t:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(t))).map(v=>items(v,'list'));
async function finish(r:Run){for(let n=0;n<128;n++)if(!await r.settleNextInstant())return;throw Error('M259 unfinished queue');}
function capture(r:Run){const s=r.snapshot();return {at:String(s.clock),state:zip(s.state),outputs:zip(s.outputs),trace:zip(s.trace),save:hash(r.save())};}
it('intention259 native primary retains actual instruction through planner',async()=>{
 for(const [label,o] of [['retainedA',{}],['lostA',{capacity:1}],['retainedB',{route:1 as const}]] as const){
  const x=await start(o);await through(x.run,2n);const state=restoreAuthoritativeState(decode(x.run.snapshot().state));
  console.info(label,'episode kinds',state.entries().filter(e=>e.path.rootStateTypeId===346n).map(e=>typeof e.value!=='boolean'&&e.value.kind==='list'?items(e.value,'list')[0]:text('diagnostic')));
  expect(state.entries().filter(e=>isInstructionPath(e.path))).toHaveLength(label==='lostA'?0:1);
  expect(state.read({rootStateTypeId:373n,fieldId:2n,selectors:[{kind:'mapKey',key:taskA}]}).presence).toBe(false);
  await through(x.run,5n);put(label+'-5',capture(x.run));
  const report=reports(x.run,STRATEGY_EVAL).find(v=>uint(v[2])===5n)!;expect(report,'live planner').toBeDefined();const row=items(items(report[3],'list').find(v=>key(items(v,'list')[0])===key(taskA))!,'list');
  expect(uint(row[1])).toBe(label==='lostA'?2n:label==='retainedB'?1n:0n);
  console.info(label,'selected',String(uint(row[1])),'record outputs',items(decode(x.run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record').map(v=>(v as {schema:{typeId:bigint}}).schema.typeId.toString()));
  await through(x.run,6n);const next=reports(x.run,STRATEGY_EVAL).find(v=>uint(v[2])===6n)!;expect(uint(items(items(next[3],'list').find(v=>key(items(v,'list')[0])===key(taskA))!,'list')[1]),'no cached route fallback without current recall').toBe(2n);await finish(x.run);put(label+'-terminal',{save:hash(x.run.save())});
 }
},590000);

const fromRaw=(raw:any)=>({state:inflateSync(Buffer.from(raw.state.deflate,'base64')),outputs:inflateSync(Buffer.from(raw.outputs.deflate,'base64')),trace:inflateSync(Buffer.from(raw.trace.deflate,'base64'))});
function nativeProof(raw:any,expected:0|1|2,terminal=false,failed=false){
 const s=fromRaw(raw),state=restoreAuthoritativeState(decode(s.state)),os=items(decode(s.outputs),'list'),ts=outputs(s.trace,160n);
 const rows=(tag:string)=>os.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
 const plan=rows(STRATEGY_EVAL).find(v=>uint(v[2])===5n)!;expect(plan,'live actual planner').toBeDefined();
 const task=items(plan[3],'list').map(v=>items(v,'list')).find(v=>key(v[0])===key(taskA));
 const workspace=rows(WORKSPACE).find(v=>at(v[1])===5n)!;expect(workspace,'live shared workspace').toBeDefined();
 const goal=state.read({rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:taskA}]});
 if(!terminal){expect(goal.presence,'adopted goal').toBe(true);expect(uint(f(rec(goal.value!,372n),1n))).toBe(1n);expect(task).toBeDefined();expect(uint(task![1])).toBe(BigInt(expected));
  const appraisal=rows(JOINT_APPRAISAL).find(a=>key(f(rec(a[1],384n),2n))===key(workspace[3]))!;expect(appraisal,'same live appraisal in retained and lost arms').toBeDefined();expect(items(appraisal[4],'list').map(v=>items(v,'list')).some(v=>key(v[0])===key(taskA))).toBe(true);
 }
 const d=outputs(s.outputs,409n).find(v=>at(f(v,2n))===5n)!;expect(d,'actual arbitration').toBeDefined();
 const result=rec(f(d,4n),419n),context=rec(f(d,3n),408n),rawSignals=rec(f(context,2n),403n);
 const attempts=outputs(s.outputs,433n).filter(v=>key(f(rec(f(rec(f(rec(f(v,2n),432n),2n),431n),2n),425n),2n))===key(d));
 if(expected===2){expect(attempts).toHaveLength(0);expect(uint(f(result,1n))).not.toBe(3n);return {route:'unavailable',decision:String(uint(f(result,1n))),attempts:0,goal:goal.presence?String(uint(f(rec(goal.value!,372n),1n))):'Absent'};}
 const annex=items(task!.at(-1)!,'list');expect(annex[0]).toEqual(text(INTENTION_MEMORY));expect(items(annex[1],'list')).toHaveLength(1);const operand=items(annex[1],'list')[0],a=instructionEpisode(operand);
 expect(items(workspace[4],'list').some(v=>key(items(v,'list')[1])===key(operand)),'actual selected workspace operand').toBe(true);
 const recall=ts.find(t=>{const e=rec(f(t,4n),130n);return at(f(e,2n))===5n&&uint(f(e,3n))===20n&&key(f(e,5n))===key(memoryModule.MEMORY_RECALL)&&key(f(t,13n)).includes(key(operand));});expect(recall,'actual memory producer').toBeDefined();expect(items(f(recall!,11n),'list').some(v=>typeof v!=='boolean'&&v.kind==='record'&&key(v.fields.get(4n)??false)===key(operand)),'actual owned read contains the exact operand').toBe(true);
 const planner=ts.find(t=>key(f(t,13n))===key(list([list(plan)])));expect(planner,'actual planner trace').toBeDefined();
 const candidates=items(f(rec(f(rawSignals,2n),398n),3n),'list').filter(v=>items(f(rec(v,397n),2n),'set').some(o=>key(f(rec(o,396n),1n))===key(taskA)));expect(candidates).toHaveLength(1);const candidate=rec(candidates[0],397n),option=f(candidate,1n),origins=items(f(candidate,2n),'set');expect(origins.some(v=>key(f(rec(v,396n),2n))===key(a[4])),'candidate instruction comes from remembered content').toBe(true);
 expect(uint(f(result,1n))).toBe(3n);const resolved=rec(f(result,2n),420n);expect(f(resolved,1n)).toEqual(option);
 expect(outputs(s.outputs,426n).some(v=>key(f(rec(f(v,2n),425n),2n))===key(d))).toBe(true);expect(attempts).toHaveLength(1);expect(uint(f(attempts[0],3n))).toBe(failed?0n:uint(f(rec(f(rec(f(attempts[0],2n),432n),2n),431n),3n)));if(!failed)expect(uint(f(attempts[0],3n))).toBeGreaterThan(0n);
 const signals=items(f(rawSignals,3n),'set').map(v=>rec(v,402n));expect(signals.some(v=>key(f(rec(f(v,1n),401n),2n))===key(taskA)),'live evaluation-time task reason').toBe(true);
 return {route:expected,instruction:key(a[4]),option:key(option),reasonValues:signals.map(v=>key(f(v,2n))),mode:String(uint(f(resolved,8n))),attempts:1,failed};
}
it('intention259 captured native producer to execution proof',()=>{
 const e=JSON.parse(readFileSync(file,'utf8'));for(const [label,route] of [['retainedA',0],['retainedB',1],['lostA',2]] as const)put(label+'-proof',nativeProof(e[label+'-5'],route));
});
it('intention259 access controls and terminal boundaries',async()=>{
 const cases=[['lostB',{route:1 as const,capacity:1},2,false],['absent',{cue:'absent' as const},2,false],['wrong',{cue:'neutral' as const},2,false],['soleWrong',{cue:'neutral' as const,neutral:false},0,false],['denied',{denied:true},2,true],['unavailable',{available:false},2,false],['cancelled',{cancelled:true},2,true],['expired',{expired:true},2,true],['failed',{failed:true},0,false]] as const;
 for(const [label,o,route,terminal] of cases){const x=await start(o);await through(x.run,5n);const raw=capture(x.run);put(label+'-raw',raw);put(label+'-proof',nativeProof(raw,route,terminal,label==='failed'));await finish(x.run);put(label+'-terminal',{save:hash(x.run.save())});}
 console.info('M259 access/lifecycle controls: lostB, absent, wrong, sole zero-score survivor, denied, unavailable, cancelled, expired, failed execution');
},590000);
it('intention259 exact repeat restore and hidden truth',async()=>{
 const x=await start(),h=await start({hidden:true}),repeat=cachedMemory(await createCharacterRun(x.m,x.b.d));
 const same=(a:Run,b:Run)=>{const x=a.snapshot(),y=b.snapshot();expect(x.clock).toBe(y.clock);for(const k of ['state','outputs','trace'] as const)expect(hash(x[k])).toBe(hash(y[k]));expect(hash(a.save())).toBe(hash(b.save()));};
 for(const r of [x.run,h.run,repeat])await through(r,4n);same(x.run,repeat);const saved=x.run.save(),restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:saved}));same(x.run,restored);
 for(let n=0;n<128;n++){const more=await x.run.settleNextInstant();for(const r of [repeat,restored]){expect(await r.settleNextInstant()).toBe(more);same(x.run,r);}expect(await h.run.settleNextInstant()).toBe(more);for(const k of ['state','outputs'] as const)expect(hash(x.run.snapshot()[k])).toBe(hash(h.run.snapshot()[k]));if(!more){put('continuation',{checkpoint:hash(saved),terminal:hash(x.run.save()),exactRepeatRestore:true,hiddenWholeStateOutputs:true});return;}}
 throw Error('M259 continuation cap');
},590000);
it('intention259 ownership admission and reached rollback',async()=>{
 const x=await start();await through(x.run,1n);const learned=restoreAuthoritativeState(decode(x.run.snapshot().state)).entries().find(e=>isInstructionPath(e.path))!;expect(learned).toBeDefined();
 const model=await compileCharacterModel(x.b.s),component=await compileCharacterState(model),initial=component.initialState(x.b.d.initialState);
 expect(()=>component.initialState(enc(new AuthoritativeState([...initial.entries(),learned]).canonicalValue()))).toThrow();
 expect(()=>component.stateModel.applyPatch(initial,{operations:[{kind:'set',path:learned.path,expected:{presence:false},newValue:learned.value}]},sid(1025,'authority/workspace'),{writableRoots:[346n],targetPaths:[learned.path]})).toThrow();
 expect(()=>component.initialState(enc(new AuthoritativeState([...initial.entries(),{path:{rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:taskA}]},value:record(372,[u(1)])},{path:{rootStateTypeId:373n,fieldId:2n,selectors:[{kind:'mapKey',key:taskA}]},value:record(390,[x.b.route.plans[0].instructionId])}]).canonicalValue()))).toThrow('memory-bound instruction');
 const reached:string[]=[];
 for(const target of ['formation','planner'] as const){const fail=()=>{reached.push(target);throw Error('M259 rollback '+target);};
  const original=memoryModule.createEpisodicExtension,originalPlanner=plannerModule.createStrategyExecution;
  const spy=target==='formation'
   ? vi.spyOn(memoryModule,'createEpisodicExtension').mockImplementation((...args)=>{
      const m=original(...args);
      return {...m,prepare(...args){
       const p=m.prepare(...args);
       return {...p,finish(state){
        const next=p.finish(state);
        if(state.entries().every(e=>!isInstructionPath(e.path))&&next.entries().some(e=>isInstructionPath(e.path)))fail();
        return next;
       }};
      }};
     })
   : vi.spyOn(plannerModule,'createStrategyExecution').mockImplementation((...args)=>{
      const p=originalPlanner(...args);
      return {...p,evaluate(...args){const result=p.evaluate(...args);fail();return result;}};
     });
  try{const r=cachedMemory(await createCharacterRun(x.m,x.b.d));if(target==='planner')await through(r,4n);const before=r.snapshot();await expect(r.settleNextInstant()).rejects.toThrow('M259 rollback');expect({...r.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 }
 expect(reached).toEqual(['formation','planner']);put('boundaries',{learnedS0Rejected:true,taskInstructionRejected:true,wrongOwnerRejected:true,reachedRollback:reached});
},590000);

it('intention259 actual native calibration correspondence',()=>{
 const e=JSON.parse(readFileSync(file,'utf8')),evidence:Record<string,unknown>={};
 for(const label of ['retainedA','retainedB']){
  const raw=fromRaw(e[label+'-5']),d=outputs(raw.outputs,409n).find(v=>at(f(v,2n))===5n)!,context=rec(f(d,3n),408n),signals=items(f(rec(f(context,2n),403n),3n),'set').map(v=>rec(v,402n));
  const own=signals.filter(v=>key(f(rec(f(v,1n),401n),2n))===key(taskA));expect(own).toHaveLength(1);
  const base=own.find(v=>uint(f(rec(f(v,1n),401n),3n))===1n)!;expect(f(base,2n)).toEqual({kind:'rational',numerator:1n,denominator:1n});
  const situation=signals.find(v=>uint(f(rec(f(v,1n),401n),3n))===2n)!;expect(situation).toBeDefined();
  const bodySupport=items(decode(raw.outputs),'list').find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(JOINT_APPRAISAL)))!;expect(items(bodySupport,'list')[2]).not.toEqual(list([]));
  const bodyId=f(rec(items(bodySupport,'list')[2],461n),1n),basis=f(rec(f(situation,3n),400n),1n);expect(typeof basis!=='boolean'&&basis.kind==='map'&&basis.entries.some(([k])=>key(k).includes(key(bodyId))),'actual body observation in situation basis').toBe(true);
  const q=f(situation,2n) as {numerator:bigint;denominator:bigint};expect(q.numerator).toBeGreaterThan(0n);
  const result=rec(f(d,4n),419n),resolved=rec(f(result,2n),420n);expect(uint(f(resolved,8n))).toBe(1n);
  evidence[label]={base:'1/1',situation:q.numerator+'/'+q.denominator,auto:true,classification:"Interaction: existing live body appraisal supplies another task's situation ground; instructed task base remains1 and its recalled action is automatically selected"};
 }
 put('native-ground-correspondence',evidence);console.info('M259 native calibration',evidence);
});
