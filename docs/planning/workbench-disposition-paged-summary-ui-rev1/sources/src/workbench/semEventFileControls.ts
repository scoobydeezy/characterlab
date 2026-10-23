import {createEventFileFixture,originalSource} from './semEventFileFixture';
import {continuantDiagnostic as diagnostic} from './semContinuantControls';
import {digest} from './canonical';
import {EventRoleId as Role} from '../semanticBinding/eventBindings';
import {applyPerceptualEventTransition as apply,emptyPerceptualEventFileState as empty,endPerceptualEventFile as end,clonePerceptualEventFileState as clone,compilePerceivedBindings,perceivedEventGrouping as grouping,eventFileStateSummary,type PerceptualEventFileState} from '../semanticBinding/perceptualEventFiles';
import {bytesToHex,canonicalEncode,list,text,typedIdentifier} from '../substrate/canonicalEncoding';
import {DeterministicScheduler,type EventHandler,type StateAdapter} from '../substrate/scheduler';
import {simInstant} from '../substrate/time';

export async function runSemEventFileControls(){
 const f=createEventFileFixture(),{mina,darius,version,observation:obs,objectFile:object,eventFile:event,transition:t,exact,binding:b,experience:exp,ordinalFor}=f;
 const evidence=async(value:unknown)=>{const encoded=diagnostic(value);return {encoding:'event-file-component-diagnostic-json/0.1',exact:encoded,sha256:await digest(new TextEncoder().encode(encoded))};};
 const cases:{id:string;vector:string;evidence:Awaited<ReturnType<typeof evidence>>}[]=[];
 const record=async(id:string,vector:string,value:unknown)=>cases.push({id,vector,evidence:await evidence(value)});
 const negatives:{id:string;vector:string;code:string;evidence:Awaited<ReturnType<typeof evidence>>}[]=[];
 const reject=async(id:string,vector:string,input:unknown,run:()=>unknown)=>{const before=diagnostic(input);let code:string|undefined;try{run();}catch(e){code=(e as {code?:string}).code;}if(!code)throw Error('Expected coded rejection: '+id);if(before!==diagnostic(input))throw Error('Rejected input mutated');negatives.push({id,vector,code,evidence:await evidence(input)});};
 // Retain original test execution order, including shared occurrence allocations.
 const simultaneous=exp(8605n,[event(0n),event(1n)],[b(event(0n),exact(Role.Actor),object(0n)),b(event(0n),exact(Role.Target),object(1n)),b(event(0n),exact(Role.Instrument),object(2n)),b(event(1n),exact(Role.Actor),object(3n)),b(event(1n),exact(Role.Target),object(4n))]);
 await record('simultaneous-groupings','CV-SEM-031',{experience:simultaneous,grouping:grouping(simultaneous)});
 const early=exp(8600n,[event(7n)],[b(event(7n),exact(Role.Actor),object(0n))]),late=exp(8602n,[event(7n)],[b(event(7n),exact(Role.Target),object(1n))],10n);
 await record('persistent-event','CV-SEM-032',{early,late});
 const started=apply(empty(),t('NewEventFile','glimpse-a')),continued=apply(started.state,t('ContinuesPriorEventFile','glimpse-b',started.transition.perceptualEventReferentId));
 await record('false-continuity','CV-SEM-033',{started,continued});
 const splitStart=apply(empty(),t('NewEventFile','before-loss')),endRequest={observerId:mina,perceptualEventReferentId:splitStart.transition.perceptualEventReferentId,supportingObservationIds:[obs(mina,ordinalFor('observation/loss'))],occurredAt:11n,transformationVersion:version},ended=end(splitStart.state,endRequest),restarted=apply(ended.state,t('NewEventFile','after-loss'));
 await record('false-discontinuity','CV-SEM-034',{started:splitStart,endRequest,ended,restarted});
 const invalid={...t('NewEventFile','visible-motion'),truthEventId:'truth/event-42'},invalidState=empty();
 await reject('truth-keyed-segmentation','CV-SEM-035',{state:invalidState,request:invalid},()=>apply(invalidState,invalid));
 const visible=apply(empty(),t('NewEventFile','visible-motion'));await record('observer-side-detection','CV-SEM-035',visible);
 const actionRequest=[b(event(0n),exact(Role.Action),object(0n))];await reject('action-as-continuant','CV-SEM-036',actionRequest,()=>compilePerceivedBindings(actionRequest,0n));
 const grouped=exp(8606n,[event(0n)],[b(event(0n),exact(Role.Actor),object(0n))]);await record('event-action-carrier','CV-SEM-036',grouped);
 const concurrent=exp(8604n,[event(0n),event(1n)],[b(event(0n),exact(Role.Actor),object(4n)),b(event(0n),exact(Role.Target),object(4n)),b(event(1n),exact(Role.Participant),object(4n))]);await record('concurrent-participation','CV-SEM-037',{experience:concurrent,grouping:grouping(concurrent)});
 const minaFirst=apply(empty(),t('NewEventFile','mina-first')),dariusFirst=apply(minaFirst.state,t('NewEventFile','darius-first',undefined,darius)),restored=clone(structuredClone(dariusFirst.state)),minaSecond=apply(restored,t('NewEventFile','mina-second')),replay=apply(clone(dariusFirst.state),t('NewEventFile','mina-second'));
 await record('structural-restore','CV-SEM-038',{minaFirst,dariusFirst,restored,minaSecond,replay});
 const low=exp(8603n,[event(0n),event(1n)],[b(event(0n),exact(Role.Actor),object(2n)),b(event(1n),exact(Role.Target),object(3n))]),shifted=exp(8601n,[event(700n),event(900n)],[b(event(700n),exact(Role.Actor),object(2n)),b(event(900n),exact(Role.Target),object(3n))],50n);
 await record('ordinal-shift','CV-SEM-039',{low,shifted,lowGrouping:grouping(low),shiftedGrouping:grouping(shifted)});
 interface State{readonly valid:boolean;readonly eventFiles:PerceptualEventFileState}
 const adapter:StateAdapter<State>={clone:s=>({valid:s.valid,eventFiles:clone(s.eventFiles)}),validate:s=>{eventFileStateSummary(s.eventFiles);if(!s.valid)throw Error('injected event-file commit failure');},canonicalValue:s=>list([s.valid,list(eventFileStateSummary(s.eventFiles).map(text))])};
 const handlerId=typedIdentifier(31000n,text('event/sem-001c-rollback'));let allocated:bigint|undefined,staged:ReturnType<typeof apply>|undefined;
 const handler:EventHandler<State>=({state,allocateRuntimeId})=>{staged=apply(state.eventFiles,t('NewEventFile','staged'));allocated=allocateRuntimeId();return {nextState:{valid:false,eventFiles:staged.state},emittedEvents:[],traceContributions:[],outputs:[]};};
 const scheduler=new DeterministicScheduler({initialState:{valid:true,eventFiles:empty()},stateAdapter:adapter,handlers:new Map([[bytesToHex(canonicalEncode(handlerId)),handler]]),maxSettlementWorkPerSimulationInstant:10n,initialAllocators:{nextRuntimeId:20n,nextEventId:0n,nextEventSequence:0n}});
 scheduler.schedule({dueAt:simInstant(1n),phase:10n,eventTypeId:handlerId,payload:list([]),dependencies:list([])});
 const capture=()=>{const s=scheduler.exportQuiescentSnapshot();return {state:diagnostic(s.state),allocators:diagnostic(s.allocators),trace:diagnostic(s.committedTrace),outputs:diagnostic(s.outputs),status:s.status,clock:String(s.clock),queue:diagnostic(s.queue)};};const before=capture();let failure:string|undefined;try{await scheduler.settleNextInstant();}catch(e){failure=e instanceof Error?e.message:String(e);}if(failure!=='injected event-file commit failure'||allocated!==20n)throw Error('Original event-file rollback did not occur');const after=capture();
 const rollback={vector:'CV-SEM-040',failure,allocated:String(allocated),staged:await evidence(staged),before,after,preserved:{state:before.state===after.state,allocators:before.allocators===after.allocators,trace:before.trace===after.trace,outputs:before.outputs===after.outputs}};
 const same=(a:unknown,b:unknown)=>diagnostic(a)===diagnostic(b);
 return {version:'sem-event-file-controls/0.1',contract:version,source:originalSource,cases,negatives,rollback,occurrenceOrdinals:f.occurrenceOrdinals(),summary:{simultaneousGroups:grouping(simultaneous).length,simultaneousBindings:simultaneous.perceivedBindings.length,distinctExperiences:early.experienceId!==late.experienceId,persistentEvent:same(early.perceptualEventReferentIds,late.perceptualEventReferentIds),continuedEvent:same(started.transition.perceptualEventReferentId,continued.transition.perceptualEventReferentId),restartedSequence:String(restarted.transition.perceptualEventReferentId.observerEventSequence),concurrentGroups:grouping(concurrent).length,concurrentBindings:concurrent.perceivedBindings.length,restoredStateEqual:same(restored,dariusFirst.state),restoredContinuationEqual:same(minaSecond,replay),minaSecondSequence:String(minaSecond.transition.perceptualEventReferentId.observerEventSequence),dariusFirstSequence:String(dariusFirst.transition.perceptualEventReferentId.observerEventSequence),shiftedGroupingEqual:same(grouping(low),grouping(shifted)),shiftedIdsDiffer:!same(low.perceptualEventReferentIds,shifted.perceptualEventReferentIds)},scope:'Original CV-SEM-031..040 component recipes and label allocation order. Exact diagnostic JSON preserves original version, Maps, bigint and absence. False continuity/discontinuity are fixture interpretations, not observer truth knowledge. Structural copy is not native Save132 persistence. Failed isolated settlement preserves committed data while status changes. No active-run intervention or full SEM qualification claim.'};
}
