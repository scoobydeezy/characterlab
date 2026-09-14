import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const output='docs/planning/GA_IDENTITY_ROLE_CLOSURE_REV1.json';assert(!fs.existsSync(output));
const inputs=['GA_SURVIVING_CHILD_CARRIER_REV3','GA_GOAL_RESULT_CARRIER_REV2','GA_FORMATION_PROTOCOL_CARRIER_REV2','GA_RECOLLECTION_CARRIER_REV3','GA_BODY_PIPELINE_CARRIER_REV3'].map(n=>'docs/planning/'+n+'.json');
const packets=inputs.map(p=>JSON.parse(fs.readFileSync(p))),records=packets.flatMap(p=>p.records),names=new Set(records.map(r=>r.name));assert.equal(names.size,66);
const identities={ObserverId:{namespace:1000},CharacterId:{namespace:1002,validator:'validator/character-qualification'},SemanticReferentId:{namespace:1002,validator:'validator/maintenance-goal-qualification'},DefinitionId:{namespace:1027},ObservationId:{namespace:1115},ExperienceId:{namespace:1106},SelectionOccurrenceId:{namespace:1143},TransitionKindId:{namespace:1009},MutationAuthorityId:{namespace:1025},ObservationChannelId:{namespace:1005},AcquisitionOccurrenceId:{symbolicFamily:'AcquisitionOccurrenceId'},InteroceptiveSignalId:{symbolicFamily:'InteroceptiveSignalId'},GoalOutcomeAssessmentId:{symbolicFamily:'GoalOutcomeAssessmentId'},RetainedAttributionResultId:{symbolicFamily:'RetainedAttributionResultId'},ProposedRecollectionOccurrenceId:{symbolicFamily:'ProposedRecollectionOccurrenceId'}};
const inherited={PerceptualReferentId:'existing212',PerceptualEventReferentId:'existing213',PreRecognitionSemanticExperience:'existing227',EmbodiedLevelObservation:'existing461',EmbodiedSample:'existing461/463',CanonicalRecordSchemaRef:'existing254',StatePathPattern:'existing149',RetainedEncodingUnit:'earlier positive visual wrapper; explicit closure pending'};
const primitives=new Set(['Instant','Glyph','VersionText','Boolean','False','Rational','NonnegativeRational','OriginalAddress','ViewOrdinal','FieldOrdinal','SourceBound','ViewCount']);
const positions=[],boundaries=[];
function visit(type,path,collection=false){
 if(type.kind==='ref'){
  if(Object.hasOwn(identities,type.name))positions.push({path,identity:type.name,mode:collection?'FixedCompilerCollectionElement':'CanonicalRecordField',...identities[type.name]});
  else if(names.has(type.name))boundaries.push({path,record:type.name,mode:'RecurseDeclaredRecord'});
  else if(Object.hasOwn(inherited,type.name))boundaries.push({path,record:type.name,mode:'InheritedRecordRoles',source:inherited[type.name]});
  else assert(primitives.has(type.name),'unclassified terminal '+type.name);return;
 }
 if(type.kind==='enum')return;
 if(type.kind==='optional')return visit(type.value,path,collection);
 if(type.kind==='list'||type.kind==='set')return visit(type.element,path+'[*]',true);
 if(type.kind==='map'){visit(type.key,path+'{key}',true);visit(type.value,path+'{value}',true);return;}
 if(type.kind==='union'){type.alternatives.forEach((t,i)=>visit(t,path+'<'+i+'>',collection));return;}
 assert.fail('unknown type '+type.kind);
}
for(const r of records)for(const f of r.fields)visit(f.type,r.name+'.'+f.name);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({version:'ga-identity-role-closure/0.1-draft',status:'SYMBOLIC ROLE CROSSWALK; PUBLIC COMPILER AND ALLOCATION OPEN',recordCount:records.length,positions,boundaries,stateMapKeyRoles:[],stateMapKeyDisposition:'Pending exact root key inventory; composite record keys recurse, never scalar roles.',sources:[...inputs,'docs/planning/GA_IDENTITY_ROLE_CLOSURE_REV1.md','scripts/build-ga-identity-role-closure.mjs'].map(fp)},null,2)+'\n');
