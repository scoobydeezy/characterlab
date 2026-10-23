/** social-public/0.1-candidate; explicit observer keys and bounded fan-out. */
import {canonicalEncode as enc,list,text,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
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
import {decodeSocial as decode,socialRecord as r} from './socialCodecs';
export {copyData};
export const SOCIAL_VERSION='social-public/0.1-candidate',sid=(ns:number,name:string)=>typedIdentifier(ns,text(name));
export const OBSERVERS=['a','b'].map(n=>sid(1000,'observer/social/'+n));
export const CHARACTERS=['a','b'].map(n=>semanticReferentFromAuthoredContent(sid(1038,'content/social/'+n)));
export const TARGETS=['a','b'].map(n=>semanticReferentFromAuthoredContent(sid(1038,'content/social/'+n+'/identified-target')));
export const TARGET=semanticReferentFromAuthoredContent(sid(1038,'content/social/target'));
export const TASK=old(371,[TARGET,semanticReferentFromAuthoredContent(sid(1038,'content/social/support-commitment'))]);
export const STAGES=[['probe-a',40],['probe-b',40],['source',110],['observe-a',120],['observe-b',120],['evidence-a',130],['evidence-b',130],['update-a',140],['update-b',140]] as const;
export const eventId=(n:string)=>sid(1001,'event/social/'+n),observerIndex=(n:string)=>n.endsWith('-a')?0:1;
export const personPath=(i:number):StatePath=>({rootStateTypeId:810n,fieldId:1n,selectors:[{kind:'mapKey',key:r(808,[CHARACTERS[i],TARGETS[i]])}]});
export const taskPath:StatePath={rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:TASK}]};
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export interface SocialSettings {privateCommitment:boolean;learningLaw:number;control:number;reverse:boolean;}
export const DEFAULT_SETTINGS:SocialSettings={privateCommitment:true,learningLaw:1,control:1,reverse:false};
export const stageReads=(n:string,s:SocialSettings)=>n==='source'?[taskPath]:n.startsWith('probe')?[personPath(observerIndex(n)),...(s.control===3?[taskPath]:[])]:n.startsWith('update')?[personPath(observerIndex(n)),...(s.control===2?[personPath(1-observerIndex(n))]:[])]:[];
export const stageWrites=(n:string,s:SocialSettings)=>n.startsWith('update')?[personPath(observerIndex(n)),...(s.control===2?[personPath(1-observerIndex(n))]:[])]:[];
export const owner=sid(1025,'authority/person-model');
const ownership=()=>compileMutationAuthorityRegistry([{authorityName:'authority/person-model',ownedLeaves:[0,1].map(i=>({pattern:pattern(personPath(i)),valueGrammar:{kind:'canonical-record' as const,recordTypeId:809n},removalAllowed:false}))}]);
export function socialRecipe(settings:Partial<SocialSettings>={}){
 const s={...DEFAULT_SETTINGS,...settings};if(typeof s.privateCommitment!=='boolean'||typeof s.reverse!=='boolean'||![1,2,3].includes(s.learningLaw)||![1,2,3,4].includes(s.control))throw Error('SOCIAL_PROFILE');
 const parameters=r(803,[text(SOCIAL_VERSION),s.privateCommitment,u(s.learningLaw),u(s.control),s.reverse]),content=r(815,[list(OBSERVERS),list(CHARACTERS),list(TARGETS),TASK]);
 const stages=STAGES.map(([n,phase])=>r(816,[eventId(n),u(phase),list(stageReads(n,s).map(p=>statePathPatternValue(pattern(p)))),list(stageWrites(n,s).map(p=>statePathPatternValue(pattern(p)))),owner]));
 return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type SocialSource=ReturnType<typeof socialRecipe>;
export async function compileSocialModel(input:SocialSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),803n),settings:SocialSettings={privateCommitment:f(profile,2n)===true,learningLaw:Number(uint(f(profile,3n))),control:Number(uint(f(profile,4n))),reverse:f(profile,5n)===true},recipe=socialRecipe(settings);
 for(const n of ['parameters','content','registry'] as const)if(key(decode(recipe[n]))!==key(decode(source[n])))throw Error('SOCIAL_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),815n);
 const modelIdentity=await createModelIdentity({rulesVersion:SOCIAL_VERSION,contentSchemaVersion:SOCIAL_VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:SOCIAL_VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'social-exact-rational/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:SOCIAL_VERSION,registryManifest:await commitManifest(decode(source.registry))});
 const initial=new AuthoritativeState(settings.privateCommitment?[{path:taskPath,value:old(372,[u(1)])}]:[]);
 function validateState(state:AuthoritativeState){
  decode(enc(state.canonicalValue()));const pk=(p:StatePath)=>key(statePathPatternValue(pattern(p))),allowed=new Set([taskPath,personPath(0),personPath(1)].map(pk));
  for(const e of state.entries()){if(!allowed.has(pk(e.path)))throw Error('SOCIAL_STATE_PATH');if(e.path.rootStateTypeId===373n){if(!settings.privateCommitment||key(e.value)!==key(old(372,[u(1)])))throw Error('SOCIAL_PRIVATE_STATE');}else {const b=rec(e.value,809n),n=uint(f(b,2n)),size=BigInt(items(f(b,3n),'set').length);if(n===0n||n>8n||size===0n||size>n||settings.control!==4&&size!==n||settings.learningLaw===3)throw Error('SOCIAL_ESTIMATE');}}
  if(state.read(taskPath).presence!==settings.privateCommitment)throw Error('SOCIAL_PRIVATE_PRESENCE');
 }
 return {source,profile,settings,content,modelIdentity,authority,initial,validateState};
}
export type SocialCompiled=Awaited<ReturnType<typeof compileSocialModel>>;
export function displayedClaim(mode:bigint,committed:boolean){return mode===0n?undefined:mode===1n?committed:mode===2n?!committed:mode===3n;}
export async function compileSocialInputs(model:SocialCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(model.initial.canonicalValue()))throw Error('SOCIAL_INITIAL_STATE');const originals=items(decode(orderedInputs),'list');if(originals.length>8)throw Error('SOCIAL_INPUT_LIMIT');let previous=0n;const events:ScheduledEvent[]=[],receipts=new Map<string,boolean|undefined>(),order=model.settings.reverse?['b','a']:['a','b'];
 for(const v of originals){const o=rec(v,804n),at=f(o,1n);if(typeof at==='boolean'||at.kind!=='signed'||at.value<=previous||at.value>10n)throw Error('SOCIAL_INPUT_TIME');previous=at.value;const serial=uint(f(o,4n)),claim=displayedClaim(uint(f(o,3n)),model.settings.privateCommitment),receipt=key(list([f(o,2n),f(o,4n)]));if(serial>0n){if(receipts.has(receipt)&&receipts.get(receipt)!==claim)throw Error('SOCIAL_RECEIPT_CHANGED');receipts.set(receipt,claim);}
  for(const name of [...order.map(n=>'probe-'+n),'source']){const n=BigInt(events.length);events.push({eventId:n,eventSequence:n,dueAt:simInstant(at.value),phase:name==='source'?110n:40n,eventTypeId:eventId(name),payload:name==='source'?v:list([]),dependencies:list([]),causalParentEventIds:[]});}
 }
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,runIdentity,runSeed:runSeed.slice()};
}
