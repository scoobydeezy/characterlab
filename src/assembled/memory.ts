/** assembled-character-memory/0.1-candidate. A second evidence operation,
 * the SAME episodic family/authority, and no scheduler or psychological side store. */
import {canonicalEncode as enc,list,text,signed,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,restoreAuthoritativeState,statePathValue,type StatePath,type StatePathPattern,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission,type EventHandlerContext} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {checkedAddDuration,simDuration} from '../substrate/time';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {exact} from '../campaign3/embodiedMath';
import {dataItems as items,dataField as f,dataRecord as rec,dataKey as key,dataIdentity as id,dataText as txt,dataUnsigned as uint} from '../campaign2/canonicalData';
import {BODY_SELECTION,BODY_SELECTION_REPORT,BODY_OBSERVER,BODY_CHANNEL,bodyId,type BodyEvidence,type BodyDeclaration} from './body';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const EPISODE='assembled-body-episode/0.1',RECALL='assembled-body-recall/0.1';
export const EPISODIC_OWNER=bodyId(1025,'authority/measurement-episode-formation');
export const MEMORY_EVIDENCE=bodyId(1001,'event/assembled-memory-evidence'),MEMORY_FORMATION=bodyId(1001,'event/assembled-memory-formation'),MEMORY_RECALL=bodyId(1001,'event/assembled-memory-recall');
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','assembled memory: '+s);};
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<0n)return fail('time');return v.value;};
const occurrence=(v:CanonicalValue,ns:bigint)=>{const i=id(v);if(i.namespaceId!==ns)fail('occurrence namespace');return uint(i.payload);};
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const pattern=(path:StatePath):StatePathPattern=>({...path,selectors:path.selectors.map(selector=>({kind:'exact',selector}))});
export const bodyEpisodePath=(C:CanonicalValue,observation:CanonicalValue):StatePath=>({rootStateTypeId:346n,fieldId:1n,selectors:[{kind:'mapKey',key:list([text(EPISODE),C,observation])}]});
export function isBodyEpisodePath(p:StatePath){const k=p.selectors[0];return p.rootStateTypeId===346n&&k?.kind==='mapKey'&&typeof k.key!=='boolean'&&k.key.kind==='list';}
function validateEvidence(sample:CanonicalValue,experience:CanonicalValue,audit:CanonicalValue,at:bigint,d:BodyDeclaration){
 const s=rec(decode(enc(sample)),461n),x=rec(decode(enc(experience)),227n),a=items(audit,'list');occurrence(f(s,1n),1115n);occurrence(f(x,1n),1106n);
 if(!eq(f(s,2n),BODY_OBSERVER)||!eq(f(s,3n),BODY_CHANNEL)||time(f(s,4n))!==at||!eq(f(x,2n),BODY_OBSERVER)||uint(f(x,3n))!==at)fail('sample/experience binding');
 if(txt(f(s,6n))!=='embodied-level-observation/0.1-candidate'||txt(f(x,9n))!=='semantic-binding/0.1-candidate#SEM-001H')fail('evidence version');
 const support=items(f(x,8n),'set');if(support.length!==1||!eq(f(rec(support[0],216n),1n),BODY_OBSERVER)||!eq(f(rec(support[0],216n),2n),f(s,1n)))fail('experience observation support');
 for(const n of [4n,5n,6n,7n])if(items(f(x,n),'set').length)fail('body experience has foreign content');
 if(a.length!==5||txt(a[0])!==BODY_SELECTION_REPORT||time(a[1])!==at||uint(a[2])!==1n||!eq(a[3],f(s,1n))||txt(a[4])!=='Selected')fail('actual selected source required');
 const interval=rec(f(s,5n),462n),lo=exact(f(interval,1n)),hi=exact(f(interval,2n));
 if(lo.numerator<0n||hi.compare(d.capacity)>0||lo.compare(hi)>=0||lo.divide(d.width).denominator!==1n||!hi.subtract(lo).equals(d.width))fail('observed interval grid');
 return s;
}
/** Extend the existing map's value union; unrelated owners cannot touch either variant. */
export function withEpisodicState(base:ReturnType<typeof compileCampaign2StateModel>,C:CanonicalValue,d:BodyDeclaration){
 const checkPath=(p:StatePath)=>{const k=p.selectors[0];if(p.rootStateTypeId!==346n||p.fieldId!==1n||p.selectors.length!==1||k?.kind!=='mapKey')return fail('episode path');const a=items(k.key,'list');if(a.length!==3||txt(a[0])!==EPISODE||!eq(a[1],C))fail('episode holder/key');occurrence(a[2],1115n);return a;};
 const checkValue=(v:CanonicalValue)=>{const a=items(v,'list');if(a.length!==6||txt(a[0])!==EPISODE)fail('episode shape');occurrence(a[1],1125n);validateEvidence(a[2],a[3],a[4],time(a[5]),d);return a;};
 const check=(p:StatePath,v?:CanonicalValue)=>{const k=checkPath(p);if(v){const a=checkValue(v);if(!eq(k[2],f(rec(a[2],461n),1n)))fail('episode key/source mismatch');}};
 const domain:StatePathPattern={rootStateTypeId:346n,fieldId:1n,selectors:[{kind:'wildcard',selectorKind:'mapKey'}]};
 const authority=new StateAuthorityRegistry([{pattern:domain,validateValue:checkValue,removalAllowed:false}],[{mutationAuthorityId:EPISODIC_OWNER,patterns:[domain]}]);
 const without=(s:AuthoritativeState)=>new AuthoritativeState(s.entries().filter(e=>!isBodyEpisodePath(e.path)));
 function validateState(s:AuthoritativeState){base.validateState(without(s));const seen=new Set<string>();for(const e of s.entries())if(isBodyEpisodePath(e.path)){check(e.path,e.value);const acquisition=key(items(e.value,'list')[1]);if(seen.has(acquisition))fail('duplicate acquisition');seen.add(acquisition);}}
 return Object.freeze({...base,validateState,
  validatePath(p:StatePath){if(isBodyEpisodePath(p))check(p);else base.validatePath(p);},
  restoreState(bytes:Uint8Array){const s=restoreAuthoritativeState(decode(bytes));validateState(s);return s;},
  read(s:AuthoritativeState,p:StatePath){if(!isBodyEpisodePath(p))return base.read(without(s),p);check(p);const v=s.read(p);if(v.presence)check(p,v.value!);return v;},
  applyPatch(s:AuthoritativeState,p:StatePatch,owner:Parameters<typeof base.applyPatch>[2],scope?:Parameters<typeof base.applyPatch>[3]){
   const body=p.operations.filter(o=>isBodyEpisodePath(o.path));if(body.length&&body.length!==p.operations.length)fail('mixed episode patch requires prepared operations');
   if(body.length){for(const o of body){check(o.path,o.kind==='set'?o.newValue:undefined);if(o.kind!=='set'||o.expected.presence)fail('formation must create a fresh episode');if(scope&&(!scope.writableRoots.includes(346n)||!scope.targetPaths.some(t=>eq(statePathValue(t),statePathValue(o.path)))))fail('episode write scope');}const result=applyStatePatch(s,p,owner,authority);validateState(result.state);return result;}
   const result=base.applyPatch(without(s),p,owner,scope),state=new AuthoritativeState([...result.state.entries(),...s.entries().filter(e=>isBodyEpisodePath(e.path))]);validateState(state);return {...result,state};
  },
 });
}
export function createEpisodicExtension(C:CanonicalValue,d:BodyDeclaration,stateModel:ReturnType<typeof compileCampaign2StateModel>,model:CanonicalValue,run:CanonicalValue){
 let active=false,at=0n,pending=new Map<string,ScheduledEvent>(),checkpoint=new Map<string,ScheduledEvent>(),seen=new Set<bigint>();
 const eventKey=(e:ScheduledEvent)=>key(scheduledEventValue(e));
 const trace=(event:ScheduledEvent,outputs:CanonicalValue[],children:readonly ScheduledEvent[],reads:ActualReadRecord[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[])=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:bodyId(1036,'seam/assembled-episodic-memory'),seamVersion:'assembled-character-memory/0.1-candidate',recordKind:event.eventTypeId,subjectIds:[id(C),BODY_OBSERVER],sourceRecordIds:[],registeredReadDomain:reads.map(r=>pattern(r.path)),actualReadRecords:reads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});
 const emit=(event:ScheduledEvent,type:typeof MEMORY_EVIDENCE,phase:bigint,payload:CanonicalValue,dueAt=event.dueAt):EventEmission=>({dueAt,phase,eventTypeId:type,payload,dependencies:list([])});
 const plan=(parent:ScheduledEvent,emissions:EventEmission[])=>({emissions,bind(children:readonly ScheduledEvent[]){if(!active||children.length!==emissions.length)fail('child count/lifecycle');for(const [i,child]of children.entries()){const e=emissions[i];if(child.eventSequence<=parent.eventSequence||eventKey(child)!==eventKey({...e,eventId:child.eventId,eventSequence:child.eventSequence,causalParentEventIds:[parent.eventId]})||pending.has(eventKey(child)))fail('generated child mismatch');pending.set(eventKey(child),structuredClone(child));}}});
 const authenticated=(e:ScheduledEvent,phase:bigint)=>{if(!active||e.dueAt!==at||e.phase!==phase||!pending.has(eventKey(e)))fail('unassociated child');};
 const pathFor=(v:CanonicalValue)=>{const a=items(v,'list');if(a.length!==3||txt(a[0])!==EPISODE||!eq(a[1],C))fail('recall target');occurrence(a[2],1115n);return bodyEpisodePath(C,a[2]);};
 return Object.freeze({
  eventTypes:()=>[MEMORY_EVIDENCE,MEMORY_FORMATION,MEMORY_RECALL],isFormation:(e:ScheduledEvent)=>eq(e.eventTypeId,MEMORY_FORMATION),
  begin(instant:bigint){if(active)fail('already active');active=true;at=instant;checkpoint=new Map(pending);seen=new Set();},
  prepareCommit(){if([...pending.values()].some(e=>e.dueAt<=at))fail('unconsumed child');},
  commit(){checkpoint=new Map(pending);},
  close(){pending=new Map(checkpoint);active=false;seen.clear();},
  observeSelection(event:ScheduledEvent,evidence:BodyEvidence|undefined){
   if(!active||event.dueAt!==at||event.phase!==20n||!eq(event.eventTypeId,BODY_SELECTION)||seen.has(event.eventId)||!evidence||eventKey(evidence.settledEvent)!==eventKey(event))fail('actual selection lifecycle');seen.add(event.eventId);
   if(!evidence)return fail('missing selection');
   if(!evidence.sample)return undefined;
   validateEvidence(evidence.sample,evidence.experience!,evidence.selection!,at,d);
   const payload=list([evidence.sample,evidence.experience!,evidence.selection!]),p=plan(event,[emit(event,MEMORY_EVIDENCE,130n,payload)]);
   return {...p,trace:(children:readonly ScheduledEvent[])=>trace(event,[],children)};
  },
  execute(context:EventHandlerContext<AuthoritativeState>){
   const {event,state}=context,formation=eq(event.eventTypeId,MEMORY_FORMATION);if(formation)fail('formation requires common prepared stage');
   const evidence=eq(event.eventTypeId,MEMORY_EVIDENCE);if(!evidence&&!eq(event.eventTypeId,MEMORY_RECALL))fail('event kind');authenticated(event,evidence?130n:20n);pending.delete(eventKey(event));
   let outputs:CanonicalValue[]=[],reads:ActualReadRecord[]=[],emissions:EventEmission[]=[];
   if(evidence){const a=items(event.payload,'list');if(a.length!==3)fail('evidence payload');const s=validateEvidence(a[0],a[1],a[2],at,d),episode=list([text(EPISODE),typedIdentifier(1125,unsigned(context.allocateRuntimeId())),...a,signed(at)]),path=bodyEpisodePath(C,f(s,1n));
    const later=checkedAddDuration(event.dueAt,simDuration(1n));outputs=[episode];emissions=[emit(event,MEMORY_FORMATION,140n,episode),emit(event,MEMORY_RECALL,20n,(path.selectors[0] as {kind:'mapKey';key:CanonicalValue}).key,later)];
   }else{const path=pathFor(event.payload),value=stateModel.read(state,path);reads=[{accessorId:bodyId(1028,'accessor/assembled-exact-episode'),path,presence:value.presence,value:value.value,derivedSources:[]}];if(value.presence){if(time(items(value.value!,'list')[5])>=at)fail('recall requires earlier episode');outputs=[list([text(RECALL),signed(at),value.value!])];}}
   const p=plan(event,emissions);return {nextState:state,outputs,emittedEvents:emissions,traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){p.bind(children);return [trace(event,outputs,children,reads)];}};
  },
  prepare(events:readonly ScheduledEvent[],state:AuthoritativeState){
   const targets=new Set<string>(),candidates=events.map(event=>{authenticated(event,140n);if(!eq(event.eventTypeId,MEMORY_FORMATION))fail('formation kind');const a=items(event.payload,'list');if(a.length!==6||txt(a[0])!==EPISODE||time(a[5])!==at)fail('formation payload');occurrence(a[1],1125n);const s=validateEvidence(a[2],a[3],a[4],at,d),path=bodyEpisodePath(C,f(s,1n));stateModel.validatePath(path);const prior=stateModel.read(state,path);if(prior.presence||targets.has(key(statePathValue(path))))fail('duplicate formation');targets.add(key(statePathValue(path)));
    const patch:StatePatch={operations:[{kind:'set',path,expected:{presence:false},newValue:event.payload}]},reads:ActualReadRecord[]=[{accessorId:bodyId(1028,'accessor/assembled-episode-formation-target'),path,presence:false,derivedSources:[]}];return {event,patch,reads};});
   let index=0,finished=false;const traces:CanonicalValue[]=[];
   return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||index>=candidates.length||eventKey(context.event)!==eventKey(candidates[index].event))fail('formation order');pending.delete(eventKey(context.event));index++;return {nextState:state,outputs:[],emittedEvents:[],traceContributions:[]};},
    finish(candidate:AuthoritativeState){if(finished||index!==candidates.length)fail('incomplete formation');finished=true;for(const c of candidates){const result=stateModel.applyPatch(candidate,c.patch,EPISODIC_OWNER,{writableRoots:[346n],targetPaths:c.patch.operations.map(o=>o.path)});candidate=result.state;traces.push(trace(c.event,[],[],c.reads,c.patch,result.diffs));}return candidate;},
    traces(){if(!finished)fail('trace before commit');return traces;}};
  },
 });
}
