/** attention-trace/0.1-candidate: independent19-field and tracking-state reconstruction. */
import {list,text,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {actualReadRecordValue,statePatchValue,mutationDiffValue,statePathPatternValue,statePathValue,type AuthoritativeState,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {scheduledEventValue} from '../substrate/persistence';
import {SchedulerContractError,type ScheduledEvent} from '../substrate/scheduler';
import {dataField as f,dataRecord as rec,dataItems as items,dataKey as key,dataUnsigned as u,dataIdentity as id} from '../campaign2/canonicalData';
import {decodeStatePattern} from '../campaign2/stateModel';
import {observerIdValue,perceptualReferentIdValue,perceptualEventReferentIdValue} from '../semanticBinding/semanticCodecs';
import type {AttentionCompiledModel} from './attentionModel';
import {attentionRecord as r} from './attentionCodecs';
type Facts={stage:number;event:ScheduledEvent;state:AuthoritativeState;outputs:readonly CanonicalValue[];children:readonly ScheduledEvent[];nextState:AuthoritativeState};
export function validateAttentionTrace(model:AttentionCompiledModel,run:CanonicalValue,facts:Facts,value:CanonicalValue){
 const fail=(why:string):never=>{throw new SchedulerContractError('TRACE_VALIDATION_FAILURE',why);},eq=(a:CanonicalValue,b:CanonicalValue,why:string)=>{if(key(a)!==key(b))fail(why);},sorted=(xs:readonly CanonicalValue[])=>list([...xs].sort((a,b)=>key(a)<key(b)?-1:key(a)>key(b)?1:0));
 const {stage,event,outputs,children,state,nextState}=facts,reg=rec(model.stage(stage),541n),trace=rec(value,160n),O=observerIdValue('observer/attention-subject');let sources:CanonicalValue[]=[],patch:StatePatch={operations:[]},reads:ActualReadRecord[]=[],diffs:CanonicalValue[]=[];
 if(event.phase!==u(f(reg,5n)))fail('registered stage phase');eq(event.eventTypeId,f(reg,4n),'registered event type');
 const inputSchema=rec(f(reg,6n),254n),inputRecord=rec(event.payload,u(f(inputSchema,1n)));if(inputRecord.schema.schemaVersion!==u(f(inputSchema,2n)))fail('registered input schema version');
 if(stage===2)sources=[f(rec(event.payload,210n),1n)];
 if(stage>=3&&stage<=6||stage===9){const input=rec(event.payload,stage===3?523n:stage===4?524n:stage===5?525n:stage===6?526n:529n);sources=[f(rec(f(input,1n),stage===9?522n:521n),1n)];}
 if(stage===7)sources=[f(rec(f(rec(event.payload,527n),1n),227n),1n)];
 if(stage===8){const input=rec(event.payload,528n);sources=[f(rec(f(input,1n),227n),1n),...items(f(input,2n),'list').map(c=>f(rec(c,240n),1n))];}
 if(stage===10)sources=[f(rec(event.payload,534n),1n)];
 if(stage===3){const observation=rec(f(rec(event.payload,523n),1n),521n),count=items(f(observation,5n),'list').length;
  const entries=[{root:241n,field:1n,key:O,value:unsigned(count),suffix:'continuant-counter'},{root:242n,field:1n,key:O,value:unsigned(1),suffix:'event-counter'},{root:242n,field:2n,key:perceptualEventReferentIdValue({observerId:'observer/attention-subject',observerEventSequence:0n}),value:true as CanonicalValue,suffix:'event-active'},...Array.from({length:count},(_,i)=>({root:241n,field:2n,key:perceptualReferentIdValue({observerId:'observer/attention-subject',observerTrackSequence:BigInt(i)}),value:true as CanonicalValue,suffix:'continuant-active'}))].map(e=>({...e,path:{rootStateTypeId:e.root,fieldId:e.field,selectors:[{kind:'mapKey' as const,key:e.key}]}})).sort((a,b)=>key(statePathValue(a.path)).localeCompare(key(statePathValue(b.path))));
  patch={operations:entries.map(e=>{const prior=state.read(e.path);if(prior.presence)fail('tracking requires absent source paths');reads.push({accessorId:typedIdentifier(1028,text('accessor/attention-'+e.suffix)),path:e.path,presence:false,derivedSources:[]});return {kind:'set',path:e.path,expected:{presence:false as const},newValue:e.value};})};
  const actual=model.state.applyPatch(state,patch,typedIdentifier(1025,text('authority/perception')));eq(actual.state.canonicalValue(),nextState.canonicalValue(),'tracking next state');diffs=actual.diffs.map(mutationDiffValue);
  if(outputs.length!==count+1)fail('tracking output cardinality');eq(f(rec(outputs[0],219n),3n),perceptualEventReferentIdValue({observerId:'observer/attention-subject',observerEventSequence:0n}),'fresh event file');eq(f(rec(outputs[0],219n),4n),f(observation,4n),'event detection provenance');
  outputs.slice(1).forEach((o,i)=>{eq(f(rec(o,217n),3n),perceptualReferentIdValue({observerId:'observer/attention-subject',observerTrackSequence:BigInt(i)}),'fresh continuant file');eq(f(rec(o,217n),4n),f(rec(items(f(observation,5n),'list')[i],520n),1n),'continuant detection provenance');});
 }else eq(state.canonicalValue(),nextState.canonicalValue(),'nontracking state changed');
 const fields:CanonicalValue[]=[text('trace/0.2-candidate'),model.modelIdentity.value,run,scheduledEventValue(event),f(reg,2n),f(reg,3n),event.eventTypeId,sorted(stage===1?[]:[O]),sorted(sources),sorted(items(f(reg,10n),'set').map(v=>statePathPatternValue(decodeStatePattern(f(rec(v,540n),2n))))),list(reads.map(actualReadRecordValue)),event.payload,list(outputs),list([]),list([]),statePatchValue(patch),list(diffs),list(children.map(scheduledEventValue)),list([])];
 fields.forEach((expected,i)=>eq(f(trace,BigInt(i+1)),expected,'attention trace field '+(i+1)));
 if(children.length!==(stage===10?0:1))fail('child cardinality');for(const child of children){if(child.dueAt!==event.dueAt||child.phase<event.phase||child.eventSequence<=event.eventSequence||child.causalParentEventIds.length!==1||child.causalParentEventIds[0]!==event.eventId)fail('parent/phase/sequence');const childStage=Array.from({length:10},(_,i)=>rec(model.stage(i+1),541n)).find(r=>key(f(r,4n))===key(child.eventTypeId));if(!childStage||!items(f(rec(f(childStage,7n),538n),2n),'set').some(n=>u(n)===BigInt(stage)))fail('registered producer edge');}
 // Requiring typed source IDs here guards malformed provenance without granting dereference.
 sources.forEach(id);
 // Producer closure is checked against completed outputs, independently of the
 // scheduler's private event token. A valid parent edge alone is insufficient.
 if(stage===1)eq(children[0].payload,outputs[0],'world child');
 if(stage===2){const positive=(outputs[0] as {schema:{typeId:bigint}}).schema.typeId===521n;eq(children[0].payload,r(positive?523:529,[outputs[0]]),'observation child');}
 if(stage===3)eq(children[0].payload,r(524,[f(rec(event.payload,523n),1n),outputs[0],list(outputs.slice(1))]),'tracking child');
 if(stage===4){const p=rec(event.payload,524n);eq(children[0].payload,r(525,[f(p,1n),f(p,2n),list(outputs)]),'binding child');}
 if(stage===5){const p=rec(event.payload,525n);eq(children[0].payload,r(526,[f(p,1n),f(p,2n),f(p,3n)]),'classification child');}
 if(stage===6)eq(children[0].payload,r(527,[outputs[0]]),'experience child');
 if(stage===7)eq(children[0].payload,r(528,[f(rec(event.payload,527n),1n),list(outputs)]),'role child');
 if(stage===8||stage===9){
  const audit=rec(outputs[0],532n),view=rec(children[0].payload,534n),units=items(f(view,4n),'list');
  for(const field of [1n,2n,3n])eq(f(view,field),f(audit,field),'selection child identity/subject/time');
  const selected=items(f(audit,6n),'list').filter(row=>f(rec(row,531n),5n)===true).map(row=>f(rec(row,531n),1n));
  eq(sorted(units.map(unit=>f(rec(unit,533n),1n))),sorted(selected),'selected child unit closure');
  if(stage===9&&units.length)fail('empty source child');
  if(stage===8){const source=rec(event.payload,528n),experience=rec(f(source,1n),227n),bindings=items(f(experience,5n),'set'),claims=items(f(source,2n),'list');
   for(const unit of units){const selected=rec(unit,533n),k=rec(f(selected,1n),530n),match=(value:CanonicalValue,type:bigint,a:bigint,b:bigint)=>{const x=rec(value,type);return key(f(x,a))===key(f(k,1n))&&key(f(x,b))===key(f(k,2n));};
    eq(f(selected,2n),list(bindings.filter(b=>match(b,224n,3n,4n))),'selected binding carriage');eq(f(selected,3n),list(claims.filter(c=>match(c,240n,4n,5n))),'selected claim carriage');
   }
  }
 }
}
