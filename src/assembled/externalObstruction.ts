import {SK,stakeholderReportSlots,stakeholderEvents,createStakeholderKnowledge} from './stakeholderKnowledge';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
import type {TimeLimit} from './timeDomain';
import {STAKEHOLDER,STAKEHOLDER_VERSION,STAKEHOLDER_EVIDENCE,createExecutionStakeholder} from './executionStakeholder';
import type {SocialWitness} from './socialWitness';
/** World-only obstruction in the existing character execution path. */
import {list,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataKey as key,dataText as txt,invalidModel,dataIdentity as id} from '../campaign2/canonicalData';
import {traceRecordValue} from '../substrate/trace';
import {scheduledEventValue} from '../substrate/persistence';
import {SchedulerContractError,type ScheduledEvent,type EventHandlerContext} from '../substrate/scheduler';
import type {AuthoritativeState} from '../substrate/state';
import {bodyId} from './bodyIdentifiers';
import {PERFORMANCE_OBSERVE} from './performance';
import {ACTION_BODY_EVENT,type selectedBodyEffect} from './actionBody';
export const OBSTRUCTION='external-obstruction/0.1',OBSTRUCTION_VERSION='external-obstruction/0.1-candidate';
export const OBSTRUCTION_SOURCE=bodyId(1001,'event/external-obstruction-source');
export const OBSTRUCTION_WITNESS='external-obstruction-witness/0.1';
export const OBSTRUCTION_RESULT='external-obstruction-result/0.1';
export const OPPORTUNITY='execution-opportunity/0.1',OPPORTUNITY_VERSION='execution-opportunity/0.1-candidate';
export const OPPORTUNITY_SOURCE=bodyId(1001,'event/execution-opportunity-source');
export const OPPORTUNITY_RESULT='execution-opportunity-result/0.1';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
export function obstructionSource(v:CanonicalValue,C:CanonicalValue,people:readonly CanonicalValue[],tasks?:readonly CanonicalValue[],stakeholders=false,knowledge=false){
 const a=items(v,'list');if(knowledge&&txt(a[0])!==SK)invalidModel('stakeholder knowledge source version');const causal=txt(a[0])===SK,passive=causal||txt(a[0])===STAKEHOLDER,witness=passive||txt(a[0])===OBSTRUCTION_WITNESS;if((passive?!stakeholders||tasks===undefined||a.length!==(causal?8:6)||causal&&!knowledge:witness?tasks===undefined||a.length!==4:a.length!==3||txt(a[0])!==OBSTRUCTION)||!eq(a[1],C))invalidModel('external obstruction holder/grammar');
 const blockers=items(a[2],'list');if(blockers.length>1||blockers.some(p=>eq(p,C)||!people.some(person=>eq(p,person))))invalidModel('external obstruction declared participant');
 const seen=witness?items(a[3],'list'):[];if(seen.length>1||seen.some(t=>!tasks!.some(x=>eq(x,t))))invalidModel('external obstruction witness task');
 const access=passive?items(a[5],'list'):[];if(passive&&(!tasks!.some(t=>eq(t,a[4]))||access.length!==2||access.some(x=>typeof x!=='boolean')))invalidModel('external obstruction stakeholder task/access');
 const causes=causal?items(a[6],'list'):[];if(causal){if(causes.length!==2||causes.some(x=>typeof x!=='boolean'))invalidModel('stakeholder cause access');stakeholderReportSlots(a[7]);}
 return {blocker:blockers[0],witnessTask:seen[0],stakeholderTask:passive?a[4]:undefined,access:access as boolean[],causes:causes as boolean[],reports:causal?a[7]:undefined};
}
export function opportunitySource(v:CanonicalValue,C:CanonicalValue,actions:readonly CanonicalValue[]){
 const a=items(v,'list');if(a.length!==3||txt(a[0])!==OPPORTUNITY||!eq(a[1],C))invalidModel('execution opportunity holder/grammar');
 const rows=items(a[2],'set'),seen=new Set<string>();
 if(!actions.length||actions.length>3||rows.length!==actions.length)invalidModel('execution opportunity complete action coverage');
 const result=rows.map(v=>{const r=items(v,'list');if(r.length!==2||typeof r[1]!=='boolean'||!actions.some(x=>eq(x,r[0]))||seen.has(key(r[0])))invalidModel('execution opportunity declared action/availability');seen.add(key(r[0]));return {action:r[0],available:r[1] as boolean};});
 return result;
}
export function createExternalObstruction(C:CanonicalValue,people:readonly CanonicalValue[],originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue,tasks?:readonly CanonicalValue[],actions?:readonly CanonicalValue[],observers?:SocialWitness,knowledge?:{stateModel:ReturnType<typeof compileCampaign2StateModel>;timeLimit:TimeLimit}){
 const learned=knowledge?createStakeholderKnowledge(C,observers!,model,run,knowledge.stateModel,knowledge.timeLimit):undefined;
 const stakeholders=learned??(observers?createExecutionStakeholder(C,observers,model,run):undefined);
 let active=false,at=0n,current:ScheduledEvent|undefined,opportunity:ScheduledEvent|undefined,effectAction:CanonicalValue|undefined;
 const used=new Set<bigint>(),assessed=new Set<bigint>();
 const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','external obstruction: '+s);};
 return Object.freeze({
  isLearning:(e:ScheduledEvent)=>!!learned?.isLearning(e),prepare:(events:readonly ScheduledEvent[],state:AuthoritativeState)=>learned!.prepare(events,state),
  contractVersion:knowledge?SK+'-candidate':observers?STAKEHOLDER_VERSION:actions?OPPORTUNITY_VERSION:OBSTRUCTION_VERSION,
  begin(instant:bigint){if(active)fail('already active');active=true;at=instant;stakeholders?.begin(instant);current=undefined;opportunity=undefined;effectAction=undefined;used.clear();assessed.clear();},
  close(){stakeholders?.close();active=false;current=undefined;opportunity=undefined;effectAction=undefined;used.clear();assessed.clear();},
  prepareCommit(){stakeholders?.prepareCommit();if(!active||originals.some(e=>e.dueAt===at&&!used.has(e.eventId)))fail('unconsumed source');},
  execute(context:EventHandlerContext<AuthoritativeState>){
   const e=context.event;if(learned&&stakeholderEvents.some(t=>eq(t,e.eventTypeId)))return learned.execute(context);if(eq(e.eventTypeId,STAKEHOLDER_EVIDENCE)){if(!stakeholders)fail('stakeholder version');return stakeholders!.execute(context);}const isOpportunity=eq(e.eventTypeId,OPPORTUNITY_SOURCE);
   if(!active||e.dueAt!==at||e.phase!==(isOpportunity?100n:30n)||!(isOpportunity?actions: eq(e.eventTypeId,OBSTRUCTION_SOURCE))||(isOpportunity?opportunity:current)||used.has(e.eventId)||!originals.some(x=>fp(x)===fp(e)))fail('unbound source');
   if(isOpportunity){opportunitySource(e.payload,C,actions!);opportunity=structuredClone(e);}else{obstructionSource(e.payload,C,people,tasks,!!observers,!!knowledge);current=structuredClone(e);}used.add(e.eventId);
   if(learned&&!isOpportunity){const source=obstructionSource(e.payload,C,people,tasks,true,true);if(source.reports)return learned.source(context,source.reports);}
   return {nextState:context.state,outputs:[],emittedEvents:[],traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){
    if(children.length)fail('source children');
    return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event:e,seamId:bodyId(1036,'seam/external-obstruction'),seamVersion:isOpportunity?OPPORTUNITY_VERSION:txt(items(e.payload,'list')[0])===STAKEHOLDER?STAKEHOLDER_VERSION:items(e.payload,'list')[0]&&txt(items(e.payload,'list')[0])===OBSTRUCTION_WITNESS?'obstruction-witness/0.1-candidate':OBSTRUCTION_VERSION,recordKind:e.eventTypeId,subjectIds:[id(C)],sourceRecordIds:[],registeredReadDomain:[],actualReadRecords:[],inputProjection:e.payload,outputProjection:list([]),randomDrawRecords:[],quantizationOperations:[],statePatch:{operations:[]},structuralMutationDiffs:[],emittedEvents:[],invariantResults:[]})];
   }};
  },
  observeStakeholders(e:ScheduledEvent){
   if(!stakeholders||!current)return undefined;
   if(!active||e.dueAt!==at||e.phase!==120n||!eq(e.eventTypeId,PERFORMANCE_OBSERVE)||!effectAction||!eq(items(e.payload,'list')[0],effectAction))fail('stakeholder lifecycle');
   const source=obstructionSource(current.payload,C,people,tasks,true,!!knowledge);
   return source.stakeholderTask?learned&&source.reports?learned.observe(e,source.stakeholderTask!,source.access,source.causes,source.blocker):stakeholders.observe(e,source.stakeholderTask!,source.access):undefined;
  },
  witness(e:ScheduledEvent){
   if(!tasks||!active||e.dueAt!==at||e.phase!==120n||!eq(e.eventTypeId,PERFORMANCE_OBSERVE)||!effectAction||!eq(items(e.payload,'list')[0],effectAction))fail('witness lifecycle');
   if(!current)return undefined;const s=obstructionSource(current.payload,C,people,tasks,!!observers,!!knowledge);
   return s.blocker&&s.witnessTask?{task:s.witnessTask,blocker:s.blocker}:undefined;
  },
  assess(e:ScheduledEvent,effect:ReturnType<typeof selectedBodyEffect>){
   if(!active||e.dueAt!==at||e.phase!==110n||!eq(e.eventTypeId,ACTION_BODY_EVENT)||assessed.has(e.eventId))fail('effect lifecycle');
   assessed.add(e.eventId);effectAction=effect.action;if(!current&&!opportunity)return undefined;
   const blocker=current?obstructionSource(current.payload,C,people,tasks,!!observers,!!knowledge).blocker:undefined;
   const available=opportunity?opportunitySource(opportunity.payload,C,actions!).find(r=>eq(r.action,effect.action))?.available:true;
   if(available===undefined)fail('selected action absent');
   return {blocked:!!blocker,unavailable:!available,
    report:current?list([text(OBSTRUCTION_RESULT),u(current.eventId),effect.outcomeId,effect.attemptId,effect.action,list(blocker?[blocker]:[]),!!blocker]):undefined,
    opportunityReport:opportunity?list([text(OPPORTUNITY_RESULT),u(opportunity.eventId),effect.outcomeId,effect.attemptId,effect.action,available!]):undefined};
  }
 });
}
