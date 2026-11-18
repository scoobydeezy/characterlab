import {LEGACY_TIME_LIMIT,assertTimeLimit,type TimeLimit} from './timeDomain';
import {witnessPath,validateWitness} from './commitmentWitness';
/** assembled-character-communication/0.1: one governed channel, holder-owned evidence. */
import {list,text,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,restoreAuthoritativeState,statePathValue,type StatePath,type StatePatch} from '../substrate/state';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataIdentity as id,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import {EXPECTATION_TOPIC} from './performanceExpectation';
import {sid,pattern} from './skill';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
import type {compileStrategy} from './strategy';
export const CONTRARY='assembled-contrary-communication/0.1',CONTRARY_VERSION='assembled-character-contrary-communication/0.1-candidate';
export const OUTCOME_TOPIC='assembled-outcome-topic/0.1';
export const LEARNED_DISCLOSURE='assembled-learned-disclosure/0.1',COMM_OPEN=sid(1001,'event/assembled-communication-open');
export const COMM='assembled-communication/0.1',PRIVATE=COMM+'/private',PROBE=COMM+'/probe',FROZEN=COMM+'/expression',SIGNAL=COMM+'/execution',RECEIVED=COMM+'/received';
export const COMM_SOURCE=sid(1001,'event/assembled-communication-source'),COMM_PRIVATE=sid(1001,'event/assembled-communication-private'),COMM_SPEAKER=sid(1001,'event/assembled-communication-speaker'),COMM_PROBE=sid(1001,'event/assembled-communication-probe'),COMM_RECEIVE=sid(1001,'event/assembled-communication-receive'),COMM_UPDATE=sid(1001,'event/assembled-communication-update');
export const KNOWLEDGE_OWNER=sid(1025,'authority/assembled-communication-knowledge');
const require=(b:boolean,s:string)=>{if(!b)invalidModel('communication '+s);};
export function compileCommunication(v:CanonicalValue,strategy:ReturnType<typeof compileStrategy>,people?:readonly CanonicalValue[],allowOutcome=false,allowExpectation=false,allowContrary=false){
 const a=items(v,'list'),contrary=allowContrary&&people&&a.length===5?a[4]:undefined;require((a.length===(people?4:3)||!!contrary)&&txt(a[0])===(people?LEARNED_DISCLOSURE:COMM),'declaration');const recipients=items(a[2],'list');require(recipients.length===2&&new Set(recipients.map(key)).size===2,'recipient identities');
 for(const h of recipients)require(id(h).namespaceId===1000n&&/^observer\/assembled-communication\/[a-z][a-z0-9-]*$/.test(txt(id(h).payload)),'recipient identity domain');require(strategy.some(x=>x.plans.some(p=>key(p.actionId)===key(a[1]))),'disclosure action');
 const topic:CanonicalValue|undefined=people?a[3]:undefined;let outcome:{task:CanonicalValue;route:bigint}|undefined,expectation=false;
 if(people&&allowOutcome&&typeof topic!=='boolean'&&topic?.kind==='list'){const x=items(topic,'list');require(x.length===3,'outcome topic');expectation=allowExpectation&&txt(x[0])===EXPECTATION_TOPIC;require(txt(x[0])===OUTCOME_TOPIC||expectation,'outcome topic');const route=uint(x[2]);require(route<=1n&&strategy.some(s=>key(s.task)===key(x[1])),'outcome topic task/route');outcome={task:x[1],route};}
 else if(people)require(people.some(p=>key(p)===key(topic!)),'unknown person topic');if(contrary)require(!expectation&&key(contrary)!==key(a[1])&&strategy.some(t=>t.plans.some(p=>key(p.actionId)===key(contrary))),'contrary action/Boolean topic');return {action:a[1],recipients,topic,outcome,expectation,contrary};
}
export function communicationSetting(v:CanonicalValue,learned=false){const a=items(v,'list');require(a.length===(learned?4:7)&&txt(a[0])===(learned?LEARNED_DISCLOSURE:COMM)&&a.slice(1).every(v=>typeof v==='boolean'),'source');return learned?{display:false,privateAccess:false,delivery:a[1]===true,access:[a[2]===true,a[3]===true]}:{display:a[2]===true,privateAccess:a[3]===true,delivery:a[4]===true,access:[a[5]===true,a[6]===true]};}
export const knowledgePath=(holder:CanonicalValue):StatePath=>({rootStateTypeId:1072n,fieldId:1n,selectors:[{kind:'mapKey',key:holder}]});
export const history=(v:CanonicalValue|undefined):readonly CanonicalValue[]=>v===undefined?[]:items(v,'list');
/** Exact COMM latest/Boolean-mean algebra, with assembled holder and16-sample domains.
 * No historical codec envelope: its holder1000 and history8 bounds do not apply here. */
