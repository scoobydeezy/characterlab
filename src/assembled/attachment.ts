/** DependenceHistory: derived from admitted own support, never a second store. */
import {list,text,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import {qValue} from '../campaign2/cognitiveMath';
import {sid} from './skill';
export const ATTACHMENT='assembled-attachment/0.1',ATTACHMENT_VERSION='assembled-character-attachment/0.1-candidate',ATTACHMENT_CUE=sid(1001,'event/assembled-attachment-cue');
const require=(b:boolean,s:string)=>{if(!b)invalidModel('attachment '+s);};
export function compileAttachment(v:CanonicalValue){const a=items(v,'list');require(a.length===1&&txt(a[0])===ATTACHMENT,'declaration');return true;}
export function supportSource(v:CanonicalValue){const a=items(v,'list');require(a.length===7&&uint(a[1])<=2n&&[0,2,3,4,5,6].every(i=>typeof a[i]==='boolean'),'support source');return {value:a,permitted:a[0]===true&&a[5]===true};}
export function safeSupport(v:ReturnType<typeof supportSource>,access:boolean){return list(v.permitted&&access?v.value.slice(1,5):[]);}
export function supportTuple(v:CanonicalValue){const a=items(v,'list');require(a.length===0||a.length===4&&uint(a[0])<=2n&&a.slice(1).every(x=>typeof x==='boolean'),'support tuple');return a;}
export function attachmentCue(v:CanonicalValue,targets:readonly CanonicalValue[]){const a=items(v,'list');require(a.length===7&&txt(a[0])===ATTACHMENT&&targets.some(t=>key(t)===key(a[1]))&&a.slice(2).every(x=>typeof x==='boolean'),'cue');return {target:a[1],safe:list(a[5]===true?a.slice(2,5):[])};}
export function attachmentFold(rows:readonly CanonicalValue[],cue:CanonicalValue|undefined){
 const qualifying=rows.filter(v=>{const a=items(v,'list'),s=a.length===8?supportTuple(a[7]):[];return a[4]===true&&a[5]===true&&s.length===4&&uint(s[0])>0n&&s.slice(1).every(x=>x===true);});
 const count=BigInt(qualifying.length),bond=Q.of(count>=2n?2n:count,2n),safe=cue?items(items(cue,'list')[5],'list'):[];
 const missing=safe.length?bond.multiply(Q.of(safe[0]===true?0n:1n)):undefined;
 return {qualifying,count,bond,missing,report:list([text(ATTACHMENT+'/appraisal'),unsigned(count),qValue(bond),list(missing?[qValue(missing)]:[]),cue??list([]),list(qualifying.map(v=>items(v,'list')[0]))])};
}

/** HistoryAndFuture successor: admitted person evidence, no stored grief. */
export const LOSS='assembled-loss/0.1',LOSS_VERSION='assembled-character-loss/0.1-candidate';
export type LossSettings=ReadonlyArray<{target:CanonicalValue;action:CanonicalValue}>;
export function compileLoss(v:CanonicalValue,bindings:readonly {target:CanonicalValue;action:CanonicalValue}[],actions:readonly CanonicalValue[]):LossSettings{
 const a=items(v,'list');require(a.length===2&&txt(a[0])===LOSS,'loss declaration');
 const rows=items(a[1],'list').map(v=>{const r=items(v,'list');require(r.length===2&&bindings.some(b=>key(b.target)===key(r[0]))&&actions.some(x=>key(x)===key(r[1]))&&!bindings.some(b=>key(b.target)===key(r[0])&&key(b.action)===key(r[1])),'loss target/action');return {target:r[0],action:r[1]};});
 require(rows.length===bindings.length&&new Set(rows.map(r=>key(r.target))).size===rows.length,'loss coverage/duplicates');return rows;
}
export function returnSource(v:CanonicalValue){const a=items(v,'list');require(a.length===4&&typeof a[0]==='boolean'&&typeof a[2]==='boolean'&&uint(a[1])<=2n&&uint(a[3])<=2n,'return source');return {safe:list(a[0]===true&&a[2]===true?[a[1]]:[])};}
export function returnTuple(v:CanonicalValue){const a=items(v,'list');require(a.length===0||a.length===1&&uint(a[0])<=2n,'return tuple');return a;}
export function lossFold(attachment:ReturnType<typeof attachmentFold>,person:readonly CanonicalValue[]){
 const latest=person.filter(v=>{const a=items(v,'list');return a.length===9&&returnTuple(a[8]).length===1;}).at(-1);
 const future=latest?Q.of(uint(returnTuple(items(latest,'list')[8])[0]),2n):undefined;
 const missing=attachment.missing,loss=missing!==undefined&&future!==undefined?missing.multiply(Q.of(1n).subtract(future)):undefined,reunion=missing!==undefined&&future!==undefined?missing.multiply(future):undefined;
 const sources=latest?[items(latest,'list')[0]]:[];
 return {future,loss,reunion,sources,report:list([text(LOSS+'/appraisal'),... [attachment.bond,missing,future,loss,reunion].map(q=>list(q===undefined?[]:[qValue(q)])),list(sources)])};
}
