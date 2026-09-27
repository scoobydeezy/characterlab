import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,map,record,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {INT64_MAX} from '../substrate/time';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {candidateId as id} from '../campaign2/firstModelCandidate';
import {compileBoundedModelDeclarations} from '../campaign2/modelPackaging';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run} from '../campaign2/factory';
import {decodeCampaign2,campaign2Record as r} from '../campaign2/codecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import * as runtimeModule from '../campaign2/adaptationRuntime';
import * as ingressModule from '../campaign2/transitionIngressV04';
import * as timeModule from '../substrate/time';
import * as regModule from '../campaign2/regulatoryReference';

const variable=id(1029,'variable/fixture-regulation'),character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
function replace(v:CanonicalValue,n:bigint,value:CanonicalValue){if(typeof v==='boolean'||v.kind!=='record')throw Error('fixture');return record(v.schema,new Map([...v.fields,[n,value]]));}
function modelSource(dynamic:boolean,rate=1n,repair=false){
 const source=firstTraceModel(),slots=[...items(decodeCampaign2(source.registry),'list')];
 slots[0]=set(items(slots[0],'set').map(v=>{
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;
  if(repair&&key(f(v,1n))===key(id(1035,'rule/fixture-regulatory-displacement')))return replace(v,4n,replace(f(v,4n),6n,signed(-1)));
  if(key(f(v,1n))!==key(variable))return v;
  const registration=rec(f(v,4n),283n),reference=rec(f(registration,2n),282n);
  const changeMap=(field:bigint)=>{const value=f(reference,field);if(typeof value==='boolean'||value.kind!=='map')throw Error('fixture');return map(value.entries.map(([k,p])=>[k,field===1n?replace(p,1n,signed(80)):replace(replace(p,2n,signed(dynamic?rate:0n)),3n,unsigned(dynamic?INT64_MAX:1n))]));};
  return replace(v,4n,replace(replace(registration,1n,replace(f(registration,1n),1n,unsigned(1))),2n,replace(replace(reference,1n,changeMap(1n)),2n,changeMap(2n))));
 }));
 return {...source,registry:enc(list(slots))};
}
const state=(d:bigint)=>new AuthoritativeState(d===0n?[]:[{path:{rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey',key:r('RegulatoryAdaptationKey',{CharacterId:character,RegulatoryVariableId:variable})}]},value:r('RegulatoryAdaptationValue',{Magnitude:signed(d)})}]);

it('AD-E10: public additive displacement reaches both reference endpoints and rejects one step beyond',async()=>{
 for(const [step,validPrior,invalidPrior,expected] of [[1n,19n,20n,20n],[-1n,-79n,-80n,-80n]]){
  const source=modelSource(false,1n,step<0n),registry=source.registry.slice(),model=await prepareCampaign2Model(source),{reg}=await compileBoundedModelDeclarations(source);
  const fact=r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(1)})});
  const args=(p:bigint)=>({initialState:enc(state(p).canonicalValue()),orderedInputs:enc(list([list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,fact,list([])])])),runSeed:new Uint8Array(32)});
  const good=await createCampaign2Run(model,args(validPrior));await good.settleNextInstant();
  const entries=restoreAuthoritativeState(decodeCampaign2(good.snapshot().state)).entries();
  expect(entries.find(e=>e.path.fieldId===3n)?.value).toEqual(r('RegulatoryAdaptationValue',{Magnitude:signed(expected)}));
  expect(entries).toHaveLength(4); // Four ordinary regulatory targets; no reference/anchor state.
  expect(reg.referenceOperatingPoint(character,variable,2n)).toEqual({kind:'ReferenceValue',value:signed(80)});
  expect(reg.validateAdaptedReference(character,variable,2n,signed(expected))).toEqual({kind:'Valid'});
  const bad=await createCampaign2Run(model,args(invalidPrior)),before=bad.snapshot();
  await expect(bad.settleNextInstant()).rejects.toThrowError(expect.objectContaining({code:'ADAPTATION_REFERENCE_OUT_OF_RANGE'}));
  for(const field of ['state','outputs','trace','clock'] as const)expect(bad.snapshot()[field]).toEqual(before[field]);
  expect(source.registry).toEqual(registry);
 }
});

