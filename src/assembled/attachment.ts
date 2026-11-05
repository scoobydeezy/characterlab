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
