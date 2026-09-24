import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileFamiliarityModel,compileFamiliarityInputs,familiarityRecipe,STAGES,eventId,path,owner} from '../campaign3/familiarityModel';
import {createFamiliarityRuntime} from '../campaign3/familiarityRuntime';
import {emptyMemory} from '../campaign3/familiarityMath';
import {prepareFamiliarityModel,createFamiliarityRun,restoreFamiliarityRun} from '../campaign3/familiarityFactory';
import {decodeFamiliarity as decode} from '../campaign3/familiarityCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './familiarityFixtures';
async function setup(name:keyof ReturnType<typeof cases>='main',law=1){const source=familiarityRecipe(law),m=await compileFamiliarityModel(source),orderedInputs=ordered(cases()[name]),i=await compileFamiliarityInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createFamiliarityRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1){const s=await setup(name,law);while(await s.r.settle()){}return s;}
const results=(s:Awaited<ReturnType<typeof run>>)=>records(s.r.snapshot().outputs,1062n).map(v=>rec(v,1062n));
const final=(s:Awaited<ReturnType<typeof run>>)=>results(s).at(-1)!;
it('recognizes familiar-but-different features after actual episodic detail loss for person and place displays',async()=>{
 for(const name of ['main','place'] as const){const s=await run(name),out=final(s);expect(f(out,4n)).toEqual(u(5));expect(f(out,5n)).toEqual(list([q(1,2)]));const c=rec(items(f(out,7n),'list')[0],1061n);expect(f(c,2n)).toEqual(u(1));expect(f(c,3n)).toEqual(u(1));expect(f(c,6n)).toEqual(list([]));
 const old=rec(items(f(rec(s.r.snapshot().state.read(path()).value!,1059n),1n),'list')[0],1058n);expect(f(old,6n)).toEqual(list([]));expect(f(rec(records(s.r.snapshot().outputs,1057n)[0],1057n),7n)).toEqual(list([true]));}
});
it('distinguishes identical, disjoint and other-category displays without making an identity claim',async()=>{
 expect(f(final(await run('same')),4n)).toEqual(u(4));expect(f(final(await run('novel')),4n)).toEqual(u(3));expect(f(final(await run('otherCategory')),4n)).toEqual(u(1));
 expect(f(final(await run('detailChanged')),5n)).toEqual(list([q(1,1)]));
});
it('preserves unknown, known false and incomplete feature coverage separately',async()=>{
 for(const name of ['noFeatures','unknownFeatures'] as const){const out=final(await run(name));expect(f(out,4n)).toEqual(u(2));expect(f(out,5n)).toEqual(list([]));}
 expect(f(final(await run('falseFeatures')),4n)).toEqual(u(4));const p=final(await run('partialKnown')),c=rec(items(f(p,7n),'list')[0],1061n);expect(f(p,4n)).toEqual(u(4));expect(f(c,4n)).toEqual(u(1));
 expect(f(final(await run('unknownFeatures',4)),4n)).toEqual(u(4));
});
it('keeps exact-only as a stricter alternative and demonstrates detail-dependent familiarity failure after loss',async()=>{
 expect(f(final(await run('main',2)),4n)).toEqual(u(3));expect(f(final(await run('same',2)),4n)).toEqual(u(4));expect(f(final(await run('main',3)),4n)).toEqual(u(2));expect(f(final(await run('recent',3)),4n)).toEqual(u(5));
});
it('retains tied matching sources without selecting a unique recognized individual',async()=>{
 const out=final(await run('tie'));expect(items(f(out,6n),'list')).toHaveLength(2);expect(items(f(out,7n),'list')).toHaveLength(2);expect(f(out,4n)).toEqual(u(5));
});
it('does not let a current display match itself, then admits it for the next encounter',async()=>{
 const a=await run('firstOnly');expect(f(final(a),4n)).toEqual(u(1));expect(f(final(a),7n)).toEqual(list([]));const b=await run('changing');expect(f(results(b)[2],4n)).toEqual(u(5));expect(f(final(b),4n)).toEqual(u(4));expect(f(final(b),5n)).toEqual(list([q(1,1)]));
});
it('executes materialization, observation, frozen comparison and consolidation at the exact accepted phases',async()=>{
 const s=await run();for(const [type,phase] of [[1064n,0n],[1057n,10n],[1067n,20n],[1062n,21n],[1063n,140n]]){const ts=s.r.snapshot().trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),type).length);expect(ts).toHaveLength(3);for(const t of ts)expect(f(rec(f(t,4n),130n),3n)).toEqual(u(phase));}
 const frozen=rec(records(s.r.snapshot().outputs,1067n)[2],1067n);expect(items(f(rec(f(frozen,3n),1059n),1n),'list')).toHaveLength(1);
});
it('preserves prior observations and results when a later encounter is appended',async()=>{
 const a=await run(),b=await run('changing');expect(b.r.snapshot().outputs.slice(0,a.r.snapshot().outputs.length)).toEqual(a.r.snapshot().outputs);
});
it('preserves full later public views across hidden identity and denied/absent displays; detects the identity oracle',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1)=>{const s=await setup(name,law),r=await createFamiliarityRun(await prepareFamiliarityModel(s.source),{initialState,orderedInputs:s.orderedInputs,runSeed:seed});while(await r.settleNextInstant()){}return r.observerView(0);};
 expect(await view('main')).toEqual(await view('hiddenIdentity'));expect(await view('deniedFirst')).toEqual(await view('absentFirst'));expect(await view('main',5)).not.toEqual(await view('hiddenIdentity',5));
},30000);
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} at the detail-loss instant`,async()=>{
 const s=await setup();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('familiarity fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
it('rejects foreign writers, injected state, wrong input bounds, forged handles and altered saves',async()=>{
 const s=await setup();expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(),expected:{presence:false},newValue:emptyMemory()}]},owner('recognize'),s.m.authority)).toThrow();
 await expect(compileFamiliarityInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');await expect(compileFamiliarityInputs(s.m,initialState,ordered([{at:1,identity:9}]),seed)).rejects.toThrow('SOURCE_BOUND');
 const model=await prepareFamiliarityModel(s.source),r=await createFamiliarityRun(model,{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restoreFamiliarityRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreFamiliarityRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenIdentity),save:r.save()})).rejects.toThrow();await expect(createFamiliarityRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(1)).toThrow();
});
