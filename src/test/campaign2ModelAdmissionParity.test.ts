import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,record,text,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {candidateId as id} from '../campaign2/firstModelCandidate';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run,campaign2ModelIdentity} from '../campaign2/factory';
import {campaign2SchemaByType,decodeCampaign2} from '../campaign2/codecs';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import * as runtime from '../campaign2/adaptationRuntime';

it('unused unsupported declarations and incomplete model contracts reject identically at prepare and restore before runtime construction',async()=>{
 const source=firstTraceModel(),orderedInputs=enc(list([]));
 const run=await createCampaign2Run(await prepareCampaign2Model(source),{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)}),save=run.save();
 const original=items(decodeCampaign2(source.registry),'list');
 const registryVariant=(slot:number,value:CanonicalValue)=>({...source,registry:enc(list(original.map((v,i)=>i===slot?value:v)))});
 const negativeKinds=['registry/unaccepted-analytical-process','registry/unaccepted-random-consumer','registry/unaccepted-continuing-coupling'];
 const variants=negativeKinds.map(kind=>({name:kind,source:registryVariant(0,set([...items(original[0],'set'),record(campaign2SchemaByType(171n),new Map([
  [1n,id(20,'negative/unused-definition')],[2n,id(1023,kind)],[3n,text('negative-control/1')],[4n,list([])],
 ]))]))}));
 for(const stable of [id(1021,'validator/character-qualification'),id(1027,'definition/authored-fact-consequence-bridge'),id(1027,'definition/adaptation-settlement')]){
  variants.push({name:`missing/${key(stable)}`,source:registryVariant(0,set(items(original[0],'set').filter(v=>!(typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(stable)))))});
 }
 variants.push({name:'missing-key-grammar',source:registryVariant(4,set(items(original[4],'set').slice(1)))},
  {name:'unsupported-rules-version',source:{...source,rulesVersion:'rules/unsupported-negative-control'}},
  {name:'zero-work-bound',source:{...source,parameters:enc(list([record(campaign2SchemaByType(133n),new Map([[1n,unsigned(0)]]))]))}});
 const spy=vi.spyOn(runtime,'createAdaptationRuntime');
 try{
  for(const variant of variants){
   await expect(prepareCampaign2Model(variant.source),variant.name).rejects.toMatchObject({code:'INVALID_CONFIGURATION'});
   await expect(restoreCampaign2Run(variant.source,{orderedInputs,save}),variant.name).rejects.toMatchObject({code:'INVALID_CONFIGURATION'});
   expect(spy,variant.name).not.toHaveBeenCalled();
  }
  expect(variants).toHaveLength(9);expect(run.save()).toEqual(save);
 }finally{spy.mockRestore();}
});

it('canonical registry and content enumeration permutations preserve model identity and exact restore',async()=>{
 const source=firstTraceModel(),original=items(decodeCampaign2(source.registry),'list');
 const reverseSet=(v:CanonicalValue)=>set([...items(v,'set')].reverse());
 const reordered={...source,content:enc(reverseSet(decodeCampaign2(source.content))),registry:enc(list(original.map((v,i)=>[0,3,4,5].includes(i)?reverseSet(v):v)))};
 expect(reordered.registry).toEqual(source.registry);expect(reordered.content).toEqual(source.content);
 const a=await prepareCampaign2Model(source),b=await prepareCampaign2Model(reordered);expect(campaign2ModelIdentity(a)).toEqual(campaign2ModelIdentity(b));
 const orderedInputs=enc(list([])),run=await createCampaign2Run(a,{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)});
 const restored=await restoreCampaign2Run(reordered,{orderedInputs,save:run.save()});expect(restored.save()).toEqual(run.save());
});
