import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {candidateId as id} from '../campaign2/firstModelCandidate';
import {prepareCampaign2Model,createCampaign2Run} from '../campaign2/factory';
import {campaign2Record as r,decodeCampaign2} from '../campaign2/codecs';
import {dataItems as items,dataField as f,dataRecord as rec} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import * as ingressModule from '../campaign2/transitionIngressV04';
const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
const args=(practice=false)=>({initialState:enc(set([])),runSeed:new Uint8Array(32),orderedInputs:enc(list([list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:practice?r('ProceduralPracticeFact',{CharacterId:C,ProcedureId:id(1034,'procedure/fixture-practice'),CompletedRepetitions:unsigned(1)}):r('RegulatoryExposureFact',{CharacterId:C,ExposureReferentId:C,ActualContactCount:unsigned(1)})}),list([])])]))});
it.each(['event/regulatory-adaptation','event/procedural-adaptation','event/outcome-evaluation','event/outcome-learning-evidence'])('AD-E11 rejects opposite-route input at %s',async target=>{
 const input=args(target==='event/procedural-adaptation'),model=await prepareCampaign2Model(firstTraceModel()),good=await createCampaign2Run(model,input);await good.settleNextInstant();
 const outputs=items(decodeCampaign2(good.snapshot().outputs),'list');
 const opposite=outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===(target.includes('adaptation')?270n:307n))!;
 expect(opposite).toBeDefined();
 const original=ingressModule.beginTransitionIngressV04;let challenged=0;
 const spy=vi.spyOn(ingressModule,'beginTransitionIngressV04').mockImplementation((...xs)=>{
  const ingress=original(...xs);return {...ingress,admit(event){
   const name=(event.eventTypeId.payload as {value:string}).value;
   if(name===target){
    challenged++;return ingress.admit({...event,payload:opposite as CanonicalValue});
   }return ingress.admit(event);
  }};
 });
 try{
  const run=await createCampaign2Run(model,input),before=run.snapshot();
  await expect(run.settleNextInstant()).rejects.toThrowError(expect.objectContaining({code:'INPUT_NOT_ADMITTED'}));
  expect(challenged).toBe(1);
  for(const field of ['state','outputs','trace','clock'] as const)expect(run.snapshot()[field]).toEqual(before[field]);
 }finally{spy.mockRestore();}
});
it('AD-E11 extra zero-count history changes occurrence ancestry without changing later adaptation',async()=>{
 const model=await prepareCampaign2Model(firstTraceModel()),base=args(),entry=items(decodeCampaign2(base.orderedInputs),'list')[0];
 const zero=list([signed(1),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:C,ExposureReferentId:C,ActualContactCount:unsigned(0)})}),list([])]);
 const ordinary=await createCampaign2Run(model,base),shifted=await createCampaign2Run(model,{...base,orderedInputs:enc(list([zero,entry]))});
 await shifted.settleNextInstant();expect(shifted.snapshot().state).toEqual(base.initialState);
 await ordinary.settleNextInstant();await shifted.settleNextInstant();expect(ordinary.snapshot().state).toEqual(shifted.snapshot().state);
 const last=(run:typeof ordinary)=>rec(items(decodeCampaign2(run.snapshot().trace),'list').at(-1)!,160n);
 const a=last(ordinary),b=last(shifted);
 expect(f(a,4n)).not.toEqual(f(b,4n)); // Genuine different event IDs / parent ancestry.
 expect(f(a,16n)).toEqual(f(b,16n)); // Exact same ADAPT patch, not selected magnitudes only.
});
