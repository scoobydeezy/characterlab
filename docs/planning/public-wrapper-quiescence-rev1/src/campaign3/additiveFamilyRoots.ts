/** additive-family-root-component/0.1-candidate; trusted descriptor construction, no read/write grant. */
import {canonicalEncode,bytesToHex,cloneCanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {statePathValue,type StatePath} from '../substrate/state';
export interface FamilyRootExtent {readonly root:bigint;readonly leaves:readonly {readonly leaf:TypedIdentifierValue;readonly field:bigint}[]}
export interface FamilyRootDefinition {readonly family:TypedIdentifierValue;readonly route:TypedIdentifierValue;readonly roots:readonly FamilyRootExtent[]}
export interface AdditiveFamilyRoot extends FamilyRootExtent {readonly family:TypedIdentifierValue}
export interface ProtocolRootExtent {readonly root:bigint;readonly fields:readonly bigint[]}
const fail=(why:string):never=>{throw Error('FAMILY_ROOT_'+why);};
const key=(v:TypedIdentifierValue)=>bytesToHex(canonicalEncode(v));
const copy=(v:TypedIdentifierValue)=>cloneCanonicalValue(v) as TypedIdentifierValue;
const id=(v:TypedIdentifierValue,namespace:bigint)=>{if(!v||v.kind!=='typedIdentifier'||v.namespaceId!==namespace||typeof v.payload!=='object'||v.payload.kind!=='text'||!v.payload.value)fail('IDENTITY');canonicalEncode(v);};
const ordinal=(v:bigint)=>{if(typeof v!=='bigint'||v<=0n)fail('ORDINAL');};
const dense=(v:readonly unknown[],max:number,min=0)=>{if(!Array.isArray(v)||v.length<min||v.length>max||Object.keys(v).length!==v.length||Array.from({length:v.length},(_,i)=>Object.hasOwn(v,i)).some(x=>!x))fail('BOUND');};
type Classification={kind:'Family';family:TypedIdentifierValue;route:TypedIdentifierValue;leaf:TypedIdentifierValue}|{kind:'RuntimeProtocol'};
export function compileAdditiveFamilyRoots(base:readonly FamilyRootDefinition[],additions:readonly AdditiveFamilyRoot[],protocol:readonly ProtocolRootExtent[]=[]){
 dense(base,32);dense(additions,32);dense(protocol,32);
 const families=new Map<string,{family:TypedIdentifierValue;route:TypedIdentifierValue;leaves:Set<string>}>(),roots=new Map<bigint,Map<bigint,Classification>>();
 const add=(extent:FamilyRootExtent,family:ReturnType<typeof families.get>)=>{if(!family)fail('UNDECLARED_FAMILY');ordinal(extent.root);dense(extent.leaves,16,1);if(roots.has(extent.root))fail('DUPLICATE_ROOT');const fields=new Map<bigint,Classification>();
  for(const l of extent.leaves){ordinal(l.field);id(l.leaf,1032n);if(fields.has(l.field)||family!.leaves.has(key(l.leaf)))fail('DUPLICATE_LEAF');family!.leaves.add(key(l.leaf));fields.set(l.field,{kind:'Family',family:copy(family!.family),route:copy(family!.route),leaf:copy(l.leaf)});}roots.set(extent.root,fields);
 };
 for(const f of base){id(f.family,1031n);id(f.route,1026n);dense(f.roots,32);if(families.has(key(f.family)))fail('DUPLICATE_FAMILY');families.set(key(f.family),{family:copy(f.family),route:copy(f.route),leaves:new Set()});for(const root of f.roots)add(root,families.get(key(f.family)));}
 for(const r of additions){id(r.family,1031n);if(Object.keys(r).some(k=>!['family','root','leaves'].includes(k)))fail('ADDITIVE_FIELDS');add(r,families.get(key(r.family)));}
 for(const p of protocol){ordinal(p.root);dense(p.fields,16,1);if(roots.has(p.root))fail('DUPLICATE_ROOT');const fields=new Map<bigint,Classification>();for(const f of p.fields){ordinal(f);if(fields.has(f))fail('DUPLICATE_LEAF');fields.set(f,{kind:'RuntimeProtocol'});}roots.set(p.root,fields);}
 if(roots.size>32)fail('BOUND');
 return Object.freeze({classify(path:StatePath):Classification{statePathValue(path);const result=roots.get(path.rootStateTypeId)?.get(path.fieldId);if(!result)fail('UNDECLARED_PATH');return result!.kind==='RuntimeProtocol'?{kind:'RuntimeProtocol'}:{kind:'Family',family:copy(result!.family),route:copy(result!.route),leaf:copy(result!.leaf)};}});
}
