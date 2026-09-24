import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileRecollectionModel,compileRecollectionInputs,recollectionRecipe,STAGES,eventId,path,owner} from '../campaign3/recollectionModel';
import {createRecollectionRuntime} from '../campaign3/recollectionRuntime';
import {emptyMemory} from '../campaign3/recollectionMath';
import {prepareRecollectionModel,createRecollectionRun,restoreRecollectionRun} from '../campaign3/recollectionFactory';
import {decodeRecollection as decode} from '../campaign3/recollectionCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './recollectionFixtures';
async function setup(name:keyof ReturnType<typeof cases>='main',law=1){const source=recollectionRecipe(law),m=await compileRecollectionModel(source),orderedInputs=ordered(cases()[name]),i=await compileRecollectionInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createRecollectionRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1){const s=await setup(name,law);while(await s.r.settle()){}return s;}
const recalls=(s:Awaited<ReturnType<typeof run>>)=>records(s.r.snapshot().outputs,1049n).map(v=>rec(v,1049n));
const final=(s:Awaited<ReturnType<typeof run>>)=>recalls(s).at(-1)!;
it('loses real detail while preserving encoded observation and a separately tagged wrong reconstruction',async()=>{
 const s=await run(),out=recalls(s);expect(f(out[3],4n)).toEqual(u(1));expect(f(out[3],6n)).toEqual(list([true]));expect(f(out[5],4n)).toEqual(u(3));expect(f(out[5],6n)).toEqual(list([false]));
 const fragments=items(f(rec(s.r.snapshot().state.read(path(1045)).value!,1044n),1n),'list');expect(f(rec(fragments[2],1043n),5n)).toEqual(list([]));
 const observation=rec(records(s.r.snapshot().outputs,1042n)[2],1042n);expect(f(observation,6n)).toEqual(list([true]));expect(f(final(s),7n)).toEqual(list([f(observation,1n)]));expect(items(f(final(s),8n),'list')).toHaveLength(3);
});
it('retains detail before the age-boundary consolidation and only changes later recall',async()=>{
 const s=await run(),xs=recalls(s);expect(f(xs[4],6n)).toEqual(list([true]));expect(f(xs[5],6n)).toEqual(list([false]));
 for(const [type,phase] of [[1049n,40n],[1052n,110n],[1042n,120n],[1050n,140n],[1051n,140n]])for(const trace of s.r.snapshot().trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),type).length))expect(f(rec(f(trace,4n),130n),3n)).toEqual(u(phase));
 expect(f(recalls(await run('sameInstant'))[2],4n)).toEqual(u(0));
});
it('keeps FragmentOnly and KeepDetail as serious alternatives',async()=>{
 const fragment=await run('main',2),full=await run('main',3);expect(f(final(fragment),4n)).toEqual(u(2));expect(f(final(fragment),6n)).toEqual(list([]));expect(f(final(full),4n)).toEqual(u(1));expect(f(final(full),6n)).toEqual(list([true]));
});
it('uses new admitted category evidence without rewriting the target fragment or earlier recollections',async()=>{
 const a=await run(),b=await run('newRegularity');expect(f(recalls(b)[5],6n)).toEqual(list([false]));expect(f(final(b),6n)).toEqual(list([true]));
 const fragments=(s:typeof a)=>items(f(rec(s.r.snapshot().state.read(path(1045)).value!,1044n),1n),'list');expect(fragments(a)[2]).toEqual(fragments(b)[2]);
 expect(recalls(a).slice(0,6)).toEqual(recalls(b).slice(0,6));
});
it('does not treat ties or missing details as known false, or cue labels as observed episodes',async()=>{
 for(const name of ['tie','allUnknown'] as const){const s=await run(name);expect(f(final(s),4n)).toEqual(u(2));expect(f(final(s),6n)).toEqual(list([]));}
 expect(f(final(await run('knownFalse')),6n)).toEqual(list([false]));
 for(const name of ['unseen','unknownEpisode'] as const)expect(f(final(await run(name)),4n)).toEqual(u(0));
 const missing=await run('missingDetail');expect(f(recalls(missing)[3],4n)).toEqual(u(3));expect(f(rec(records(missing.r.snapshot().outputs,1042n)[2],1042n),6n)).toEqual(list([]));
});
it('keeps category defaults local and known episode detail stronger than the default',async()=>{
 expect(f(final(await run('otherCategory')),6n)).toEqual(list([true]));const s=await run();expect(f(recalls(s)[3],6n)).toEqual(list([true]));
});
it('never learns again from recall and leaves acquired summary counts unchanged across probes',async()=>{
 const a=await run(),b=await run('noQueries');expect(a.r.snapshot().state.canonicalValue()).toEqual(b.r.snapshot().state.canonicalValue());
 const updates=records(a.r.snapshot().outputs,1051n).map(v=>rec(v,1051n));for(const out of updates.slice(3))expect(f(out,2n)).toEqual(f(out,3n));
});
it('exposes the provenance failure when a reconstructed guess is reencoded as remembered fact',async()=>{
 const a=await run('main',5);expect(f(recalls(a)[5],4n)).toEqual(u(3));expect(f(recalls(a)[6],4n)).toEqual(u(1));expect(f(recalls(a)[6],6n)).toEqual(list([false]));
 expect(records(a.r.snapshot().outputs,1042n)).toEqual(records((await run()).r.snapshot().outputs,1042n));
});
it('preserves full later observer views under hidden/denied sources and detects the truth-restoring oracle',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1)=>{const s=await setup(name,law),r=await createRecollectionRun(await prepareRecollectionModel(s.source),{initialState,orderedInputs:s.orderedInputs,runSeed:seed});while(await r.settleNextInstant()){}return r.observerView(0);};
 for(const [a,b] of [['main','hiddenTruth'],['denied','absent'],['main','falseDisplay']] as const)expect(await view(a)).toEqual(await view(b));
 expect(await view('main',4)).not.toEqual(await view('hiddenTruth',4));
},30000);
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} with acquired memory and summary`,async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;
 await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('recollection fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
it('rejects foreign writes, duplicate labels, injected state, altered saves and forged handles',async()=>{
 const s=await setup();expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(1045),expected:{presence:false},newValue:emptyMemory()}]},owner('recall'),s.m.authority)).toThrow();
 await expect(compileRecollectionInputs(s.m,initialState,ordered([{at:1,label:1},{at:2,label:1}]),seed)).rejects.toThrow('LABEL');await expect(compileRecollectionInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');
 const model=await prepareRecollectionModel(s.source),r=await createRecollectionRun(model,{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restoreRecollectionRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreRecollectionRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenTruth),save:r.save()})).rejects.toThrow();await expect(createRecollectionRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(1)).toThrow();
});
