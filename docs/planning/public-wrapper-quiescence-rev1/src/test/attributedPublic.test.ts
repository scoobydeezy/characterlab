import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as field,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {chosenData} from '../campaign2/cognitiveChoice';
import {compileAttributedModel,compileAttributedInputs,attributedRecipe,STAGES,eventId,path,owner,HOLDERS} from '../campaign3/attributedModel';
import {createAttributedRuntime} from '../campaign3/attributedRuntime';
import {emptyKnowledge,claim,attribution} from '../campaign3/attributedMath';
import {prepareAttributedModel,createAttributedRun,restoreAttributedRun} from '../campaign3/attributedFactory';
import {decodeAttributed as decode} from '../campaign3/attributedCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './attributedFixtures';
const f=(value:CanonicalValue,id:bigint)=>{if(typeof value==='boolean'||value.kind!=='record')throw Error('test requires record');return field(value,id);};
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,pressure=1){const source=attributedRecipe(law,pressure),m=await compileAttributedModel(source),orderedInputs=ordered(cases()[name]),i=await compileAttributedInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createAttributedRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,pressure=1){const s=await setup(name,law,pressure);while(await s.r.settle()){}return s;}
const outputs=(s:Awaited<ReturnType<typeof run>>,type:bigint)=>records(s.r.snapshot().outputs,type);
const knowledge=(s:Awaited<ReturnType<typeof run>>,i:number)=>s.r.snapshot().state.read(path(i)).value??emptyKnowledge(i);
const purposes=(s:Awaited<ReturnType<typeof run>>)=>outputs(s,1138n).map(x=>f(x,4n));
const probes=(s:Awaited<ReturnType<typeof run>>,i:number)=>outputs(s,1136n).filter(x=>key(f(x,3n))===key(HOLDERS[i]));
it('a mistaken person model changes actual communication while own belief and goals stay fixed',async()=>{
 const s=await run(),changed=await run('reportChange'),fixed=await run('failed'),fixedChanged=await run('reportChangeFixed');expect(knowledge(fixed,1)).toEqual(knowledge(fixedChanged,1));expect(purposes(fixed)).not.toEqual(purposes(fixedChanged));expect(purposes(s)).toEqual([u(2),u(2),u(1)]);expect(purposes(changed)).toEqual([u(1),u(1),u(1)]);
 expect(probes(s,0).map(x=>f(x,5n))).toEqual(probes(changed,0).map(x=>f(x,5n)));expect(probes(s,1).map(x=>f(x,5n))).toEqual(probes(changed,1).map(x=>f(x,5n)));
 expect(probes(s,0).map(x=>f(x,6n))).toEqual([u(3),u(3),u(2)]);expect(probes(s,2).map(x=>f(x,6n))).toEqual([u(2),u(2),u(2)]);expect(probes(s,1).map(x=>f(x,5n))).toEqual([list([false]),list([false]),list([false])]);
});
it('corrects later choice without rewriting prior intent; majority and latest remain serious alternatives',async()=>{
 const s=await run(),majority=await run('main',2);expect(purposes(majority)).toEqual([u(2),u(2),u(2)]);expect(attribution(knowledge(s,0),1)).toBe(2);expect(attribution(knowledge(majority,0),2)).toBe(3);expect(f(outputs(s,1138n)[0],5n)).toEqual(list([]));expect(f(outputs(s,1138n)[2],5n)).toEqual(list([true]));
});
it('unknown attribution is not known ignorance; absence does not add a report; NoPersonModel removes the operand',async()=>{
 const unknown=await run('unknown'),ignorant=await run('ignorance'),absent=await run('noNewReport'),noModel=await run('main',3);expect(attribution(knowledge(unknown,0),1)).toBe(0);expect(attribution(knowledge(ignorant,0),1)).toBe(1);expect(purposes(ignorant)).toEqual([u(1),u(1),u(1)]);expect(attribution(knowledge(absent,0),1)).toBe(3);expect(items(f(f(knowledge(absent,0),2n),4n),'list')).toHaveLength(1);expect(attribution(knowledge(noModel,0),3)).toBe(0);expect(unknown.r.snapshot().randomAddresses.length).toBeGreaterThan(0);expect(noModel.r.snapshot().randomAddresses.length).toBeGreaterThan(0);
});
it('failed or denied receipt preserves intent and does not make the speaker know delivery succeeded',async()=>{
 const s=await run(),failed=await run('failed'),denied=await run('deniedReceipt');for(const t of [425n,426n,1138n]){expect(outputs(s,t)).toEqual(outputs(failed,t));expect(outputs(s,t)).toEqual(outputs(denied,t));}expect(claim(knowledge(s,1))).toEqual(list([true]));expect(claim(knowledge(failed,1))).toEqual(list([false]));expect(claim(knowledge(denied,1))).toEqual(list([false]));expect(attribution(knowledge(s,0),1)).toBe(2);
});
it('unknown own belief cannot be asserted and known false can be communicated',async()=>{
 const unknown=await run('unknownOwn'),negative=await run('negativeOwn');expect(purposes(unknown)).toEqual([u(2),u(2),u(2)]);expect(outputs(negative,1138n).slice(0,2).map(x=>f(x,5n))).toEqual([list([false]),list([false])]);
});
it('preserves complete later speaker/other views under hidden truth, target state, receipt and irrelevant reports; Oracle fails',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1,pressure=1)=>{const source=attributedRecipe(law,pressure),r=await createAttributedRun(await prepareAttributedModel(source),{initialState,orderedInputs:ordered(cases()[name]),runSeed:seed});while(await r.settleNextInstant()){}return [r.observerView(0),r.observerView(1),r.observerView(2)];};
 for(const pressure of [1,3]){const base=await view('main',1,pressure);for(const name of ['hiddenTruth','hiddenTarget','targetAbsent','deniedReceipt','failed'] as const){const v=await view(name,1,pressure);expect(v[0]).toEqual(base[0]);expect(v[2]).toEqual(base[2]);}expect((await view('otherReport',1,pressure))[0]).toEqual(base[0]);}
 expect((await view('unknownOwn'))[0]).toEqual((await view('deniedOwnChange'))[0]);expect((await view('main',4))[0]).not.toEqual((await view('hiddenTarget',4))[0]);
},60000);
it('executes exact intent/expression phases and target learning only after current choice',async()=>{
 const s=await run();for(const [type,phase] of [[425n,70n],[426n,80n],[1141n,110n]] as const){const ts=s.r.snapshot().trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),type).length);expect(ts).toHaveLength(3);for(const t of ts)expect(f(rec(f(t,4n),130n),3n)).toEqual(u(phase));}expect(f(probes(s,1)[2],5n)).toEqual(list([false]));expect(claim(knowledge(s,1))).toEqual(list([true]));
});
it('retains actual equal-probability reason distributions and addressed draws under balanced relevance',async()=>{
 const s=await run('main',1,3);expect(s.r.snapshot().randomAddresses.length).toBeGreaterThan(0);for(const out of outputs(s,409n)){const d=chosenData(out);expect(items(f(d,9n),'list')).toHaveLength(2);for(const row of items(f(d,2n),'list'))expect(f(rec(row,421n),2n)).toEqual(q(1,2));}
});
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after acquired beliefs and person models`,async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('attributed fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
for(const stage of ['decision','execute','commit'])it(`rolls back contested draws at ${stage}`,async()=>{
 const s=await setup('main',1,3);await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('draw fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(after.randomAddresses).toEqual(before.randomAddresses);expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators'] as const)expect(after[k]).toEqual(before[k]);
});
it('rejects cross-holder writers, injected state, forged public handles and edited saves',async()=>{
 const s=await setup();expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(2),expected:{presence:false},newValue:emptyKnowledge()}]},owner('learn-speaker'),s.m.authority)).toThrow();await expect(compileAttributedInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');
 const model=await prepareAttributedModel(s.source),r=await createAttributedRun(model,{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restoreAttributedRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreAttributedRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenTruth),save:r.save()})).rejects.toThrow();await expect(createAttributedRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(3)).toThrow();
});
