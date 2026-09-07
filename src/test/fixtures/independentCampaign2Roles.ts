/** Independent finite IDN/origin/role oracle. No production resolver, codec intake or VAL import. */
import {canonicalEncode,list,text,typedIdentifier,unsigned,type CanonicalValue} from '../../substrate/canonicalEncoding';
export type RoleVerdict='ACCEPT'|'CanonicalEncodingError'|'CANONICAL_ROLE_VIOLATION';
export type RoleOperation='qualify'|'qualified-role'|'namespace-role';
const bytes=(v:CanonicalValue)=>Array.from(canonicalEncode(v)).join(',');
const atom=(v:CanonicalValue):v is Extract<CanonicalValue,{kind:'typedIdentifier'}>=>typeof v==='object'&&v.kind==='typedIdentifier';
function shell(v:CanonicalValue):boolean{
 if(!atom(v)||v.namespaceId!==1002n||!atom(v.payload))return false;
 const inner=v.payload;
 return inner.namespaceId===1037n?atom(inner.payload):inner.namespaceId===1122n&&typeof inner.payload==='object'&&inner.payload.kind==='unsigned'&&inner.payload.value>=0n;
}
/** Restricted to the namespaces and atom/list corpus below. Shared cenc is transport only. */
function intake(v:CanonicalValue):boolean{
 if(typeof v==='boolean')return true;
 if(v.kind==='list')return v.items.every(intake);
 if(!atom(v))return true;
 if(v.namespaceId===1002n&&!shell(v))return false;
 if(v.namespaceId===1037n&&!atom(v.payload))return false;
 if(v.namespaceId===1122n&&(typeof v.payload!=='object'||v.payload.kind!=='unsigned'||v.payload.value<0n))return false;
 if(v.namespaceId===1038n&&(typeof v.payload!=='object'||v.payload.kind!=='text'||!v.payload.value||v.payload.value!==v.payload.value.normalize('NFC')))return false;
 return intake(v.payload);
}
export function independentRoleVerdict(value:CanonicalValue,operation:RoleOperation,committedCharacterIds:readonly CanonicalValue[]):RoleVerdict{
 try{canonicalEncode(value);}catch{return 'CanonicalEncodingError';}
 if(operation!=='qualify'){
  if(!intake(value))return 'CanonicalEncodingError';
  if(!atom(value)||value.namespaceId!==1002n)return 'CANONICAL_ROLE_VIOLATION';
  if(operation==='namespace-role')return 'ACCEPT';
 }
 if(!shell(value))return 'CanonicalEncodingError';
 const origin=(value as Extract<CanonicalValue,{kind:'typedIdentifier'}>).payload as Extract<CanonicalValue,{kind:'typedIdentifier'}>;
 return origin.namespaceId===1037n&&committedCharacterIds.some(id=>bytes(id)===bytes(origin.payload))?'ACCEPT':'CANONICAL_ROLE_VIOLATION';
}
export function roleCorpus(){
 const stable=typedIdentifier(1038n,text('character/bridge-subject'));
 const payloads:readonly [string,CanonicalValue][]=[
  ['authored-known',typedIdentifier(1037n,stable)],
  ['authored-missing',typedIdentifier(1037n,typedIdentifier(1038n,text('character/missing')))],
  ['authored-foreign-stable',typedIdentifier(1037n,typedIdentifier(20n,text('character/bridge-subject')))],
  ['authored-empty-stable',typedIdentifier(1037n,typedIdentifier(1038n,text('')))],
  ['authored-text',typedIdentifier(1037n,text('character/bridge-subject'))],
  ['runtime-zero',typedIdentifier(1122n,unsigned(0))],
  ['runtime-one',typedIdentifier(1122n,unsigned(1))],
  ['runtime-large',typedIdentifier(1122n,unsigned(2n**100n))],
  ['runtime-text',typedIdentifier(1122n,text('0'))],
  ['unknown-origin',typedIdentifier(20n,text('character/bridge-subject'))],
  ['text-only',text('character/bridge-subject')],['boolean',false],
 ];
 return [...[1002n,1000n,20n].flatMap(ns=>payloads.map(([name,payload])=>({name:`${ns}/${name}`,value:typedIdentifier(ns,payload)}))),
  {name:'root-boolean',value:false as CanonicalValue},{name:'root-text',value:text('character/bridge-subject')},{name:'root-list',value:list([])}];
}
