import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,set,rational,unsigned as u,typedIdentifier} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {epiRecord as r,decodeEpi as decode} from '../campaign3/epiCodecs';
import {epiRecipe,PROPOSITIONS,STAGES,eventId,epiPath,encodingPath,bid,compileEpiModel,compileEpiInputs} from '../campaign3/epiModel';
import {createEpiRuntime} from '../campaign3/epiRuntime';
import {prepareEpiModel,createEpiRun,restoreEpiRun,characterOutputs} from '../campaign3/epiFactory';
import {applyStatePatch,AuthoritativeState} from '../substrate/state';
import {decodeLearn} from '../campaign3/learnCodecs';
import {frame,originals,initialState,seed,runCase,records} from './epiFixtures';

it('exact corpus pair differs in hidden truth but every admitted consumer and retained leaf agrees',async()=>{
 const a=await runCase('establishedA'),b=await runCase('establishedB');
 expect(a.run.characterView()).toEqual(b.run.characterView());expect(a.run.snapshot().trace).not.toEqual(b.run.snapshot().trace);
 const x=records(a.outputs,912n).at(-1)!,y=records(b.outputs,912n).at(-1)!;
 expect(f(x,2n)).toEqual(rational(19,20));expect(f(x,3n)).toEqual(rational(1,10));expect(f(y,3n)).toEqual(rational(4,5));
 expect(f(x,4n)).toEqual(rational(1,20));expect(f(y,4n)).toEqual(f(x,4n));expect(f(x,5n)).toEqual(rational(1,20));expect(f(y,5n)).toEqual(rational(3,4));
 const seen=new Set(items(decode(a.run.characterView().outputs),'list').map(v=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('record');return v.schema.typeId;}));expect(seen).toEqual(new Set([900n,904n,905n,906n,907n,910n]));
});
for(const projection of [2,3])it(`hidden-field leak control ${projection} is detected through salience, belief and later probe`,async()=>{
 const a=await runCase('establishedA',projection),b=await runCase('establishedB',projection);
 for(const t of [900n,910n,905n,906n])expect(records(a.outputs,t)).not.toEqual(records(b.outputs,t));expect(a.run.characterView().state).not.toEqual(b.run.characterView().state);
});
it('informative bound computes salience from old belief, stores encoding separately, and reaches later probe',async()=>{
 const a=await runCase('informativeA'),b=await runCase('informativeB');expect(a.run.characterView()).toEqual(b.run.characterView());
 const e=records(a.outputs,910n).at(-1)!,application=records(a.outputs,905n).at(-1)!;
 expect(f(e,3n)).toEqual(f(application,3n));expect(f(e,4n)).toEqual(rational(1,25));expect(f(e,5n)).toEqual(rational(26,25));expect(f(e,6n)).toEqual(rational(26,51));
 expect(f(rec(f(application,4n),902n),1n)).toEqual(rational(3,100));
 const probes=records(a.outputs,906n);expect(probes[0].fields.has(4n)).toBe(false);expect(probes[0].fields.has(7n)).toBe(false);expect(f(probes[4],7n)).toEqual(e);expect(f(probes[4],4n)).toEqual(f(application,4n));
});
it('permitted measurement intervention is nonvacuous while missing and known zero stay distinct',async()=>{
 const a=await runCase('permittedA'),b=await runCase('permittedB'),missing=await runCase('missingA'),zero=await runCase('zero');
 expect(a.run.characterView()).not.toEqual(b.run.characterView());expect(f(records(a.outputs,910n)[0],6n)).toEqual(rational(11,21));expect(f(records(b.outputs,910n)[0],6n)).toEqual(rational(9,14));
 expect(missing.run.characterView().state).toEqual(initialState);expect(records(missing.outputs,900n)).toHaveLength(0);
 const z=records(zero.outputs,906n)[2];expect(z.fields.has(4n)).toBe(false);expect(z.fields.has(7n)).toBe(true);expect(f(records(zero.outputs,910n)[0],6n)).toEqual(rational(1,2));
});
it('consumer traces receive only safe schemas and read only their declared state owners',async()=>{
 const x=await runCase('twoTargets');
 function noTruth(v:ReturnType<typeof decode>):void {if(typeof v==='boolean')return;if(v.kind==='record'){expect([898n,899n,912n]).not.toContain(v.schema.typeId);for(const x of v.fields.values())noTruth(x);}else if(v.kind==='list'||v.kind==='set')v.items.forEach(noTruth);else if(v.kind==='map')v.entries.forEach(([k,x])=>{noTruth(k);noTruth(x);});}
 for(const value of items(decode(x.run.snapshot().trace),'list')){const t=rec(value,160n),event=rec(f(t,4n),130n),phase=(f(event,3n) as {value:bigint}).value;
  if([50n,124n,130n,140n].includes(phase)){noTruth(f(t,12n));noTruth(f(t,13n));}
  for(const read of items(f(t,11n),'list')){const root=f(rec(f(rec(read,147n),2n),140n),1n);expect([key(u(903)),key(u(911))]).toContain(key(root));}
 }
 expect(()=>characterOutputs([r(899,[{kind:'signed',value:1n},list([])])])).toThrow('UNCLASSIFIED');
});
for(const stage of [...STAGES.map(([name])=>name),'commit'])it(`whole transaction rollback at ${stage} preserves both owners`,async()=>{
 const model=await compileEpiModel(epiRecipe()),input=await compileEpiInputs(model,initialState,originals([[frame(1,100,0,1)],[frame()]]),seed),runtime=createEpiRuntime(model,input);
 await runtime.settle();const before=runtime.snapshot();let reached=false;
 await expect(runtime.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('epi fault');}}})).rejects.toThrow();
 expect(reached).toBe(true);const after=runtime.snapshot();expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(after.queue).toEqual(before.queue);expect(after.allocators).toEqual(before.allocators);expect(after.outputs).toEqual(before.outputs);expect(after.trace).toEqual(before.trace);
});
it('rejects authored state, duplicate targets, foreign records and crossed ownership',async()=>{
 const source=epiRecipe(),handle=await prepareEpiModel(source);
 await expect(createEpiRun(handle,{initialState:enc(list([])),orderedInputs:originals([]),runSeed:seed})).rejects.toThrow();
 await expect(createEpiRun(handle,{initialState,orderedInputs:originals([[frame(),frame()]]),runSeed:seed})).rejects.toThrow('DUPLICATE');
 expect(()=>decodeLearn(enc(frame()))).toThrow();
 const model=await compileEpiModel(source),x=await runCase('freshA'),estimate=r(902,[rational(1,20),rational(2,1),set([typedIdentifier(1115,u(0))])]),encoding=records(x.outputs,910n)[0];
 for(const [path,newValue,authority] of [[epiPath(PROPOSITIONS[0]),estimate,'authority/episodic-encoding'],[encodingPath(PROPOSITIONS[0]),encoding,'authority/belief-expectation']] as const)expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path,expected:{presence:false},newValue}]},bid(1025,authority),model.authority)).toThrow();
});
it('complete-save restore checks all fields and original inputs',async()=>{
 const x=await runCase('informativeA'),restored=await restoreEpiRun(x.source,{initialState,orderedInputs:x.orderedInputs,save:x.run.save()});expect(restored.save()).toEqual(x.run.save());
 await expect(restoreEpiRun(x.source,{initialState,orderedInputs:originals([[frame()]]),save:x.run.save()})).rejects.toThrow();
 const saved=rec(decode(x.run.save()),132n),fields=new Map(saved.fields);fields.set(11n,list([]));await expect(restoreEpiRun(x.source,{initialState,orderedInputs:x.orderedInputs,save:enc({...saved,fields})})).rejects.toThrow();
});
