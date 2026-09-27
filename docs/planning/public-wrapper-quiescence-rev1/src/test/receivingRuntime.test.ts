import {describe,it,expect} from 'vitest';
import {canonicalEncode as enc,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataField as f,dataRecord as rec,dataKey as key} from '../campaign2/canonicalData';
import {compileReceivingModel} from '../campaign3/receivingModel';
import {compileReceivingInputs} from '../campaign3/receivingInputs';
import {createReceivingRuntime} from '../campaign3/receivingRuntime';
import {receivingSource,receivingVariant,receivingOriginals,initialReceiving,taskKey,id} from './receivingFixtures';
async function runtime(adopted:readonly string[]=['a'],task=true){const model=await compileReceivingModel(receivingSource),initial=model.initialState(enc(initialReceiving(adopted,task).canonicalValue())),inputs=await compileReceivingInputs(enc(receivingOriginals()),enc(initial.canonicalValue()),model.modelIdentity,new Uint8Array(32),taskKey);return createReceivingRuntime(model,inputs,initial);}
describe('actual joined receiving scheduler',()=>{
 it('rejects a concurrent settle without replacing the live transaction or RNG scope',async()=>{
  const run=await runtime(),pending=run.settleNextInstant();await expect(run.settleNextInstant()).rejects.toThrow(/already settling/);await pending;
  const control=await runtime();await control.settleNextInstant();expect(run.save()).toEqual(control.save());
 });
 it('rolls back every new stage and the final commit with provisional RNG discarded',async()=>{
  const model=await compileReceivingModel(receivingSource),originals=list([...(receivingOriginals(45) as Extract<CanonicalValue,{kind:'list'}>).items,...(receivingOriginals(55) as Extract<CanonicalValue,{kind:'list'}>).items]);
  const stages=['workspace','appraisal','concern','task-motive','body-options','task-candidates','mixed-candidates','task-raw','mixed-raw','mixed-reasons','resolution','intent','expression','plan','attempt','execution','commit'];
  for(const stage of stages){const initial=model.initialState(enc(initialReceiving(['a','b']).canonicalValue())),inputs=await compileReceivingInputs(enc(originals),enc(initial.canonicalValue()),model.modelIdentity,new Uint8Array(32),taskKey),run=createReceivingRuntime(model,inputs,initial);await run.settleNextInstant();const before=run.snapshot(),addresses=run.committedRandomAddressKeys();let hit=false;
   await expect(run.settleNextInstantForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event!==undefined&&key(event.eventTypeId)===key(id(1001,'event/embodied-receiving-'+stage))){hit=true;expect(()=>run.save()).toThrow();throw Error('receiving rollback witness');}}})).rejects.toThrow();expect(hit).toBe(true);
   const after=run.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(after.outputs).toEqual(before.outputs);expect(after.trace).toEqual(before.trace);expect(after.allocators).toEqual(before.allocators);expect(after.queue).toEqual(before.queue);expect(after.clock).toEqual(before.clock);expect(run.committedRandomAddressKeys()).toEqual(addresses);
  }
 },60000);
 it('executes the exact26-event ceiling and work25 rolls back staged deliveries',async()=>{
  for(const name of ['baseline','work25']){const model=await compileReceivingModel(receivingVariant(name)),initial=model.initialState(enc(initialReceiving(['a','b']).canonicalValue())),inputs=await compileReceivingInputs(enc(receivingOriginals(100,true)),enc(initial.canonicalValue()),model.modelIdentity,new Uint8Array(32),taskKey),run=createReceivingRuntime(model,inputs,initial),before=run.snapshot();
   if(name==='baseline'){await run.settleNextInstant();expect(run.snapshot().trace).toHaveLength(26);expect(run.snapshot().outputs).toHaveLength(22);expect(run.snapshot().allocators.nextRuntimeId).toBe(19n);}
   else {await expect(run.settleNextInstant()).rejects.toThrow(/work ceiling/);const after=run.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(after.outputs).toEqual([]);expect(after.trace).toEqual([]);expect(after.allocators).toEqual(before.allocators);expect(after.queue).toEqual(before.queue);expect(run.committedRandomAddressKeys()).toEqual([]);}
  }
 },15000);
 it('executes22 events from paired originals through shared choice and terminal outcome',async()=>{
  const run=await runtime(),before=run.snapshot();await run.settleNextInstant();const after=run.snapshot();
  expect(after.trace).toHaveLength(22);expect(after.outputs).toHaveLength(19);expect(after.allocators.nextRuntimeId).toBe(19n);
  expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));
  expect(after.outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===514n)).toHaveLength(1);
  expect(run.committedRandomAddressKeys().length).toBeGreaterThanOrEqual(2);
  await run.settleNextInstant();expect(run.snapshot().trace).toHaveLength(23);expect(run.snapshot().allocators.nextRuntimeId).toBe(19n);
  const taskEntry=run.snapshot().state.entries().find(e=>e.path.rootStateTypeId===373n&&e.path.fieldId===1n)!;expect((f(rec(taskEntry.value,372n),1n) as {value:bigint}).value).toBe(3n);
 });
 it('no options gives17 real events,14 allocations, no RNG and no fabricated intent',async()=>{
  const run=await runtime([],false);await run.settleNextInstant();const after=run.snapshot();expect(after.trace).toHaveLength(17);expect(after.outputs).toHaveLength(14);expect(after.allocators.nextRuntimeId).toBe(14n);expect(run.committedRandomAddressKeys()).toEqual([]);
  expect(after.outputs.some(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===509n)).toBe(false);
 });
});

