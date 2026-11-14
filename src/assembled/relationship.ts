/** assembled-character-relationship/0.1: directional own interaction history. */
import {list,text,set,map,record,unsigned,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {cognitiveRecord as r} from '../campaign2/cognitiveCodecs';
import {readQ,qValue} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,restoreAuthoritativeState,statePathValue,type StatePath,type StatePatch} from '../substrate/state';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataIdentity as id,dataKey as key,dataRecord as rec,dataField as f,invalidModel} from '../campaign2/canonicalData';
import {supportTuple,type attachmentFold} from './attachment';
import {sid,pattern} from './skill';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
import type {Strategy} from './strategy';
export const REL_PEOPLE='assembled-relationship-people/0.1';
export const REL='assembled-relationship/0.1',REL_OBSERVATION=REL+'/observation',REL_APPRAISAL=REL+'/appraisal',REL_LEARNING=REL+'/learning';
export const REL_SOURCE=sid(1001,'event/assembled-relationship-source'),REL_OBSERVE=sid(1001,'event/assembled-relationship-observe'),REL_EVIDENCE=sid(1001,'event/assembled-relationship-evidence'),REL_UPDATE=sid(1001,'event/assembled-relationship-update');
export const REL_STAGES=['track','bind','classify','freeze'].map(n=>sid(1001,'event/assembled-relationship-'+n));
export const REL_OWNER=sid(1025,'authority/relationship-history');
const require=(b:boolean,s:string)=>{if(!b)invalidModel('relationship '+s);};
export function compileRelationship(v:CanonicalValue,target:CanonicalValue,strategy:Strategy,targets:readonly CanonicalValue[]=[target],multiple=false){
 const a=items(v,'list');require(a.length===2&&txt(a[0])===(multiple?REL_PEOPLE:REL),'declaration');
 const rows=multiple?items(a[1],'list').map(v=>items(v,'list')):[[target,a[1]]];
 const bindings=rows.map(x=>{require(x.length===2&&targets.some(t=>key(t)===key(x[0]))&&strategy.some(t=>t.plans.some(p=>key(p.actionId)===key(x[1]))),'person/contact action');return {target:x[0],action:x[1]};});
 require(bindings.length===targets.length&&new Set(bindings.map(b=>key(b.target))).size===targets.length,'person mapping');
 require(new Set(bindings.map(b=>key(b.action))).size===bindings.length,'duplicate contact action');
 if(multiple)bindings.sort((a,b)=>key(a.target)<key(b.target)?-1:1);
 return {...bindings[0],bindings,multiple};
}
export function relationshipSetting(v:CanonicalValue){const a=items(v,'list');require(a.length===5&&txt(a[0])===REL&&uint(a[1])<=3n&&typeof a[2]==='boolean'&&typeof a[3]==='boolean'&&uint(a[4])<=3n,'source');return {access:a[3]===true,participant:a[2]===true,kind:uint(a[4])===0n?uint(a[1]):uint(a[4])};}
export const relationshipPath=(C:CanonicalValue,target:CanonicalValue):StatePath=>({rootStateTypeId:848n,fieldId:1n,selectors:[{kind:'mapKey',key:list([C,target])}]});
export const relationshipHistory=(v:CanonicalValue|undefined):readonly CanonicalValue[]=>v===undefined?[]:items(items(v,'list')[1],'list');
export function relationshipFold(v:CanonicalValue|undefined){let count=0n,rupture=false;for(const o of relationshipHistory(v)){const kind=uint(items(o,'list')[6]);if(kind===1n){count++;rupture=false;}else if(kind===2n)rupture=true;}return {count,rupture,comfort:count>=2n&&!rupture};}
export function appendRelationship(prior:CanonicalValue|undefined,obs:CanonicalValue){const a=items(obs,'list');return a[4]===true&&a[5]===true&&([1n,2n].includes(uint(a[6]))||a.length===8&&supportTuple(a[7]).length>0)?list([text(REL),list([...relationshipHistory(prior),obs])]):prior;}
/** Two disjoint evidence classes: preserve the constituents, sum raw strengths, bound once downstream. */
export function relationshipRaw(raw:CanonicalValue,history:CanonicalValue|undefined,action:CanonicalValue,attachment?:ReturnType<typeof attachmentFold>,extraSources?:readonly CanonicalValue[]){
 const source=rec(raw,403n),options=rec(f(source,2n),398n),fold=relationshipFold(history),offered=items(f(options,3n),'list').map(v=>rec(v,397n)).filter(v=>key(f(rec(f(v,1n),395n),2n))===key(action)),amount=Q.of(fold.rupture?-1n:fold.comfort?1n:0n),original=items(f(source,3n),'set'),signals=[...original],joined:CanonicalValue[]=[];
 const atoms=relationshipHistory(history).filter(o=>!attachment||[1n,2n].includes(uint(items(o,'list')[6]))).map(o=>r(399,[unsigned(1),r(237,[unsigned(1),items(o,'list')[0]])]));
 for(const candidate of offered)for(const origin of items(f(candidate,2n),'set')){const sourceKey=r(401,[f(candidate,1n),f(rec(origin,396n),1n),unsigned(3)]),i=signals.findIndex(v=>key(f(rec(v,402n),1n))===key(sourceKey)),old=i<0?undefined:rec(signals[i],402n),basis=old?f(rec(f(old,3n),400n),1n):map([]);require(typeof basis!=='boolean'&&basis.kind==='map','standing basis');const pairs=(basis as Extract<CanonicalValue,{kind:'map'}>).entries;
  for(const [atom]of pairs)require((uint(f(rec(atom,399n),1n))===2n||extraSources!==undefined&&uint(f(rec(atom,399n),1n))===1n),'identity evidence class');
  const weights=new Map(pairs.map(([a,w])=>[key(a),[a,w] as const]));for(const atom of atoms){require(!weights.has(key(atom)),'overlapping standing evidence');weights.set(key(atom),[atom,rational(1,1)]);}
  const attachmentAtoms=[...(attachment?.qualifying.map(o=>items(o,'list')[0])??[]),...(extraSources??[])].map(o=>r(399,[unsigned(1),r(237,[unsigned(1),o])]));
  for(const atom of attachmentAtoms)weights.set(key(atom),[atom,rational(1,1)]);
  const before=old?readQ(f(old,2n)):Q.of(0n),extra=attachment?.missing??Q.of(0n),sum=before.add(amount).add(extra);joined.push(list([sourceKey,old??list([]),qValue(amount),list(atoms),qValue(sum),...(attachment?[attachment.report,qValue(extra),list(attachmentAtoms)]:[])]));
  if(!amount.add(extra).equals(Q.of(0n))){const next=r(402,[sourceKey,qValue(sum),r(400,[map([...weights.values()])])]);if(i<0)signals.push(next);else signals[i]=next;}
 }
 const output=record(source.schema,new Map([...source.fields].map(([n,v])=>[n,n===3n?set(signals):v])));
 return {output,fold,contact:offered.length>0,missing:fold.count>=2n&&!offered.length,amount,joined:list(joined)};
}
export function withRelationshipState(base:ReturnType<typeof compileCampaign2StateModel>,C:CanonicalValue,target:CanonicalValue,targets:readonly CanonicalValue[]=[target],attachment=false){
 require(targets.every(t=>key(C)!==key(t)),'target cannot be self');const paths=targets.map(t=>relationshipPath(C,t)),fresh=(p:StatePath)=>p.rootStateTypeId===848n;
 const checkPath=(p:StatePath)=>require(paths.some(path=>key(statePathValue(path))===key(statePathValue(p))),'foreign path');
 const check=(p:StatePath,v:CanonicalValue)=>{checkPath(p);const target=items((p.selectors[0] as {key:CanonicalValue}).key,'list')[1],a=items(v,'list');require(a.length===2&&txt(a[0])===REL,'state');const xs=relationshipHistory(v);require(xs.length>0&&xs.length<=12,'history capacity');let last=0n;const ids=new Set<string>();for(const o of xs){const b=items(o,'list');require(b.length===(attachment?8:7)&&key(b[1])===key(C)&&key(b[2])===key(target),'observation holder/target');const occ=id(b[0]);require(occ.namespaceId===1115n&&!ids.has(key(occ)),'observation id');uint(occ.payload);ids.add(key(occ));const time=b[3];require(typeof time!=='boolean'&&time.kind==='signed'&&time.value>last&&time.value<=100n,'history time');if(typeof time!=='boolean'&&time.kind==='signed')last=time.value;require(b[4]===true&&b[5]===true&&([1n,2n].includes(uint(b[6]))||attachment&&uint(b[6])<=3n&&supportTuple(b[7]).length>0),'admitted participant interaction');if(attachment)supportTuple(b[7]);}};
 const authority=new StateAuthorityRegistry(paths.map(path=>({pattern:pattern(path),validateValue:(v:CanonicalValue)=>check(path,v),removalAllowed:false})),[{mutationAuthorityId:REL_OWNER,patterns:paths.map(pattern)}]);
 const without=(s:AuthoritativeState)=>new AuthoritativeState(s.entries().filter(e=>!fresh(e.path)));
 function validateLocal(s:AuthoritativeState){for(const e of s.entries().filter(e=>fresh(e.path)))check(e.path,e.value);}
 // The assembled state.ts composition guarantees a validated base result, including no-ops.
 // Keep every local/cross-state check; direct validation, restore and owned writes stay full.
 function validateState(s:AuthoritativeState){base.validateState(without(s));validateLocal(s);}
 return Object.freeze({...base,validateState,validatePath(p:StatePath){if(fresh(p))checkPath(p);else base.validatePath(p);},restoreState(bytes:Uint8Array){const s=restoreAuthoritativeState(decode(bytes));validateState(s);return s;},read(s:AuthoritativeState,p:StatePath){if(!fresh(p))return base.read(s,p);checkPath(p);const v=s.read(p);if(v.presence)check(p,v.value!);return v;},
 applyPatch(s:AuthoritativeState,p:StatePatch,owner:Parameters<typeof base.applyPatch>[2],scope?:Parameters<typeof base.applyPatch>[3]){const added=p.operations.filter(o=>fresh(o.path));require(!added.length||added.length===p.operations.length,'mixed owned patch');if(added.length){for(const o of added){checkPath(o.path);require(o.kind==='set','append only');if(o.kind==='set'){check(o.path,o.newValue);const old=relationshipHistory(s.read(o.path).value),next=relationshipHistory(o.newValue);require(next.length===old.length+1&&old.every((v,i)=>key(v)===key(next[i])),'history rewrite');}require(!scope||scope.writableRoots.includes(848n)&&scope.targetPaths.some(x=>key(statePathValue(x))===key(statePathValue(o.path))),'write scope');}const result=applyStatePatch(s,p,owner,authority);validateState(result.state);return result;}const result=base.applyPatch(without(s),p,owner,scope),state=new AuthoritativeState([...result.state.entries(),...s.entries().filter(e=>fresh(e.path))]);validateLocal(state);return {...result,state};}});
}
