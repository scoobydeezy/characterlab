/** FormationGovernanceProfile/585 admission beneath the frozen GA carrier.
 * Declares fixed hooks; does not grant a completed-source or owner-result token. */
import {canonicalEncode as enc,set,text,unsigned as u,map,type CanonicalValue} from '../substrate/canonicalEncoding';
import {statePathPatternValue,patternsIntersect} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {generalRecord as r,generalId as id,generalDefinitionId as d,generalSchemaRef as ref,generalSubjectProjection,generalStagePaths} from './generalBindingProfile';
import {generalRegistrationTemplates} from './generalRegistration';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataKey as key,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
const singleton={rootStateTypeId:581n,fieldId:1n,selectors:[]} as const;
const ownership=()=>compileMutationAuthorityRegistry([{authorityName:'authority/formation-governance',ownedLeaves:[{pattern:singleton,valueGrammar:{kind:'canonical-record',recordTypeId:580n},removalAllowed:false}]}]);
// Learning-family stages declare their owned root in the fixed policy; their
// concrete read path supplies the exact subject for the singleton owner binding.
const memoryPattern=()=>generalStagePaths('ordinary-memory-formation').reads.find(p=>p.rootStateTypeId===630n)!;
const sources=()=>generalRegistrationTemplates().filter(t=>t.name.endsWith('-visual-selection')||t.name.endsWith('-body-selection'));
const row=(name:string,v:CanonicalValue)=>r(171,[d(name),id(1023,'registry/general-attention-definition'),text('general-attention-carrier/0.1-candidate'),v]);
export function buildGeneralProtocolEntries(){
 return [row('formation-protocol-ownership',ownership().definitionValue),row('selection-subject-projection',generalSubjectProjection()),row('formation-governance',r(585,[d('formation-governance'),u(32),r(583,[statePathPatternValue(singleton),ref(580),id(1025,'authority/formation-governance'),u(1),false]),set(sources().map(t=>r(582,[t.transition,ref(t.outputs[0].schema.typeId),u(1),ref(t.outputs[1].schema.typeId),d('selection-subject-projection'),u(t.name.endsWith('-visual-selection')?1:2)]))),r(584,[id(1009,'transition/general-attention-ordinary-memory-formation'),id(1025,'authority/general-attention-ordinary-memory'),statePathPatternValue(memoryPattern())]),u(1)]))];
}
const equal=(a:CanonicalValue,b:CanonicalValue,message:string)=>{if(key(a)!==key(b))fail('GA protocol '+message);};
/** Cross-check all source fields against admitted registrations, rather than
 * treating any namespace-1143 field as authority to enroll a source. */
export function compileGeneralProtocolDeclarations(definitions:ReadonlyMap<string,RecordValue>,registrations:ReadonlyMap<string,RecordValue>,selectionSlots:number){
 const get=(name:string,type:bigint)=>{const row=definitions.get(key(d(name)));if(!row)fail('GA protocol missing definition');return rec(f(row,4n),type);};
 const profile=get('formation-governance',585n),state=rec(f(profile,3n),583n),projection=get('selection-subject-projection',266n);
 equal(f(profile,1n),d('formation-governance'),'self identity');
 if(uint(f(profile,2n))!==32n||selectionSlots>32)fail('GA protocol selection-source bound');
 equal(f(state,1n),statePathPatternValue(singleton),'singleton path');equal(f(state,2n),ref(580),'value schema');equal(f(state,3n),id(1025,'authority/formation-governance'),'runtime authority');
 if(uint(f(state,4n))!==1n||f(state,5n)!==false||uint(f(profile,6n))!==1n)fail('GA protocol classification/removal/hooks');
 equal(projection,generalSubjectProjection(),'subject projection');
 const owned=get('formation-protocol-ownership',155n);equal(owned,ownership().definitionValue,'ownership/value grammar');
 const expected=sources(),seen=new Set<string>(),bindings=items(f(profile,4n),'set');if(bindings.length!==expected.length)fail('GA protocol source coverage');
 for(const v of bindings){
  const binding=rec(v,582n),producer=key(f(binding,1n)),template=expected.find(t=>key(t.transition)===producer);
  if(!template||seen.has(producer))fail('GA protocol duplicate/unknown producer');seen.add(producer);
  const registration=registrations.get(template.name);if(!registration)fail('GA protocol producer registration');
  const outputs=items(f(registration,7n),'list').map(v=>rec(v,703n));
  equal(f(binding,2n),f(outputs[0],1n),'audit output schema');equal(f(binding,4n),f(outputs[1],1n),'view output schema');
  if(uint(f(outputs[0],4n))!==1n||uint(f(outputs[1],4n))!==3n)fail('GA protocol output ownership');
  if(uint(f(binding,3n))!==1n)fail('GA protocol selection field');
  equal(f(binding,5n),d('selection-subject-projection'),'projection definition');equal(f(registration,10n),projection,'producer PRJ');
  if(uint(f(binding,6n))!==BigInt(template.name.endsWith('-visual-selection')?1:2))fail('GA protocol acquisition kind');
 }
 const owner=rec(f(profile,5n),584n);equal(f(owner,1n),id(1009,'transition/general-attention-ordinary-memory-formation'),'terminal owner');equal(f(owner,2n),id(1025,'authority/general-attention-ordinary-memory'),'memory authority');equal(f(owner,3n),statePathPatternValue(memoryPattern()),'memory subject path');
 for(const stage of registrations.keys())for(const p of generalStagePaths(stage).reads)if(patternsIntersect(p,singleton))fail('GA protocol cognitive read');
 return Object.freeze({sourceBindings:bindings.length,maximumQualifiedSources:32,initialValueBytes:()=>enc(r(580,[map([]),map([])])),declarationBytes:()=>enc(profile),ownershipBytes:()=>enc(owned)});
}
