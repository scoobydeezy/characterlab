/** Trace-side verification of the fixed EMB producer's output, read and work closure.
 * This verifier is host infrastructure and is never a pressure capability. */
import {canonicalEncode as enc,list,set,signed,unsigned,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,actualReadRecordValue,statePathValue,statePathPatternValue,statePatchValue,mutationDiffValue,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePath} from '../substrate/state';
import {scheduledEventValue} from '../substrate/persistence';
import {SchedulerContractError,type ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id,dataKey as key} from '../campaign2/canonicalData';
import {embodiedRecord as r} from './embodiedCodecs';
import {exact,atom,materializeReserve,reserveBin,deficitPressure,replenishReserve} from './embodiedMath';
type Context={event:ScheduledEvent;state:AuthoritativeState;outputs:readonly CanonicalValue[];reads:readonly ActualReadRecord[];quantization:readonly CanonicalValue[];patch:StatePatch;diffs:readonly StructuralMutationDiff[];allocated:readonly bigint[];childValues?:readonly CanonicalValue[];identities?:{model:CanonicalValue;run:CanonicalValue}};
export function compileEmbodiedTraceValidator(definitions:CanonicalValue,character:CanonicalValue,observer:CanonicalValue){
 return compileBodyTraceValidator(definitions,character,observer,'embodied-pressure/0.1-candidate');
}
/** Exact successor pressure version; all body/SEM/read/math checks stay shared. */
export function compileReceivingBodyTraceValidator(definitions:CanonicalValue,character:CanonicalValue,observer:CanonicalValue){
 return compileBodyTraceValidator(definitions,character,observer,'embodied-pressure/0.2-candidate');
}
function compileBodyTraceValidator(definitions:CanonicalValue,character:CanonicalValue,observer:CanonicalValue,pressureVersion:string){
 const d=items(definitions,'list'),params=rec(d[0],453n),channel=rec(d[1],458n),pressure=rec(d[2],460n),C=id(character),O=id(observer);
 const body:StatePath={rootStateTypeId:455n,fieldId:1n,selectors:[{kind:'mapKey',key:C}]},roster:StatePath={rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:O}]};
 const capacity=exact(f(params,2n)),rate=exact(f(params,3n)),width=exact(f(channel,6n)),threshold=exact(f(pressure,2n));
 const accessor=(name:string)=>typedIdentifier(1028,text(name)),fail=(why:string):never=>{throw new SchedulerContractError('TRACE_VALIDATION_FAILURE',why);};
 const eq=(a:CanonicalValue,b:CanonicalValue,why:string)=>{if(key(a)!==key(b))fail(why);};
 return (c:Context,trace?:CanonicalValue)=>{
  const {event,state,outputs,reads,quantization,patch,diffs,allocated}=c,phase=event.phase;
  const present=f(channel,7n)===true&&f(channel,8n)===true,expectedReads:ActualReadRecord[]=[];
  if(phase===10n||phase===60n){const source=state.read(roster),value=f(rec(source.value!,267n),1n);expectedReads.push({accessorId:accessor('ResolvedCharacterSubject'),path:roster,presence:true,value,derivedSources:[source],transformationId:accessor('ResolvedCharacterSubject')});}
  if(phase===110n||phase===10n&&present){const anchor=state.read(body);expectedReads.push({accessorId:accessor('accessor/embodied-reserve-anchor'),path:body,presence:anchor.presence,value:anchor.value,derivedSources:[]});}
  eq(list(reads.map(actualReadRecordValue)),list(expectedReads.map(actualReadRecordValue)),'EMB actual read closure');
  const count=phase===10n?2:phase===60n?1:0;if(allocated.length!==count)fail('EMB runtime allocation budget');
  if(phase!==110n&&(patch.operations.length||diffs.length))fail('non-writer mutation');
  if(phase!==10n||!present)eq(list(quantization),list([]),'unexpected quantization');
  const occurrence=(ns:number,n:bigint)=>typedIdentifier(ns,unsigned(n));
  if(phase===10n){
   let sample:CanonicalValue;
   if(present){const anchor=rec(state.read(body).value!,454n),amount=materializeReserve(exact(f(anchor,1n)),(f(anchor,2n) as {value:bigint}).value,capacity,rate,event.dueAt),bin=reserveBin(amount,capacity,width);
    eq(list(quantization),list([r(484,[atom(amount),atom(capacity),atom(width),unsigned(bin.index)])]),'missing/extra/wrong bin operation');
    sample=r(461,[occurrence(1115,allocated[0]),O,f(channel,1n),signed(event.dueAt),r(462,[atom(bin.lower),atom(bin.upper)]),text('embodied-level-observation/0.1-candidate')]);
   }else sample=r(463,[occurrence(1115,allocated[0]),O,f(channel,1n),signed(event.dueAt),text('embodied-level-observation/0.1-candidate')]);
   eq(list(outputs),list([sample]),'source branch/occurrence/payload closure');
  }else if(phase===60n){
   const sample=rec(event.payload,present?461n:463n),result=present?r(481,[unsigned(1),atom(deficitPressure(exact(f(rec(f(sample,5n),462n),2n)),threshold))]):r(481,[unsigned(2)]);
   eq(list(outputs),list([r(464,[occurrence(1142,allocated[0]),C,sample,result,text(pressureVersion)])]),'pressure sample/identity/result closure');
  }else if(phase===110n){
   const name=(id(f(rec(event.payload,478n),1n)).payload as {value:string}).value,index=['definition/embodied-delivery-30','definition/embodied-delivery-5','definition/embodied-delivery-60'].indexOf(name);if(index<0)fail('unknown delivery');
   const anchor=rec(state.read(body).value!,454n),before=materializeReserve(exact(f(anchor,1n)),(f(anchor,2n) as {value:bigint}).value,capacity,rate,event.dueAt),x=replenishReserve(before,capacity,exact(f(rec(d[index+3],477n),4n))),after=r(454,[atom(x.after),signed(event.dueAt)]);
   eq(list(outputs),list([r(479,[x.before,x.potential,x.applied,x.overflow,x.after].map(atom))]),'refill result closure');
   if(patch.operations.length!==1||diffs.length!==1)fail('refill patch/diff multiplicity');const op=patch.operations[0],diff=diffs[0];
   if(op.kind!=='set'||!op.expected.presence||!diff.oldPresence||!diff.newPresence)fail('refill requires existing anchor set');
   if(op.kind==='set'&&op.expected.presence){eq(statePathValue(op.path),statePathValue(body),'wrong refill target');eq(op.expected.value,anchor,'stale refill prior');eq(op.newValue,after,'refill patch differs');}
   eq(statePathValue(diff.path),statePathValue(body),'wrong diff target');eq(diff.oldValue!,anchor,'wrong old diff');eq(diff.newValue!,after,'wrong new diff');eq(diff.mutationAuthorityId,typedIdentifier(1025,text('authority/embodied-reserve')),'wrong writer authority');
  }else if(phase===14n&&present){
   const carrier=rec(event.payload,482n),sample=rec(f(carrier,2n),461n);
   eq(list(outputs),list([r(227,[f(carrier,3n),O,unsigned(event.dueAt),set([]),set([]),set([]),set([]),set([r(216,[O,f(sample,1n)])]),text('semantic-binding/0.1-candidate#SEM-001H')])]),'support-only SEM closure');
  }else eq(list(outputs),list([]),'empty host slot output closure');
  if(trace){const row=rec(trace,160n),sort=(v:CanonicalValue[])=>list(v.sort((a,b)=>key(a)<key(b)?-1:key(a)>key(b)?1:0));
   if(!c.identities||!c.childValues)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','trace validation requires actual identity/child facts');
   eq(f(row,2n),c.identities.model,'trace model commitment');eq(f(row,3n),c.identities.run,'trace run commitment');eq(f(row,18n),list(c.childValues),'trace allocated children');
   const rosterPattern=statePathPatternValue({rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'wildcard',selectorKind:'mapKey'}]}),bodyPattern=statePathPatternValue({rootStateTypeId:455n,fieldId:1n,selectors:[{kind:'exact',selector:body.selectors[0]}]});
   eq(f(row,1n),text('trace/0.2-candidate'),'trace schema version');eq(f(row,4n),scheduledEventValue(event),'trace event');eq(f(row,7n),event.eventTypeId,'trace kind');
   eq(f(row,8n),sort(phase===110n?[C]:phase===10n||phase===60n?[O,C]:[O]),'trace subjects');
   const source=phase===10n||phase===110n?[]:[f(phase===60n?rec(event.payload,present?461n:463n):rec(f(rec(event.payload,482n),2n),present?461n:463n),1n)];eq(f(row,9n),sort(source),'trace sources');
   eq(f(row,10n),sort(phase===10n?[rosterPattern,bodyPattern]:phase===60n?[rosterPattern]:phase===110n?[bodyPattern]:[]),'trace declared read domain');
   eq(f(row,11n),list(reads.map(actualReadRecordValue)),'trace reads differ');eq(f(row,12n),event.payload,'trace input differs');eq(f(row,13n),list(outputs),'trace output differs');
   eq(f(row,14n),list([]),'unadmitted random record');eq(f(row,15n),list(quantization),'trace quantization differs');eq(f(row,16n),statePatchValue(patch),'trace patch differs');eq(f(row,17n),list(diffs.map(mutationDiffValue)),'trace diffs differ');eq(f(row,19n),list([]),'unadmitted invariant record');
   const sem=present&&[11n,12n,13n,14n].includes(phase),name=sem?'event-truth-to-pre-recognition-experience':phase===60n?'embodied-pressure':phase===110n?'embodied-replenishment':'embodied-level-observation';eq(f(row,5n),typedIdentifier(1036,text('seam/'+name)),'trace seam owner');eq(f(row,6n),text(sem?'semantic-binding/0.1-candidate#SEM-001H':phase===60n?pressureVersion:name+'/0.1-candidate'),'trace seam version');
  }
 };
}
