import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,text,record,map,typedIdentifier,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run,campaign2ModelIdentity} from '../campaign2/factory';
import {decodeCampaign2} from '../campaign2/codecs';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import * as runtime from '../campaign2/adaptationRuntime';
import * as val from '../campaign2/valDeclarations';
import * as identity from '../substrate/identity';
const input=()=>({initialState:enc(set([])),orderedInputs:enc(list([])),runSeed:new Uint8Array(32)});

it('VAL-T: changed RequiredSemanticKind changes registry commitment and rejects before ModelIdentity creation',async()=>{
 const source=firstTraceModel(),args=input(),run=await createCampaign2Run(await prepareCampaign2Model(source),args),save=run.save();
 const original=decodeCampaign2(source.registry);
 function replace(v:CanonicalValue):CanonicalValue{
  if(typeof v==='boolean')return v;
  if(v.kind==='record'){if(v.schema.typeId===330n)return record(v.schema,new Map([[1n,typedIdentifier(1004,text('semantic-kind/unsupported'))]]));return record(v.schema,new Map([...v.fields].map(([k,x])=>[k,replace(x)])));}
  if(v.kind==='list')return list(v.items.map(replace));if(v.kind==='set')return set(v.items.map(replace));if(v.kind==='map')return map(v.entries.map(([k,x])=>[replace(k),replace(x)]));return v;
 }
 const altered=replace(original),before=await identity.commitManifest(original),after=await identity.commitManifest(altered);
 expect(after.canonicalBytes).not.toEqual(before.canonicalBytes);expect(after.digest).not.toEqual(before.digest);
 const publication=vi.spyOn(identity,'createModelIdentity'),activation=vi.spyOn(runtime,'createAdaptationRuntime');
 try{const candidate={...source,registry:enc(altered)};
  await expect(prepareCampaign2Model(candidate)).rejects.toMatchObject({code:'INVALID_CONFIGURATION'});
  await expect(restoreCampaign2Run(candidate,{orderedInputs:args.orderedInputs,save})).rejects.toMatchObject({code:'INVALID_CONFIGURATION'});
  expect(publication).not.toHaveBeenCalled();expect(activation).not.toHaveBeenCalled();
 }finally{publication.mockRestore();activation.mockRestore();}
});

it('VAL-V: retained validator with every optional validator reference absent rejects as orphan at prepare and restore',async()=>{
 const source=firstTraceModel(),args=input(),run=await createCampaign2Run(await prepareCampaign2Model(source),args),save=run.save();
 let removed=0;
 function strip(v:CanonicalValue):CanonicalValue{
  if(typeof v==='boolean')return v;
  if(v.kind==='record'){const fields=new Map(v.fields);if(v.schema.typeId===263n&&fields.delete(2n))removed++;return record(v.schema,new Map([...fields].map(([k,x])=>[k,strip(x)])));}
  if(v.kind==='list')return list(v.items.map(strip));if(v.kind==='set')return set(v.items.map(strip));if(v.kind==='map')return map(v.entries.map(([k,x])=>[strip(k),strip(x)]));return v;
 }
 const registry=enc(strip(decodeCampaign2(source.registry)));expect(removed).toBeGreaterThan(0);
 const compiler=vi.spyOn(val,'compileValDeclarations'),activation=vi.spyOn(runtime,'createAdaptationRuntime');
 try{
  await expect(prepareCampaign2Model({...source,registry})).rejects.toThrow('referenced/declared validator mismatch');
  await expect(restoreCampaign2Run({...source,registry},{orderedInputs:args.orderedInputs,save})).rejects.toThrow('referenced/declared validator mismatch');
  expect(compiler).toHaveBeenCalledTimes(2);expect(activation).not.toHaveBeenCalled();expect(run.save()).toEqual(save);
 }finally{compiler.mockRestore();activation.mockRestore();}
});

