/** campaign2-task-cognitive-trace-binding/0.1-candidate, fixed adapter evidence. */
import {list,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {traceRecordValue,TRACE_CONTRACT_VERSION} from '../substrate/trace';
import type {ActualReadRecord,StatePathPattern,StatePatch,StructuralMutationDiff} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataIdentity as id,dataText as txt,dataKey as key} from './canonicalData';

/** Fixed nested source chain, never a provenance graph search or state read. */
export function cognitiveTraceSubject(value:CanonicalValue):CanonicalValue {
 if(typeof value==='boolean'||value.kind!=='record')throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','missing cognitive subject chain');
 if(value.schema.typeId===381n)return f(value,2n);
 if(value.schema.typeId===307n)return f(rec(f(value,2n),305n),1n);
 const field=value.schema.typeId===409n?3n:2n;
 if(![384n,388n,394n,398n,403n,408n,409n,425n,426n,429n,431n,432n,433n].includes(value.schema.typeId))throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','unknown cognitive subject source');
 return cognitiveTraceSubject(f(value,field));
}
type Evidence={domain:readonly StatePathPattern[];reads:readonly ActualReadRecord[];quantizationOperations:readonly CanonicalValue[];randomDrawRecords:readonly CanonicalValue[];patch?:StatePatch;diffs?:readonly StructuralMutationDiff[]};
export function cognitiveTraceRecord(modelIdentity:CanonicalValue,runIdentity:CanonicalValue,event:ScheduledEvent,registration:CanonicalValue,output:CanonicalValue,children:readonly ScheduledEvent[],evidence:Evidence){
 const r=typeof registration!=='boolean'&&registration.kind==='record'?registration:undefined;
 if(!r)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','missing cognitive registration');
 const base=[418n,441n,442n,443n,444n,445n,446n].includes(r.schema.typeId)?rec(f(r,1n),272n):r;
 const workspace=r.schema.typeId===417n,application=r.schema.typeId===450n;
 const subject=cognitiveTraceSubject(application?event.payload:output);
 return traceRecordValue({traceSchemaVersion:TRACE_CONTRACT_VERSION,modelIdentity,runIdentity,event,seamId:id(f(base,1n)),seamVersion:txt(f(base,2n)),recordKind:event.eventTypeId,
  subjectIds:workspace?[id(f(rec(event.payload,377n),1n)),id(subject)]:[id(subject)],sourceRecordIds:workspace?[]:[id(f(rec(event.payload,(event.payload as Extract<CanonicalValue,{kind:'record'}>).schema.typeId),1n))],
  registeredReadDomain:evidence.domain,actualReadRecords:evidence.reads,inputProjection:event.payload,outputProjection:output,
  randomDrawRecords:evidence.randomDrawRecords,quantizationOperations:evidence.quantizationOperations,statePatch:evidence.patch??{operations:[]},structuralMutationDiffs:evidence.diffs??[],emittedEvents:children,invariantResults:[]});
}
export function protocolTraceRecord(modelIdentity:CanonicalValue,runIdentity:CanonicalValue,event:ScheduledEvent,outputs:readonly CanonicalValue[],children:readonly ScheduledEvent[]){
 const observation=event.phase===120n;
 if(event.phase<120n||event.phase>124n||outputs.length!==(observation||event.phase===124n?1:0))throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','protocol trace stage closure');
 const input=rec(event.payload,observation?310n:216n),channel=observation?rec(f(input,2n),201n):undefined;
 const subjects=observation?[id(f(channel!,2n)),id(f(channel!,3n))]:[id(f(input,1n))];
 return traceRecordValue({traceSchemaVersion:TRACE_CONTRACT_VERSION,modelIdentity,runIdentity,event,seamId:typedIdentifier(1036,text('seam/'+(observation?'protocol-consequence-observation':'event-truth-to-pre-recognition-experience'))),seamVersion:observation?'protocol-consequence-observation/0.1-candidate':'semantic-binding/0.1-candidate#SEM-001H',recordKind:event.eventTypeId,
  subjectIds:[...new Map(subjects.map(v=>[key(v),v])).values()],sourceRecordIds:[id(observation?f(rec(f(input,1n),200n),9n):f(input,2n))],registeredReadDomain:[],actualReadRecords:[],inputProjection:event.payload,outputProjection:outputs[0]??list([]),randomDrawRecords:[],quantizationOperations:[],statePatch:{operations:[]},structuralMutationDiffs:[],emittedEvents:children,invariantResults:[]});
}
