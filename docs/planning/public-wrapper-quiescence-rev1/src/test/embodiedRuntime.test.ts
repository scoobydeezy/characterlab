import {describe,it,expect} from 'vitest';
import freeze from '../../docs/planning/campaign3-embodied-model-rev2/FREEZE.json';
import {embodiedFixtureBytes as bytes} from './embodiedFixtures';
import {compileEmbodiedModel} from '../campaign3/embodiedModel';
import {compileEmbodiedInputs} from '../campaign3/embodiedAdmission';
import {createEmbodiedRuntime} from '../campaign3/embodiedRuntime';
import {dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {canonicalEncode as enc} from '../substrate/canonicalEncoding';

async function run(name='baseline',modelName=name==='hidden89'?'baseline':name){
 const model=await compileEmbodiedModel({...freeze.versions,content:bytes(modelName+'/content.cenc.hex'),registry:bytes(modelName+'/registry.cenc.hex'),parameters:bytes(modelName+'/parameters.cenc.hex')});
 const initial=bytes('runs/'+name+'/initial-state.cenc.hex');
 const input=await compileEmbodiedInputs(bytes('runs/'+name+'/ordered-inputs.cenc.hex'),initial,model.modelIdentity,new Uint8Array(32));
 return createEmbodiedRuntime(model,input,model.state.restoreState(initial));
}
describe('EMB fixed runtime',()=>{
 it('rolls back at every scheduler boundary across source, SEM, pressure and staged deliveries',async()=>{
  const cases=[...[10n,11n,12n,13n,14n,60n,110n].flatMap(phase=>['before-state-validation','after-state-validation','before-event-validation','after-event-validation','before-trace-validation','after-trace-validation'].map(boundary=>({phase,boundary}))),...['before-invariant-validation','after-invariant-validation','before-commit'].map(boundary=>({phase:undefined,boundary}))];
  for(const target of cases){const runtime=await run();for(let i=0;i<3;i++)await runtime.settleNextInstant();const before=runtime.snapshot();let injected=false;
   await expect(runtime.settleNextInstantForConformance({onBoundary(boundary,event){if(boundary===target.boundary&&event?.phase===target.phase&&(target.phase!==110n||event?.eventId===6n)){injected=true;expect(()=>runtime.save()).toThrow();throw Error('injected rollback witness');}}})).rejects.toThrow();
   expect(injected).toBe(true);const after=runtime.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(after.clock).toBe(before.clock);expect(after.allocators).toEqual(before.allocators);expect(after.queue).toEqual(before.queue);expect(after.trace).toEqual(before.trace);expect(after.outputs).toEqual(before.outputs);
  }
 },30000);
 it('executes the complete sample/SEM/pressure/delivery timeline',async()=>{
  const runtime=await run();
  for(let i=0;i<6;i++){await runtime.settleNextInstant();expect(runtime.diagnostic()).toBeUndefined();}
  const snapshot=runtime.snapshot();
  expect(snapshot.clock).toBe(180n);expect(snapshot.queue).toHaveLength(0);
  expect(snapshot.trace).toHaveLength(39);expect(snapshot.outputs).toHaveLength(21);
  expect(snapshot.allocators).toEqual({nextRuntimeId:18n,nextEventId:39n,nextEventSequence:39n});
  const pressures=snapshot.outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===464n);
  expect(pressures.map(v=>f(rec(f(rec(v,464n),4n),481n),2n))).toEqual([
   {kind:'rational',numerator:0n,denominator:1n},{kind:'rational',numerator:1n,denominator:6n},
   {kind:'rational',numerator:0n,denominator:1n},{kind:'rational',numerator:1n,denominator:3n},
   {kind:'rational',numerator:0n,denominator:1n},{kind:'rational',numerator:5n,denominator:6n}]);
  expect(()=>runtime.save()).not.toThrow();
 });
 it.each(['denied','unavailable'])('%s emits absence without SEM and preserves branch-neutral allocations',async name=>{
  const runtime=await run(name);for(let i=0;i<6;i++){await runtime.settleNextInstant();expect(runtime.diagnostic()).toBeUndefined();}
  const snapshot=runtime.snapshot();expect(snapshot.outputs).toHaveLength(15);
  expect(snapshot.outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===227n)).toHaveLength(0);
  expect(snapshot.allocators.nextRuntimeId).toBe(18n);
 });
 it('work7 aborts the three-original instant with every earlier write and child rolled back',async()=>{
  const runtime=await run('baseline','work7');for(let i=0;i<3;i++)await runtime.settleNextInstant();
  const before=runtime.snapshot();await expect(runtime.settleNextInstant()).rejects.toThrow(/work ceiling/);const after=runtime.snapshot();
  expect(runtime.diagnostic()?.code).toBe('CASCADE_LIMIT_EXCEEDED');
  expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));
  expect(after.clock).toBe(before.clock);expect(after.allocators).toEqual(before.allocators);
  expect(after.outputs).toEqual(before.outputs);expect(after.trace).toEqual(before.trace);expect(after.queue).toEqual(before.queue);
 });
});
