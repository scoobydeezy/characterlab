import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,set,map,record,unsigned,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {firstModelCandidate,candidateId as id} from '../campaign2/firstModelCandidate';
import {prepareCampaign2Model,campaign2ModelIdentity} from '../campaign2/factory';
import {campaign2Record as r,decodeCampaign2} from '../campaign2/codecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileCampaign2Registry} from '../campaign2/modelPackaging';
import {compileRegulatoryReferences} from '../campaign2/regulatoryReference';
import {compileAdaptationDomains} from '../campaign2/adaptationDomains';
import {compileAdaptationTransitions} from '../campaign2/adaptationTransitions';
import {commitManifest,createModelIdentity} from '../substrate/identity';
const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('record');return record(v.schema,new Map([...v.fields,[n,x]]));};
const tolerance=id(1035,'rule/fixture-tolerance');
function variant(kind:string){
 const source=firstModelCandidate(),slots=[...items(decodeCampaign2(source.registry),'list')];
 slots[0]=set(items(slots[0],'set').flatMap(v=>{
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return [v];
  if(key(f(v,1n))===key(tolerance)){
   const rule=rec(f(v,4n),311n);
   if(kind==='membership')return [];
   const changed=kind==='step'?replace(rule,6n,signed(2)):kind==='match'?replace(rule,1n,r('AdaptationMatch',{VariantTag:unsigned(1),ExposureReferentId:typedIdentifier(1002,typedIdentifier(1122,unsigned(960)))})):
    replace(rule,5n,r('AdaptationGate',{VariantTag:unsigned(2),Source:r('AdaptationReadTarget',{StateFamilyId:f(rule,2n),LeafFamilyId:f(rule,3n),KeyDerivation:f(rule,4n)})}));
   return [replace(v,4n,changed)];
  }
  if(kind==='membership'&&key(f(v,1n))===key(id(1009,'transition/regulatory-adaptation'))){
   const registration=rec(f(v,4n),318n),extension=rec(f(registration,5n),317n),resolution=rec(f(extension,2n),316n),definition=rec(f(registration,3n),319n);
   const members=items(f(resolution,1n),'set').filter(x=>key(x)!==key(tolerance));
   const reads=items(f(definition,2n),'set').filter(p=>key(f(rec(p,149n),2n))!==key(unsigned(1)));
   return [replace(v,4n,replace(replace(registration,5n,replace(extension,2n,replace(resolution,1n,set(members)))),3n,replace(definition,2n,set(reads))))];
  }
  return [v];
 }));return {...source,registry:enc(list(slots))};
}
it('AD-E3 commits Step, Gate, Match and membership alternatives through the public model compiler',async()=>{
 const source=firstModelCandidate(),base=rec(decodeCampaign2(campaign2ModelIdentity(await prepareCampaign2Model(source))),103n),identities=[key(base)];
 for(const kind of ['step','gate','match','membership']){
  const changed=variant(kind);expect(changed.content).toEqual(source.content);expect(changed.parameters).toEqual(source.parameters);
  const identity=rec(decodeCampaign2(campaign2ModelIdentity(await prepareCampaign2Model(changed))),103n);
  for(const field of [1n,2n,3n,4n,5n])expect(f(identity,field)).toEqual(f(base,field));
  expect(f(identity,6n)).not.toEqual(f(base,6n));identities.push(key(identity));
 }
 expect(new Set(identities).size).toBe(5);
});
it('AD-E3 generic commitment isolates key V/L changes; public profile excludes the additional domains',async()=>{
 const source=firstModelCandidate(),slots=[...items(decodeCampaign2(source.registry),'list')],entries=items(slots[0],'set');
 const find=(stable:CanonicalValue)=>rec(entries.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(stable))!,171n);
 const V2=id(1029,'variable/commitment-alternative'),L2=id(1033,'load/commitment-alternative'),P2=id(1030,'parameter/commitment-alternative');
 const variable=find(id(1029,'variable/fixture-regulation')),registration=rec(f(variable,4n),283n),reference=rec(f(registration,2n),282n);
 const anchors=f(reference,1n),parameters=f(reference,2n);if(typeof anchors==='boolean'||anchors.kind!=='map'||typeof parameters==='boolean'||parameters.kind!=='map')throw Error('maps');
 const secondReference=replace(replace(reference,1n,map(anchors.entries.map(([k,a])=>[k,replace(a,3n,P2)]))),2n,map([[P2,replace(parameters.entries[0][1],1n,P2)]]));
 const secondVariable=replace(replace(variable,1n,V2),4n,replace(registration,2n,secondReference));
 slots[0]=set([...entries,secondVariable,replace(find(id(1033,'load/fixture-load')),1n,L2)]);
 const generic={...source,registry:enc(list(slots))};
 await expect(prepareCampaign2Model(generic)).rejects.toThrow(/bounded specimen requires exactly one/);
 const compile=async(candidate:typeof source)=>{
  const compiled=await compileCampaign2Registry(candidate.registrySchemaVersion,candidate.registry,candidate.content),all=compiled.entries();
  const group=(kind:string)=>all.filter(v=>key(f(rec(v,171n),2n))===key(id(1023,kind))),one=(kind:string)=>enc(group(kind)[0]);
  const reg=compileRegulatoryReferences(enc(set(group('registry/regulatory-variable'))),compiled.content);
  const domains=compileAdaptationDomains(enc(set(['registry/campaign2-state-family','registry/adaptation-leaf-family','registry/load-domain','registry/procedure'].flatMap(group))),compiled.stateModel,reg,compiled.content);
  const v06=group('registry/transition-registration').filter(v=>key(f(rec(v,171n),3n))===key({kind:'text',value:'transition-admission-extension/0.6-candidate'}));
  expect(compileAdaptationTransitions(enc(set(v06)),enc(set(group('registry/adaptation-rule'))),one('registry/authored-adaptation-facts'),one('registry/adaptation-settlement'),domains,reg,compiled.content).ruleCount).toBe(5);
  // Structural identity component only: the public bounded model above rejects.
  return (await createModelIdentity({...candidate,contentManifest:compiled.content,registryManifest:await commitManifest(decodeCampaign2(compiled.bytes())),parameterSet:await commitManifest(decodeCampaign2(candidate.parameters))})).value;
 };
 const base=rec(await compile(generic),103n),identities=[key(base)];
 for(const operand of ['V','L']){
  const next=[...slots];next[0]=set(items(slots[0],'set').map(v=>{
   if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n||key(f(v,1n))!==key(id(1035,operand==='V'?'rule/fixture-tolerance':'rule/fixture-accumulated-load')))return v;
   const rule=rec(f(v,4n),311n);return replace(v,4n,replace(rule,4n,replace(f(rule,4n),operand==='V'?2n:3n,operand==='V'?V2:L2)));
  }));
  const changed={...generic,registry:enc(list(next))},identity=rec(await compile(changed),103n);
  await expect(prepareCampaign2Model(changed)).rejects.toThrow(/bounded specimen requires exactly one/);
  for(const n of [1n,2n,3n,4n,5n])expect(f(identity,n)).toEqual(f(base,n));
  expect(f(identity,6n)).not.toEqual(f(base,6n));identities.push(key(identity));
 }
 expect(new Set(identities).size).toBe(3);
 // Keep FrozenBaseline fixed and change only its declared source V.
 const gateCandidate=(variable:CanonicalValue)=>{
  const next=[...slots];next[0]=set(items(slots[0],'set').map(v=>{
   if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n||key(f(v,1n))!==key(tolerance))return v;
   const rule=rec(f(v,4n),311n),source=r('AdaptationReadTarget',{StateFamilyId:f(rule,2n),LeafFamilyId:f(rule,3n),KeyDerivation:replace(f(rule,4n),2n,variable)});
   return replace(v,4n,replace(rule,5n,r('AdaptationGate',{VariantTag:unsigned(2),Source:source})));
  }));return {...generic,registry:enc(list(next))};
 };
 const gateBase=gateCandidate(id(1029,'variable/fixture-regulation')),gateChanged=gateCandidate(V2);
 const before=rec(await compile(gateBase),103n),after=rec(await compile(gateChanged),103n);
 for(const n of [1n,2n,3n,4n,5n])expect(f(after,n)).toEqual(f(before,n));
 expect(f(after,6n)).not.toEqual(f(before,6n));
 for(const candidate of [gateBase,gateChanged])await expect(prepareCampaign2Model(candidate)).rejects.toThrow(/bounded specimen requires exactly one/);
});
it('AD-E3 public model input cannot supply a rule callback or name table',async()=>{
 let calls=0;const callback=()=>{calls++;return signed(999);};
 for(const extra of [{ruleInterpreter:callback},{ruleTable:{'rule/fixture-tolerance':callback}}])await expect(prepareCampaign2Model({...firstModelCandidate(),...extra})).rejects.toThrowError(expect.objectContaining({code:'INVALID_CONFIGURATION'}));
 expect(calls).toBe(0);
});
