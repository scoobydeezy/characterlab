/** affect-public/0.1-candidate: exact finite successor, never widens BELIEF. */
import {canonicalEncode as enc,list,set,text,unsigned as u,rational,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue,type StatePath} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {simInstant} from '../substrate/time';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import type {ScheduledEvent} from '../substrate/scheduler';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {receivingRecord as old} from './receivingCodecs';
import {copyData,validateEstimate} from './beliefModel';
import {multisourceBase} from './multisourceModelRecipe';
import {decodeAffect as decode,affectRecord as r} from './affectCodecs';
export {copyData};
export const AFFECT_VERSION='affect-public/0.1-candidate',OBSERVER_NAME='observer/affect-trial';
export const aid=(ns:number,name:string)=>typedIdentifier(ns,text(name));
export const OBSERVER=aid(1000,OBSERVER_NAME),CHARACTER=semanticReferentFromAuthoredContent(aid(1038,'content/affect/character'));
export const PROPOSITIONS=['current','baseline','mitigated'].map(n=>aid(1027,'proposition/affect/'+n));
export const TASKS=['safety','obligation'].map(n=>old(371,[CHARACTER,semanticReferentFromAuthoredContent(aid(1038,'content/affect/'+n))]));
export const OPTIONS=['mitigate','continue'].map(n=>old(395,[CHARACTER,aid(1027,'action/affect/'+n)]));
export const STAGES=[['appraise',50],['raw',51],['reasons',52],['decision',60],['intent',70],['expression',80],['plan',90],['attempt',100],['outcome',110],['world',110],['observe',120],['track',121],['freeze',124],['evidence',130],['apply',140]] as const;
export const eventId=(n:string)=>aid(1001,'event/affect/'+n);
export const beliefKey=(p:CanonicalValue)=>r(765,[CHARACTER,p]);
export const beliefPath=(p:CanonicalValue):StatePath=>({rootStateTypeId:753n,fieldId:1n,selectors:[{kind:'mapKey',key:beliefKey(p)}]});
export const taskPath=(t:CanonicalValue):StatePath=>({rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:t}]});
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
const ownership=()=>compileMutationAuthorityRegistry([{authorityName:'authority/belief-expectation',ownedLeaves:PROPOSITIONS.map(p=>({pattern:pattern(beliefPath(p)),valueGrammar:{kind:'canonical-record' as const,recordTypeId:739n},removalAllowed:false}))}]);
export const stageReads=(name:string)=>name==='appraise'||name==='apply'?PROPOSITIONS.map(beliefPath):name==='raw'?TASKS.map(taskPath):[];
export interface AffectSettings {candidate:number;controlLaw:number;learningLaw:number;feedback:boolean;severity:number;obligation:number;safety:number;execution:boolean;}
export const DEFAULT_SETTINGS:AffectSettings={candidate:2,controlLaw:1,learningLaw:1,feedback:false,severity:1,obligation:1,safety:1,execution:true};
export function affectRecipe(settings:Partial<AffectSettings>={}){
 const s={...DEFAULT_SETTINGS,...settings};
 if(![1,2,3].includes(s.candidate)||![1,2].includes(s.controlLaw)||![1,2,3].includes(s.learningLaw)||![0,.5,1].includes(s.severity)||![0,.1,1,10].includes(s.obligation)||![0,1].includes(s.safety)||typeof s.feedback!=='boolean'||typeof s.execution!=='boolean')throw Error('AFFECT_PROFILE');
 const q=(n:number)=>rational(BigInt(Math.round(n*10)),10n),base=multisourceBase();
 const parameters=r(747,[text(AFFECT_VERSION),u(s.candidate),u(s.controlLaw),u(s.learningLaw),s.feedback,q(s.severity),q(s.obligation),q(s.safety),s.execution]);
 const content=r(764,[OBSERVER,CHARACTER,list(PROPOSITIONS),list(TASKS),list(OPTIONS),old(437,[f(rec(base.get('task-reason-dice'),437n),1n),rational(0,1),old(439,[rational(1,4),u(3)]),old(439,[rational(1,4),u(3)])]),base.get('task-arbitration')]);
 const stages=STAGES.map(([name,phase])=>r(763,[eventId(name),u(phase),list(stageReads(name).map(p=>statePathPatternValue(pattern(p)))),list(name==='apply'?PROPOSITIONS.map(p=>statePathPatternValue(pattern(beliefPath(p)))):[]),aid(1025,'authority/belief-expectation')]));
 return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type AffectSource=ReturnType<typeof affectRecipe>;
export async function compileAffectModel(input:AffectSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),747n),num=(n:bigint)=>{const v=f(profile,n);if(typeof v==='boolean'||v.kind!=='rational')throw Error('AFFECT_PROFILE_Q');return Number(v.numerator)/Number(v.denominator);};
 const settings:AffectSettings={candidate:Number(uint(f(profile,2n))),controlLaw:Number(uint(f(profile,3n))),learningLaw:Number(uint(f(profile,4n))),feedback:f(profile,5n)===true,severity:num(6n),obligation:num(7n),safety:num(8n),execution:f(profile,9n)===true},recipe=affectRecipe(settings);
 for(const n of ['parameters','content','registry'] as const)if(key(decode(recipe[n]))!==key(decode(source[n])))throw Error('AFFECT_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),764n);
 const modelIdentity=await createModelIdentity({rulesVersion:AFFECT_VERSION,contentSchemaVersion:AFFECT_VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:AFFECT_VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'affect-exact-rational/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:AFFECT_VERSION,registryManifest:await commitManifest(decode(source.registry))});
 const initial=new AuthoritativeState(TASKS.map(t=>({path:taskPath(t),value:old(372,[u(1)])})));
 function validateState(state:AuthoritativeState){
  decode(enc(state.canonicalValue()));const allowed=new Set([...PROPOSITIONS.map(beliefPath),...TASKS.map(taskPath)].map(p=>key(statePathPatternValue(pattern(p)))));
  for(const entry of state.entries()){if(!allowed.has(key(statePathPatternValue(pattern(entry.path)))))throw Error('AFFECT_STATE_PATH');if(entry.path.rootStateTypeId===753n){validateEstimate(entry.value);if(settings.learningLaw===3)throw Error('AFFECT_NO_LEARNING_STATE');}else if(key(entry.value)!==key(old(372,[u(1)])))throw Error('AFFECT_COMMITMENT_STATE');}
  for(const t of TASKS)if(!state.read(taskPath(t)).presence)throw Error('AFFECT_MISSING_COMMITMENT');
  const support=state.entries().filter(e=>e.path.rootStateTypeId===753n).flatMap(e=>items(f(rec(e.value,739n),3n),'set').map(key));if(new Set(support).size!==support.length)throw Error('AFFECT_CROSS_TARGET_SUPPORT');
 }
 return {source,profile,content,settings,modelIdentity,authority,initial,validateState};
}
export type AffectCompiled=Awaited<ReturnType<typeof compileAffectModel>>;
export async function compileAffectInputs(model:AffectCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(model.initial.canonicalValue()))throw Error('AFFECT_INITIAL_STATE');
 const values=items(decode(orderedInputs),'list');if(values.length>17)throw Error('AFFECT_INPUT_LIMIT');
 let previous=0n,frames=0;const events:ScheduledEvent[]=[];
 for(const v of values){const original=rec(v,749n),at=f(original,1n);if(typeof at==='boolean'||at.kind!=='signed'||at.value<=previous||at.value>64n)throw Error('AFFECT_INPUT_TIME');previous=at.value;if(original.fields.has(2n))frames++;
  for(const name of ['appraise','world']){const phase=STAGES.find(([n])=>n===name)![1],n=BigInt(events.length);events.push({eventId:n,eventSequence:n,dueAt:simInstant(at.value),phase:BigInt(phase),eventTypeId:eventId(name),payload:name==='world'?v:list([]),dependencies:list([]),causalParentEventIds:[]});}
 }
 if(frames>15)throw Error('AFFECT_PANEL_LIMIT');
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});
 return {events,runIdentity,runSeed:runSeed.slice()};
}
