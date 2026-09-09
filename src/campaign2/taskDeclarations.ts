/** Closed task-content-kind/0.1-candidate and task-domain-validator/0.1-candidate.
 * Construction component only. No model/run capability or caller-supplied predicate. */
import allocation from '../../docs/formal/TASK_COMMITMENT_CORRECTION_ALLOCATION_TABLE.json';
import {canonicalEncode as enc,list,set,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {compileGovernedContentManifest,type GovernedContentInput} from '../substrate/contentManifest';
import {validateSemanticReferent} from '../substrate/referentOrigin';
import {StateContractError} from '../substrate/state';
import {decodeTask,taskSupportedSchemas} from './taskCodecs';
import {dataRecord as rec,dataField as f,dataIdentity as id,dataItems as items,dataText as txt,dataUnsigned as u,dataKey as key,invalidModel,type RecordValue} from './canonicalData';

const identity=(ns:number,payload:string)=>typedIdentifier(ns,text(payload));
const characterKind=identity(1004,'semantic-kind/character'),taskKind=identity(1004,'semantic-kind/task-commitment');
const characterValidator=identity(1021,'validator/character-qualification'),taskValidator=identity(1021,'validator/task-qualification');
const same=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const exact=(a:CanonicalValue,b:CanonicalValue,message:string)=>{if(!same(a,b))invalidModel(message);};
const namespace=(value:CanonicalValue,ns:bigint)=>{if(id(value).namespaceId!==ns)invalidModel('task declaration identity namespace');};

export async function compileTaskDeclarations(contentBytes:Uint8Array,registryBytes:Uint8Array){
 const contentValues=items(decodeTask(contentBytes),'set'),registryValue=decodeTask(registryBytes),slots=items(registryValue,'list');
 if(slots.length!==6)invalidModel('task declarations require six registry slots');
 const allRows=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n));
 const rows=new Map<string,RecordValue>();for(const row of allRows){const k=key(f(row,1n));if(rows.has(k))invalidModel('duplicate registry StableId');rows.set(k,row);}
 const requiredVal=[
  [characterKind,'registry/semantic-kind','content-kind/0.1-candidate',329n],
  [taskKind,'registry/semantic-kind','task-content-kind/0.1-candidate',329n],
  [characterValidator,'registry/domain-validator','governed-domain-validator/0.1-candidate',330n],
  [taskValidator,'registry/domain-validator','task-domain-validator/0.1-candidate',330n],
 ] as const;
 const valRows=allRows.filter(r=>['registry/semantic-kind','registry/domain-validator'].includes(txt(id(f(r,2n)).payload)));
 if(valRows.length!==4)invalidModel('exact two-kind/two-predicate closure required');
 for(const [stable,kind,version,type] of requiredVal){const row=rows.get(key(stable));if(!row)invalidModel('missing task VAL declaration');
  exact(f(row,2n),identity(1023,kind),'VAL kind mismatch');if(txt(f(row,3n))!==version)invalidModel('VAL version mismatch');
  const def=rec(f(row,4n),type);
  if(type===329n){const ref=rec(f(def,1n),254n);if(u(f(ref,1n))!==170n||u(f(ref,2n))!==1n)invalidModel('task kind requires170/1');}
  else exact(f(def,1n),same(stable,characterValidator)?characterKind:taskKind,'predicate kind mismatch');
 }
 const contents=contentValues.map(v=>rec(v,170n)),contentKinds=new Map<string,string>();
 for(const content of contents){namespace(f(content,1n),1038n);const stable=key(f(content,1n));if(contentKinds.has(stable))invalidModel('duplicate content StableId');
  if(!same(f(content,2n),characterKind)&&!same(f(content,2n),taskKind))invalidModel('unsupported task-profile content kind');contentKinds.set(stable,key(f(content,2n)));}
 const characters=contents.filter(r=>same(f(r,2n),characterKind)),tasks=contents.filter(r=>same(f(r,2n),taskKind));
 if(characters.length!==1||tasks.length>2)invalidModel('task profile requires one character and at most two tasks');
 const specs=allRows.filter(r=>same(f(r,2n),identity(1023,'registry/task-commitment-spec'))),usedSpecs=new Set<string>();
 let selectedCriterion:string|undefined;
 if(specs.length!==tasks.length)invalidModel('task/spec cardinality mismatch');
 for(const task of tasks){
  const references=items(f(task,16n),'list');if(references.length!==1)invalidModel('task requires one spec');const ref=references[0];namespace(ref,1027n);
  const k=key(ref),row=rows.get(k);if(!row||!specs.includes(row)||usedSpecs.has(k))invalidModel('task/spec mapping is not bijective');usedSpecs.add(k);
  if(txt(f(row,3n))!=='task-commitment/0.2-candidate')invalidModel('unsupported task spec version');
  const spec=rec(f(row,4n),370n);exact(f(spec,1n),f(characters[0],1n),'task holder must be qualified character');
  namespace(f(spec,2n),1027n);const prediction=rows.get(key(f(spec,2n)));
  if(selectedCriterion!==undefined&&selectedCriterion!==key(f(spec,2n)))invalidModel('task profile requires one shared prediction criterion');selectedCriterion=key(f(spec,2n));
  if(!prediction||!same(f(prediction,2n),identity(1023,'registry/measurement-prediction')))invalidModel('task criterion is not prediction definition');
  rec(f(prediction,4n),359n);
  const lo=f(spec,3n),hi=f(spec,4n),from=f(spec,5n),deadline=f(spec,6n);
  if(typeof lo==='boolean'||lo.kind!=='rational'||typeof hi==='boolean'||hi.kind!=='rational'||lo.numerator<0n||hi.numerator>10n*hi.denominator||lo.numerator*hi.denominator>hi.numerator*lo.denominator)invalidModel('task desired interval domain');
  if(typeof from==='boolean'||from.kind!=='signed'||typeof deadline==='boolean'||deadline.kind!=='signed'||from.value<0n||deadline.value<=from.value)invalidModel('task window domain');
  for(const field of [3,7,8,10,11,13,16])exact(f(task,BigInt(field)),list([ref]),'task spec delegation mismatch');
  exact(f(task,12n),list([f(spec,1n)]),'task holder reference mismatch');
  for(const field of [4,5,6,9,14,15])exact(f(task,BigInt(field)),list([]),'task field outside receiving grammar');
 }
 const inputs:GovernedContentInput[]=contents.map(r=>({stableId:id(f(r,1n)),semanticKind:id(f(r,2n)),declaredInputs:f(r,3n),declaredOutputs:f(r,4n),preconditions:f(r,5n),worldEffects:f(r,6n),unitsDomainsBounds:f(r,7n),epistemicVisibility:f(r,8n),observationAffordances:f(r,9n),lifecycle:f(r,10n),referencedRegistryIds:items(f(r,11n),'list').map(id),referencedContentIds:items(f(r,12n),'list').map(id),validationInvariants:f(r,13n),sourceProvenance:f(r,14n),changeHistory:f(r,15n),formalSeamMappings:f(r,16n)}));
 // Fixed receiving checks above precede generic CONTENT reference/cycle commitment.
 const commitment=await compileGovernedContentManifest(inputs,allRows.map(r=>id(f(r,1n))),[{semanticKindId:characterKind,validate:()=>{}},{semanticKindId:taskKind,validate:()=>{}}]);
 const schemas=taskSupportedSchemas(),constraints=new Map<string,{position:RecordValue;role:RecordValue}>(),referenced=new Set<string>();
 function validateRoleDeclaration(value:CanonicalValue){const role=rec(value,263n),validator=role.fields.get(2n);u(f(role,1n));if(validator!==undefined){
  if(u(f(role,1n))!==1002n||(!same(validator,characterValidator)&&!same(validator,taskValidator)))invalidModel('unsupported task-profile role predicate');referenced.add(key(validator));}return role;}
 function visit(value:CanonicalValue):void {if(typeof value==='boolean')return;
  if(value.kind==='record'){
   const roleField=({265:2n,266:4n,278:2n,343:4n} as Record<number,bigint>)[Number(value.schema.typeId)];if(roleField!==undefined)validateRoleDeclaration(f(value,roleField));
   if(value.schema.typeId===265n){const position=rec(f(value,1n),264n),tag=u(f(position,1n));if(tag!==1n&&tag!==2n)invalidModel('role position tag');
    const type=u(f(position,tag===1n?2n:3n)),field=u(f(position,4n)),schema=schemas.find(s=>s.typeId===type);
    if(tag===2n&&type===373n)invalidModel('task composite keys require371 RecordField roles, not StateMapKey');
    if(!schema?.fields.some(f=>f.id===field))invalidModel('unknown task role position');
    const k=key(position);if(constraints.has(k))invalidModel('duplicate canonical role position');constraints.set(k,{position,role:rec(f(value,2n),263n)});
   }
   if(value.schema.typeId===374n){const refs=items(f(value,2n),'set');refs.forEach(v=>namespace(v,1027n));exact(set(refs),set(specs.map(s=>f(s,1n))),'task target spec coverage');}
   for(const child of value.fields.values())visit(child);
  }else if(value.kind==='list'||value.kind==='set')value.items.forEach(visit);else if(value.kind==='map')for(const [k,v] of value.entries){visit(k);visit(v);}
 }
 visit(registryValue);
 const addedConstraints=[...constraints.values()].filter(c=>u(f(c.position,1n))===1n&&u(f(c.position,2n))>=370n&&u(f(c.position,2n))<=376n);
 if(addedConstraints.length!==allocation.roles.length)invalidModel('task record-role coverage');
 for(const expected of allocation.roles){const actual=addedConstraints.find(c=>u(f(c.position,2n))===BigInt(expected.recordTypeId)&&u(f(c.position,4n))===BigInt(expected.fieldId));
  if(!actual||u(f(actual.role,1n))!==BigInt(expected.requiredNamespace))invalidModel('missing/wrong task record role');
  const validator=actual.role.fields.get(2n);if(expected.domainValidatorId===null?validator!==undefined:validator===undefined||!same(validator,identity(1021,expected.domainValidatorId)))invalidModel('task record-role predicate mismatch');
 }
 if(referenced.size!==2||!referenced.has(key(characterValidator))||!referenced.has(key(taskValidator)))invalidModel('task predicate role closure');
 function qualify(value:CanonicalValue,kind:CanonicalValue){validateSemanticReferent(value);const origin=id(id(value).payload);
  if(origin.namespaceId!==1037n||contentKinds.get(key(origin.payload))!==key(kind))throw new StateContractError('CANONICAL_ROLE_VIOLATION','referent has wrong committed content kind');}
 function checkRole(value:CanonicalValue,role:RecordValue){
  if(typeof value==='boolean'||value.kind!=='typedIdentifier'||value.namespaceId!==u(f(role,1n)))throw new StateContractError('CANONICAL_ROLE_VIOLATION','identity namespace mismatch');
  const validator=role.fields.get(2n);if(validator!==undefined)qualify(value,same(validator,characterValidator)?characterKind:taskKind);
 }
 function recordRoles(value:CanonicalValue):void {if(typeof value==='boolean')return;if(value.kind==='record'){
  for(const c of constraints.values())if(u(f(c.position,1n))===1n&&u(f(c.position,2n))===value.schema.typeId){const v=value.fields.get(u(f(c.position,4n)));if(v!==undefined)checkRole(v,c.role);}
  for(const child of value.fields.values())recordRoles(child);
 }else if(value.kind==='list'||value.kind==='set')value.items.forEach(recordRoles);else if(value.kind==='map')for(const [k,v] of value.entries){recordRoles(k);recordRoles(v);}}
 const lookup=(tag:bigint,type:bigint,field:bigint)=>{const c=[...constraints.values()].find(c=>u(f(c.position,1n))===tag&&u(f(c.position,tag===1n?2n:3n))===type&&u(f(c.position,4n))===field);return c===undefined?undefined:enc(c.role);};
 return Object.freeze({...commitment,qualifyCharacter:(value:CanonicalValue)=>qualify(value,characterKind),qualifyTask:(value:CanonicalValue)=>qualify(value,taskKind),characterContentBytes:()=>enc(set(characters)),
  validateRecordRoles:(bytes:Uint8Array)=>recordRoles(decodeTask(bytes)),recordRole:(type:bigint,field:bigint)=>lookup(1n,type,field),mapKeyRole:(root:bigint,field:bigint)=>lookup(2n,root,field),
  validateRole(valueBytes:Uint8Array,roleBytes:Uint8Array){const role=validateRoleDeclaration(decodeTask(roleBytes));checkRole(decodeTask(valueBytes),role);},
 });
}
