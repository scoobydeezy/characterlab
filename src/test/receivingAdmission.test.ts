import {beforeAll,describe,it,expect} from 'vitest';
import {canonicalEncode as enc,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {compileReceivingInputs,receivingInputFacts} from '../campaign3/receivingInputs';
import {beginReceivingIngress,receivingAdmittedInputFacts} from '../campaign3/receivingAdmission';
import {beginReceivingBodyIngress,embodiedAdmittedInputFacts} from '../campaign3/embodiedAdmission';
import {compileReceivingRequiredProjections,compileRequiredProjections} from '../campaign2/requiredProjection';
import {dataField as f,dataRecord as rec,dataKey as key} from '../campaign2/canonicalData';
import {receivingComponents,receivingDefinitions,receivingOriginals,initialReceiving,taskKey,taskSource} from './receivingFixtures';
let model:Awaited<ReturnType<typeof receivingComponents>>;
const regs=receivingDefinitions.map(v=>f(v,4n)).filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===515n).map(enc);
const bodyRegs=[465n,469n,470n].map(type=>enc(f(receivingDefinitions.find(v=>(f(v,4n) as {schema:{typeId:bigint}}).schema.typeId===type)!,4n)));
const workspace=f(receivingDefinitions.find(v=>(f(v,4n) as {schema:{typeId:bigint}}).schema.typeId===515n&&(f(rec(f(v,4n),515n),1n) as {value:bigint}).value===1n)!,4n);
beforeAll(async()=>{model=await receivingComponents();});
const compile=(value=receivingOriginals())=>compileReceivingInputs(enc(value),enc(initialReceiving().canonicalValue()),model.modelIdentity,new Uint8Array(32),taskKey);
describe('receiving input authority components',()=>{
 it('pairs actual originals, derives a deadline after them and preserves source coordinates',async()=>{
  const input=await compile(),events=receivingInputFacts(input).events;expect(events.map(e=>[e.eventId,e.phase,e.dueAt])).toEqual([[0n,10n,45n],[1n,40n,45n],[2n,140n,100n]]);
  const body=beginReceivingBodyIngress(input,45n,...bodyRegs as [Uint8Array,Uint8Array,Uint8Array]),token=body.admitSource(events[0]);expect(embodiedAdmittedInputFacts(token).event.eventId).toBe(0n);body.abort();expect(()=>embodiedAdmittedInputFacts(token)).toThrow();
 });
 it('constructs real515 PRJ only from a live exact original and expires it on abort',async()=>{
  const input=await compile(),event=receivingInputFacts(input).events[1],ingress=beginReceivingIngress(input,45n,regs),state=initialReceiving();
  const projection=compileReceivingRequiredProjections(enc(workspace),enc(f(rec(workspace,515n),9n)),[],model.state,model.content);
  expect(()=>projection.construct({} as never,state)).toThrow(/admission/);
  const token=ingress.admit(event),projected=projection.construct(token,state);expect(projected.actualReadRecords()).toHaveLength(1);
  expect(()=>ingress.admit(event)).toThrow();ingress.abort();expect(()=>receivingAdmittedInputFacts(token)).toThrow();expect(()=>projection.construct(token,state)).toThrow();
  expect(()=>compileRequiredProjections(enc(workspace),enc(f(rec(workspace,515n),9n)),[],model.state,model.content)).toThrow();
 });
 it('rejects changed coordinates, unbound input and token-shaped copies before projection',async()=>{
  const input=await compile(),event=receivingInputFacts(input).events[1];
  for(const changed of [{...event,eventSequence:99n},{...event,eventId:99n},{...event,dueAt:46n}]){const ingress=beginReceivingIngress(input,45n,regs);expect(()=>ingress.admit(changed as typeof event)).toThrow();ingress.abort();}
  expect(()=>receivingAdmittedInputFacts(Object.freeze({}) as never)).toThrow();
 });
 it('binds the actual produced child once and rejects a forged payload',async()=>{
  const input=await compile(),event=receivingInputFacts(input).events[1],ingress=beginReceivingIngress(input,45n,regs);ingress.admit(event);const emissions=ingress.complete(event,taskSource().workspace);
  const child={...emissions[0],eventId:3n,eventSequence:3n,causalParentEventIds:[event.eventId]};expect(()=>ingress.bindChildren(event,[{...child,payload:event.payload}])).toThrow();
  ingress.bindChildren(event,[child]);expect(()=>ingress.bindChildren(event,[child])).toThrow();expect(()=>ingress.admit(child)).not.toThrow();expect(()=>ingress.finish()).toThrow(/incomplete/);ingress.abort();
 });
 it('rejects missing pairs, duplicate originals, reversed order and generated public payloads',async()=>{
  const original=receivingOriginals() as Extract<CanonicalValue,{kind:'list'}>,a=original.items[0],b=original.items[1];
  for(const bad of [list([a]),list([b]),list([a,a,b]),list([b,a]),list([list([(a as typeof original).items[0],(a as typeof original).items[1],(a as typeof original).items[2],taskSource().workspace,list([])])])])await expect(compile(bad)).rejects.toThrow();
 });
});
