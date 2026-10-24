/** task-cognitive-path/0.1-candidate trusted upstream execution adapter.
 * Live association checks precede all reads. Character transformers receive only
 * their restricted operands; this outer adapter owns state/registry access. */
import {canonicalEncode as enc,list,set,text,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateContractError,patternMatches,type StatePath,type ActualReadRecord,type StatePatch,type StructuralMutationDiff} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import type {StructuralIdentity} from '../substrate/identity';
import {beginCognitiveSourceInstant,type OrderedInputCompilation} from './orderedInputs';
import {decodeStatePattern} from './stateModel';
import {decodeCognitive,cognitiveRecord as r,cloneCognitive} from './cognitiveCodecs';
import {compileReasonNuclei,readQ,appendIdentityContribution} from './cognitiveMath';
import {arbitrationOutput,createCognitiveRandomSession} from './cognitiveArbitration';
import {intentOutput,expressionOutput,qualificationOutput,planOutput,attemptOutput,executionOutput,chosenData} from './cognitiveChoice';
import {compileProtocolBridge} from './protocolBridge';
import {cognitiveTraceRecord,protocolTraceRecord} from './cognitiveTrace';
import {workspaceOutput,appraisalOutput,concernOutput,motiveOutput,candidateOutput,rawSignalOutput} from './cognitiveTransforms';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as u,dataIdentity as id} from './canonicalData';
import type {compileCognitiveModel} from './cognitiveModel';
import type {compileCognitiveState} from './cognitiveState';

type Model=Awaited<ReturnType<typeof compileCognitiveModel>>;
type State=Awaited<ReturnType<typeof compileCognitiveState>>;
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

