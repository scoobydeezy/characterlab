import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {chosenData} from '../campaign2/cognitiveChoice';
import {compileCommunicationModel,compileCommunicationInputs,communicationRecipe,STAGES,eventId,path,owner,HOLDERS} from '../campaign3/communicationModel';
import {createCommunicationRuntime} from '../campaign3/communicationRuntime';
import {emptyKnowledge,estimate} from '../campaign3/communicationMath';
import {prepareCommunicationModel,createCommunicationRun,restoreCommunicationRun} from '../campaign3/communicationFactory';
import {decodeCommunication as decode} from '../campaign3/communicationCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './communicationFixtures';
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,pressure=1){const source=communicationRecipe(law,pressure),m=await compileCommunicationModel(source),orderedInputs=ordered(cases()[name]),i=await compileCommunicationInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createCommunicationRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,pressure=1){const s=await setup(name,law,pressure);while(await s.r.settle()){}return s;}
const outputs=(s:Awaited<ReturnType<typeof run>>,type:bigint)=>records(s.r.snapshot().outputs,type);
const knowledge=(s:Awaited<ReturnType<typeof run>>,i:number)=>s.r.snapshot().state.read(path(i)).value??emptyKnowledge();
it('actually chooses disclose or conceal under opposing motive interventions while preserving speaker knowledge',async()=>{
 const a=await run(),b=await run('main',1,2);for(const x of outputs(a,1078n))expect(f(rec(x,1078n),3n)).toEqual(u(1));for(const x of outputs(b,1078n))expect(f(rec(x,1078n),3n)).toEqual(u(2));
 expect(knowledge(a,0)).toEqual(knowledge(b,0));expect(estimate(knowledge(a,1),false)).toEqual(list([q(1,2)]));expect(estimate(knowledge(b,1),false)).toEqual(list([]));expect(outputs(a,426n)).toHaveLength(4);expect(outputs(b,426n)).toHaveLength(4);
});
it('retains exact contested arbitration and a real committed draw ledger without choosing a seed for an outcome',async()=>{
 const s=await run('main',1,3);expect(s.r.snapshot().randomAddresses.length).toBeGreaterThan(0);for(const out of outputs(s,409n)){const data=chosenData(out);expect(items(f(data,9n),'list')).toHaveLength(2);for(const row of items(f(data,2n),'list'))expect(f(rec(row,421n),2n)).toEqual(q(1,2));}
});
it('preserves intent and expression when an attempted disclosure fails and exposes intent-as-delivery',async()=>{
 const a=await run(),b=await run('failed'),bad=await run('failed',4);expect(outputs(a,425n)).toEqual(outputs(b,425n));expect(outputs(a,426n)).toEqual(outputs(b,426n));for(const out of outputs(b,1078n))expect(f(rec(out,1078n),4n)).toBe(false);
 expect(estimate(knowledge(b,1),false)).toEqual(list([]));expect(estimate(knowledge(bad,1),false)).toEqual(list([q(1,2)]));
});
it('keeps honest but inaccurate disclosure separate from world truth and negative knowledge separate from absence',async()=>{
 const a=await run('misleading');expect(f(rec(outputs(a,1078n)[0],1078n),5n)).toEqual(list([true]));expect(f(rec(outputs(a,1079n)[0],1079n),3n)).toBe(false);expect(estimate(knowledge(a,1),false)).toEqual(list([q(1,1)]));
 expect(estimate(knowledge(await run('negative'),1),false)).toEqual(list([q(0,1)]));expect(estimate(knowledge(await run('unknown'),1),false)).toEqual(list([]));
});
it('keeps EvidenceMean, LastReceipt and NoLearning separate while admitting the same assertions',async()=>{
 const a=await run(),last=await run('main',2),none=await run('main',5);expect(estimate(knowledge(a,1),false)).toEqual(list([q(1,2)]));expect(estimate(knowledge(last,1),true)).toEqual(list([q(0,1)]));expect(estimate(knowledge(none,1),false)).toEqual(list([]));expect(outputs(a,1070n)).toEqual(outputs(none,1070n));
});
it('updates only the receiving holder and only later recipient probes',async()=>{
 const s=await run(),probes=outputs(s,1073n).map(v=>rec(v,1073n)),a=probes.filter(v=>key(f(v,3n))===key(HOLDERS[1])),b=probes.filter(v=>key(f(v,3n))===key(HOLDERS[2]));
 expect(f(a[0],5n)).toEqual(list([]));expect(f(a[1],5n)).toEqual(list([q(1,1)]));expect(f(b[1],5n)).toEqual(list([]));expect(f(b[2],5n)).toEqual(list([q(1,1)]));expect(f(a[3],5n)).toEqual(list([q(1,2)]));
});
it('checks actual stage phases including distinct intent, expression, execution and recipient learning',async()=>{
 const s=await run();for(const [type,phase] of [[1079n,0n],[1074n,40n],[403n,51n],[408n,52n],[409n,60n],[425n,70n],[426n,80n],[431n,90n],[432n,100n],[1078n,110n]]){const ts=s.r.snapshot().trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),type).length);expect(ts).toHaveLength(4);for(const t of ts)expect(f(rec(f(t,4n),130n),3n)).toEqual(u(phase));}
 for(const t of s.r.snapshot().trace.map(v=>rec(v,160n))){for(const out of records(items(f(t,13n),'list'),1080n)){const holder=f(rec(out,1080n),2n);expect(f(rec(f(t,4n),130n),3n)).toEqual(u(key(holder)===key(HOLDERS[0])?30:140));}}
});
it('preserves whole later recipient views under hidden truth, concealment and nonrecipient interventions',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1,pressure=1)=>{const s=await setup(name,law,pressure),r=await createCommunicationRun(await prepareCommunicationModel(s.source),{initialState,orderedInputs:s.orderedInputs,runSeed:seed});while(await r.settleNextInstant()){}return [r.observerView(0),r.observerView(1)];};
 expect(await view('main')).toEqual(await view('hiddenTruth'));expect(await view('main',1,2)).toEqual(await view('concealedChange',1,2));expect((await view('main'))[1]).toEqual((await view('noA'))[1]);expect((await view('main'))[0]).toEqual((await view('noB'))[0]);expect(await view('main',3,2)).not.toEqual(await view('concealedChange',3,2));
},30000);
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after both recipients acquired knowledge`,async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('communication fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
for(const stage of ['decision','execute','commit'])it(`rolls back contested draws at ${stage}`,async()=>{
 const s=await setup('main',1,3);await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('draw fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(after.randomAddresses).toEqual(before.randomAddresses);expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators'] as const)expect(after[k]).toEqual(before[k]);
});
it('rejects cross-holder writers, injected state, forged public handles and edited saves',async()=>{
 const s=await setup();expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(2),expected:{presence:false},newValue:emptyKnowledge()}]},owner('learn-a'),s.m.authority)).toThrow();await expect(compileCommunicationInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');
 const model=await prepareCommunicationModel(s.source),r=await createCommunicationRun(model,{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restoreCommunicationRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreCommunicationRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenTruth),save:r.save()})).rejects.toThrow();await expect(createCommunicationRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(2)).toThrow();
});
