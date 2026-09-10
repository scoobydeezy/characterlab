import {describe,it,expect} from 'vitest';
import freeze from '../../docs/planning/campaign3-embodied-model-rev2/FREEZE.json';
import {embodiedFixtureBytes as bytes} from './embodiedFixtures';
import {compileEmbodiedModel} from '../campaign3/embodiedModel';
import {compileEmbodiedInputs,embodiedInputFacts} from '../campaign3/embodiedAdmission';
import {createEmbodiedRuntime} from '../campaign3/embodiedRuntime';
import {compileEmbodiedTraceValidator} from '../campaign3/embodiedTrace';
import {decodeEmbodied as decode,embodiedRecord as r} from '../campaign3/embodiedCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id} from '../campaign2/canonicalData';
import {typedIdentifier,text,rational,unsigned,record,list} from '../substrate/canonicalEncoding';
type Context=Parameters<ReturnType<typeof compileEmbodiedTraceValidator>>[0];
async function witness(name='baseline'){
 const model=await compileEmbodiedModel({...freeze.versions,content:bytes(name+'/content.cenc.hex'),registry:bytes(name+'/registry.cenc.hex'),parameters:bytes(name+'/parameters.cenc.hex')}),initial=bytes('runs/'+name+'/initial-state.cenc.hex'),state=model.state.restoreState(initial),inputs=await compileEmbodiedInputs(bytes('runs/'+name+'/ordered-inputs.cenc.hex'),initial,model.modelIdentity,new Uint8Array(32)),event=embodiedInputFacts(inputs).events[0];
 const runtime=createEmbodiedRuntime(model,inputs,state);await runtime.settleNextInstant();const row=rec(runtime.snapshot().trace[0],160n),C=id(decode(model.characterBytes())),O=id(decode(model.observerBytes()));
 const roster=state.entries().find(e=>e.path.rootStateTypeId===268n)!,body=state.entries().find(e=>e.path.rootStateTypeId===455n)!;
 const accessor=(s:string)=>typedIdentifier(1028,text(s));
 const context:Context={event,state,outputs:items(f(row,13n),'list'),quantization:items(f(row,15n),'list'),patch:{operations:[]},diffs:[],allocated:[0n,1n],reads:[{accessorId:accessor('ResolvedCharacterSubject'),path:roster.path,presence:true,value:C,derivedSources:[state.read(roster.path)],transformationId:accessor('ResolvedCharacterSubject')},...(name==='baseline'?[{accessorId:accessor('accessor/embodied-reserve-anchor'),path:body.path,presence:true,value:body.value,derivedSources:[]}]:[])]};
 return {context:{...context,childValues:items(f(row,18n),'list'),identities:{model:f(row,2n),run:f(row,3n)}},row,validate:compileEmbodiedTraceValidator(decode(model.definitionBytes()),C,O)};
}
describe('EMB trace-side adversarial component verification',()=>{
 it('rejects drift in every metadata/projection field against actual execution facts',async()=>{
  const {context,row,validate}=await witness();expect(()=>validate(context,row)).not.toThrow();
  for(const field of [1n,2n,3n,4n,5n,6n,7n,8n,9n,10n,11n,12n,13n,14n,15n,16n,17n,18n,19n]){
   const bad=record(row.schema,new Map([...row.fields].map(([k,v])=>[k,k===field?list([true]):v])));expect(()=>validate(context,bad)).toThrow();
  }
 });
 it('rejects missing, additional or coherently wrong hidden bin operations',async()=>{
  const {context:c,validate}=await witness();expect(()=>validate(c)).not.toThrow();
  for(const quantization of [[],[...c.quantization,...c.quantization],[r(484,[rational(79,1),rational(100,1),rational(10,1),unsigned(7)])],[r(484,[rational(70,1),rational(200,1),rational(10,1),unsigned(7)])]])expect(()=>validate({...c,quantization})).toThrow(/bin operation/);
 });
 it('rejects extra/invented reads, false direct-read derivation and occurrence reuse',async()=>{
  const {context:c,validate}=await witness();
  for(const reads of [[...c.reads,c.reads[0]],c.reads.slice(0,1),[c.reads[0],{...c.reads[1],derivedSources:[c.state.read(c.reads[1].path)]}]])expect(()=>validate({...c,reads})).toThrow(/read closure/);
  const sample=rec(c.outputs[0],461n),reused=record(sample.schema,new Map([...sample.fields].map(([k,v])=>[k,k===1n?typedIdentifier(1115,unsigned(99)):v])));
  expect(()=>validate({...c,outputs:[reused]})).toThrow(/payload closure/);
  for(const allocated of [[0n],[0n,1n,2n]])expect(()=>validate({...c,allocated})).toThrow(/allocation budget/);
 });
 it('rejects read-then-redact and phantom quantization in the unavailable branch',async()=>{
  const {context:c,validate}=await witness('denied');expect(()=>validate(c)).not.toThrow();const {context:present}=await witness();
  expect(()=>validate({...c,reads:present.reads})).toThrow(/read closure/);expect(()=>validate({...c,quantization:present.quantization})).toThrow(/quantization/);
  expect(()=>validate({...c,outputs:present.outputs})).toThrow(/payload closure/);
 });
});
