import {canonicalEncode as enc,unsigned} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {candidateId} from '../campaign2/firstModelCandidate';
import {decodeCampaign2,campaign2Record as r} from '../campaign2/codecs';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {toleranceInputs,toleranceInitial,toleranceKey} from './toleranceFixtures';
export const absenceInputs=toleranceInputs;
const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
export const displacementKey=r('RegulatoryAdaptationKey',{CharacterId:character,RegulatoryVariableId:candidateId(1029,'variable/fixture-regulation')});
export const otherDisplacementKey=r('RegulatoryAdaptationKey',{CharacterId:character,RegulatoryVariableId:candidateId(1029,'variable/unadapted-control')});
export function absenceInitial(other=false){
 if(!other)return toleranceInitial();
 const entries=restoreAuthoritativeState(decodeCampaign2(toleranceInitial(true))).entries().filter(e=>e.path.fieldId!==3n);
 return enc(new AuthoritativeState([...entries,{path:{rootStateTypeId:302n,fieldId:1n,selectors:[{kind:'mapKey',key:toleranceKey}]},value:r('ToleranceValue',{Magnitude:unsigned(2)})}]).canonicalValue());
}
export const CASES=[
 {name:'acquiredAbsent',counts:[1,1,1,1],baseline:50,support:0,other:false,wrong:false},
 {name:'naiveAbsent',counts:[0,0,0,0],baseline:50,support:0,other:false,wrong:false},
 {name:'acquiredPresent',counts:[1,1,1,1],baseline:50,support:4,other:false,wrong:false},
 {name:'naivePresent',counts:[0,0,0,0],baseline:50,support:4,other:false,wrong:false},
 {name:'spaced',counts:[1,0,1,0],baseline:50,support:0,other:false,wrong:false},
 {name:'acquiredShortfall',counts:[1,1,1,1],baseline:48,support:0,other:false,wrong:false},
 {name:'naiveShortfall',counts:[0,0,0,0],baseline:48,support:0,other:false,wrong:false},
 {name:'otherLeaves',counts:[1,1,1,1],baseline:50,support:0,other:true,wrong:false},
 {name:'otherKey',counts:[1,1,1,1],baseline:50,support:0,other:false,wrong:true},
] as const;
