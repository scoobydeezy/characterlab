import {canonicalEncode as enc,list,signed,unsigned} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {candidateId} from '../campaign2/firstModelCandidate';
import {campaign2Record as r} from '../campaign2/codecs';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
const variable=candidateId(1029,'variable/fixture-regulation');
export const toleranceKey=r('ToleranceKey',{CharacterId:character,ExposureReferentId:character,RegulatoryVariableId:variable});
export const otherToleranceKey=r('ToleranceKey',{CharacterId:character,ExposureReferentId:semanticReferentFromAuthoredContent(governedContentDefinitionId('character/unexposed-control')),RegulatoryVariableId:variable});
export function toleranceInitial(other=false){
 const keys=[r('SensitizationKey',{CharacterId:character,ExposureReferentId:character,RegulatoryVariableId:variable}),r('RegulatoryAdaptationKey',{CharacterId:character,RegulatoryVariableId:variable}),r('AccumulatedLoadKey',{CharacterId:character,LoadDomainId:candidateId(1033,'load/fixture-load')})];
 return enc(new AuthoritativeState(other?keys.map((key,i)=>({path:{rootStateTypeId:302n,fieldId:BigInt(i+2),selectors:[{kind:'mapKey' as const,key}]},value:r(['SensitizationValue','RegulatoryAdaptationValue','AccumulatedLoadValue'][i],{Magnitude:i===1?signed(2):unsigned(2)})})):[]).canonicalValue());
}
export function toleranceInputs(counts:readonly number[]){return enc(list(counts.map((count,i)=>list([signed(i+2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(count)})}),list([])]))));}
export const CASES=[
 {name:'repeated',counts:[1,1,1,1],before:0,other:false,wrong:false},
 {name:'naive',counts:[0,0,0,0],before:0,other:false,wrong:false},
 {name:'spaced',counts:[1,0,1,0],before:0,other:false,wrong:false},
 {name:'saturated',counts:[1,1,1,1],before:10,other:false,wrong:false},
 {name:'otherLeaves',counts:[1,1,1,1],before:0,other:true,wrong:false},
 {name:'otherKey',counts:[1,1,1,1],before:0,other:false,wrong:true},
] as const;
