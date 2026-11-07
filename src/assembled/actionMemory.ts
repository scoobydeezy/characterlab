/** Owner-approved action-conditioned episodic endpoint mean. No independent store. */
import {list,map,set,text,unsigned,signed,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataItems as items,dataKey as key,dataText as txt,dataUnsigned as uint,dataField as f,dataRecord as rec,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {qValue,readQ,bounded} from '../campaign2/cognitiveMath';
import {cognitiveRecord as r} from './codecs';
import {POSITION_EPISODE,validatePositionEpisode,positionExperience,isPositionEpisodePath} from './memory';
import {outcomePath,outcomeJournal,PERFORMANCE_OBS} from './performance';
import {readGoalValue,type GoalMeaningSettings,meaningValue} from './goalMeaning';
import {assessGoalDistance} from '../campaign3/goalDistanceRelation';
import {perceptualReferentIdValue} from '../semanticBinding/semanticCodecs';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import type {PreRecognitionSemanticExperience} from '../semanticBinding/perceptualEventFiles';
import {sid,pattern} from './skill';
import type {Strategy} from './strategy';
import type {AuthoritativeState,ActualReadRecord,StatePath} from '../substrate/state';
import type {ScheduledEvent} from '../substrate/scheduler';
import {SchedulerContractError} from '../substrate/scheduler';
import {traceRecordValue} from '../substrate/trace';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const ACTION_MEMORY='assembled-action-memory/0.1',ACTION_MEMORY_VERSION='assembled-character-action-memory/0.1-candidate';
type Evidence={observation:CanonicalValue;experience:PreRecognitionSemanticExperience;contexts:CanonicalValue};
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b),zero=Q.of(0n),one=Q.of(1n);
function fail(s:string):never {throw new SchedulerContractError('INPUT_NOT_ADMITTED','action memory '+s);}
const time=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='signed'?v.value:fail('time');
export function compileActionMemory(v:CanonicalValue,routes:Strategy){
 const a=items(v,'list');if(a.length!==2||txt(a[0])!==ACTION_MEMORY)invalidModel('action memory declaration');
 const rows=items(a[1],'list').map(v=>{const p=items(v,'list'),route=routes.find(r=>eq(r.task,p[0]));if(p.length!==2||!route?.plans.some(x=>eq(x.actionId,p[1])))invalidModel('action memory task/action');return {task:p[0],action:p[1]};});
 if(rows.length<1||rows.length>2||new Set(rows.map(x=>key(x.task))).size!==rows.length||new Set(rows.map(x=>key(x.action))).size!==rows.length)invalidModel('action memory unique domain');return rows;
}
type Config=ReturnType<typeof compileActionMemory>;
function position(observation:CanonicalValue,experience:CanonicalValue){
 const o=items(observation,'list'),v=items(o[4],'list'),panel=items(o[5],'list'),x=positionExperience(experience);
 if(v.length!==4||panel.length!==3||x.perceivedBindings.length!==1)return undefined;
 return {x:uint(v[1]),y:uint(v[2]),glyph:uint(v[3]),role:uint(o[6]),panel:uint(panel[1]),track:perceptualReferentIdValue(x.perceivedBindings[0].perceptualReferentId),at:time(o[1])};
}
function sameContext(a:NonNullable<ReturnType<typeof position>>,b:NonNullable<ReturnType<typeof position>>){return eq(a.track,b.track)&&a.glyph===b.glyph&&a.role===b.role&&a.panel===b.panel;}
/** Validate immutable already-perceived operands, never regenerate them from world truth. */
export function validateActionAnnex(v:CanonicalValue,after:readonly CanonicalValue[]){
 const a=items(v,'list');if(!a.length)return undefined;
 if(a.length!==3||txt(a[0])!==ACTION_MEMORY)fail('annex shape');
 const before=items(a[1],'list');if(before.length!==8)fail('nonrecursive before episode');
 validatePositionEpisode(a[1]);const p=position(before[2],before[3]),n=position(after[2],after[3]),o=items(a[2],'list');
 if(!p||!n||n.at!==p.at+1n||!sameContext(p,n)||!eq(before[4],after[4])||items(before[4],'list').length!==1)fail('observed continuity');
 if(o.length!==8||txt(o[0])!==PERFORMANCE_OBS||uint(o[2])!==p.at||o[6]!==true||o[7]!==true||id(o[1]).namespaceId!==1164n||id(o[5]).namespaceId!==1027n)fail('perceived execution');
 rec(o[3],371n);if(uint(o[4])>1n)fail('route');return {before,p,n,observation:a[2],task:o[3],action:o[5]};
}
export function createActionMemory(C:CanonicalValue,config:Config,routes:Strategy,goal:GoalMeaningSettings,stateModel:ReturnType<typeof compileCampaign2StateModel>,model:CanonicalValue,run:CanonicalValue,currentPosition:()=>Evidence|undefined){
 let current:{at:bigint;event:bigint;report:CanonicalValue;rows:{task:CanonicalValue;action:CanonicalValue;amount:Q|undefined;sources:CanonicalValue[]}[]}|undefined;
 const trace=(event:ScheduledEvent,input:CanonicalValue,output:CanonicalValue,reads:ActualReadRecord[]=[])=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:sid(1036,'seam/assembled-action-memory'),seamVersion:ACTION_MEMORY_VERSION,recordKind:event.eventTypeId,subjectIds:[id(C)],sourceRecordIds:[],registeredReadDomain:reads.map(x=>pattern(x.path)),actualReadRecords:reads,inputProjection:input,outputProjection:output,randomDrawRecords:[],quantizationOperations:[],statePatch:{operations:[]},structuralMutationDiffs:[],emittedEvents:[],invariantResults:[]});
 return {
 reset(){current=undefined;},
 capture(state:AuthoritativeState,e:Evidence){
  const reads:ActualReadRecord[]=[],at=e.experience.occurredAt,read=(path:StatePath)=>{const v=stateModel.read(state,path);reads.push({accessorId:sid(1028,'accessor/action-memory-binding'),path,presence:v.presence,value:v.value,derivedSources:[]});return v.value;};
  const next=[text(POSITION_EPISODE),list([]),e.observation,preRecognitionSemanticExperienceValue(e.experience),e.contexts,signed(at)];
  const candidates:CanonicalValue[]=[];
  for(const row of state.entries().filter(x=>isPositionEpisodePath(x.path))){
   const before=validatePositionEpisode(read(row.path)!);if(time(before[5])!==at-1n)continue;const p=position(before[2],before[3]),n=position(next[2],next[3]);
   if(!p||!n||!sameContext(p,n)||!eq(before[4],e.contexts)||items(e.contexts,'list').length!==1)continue;
   const found=new Map<string,CanonicalValue>();
   for(const c of config)for(const o of outcomeJournal(read(outcomePath(c.task)),c.task,routes,true)){const a=items(o,'list');if(uint(a[2])===at-1n&&eq(a[5],c.action)&&a[6]===true&&a[7]===true)found.set(key(a[1]),o);}
   for(const o of found.values()){const annex=list([text(ACTION_MEMORY),list(before.slice(0,8)),o]);validateActionAnnex(annex,next);candidates.push(annex);}
  }
  return {annex:candidates.length===1?candidates[0]:list([]),reads};
 },
 appraise(event:ScheduledEvent,workspace:CanonicalValue,spatial:CanonicalValue){
  if(event.phase!==50n||current)fail('appraisal lifecycle');
  const w=items(workspace,'list'),m=items(spatial,'list'),e=currentPosition();
  if(time(w[1])!==event.dueAt||!eq(m[3],workspace))fail('workspace');
  const present=e&&e.experience.occurredAt===event.dueAt?position(e.observation,preRecognitionSemanticExperienceValue(e.experience)):undefined;
  const rawGoal=items(m[2],'list').length?readGoalValue(m[2],C,goal):undefined;
  const unique=new Map<string,CanonicalValue>();
  for(const slot of items(w[4],'list')){const a=items(slot,'list'),v=items(a[1],'list');if(txt(v[0])!==POSITION_EPISODE)continue;validatePositionEpisode(a[1]);if(!eq(a[0],v[1])||time(v[5])>=event.dueAt||unique.has(key(v[1])))fail('workspace identity/time/duplicate');unique.set(key(v[1]),a[1]);}
  const reports:CanonicalValue[]=[],rows=config.map(c=>{
   const operands=[...unique.values()].filter(v=>{const a=items(v,'list');if(a.length!==9)return false;const annex=validateActionAnnex(a[8],a);return !!(annex&&present&&present.glyph===goal.glyph&&eq(annex.action,c.action)&&eq(annex.task,c.task)&&sameContext(annex.p,present)&&annex.p.x===present.x&&annex.p.y===present.y);});
   const mean=operands.length?operands.reduce((n,v)=>n.add(Q.of(uint(items(items(items(v,'list')[2],'list')[4],'list')[1]))),zero).divide(Q.of(BigInt(operands.length))):undefined;
   const point=(x:Q)=>({lower:x,upper:x});
   const assessment=assessGoalDistance({state:rawGoal?[rawGoal]:[],character:'holder',goal:goal.goal,signal:goal.signal,now:event.dueAt,before:present?point(Q.of(present.x)):null,after:mean?point(mean):null,domains:new Map([[goal.signal,{kind:'MetricInterval',bounds:goal.bounds}]])});
   const delta=assessment.kind==='Assessed'?assessment.before.lower.subtract(assessment.after.lower):undefined,amount=delta===undefined?undefined:(delta.compare(zero)>0?delta:zero).divide(Q.of(10n));
   reports.push(list([c.task,c.action,text(amount===undefined?'Unknown':'Known'),mean?qValue(mean):list([]),amount?qValue(amount):list([]),list(operands),meaningValue(assessment)]));
   return {...c,amount,sources:operands.map(v=>f(rec(items(v,'list')[3],227n),1n))};
  });
  const report=list([text(ACTION_MEMORY+'/forecast'),signed(event.dueAt),e?e.observation:list([]),spatial,list(reports)]);
  current={at:event.dueAt,event:event.eventId,report,rows};return {report,trace:()=>trace(event,list([workspace,spatial,e?preRecognitionSemanticExperienceValue(e.experience):list([])]),report)};
 },
 raw(event:ScheduledEvent,input:CanonicalValue){
  if(!current||event.phase!==80n||current.at!==event.dueAt)fail('raw lifecycle');
  const app=current!,raw=rec(input,403n),signals=[...items(f(raw,3n),'set')],joined:CanonicalValue[]=[];
  for(const v of items(f(rec(f(raw,2n),398n),3n),'list')){const option=rec(v,397n),candidate=f(option,1n),action=f(rec(candidate,395n),2n);
   for(const origin of items(f(option,2n),'set')){const task=f(rec(origin,396n),1n),a=app.rows.find(x=>eq(x.task,task)&&eq(x.action,action));if(!a||a.amount===undefined)continue;
    const base=signals.find(v=>{const k=rec(f(rec(v,402n),1n),401n);return eq(f(k,1n),candidate)&&eq(f(k,2n),task)&&uint(f(k,3n))===1n&&readQ(f(rec(v,402n),2n)).compare(zero)>0;});if(!base)continue;
    const sk=r(401,[candidate,task,unsigned(2)]),index=signals.findIndex(v=>eq(f(rec(v,402n),1n),sk)),old=index<0?undefined:rec(signals[index],402n),before=old?readQ(f(old,2n)):zero;
    const oldBasis=old?f(rec(f(old,3n),400n),1n):map([]);if(typeof oldBasis==='boolean'||oldBasis.kind!=='map')fail('basis');
    const basis=new Map(oldBasis.entries.map(([k,v])=>[key(k),[k,v] as const]));for(const s of a.sources){const k=r(399,[unsigned(1),r(237,[unsigned(1),s])]);basis.set(key(k),[k,qValue(one)]);}
    const after=before.add(a.amount);joined.push(list([sk,qValue(before),qValue(a.amount),qValue(after)]));
    if(a.amount.compare(zero)>0){const signal=r(402,[sk,qValue(after),r(400,[map([...basis.values()])])]);if(index<0)signals.push(signal);else signals[index]=signal;}
   }
  }
  const oldMeaning=f(raw,4n);if(typeof oldMeaning==='boolean'||oldMeaning.kind!=='map')fail('option meaning');
  const meaning=map(oldMeaning.entries.map(([c,v])=>[c,joined.some(j=>eq(f(rec(items(j,'list')[0],401n),1n),c))?qValue(bounded(signals.reduce((sum,v)=>{const s=rec(v,402n),k=rec(f(s,1n),401n);return eq(f(k,1n),c)&&uint(f(k,3n))!==3n?sum.add(readQ(f(s,2n))):sum;},zero))):v]));
  const output=record(raw.schema,new Map([...raw.fields].map(([n,v])=>[n,n===3n?set(signals):n===4n?meaning:v]))),report=list([text(ACTION_MEMORY+'/reasons'),signed(event.dueAt),app.report,list(joined)]);
  return {output,report,trace:()=>trace(event,list([input,app.report,unsigned(app.event)]),list([output,report]))};
 }
 };
}
