/** Internal GA source-cohort scheduler integration. This exercises admitted
 * declarations and actual producers under ordering-phases/2-candidate and
 * adaptation-settlement/0.2-candidate. It does not issue public model/run IDs,
 * claim a whole-model work ceiling, or replace the public persistence gate. */
import {canonicalEncode as enc,list,text,signed,unsigned as u,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,statePatchValue,statePathValue,actualReadRecordValue,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type ScheduledEvent,type EventEmission,type ConformanceInstrumentation} from '../substrate/scheduler';
import {scheduledEventValue,SaveContractError} from '../substrate/persistence';
import {simInstant} from '../substrate/time';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
import {generalRecord as r,generalSubject,generalDefinitionId as d,generalBindingContext,generalId as id} from './generalBindingProfile';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {generalRegistrationTemplates} from './generalRegistration';
import {produceGeneralBindings,freezeGeneralExperience} from './generalSemanticProduction';
import {generalOpportunityEvidence,type GeneralSelectionSource} from './generalSelectionProduction';
import {deriveGeneralSourceRoles} from './generalSourceRoles';
import {causalRoleEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {prepareGeneralTerminalBatch,type GeneralTerminalOwnerGroup} from './generalTerminalBatch';
import {isGeneralCreditRecipe} from './generalDefinitionProfile';
import {generalCreditCalendar as creditCalendar} from './generalCreditSourceDeclarations';
import {deriveGeneralWorkBudget} from './generalWorkBudget';
import {compileGeneralTrace,type GeneralTraceIdentities} from './generalTrace';
import type {compileGeneralDeclarations} from './generalDeclarations';
import type {GeneralOutputReceipt} from './generalOutputSlots';

type Model=Awaited<ReturnType<typeof compileGeneralDeclarations>>;
type Instant=ReturnType<Model['outputSlots']['beginInstant']>;
const context=generalBindingContext(),who=generalSubject();
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')return fail('GA runtime instant');return v.value;};
export function createGeneralSourceRuntime(model:Model,identities?:GeneralTraceIdentities){
 const trace=identities?compileGeneralTrace(model,identities):undefined;
 const budget=deriveGeneralWorkBudget();let committedNextOrdinal=0n,workingNextOrdinal=0n,instantSlots=0n,instantOutputs=0n;
 const takeOrdinal=(ctx:EventHandlerContext<AuthoritativeState>)=>{const n=ctx.allocateRuntimeId();if(n!==workingNextOrdinal||++instantSlots>budget.slots)fail('GA whole-model runtime ordinal budget');workingNextOrdinal++;return n;};
 const countOutputs=(values:readonly CanonicalValue[])=>{instantOutputs+=BigInt(values.length);if(instantOutputs>budget.outputs)fail('GA whole-model output budget');};
 const templates=generalRegistrationTemplates(),byName=new Map(templates.map(t=>[t.name,t])),byEvent=new Map(templates.map(t=>[key(t.event),t.name]));
 const probeTypes=model.inheritedSource.execution.eventTypes(),inherited=new Map([...probeTypes.map((event,i)=>[key(event),{event,phase:i===0?110n:i>=6?130n:119n+BigInt(i),type:i===0?333n:335n}] as const),...[['event/measurement-evidence-intake',130n,203n],['event/measurement-episode-evidence',130n,337n],['event/measurement-prediction-application',140n,342n]].map(([name,phase,type])=>{const event=id(1001,name as string);return [key(event),{event,phase:phase as bigint,type:type as bigint}] as const;})]);
 const originals=items(decode(model.source.originalBytes(),context),'list').map(v=>rec(v,665n));
 const queue:ScheduledEvent[]=[{eventId:0n,eventSequence:0n,dueAt:simInstant(1n),phase:110n,eventTypeId:probeTypes[0],payload:r(333,[model.inheritedSource.execution.definitionId]),dependencies:list([]),causalParentEventIds:[]},{eventId:1n,eventSequence:1n,dueAt:simInstant(2n),phase:40n,eventTypeId:byName.get('prior-concern-workspace')!.event,payload:r(377,[who.observer,d('workspace')]),dependencies:list([]),causalParentEventIds:[]},...originals.map((payload,i)=>({eventId:BigInt(i+2),dueAt:simInstant(time(f(payload,1n))),phase:0n,eventSequence:BigInt(i+2),eventTypeId:byName.get('world')!.event,payload,dependencies:list([]),causalParentEventIds:[]}))];
 const credit=isGeneralCreditRecipe(model.recipe);
 function appendOriginal(stage:string,at:bigint,payload:CanonicalValue){const n=BigInt(queue.length);queue.push({eventId:n,eventSequence:n,dueAt:simInstant(at),phase:BigInt(byName.get(stage)!.phase),eventTypeId:byName.get(stage)!.event,payload,dependencies:list([]),causalParentEventIds:[]});return n;}
 const taskEvent=id(1001,'event/task-deadline'),taskOriginalId=BigInt(queue.length);inherited.set(key(taskEvent),{event:taskEvent,phase:140n,type:371n});queue.push({eventId:taskOriginalId,eventSequence:taskOriginalId,dueAt:simInstant(model.task.at),phase:140n,eventTypeId:taskEvent,payload:model.task.payload(),dependencies:list([]),causalParentEventIds:[]});
 let significanceOriginal:bigint|undefined;
 if(credit){appendOriginal('goal-command-proposal',1n,r(677,[who.observer,r(561,[d('goal'),u(1)])]));for(const {at,amount} of creditCalendar.replenishments)appendOriginal('local-reserve-replenishment',at,r(651,[r(644,[who.character,id(1044,'local-reserve/A')]),q(amount,1)]));significanceOriginal=appendOriginal('significance-opportunity',creditCalendar.significance,r(686,[who.observer,d('goal-qualification')]));appendOriginal('retention-original',creditCalendar.retention,r(700,[who.observer,d('retention-control')]));}
 let scheduler:DeterministicScheduler<AuthoritativeState>,expected=new Map<bigint,string>(),tx:Instant|undefined,allocate:(()=>bigint)|undefined;
 let world:ReturnType<Model['sensing']['materialize']>|undefined,sample:ReturnType<ReturnType<Model['sensing']['materialize']>['sample']>|undefined;
 let tracking:ReturnType<Model['tracking']['prepare']>|undefined,bound:ReturnType<typeof produceGeneralBindings>|undefined,experience:ReturnType<typeof freezeGeneralExperience>;
 let original:RecordValue|undefined,claims:GeneralSelectionSource['claims']=[],visual:ReturnType<Model['selection']['visual']>|undefined,body:ReturnType<Model['selection']['body']>|undefined;
 let selections:GeneralOutputReceipt[]=[],formations:GeneralOutputReceipt[]=[],recollections:GeneralOutputReceipt[]=[],visualFormation:GeneralOutputReceipt|undefined;
 let ranks=new Map<string,ReturnType<Model['recall']['body']>|ReturnType<Model['recall']['event']>>(),instantLive=false;
 let inheritedEngine:ReturnType<Model['inheritedSource']['begin']>|undefined,probeResult:object|undefined,carriage:ReturnType<ReturnType<Model['inheritedSource']['begin']>['intake']>|undefined,m1:ReturnType<ReturnType<Model['inheritedSource']['begin']>['evidence']>|undefined;
 let workspaceReceipt:GeneralOutputReceipt|undefined,appraisalReceipt:GeneralOutputReceipt|undefined,feedback:CanonicalValue|undefined,originalEventId:bigint|undefined;
 let committedPending=new Map<bigint,ScheduledEvent>(),workingPending=new Map<bigint,ScheduledEvent>();
 let lane:'current'|'consequence'='current',baselineReceipts:GeneralOutputReceipt[]=[],focusReceipt:GeneralOutputReceipt|undefined,attributionReceipt:GeneralOutputReceipt|undefined,qualificationReceipt:GeneralOutputReceipt|undefined,deliveredAttribution:GeneralOutputReceipt|undefined,significanceReceipt:GeneralOutputReceipt|undefined;
 let focusEvent:bigint|undefined,publicationEvents:bigint[]=[],joinParents:bigint[]=[],significanceStarted=false,joined=false;
 const active=()=>tx??fail('GA runtime output transaction');
 const source=():GeneralSelectionSource=>({samples:decode(sample!.samplesBytes(),context),tracking:tracking!.result(),staged:experience?.staged(),claims});
 const outputs=(receipt:GeneralOutputReceipt)=>active().outputs(receipt).map(b=>decode(b,context));
 function input(stage:string,value:CanonicalValue){const v=decode(enc(value),context);rec(v,byName.get(stage)!.input.typeId);model.validateRecordRoles(enc(v));return v;}
 function consume(event:ScheduledEvent){
  const stage=byEvent.get(key(event.eventTypeId));if(!instantLive||!stage||expected.get(event.eventId)!==key(scheduledEventValue(event)))throw new SchedulerContractError('INPUT_NOT_ADMITTED','actual unconsumed GA parent-bound event required');
  if(event.phase!==BigInt(byName.get(stage)!.phase))fail('GA runtime phase');input(stage,event.payload);expected.delete(event.eventId);return stage;
 }
 function authenticateInherited(event:ScheduledEvent){const binding=inherited.get(key(event.eventTypeId));if(!instantLive||!binding||event.phase!==binding.phase||expected.get(event.eventId)!==key(scheduledEventValue(event)))fail('GA inherited scheduled source');rec(decode(enc(event.payload),context),binding.type);expected.delete(event.eventId);return binding;}
 function bindChildren(children:readonly ScheduledEvent[],now:bigint){for(const child of children){if(child.dueAt===now)expected.set(child.eventId,key(scheduledEventValue(child)));else workingPending.set(child.eventId,structuredClone(child));}}
 function inheritedHandler(ctx:EventHandlerContext<AuthoritativeState>){
  authenticateInherited(ctx.event);const name=(ctx.event.eventTypeId.payload as {value:string}).value,engine=inheritedEngine??fail('GA inherited instant');let produced:CanonicalValue[]=[],reads:readonly ActualReadRecord[]=[],emissions:readonly EventEmission[]=[],bind:((children:readonly ScheduledEvent[])=>void)|undefined;
  const emission=(eventName:string,phase:bigint,payload:CanonicalValue):EventEmission=>({eventTypeId:id(1001,eventName),phase,dueAt:ctx.instant,payload,dependencies:list([])});
  if(probeTypes.some(t=>key(t)===key(ctx.event.eventTypeId))){const result=engine.execute(ctx.event,ctx.state,{allocateRuntimeId:()=>takeOrdinal(ctx)});produced=[...result.outputs];reads=result.reads;emissions=result.plan.emissions();const count=emissions.length;bind=children=>result.plan.bindAllocatedChildren(children.slice(0,count));
   const observation=produced.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===203n);if(observation){probeResult=result;emissions=[...emissions,emission('event/measurement-evidence-intake',130n,observation)];}
  }else if(name==='event/measurement-evidence-intake'){carriage=engine.intake(probeResult!,typedIdentifier(1124,u(takeOrdinal(ctx))));produced=[carriage.output()];emissions=[emission('event/measurement-episode-evidence',130n,produced[0])];
  }else if(name==='event/measurement-episode-evidence'){m1=engine.evidence(carriage!,typedIdentifier(1125,u(takeOrdinal(ctx))));produced=[m1.output()];emissions=[emission('event/measurement-prediction-application',140n,produced[0])];
  }else fail('GA inherited terminal routing');
  return {nextState:ctx.state,outputs:produced,emittedEvents:[...emissions],traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{countOutputs(produced);bind?.(children);bindChildren(children,ctx.instant);if(trace)return [trace.render({stage:name,event:ctx.event,base:ctx.state,outputs:produced,children,reads,patch:{operations:[]}})];return [list([text('GA internal inherited integration'),scheduledEventValue(ctx.event),list(produced),list(reads.map(actualReadRecordValue)),list(children.map(scheduledEventValue))])];}};
 }
 function useInput(){const evidence=generalOpportunityEvidence(source(),tracking!.outputs());return r(670,new Map<bigint,CanonicalValue>([[1n,who.observer],[2n,f(original!,4n)],...(evidence.body?[[3n,evidence.body] as [bigint,CanonicalValue]]:[]),...(evidence.visual?[[4n,evidence.visual] as [bigint,CanonicalValue]]:[]),[5n,list(claims.map(causalRoleEvidenceValue))]]));}
 function handler(ctx:EventHandlerContext<AuthoritativeState>){
  const stage=consume(ctx.event),logical=stage.replace(/^consequence-/,'current-'),now=ctx.instant;allocate=()=>takeOrdinal(ctx);if(!tx)tx=model.outputSlots.beginInstant(()=>allocate!());
  let state=ctx.state,produced:CanonicalValue[]=[],reads:readonly ActualReadRecord[]=[],patch:StatePatch={operations:[]},protocolPatch:StatePatch={operations:[]};
  const emissions:EventEmission[]=[],emit=(name:string,value:CanonicalValue,parents:readonly bigint[]=[])=>{if(lane==='consequence')name=name.replace(/^current-/,'consequence-');emissions.push({dueAt:now,phase:BigInt(byName.get(name)!.phase),eventTypeId:byName.get(name)!.event,payload:input(name,value),dependencies:list([]),...(parents.length?{additionalCausalParentEventIds:parents.filter(n=>n!==ctx.event.eventId)}:{})});};
  const future=(name:string,at:bigint,value:CanonicalValue)=>emissions.push({dueAt:simInstant(at),phase:BigInt(byName.get(name)!.phase),eventTypeId:byName.get(name)!.event,payload:input(name,value),dependencies:list([])});
  const admit=(values:readonly CanonicalValue[],reservation?:GeneralOutputReceipt)=>{produced=[...values];return active().beginStage(stage,reservation).admit(values);};
  const apply=(value:StatePatch)=>{patch=value;state=model.state.applyStagePatch(stage,state,value).state;};
  const enroll=(receipt:GeneralOutputReceipt)=>{selections.push(receipt);protocolPatch=model.memory.enrollSources(state,active(),[receipt],now).protocolPatch();state=model.state.applyProtocolPatch(state,protocolPatch).state;};
  if(stage==='prior-concern-workspace'){
   const slot=active().beginStage(stage),result=model.workspace.construct(state,ctx.event.payload,slot.allocate(1128n),now);produced=[decode(result.outputBytes(),context)];reads=result.actualReadRecords();workspaceReceipt=slot.admit(produced);emit('prior-concern-appraisal',r(674,[who.observer,produced[0]]));
  }else if(stage==='prior-concern-appraisal'){
   const slot=active().beginStage(stage);produced=[model.concern.appraisal(active(),workspaceReceipt!,slot.allocate(1129n))];appraisalReceipt=slot.admit(produced);emit('prior-concern-producer',r(675,[who.observer,produced[0]]));
  }else if(stage==='prior-concern-producer'){
   const slot=active().beginStage(stage);produced=[model.concern.concern(active(),appraisalReceipt!,slot.allocate(1130n))];const receipt=slot.admit(produced),delivery=model.concern.prepareDelivery(active(),receipt,now);
   for(const target of queue.filter(e=>key(e.eventTypeId)===key(byName.get('world')!.event))){const original=rec(target.payload,665n),use=rec(f(original,4n),664n);if(uint(f(original,5n))!==1n||f(use,2n)!==true&&f(use,4n)!==true)continue;const name=f(use,2n)===true?'encoding-concern-delivery':'recall-concern-delivery';future(name,target.dueAt,r(676,[who.observer,delivery.delivery(u(target.eventId),target.dueAt)]));}
  }else if(stage==='encoding-concern-delivery'||stage==='recall-concern-delivery'){
   const value=f(rec(ctx.event.payload,676n),2n);if(originalEventId===undefined||key(f(rec(value,638n),1n))!==key(u(originalEventId)))fail('GA feedback target original');feedback=value;admit([value]);
  }else if(stage==='world'){
   if(original)fail('GA source cohort simultaneous original');originalEventId=ctx.event.eventId;original=rec(ctx.event.payload,665n);lane=uint(f(original,5n))===1n?'current':'consequence';world=model.sensing.materialize(original,active());produced=outputs(world.worldReceipt);emit('current-sample',decode(world.samplingInputBytes(),context));
  }else if(logical==='current-sample'){
   sample=world!.sample(state);produced=outputs(sample.receipt);reads=sample.actualReadRecords();emit('current-track',decode(sample.trackingInputBytes(),context));
  }else if(logical==='current-track'){
   tracking=model.tracking.prepare(state,stage as 'current-track'|'consequence-track',decode(sample!.samplesBytes(),context));admit(tracking.outputs());reads=tracking.actualReadRecords();apply(tracking.patch());
   const trackValues=tracking.outputs(),event=trackValues.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===219n),fields=new Map<bigint,CanonicalValue>([[1n,who.observer],[2n,source().samples],[3n,f(original!,4n)],[4n,list(trackValues.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===217n))]]);if(event)fields.set(5n,event);emit('current-bind',r(668,fields));
  }else if(logical==='current-bind'){
   const slot=active().beginStage(stage);bound=produceGeneralBindings(source().samples,tracking!.result(),()=>uint(slot.allocate(1103n).payload));produced=bound.outputs();slot.admit(produced);const fields=new Map(rec(ctx.event.payload,668n).fields);fields.set(6n,list(produced));emit('current-classify',r(669,fields));
  }else if(logical==='current-classify'){admit([]);emit('current-freeze',ctx.event.payload);
  }else if(logical==='current-freeze'){
   experience=freezeGeneralExperience(source().samples,tracking!.result(),bound!.bindings(),sample!.reservation());admit(experience?[experience.output()]:[],sample!.receipt);emit('current-roles',useInput());
  }else if(logical==='current-roles'){
   const slot=active().beginStage(stage);claims=experience?deriveGeneralSourceRoles(experience.staged().experience,()=>uint(slot.allocate(1111n).payload)):[];produced=claims.map(causalRoleEvidenceValue);slot.admit(produced);emit('current-dispatch',useInput());
  }else if(logical==='current-dispatch'){
   admit([]);const use=rec(f(original!,4n),664n),evidence=generalOpportunityEvidence(source(),tracking!.outputs());
   if(f(use,1n)===true)emit('current-body-selection',r(600,[who.observer,evidence.body!]));
   if(f(use,2n)===true)emit('current-visual-selection',r(614,[who.observer,evidence.visual!,d('visual-selection'),list(claims.map(causalRoleEvidenceValue))]));
   if(f(use,3n)===true)emit('current-body-cue',r(601,[who.observer,evidence.body!]));
   if(f(use,4n)===true)emit('current-visual-cue',r(622,[who.observer,evidence.visual!]));
   if(use.fields.has(5n))emit('goal-baseline-cue',r(601,[who.observer,evidence.body!]));
  }else if(logical==='current-body-selection'||logical==='current-visual-selection'){
   reads=model.accessorBinding(stage).construct(state,who.observer,now).actualReadRecords();const slot=active().beginStage(stage);
   if(logical==='current-body-selection'){body=model.selection.body(source(),()=>uint(slot.allocate(1143n).payload));produced=body.outputs();enroll(slot.admit(produced));emit('body-acquisition-evidence',r(605,[who.observer,produced[1]]));}
   else{visual=model.selection.visual(source(),()=>uint(slot.allocate(1143n).payload));produced=visual.outputs();enroll(slot.admit(produced));const join=r(616,[who.observer,produced[1],d('encoding')]);if(lane==='current'){if(!feedback)fail('GA missing scheduled encoding feedback');emit('prior-concern-visual-encoding',r(640,[who.observer,join,feedback]));}else emit('current-visual-encoding',join);}
  }else if(stage==='prior-concern-visual-encoding'){admit(visual!.encode(feedback));emit('visual-acquisition-evidence',r(671,[who.observer,produced[1]]));
  }else if(logical==='current-visual-encoding'){admit(visual!.encode());emit('visual-acquisition-evidence',r(671,[who.observer,produced[1]]));
  }else if(stage==='body-acquisition-evidence'||stage==='visual-acquisition-evidence'){
   const slot=active().beginStage(stage);produced=(stage==='body-acquisition-evidence'?body!:visual!).form(()=>uint(slot.allocate(1145n).payload));const receipt=slot.admit(produced);
   if(produced.length){formations.push(receipt);const payload=r(673,[who.observer,produced[0]]);emit('ordinary-memory-formation',payload);if(stage==='visual-acquisition-evidence'){visualFormation=receipt;emit('event-association-formation',payload);emit('event-presentation-formation',payload);}}
  }else if(logical==='current-visual-cue'||logical==='current-body-cue'){
   const event=logical==='current-visual-cue',cue=event?model.recall.eventCue(source()):model.recall.bodyCue(source());admit([cue]);if(event){if(lane==='current'){if(!feedback)fail('GA missing scheduled recall feedback');emit('prior-concern-event-rank',r(642,[who.observer,cue,feedback]));}else emit('current-event-rank',r(672,[who.observer,cue]));}else emit('current-body-rank',r(607,[who.observer,cue]));
  }else if(stage==='prior-concern-event-rank'||logical==='current-event-rank'||logical==='current-body-rank'){
   const rank=stage==='prior-concern-event-rank'?model.recall.event(state,f(rec(ctx.event.payload,642n),2n),now,'current',feedback):logical==='current-event-rank'?model.recall.event(state,f(rec(ctx.event.payload,672n),2n),now,lane):model.recall.body(state,f(rec(ctx.event.payload,607n),2n),now,lane);reads=rank.actualReadRecords();admit([rank.result()]);const payload=r(596,[who.observer,stage==='prior-concern-event-rank'?f(rec(produced[0],643n),1n):produced[0]]);if(ranks.has(key(payload)))fail('GA duplicate recall publisher');ranks.set(key(payload),rank);emit('current-recollection',payload);
  }else if(logical==='current-recollection'){
   const rank=ranks.get(key(ctx.event.payload))??fail('GA missing actual rank');ranks.delete(key(ctx.event.payload));const slot=active().beginStage(stage);produced=rank.publish(()=>uint(slot.allocate(1148n).payload));const receipt=slot.admit(produced);recollections.push(receipt);rank.close();
   const events=produced.filter(v=>rec(f(rec(v,590n),4n),(f(rec(v,590n),4n) as RecordValue).schema.typeId).schema.typeId===588n);if(events.length)emit('event-presentation-dispatch',r(597,[who.observer,list(events)]));
   publicationEvents.push(ctx.event.eventId);if(credit&&now===creditCalendar.cue&&ranks.size===0){if(!focusReceipt||focusEvent===undefined)fail('GA required focal delivery');emit('retained-attribution',r(682,[who.observer,outputs(focusReceipt)[0],list(recollections.flatMap(outputs))]),[focusEvent,...publicationEvents]);}
  }else if(stage==='goal-command-proposal'){
   admit([]);emit('goal-command-owner',ctx.event.payload);future('goal-deadline-owner',100n,r(678,[who.observer,d('goal'),signed(now)]));
  }else if(stage==='local-reserve-replenishment'){
   const result=model.physical.replenish(state,ctx.event.payload,now);admit(result.outputs());reads=result.actualReadRecords();apply(result.patch());
  }else if(stage==='goal-baseline-cue'){
   const cue=model.recall.bodyCue(source());admit([cue]);emit('goal-baseline-rank',r(607,[who.observer,cue]));
  }else if(stage==='goal-baseline-rank'){
   const rank=model.recall.body(state,f(rec(ctx.event.payload,607n),2n),now,'goal-baseline');reads=rank.actualReadRecords();admit([rank.result()]);const payload=r(596,[who.observer,produced[0]]);ranks.set(key(payload),rank);emit('goal-baseline-recollection',payload);
  }else if(stage==='goal-baseline-recollection'){
   const rank=ranks.get(key(ctx.event.payload))??fail('GA actual baseline rank');ranks.delete(key(ctx.event.payload));const slot=active().beginStage(stage);produced=rank.publish(()=>uint(slot.allocate(1148n).payload));baselineReceipts.push(slot.admit(produced));rank.close();emit('goal-outcome-assessment',r(679,[who.observer,d('goal'),generalOpportunityEvidence(source(),tracking!.outputs()).body!,list(produced)]));
  }else if(stage==='goal-outcome-assessment'){
   const assessment=model.goals.assess(state,active(),source(),baselineReceipts,now),slot=active().beginStage(stage),result=assessment.produce(()=>uint(slot.allocate(1146n).payload));produced=result.outputs;reads=assessment.actualReadRecords();const receipt=slot.admit(produced);assessment.close();
   if(produced.length){const carry=model.outcomeDeliveries.goal(active(),receipt),target=queue.find(e=>e.dueAt===creditCalendar.cue&&key(e.eventTypeId)===key(byName.get('world')!.event))??fail('GA focal target');future('focal-consequence-delivery',creditCalendar.cue,carry.focal(u(target.eventId),creditCalendar.cue));future('goal-qualification-delivery',creditCalendar.significance,r(681,[who.observer,carry.qualification(u(significanceOriginal!),creditCalendar.significance)]));}
  }else if(stage==='focal-consequence-delivery'){
   if(originalEventId===undefined||key(f(rec(ctx.event.payload,680n),4n))!==key(u(originalEventId)))fail('GA focal target original');focusReceipt=admit([ctx.event.payload]);focusEvent=ctx.event.eventId;
  }else if(stage==='retained-attribution'){
   const attribution=model.attribution.prepare(state,active(),focusReceipt??null,recollections,now),slot=active().beginStage(stage);produced=attribution.produce(()=>uint(slot.allocate(1147n).payload));reads=attribution.actualReadRecords();attributionReceipt=slot.admit(produced);attribution.close();
   if(produced.length){emit('attribution-use-dispatch',r(684,[who.observer,produced[0]]));future('attribution-result-delivery',creditCalendar.significance,model.outcomeDeliveries.attribution(active(),attributionReceipt).delivery(u(significanceOriginal!),creditCalendar.significance));}
  }else if(stage==='attribution-use-dispatch'){admit([]);emit('ordinary-memory-use',ctx.event.payload);
  }else if(stage==='goal-qualification-delivery'){
   const value=f(rec(ctx.event.payload,681n),2n);if(key(f(rec(value,570n),1n))!==key(u(significanceOriginal!)))fail('GA qualification target original');qualificationReceipt=admit([value]);joinParents.push(ctx.event.eventId);
  }else if(stage==='attribution-result-delivery'){
   if(key(f(rec(ctx.event.payload,683n),2n))!==key(u(significanceOriginal!)))fail('GA attribution target original');deliveredAttribution=admit([ctx.event.payload]);joinParents.push(ctx.event.eventId);
  }else if(stage==='significance-opportunity'){
   if(ctx.event.eventId!==significanceOriginal)fail('GA significance original');admit([]);significanceStarted=true;joinParents.push(ctx.event.eventId);
  }else if(stage==='significance-join'){
   const result=model.outcomeDeliveries.significance(active(),qualificationReceipt!,deliveredAttribution!,u(significanceOriginal!),now);if(key(f(rec(ctx.event.payload,685n),2n))!==key(result.outputs[0]))fail('GA significance actual operand join');significanceReceipt=admit(result.outputs);if(result.qualifies)emit('ordinary-memory-significance',ctx.event.payload);
  }else if(stage==='retention-original'){admit([]);emit('retention-dispatch',ctx.event.payload);
  }else if(stage==='retention-dispatch'){admit([]);for(const name of ['ordinary-memory-retention','event-association-retention','event-presentation-cleanup'])emit(name,ctx.event.payload);
  }else if(stage==='event-presentation-dispatch'){admit([]);emit('event-presentation-owner',ctx.event.payload);
  }else fail('GA source cohort unsupported stage');
  if(significanceStarted&&qualificationReceipt&&deliveredAttribution&&!joined){joined=true;const carry=f(rec(outputs(qualificationReceipt)[0],570n),3n),result=f(rec(outputs(deliveredAttribution)[0],683n),4n);emit('significance-join',r(685,[who.observer,r(576,[carry,result])]),joinParents);}
  return {nextState:state,outputs:produced,emittedEvents:emissions,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{countOutputs(produced);bindChildren(children,now);if(trace)return [trace.render({stage,event:ctx.event,base:ctx.state,outputs:produced,children,reads,patch,protocolPatch})];return [list([text('GA internal source integration'),text(stage),scheduledEventValue(ctx.event),list(produced),list(reads.map(actualReadRecordValue)),statePatchValue(patch),statePatchValue(protocolPatch),list(children.map(scheduledEventValue))])];}};
 }
 scheduler=new DeterministicScheduler({initialState:model.initial.build(),stateAdapter:{clone:s=>new AuthoritativeState(s.entries()),validate:model.state.validateState,canonicalValue:s=>s.canonicalValue()},handlers:new Map([...byEvent.keys()].map(k=>[k,handler] as const).concat([...inherited.keys()].map(k=>[k,inheritedHandler] as const))),initialQueue:queue,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(queue.length),nextEventSequence:BigInt(queue.length)},maxSettlementWorkPerSimulationInstant:budget.work,
  adaptationSettlement:{version:'adaptation-settlement/0.2-candidate',
   beforeInstant(_state,now){instantLive=true;workingNextOrdinal=committedNextOrdinal;instantSlots=0n;instantOutputs=0n;workingPending=new Map(committedPending);expected=new Map([...queue.filter(e=>e.dueAt===now),...workingPending.values()].filter(e=>e.dueAt===now).map(e=>[e.eventId,key(scheduledEventValue(e))]));if(now===1n)inheritedEngine=model.inheritedSource.begin(now);},
   validateRuntimeEmission(emission){const binding=inherited.get(key(emission.eventTypeId));if(binding){if(emission.phase!==binding.phase)fail('GA inherited emission phase');rec(decode(enc(emission.payload),context),binding.type);return;}const stage=byEvent.get(key(emission.eventTypeId));if(!stage||BigInt(byName.get(stage)!.phase)!==emission.phase)fail('GA runtime emitted phase');input(stage,emission.payload);},
   prepare(events,base,now){
    if(!tx)tx=model.outputSlots.beginInstant(()=>fail('GA terminal unexpected occurrence allocation'));
    const inheritedEvents=events.filter(e=>inherited.has(key(e.eventTypeId))),predictionEvents=inheritedEvents.filter(e=>key(e.eventTypeId)!==key(taskEvent)),taskEvents=inheritedEvents.filter(e=>key(e.eventTypeId)===key(taskEvent)),gaEvents=events.filter(e=>!inherited.has(key(e.eventTypeId)));
    if(predictionEvents.length>1||predictionEvents.some(e=>(e.eventTypeId.payload as {value:string}).value!=='event/measurement-prediction-application'||expected.get(e.eventId)!==key(scheduledEventValue(e)))||predictionEvents.length&&!m1)fail('GA inherited terminal coverage');
    const prediction=predictionEvents.length?inheritedEngine!.prediction(m1!,base):undefined;if(prediction)model.state.applyPredictionPatch(base,prediction.patch());
    if(taskEvents.length>1||taskEvents.some(e=>e.eventId!==taskOriginalId||expected.get(e.eventId)!==key(scheduledEventValue(e))))fail('GA task deadline authentication');
    const task=taskEvents.length?model.task.deadline(base,taskEvents[0].payload,now):undefined;if(task)model.state.applyTaskPatch(base,task.patch());
    const stages=gaEvents.map(e=>{const name=byEvent.get(key(e.eventTypeId));if(!name||expected.get(e.eventId)!==key(scheduledEventValue(e)))fail('GA terminal event authentication');return name;}),groups:GeneralTerminalOwnerGroup[]=[];
    let memory:ReturnType<Model['memory']['settleFormation']>|undefined;
    const memoryStage=stages.find(s=>s.startsWith('ordinary-memory-'));
    if(memoryStage)groups.push({stage:memoryStage,prepare:s=>{memory=model.memory.settleFormation(s,active(),selections,formations,now,{use:attributionReceipt?[attributionReceipt]:[],significance:significanceReceipt?[significanceReceipt]:[]});return {patch:memory.memoryPatch,actualReadRecords:memory.actualReadRecords};}});
    if(stages.includes('event-association-formation'))groups.push({stage:'event-association-formation',prepare:s=>model.graphOwners.association(s,active(),visualFormation,now)});
    if(stages.includes('event-association-retention'))groups.push({stage:'event-association-retention',prepare:s=>model.graphOwners.association(s,active(),undefined,now)});
    const presentationStage=stages.find(s=>s.startsWith('event-presentation-'));if(presentationStage)groups.push({stage:presentationStage,prepare:s=>model.graphOwners.presentations(s,active(),memory,recollections,now)});
    for(const goalStage of ['goal-command-owner','goal-deadline-owner']){const event=gaEvents.find(e=>key(e.eventTypeId)===key(byName.get(goalStage)!.event));if(event){if(gaEvents.filter(e=>key(e.eventTypeId)===key(event.eventTypeId)).length!==1)fail('GA duplicate goal owner');groups.push({stage:goalStage,prepare:s=>goalStage==='goal-command-owner'?model.goals.command(s,event.payload,now):model.goals.deadline(s,event.payload,now)});}}
    if(stages.some(s=>!['ordinary-memory-formation','ordinary-memory-use','ordinary-memory-significance','ordinary-memory-retention','event-association-formation','event-association-retention','event-presentation-formation','event-presentation-owner','event-presentation-cleanup','goal-command-owner','goal-deadline-owner'].includes(s)))fail('GA source terminal group');
    const batch=prepareGeneralTerminalBatch(model.state,base,groups,()=>memory?.protocolPatch()??{operations:[]});let final:ReturnType<typeof batch.finish>|undefined;
    function terminalTraces(){
     const used=new Set<string>();let protocolUsed=false;
     return events.map(event=>{
      const stage=byEvent.get(key(event.eventTypeId))??(event.eventTypeId.payload as {value:string}).value;
      const record=final!.records.find(p=>p.stage===stage&&!used.has(stage));if(record)used.add(stage);
      const inheritedResult=stage==='event/measurement-prediction-application'?prediction:stage==='event/task-deadline'?task:undefined;
      const protocolPatch=record?.stage.startsWith('ordinary-memory-')&&!protocolUsed?(protocolUsed=true,final!.protocolPatch):undefined;
      return trace!.render({stage,event,base,outputs:[],children:[],reads:record?.reads??inheritedResult?.actualReadRecords()??[],patch:record?.patch??inheritedResult?.patch()??{operations:[]},protocolPatch});
     });
    }
    return {execute:ctx=>{const inheritedEvent=inherited.has(key(ctx.event.eventTypeId));const stage=inheritedEvent?(authenticateInherited(ctx.event),(ctx.event.eventTypeId.payload as {value:string}).value):consume(ctx.event);if(!inheritedEvent)active().beginStage(stage).admit([]);return {nextState:ctx.state,outputs:[],emittedEvents:[],traceContributions:trace?[]:[list([text('GA internal terminal event'),text(stage),scheduledEventValue(ctx.event)])]};},finish:()=>{final=batch.finish();let state=final.state;if(prediction)state=model.state.applyPredictionPatch(state,prediction.patch()).state;if(task)state=model.state.applyTaskPatch(state,task.patch()).state;return state;},finalizeTrace:()=>trace?terminalTraces():[list([text('GA internal terminal batch'),list(final!.records.map(p=>list([text(p.stage),statePatchValue(p.patch),list(p.reads.map(actualReadRecordValue))]))),statePatchValue(final!.protocolPatch),...[prediction,task].flatMap(p=>p?[statePatchValue(p.patch()),list(p.actualReadRecords().map(actualReadRecordValue))]:[])])]};
   },
   beforeCommit(state,now){if(expected.size||ranks.size)fail('GA incomplete source instant');model.validateQuiescent(state,now,workingNextOrdinal);inheritedEngine?.finish();if(tx){tx.commit();tx=undefined;}for(const [id,event] of workingPending)if(event.dueAt===now)workingPending.delete(id);committedPending=new Map(workingPending);committedNextOrdinal=workingNextOrdinal;},
   close(){if(tx){tx.abort();tx=undefined;}inheritedEngine?.close();inheritedEngine=undefined;probeResult=undefined;carriage=undefined;m1=undefined;workspaceReceipt=undefined;appraisalReceipt=undefined;feedback=undefined;originalEventId=undefined;visual?.close();body?.close();for(const rank of ranks.values())rank.close();ranks.clear();instantLive=false;expected.clear();original=undefined;world=undefined;sample=undefined;tracking=undefined;bound=undefined;experience=undefined;claims=[];visual=undefined;body=undefined;selections=[];formations=[];recollections=[];visualFormation=undefined;allocate=undefined;lane='current';baselineReceipts=[];focusReceipt=undefined;attributionReceipt=undefined;qualificationReceipt=undefined;deliveredAttribution=undefined;significanceReceipt=undefined;focusEvent=undefined;publicationEvents=[];joinParents=[];significanceStarted=false;joined=false;},
  },
 });
 return Object.freeze({settleNextInstant:()=>scheduler.settleNextInstant(),settleNextInstantForConformance:(instrumentation:ConformanceInstrumentation)=>scheduler.settleNextInstantForConformance(instrumentation),snapshot:()=>scheduler.exportQuiescentSnapshot(),diagnostic:()=>scheduler.failureDiagnostic,
  /** Internal complete-prefix witness; not the public save/1 envelope. */
  originalBytes:()=>enc(list(queue.map(scheduledEventValue))),
  save(){
   if(!identities)throw new SaveContractError('GA canonical save requires model/run identity');
   const s=scheduler.exportQuiescentSnapshot();if(s.status!=='Active')throw new SaveContractError('GA failed run has no continuation save');
   const anchors=list(s.state.entries().filter(e=>e.path.rootStateTypeId===649n).map(e=>list([statePathValue(e.path),e.value])));
   return enc(r(132,[text('save/1-candidate'),identities.model,identities.run,signed(s.clock),s.state.canonicalValue(),r(131,[u(s.allocators.nextRuntimeId),u(s.allocators.nextEventId),u(s.allocators.nextEventSequence)]),list(s.queue.map(scheduledEventValue)),anchors,list([]),list([]),list(s.committedTrace),list(s.outputs)]));
  },
  prefixBytes(){const snapshot=scheduler.exportQuiescentSnapshot();if(snapshot.status!=='Active')throw new SaveContractError('GA failed run has no continuation prefix');return enc(list([signed(snapshot.clock),snapshot.state.canonicalValue(),r(131,[u(snapshot.allocators.nextRuntimeId),u(snapshot.allocators.nextEventId),u(snapshot.allocators.nextEventSequence)]),list(snapshot.queue.map(scheduledEventValue)),list(snapshot.committedTrace),list(snapshot.outputs)]));},
 });
}

/** Reconstruct every cross-instant capability by actual original-prefix replay.
 * Equality covers state, allocator, pending children, outputs and complete trace;
 * a well-shaped caller snapshot is never itself sufficient authority. */
export async function restoreGeneralSourcePrefix(model:Model,bytes:Uint8Array){
 const copy=bytes.slice();let target:bigint;
 try{const value=items(decode(copy,context),'list');if(value.length!==6)throw Error('prefix fields');target=time(value[0]);if(target<0n||target>100n)throw Error('prefix clock');}
 catch(error){throw new SaveContractError('GA malformed internal prefix: '+String(error));}
 const run=createGeneralSourceRuntime(model);
 while(run.snapshot().clock<target){const next=run.snapshot().queue[0];if(!next||next.dueAt>target)throw new SaveContractError('GA not a complete original prefix');await run.settleNextInstant();}
 const actual=run.prefixBytes();if(actual.length!==copy.length||actual.some((value,index)=>value!==copy[index]))throw new SaveContractError('GA complete prefix equality failed');
 return run;
}
