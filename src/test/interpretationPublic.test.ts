import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {chosenData} from '../campaign2/cognitiveChoice';
import {compileInterpretationModel,compileInterpretationInputs,interpretationRecipe,STAGES,eventId,path,owner,HOLDERS} from '../campaign3/interpretationModel';
import {createInterpretationRuntime} from '../campaign3/interpretationRuntime';
import {emptyKnowledge,estimate} from '../campaign3/interpretationMath';
import {prepareInterpretationModel,createInterpretationRun,restoreInterpretationRun} from '../campaign3/interpretationFactory';
import {decodeInterpretation as decode} from '../campaign3/interpretationCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './interpretationFixtures';
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,pressure=1){const source=interpretationRecipe(law,pressure),m=await compileInterpretationModel(source),orderedInputs=ordered(cases()[name]),i=await compileInterpretationInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createInterpretationRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,pressure=1){const s=await setup(name,law,pressure);while(await s.r.settle()){}return s;}
const outputs=(s:Awaited<ReturnType<typeof run>>,type:bigint)=>records(s.r.snapshot().outputs,type);
const knowledge=(s:Awaited<ReturnType<typeof run>>,i:number)=>s.r.snapshot().state.read(path(i)).value??emptyKnowledge();
const meanings=(s:Awaited<ReturnType<typeof run>>,i:number)=>outputs(s,1130n).map(x=>rec(x,1130n)).filter(x=>key(f(rec(f(x,2n),1129n),2n))===key(HOLDERS[i]));
it('separates intended explanation, produced glyph, perception, interpretation and recipient belief',async()=>{
 const s=await run();for(const x of outputs(s,1124n))expect(f(rec(x,1124n),5n)).toEqual(list([u(1)]));expect(f(rec(outputs(s,1121n)[0],1121n),5n)).toEqual(list([true]));expect(f(meanings(s,1)[0],3n)).toEqual(list([true]));expect(f(meanings(s,2)[0],3n)).toEqual(list([false]));expect(estimate(knowledge(s,1))).toEqual(list([q(2,3)]));expect(estimate(knowledge(s,2))).toEqual(list([q(1,3)]));
});
it('later context corrects interpretation without rewriting the original misunderstanding; literal decoding is a serious alternative',async()=>{
 const s=await run(),literal=await run('main',2);expect(f(meanings(s,2)[0],3n)).toEqual(list([false]));expect(f(meanings(s,2)[1],3n)).toEqual(list([true]));expect(f(meanings(s,1)[2],3n)).toEqual(list([false]));expect(f(meanings(literal,1)[2],3n)).toEqual(list([true]));expect(outputs(s,1129n)).toEqual(outputs(literal,1129n));
});
it('unknown meaning retains the signal and differs from known false and absent private belief',async()=>{
 const unknown=await run('unknownContext'),negative=await run('negative'),blind=await run('unknownBelief');expect(estimate(knowledge(unknown,1))).toEqual(list([]));expect(items(f(rec(knowledge(unknown,1),1117n),1n),'list')).toHaveLength(3);expect(estimate(knowledge(negative,1))).toEqual(list([q(0,1)]));expect(estimate(knowledge(blind,1))).toEqual(list([]));expect(items(f(rec(knowledge(blind,1),1117n),1n),'list')).toHaveLength(0);
});
it('withholding, failed production and denied receipt do not fabricate meanings; an honest error is not misunderstanding',async()=>{
 const s=await run(),failed=await run('failed'),hidden=await run('main',1,2),unknown=await run('unknownSpeaker'),mistaken=await run('misleading');for(const t of [425n,426n,1121n])expect(outputs(s,t)).toEqual(outputs(failed,t));for(const x of [failed,hidden,unknown])expect(estimate(knowledge(x,1))).toEqual(list([]));expect(f(rec(outputs(mistaken,1121n)[0],1121n),5n)).toEqual(f(meanings(mistaken,1)[0],3n));expect(f(rec(outputs(mistaken,1125n)[0],1125n),3n)).toBe(true);expect(estimate(knowledge(mistaken,1))).toEqual(list([q(0,1)]));
});
it('distinguishes interpreting, retaining and accumulating meanings',async()=>{
 const a=await run(),last=await run('main',5),noLearn=await run('main',4),noInterpret=await run('main',6);expect(outputs(a,1130n)).toEqual(outputs(noLearn,1130n));expect(estimate(knowledge(last,1),true)).toEqual(list([q(0,1)]));expect(estimate(knowledge(noLearn,1))).toEqual(list([]));expect(estimate(knowledge(noInterpret,1))).toEqual(list([]));expect(items(f(rec(knowledge(noInterpret,1),1117n),1n),'list')).toHaveLength(3);
});
it('does not grant private intention from equal raw glyph/context; IntentOracle violates this',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1,pressure=1)=>{const s=await setup(name,law,pressure),r=await createInterpretationRun(await prepareInterpretationModel(s.source),{initialState,orderedInputs:s.orderedInputs,runSeed:seed});while(await r.settleNextInstant()){}return [r.observerView(0),r.observerView(1)];};expect(await view('main')).toEqual(await view('hiddenIntent'));expect(await view('main')).toEqual(await view('hiddenTruth'));expect(await view('main',3)).not.toEqual(await view('hiddenIntent',3));expect((await view('main'))[1]).toEqual((await view('noA'))[1]);expect((await view('main'))[0]).toEqual((await view('noB'))[0]);
},30000);
it('uses actual perception120, interpretation130 and learning140; probes read earlier meanings',async()=>{
 const s=await run();for(const [type,phase,count] of [[425n,70n,3],[426n,80n,3],[1124n,110n,3],[1129n,120n,6],[1130n,130n,6]] as const){const ts=s.r.snapshot().trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),type).length);expect(ts).toHaveLength(count);for(const t of ts)expect(f(rec(f(t,4n),130n),3n)).toEqual(u(phase));}
 const b=outputs(s,1119n).map(x=>rec(x,1119n)).filter(x=>key(f(x,3n))===key(HOLDERS[2]));expect(f(b[0],5n)).toEqual(list([]));expect(f(b[1],5n)).toEqual(list([q(0,1)]));expect(f(b[2],5n)).toEqual(list([q(1,2)]));
});
it('retains genuine contested reason distributions and addressed draw records',async()=>{
 const s=await run('main',1,3);expect(s.r.snapshot().randomAddresses.length).toBeGreaterThan(0);for(const out of outputs(s,409n)){const d=chosenData(out);expect(items(f(d,9n),'list')).toHaveLength(2);for(const row of items(f(d,2n),'list'))expect(f(rec(row,421n),2n)).toEqual(q(1,2));}
});
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after both recipients acquired knowledge`,async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('interpretation fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
for(const stage of ['decision','execute','commit'])it(`rolls back contested draws at ${stage}`,async()=>{
 const s=await setup('main',1,3);await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('draw fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(after.randomAddresses).toEqual(before.randomAddresses);expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators'] as const)expect(after[k]).toEqual(before[k]);
});
it('rejects cross-holder writers, injected state, forged public handles and edited saves',async()=>{
 const s=await setup();expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(2),expected:{presence:false},newValue:emptyKnowledge()}]},owner('learn-a'),s.m.authority)).toThrow();await expect(compileInterpretationInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');
 const model=await prepareInterpretationModel(s.source),r=await createInterpretationRun(model,{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restoreInterpretationRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreInterpretationRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenTruth),save:r.save()})).rejects.toThrow();await expect(createInterpretationRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(2)).toThrow();
});
