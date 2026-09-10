import {describe,it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataField as f,dataRecord as rec,dataItems as items,dataUnsigned as u,dataIdentity as id,dataKey as key} from '../campaign2/canonicalData';
import {compileReceivingModel} from '../campaign3/receivingModel';
import {compileReceivingInputs,receivingInputFacts} from '../campaign3/receivingInputs';
import {createReceivingRuntime} from '../campaign3/receivingRuntime';
import {compileReceivingTraceValidator} from '../campaign3/receivingTrace';
import {decodeReceiving as decode} from '../campaign3/receivingCodecs';
import {receivingSource,receivingOriginals,initialReceiving,taskKey} from './receivingFixtures';
function event(value:CanonicalValue):ScheduledEvent{const v=rec(value,(value as {schema:{typeId:bigint}}).schema.typeId);return {eventId:u(f(v,1n)),dueAt:simInstant((f(v,2n) as {value:bigint}).value),phase:u(f(v,3n)),eventSequence:u(f(v,4n)),eventTypeId:id(f(v,5n)),payload:f(v,6n),dependencies:f(v,7n),causalParentEventIds:items(f(v,8n),'list').map(u)};}
describe('independent receiving trace verifier',()=>{
 it('validates all16 executed stages and rejects a change to each of the19 trace fields',async()=>{
  const model=await compileReceivingModel(receivingSource),initial=model.initialState(enc(initialReceiving(['a','b']).canonicalValue())),inputs=await compileReceivingInputs(enc(receivingOriginals()),enc(initial.canonicalValue()),model.modelIdentity,new Uint8Array(32),taskKey),runtime=createReceivingRuntime(model,inputs,initial),validate=compileReceivingTraceValidator(model,receivingInputFacts(inputs).runIdentity.value);
  await runtime.settleNextInstant();let stages=0,changes=0;
  const registrations=model.stageBytes().map(b=>rec(decode(b),515n));
  for(const value of runtime.snapshot().trace){const trace=rec(value,160n),e=event(f(trace,4n)),registration=registrations.find(v=>key(f(v,4n))===key(e.eventTypeId));if(!registration)continue;stages++;
   const facts={event:e,state:initial,registration,output:items(f(trace,13n),'list')[0],children:items(f(trace,18n),'list').map(event)};expect(()=>validate(facts,trace)).not.toThrow();
   for(let field=1n;field<=19n;field++){const altered=record(trace.schema,new Map([...trace.fields].map(([n,v])=>[n,n===field?list([true]):v])));expect(()=>validate(facts,altered)).toThrow(/receiving trace field/);changes++;}
  }
  expect(stages).toBe(16);expect(changes).toBe(304);
 },10000);
});
