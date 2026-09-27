import {beforeAll,describe,it,expect} from 'vitest';
import {embodiedFixtureBytes as bytes} from './embodiedFixtures';
import freeze from '../../docs/planning/campaign3-embodied-model-rev2/FREEZE.json';
import {compileEmbodiedModel} from '../campaign3/embodiedModel';
import {compileEmbodiedInputs,embodiedInputFacts,beginEmbodiedIngress,embodiedAdmittedInputFacts} from '../campaign3/embodiedAdmission';
import {compileEmbodiedRequiredProjections,compileRequiredProjections} from '../campaign2/requiredProjection';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {canonicalEncode as enc,list,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
let model:Awaited<ReturnType<typeof compileEmbodiedModel>>;
let rows:Extract<CanonicalValue,{kind:'record'}>[],registrations:Uint8Array[];
beforeAll(async()=>{
 model=await compileEmbodiedModel({...freeze.versions,content:bytes('baseline/content.cenc.hex'),registry:bytes('baseline/registry.cenc.hex'),parameters:bytes('baseline/parameters.cenc.hex')});
 rows=items(items(decode(model.source.registry),'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n) as typeof rows;
 registrations=[465n,469n,470n].map(type=>enc(f(rows.find(r=>typeof f(r,4n)!=='boolean'&&(f(r,4n) as {schema:{typeId:bigint}}).schema.typeId===type)!,4n)));
});
const compile=()=>compileEmbodiedInputs(bytes('runs/baseline/ordered-inputs.cenc.hex'),bytes('runs/baseline/initial-state.cenc.hex'),model.modelIdentity,new Uint8Array(32));
describe('EMB original admission and shared PRJ',()=>{
 it('projects only from the live original source and traces the real roster read',async()=>{
  const input=await compile(),event=embodiedInputFacts(input).events[0],ingress=beginEmbodiedIngress(input,10n,registrations[0],registrations[1],registrations[2]);
  const requirement=enc(f(rec(f(rec(decode(registrations[0]),465n),3n),466n),3n));
  const projection=compileEmbodiedRequiredProjections(registrations[0],requirement,[],model.state,model.content);
  const state=model.state.restoreState(bytes('runs/baseline/initial-state.cenc.hex'));
  expect(()=>projection.construct({} as never,state)).toThrow(/admission/);
  const admitted=ingress.admitSource(event),result=projection.construct(admitted,state);
  expect(result.actualReadRecords()).toHaveLength(1);expect(enc(result.actualReadRecords()[0].value!)).toEqual(model.characterBytes());
  expect(()=>ingress.admitSource(event)).toThrow();ingress.abort();expect(()=>embodiedAdmittedInputFacts(admitted)).toThrow();
 });
 it('old PRJ dispatch rejects the new layout',()=>{
  const requirement=enc(f(rec(f(rec(decode(registrations[0]),465n),3n),466n),3n));
  expect(()=>compileRequiredProjections(registrations[0],requirement,[],model.state,model.content)).toThrow();
 });
 it('rejects changed original sequence before projection admission',async()=>{
  const input=await compile(),event=embodiedInputFacts(input).events[0],ingress=beginEmbodiedIngress(input,10n,registrations[0],registrations[1],registrations[2]);
  expect(()=>ingress.admitSource({...event,eventSequence:999n})).toThrow();ingress.abort();
 });
 it('rejects a valid channel definition as a sampling opportunity (EPACK-I component)',async()=>{
  const ordered=decode(bytes('runs/baseline/ordered-inputs.cenc.hex')) as Extract<CanonicalValue,{kind:'list'}>;
  const channel=f(rows.find(r=>typeof f(r,4n)!=='boolean'&&(f(r,4n) as {schema:{typeId:bigint}}).schema.typeId===458n)!,4n);
  const first=ordered.items[0] as typeof ordered;
  const bad=list([list(first.items.map((v,i)=>i===3?channel:v)),...ordered.items.slice(1)]);
  await expect(compileEmbodiedInputs(enc(bad),bytes('runs/baseline/initial-state.cenc.hex'),model.modelIdentity,new Uint8Array(32))).rejects.toThrow();
 });
 it('rejects repeated same-instant sample, missing input slot and nonempty dependencies',async()=>{
  const ordered=decode(bytes('runs/baseline/ordered-inputs.cenc.hex')) as Extract<CanonicalValue,{kind:'list'}>,first=ordered.items[0] as typeof ordered;
  for(const bad of [list([first,first]),list([list(first.items.slice(0,4))]),list([list(first.items.map((v,i)=>i===4?list([true]):v))])])await expect(compileEmbodiedInputs(enc(bad),bytes('runs/baseline/initial-state.cenc.hex'),model.modelIdentity,new Uint8Array(32))).rejects.toThrow();
 });
});
