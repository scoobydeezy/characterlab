/** 0.158: one episodic instruction operand, never a second intention store. */
import {canonicalEncode,list,text,unsigned,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import type {StatePath} from '../substrate/state';
import {dataItems as items,dataKey as key,dataText as txt,dataIdentity as id,dataUnsigned as uint,invalidModel} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {recallCanonicalEventAcquisitions} from '../campaign3/canonicalEventRecall';
import {PRIORITY_ADOPTION_OBS,optionalUnit} from './priority';
import type {Strategy} from './strategy';
export const INTENTION_MEMORY='assembled-intention-memory/0.1',INTENTION_CUE=INTENTION_MEMORY+'/cue';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const require=(v:boolean,s:string)=>{if(!v)invalidModel('intention memory '+s);};
export function compileIntentionMemory(v:CanonicalValue,routes:Strategy,bindings:readonly CanonicalValue[]){
 const a=items(v,'list');require(a.length===2&&txt(a[0])===INTENTION_MEMORY,'declaration');
 const tasks=items(a[1],'list');require(tasks.length<=routes.length&&new Set(tasks.map(key)).size===tasks.length&&tasks.every(t=>routes.some(r=>eq(r.task,t))&&bindings.some(b=>eq(b,t))),'task bindings');
 return Object.freeze({tasks:[...tasks],routes,bindings});
}
export type IntentionMemory=ReturnType<typeof compileIntentionMemory>;
export const memoryBound=(d:IntentionMemory|undefined,t:CanonicalValue)=>!!d?.tasks.some(x=>eq(x,t));
export const instructionPath=(C:CanonicalValue,o:CanonicalValue):StatePath=>({rootStateTypeId:346n,fieldId:1n,selectors:[{kind:'mapKey',key:list([text(INTENTION_MEMORY),C,o])}]});
export function isInstructionPath(p:StatePath){const s=p.selectors[0];return p.rootStateTypeId===346n&&p.fieldId===1n&&s?.kind==='mapKey'&&typeof s.key!=='boolean'&&s.key.kind==='list'&&eq(s.key.items[0],text(INTENTION_MEMORY));}
export function instructionEpisode(v:CanonicalValue,d?:IntentionMemory){
 const a=items(v,'list');require(a.length===6&&txt(a[0])===INTENTION_MEMORY,'episode shape');
 const ac=id(a[1]),o=items(a[2],'list'),ob=id(o[1]);require(ac.namespaceId===1125n&&typeof ac.payload!=='boolean'&&ac.payload.kind==='unsigned','acquisition');
 require(o.length===7&&txt(o[0])===PRIORITY_ADOPTION_OBS&&ob.namespaceId===1164n&&typeof ob.payload!=='boolean'&&ob.payload.kind==='unsigned','safe observation');
 require(typeof a[5]!=='boolean'&&a[5].kind==='signed'&&a[5].value===uint(o[2])&&uint(o[2])>=1n&&eq(a[3],o[3])&&optionalUnit(o[4])!==undefined,'source binding');
 const route=items(o[6],'list');require(route.length===1&&eq(route[0],a[4]),'instruction binding');
 if(d)require(memoryBound(d,a[3])&&!!d.routes.find(r=>eq(r.task,a[3]))?.plans.some(p=>eq(p.instructionId,a[4])),'governed route');
 return a;
}
export function isIntentionCue(v:CanonicalValue){return typeof v!=='boolean'&&v.kind==='list'&&eq(v.items[0],text(INTENTION_CUE));}
export function intentionCue(C:CanonicalValue,safe:CanonicalValue,d:IntentionMemory){
 const o=items(safe,'list'),cards=items(o[3],'list').map(v=>items(v,'list')).sort((a,b)=>Number(uint(b[1])-uint(a[1]))||Number(uint(a[0])-uint(b[0])));
 const n=o[4]===true&&cards.length?Number(uint(cards[0][0])):0;
 return list([text(INTENTION_CUE),C,n?list([d.bindings[n-1]??text(INTENTION_MEMORY+'/neutral')]):list([])]);
}
export function recallInstructions(values:readonly CanonicalValue[],cue:CanonicalValue,C:CanonicalValue,at:bigint){
 const c=items(cue,'list');require(c.length===3&&txt(c[0])===INTENTION_CUE&&eq(c[1],C)&&items(c[2],'list').length<=1,'cue');
 const present=items(c[2],'list'),byId=new Map<bigint,CanonicalValue>();
 const memory=values.map(v=>{const a=items(v,'list'),n=uint(id(a[1]).payload);byId.set(n,v);require(typeof a[5]!=='boolean'&&a[5].kind==='signed'&&a[5].value<at,'past acquisition');return {id:n,acquiredAt:(a[5] as {value:bigint}).value,units:[{key:txt(a[0])===INTENTION_MEMORY?a[3]:text(INTENTION_MEMORY+'/neutral'),views:[canonicalEncode(v)]}]};});
 const result=recallCanonicalEventAcquisitions({cue:present.length?{kind:'Present',key:present[0]}:{kind:'Absent'},memory,graph:{keys:[],weights:[]},presentations:new Map(),now:at,calibration:{beta:Q.of(1n,2n),scale:1000n,lambda:Q.of(1n),exponent:1,omegaB:Q.of(0n),omegaA:Q.of(1n),k:1}});
 return {selected:result.recalled.map(a=>byId.get(a.id)!),audit:list([text(INTENTION_CUE),signed(at),cue,text(result.disposition),list(result.recalled.map(a=>unsigned(a.id)))])};
}
export function selectedInstructions(report:CanonicalValue|undefined){return report?items(items(report,'list')[4],'list').map(v=>items(v,'list')[1]).filter(v=>txt(items(v,'list')[0])===INTENTION_MEMORY):[];}
