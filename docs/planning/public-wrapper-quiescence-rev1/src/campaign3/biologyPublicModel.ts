/** biology-public/0.1-candidate: canonical data admission and disjoint authority. */
import {canonicalEncode as enc,list,text,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue,type StatePath} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {simInstant} from '../substrate/time';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataText} from '../campaign2/canonicalData';
import {copyData} from './biologyPublicBytes';
import {biologyPublicRecord as r,decodeBiologyPublic as decode} from './biologyPublicCodecs';
import {data,value} from './biologyPublicData';
import {biologicalConfig,createBiologicalRun,type IntegrationConfig,type IntegrationLaw,type BiologicalFrame} from './biologicalIntegration';
import {CHANNELS,validateBiology,type BiologyState} from './biologicalDynamics';
import {admitBody,admitConfig,admitFrame} from './biologyPublicAdmission';
export {copyData};
export const VERSION='biology-public/0.1-candidate';
export const sid=(ns:number,name:string)=>typedIdentifier(ns,text(name));
export const OBSERVER=sid(1000,'observer/biology');
export const ACTOR=semanticReferentFromAuthoredContent(sid(1038,'content/biology/actor'));
export const STAGES=[['passive',0],['sense',10],['goals',30],['appraise',40],['options',50],['reasons',52],['decision',60],['intent',70],['expression',80],['attempt',100],['execution',110],['observe',120],['learn',140],['adapt',140]] as const;
export const eventId=(n:string)=>sid(1001,'event/biology/'+n);
export const path=(root:number):StatePath=>({rootStateTypeId:BigInt(root),fieldId:1n,selectors:[{kind:'mapKey',key:ACTOR}]});
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const roots=[1422,1423,1424,1425,1426];
const rootTypes=[1404,1405,1406,1407,1408];
export const reads=(n:string)=>({passive:[1422,1423],sense:[1422,1423],goals:[1425],appraise:[1424,1425,1426],execution:[1422,1423],observe:[1422,1423],learn:[1424],adapt:[1423]}[n]??[]).map(path);
export const writes=(n:string)=>({passive:[1422],goals:[1425],appraise:[1426],execution:[1422],learn:[1424],adapt:[1423]}[n]??[]).map(path);
export const owner=(n:string)=>sid(1025,'authority/biology/'+({passive:'physical',execution:'physical',appraise:'affect'}[n]??n));
const ownership=()=>compileMutationAuthorityRegistry(['execution','adapt','learn','goals','appraise'].map(n=>({authorityName:(owner(n).payload as {value:string}).value,ownedLeaves:writes(n).map(p=>({pattern:pattern(p),valueGrammar:{kind:'canonical-record' as const,recordTypeId:BigInt(rootTypes[roots.indexOf(Number(p.rootStateTypeId))])},removalAllowed:false}))})));
export function split(body:BiologyState){const physical=structuredClone(body),adaptation=Object.fromEntries(CHANNELS.map(k=>{const c=physical.channels[k];const a={displacement:c.displacement,tolerance:c.tolerance,sensitization:c.sensitization};delete (c as Partial<typeof c>).displacement;delete (c as Partial<typeof c>).tolerance;delete (c as Partial<typeof c>).sensitization;return [k,a];}));return {physical,adaptation};}
export function join(physical:BiologyState,adaptation:ReturnType<typeof split>['adaptation']):BiologyState {const body=structuredClone(physical);for(const k of CHANNELS)Object.assign(body.channels[k],structuredClone(adaptation[k]));validateBiology(body);return body;}
export function biologyRecipe(law:IntegrationLaw='Full',config=biologicalConfig()){
 const {initial,...parameters}=config;void initial;
 return {parameters:enc(r(1401,[text(VERSION),data({law,config:parameters})])),registry:enc(list([ownership().definitionValue,list(STAGES.map(([n,p])=>list([eventId(n),u(p),list(reads(n).map(x=>statePathPatternValue(pattern(x)))),list(writes(n).map(x=>statePathPatternValue(pattern(x)))),owner(n)])))]))};
}
export type BiologySource=ReturnType<typeof biologyRecipe>;
export const initialBytes=(body:BiologyState)=>enc(r(1402,[data(body)]));
export const orderedBytes=(frames:readonly BiologicalFrame[])=>enc(list(frames.map((v,i)=>r(1403,[u(i+1),data(v)]))));
export async function compileBiologyModel(input:BiologySource){
 const source=copyData(input,['parameters','registry']),profile=rec(decode(source.parameters),1401n);
 if(dataText(f(profile,1n))!==VERSION)throw Error('BIOLOGY_VERSION');
 const parsed=value<{law:IntegrationLaw;config:Omit<IntegrationConfig,'initial'>}>(f(profile,2n));
 if(Object.keys(parsed).sort().join()!=='config,law')throw Error('BIOLOGY_PROFILE_FIELDS');
 const config={...parsed.config,initial:biologicalConfig().initial};
 admitConfig(parsed.law,config);
 const recipe=biologyRecipe(parsed.law,config);
 if(key(decode(recipe.parameters))!==key(profile)||key(decode(recipe.registry))!==key(decode(source.registry)))throw Error('BIOLOGY_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities);
 const modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(data(parsed.config)),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'biology-exact-lattice/1000-ties-even',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){decode(enc(state.canonicalValue()));if(state.entries().length!==5)throw Error('BIOLOGY_STATE_ROOTS');for(const e of state.entries()){const index=roots.findIndex(n=>key(statePathPatternValue(pattern(path(n))))===key(statePathPatternValue(pattern(e.path))));if(index<0)throw Error('BIOLOGY_STATE_PATH');rec(e.value,BigInt(rootTypes[index]));}join(value(f(rec(state.read(path(1422)).value!,1404n),1n)),value(f(rec(state.read(path(1423)).value!,1405n),1n)));}
 return {source,law:parsed.law,config,authority,modelIdentity,validateState};
}
export type BiologyCompiled=Awaited<ReturnType<typeof compileBiologyModel>>;
export async function compileBiologyInputs(model:BiologyCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(runSeed.length!==32||!runSeed.every(b=>b===runSeed[0]))throw Error('BIOLOGY_SEED_PROFILE');
 const body=value<BiologyState>(f(rec(decode(initialState),1402n),1n)),originals=items(decode(orderedInputs),'list');
 admitBody(body);
 if(body.at!==0)throw Error('BIOLOGY_INITIAL_CLOCK');
 const frames=originals.map((v,i)=>{const row=rec(v,1403n);if(uint(f(row,1n))!==BigInt(i+1))throw Error('BIOLOGY_INPUT_ORDER');return value<BiologicalFrame>(f(row,2n));});
 frames.forEach(frame=>admitFrame(frame,{...model.config,initial:body}));
 // Frozen component validator checks all domains without stepping or learning.
 createBiologicalRun(model.law,frames,{...model.config,initial:body},runSeed[0]);
 const {physical,adaptation}=split(body),state=new AuthoritativeState([r(1404,[data(physical)]),r(1405,[data(adaptation)]),r(1406,[data([])]),r(1407,[data({protection:false,work:false,maintained:false})]),r(1408,[data(null)])].map((v,i)=>({path:path(roots[i]),value:v})));
 model.validateState(state);
 const events:ScheduledEvent[]=originals.map((v,i)=>({eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(i+1)),phase:0n,eventTypeId:eventId('passive'),payload:v,dependencies:list([]),causalParentEventIds:[]}));
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});
 return {state,events,frames,runIdentity,runSeed:runSeed.slice()};
}
