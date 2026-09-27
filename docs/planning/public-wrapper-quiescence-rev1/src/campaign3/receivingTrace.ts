/** embodied-receiving-trace/0.1-candidate. Independent trace-side field/read closure.
 * This infrastructure receives state; character transformations never do. */
import {list,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,actualReadRecordValue,statePatchValue,type ActualReadRecord} from '../substrate/state';
import {scheduledEventValue} from '../substrate/persistence';
import {SchedulerContractError,type ScheduledEvent} from '../substrate/scheduler';
import {dataField as f,dataRecord as rec,dataItems as items,dataUnsigned as u,dataIdentity as id,dataKey as key} from '../campaign2/canonicalData';
import {decodeReceiving as decode} from './receivingCodecs';
import {readQ,ZERO} from '../campaign2/cognitiveMath';
import type {compileReceivingModel} from './receivingModel';
type Model=Awaited<ReturnType<typeof compileReceivingModel>>;
export interface ReceivingTraceFacts {readonly event:ScheduledEvent;readonly state:AuthoritativeState;readonly registration:CanonicalValue;readonly output:CanonicalValue;readonly children:readonly ScheduledEvent[];}
export function compileReceivingTraceValidator(model:Model,run:CanonicalValue){
 const C=decode(model.characterBytes()),O=decode(model.observerBytes()),ID=(ns:number,s:string)=>typedIdentifier(ns,text(s));
 const fail=(why:string):never=>{throw new SchedulerContractError('TRACE_VALIDATION_FAILURE',why);};
 const eq=(a:CanonicalValue,b:CanonicalValue,why:string)=>{if(key(a)!==key(b))fail(why);};
 const sorted=(xs:readonly CanonicalValue[])=>list([...xs].sort((a,b)=>key(a)<key(b)?-1:key(a)>key(b)?1:0));
 return (facts:ReceivingTraceFacts,value:CanonicalValue)=>{
  const {event,state,output,children}=facts,registration=rec(facts.registration,515n),stage=Number(u(f(registration,1n))),trace=rec(value,160n),reads:ActualReadRecord[]=[];
  function direct(root:bigint,field:bigint,accessor:string){const path=model.path(root,field),prior=state.read(path);reads.push({accessorId:ID(1028,accessor),path,presence:prior.presence,value:prior.value,derivedSources:[]});}
  if(stage===1){const path=model.path(268n),prior=state.read(path);if(!prior.presence)fail('workspace IDN source missing');reads.push({accessorId:ID(1028,'ResolvedCharacterSubject'),path,presence:true,value:f(rec(prior.value!,267n),1n),derivedSources:[prior],transformationId:ID(1028,'ResolvedCharacterSubject')});
   if(f(rec(model.definition('task-workspace'),378n),3n)===true)direct(373n,1n,'accessor/workspace-task-status');
  }
  if(stage===5){const result=rec(f(rec(event.payload,464n),4n),481n);if(u(f(result,1n))===1n&&readQ(f(result,2n)).compare(ZERO)>0)direct(487n,1n,'accessor/embodied-response-context');}
  if(stage===6){const workspace=rec(f(rec(f(rec(f(rec(event.payload,394n),2n),388n),2n),384n),2n),381n);if(f(rec(model.definition('task-candidates'),435n),1n)===true&&items(f(workspace,4n),'list').length)direct(373n,2n,'accessor/task-plan-binding');}
  const sources=stage===1?[]:stage===7?[f(rec(f(rec(event.payload,491n),1n),398n),1n),f(rec(f(rec(event.payload,491n),2n),489n),1n)]:stage===9?[f(rec(f(rec(event.payload,498n),1n),492n),1n),f(rec(f(rec(event.payload,498n),2n),403n),1n)]:[f(rec(event.payload,(event.payload as {schema:{typeId:bigint}}).schema.typeId),1n)];
  const random:CanonicalValue[]=[];if(stage===11){const result=rec(f(rec(output,508n),4n),507n);if(u(f(result,1n))===3n){const data=rec(f(result,2n),506n);random.push(...items(f(data,9n),'list').map(v=>f(rec(v,505n),5n)));const tie=rec(f(data,10n),423n);if(u(f(tie,1n))===2n)random.push(f(tie,3n));}}
  const fields:CanonicalValue[]=[text('trace/0.2-candidate'),model.modelIdentity.value,run,scheduledEventValue(event),f(registration,2n),f(registration,3n),event.eventTypeId,sorted(stage===1?[O,C]:[C]),sorted(sources),sorted(items(f(registration,7n),'set')),list(reads.map(actualReadRecordValue)),event.payload,list([output]),list(random),list([]),statePatchValue({operations:[]}),list([]),list(children.map(scheduledEventValue)),list([])];
  fields.forEach((expected,index)=>eq(f(trace,BigInt(index+1)),expected,'receiving trace field '+(index+1)));
 };
}
