/** Isolated structural probe schema support; profile admission owns semantics. */
import allocation from '../../docs/formal/REGULATORY_PROBE_ALLOCATION_TABLE.json';
import {canonicalDecode,RecordSchemaRegistry,record,type CanonicalValue,type RecordSchema} from '../substrate/canonicalEncoding';
import {campaign2SupportedSchemas} from './codecs';
import {decodeCampaign2} from './codecs';
import {canonicalEncode} from '../substrate/canonicalEncoding';
import {dataField as f,dataRecord as rec,dataKey as key} from './canonicalData';
import {statePathValue,statePathPatternValue,type StatePath,type StatePathPattern} from '../substrate/state';
import {list,text,typedIdentifier} from '../substrate/canonicalEncoding';
export const schemas:RecordSchema[]=allocation.records.map(r=>({typeId:BigInt(r.typeId),schemaVersion:BigInt(r.schemaVersion),name:r.name,fields:r.fields.map(f=>({id:BigInt(f.id),name:f.name,required:f.required}))}));
const registry=new RecordSchemaRegistry();
for(const s of [...campaign2SupportedSchemas(),...schemas])registry.register(s);
export function decodeProbeReview(bytes:Uint8Array){return canonicalDecode(bytes,registry);}
/** Archive traversal validates nested old contracts too; no current-state recomputation. */
export function validateProbeArchive(value:CanonicalValue,channel:CanonicalValue,variableDefinition:CanonicalValue,definitionId:CanonicalValue,readContract:{available:boolean;permitted:boolean;path:StatePath;pattern:StatePathPattern}){
 const vd=rec(variableDefinition,280n),scale=f(vd,1n),minimum=f(vd,2n),maximum=f(vd,3n);
 if(typeof scale==='boolean'||scale.kind!=='unsigned'||typeof minimum==='boolean'||minimum.kind!=='signed'||typeof maximum==='boolean'||maximum.kind!=='signed')throw Error('invalid diagnostic domain');
 const scaleValue=scale.value;
 const inDomain=(n:bigint)=>n>=minimum.value&&n<=maximum.value;
 function walk(v:CanonicalValue):boolean{
  if(typeof v==='boolean')return false;
  if(v.kind==='record'){
   const children=[...v.fields.values()].map(walk),special=v.schema.typeId>=331n&&v.schema.typeId<=335n;
   if(v.schema.typeId===160n){
    const event=rec(f(v,4n),130n),eventType=f(event,5n);
    if(typeof eventType!=='boolean'&&eventType.kind==='typedIdentifier'&&eventType.namespaceId===1001n&&typeof eventType.payload!=='boolean'&&eventType.payload.kind==='text'&&eventType.payload.value.startsWith('event/regulatory-diagnostic-probe')){
     const eventName=eventType.payload.value;
     const suffixes=['','-observation','-tracking','-binding','-classification','-freeze','-evaluation-padding','-evidence-padding'],index=suffixes.findIndex(s=>'event/regulatory-diagnostic-probe'+s===eventName);
     const phase=f(event,3n),reads=f(v,11n);
     const expectedType=index===0&&readContract.available?334n:index===1&&readContract.permitted?203n:index===5&&readContract.permitted?227n:undefined,output=f(v,13n);
     if(expectedType===undefined?key(output)!==key(list([])):typeof output==='boolean'||output.kind!=='record'||output.schema.typeId!==expectedType)throw Error('archived probe output outside producer closure');
     if(index<0||typeof phase==='boolean'||phase.kind!=='unsigned'||phase.value!==(index===0?110n:index>=6?130n:119n+BigInt(index))||key(f(v,7n))!==key(eventType)||key(f(v,12n))!==key(f(event,6n))||key(f(v,5n))!==key(typedIdentifier(1036,text('seam/regulatory-diagnostic-probe')))||key(f(v,6n))!==key(text('regulatory-diagnostic-probe/0.1-candidate')))throw Error('invalid archived probe trace owner/phase');
     if(key(f(v,10n))!==key(list(index===0?[statePathPatternValue(readContract.pattern)]:[]))||typeof reads==='boolean'||reads.kind!=='list'||reads.items.length!==(index===0&&readContract.available?1:0))throw Error('invalid archived probe read count/domain');
     for(const r of reads.items){const ar=rec(r,147n);if(key(f(ar,1n))!==key(typedIdentifier(1028,text('accessor/regulatory-diagnostic-displacement-prior')))||key(f(ar,2n))!==key(statePathValue(readContract.path))||key(f(ar,5n))!==key(list([]))||f(ar,6n)!==false)throw Error('invalid archived probe accessor');}
     for(const field of [14n,15n,17n,19n])if(key(f(v,field))!==key(list([])))throw Error('invalid probe trace side effect');
     if(key(f(rec(f(v,16n),144n),1n))!==key(list([])))throw Error('probe trace patch');
    }
   }
   if(v.schema.typeId===333n&&key(f(v,1n))!==key(definitionId))throw Error('unresolved probe definition');
   if(v.schema.typeId===334n){const occurrence=f(v,1n),at=f(v,3n),n=f(v,4n);
    if(typeof occurrence==='boolean'||occurrence.kind!=='typedIdentifier'||occurrence.namespaceId!==1123n||typeof occurrence.payload==='boolean'||occurrence.payload.kind!=='unsigned'||key(f(v,2n))!==key(definitionId)||typeof at==='boolean'||at.kind!=='signed'||at.value<=0n||typeof n==='boolean'||n.kind!=='signed'||!inDomain(n.value))throw Error('invalid archived probe truth');
   }
   if(v.schema.typeId===335n){
    const tag=f(v,1n);if(typeof tag==='boolean'||tag.kind!=='unsigned')throw Error('invalid probe tag');
    const e=allocation.unionVariantEntries.find(e=>e.definition.fields[1].value===Number(tag.value));if(!e)throw Error('unknown governed probe variant');
    const required=e.definition.fields[2].values!,forbidden=e.definition.fields[3].values!;
    if(required.some(i=>!v.fields.has(BigInt(i)))||forbidden.some(i=>v.fields.has(BigInt(i))))throw Error('probe union field closure');
    if(tag.value===2n&&key(f(v,3n))!==key(f(rec(f(v,2n),334n),2n)))throw Error('probe definition mismatch');
    if(tag.value===3n)rec(f(v,4n),216n);
   }
   if(v.schema.typeId===203n&&key(f(v,11n))===key({kind:'text',value:'regulatory-diagnostic-probe/0.1-candidate'})){
    const c=rec(channel,332n),interval=rec(f(v,6n),204n);
    if(key(f(v,2n))!==key(f(c,2n))||key(f(v,3n))!==key(f(c,3n))||key(f(v,4n))!==key(f(c,1n))
     ||f(interval,1n)!==true||f(interval,3n)!==true||key(f(interval,2n))!==key(f(interval,4n)))throw Error('invalid diagnostic observation');
    const q=f(interval,2n),precision=f(v,8n),kind=f(v,7n),oid=f(v,1n),at=f(v,5n);
    if(typeof q==='boolean'||q.kind!=='rational'||typeof precision==='boolean'||precision.kind!=='rational'||precision.numerator!==1n||precision.denominator!==1n||typeof kind==='boolean'||kind.kind!=='unsigned'||kind.value!==1n||typeof oid==='boolean'||oid.kind!=='typedIdentifier'||oid.namespaceId!==1115n||typeof at==='boolean'||at.kind!=='signed'||at.value<=0n)throw Error('invalid diagnostic scalar/identity');
    if(typeof oid.payload==='boolean'||oid.payload.kind!=='unsigned'||q.numerator*scaleValue%q.denominator!==0n||!inDomain(q.numerator*scaleValue/q.denominator))throw Error('diagnostic scalar outside lattice/domain');
    for(const i of [9n,10n]){const x=f(v,i);if(typeof x==='boolean'||x.kind!=='list'||x.items.length)throw Error('diagnostic evidence leakage');}
    return true;
   }
   if(!special&&!children.some(Boolean))decodeCampaign2(canonicalEncode(v));
   return special||children.some(Boolean);
  }
  if(v.kind==='list'||v.kind==='set')return v.items.map(walk).some(Boolean);
  if(v.kind==='map')return v.entries.flatMap(([k,x])=>[walk(k),walk(x)]).some(Boolean);
  if(v.kind==='typedIdentifier')return walk(v.payload);
  return false;
 }
 walk(value);
 // Outputs are exactly the ordered production projections, not an independent evidence source.
 if(typeof value!=='boolean'&&value.kind==='record'&&value.schema.typeId===132n){
  const traces=f(value,11n),outputs=f(value,12n);if(typeof traces==='boolean'||traces.kind!=='list')throw Error('invalid archived trace list');
  const produced=traces.items.flatMap(t=>{const projection=f(rec(t,160n),13n);return typeof projection!=='boolean'&&projection.kind==='list'?[...projection.items]:[projection];});
  if(key(outputs)!==key(list(produced)))throw Error('archived outputs differ from exact producer trace');
 }
}
export function probeSupportedSchemas(){return [...campaign2SupportedSchemas(),...schemas];}
export function probeCanonicalRecord(type:number,values:CanonicalValue[]){return probeRecord(type,values);}
export function probeRecord(type:number,values:CanonicalValue[]){return record(schemas.find(s=>s.typeId===BigInt(type))!,new Map(values.map((v,i)=>[BigInt(i+1),v])));}
