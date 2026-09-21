import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,rational as q,unsigned as u,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {readQ,ONE,ZERO} from '../campaign2/cognitiveMath';
import {decisionRecord as r,decodeDecision as decode} from '../campaign3/decisionCodecs';
import {compileDecisionModel,compileDecisionInputs,decisionRecipe,eventId,STAGES,historyPath,sid} from '../campaign3/decisionModel';
import {createDecisionRuntime} from '../campaign3/decisionRuntime';
import {decisionCharacterView,decisionDraws} from '../campaign3/decisionMath';
import {prepareDecisionModel,createDecisionRun,restoreDecisionRun} from '../campaign3/decisionFactory';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {decodeReason} from '../campaign3/reasonCodecs';
import {runCase,records,initialState,seed,original,ordered} from './decisionFixtures';

it('executes the three exact mode regimes and normalized independent reason distributions',async()=>{
 for(const regime of [1,2,3]){const x=await runCase(`r${regime}-s0-allowed`),d=records(x.outputs,935n)[0];expect(f(d,12n)).toEqual(u(regime));expect(items(f(d,6n),'list').reduce((s,v)=>s.add(readQ(f(rec(v,421n),2n))),ZERO).equals(ONE)).toBe(true);const context=rec(f(d,3n),408n);expect(items(f(context,3n),'list')).toHaveLength(2);expect(records(x.outputs,945n)).toHaveLength(1);expect(records(x.outputs,941n)).toHaveLength(1);}
});
it('significance changes player presentation while retaining authoritative draws and selected intent',async()=>{
 for(const s of [0,1,2,3]){const low=await runCase(`r2-s${s}-allowed`),high=await runCase(`r3-s${s}-allowed`),a=records(low.outputs,935n)[0],b=records(high.outputs,935n)[0];expect(decisionDraws(a)).toEqual(decisionDraws(b));expect(f(a,5n)).toEqual(f(b,5n));expect(f(a,6n)).toEqual(f(b,6n));expect(records(low.outputs,949n)).toHaveLength(0);const display=records(high.outputs,949n)[0];expect(f(display,1n)).toEqual(f(b,5n));const faces=items(f(display,2n),'list').map(v=>rec(v,950n)),draws=items(f(b,13n),'list').map(v=>rec(v,422n));expect(faces).toHaveLength(2);faces.forEach((v,i)=>expect([f(v,5n),f(v,6n)]).toEqual([f(draws[i],6n),f(draws[i],7n)]));}
});
it('freezes pre-attempt intent and expression through prevention then records only the admitted consequence',async()=>{
 const a=await runCase(),b=await runCase('r3-s0-blocked');expect(records(a.outputs,936n)).toEqual(records(b.outputs,936n));expect(records(a.outputs,937n)).toEqual(records(b.outputs,937n));expect(records(a.outputs,940n)).not.toEqual(records(b.outputs,940n));const ea=records(a.outputs,945n)[0],eb=records(b.outputs,945n)[0];expect(f(ea,2n)).toEqual(f(eb,2n));expect(f(rec(f(ea,3n),941n),4n)).toBe(true);expect(f(rec(f(eb,3n),941n),4n)).toBe(false);expect(ea.fields.has(4n)).toBe(true);expect(eb.fields.has(4n)).toBe(true);
});
it('discriminates all five mandatory alternatives without changing their admitted raw evidence',async()=>{
 const a=await runCase();for(const law of [2,3,4,5,6]){const b=await runCase('r3-s0-allowed',law);expect(records(a.outputs,933n)).toEqual(records(b.outputs,933n));expect(records(a.outputs,403n)).toEqual(records(b.outputs,403n));expect(records(a.outputs,408n)).toEqual(records(b.outputs,408n));}
 expect(decisionDraws(records((await runCase('r1-s0-allowed',2)).outputs,935n)[0]).length).toBeGreaterThan(0);expect(f(records((await runCase('r2-s0-allowed',3)).outputs,935n)[0],12n)).toEqual(u(1));let differences=0;
 for(const s of [0,1,2,3]){const baseline=records((await runCase(`r3-s${s}-allowed`)).outputs,935n)[0],decorative=records((await runCase(`r3-s${s}-allowed`,4)).outputs,935n)[0];expect(decisionDraws(baseline)).toEqual(decisionDraws(decorative));if(key(f(baseline,5n))!==key(f(decorative,5n)))differences++;}expect(differences).toBeGreaterThan(0);
 const opaque=await runCase('r3-s0-allowed',5);expect(items(f(records(opaque.outputs,949n)[0],2n),'list')).toHaveLength(0);expect(decisionDraws(records(opaque.outputs,935n)[0])).toHaveLength(1);expect(records((await runCase('r3-s0-blocked',6)).outputs,945n)[0].fields.has(2n)).toBe(false);
},60000);
it('keeps hidden truth and invisible outcomes out of character history and rejects unknown view outputs',async()=>{
 const a=await runCase(),hidden=await runCase('hidden');expect(a.run.snapshot().outputs).toEqual(hidden.run.snapshot().outputs);expect(a.run.snapshot().state).toEqual(hidden.run.snapshot().state);expect(a.run.snapshot().trace).not.toEqual(hidden.run.snapshot().trace);
 for(const law of [1,6]){const allowed=await runCase('invisibleAllowed',law),blocked=await runCase('invisibleBlocked',law);expect(allowed.run.characterView()).toEqual(blocked.run.characterView());expect(allowed.run.snapshot().state).toEqual(blocked.run.snapshot().state);expect(records(blocked.outputs,941n)).toHaveLength(0);expect(records(blocked.outputs,945n)[0].fields.has(2n)).toBe(true);}
 expect(()=>decisionCharacterView([original(1)])).toThrow('OUTPUT_ROSTER');expect(()=>decisionCharacterView([q(0,1)])).toThrow('OUTPUT_ROSTER');
 const view=decode(a.run.characterView()),types:bigint[]=[];const walk=(v:CanonicalValue):void=>{if(typeof v==='boolean')return;if(v.kind==='record'){types.push(v.schema.typeId);v.fields.forEach(walk);}else if(v.kind==='list'||v.kind==='set')v.items.forEach(walk);else if(v.kind==='map')v.entries.forEach(([k,x])=>{walk(k);walk(x);});};walk(view);for(const id of [110n,411n,422n,932n,935n,940n])expect(types).not.toContain(id);
});
it('distinguishes absent situation evidence from an observed zero and preserves historical snapshots',async()=>{
 const a=await runCase('denied'),zero=await runCase('r2-s0-allowed');expect(records(a.outputs,933n)).toHaveLength(0);expect(records(zero.outputs,933n)).toHaveLength(2);expect(records(a.outputs,934n)[0].fields.has(3n)).toBe(false);expect(records(a.outputs,403n)).not.toEqual(records(zero.outputs,403n));expect(f(records(a.outputs,935n)[0],12n)).toEqual(u(2));
 const x=await runCase('continued'),applications=records(x.outputs,948n),first=f(rec(f(applications[0],3n),951n),1n);expect(items(f(rec(f(applications[2],3n),951n),1n),'list')[0]).toEqual(items(first,'list')[0]);expect(items(f(rec(f(applications[2],3n),951n),1n),'list')).toHaveLength(3);
});
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back actual ${stage} work including state, outputs, allocations and random addresses`,async()=>{
 const m=await compileDecisionModel(decisionRecipe()),input=await compileDecisionInputs(m,initialState,ordered([original(1),original(2)]),seed()),runtime=createDecisionRuntime(m,input);await runtime.settle();const before=runtime.snapshot();let reached=false;
 await expect(runtime.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('decision fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=runtime.snapshot();expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(after.queue).toEqual(before.queue);expect(after.allocators).toEqual(before.allocators);expect(after.outputs).toEqual(before.outputs);expect(after.trace).toEqual(before.trace);expect(after.randomAddresses).toEqual(before.randomAddresses);expect(()=>runtime.save()).toThrow('active quiescent');
},30000);
it('rejects altered model, invalid input, foreign codec and unrelated history writer',async()=>{
 const source=decisionRecipe(),model=await prepareDecisionModel(source);await expect(createDecisionRun(model,{initialState:enc(list([])),orderedInputs:ordered([]),runSeed:seed()})).rejects.toThrow('INITIAL_STATE');await expect(createDecisionRun(model,{initialState,orderedInputs:ordered([original(2),original(1)]),runSeed:seed()})).rejects.toThrow('TIME');expect(()=>decodeReason(enc(original(1)))).toThrow();const fields=new Map(rec(decode(source.parameters),930n).fields);fields.set(1n,{kind:'text',value:'other'});await expect(prepareDecisionModel({...source,parameters:enc(r(930,fields))})).rejects.toThrow('EXACT_MODEL');
 const compiled=await compileDecisionModel(source);expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:historyPath,expected:{presence:false},newValue:r(951,[list([])])}]},sid(1025,'authority/perception'),compiled.authority)).toThrow();
});
it('restores exact continuing RNG/history and rejects tampered saved ledger or originals',async()=>{
 const x=await runCase('continued'),restored=await restoreDecisionRun(x.source,{initialState,orderedInputs:x.orderedInputs,save:x.run.save()});expect(restored.save()).toEqual(x.run.save());const save=rec(decode(x.run.save()),132n),fields=new Map(save.fields);expect(items(f(save,10n),'list').length).toBeGreaterThan(0);fields.set(10n,list([]));await expect(restoreDecisionRun(x.source,{initialState,orderedInputs:x.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreDecisionRun(x.source,{initialState,orderedInputs:ordered([]),save:x.run.save()})).rejects.toThrow();
},30000);
