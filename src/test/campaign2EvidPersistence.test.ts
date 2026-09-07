import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,signed,unsigned,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {candidateId} from '../campaign2/firstModelCandidate';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run} from '../campaign2/factory';
import {decodeCampaign2,campaign2Record as r} from '../campaign2/codecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import {SaveContractError} from '../substrate/persistence';
import * as runtimeModule from '../campaign2/adaptationRuntime';
import * as phases from '../semanticBinding/phaseOrdering';

const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
const replace=(value:CanonicalValue,field:bigint,item:CanonicalValue)=>{if(typeof value==='boolean'||value.kind!=='record')throw Error('fixture');return record(value.schema,new Map([...value.fields,[field,item]]));};
const initial={initialState:enc(set([])),runSeed:new Uint8Array(32)};
const fact=r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(0)})});
const entry=(at:number,payload:CanonicalValue=fact,event:CanonicalValue=AUTHORED_FACT_EVENT,phase=110)=>list([signed(at),unsigned(phase),event,payload,list([])]);
const outputRecords=(bytes:Uint8Array,type:bigint)=>items(decodeCampaign2(bytes),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);

it('EVID-M: empty first-profile input creates no reservation or evidence across restore; zero count still emits E/L',async()=>{
 const source=firstTraceModel(),model=await prepareCampaign2Model(source),orderedInputs=enc(list([]));
 const spy=vi.spyOn(phases,'admitObservationLane');
 try{
  const run=await createCampaign2Run(model,{...initial,orderedInputs}),before=run.save();
  expect(await run.settleNextInstant()).toBe(false);expect(run.save()).toEqual(before);
  const restored=await restoreCampaign2Run(source,{save:before,orderedInputs});
  expect(restored.save()).toEqual(before);expect(await restored.settleNextInstant()).toBe(false);
  expect(restored.save()).toEqual(before);expect(restored.snapshot().outputs).toEqual(enc(list([])));expect(restored.snapshot().trace).toEqual(enc(list([])));
  expect(spy).not.toHaveBeenCalled();
  const positive=await createCampaign2Run(model,{...initial,orderedInputs:enc(list([entry(2)]))});
  expect(await positive.settleNextInstant()).toBe(true);expect(spy).toHaveBeenCalledTimes(1);
  expect(spy.mock.calls[0][0]).toMatchObject({lane:'Consequence',emitsCharacterAccessibleEvidence:true});
  for(const type of [227n,269n,270n])expect(outputRecords(positive.snapshot().outputs,type)).toHaveLength(1);
  expect(positive.snapshot().state).toEqual(initial.initialState);
 }finally{spy.mockRestore();}
});

it('EVID-O: actual archived E/L cannot become initial or restored pending work; legitimate continuation retains exact IDs',async()=>{
 const source=firstTraceModel(),model=await prepareCampaign2Model(source),orderedInputs=enc(list([entry(2),entry(4)]));
 const run=await createCampaign2Run(model,{...initial,orderedInputs});await run.settleNextInstant();
 const save=run.save(),saved=rec(decodeCampaign2(save),132n),pending=items(f(saved,7n),'list')[0];
 const archived=[269n,270n].map(type=>{const values=outputRecords(run.snapshot().outputs,type);expect(values).toHaveLength(1);return values[0];});
 const spy=vi.spyOn(runtimeModule,'createAdaptationRuntime');
 try{
  for(const [index,payload] of archived.entries())for(const disguised of [false,true]){
   const event=disguised?AUTHORED_FACT_EVENT:candidateId(1001,index===0?'event/outcome-evaluation':'event/outcome-learning-evidence'),phase=disguised?110:130;
   // Preserve otherwise-valid future event IDs, time, dependencies and allocator bounds.
   const forged=replace(replace(replace(pending,3n,unsigned(phase)),5n,event),6n,payload);
   const badSave=enc(replace(saved,7n,list([forged])));
   await expect(restoreCampaign2Run(source,{save:badSave,orderedInputs})).rejects.toBeInstanceOf(SaveContractError);
   await expect(createCampaign2Run(model,{...initial,orderedInputs:enc(list([entry(4,payload,event,phase)]))})).rejects.toThrow();
  }
  expect(spy).not.toHaveBeenCalled();expect(run.save()).toEqual(save);
 }finally{spy.mockRestore();}
 const restored=await restoreCampaign2Run(source,{save,orderedInputs});expect(restored.save()).toEqual(save);
 // Restore preserves the saved archive without treating it as executable input.
 expect(restored.snapshot()).toEqual(run.snapshot());
 await run.settleNextInstant();await restored.settleNextInstant();expect(restored.save()).toEqual(run.save());
 for(const [index,type] of [269n,270n].entries()){
  const resumed=outputRecords(restored.snapshot().outputs,type),uninterrupted=outputRecords(run.snapshot().outputs,type);
  expect(resumed).toHaveLength(2);expect(uninterrupted).toHaveLength(2);expect(enc(list(resumed))).toEqual(enc(list(uninterrupted)));
  expect(enc(resumed[0])).toEqual(enc(archived[index]));
  expect(f(rec(resumed[1],type),1n)).not.toEqual(f(rec(archived[index],type),1n));
 }
 expect(await restored.settleNextInstant()).toBe(false);
});
