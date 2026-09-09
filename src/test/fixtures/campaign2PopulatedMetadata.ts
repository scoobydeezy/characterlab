/** Qualification assay: state identities do not imply addressable random consumers. */
import {canonicalEncode as enc,list,signed} from '../../substrate/canonicalEncoding';
import {AuthoritativeState} from '../../substrate/state';
import {firstTraceModel} from '../../campaign2/firstTraceModel';
import {candidateId as id} from '../../campaign2/firstModelCandidate';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run} from '../../campaign2/factory';
import {decodeCampaign2,campaign2Record as r} from '../../campaign2/codecs';
import {dataRecord as rec,dataField as f,dataKey as key} from '../../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../../substrate/referentOrigin';
import {governedContentDefinitionId} from '../../substrate/contentDefinitionId';

export async function populatedMetadata(){
 const source=firstTraceModel(),orderedInputs=enc(list([]));
 const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
 const state=new AuthoritativeState([{path:{rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey',key:r('RegulatoryAdaptationKey',{CharacterId:character,RegulatoryVariableId:id(1029,'variable/fixture-regulation')})}]},value:r('RegulatoryAdaptationValue',{Magnitude:signed(1)})}]);
 const run=await createCampaign2Run(await prepareCampaign2Model(source),{initialState:enc(state.canonicalValue()),orderedInputs,runSeed:new Uint8Array(32)});
 const save=run.save(),value=rec(decodeCampaign2(save),132n);
 const cases=[8n,9n,10n].map(field=>({name:`populated-state/metadata-${field}`,agrees:key(f(value,field))===key(list([]))}));
 try{const restored=await restoreCampaign2Run(source,{orderedInputs,save});cases.push({name:'populated-state/exact-restore',agrees:key(decodeCampaign2(restored.save()))===key(value)});}
 catch{cases.push({name:'populated-state/exact-restore',agrees:false});}
 return cases;
}
