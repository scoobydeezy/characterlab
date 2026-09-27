import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,rational as q,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {readDistribution} from '../campaign2/cognitiveMath';
import {reasonRecord as r,decodeReason as decode} from '../campaign3/reasonCodecs';
import {compileReasonModel,compileReasonInputs,reasonRecipe,eventId,STAGES,identityPath,sid} from '../campaign3/reasonModel';
import {compileJoinedReasons} from '../campaign3/reasonMath';
import {createReasonRuntime} from '../campaign3/reasonRuntime';
import {prepareReasonModel,createReasonRun,restoreReasonRun} from '../campaign3/reasonFactory';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {decodeEpi} from '../campaign3/epiCodecs';
import {runCase,records,initialState,seed,original,ordered,cases} from './reasonFixtures';
import rejectedParameters from '../../docs/planning/campaign3-reason-model-rev2/law-1/parameters.cenc.hex?raw';

it('merges exact semantic keys and keeps separate motives, referents and options',async()=>{
 const same=await runCase('same'),motive=await runCase('motive'),referent=await runCase('referent'),option=await runCase('otherOption');
 expect(same.nuclei).toHaveLength(1);expect(motive.nuclei).toHaveLength(2);expect(referent.nuclei).toHaveLength(2);expect(option.nuclei).toHaveLength(2);
 for(const x of [same,motive,referent,option]){const keys=x.nuclei.map(n=>rec(f(n,1n),922n));expect(new Set(keys.map(key)).size).toBe(keys.length);keys.forEach(k=>expect(k.fields.has(5n)).toBe(false));}
 expect(f(same.nuclei[0],2n)).toEqual(q(17,29));
});
it('distinguishes pooled, pairwise and per-fact alternatives on the required corpus',async()=>{
 expect((await runCase('motive',2)).nuclei).toHaveLength(1);expect((await runCase('referent',2)).nuclei).toHaveLength(1);expect((await runCase('same',4)).nuclei).toHaveLength(2);
 const a=await runCase('collective'),b=await runCase('collective',3),w=(x:typeof a)=>rec(items(f(x.nuclei[0],12n),'list').at(-1)!,921n);
 expect(f(w(a),4n)).toEqual(q(0,1));expect(f(w(a),3n)).toEqual(q(1,1));expect(f(w(b),4n)).toEqual(q(1,8));expect(f(a.nuclei[0],2n)).toEqual(q(17,29));expect(f(b.nuclei[0],2n)).toEqual(q(37,61));
});
it('acquires standing from actual qualification and distinguishes zero-base from weak-motive rescue',async()=>{
 const weak=await runCase('weak'),rescued=await runCase('weakStanding'),zero=await runCase('zeroStanding'),bad=await runCase('zeroStanding',5),mismatch=await runCase('mismatch');
 expect(weak.nuclei).toHaveLength(0);expect(rescued.nuclei).toHaveLength(1);expect(zero.nuclei).toHaveLength(0);expect(bad.nuclei).toHaveLength(1);expect(mismatch.nuclei).toHaveLength(0);
 const application=records(rescued.outputs,929n)[0],history=rec(f(application,3n),414n),rows=items(f(history,1n),'list');expect(rows).toHaveLength(1);expect(f(rec(rows[0],413n),1n)).toEqual(f(rec(f(application,4n),429n),1n));
 const raw=rec(f(rescued.compilation,2n),920n),standing=items(f(raw,2n),'list').map(v=>rec(v,919n)).find(v=>v.fields.has(5n))!;expect(f(standing,5n)).toEqual(history);expect(f(rescued.nuclei[0],2n)).toEqual(q(1,11));expect(f(rescued.nuclei[0],7n)).toEqual(u(4));
 expect(records(bad.outputs,929n)).toEqual(records(zero.outputs,929n));expect((await runCase('untrained')).nuclei).toHaveLength(0);
});
it('keeps situation/context roles separate and permits rescue without creating base motives',async()=>{
 const s=await runCase('weakSituation'),c=await runCase('weakContext');expect(s.nuclei).toHaveLength(1);expect(c.nuclei).toHaveLength(1);expect(f(s.nuclei[0],4n)).toEqual(q(1,3));expect(f(s.nuclei[0],5n)).toEqual(q(0,1));expect(f(c.nuclei[0],4n)).toEqual(q(0,1));expect(f(c.nuclei[0],5n)).toEqual(q(1,3));expect((await runCase('zeroSituation')).nuclei).toHaveLength(0);
});
it('resolves opposing base signs before threshold and applies Avoid to the whole expression',async()=>{
 const cancel=await runCase('cancel'),signed=await runCase('signed'),avoid=await runCase('avoidStanding'),approach=await runCase('strongStanding');expect(cancel.nuclei).toHaveLength(0);expect(f(rec(items(f(cancel.compilation,4n),'list')[0],928n),4n)).toEqual(q(0,1));expect(f(rec(items(f(signed.compilation,4n),'list')[0],928n),4n)).toEqual(q(1,13));
 expect(avoid.nuclei).toHaveLength(1);expect(f(rec(f(avoid.nuclei[0],1n),922n),4n)).toEqual(u(2));expect(f(avoid.nuclei[0],2n)).toEqual(q(-1,3));
 expect([...readDistribution(f(avoid.nuclei[0],11n)).keys()].sort()).toEqual([...readDistribution(f(approach.nuclei[0],11n)).keys()].map(x=>-x).sort());
});
it('preserves exact admitted observation support and rejects rather than invents unavailable sources',async()=>{
 const x=await runCase('collective'),hidden=await runCase('hidden'),denied=await runCase('denied');expect(x.run.snapshot().outputs).toEqual(hidden.run.snapshot().outputs);expect(x.run.snapshot().state).toEqual(hidden.run.snapshot().state);expect(x.run.snapshot().trace).not.toEqual(hidden.run.snapshot().trace);expect(denied.nuclei).toHaveLength(0);expect(records(denied.outputs,917n)).toHaveLength(0);
 const samples=records(x.outputs,917n),raw=rec(f(x.compilation,2n),920n),signals=items(f(raw,2n),'list').map(v=>rec(v,919n));expect(signals.map(s=>items(f(s,4n),'list').length)).toEqual([1,1,2]);
 for(const signal of signals){const support=items(f(signal,4n),'list');for(const sample of support)expect(samples.map(key)).toContain(key(sample));const basis=f(rec(f(signal,3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map')throw Error('basis');expect(basis.entries.map(([atom])=>key(f(rec(f(rec(atom,399n),2n),237n),2n))).sort()).toEqual(support.map(v=>key(f(rec(v,917n),1n))).sort());}
});
it('canonical source permutation preserves the compiler and duplicate description IDs reject',async()=>{
 const x=await runCase('collective'),raw=rec(f(x.compilation,2n),920n),signals=items(f(raw,2n),'list'),source=reasonRecipe(),content=rec(decode(source.content),914n),reverse=r(920,[f(raw,1n),list([...signals].reverse()),f(raw,3n)]),out=compileJoinedReasons(f(x.compilation,1n),reverse,f(content,4n),1);
 expect(f(out,3n)).toEqual(f(x.compilation,3n));expect(()=>compileJoinedReasons(f(x.compilation,1n),r(920,[f(raw,1n),list([signals[0],signals[0]]),list([])]),f(content,4n),1)).toThrow('DUPLICATE');
});
it('every comparator receives byte-identical raw sources and actual learned history in every matched case',async()=>{
 for(const name of Object.keys(cases())){const a=await runCase(name);for(const law of [2,3,4,5]){const b=await runCase(name,law);expect(records(b.outputs,920n)).toEqual(records(a.outputs,920n));expect(records(b.outputs,929n)).toEqual(records(a.outputs,929n));expect(b.run.snapshot().state).toEqual(a.run.snapshot().state);}}
},180000);
it('rejects the preserved insufficient-witness model cohort',async()=>{
 const source=reasonRecipe();source.parameters=Uint8Array.from(rejectedParameters.trim().match(/../g)!.map(s=>parseInt(s,16)));await expect(prepareReasonModel(source)).rejects.toThrow('EXACT_MODEL');
});
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rollback at ${stage} preserves learned state, outputs and addressed RNG`,async()=>{
 const m=await compileReasonModel(reasonRecipe()),probe=['source','freeze'].includes(stage),inputs=ordered([original(1,undefined),original(2,probe?'collective':undefined)]),compiled=await compileReasonInputs(m,initialState,inputs,seed),runtime=createReasonRuntime(m,compiled);await runtime.settle();const before=runtime.snapshot();let reached=false;
 await expect(runtime.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('reason fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=runtime.snapshot();expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(after.queue).toEqual(before.queue);expect(after.allocators).toEqual(before.allocators);expect(after.outputs).toEqual(before.outputs);expect(after.trace).toEqual(before.trace);
});
it('rejects authored identity, invalid context, foreign schema and unrelated writer',async()=>{
 const source=reasonRecipe(),model=await prepareReasonModel(source);await expect(createReasonRun(model,{initialState:enc(list([])),orderedInputs:ordered([]),runSeed:seed})).rejects.toThrow();await expect(createReasonRun(model,{initialState,orderedInputs:ordered([original(1,'unknown')]),runSeed:seed})).rejects.toThrow('CONTEXT');expect(()=>decodeEpi(enc(original(1,undefined)))).toThrow();
 const x=await runCase('weakStanding'),history=f(records(x.outputs,929n)[0],3n),compiled=await compileReasonModel(source);expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:identityPath,expected:{presence:false},newValue:history}]},sid(1025,'authority/perception'),compiled.authority)).toThrow();
});
it('restores continuing addressed history and rejects edited RNG ledger or originals',async()=>{
 const x=await runCase('continued'),restored=await restoreReasonRun(x.source,{initialState,orderedInputs:x.orderedInputs,save:x.run.save()});expect(restored.save()).toEqual(x.run.save());const save=rec(decode(x.run.save()),132n),fields=new Map(save.fields);expect(items(f(save,10n),'list').length).toBeGreaterThan(0);fields.set(10n,list([]));await expect(restoreReasonRun(x.source,{initialState,orderedInputs:x.orderedInputs,save:enc({...save,fields})})).rejects.toThrow();await expect(restoreReasonRun(x.source,{initialState,orderedInputs:ordered([]),save:x.run.save()})).rejects.toThrow();
},30000);
