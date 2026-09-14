/** interoceptive-selection-component/0.1-candidate; codec validation is not public ingress. */
import {canonicalEncode,bytesToHex,type CanonicalValue} from '../substrate/canonicalEncoding';
import {decodeEmbodied} from './embodiedCodecs';
type R=Extract<CanonicalValue,{kind:'record'}>;
export interface InteroceptiveSelectedView {readonly kind:'InteroceptiveSelectedView'}
export interface InteroceptiveSelectionAudit {readonly observationKey:string;readonly disposition:'Selected'|'Capacity'|'Unavailable'}
const views=new WeakMap<InteroceptiveSelectedView,readonly Uint8Array[]>();
const key=(v:CanonicalValue)=>bytesToHex(canonicalEncode(v));
const f=(r:R,n:number)=>r.fields.get(BigInt(n))!;
export function selectInteroceptiveSamples(samples:readonly CanonicalValue[],capacity:number){
 if(!Array.isArray(samples)||samples.length>3||!Array.from({length:samples.length},(_,i)=>Object.hasOwn(samples,i)).every(Boolean))throw Error('invalid interoceptive sample batch');
 if(!Number.isInteger(capacity)||capacity<0||capacity>2)throw Error('invalid interoceptive capacity');
 const rows=samples.map(value=>{
  const bytes=canonicalEncode(value),r=decodeEmbodied(bytes);
  if(typeof r==='boolean'||r.kind!=='record'||r.schema.schemaVersion!==1n||![461n,463n].includes(r.schema.typeId))throw Error('interoceptive sample required');
  const version=f(r,r.schema.typeId===461n?6:5);
  if(typeof version==='boolean'||version.kind!=='text'||version.value!=='embodied-level-observation/0.1-candidate')throw Error('wrong interoceptive producer version');
  return {bytes,observation:key(f(r,1)),observer:key(f(r,2)),channel:key(f(r,3)),at:key(f(r,4)),present:r.schema.typeId===461n};
 });
 if(new Set(rows.map(r=>r.observation)).size!==rows.length||new Set(rows.map(r=>r.channel)).size!==rows.length)throw Error('duplicate interoceptive occurrence/channel');
 if(new Set(rows.map(r=>r.observer)).size>1||new Set(rows.map(r=>r.at)).size>1)throw Error('mixed interoceptive observer/instant');
 rows.sort((a,b)=>a.channel<b.channel?-1:a.channel>b.channel?1:0);
 const selected:Uint8Array[]=[],audit:InteroceptiveSelectionAudit[]=[];
 for(const r of rows){const disposition=!r.present?'Unavailable':selected.length<capacity?'Selected':'Capacity';if(disposition==='Selected')selected.push(r.bytes);audit.push(Object.freeze({observationKey:r.observation,disposition}));}
 const view:InteroceptiveSelectedView=Object.freeze({kind:'InteroceptiveSelectedView'});views.set(view,selected);
 return Object.freeze({view,audit:Object.freeze(audit)});
}
export function consumeInteroceptiveSelection(view:InteroceptiveSelectedView):readonly CanonicalValue[]{
 const values=views.get(view);if(!values)throw Error('invalid or consumed interoceptive selection');
 views.delete(view);return values.map(bytes=>decodeEmbodied(bytes));
}
export function closeInteroceptiveSelection(view:InteroceptiveSelectedView):void{views.delete(view);}