export function createCognitiveExecution(model:Model,component:State,inputs:OrderedInputCompilation & {readonly runIdentity:StructuralIdentity<'RunIdentity'>}){
 const rows=items(items(decodeCognitive(model.source.registry),'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n));
 const registration=(name:string)=>f(rows.find(v=>key(f(v,1n))===key(atom(1009,name)))!,4n);
 const definition=(name:string)=>cloneCognitive(component.definition(name));
 const seed=f(rec(inputs.runIdentity.value,104n),4n);if(typeof seed==='boolean'||seed.kind!=='bytes')fail('run seed required');
 const random=createCognitiveRandomSession(seed.value);
 const protocol=compileProtocolBridge(definition('protocol-observation'));let protocolInstant:ReturnType<typeof protocol.begin>|undefined;
 let pending=new Map<string,ScheduledEvent>(),checkpoint=new Map<string,ScheduledEvent>(),active=false,instant=0n,sealed=false,unbound=0,chosen=false;
 let source:ReturnType<typeof beginCognitiveSourceInstant>|undefined;
 let identityPlan:{event:ScheduledEvent;state:AuthoritativeState;path?:StatePath;subject?:CanonicalValue;contribution?:CanonicalValue}|undefined,identitySealed=false;
 const identityRegistration=rec(registration('TaskIdentityApplicationTransition'),450n),identityRequirement=rec(f(identityRegistration,8n),448n),identityDomain=items(f(identityRegistration,4n),'set').map(decodeStatePattern);
 const index=(event:ScheduledEvent)=>stages.findIndex(s=>key(event.eventTypeId)===key(atom(1001,'event/'+s[0])));
 return Object.freeze({
  isEvent:(event:ScheduledEvent)=>index(event)>=0,
  eventTypes:()=>stages.map(s=>atom(1001,'event/'+s[0])),
  protocolEventTypes:()=>protocol.eventTypes(),
  identityEventType:()=>atom(1001,'event/task-identity-application'),
  executeProtocol(event:ScheduledEvent,allocator:{allocateRuntimeId():bigint}){if(!active||sealed||!protocolInstant)stageFail('protocol outside live cognitive instant');const result=protocolInstant.execute(event,allocator);return {...result,trace:(children:readonly ScheduledEvent[])=>protocolTraceRecord(model.modelIdentity.value,inputs.runIdentity.value,event,result.outputs,children)};},
  begin(at:bigint){if(active)stageFail('cognitive instant already active');active=true;sealed=false;unbound=0;chosen=false;identityPlan=undefined;identitySealed=false;instant=at;checkpoint=new Map(pending);source=beginCognitiveSourceInstant(inputs,at);random.begin();protocolInstant=protocol.begin(at);},
  validateParticipants(events:readonly ScheduledEvent[]){
   if(!active||sealed)stageFail('participant check outside instant');
   const count=(name:string)=>events.filter(e=>key(e.eventTypeId)===key(atom(1001,'event/'+name))).length;
   if(chosen){if(count('task-identity-application')!==1||count('regulatory-adaptation')!==1||events.length!==2+count('task-deadline')||count('task-deadline')>2)stageFail('chosen stage requires exactly A + I and optional deadlines');}
   else if(count('task-identity-application')||count('regulatory-adaptation'))stageFail('unchosen source cannot enter A or I');
  },
  /** Called by the common phase-140 preparation barrier, before any participant prior. */
  preflightIdentity(event:ScheduledEvent,state:AuthoritativeState){
   if(!active||sealed||identitySealed||identityPlan||event.phase!==140n||event.dueAt!==instant||key(event.eventTypeId)!==key(atom(1001,'event/task-identity-application'))||!pending.has(eventKey(event)))fail('identity preflight association');
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
   return {patch,reads,domain:structuredClone(identityDomain),quantizationOperations,subject:p.subject,authority:id(f(rec(f(identityRegistration,6n),322n),2n)),targetPaths:p.path?[structuredClone(p.path)]:[],
    trace:(diffs:readonly StructuralMutationDiff[])=>cognitiveTraceRecord(model.modelIdentity.value,inputs.runIdentity.value,event,identityRegistration,list([]),[],{domain:identityDomain,reads,quantizationOperations,randomDrawRecords:[],patch,diffs})};
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
    output=workspaceOutput(occurrence,C,f(cue,2n),definition('task-workspace'),tasks,instant,{
     status(task){const t=tasks.find(v=>key(v.key)===key(task));if(!t)fail('unselected workspace task read');return read(t.path,f(tr,4n)).value;},
     prediction(){return read({rootStateTypeId:pt.rootStateTypeId,fieldId:pt.fieldId,selectors:[{kind:'mapKey',key:r(360,[C,f(pr,2n)])}]},f(pr,4n)).value;},
    }).output;
   }else if(i===1){
    const w=rec(event.payload,381n),selected=items(f(w,4n),'list');
    const criteria=selected.map(v=>{const item=rec(v,379n),t=component.tasks.find(t=>key(t.key)===key(f(item,1n))&&key(t.specId)===key(f(item,2n)));if(!t)fail('unselected criterion');return {taskKey:t.key,specId:t.specId,minimum:readQ(t.minimum),maximum:readQ(t.maximum)};});
    output=appraisalOutput(occurrence,event.payload,criteria);
   }else if(i===2)output=concernOutput(occurrence,event.payload,definition('task-concern'));
   else if(i===3)output=motiveOutput(occurrence,event.payload,definition('task-motive'));
   else if(i===4){
    const req=rec(f(wrapper,3n),447n),template=decodeStatePattern(f(req,3n));
    let taskList:CanonicalValue=event.payload;for(const n of items(f(req,2n),'list').map(u)){if(typeof taskList==='boolean'||taskList.kind!=='record')fail('candidate task path');taskList=f(taskList,n);}
    const allowed=new Set(items(taskList,'list').map(v=>key(f(rec(v,379n),1n))));
    output=candidateOutput(occurrence,event.payload,f(rec(definition('task-candidates'),435n),1n)===true,task=>{
     if(!allowed.has(key(task)))fail('plan read for unselected task');
     const prior=read({rootStateTypeId:template.rootStateTypeId,fieldId:template.fieldId,selectors:[{kind:'mapKey',key:task}]},f(req,4n));if(!prior.presence)return undefined;
     const instructionId=f(rec(prior.value!,390n),1n),row=rows.find(v=>key(f(v,1n))===key(instructionId));if(!row)fail('unknown adopted instruction');return {instructionId,actionId:f(rec(f(row,4n),389n),1n)};
    });
   }else if(i===5){
    const req=rec(f(wrapper,3n),448n),template=decodeStatePattern(f(req,3n));let C=event.payload;
    for(const n of items(f(req,1n),'list').map(u)){if(typeof C==='boolean'||C.kind!=='record')fail('identity subject path');C=f(C,n);}
    const d=rec(definition('task-reason-source'),436n),result=rawSignalOutput(occurrence,event.payload,f(d,1n)===true,readQ(f(d,2n)),()=>read({rootStateTypeId:template.rootStateTypeId,fieldId:template.fieldId,selectors:[{kind:'mapKey',key:r(412,[C,f(req,2n)])}]},f(req,4n)).value);
    output=result.output;quantizationOperations=result.quantizationOperations;
   }else if(i===6)output=r(408,[occurrence,event.payload,list(compileReasonNuclei(items(f(rec(event.payload,403n),3n),'set'),definition('task-reason-dice')))]);
   else if(i===7){
    output=await arbitrationOutput(occurrence,instant,event.payload,definition('task-arbitration'),random.forResolution(occurrence,event.payload));
    const result=rec(f(rec(output,409n),4n),419n);chosen=u(f(result,1n))===3n;if(chosen){const data=rec(f(result,2n),420n);randomDrawRecords=items(f(data,9n),'list').map(v=>f(rec(v,422n),5n));const tie=rec(f(data,10n),423n);if(u(f(tie,1n))===2n)randomDrawRecords.push(f(tie,3n));}
   }else if(i===8)output=intentOutput(occurrence,event.payload);
   else if(i===9)output=expressionOutput(occurrence,event.payload);
   else if(i===10){const selected=f(rec(chosenData(f(rec(event.payload,425n),2n)),420n),1n),action=f(rec(selected,395n),2n),row=rows.find(v=>key(f(v,1n))===key(action));if(!row)fail('selected action missing');output=planOutput(occurrence,event.payload,f(row,4n));}
   else if(i===11)output=attemptOutput(occurrence,event.payload);
   else if(i===12)output=executionOutput(occurrence,event.payload,f(rec(definition('protocol-execution'),434n),1n)===true);
   else if(i===13)output=qualificationOutput(occurrence,event.payload);
   else {const outcome=rec(event.payload,433n),attempt=rec(f(outcome,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n),C=f(rec(f(chosenData(f(intent,2n)),1n),395n),1n);
    output=r(307,[occurrence,r(305,[C,C,f(outcome,3n)]),{kind:'signed',value:instant},text('bounded-protocol-execution/0.1-candidate')]);}
   model.content.validateRecordRoles(enc(output));
   const noChoice=i===7&&u(f(rec(f(rec(output,409n),4n),419n),1n))!==3n;
   const destinations:readonly (readonly [string,number])[]=noChoice||i===14?[]:i===8?[['task-expression',90],['task-plan',100]]:i===9?[['task-qualification',130]]:i===12?[['protocol-actual-fact',110]]:i===13?[['task-identity-application',140]]:[[stages[i+1][0],stages[i+1][2]]];
   const emissions:EventEmission[]=destinations.map(([name,phase])=>({dueAt:event.dueAt,phase:BigInt(phase),eventTypeId:atom(1001,'event/'+name),payload:cloneCognitive(output),dependencies:list([])}));
   const protocolPlan=i===12?protocolInstant!.source(event,output):undefined;
   const additional=protocolPlan?.emissions()??[];let bound=false;unbound++;
   return {output:cloneCognitive(output),reads,domain,quantizationOperations,randomDrawRecords,
    trace(children:readonly ScheduledEvent[]){if(!bound)stageFail('cognitive trace before child binding');return cognitiveTraceRecord(model.modelIdentity.value,inputs.runIdentity.value,event,registered,output,children,{domain,reads,quantizationOperations,randomDrawRecords});},
    emissions:()=>structuredClone([...emissions,...additional]),
    bindAllocatedChildren(children:readonly ScheduledEvent[]){
     if(!active||sealed||bound||children.length!==emissions.length+additional.length)stageFail('cognitive child binding lifecycle');
     const ids=new Set<bigint>();for(const [j,child] of children.slice(0,emissions.length).entries()){const emission=emissions[j];
      if(ids.has(child.eventId)||child.eventId===event.eventId||child.eventSequence<=event.eventSequence||child.dueAt!==event.dueAt||child.phase!==emission.phase||key(child.eventTypeId)!==key(emission.eventTypeId)||key(child.payload)!==key(emission.payload)||key(child.dependencies)!==key(emission.dependencies)||child.causalParentEventIds.length!==1||child.causalParentEventIds[0]!==event.eventId||pending.has(eventKey(child)))fail('cognitive child differs from generated plan');ids.add(child.eventId);
     }
     protocolPlan?.bindAllocatedChildren(children.slice(emissions.length));
     for(const child of children.slice(0,emissions.length))pending.set(eventKey(child),structuredClone(child));bound=true;unbound--;
    }};
  },
  prepareCommit(){if(!active||sealed||unbound||identityPlan||[...pending.values()].some(e=>e.dueAt<=instant))stageFail('unfinished cognitive instant');protocolInstant!.finish();random.prepareCommit();sealed=true;},
  commit(){if(!active||!sealed)stageFail('unprepared cognitive commit');random.commit();checkpoint=new Map(pending);},
  close(){pending=checkpoint;source?.close();source=undefined;protocolInstant?.abort();protocolInstant=undefined;random.close();active=false;sealed=false;unbound=0;identityPlan=undefined;identitySealed=false;},
  committedRandomAddressKeys:()=>random.committedAddressKeys(),
  randomRelevantAuthoritativeIds(state:AuthoritativeState){
   if(active)stageFail('random-relevant projection requires quiescence');
   const ids=new Map<string,CanonicalValue>(),add=(v:CanonicalValue)=>{id(v);ids.set(key(v),v);};
   for(const entry of state.entries()){
    if(entry.path.rootStateTypeId===268n)add(f(rec(entry.value,267n),1n));
    if(entry.path.rootStateTypeId===373n){const selector=entry.path.selectors[0];if(selector?.kind!=='mapKey')stageFail('task projection key');const task=rec(selector.key,371n);add(f(task,1n));add(f(task,2n));
     if(entry.path.fieldId===2n){const instruction=f(rec(entry.value,390n),1n),row=rows.find(v=>key(f(v,1n))===key(instruction));if(!row)stageFail('retained instruction definition missing');add(f(rec(f(row,4n),389n),1n));}
    }
    if(entry.path.rootStateTypeId===415n)for(const contribution of items(f(rec(entry.value,414n),1n),'list'))add(f(rec(contribution,413n),2n));
   }
   return set([...ids.values()]);
  },
 });
}

// Canonical local equality only; this is not an allocated identity or trace source.
function encPath(path:StatePath){return list([unsigned(path.rootStateTypeId),unsigned(path.fieldId),...path.selectors.map(s=>s.kind==='mapKey'?s.key:list([]))]);}
