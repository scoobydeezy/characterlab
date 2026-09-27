/** hearsay-public/0.1-candidate; exact bounded evidence and independent owners. */
import {canonicalEncode as enc,list,set,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
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
import {hearsayRecord as r,decodeHearsay as decode} from './hearsayCodecs';
export {ACTOR,sid,copyData};
export const VERSION='hearsay-public/0.1-candidate',TARGET=sid(1000,'target/hearsay'),HOLDERS=['speaker','a','b'].map(n=>sid(1000,'observer/hearsay/'+n)),INCIDENT=semanticReferentFromAuthoredContent(sid(1038,'incident/hearsay'));
export const STAGES=[['source',0],['private',10],['learn-private',30],['infer-a',40],['infer-b',40],['appraise-a',50],['appraise-b',50],['report',110],['observe-a',120],['observe-b',120],['learn-a',140],['learn-b',140]] as const;
export const eventId=(n:string)=>sid(1001,'event/hearsay/'+n),index=(n:string)=>n.endsWith('-a')?1:n.endsWith('-b')?2:0;
export const path=(i:number):StatePath=>({rootStateTypeId:1201n,fieldId:1n,selectors:[{kind:'mapKey',key:HOLDERS[i]}]});
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const reads=(n:string)=>n==='report'||n.startsWith('infer')||n.startsWith('learn')?[path(index(n))]:[];
export const writes=(n:string)=>n.startsWith('learn')?[path(index(n))]:[];
export const owner=(n:string)=>sid(1025,'authority/hearsay-holder-'+index(n));
const ownership=()=>compileMutationAuthorityRegistry([0,1,2].map(i=>({authorityName:'authority/hearsay-holder-'+i,ownedLeaves:[{pattern:pattern(path(i)),valueGrammar:{kind:'canonical-record' as const,recordTypeId:1200n},removalAllowed:false}]})));
export function hearsayRecipe(law=1,goal=1){
 if(![1,2,3,4].includes(law)||![1,2].includes(goal))throw Error('HEARSAY_PROFILE');
 const parameters=r(1195,[text(VERSION),u(law),u(goal)]),content=r(1206,[TARGET,list(HOLDERS),INCIDENT,HOLDERS[0]]),stages=STAGES.map(([n,p])=>r(1205,[eventId(n),u(p),list(reads(n).map(p=>statePathPatternValue(pattern(p)))),list(writes(n).map(p=>statePathPatternValue(pattern(p)))),owner(n)]));
 return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type HearsaySource=ReturnType<typeof hearsayRecipe>;
export const instant=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<1n||v.value>16n)throw Error('HEARSAY_TIME');return Number(v.value);};
export async function compileHearsayModel(input:HearsaySource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),1195n),law=Number(uint(f(profile,2n))),goal=Number(uint(f(profile,3n))),recipe=hearsayRecipe(law,goal);
 for(const n of ['parameters','content','registry'] as const)if(key(decode(source[n]))!==key(decode(recipe[n])))throw Error('HEARSAY_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),1206n),modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'hearsay-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){decode(enc(state.canonicalValue()));for(const e of state.entries()){
  const i=[0,1,2].find(i=>key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(path(i)))));if(i===undefined)throw Error('HEARSAY_STATE_PATH');let last=0;const seen=new Set<string>();
  const tickets=new Set<string>();for(const x of items(f(rec(e.value,1200n),1n),'list')){const o=rec(x,i===0?1197n:1199n),at=instant(f(o,3n));if(at<last||i===0&&at===last||seen.has(key(f(o,1n)))||key(f(o,2n))!==key(HOLDERS[i])||items(f(o,i===0?4n:9n),'list').length!==1)throw Error('HEARSAY_EVIDENCE');
   if(i>0){const channel=uint(f(o,6n)),ticket=uint(f(o,8n));if(key(f(o,4n))!==key(TARGET)||key(f(o,5n))!==key(INCIDENT)||key(f(o,7n))!==key(channel===1n?TARGET:HOLDERS[0])||(channel===1n?ticket!==0n:ticket===0n))throw Error('HEARSAY_SOURCE');if(channel===2n){const tk=key(f(o,7n))+'/'+ticket;if(tickets.has(tk))throw Error('HEARSAY_DUPLICATE');tickets.add(tk);}}
   last=at;seen.add(key(f(o,1n)));}

 }}return {source,law,goal,content,authority,modelIdentity,validateState};
}
export type HearsayCompiled=Awaited<ReturnType<typeof compileHearsayModel>>;
export async function compileHearsayInputs(model:HearsayCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(set([])))throw Error('HEARSAY_INITIAL_STATE');const originals=items(decode(orderedInputs),'list');if(!originals.length||originals.length>8)throw Error('HEARSAY_INPUT_COUNT');let last=0,belief:boolean|undefined;const tickets=new Map<string,boolean>();const truth=f(rec(originals[0],1196n),2n);
 const events:ScheduledEvent[]=originals.map((v,i)=>{const o=rec(v,1196n),at=instant(f(o,1n));if(at<=last)throw Error('HEARSAY_INPUT_ORDER');if(f(o,2n)!==truth)throw Error('HEARSAY_INCIDENT_TRUTH');last=at;if(f(o,5n)===true)belief=f(o,4n)===true;if(f(o,6n)===true&&belief!==undefined){const ticket=key(f(o,7n));if(tickets.has(ticket)&&tickets.get(ticket)!==belief)throw Error('HEARSAY_CONFLICTING_TICKET');tickets.set(ticket,belief);}return {eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(at)),phase:0n,eventTypeId:eventId('source'),payload:v,dependencies:list([]),causalParentEventIds:[]};});
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,runIdentity,runSeed:runSeed.slice()};
}
