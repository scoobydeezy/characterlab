/** reason-public/0.3-candidate: closed governed source contexts and five comparisons. */
import {canonicalEncode as enc,list,set,text,unsigned as u,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue,type StatePath} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {simInstant} from '../substrate/time';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import type {ScheduledEvent} from '../substrate/scheduler';
import {validateIdentityHistory} from '../campaign2/cognitiveMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {receivingRecord as old} from './receivingCodecs';
import {ACTOR,TASKS,OPTIONS,sid} from './longitudinalModel';
import {copyData} from './beliefModel';
import {reasonRecord as r,decodeReason as decode} from './reasonCodecs';
export {ACTOR,OPTIONS,sid,copyData};
export const VERSION='reason-public/0.3-candidate',OBSERVER=sid(1000,'observer/reason'),MOTIVES=['Commitment','Safety'].map(n=>sid(1040,n));
export const STAGES=[['source',10],['freeze',14],['context',40],['raw',51],['reasons',52],['decision',60],['expression',80],['qualification',130],['learn',140]] as const;
export const eventId=(n:string)=>sid(1001,'event/reason/'+n),identityPath:StatePath={rootStateTypeId:925n,fieldId:1n,selectors:[{kind:'mapKey',key:ACTOR}]},identityPattern={...identityPath,selectors:identityPath.selectors.map(selector=>({kind:'exact' as const,selector}))};
export const authorityId=sid(1025,'authority/reason-identity');
export const reads=(n:string)=>['raw','learn'].includes(n)?[identityPattern]:[];
const ownership=()=>compileMutationAuthorityRegistry([{authorityName:'authority/reason-identity',ownedLeaves:[{pattern:identityPattern,valueGrammar:{kind:'canonical-record',recordTypeId:414n},removalAllowed:false}]}]);
const description=(id:number,n:number,d=1,role=1,motive=0,referent=0,channels=[1],option=0)=>r(916,[sid(1027,'description/reason/'+id),OPTIONS[option],MOTIVES[motive],f(rec(TASKS[referent],371n),2n),u(role),q(n,d),set(channels.map(u))]);
export function reasonContexts(){
 const a=()=>description(1,3,4),b=()=>description(2,2,3,1,0,0,[2]),base=(n=1,d=10)=>description(1,n,d),standing=(ref=0)=>description(2,1,1,3,0,ref,[]);
 return {
  same:[a(),b()],motive:[a(),description(2,2,3,1,1,0,[2])],referent:[a(),description(2,2,3,1,0,1,[2])],
  collective:[a(),b(),description(3,1,4,1,0,0,[1,2])],duplicate:[a(),description(2,2,3)],
  signed:[a(),description(2,-2,3,1,0,0,[2])],cancel:[base(1,2),description(2,-1,2,1,0,0,[2])],
  positive:[base(3,4)],negative:[base(-3,4)],weak:[base()],
  weakStanding:[base(),standing()],zeroStanding:[base(0),standing()],strongStanding:[base(1,2),standing()],
  weakSituation:[base(),description(2,1,2,2,0,0,[2])],zeroSituation:[base(0),description(2,1,2,2,0,0,[2])],
  weakContext:[base(),description(2,1,2,4,0,0,[2])],mismatch:[base(),standing(1)],
  otherOption:[a(),description(2,2,3,1,0,0,[2],1)]
 };
}
export const CONTEXT_NAMES=Object.keys(reasonContexts()) as (keyof ReturnType<typeof reasonContexts>)[];
export function reasonRecipe(law=1){
 if(![1,2,3,4,5].includes(law))throw Error('REASON_PROFILE');
 const bands=old(438,[q(1,5),q(2,5),q(3,5),q(4,5),q(1,1)]),modifier=old(439,[q(1,4),u(3)]),dice=old(437,[bands,q(37,100),modifier,modifier]),training=old(437,[bands,q(0,1),modifier,modifier]);
 const parameters=r(913,[text(VERSION),u(law)]),content=r(914,[OBSERVER,ACTOR,list(Object.values(reasonContexts()).map(list)),dice,training]);
 const stages=STAGES.map(([n,phase])=>r(926,[eventId(n),u(phase),list(reads(n).map(statePathPatternValue)),list(n==='learn'?[statePathPatternValue(identityPattern)]:[]),authorityId]));
 return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type ReasonSource=ReturnType<typeof reasonRecipe>;
export async function compileReasonModel(input:ReasonSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),913n),law=Number(uint(f(profile,2n))),recipe=reasonRecipe(law);
 for(const n of ['parameters','content','registry'] as const)if(key(decode(source[n]))!==key(decode(recipe[n])))throw Error('REASON_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),914n);
 const modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'reason-exact-with-identity-lattice/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){decode(enc(state.canonicalValue()));for(const e of state.entries()){if(e.path.rootStateTypeId!==925n||e.path.fieldId!==1n||e.path.selectors.length!==1||e.path.selectors[0].kind!=='mapKey'||key(e.path.selectors[0].key)!==key(ACTOR))throw Error('REASON_STATE_PATH');validateIdentityHistory(items(f(rec(e.value,414n),1n),'list'));}}
 return {source,content,law,modelIdentity,authority,validateState};
}
export type ReasonCompiled=Awaited<ReturnType<typeof compileReasonModel>>;
export async function compileReasonInputs(model:ReasonCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(set([])))throw Error('REASON_INITIAL_STATE');const originals=items(decode(orderedInputs),'list');if(originals.length>16)throw Error('REASON_INPUT_LIMIT');
 const events:ScheduledEvent[]=[];let last=0n;
 for(const value of originals){const v=rec(value,915n),at=f(v,1n),kind=uint(f(v,2n)),context=uint(f(v,3n));if(typeof at==='boolean'||at.kind!=='signed'||at.value<=last||at.value>64n)throw Error('REASON_TIME');last=at.value;if(kind===1n?context!==0n:context<1n||context>BigInt(CONTEXT_NAMES.length))throw Error('REASON_CONTEXT');
  for(const n of ['source','context'])events.push({eventId:BigInt(events.length),eventSequence:BigInt(events.length),dueAt:simInstant(at.value),phase:n==='source'?10n:40n,eventTypeId:eventId(n),payload:value,dependencies:list([]),causalParentEventIds:[]});
 }
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,runIdentity,runSeed:runSeed.slice()};
}
