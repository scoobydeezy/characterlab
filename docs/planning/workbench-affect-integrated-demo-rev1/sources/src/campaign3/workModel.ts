/** workspace-control/0.1-candidate; fixed, data-only controlled board profile. */
import {canonicalEncode as enc,list,text,unsigned as u,signed,rational,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue,type StatePath} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {simInstant} from '../substrate/time';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import type {ScheduledEvent} from '../substrate/scheduler';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {receivingRecord as old} from './receivingCodecs';
import {copyData} from './beliefModel';
import {multisourceBase} from './multisourceModelRecipe';
import {decodeWork as decode,workRecord as r} from './workCodecs';
export {copyData};
export const WORK_VERSION='workspace-control/0.1-candidate';
export const wid=(ns:number,name:string)=>typedIdentifier(ns,text(name));
export const OBSERVER=wid(1000,'observer/work'),CHARACTER=semanticReferentFromAuthoredContent(wid(1038,'content/work/character'));
export const TASKS=['a','b'].map(n=>old(371,[CHARACTER,semanticReferentFromAuthoredContent(wid(1038,'content/work/'+n))]));
export const OPTIONS=['a','b'].map(n=>old(395,[CHARACTER,wid(1027,'action/work/'+n)]));
export const STAGES=[['workspace',40],['raw',51],['reasons',52],['decision',60],['intent',70],['world',110],['observe',120],['append',140],['deadline',140]] as const;
export const eventId=(n:string)=>wid(1001,'event/work/'+n);
export const taskPath=(t:CanonicalValue):StatePath=>({rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:t}]});
export const journalPath:StatePath={rootStateTypeId:771n,fieldId:1n,selectors:[{kind:'mapKey',key:CHARACTER}]};
export const cachePath:StatePath={...journalPath,rootStateTypeId:772n};
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export interface WorkSettings {candidate:number;capacity:number;support:boolean;}
export const DEFAULT_SETTINGS:WorkSettings={candidate:1,capacity:1,support:true};
export const stageReads=(n:string,s:WorkSettings)=>n==='workspace'?[journalPath,...TASKS.map(taskPath),...(s.candidate===1?[cachePath]:[])]:n==='append'?[journalPath]:n==='deadline'?TASKS.map(taskPath):[];
export const stageWrites=(n:string,s:WorkSettings)=>n==='workspace'&&s.candidate===1?[cachePath]:n==='append'?[journalPath]:n==='deadline'?TASKS.map(taskPath):[];
export const owner=(n:string)=>wid(1025,n==='deadline'?'authority/prospective-commitments':n==='append'?'authority/workspace-observation':'authority/active-workspace');
const ownership=()=>compileMutationAuthorityRegistry([
 {authorityName:'authority/prospective-commitments',ownedLeaves:TASKS.map(t=>({pattern:pattern(taskPath(t)),valueGrammar:{kind:'canonical-record' as const,recordTypeId:372n},removalAllowed:false}))},
 ...[[journalPath,'authority/workspace-observation',780n],[cachePath,'authority/active-workspace',781n]].map(([p,name,type])=>({authorityName:name as string,ownedLeaves:[{pattern:pattern(p as StatePath),valueGrammar:{kind:'canonical-record' as const,recordTypeId:type as bigint},removalAllowed:false}]})),
]);
export function workRecipe(settings:Partial<WorkSettings>={}){
 const s={...DEFAULT_SETTINGS,...settings};if(![1,2,3,4,5,6].includes(s.candidate)||![0,1,2,3].includes(s.capacity)||typeof s.support!=='boolean')throw Error('WORK_PROFILE');
 const base=multisourceBase(),parameters=r(766,[text(WORK_VERSION),u(s.candidate),u(s.capacity),s.support]);
 const content=r(778,[OBSERVER,CHARACTER,list(TASKS),list(OPTIONS),old(437,[f(rec(base.get('task-reason-dice'),437n),1n),rational(0,1),old(439,[rational(1,4),u(3)]),old(439,[rational(1,4),u(3)])]),base.get('task-arbitration'),signed(6)]);
 const stages=STAGES.map(([n,phase])=>r(779,[eventId(n),u(phase),list(stageReads(n,s).map(p=>statePathPatternValue(pattern(p)))),list(stageWrites(n,s).map(p=>statePathPatternValue(pattern(p)))),owner(n)]));
 return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type WorkSource=ReturnType<typeof workRecipe>;
export async function compileWorkModel(input:WorkSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),766n),settings:WorkSettings={candidate:Number(uint(f(profile,2n))),capacity:Number(uint(f(profile,3n))),support:f(profile,4n)===true},recipe=workRecipe(settings);
 for(const n of ['parameters','content','registry'] as const)if(key(decode(recipe[n]))!==key(decode(source[n])))throw Error('WORK_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),778n);
 const modelIdentity=await createModelIdentity({rulesVersion:WORK_VERSION,contentSchemaVersion:WORK_VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:WORK_VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'work-integer-priority/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:WORK_VERSION,registryManifest:await commitManifest(decode(source.registry))});
 const initial=new AuthoritativeState(TASKS.map(t=>({path:taskPath(t),value:old(372,[u(1)])})));
 const pk=(p:StatePath)=>key(statePathPatternValue(pattern(p)));
 function validateState(state:AuthoritativeState){
  decode(enc(state.canonicalValue()));const allowed=new Set([journalPath,...TASKS.map(taskPath),...(settings.candidate===1?[cachePath]:[])].map(pk));
  for(const e of state.entries()){
   if(!allowed.has(pk(e.path)))throw Error('WORK_STATE_PATH');
   if(e.path.rootStateTypeId===373n){if(![1,3].some(n=>key(e.value)===key(old(372,[u(n)]))))throw Error('WORK_STATUS');}
   else if(e.path.rootStateTypeId===771n){const frames=items(f(rec(e.value,780n),1n),'list');if(frames.length>8)throw Error('WORK_JOURNAL_LIMIT');let at=0n;for(const v of frames){const frame=rec(v,769n),time=f(frame,2n);if(typeof time==='boolean'||time.kind!=='signed'||time.value<=at||time.value>10n)throw Error('WORK_JOURNAL_ORDER');at=time.value;uniqueCards(items(f(frame,3n),'list'));}}
   else {const selected=items(f(rec(e.value,781n),1n),'list');if(selected.length>settings.capacity||new Set(selected.map(key)).size!==selected.length||selected.some(v=>![1n,2n,3n].includes(uint(v))))throw Error('WORK_CACHE');}
  }
  for(const t of TASKS)if(!state.read(taskPath(t)).presence)throw Error('WORK_MISSING_TASK');
 }
 return {source,profile,content,settings,modelIdentity,authority,initial,validateState};
}
export type WorkCompiled=Awaited<ReturnType<typeof compileWorkModel>>;
export function uniqueCards(cards:readonly CanonicalValue[]){if(new Set(cards.map(v=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('WORK_CARD');return key(f(v,1n));})).size!==cards.length)throw Error('WORK_DUPLICATE_CARD');}
export async function compileWorkInputs(model:WorkCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(model.initial.canonicalValue()))throw Error('WORK_INITIAL_STATE');
 const values=items(decode(orderedInputs),'list');if(values.length>8)throw Error('WORK_INPUT_LIMIT');let previous=0n;const events:ScheduledEvent[]=[];
 const add=(at:bigint,name:string,payload:CanonicalValue)=>{const n=BigInt(events.length);events.push({eventId:n,eventSequence:n,dueAt:simInstant(at),phase:BigInt(STAGES.find(([s])=>s===name)![1]),eventTypeId:eventId(name),payload,dependencies:list([]),causalParentEventIds:[]});};
 for(const v of values){const original=rec(v,768n),at=f(original,1n);if(typeof at==='boolean'||at.kind!=='signed'||at.value<=previous||at.value>10n)throw Error('WORK_INPUT_TIME');previous=at.value;uniqueCards(items(f(original,2n),'list'));add(at.value,'workspace',list([]));add(at.value,'world',v);}
 TASKS.forEach(t=>add(6n,'deadline',t));
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,runIdentity,runSeed:runSeed.slice()};
}
