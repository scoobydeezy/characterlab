/** chosen-reappraisal-public/0.1-candidate: exact native source and disjoint ownership. */
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
import {chosenReappraisalPublicRecord as r,decodeChosenReappraisalPublic as decode} from './chosenReappraisalPublicCodecs';
import {reappraisalRecord as old} from './reappraisalCodecs';
import {emptyKnowledge} from './reappraisalMath';
import {LAWS,chosenContent,validateFrames,type Law,type Frame} from './chosenReappraisal';
export {ACTOR,sid,OBSERVER,path,pattern,copyData};
export const VERSION='chosen-reappraisal-public/0.1-candidate';
export const STAGES=[['context',40],['appraise',50],['reasons',52],['decision',60],['intent',70],['expression',80],['plan',90],['attempt',100],['complete',110],['observe',120],['learn',140],['frame',140]] as const;
export const eventId=(name:string)=>sid(1001,'event/chosen-reappraisal/'+name);
export const reads=(n:string)=>n==='context'?[path(1462)]:n==='appraise'?[path(1029),path(1031)]:n==='reasons'||n==='learn'?[path(1029)]:n==='frame'?[path(1031)]:[];
export const writes=(n:string)=>n==='context'?[path(1462)]:n==='learn'?[path(1029)]:n==='frame'?[path(1031)]:[];
export const owner=(n:string)=>sid(1025,'authority/chosen-reappraisal/'+n);
const ownership=()=>compileMutationAuthorityRegistry(['context','learn','frame'].map(n=>({authorityName:(owner(n).payload as {value:string}).value,ownedLeaves:writes(n).map(p=>({pattern:pattern(p),valueGrammar:{kind:'canonical-record' as const,recordTypeId:n==='context'?1461n:n==='learn'?1028n:1030n},removalAllowed:false}))})));
export function chosenReappraisalPublicRecipe(law:Law='BenefitRelative',projection=1){
 if(!LAWS.includes(law)||![1,2].includes(projection))throw Error('CHOSEN_PUBLIC_PROFILE');
 const parameters=r(1459,[text(VERSION),text(law),u(projection)]),content=chosenContent(),stages=STAGES.map(([n,p])=>old(1037,[eventId(n),u(p),list(reads(n).map(p=>statePathPatternValue(pattern(p)))),list(writes(n).map(p=>statePathPatternValue(pattern(p)))),owner(n)]));
 return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type ChosenReappraisalPublicSource=ReturnType<typeof chosenReappraisalPublicRecipe>;
export async function compileChosenReappraisalPublicModel(input:ChosenReappraisalPublicSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),1459n),l=f(profile,2n);if(typeof l==='boolean'||l.kind!=='text')throw Error('CHOSEN_PUBLIC_LAW');
 const law=l.value as Law,projection=Number(uint(f(profile,3n))),recipe=chosenReappraisalPublicRecipe(law,projection);for(const n of ['parameters','content','registry'] as const)if(key(decode(source[n]))!==key(decode(recipe[n])))throw Error('CHOSEN_PUBLIC_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),appraisalModel=await compileReappraisalModel(reappraisalRecipe(1,projection)),modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(decode(source.content)),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'chosen-reappraisal-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){
  decode(enc(state.canonicalValue()));let goals=0,knowledge=0;
  for(const e of state.entries()){
   const root=[1462,1029,1031].find(n=>key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(path(n)))));if(!root)throw Error('CHOSEN_PUBLIC_STATE_PATH');
   if(root===1462){rec(e.value,1461n);goals++;}else if(root===1029){rec(e.value,1028n);knowledge++;}else if(law==='NoReappraisal')throw Error('CHOSEN_PUBLIC_DISABLED_FRAME');
  }
  if(goals!==1||knowledge!==1)throw Error('CHOSEN_PUBLIC_ROOTS');
  appraisalModel.validateState(new AuthoritativeState(state.entries().filter(e=>e.path.rootStateTypeId!==1462n)));
 }
 return {source,law,projection,authority,modelIdentity,appraisalModel,validateState};
}
export type ChosenReappraisalPublicCompiled=Awaited<ReturnType<typeof compileChosenReappraisalPublicModel>>;
export function chosenReappraisalOriginals(frames:readonly Frame[]){validateFrames(frames);return enc(list(frames.map(x=>r(1460,[u(x.at),u(x.condition),x.physical,x.display,x.observed,u(x.catalogue),x.catalogueObserved,x.opportunity,x.complete,u(x.safety),u(x.work)]))));}
export async function compileChosenReappraisalPublicInputs(model:ChosenReappraisalPublicCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(set([])))throw Error('CHOSEN_PUBLIC_INITIAL_STATE');if(runSeed.length!==32||!runSeed.every(x=>x===runSeed[0]))throw Error('CHOSEN_PUBLIC_SEED');
 const originals=items(decode(orderedInputs),'list'),frames=originals.map(v=>{const o=rec(v,1460n);return {at:Number(uint(f(o,1n))),condition:Number(uint(f(o,2n))),physical:f(o,3n) as boolean,display:f(o,4n) as boolean,observed:f(o,5n) as boolean,catalogue:Number(uint(f(o,6n))),catalogueObserved:f(o,7n) as boolean,opportunity:f(o,8n) as boolean,complete:f(o,9n) as boolean,safety:Number(uint(f(o,10n))),work:Number(uint(f(o,11n)))};});validateFrames(frames);
 const events:ScheduledEvent[]=originals.map((v,i)=>({eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(i+1)),phase:40n,eventTypeId:eventId('context'),payload:v,dependencies:list([]),causalParentEventIds:[]}));
 const state=new AuthoritativeState([{path:path(1029),value:emptyKnowledge()},{path:path(1462),value:r(1461,[u(0),u(0)])}]);model.validateState(state);
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,state,runIdentity,runSeed:runSeed.slice()};
}
