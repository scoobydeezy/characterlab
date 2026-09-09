import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,record,unsigned} from '../substrate/canonicalEncoding';
import {memoryModelSource,memoryWrapperDeclarations} from '../campaign2/memoryModelSource';
import {prepareMemoryModel,createMemoryRun,restoreMemoryRun} from '../campaign2/memoryFactory';
import {decodeMemory} from '../campaign2/memoryCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import * as val from '../campaign2/valDeclarations';
import * as runtime from '../campaign2/adaptationRuntime';
import * as identity from '../substrate/identity';
import {ContentValidationError} from '../substrate/contentManifest';

it('VAL-V: real memory recall OutputRole traverses VAL on public prepare and restore even with no scheduled recall',async()=>{
 for(const enabled of [false,true]){
  const wrappers=memoryWrapperDeclarations(),wrapper=rec(enabled?wrappers.recall:wrappers.recallAblated,358n);
  const requirements=items(f(wrapper,2n),'set');expect(requirements).toHaveLength(1);
  const requirement=rec(requirements[0],266n),role=rec(f(requirement,4n),263n);
  const source=memoryModelSource(true,true,wrappers.formation,wrapper),input={initialState:enc(set([])),orderedInputs:enc(list([])),runSeed:new Uint8Array(32)};
  const visitor=vi.spyOn(val,'compileValDeclarations');
  let save:Uint8Array;
  try{
   const model=await prepareMemoryModel(source),run=await createMemoryRun(model,input);save=run.save();
   const before=visitor.mock.calls.length;
   const restored=await restoreMemoryRun(source,{initialState:input.initialState,orderedInputs:input.orderedInputs,save});
   expect(restored.save()).toEqual(save);expect(restored.snapshot().outputs).toEqual(enc(list([])));
   expect(visitor.mock.calls.length).toBeGreaterThan(before);
   const traversed=visitor.mock.calls.filter(([,declarations])=>{
    // The complete memory registry is the exact VAL declaration operand.
    return enc(decodeMemory(declarations)).toString()===source.registry.toString();
   });expect(traversed.length).toBeGreaterThanOrEqual(2);
  }finally{visitor.mockRestore();}
  const alteredRole=record(role.schema,new Map([...role.fields,[1n,unsigned(1000)]]));
  const alteredRequirement=record(requirement.schema,new Map([...requirement.fields,[4n,alteredRole]]));
  const alteredWrapper=record(wrapper.schema,new Map([...wrapper.fields,[2n,set([alteredRequirement])]]));
  const alteredSource=memoryModelSource(true,true,wrappers.formation,alteredWrapper);
  const negativeVisitor=vi.spyOn(val,'compileValDeclarations'),activation=vi.spyOn(runtime,'createAdaptationRuntime');
  try{
   for(const attempt of [()=>prepareMemoryModel(alteredSource),()=>restoreMemoryRun(alteredSource,{initialState:input.initialState,orderedInputs:input.orderedInputs,save:save!})]){
    await expect(attempt()).rejects.toMatchObject({code:'INVALID_CONFIGURATION',message:'character validator requires namespace 1002'});
   }
   expect(negativeVisitor.mock.calls.filter(([,d])=>d.toString()===alteredSource.registry.toString())).toHaveLength(2);expect(activation).not.toHaveBeenCalled();
   // A role-valid selector alteration must still fail exact specimen matching.
   const selectorAltered=record(requirement.schema,new Map([...requirement.fields,[1n,unsigned(2)]]));
   const guardedSource=memoryModelSource(true,true,wrappers.formation,record(wrapper.schema,new Map([...wrapper.fields,[2n,set([selectorAltered])]])));
   await expect(prepareMemoryModel(guardedSource)).rejects.toThrow('memory source differs from frozen declarations: registry');
   await expect(restoreMemoryRun(guardedSource,{initialState:input.initialState,orderedInputs:input.orderedInputs,save:save!})).rejects.toThrow('memory source differs from frozen declarations: registry');
   expect(negativeVisitor.mock.calls.filter(([,d])=>d.toString()===guardedSource.registry.toString())).toHaveLength(2);expect(activation).not.toHaveBeenCalled();
  }finally{negativeVisitor.mockRestore();activation.mockRestore();}
 }
},20000);

it('VAL stage order: cyclic CONTENT wins over malformed real266 on public memory prepare and restore',async()=>{
 const source=memoryModelSource(),input={initialState:enc(set([])),orderedInputs:enc(list([])),runSeed:new Uint8Array(32)};
 const run=await createMemoryRun(await prepareMemoryModel(source),input),save=run.save();
 const w=memoryWrapperDeclarations(),wrapper=rec(w.recall,358n),requirement=rec(items(f(wrapper,2n),'set')[0],266n),role=rec(f(requirement,4n),263n);
 const badRole=record(role.schema,new Map([...role.fields,[1n,unsigned(1000)]]));
 const badRequirement=record(requirement.schema,new Map([...requirement.fields,[4n,badRole]]));
 const badWrapper=record(wrapper.schema,new Map([...wrapper.fields,[2n,set([badRequirement])]]));
 const character=rec(items(decodeMemory(source.content),'set')[0],170n);
 const content=enc(set([record(character.schema,new Map([...character.fields,[12n,list([f(character,1n)])]]))]));
 const candidate={...memoryModelSource(true,true,w.formation,badWrapper),content};
 const visitor=vi.spyOn(val,'compileValDeclarations'),publication=vi.spyOn(identity,'createModelIdentity'),activation=vi.spyOn(runtime,'createAdaptationRuntime');
 try{
  for(const attempt of [()=>prepareMemoryModel(candidate),()=>restoreMemoryRun(candidate,{initialState:input.initialState,orderedInputs:input.orderedInputs,save})]){
   await expect(attempt()).rejects.toSatisfy((e:unknown)=>e instanceof ContentValidationError&&/cycle/.test(e.message));
  }
  // Kind-only CONTENT stage runs; full registry role closure is never entered.
  expect(visitor).toHaveBeenCalledTimes(2);
  for(const [,declarations] of visitor.mock.calls)expect(declarations).toEqual(enc(set([])));
  expect(publication).not.toHaveBeenCalled();expect(activation).not.toHaveBeenCalled();expect(run.save()).toEqual(save);
 }finally{visitor.mockRestore();publication.mockRestore();activation.mockRestore();}
},20000);
