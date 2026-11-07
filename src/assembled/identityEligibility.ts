/** assembled-character-identity-eligibility/0.1-candidate. One existing identity owner. */
import {list,text,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,restoreAuthoritativeState,statePathValue,type StatePath,type StatePatch} from '../substrate/state';
import {readQ,qValue,validateIdentityHistory,ZERO} from '../campaign2/cognitiveMath';
import {cognitiveTraceSubject} from '../campaign2/cognitiveTrace';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataRecord as rec,dataField as f,dataIdentity as id,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import {cognitiveRecord as r,decodeCognitive as decode} from './codecs';
import {chosenData} from './choice';
import {sid,pattern} from './skill';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const ELIGIBILITY='assembled-identity-eligibility/0.1',EXPRESSION=ELIGIBILITY+'/expression',QUALIFICATION=ELIGIBILITY+'/qualification';
export const IDENTITY_VERSION='assembled-character-identity-eligibility/0.1-candidate';
export const IDENTITY_CONTEXT=sid(1001,'event/assembled-identity-context');
const require=(b:boolean,s:string)=>{if(!b)invalidModel('identity eligibility '+s);};
export function compileEligibility(v:CanonicalValue){const a=items(v,'list');require(a.length===1&&txt(a[0])===ELIGIBILITY,'declaration');return true as const;}
export function identityContext(v:CanonicalValue){const a=items(v,'list');require(a.length===4&&txt(a[0])===ELIGIBILITY&&typeof a[3]==='boolean','context grammar');const significance=readQ(a[1]),pressure=readQ(a[2]);require([0n,1n,4n].some(n=>significance.numerator*4n===n*significance.denominator)&&[0n,1n,2n].some(n=>pressure.numerator*2n===n*pressure.denominator),'context domain');return {significance,pressure,instruction:a[3] as boolean};}
export function frozenIdentityExpression(expression:CanonicalValue,sourceEvent:bigint,context:CanonicalValue){rec(expression,426n);identityContext(context);require(sourceEvent>0n,'source event');return list([text(EXPRESSION),expression,unsigned(sourceEvent),context]);}
export function qualifyIdentity(occurrence:CanonicalValue,envelope:CanonicalValue){
 const x=items(envelope,'list');require(x.length===4&&txt(x[0])===EXPRESSION&&uint(x[2])>0n,'expression envelope');const occurrenceId=id(occurrence);require(occurrenceId.namespaceId===1138n&&uint(occurrenceId.payload)>0n,'qualification occurrence');
 const e=rec(x[1],426n),intent=rec(f(e,2n),425n),resolution=rec(f(intent,2n),409n),data=chosenData(resolution),channels=items(f(e,3n),'list'),ctx=identityContext(x[3]);
 require(channels.length<=1&&(!channels.length||key(f(rec(channels[0],427n),1n))===key(sid(1041,'CommitmentFidelity'))),'channel');
 const alignment=channels.length?readQ(f(rec(channels[0],427n),2n)):ZERO,authorship=readQ(f(data,7n));
 require(authorship.numerator>=0n&&authorship.numerator<=authorship.denominator&&alignment.numerator>= -alignment.denominator&&alignment.numerator<=alignment.denominator,'authorship/alignment domain');
 let contribution=alignment.multiply(authorship);let status='Accepted';
 if(!channels.length)status='NoEligibleChannel';else if(ctx.significance.numerator*2n<ctx.significance.denominator)status='Insignificant';else if(ctx.pressure.numerator*2n>=ctx.pressure.denominator)status='Constrained';else if(contribution.equals(ZERO))status='ZeroContribution';
 if(status!=='Accepted')contribution=ZERO;
 return list([text(QUALIFICATION),occurrence,envelope,text(status),qValue(contribution)]);
}
export function qualificationParts(v:CanonicalValue){
 const a=items(v,'list');require(a.length===5&&txt(a[0])===QUALIFICATION&&key(v)===key(qualifyIdentity(a[1],a[2])),'qualification correspondence');
 const x=items(a[2],'list'),expression=rec(x[1],426n),resolution=rec(f(rec(f(expression,2n),425n),2n),409n),at=f(resolution,2n);require(typeof at!=='boolean'&&at.kind==='signed'&&at.value>=1n&&at.value<=100n,'decision time');
 return {id:a[1],expression,resolution,at:at as Extract<CanonicalValue,{kind:'signed'}>,subject:cognitiveTraceSubject(expression),accepted:txt(a[3])==='Accepted',contribution:a[4],numeric:r(413,[a[1],f(resolution,1n),at,a[4]])};
}
export const journalPath=(identityKey:CanonicalValue):StatePath=>({rootStateTypeId:415n,fieldId:2n,selectors:[{kind:'mapKey',key:identityKey}]});
export function identityJournal(v?:CanonicalValue){if(v===undefined)return [] as CanonicalValue[];const a=items(v,'list');require(a.length===2&&txt(a[0])===ELIGIBILITY,'journal');return [...items(a[1],'list')];}
export function withQualifiedIdentityState(base:ReturnType<typeof compileCampaign2StateModel>,identityKey:CanonicalValue,owner:ReturnType<typeof id>){
 const jp=journalPath(identityKey),np={...jp,fieldId:1n},paths=[np,jp],fresh=(p:StatePath)=>p.rootStateTypeId===415n&&p.fieldId===2n,owned=(p:StatePath)=>p.rootStateTypeId===415n;
 const checkPath=(p:StatePath)=>require(paths.some(x=>key(statePathValue(x))===key(statePathValue(p))),'foreign path');
 const check=(p:StatePath,v:CanonicalValue)=>{checkPath(p);if(p.fieldId===1n){validateIdentityHistory(items(f(rec(v,414n),1n),'list'));return;}const rows=identityJournal(v);require(rows.length>0&&rows.length<=16,'journal size');let last=0n;const ids=new Set<string>();for(const row of rows){const q=qualificationParts(row);require(q.accepted&&q.at.value>last&&key(q.subject)===key(f(rec(identityKey,412n),1n)),'journal subject/order/acceptance');last=q.at.value;for(const x of [q.id,f(q.expression,1n),f(q.resolution,1n)]){require(!ids.has(key(x)),'duplicate occurrence');ids.add(key(x));}}};
 const authority=new StateAuthorityRegistry(paths.map(path=>({pattern:pattern(path),validateValue:(v:CanonicalValue)=>check(path,v),removalAllowed:false})),[{mutationAuthorityId:owner,patterns:paths.map(pattern)}]);
 const without=(s:AuthoritativeState)=>new AuthoritativeState(s.entries().filter(e=>!fresh(e.path)));
 function validateLocal(s:AuthoritativeState){for(const e of s.entries().filter(e=>fresh(e.path)))checkPath(e.path);const j=s.read(jp),n=s.read(np);require(j.presence===n.presence,'journal/adapter presence');if(j.presence){check(jp,j.value!);require(key(f(rec(n.value!,414n),1n))===key(list(identityJournal(j.value!).map(v=>qualificationParts(v).numeric))),'journal/adapter equality');}}
 // state.ts supplies a base whose applyPatch validates its returned slice, including no-ops.
 // This is an assembled-composition contract, not a guarantee of the generic state-model type.
 function validateState(s:AuthoritativeState){base.validateState(without(s));validateLocal(s);}
 return Object.freeze({...base,validateState,validatePath(p:StatePath){if(fresh(p))checkPath(p);else base.validatePath(p);},restoreState(bytes:Uint8Array){const s=restoreAuthoritativeState(decode(bytes));validateState(s);return s;},read(s:AuthoritativeState,p:StatePath){if(!fresh(p))return base.read(s,p);checkPath(p);const v=s.read(p);if(v.presence)check(p,v.value!);return v;},
 applyPatch(s:AuthoritativeState,p:StatePatch,writer:Parameters<typeof base.applyPatch>[2],scope?:Parameters<typeof base.applyPatch>[3]){const added=p.operations.filter(o=>owned(o.path));if(added.length){require(added.length===2&&added.length===p.operations.length,'joint identity patch');for(const o of added){checkPath(o.path);require(o.kind==='set','append only');require(!scope||scope.writableRoots.includes(415n)&&scope.targetPaths.some(x=>key(statePathValue(x))===key(statePathValue(o.path))),'write scope');if(o.kind==='set'&&fresh(o.path)){const old=identityJournal(s.read(o.path).value),next=identityJournal(o.newValue);require(next.length===old.length+1&&old.every((v,i)=>key(v)===key(next[i])),'history rewrite');}}const result=applyStatePatch(s,p,writer,authority);validateState(result.state);return result;}const result=base.applyPatch(without(s),p,writer,scope),state=new AuthoritativeState([...result.state.entries(),...s.entries().filter(e=>fresh(e.path))]);validateLocal(state);return {...result,state};}});
}
