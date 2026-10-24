/** Internal exact state/owner closure for admitted GA registrations. This composes
 * state/0.2-candidate and general-attention-registration-write-scope/0.1-candidate;
 * inherited probe state and model activation are separate compiler obligations. */
import {canonicalEncode as enc,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,patternMatches,statePathPatternValue,restoreAuthoritativeState,type StatePath,type StatePathPattern,type StatePatch} from '../substrate/state';
import {compileMutationAuthorityRegistry,type MutationAuthorityDefinition} from '../substrate/mutationAuthority';
import {dataRecord as rec,dataField as f,dataIdentity as identity,dataText as txt,dataUnsigned as uint,dataKey as key,invalidModel as fail} from '../campaign2/canonicalData';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {generalRegistrationTemplates} from './generalRegistration';
import {generalStagePaths,generalId as id,generalBindingContext,generalSubject} from './generalBindingProfile';

export function compileGeneralState(registration:(name:string)=>Uint8Array,validateLeaf:(path:StatePath,value:CanonicalValue)=>void){
 const context=generalBindingContext(),bindings=new Map<string,{authority:TypedIdentifierValue;paths:readonly StatePathPattern[]}>();
 const owners=new Map<string,{authority:TypedIdentifierValue;paths:Map<string,StatePathPattern>}>();
 const add=(authority:TypedIdentifierValue,paths:readonly StatePathPattern[])=>{
  const k=key(authority),owner=owners.get(k)??{authority,paths:new Map()};for(const path of paths)owner.paths.set(key(statePathPatternValue(path)),path);owners.set(k,owner);
 };
 for(const template of generalRegistrationTemplates()){
  const row=rec(decode(registration(template.name),context),706n),write=f(row,9n),paths=generalStagePaths(template.name).writes;
  if(!paths.length)continue;
  const record=rec(write,(write as Extract<CanonicalValue,{kind:'record'}>).schema.typeId);
  const authority=identity(f(record,record.schema.typeId===705n?1n:2n));bindings.set(template.name,{authority,paths});add(authority,paths);
 }
 // Existing task/prediction owners remain distinct from every GA consumer.
 const workspace=generalStagePaths('prior-concern-workspace').reads;
 add(id(1025,'authority/belief-expectation'),workspace.filter(p=>p.rootStateTypeId===362n));
 add(id(1025,'authority/prospective-commitments'),workspace.filter(p=>p.rootStateTypeId===373n));
 const protocol:StatePathPattern={rootStateTypeId:581n,fieldId:1n,selectors:[]};add(id(1025,'authority/formation-governance'),[protocol]);
 const types:Readonly<Record<string,bigint>>={'362':361n,'373':372n,'581':580n,'630':555n,'631':625n,'632':595n,'633':560n,'634':627n,'635':629n,'649':454n};
 const definitions:MutationAuthorityDefinition[]=[...owners.values()].map(owner=>({authorityName:txt(owner.authority.payload),ownedLeaves:[...owner.paths.values()].map(pattern=>({pattern,valueGrammar:[241n,242n].includes(pattern.rootStateTypeId)?{kind:pattern.fieldId===1n?'unsigned-counter' as const:'membership-marker' as const}:{kind:'canonical-record' as const,recordTypeId:types[String(pattern.rootStateTypeId)]??fail('GA owner leaf grammar')},removalAllowed:[241n,242n].includes(pattern.rootStateTypeId)&&pattern.fieldId===2n}))}));
 const compiled=compileMutationAuthorityRegistry(definitions);
 const validate=(path:StatePath,value:CanonicalValue)=>{
  if(path.rootStateTypeId===581n){if(!patternMatches(protocol,path))fail('GA protocol path');rec(decode(enc(value),context),580n);}
  else validateLeaf(path,value);
 };
 const authority=new StateAuthorityRegistry(compiled.writableLeaves.map(leaf=>({...leaf,validateValue:(value:CanonicalValue)=>leaf.validateValue(value)})),compiled.authorities);
 function validateState(state:AuthoritativeState){
  const entries=state.entries();for(const entry of entries)validate(entry.path,entry.value);
  const who=generalSubject();
  for(const root of [241n,242n]){
   const counter=state.read({rootStateTypeId:root,fieldId:1n,selectors:[{kind:'mapKey',key:who.observer}]});
   const next=counter.presence?uint(counter.value!):0n;if(next>(root===241n?30n:26n))fail('GA SEM state counter bound');
   for(const entry of entries.filter(e=>e.path.rootStateTypeId===root&&e.path.fieldId===2n)){
    const selector=entry.path.selectors[0];if(selector.kind!=='mapKey'||uint(f(rec(selector.key,root===241n?212n:213n),2n))>=next)fail('GA SEM membership outside counter prefix');
   }
  }
 }
 function apply(state:AuthoritativeState,patch:StatePatch,owner:TypedIdentifierValue,paths:readonly StatePathPattern[]){
  validateState(state);
  for(const operation of patch.operations){
   if(!paths.some(p=>patternMatches(p,operation.path)))fail('GA stage write outside exact registration');
   if(operation.kind==='set'){
    validate(operation.path,operation.newValue);
    if([241n,242n].includes(operation.path.rootStateTypeId)&&operation.path.fieldId===1n){const old=state.read(operation.path);if(old.presence&&uint(operation.newValue)<uint(old.value!))fail('GA SEM counter regression');}
   }
  }
  const result=applyStatePatch(state,patch,owner,authority);validateState(result.state);return result;
 }
 return Object.freeze({
  ownershipBytes:()=>enc(compiled.definitionValue),validateState,
  restoreState(bytes:Uint8Array){const state=restoreAuthoritativeState(decode(bytes,context));validateState(state);return state;},
  applyStagePatch(stage:string,state:AuthoritativeState,patch:StatePatch){
   const binding=bindings.get(stage);if(!binding){if(!generalRegistrationTemplates().some(t=>t.name===stage))fail('GA unknown state consumer');if(patch.operations.length)fail('GA read-only stage mutation');validateState(state);return {state,diffs:[]};}
   return apply(state,patch,binding.authority,binding.paths);
  },
  /** Runtime-only hook; it cannot write ordinary memory or SEM families. */
  applyProtocolPatch(state:AuthoritativeState,patch:StatePatch){return apply(state,patch,id(1025,'authority/formation-governance'),[protocol]);},
  /** Inherited producer hook; the runtime supplies only an actual M1 application. */
  applyPredictionPatch(state:AuthoritativeState,patch:StatePatch){return apply(state,patch,id(1025,'authority/belief-expectation'),workspace.filter(p=>p.rootStateTypeId===362n));},
  applyTaskPatch(state:AuthoritativeState,patch:StatePatch){return apply(state,patch,id(1025,'authority/prospective-commitments'),workspace.filter(p=>p.rootStateTypeId===373n));},
 });
}
