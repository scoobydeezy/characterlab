import type {createWorkMaintenance} from './workMaintenance';
import {CONTEXT_REASON_VERSION,REASON_EVIDENCE_VERSION,type createReasonEvidence} from './reasonEvidence';
import type {createActionMemory} from './actionMemory';
import {createEmbarrassment} from './embarrassment';
import {deriveRetainedAttribution,ATTRIBUTION_VERSION} from './retainedAttribution';
import type {createGoalMeaning} from './goalMeaning';
import type {MemoryUseConsumer} from './memoryUse';
import type {createReappraisalExecution} from './reappraisal';
import type {createCausalExecution} from './causalAttribution';
import {receivingRecord as rec} from './codecs';
import {VALUE_RECEIVING,VALUE_PROVENANCE,valueMotive,valueRaw,valueReasons} from './valueReceiving';
import type {createValuesExecution} from './values';
import {FORMATION_UPDATE,FORMATION_VERSION,FORMATION_OWNER,formationPath,formationValue,appendFormation,formationSignals} from './formation';
import {createSelfBeliefExecution,SELF_CONTEXT} from './selfBelief';
import {ELIGIBILITY,IDENTITY_VERSION,IDENTITY_CONTEXT,frozenIdentityExpression,qualifyIdentity,qualificationParts,journalPath,identityJournal} from './identityEligibility';
import {pattern,phasePath,phaseValue} from './skill';
import {traceRecordValue,TRACE_CONTRACT_VERSION} from '../substrate/trace';
import {workspaceOutput as configurationWorkspaceOutput} from './configurationWorkspace';
import {STANDING_ROUNDING_VERSION} from './standingRounding';
import {compileAssembledReasons,prioritySourceBasis,describedRaw,compileDescribedReasons,REASON_SOURCES_VERSION,SOURCE_COVERAGE_VERSION,REASON_REFERENCE_VERSION} from './reasons';
import {createAssembledRandomSession} from './random';
// assembled-character-model/0.1-candidate: bounded successor of cognitiveExecution at db0ca7a8.
/** task-cognitive-path/0.1-candidate trusted upstream execution adapter.
 * Live association checks precede all reads. Character transformers receive only
 * their restricted operands; this outer adapter owns state/registry access. */
import {canonicalEncode as enc,list,set,text,unsigned,typedIdentifier,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateContractError,patternMatches,type StatePath,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePathPattern} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import type {StructuralIdentity} from '../substrate/identity';
import {beginCognitiveSourceInstant,type OrderedInputCompilation} from '../campaign2/orderedInputs';
import {decodeStatePattern} from '../campaign2/stateModel';
import {decodeCognitive,cognitiveRecord as r,cloneCognitive} from './codecs';
import {compileReasonNuclei,readQ,qValue,appendIdentityContribution} from '../campaign2/cognitiveMath';
import {createCognitiveRandomSession} from '../campaign2/cognitiveArbitration';
import {arbitrationOutput} from './arbitration';
import {intentOutput,expressionOutput,qualificationOutput,planOutput,attemptOutput,executionOutput,chosenData} from './choice';
import {compileProtocolBridge} from './protocolBridge';
import {cognitiveTraceRecord as predecessorTraceRecord,protocolTraceRecord} from '../campaign2/cognitiveTrace';
import {workspaceOutput,appraisalOutput,concernOutput,motiveOutput,candidateOutput,rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {dataField as f,dataItems as items,dataKey as key,dataUnsigned as u,dataIdentity as id} from '../campaign2/canonicalData';
import {sharedWorkspace,taskWorkspaceDefinition,type BodyRecallDelivery} from './workspace';
import {contextAppraisal,jointAppraisal,jointConcern,jointSignalSupport} from './appraisal';
import type {createRelationshipExecution} from './relationshipExecution';
import type {createSocialExecution} from './socialExecution';
import type {createControlExecution} from './controlExecution';
import type {createHabitExecution} from './habitExecution';
import type {createPriorityExecution} from './priorityExecution';
import type {createStrategyExecution} from './strategyExecution';
import type {BodyEvidence} from './body';
import type {compileCharacterInputs} from './inputs';
import type {compileCharacterModel} from './model';
import type {compileCharacterState} from './state';

type Model=Awaited<ReturnType<typeof compileCharacterModel>>;
type State=Awaited<ReturnType<typeof compileCharacterState>>;
const atom=(n:number,s:string)=>typedIdentifier(n,text(s));
const eventKey=(e:ScheduledEvent)=>key(scheduledEventValue(e));
const stages=[
 ['deliberation-opportunity','TaskWorkspaceTransition',40,381],
 ['task-appraisal','TaskAppraisalTransition',50,384],
 ['task-concern','TaskConcernTransition',50,388],
 ['task-motive','TaskMotiveTransition',60,394],
 ['task-candidates','TaskCandidateTransition',70,398],
 ['task-raw-signals','TaskRawSignalTransition',80,403],
 ['task-reasons','TaskReasonCompilationTransition',80,408],
 ['task-arbitration','TaskArbitrationTransition',80,409],
 ['task-intent','TaskIntentTransition',90,425],
 ['task-expression','TaskExpressionTransition',90,426],
 ['task-plan','TaskPlanTransition',100,431],
 ['task-attempt','TaskAttemptTransition',110,432],
 ['protocol-execution','ProtocolExecutionTransition',110,433],
 ['task-qualification','TaskQualificationTransition',130,429],
 ['protocol-actual-fact','ProtocolActualFactBridgeTransition',110,307],
] as const;
function fail(message:string):never {throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);}
function stageFail(message:string):never {throw new SchedulerContractError('COGNITIVE_STAGE_VIOLATION',message);}

// Keep original trace mathematics; restore the exact successor payload after the
// predecessor's version1 source-ID read. No trace field loses Value provenance.
const cognitiveTraceRecord:typeof predecessorTraceRecord=(model,run,event,registration,output,children,evidence)=>{
 const payload=event.payload;
 if(typeof payload==='boolean'||payload.kind!=='record'||payload.schema.typeId!==403n||![2n,3n].includes(payload.schema.schemaVersion))return predecessorTraceRecord(model,run,event,registration,output,children,evidence);
 const old=r(403,[f(payload,1n),f(payload,2n),f(payload,3n),f(payload,4n)]),t=rec(predecessorTraceRecord(model,run,{...event,payload:old},registration,output,children,evidence),160n);
 return record(t.schema,new Map([...t.fields].map(([n,v])=>[n,n===4n?scheduledEventValue(event):n===12n?payload:v])));
};

