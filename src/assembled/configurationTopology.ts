/** configuration0.1: fixed-infrastructure comparison image after governed validation. */
import {list,set,map,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataRecord as rec,dataField as f,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
const dynamic=new Set(['registry/task-commitment-spec','registry/task-instruction','registry/protocol-action']);
export function configurationTopology(registry:CanonicalValue){
 const slots=items(registry,'list');
 function walk(v:CanonicalValue):CanonicalValue {
  if(typeof v==='boolean')return v;
  if(v.kind==='record')return record(v.schema,new Map([...v.fields].map(([k,x])=>[k,k===2n&&[374n,416n].includes(v.schema.typeId)?set([]):walk(x)])));
  if(v.kind==='list'||v.kind==='set')return (v.kind==='list'?list:set)(v.items.map(walk));
  if(v.kind==='map')return map(v.entries.map(([k,x])=>[walk(k),walk(x)]));return v;
 }
 return list(slots.map((v,i)=>i?v:walk(set(items(v,'set').filter(v=>typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n||!dynamic.has(txt(id(f(rec(v,171n),2n)).payload)))))));
}
