import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {chosenData} from '../campaign2/cognitiveChoice';
import {compileLyingModel,compileLyingInputs,lyingRecipe,STAGES,eventId,path,owner,HOLDERS} from '../campaign3/lyingModel';
import {createLyingRuntime} from '../campaign3/lyingRuntime';
import {emptyKnowledge,estimate} from '../campaign3/lyingMath';
import {prepareLyingModel,createLyingRun,restoreLyingRun} from '../campaign3/lyingFactory';
import {decodeLying as decode} from '../campaign3/lyingCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './lyingFixtures';
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,pressure=2){const source=lyingRecipe(law,pressure),m=await compileLyingModel(source),orderedInputs=ordered(cases()[name]),i=await compileLyingInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createLyingRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,pressure=2){const s=await setup(name,law,pressure);while(await s.r.settle()){}return s;}
const outputs=(s:Awaited<ReturnType<typeof run>>,type:bigint)=>records(s.r.snapshot().outputs,type);
const knowledge=(s:Awaited<ReturnType<typeof run>>,i:number)=>s.r.snapshot().state.read(path(i)).value??emptyKnowledge();
it('constructs assertions from belief and opposing adopted purposes through actual choices',async()=>{
 const honest=await run('main',1,1),liar=await run();expect(knowledge(honest,0)).toEqual(knowledge(liar,0));
 for(const [s,purpose,first] of [[honest,1,true],[liar,2,false]] as const){const intents=outputs(s,1090n);expect(intents).toHaveLength(4);expect(f(rec(intents[0],1090n),5n)).toEqual(list([first]));for(const v of intents)expect(f(rec(v,1090n),4n)).toEqual(u(purpose));for(const v of outputs(s,1093n))expect(f(rec(v,1093n),3n)).toEqual(u(purpose));expect(outputs(s,426n)).toHaveLength(4);}
});
it('retains exact contested arbitration and committed draws without seed selection',async()=>{
 const s=await run('main',1,3);expect(s.r.snapshot().randomAddresses.length).toBeGreaterThan(0);for(const out of outputs(s,409n)){const data=chosenData(out);expect(items(f(data,9n),'list')).toHaveLength(2);for(const row of items(f(data,2n),'list'))expect(f(rec(row,421n),2n)).toEqual(q(1,2));}
});
it('failed lies preserve the whole intended assertion and expression but supply no recipient evidence',async()=>{
 const a=await run(),b=await run('failed'),bad=await run('failed',4);for(const t of [425n,426n,1090n,1091n])expect(outputs(a,t)).toEqual(outputs(b,t));for(const out of outputs(b,1093n))expect(f(rec(out,1093n),4n)).toBe(false);expect(estimate(knowledge(b,1),false)).toEqual(list([]));expect(estimate(knowledge(bad,1),false)).toEqual(list([q(1,2)]));
});
it('an accidentally true lie remains contrary to mistaken speaker belief; unknown is not known false',async()=>{
 const a=await run('misleading'),honest=await run('misleading',1,1);expect(f(rec(outputs(a,1093n)[0],1093n),5n)).toEqual(list([false]));expect(f(rec(outputs(a,1094n)[0],1094n),3n)).toBe(false);expect(f(rec(outputs(honest,1093n)[0],1093n),5n)).toEqual(list([true]));
 expect(estimate(knowledge(await run('negative'),1),false)).toEqual(list([q(1,1)]));const unknown=await run('unknown');expect(estimate(knowledge(unknown,1),false)).toEqual(list([]));for(const v of outputs(unknown,1090n))expect(f(rec(v,1090n),5n)).toEqual(list([]));for(const v of outputs(unknown,1093n))expect(f(rec(v,1093n),4n)).toBe(false);
});
it('receipt need not achieve the intended belief: history resists and NoLearning admits without updating',async()=>{
 const a=await run('resistant'),last=await run('resistant',2),none=await run('resistant',5);expect(estimate(knowledge(a,1),false)).toEqual(list([q(2,3)]));expect(estimate(knowledge(last,1),true)).toEqual(list([q(0,1)]));expect(estimate(knowledge(none,1),false)).toEqual(list([]));expect(outputs(a,1085n)).toEqual(outputs(none,1085n));expect(f(rec(outputs(a,1090n)[2],1090n),5n)).toEqual(list([false]));
});
it('recipient learning affects only its own later probes',async()=>{
 const s=await run(),probes=outputs(s,1088n).map(v=>rec(v,1088n)),a=probes.filter(v=>key(f(v,3n))===key(HOLDERS[1])),b=probes.filter(v=>key(f(v,3n))===key(HOLDERS[2]));expect(f(a[0],5n)).toEqual(list([]));expect(f(a[1],5n)).toEqual(list([q(0,1)]));expect(f(b[1],5n)).toEqual(list([]));expect(f(b[2],5n)).toEqual(list([q(0,1)]));expect(f(a[3],5n)).toEqual(list([q(1,2)]));
});
it('checks actual phases, including independent intent, expression and updates',async()=>{
 const s=await run();for(const [type,phase] of [[1094n,0n],[1089n,40n],[403n,51n],[408n,52n],[409n,60n],[425n,70n],[426n,80n],[431n,90n],[432n,100n],[1093n,110n]]){const ts=s.r.snapshot().trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),type).length);expect(ts).toHaveLength(4);for(const t of ts)expect(f(rec(f(t,4n),130n),3n)).toEqual(u(phase));}
 for(const t of s.r.snapshot().trace.map(v=>rec(v,160n))){for(const out of records(items(f(t,13n),'list'),1095n)){const holder=f(rec(out,1095n),2n);expect(f(rec(f(t,4n),130n),3n)).toEqual(u(key(holder)===key(HOLDERS[0])?30:140));}}
});
it('preserves complete later safe views and exposes truth-defined and private-copy violations',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1,pressure=2)=>{const s=await setup(name,law,pressure),r=await createLyingRun(await prepareLyingModel(s.source),{initialState,orderedInputs:s.orderedInputs,runSeed:seed});while(await r.settleNextInstant()){}return [r.observerView(0),r.observerView(1)];};
 expect(await view('main')).toEqual(await view('hiddenTruth'));expect((await view('main'))[1]).toEqual((await view('noA'))[1]);expect((await view('main'))[0]).toEqual((await view('noB'))[0]);expect(await view('main',3)).not.toEqual(await view('hiddenTruth',3));expect(await view('failed',6)).not.toEqual(await view('failed'));
},30000);
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after both recipients acquired knowledge`,async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('lying fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
for(const stage of ['decision','execute','commit'])it(`rolls back contested draws at ${stage}`,async()=>{
 const s=await setup('main',1,3);await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('draw fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(after.randomAddresses).toEqual(before.randomAddresses);expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators'] as const)expect(after[k]).toEqual(before[k]);
});
it('rejects cross-holder writers, injected state, forged public handles and edited saves',async()=>{
 const s=await setup();expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(2),expected:{presence:false},newValue:emptyKnowledge()}]},owner('learn-a'),s.m.authority)).toThrow();await expect(compileLyingInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');
 const model=await prepareLyingModel(s.source),r=await createLyingRun(model,{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restoreLyingRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreLyingRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenTruth),save:r.save()})).rejects.toThrow();await expect(createLyingRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(2)).toThrow();
});