export function createCognitiveExecution(model:Model,component:State,inputs:Awaited<ReturnType<typeof compileCharacterInputs>>,bodyEvidence:()=>BodyEvidence|undefined=()=>undefined,recallEvidence:()=>readonly BodyRecallDelivery[]=()=>[],strategy?:ReturnType<typeof createStrategyExecution>,priority?:ReturnType<typeof createPriorityExecution>,habit?:ReturnType<typeof createHabitExecution>,control?:ReturnType<typeof createControlExecution>,social?:ReturnType<typeof createSocialExecution>,relationship?:ReturnType<typeof createRelationshipExecution>,values?:ReturnType<typeof createValuesExecution>,causal?:ReturnType<typeof createCausalExecution>,reappraisal?:ReturnType<typeof createReappraisalExecution>,bodyUseConsumer?:MemoryUseConsumer,meaning?:ReturnType<typeof createGoalMeaning>,significanceConsumer?:(event:ScheduledEvent,workspace:CanonicalValue,attribution:CanonicalValue,report:CanonicalValue)=>void,spatialMeaning?:ReturnType<typeof createGoalMeaning>,actionMemory?:ReturnType<typeof createActionMemory>,reasonEvidence?:ReturnType<typeof createReasonEvidence>,workMaintenance?:ReturnType<typeof createWorkMaintenance>){
 const rows=items(items(decodeCognitive(model.baseRegistry),'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n));
 const registration=(name:string)=>f(rows.find(v=>key(f(v,1n))===key(atom(1009,name)))!,4n);
 const definition=(name:string)=>cloneCognitive(component.definition(name));
 const seed=f(rec(inputs.runIdentity.value,104n),4n);if(typeof seed==='boolean'||seed.kind!=='bytes')fail('run seed required');
 const random=model.habit?createAssembledRandomSession(seed.value,inputs.comparison,model.taskLimit,model.valueReceiving,model.standingRounding,inputs.timedComparison):createCognitiveRandomSession(seed.value);
 const protocol=compileProtocolBridge(definition('protocol-observation'));let protocolInstant:ReturnType<typeof protocol.begin>|undefined;
 let pending=new Map<string,ScheduledEvent>(),checkpoint=new Map<string,ScheduledEvent>(),active=false,instant=0n,sealed=false,unbound=0,chosen=false;
 let source:ReturnType<typeof beginCognitiveSourceInstant>|undefined;
 let valueProjection:CanonicalValue|undefined,valueMotivation:CanonicalValue|undefined,valueSupport:readonly CanonicalValue[]|undefined,priorityEvidence:CanonicalValue|undefined;
 let joint:CanonicalValue|undefined,activeWorkspace:CanonicalValue|undefined,activeAttribution:CanonicalValue|undefined;
 let contextEvent:ScheduledEvent|undefined,contextPending=new Set<string>();
 let identityPlan:{journal?:CanonicalValue;journalPath?:StatePath;event:ScheduledEvent;state:AuthoritativeState;path?:StatePath;subject?:CanonicalValue;contribution?:CanonicalValue}|undefined,identitySealed=false;
 const identityRegistration=rec(registration('TaskIdentityApplicationTransition'),450n),identityRequirement=rec(f(identityRegistration,8n),448n),identityDomain=items(f(identityRegistration,4n),'set').map(decodeStatePattern);
 if(model.eligibilityEnabled)identityDomain.push(pattern(journalPath(component.identityKey)));
 const identityTrace=(event:ScheduledEvent,output:CanonicalValue,children:readonly ScheduledEvent[],sources:readonly CanonicalValue[],evidence:{input?:CanonicalValue;domain?:readonly StatePathPattern[];reads?:readonly ActualReadRecord[];patch?:StatePatch;diffs?:readonly StructuralMutationDiff[];quantizationOperations?:readonly CanonicalValue[]}={})=>traceRecordValue({traceSchemaVersion:TRACE_CONTRACT_VERSION,modelIdentity:model.modelIdentity.value,runIdentity:inputs.runIdentity.value,event,seamId:atom(1036,'seam/assembled-identity-eligibility'),seamVersion:IDENTITY_VERSION,recordKind:event.eventTypeId,subjectIds:[id(component.tasks[0].character)],sourceRecordIds:sources.map(id),registeredReadDomain:evidence.domain??[],actualReadRecords:evidence.reads??[],inputProjection:evidence.input??event.payload,outputProjection:output,randomDrawRecords:[],quantizationOperations:evidence.quantizationOperations??[],statePatch:evidence.patch??{operations:[]},structuralMutationDiffs:evidence.diffs??[],emittedEvents:children,invariantResults:[]});
 const formationTrace=(event:ScheduledEvent,output:CanonicalValue,input:CanonicalValue,reads:readonly ActualReadRecord[],patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[])=>{const original=rec(identityTrace(event,output,[],[],{input,domain:reads.map(r=>pattern(r.path)),reads,patch,diffs}),160n);return record(original.schema,new Map([...original.fields].map(([n,v])=>[n,n===5n?atom(1036,'seam/assembled-formation'):n===6n?text(FORMATION_VERSION):v])));};
 let cognitiveOperation=false;
 const self=model.selfBeliefEnabled?createSelfBeliefExecution(component.tasks[0].character,component.stateModel,inputs.selfEvents,model.modelIdentity.value,inputs.runIdentity.value):undefined;
 const embarrassment=model.embarrassment?createEmbarrassment(model.embarrassment,component.tasks[0].character,component.stateModel,model.modelIdentity.value,inputs.runIdentity.value):undefined;
 const index=(event:ScheduledEvent)=>stages.findIndex(s=>key(event.eventTypeId)===key(atom(1001,'event/'+s[0])));
 return Object.freeze({
  automaticParticipantCount:()=>cognitiveOperation?0:1,
  selfContextType:()=>SELF_CONTEXT,
  executeSelfContext:(event:ScheduledEvent)=>self!.context(event),
  formationCandidate(event:ScheduledEvent,state:AuthoritativeState){
   if(!model.formationEnabled)return undefined;if(!identitySealed||!identityPlan||identityPlan.state!==state||eventKey(identityPlan.event)!==eventKey(event))fail('formation preflight association');const q=qualificationParts(event.payload),path=formationPath(component.tasks[0].character),pp=phasePath(component.tasks[0].character),reads:ActualReadRecord[]=[];
   const get=(p:StatePath)=>{const v=component.stateModel.read(state,p);reads.push({accessorId:atom(1028,'accessor/formation'),path:p,presence:v.presence,value:v.value,derivedSources:[]});return v;};const prior=get(path),phase=get(pp);if(!phase.presence)fail('formation requires developmental phase');const d=phaseValue(phase.value!),b=formationValue(prior.value),next=q.accepted?appendFormation(prior.value,q.id,q.at.value,readQ(q.contribution),d):undefined,patch:StatePatch={operations:next?[{kind:'set',path,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:next.value}]:[]},report=list([text(FORMATION_UPDATE),q.id,unsigned(instant),qValue(b.P),qValue(next?.after??b.P),next?.entry??list([])]);
   return {patch,report,authority:FORMATION_OWNER,trace:(diffs:readonly StructuralMutationDiff[])=>formationTrace(event,report,event.payload,reads,patch,diffs)};
  },
  selfPreflight:(event:ScheduledEvent)=>self?.preflight(event),
  selfCandidate:(event:ScheduledEvent,state:AuthoritativeState)=>self?.prepare(event,state),
  contextEventType:()=>IDENTITY_CONTEXT,
  executeContext(event:ScheduledEvent){if(!model.eligibilityEnabled||!active||sealed||event.phase!==30n||event.dueAt!==instant||contextEvent||!contextPending.delete(eventKey(event)))fail('identity context association');contextEvent=structuredClone(event);return identityTrace(event,event.payload,[],[]);},
  isEvent:(event:ScheduledEvent)=>index(event)>=0,
  eventTypes:()=>stages.map(s=>atom(1001,'event/'+s[0])),
  protocolEventTypes:()=>protocol.eventTypes(),
  identityEventType:()=>atom(1001,'event/task-identity-application'),
  executeProtocol(event:ScheduledEvent,allocator:{allocateRuntimeId():bigint}){if(!active||sealed||!protocolInstant)stageFail('protocol outside live cognitive instant');const result=protocolInstant.execute(event,allocator);return {...result,trace:(children:readonly ScheduledEvent[])=>protocolTraceRecord(model.modelIdentity.value,inputs.runIdentity.value,event,result.outputs,children)};},
  begin(at:bigint){embarrassment?.reset();cognitiveOperation=false;valueProjection=undefined;valueMotivation=undefined;valueSupport=undefined;priorityEvidence=undefined;self?.begin(at);contextEvent=undefined;contextPending=new Set(inputs.identityEvents.filter(e=>e.dueAt===at).map(eventKey));activeWorkspace=undefined;activeAttribution=undefined;joint=undefined;if(active)stageFail('cognitive instant already active');active=true;sealed=false;unbound=0;chosen=false;identityPlan=undefined;identitySealed=false;instant=at;checkpoint=new Map(pending);source=beginCognitiveSourceInstant(inputs.base,at);random.begin(at);protocolInstant=protocol.begin(at);},
  validateParticipants(events:readonly ScheduledEvent[]){
   if(!active||sealed)stageFail('participant check outside instant');
   const count=(name:string)=>events.filter(e=>key(e.eventTypeId)===key(atom(1001,'event/'+name))).length;
   if(chosen){if(count('task-identity-application')!==1||count('regulatory-adaptation')!==(cognitiveOperation?0:1)||events.length!==(cognitiveOperation?1:2)+count('task-deadline')||count('task-deadline')>component.tasks.length)stageFail('chosen stage requires exactly A + I and optional deadlines');}
   else if(count('task-identity-application')||count('regulatory-adaptation'))stageFail('unchosen source cannot enter A or I');
  },
  /** Called by the common phase-140 preparation barrier, before any participant prior. */
  preflightIdentity(event:ScheduledEvent,state:AuthoritativeState){
   if(!active||sealed||identitySealed||identityPlan||event.phase!==140n||event.dueAt!==instant||key(event.eventTypeId)!==key(atom(1001,'event/task-identity-application'))||!pending.has(eventKey(event)))fail('identity preflight association');
   if(model.formationEnabled){component.stateModel.validatePath(formationPath(component.tasks[0].character));component.stateModel.validatePath(phasePath(component.tasks[0].character));}
   if(model.eligibilityEnabled){const q=qualificationParts(event.payload);if(q.at.value!==instant||key(q.subject)!==key(component.tasks[0].character))fail('qualified identity subject/time');identityPlan={event:structuredClone(event),state};if(!q.accepted)return [];const jp=journalPath(component.identityKey),path={...jp,fieldId:1n};for(const p of [path,jp])component.stateModel.validatePath(p);identityPlan={event:structuredClone(event),state,path,subject:q.subject,contribution:q.numeric,journal:event.payload,journalPath:jp};return [path,jp];}
   const qualification=rec(event.payload,429n),result=rec(f(qualification,3n),430n);model.content.validateRecordRoles(enc(qualification));
   identityPlan={event:structuredClone(event),state};
   if(u(f(result,1n))===2n)return [];
   let C:CanonicalValue=qualification;for(const n of items(f(identityRequirement,1n),'list').map(u)){if(typeof C==='boolean'||C.kind!=='record')fail('identity application subject path');C=f(C,n);}
   const template=decodeStatePattern(f(identityRequirement,3n)),path:StatePath={rootStateTypeId:template.rootStateTypeId,fieldId:template.fieldId,selectors:[{kind:'mapKey',key:r(412,[C,f(identityRequirement,2n)])}]};
   component.stateModel.validatePath(path);if(!identityDomain.some(d=>patternMatches(d,path)))fail('identity application ReadDomain');
   const expression=rec(f(qualification,2n),426n),intent=rec(f(expression,2n),425n),resolution=rec(f(intent,2n),409n),at=f(resolution,2n);
   if(typeof at==='boolean'||at.kind!=='signed'||at.value!==instant)fail('identity decision instant mismatch');
   identityPlan={event:structuredClone(event),state,path,subject:C,contribution:r(413,[f(qualification,1n),f(resolution,1n),at,f(result,3n)])};return [structuredClone(path)];
  },
  sealIdentityPreflight(){if(!active||sealed||identitySealed||!identityPlan)stageFail('identity preflight not ready');identitySealed=true;},
  identityCandidate(event:ScheduledEvent,state:AuthoritativeState){
   const p=identityPlan;if(!active||sealed||!identitySealed||!p||p.state!==state||eventKey(event)!==eventKey(p.event)||!pending.delete(eventKey(event)))stageFail('identity candidate before sealed preflight');
   identityPlan=undefined;const reads:ActualReadRecord[]=[],patch:StatePatch={operations:[]};let quantizationOperations:CanonicalValue[]=[];
   if(p.path){const prior=component.stateModel.read(state,p.path);reads.push({accessorId:id(f(identityRequirement,4n)),path:p.path,presence:prior.presence,value:prior.value,derivedSources:[]});
    const history=prior.presence?items(f(rec(prior.value!,414n),1n),'list'):[],candidate=appendIdentityContribution(history,p.contribution!,component.identityK);
    (patch.operations as StatePatch['operations'][number][]).push({kind:'set',path:p.path,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:candidate.history});quantizationOperations=candidate.operations;
   }
   if(p.journalPath){const prior=component.stateModel.read(state,p.journalPath);reads.push({accessorId:id(f(identityRequirement,4n)),path:p.journalPath,presence:prior.presence,value:prior.value,derivedSources:[]});(patch.operations as StatePatch['operations'][number][]).push({kind:'set',path:p.journalPath,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:list([text(ELIGIBILITY),list([...identityJournal(prior.value),p.journal!])])});}
   return {patch,reads,domain:structuredClone(identityDomain),quantizationOperations,subject:p.subject,authority:id(f(rec(f(identityRegistration,6n),322n),2n)),targetPaths:p.path?[structuredClone(p.path),...(p.journalPath?[p.journalPath]:[])]:[],
    trace:(diffs:readonly StructuralMutationDiff[])=>model.eligibilityEnabled?identityTrace(event,list([]),[],[qualificationParts(event.payload).id],{domain:identityDomain,reads,quantizationOperations,patch,diffs}):cognitiveTraceRecord(model.modelIdentity.value,inputs.runIdentity.value,event,identityRegistration,list([]),[],{domain:identityDomain,reads,quantizationOperations,randomDrawRecords:[],patch,diffs})};
  },
  async execute(event:ScheduledEvent,state:AuthoritativeState,allocator:{allocateRuntimeId():bigint}){
   const i=index(event);if(!active||sealed||i<0||event.dueAt!==instant||event.phase!==BigInt(stages[i][2]))fail('cognitive event phase/lifecycle');
   if(i===0)source!.admit(event);else if(!pending.delete(eventKey(event)))fail('cognitive parent association');
   const ordinary=i===1||(i>=8&&i!==12);
   const registered=registration(stages[i][1]),wrapper=rec(registered,i===0?417n:ordinary?272n:i===2?418n:i===3?441n:i===4?442n:i===5?443n:i===6?444n:i===7?445n:446n);
   const base=i===0||ordinary?wrapper:rec(f(wrapper,1n),272n),domain=items(i===0?f(base,6n):f(rec(f(base,3n),271n),2n),'set').map(decodeStatePattern);
   const reads:ActualReadRecord[]=[],seen=new Set<string>();
   const read=(path:StatePath,accessor:CanonicalValue)=>{
    if(!domain.some(p=>patternMatches(p,path)))fail('cognitive read outside registered domain');
    const readKey=key(encPath(path));if(seen.has(readKey))fail('repeated cognitive read');seen.add(readKey);
    const result=component.stateModel.read(state,path);reads.push({accessorId:id(accessor),path,presence:result.presence,value:result.value,derivedSources:[]});return result;
   };
   const outputType=BigInt(stages[i][3]),role=model.content.recordRole(outputType,1n);if(!role)stageFail('missing cognitive output identity role');
   const namespace=u(f(rec(decodeCognitive(role),263n),1n));
   // One shared reservation. No nested or copied source allocates an identity.
   const occurrence=typedIdentifier(namespace,unsigned(allocator.allocateRuntimeId()));
   let sourceCompilation:CanonicalValue|undefined,sourceEvidenceReport:CanonicalValue|undefined;
   let valueTrace:(()=>CanonicalValue)|undefined;
   const receivingTrace=(input:CanonicalValue,output:CanonicalValue)=>{const t=rec(identityTrace(event,output,[],[],{input}),160n),described=!!model.reasonDescriptions&&i===5;return record(t.schema,new Map([...t.fields].map(([n,v])=>[n,n===5n?atom(1036,described?'seam/assembled-reason-sources':'seam/assembled-value-receiving'):n===6n?text(model.referenceReasons&&described?REASON_REFERENCE_VERSION:model.contextReasons&&described?CONTEXT_REASON_VERSION:model.valueProvenance?VALUE_PROVENANCE:described?(reasonEvidence?REASON_EVIDENCE_VERSION:REASON_SOURCES_VERSION):VALUE_RECEIVING):v])));};
   let affectConcern:ReturnType<NonNullable<typeof reappraisal>['concern']>|undefined,affectRaw:ReturnType<NonNullable<typeof reappraisal>['raw']>|undefined;
   let reappraisalCandidates:ReturnType<NonNullable<typeof reappraisal>['candidates']>|undefined;
   let reappraisalResult:ReturnType<NonNullable<typeof reappraisal>['appraise']>|undefined,reappraisalMotive:ReturnType<NonNullable<typeof reappraisal>['motive']>|undefined;
   let causalAppraisal:ReturnType<NonNullable<typeof causal>['appraise']>|undefined;
   let valueAppraisal:ReturnType<NonNullable<typeof values>['appraise']>|undefined;
   let formationResult:{report:CanonicalValue;trace:()=>CanonicalValue}|undefined;
   let embarrassmentAppraisal:ReturnType<NonNullable<typeof embarrassment>['appraise']>|undefined,embarrassmentRaw:ReturnType<NonNullable<typeof embarrassment>['raw']>|undefined;
   let relationshipResult:ReturnType<NonNullable<typeof relationship>['raw']>|undefined;
   let socialResult:ReturnType<NonNullable<typeof social>['appraise']>|undefined;
   let controlWorkspace:ReturnType<NonNullable<typeof control>['workspace']>|undefined,controlCandidates:ReturnType<NonNullable<typeof control>['candidates']>|undefined;
   let habitResult:ReturnType<NonNullable<typeof habit>['candidates']>|undefined;
   let meaningResult:ReturnType<NonNullable<typeof meaning>['appraise']>|undefined,spatialResult:ReturnType<NonNullable<typeof spatialMeaning>['appraise']>|undefined;
   let priorityResult:ReturnType<NonNullable<typeof priority>['motive']>|undefined;
   let strategyInput:CanonicalValue|undefined;
   let selfAppraisal:ReturnType<NonNullable<typeof self>['appraise']>|undefined,selfProjection:ReturnType<NonNullable<typeof self>['project']>|undefined;
   let extraOutputs:CanonicalValue[]=[],jointInput:CanonicalValue|undefined;
   let actionAppraisal:ReturnType<NonNullable<typeof actionMemory>['appraise']>|undefined,actionRaw:ReturnType<NonNullable<typeof actionMemory>['raw']>|undefined;
   let maintained:ReturnType<NonNullable<typeof workMaintenance>['workspace']>|undefined;
   let workspaceJoin:ReturnType<typeof sharedWorkspace>|undefined,retainedAttribution:CanonicalValue|undefined;
   let strategyPlan:ReturnType<NonNullable<typeof strategy>['evaluate']>|undefined;
   let output:CanonicalValue,quantizationOperations:CanonicalValue[]=[],randomDrawRecords:CanonicalValue[]=[];
   if(i===0){
    const cue=rec(event.payload,377n);model.content.validateRecordRoles(enc(cue));
    if(key(f(cue,2n))!==key(f(wrapper,5n)))fail('cognitive agenda mismatch');
    const q=rec(items(f(wrapper,9n),'set')[0],266n),observer=f(cue,u(f(q,1n))),template=decodeStatePattern(f(q,2n));
    const path:StatePath={rootStateTypeId:template.rootStateTypeId,fieldId:template.fieldId,selectors:[{kind:'mapKey',key:observer}]};
    const prior=read(path,f(q,5n));if(!prior.presence)throw new StateContractError('REQUIRED_PROJECTION_VALUE_ABSENT','cognitive subject roster absent');
    const C=f(rec(prior.value!,267n),u(f(q,3n)));model.content.validateRole(enc(C),enc(f(q,4n)));
    reads[reads.length-1]={accessorId:id(f(q,5n)),path,presence:true,value:C,derivedSources:[prior],transformationId:id(f(q,5n))};
    const tr=rec(items(f(wrapper,10n),'set')[0],416n),pr=rec(items(f(wrapper,11n),'set')[0],363n),pt=decodeStatePattern(f(pr,3n));
    const tasks=component.tasks.filter(t=>key(t.character)===key(C));
    output=(model.configurationEnabled?configurationWorkspaceOutput:workspaceOutput)(occurrence,C,f(cue,2n),taskWorkspaceDefinition(definition('task-workspace'),model.taskLimit,model.workspaceDomain?model.workspaceLimit:undefined),tasks,instant,{
     status(task){const t=tasks.find(v=>key(v.key)===key(task));if(!t)fail('unselected workspace task read');return read(t.path,f(tr,4n)).value;},
     prediction(){return read({rootStateTypeId:pt.rootStateTypeId,fieldId:pt.fieldId,selectors:[{kind:'mapKey',key:r(360,[C,f(pr,2n)])}]},f(pr,4n)).value;},
    },model.taskLimit).output;
    if(workMaintenance){maintained=workMaintenance.workspace(event,state,output,definition('task-workspace'));output=maintained.output;}
    if(strategy)strategyPlan=strategy.evaluate(event,maintained?.nextState??state,output);
    if(model.workspace){const capacity=Number(u(f(rec(definition('task-workspace'),378n),2n)));controlWorkspace=control?.workspace(event,maintained?.nextState??state,output,capacity,recallEvidence(),maintained?.neutral??0);workspaceJoin=controlWorkspace?.joined??sharedWorkspace(output,capacity,instant,recallEvidence(),maintained?.neutral??0,model.workspaceLimit);extraOutputs=[workspaceJoin.report,...(maintained?[maintained.report]:[]),...(controlWorkspace?[controlWorkspace.report]:[])];if(model.retainedAttribution){retainedAttribution=deriveRetainedAttribution(workspaceJoin.report,workspaceJoin.input,instant,()=>allocator.allocateRuntimeId());extraOutputs.push(retainedAttribution);if(model.significanceEnabled)activeAttribution=retainedAttribution;}if(model.memoryContext)activeWorkspace=structuredClone(workspaceJoin.report);}
   }else if(i===1){
    const w=rec(event.payload,381n),selected=items(f(w,4n),'list');
    const criteria=selected.map(v=>{const item=rec(v,379n),t=component.tasks.find(t=>key(t.key)===key(f(item,1n))&&key(t.specId)===key(f(item,2n)));if(!t)fail('unselected criterion');return {taskKey:t.key,specId:t.specId,minimum:readQ(t.minimum),maximum:readQ(t.maximum)};});
    output=appraisalOutput(occurrence,event.payload,criteria);embarrassmentAppraisal=embarrassment?.appraise(event,state);if(!model.sharedAffectSources)reappraisalResult=reappraisal?.appraise(event,state);causalAppraisal=causal?.appraise(event,state);selfAppraisal=self?.appraise(event,state);valueAppraisal=values?.appraise(event,state);if(model.valueReceiving){valueProjection=valueAppraisal!.report;if(model.valueProvenance)valueSupport=valueAppraisal!.support;}socialResult=social?.appraise(event,state,activeWorkspace);
    if(model.body){const evidence=bodyEvidence();if(evidence&&(evidence.settledEvent.phase!==(model.body.selectionCapacity===undefined?14n:20n)||evidence.settledEvent.dueAt!==instant))fail('joint appraisal requires current settled body evidence');if(model.memoryContext&&!activeWorkspace)fail('appraisal requires actual current workspace');joint=model.memoryContext?contextAppraisal(output,activeWorkspace!,instant,evidence,model.body.threshold,socialResult?.likelihoods):jointAppraisal(output,evidence?.sample,evidence?.experience,model.body.threshold,socialResult?.likelihoods);extraOutputs=[joint];jointInput=list([event.payload,...(model.memoryContext?[activeWorkspace!]:[]),evidence?.sample??list([]),evidence?.experience??list([]),...(model.body.selectionCapacity===undefined?[]:[evidence?.selection??list([])])]);}
    if(socialResult){joint=list([...items(joint!,'list'),socialResult.report]);extraOutputs=[joint,socialResult.report];jointInput=list([...items(jointInput!,'list'),socialResult.report]);}
    if(model.sharedAffectSources)reappraisalResult=reappraisal!.appraise(event,state,joint);
    if(meaning&&joint){meaningResult=meaning.appraise(event,state,activeWorkspace!,joint,activeAttribution);extraOutputs.push(meaningResult.report);if(significanceConsumer&&activeAttribution)significanceConsumer(event,activeWorkspace!,activeAttribution,meaningResult.report);}
    if(spatialMeaning&&joint){spatialResult=spatialMeaning.appraise(event,state,activeWorkspace!,joint);extraOutputs.push(spatialResult.report);if(actionMemory){actionAppraisal=actionMemory.appraise(event,activeWorkspace!,spatialResult.report);extraOutputs.push(actionAppraisal.report);}}
    if(bodyUseConsumer&&joint){const a=items(joint,'list'),context=items(a[5],'list'),consumed=[...(meaningResult?.consumed??[])];if(key(context[1])===key(text('RecalledContext'))&&items(a[4],'list').some(v=>items(v,'list').length===5))consumed.push(items(context[2],'list')[1]);const unique=[...new Map(consumed.map(v=>[key(items(v,'list')[1]),v])).values()];if(unique.length)bodyUseConsumer(event,unique,meaningResult?.consumed.length?meaningResult.report:joint);}
   }else if(i===2){if(model.body){if(!joint)fail('concern requires generated joint appraisal');output=jointConcern(occurrence,event.payload,joint!,definition('task-concern'));jointInput=list([event.payload,joint!]);}else output=concernOutput(occurrence,event.payload,definition('task-concern'));if(model.reappraisal?.threat){affectConcern=reappraisal!.concern(event,output);output=affectConcern.output;}}
   else if(i===3){if(priority){priorityResult=priority.motive(event,state,event.payload,occurrence);output=priorityResult.output;extraOutputs=[priorityResult.report];if(model.reasonDescriptions)priorityEvidence=priorityResult.report;}else output=motiveOutput(occurrence,event.payload,definition('task-motive'));if(reappraisal){reappraisalMotive=reappraisal.motive(event,state,output);output=reappraisalMotive.output;extraOutputs.push(reappraisalMotive.report);}if(model.valueReceiving){if(!valueProjection||valueMotivation)fail('Value motivation requires prior appraisal');valueMotivation=valueMotive(valueProjection!,model.values!,valueSupport);extraOutputs.push(valueMotivation);const projected=valueProjection,motivated=valueMotivation;valueTrace=()=>receivingTrace(list([event.payload,projected]),motivated);}}
   else if(i===4){
    if(strategy)strategyInput=strategy.projection();
    const req=rec(f(wrapper,3n),447n),template=decodeStatePattern(f(req,3n));
    let taskList:CanonicalValue=event.payload;for(const n of items(f(req,2n),'list').map(u)){if(typeof taskList==='boolean'||taskList.kind!=='record')fail('candidate task path');taskList=f(taskList,n);}
    const allowed=new Set(items(taskList,'list').map(v=>key(f(rec(v,379n),1n))));
    output=candidateOutput(occurrence,event.payload,f(rec(definition('task-candidates'),435n),1n)===true,task=>{
     if(!allowed.has(key(task)))fail('plan read for unselected task');
     if(strategy)return strategy.selection(task);
     const prior=read({rootStateTypeId:template.rootStateTypeId,fieldId:template.fieldId,selectors:[{kind:'mapKey',key:task}]},f(req,4n));if(!prior.presence)return undefined;
     const instructionId=f(rec(prior.value!,390n),1n),row=rows.find(v=>key(f(v,1n))===key(instructionId));if(!row)fail('unknown adopted instruction');return {instructionId,actionId:f(rec(f(row,4n),389n),1n)};
    });
    if(habit){habitResult=habit.candidates(event,state,output,strategyInput!);output=habitResult.output;extraOutputs.push(habitResult.report);}
    if(control){controlCandidates=control.candidates(event,output);output=controlCandidates.output;extraOutputs.push(controlCandidates.report);}
    if(reappraisal){reappraisalCandidates=reappraisal.candidates(event,output);output=reappraisalCandidates.output;}
   }else if(i===5){
    const req=rec(f(wrapper,3n),448n),template=decodeStatePattern(f(req,3n));let C=event.payload;
    for(const n of items(f(req,1n),'list').map(u)){if(typeof C==='boolean'||C.kind!=='record')fail('identity subject path');C=f(C,n);}
    const d=rec(definition('task-reason-source'),436n),result=rawSignalOutput(occurrence,event.payload,!model.formationEnabled&&f(d,1n)===true,readQ(f(d,2n)),()=>read({rootStateTypeId:template.rootStateTypeId,fieldId:template.fieldId,selectors:[{kind:'mapKey',key:r(412,[C,f(req,2n)])}]},f(req,4n)).value);
    output=result.output;quantizationOperations=result.quantizationOperations;
    if(model.formationEnabled){const path=formationPath(C),prior=component.stateModel.read(state,path),readRecord:ActualReadRecord={accessorId:atom(1028,'accessor/formation-reasons'),path,presence:prior.presence,value:prior.value,derivedSources:[]},raw=output,result=formationSignals(raw,prior.value,f(d,1n)===true);output=result.output;formationResult={report:result.report,trace:()=>formationTrace(event,list([result.output,result.report]),list([raw,prior.value??list([])]),[readRecord])};extraOutputs.push(result.report);}

    if(model.body){if(!joint)fail('raw signals require generated joint appraisal');output=jointSignalSupport(output,joint!);jointInput=list([event.payload,joint!]);}
    if(model.reappraisal?.threat){affectRaw=reappraisal!.raw(event,output);output=affectRaw.output;}
    if(relationship){relationshipResult=relationship.raw(event,state,output);output=relationshipResult.output;extraOutputs.push(relationshipResult.report);}
    if(embarrassment){embarrassmentRaw=embarrassment.raw(event,output);output=embarrassmentRaw.output;extraOutputs.push(embarrassmentRaw.report);}
    if(actionMemory){actionRaw=actionMemory.raw(event,output);output=actionRaw.output;extraOutputs.push(actionRaw.report);}
    if(model.valueReceiving){if(!valueMotivation)fail('Value raw requires generated motive');const original=output;output=valueRaw(output,valueMotivation!);if(model.reasonDescriptions)output=describedRaw(prioritySourceBasis(output,priorityEvidence,model.reappraisal?.task),model.reasonDescriptions);if(reasonEvidence){const joined=reasonEvidence.raw(event,output);output=joined.output;sourceEvidenceReport=joined.report;extraOutputs.push(joined.report);}const emitted=output,motivated=valueMotivation;valueTrace=()=>receivingTrace(list([original,motivated,...(model.reasonDescriptions?[priorityEvidence??list([])]:[]),...(sourceEvidenceReport?[sourceEvidenceReport]:[])]),emitted);}
   }else if(i===6){
    if(model.reasonDescriptions){const compiled=compileDescribedReasons(event.payload,definition('task-reason-dice'),model.taskLimit,model.sourceCoverage?'SourceCoverage':'Jaccard',model.contextReasons,model.standingRounding);output=r(408,[occurrence,event.payload,list(compiled.nuclei)]);sourceCompilation=compiled.report;extraOutputs.push(compiled.report);}
    else output=r(408,[occurrence,event.payload,list((model.valueReceiving?valueReasons(event.payload,definition('task-reason-dice'),3):model.habit?compileAssembledReasons(items(f(rec(event.payload,403n),3n),'set'),definition('task-reason-dice'),model.configurationEnabled?3:2):compileReasonNuclei(items(f(rec(event.payload,403n),3n),'set'),definition('task-reason-dice'))))]);
   }
   else if(i===7){
    output=await arbitrationOutput(occurrence,instant,event.payload,definition('task-arbitration'),random.forResolution(occurrence,event.payload),model.configurationEnabled?3:2);
    self?.decision(event,output);const result=rec(f(rec(output,409n),4n),419n);chosen=u(f(result,1n))===3n;if(chosen){const data=rec(f(result,2n),420n);randomDrawRecords=items(f(data,9n),'list').flatMap(v=>{const d=rec(v,422n);return [f(d,5n),...(d.schema.schemaVersion===3n?items(f(d,9n),'list'):[])];});const tie=rec(f(data,10n),423n);if(u(f(tie,1n))===2n)randomDrawRecords.push(f(tie,3n));}
   }else if(i===8)output=intentOutput(occurrence,event.payload);
   else if(i===9){output=expressionOutput(occurrence,event.payload);if(model.eligibilityEnabled){if(!contextEvent)fail('identity expression missing current context');extraOutputs.push(frozenIdentityExpression(output,contextEvent!.eventId,contextEvent!.payload));}}
   else if(i===10){const selected=f(rec(chosenData(f(rec(event.payload,425n),2n)),420n),1n),action=f(rec(selected,395n),2n),row=rows.find(v=>key(f(v,1n))===key(action));if(!row)fail('selected action missing');output=planOutput(occurrence,event.payload,f(row,4n));}
   else if(i===11)output=attemptOutput(occurrence,event.payload);
   else if(i===12){cognitiveOperation=reappraisal?.isAction(event.payload)??false;output=executionOutput(occurrence,event.payload,f(rec(definition('protocol-execution'),434n),1n)===true&&(reappraisal?.permitted(event.payload)??true));}
   else if(i===13){output=model.eligibilityEnabled?qualifyIdentity(occurrence,event.payload):qualificationOutput(occurrence,event.payload);selfProjection=self?.project(event,output);}
   else {const outcome=rec(event.payload,433n),attempt=rec(f(outcome,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n),C=f(rec(f(chosenData(f(intent,2n)),1n),395n),1n);
    output=r(307,[occurrence,r(305,[C,C,f(outcome,3n)]),{kind:'signed',value:instant},text('bounded-protocol-execution/0.1-candidate')]);}
   model.content.validateRecordRoles(enc(output));
   const noChoice=i===7&&u(f(rec(f(rec(output,409n),4n),419n),1n))!==3n;
   const destinations:readonly (readonly [string,number])[]=noChoice||i===14||i===12&&cognitiveOperation?[]:i===8?[['task-expression',90],['task-plan',100]]:i===9?[['task-qualification',130]]:i===12?[['protocol-actual-fact',110]]:i===13?[['task-identity-application',140]]:[[stages[i+1][0],stages[i+1][2]]];
   const priorityParents=i===2?priority?.parents()??[]:[];
   const emissions:EventEmission[]=destinations.map(([name,phase])=>({dueAt:event.dueAt,phase:BigInt(phase),eventTypeId:atom(1001,'event/'+name),payload:cloneCognitive(model.eligibilityEnabled&&i===9?extraOutputs[0]:output),dependencies:list([]),...(model.eligibilityEnabled&&i===8&&name==='task-expression'?{additionalCausalParentEventIds:[contextEvent!.eventId]}:i===0?{additionalCausalParentEventIds:control?[...(control.parents()),...(bodyEvidence()?[bodyEvidence()!.settledEvent.eventId]:[]),...(workspaceJoin?items(items(workspaceJoin.report,'list')[4],'list').map(v=>u(items(v,'list')[2])):[])]:bodyEvidence()?[bodyEvidence()!.settledEvent.eventId]:model.memoryContext&&workspaceJoin&&items(items(workspaceJoin.report,'list')[4],'list').length?[u(items(items(items(workspaceJoin.report,'list')[4],'list')[0],'list')[2])]:[]}:priorityParents.length?{additionalCausalParentEventIds:priorityParents}:{} )}));
   if(model.attachment&&relationship&&i===5)for(let j=0;j<emissions.length;j++)emissions[j]={...emissions[j],additionalCausalParentEventIds:[...(emissions[j].additionalCausalParentEventIds??[]),...relationship.parents()]};
   const protocolPlan=i===12&&!cognitiveOperation?protocolInstant!.source(event,output):undefined;
   if(reappraisal&&i===0)for(let j=0;j<emissions.length;j++)emissions[j]={...emissions[j],additionalCausalParentEventIds:[...(emissions[j].additionalCausalParentEventIds??[]),...reappraisal.parents()]};
   if(causal&&i===0)for(let j=0;j<emissions.length;j++)emissions[j]={...emissions[j],additionalCausalParentEventIds:[...(emissions[j].additionalCausalParentEventIds??[]),...causal.parents()]};
   if(values&&i===0)for(let j=0;j<emissions.length;j++)emissions[j]={...emissions[j],additionalCausalParentEventIds:[...(emissions[j].additionalCausalParentEventIds??[]),...values.parents()]};
    if(self&&i===0)for(let j=0;j<emissions.length;j++)emissions[j]={...emissions[j],additionalCausalParentEventIds:[...(emissions[j].additionalCausalParentEventIds??[]),...self.parents()]};
   const additional=protocolPlan?.emissions()??[];let bound=false;unbound++;
   const report=joint,projection=jointInput;
   return {output:cloneCognitive(output),nextState:controlWorkspace?.nextState??maintained?.nextState,controlTraces:(children:readonly ScheduledEvent[])=>[...(maintained?[maintained.trace()]:[]),...(affectConcern?[affectConcern.trace()]:[]),...(affectRaw?[affectRaw.trace()]:[]),...(actionAppraisal?[actionAppraisal.trace()]:[]),...(actionRaw?[actionRaw.trace()]:[]),...(embarrassmentAppraisal?[embarrassmentAppraisal.trace()]:[]),...(embarrassmentRaw?[embarrassmentRaw.trace()]:[]),...(spatialResult?[spatialResult.trace()]:[]),...(meaningResult?[meaningResult.trace()]:[]),...(reappraisalCandidates?[reappraisalCandidates.trace()]:[]),...(reappraisalResult?[reappraisalResult.trace()]:[]),...(reappraisalMotive?[reappraisalMotive.trace()]:[]),...(causalAppraisal?.map(a=>a.trace())??[]),...(valueTrace?[valueTrace()]:[]),...(valueAppraisal?[valueAppraisal.trace()]:[]),...(formationResult?[formationResult.trace()]:[]),...(selfAppraisal?[selfAppraisal.trace()]:[]),...(selfProjection?[selfProjection.trace()]:[]),...(relationshipResult?[relationshipResult.trace(children)]:[]),...(socialResult?[socialResult.trace(children)]:[]),...(controlWorkspace?[controlWorkspace.trace(children)]:[]),...(controlCandidates?[controlCandidates.trace(children)]:[])],strategyPlan,additionalOutputs:[...extraOutputs,...(embarrassmentAppraisal?[embarrassmentAppraisal.report]:[]),...(reappraisalResult?[reappraisalResult.report]:[]),...(causalAppraisal?.map(a=>a.report)??[]),...(valueAppraisal?[valueAppraisal.report]:[]),...(selfAppraisal?[selfAppraisal.report]:[]),...(selfProjection?.report?[selfProjection.report]:[]),...(strategyPlan?[strategyPlan.report]:[])],reads,domain,quantizationOperations,randomDrawRecords,
    trace(children:readonly ScheduledEvent[]){if(!bound)stageFail('cognitive trace before child binding');if(model.eligibilityEnabled&&(i===9||i===13))return identityTrace(event,i===9?list([output,...extraOutputs]):output,children,[i===9?f(rec(event.payload,425n),1n):f(rec(items(event.payload,'list')[1],426n),1n)],i===9?{input:list([event.payload,unsigned(contextEvent!.eventId),contextEvent!.payload])}:{});if(habitResult)return habitResult.trace(children);if(priorityResult)return priorityResult.trace(children);const original=rec(cognitiveTraceRecord(model.modelIdentity.value,inputs.runIdentity.value,event,registered,output,children,{domain,reads,quantizationOperations,randomDrawRecords}),160n);
     if(model.reasonDescriptions&&(i===5||i===6||model.contextReasons&&i===7))return record(original.schema,new Map([...original.fields].map(([n,v])=>[n,n===6n?text(model.standingRounding?STANDING_ROUNDING_VERSION:model.referenceReasons?REASON_REFERENCE_VERSION:model.contextReasons?CONTEXT_REASON_VERSION:i===6&&model.sourceCoverage?SOURCE_COVERAGE_VERSION:reasonEvidence?REASON_EVIDENCE_VERSION:REASON_SOURCES_VERSION):n===13n&&sourceCompilation?list([output,sourceCompilation]):v])));
     if(model.habit&&(i===6||i===7))return record(original.schema,new Map([...original.fields].map(([n,v])=>[n,n===6n?text('assembled-character-habit/0.1-candidate'):v])));
     if(workspaceJoin){const replacements=new Map<bigint,CanonicalValue>([[6n,text(model.retainedAttribution?ATTRIBUTION_VERSION:model.workspaceDomain?'assembled-character-workspace/0.6-candidate':model.affectMemory?'assembled-character-workspace/0.5-candidate':model.socialMemory?'assembled-character-workspace/0.4-candidate':model.control?'assembled-character-workspace/0.3-candidate':model.memoryContext?'assembled-character-workspace/0.2-candidate':'assembled-character-workspace/0.1-candidate')],[9n,list(workspaceJoin.sourceIds)],[12n,list([event.payload,workspaceJoin.input,...(controlWorkspace?[controlWorkspace.report]:[])])],[13n,list([output,workspaceJoin.report,...(retainedAttribution?[retainedAttribution]:[])])]]);return record(original.schema,new Map([...original.fields].map(([n,v])=>[n,replacements.get(n)??v])));}
     if(strategyInput)return record(original.schema,new Map([...original.fields].map(([n,v])=>[n,n===6n?text('assembled-character-strategy/0.1-candidate'):n===12n?list([event.payload,strategyInput!]):v])));
     if(!projection)return original;const safe=report?items(report,'list').slice(2,4):[],extraSources=safe.filter(v=>typeof v!=='boolean'&&v.kind==='record').map(v=>f(v as Extract<CanonicalValue,{kind:'record'}>,1n)),sources=new Map([...items(f(original,9n),'list'),...extraSources].map(v=>[key(v),v]));
     if(model.memoryContext&&report){const context=items(report,'list')[5],selected=items(items(context,'list')[2],'list');if(selected.length)sources.set(key(selected[0]),selected[0]);}
     if(model.social&&report){const social=items(items(report,'list')[6],'list'),people=model.social.multiple?social.slice(1).map(v=>items(v,'list')):[social];
      for(const person of people)for(const o of items(person[3],'list'))sources.set(key(items(o,'list')[0]),items(o,'list')[0]);}
     const replacements=new Map<bigint,CanonicalValue>([[6n,text(model.socialMemory?'assembled-character-social-joint/0.3-candidate':model.social?.multiple?'assembled-character-social-joint/0.2-candidate':model.social?'assembled-character-social-joint/0.1-candidate':model.memoryContext?'assembled-character-memory-context/0.1-candidate':model.body?.selectionCapacity===undefined?'assembled-character-interaction/0.1-candidate':'assembled-character-attention/0.1-candidate')],[9n,list([...sources.values()].sort((a,b)=>key(a)<key(b)?-1:1))],[12n,projection],[13n,extraOutputs.length?list([output,...extraOutputs]):output]]);return record(original.schema,new Map([...original.fields].map(([n,v])=>[n,replacements.get(n)??v])));},
    emissions:()=>structuredClone([...emissions,...additional]),
    bindAllocatedChildren(children:readonly ScheduledEvent[]){
     if(!active||sealed||bound||children.length!==emissions.length+additional.length)stageFail('cognitive child binding lifecycle');
     const ids=new Set<bigint>();for(const [j,child] of children.slice(0,emissions.length).entries()){const emission=emissions[j];
      if(ids.has(child.eventId)||child.eventId===event.eventId||child.eventSequence<=event.eventSequence||child.dueAt!==event.dueAt||child.phase!==emission.phase||key(child.eventTypeId)!==key(emission.eventTypeId)||key(child.payload)!==key(emission.payload)||key(child.dependencies)!==key(emission.dependencies)||key(list(child.causalParentEventIds.map(unsigned)))!==key(list([...new Set([event.eventId,...(emission.additionalCausalParentEventIds??[])])].sort((a,b)=>a<b?-1:1).map(unsigned)))||pending.has(eventKey(child)))fail('cognitive child differs from generated plan');ids.add(child.eventId);
     }
     protocolPlan?.bindAllocatedChildren(children.slice(emissions.length));
     for(const child of children.slice(0,emissions.length))pending.set(eventKey(child),structuredClone(child));bound=true;unbound--;
    }};
  },
  prepareCommit(){self?.prepareCommit();if(!active||sealed||unbound||contextPending.size||identityPlan||[...pending.values()].some(e=>e.dueAt<=instant))stageFail('unfinished cognitive instant');protocolInstant!.finish();random.prepareCommit();sealed=true;},
  commit(){if(!active||!sealed)stageFail('unprepared cognitive commit');random.commit();checkpoint=new Map(pending);},
  close(){priorityEvidence=undefined;actionMemory?.reset();embarrassment?.reset();self?.close();contextEvent=undefined;contextPending.clear();activeWorkspace=undefined;activeAttribution=undefined;joint=undefined;pending=checkpoint;source?.close();source=undefined;protocolInstant?.abort();protocolInstant=undefined;random.close();active=false;sealed=false;unbound=0;identityPlan=undefined;identitySealed=false;},
  committedRandomAddressKeys:()=>random.committedAddressKeys(),
  randomRelevantAuthoritativeIds(state:AuthoritativeState){
   if(active)stageFail('random-relevant projection requires quiescence');
   const ids=new Map<string,CanonicalValue>(),add=(v:CanonicalValue)=>{id(v);ids.set(key(v),v);};
   for(const entry of state.entries()){
    if(entry.path.rootStateTypeId===268n)add(f(rec(entry.value,267n),1n));
    if(entry.path.rootStateTypeId===373n&&[4n,5n,6n].includes(entry.path.fieldId)){const selector=entry.path.selectors[0];if(selector?.kind!=='mapKey')stageFail('control goal holder');add(selector.key);}
    if(entry.path.rootStateTypeId===373n&&![4n,5n,6n].includes(entry.path.fieldId)){const selector=entry.path.selectors[0];if(selector?.kind!=='mapKey')stageFail('task projection key');const task=rec(selector.key,371n);add(f(task,1n));add(f(task,2n));
     if(entry.path.fieldId===2n){const instruction=f(rec(entry.value,390n),1n),row=rows.find(v=>key(f(v,1n))===key(instruction));if(!row)stageFail('retained instruction definition missing');add(f(rec(f(row,4n),389n),1n));}
    }
    if(entry.path.rootStateTypeId===415n&&entry.path.fieldId===1n)for(const contribution of items(f(rec(entry.value,414n),1n),'list'))add(f(rec(contribution,413n),2n));
   }
   return set([...ids.values()]);
  },
 });
}

// Canonical local equality only; this is not an allocated identity or trace source.
function encPath(path:StatePath){return list([unsigned(path.rootStateTypeId),unsigned(path.fieldId),...path.selectors.map(s=>s.kind==='mapKey'?s.key:list([]))]);}
