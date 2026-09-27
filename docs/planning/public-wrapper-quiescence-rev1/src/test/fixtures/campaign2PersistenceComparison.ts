import {canonicalEncode as enc,list,map,record,signed,unsigned} from '../../substrate/canonicalEncoding';
import {AuthoritativeState} from '../../substrate/state';
import {INT64_MAX} from '../../substrate/time';
import {firstTraceModel} from '../../campaign2/firstTraceModel';
import {candidateId as id} from '../../campaign2/firstModelCandidate';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run} from '../../campaign2/factory';
import {decodeCampaign2,campaign2Record as r} from '../../campaign2/codecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../../substrate/referentOrigin';
import {governedContentDefinitionId} from '../../substrate/contentDefinitionId';
export async function comparePersistenceDerivations(runtimeConstructionCount?:()=>number){
 const source=firstTraceModel(),orderedInputs=enc(list([])),initialState=enc(new AuthoritativeState([]).canonicalValue());
 const model=await prepareCampaign2Model(source),run=await createCampaign2Run(model,{initialState,orderedInputs,runSeed:new Uint8Array(32)}),cases=[];
 let save:Uint8Array;
 try{save=run.save();}catch(e){return [{name:'save-empty-metadata',agrees:false,error:(e as Error).message}];}
 const saved=rec(decodeCampaign2(save),132n);
 for(const field of [8n,9n,10n])cases.push({name:`save-metadata/${field}`,agrees:key(f(saved,field))===key(list([]))});
 try{const restored=await restoreCampaign2Run(source,{orderedInputs,save});cases.push({name:'restore-valid-exact',agrees:key(decodeCampaign2(restored.save()))===key(saved)});}catch(e){cases.push({name:'restore-valid-exact',agrees:false,error:(e as Error).message});}
 // Saved-time admission witness: R0 rises from 99 to 100; unchanged D=1 becomes invalid.
 const slots=[...items(decodeCampaign2(source.registry),'list')];
 slots[0]={...slots[0] as Extract<typeof slots[0],{kind:'set'}>,items:items(slots[0],'set').map(v=>{
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n||key(f(v,1n))!==key(id(1029,'variable/fixture-regulation')))return v;
  const registration=rec(f(v,4n),283n),reference=rec(f(registration,2n),282n);
  const transformMap=(field:bigint)=>{const m=f(reference,field);if(typeof m==='boolean'||m.kind!=='map')throw Error('map');return map(m.entries.map(([k,value])=>{
   const p=rec(value,field===1n?121n:120n),fields=new Map(p.fields);
   if(field===1n)fields.set(1n,signed(99));else{fields.set(2n,signed(1));fields.set(3n,unsigned(INT64_MAX));}
   return [k,record(p.schema,fields)];
  }));};
  return record(v.schema,new Map([...v.fields,[4n,record(registration.schema,new Map([...registration.fields,[2n,record(reference.schema,new Map([[1n,transformMap(1n)],[2n,transformMap(2n)]]))]]))]]));
 })};
 const dynamic={...source,registry:enc(list(slots))},character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
 const state=new AuthoritativeState([{path:{rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey',key:r('RegulatoryAdaptationKey',{CharacterId:character,RegulatoryVariableId:id(1029,'variable/fixture-regulation')})}]},value:r('RegulatoryAdaptationValue',{Magnitude:signed(1)})}]);
 const dynamicRun=await createCampaign2Run(await prepareCampaign2Model(dynamic),{initialState:enc(state.canonicalValue()),orderedInputs,runSeed:new Uint8Array(32)});
 const boundary=rec(decodeCampaign2(dynamicRun.save()),132n),late=enc(record(boundary.schema,new Map([...boundary.fields,[4n,signed(INT64_MAX)]])));
 const constructionsBefore=runtimeConstructionCount?.();
 let rejected=false;try{await restoreCampaign2Run(dynamic,{orderedInputs,save:late});}catch{rejected=true;}
 const constructionsAfter=runtimeConstructionCount?.();
 cases.push({name:'retained-time-rejects-unchanged-displacement',agrees:rejected&&constructionsBefore===constructionsAfter,constructionsBefore,constructionsAfter});
 return cases;
}
