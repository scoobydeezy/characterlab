import {createPersistenceFixture,originalSource} from './semPersistenceFixture';
import {createCanonicalSave,loadCanonicalSave} from '../substrate/persistence';
import {bytesToHex,list} from '../substrate/canonicalEncoding';
import {type EventHandler} from '../substrate/scheduler';
import {simInstant} from '../substrate/time';
import {SEMANTIC_RECORD_SCHEMAS} from '../semanticBinding/semanticSchemaRegistry';
import {continuantTrackSemanticView} from '../semanticBinding/perceptualContinuantFiles';
import {continuantDiagnostic as diagnostic} from './semContinuantControls';
import {digest} from './canonical';

export async function runSemPersistenceControls(){
 const f=createPersistenceFixture(),evidence=async(value:unknown)=>{const exact=diagnostic(value);return {encoding:'persistence-component-diagnostic-json/0.1',exact,sha256:await digest(new TextEncoder().encode(exact))};};
 const state=f.initialState(),identity=await f.identities(state),handlers=new Map([[f.handlerKey(f.DETECT),f.detectionHandler()]]);
 type Scheduler=ReturnType<typeof f.scheduler>;
 const schedule=(s:Scheduler,at:bigint,label:string)=>s.schedule({dueAt:simInstant(at),phase:10n,eventTypeId:f.DETECT,payload:f.detectionPayload(f.mina,label),dependencies:list([])});
 const save=(s:Scheduler)=>createCanonicalSave({scheduler:s,stateAdapter:f.adapter,modelIdentity:identity.modelIdentity,runIdentity:identity.runIdentity,continuingRunInputs:list([])});
 const capture=(s:Scheduler)=>{const v=s.exportQuiescentSnapshot();return {state:diagnostic(v.state),allocators:diagnostic(v.allocators),trace:diagnostic(v.committedTrace),outputs:diagnostic(v.outputs),status:v.status,clock:String(v.clock),queue:diagnostic(v.queue)};};
 const straight=f.scheduler(state,handlers);schedule(straight,1n,'det/1');await straight.settleNextInstant();schedule(straight,2n,'det/2');await straight.settleNextInstant();const straightHex=bytesToHex(save(straight));
 const interrupted=f.scheduler(state,handlers);schedule(interrupted,1n,'det/1');await interrupted.settleNextInstant();const midpoint=save(interrupted),loaded=await loadCanonicalSave(midpoint,{stateAdapter:f.adapter,handlers,maxSettlementWorkPerSimulationInstant:20n,expectedModelIdentity:identity.modelIdentity,expectedRunIdentity:identity.runIdentity,additionalSchemas:SEMANTIC_RECORD_SCHEMAS}),midpointResaved=bytesToHex(save(loaded.scheduler)),beforeLoad=capture(interrupted),afterLoad=capture(loaded.scheduler);
 schedule(loaded.scheduler,2n,'det/2');await loaded.scheduler.settleNextInstant();const continuedHex=bytesToHex(save(loaded.scheduler));
 const persistence={vector:'CV-SEM-097',evidence:await evidence({identity,midpointHex:bytesToHex(midpoint),midpointResaved,straightHex,continuedHex,beforeLoad,afterLoad,straight:capture(straight),continued:capture(loaded.scheduler)}),midpointEqual:bytesToHex(midpoint)===midpointResaved,continuationEqual:straightHex===continuedHex};
 let materialized:unknown;const failing:EventHandler<ReturnType<typeof f.initialState>>=async context=>{const result=await f.detectionHandler()(context);materialized=result;return {...result,nextState:{...result.nextState,valid:false}};};
 const failed=f.scheduler(f.initialState(),new Map([[f.handlerKey(f.DETECT),failing]]));schedule(failed,1n,'det/staged');const before=capture(failed);let failure='';try{await failed.settleNextInstant();}catch(e){failure=e instanceof Error?e.message:String(e);}if(failure!=='injected semantic-state commit failure'||!materialized)throw Error('Native staged-state failure not reached');const after=capture(failed);
 const rollback={vector:'CV-SEM-097',failure,materialized:await evidence(materialized),before,after,preserved:{state:before.state===after.state,allocators:before.allocators===after.allocators,trace:before.trace===after.trace,outputs:before.outputs===after.outputs}};
 const soloInput=[[f.mina,'det/1'],[f.mina,'det/2']] as const,interleavedInput=[[f.darius,'det/dx1'],[f.mina,'det/1'],[f.darius,'det/dx2'],[f.mina,'det/2']] as const,solo=await f.runDetections(soloInput),interleaved=await f.runDetections(interleavedInput),soloView=f.minaOnly(solo.state),interleavedView=f.minaOnly(interleaved.state),soloTransitions=continuantTrackSemanticView(solo.transitions),interleavedTransitions=continuantTrackSemanticView(interleaved.transitions.filter(t=>t.observerId===f.mina));
 const isolation={vector:'CV-SEM-098',evidence:await evidence({soloInput,interleavedInput,solo,interleaved,soloView,interleavedView,soloTransitions,interleavedTransitions}),sameObserverState:diagnostic(soloView)===diagnostic(interleavedView),sameObserverTransitions:diagnostic(soloTransitions)===diagnostic(interleavedTransitions),differentRuntimeIds:diagnostic(solo.runtimeIds)!==diagnostic(interleaved.runtimeIds)};
 return {version:'sem-persistence-controls/0.1',contract:'semantic-binding/0.1-candidate#SEM-001I.3',source:originalSource,persistence,rollback,isolation,occurrenceOrdinals:f.occurrenceOrdinals(),scope:'Original CV-SEM-097/098 recipes with fresh per-invocation label allocation and original test order. Actual canonical save/load executes for the continuant/event-file fixture with seed11 and allocator500. Observer interleaving uses direct transitions and a local shared counter, not scheduled multi-observer execution. Observer projection is the original Mina-only summary; no general observer independence claim. Failed settlement changes status while preserving committed data. No full SEM or UI qualification.'};
}
