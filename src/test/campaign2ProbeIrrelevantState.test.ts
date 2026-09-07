import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,signed,unsigned,text,typedIdentifier} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {probeModelReviewSource} from '../campaign2/probeModelReview';
import {PROBE_SUCCESSOR_RULES} from '../campaign2/probeSuccessorReview';
import {prepareCampaign2Model,createCampaign2Run} from '../campaign2/factory';
import {probeRecord,decodeProbeReview} from '../campaign2/probeCodecs';
import {campaign2Record as r} from '../campaign2/codecs';
import {PROBE_SOURCE_EVENT} from '../campaign2/orderedInputs';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
const id=(ns:number,s:string)=>typedIdentifier(ns,text(s));
it('PROBE-C/L public model: varying each other persistent map leaves probe outputs identical and all state byte-identical',async()=>{
 const model=await prepareCampaign2Model({...probeModelReviewSource(),rulesVersion:PROBE_SUCCESSOR_RULES});
 const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject')),V=id(1029,'variable/fixture-regulation');
 const keys=[r('ToleranceKey',{CharacterId:C,ExposureReferentId:C,RegulatoryVariableId:V}),r('SensitizationKey',{CharacterId:C,ExposureReferentId:C,RegulatoryVariableId:V}),r('RegulatoryAdaptationKey',{CharacterId:C,RegulatoryVariableId:V}),r('AccumulatedLoadKey',{CharacterId:C,LoadDomainId:id(1033,'load/fixture-load')}),r('ProceduralCompetenceKey',{CharacterId:C,ProcedureId:id(1034,'procedure/fixture-practice')})];
 const names=['ToleranceValue','SensitizationValue','RegulatoryAdaptationValue','AccumulatedLoadValue','ProceduralCompetenceValue'] as const;
 const orderedInputs=enc(list([list([signed(4),unsigned(110),PROBE_SOURCE_EVENT,probeRecord(333,[id(1027,'definition/regulatory-diagnostic-probe')]),list([])])]));
 const results=[];
 for(const changed of [-1,0,1,3,4]){
  const state=new AuthoritativeState(keys.map((key,i)=>({path:{rootStateTypeId:i===4?303n:302n,fieldId:BigInt(i===4?1:i+1),selectors:[{kind:'mapKey' as const,key}]},value:r(names[i],{Magnitude:i===2?signed(1):unsigned(i===changed?2:1)})}))),bytes=enc(state.canonicalValue());
  const run=await createCampaign2Run(model,{initialState:bytes,orderedInputs,runSeed:new Uint8Array(32)});await run.settleNextInstant();
  expect(run.snapshot().state).toEqual(bytes);results.push(run.snapshot().outputs);
  const trace=rec(items(decodeProbeReview(run.snapshot().trace),'list')[0],160n),field=trace.schema.fields.find(f=>f.name==='ActualReadRecords')!;
  const reads=items(f(trace,field.id),'list');expect(reads).toHaveLength(1);
  expect(f(rec(reads[0],147n),4n)).toEqual(r('RegulatoryAdaptationValue',{Magnitude:signed(1)}));
 }
 for(const value of results)expect(value).toEqual(results[0]);
});
