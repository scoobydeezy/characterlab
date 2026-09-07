import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,signed,unsigned} from '../substrate/canonicalEncoding';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {prepareCampaign2Model,createCampaign2Run} from '../campaign2/factory';
import {campaign2Record as r} from '../campaign2/codecs';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import * as ingressModule from '../campaign2/transitionIngressV04';
import * as runtimeModule from '../campaign2/adaptationRuntime';
import * as traceModule from '../substrate/trace';

it.each(['after-E-allocation','after-E-child-binding','after-L-allocation','final-trace-validation'] as const)(
 'EVID-N: %s rolls back state, queue, allocators, outputs, trace and clock through the factory',async(fault)=>{
 const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
 const orderedInputs=enc(list([list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(2)})}),list([])])]));
 const model=await prepareCampaign2Model(firstTraceModel()),originalRuntime=runtimeModule.createAdaptationRuntime,originalIngress=ingressModule.beginTransitionIngressV04,originalTrace=traceModule.traceRecordValue;
 let captured:ReturnType<typeof originalRuntime>|undefined,allocated=0,completions=0,injected=0;
 const runtimeSpy=vi.spyOn(runtimeModule,'createAdaptationRuntime').mockImplementation((...args)=>{captured=originalRuntime(...args);return captured;});
 const ingressSpy=vi.spyOn(ingressModule,'beginTransitionIngressV04').mockImplementation((...args)=>{
  const ingress=originalIngress(...args);
  return {...ingress,allocateEvidIdentity(token,allocator){
   const identity=ingress.allocateEvidIdentity(token,allocator);allocated++;
   if((fault==='after-E-allocation'&&allocated===1)||(fault==='after-L-allocation'&&allocated===2)){injected++;throw Error(fault);}return identity;
  },completeEvid(...args){
   const plan=ingress.completeEvid(...args);completions++;
   if(fault==='after-E-child-binding'&&completions===1)return {...plan,bindAllocatedChildren(children){plan.bindAllocatedChildren(children);expect(children).toHaveLength(1);injected++;throw Error(fault);}};
   return plan;
  }};
 });
 const traceSpy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(value=>{
  if(fault==='final-trace-validation'&&value.event.phase===140n){injected++;throw Error(fault);}return originalTrace(value);
 });
 try{
  const run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)}),before=captured!.snapshot();
  const code=fault==='after-E-child-binding'||fault==='final-trace-validation'?'TRACE_VALIDATION_FAILURE':'TRANSITION_FAILURE';
  await expect(run.settleNextInstant()).rejects.toMatchObject({code});const after=captured!.snapshot();
  expect(injected).toBe(1);expect(allocated).toBe(fault==='after-E-allocation'||fault==='after-E-child-binding'?1:2);
  expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));
  expect(after.queue).toEqual(before.queue);expect(after.allocators).toEqual(before.allocators);expect(after.outputs).toEqual(before.outputs);expect(after.committedTrace).toEqual(before.committedTrace);expect(after.clock).toBe(before.clock);
  expect(run.diagnostic()).toBeInstanceOf(Uint8Array);expect(()=>run.save()).toThrow();
 }finally{traceSpy.mockRestore();ingressSpy.mockRestore();runtimeSpy.mockRestore();}
});
