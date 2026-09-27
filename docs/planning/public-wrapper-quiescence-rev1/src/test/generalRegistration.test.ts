import {it,expect} from 'vitest';
import policy from '../../docs/formal/GENERAL_ATTENTION_WRITE_SCOPE_POLICY.json';
import {generalRegistrationTemplates,compileGeneralStageRegistrations as compile} from '../campaign3/generalRegistration';
import {generalAttentionRawRecord as raw,generalAttentionRecord as ga,generalAttentionSchema as schema,decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {attentionRecord as ar} from '../campaign3/attentionCodecs';
import {campaign2Record} from '../campaign2/codecs';
import {canonicalEncode as enc,unsigned as u,text,typedIdentifier as tid,list,set,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {statePathPatternValue} from '../substrate/state';
const context={admittedVersions:['registration-fixture/1','registration-fixture/2']};
const id=(ns:number,name:string)=>tid(ns,text(name));
const ref=(type:bigint)=>ar(254,[u(type),u(1)]);
// These are synthetic implementation bindings for testing the compiler fragment,
// not public model recipes or evidence of subject/state admission.
function fixture(){
 const bindings=new Map<string,Uint8Array>();
 for(const t of generalRegistrationTemplates()){
  const p=policy.stages.find(p=>p.name===t.name)!;
  let cap=campaign2Record('WriteCapabilityV06',{VariantTag:u(1)});
  const owners:Record<string,string>={GeneralEpisodeState:'ordinary-memory',GeneralAssociationState:'association',GeneralPresentationState:'presentation'};
  if(p.writeMode==='LearningFamilies')cap=campaign2Record('WriteCapabilityV06',{VariantTag:u(2),MutationAuthority:id(1025,'authority/general-attention-'+owners[p.roots[0]]),WritableFamilies:set([id(1031,p.roots[0]==='GeneralAssociationState'?'associations':'episodic-memory')])});
  if(p.writeMode==='ExactPaths'){
   const root=t.name==='local-reserve-replenishment'?'LocalReserveState':p.roots[0],type=root==='PerceptualContinuantFileState'?241n:schema(root).typeId;
   const authority=t.name.endsWith('-track')?'authority/perception':t.name==='local-reserve-replenishment'?'authority/general-attention-local-reserve':'authority/general-attention-goal-lifecycle';
   cap=ga('GeneralPathWriteCapability',[id(1025,authority),set([statePathPatternValue({rootStateTypeId:type,fieldId:1n,selectors:[{kind:'wildcard',selectorKind:'mapKey'}]})])]);
  }
  const fields=new Map<bigint,CanonicalValue>([
   [1n,u(t.ordinal)],[2n,t.seam],[3n,text(context.admittedVersions[0])],[4n,t.event],[5n,u(t.phase)],[6n,ref(t.input.typeId)],
   [7n,list(t.outputs.map(o=>ga('GeneralOutputDeclaration',[ref(o.schema.typeId),u(o.minimum),u(o.maximum),u(o.identityMode)])))],
   [8n,set([])],[9n,cap],[11n,list([])],
  ]);
  bindings.set(t.name,enc(raw('GeneralStageRegistrationV02',fields,context)));
 }
 return bindings;
}
const registry=(bindings:ReadonlyMap<string,Uint8Array>)=>enc(set([...bindings.values()].map(b=>decode(b,context))));
function alter(bindings:Map<string,Uint8Array>,name:string,field:bigint,value:CanonicalValue){
 const r=decode(bindings.get(name)!,context) as Extract<CanonicalValue,{kind:'record'}>;
 bindings.set(name,enc(record(r.schema,new Map([...r.fields].filter(([k])=>k!==field).concat([[field,value]])))));
}
it('GR-A: resolves all67 frozen templates including inherited schemas and accepts exact bindings',()=>{
 const bindings=fixture(),compiled=compile(registry(bindings),bindings,context),templates=generalRegistrationTemplates();
 expect(compiled.stageNames).toHaveLength(67);
 expect(templates.find(t=>t.name==='prior-concern-workspace')!.input.typeId).toBe(377n);
 expect(templates.find(t=>t.name==='prior-concern-producer')!.outputs[0].schema.typeId).toBe(388n);
 for(const t of templates)expect(compiled.registrationBytes(t.name)).toEqual(bindings.get(t.name));
});
it('GR-B: rejects missing and duplicate stage identities, even when all rows decode',()=>{
 const bindings=fixture(),missing=new Map(bindings);missing.delete('world');
 expect(()=>compile(registry(missing),bindings,context)).toThrow();
 const duplicate=new Map(bindings);alter(duplicate,'current-classify',1n,u(1));
 expect(()=>compile(registry(duplicate),bindings,context)).toThrow();
 expect(()=>compile(registry(bindings),missing,context)).toThrow();
});
it('GR-C: rejects codec-valid changes to phase, event, seam, input and output grammar',()=>{
 const expected=fixture();
 for(const [field,value] of [[5n,u(10)],[4n,id(1001,'event/general-attention-current-sample')],[2n,id(1036,'seam/general-attention-current-sample')],[6n,ref(377n)],[7n,list([])]] as const){
  const changed=new Map(expected);alter(changed,'world',field,value);
  expect(()=>compile(registry(changed),expected,context)).toThrow();
  // A wrong compiler binding cannot override the frozen template either.
  expect(()=>compile(registry(changed),changed,context)).toThrow();
 }
});
it('GR-D: membership in the version vocabulary does not authorize another component version',()=>{
 const expected=fixture(),changed=new Map(expected);alter(changed,'world',3n,text(context.admittedVersions[1]));
 expect(()=>compile(registry(changed),expected,context)).toThrow(/implementation binding/);
});
it('GR-E: compares complete ReadDomain, definition references and exact write selectors',()=>{
 const expected=fixture();
 const path=statePathPatternValue({rootStateTypeId:630n,fieldId:1n,selectors:[{kind:'wildcard',selectorKind:'mapKey'}]});
 for(const [field,value] of [[8n,set([path])],[11n,list([ga('GeneralDefinitionBinding',[u(4),id(1027,'definition/foreign')])])]] as const){
  const changed=new Map(expected);alter(changed,'world',field,value);
  expect(()=>compile(registry(changed),expected,context)).toThrow(/implementation binding/);
 }
 const changed=new Map(expected);
 alter(changed,'goal-command-owner',9n,ga('GeneralPathWriteCapability',[id(1025,'authority/general-attention-goal-lifecycle'),set([statePathPatternValue({rootStateTypeId:schema('MaintenanceGoalState').typeId,fieldId:1n,selectors:[{kind:'exact',selector:{kind:'mapKey',key:id(1002,'foreign')}}]})])]));
 expect(()=>compile(registry(changed),expected,context)).toThrow(/implementation binding/);
});
it('GR-F: immutable compiled snapshot and unknown-stage rejection',()=>{
 const bindings=fixture(),compiled=compile(registry(bindings),bindings,context),before=compiled.registrationBytes('world');
 bindings.get('world')!.fill(0);bindings.clear();compiled.registrationBytes('world').fill(0);
 expect(compiled.registrationBytes('world')).toEqual(before);
 expect(()=>compiled.registrationBytes('missing')).toThrow();
 const transition=compiled.transition('world');(transition as {namespaceId:bigint}).namespaceId=0n;
 expect(compiled.transition('world').namespaceId).toBe(1009n);
});
it('GR-G: optional subject projection and output ownership are exact, not merely well-typed',()=>{
 const expected=fixture(),changed=new Map(expected);
 const roster=statePathPatternValue({rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'wildcard',selectorKind:'mapKey'}]});
 const role=ar(263,[u(1002),id(1021,'validator/character-qualification')]);
 alter(changed,'world',10n,ar(266,[u(1),roster,u(1),role,id(1028,'ResolvedCharacterSubject')]));
 expect(()=>compile(registry(changed),expected,context)).toThrow(/implementation binding/);
 const world=generalRegistrationTemplates()[0];
 for(const [minimum,maximum,mode] of [[0,2,1],[0,1,3],[1,1,1]]){
  const wrong=new Map(expected);alter(wrong,'world',7n,list([ga('GeneralOutputDeclaration',[ref(world.outputs[0].schema.typeId),u(minimum),u(maximum),u(mode)])]));
  expect(()=>compile(registry(wrong),wrong,context)).toThrow(/ownership\/cardinality/);
 }
});
