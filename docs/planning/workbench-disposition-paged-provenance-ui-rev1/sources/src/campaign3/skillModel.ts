/** skill-public/0.1-candidate: separately owned procedural adaptation and belief. */
import {canonicalEncode as enc,list,text,unsigned as u,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
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
import {decodeSkill as decode,skillRecord as r} from './skillCodecs';
export {copyData};
export const SKILL_VERSION='skill-public/0.1-candidate',sid=(ns:number,name:string)=>typedIdentifier(ns,text(name));
export const OBSERVER=sid(1000,'observer/skill'),CHARACTER=semanticReferentFromAuthoredContent(sid(1038,'content/skill/character'));
export const TASK=old(371,[CHARACTER,semanticReferentFromAuthoredContent(sid(1038,'content/skill/exercise'))]),OPTION=old(395,[CHARACTER,sid(1027,'action/skill/exercise')]);
export const STAGES=[['appraise',40],['raw',51],['reasons',52],['decision',60],['intent',70],['expression',80],['plan',90],['attempt',100],['execute',110],['observe',120],['adapt',140],['learn',140]] as const;
export const eventId=(n:string)=>sid(1001,'event/skill/'+n);
export const skillPath:StatePath={rootStateTypeId:785n,fieldId:1n,selectors:[{kind:'mapKey',key:CHARACTER}]},beliefPath:StatePath={...skillPath,rootStateTypeId:787n},taskPath:StatePath={rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:TASK}]};
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export interface SkillSettings {initial:number;practiceLaw:number;executionLaw:number;permanent:boolean;beliefLaw:number;}
export const DEFAULT_SETTINGS:SkillSettings={initial:.5,practiceLaw:1,executionLaw:1,permanent:false,beliefLaw:1};
export const stageReads=(n:string,s:SkillSettings)=>n==='appraise'||n==='learn'?[beliefPath]:n==='raw'?[taskPath]:n==='adapt'?[skillPath]:n==='execute'?[skillPath,...(s.executionLaw===3?[beliefPath]:[])]:[];
export const stageWrites=(n:string)=>n==='adapt'?[skillPath]:n==='learn'?[beliefPath]:[];
export const owner=(n:string)=>sid(1025,n==='adapt'?'authority/procedural-skill':'authority/capability-belief');
const ownership=()=>compileMutationAuthorityRegistry([{authorityName:'authority/procedural-skill',ownedLeaves:[{pattern:pattern(skillPath),valueGrammar:{kind:'canonical-record',recordTypeId:784n},removalAllowed:false}]},{authorityName:'authority/capability-belief',ownedLeaves:[{pattern:pattern(beliefPath),valueGrammar:{kind:'canonical-record',recordTypeId:786n},removalAllowed:false}]}]);
export function skillRecipe(settings:Partial<SkillSettings>={}){
 const s={...DEFAULT_SETTINGS,...settings};if(![0,.5,1].includes(s.initial)||![1,2,3].includes(s.practiceLaw)||![1,2,3,4].includes(s.executionLaw)||![1,2,3].includes(s.beliefLaw)||typeof s.permanent!=='boolean')throw Error('SKILL_PROFILE');
 const base=multisourceBase(),parameters=r(782,[text(SKILL_VERSION),q(s.initial*2,2),u(s.practiceLaw),u(s.executionLaw),s.permanent,u(s.beliefLaw)]),content=r(801,[OBSERVER,CHARACTER,TASK,OPTION,base.get('task-reason-dice')]);
 const stages=STAGES.map(([n,phase])=>r(802,[eventId(n),u(phase),list(stageReads(n,s).map(p=>statePathPatternValue(pattern(p)))),list(stageWrites(n).map(p=>statePathPatternValue(pattern(p)))),owner(n)]));
 return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type SkillSource=ReturnType<typeof skillRecipe>;
export async function compileSkillModel(input:SkillSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),782n),initial=f(profile,2n);if(typeof initial==='boolean'||initial.kind!=='rational')throw Error('SKILL_INITIAL');
 const settings:SkillSettings={initial:Number(initial.numerator)/Number(initial.denominator),practiceLaw:Number(uint(f(profile,3n))),executionLaw:Number(uint(f(profile,4n))),permanent:f(profile,5n)===true,beliefLaw:Number(uint(f(profile,6n)))},recipe=skillRecipe(settings);
 for(const n of ['parameters','content','registry'] as const)if(key(decode(recipe[n]))!==key(decode(source[n])))throw Error('SKILL_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),801n);
 const modelIdentity=await createModelIdentity({rulesVersion:SKILL_VERSION,contentSchemaVersion:SKILL_VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:SKILL_VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'skill-exact-rational/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:SKILL_VERSION,registryManifest:await commitManifest(decode(source.registry))});
 const initialState=new AuthoritativeState([{path:taskPath,value:old(372,[u(1)])},{path:skillPath,value:r(784,[initial,u(0)])}]);
 function validateState(state:AuthoritativeState){
  decode(enc(state.canonicalValue()));const pk=(p:StatePath)=>key(statePathPatternValue(pattern(p))),allowed=new Set([taskPath,skillPath,beliefPath].map(pk));
  for(const e of state.entries()){if(!allowed.has(pk(e.path)))throw Error('SKILL_STATE_PATH');if(e.path.rootStateTypeId===373n){if(key(e.value)!==key(old(372,[u(1)])))throw Error('SKILL_TASK_STATE');}else if(e.path.rootStateTypeId===785n){if(uint(f(rec(e.value,784n),2n))>8n)throw Error('SKILL_PRACTICE_BOUND');}else {const b=rec(e.value,786n),n=uint(f(b,2n));if(n===0n||n!==BigInt(items(f(b,3n),'set').length)||n>8n||settings.beliefLaw===3)throw Error('SKILL_BELIEF_STATE');}}
  for(const p of [taskPath,skillPath])if(!state.read(p).presence)throw Error('SKILL_MISSING_STATE');
 }
 return {source,profile,settings,content,modelIdentity,authority,initial:initialState,validateState};
}
export type SkillCompiled=Awaited<ReturnType<typeof compileSkillModel>>;
export async function compileSkillInputs(model:SkillCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(model.initial.canonicalValue()))throw Error('SKILL_INITIAL_STATE');const originals=items(decode(orderedInputs),'list');if(originals.length>8)throw Error('SKILL_INPUT_LIMIT');let previous=0n;
 const events:ScheduledEvent[]=originals.map((v,i)=>{const o=rec(v,783n),t=f(o,1n);if(typeof t==='boolean'||t.kind!=='signed'||t.value<=previous||t.value>10n)throw Error('SKILL_INPUT_TIME');previous=t.value;return {eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(t.value),phase:40n,eventTypeId:eventId('appraise'),payload:v,dependencies:list([]),causalParentEventIds:[]};});
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,runIdentity,runSeed:runSeed.slice()};
}
