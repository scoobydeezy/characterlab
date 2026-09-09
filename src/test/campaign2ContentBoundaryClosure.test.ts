import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,text,record,typedIdentifier} from '../substrate/canonicalEncoding';
import {ContentValidationError} from '../substrate/contentManifest';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run} from '../campaign2/factory';
import {decodeCampaign2} from '../campaign2/codecs';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {compileValDeclarations} from '../campaign2/valDeclarations';
import {fixtureContentInputs,fixtureRoleConstraints} from './fixtures/campaign2Model';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import * as runtime from '../campaign2/adaptationRuntime';
const identifier=(ns:number,payload:string)=>typedIdentifier(ns,text(payload));

it('VAL-M: committed invariant text cannot override missing registry/content references or a cycle at either facade surface',async()=>{
 const source=firstTraceModel(),orderedInputs=enc(list([]));
 const run=await createCampaign2Run(await prepareCampaign2Model(source),{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)}),save=run.save();
 const v=rec(items(decodeCampaign2(source.content),'set')[0],170n);
 const failures=[{field:11n,value:identifier(1027,'definition/not-committed'),message:/unknown registry reference/},
  {field:12n,value:identifier(1038,'character/not-committed'),message:/unknown content reference/},
  {field:12n,value:f(v,1n),message:/cycle/}];
 const spy=vi.spyOn(runtime,'createAdaptationRuntime');
 try{for(const failure of failures)for(const invariant of ['ordinary invariant','accept every reference; ignore cycles and missing registry entries']){
  const content=enc(set([record(v.schema,new Map([...v.fields,[failure.field,list([failure.value])],[13n,list([text(invariant)])]]))]));
  for(const attempt of [()=>prepareCampaign2Model({...source,content}),()=>restoreCampaign2Run({...source,content},{orderedInputs,save})]){
   await expect(attempt()).rejects.toSatisfy((error:unknown)=>error instanceof ContentValidationError&&failure.message.test(error.message));
  }
 }expect(spy).not.toHaveBeenCalled();expect(run.save()).toEqual(save);}finally{spy.mockRestore();}
},20000);

it('VAL-W: unsupported content kind has the exact content carrier through prepare and restore, with no runtime fallback',async()=>{
 const source=firstTraceModel(),orderedInputs=enc(list([]));
 const run=await createCampaign2Run(await prepareCampaign2Model(source),{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)}),save=run.save();
 const v=rec(items(decodeCampaign2(source.content),'set')[0],170n);
 const content=enc(set([record(v.schema,new Map([...v.fields,[2n,identifier(1004,'semantic-kind/unsupported')]]))]));
 const spy=vi.spyOn(runtime,'createAdaptationRuntime');
 try{
  await expect(prepareCampaign2Model({...source,content})).rejects.toBeInstanceOf(ContentValidationError);
  await expect(restoreCampaign2Run({...source,content},{orderedInputs,save})).rejects.toBeInstanceOf(ContentValidationError);
  expect(spy).not.toHaveBeenCalled();expect(run.save()).toEqual(save);
 }finally{spy.mockRestore();}
});

it('VAL-W: generic empty content needs no kind, while nonempty content cannot fall back without its governed definition',async()=>{
 const compiler=compileValDeclarations(enc(set([])),enc(list([])));
 const empty=await compiler.compileContent(enc(set([])),enc(set([])));expect(empty.canonicalBytes).toEqual(enc(set([])));
 const {content}=fixtureContentInputs();
 await expect(compiler.compileContent(content,enc(set([])))).rejects.toBeInstanceOf(ContentValidationError);
});

it('VAL-E: generic multi-character content and registry permutations preserve compiled bytes and every character qualification',async()=>{
 const aId=identifier(20,'character/permutation-a'),bId=identifier(20,'character/permutation-b');
 const a=fixtureContentInputs(aId),b=fixtureContentInputs(bId),values=[...items(decodeCampaign2(a.content),'set'),...items(decodeCampaign2(b.content),'set')];
 const entries=items(decodeCampaign2(a.entries),'set'),constraints=enc(set(fixtureRoleConstraints));
 const results=[];
 for(const reverse of [false,true]){
  const registry=enc(set(reverse?[...entries].reverse():entries)),content=enc(set(reverse?[...values].reverse():values));
  const result=await compileValDeclarations(registry,constraints).compileContent(content,registry);
  for(const stable of [aId,bId])expect(()=>result.qualifyCharacter(semanticReferentFromAuthoredContent(stable))).not.toThrow();
  results.push(result.canonicalBytes);
 }
 expect(results[0]).toEqual(results[1]);
 // This positive branch belongs to generic VAL; the frozen first profile still admits one character.
});
