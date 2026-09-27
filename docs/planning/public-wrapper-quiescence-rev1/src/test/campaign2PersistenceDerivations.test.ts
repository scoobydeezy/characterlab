import {it,expect,vi} from 'vitest';
import {comparePersistenceDerivations} from './fixtures/campaign2PersistenceComparison';
import * as runtime from '../campaign2/adaptationRuntime';
import {canonicalEncode as enc,list,set,map,record,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {INT64_MAX} from '../substrate/time';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run,campaign2ModelIdentity} from '../campaign2/factory';
import {decodeCampaign2} from '../campaign2/codecs';
import {dataItems as items,dataRecord as rec,dataField as f,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
it('bounded persistence derives exact empty metadata and validates unchanged displacement at saved time',async()=>{
 const spy=vi.spyOn(runtime,'createAdaptationRuntime');
 try{const cases=await comparePersistenceDerivations(()=>spy.mock.calls.length);expect(cases).toHaveLength(5);
 for(const c of cases)expect(c.agrees,JSON.stringify(c)).toBe(true);}finally{spy.mockRestore();}
});
it('PERSIST-B: changing only an authored REG anchor changes model identity, keeps metadata empty and rejects the old save',async()=>{
 const source=firstTraceModel(),slots=[...items(decodeCampaign2(source.registry),'list')];
 slots[0]=set(items(slots[0],'set').map(v=>{
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n||txt(id(f(v,2n)).payload)!=='registry/regulatory-variable')return v;
  const registration=rec(f(v,4n),283n),reference=rec(f(registration,2n),282n),anchors=f(reference,1n);
  if(typeof anchors==='boolean'||anchors.kind!=='map')throw Error('fixture map');
  const changed=map(anchors.entries.map(([key,value])=>{const a=rec(value,121n);return [key,record(a.schema,new Map([...a.fields,[1n,signed(51)]]))];}));
  const replace=(value:CanonicalValue,field:bigint,data:CanonicalValue)=>{if(typeof value==='boolean'||value.kind!=='record')throw Error('fixture record');return record(value.schema,new Map([...value.fields,[field,data]]));};
  return replace(v,4n,replace(registration,2n,replace(reference,1n,changed)));
 }));
 const variant={...source,registry:enc(list(slots))},a=await prepareCampaign2Model(source),b=await prepareCampaign2Model(variant);
 const ai=rec(decodeCampaign2(campaign2ModelIdentity(a)),103n),bi=rec(decodeCampaign2(campaign2ModelIdentity(b)),103n);
 expect(f(ai,6n)).not.toEqual(f(bi,6n));for(const field of [1n,2n,3n,4n,5n])expect(f(ai,field)).toEqual(f(bi,field));
 const args={initialState:enc(set([])),orderedInputs:enc(list([])),runSeed:new Uint8Array(32)};
 const x=await createCampaign2Run(a,args),y=await createCampaign2Run(b,args),oldSave=x.save(),newSave=y.save();
 for(const save of [oldSave,newSave])for(const field of [8n,9n,10n])expect(f(rec(decodeCampaign2(save),132n),field)).toEqual(list([]));
 expect(x.snapshot()).toEqual(y.snapshot());
 await expect(restoreCampaign2Run(variant,{save:oldSave,orderedInputs:args.orderedInputs})).rejects.toThrow(/ModelIdentity/);
 const restored=await restoreCampaign2Run(variant,{save:newSave,orderedInputs:args.orderedInputs});expect(restored.save()).toEqual(newSave);
});
it('REG-A: authored rate and variable scale each independently change the registry/model commitment',async()=>{
 const source=firstTraceModel(),baseline=rec(decodeCampaign2(campaign2ModelIdentity(await prepareCampaign2Model(source))),103n);
 const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('record');return record(v.schema,new Map([...v.fields,[n,x]]));};
 for(const mode of ['rate','scale']){
  const slots=[...items(decodeCampaign2(source.registry),'list')];
  slots[0]=set(items(slots[0],'set').map(v=>{
   if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n||txt(id(f(v,2n)).payload)!=='registry/regulatory-variable')return v;
   const registration=rec(f(v,4n),283n);
   if(mode==='scale')return replace(v,4n,replace(registration,1n,replace(rec(f(registration,1n),280n),1n,unsigned(11))));
   const reference=rec(f(registration,2n),282n),parameters=f(reference,2n);if(typeof parameters==='boolean'||parameters.kind!=='map')throw Error('map');
   const changed=map(parameters.entries.map(([k,p])=>[k,replace(replace(p,2n,signed(1)),3n,unsigned(INT64_MAX))]));
   return replace(v,4n,replace(registration,2n,replace(reference,2n,changed)));
  }));
  const model=await prepareCampaign2Model({...source,registry:enc(list(slots))}),identity=rec(decodeCampaign2(campaign2ModelIdentity(model)),103n);
  expect(f(identity,6n),mode).not.toEqual(f(baseline,6n));
  for(const n of [1n,2n,3n,4n,5n])expect(f(identity,n),mode).toEqual(f(baseline,n));
 }
});
