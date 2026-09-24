import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {chosenData} from '../campaign2/cognitiveChoice';
import {compileEmotionalDisplayModel,compileEmotionalDisplayInputs,emotionalDisplayRecipe,STAGES,eventId,path,owner,HOLDERS} from '../campaign3/emotionalDisplayModel';
import {createEmotionalDisplayRuntime} from '../campaign3/emotionalDisplayRuntime';
import {emptyKnowledge,estimate} from '../campaign3/emotionalDisplayMath';
import {prepareEmotionalDisplayModel,createEmotionalDisplayRun,restoreEmotionalDisplayRun} from '../campaign3/emotionalDisplayFactory';
import {decodeEmotionalDisplay as decode} from '../campaign3/emotionalDisplayCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './emotionalDisplayFixtures';
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,pressure=2,severity=2){const source=emotionalDisplayRecipe(law,pressure,severity),m=await compileEmotionalDisplayModel(source),orderedInputs=ordered(cases()[name]),i=await compileEmotionalDisplayInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createEmotionalDisplayRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,pressure=2,severity=2){const s=await setup(name,law,pressure,severity);while(await s.r.settle()){}return s;}
const outputs=(s:Awaited<ReturnType<typeof run>>,type:bigint)=>records(s.r.snapshot().outputs,type);
const knowledge=(s:Awaited<ReturnType<typeof run>>,i:number)=>s.r.snapshot().state.read(path(i)).value??emptyKnowledge();
it('keeps reassurance fixed while distress changes, and distress fixed while chosen content changes',async()=>{
 const a=await run(),calm=await run('calm'),disclose=await run('main',1,1);expect(f(rec(outputs(a,1113n)[0],1113n),8n)).toEqual(list([q(1,1),q(1,1)]));expect(f(rec(outputs(calm,1113n)[0],1113n),8n)).toEqual(list([q(0,1),q(0,1)]));expect(outputs(a,1113n)).toEqual(outputs(disclose,1113n));
 for(const s of [a,calm])expect(f(rec(outputs(s,1105n)[0],1105n),5n)).toEqual(list([false]));expect(f(rec(outputs(disclose,1105n)[0],1105n),5n)).toEqual(list([true]));expect(f(rec(outputs(a,1108n)[0],1108n),6n)).toEqual(list([q(1,1)]));
});
it('independently changes likelihood, severity, vulnerability and learned control while retaining exposure',async()=>{
 const s=await run('main',1,2,1),v=await run('reserve'),c=await run('control');expect(f(rec(outputs(s,1113n)[0],1113n),8n)).toEqual(list([q(1,2),q(1,2)]));expect(f(rec(outputs(v,1113n)[0],1113n),6n)).toEqual(list([q(0,1)]));expect(f(rec(outputs(c,1113n)[2],1113n),7n)).toEqual(list([q(1,1)]));expect(f(rec(outputs(c,1113n)[2],1113n),8n)).toEqual(list([q(1,1),q(0,1)]));
 for(const name of ['missingContext','unknownControl','unknown'] as const)for(const a of outputs(await run(name),1113n))expect(f(rec(a,1113n),8n)).toEqual(list([]));
},30000);
it('separates failed semantics, display failure, known zero and absent cue',async()=>{
 const a=await run(),failed=await run('failed'),no=await run('noDisplay'),calm=await run('calm');for(const t of [425n,426n,1105n])expect(outputs(a,t)).toEqual(outputs(failed,t));expect(estimate(knowledge(failed,1))).toEqual(list([]));expect(estimate(knowledge(failed,1),true)).toEqual(list([q(1,1)]));expect(estimate(knowledge(no,1),true)).toEqual(list([]));expect(estimate(knowledge(calm,1),true)).toEqual(list([q(0,1)]));
});
it('retains graded and threshold display alternatives and exposes private-copy and intent/display collapse',async()=>{
 const graded=await run('interior'),threshold=await run('interior',2),copy=await run('noChannels',4),intent=await run('main',5),none=await run('main',3);expect(f(rec(outputs(graded,1108n)[1],1108n),6n)).toEqual(list([q(1,4)]));expect(f(rec(outputs(threshold,1108n)[1],1108n),6n)).toEqual(list([q(0,1)]));expect(estimate(knowledge(copy,1),true)).toEqual(list([q(1,1)]));expect(estimate(knowledge(intent,1),true)).toEqual(list([q(0,1)]));expect(estimate(knowledge(none,1),true)).toEqual(list([]));
});
it('selective channels support different recipient evidence and NoLearning prevents belief updates',async()=>{
 const split=await run('split'),a=await run(),none=await run('main',6);expect(estimate(knowledge(split,1))).toEqual(list([q(0,1)]));expect(estimate(knowledge(split,1),true)).toEqual(list([]));expect(estimate(knowledge(split,2))).toEqual(list([]));expect(estimate(knowledge(split,2),true)).toEqual(list([q(1,1)]));expect(outputs(a,1100n)).toEqual(outputs(none,1100n));expect(estimate(knowledge(none,1),true)).toEqual(list([]));
});
it('retains contested choices and updates only later probes',async()=>{
 const s=await run('main',1,3);expect(s.r.snapshot().randomAddresses.length).toBeGreaterThan(0);for(const out of outputs(s,409n)){const d=chosenData(out);expect(items(f(d,9n),'list')).toHaveLength(2);for(const row of items(f(d,2n),'list'))expect(f(rec(row,421n),2n)).toEqual(q(1,2));}
 const a=outputs(s,1103n).map(x=>rec(x,1103n)).filter(x=>key(f(x,3n))===key(HOLDERS[1]));expect(f(a[0],6n)).toEqual(list([]));expect(f(a[1],6n)).toEqual(list([q(1,1)]));
});
it('checks actual appraisal, intent, expression, execution and learning phases',async()=>{
 const s=await run();for(const [type,phase] of [[1113n,50n],[425n,70n],[426n,80n],[1108n,110n]]){const ts=s.r.snapshot().trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),type).length);expect(ts).toHaveLength(4);for(const t of ts)expect(f(rec(f(t,4n),130n),3n)).toEqual(u(phase));}
 for(const t of s.r.snapshot().trace.map(v=>rec(v,160n)))for(const v of records(items(f(t,13n),'list'),1110n))expect(f(rec(f(t,4n),130n),3n)).toEqual(u(key(f(rec(v,1110n),2n))===key(HOLDERS[0])?30:140));
});
it('preserves full later safe views under hidden truth, denied private evidence and nonrecipient changes',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>)=>{const s=await setup(name),r=await createEmotionalDisplayRun(await prepareEmotionalDisplayModel(s.source),{initialState,orderedInputs:s.orderedInputs,runSeed:seed});while(await r.settleNextInstant()){}return [r.observerView(0),r.observerView(1)];};expect(await view('main')).toEqual(await view('hiddenTruth'));expect(await view('unknown')).toEqual(await view('deniedChange'));expect((await view('main'))[1]).toEqual((await view('noA'))[1]);expect((await view('main'))[0]).toEqual((await view('noB'))[0]);
},30000);
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after both recipients acquired knowledge`,async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('emotionalDisplay fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
for(const stage of ['decision','execute','commit'])it(`rolls back contested draws at ${stage}`,async()=>{
 const s=await setup('main',1,3);await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('draw fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(after.randomAddresses).toEqual(before.randomAddresses);expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators'] as const)expect(after[k]).toEqual(before[k]);
});
it('rejects cross-holder writers, injected state, forged public handles and edited saves',async()=>{
 const s=await setup();expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(2),expected:{presence:false},newValue:emptyKnowledge()}]},owner('learn-a'),s.m.authority)).toThrow();await expect(compileEmotionalDisplayInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');
 const model=await prepareEmotionalDisplayModel(s.source),r=await createEmotionalDisplayRun(model,{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restoreEmotionalDisplayRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreEmotionalDisplayRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenTruth),save:r.save()})).rejects.toThrow();await expect(createEmotionalDisplayRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(2)).toThrow();
});
