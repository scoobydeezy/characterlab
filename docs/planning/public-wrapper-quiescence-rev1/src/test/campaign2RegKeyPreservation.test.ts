import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,map,record,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {firstModelCandidate,candidateId as id} from '../campaign2/firstModelCandidate';
import {prepareCampaign2Model} from '../campaign2/factory';
import {compileCampaign2Registry} from '../campaign2/modelPackaging';
import {compileRegulatoryReferences} from '../campaign2/regulatoryReference';
import {compileAdaptationDomains,validateKeyedRegulatoryReference} from '../campaign2/adaptationDomains';
import {campaign2Record as r,decodeCampaign2} from '../campaign2/codecs';
import {dataItems as items,dataField as f,dataRecord as rec,dataKey as key} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('record');return record(v.schema,new Map([...v.fields,[n,x]]));};
it('REG-E real ADAPT component preserves variable key even with identical scales and bounds; public profile excludes two variables',async()=>{
 const source=firstModelCandidate(),slots=[...items(decodeCampaign2(source.registry),'list')],entries=items(slots[0],'set');
 const V1=id(1029,'variable/fixture-regulation'),V2=id(1029,'variable/key-preservation'),P2=id(1030,'parameter/key-preservation');
 const original=rec(entries.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(V1))!,171n),registration=rec(f(original,4n),283n),reference=rec(f(registration,2n),282n);
 const anchors=f(reference,1n),parameters=f(reference,2n);if(typeof anchors==='boolean'||anchors.kind!=='map'||typeof parameters==='boolean'||parameters.kind!=='map')throw Error('map');
 const secondRef=replace(replace(reference,1n,map(anchors.entries.map(([k,a])=>[k,replace(replace(a,1n,signed(80)),3n,P2)]))),2n,map([[P2,replace(parameters.entries[0][1],1n,P2)]]));
 slots[0]=set([...entries,replace(replace(original,1n,V2),4n,replace(registration,2n,secondRef))]);source.registry=enc(list(slots));
 const compiled=await compileCampaign2Registry(source.registrySchemaVersion,source.registry,source.content),group=(kind:string)=>compiled.entries().filter(v=>key(f(rec(v,171n),2n))===key(id(1023,kind)));
 const reg=compileRegulatoryReferences(enc(set(group('registry/regulatory-variable'))),compiled.content);
 const domains=compileAdaptationDomains(enc(set(['registry/campaign2-state-family','registry/adaptation-leaf-family','registry/load-domain','registry/procedure'].flatMap(group))),compiled.stateModel,reg,compiled.content);
 const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
 const path=(V:CanonicalValue)=>({rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey' as const,key:r('RegulatoryAdaptationKey',{CharacterId:C,RegulatoryVariableId:V})}]});
 expect(reg.referenceOperatingPoint(C,V1,0n)).toEqual({kind:'ReferenceValue',value:signed(50)});
 expect(reg.referenceOperatingPoint(C,V2,0n)).toEqual({kind:'ReferenceValue',value:signed(80)});
 expect(()=>domains.validateMagnitude(path(V1),30n,0n)).not.toThrow();
 expect(()=>domains.validateMagnitude(path(V2),30n,0n)).toThrowError(expect.objectContaining({code:'ADAPTATION_REFERENCE_OUT_OF_RANGE'}));
 const arithmetic=vi.fn(reg.validateAdaptedReference),provider={...reg,validateAdaptedReference:arithmetic};
 const selected=r('RegulatoryAdaptationKey',{CharacterId:C,RegulatoryVariableId:V1});
 // D=0 is numerically valid for both variables. Numeric failure cannot stand in
 // for key rejection, and the actual REG operation must never be called.
 expect(()=>validateKeyedRegulatoryReference(provider,selected,C,V2,0n,signed(0))).toThrowError(expect.objectContaining({code:'INVALID_PATH'}));
 expect(arithmetic).not.toHaveBeenCalled();
 expect(validateKeyedRegulatoryReference(provider,selected,C,V1,0n,signed(0))).toEqual({kind:'Valid'});
 expect(arithmetic).toHaveBeenCalledTimes(1);
 await expect(prepareCampaign2Model(source)).rejects.toThrow(/bounded specimen requires exactly one/);
});
