/** Versioned conservative closure: every unclassified family is protected. */
import {list,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {statePathValue,restoreAuthoritativeState} from '../substrate/state';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataUnsigned as uint,invalidModel} from '../campaign2/canonicalData';
export const PROTECTION_VERSION='assembled-learning-protection/0.1';
export const learningProtectionDeclaration=()=>list([text(PROTECTION_VERSION),text('all-except'),list([u(302)]),list([307,324,325,334].map(u))]);
export function compileLearningProtection(declaration:CanonicalValue,registry:CanonicalValue){
 if(key(declaration)!==key(learningProtectionDeclaration()))invalidModel('exact exhaustive learning protection declaration required');
 const slots=items(declaration,'list'),privateRoots=items(slots[2],'list').map(uint),privateOutputs=items(slots[3],'list').map(uint);
 const rows=items(items(registry,'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n));
 const named=(name:string)=>rows.find(r=>{const id=f(r,1n);return typeof id!=='boolean'&&id.kind==='typedIdentifier'&&key(id.payload)===key(text(name));})??invalidModel('missing governed route definition');
 const entries=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='map')return invalidModel('route map required');return v.entries;};
 const isLearning=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='typedIdentifier'&&key(v.payload)===key(text('route/character-learning'));
 const families=entries(f(rec(f(named('definition/campaign2-state-families'),4n),284n),1n)).filter(([,v])=>isLearning(f(rec(v,285n),1n)));
 const roots=families.flatMap(([,v])=>{const storage=rec(f(rec(v,285n),2n),286n);return storage.fields.has(2n)?[uint(f(storage,2n))]:[];});
 const routes=entries(f(rec(f(named('definition/transition-admission'),4n),279n),2n)).filter(([,v])=>isLearning(v));
 const schemas=new Set<string>();
 for(const [transition] of routes){const row=rows.find(r=>key(f(r,1n))===key(transition))??invalidModel('missing learning transition');let value=f(row,4n);if(typeof value!=='boolean'&&value.kind==='record'&&[356n,357n].includes(value.schema.typeId))value=f(value,1n);
  if(typeof value==='boolean'||value.kind!=='record')invalidModel('learning registration');
  const outputs=[450n,375n].includes(value.schema.typeId)?f(value,5n):[364n,376n].includes(value.schema.typeId)?f(value,6n):f(rec(f(value,3n),value.schema.typeId===347n?348n:271n),3n);
  for(const o of items(outputs,'set')){const s=rec(f(rec(o,277n),1n),254n);schemas.add(uint(f(s,1n))+'/'+uint(f(s,2n)));}
 }
 if(!families.length||!roots.length||!schemas.has('269/1')||!schemas.has('270/1')||roots.some(r=>privateRoots.includes(r))||[...schemas].some(s=>privateOutputs.includes(BigInt(s.split('/')[0]))))invalidModel('learning protection excludes required route members');
 return Object.freeze({query:()=>({version:PROTECTION_VERSION,inheritedFamilies:families.map(([k])=>structuredClone(k)),inheritedStateRoots:[...roots],inheritedOutputSchemas:[...schemas].sort(),stateDefault:'protected',outputDefault:'protected',privateRoots:[...privateRoots],privateOutputs:[...privateOutputs]}),
  state:(value:CanonicalValue)=>list(restoreAuthoritativeState(value).entries().filter(e=>!privateRoots.includes(e.path.rootStateTypeId)).map(e=>list([statePathValue(e.path),e.value]))),
  outputs:(value:CanonicalValue)=>list(items(value,'list').filter(v=>typeof v==='boolean'||v.kind!=='record'||!privateOutputs.includes(v.schema.typeId)))
 });
}
