/** embodied-receiving-allocation/0.1-candidate: closed receiving grammar.
 * Decoding grants no source, state, model or execution authority. */
import allocation from '../../docs/formal/EMBODIED_RECEIVING_ALLOCATION_TABLE.json';
import {canonicalDecode,canonicalEncode,record,RecordSchemaRegistry,type CanonicalValue,type RecordSchema} from '../substrate/canonicalEncoding';
import {validateSemanticReferent} from '../substrate/referentOrigin';
import {SchedulerContractError} from '../substrate/scheduler';
import {embodiedSupportedSchemas,decodeEmbodied} from './embodiedCodecs';
type R=Extract<CanonicalValue,{kind:'record'}>;
type Q=Extract<CanonicalValue,{kind:'rational'}>;
const added:RecordSchema[]=allocation.records.map(r=>({typeId:BigInt(r.typeId),schemaVersion:1n,name:r.name,fields:r.fields.map(f=>({id:BigInt(f.id),name:f.name,required:f.required}))}));
const all=[...embodiedSupportedSchemas(),...added],registry=new RecordSchemaRegistry(all),byName=new Map(all.map(s=>[s.name,s]));
const declarations=new Map(allocation.records.map(r=>[BigInt(r.typeId),r]));
const aliases=allocation.identifierAliases as Readonly<Record<string,number>>;
const fail=(message:string):never=>{throw new SchedulerContractError('INVALID_CONFIGURATION','receiving grammar: '+message);};
const isRecord=(v:CanonicalValue):v is R=>typeof v!=='boolean'&&v.kind==='record';
const field=(v:R,n:number)=>v.fields.get(BigInt(n))??fail('missing field');
const uint=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='unsigned'?v.value:fail('unsigned required');
const rational=(v:CanonicalValue):Q=>typeof v!=='boolean'&&v.kind==='rational'?v:fail('rational required');
const values=(v:CanonicalValue):readonly CanonicalValue[]=>typeof v!=='boolean'&&(v.kind==='set'||v.kind==='list')?v.items:fail('collection required');
const rec=(v:CanonicalValue):R=>isRecord(v)?v:fail('record required');
const zero=(v:CanonicalValue)=>rational(v).numerator===0n;
function typed(v:CanonicalValue,t:string):void {
 if(['unsigned','signed','rational','text'].includes(t)){if(typeof v==='boolean'||v.kind!==t)fail('expected '+t);return;}
 if(t.startsWith('id:')){
  const ns=aliases[t.slice(3)];if(!ns||typeof v==='boolean'||v.kind!=='typedIdentifier'||v.namespaceId!==BigInt(ns))fail('identifier family');
  const x=v as Extract<CanonicalValue,{kind:'typedIdentifier'}>;
  if(ns===1002){validateSemanticReferent(x);return;}
  if(ns>=1100){if(typeof x.payload==='boolean'||x.payload.kind!=='unsigned')fail('occurrence ordinal');return;}
  if(typeof x.payload==='boolean'||x.payload.kind!=='text'||!x.payload.value)fail('identity text');
  if(ns===1040&&(typeof x.payload==='boolean'||x.payload.kind!=='text'||!['Commitment','EmbodiedFuelDeficit'].includes(x.payload.value)))fail('motive vocabulary');
  return;
 }
 const collection=/^(set|list|map)<(.*)>$/.exec(t);
 if(collection){if(typeof v==='boolean'||v.kind!==collection[1])fail('collection kind');
  if(collection[1]==='map'){const types=collection[2].split(',');if(types.length!==2)fail('map type grammar');for(const [a,b] of (v as Extract<CanonicalValue,{kind:'map'}>).entries){typed(a,types[0]);typed(b,types[1]);}}
  else for(const x of values(v))typed(x,collection[2]);return;
 }
 const s=byName.get(t);if(!s||!isRecord(v)||v.schema.typeId!==s.typeId||v.schema.schemaVersion!==s.schemaVersion)fail('nested '+t);
}
function domains(v:R):void {
 const type=Number(v.schema.typeId),f=(n:number)=>field(v,n);
 const variants=allocation.unionDefinitions.filter(u=>u.recordTypeId===type);
 if(variants.length){const row=variants.find(u=>BigInt(u.tag)===uint(f(1)));if(!row)fail('unknown union');for(const n of row!.requiredPayloadFieldIds)if(!v.fields.has(BigInt(n)))fail('union required payload');for(const n of row!.forbiddenPayloadFieldIds)if(v.fields.has(BigInt(n)))fail('union forbidden payload');}
 for(const finite of allocation.finiteDomains)if(finite.recordTypeId===type&&!finite.values.some(x=>BigInt(x.value)===uint(f(finite.fieldId))))fail('finite domain');
 const boundedCollection=(n:number,max:number)=>{if(values(f(n)).length>max)fail('finite collection bound');};
 if(type===486)boundedCollection(1,2);
 if(type===489){boundedCollection(3,2);const pressure=rec(f(2)),version=field(pressure,5);if(typeof version==='boolean'||version.kind!=='text'||version.value!=='embodied-pressure/0.2-candidate')fail('receiving pressure version');const result=rec(field(pressure,4));if((uint(field(result,1))===2n||zero(field(result,2)))&&values(f(3)).length)fail('inactive pressure cannot generate body origins');}
 if(type===490){boundedCollection(2,1);boundedCollection(3,2);if(!values(f(2)).length&&!values(f(3)).length)fail('option requires origin');}
 if(type===492)boundedCollection(3,2);
 if(type===495){const body=uint(field(rec(f(2)),1))===2n;if(body!==v.fields.has(4n)||body&&uint(f(3))!==1n)fail('ground-specific signal key');}
 if(type===496&&zero(f(2)))fail('zero raw source');
 if(type===499){boundedCollection(3,5);boundedCollection(4,2);}
 if(type===500){for(const n of [2,3,4,5])if(rational(f(n)).numerator<0n)fail('negative coverage operand');for(const n of [3,4]){const q=rational(f(n));if(q.numerator>q.denominator)fail('coverage fraction');}}
 if(type===503&&!([4n,6n,8n,10n,12n].includes(uint(f(4)))))fail('die vocabulary');
 if(type===504)boundedCollection(3,3);
 if(type===506){boundedCollection(2,2);boundedCollection(9,3);for(const n of [3,4,6,7]){const q=rational(f(n));if(q.numerator<0n||q.numerator>q.denominator)fail('analysis unit interval');}if(rational(f(5)).numerator<0n)fail('negative conflict mass');}
 if(type===508){const at=f(2);if(typeof at==='boolean'||at.kind!=='signed'||at.value<=0n)fail('positive resolution instant');}
 if(type===509&&uint(field(rec(field(rec(f(2)),4)),1))!==3n)fail('chosen intent required');
 if(type===511){boundedCollection(3,2);const version=f(4);if(typeof version==='boolean'||version.kind!=='text'||version.value!=='embodied-choice-expression/0.1-candidate')fail('expression scope');}
 if(type===512&&!([1n,2n].includes(uint(f(3)))))fail('requested contact count');
 if(type===514){const count=uint(f(3)),requested=uint(field(rec(field(rec(f(2)),2)),3));if(count!==0n&&count!==requested)fail('actual completed count');}
}
function validate(root:CanonicalValue){
 const cache=new WeakMap<object,boolean>();
 function extended(v:CanonicalValue):boolean {if(typeof v==='boolean')return false;const old=cache.get(v);if(old!==undefined)return old;const yes=isRecord(v)?declarations.has(v.schema.typeId)||[...v.fields.values()].some(extended):v.kind==='list'||v.kind==='set'?v.items.some(extended):v.kind==='map'?v.entries.some(([a,b])=>extended(a)||extended(b)):v.kind==='typedIdentifier'?extended(v.payload):false;cache.set(v,yes);return yes;}
 function visit(v:CanonicalValue):void {if(!extended(v)){decodeEmbodied(canonicalEncode(v));return;}if(typeof v==='boolean')return;
  if(isRecord(v)){const declaration=declarations.get(v.schema.typeId);if(declaration){for(const f of declaration.fields){const x=v.fields.get(BigInt(f.id));if(x!==undefined)typed(x,f.type);}domains(v);}for(const x of v.fields.values())visit(x);}
  else if(v.kind==='set'||v.kind==='list')v.items.forEach(visit);else if(v.kind==='map')for(const [a,b] of v.entries){visit(a);visit(b);}else if(v.kind==='typedIdentifier')visit(v.payload);
 }
 visit(root);
}
export function decodeReceiving(bytes:Uint8Array):CanonicalValue {const v=canonicalDecode(bytes,registry);validate(v);return v;}
export function receivingSchema(type:bigint):RecordSchema {return all.filter(s=>s.typeId===type).at(-1)??fail('unknown schema');}
export const receivingSupportedSchemas=()=>all.map(s=>({...s,fields:s.fields.map(f=>({...f}))}));
export function receivingRecord(type:number,values:readonly CanonicalValue[]):CanonicalValue {const s=receivingSchema(BigInt(type));return decodeReceiving(canonicalEncode(record(s,new Map(values.map((v,i)=>[BigInt(i+1),v])))));}