it('VAL-J/V: declaration identity, kind, schema, version and reference errors reject at both public model surfaces',async()=>{
 const source=firstTraceModel(),args=input(),run=await createCampaign2Run(await prepareCampaign2Model(source),args),save=run.save();
 const slots=items(decodeCampaign2(source.registry),'list'),entries=items(slots[0],'set');
 const validator=entries.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&enc(f(v,1n)).toString()===enc(typedIdentifier(1021,text('validator/character-qualification'))).toString())!;
 const e=rec(validator,171n),definition=rec(f(e,4n),330n);
 const edit=(field:bigint,value:CanonicalValue)=>record(e.schema,new Map([...e.fields,[field,value]]));
 const variants:[string,CanonicalValue[]][]=[
  ['wrong identity namespace',entries.map(v=>v===validator?edit(1n,typedIdentifier(20,text('validator/character-qualification'))):v)],
  ['wrong RegistryKind namespace',entries.map(v=>v===validator?edit(2n,typedIdentifier(20,text('registry/domain-validator'))):v)],
  ['unknown RegistryKind',entries.map(v=>v===validator?edit(2n,typedIdentifier(1023,text('registry/unknown'))):v)],
  ['wrong version',entries.map(v=>v===validator?edit(3n,text('unsupported')):v)],
  ['wrong definition schema',entries.map(v=>v===validator?edit(4n,list([])):v)],
  ['unresolved kind operand',entries.map(v=>v===validator?edit(4n,record(definition.schema,new Map([[1n,typedIdentifier(1004,text('semantic-kind/unknown'))]]))):v)],
  ['missing referenced definition',entries.filter(v=>v!==validator)],
  ['duplicate StableId', [...entries,edit(3n,text('conflicting-version'))]],
  ['unknown definition field',entries.map(v=>v===validator?edit(4n,record({...definition.schema,fields:[...definition.schema.fields,{id:99n,name:'Unknown',required:true}]},new Map([...definition.fields,[99n,unsigned(1)]]))):v)],
 ];
 const spy=vi.spyOn(runtime,'createAdaptationRuntime');
 try{for(const [name,changed] of variants){const candidate={...source,registry:enc(list([set(changed),...slots.slice(1)]))};
  await expect(prepareCampaign2Model(candidate),name).rejects.toThrow();
  await expect(restoreCampaign2Run(candidate,{orderedInputs:args.orderedInputs,save}),name).rejects.toThrow();
 }expect(spy).not.toHaveBeenCalled();expect(run.save()).toEqual(save);}finally{spy.mockRestore();}
});

it('VAL-B: an actual registered same-ID handler replacement after model commitment cannot enter create or restore',async()=>{
 const source=firstTraceModel(),args=input(),model=await prepareCampaign2Model(source),commitment=campaign2ModelIdentity(model);
 const run=await createCampaign2Run(model,args),save=run.save();
 const entries=items(items(decodeCampaign2(source.registry),'list')[0],'set');
 const entry=entries.find(v=>{if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return false;const definition=f(v,4n);return typeof definition!=='boolean'&&definition.kind==='record'&&definition.schema.typeId===272n;})!;
 const registration=rec(f(rec(entry,171n),4n),272n),eventTypeId=f(rec(f(registration,4n),276n),1n);
 const original=vi.fn(()=>({outputs:[]})),replacement=vi.fn(()=>{throw Error('replaced behavior');});
 const handler={eventTypeId,execute:original};
 const registryBefore=source.registry.slice();handler.execute=replacement;
 expect(handler.eventTypeId).toEqual(eventTypeId);expect(source.registry).toEqual(registryBefore);
 await expect(createCampaign2Run(model,{...args,handlers:[handler]} as typeof args)).rejects.toMatchObject({code:'INVALID_CONFIGURATION'});
 await expect(restoreCampaign2Run(source,{orderedInputs:args.orderedInputs,save,handlers:[handler]} as {orderedInputs:Uint8Array;save:Uint8Array})).rejects.toMatchObject({code:'INVALID_CONFIGURATION'});
 const supplied={...source,handlers:[handler]};await expect(prepareCampaign2Model(supplied)).rejects.toMatchObject({code:'INVALID_CONFIGURATION'});
 expect(original).not.toHaveBeenCalled();expect(replacement).not.toHaveBeenCalled();
 expect(campaign2ModelIdentity(model)).toEqual(commitment);expect(run.save()).toEqual(save);
});

for(const type of [265n,278n])it(`VAL-V: unexercised declared role ${type} rejects at VAL before runtime through prepare and restore`,async()=>{
 const source=firstTraceModel(),args=input(),model=await prepareCampaign2Model(source),run=await createCampaign2Run(model,args),save=run.save();
 let changed=false;
 function mutate(v:CanonicalValue):CanonicalValue{
  if(typeof v==='boolean')return v;
  if(v.kind==='record'){
   if(!changed&&v.schema.typeId===type){changed=true;const role=rec(f(v,2n),263n);return record(v.schema,new Map([...v.fields,[2n,record(role.schema,new Map([...role.fields,[2n,typedIdentifier(1021,text('validator/unresolved'))]]))]]));}
   return record(v.schema,new Map([...v.fields].map(([k,x])=>[k,mutate(x)])));
  }
  if(v.kind==='list')return list(v.items.map(mutate));if(v.kind==='set')return set(v.items.map(mutate));
  if(v.kind==='map')return map(v.entries.map(([k,x])=>[mutate(k),mutate(x)]));return v;
 }
 const registry=enc(mutate(decodeCampaign2(source.registry)));expect(changed).toBe(true);
 const compilation=vi.spyOn(val,'compileValDeclarations'),activation=vi.spyOn(runtime,'createAdaptationRuntime');
 try{for(const attempt of [()=>prepareCampaign2Model({...source,registry}),()=>restoreCampaign2Run({...source,registry},{orderedInputs:args.orderedInputs,save})]){
  await expect(attempt()).rejects.toMatchObject({code:'INVALID_CONFIGURATION',message:'unadmitted identity'});
 }expect(compilation).toHaveBeenCalledTimes(2);expect(activation).not.toHaveBeenCalled();expect(run.save()).toEqual(save);}
 finally{compilation.mockRestore();activation.mockRestore();}
});
