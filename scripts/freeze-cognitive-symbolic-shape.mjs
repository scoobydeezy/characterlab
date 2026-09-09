// Freeze symbolic contract sources only; no record, field, enum or namespace numbers.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const output='docs/formal/TASK_COGNITIVE_SHAPE_MANIFEST.json';assert(!fs.existsSync(output));
const names=[
 'CAMPAIGN2_TASK_WORKSPACE_DRAFT','CAMPAIGN2_TASK_APPRAISAL_AFFECT_DRAFT','CAMPAIGN2_TASK_PLAN_AND_OPTIONS_DRAFT','CAMPAIGN2_TASK_REASON_IDENTITY_DRAFT','TRC_004_EVIDENCE_COVERAGE_DRAFT',
 'CAMPAIGN2_WORKSPACE_APPRAISAL_REGISTRATION_DRAFT','CAMPAIGN2_INTENT_PROTOCOL_SOURCE_DRAFT','CAMPAIGN2_ARBITRATION_RANDOM_CLOSURE_DRAFT','CAMPAIGN2_IDENTITY_HISTORY_CLOSURE_DRAFT','CAMPAIGN2_COGNITIVE_REGISTRATION_JOIN_DRAFT',
 'CAMPAIGN2_COGNITIVE_OUTPUT_SHAPES_DRAFT','CAMPAIGN2_COGNITIVE_READ_REGISTRATIONS_DRAFT','CAMPAIGN2_IDENTITY_APPLICATION_REGISTRATION_DRAFT','CAMPAIGN2_PROTOCOL_OBSERVATION_CUT_DRAFT','CAMPAIGN2_PROTOCOL_BRIDGE_REGISTRATION_DRAFT',
 'CAMPAIGN2_COGNITIVE_STAGE_PROFILE_DRAFT','CAMPAIGN2_COGNITIVE_WORK_ACCOUNTING_DRAFT','CAMPAIGN2_INTACT_TASK_PROFILE_PROPOSAL','CAMPAIGN2_COGNITIVE_MODEL_COHORT_DRAFT','CAMPAIGN2_COGNITIVE_NUMERIC_PROFILE_DRAFT',
 'CAMPAIGN2_COGNITIVE_PERSISTENCE_PROJECTION_DRAFT','CAMPAIGN2_COGNITIVE_COUPLING_SCOPE_DRAFT','CAMPAIGN2_COGNITIVE_TRACE_BINDING_DRAFT','CAMPAIGN2_COGNITIVE_ROLE_INVENTORY_DRAFT','CAMPAIGN2_COGNITIVE_CAPABILITY_REVIEW',
 'CAMPAIGN2_COGNITIVE_STATE_AND_OCCURRENCE_CLOSURE_DRAFT','CAMPAIGN2_COGNITIVE_FIXED_MEMBER_CLOSURE_DRAFT','CAMPAIGN2_COGNITIVE_REFINEMENT_CLOSURE_DRAFT','CAMPAIGN2_COGNITIVE_FAILURE_CLOSURE_DRAFT','CAMPAIGN2_COGNITIVE_HISTORICAL_SCOPE_REVIEW','CAMPAIGN2_COGNITIVE_TRAVERSABILITY_REVIEW',
];
const fingerprint=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const inventoryPath='docs/planning/CAMPAIGN2_COGNITIVE_SYMBOLIC_INVENTORY_REV5.json',grammarPath='docs/planning/CAMPAIGN2_COGNITIVE_FIELD_GRAMMAR_REV2.json';
const inventory=JSON.parse(fs.readFileSync(inventoryPath,'utf8')),grammar=JSON.parse(fs.readFileSync(grammarPath,'utf8')),roleAudit=JSON.parse(fs.readFileSync('docs/planning/CAMPAIGN2_COGNITIVE_ROLE_OCCURRENCE_AUDIT_REV1.json','utf8'));
assert.deepEqual(roleAudit.sourceFingerprints.map(f=>fingerprint(f.path)),roleAudit.sourceFingerprints);
assert.equal(inventory.records.length,76);assert.equal(grammar.records.reduce((n,r)=>n+r.fields.length,0),244);
assert(inventory.records.every(r=>r.numericAllocation===null));assert.equal(inventory.existingSchemaSuccessors[0].successorSchemaVersion,null);
// Nested record values must form a finite DAG; ID references do not recursively embed outputs.
const recordNames=new Set(grammar.records.map(r=>r.name)),edges=new Map(grammar.records.map(r=>[r.name,r.fields.flatMap(f=>[...f.grammar.replace(/(?:enum|id)\([^()]*\)/g,'').matchAll(/\b[A-Z][A-Za-z0-9]+\b/g)].map(m=>m[0]).filter(s=>recordNames.has(s)))]));
const active=new Set(),seen=new Set();function visit(n){assert(!active.has(n),'recursive record graph '+n);if(seen.has(n))return;active.add(n);for(const child of edges.get(n))visit(child);active.delete(n);seen.add(n);}for(const n of recordNames)visit(n);
const components=names.map(n=>fingerprint('docs/planning/'+n+'.md'));
const manifest={version:'task-cognitive-path/0.1-candidate',status:'INTERNAL WHOLE SHAPE ACCEPTANCE; SYMBOLIC ALLOCATION PENDING',authority:fingerprint('docs/formal/TASK_COGNITIVE_PATH.md'),review:fingerprint('docs/planning/CAMPAIGN2_COGNITIVE_WHOLE_SHAPE_REVIEW.md'),components,inventory:fingerprint(inventoryPath),fieldGrammar:fingerprint(grammarPath),structuralAudit:fingerprint('docs/planning/CAMPAIGN2_COGNITIVE_ROLE_OCCURRENCE_AUDIT_REV1.json'),counts:{newRecords:76,newFields:244,existingRootSuccessors:1,outputOccurrenceFamilies:14,scalarRolePositions:52,collectionPositions:32,closedUnionBranches:17,modelRecipes:21},checks:{finiteNestedRecordGraph:true,sourceFingerprintsCurrent:true,noNumericAllocation:true},runtimeQualification:'NOT PASSED',campaign2:'OPEN'};
fs.writeFileSync(output,JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({components:components.length,records:76,fields:244,allocation:'PENDING',runtime:'NOT PASSED'}));
