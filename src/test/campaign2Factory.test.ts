import {it,expect,vi} from 'vitest';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run,campaign2ModelIdentity,type Campaign2Model} from '../campaign2/factory';
import {candidateId} from '../campaign2/firstModelCandidate';
import {firstTraceModel as firstModelCandidate} from '../campaign2/firstTraceModel';
import {canonicalEncode,list,map,set,record,unsigned,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {decodeCampaign2,campaign2Record as r} from '../campaign2/codecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import {orderingParametersValue} from '../substrate/scheduler';
import * as runtimeModule from '../campaign2/adaptationRuntime';
const enc=canonicalEncode,character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
function runInput(count=2){return {initialState:enc(new AuthoritativeState([]).canonicalValue()),runSeed:new Uint8Array(32),orderedInputs:enc(list([
  list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(count)})}),list([])]),
  list([signed(4),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:r('ProceduralPracticeFact',{CharacterId:character,ProcedureId:candidateId(1034,'procedure/fixture-practice'),CompletedRepetitions:unsigned(3)})}),list([])]),
]))};}
const edit=(bytes:Uint8Array,field:bigint,value:CanonicalValue)=>{const v=rec(decodeCampaign2(bytes),132n);return enc(record(v.schema,new Map([...v.fields,[field,value]])));};
async function checkpoint(){const source=firstModelCandidate(),input=runInput(),model=await prepareCampaign2Model(source),run=await createCampaign2Run(model,input);await run.settleNextInstant();return {source,input,model,run,save:run.save()};}

