import {describe,it,expect} from 'vitest';
import {canonicalEncode as enc,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataField as f,dataRecord as rec,dataItems as items,dataUnsigned as u,dataIdentity as id} from '../campaign2/canonicalData';
import {compileReceivingModel} from '../campaign3/receivingModel';
import {compileReceivingInputs} from '../campaign3/receivingInputs';
import {beginReceivingIngress} from '../campaign3/receivingAdmission';
import {createReceivingRuntime} from '../campaign3/receivingRuntime';
import {receivingSource,receivingOriginals,initialReceiving,taskKey,occurrence} from './receivingFixtures';
function event(value:CanonicalValue):ScheduledEvent{const v=rec(value,(value as {schema:{typeId:bigint}}).schema.typeId);return {eventId:u(f(v,1n)),dueAt:simInstant((f(v,2n) as {value:bigint}).value),phase:u(f(v,3n)),eventSequence:u(f(v,4n)),eventTypeId:id(f(v,5n)),payload:f(v,6n),dependencies:f(v,7n),causalParentEventIds:items(f(v,8n),'list').map(u)};}
describe('receiving actual sibling association controls',()=>{
 it('requires both completed siblings and rejects foreign occurrence bytes at both joins',async()=>{
  const model=await compileReceivingModel(receivingSource),initial=model.initialState(enc(initialReceiving().canonicalValue())),inputs=await compileReceivingInputs(enc(receivingOriginals()),enc(initial.canonicalValue()),model.modelIdentity,new Uint8Array(32),taskKey),runtime=createReceivingRuntime(model,inputs,initial);await runtime.settleNextInstant();
  const rows=runtime.snapshot().trace.map(v=>rec(v,160n));
  for(const scenario of ['missing-body','mixed-candidates','mixed-raw','repeat-output','changed-sequence']){
   const ingress=beginReceivingIngress(inputs,45n,model.stageBytes());let hit=false;
   for(const row of rows){const e=event(f(row,4n)),name=(e.eventTypeId.payload as {value:string}).value,children=items(f(row,18n),'list').map(event),outputs=items(f(row,13n),'list');
    if(name.startsWith('event/embodied-receiving-')){
     if(name==='event/embodied-receiving-'+scenario){const payload=rec(e.payload,scenario==='mixed-candidates'?491n:498n),sibling=rec(f(payload,2n),scenario==='mixed-candidates'?489n:403n),changedSibling=record(sibling.schema,new Map([...sibling.fields].map(([n,v])=>[n,n===1n?occurrence(scenario==='mixed-candidates'?1132:1133,999):v]))),changed=record(payload.schema,new Map([...payload.fields].map(([n,v])=>[n,n===2n?changedSibling:v])));expect(()=>ingress.admit({...e,payload:changed})).toThrow();hit=true;break;}
     if(scenario==='changed-sequence'&&name.endsWith('mixed-candidates')){expect(()=>ingress.admit({...e,eventSequence:e.eventSequence+1n})).toThrow();hit=true;break;}
     ingress.admit(e);
     if(scenario==='missing-body'&&name.endsWith('body-options'))continue;
     if(scenario==='missing-body'&&name.endsWith('task-candidates')){expect(()=>ingress.complete(e,outputs[0])).toThrow(/prerequisite/);hit=true;break;}
     ingress.complete(e,outputs[0]);if(scenario==='repeat-output'&&name.endsWith('body-options')){expect(()=>ingress.complete(e,outputs[0])).toThrow(/repeated/);hit=true;break;}
    }else{ingress.admitBodyOrDeadline(e);ingress.completeBodyOrDeadline(e,e.phase===60n?[]:children.map(c=>({dueAt:c.dueAt,phase:c.phase,eventTypeId:c.eventTypeId,payload:c.payload,dependencies:c.dependencies})),e.phase===60n?outputs[0]:undefined);}
    ingress.bindChildren(e,children);
   }
   expect(hit).toBe(true);ingress.abort();
  }
 },10000);
});
