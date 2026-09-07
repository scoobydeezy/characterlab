import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,set,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {prepareCampaign2Model,createCampaign2Run} from '../campaign2/factory';
import {decodeCampaign2,campaign2Record as r} from '../campaign2/codecs';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
it('PHEN-ADAPT control 9 scope: the fixed bridge cannot reveal retained adaptation through a later matched pulse',async()=>{
 const model=await prepareCampaign2Model(firstTraceModel()),character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject')),results=[];
 for(const count of [0,1]){
  const event=(at:number,n:number)=>list([signed(at),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(n)})}),list([])]);
  const run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:enc(list([event(2,count),event(4,0)])),runSeed:new Uint8Array(32)});
  await run.settleNextInstant();const first=run.snapshot().state;
  await run.settleNextInstant();const snapshot=run.snapshot(),outputs=items(decodeCampaign2(snapshot.outputs),'list');expect(snapshot.state).toEqual(first);
  const safe:CanonicalValue[]=[];for(const type of [203n,227n,269n,270n]){const values=outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);expect(values).toHaveLength(2);safe.push(values[1]);}
  results.push({state:snapshot.state,laterSafe:enc(list(safe)),allocators:enc(f(rec(decodeCampaign2(run.save()),132n),6n))});
 }
 expect(results[0].state).not.toEqual(results[1].state);expect(results[0].laterSafe).toEqual(results[1].laterSafe);expect(results[0].allocators).toEqual(results[1].allocators);
});
