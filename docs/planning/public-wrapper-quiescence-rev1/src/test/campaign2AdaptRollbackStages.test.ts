import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,record,signed,unsigned} from '../substrate/canonicalEncoding';
import {ContractReadProjection} from '../substrate/state';
import {orderingParametersValue} from '../substrate/scheduler';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {candidateId as id} from '../campaign2/firstModelCandidate';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run} from '../campaign2/factory';
import {campaign2Record as r,decodeCampaign2} from '../campaign2/codecs';
import {dataItems as items,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import * as runtimeModule from '../campaign2/adaptationRuntime';
import * as evaluatorModule from '../campaign2/adaptationEvaluation';
import * as traceModule from '../substrate/trace';
it.each(['after-reads','later-out-of-range','after-staged-outputs','after-patch-union','final-trace','work-limit'])('AD-E12 %s restores the complete public instant',async fault=>{
 const source=firstTraceModel();
 if(fault==='work-limit')source.parameters=enc(list([orderingParametersValue(8n)]));
 if(fault==='later-out-of-range'){
  const slots=[...items(decodeCampaign2(source.registry),'list')];slots[0]=set(items(slots[0],'set').map(v=>{
   if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n||key(f(v,1n))!==key(id(1035,'rule/fixture-accumulated-load')))return v;
   const rule=f(v,4n);if(typeof rule==='boolean'||rule.kind!=='record')throw Error('rule');
   return record(v.schema,new Map([...v.fields,[4n,record(rule.schema,new Map([...rule.fields,[6n,signed(11)]]))]]));
  }));source.registry=enc(list(slots));
 }
 const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
 const orderedInputs=enc(list([2,4].map(at=>list([signed(at),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:C,ExposureReferentId:C,ActualContactCount:unsigned(1)})}),list([])]))));
 const args={initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)};
 const original=runtimeModule.createAdaptationRuntime,compile=evaluatorModule.compileAdaptationEvaluator,actual=ContractReadProjection.prototype.actualReadRecords,trace=traceModule.traceRecordValue;
 let captured:ReturnType<typeof original>|undefined,readSegments=0,injected=0,save:Uint8Array|undefined;
 const capture=vi.spyOn(runtimeModule,'createAdaptationRuntime').mockImplementation((...xs)=>{captured=original(...xs);return captured;});
 const reads=vi.spyOn(ContractReadProjection.prototype,'actualReadRecords').mockImplementation(function(this:ContractReadProjection<Record<string,import('../substrate/state').ProjectionBinding>>){
  const result=actual.call(this);readSegments++;if(fault==='after-reads'){injected++;throw Error(fault);}return result;
 });
 const evaluate=vi.spyOn(evaluatorModule,'compileAdaptationEvaluator').mockImplementation((...xs)=>{
  const e=compile(...xs);return {...e,prepare(...xs){const p=e.prepare(...xs);return {...p,begin(...xs){const b=p.begin(...xs);return {...b,
   execute(...xs){const result=b.execute(...xs);if(fault==='after-staged-outputs'){expect(result.outputs).toHaveLength(5);injected++;throw Error(fault);}return result;},
   finish(){const result=b.finish();if(fault==='after-patch-union'){expect(result.state.entries()).toHaveLength(4);injected++;throw Error(fault);}return result;},
  };}};}};
 });
 const tracing=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(v=>{if(fault==='final-trace'&&v.event.phase===140n){injected++;throw Error(fault);}return trace(v);});
 try{
  const run=await createCampaign2Run(await prepareCampaign2Model(source),args),before=captured!.snapshot();save=run.save();
  const code=fault==='later-out-of-range'?'ADAPTATION_MAGNITUDE_OUT_OF_RANGE':fault==='final-trace'?'TRACE_VALIDATION_FAILURE':fault==='work-limit'?'CASCADE_LIMIT_EXCEEDED':'TRANSITION_FAILURE';
  await expect(run.settleNextInstant()).rejects.toThrowError(expect.objectContaining({code}));
  if(fault==='later-out-of-range'){expect(readSegments).toBeGreaterThan(1);expect(run.diagnostic()).toBeInstanceOf(Uint8Array);}else if(fault!=='work-limit')expect(injected).toBe(1);
  const after=captured!.snapshot();expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));
  for(const field of ['clock','queue','allocators','outputs','committedTrace'] as const)expect(after[field]).toEqual(before[field]);
  expect(()=>run.save()).toThrow();expect(before.queue.length).toBe(2);
 }finally{tracing.mockRestore();evaluate.mockRestore();reads.mockRestore();capture.mockRestore();}
 if(fault!=='later-out-of-range'&&fault!=='work-limit'){
  const resumed=await restoreCampaign2Run(source,{save:save!,orderedInputs}),clean=await createCampaign2Run(await prepareCampaign2Model(source),args);
  for(let i=0;i<2;i++){await resumed.settleNextInstant();await clean.settleNextInstant();expect(resumed.save()).toEqual(clean.save());}
 }
});
