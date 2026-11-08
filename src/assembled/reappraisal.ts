import {mitigationEstimates,validateMitigationPacket} from './mitigation';
import {JOINT_APPRAISAL} from './appraisal';
/** assembled-character-reappraisal/0.1: prior evidence, chosen operation, later frame. */
import type {CompletedAffect} from './affectMemory';
import {list,set,map,record as canonicalRecord,text,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {type AuthoritativeState,type StatePath,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission,type EventHandlerContext} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataField as f,dataItems as items,dataKey as key,dataText as txt,dataUnsigned as uint,invalidModel} from '../campaign2/canonicalData';
import {readQ,qValue,ZERO,ONE} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {compareAffectFactors} from '../campaign3/affectFactorComparison';
import {receivingRecord as rec,cognitiveRecord as record} from './codecs';
import {sid,pattern} from './skill';
import {KNOWLEDGE_OWNER,type Strategy} from './strategy';
import {importancePath,importanceValue,unit} from './priority';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const RESERVE_AFFECT_VERSION='assembled-character-reappraisal/0.6-candidate';
export const OBSERVED_THREAT_VERSION='assembled-character-reappraisal/0.5-candidate';
export const GROUNDED_AFFECT_VERSION='assembled-character-reappraisal/0.4-candidate';
export const MITIGATION_VERSION='assembled-character-reappraisal/0.3-candidate',MITIGATION_OBS='assembled-reappraisal/0.3/observation';
export const SHARED_AFFECT_VERSION='assembled-character-reappraisal/0.2-candidate',SHARED_AFFECT_APPRAISAL='assembled-reappraisal/0.2/appraisal',SHARED_AFFECT_OBS='assembled-reappraisal/0.2/observation';
export const REAPPRAISAL='assembled-reappraisal/0.1',REAPPRAISAL_VERSION='assembled-character-reappraisal/0.1-candidate';
export const REAPPRAISAL_OBS=REAPPRAISAL+'/observation',REAPPRAISAL_FRAME=REAPPRAISAL+'/frame',REAPPRAISAL_APPRAISAL=REAPPRAISAL+'/appraisal',REAPPRAISAL_MOTIVE=REAPPRAISAL+'/motive';
export const REAPPRAISAL_SOURCE=sid(1001,'event/assembled-reappraisal-source'),REAPPRAISAL_OBSERVE=sid(1001,'event/assembled-reappraisal-observe'),REAPPRAISAL_LEARN=sid(1001,'event/assembled-reappraisal-learn'),REAPPRAISAL_APPLY=sid(1001,'event/assembled-reappraisal-apply');
export const FRAME_OWNER=sid(1025,'authority/interpretive-frame');
export const reappraisalPath=(C:CanonicalValue):StatePath=>({rootStateTypeId:1000n,fieldId:8n,selectors:[{kind:'mapKey',key:C}]}),framePath=(C:CanonicalValue):StatePath=>({...reappraisalPath(C),rootStateTypeId:1031n,fieldId:1n});
const require=(b:boolean,s:string)=>{if(!b)invalidModel('reappraisal '+s);};
// The selected observation is the only body operand; capacity is governed metadata.
export function observedReserveFraction(sample:CanonicalValue|undefined,capacity:Q){
 require(capacity.compare(ZERO)>0,'positive reserve capacity');
 if(sample===undefined||typeof sample==='boolean'||sample.kind!=='record'||sample.schema.typeId!==461n)return undefined;
 const interval=rec(f(rec(sample,461n),5n),462n),lower=readQ(f(interval,1n)),upper=readQ(f(interval,2n));
 require(lower.compare(ZERO)>=0&&lower.compare(upper)<=0&&upper.compare(capacity)<=0,'observed reserve interval');
 return upper.divide(capacity);
}
export function compileReappraisal(v:CanonicalValue,routes:Strategy,sharedSources=false,mitigationEnabled=false,grounded=false,observedThreat=false,reserveCapacity?:Q){
 const a=items(v,'list');require(a.length===(grounded?6:4)&&txt(a[0])===REAPPRAISAL&&['BenefitRelative','KnowledgeOnly','NoReappraisal'].includes(txt(a[3])),'declaration');
 require(routes.some(r=>key(r.task)===key(a[1])&&r.plans.some(p=>key(p.actionId)===key(a[2]))),'task/action reference');
 const threat=grounded?{task:a[4],severity:unit(a[5])}:undefined;
 if(threat){const route=routes.find(r=>key(r.task)===key(threat.task));require(!!route&&key(threat.task)!==key(a[1])&&route.plans.every(p=>key(p.actionId)!==key(a[2])),'distinct threat task/action reference');}
 return {task:a[1],action:a[2],law:txt(a[3]),sharedSources,mitigationEnabled,threat,observedThreat,reserveCapacity};
}
export type Reappraisal=ReturnType<typeof compileReappraisal>;
export function reappraisalSource(v:CanonicalValue,sharedSources=false){const a=items(v,'list');require(a.length===(sharedSources?10:9)&&txt(a[0])===REAPPRAISAL&&uint(a[1])<=2n&&uint(a[5])<=2n&&[2,3,4,6,7,8].every(i=>typeof a[i]==='boolean'),'source grammar');const mitigation=sharedSources?items(a[9],'list'):[unsigned(0),false];require(mitigation.length===2&&uint(mitigation[0])<=2n&&typeof mitigation[1]==='boolean','mitigation catalogue');return {condition:uint(a[1]),physical:a[2],display:a[3]===true,observed:a[4]===true,catalogue:uint(a[5]),catalogueObserved:a[6]===true,opportunity:a[7]===true,complete:a[8]===true,mitigation:mitigation[1]?uint(mitigation[0]):0n};}
export function reappraisalKnowledge(v:CanonicalValue|undefined,C:CanonicalValue,sharedSources=false,mitigationEnabled=false,observedThreat=false){
 const rows=v===undefined?[]:items(v,'list');require(rows.length<=16,'knowledge capacity');let last=0n,catalogue=0n,mitigation=0n;const seen=new Set<string>();const samples:[boolean[],boolean[]]=[[],[]];
 for(const row of rows){const a=items(row,'list');require(a.length===(mitigationEnabled?9:sharedSources?8:7)&&txt(a[0])===(mitigationEnabled?MITIGATION_OBS:sharedSources?SHARED_AFFECT_OBS:REAPPRAISAL_OBS)&&key(a[2])===key(C),'observation holder');const occ=a[1];require(typeof occ!=='boolean'&&occ.kind==='typedIdentifier'&&occ.namespaceId===1164n&&typeof occ.payload!=='boolean'&&occ.payload.kind==='unsigned'&&!seen.has(key(occ)),'observation identity');seen.add(key(occ));const at=uint(a[3]),condition=uint(a[4]),payload=items(a[5],'list'),cat=uint(a[6]),mit=sharedSources?uint(a[7]):0n;require(at>last&&at<=100n&&condition<=2n&&cat<=2n&&mit<=2n&&payload.length<=1&&payload.every(p=>typeof p==='boolean')&&(condition!==0n||payload.length===0)&&(payload.length>0||cat>0n||mit>0n||mitigationEnabled&&items(a[8],'list').length>0),'safe observation');if(mitigationEnabled&&items(a[8],'list').length)validateMitigationPacket(a[8],at);last=at;if(cat)catalogue=cat;if(mit)mitigation=mit;if(condition)for(const p of payload)samples[Number(condition)-1].push(p===true);}
 const means=samples.map(xs=>xs.length?Q.of(BigInt(xs.filter(Boolean).length),BigInt(xs.length)):undefined);
 const efficacy=mitigationEnabled?mitigationEstimates(rows.map(r=>items(r,'list')[8]),observedThreat):undefined;
 return {efficacy,rows:[...rows],at:last,means,catalogue,mitigation,sources:rows.map(o=>items(o,'list')[1])};
}
export function reappraisalFrame(v:CanonicalValue|undefined){if(v===undefined)return {at:0n,sources:[] as CanonicalValue[]};const a=items(v,'list');require(a.length===4&&txt(a[0])===REAPPRAISAL_FRAME&&uint(a[1])>=1n&&uint(a[1])<=100n,'frame');const completion=a[2];require(typeof completion!=='boolean'&&completion.kind==='typedIdentifier'&&completion.namespaceId===1141n&&typeof completion.payload!=='boolean'&&completion.payload.kind==='unsigned','frame completion identity');const sources=items(a[3],'list');require(sources.length>0&&new Set(sources.map(key)).size===sources.length,'frame sources');return {at:uint(a[1]),sources:[...sources]};}
export function createReappraisalExecution(config:Reappraisal,C:CanonicalValue,stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue,trialEvidence:()=>CanonicalValue|undefined=()=>undefined){
 const kp=reappraisalPath(C),fp=framePath(C),finger=(e:ScheduledEvent)=>key(scheduledEventValue(e));let active=false,at=0n,setting:ScheduledEvent|undefined,app:ReturnType<typeof reappraisalKnowledge>|undefined,eligible=false,appraised=false,motivated=false;
 let completed:CompletedAffect|undefined;
 const pending=new Map<string,ScheduledEvent>();let unbound=0;
 const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','reappraisal '+s);};
 const read=(state:AuthoritativeState,path:StatePath)=>{const v=stateModel.read(state,path);return {...v,record:{accessorId:sid(1028,'accessor/reappraisal'),path,presence:v.presence,value:v.value,derivedSources:[]} as ActualReadRecord};};
 const trace=(e:ScheduledEvent,input:CanonicalValue,output:CanonicalValue,reads:readonly ActualReadRecord[]=[],children:readonly ScheduledEvent[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[])=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event:e,seamId:sid(1036,'seam/assembled-reappraisal'),seamVersion:config.reserveCapacity?RESERVE_AFFECT_VERSION:config.observedThreat?OBSERVED_THREAT_VERSION:config.threat?GROUNDED_AFFECT_VERSION:config.mitigationEnabled?MITIGATION_VERSION:config.sharedSources?SHARED_AFFECT_VERSION:REAPPRAISAL_VERSION,recordKind:e.eventTypeId,subjectIds:[C as Extract<CanonicalValue,{kind:'typedIdentifier'}>],sourceRecordIds:app?.sources.map(v=>v as Extract<CanonicalValue,{kind:'typedIdentifier'}>)??[],registeredReadDomain:reads.map(r=>pattern(r.path)),actualReadRecords:reads,inputProjection:input,outputProjection:output,randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});
 const plan=(parent:ScheduledEvent,emissions:EventEmission[])=>{let bound=false;unbound++;return {emissions,bind(children:readonly ScheduledEvent[]){if(bound||children.length!==emissions.length)fail('child multiplicity');for(const [i,c]of children.entries()){const e=emissions[i];if(c.eventId===parent.eventId||c.eventSequence<=parent.eventSequence||c.dueAt!==e.dueAt||c.phase!==e.phase||key(c.eventTypeId)!==key(e.eventTypeId)||key(c.payload)!==key(e.payload)||key(c.dependencies)!==key(e.dependencies)||key(list(c.causalParentEventIds.map(unsigned)))!==key(list([...new Set([parent.eventId,...(e.additionalCausalParentEventIds??[])])].sort((a,b)=>a<b?-1:1).map(unsigned)))||pending.has(finger(c)))fail('child association');pending.set(finger(c),structuredClone(c));}bound=true;unbound--;}};};
 const emit=(e:ScheduledEvent,type:CanonicalValue,phase:bigint,payload:CanonicalValue):EventEmission=>({dueAt:e.dueAt,phase,eventTypeId:type as Extract<CanonicalValue,{kind:'typedIdentifier'}>,payload,dependencies:list([])});
 const action=(attempt:CanonicalValue)=>{const p=rec(f(rec(attempt,432n),2n),431n),i=rec(f(p,2n),425n),resolution=rec(f(i,2n),409n),d=rec(f(rec(f(resolution,4n),419n),2n),420n);return f(rec(f(d,1n),395n),2n);};
 const isAction=(attempt:CanonicalValue)=>key(action(attempt))===key(config.action);
 return Object.freeze({
 completedAffect(){return completed?structuredClone(completed):undefined;},
 begin(instant:bigint){if(active||pending.size||unbound)fail('begin');active=true;at=instant;completed=undefined;setting=undefined;app=undefined;eligible=false;appraised=false;motivated=false;},
 close(){active=false;completed=undefined;setting=undefined;app=undefined;pending.clear();unbound=0;},
 eventTypes:()=>[REAPPRAISAL_SOURCE,REAPPRAISAL_OBSERVE,REAPPRAISAL_LEARN,REAPPRAISAL_APPLY],
 isLearning:(e:ScheduledEvent)=>[REAPPRAISAL_LEARN,REAPPRAISAL_APPLY].some(t=>key(t)===key(e.eventTypeId)),
 candidates(e:ScheduledEvent,value:CanonicalValue){if(!active||!motivated||e.phase!==70n||e.dueAt!==at)fail('candidate lifecycle');const v=rec(value,398n),output=eligible?value:record(398,[f(v,1n),f(v,2n),list(items(f(v,3n),'list').filter(o=>key(f(rec(f(rec(o,397n),1n),395n),2n))!==key(config.action)))]);return {output,trace:()=>trace(e,list([value,eligible,setting?unsigned(setting.eventId):list([])]),output)};},
 isAction,permitted(attempt:CanonicalValue){return !isAction(attempt)||!!setting&&reappraisalSource(setting.payload,config.sharedSources).complete;},
 execute(context:EventHandlerContext<AuthoritativeState>){const e=context.event;if(!active||e.dueAt!==at)fail('event lifecycle');let output:CanonicalValue=list([]),emissions:EventEmission[]=[];
 if(key(e.eventTypeId)===key(REAPPRAISAL_SOURCE)){if(setting||e.phase!==30n||!originals.some(o=>finger(o)===finger(e)))fail('source authentication');reappraisalSource(e.payload,config.sharedSources);setting=structuredClone(e);const packet=config.mitigationEnabled?trialEvidence():undefined;emissions=[{...emit(e,REAPPRAISAL_OBSERVE,120n,e.payload),...(packet?{additionalCausalParentEventIds:[uint(items(packet,'list')[4])]}:{})}];}
 else {if(key(e.eventTypeId)!==key(REAPPRAISAL_OBSERVE)||e.phase!==120n||!pending.delete(finger(e)))fail('observation authentication');const s=reappraisalSource(e.payload,config.sharedSources),values=s.condition&&s.observed?[s.display]:[],cat=s.catalogueObserved?s.catalogue:0n;const packet=config.mitigationEnabled?trialEvidence():undefined;if(values.length||cat||s.mitigation||packet){output=list([text(config.mitigationEnabled?MITIGATION_OBS:config.sharedSources?SHARED_AFFECT_OBS:REAPPRAISAL_OBS),typedIdentifier(1164,unsigned(context.allocateRuntimeId())),C,unsigned(at),unsigned(s.condition),list(values),unsigned(cat),...(config.sharedSources?[unsigned(s.mitigation)]:[]),...(config.mitigationEnabled?[packet??list([])]:[])]);emissions=[emit(e,REAPPRAISAL_LEARN,140n,output)];}}
 const p=plan(e,emissions);return {nextState:context.state,outputs:key(output)===key(list([]))?[]:[output],emittedEvents:p.emissions,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{p.bind(children);return [trace(e,config.mitigationEnabled?list([e.payload,trialEvidence()??list([])]):e.payload,output,[],children)];}};},
 appraise(e:ScheduledEvent,s:AuthoritativeState,joint?:CanonicalValue){
 if(!active||appraised||e.phase!==50n||e.dueAt!==at)fail('appraisal lifecycle');appraised=true;
 const knowledge=read(s,kp),frame=read(s,fp),adoption=config.threat?read(s,{...importancePath(config.threat.task),fieldId:1n}):undefined;app=reappraisalKnowledge(knowledge.value,C,config.sharedSources,config.mitigationEnabled,config.observedThreat);const fr=reappraisalFrame(frame.value);
 if(app.at>=at||fr.at>=at)fail('prior-only appraisal');
 let reserveFraction:Q|undefined;
 const likelihood=config.observedThreat?app.efficacy?.cue?.mean:app.means[fr.at?1:0];let severity:Q|undefined=ONE,vulnerability:Q|undefined=ONE,control:Q|undefined=ZERO,reason='LegacyFixedFactors';
 if(config.sharedSources){
  if(!joint)fail('shared affect requires actual joint appraisal');
  const j=items(joint!,'list');if(txt(j[0])!==JOINT_APPRAISAL)fail('shared affect joint tag');
  const row=items(j[4],'list').map(v=>items(v,'list')).find(v=>key(v[0])===key(config.threat?.task??config.task));
  severity=row?.length===5?(config.threat?(adoption?.value&&uint(f(rec(adoption.value,372n),1n))===1n?config.threat.severity:undefined):readQ(row[1])):undefined;vulnerability=row?.length===5?readQ(row[2]):undefined;
  if(config.reserveCapacity){reserveFraction=observedReserveFraction(j[2],config.reserveCapacity);vulnerability=reserveFraction?ONE.subtract(reserveFraction):undefined;}
  control=app.mitigation===1n?ZERO:app.mitigation===2n&&config.mitigationEnabled?app.efficacy?.control:undefined;
  reason=app.mitigation===2n?(config.mitigationEnabled?(control===undefined?'mitigation-efficacy (unknown)':'ObservedMitigationEfficacy'):'mitigation-efficacy (component not integrated)'):app.mitigation===0n?'mitigation catalogue (unknown)':likelihood===undefined?'likelihood (unknown)':severity===undefined||vulnerability===undefined?'selected goal/body appraisal (unknown)':'KnownEmptyMitigation';
 }
 if(config.observedThreat&&likelihood===undefined)reason='current-cue likelihood (unknown)';
 const projected=compareAffectFactors({likelihood,severity,vulnerability,control},'SplitExposure');
 const status=config.sharedSources&&!config.mitigationEnabled&&app.mitigation===2n?'Deferred':projected.status;
 eligible=app.catalogue===2n&&app.means.every(v=>v!==undefined)&&!!setting&&reappraisalSource(setting.payload,config.sharedSources).opportunity;
 const report=list([text(config.sharedSources?SHARED_AFFECT_APPRAISAL:REAPPRAISAL_APPRAISAL),unsigned(at),list(app.means.map(v=>v?qValue(v):list([]))),unsigned(app.catalogue),frame.value??list([]),text(status),list(status==='Known'&&projected.status==='Known'?projected.coordinates.map(qValue):[]),...(config.sharedSources?[list([config.threat?.task??config.task,joint!,unsigned(app.mitigation),text(reason),list([likelihood,severity,vulnerability,control].map(v=>v?qValue(v):list([]))),...(config.mitigationEnabled?[app.efficacy!.provenance]:[]),...(config.threat?[list([adoption?.value??list([]),qValue(config.threat.severity)])]:[]),...(config.observedThreat?[app.efficacy!.cue!.provenance]:[]),...(config.reserveCapacity?[list([qValue(config.reserveCapacity),reserveFraction?qValue(reserveFraction):list([]),items(joint!,'list')[5]??list([])])]:[])])]:[])]);
 completed={report,event:e.eventId};return {report,trace:()=>trace(e,list([knowledge.value??list([]),frame.value??list([]),...(config.sharedSources?[joint!]:[])]),report,[knowledge.record,frame.record,...(adoption?[adoption.record]:[])])};
 },
 concern(e:ScheduledEvent,value:CanonicalValue){
 if(!config.threat||!active||!appraised||e.phase!==50n||e.dueAt!==at||!completed)fail('grounded concern lifecycle');
 const a=items(completed!.report,'list'),known=txt(a[5])==='Known',old=rec(value,388n);
 const output=record(388,[f(old,1n),f(old,2n),list(items(f(old,3n),'list').map(v=>{const r=rec(v,387n);return key(f(r,1n))===key(config.threat!.task)?record(387,[f(r,1n),known?record(386,[unsigned(2),items(a[6],'list')[1]]):record(386,[unsigned(1)])]):v;}))]);
 return {output,trace:()=>trace(e,list([value,completed!.report,unsigned(completed!.event)]),output)};
 },
 raw(e:ScheduledEvent,value:CanonicalValue){
 if(!config.threat||!active||!appraised||!motivated||e.phase!==80n||e.dueAt!==at||!completed)fail('grounded raw lifecycle');
 const old=rec(value,403n),signals=items(f(old,3n),'set'),a=items(completed!.report,'list'),U=txt(a[5])==='Known'?readQ(items(a[6],'list')[1]):ZERO;
 const mapped=(v:CanonicalValue)=>key(f(rec(f(rec(v,402n),1n),401n),2n))===key(config.threat!.task),role=(v:CanonicalValue)=>uint(f(rec(f(rec(v,402n),1n),401n),3n));
 const kept=signals.filter(v=>!mapped(v)||role(v)!==2n),bases=signals.filter(v=>mapped(v)&&role(v)===1n&&readQ(f(rec(v,402n),2n)).compare(ZERO)>0);
 const sources=new Map(app!.sources.map(v=>[key(v),v]));for(const support of app!.efficacy?.supports??[])for(const packet of items(items(support,'list')[1],'list')){const observation=validateMitigationPacket(packet).observation;sources.set(key(observation),observation);}
 for(const trial of app!.efficacy?.cue?.supports??[])for(const packet of items(trial,'list')){const observation=validateMitigationPacket(packet).observation;sources.set(key(observation),observation);}
 const joint=items(items(a[7],'list')[1],'list'),body=joint[2];if(typeof body!=='boolean'&&body.kind==='record'&&body.schema.typeId===461n){const observation=f(body,1n);sources.set(key(observation),observation);}
 const basis=record(400,[map([...sources.values()].map(v=>[record(399,[unsigned(1),record(237,[unsigned(1),v])]),qValue(ONE)]))]);
 if(U.compare(ZERO)>0)for(const b of bases){const k=rec(f(rec(b,402n),1n),401n);kept.push(record(402,[record(401,[f(k,1n),f(k,2n),unsigned(2)]),qValue(U),basis]));}
 const output=canonicalRecord(old.schema,new Map([...old.fields].map(([n,v])=>[n,n===3n?set(kept):v])));
 return {output,trace:()=>trace(e,list([value,completed!.report,unsigned(completed!.event)]),output)};
 },
 motive(e:ScheduledEvent,s:AuthoritativeState,value:CanonicalValue){if(!active||!appraised||motivated||e.phase!==60n||e.dueAt!==at)fail('motive lifecycle');motivated=true;const importance=read(s,importancePath(config.task)),I=importance.value?importanceValue(importance.value).I:ZERO,delta=app!.means.every(v=>v!==undefined)?app!.means[0]!.subtract(app!.means[1]!):ZERO,benefit=delta.compare(ZERO)>0?delta:ZERO,strength=eligible?I.multiply(config.law==='KnowledgeOnly'?ONE:benefit):ZERO,old=rec(value,394n),selected=items(f(rec(f(rec(f(rec(f(old,2n),388n),2n),384n),2n),381n),4n),'list').some(v=>key(f(rec(v,379n),1n))===key(config.task)),output=record(394,[f(old,1n),f(old,2n),list([...items(f(old,3n),'list').filter(v=>key(f(rec(v,393n),1n))!==key(config.task)),...(selected&&strength.compare(ZERO)>0?[record(393,[config.task,qValue(strength)])]:[])])]);const report=list([text(REAPPRAISAL_MOTIVE),unsigned(at),config.task,eligible,qValue(I),qValue(benefit),qValue(strength)]);return {output,report,trace:()=>trace(e,list([value,list(app!.rows),importance.value??list([]),setting?unsigned(setting.eventId):list([])]),list([output,report]),[importance.record])};},
 complete(e:ScheduledEvent,outcome:CanonicalValue){const o=rec(outcome,433n);if(!isAction(f(o,2n)))return undefined;if(!active||!motivated||e.phase!==110n||e.dueAt!==at)fail('completion lifecycle');const success=uint(f(o,3n))>0n;if(success&&!eligible)fail('ineligible cognitive completion');const frame=list([text(REAPPRAISAL_FRAME),unsigned(at),f(o,1n),list(app!.sources)]),p=plan(e,success&&config.law!=='NoReappraisal'?[emit(e,REAPPRAISAL_APPLY,140n,frame)]:[]);return {...p,trace:(children:readonly ScheduledEvent[])=>trace(e,list([outcome,list(app!.rows)]),success&&config.law!=='NoReappraisal'?frame:list([]),[],children)};},
 prepare(events:readonly ScheduledEvent[],B0:AuthoritativeState){const seen=new Set<string>();const candidates=events.map(e=>{if(!active||e.phase!==140n||e.dueAt!==at||!pending.has(finger(e))||seen.has(key(e.eventTypeId)))fail('stage preflight');seen.add(key(e.eventTypeId));const learning=key(e.eventTypeId)===key(REAPPRAISAL_LEARN);if(!learning&&key(e.eventTypeId)!==key(REAPPRAISAL_APPLY))fail('stage event');const path=learning?kp:fp,prior=read(B0,path),value=learning?list([...reappraisalKnowledge(prior.value,C,config.sharedSources,config.mitigationEnabled,config.observedThreat).rows,e.payload]):e.payload;learning?reappraisalKnowledge(value,C,config.sharedSources,config.mitigationEnabled,config.observedThreat):reappraisalFrame(value);const patch:StatePatch={operations:[{kind:'set',path,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:value}]};return {e,prior,patch,owner:learning?KNOWLEDGE_OWNER:FRAME_OWNER};});let cursor=0,finished=false;const traces:CanonicalValue[]=[];return {execute(c:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=candidates.length||finger(c.event)!==finger(candidates[cursor].e)||!pending.delete(finger(c.event)))fail('stage order');cursor++;return {nextState:B0,outputs:[],emittedEvents:[],traceContributions:[]};},finish(state:AuthoritativeState){if(finished||cursor!==candidates.length)fail('stage incomplete');finished=true;for(const c of candidates){const applied=stateModel.applyPatch(state,c.patch,c.owner,{writableRoots:c.patch.operations.map(o=>o.path.rootStateTypeId),targetPaths:c.patch.operations.map(o=>o.path)});state=applied.state;traces.push(trace(c.e,c.e.payload,list([]),[c.prior.record],[],c.patch,applied.diffs));}return state;},traces(){if(!finished)fail('trace before finish');return traces;}};},
 parents:()=>setting?[setting.eventId]:[],
 prepareCommit(){if(!active||unbound||pending.size)fail('unfinished instant');},
 });
}
