import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,set,record,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {candidateId as id} from '../campaign2/firstModelCandidate';
import {prepareCampaign2Model,createCampaign2Run,campaign2ModelIdentity} from '../campaign2/factory';
import {decodeCampaign2,campaign2Record as r} from '../campaign2/codecs';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent,semanticReferentFromRuntimeEntity,allocateRuntimeEntityOrigin} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
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

it('AD-E2: false gate retains its evaluation; empty and nonmatching resolvers still emit one dispatch',async()=>{
 const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
 const model=await prepareCampaign2Model(specimen(false));
 // A distinct runtime-origin referent is an admitted exposure identity, not a
 // second CharacterId or a new CONTENT kind. No semantic output ID is invented.
 const other=semanticReferentFromRuntimeEntity(allocateRuntimeEntityOrigin({allocateRuntimeId:()=>900n}));
 for(const mode of ['false-gate','empty-resolver','wrong-referent']){
  const empty=mode!=='false-gate';
  const initial=new AuthoritativeState(empty?[]:[{path:{rootStateTypeId:302n,fieldId:1n,selectors:[{kind:'mapKey',key:r('ToleranceKey',{CharacterId:character,ExposureReferentId:character,RegulatoryVariableId:id(1029,'variable/fixture-regulation')})}]},value:r('ToleranceValue',{Magnitude:unsigned(1)})}]);
  const fact=mode==='empty-resolver'?r('ProceduralPracticeFact',{CharacterId:character,ProcedureId:id(1034,'procedure/fixture-practice'),CompletedRepetitions:unsigned(1)}):r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:mode==='wrong-referent'?other:character,ActualContactCount:unsigned(1)});
  const orderedInputs=enc(list([list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:fact}),list([])])]));
  const run=await createCampaign2Run(model,{initialState:enc(initial.canonicalValue()),orderedInputs,runSeed:new Uint8Array(32)});await run.settleNextInstant();
  const snapshot=run.snapshot(),traces=items(decodeCampaign2(snapshot.trace),'list').map(v=>rec(v,160n));
  const eventOutputs=(t:CanonicalValue)=>{const v=rec(t,160n).fields.get(13n);return v&&typeof v!=='boolean'&&v.kind==='list'?v.items:[];};
  const outputs=traces.flatMap(eventOutputs),dispatches=outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===324n),evaluations=outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===325n);
  expect(dispatches).toHaveLength(1);expect(items(f(rec(dispatches[0],324n),3n),'set')).toHaveLength(empty?0:2);expect(evaluations).toHaveLength(empty?0:2);
  if(empty){
   expect(snapshot.state).toEqual(enc(initial.canonicalValue()));
   const dispatchTrace=traces.find(t=>eventOutputs(t).some(v=>key(v)===key(dispatches[0])))!;
   expect(items(f(dispatchTrace,11n),'list')).toEqual([]);expect(items(f(rec(f(dispatchTrace,16n),144n),1n),'list')).toEqual([]);
  }else{
   const gated=rec(evaluations.find(v=>key(f(rec(v,325n),3n))===key(load))!,325n);
   expect(f(gated,6n)).toEqual(r('AdaptationResult',{VariantTag:unsigned(1)}));
   const entries=restoreAuthoritativeState(decodeCampaign2(snapshot.state)).entries();expect(entries).toHaveLength(1);expect(f(rec(entries[0].value,297n),1n)).toEqual(unsigned(2));
  }
 }
});
