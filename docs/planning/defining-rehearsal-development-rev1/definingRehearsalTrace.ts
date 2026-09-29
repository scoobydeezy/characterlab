/** defining-native-rehearsal/0.1-candidate; predecessor ownership retained. */
import {canonicalEncode as enc,list,text,bytes,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {traceRecordValue} from '../substrate/trace';
import {statePatchValue,mutationDiffValue,statePathValue,patternMatches,type AuthoritativeState,type ActualReadRecord,type StatePatch,type StatePathPattern} from '../substrate/state';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataKey as key,dataText as txt} from '../campaign2/canonicalData';
import {definingMemoryPath} from './definingMemoryOwner';
import {generalSubject,generalId as id} from './generalBindingProfile';
import {decodeDefiningRehearsal as decodeDefiningMemoryOwner} from './definingRehearsalCodecs';
import type {GeneralTraceIdentities} from './generalTrace';
import type {compileDefiningLifecycleState} from './definingLifecycleState';
import type {prepareDefiningFinalPresentation} from './definingFinalPresentation';
import type {prepareDefiningMemorySettlement} from './definingMemoryOwner';
export function applyDefiningMemorySettlement(model:ReturnType<typeof compileDefiningLifecycleState>['model'],base:AuthoritativeState,result:ReturnType<typeof prepareDefiningMemorySettlement>){
 const memory=model.state.applyStagePatch('ordinary-memory-retention',base,result.memoryPatch),history=model.state.applyStagePatch('event-presentation-cleanup',memory.state,result.historyPatch),protocol=model.state.applyProtocolPatch(history.state,result.protocolPatch);
 return {state:protocol.state,diffs:[...memory.diffs,...history.diffs],protocolDiffs:protocol.diffs};
}
export function definingRehearsalTrace(model:ReturnType<typeof compileDefiningLifecycleState>['model'],identities:GeneralTraceIdentities,event:ScheduledEvent,base:AuthoritativeState,outputs:readonly CanonicalValue[],children:readonly ScheduledEvent[],reads:readonly ActualReadRecord[],input:CanonicalValue,result?:ReturnType<typeof prepareDefiningMemorySettlement>,presentation?:ReturnType<typeof prepareDefiningFinalPresentation>){
 const who=generalSubject(),patch:StatePatch=presentation?.patch??{operations:result?[...result.memoryPatch.operations,...result.historyPatch.operations]:[]},applied=result?applyDefiningMemorySettlement(model,base,result):presentation?{...model.state.applyStagePatch('event-presentation-owner',base,presentation.patch),protocolDiffs:[]}:undefined;
 const stage=txt(event.eventTypeId.payload),roots=stage==='event/defining-recall-rank'?[630,632]:stage==='event/defining-recall-publish'||stage==='event/defining-rehearsal-attribute'?[]:stage==='event/defining-rehearsal-settle'?[630,632]:stage==='event/defining-final-presentations'?[632]:stage==='event/defining-current-assessment'?[1485,1486]:stage==='event/defining-current-delivery'?[]:stage==='event/defining-meaning'?[1485,630]:stage==='event/defining-credit'||stage==='event/defining-retention'?[630,632]:stage==='event/defining-meaning-opportunity'?[]:undefined;
 if(!roots||key(f(rec(identities.run,104n),1n))!==key(identities.model))throw Error('DEFINING_MEMORY_TRACE_BINDING');
 const domain:StatePathPattern[]=roots.map(root=>{const path={rootStateTypeId:BigInt(root),fieldId:1n,selectors:[{kind:'mapKey' as const,key:who.character}]};return {...path,selectors:path.selectors.map(selector=>({kind:'exact',selector}))};});
 const absentRank=stage==='event/defining-recall-rank'&&(f(rec(input,1491n),3n) as {value:bigint}).value===2n;
 if(reads.length!==(absentRank?0:domain.length)||reads.some((read,i)=>!patternMatches(domain[i],read.path)||read.derivedSources.length||read.transformationId!==undefined||key(list([read.presence,read.value??false]))!==key(list([base.read(read.path).presence,base.read(read.path).value??false]))))throw Error('DEFINING_MEMORY_TRACE_READ');
 const sources=new Map<string,TypedIdentifierValue>();
 function visit(v:CanonicalValue):void{if(typeof v==='boolean')return;if(v.kind==='typedIdentifier'){if(v.namespaceId>=1100n)sources.set(key(v),v);return;}if(v.kind==='record')[...v.fields.values()].forEach(visit);else if(v.kind==='list'||v.kind==='set')v.items.forEach(visit);else if(v.kind==='map')v.entries.forEach(([k,x])=>{visit(k);visit(x);});}visit(input);
 const invariant=result?[list([text('formation-governance-component/0.1-candidate'),statePathValue(result.protocolRead.path),result.protocolRead.presence,bytes(enc(result.protocolRead.value??false)),statePatchValue(result.protocolPatch),list(applied!.protocolDiffs.map(mutationDiffValue))])]:[];
 return decodeDefiningMemoryOwner(enc(traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:identities.model,runIdentity:identities.run,event,seamId:id(1036,'seam/defining-native-memory'),seamVersion:'defining-native-rehearsal/0.1-candidate',recordKind:event.eventTypeId,subjectIds:[who.observer,who.character],sourceRecordIds:[...sources.values()],registeredReadDomain:domain,actualReadRecords:reads,inputProjection:input,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:applied?.diffs??[],emittedEvents:children,invariantResults:invariant})));
}
