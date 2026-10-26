/** assembled-character-procedural/0.1-candidate: one procedural owner, fixed L5/L6. */
import {canonicalEncode as enc,list,text,unsigned,rational,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,restoreAuthoritativeState,statePathValue,type StatePath,type StatePathPattern,type StatePatch} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {developmentalGain} from '../campaign3/developmentComponent';
import {exact} from '../campaign3/embodiedMath';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const SKILL='assembled-procedural/0.1',PHASE='assembled-development/0.1',SKILL_ACTUAL='assembled-procedural-execution/0.1',SKILL_UPDATE='assembled-procedural-update/0.1';
export const sid=(ns:number,s:string)=>typedIdentifier(ns,text(s));
export const PRACTICE_SETTING=sid(1001,'event/assembled-practice-setting'),PRACTICE=sid(1001,'event/assembled-practice');
export const SKILL_OWNER=sid(1025,'authority/procedural-skill'),PHASE_OWNER=sid(1025,'authority/development');
export const skillPath=(C:CanonicalValue):StatePath=>({rootStateTypeId:785n,fieldId:1n,selectors:[{kind:'mapKey',key:C}]});
export const phasePath=(C:CanonicalValue):StatePath=>({...skillPath(C),rootStateTypeId:1500n});
export const pattern=(p:StatePath):StatePathPattern=>({...p,selectors:p.selectors.map(selector=>({kind:'exact',selector}))});
export const q=(v:Q)=>rational(v.numerator,v.denominator);
export function compileSkill(v:CanonicalValue){const a=items(v,'list');if(a.length!==1||txt(a[0])!==SKILL)invalidModel('procedural declaration');return true as const;}
export function practiceSetting(v:CanonicalValue){const a=items(v,'list');if(a.length!==6||txt(a[0])!==SKILL||uint(a[1])>4n||typeof a[4]!=='boolean'||typeof a[5]!=='boolean')invalidModel('practice setting grammar');const impairment=exact(a[2]),difficulty=exact(a[3]);for(const x of [impairment,difficulty])if(x.compare(Q.of(0n))<0||x.compare(Q.of(1n))>0)invalidModel('practice setting domain');return {phase:Number(uint(a[1])),impairment,difficulty,permitted:a[4] as boolean,practice:a[5] as boolean};}
export function skillValue(v?:CanonicalValue){if(v===undefined)return {K:Q.of(0n),count:0n};const a=items(v,'list');if(a.length!==3||txt(a[0])!==SKILL)invalidModel('skill value grammar');const K=exact(a[1]),count=uint(a[2]);if(K.compare(Q.of(0n))<=0||K.compare(Q.of(1n))>0||count<1n||count>100n)invalidModel('skill value domain');return {K,count};}
export function phaseValue(v:CanonicalValue){const a=items(v,'list');if(a.length!==2||txt(a[0])!==PHASE||uint(a[1])>4n)invalidModel('development phase grammar');return Number(uint(a[1]));}
export function practiced(K:Q,count:bigint,phase:number){const gain=developmentalGain('Ramp',phase),candidate=K.add(gain.divide(Q.of(8n))),after=candidate.compare(Q.of(1n))>0?Q.of(1n):candidate;if(count>=100n)invalidModel('practice count bound');return {gain,after,value:list([text(SKILL),q(after),unsigned(count+1n)])};}
/** Closed successor leaves; inherited303 is not a second competence representation. */
export function withSkillState(base:ReturnType<typeof compileCampaign2StateModel>,C:CanonicalValue){
 const paths=[skillPath(C),phasePath(C)],roots=[785n,1500n],isNew=(p:StatePath)=>roots.includes(p.rootStateTypeId),checkPath=(p:StatePath)=>{if(!paths.some(x=>key(statePathValue(x))===key(statePathValue(p))))invalidModel('foreign procedural/development path');};
 const check=(p:StatePath,v:CanonicalValue)=>{checkPath(p);if(p.rootStateTypeId===785n)skillValue(v);else phaseValue(v);};
 const authority=new StateAuthorityRegistry(paths.map(p=>({pattern:pattern(p),validateValue:(v:CanonicalValue)=>check(p,v),removalAllowed:false})),paths.map((p,i)=>({mutationAuthorityId:i?PHASE_OWNER:SKILL_OWNER,patterns:[pattern(p)]})));
 const without=(s:AuthoritativeState)=>new AuthoritativeState(s.entries().filter(e=>!isNew(e.path)));
 function validateState(s:AuthoritativeState){if(s.entries().some(e=>e.path.rootStateTypeId===303n))invalidModel('legacy303 competence excluded from procedural successor');base.validateState(without(s));for(const e of s.entries().filter(e=>isNew(e.path)))check(e.path,e.value);}
 return Object.freeze({...base,validateState,
  validatePath(p:StatePath){if(p.rootStateTypeId===303n)invalidModel('legacy303 competence excluded');if(isNew(p))checkPath(p);else base.validatePath(p);},
  restoreState(bytes:Uint8Array){const s=restoreAuthoritativeState(decode(bytes));validateState(s);return s;},
  read(s:AuthoritativeState,p:StatePath){if(!isNew(p))return base.read(s,p);checkPath(p);const v=s.read(p);if(v.presence)check(p,v.value!);return v;},
  applyPatch(s:AuthoritativeState,p:StatePatch,owner:Parameters<typeof base.applyPatch>[2],scope?:Parameters<typeof base.applyPatch>[3]){
   const fresh=p.operations.filter(o=>isNew(o.path));if(fresh.length&&fresh.length!==p.operations.length)invalidModel('procedural writer crosses owner families');
   if(fresh.length){for(const o of fresh){checkPath(o.path);if(scope&&(!scope.writableRoots.includes(o.path.rootStateTypeId)||!scope.targetPaths.some(x=>key(statePathValue(x))===key(statePathValue(o.path)))))invalidModel('procedural write scope');}const result=applyStatePatch(s,p,owner,authority);validateState(result.state);return result;}
   const result=base.applyPatch(without(s),p,owner,scope),state=new AuthoritativeState([...result.state.entries(),...s.entries().filter(e=>isNew(e.path))]);validateState(state);return {...result,state};
  }
 });
}
