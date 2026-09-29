/** defining-native-lifecycle/0.1-candidate; actual successor owner transitions only. */
import {canonicalEncode as enc,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {traceRecordValue} from '../substrate/trace';
import {statePatchValue,actualReadRecordValue,type AuthoritativeState,type StatePatch,type ActualReadRecord} from '../substrate/state';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataKey as key,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {generalId as id,generalSubject} from './generalBindingProfile';
import {decodeDefiningLifecycle} from './definingLifecycleCodecs';
import {definingLifecyclePhase,definingLifecyclePattern,type DefiningLifecycleStage,type compileDefiningLifecycleState} from './definingLifecycleState';
import type {GeneralTraceIdentities} from './generalTrace';
export function definingLifecycleTrace(binding:ReturnType<typeof compileDefiningLifecycleState>,identities:GeneralTraceIdentities,stage:DefiningLifecycleStage,event:ScheduledEvent,base:AuthoritativeState,patch:StatePatch,reads:readonly ActualReadRecord[]):CanonicalValue{
 const modelIdentity=rec(identities.model,103n),runIdentity=rec(identities.run,104n);
 if(key(f(runIdentity,1n))!==key(modelIdentity)||event.phase!==definingLifecyclePhase(stage)||key(event.eventTypeId)!==key(id(1001,'event/'+stage)))throw Error('DEFINING_LIFECYCLE_TRACE_BINDING');
 const expected=binding.transition(stage,event.payload,base,event.dueAt);if(key(statePatchValue(expected.patch))!==key(statePatchValue(patch)))throw Error('DEFINING_LIFECYCLE_TRACE_PATCH');
 if(key(list(reads.map(actualReadRecordValue)))!==key(list(expected.reads.map(actualReadRecordValue))))throw Error('DEFINING_LIFECYCLE_TRACE_READ');
 const applied=binding.model.state.applyStagePatch(stage,base,patch),who=generalSubject(),domain=stage==='defining-adopt'?[definingLifecyclePattern(1485)]:stage==='defining-report'?[definingLifecyclePattern(1485),definingLifecyclePattern(1486)]:[];
 return decodeDefiningLifecycle(enc(traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity,runIdentity,event,seamId:id(1036,'seam/'+stage),seamVersion:'defining-native-lifecycle/0.1-candidate',recordKind:event.eventTypeId,subjectIds:[who.observer,who.character],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:reads,inputProjection:event.payload,outputProjection:list([]),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:applied.diffs,emittedEvents:[],invariantResults:[]})));
}
