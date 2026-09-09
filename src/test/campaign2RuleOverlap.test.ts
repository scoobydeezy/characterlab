import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,record,unsigned,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {firstModelCandidate,candidateId as id} from '../campaign2/firstModelCandidate';
import {compileBoundedModelDeclarations} from '../campaign2/modelPackaging';
import {campaign2Record as r,decodeCampaign2} from '../campaign2/codecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {prepareCampaign2Model,createCampaign2Run} from '../campaign2/factory';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import {ContractReadProjection} from '../substrate/state';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
const names=['tolerance','sensitization','regulatory-displacement','accumulated-load','procedural-competence'];
const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('record');return record(v.schema,new Map([...v.fields,[n,x]]));};
function specimen(name:string,variant:string){
 const source=firstModelCandidate(),slots=[...items(decodeCampaign2(source.registry),'list')],entries=items(slots[0],'set');
 const original=entries.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(id(1035,`rule/fixture-${name}`)))!;
 let rule=rec(f(rec(original,171n),4n),311n);const duplicate=id(1035,'rule/control-overlap');
 if(variant==='step')rule=rec(replace(rule,6n,signed(2)),311n);
 if(variant==='gate')rule=rec(replace(rule,5n,r('AdaptationGate',{VariantTag:unsigned(2),Source:r('AdaptationReadTarget',{StateFamilyId:f(rule,2n),LeafFamilyId:f(rule,3n),KeyDerivation:f(rule,4n)})})),311n);
 if(variant==='disjoint')rule=rec(replace(rule,1n,r('AdaptationMatch',{VariantTag:unsigned(1),ExposureReferentId:typedIdentifier(1002,typedIdentifier(1122,unsigned(950)))})),311n);
 slots[0]=set([...entries.map(v=>{
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;
  if(key(f(v,1n))!==key(id(1009,name==='procedural-competence'?'transition/procedural-adaptation':'transition/regulatory-adaptation')))return v;
  const registration=rec(f(v,4n),318n),extension=rec(f(registration,5n),317n),resolution=rec(f(extension,2n),316n);
  return replace(v,4n,replace(registration,5n,replace(extension,2n,replace(resolution,1n,set([...items(f(resolution,1n),'set'),duplicate])))));
 }),replace(replace(original,1n,duplicate),4n,rule)]);
 return {...source,registry:enc(list(slots))};
}
it.each(names.flatMap(name=>['same','step','gate'].map(variant=>[name,variant])))('AD-E13 rejects guaranteed overlap for %s with %s variation',async(name,variant)=>{
 await expect(compileBoundedModelDeclarations(specimen(name,variant))).rejects.toThrow('guaranteed overlapping rule target collision');
 await expect(compileBoundedModelDeclarations(specimen(name,variant))).rejects.toThrowError(expect.objectContaining({code:'INVALID_CONFIGURATION'}));
});
it.each(names.slice(0,4))('AD-E13 permits disjoint exposure matches for %s at construction',async name=>{
 const compiled=await compileBoundedModelDeclarations(specimen(name,'disjoint'));expect(compiled.adaptation.ruleCount).toBe(6);
});
it('AD-E13 permits the five distinct target recipes under the original exposure/practice matches',async()=>{
 expect((await compileBoundedModelDeclarations(firstModelCandidate())).adaptation.ruleCount).toBe(5);
});
it('AD-E13 disjoint exposures can still collide at the exact same runtime displacement key',async()=>{
 const model=await prepareCampaign2Model(specimen('regulatory-displacement','disjoint'));
 const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
 const facts=[character,typedIdentifier(1002,typedIdentifier(1122,unsigned(950)))].map(exposure=>list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:exposure,ActualContactCount:unsigned(1)})}),list([])]));
 const run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:enc(list(facts)),runSeed:new Uint8Array(32)}),before=run.snapshot();
 const reads=vi.spyOn(ContractReadProjection.prototype,'read');
 try{await expect(run.settleNextInstant()).rejects.toThrowError(expect.objectContaining({code:'ADAPTATION_TARGET_COLLISION'}));expect(reads).not.toHaveBeenCalled();expect(run.snapshot()).toEqual({...before,status:'Failed'});}
 finally{reads.mockRestore();}
});
