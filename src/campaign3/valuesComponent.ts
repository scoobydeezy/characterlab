/** values-component/0.2-candidate: evidence owner; controlled receiver is separate. */
import {canonicalEncode,canonicalDecode,RecordSchemaRegistry} from '../substrate/canonicalEncoding';
import {data,value} from './biologyPublicData';
import {ExactRational as Q} from '../substrate/exactMath';

export const VALUES_VERSION='values-component/0.2-candidate';
export const VALUE_LAWS=['Accumulated','Refold','Latest','NoConsolidation'] as const;
export type ValueLaw=typeof VALUE_LAWS[number];
export interface ValueReceipt {instant:number;id:number;category:'Care'|null;target:'A'|'B';outcome:-1|0|1|null;}
export interface ValueProjection {count:number;mean:string|null;weight:string;preference:string;}
const fraction=(x:Q)=>`${x.numerator}/${x.denominator}`;
function checked(x:ValueReceipt):ValueReceipt {
 if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('VALUES_FIELDS');
 const ds=Object.getOwnPropertyDescriptors(x),names=['instant','id','category','target','outcome'];
 if(Reflect.ownKeys(ds).length!==names.length||names.some(k=>!ds[k]||!('value'in ds[k])))throw Error('VALUES_FIELDS');
 if(!Number.isInteger(x.instant)||x.instant<1||x.instant>64||!Number.isInteger(x.id)||x.id<1||x.id>128||!['Care',null].includes(x.category)||!['A','B'].includes(x.target)||![-1,0,1,null].includes(x.outcome))throw Error('VALUES_INPUT');
 return {...x};
}
function projection(law:ValueLaw,journal:readonly ValueReceipt[]):ValueProjection {
 let xs=journal.filter(x=>x.category==='Care'&&x.outcome!==null);
 if(law==='Latest')xs=xs.slice(-1);
 const n=xs.length,s=xs.reduce((a,x)=>a+ x.outcome!,0);
 return {count:n,mean:n?fraction(Q.of(BigInt(s),BigInt(n))):null,weight:fraction(Q.of(BigInt(n),BigInt(n+1))),preference:law==='NoConsolidation'?'0/1':fraction(Q.of(BigInt(s),BigInt(n+1)))};
}
const bytes=(x:unknown)=>canonicalEncode(data(x));
const equal=(a:Uint8Array,b:Uint8Array)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
export function createValuesOwner(law:ValueLaw){
 if(!VALUE_LAWS.includes(law))throw Error('VALUES_LAW');
 let journal:ValueReceipt[]=[],at=0,stored=projection(law,[]);
 const save=()=>bytes({version:VALUES_VERSION,law,at,journal,stored:law==='Refold'?null:stored});
 return Object.freeze({
  /** Component consolidation at140. No goal/current-Need/hidden-truth operands. */
  admit(input:ValueReceipt,failBeforeCommit=false){
   const x=checked(input),prior=journal.find(v=>v.id===x.id);
   if(prior){if(!equal(bytes(prior),bytes(x)))throw Error('VALUES_RECEIPT_CONFLICT');return false;}
   if(x.instant<=at)throw Error('VALUES_ORDER');
   const next=[...journal,x],cache=projection(law,next);
   if(failBeforeCommit)throw Error('VALUES_INJECTED');
   journal=next;at=x.instant;if(law!=='Refold')stored=cache;return true;
  },
  /** Earlier instants cannot see evidence consolidated at the same instant. */
  view(instant:number):ValueProjection {
   if(!Number.isInteger(instant)||instant<1||instant>65)throw Error('VALUES_PROBE');
   if(instant>at&&law!=='Refold')return {...stored};
   return projection(law,journal.filter(x=>x.instant<instant));
  },
  history(){return journal.map(x=>({...x}));},
  save(){return save().slice();},
 });
}
export function restoreValuesOwner(law:ValueLaw,saved:Uint8Array){
 const copy=saved.slice();
 const raw=value<{version:string;law:ValueLaw;at:number;journal:ValueReceipt[]}>(canonicalDecode(copy,new RecordSchemaRegistry([])));
 if(!raw||raw.version!==VALUES_VERSION||raw.law!==law||!Array.isArray(raw.journal)||raw.journal.length>64)throw Error('VALUES_SAVE');
 const owner=createValuesOwner(law);for(const x of raw.journal)owner.admit(x);
 if(!equal(owner.save(),copy))throw Error('VALUES_RESTORE');
 return owner;
}
/** Authenticate a component save against an externally committed original prefix.
 * The caller binds originals/law/prefix to its RunIdentity; this is not public Save132. */
export function restoreValuesPrefix(law:ValueLaw,originals:readonly ValueReceipt[],prefix:number,saved:Uint8Array){
 if(!Array.isArray(originals)||originals.length>64||!Number.isInteger(prefix)||prefix<0||prefix>originals.length)throw Error('VALUES_ORIGINAL_PREFIX');
 // Canonical data admission rejects sparse arrays, accessors and hidden fields.
 bytes(originals);
 const inputs=originals.map(checked),expected=createValuesOwner(law);
 for(const x of inputs.slice(0,prefix))expected.admit(x);
 if(!equal(expected.save(),saved))throw Error('VALUES_ORIGINAL_MISMATCH');
 return restoreValuesOwner(law,saved);
}
