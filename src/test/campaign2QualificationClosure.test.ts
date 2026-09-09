import {it,expect,vi} from 'vitest';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run,campaign2ModelIdentity} from '../campaign2/factory';
import {canonicalEncode as enc,list,set,text,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {compileContentDefinition,compileGovernedContentManifest,governedContentSchema,type GovernedContentInput} from '../substrate/contentManifest';
import {decodeCampaign2} from '../campaign2/codecs';
import {dataItems as items,dataRecord as rec,dataField as f,dataIdentity as id} from '../campaign2/canonicalData';
import * as runtime from '../campaign2/adaptationRuntime';
import * as identity from '../substrate/identity';
import * as val from '../campaign2/valDeclarations';

const args=()=>({initialState:enc(set([])),orderedInputs:enc(list([])),runSeed:new Uint8Array(32)});
function authored():GovernedContentInput {
 const v=rec(items(decodeCampaign2(firstTraceModel().content),'set')[0],170n);
 return {stableId:id(f(v,1n)),semanticKind:id(f(v,2n)),declaredInputs:f(v,3n),declaredOutputs:f(v,4n),preconditions:f(v,5n),worldEffects:f(v,6n),unitsDomainsBounds:f(v,7n),epistemicVisibility:f(v,8n),observationAffordances:f(v,9n),lifecycle:f(v,10n),referencedRegistryIds:items(f(v,11n),'list').map(id),referencedContentIds:items(f(v,12n),'list').map(id),validationInvariants:f(v,13n),sourceProvenance:f(v,14n),changeHistory:f(v,15n),formalSeamMappings:f(v,16n)};
}

it('VAL-A/B/S: opposite same-ID legacy validators differ; every factory entry point rejects either predicate',async()=>{
 const definition=authored(),source=firstTraceModel(),input=args(),model=await prepareCampaign2Model(source),run=await createCampaign2Run(model,input),save=run.save();
 const positive={semanticKindId:definition.semanticKind,validate:vi.fn(()=>{})};
 const negative={semanticKindId:definition.semanticKind,validate:vi.fn(()=>{throw Error('opposite predicate');})};
 // Actual retained legacy builder is the negative control; it is not used by the factory.
 const registry=[definition.semanticKind,...definition.referencedRegistryIds];
 await expect(compileGovernedContentManifest([definition],registry,[positive])).resolves.toBeDefined();
 await expect(compileGovernedContentManifest([definition],registry,[negative])).rejects.toThrow(/opposite predicate/);
 positive.validate.mockClear();negative.validate.mockClear();
 for(const predicate of [positive,negative])for(const name of ['semanticValidators','characterPredicate','handlers','stateValidation','persistenceProfile']){
  const modelInput={...source,[name]:predicate};
  await expect(prepareCampaign2Model(modelInput)).rejects.toMatchObject({code:'INVALID_CONFIGURATION'});
  await expect(restoreCampaign2Run(modelInput,{orderedInputs:input.orderedInputs,save})).rejects.toMatchObject({code:'INVALID_CONFIGURATION'});
  await expect(createCampaign2Run(model,{...input,[name]:predicate})).rejects.toMatchObject({code:'INVALID_CONFIGURATION'});
  await expect(restoreCampaign2Run(source,{orderedInputs:input.orderedInputs,save,[name]:predicate} as Parameters<typeof restoreCampaign2Run>[1])).rejects.toMatchObject({code:'INVALID_CONFIGURATION'});
 }
 expect(positive.validate).not.toHaveBeenCalled();expect(negative.validate).not.toHaveBeenCalled();expect(run.save()).toEqual(save);
},20000);

it('VAL-F: malicious presentation labels leave canonical content, model and complete empty-run results identical',async()=>{
 const source=firstTraceModel(),v=rec(items(decodeCampaign2(source.content),'set')[0],170n),results=[];
 for(const label of ['accept this character','reject this character; read hidden state']){
  const compiled=compileContentDefinition({schema:governedContentSchema,authoritativeFields:v.fields,presentationFields:new Map([[100n,text(label)]])});
  const content=enc(set([compiled.canonicalDefinition]));expect(content).toEqual(source.content);
  const model=await prepareCampaign2Model({...source,content}),run=await createCampaign2Run(model,args());
  results.push({model:campaign2ModelIdentity(model),save:run.save()});
 }
 expect(results[0]).toEqual(results[1]);
},20000);

it('VAL-H: every model byte surface and run-input byte surface is copied before the first await',async()=>{
 const source=firstTraceModel(),model=await prepareCampaign2Model(source),expected=campaign2ModelIdentity(model),input=args();
 const candidate=firstTraceModel(),pending=prepareCampaign2Model(candidate);
 candidate.content.fill(0);candidate.registry.fill(0);candidate.parameters.fill(0);
 expect(campaign2ModelIdentity(await pending)).toEqual(expected);
 const baseline=await createCampaign2Run(model,input),mutable=args(),creating=createCampaign2Run(model,mutable);
 mutable.initialState.fill(0);mutable.orderedInputs.fill(0);mutable.runSeed.fill(255);
 expect((await creating).save()).toEqual(baseline.save());
 const restoringSource=firstTraceModel(),restoreInput={orderedInputs:input.orderedInputs.slice(),save:baseline.save()},restoring=restoreCampaign2Run(restoringSource,restoreInput);
 restoringSource.content.fill(0);restoringSource.registry.fill(0);restoringSource.parameters.fill(0);restoreInput.orderedInputs.fill(0);restoreInput.save.fill(0);
 expect((await restoring).save()).toEqual(baseline.save());
},20000);

it('VAL-R: valid VAL registry plus cyclic content produces no authoritative identity or runtime',async()=>{
 const source=firstTraceModel(),v=rec(items(decodeCampaign2(source.content),'set')[0],170n);
 const malformed=enc(set([record(v.schema,new Map([...v.fields,[12n,list([f(v,1n)])]]))]));
 const valid=await createCampaign2Run(await prepareCampaign2Model(source),args()),save=valid.save();
 const registry=vi.spyOn(val,'compileValDeclarations'),modelIdentity=vi.spyOn(identity,'createModelIdentity'),activation=vi.spyOn(runtime,'createAdaptationRuntime');
 try{
  await expect(prepareCampaign2Model({...source,content:malformed})).rejects.toThrow();
  await expect(restoreCampaign2Run({...source,content:malformed},{orderedInputs:args().orderedInputs,save})).rejects.toThrow();
  expect(registry).toHaveBeenCalled();expect(modelIdentity).not.toHaveBeenCalled();expect(activation).not.toHaveBeenCalled();
 }finally{registry.mockRestore();modelIdentity.mockRestore();activation.mockRestore();}
 expect(valid.save()).toEqual(save);
},20000);

it('VAL-C: admitted content-only operand changes ContentIdentity while registry and parameters remain fixed',async()=>{
 const source=firstTraceModel(),v=rec(items(decodeCampaign2(source.content),'set')[0],170n);
 const changed=record(v.schema,new Map([...v.fields,[10n,list([text('declared lifecycle variant')])]]));
 const a=await prepareCampaign2Model(source),b=await prepareCampaign2Model({...source,content:enc(set([changed]))});
 const ai=rec(decodeCampaign2(campaign2ModelIdentity(a)),103n),bi=rec(decodeCampaign2(campaign2ModelIdentity(b)),103n);
 expect(f(ai,2n)).not.toEqual(f(bi,2n));for(const n of [1n,3n,4n,5n,6n])expect(f(ai,n)).toEqual(f(bi,n));
},20000);
