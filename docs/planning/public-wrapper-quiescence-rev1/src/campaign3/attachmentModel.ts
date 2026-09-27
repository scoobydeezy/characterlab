/** attachment-public/0.1-candidate; independent observer/target/domain owners. */
import {canonicalEncode as enc,list,set,text,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue,type StatePath} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {simInstant} from '../substrate/time';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ACTOR,sid} from './longitudinalModel';
import {copyData} from './beliefModel';
import {receivingRecord as old} from './receivingCodecs';
import {attachmentRecord as r,decodeAttachment as decode} from './attachmentCodecs';
export {ACTOR,sid,copyData};
export const VERSION='attachment-public/0.1-candidate',HOLDERS=['a','b'].map(n=>sid(1000,'observer/attachment/'+n)),TARGETS=['x','y'].map(n=>sid(1000,'target/attachment/'+n));
export const ACTORS=HOLDERS.map((_,i)=>semanticReferentFromAuthoredContent(sid(1038,'actor/attachment/'+i)));
export const OPTIONS=ACTORS.map(a=>[0,1].map(k=>[0,1].map(o=>old(395,[a,sid(1027,'action/attachment/'+k+'/'+o)]))));
export const TASKS=ACTORS.map((a,i)=>[0,1].map(k=>[0,1].map(o=>old(371,[a,semanticReferentFromAuthoredContent(sid(1038,'task/attachment/'+i+'/'+k+'/'+o))]))));
export const STAGES=[['source',0],['cue-a',10],['cue-b',10],['appraise-a',40],['appraise-b',40],['probe-a',60],['probe-b',60],['observe-a',120],['observe-b',120],['history-a',140],['history-b',140],['person-a',140],['person-b',140]] as const;
export const eventId=(n:string)=>sid(1001,'event/attachment/'+n),index=(n:string)=>n.endsWith('-b')?1:0;
export const path=(i:number,t:number,person=false):StatePath=>({rootStateTypeId:person?1257n:1256n,fieldId:1n,selectors:[{kind:'mapKey',key:r(1258,[HOLDERS[i],TARGETS[t]])}]});
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const writes=(n:string)=>n.startsWith('history')||n.startsWith('person')?[0,1].map(t=>path(index(n),t,n.startsWith('person'))):[];
export const reads=(n:string)=>n.startsWith('appraise')?[0,1].flatMap(t=>[path(index(n),t),path(index(n),t,true)]):writes(n);
export const owner=(n:string)=>sid(1025,'authority/attachment/'+(n.startsWith('person')?'person':'history')+'/'+index(n));
const ownership=()=>compileMutationAuthorityRegistry([0,1].flatMap(i=>[false,true].map(person=>({authorityName:'authority/attachment/'+(person?'person':'history')+'/'+i,ownedLeaves:[0,1].map(t=>({pattern:pattern(path(i,t,person)),valueGrammar:{kind:'canonical-record' as const,recordTypeId:person?1255n:1254n},removalAllowed:false}))}))));
export function attachmentRecipe(law=1,goal=1){
 if(![1,2,3,4,5].includes(law)||![1,2].includes(goal))throw Error('ATTACHMENT_PROFILE');const mod=old(439,[q(1,4),u(3)]),dice=old(437,[old(438,[1,2,3,4,5].map(n=>q(n,5))),q(0,1),mod,mod]);
 const parameters=r(1250,[text(VERSION),u(law),u(goal)]),content=r(1263,[list(HOLDERS),list(TARGETS),list(OPTIONS.flat(2)),list(TASKS.flat(2)),dice,list(ACTORS)]),stages=STAGES.map(([n,p])=>r(1262,[eventId(n),u(p),list(reads(n).map(p=>statePathPatternValue(pattern(p)))),list(writes(n).map(p=>statePathPatternValue(pattern(p)))),owner(n)]));return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type AttachmentSource=ReturnType<typeof attachmentRecipe>;
export const instant=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<1n||v.value>16n)throw Error('ATTACHMENT_TIME');return Number(v.value);};
export async function compileAttachmentModel(input:AttachmentSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),1250n),law=Number(uint(f(profile,2n))),goal=Number(uint(f(profile,3n))),recipe=attachmentRecipe(law,goal);for(const n of ['parameters','content','registry'] as const)if(key(decode(source[n]))!==key(decode(recipe[n])))throw Error('ATTACHMENT_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),1263n),modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'attachment-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){decode(enc(state.canonicalValue()));for(const e of state.entries()){
  const match=[0,1].flatMap(i=>[0,1].flatMap(t=>[false,true].map(person=>({i,t,person,p:path(i,t,person)})))).find(x=>key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(x.p))));if(!match)throw Error('ATTACHMENT_STATE_PATH');const {i,t,person}=match;let last=0;const seen=new Set<string>();
  for(const x of items(f(rec(e.value,person?1255n:1254n),1n),'list')){const o=rec(x,1252n),at=instant(f(o,4n));if(at<=last||seen.has(key(f(o,1n)))||key(f(o,2n))!==key(HOLDERS[i])||key(f(o,3n))!==key(TARGETS[t])||(person?!items(f(o,7n),'list').length:f(o,5n)!==true||!items(f(o,6n),'list').length))throw Error('ATTACHMENT_EVIDENCE');last=at;seen.add(key(f(o,1n)));}
 }}return {source,law,goal,content,authority,modelIdentity,validateState};
}
export type AttachmentCompiled=Awaited<ReturnType<typeof compileAttachmentModel>>;
export async function compileAttachmentInputs(model:AttachmentCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(set([])))throw Error('ATTACHMENT_INITIAL_STATE');const originals=items(decode(orderedInputs),'list');if(!originals.length||originals.length>8)throw Error('ATTACHMENT_INPUT_COUNT');let last=0;
 const events:ScheduledEvent[]=originals.map((v,i)=>{const o=rec(v,1251n),at=instant(f(o,1n));if(at<=last)throw Error('ATTACHMENT_INPUT_ORDER');last=at;return {eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(at)),phase:0n,eventTypeId:eventId('source'),payload:v,dependencies:list([]),causalParentEventIds:[]};});
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,runIdentity,runSeed:runSeed.slice()};
}
