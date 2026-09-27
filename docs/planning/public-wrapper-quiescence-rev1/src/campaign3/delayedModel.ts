/** delayed-public/0.1-candidate. */
import {canonicalEncode as enc,list,set,text,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue,type StatePath} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {simInstant} from '../substrate/time';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {readQ,ZERO} from '../campaign2/cognitiveMath';
import {copyData} from './beliefModel';
import {multisourceBase} from './multisourceModelRecipe';
import {receivingRecord as old} from './receivingCodecs';
import {delayedRecord as r,decodeDelayed as decode} from './delayedCodecs';
export {copyData};
export const sid=(ns:number,name:string)=>typedIdentifier(ns,text(name));
export const VERSION='delayed-public/0.1-candidate',OBSERVER=sid(1000,'observer/delayed');
export const ACTOR=semanticReferentFromAuthoredContent(sid(1038,'content/delayed/actor'));
export const TASK=old(371,[ACTOR,semanticReferentFromAuthoredContent(sid(1038,'content/delayed/benefit'))]);
export const OPTIONS=['now','later','wait'].map(n=>old(395,[ACTOR,sid(1027,'action/delayed/'+n)]));
export const STAGES=[['appraise',40],['options',50],['raw',51],['reasons',52],['decision',60],['intent',70],['expression',80],['plan',90],['attempt',100],['execution',110],['observe',120],['learn',140]] as const;
export const eventId=(name:string)=>sid(1001,'event/delayed/'+name);
export const path=(root:number):StatePath=>({rootStateTypeId:BigInt(root),fieldId:1n,selectors:[{kind:'mapKey',key:ACTOR}]});
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const reads=(n:string)=>n==='appraise'?[path(1385),path(1394)]:n==='plan'?[path(1394)]:n==='execution'?[path(1394),path(1398)]:n==='learn'?[path(1385)]:[];
export const writes=(n:string)=>n==='plan'?[path(1394)]:n==='execution'?[path(1398)]:n==='learn'?[path(1385)]:[];
export const owner=(n:string)=>sid(1025,'authority/delayed/'+n);
const ownership=()=>compileMutationAuthorityRegistry(['plan','execution','learn'].map(n=>({authorityName:(owner(n).payload as {value:string}).value,ownedLeaves:writes(n).map(p=>({pattern:pattern(p),valueGrammar:{kind:'canonical-record' as const,recordTypeId:n==='plan'?1393n:n==='execution'?1397n:1384n},removalAllowed:false}))})));
export function delayedRecipe(law=1){
 if(![1,2,3].includes(law))throw Error('DELAYED_PROFILE');
 const parameters=r(1377,[text(VERSION),u(law)]),content=r(1378,[ACTOR,OBSERVER,TASK,list(OPTIONS),multisourceBase().get('task-reason-dice')]);
 const stages=STAGES.map(([n,p])=>r(1379,[eventId(n),u(p),list(reads(n).map(p=>statePathPatternValue(pattern(p)))),list(writes(n).map(p=>statePathPatternValue(pattern(p)))),owner(n)]));
 return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type DelayedSource=ReturnType<typeof delayedRecipe>;
export const instant=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<1n||v.value>8n)throw Error('DELAYED_TIME');return Number(v.value);};
export const emptyKnowledge=()=>r(1384,[list([]),list([])]);
export async function compileDelayedModel(input:DelayedSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),1377n),law=Number(uint(f(profile,2n))),recipe=delayedRecipe(law);
 for(const n of ['parameters','content','registry'] as const)if(key(decode(source[n]))!==key(decode(recipe[n])))throw Error('DELAYED_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),1378n);
 const modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'delayed-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){
  decode(enc(state.canonicalValue()));
  for(const e of state.entries()){
   const root=[1385,1394,1398].find(n=>key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(path(n)))));
   if(!root)throw Error('DELAYED_STATE_PATH');
   const v=rec(e.value,root===1385?1384n:root===1394?1393n:1397n);
   if(root===1385){for(const [field,type] of [[1n,1382n],[2n,1383n]])for(const x of items(f(v,field),'list')){const o=rec(x,type);if(key(f(o,2n))!==key(OBSERVER))throw Error('DELAYED_FOREIGN_OBSERVER');const at=instant(f(o,3n));if(type===1382n&&at!==1||type===1383n&&at<2)throw Error('DELAYED_EVIDENCE_TIME');}}
   else {const at=instant(f(v,root===1394?3n:1n));if(at<2||at>6)throw Error('DELAYED_SETTLEMENT_TIME');}
  }
 }
 return {source,content,law,authority,modelIdentity,validateState};
}
export type DelayedCompiled=Awaited<ReturnType<typeof compileDelayedModel>>;
export async function compileDelayedInputs(model:DelayedCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(set([])))throw Error('DELAYED_INITIAL_STATE');
 const originals=items(decode(orderedInputs),'list');if(originals.length!==8)throw Error('DELAYED_COMPLETE_DELIVERY_WINDOW');
 let mode:bigint|undefined;const events:ScheduledEvent[]=[];
 for(const [i,value] of originals.entries()){
  const v=rec(value,1381n),at=instant(f(v,1n));if(at!==i+1)throw Error('DELAYED_INPUT_ORDER');
  const offers=items(f(v,2n),'list');if(offers.length&&at!==1)throw Error('DELAYED_OFFER_WINDOW');
  for(const offer of offers){const o=rec(offer,1380n);if(readQ(f(o,1n)).compare(ZERO)<=0||readQ(f(o,2n)).compare(ZERO)<=0)throw Error('DELAYED_POSITIVE_OFFER');}
  const m=uint(f(v,10n));if(mode!==undefined&&mode!==m)throw Error('DELAYED_RECEIPT_CONFLICT');mode=m;
  events.push({eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(at)),phase:40n,eventTypeId:eventId('appraise'),payload:value,dependencies:list([]),causalParentEventIds:[]});
 }
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});
 return {events,runIdentity,runSeed:runSeed.slice()};
}