it('FCT-5: exact create/save/restore continuation uses no original initial-state input',async()=>{
  const c=await checkpoint(),resumed=await restoreCampaign2Run(c.source,{orderedInputs:c.input.orderedInputs,save:c.save});
  expect(resumed.runIdentity()).toEqual(c.run.runIdentity());expect(resumed.save()).toEqual(c.save);
  expect(await c.run.settleNextInstant()).toBe(true);expect(await resumed.settleNextInstant()).toBe(true);
  expect(resumed.snapshot()).toEqual(c.run.snapshot());expect(resumed.save()).toEqual(c.run.save());
  expect(await resumed.settleNextInstant()).toBe(false);
  // The pre-source clock-zero boundary also restores the full original schedule.
  const fresh=await createCampaign2Run(c.model,c.input),initialSave=fresh.save();
  const initialRestore=await restoreCampaign2Run(c.source,{orderedInputs:c.input.orderedInputs,save:initialSave});expect(initialRestore.save()).toEqual(initialSave);
});
it('FCT-A/F: runtime callbacks, identities, overrides, accessors and forged handles cannot enter',async()=>{
  let getterCalls=0;const source=firstModelCandidate();Object.defineProperty(source,'registry',{get(){getterCalls++;return new Uint8Array();}});
  await expect(prepareCampaign2Model(source)).rejects.toThrow(/accessors/);expect(getterCalls).toBe(0);
  const exotic=firstModelCandidate();Object.defineProperty(exotic.registry,'constructor',{get(){getterCalls++;throw Error('must not execute');}});
  await expect(prepareCampaign2Model(exotic)).rejects.toThrow(/non-data/);expect(getterCalls).toBe(0);
  for(const extra of ['handlers','traceFactory','stateAdapter','invariants','modelIdentity','maxWork','persistenceProfile'])await expect(prepareCampaign2Model({...firstModelCandidate(),[extra]:()=>{}})).rejects.toThrow(/fields/);
  await expect(createCampaign2Run({} as Campaign2Model,runInput())).rejects.toThrow(/capability/);
  const m=await prepareCampaign2Model(firstModelCandidate());await expect(createCampaign2Run(m,{...runInput(),maxWork:1n} as ReturnType<typeof runInput>)).rejects.toThrow(/fields/);
  const run=await createCampaign2Run(m,runInput());expect(Object.keys(run).sort()).toEqual(['diagnostic','runIdentity','save','settleNextInstant','snapshot']);
});
it('FCT-C: returned identity, state, output and trace bytes cannot mutate the private run',async()=>{
  const c=await checkpoint(),before=c.run.save(),snapshot=c.run.snapshot();
  snapshot.state.fill(0);snapshot.outputs.fill(0);snapshot.trace.fill(0);campaign2ModelIdentity(c.model).fill(0);c.run.runIdentity().fill(0);
  c.source.registry.fill(0);expect(c.run.save()).toEqual(before);
});
it('PERSIST/FCT-E: every metadata and pending-source failure occurs before runtime construction',async()=>{
  const c=await checkpoint(),saved=rec(decodeCampaign2(c.save),132n),queue=items(f(saved,7n),'list'),event=rec(queue[0],130n);
  const wrongEvent=(field:bigint,value:CanonicalValue)=>edit(c.save,7n,list([record(event.schema,new Map([...event.fields,[field,value]]))]));
  const mutants=[...[8n,9n,10n].flatMap(field=>[edit(c.save,field,list([unsigned(1)])),edit(c.save,field,map([]))]),
    edit(c.save,7n,list([])),edit(c.save,7n,list([queue[0],queue[0]])),wrongEvent(1n,unsigned(99)),wrongEvent(2n,signed(2)),wrongEvent(8n,list([unsigned(0)])),
    wrongEvent(5n,candidateId(1001,'event/outcome-evaluation'))];
  const allocations=rec(f(saved,6n),131n);mutants.push(edit(c.save,6n,record(allocations.schema,new Map([...allocations.fields,[2n,unsigned(0)]]))));
  const spy=vi.spyOn(runtimeModule,'createAdaptationRuntime');
  try{
    for(const field of [8n,9n,10n]){
      const fields=new Map(saved.fields);fields.delete(field);
      const omitted=enc(record({...saved.schema,fields:saved.schema.fields.map(s=>s.id===field?{...s,required:false}:s)},fields));
      for(const save of [omitted,edit(c.save,field,set([])),edit(c.save,field,map([])),edit(c.save,field,list([unsigned(1)]))])
        await expect(restoreCampaign2Run(c.source,{save,orderedInputs:c.input.orderedInputs})).rejects.toThrow(SaveContractError);
    }
    for(const save of mutants)await expect(restoreCampaign2Run(c.source,{save,orderedInputs:c.input.orderedInputs})).rejects.toThrow();expect(spy).not.toHaveBeenCalled();
  }finally{spy.mockRestore();}
  expect(c.run.save()).toEqual(c.save);
});
it('FCT-E/REG: restored untouched values and retained-time bounds validate before construction',async()=>{
  const c=await checkpoint(),saved=rec(decodeCampaign2(c.save),132n),state=restoreAuthoritativeState(f(saved,5n));
  const mutate=(field:bigint,value:CanonicalValue)=>edit(c.save,5n,new AuthoritativeState(state.entries().map(e=>e.path.rootStateTypeId===302n&&e.path.fieldId===field?{...e,value}:e)).canonicalValue());
  const spy=vi.spyOn(runtimeModule,'createAdaptationRuntime');
  try{
    await expect(restoreCampaign2Run(c.source,{save:mutate(1n,r('ToleranceValue',{Magnitude:unsigned(0)})),orderedInputs:c.input.orderedInputs})).rejects.toThrow();
    await expect(restoreCampaign2Run(c.source,{save:mutate(3n,r('RegulatoryAdaptationValue',{Magnitude:signed(100)})),orderedInputs:c.input.orderedInputs})).rejects.toThrow();
    expect(spy).not.toHaveBeenCalled();
  }finally{spy.mockRestore();}
});
it('FCT-A/E: changed model and missing original inputs cannot be substituted on restore',async()=>{
  const c=await checkpoint(),source=firstModelCandidate();source.parameters=enc(list([orderingParametersValue(101n)]));
  await expect(restoreCampaign2Run(source,{save:c.save,orderedInputs:c.input.orderedInputs})).rejects.toThrow(/ModelIdentity/);
  const manifest=items(decodeCampaign2(c.input.orderedInputs),'list');
  await expect(restoreCampaign2Run(c.source,{save:c.save,orderedInputs:enc(list(manifest.slice(1)))})).rejects.toThrow(/manifest/);
  await expect(restoreCampaign2Run(c.source,{save:c.save} as {save:Uint8Array;orderedInputs:Uint8Array})).rejects.toThrow(/fields/);
});
it('failed and mid-settlement runs cannot save; failed runs retain canonical diagnostics',async()=>{
  const model=await prepareCampaign2Model(firstModelCandidate()),run=await createCampaign2Run(model,runInput(12)),before=run.snapshot();
  const settling=run.settleNextInstant();expect(()=>run.save()).toThrow();await expect(settling).rejects.toThrow();
  expect(run.snapshot().state).toEqual(before.state);expect(run.snapshot().status).toBe('Failed');expect(run.diagnostic()).toBeInstanceOf(Uint8Array);
  expect(()=>run.save()).toThrow(/active/);await expect(run.settleNextInstant()).rejects.toThrow();
});
