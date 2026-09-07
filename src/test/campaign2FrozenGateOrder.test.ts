import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,set,record,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {candidateId as id} from '../campaign2/firstModelCandidate';
import {prepareCampaign2Model,createCampaign2Run,campaign2ModelIdentity} from '../campaign2/factory';
import {decodeCampaign2,campaign2Record as r} from '../campaign2/codecs';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {restoreAuthoritativeState} from '../substrate/state';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
const tolerance=id(1035,'rule/fixture-tolerance'),load=id(1035,'rule/fixture-accumulated-load');
const replace=(v:CanonicalValue,n:bigint,value:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('fixture record');return record(v.schema,new Map([...v.fields,[n,value]]));};
function specimen(swapped:boolean){
 const source=firstTraceModel(),slots=[...items(decodeCampaign2(source.registry),'list')];
 const rename=(v:CanonicalValue)=>swapped?(key(v)===key(tolerance)?load:tolerance):v;
 slots[0]=set(items(slots[0],'set').flatMap(v=>{
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return [v];
  const definition=f(v,4n);if(typeof definition==='boolean'||definition.kind!=='record')return [v];
  if(definition.schema.typeId===311n){
   const stable=f(v,1n);if(![key(tolerance),key(load)].includes(key(stable)))return [];
   let rule:CanonicalValue=definition;
   if(key(stable)===key(load))rule=replace(replace(rule,6n,signed(2)),5n,r('AdaptationGate',{VariantTag:unsigned(2),Source:r('AdaptationReadTarget',{
    StateFamilyId:id(1031,'regulatory-adaptation'),LeafFamilyId:id(1032,'leaf/tolerance'),KeyDerivation:r('AdaptationKeyDerivation',{VariantTag:unsigned(1),RegulatoryVariableId:id(1029,'variable/fixture-regulation')}),
   })}));
   return [replace(replace(v,1n,rename(stable)),4n,rule)];
  }
  if(definition.schema.typeId===318n){
   const extension=rec(f(definition,5n),317n),resolution=rec(f(extension,2n),316n),rules=items(f(resolution,1n),'set').filter(v=>[key(tolerance),key(load)].includes(key(v))).map(rename);
   const transition=rec(f(definition,3n),319n),reads=rules.length?items(f(transition,2n),'set').filter(p=>{
    if(typeof p==='boolean'||p.kind!=='record')throw Error('fixture pattern');return [key(unsigned(1)),key(unsigned(4))].includes(key(f(p,2n)));
   }):[];
   return [replace(v,4n,replace(replace(definition,5n,replace(extension,2n,replace(resolution,1n,set(rules)))),3n,replace(transition,2n,set(reads))))];
  }
  return [v];
 }));source.registry=enc(list(slots));return source;
}
it('AD-E5: exact tolerance 1 / frozen-gated load 2 survives reversed committed rule-identity order',async()=>{
 const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
 const orderedInputs=enc(list([list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(1)})}),list([])])]));
 const results=[];
 for(const swapped of [false,true]){
  const model=await prepareCampaign2Model(specimen(swapped)),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)});await run.settleNextInstant();
  const snapshot=run.snapshot(),leaves=restoreAuthoritativeState(decodeCampaign2(snapshot.state)).entries().slice().sort((a,b)=>Number(a.path.fieldId-b.path.fieldId));
  expect(leaves).toHaveLength(2);expect(leaves.map(e=>e.path.fieldId)).toEqual([1n,4n]);expect(leaves.map(e=>f(rec(e.value,e.path.fieldId===1n?297n:300n),1n))).toEqual([unsigned(1),unsigned(2)]);
  const trace=rec(items(decodeCampaign2(snapshot.trace),'list')[8],160n),outputs=items(f(trace,13n),'list'),evaluations=outputs.slice(1).map(v=>rec(v,325n));
  expect(evaluations).toHaveLength(2);const paths=evaluations.map(e=>f(rec(f(e,4n),140n),2n));
  const reads=items(f(trace,11n),'list');expect(reads).toHaveLength(3);for(const read of reads)expect(f(rec(read,147n),3n)).toBe(false);
  results.push({identity:campaign2ModelIdentity(model),state:snapshot.state,paths});
 }
 expect(results[0].identity).not.toEqual(results[1].identity);expect(results[0].state).toEqual(results[1].state);expect(results[0].paths).toEqual([...results[1].paths].reverse());
});
