import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as field,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {chosenData} from '../campaign2/cognitiveChoice';
import {compilePersonStateModel,compilePersonStateInputs,personstateRecipe,STAGES,eventId,path,owner,HOLDERS} from '../campaign3/personstateModel';
import {createPersonStateRuntime} from '../campaign3/personstateRuntime';
import {emptyKnowledge,estimates} from '../campaign3/personstateMath';
import {preparePersonStateModel,createPersonStateRun,restorePersonStateRun} from '../campaign3/personstateFactory';
import {decodePersonState as decode} from '../campaign3/personstateCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './personstateFixtures';
const f=(v:CanonicalValue,id:bigint)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('test requires record');return field(v,id);};
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,pressure=1,goal=1){const source=personstateRecipe(law,pressure,goal),m=await compilePersonStateModel(source),orderedInputs=ordered(cases()[name]),i=await compilePersonStateInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createPersonStateRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,pressure=1,goal=1){const s=await setup(name,law,pressure,goal);while(await s.r.settle()){}return s;}
const outputs=(s:Awaited<ReturnType<typeof run>>,type:bigint)=>records(s.r.snapshot().outputs,type);
const knowledge=(s:Awaited<ReturnType<typeof run>>,i:number)=>s.r.snapshot().state.read(path(i)).value??emptyKnowledge();
const apps=(s:Awaited<ReturnType<typeof run>>,i=1)=>outputs(s,1153n).filter(x=>key(f(x,3n))===key(HOLDERS[i]));
it('learns a mixed cooperative impression from actual conduct while misreading current intent',async()=>{
 const s=await run(),a=apps(s)[3],b=apps(s,2)[3];expect(f(a,5n)).toEqual(list([q(2,3)]));expect(f(a,6n)).toEqual(list([q(0,1)]));expect(f(b,5n)).toEqual(f(a,5n));expect(f(b,6n)).toEqual(list([q(1,1)]));expect(f(outputs(s,1155n)[3],5n)).toEqual(list([true]));expect(f(a,9n)).toEqual(list([q(1,1),q(1,1)]));expect(f(b,9n)).toEqual(list([q(0,1),q(0,1)]));
 expect(items(f(knowledge(s,1),1n),'list')).toHaveLength(4);
});
it('same history with changed current cue changes appraisal without rewriting disposition or old appraisal',async()=>{
 const base=await run(),changed=await run('cueChanged');expect(items(f(knowledge(base,1),1n),'list')).toEqual(items(f(knowledge(changed,1),1n),'list'));expect(f(apps(base)[3],5n)).toEqual(f(apps(changed)[3],5n));expect(f(apps(changed)[3],9n)).toEqual(list([q(0,1),q(0,1)]));expect(apps(base).slice(0,3)).toEqual(apps(changed).slice(0,3));expect(outputs(base,425n)).toEqual(outputs(changed,425n));
});
it('goal-only change preserves estimates and evidence but changes adverse appraisal',async()=>{
 const s=await run(),opposite=await run('main',1,1,2);expect(knowledge(s,1)).toEqual(knowledge(opposite,1));for(const k of [5n,6n])expect(f(apps(s)[3],k)).toEqual(f(apps(opposite)[3],k));expect(f(apps(opposite)[3],9n)).toEqual(list([q(0,1),q(0,1)]));expect(outputs(s,425n)).toEqual(outputs(opposite,425n));
});
it('pooled estimate and single-channel controls retain distinct predictions',async()=>{
 const pooled=await run('main',2),history=await run('main',3),cue=await run('main',4);expect(f(apps(pooled)[3],5n)).toEqual(list([q(1,2)]));expect(f(apps(pooled)[3],6n)).toEqual(list([q(1,2)]));expect(f(apps(history)[3],6n)).toEqual(list([q(2,3)]));expect(f(apps(cue)[3],5n)).toEqual(list([]));expect(f(apps(cue)[3],6n)).toEqual(list([q(0,1)]));
});
it('unknown history differs from neutral or known negative; absent current cue cannot reuse the last episode',async()=>{
 const unknown=await run('noHistory'),neutral=await run('neutral'),negative=await run('negative'),missing=await run('missingCue'),returned=await run('missingThenReturn');expect(f(apps(unknown)[3],5n)).toEqual(list([]));expect(f(apps(neutral)[3],5n)).toEqual(list([q(1,2)]));expect(f(apps(negative)[3],5n)).toEqual(list([q(0,1)]));expect(f(apps(missing)[3],6n)).toEqual(list([]));expect(f(apps(missing)[3],9n)).toEqual(list([]));expect(f(apps(returned)[2],6n)).toEqual(list([]));expect(f(apps(returned)[3],6n)).toEqual(list([q(0,1)]));
});
it('failed execution preserves intent and creates no conduct sample; learning140 changes only later appraisal130',async()=>{
 const base=await run(),failed=await run('failed'),visible=await run('visibleLast');for(const t of [425n,426n,1155n])expect(outputs(failed,t)).toEqual(outputs(base,t));expect(items(f(knowledge(failed,1),1n),'list')).toHaveLength(0);expect(f(apps(base)[0],5n)).toEqual(list([]));expect(f(apps(base)[1],5n)).toEqual(list([q(1,1)]));expect(apps(visible).slice(0,4)).toEqual(apps(base).slice(0,4));expect(estimates(knowledge(visible,1),1).disposition?.equals(estimates(knowledge(base,1),1).disposition!)).toBe(false);
});
it('whole later views preserve hidden private context/default and other observer information; Oracle violates privacy',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1,pressure=1)=>{const source=personstateRecipe(law,pressure),r=await createPersonStateRun(await preparePersonStateModel(source),{initialState,orderedInputs:ordered(cases()[name]),runSeed:seed});while(await r.settleNextInstant()){}return [r.observerView(0),r.observerView(1)];};
 for(const pressure of [1,3]){const base=await view('main',1,pressure);expect(await view('hiddenIntent',1,pressure)).toEqual(base);expect((await view('noA',1,pressure))[1]).toEqual(base[1]);expect((await view('noB',1,pressure))[0]).toEqual(base[0]);expect((await view('otherCue',1,pressure))[0]).toEqual(base[0]);}
 expect(await view('main',1,2)).toEqual(await view('main'));expect((await view('missingCue'))[0]).toEqual((await view('deniedCueChange'))[0]);expect(await view('main',5)).not.toEqual(await view('hiddenIntent',5));
},120000);
it('actual target phases and contested addressed draws remain intact',async()=>{
 const s=await run('main',1,3);for(const [type,phase] of [[1153n,130n],[425n,70n],[426n,80n],[1158n,110n],[1164n,120n]] as const){const ts=s.r.snapshot().trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),type).length);expect(ts).toHaveLength(type===1153n||type===1164n?10:5);for(const t of ts)expect(f(f(t,4n),3n)).toEqual(u(phase));}const d=chosenData(outputs(s,409n)[3]);expect(items(f(d,9n),'list')).toHaveLength(2);for(const row of items(f(d,2n),'list'))expect(f(row,2n)).toEqual(q(1,2));expect(s.r.snapshot().randomAddresses.length).toBeGreaterThan(0);
});
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after both observers acquired conduct history`,async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('personstate fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
for(const stage of ['decision','execute','commit'])it(`rolls back contested draws at ${stage}`,async()=>{
 const s=await setup('main',1,3);await s.r.settle();await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('draw fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(after.randomAddresses).toEqual(before.randomAddresses);expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators'] as const)expect(after[k]).toEqual(before[k]);
});
it('rejects cross-holder writers, injected state, forged public handles and edited saves',async()=>{
 const s=await setup();expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(2),expected:{presence:false},newValue:emptyKnowledge()}]},owner('learn-a'),s.m.authority)).toThrow();await expect(compilePersonStateInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');
 const model=await preparePersonStateModel(s.source),r=await createPersonStateRun(model,{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restorePersonStateRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restorePersonStateRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenIntent),save:r.save()})).rejects.toThrow();await expect(createPersonStateRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(2)).toThrow();
});