it('AD-E10: real domain component preserves C error mappings; public unknown-domain state is excluded earlier',async()=>{
 const source=modelSource(false),{domains}=await compileBoundedModelDeclarations(source),known=state(1n).entries()[0].path;
 for(const d of [-80n,20n])expect(()=>domains.validateMagnitude(known,d,2n)).not.toThrow();
 for(const d of [-81n,21n])expect(()=>domains.validateMagnitude(known,d,2n)).toThrowError(expect.objectContaining({code:'ADAPTATION_REFERENCE_OUT_OF_RANGE'}));
 const unknown={...known,selectors:[{kind:'mapKey' as const,key:r('RegulatoryAdaptationKey',{CharacterId:character,RegulatoryVariableId:id(1029,'variable/unknown-control')})}]};
 expect(()=>domains.validateMagnitude(unknown,1n,2n)).toThrowError(expect.objectContaining({code:'ADAPTATION_REFERENCE_UNKNOWN_VARIABLE'}));
 const unknownState=new AuthoritativeState([{path:unknown,value:r('RegulatoryAdaptationValue',{Magnitude:signed(1)})}]);
 expect(()=>domains.validateReferences(unknownState,2n)).toThrowError(expect.objectContaining({code:'ADAPTATION_REFERENCE_UNKNOWN_VARIABLE'}));
 const model=await prepareCampaign2Model(source);
 await expect(createCampaign2Run(model,{initialState:enc(unknownState.canonicalValue()),orderedInputs:enc(list([])),runSeed:new Uint8Array(32)})).rejects.toThrow(/unknown regulatory variable/);
});

it('REG-P: repeated same-T reference queries preserve the run commitment across an actual phase-140 write',async()=>{
 const source=modelSource(true),registry=source.registry.slice(),compile=regModule.compileRegulatoryReferences;
 const providers:ReturnType<typeof compile>[]=[];
 const capture=vi.spyOn(regModule,'compileRegulatoryReferences').mockImplementation((...args)=>{const p=compile(...args);providers.push(p);return p;});
 try{
  const model=await prepareCampaign2Model(source);expect(providers).toHaveLength(1);const provider=providers[0];
  const fact=r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(1)})});
  const orderedInputs=enc(list([list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,fact,list([])])]));
  const run=await createCampaign2Run(model,{initialState:enc(state(0n).canonicalValue()),orderedInputs,runSeed:new Uint8Array(32)});
  const anchors=vi.spyOn(timeModule,'materializeLinear');
  try{
   const query=()=>{
    const saved=run.save(),snapshot=run.snapshot();
    for(let i=0;i<3;i++){
     expect(provider.referenceOperatingPoint(character,variable,2n)).toEqual({kind:'ReferenceValue',value:signed(80)});
     const anchor=anchors.mock.calls.at(-1)![0];expect(anchor).toMatchObject({valueAtAnchor:80n,anchorInstant:0n,exactBoundedRemainder:0n});
     expect((anchors.mock.results.at(-1)!.value as ReturnType<typeof timeModule.materializeLinear>).exactBoundedRemainder).toBe(2n);
    }
    // Canonical save includes the queue and all allocator cursors; queries are
    // observational even when T is the impending settlement instant.
    expect(run.save()).toEqual(saved);expect(run.snapshot()).toEqual(snapshot);expect(source.registry).toEqual(registry);
   };
   query();await run.settleNextInstant();expect(run.snapshot().clock).toBe(2n);
   const d=restoreAuthoritativeState(decodeCampaign2(run.snapshot().state)).entries().find(e=>e.path.rootStateTypeId===302n&&e.path.fieldId===3n);
   expect(d?.value).toEqual(r('RegulatoryAdaptationValue',{Magnitude:signed(1)}));query();
  }finally{anchors.mockRestore();}
 }finally{capture.mockRestore();}
});

it('REG-J: signed-rate A-B-C, repeated C and A-C retain exact values, remainders and authored anchors',async()=>{
 for(const rate of [-1n,1n]){
  const source=modelSource(true,rate),before=source.registry.slice(),a=(await compileBoundedModelDeclarations(source)).reg,b=(await compileBoundedModelDeclarations(source)).reg;
  const spy=vi.spyOn(timeModule,'materializeLinear');
  try{
   const A=0n,B=1n,C=INT64_MAX-1n;
   const query=(provider:typeof a,at:bigint)=>{
    const result=provider.referenceOperatingPoint(character,variable,at);
    const call=spy.mock.calls.at(-1)!,materialized=spy.mock.results.at(-1)!.value as ReturnType<typeof timeModule.materializeLinear>;
    expect(call[0]).toMatchObject({valueAtAnchor:80n,anchorInstant:0n,exactBoundedRemainder:0n});
    // All tested positive times are below TIME Scale: negative rate floors to -1.
    const expected=rate<0n&&at>0n?79n:80n,remainder=rate<0n&&at>0n?INT64_MAX-at:at;
    expect(result).toEqual({kind:'ReferenceValue',value:signed(expected)});
    expect(materialized.value).toBe(expected);expect(materialized.exactBoundedRemainder).toBe(remainder);
    return materialized;
   };
   query(a,A);query(a,B);const throughB=query(a,C);expect(query(a,C)).toEqual(throughB);
   query(b,A);expect(query(b,C)).toEqual(throughB);expect(spy).toHaveBeenCalledTimes(6);
   expect(source.registry).toEqual(before);
  }finally{spy.mockRestore();}
 }
});

