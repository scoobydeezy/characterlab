/** Internal registration compilation for general-attention-carrier/0.1-candidate
 * and general-attention-registration-write-scope/0.1-candidate.
 * The implementation bindings come from the model compiler, never public input.
 * This fragment grants no model identity, scheduler admission or state capability. */
import inventory from '../../docs/planning/GA_REGISTRY_MEMBER_SHAPE_REV1.json';
import outputs from '../../docs/planning/GA_OUTPUT_DECLARATIONS_REV3.json';
import allocation from '../../docs/formal/GENERAL_ATTENTION_REGISTRY_MEMBER_ALLOCATION_TABLE.json';
import writeAllocation from '../../docs/formal/GENERAL_ATTENTION_WRITE_SCOPE_ALLOCATION_TABLE.json';
import {canonicalEncode as enc,typedIdentifier,text,type CanonicalValue,type RecordSchema} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as field,dataItems as items,dataUnsigned as uint,dataText as txt,dataKey as key,invalidModel as fail} from '../campaign2/canonicalData';
import {decodeGeneralAttention as decode,generalAttentionSupportedSchemas} from './generalAttentionCodecs';
import type {GeneralPrimitiveContext} from './generalPrimitiveGrammar';
import {validateGeneralWriteScope} from './generalWriteScope';

const schemas=generalAttentionSupportedSchemas();
const names=writeAllocation.records.find(r=>r.typeId===706)!.fields[0].type;
const stageNames='values' in names ? names.values! : [];
const modes=['FreshOwned','NestedOwnedAndReserved','BorrowedOnly','ObserverFileCounter','ReservedOwned'];

function resolveSchema(name:string):RecordSchema {
 const annotated=/^(.*)\/(\d+)$/.exec(name);
 // Only the four explicit inherited annotations are aliases. Do not resolve
 // arbitrary names by their trailing number or invent a successor allocation.
 const inherited:Readonly<Record<string,number>>={
  'DeliberationOpportunity/377':377,'TaskWorkspace/381':381,'TaskAppraisal/384':384,'TaskConcern/388':388,
 };
 const matches=annotated
  ? schemas.filter(s=>inherited[name]!==undefined&&s.typeId===BigInt(inherited[name])&&s.schemaVersion===1n)
  : schemas.filter(s=>s.name===name&&s.schemaVersion===1n);
 if(matches.length!==1)fail('GA ambiguous or missing schema: '+name);
 return matches[0];
}
const member=(ns:number,payload:string)=>{
 if(!allocation.members.some(m=>m.namespace===ns&&m.payload===payload))fail('GA unallocated registry member');
 return typedIdentifier(ns,text(payload));
};

/** Derived from the accepted inventories; numeric stage order is the frozen706 enum. */
export function generalRegistrationTemplates(){
 if(stageNames.length!==67||inventory.stages.length!==67||outputs.stages.length!==67)fail('GA incomplete template inventory');
 return stageNames.map((name,index)=>{
  const rows=inventory.stages.filter(s=>s.name===name),out=outputs.stages.filter(s=>s.name===name);
  if(rows.length!==1||out.length!==1)fail('GA duplicate/missing stage template');
  const stage=rows[0];
  if(stage.phase!==out[0].phase||stage.outputs.length!==out[0].outputs.length||stage.outputs.some((s,i)=>s!==out[0].outputs[i].record))fail('GA output inventory disagreement');
  return {
   name,ordinal:index+1,phase:stage.phase,input:structuredClone(resolveSchema(stage.input)),
   transition:member(1009,stage.transition),event:member(1001,stage.event),seam:member(1036,stage.seam),
   outputs:out[0].outputs.map(o=>({schema:structuredClone(resolveSchema(o.record)),minimum:o.min,maximum:o.max,identityMode:modes.indexOf(o.identity)+1})),
  };
 });
}
type Template=ReturnType<typeof generalRegistrationTemplates>[number];

function schemaRef(value:CanonicalValue,schema:RecordSchema){
 const r=rec(value,254n);
 if(uint(field(r,1n))!==schema.typeId||uint(field(r,2n))!==schema.schemaVersion)fail('GA wrong schema reference');
}
function checkTemplate(value:CanonicalValue,template:Template){
 const r=rec(value,706n);
 if(uint(field(r,1n))!==BigInt(template.ordinal)||key(field(r,2n))!==key(template.seam)||key(field(r,4n))!==key(template.event)||uint(field(r,5n))!==BigInt(template.phase))fail('GA wrong stage binding');
 schemaRef(field(r,6n),template.input);
 const declarations=items(field(r,7n),'list');
 if(declarations.length!==template.outputs.length)fail('GA output count');
 declarations.forEach((value,i)=>{
  const o=rec(value,703n),expected=template.outputs[i];
  schemaRef(field(o,1n),expected.schema);
  if(uint(field(o,2n))!==BigInt(expected.minimum)||uint(field(o,3n))!==BigInt(expected.maximum)||uint(field(o,4n))!==BigInt(expected.identityMode))fail('GA output ownership/cardinality');
 });
 validateGeneralWriteScope(template.name,field(r,9n));
 const purposes=new Set<bigint>();
 for(const value of items(field(r,11n),'list')){
  const binding=rec(value,702n),purpose=uint(field(binding,1n));
  if(purposes.has(purpose))fail('GA duplicate definition purpose');purposes.add(purpose);
 }
 return r;
}

/** Exact comparison against compiler-owned implementation bindings. All fields,
 * including optional PRJ, version, definition references and selector sets, are
 * compared as canonical bytes. Codec/mode validity alone cannot admit a row.
 * Model-specific definition/content/role validation must precede this call. */
export function compileGeneralStageRegistrations(
 registrationBytes:Uint8Array,
 implementationBindings:ReadonlyMap<string,Uint8Array>,
 context:GeneralPrimitiveContext,
){
 const templates=generalRegistrationTemplates();
 // Snapshot every external container before validation, including version bounds.
 const bounds=structuredClone(context),expected=new Map([...implementationBindings].map(([n,b])=>[n,b.slice()]));
 if(expected.size!==templates.length||[...expected.keys()].some(n=>!templates.some(t=>t.name===n)))fail('GA incomplete implementation bindings');
 const rows=items(decode(registrationBytes.slice(),bounds),'set');
 if(rows.length!==templates.length)fail('GA requires all67 registrations');
 const compiled=new Map<string,Uint8Array>(),seen=new Set<number>();
 for(const value of rows){
  const ordinal=Number(uint(field(rec(value,706n),1n))),template=templates[ordinal-1];
  if(!template||seen.has(ordinal))fail('GA duplicate/unknown stage');seen.add(ordinal);
  const r=checkTemplate(value,template),binding=checkTemplate(decode(expected.get(template.name)!,bounds),template);
  if(key(r)!==key(binding))fail('GA registration differs from implementation binding: '+template.name);
  // Require the actual implementation's version, not merely membership in the
  // model's multi-component version vocabulary.
  if(!txt(field(binding,3n)))fail('GA missing implementation version');
  compiled.set(template.name,enc(r));
 }
 return Object.freeze({
  stageNames:Object.freeze(templates.map(t=>t.name)),
  registrationBytes(name:string){const bytes=compiled.get(name);if(!bytes)fail('GA unknown compiled stage');return bytes.slice();},
  transition(name:string){const template=templates.find(t=>t.name===name);if(!template)fail('GA unknown compiled stage');return structuredClone(template.transition);},
 });
}
