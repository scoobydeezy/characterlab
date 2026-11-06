/** assembled-character-social/0.1: source-grouped attributed commitment. */
import {evaluationTuple} from './embarrassment';
import {returnTuple} from './attachment';
import {list,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {validateSemanticReferent} from '../substrate/referentOrigin';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,restoreAuthoritativeState,statePathValue,type StatePath,type StatePatch} from '../substrate/state';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataIdentity as id,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import {sid,pattern} from './skill';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
import type {Strategy} from './strategy';
export const SOCIAL_PEOPLE='assembled-social-people/0.1';
export const SOCIAL='assembled-social/0.1',SOCIAL_OBSERVATION=SOCIAL+'/observation',SOCIAL_APPRAISAL=SOCIAL+'/appraisal',SOCIAL_LEARNING=SOCIAL+'/learning';
export const SOCIAL_SOURCE=sid(1001,'event/assembled-social-source'),SOCIAL_OBSERVE=sid(1001,'event/assembled-social-observe'),SOCIAL_EVIDENCE=sid(1001,'event/assembled-social-evidence'),SOCIAL_UPDATE=sid(1001,'event/assembled-social-update');
export const SOCIAL_STAGES=['track','bind','classify','freeze'].map(n=>sid(1001,'event/assembled-social-'+n));
export const PERSON_OWNER=sid(1025,'authority/person-model');
const require=(b:boolean,s:string)=>{if(!b)invalidModel('social '+s);};
export function compileSocial(v:CanonicalValue,strategy:Strategy,multiple=false,allowEmptyTasks=false){
 const a=items(v,'list');
 const groups=multiple?(()=>{require(a.length===2&&txt(a[0])===SOCIAL_PEOPLE,'people declaration');return items(a[1],'list').map(v=>{const x=items(v,'list');require(x.length===2,'person mapping');return x;});})():(()=>{require(a.length===3&&txt(a[0])===SOCIAL,'declaration');return [[a[1],a[2]]];})();
 require(groups.length>=1&&groups.length<=8,'people capacity');
 const targets=groups.map(x=>{validateSemanticReferent(x[0]);return x[0];});require(new Set(targets.map(key)).size===targets.length,'duplicate person');
 const tasks=groups.flatMap(([target,mapping])=>{const rows=items(mapping,'list');require(allowEmptyTasks||rows.length>=1,'person requires task');return rows.map(v=>{const x=items(v,'list');require(x.length===2&&typeof x[1]==='boolean'&&strategy.some(r=>key(r.task)===key(x[0])),'task goal');return {target,task:x[0],desired:x[1]===true};});});
 require(tasks.length<=strategy.length&&new Set(tasks.map(t=>key(t.task))).size===tasks.length,'task mapping');
 if(multiple){targets.sort((a,b)=>key(a)<key(b)?-1:1);tasks.sort((a,b)=>key(a.task)<key(b.task)?-1:1);}
 return {target:targets[0],targets,tasks,multiple};
}
export function socialSetting(v:CanonicalValue){const a=items(v,'list');require(a.length===7&&txt(a[0])===SOCIAL&&typeof a[1]==='boolean'&&[1n,2n].includes(uint(a[2]))&&uint(a[3])<=4n&&uint(a[4])<=8n&&typeof a[5]==='boolean'&&typeof a[6]==='boolean','source');const mode=uint(a[3]);return {kind:uint(a[2]),receipt:uint(a[4]),claim:mode===0n?undefined:mode===1n?a[1]===true:mode===2n?a[1]!==true:mode===3n,access:a[5]===true,physical:a[6]===true};}
export function validateSocialSources(events:readonly {payload:CanonicalValue}[]){const seen=new Map<string,boolean|undefined>();for(const e of events){const s=socialSetting(e.payload),k=s.kind+'/'+s.receipt;if(s.receipt){require(!seen.has(k)||seen.get(k)===s.claim,'receipt changed');seen.set(k,s.claim);}}}
export const personPath=(C:CanonicalValue,target:CanonicalValue):StatePath=>({rootStateTypeId:810n,fieldId:1n,selectors:[{kind:'mapKey',key:list([C,target])}]});
export const personHistory=(v:CanonicalValue|undefined):readonly CanonicalValue[]=>v===undefined?[]:items(items(v,'list')[1],'list');
export const personMean=(v:CanonicalValue|undefined)=>{const xs=personHistory(v).filter(o=>items(items(o,'list')[6],'list').length===1);return xs.length?Q.of(BigInt(xs.filter(o=>items(items(o,'list')[6],'list')[0]===true).length),BigInt(xs.length)):undefined;};
export function personUpdate(prior:CanonicalValue|undefined,obs:CanonicalValue){const a=items(obs,'list'),xs=personHistory(prior);if((items(a[6],'list').length!==1&&!(a.length>=9&&returnTuple(a[8]).length||a.length===10&&evaluationTuple(a[9]).some(x=>x!==undefined)))||!uint(a[5])||xs.some(v=>{const b=items(v,'list');return key(b[4])===key(a[4])&&key(b[5])===key(a[5]);}))return prior;return list([text(SOCIAL),list([...xs,obs])]);}
export function withSocialState(base:ReturnType<typeof compileCampaign2StateModel>,C:CanonicalValue,target:CanonicalValue,targets:readonly CanonicalValue[]=[target],loss=false,embarrassment=false){
 require(targets.every(t=>key(C)!==key(t)),'target cannot be self');const paths=targets.map(t=>personPath(C,t)),fresh=(p:StatePath)=>p.rootStateTypeId===810n;
 const checkPath=(p:StatePath)=>require(paths.some(path=>key(statePathValue(path))===key(statePathValue(p))),'foreign path');
 const check=(p:StatePath,v:CanonicalValue)=>{checkPath(p);const target=items((p.selectors[0] as {key:CanonicalValue}).key,'list')[1],a=items(v,'list');require(a.length===2&&txt(a[0])===SOCIAL,'state');const xs=personHistory(v);require(xs.length>0&&xs.length<=8,'history capacity');let last=0n;const seen=new Set<string>(),ids=new Set<string>();for(const o of xs){const b=items(o,'list');require(b.length===(embarrassment?10:loss?9:8)&&key(b[1])===key(C)&&key(b[2])===key(target),'observation holder/target');const occ=id(b[0]);require(occ.namespaceId===1115n&&!ids.has(key(occ)),'observation id');uint(occ.payload);ids.add(key(occ));const time=b[3];require(typeof time!=='boolean'&&time.kind==='signed'&&time.value>last&&time.value<=100n,'history time');if(typeof time!=='boolean'&&time.kind==='signed')last=time.value;const k=uint(b[4])+'/'+uint(b[5]);require([1n,2n].includes(uint(b[4]))&&uint(b[5])>=1n&&uint(b[5])<=8n&&!seen.has(k),'source grouping');seen.add(k);for(const n of [6,7]){const x=items(b[n],'list');require(x.length===1&&typeof x[0]==='boolean'||loss&&n===6&&x.length===0,'admitted observation');}if(loss)require(items(b[6],'list').length===1||returnTuple(b[8]).length===1||embarrassment&&evaluationTuple(b[9]).some(x=>x!==undefined),'empty person evidence');if(loss)returnTuple(b[8]);if(embarrassment)evaluationTuple(b[9]);}};
 const authority=new StateAuthorityRegistry(paths.map(path=>({pattern:pattern(path),validateValue:(v:CanonicalValue)=>check(path,v),removalAllowed:false})),[{mutationAuthorityId:PERSON_OWNER,patterns:paths.map(pattern)}]);
 const without=(s:AuthoritativeState)=>new AuthoritativeState(s.entries().filter(e=>!fresh(e.path)));
 function validateState(s:AuthoritativeState){base.validateState(without(s));for(const e of s.entries().filter(e=>fresh(e.path)))check(e.path,e.value);}
 return Object.freeze({...base,validateState,validatePath(p:StatePath){if(fresh(p))checkPath(p);else base.validatePath(p);},restoreState(bytes:Uint8Array){const s=restoreAuthoritativeState(decode(bytes));validateState(s);return s;},read(s:AuthoritativeState,p:StatePath){if(!fresh(p))return base.read(s,p);checkPath(p);const v=s.read(p);if(v.presence)check(p,v.value!);return v;},
 applyPatch(s:AuthoritativeState,p:StatePatch,owner:Parameters<typeof base.applyPatch>[2],scope?:Parameters<typeof base.applyPatch>[3]){const added=p.operations.filter(o=>fresh(o.path));require(!added.length||added.length===p.operations.length,'mixed owned patch');if(added.length){for(const o of added){checkPath(o.path);require(o.kind==='set','append only');if(o.kind==='set'){check(o.path,o.newValue);const old=personHistory(s.read(o.path).value),next=personHistory(o.newValue);require(next.length===old.length+1&&old.every((v,i)=>key(v)===key(next[i])),'history rewrite');}require(!scope||scope.writableRoots.includes(810n)&&scope.targetPaths.some(x=>key(statePathValue(x))===key(statePathValue(o.path))),'write scope');}const result=applyStatePatch(s,p,owner,authority);validateState(result.state);return result;}const result=base.applyPatch(without(s),p,owner,scope),state=new AuthoritativeState([...result.state.entries(),...s.entries().filter(e=>fresh(e.path))]);validateState(state);return {...result,state};}});
}