it('REG-I/L: paired D histories share the provider; dynamic same-clock restore retains state, reference validation and anchors',async()=>{
 for(const dynamic of [false,true]){
  const source=modelSource(dynamic),before=source.registry.slice(),model=await prepareCampaign2Model(source),{reg}=await compileBoundedModelDeclarations(source);
  const fact=r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(0)})});
  const orderedInputs=enc(list([list([signed(1),unsigned(110),AUTHORED_FACT_EVENT,fact,list([])])]));
  for(const d of [0n,10n]){
   const originalState=enc(state(d).canonicalValue()),run=await createCampaign2Run(model,{initialState:originalState,orderedInputs,runSeed:new Uint8Array(32)});
   const atZero=reg.referenceOperatingPoint(character,variable,run.snapshot().clock);expect(atZero).toEqual({kind:'ReferenceValue',value:signed(80)});
   const retained=restoreAuthoritativeState(decodeCampaign2(run.snapshot().state)).entries();const actualD=retained.length?(f(rec(retained[0].value,299n),1n) as {value:bigint}).value:0n;
   expect(atZero.kind==='ReferenceValue'&&(atZero.value as {value:bigint}).value+actualD).toBe(d===0n?80n:90n);
   await run.settleNextInstant();expect(run.snapshot().state).toEqual(originalState);
   const save=run.save(),clock=run.snapshot().clock,reference=reg.referenceOperatingPoint(character,variable,clock),validation=reg.validateAdaptedReference(character,variable,clock,signed(d));
   const spy=vi.spyOn(timeModule,'materializeLinear');
   try{
    const restored=await restoreCampaign2Run(source,{save,orderedInputs});
    expect(restored.save()).toEqual(save);expect(restored.snapshot()).toEqual(run.snapshot());
    expect(spy.mock.calls.length).toBeGreaterThan(0);
    for(const [anchor] of spy.mock.calls)expect(anchor).toMatchObject({valueAtAnchor:80n,anchorInstant:0n,exactBoundedRemainder:0n});
    expect(reg.referenceOperatingPoint(character,variable,restored.snapshot().clock)).toEqual(reference);
    expect(reg.validateAdaptedReference(character,variable,restored.snapshot().clock,signed(d))).toEqual(validation);
    expect(await restored.settleNextInstant()).toBe(false);expect(restored.save()).toEqual(save);
   }finally{spy.mockRestore();}
  }
  expect(source.registry).toEqual(before);
 }
});

it('REG-F/G/H/K: exact Scale=1 endpoints, independent displacement and 80-to-81 time witness',async()=>{
 for(const dynamic of [false,true]){
  const source=modelSource(dynamic),before=source.registry.slice(),{reg}=await compileBoundedModelDeclarations(source);
  for(const d of [-81n,21n,30n])expect(reg.validateAdaptedReference(character,variable,0n,signed(d))).toEqual({kind:'Failure',code:'REG_ADAPTED_REFERENCE_OUT_OF_RANGE'});
  for(const d of [-80n,-30n,20n])expect(reg.validateAdaptedReference(character,variable,0n,signed(d))).toEqual({kind:'Valid'});
  for(const d of [0n,10n]){
   expect(reg.validateAdaptedReference(character,variable,0n,signed(d))).toEqual({kind:'Valid'});
   expect(reg.referenceOperatingPoint(character,variable,0n)).toEqual({kind:'ReferenceValue',value:signed(80)});
  }
  for(const at of [0n,INT64_MAX-1n,INT64_MAX,INT64_MAX,0n])expect(reg.referenceOperatingPoint(character,variable,at)).toEqual({kind:'ReferenceValue',value:signed(dynamic&&at===INT64_MAX?81:80)});
  expect(source.registry).toEqual(before);
 }
});

