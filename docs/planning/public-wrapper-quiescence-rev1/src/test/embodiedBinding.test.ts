import {beforeAll,describe,it,expect} from 'vitest';
import freeze from '../../docs/planning/campaign3-embodied-model-rev2/FREEZE.json';
import {embodiedFixtureBytes as bytes} from './embodiedFixtures';
import {compileEmbodiedModel} from '../campaign3/embodiedModel';
import {compileEmbodiedInputs,embodiedInputFacts,beginEmbodiedIngress,embodiedAdmittedInputFacts} from '../campaign3/embodiedAdmission';
import {createEmbodiedRuntime} from '../campaign3/embodiedRuntime';
import {compileEmbodiedRequiredProjections} from '../campaign2/requiredProjection';
import {decodeEmbodied as decode,embodiedRecord as r} from '../campaign3/embodiedCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id} from '../campaign2/canonicalData';
import {canonicalEncode as enc,record,list,text,typedIdentifier,unsigned,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
let model:Awaited<ReturnType<typeof compileEmbodiedModel>>,input:Awaited<ReturnType<typeof compileEmbodiedInputs>>,registrations:Uint8Array[],events:ScheduledEvent[],sample:CanonicalValue,carrier:CanonicalValue,experience:CanonicalValue;
const change=(v:CanonicalValue,n:bigint,value:CanonicalValue)=>{const a=rec(v,(v as {schema:{typeId:bigint}}).schema.typeId);return record(a.schema,new Map([...a.fields].map(([k,x])=>[k,k===n?value:x])));};
beforeAll(async()=>{
 model=await compileEmbodiedModel({...freeze.versions,content:bytes('baseline/content.cenc.hex'),registry:bytes('baseline/registry.cenc.hex'),parameters:bytes('baseline/parameters.cenc.hex')});const initial=bytes('runs/baseline/initial-state.cenc.hex');input=await compileEmbodiedInputs(bytes('runs/baseline/ordered-inputs.cenc.hex'),initial,model.modelIdentity,new Uint8Array(32));
 const rows=items(items(decode(model.source.registry),'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n));registrations=[465n,469n,470n].map(n=>enc(f(rows.find(e=>typeof f(e,4n)!=='boolean'&&(f(e,4n) as {schema:{typeId:bigint}}).schema.typeId===n)!,4n)));
 const runtime=createEmbodiedRuntime(model,input,model.state.restoreState(initial));await runtime.settleNextInstant();const out=runtime.snapshot();sample=out.outputs[0];experience=out.outputs[1];
 events=out.trace.map(v=>{const e=rec(f(rec(v,160n),4n),130n),n=(k:bigint)=>(f(e,k) as {value:bigint}).value;return {eventId:n(1n),dueAt:simInstant(n(2n)),phase:n(3n),eventSequence:n(4n),eventTypeId:id(f(e,5n)),payload:f(e,6n),dependencies:f(e,7n),causalParentEventIds:items(f(e,8n),'list').map(v=>(v as {value:bigint}).value)};});carrier=events[1].payload;
});
function scope(){return beginEmbodiedIngress(input,10n,registrations[0],registrations[1],registrations[2]);}
function toSettlement(){const ingress=scope();ingress.admitSource(events[0]);ingress.sampleProduced(events[0],sample,carrier);for(let i=1;i<=4;i++){ingress.bindChild(events[i-1],events[i]);ingress.admitInternal(events[i]);}return ingress;}
describe('EMB genuine production/SEM binding and allocated child controls',()=>{
 it('admits the real pressure sample only after its actual SEM and projects field2 ObserverId',()=>{
  const ingress=toSettlement();expect(()=>ingress.admitPressure(events[5])).toThrow();ingress.settled(events[4],experience);ingress.bindChild(events[4],events[5]);const token=ingress.admitPressure(events[5]);
  const requirement=f(rec(f(rec(decode(registrations[1]),469n),3n),471n),5n),prj=compileEmbodiedRequiredProjections(registrations[1],enc(requirement),[],model.state,model.content);expect(prj.construct(token,model.state.restoreState(bytes('runs/baseline/initial-state.cenc.hex'))).actualReadRecords()).toHaveLength(1);
  expect(()=>ingress.admitPressure(events[5])).toThrow();ingress.completePressure(events[5]);ingress.finish();expect(()=>embodiedAdmittedInputFacts(token)).toThrow();
 });
 it('rejects same-observer experience substitution, changed support and premature settlement',()=>{
  for(const x of [change(experience,1n,typedIdentifier(1106,unsigned(999))),change(experience,8n,list([])),undefined]){const ingress=toSettlement();expect(()=>ingress.settled(events[4],x)).toThrow();ingress.abort();}
  const ingress=scope();expect(()=>ingress.settled(events[4],experience)).toThrow();ingress.abort();
  const bound=scope();bound.admitSource(events[0]);bound.sampleProduced(events[0],sample,carrier);for(let i=1;i<=4;i++){bound.bindChild(events[i-1],events[i]);if(i<4)bound.admitInternal(events[i]);}expect(()=>bound.settled(events[4],experience)).toThrow();bound.admitInternal(events[4]);expect(()=>bound.settled({...events[4],dueAt:simInstant(11n)},experience)).toThrow();bound.settled(events[4],experience);bound.abort();
 });
 it('rejects each changed allocated-child coordinate before publication',()=>{
  const child=events[1],variants=[{...child,eventId:events[0].eventId},{...child,eventSequence:0n},{...child,phase:12n},{...child,dueAt:simInstant(11n)},{...child,eventTypeId:typedIdentifier(1001,text('event/embodied-pressure-present'))},{...child,causalParentEventIds:[]},{...child,causalParentEventIds:[999n]},{...child,payload:sample},{...child,dependencies:list([true])}];
  for(const bad of variants){const ingress=scope();ingress.admitSource(events[0]);ingress.sampleProduced(events[0],sample,carrier);expect(()=>ingress.bindChild(events[0],bad)).toThrow();expect(()=>ingress.admitInternal(bad)).toThrow();ingress.abort();}
 });
 it('does not accept altered sample bytes despite matching support identity',()=>{
  const changed=change(sample,5n,r(462,[rational(60,1),rational(70,1)])),ingress=toSettlement();ingress.settled(events[4],experience);expect(()=>ingress.bindChild(events[4],{...events[5],payload:changed})).toThrow();ingress.abort();
  const other=scope();other.admitSource(events[0]);expect(()=>other.sampleProduced(events[0],changed,carrier)).toThrow();other.abort();
 });
});
