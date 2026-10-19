/** embodied-reserve-allocation/0.1-candidate and its accepted EMB seam bundle.
 * Canonical shape/domain admission only. Decoding does not authenticate production. */
import allocation from '../../docs/formal/EMBODIED_RESERVE_ALLOCATION_TABLE.json';
import {canonicalDecode,canonicalEncode,RecordSchemaRegistry,record,type CanonicalValue,type RecordSchema} from '../substrate/canonicalEncoding';
import {cognitiveSupportedSchemas,decodeCognitive} from '../campaign2/cognitiveCodecs';
import {validateSemanticReferent} from '../substrate/referentOrigin';
import {SchedulerContractError} from '../substrate/scheduler';

type R=Extract<CanonicalValue,{kind:'record'}>;
type Q=Extract<CanonicalValue,{kind:'rational'}>;
const added:RecordSchema[]=allocation.records.map(r=>({typeId:BigInt(r.typeId),schemaVersion:1n,name:r.name,fields:r.fields.map(f=>({id:BigInt(f.id),name:f.name,required:f.required}))}));
const all=[...cognitiveSupportedSchemas(),...added],registry=new RecordSchemaRegistry(all);
const names=new Map(all.map(s=>[s.name,s]));
const declarations=new Map(allocation.records.map(r=>[BigInt(r.typeId),r]));
const namespaces=new Map([...allocation.roles,...allocation.mapKeyRoles,...allocation.collectionIdentityChecks].map(r=>[r.family,BigInt(r.requiredNamespace)]));
const external=new Map(Object.entries(allocation.existingRecordReferences).map(([name,ref])=>[name,ref.split('/').map(BigInt)]));
const fail=(message:string):never=>{throw new SchedulerContractError('INVALID_CONFIGURATION','embodied codec: '+message);};
const isRecord=(v:CanonicalValue):v is R=>typeof v!=='boolean'&&v.kind==='record';
const q=(v:CanonicalValue):Q=>{if(typeof v==='boolean'||v.kind!=='rational')return fail('rational required');return v;};
const compare=(a:Q,b:Q)=>a.numerator*b.denominator-b.numerator*a.denominator;
const positive=(v:CanonicalValue)=>{if(q(v).numerator<=0n)fail('positive quantity required');};
const nonnegative=(v:CanonicalValue)=>{if(q(v).numerator<0n)fail('nonnegative quantity required');};
const field=(r:R,n:number):CanonicalValue=>r.fields.get(BigInt(n))??fail('missing required field');
function type(v:CanonicalValue,t:string):void {
 if(t==='boolean'){if(typeof v!=='boolean')fail('Boolean required');return;}
 if(['rational','unsigned','text','SimInstant'].includes(t)){
  const kind=t==='SimInstant'?'signed':t;if(typeof v==='boolean'||v.kind!==kind)fail(t+' required');
  if(t==='SimInstant'){const n=(v as Extract<CanonicalValue,{kind:'signed'}>).value;if(n<0n||n>9223372036854775807n)fail('SimInstant outside domain');}return;
 }
 if(t.startsWith('id:')){
  const ns=namespaces.get(t.slice(3));if(typeof v==='boolean'||v.kind!=='typedIdentifier'||v.namespaceId!==ns)fail('wrong identity family');
  const id=v as Extract<CanonicalValue,{kind:'typedIdentifier'}>;
  if(ns===1002n){validateSemanticReferent(id);return;}
  if(ns===1106n||ns===1115n||ns===1142n){if(typeof id.payload==='boolean'||id.payload.kind!=='unsigned')fail('unsigned occurrence required');}
  else if(typeof id.payload==='boolean'||id.payload.kind!=='text'||!id.payload.value)fail('nonempty text identity required');return;
 }
 if(t.startsWith('set<')){if(typeof v==='boolean'||v.kind!=='set')fail('set required');for(const x of (v as Extract<CanonicalValue,{kind:'set'}>).items)type(x,t.slice(4,-1));return;}
 if(t.startsWith('map<')){if(typeof v==='boolean'||v.kind!=='map')fail('map required');const [k,value]=t.slice(4,-1).split(';');for(const [a,b] of (v as Extract<CanonicalValue,{kind:'map'}>).entries){type(a,k);type(b,value);}return;}
 if(t==='EmbodiedSample'){if(!isRecord(v)||v.schema.schemaVersion!==1n||![461n,463n].includes(v.schema.typeId))fail('exact present/unavailable sample required');return;}
 const target=external.get(t)??[names.get(t)?.typeId,names.get(t)?.schemaVersion];
 if(!isRecord(v)||v.schema.typeId!==target[0]||v.schema.schemaVersion!==target[1])fail('wrong nested schema '+t);
}
function domains(r:R):void {
 const f=(n:number)=>field(r,n),id=Number(r.schema.typeId);
 const positiveFields:Record<number,number[]>={453:[2],458:[5,6],460:[2],484:[2,3]};
 const nonnegativeFields:Record<number,number[]>={453:[3],454:[1],462:[1,2],477:[4],479:[1,2,3,4,5],484:[1]};
 for(const n of positiveFields[id]??[])positive(f(n));for(const n of nonnegativeFields[id]??[])nonnegative(f(n));
 if(id===458||id===484){const C=q(f(id===458?5:2)),w=q(f(id===458?6:3));if(compare(w,C)>0n||(C.numerator*w.denominator)%(C.denominator*w.numerator)!==0n)fail('nonintegral capacity/bin width');}
 if(id===462&&compare(q(f(1)),q(f(2)))>=0n)fail('interval must have positive width');
 if(id===481||id===482){
  const tag=f(1) as Extract<CanonicalValue,{kind:'unsigned'}>;
  const row=allocation.unionVariants.find(u=>u.recordTypeId===id&&BigInt(u.tag)===tag.value);if(!row)fail('unknown union tag');
  for(const n of row!.requiredFields)if(!r.fields.has(BigInt(n)))fail('missing union payload');
  for(const n of row!.forbiddenFields)if(r.fields.has(BigInt(n)))fail('forbidden union payload');
  if(id===481&&tag.value===1n){const value=q(f(2));if(value.numerator<0n||value.numerator>value.denominator)fail('pressure outside [0,1]');}
  if(id===482){const sample=f(2) as R;if(sample.schema.typeId!==(tag.value===1n?461n:463n))fail('carrier/sample branch mismatch');}
 }
 if(id===464){const sample=f(3) as R,result=f(4) as R;if((field(result,1) as Extract<CanonicalValue,{kind:'unsigned'}>).value!==(sample.schema.typeId===461n?1n:2n))fail('pressure/sample branch mismatch');}
 if(id===484){const level=q(f(1)),C=q(f(2)),w=q(f(3)),index=(f(4) as Extract<CanonicalValue,{kind:'unsigned'}>).value;
  if(compare(level,C)>0n)fail('bin input exceeds capacity');const count=C.numerator*w.denominator/(C.denominator*w.numerator);
  const expected=compare(level,C)===0n?count-1n:level.numerator*w.denominator/(level.denominator*w.numerator);
  if(index!==expected)fail('incorrect bin quantization');
 }
 for(const finite of allocation.finiteValues)if(finite.recordTypeId===id&&(f(finite.fieldId) as Extract<CanonicalValue,{kind:'unsigned'}>).value!==BigInt(finite.value))fail('unsupported finite rule');
}
function validate(root:CanonicalValue):void {
 const cache=new WeakMap<object,boolean>();
 function extended(v:CanonicalValue):boolean{if(typeof v==='boolean')return false;const hit=cache.get(v);if(hit!==undefined)return hit;
  const found=isRecord(v)?declarations.has(v.schema.typeId)||[...v.fields.values()].some(extended):v.kind==='list'||v.kind==='set'?v.items.some(extended):v.kind==='map'?v.entries.some(([a,b])=>extended(a)||extended(b)):v.kind==='typedIdentifier'?extended(v.payload):false;cache.set(v,found);return found;}
 function visit(v:CanonicalValue):void {
  if(!extended(v)){decodeCognitive(canonicalEncode(v));return;}if(typeof v==='boolean')return;
  if(isRecord(v)){const d=declarations.get(v.schema.typeId);if(d){for(const f of d.fields){const value=v.fields.get(BigInt(f.id));if(value!==undefined)type(value,f.type);}domains(v);}for(const child of v.fields.values())visit(child);}
  else if(v.kind==='list'||v.kind==='set')v.items.forEach(visit);else if(v.kind==='map')for(const [k,x] of v.entries){visit(k);visit(x);}else if(v.kind==='typedIdentifier')visit(v.payload);
 }
 visit(root);
}
export function embodiedSupportedSchemas():RecordSchema[]{return [...all];}
export function embodiedSchema(typeId:bigint):RecordSchema {const s=all.filter(s=>s.typeId===typeId).at(-1);if(!s)return fail('unknown schema');return s;}
export function decodeEmbodied(bytes:Uint8Array):CanonicalValue {const value=canonicalDecode(bytes,registry);validate(value);return value;}
export function embodiedRecord(typeId:number,values:readonly CanonicalValue[]):CanonicalValue {const schema=embodiedSchema(BigInt(typeId));const value=record(schema,new Map(values.map((v,i)=>[BigInt(i+1),v])));return decodeEmbodied(canonicalEncode(value));}