it('REG-O: retained D=20 fails at the first instant hook with complete rollback and at saved-time restore before construction',async()=>{
 const source=modelSource(true),model=await prepareCampaign2Model(source),{reg}=await compileBoundedModelDeclarations(source);
 expect(reg.validateAdaptedReference(character,variable,0n,signed(20))).toEqual({kind:'Valid'});
 expect(reg.validateAdaptedReference(character,variable,INT64_MAX,signed(20))).toEqual({kind:'Failure',code:'REG_ADAPTED_REFERENCE_OUT_OF_RANGE'});
 const fact=r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(0)})});
 const orderedInputs=enc(list([list([signed(INT64_MAX),unsigned(110),AUTHORED_FACT_EVENT,fact,list([])])]));
 const original=runtimeModule.createAdaptationRuntime;let captured:ReturnType<typeof original>|undefined;
 const capture=vi.spyOn(runtimeModule,'createAdaptationRuntime').mockImplementation((...args)=>{captured=original(...args);return captured;});
 const ingress=vi.spyOn(ingressModule,'beginTransitionIngressV04');
 try{
  const run=await createCampaign2Run(model,{initialState:enc(state(20n).canonicalValue()),orderedInputs,runSeed:new Uint8Array(32)}),before=captured!.snapshot();
  await expect(run.settleNextInstant()).rejects.toThrowError(expect.objectContaining({code:"ADAPTATION_REFERENCE_OUT_OF_RANGE"}));const after=captured!.snapshot();
  expect(ingress).not.toHaveBeenCalled();expect(after.status).toBe('Failed');
  expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));
  for(const field of ['clock','queue','allocators','outputs','committedTrace'] as const)expect(after[field]).toEqual(before[field]);
  expect(run.diagnostic()).toBeInstanceOf(Uint8Array);expect(()=>run.save()).toThrow();
 }finally{ingress.mockRestore();capture.mockRestore();}
 const emptyInputs=enc(list([])),valid=await createCampaign2Run(model,{initialState:enc(state(20n).canonicalValue()),orderedInputs:emptyInputs,runSeed:new Uint8Array(32)}),save=valid.save();
 const late=enc(replace(rec(decodeCampaign2(save),132n),4n,signed(INT64_MAX)));
 const construction=vi.spyOn(runtimeModule,'createAdaptationRuntime');
 try{await expect(restoreCampaign2Run(source,{orderedInputs:emptyInputs,save:late})).rejects.toThrowError(expect.objectContaining({code:"ADAPTATION_REFERENCE_OUT_OF_RANGE"}));expect(construction).not.toHaveBeenCalled();}finally{construction.mockRestore();}
 expect(valid.save()).toEqual(save);
});

it('AC-H: a committed repairing rule cannot bypass time-only invalidity before handlers',async()=>{
 const source=modelSource(true,1n,true),model=await prepareCampaign2Model(source);
 const fact=r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(1)})});
 const input=(at:bigint)=>({initialState:enc(state(20n).canonicalValue()),orderedInputs:enc(list([list([signed(at),unsigned(110),AUTHORED_FACT_EVENT,fact,list([])])])),runSeed:new Uint8Array(32)});
 const positive=await createCampaign2Run(model,input(INT64_MAX-1n));await positive.settleNextInstant();
 const displacement=restoreAuthoritativeState(decodeCampaign2(positive.snapshot().state)).entries().find(e=>e.path.fieldId===3n)!;
 expect(displacement.value).toEqual(r('RegulatoryAdaptationValue',{Magnitude:signed(19)}));
 const original=runtimeModule.createAdaptationRuntime;let captured:ReturnType<typeof original>|undefined;
 const capture=vi.spyOn(runtimeModule,'createAdaptationRuntime').mockImplementation((...args)=>{captured=original(...args);return captured;});
 const ingress=vi.spyOn(ingressModule,'beginTransitionIngressV04');
 try{
  const run=await createCampaign2Run(model,input(INT64_MAX)),before=captured!.snapshot();
  await expect(run.settleNextInstant()).rejects.toThrowError(expect.objectContaining({code:'ADAPTATION_REFERENCE_OUT_OF_RANGE'}));
  expect(ingress).not.toHaveBeenCalled();const after=captured!.snapshot();expect(after.status).toBe('Failed');
  expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));
  for(const field of ['clock','queue','allocators','outputs','committedTrace'] as const)expect(after[field]).toEqual(before[field]);
 }finally{ingress.mockRestore();capture.mockRestore();}
});
