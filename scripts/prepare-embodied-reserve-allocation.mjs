// One-to-one numeric proposal. Does not allocate permanently or activate codecs.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const base='docs/planning/EMBODIED_RESERVE_ALLOCATION_DRAFT';
for(const p of [base+'.json',base+'.md',base+'_AUDIT.json'])assert(!fs.existsSync(p),'use a new revision');
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const shapePath='docs/planning/CAMPAIGN3_EMBODIED_SHAPE_REVIEW_REV1.json';
const shape=JSON.parse(fs.readFileSync(shapePath));
for(const f of [shape.verdict,shape.manifest])assert.deepEqual(fp(f.path),f);
const manifest=JSON.parse(fs.readFileSync(shape.manifest.path));
for(const f of manifest.packet)assert.deepEqual(fp(f.path),f);
const inventory=JSON.parse(fs.readFileSync('docs/planning/CAMPAIGN3_EMBODIED_TYPED_INVENTORY_REV2.json'));
const vocabulary=JSON.parse(fs.readFileSync('docs/planning/CAMPAIGN3_EMBODIED_VOCABULARY_REV1.json'));
const tables=fs.readdirSync('docs/formal').filter(n=>n.endsWith('_TABLE.json')).map(n=>'docs/formal/'+n);
const priorRecords=new Set(),priorNamespaces=new Set(),priorMembers=new Set();
const memberKey=(ns,payload)=>JSON.stringify([ns,payload]);
for(const path of tables){const t=JSON.parse(fs.readFileSync(path));
  for(const r of [...t.records??[],...t.schemaSuccessors??[]])if(Number.isInteger(r.typeId))priorRecords.add(r.typeId);
  for(const n of [...t.namespaces??[],...t.occurrenceNamespaces??[]])priorNamespaces.add(n.namespace??n.namespaceId);
  for(const m of t.members??[])priorMembers.add(memberKey(m.namespace??m.namespaceId,m.payload));
}
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
let schemas;
try{const codec=await server.ssrLoadModule('/src/campaign2/cognitiveCodecs.ts');schemas=codec.cognitiveSupportedSchemas();}
finally{await server.close();}
for(const s of schemas)priorRecords.add(Number(s.typeId));
assert.equal(Math.max(...priorRecords),452);
assert(!priorNamespaces.has(1142));
// Include pre-Campaign2 namespace catalogues in the availability check.
const registryDocs=['docs/formal/CANONICAL_RECORD_REGISTRY.md','docs/formal/EVENT_SEMANTIC_NUMERIC_REGISTRY.md'];
for(const path of registryDocs)assert(!/^\|\s*1142\s*\|/m.test(fs.readFileSync(path,'utf8')));
const records=inventory.records.map((r,i)=>({typeId:453+i,schemaVersion:1,name:r.name,fields:r.fields.map((f,j)=>({id:j+1,...f}))}));
const byName=new Map(records.map(r=>[r.name,r]));
const fieldId=(record,field)=>byName.get(record).fields.find(f=>f.name===field).id;
assert.equal(records.length,32);assert.equal(records.reduce((n,r)=>n+r.fields.length,0),128);
for(const r of records)assert(!priorRecords.has(r.typeId));
const namespaces=[{namespace:1142,name:'PressureOccurrenceId',scope:'run-scoped occurrence',payload:'unsigned-runtime-ordinal',allocator:'existing shared run runtime allocator; no new allocator'}];
const members=vocabulary.members.map(m=>({namespace:m.existingNamespace,payload:m.payload,origin:'accepted vocabulary'}));
const witnessPath='docs/planning/CAMPAIGN3_EMBODIED_PROFILE_WITNESS_DRAFT.md';
const witness=fs.readFileSync(witnessPath,'utf8');
const defs=[...witness.matchAll(/^\| (definition\/[a-z0-9-]+) \|/gm)].map(m=>m[1]);assert.equal(defs.length,9);
for(const payload of defs)members.push({namespace:1027,payload,origin:'accepted witness definition'});
for(const [namespace,payload] of [[1000,'observer/embodied-subject'],[1005,'channel/embodied-fuel-level'],[1038,'character/embodied-subject']]){
  assert(witness.includes('`'+payload+'`'));members.push({namespace,payload,origin:'accepted witness instance'});
}
const unionVariants=inventory.unionMatrices.flatMap(u=>u.variants.map((v,i)=>({recordTypeId:byName.get(u.record).typeId,schemaVersion:1,tag:i+1,name:v.tag,requiredFields:v.required.map(f=>fieldId(u.record,f)),forbiddenFields:v.forbidden.map(f=>fieldId(u.record,f)),...(v.sampleSchema?{sampleSchema:{typeId:byName.get(v.sampleSchema).typeId,schemaVersion:1}}:{})})));
const unionDefinitions=unionVariants.map(v=>({recordTypeId:v.recordTypeId,tag:v.tag,requiredPayloadFieldIds:v.requiredFields.filter(n=>n!==1),forbiddenPayloadFieldIds:v.forbiddenFields}));
for(const u of unionVariants)members.push({namespace:1024,payload:[u.recordTypeId,u.tag],origin:'existing canonical unsigned-pair UnionVariantId grammar'});
const seen=new Set();for(const m of members){const k=memberKey(m.namespace,m.payload);assert(!seen.has(k));assert(!priorMembers.has(k),k);seen.add(k);}
assert.equal(members.length,43);
const roles=[],mapKeyRoles=[],collectionIdentityChecks=[];
for(const r of records)for(const f of r.fields)for(const m of f.type.matchAll(/id:([A-Za-z0-9]+)/g)){
  const family=m[1],requiredNamespace=family==='PressureOccurrenceId'?1142:Number.parseInt(inventory.identityRoles[family],10);assert(Number.isInteger(requiredNamespace));
  const role={recordTypeId:r.typeId,fieldId:f.id,family,requiredNamespace,domainValidatorId:family==='CharacterId'?{namespace:1021,payload:'validator/character-qualification'}:null};
  if(f.type.startsWith('map<'))mapKeyRoles.push({...role,position:'StateMapKey',precedence:'StateKeyGrammar then role then exact body coverage'});
  else if(f.type.startsWith('set<'))collectionIdentityChecks.push({...role,position:'SetMember',owner:'fixed profile compiler; namespace plus target kind/version closure'});
  else roles.push({...role,position:'RecordField'});
}
const finiteValues=[{recordTypeId:byName.get('PresentWithFrozenSupport').typeId,fieldId:fieldId('PresentWithFrozenSupport','SupportRule'),name:'ExactSingletonSameOpportunity',value:1},{recordTypeId:byName.get('UnavailableOpportunityResult').typeId,fieldId:fieldId('UnavailableOpportunityResult','ResultRule'),name:'NoPresentEvidenceNoReservation',value:1}];
const occurrenceIdentities=['EmbodiedLevelObservation','UnavailableLevelSample','EmbodiedPressureOutput'].map(name=>({recordTypeId:byName.get(name).typeId,schemaVersion:1,identityFieldId:1,requiredNamespace:name==='EmbodiedPressureOutput'?1142:1115,domainValidatorId:null}));
const aliases=Object.fromEntries(Object.entries(inventory.typeAliases).map(([name,targets])=>[name,targets.map(t=>({typeId:byName.get(t).typeId,schemaVersion:1}))]));
const report={version:'embodied-reserve-allocation/0.1-draft',status:'NUMERIC PROPOSAL; NOT PERMANENT',shape:{path:shapePath,...{sha256:fp(shapePath).sha256}},sourceFingerprints:[...tables,...registryDocs,witnessPath].map(fp),records,namespaces,members,roles,mapKeyRoles,collectionIdentityChecks,unionVariants,unionDefinitions,finiteValues,occurrenceIdentities,typeAliases:aliases,existingRecordReferences:inventory.externalSchemaReferences,state:{rootRecordTypeId:byName.get('ReserveState').typeId,fieldId:1,keyRole:'qualified CharacterId/1002',valueSchema:{typeId:byName.get('ReserveAnchor').typeId,schemaVersion:1},authority:{namespace:1025,payload:'authority/embodied-reserve'},newLogicalFamilyOrLeafMembers:[]},newFailureCodes:['EMBODIED_TARGET_PATH_VIOLATION','EMBODIED_TIME_ORDER_VIOLATION'],notes:['All new schema versions are1; fields preserve accepted order starting at1.','Union259 payload requirements exclude discriminator field1; variant schemas require it.','EmbodiedSample remains a closed schema alias, not a third tagged union or extra record.','Occurrence extraction does not independently allocate IDs or prove freshness.','Existing Current lane, phases, NoStateWrites and output multiplicity are reused without allocation.','No logical-family/leaf identity member was shape accepted; none is invented here.','Full content170, role declarations, model packaging and save bindings remain later gates.','Fuel member does not widen the old fixture-pulse singleton or define a conversion.']};
const md=['# EMB-001 numeric allocation proposal','','**embodied-reserve-allocation/0.1-draft — NOT PERMANENT.** One-to-one realization of','[accepted bounded shape](../formal/EMBODIED_RESERVE_SHAPE_ACCEPTANCE.md). Numeric','review remains separate; no source codec, current registry or frozen artifact changes.','','## Record and field assignments','','All schemas version1. Field suffix ? means conditionally present under the exact','union matrix; it is not an unconstrained optional field. Canonical types remain those','in the machine table and accepted typed inventory.','','| Type | Record | Fields |','|---|---|---|',...records.map(r=>`| ${r.typeId} | ${r.name} | ${r.fields.map(f=>`${f.id}:${f.name}${f.required?'':'?'}`).join('; ')} |`),'','## Namespace and exact members','','Propose1142 PressureOccurrenceId over the existing shared runtime ordinal allocator.','Record IDs453..484 append after452. Observation1115 and Experience1106 remain unchanged.','All text members use their existing namespace payload grammar;1024 pairs are canonical','lists of unsigned integers, not text. Instance members come from the accepted witness.','','| Namespace | Exact payload |','|---|---|',...members.map(m=>`| ${m.namespace} | ${JSON.stringify(m.payload)} |`),'','## Unions and finite fields','','| Record | Tag | Variant | Required fields | Forbidden fields |','|---|---|---|---|---|',...unionVariants.map(v=>`| ${v.recordTypeId} | ${v.tag} | ${v.name} | ${v.requiredFields.join(',')} | ${v.forbiddenFields.join(',')||'none'} |`),'','UnionVariantDefinition259 lists only payload fields, excluding discriminator1.','Present carrier requires the present sample schema; unavailable carrier requires the','unavailable sample and forbids ReservedExperienceId. No fake reservation is allocated.','','| Record/field | Value | Meaning |','|---|---|---|',...finiteValues.map(v=>`| ${v.recordTypeId}/${v.fieldId} | ${v.value} | ${v.name} |`),'','## Role and implementation boundaries','',`${roles.length} direct record roles, ${mapKeyRoles.length} state-map key role and ${collectionIdentityChecks.length} compiler-owned set-member checks are enumerated in JSON.`, 'Character roles retain existing qualification; definition namespace checks also require','exact target kind/version. State root455/field1 contains anchors454 keyed by qualified','CharacterId. No new logical family/leaf member is inferred from that physical root.','','The machine table also binds the three output occurrence extractors and five reused','external schemas. Source events and trace-only results gain no extra occurrence family.','The two proposed failure strings are not new numeric enum values. All76 runtime gates','remain NOT PASSED; EMB-M..O remain deferred.','','Separate numeric review must verify full field/member/union parity and collision','freedom before permanence. No renumbering, reuse, insertion by shifting, fixture promotion,','old unit-profile widening or model activation is authorized by this proposal.'];
const frozen=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json'));for(const f of frozen.checks)assert.deepEqual(fp(f.path),{path:f.path,sha256:f.sha256});
fs.writeFileSync(base+'.json',JSON.stringify(report,null,2)+'\n');fs.writeFileSync(base+'.md',md.join('\n')+'\n');
fs.writeFileSync(base+'_AUDIT.json',JSON.stringify({status:'PROPOSAL INTEGRITY CHECKED; SEPARATE NUMERIC REVIEW PENDING',records:32,fields:128,newNamespaces:1,members:members.length,unionVariants:4,finiteValues:2,roles:roles.length,mapKeyRoles:mapKeyRoles.length,collectionIdentityChecks:collectionIdentityChecks.length,priorTables:tables.length,existingRuntimeSchemaPairs:schemas.length,preservedChecks:frozen.checks.length,artifacts:[base+'.json',base+'.md'].map(fp),script:fp('scripts/prepare-embodied-reserve-allocation.mjs'),limitations:['No new canonical codec executed.','Markdown generated from same data; independent parity review still required.','File/collision checks do not qualify behavior.']},null,2)+'\n');
console.log(JSON.stringify({records:32,fields:128,namespace:1142,members:members.length,priorTables:tables.length,preserved:frozen.checks.length}));
