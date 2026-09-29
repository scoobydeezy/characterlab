/** embarrassment-public/0.2-candidate: exact native source and disjoint ownership. */
import {canonicalEncode as enc,list,set,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {simInstant} from '../substrate/time';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ACTOR,sid,OBSERVER,path,pattern,compileReappraisalModel,reappraisalRecipe} from './reappraisalModel';
import {copyData} from './biologyPublicBytes';
import {embarrassmentPublicRecord as r,decodeEmbarrassmentPublic as decode} from './embarrassmentPublicCodecs';
import {reappraisalRecord as old} from './reappraisalCodecs';
import {readHistory,historyValue} from './embarrassmentPublicMath';
import {LAWS,embarrassmentContent,validateFrames,type Law,type Frame} from './embarrassment';
export {ACTOR,sid,OBSERVER,path,pattern,copyData};
export const VERSION='embarrassment-public/0.2-candidate';
export const STAGES=[['context',40],['appraise',50],['reasons',52],['decision',60],['intent',70],['expression',80],['plan',90],['attempt',100],['complete',110],['display',110],['observe',120],['learn',140]] as const;
export const eventId=(name:string)=>sid(1001,'event/embarrassment/'+name);
export const reads=(n:string)=>n==='context'?[path(1471)]:n==='appraise'||n==='learn'?[path(1474)]:n==='complete'?[path(1476)]:[];
export const writes=(n:string)=>n==='context'?[path(1471)]:n==='learn'?[path(1474)]:n==='complete'?[path(1476)]:[];
export const owner=(n:string)=>sid(1025,'authority/embarrassment/'+n);
const ownership=()=>compileMutationAuthorityRegistry(['context','learn','complete'].map(n=>({authorityName:(owner(n).payload as {value:string}).value,ownedLeaves:writes(n).map(p=>({pattern:pattern(p),valueGrammar:{kind:'canonical-record' as const,recordTypeId:n==='context'?1470n:n==='learn'?1473n:1475n},removalAllowed:false}))})));
export function embarrassmentPublicRecipe(law:Law='Contextual',projection=2){
 if(!LAWS.includes(law)||![2,3].includes(projection))throw Error('EMBARRASSMENT_PUBLIC_PROFILE');
 const parameters=r(1468,[text(VERSION),text(law),u(projection)]),content=embarrassmentContent(law),stages=STAGES.map(([n,p])=>old(1037,[eventId(n),u(p),list(reads(n).map(p=>statePathPatternValue(pattern(p)))),list(writes(n).map(p=>statePathPatternValue(pattern(p)))),owner(n)]));
 return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type EmbarrassmentPublicSource=ReturnType<typeof embarrassmentPublicRecipe>;
export async function compileEmbarrassmentPublicModel(input:EmbarrassmentPublicSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),1468n),l=f(profile,2n);if(typeof l==='boolean'||l.kind!=='text')throw Error('EMBARRASSMENT_PUBLIC_LAW');
 const law=l.value as Law,projection=Number(uint(f(profile,3n))),recipe=embarrassmentPublicRecipe(law,projection);for(const n of ['parameters','content','registry'] as const)if(key(decode(source[n]))!==key(decode(recipe[n])))throw Error('EMBARRASSMENT_PUBLIC_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(decode(source.content)),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'embarrassment-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){decode(enc(state.canonicalValue()));const found=new Set<number>();for(const e of state.entries()){const root=[1471,1474,1476].find(n=>key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(path(n)))));if(!root||found.has(root))throw Error('EMBARRASSMENT_STATE_PATH');found.add(root);if(root===1474)readHistory(e.value);else rec(e.value,root===1471?1470n:1475n);}if(found.size!==3)throw Error('EMBARRASSMENT_ROOTS');}
 return {source,law,projection,authority,modelIdentity,validateState};
}

export type EmbarrassmentPublicCompiled=Awaited<ReturnType<typeof compileEmbarrassmentPublicModel>>;
export const originalFields=['at','worldMismatch','worldSeen','worldJudgment','mismatch','mismatchAccess','seen','seenAccess','judgment','judgmentAccess','reputation','avoid','participate','opportunity','complete','display'] as const;
export function embarrassmentOriginals(frames:readonly Frame[]){validateFrames(frames);return enc(list(frames.map(x=>r(1469,originalFields.map(k=>typeof x[k]==='number'?u(x[k] as number):x[k] as boolean)))));}
export async function compileEmbarrassmentPublicInputs(model:EmbarrassmentPublicCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(set([])))throw Error('EMBARRASSMENT_INITIAL_STATE');if(runSeed.length!==32||!runSeed.every(x=>x===runSeed[0]))throw Error('EMBARRASSMENT_SEED');
 const originals=items(decode(orderedInputs),'list'),frames=originals.map(v=>{const o=rec(v,1469n);return Object.fromEntries(originalFields.map((k,i)=>[k,[0,10,11,12].includes(i)?Number(uint(f(o,BigInt(i+1)))):f(o,BigInt(i+1))])) as unknown as Frame;});validateFrames(frames);
 const events:ScheduledEvent[]=originals.map((v,i)=>({eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(i+1)),phase:40n,eventTypeId:eventId('context'),payload:v,dependencies:list([]),causalParentEventIds:[]}));
 const state=new AuthoritativeState([{path:path(1471),value:r(1470,[u(0),u(0),u(0)])},{path:path(1474),value:historyValue([[],[],[]])},{path:path(1476),value:r(1475,[true])}]);model.validateState(state);
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,state,runIdentity,runSeed:runSeed.slice()};
}
