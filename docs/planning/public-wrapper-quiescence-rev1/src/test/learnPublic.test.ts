import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,set,signed,unsigned as u,rational,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {learnRecord as r,decodeLearn as decode} from '../campaign3/learnCodecs';
import {learnRecipe,PROPOSITIONS,OBSERVER,learnPath,compileLearnModel,compileLearnInputs} from '../campaign3/learnModel';
import {createLearnRuntime} from '../campaign3/learnRuntime';
import {prepareLearnModel,createLearnRun,restoreLearnRun} from '../campaign3/learnFactory';
import {applyLearnEvidence} from '../campaign3/learnMath';
import {applyStatePatch,AuthoritativeState} from '../substrate/state';
import {decodeBelief} from '../campaign3/beliefCodecs';
import {frame,originals,initialState,seed,runCase,applications,posterior,is} from './learnFixtures';

it('acquires exact prior50 then rejects compatible bound without any leaf change',async()=>{
 const x=await runCase('compatible'),a=applications(x.outputs).at(-1)!;
 expect(f(a,3n)).toEqual(f(a,4n));expect(f(a,5n)).toBe(false);
 expect(f(posterior(x.outputs),1n)).toEqual(rational(2,5));expect(f(posterior(x.outputs),2n)).toEqual(rational(50,1));
});
it('inconsistent bound updates; PointOnly is insufficient; unconditional growth violates compatible case',async()=>{
 const x=await runCase('inconsistent'),p=await runCase('inconsistent',3),bad=await runCase('compatible',2);
 expect(f(posterior(x.outputs),1n)).toEqual(rational(27,520));expect(f(posterior(x.outputs),2n)).toEqual(rational(52,1));
 expect(f(posterior(p.outputs),1n)).toEqual(rational(1,20));expect(f(posterior(bad.outputs),2n)).toEqual(rational(52,1));
});
it('zero-information saturation preserves unknown and established positive state',async()=>{
 const x=await runCase('zero'),y=await runCase('positiveZero');expect(x.run.snapshot().state).toEqual(initialState);
 expect(applications(x.outputs)[0].fields.has(4n)).toBe(false);expect(f(posterior(y.outputs),2n)).toEqual(rational(50,1));
});
it('six repeated fresh-prior bounds credit once and leave room for the final point',async()=>{
 const x=await runCase('repeated'),bad=await runCase('repeated',2),a=applications(x.outputs);
 for(let i=1;i<6;i++){expect(f(a[i],4n)).toEqual(f(a[0],4n));expect(f(a[i],5n)).toBe(false);}
 expect(f(posterior(x.outputs),1n)).toEqual(rational(13,50));expect(f(posterior(bad.outputs),1n)).toEqual(rational(51,350));
});
it('preserves the established-below-bound repeated-credit limitation',async()=>{
 const x=await runCase('repeatedEstablished');expect(f(posterior(x.outputs),2n)).toEqual(rational(62,1));
});
it('hidden overflow cannot change any safe output or learned state; denied is not zero',async()=>{
 const x=await runCase('repeated'),hidden=await runCase('hidden'),missing=await runCase('missing');
 expect(x.run.snapshot().outputs).toEqual(hidden.run.snapshot().outputs);expect(x.run.snapshot().state).toEqual(hidden.run.snapshot().state);
 expect(x.run.snapshot().trace).not.toEqual(hidden.run.snapshot().trace);expect(applications(missing.outputs)).toHaveLength(1);
 expect(f(posterior(missing.outputs),1n)).toEqual(rational(21,50));
});
it('lattice competitor records raw posterior separately from rounded commit',async()=>{
 const x=await runCase('inconsistent',1,2),a=applications(x.outputs).at(-1)!;
 expect(f(a,6n)).toEqual(rational(27,520));expect(f(posterior(x.outputs),1n)).toEqual(rational(51923,1000000));
});
it('only later probe sees learning; reads/writes belong to the declared target family',async()=>{
 const x=await runCase('twoTargets'),probes=x.outputs.filter(v=>is(v,893n)).map(v=>rec(v,893n));
 expect(probes[0].fields.has(4n)).toBe(false);expect(probes[2].fields.has(4n)).toBe(true);
 for(const t of items(decode(x.run.snapshot().trace),'list').map(v=>rec(v,160n))){
  const phase=(f(rec(f(t,4n),130n),3n) as {value:bigint}).value;
  const reads=items(f(t,11n),'list');if(![50n,140n].includes(phase))expect(reads).toHaveLength(0);
  for(const read of reads)expect(f(rec(f(rec(read,147n),2n),140n),1n)).toEqual(u(890));
 }
});
for(const phase of [50n,110n,120n,124n,130n,140n,undefined])it(`rollback after learned prefix at ${phase??'commit'}`,async()=>{
 const model=await compileLearnModel(learnRecipe()),input=await compileLearnInputs(model,initialState,originals([[frame(1,20,0,1)],[frame()]]),seed),runtime=createLearnRuntime(model,input);
 await runtime.settle();const before=runtime.snapshot();let reached=false;
 await expect(runtime.settleForConformance({onBoundary(boundary,event){if(phase===undefined?boundary==='before-commit':boundary==='after-trace-validation'&&event?.phase===phase){reached=true;throw Error('learn fault');}}})).rejects.toThrow();
 expect(reached).toBe(true);const after=runtime.snapshot();expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));
 expect(after.queue).toEqual(before.queue);expect(after.allocators).toEqual(before.allocators);expect(after.outputs).toEqual(before.outputs);expect(after.trace).toEqual(before.trace);
});
it('rejects authored state, duplicate targets, excess inputs and model changes',async()=>{
 const model=await prepareLearnModel(learnRecipe());
 await expect(createLearnRun(model,{initialState:enc(list([])),orderedInputs:originals([]),runSeed:seed})).rejects.toThrow();
 await expect(createLearnRun(model,{initialState,orderedInputs:originals([[frame(),frame()]]),runSeed:seed})).rejects.toThrow('DUPLICATE');
 await expect(createLearnRun(model,{initialState,orderedInputs:originals(Array.from({length:65},()=>[])),runSeed:seed})).rejects.toThrow('LIMIT');
 const source=learnRecipe();source.parameters=enc(r(884,[{kind:'text',value:'bad'},u(1),u(1)]));await expect(prepareLearnModel(source)).rejects.toThrow('EXACT_MODEL');
});
it('rejects new records in old decoder and wrong type slots, invalid precision and repeated applied evidence',()=>{
 const s=r(887,[typedIdentifier(1115,u(4)),OBSERVER,PROPOSITIONS[0],signed(1),rational(1,10),u(1),rational(2,1)]),e=r(891,[typedIdentifier(1158,u(5)),s,u(1)]),prior=applyLearnEvidence(undefined,e,1,1).next;
 expect(()=>decodeBelief(enc(s))).toThrow();expect(()=>applyLearnEvidence(prior,e,1,1)).toThrow('SUPPORT');
 expect(()=>applyLearnEvidence(undefined,r(891,[typedIdentifier(1158,u(5)),s,u(2)]),1,1)).toThrow('CLASSIFICATION');
 const fields=new Map(s.fields);fields.set(7n,rational(3,1));expect(()=>applyLearnEvidence(undefined,r(891,[typedIdentifier(1158,u(5)),r(887,fields),u(1)]),1,1)).toThrow('SAMPLE');
 const v=frame(),bad=new Map(v.fields);bad.set(4n,s);expect(()=>decode(enc({...v,fields:bad}))).toThrow('boolean');
});
it('rejects unrelated writer authority',async()=>{
 const model=await compileLearnModel(learnRecipe()),value=r(889,[rational(1,10),rational(2,1),set([typedIdentifier(1115,u(4))])]);
 expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:learnPath(PROPOSITIONS[0]),expected:{presence:false},newValue:value}]},typedIdentifier(1025,{kind:'text',value:'authority/perception'}),model.authority)).toThrow();
});
it('restores complete save and rejects altered canonical save or wrong originals',async()=>{
 const x=await runCase('repeated');const restored=await restoreLearnRun(x.source,{initialState,orderedInputs:x.orderedInputs,save:x.run.save()});expect(restored.save()).toEqual(x.run.save());
 await expect(restoreLearnRun(x.source,{initialState,orderedInputs:originals([[frame()]]),save:x.run.save()})).rejects.toThrow();
 const saved=rec(decode(x.run.save()),132n),fields=new Map(saved.fields);fields.set(11n,list([]));await expect(restoreLearnRun(x.source,{initialState,orderedInputs:x.orderedInputs,save:enc({...saved,fields})})).rejects.toThrow();
});