export const communicationClaim=(v:CanonicalValue|undefined)=>{const xs=history(v);return xs.length?items(xs[xs.length-1],'list')[3]:list([]);};
export function communicationEstimate(v:CanonicalValue|undefined,latest=false){const all=history(v),xs=latest?all.slice(-1):all;if(!xs.length)return list([]);const yes=xs.filter(o=>items(items(o,'list')[3],'list')[0]===true).length;return list([rational(BigInt(yes),BigInt(xs.length))]);}
export function withCommunicationState(base:ReturnType<typeof compileCampaign2StateModel>,holders:readonly CanonicalValue[],topic?:CanonicalValue,expectation=false,witnessTasks:readonly CanonicalValue[]=[],timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);
 const paths=[...holders.map(knowledgePath),...holders.flatMap(h=>witnessTasks.map(t=>witnessPath(h,t)))],fresh=(p:StatePath)=>p.rootStateTypeId===1072n;
 const checkPath=(p:StatePath)=>require(paths.some(x=>key(statePathValue(x))===key(statePathValue(p))),'foreign path');
 const check=(p:StatePath,v:CanonicalValue)=>{checkPath(p);if(p.fieldId===2n){validateWitness(v,p,timeLimit);return;}const xs=history(v);require(xs.length>0&&xs.length<=16,'history capacity');let last=0n;const seen=new Set<string>();for(const o of xs){const a=items(o,'list');require(a.length===(topic?5:4)&&key(a[1])===key((p.selectors[0] as {key:CanonicalValue}).key),'observation holder');if(topic)require(key(a[4])===key(topic),'observation topic');const occ=id(a[0]);require(occ.namespaceId===1168n&&!seen.has(key(occ)),'observation identity');uint(occ.payload);seen.add(key(occ));const t=a[2];require(typeof t!=='boolean'&&t.kind==='signed'&&t.value>last&&t.value<=timeLimit,'history time');if(typeof t!=='boolean'&&t.kind==='signed')last=t.value;const sample=items(a[3],'list');require(sample.length===1,'admitted sample');const x=sample[0];require(expectation?typeof x!=='boolean'&&x.kind==='rational'&&x.numerator>=0n&&x.numerator<=x.denominator:typeof x==='boolean','admitted sample');}};
 const authority=new StateAuthorityRegistry(paths.map(p=>({pattern:pattern(p),validateValue:(v:CanonicalValue)=>check(p,v),removalAllowed:false})),[{mutationAuthorityId:KNOWLEDGE_OWNER,patterns:paths.map(pattern)}]);
 const without=(s:AuthoritativeState)=>new AuthoritativeState(s.entries().filter(e=>!fresh(e.path)));
 function validateLocal(s:AuthoritativeState){for(const e of s.entries().filter(e=>fresh(e.path)))check(e.path,e.value);}
 // The assembled state.ts composition guarantees a validated base result, including no-ops.
 // Keep every local/cross-state check; direct validation, restore and owned writes stay full.
 function validateState(s:AuthoritativeState){base.validateState(without(s));validateLocal(s);}
 return Object.freeze({...base,validateState,validatePath(p:StatePath){if(fresh(p))checkPath(p);else base.validatePath(p);},restoreState(bytes:Uint8Array){const s=restoreAuthoritativeState(decode(bytes));validateState(s);return s;},read(s:AuthoritativeState,p:StatePath){if(!fresh(p))return base.read(s,p);checkPath(p);const v=s.read(p);if(v.presence)check(p,v.value!);return v;},
 applyPatch(s:AuthoritativeState,p:StatePatch,owner:Parameters<typeof base.applyPatch>[2],scope?:Parameters<typeof base.applyPatch>[3]){const added=p.operations.filter(o=>fresh(o.path));require(!added.length||added.length===p.operations.length,'mixed owned patch');if(added.length){for(const o of added){checkPath(o.path);require(o.kind==='set','append only');if(o.kind==='set'){check(o.path,o.newValue);const prior=s.read(o.path).value;if(o.path.fieldId===2n){const at=items(o.newValue,'list')[2] as {value:bigint};require(!prior||at.value>(items(prior,'list')[2] as {value:bigint}).value,'witness history rewrite');}else{const old=history(prior),next=history(o.newValue);require(next.length===old.length+1&&old.every((v,i)=>key(v)===key(next[i])),'history rewrite');}}require(!scope||scope.writableRoots.includes(1072n)&&scope.targetPaths.some(x=>key(statePathValue(x))===key(statePathValue(o.path))),'write scope');}const result=applyStatePatch(s,p,owner,authority);validateState(result.state);return result;}const result=base.applyPatch(without(s),p,owner,scope),state=new AuthoritativeState([...result.state.entries(),...s.entries().filter(e=>fresh(e.path))]);validateLocal(state);return {...result,state};}});
}
