// Packaging inventory over existing frozen data. No EMB model bytes or activation.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const output='docs/planning/CAMPAIGN3_EMBODIED_MODEL_PACKAGING_REV1.json';assert(!fs.existsSync(output));
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const allocPath='docs/formal/EMBODIED_RESERVE_ALLOCATION_TABLE.json',allocation=JSON.parse(fs.readFileSync(allocPath));assert.equal(allocation.status,'PERMANENT AND FROZEN');
const receipt=JSON.parse(fs.readFileSync('docs/formal/EMBODIED_RESERVE_ALLOCATION_FREEZE_AUDIT.json'));for(const f of receipt.frozenArtifacts)assert.deepEqual(fp(f.path),f);
const inheritedPath='docs/planning/campaign2-task-cognitive-model/registry.cenc.hex';
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
let inherited;
try{
 const {decodeCognitive,cognitiveSupportedSchemas}=await server.ssrLoadModule('/src/campaign2/cognitiveCodecs.ts');
 const bytes=Uint8Array.from(Buffer.from(fs.readFileSync(inheritedPath,'utf8').trim(),'hex'));
 const registry=decodeCognitive(bytes);assert.equal(registry.kind,'list');assert.equal(registry.items.length,6);
 const rows=registry.items[0].items,descriptors=rows.filter(r=>r.schema.typeId===172n),entries=rows.filter(r=>r.schema.typeId===171n);
 const unions=entries.filter(r=>r.fields.get(2n).payload.value==='registry/union-variant-definition');
 assert.equal(descriptors.length,297);assert.equal(cognitiveSupportedSchemas().length,298);
 const versions=descriptors.filter(r=>r.fields.get(1n).value===373n).map(r=>String(r.fields.get(2n).value)).sort();assert.deepEqual(versions,['2']);
 inherited={schemaPairs:descriptors.length,unionEntries:unions.map(r=>({namespace:Number(r.fields.get(1n).namespaceId),payload:r.fields.get(1n).payload.items.map(i=>Number(i.value))})),discardedExecutableAndOtherEntries:entries.length-unions.length};
}finally{await server.close();}
const roles=[...allocation.roles,...allocation.mapKeyRoles].map(r=>({type:r.recordTypeId,field:r.fieldId,position:r.position,namespace:r.requiredNamespace}));
roles.push({type:267,field:1,position:'RecordField',namespace:1002},{type:268,field:1,position:'StateMapKey',namespace:1000},{type:227,field:1,position:'RecordField',namespace:1106},{type:227,field:2,position:'RecordField',namespace:1000});
assert.equal(roles.length,45);assert.equal(new Set(roles.map(r=>`${r.position}/${r.type}/${r.field}`)).size,45);
const freeze=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json'));for(const f of freeze.checks)assert.deepEqual(fp(f.path),{path:f.path,sha256:f.sha256});
const report={status:'PACKAGING INVENTORY CONSISTENT; SHAPE REVIEW AND MODEL BYTES PENDING',allocation:fp(allocPath),inheritedSource:fp(inheritedPath),inherited,proposed:{schemaPairs:329,unionEntries:inherited.unionEntries.length+4,otherSemanticEntries:14,slot0Items:329+inherited.unionEntries.length+4+14,rolePositions:roles,writablePatterns:['455/1/mapKey(*)'],readOnlyPatterns:['268/1/mapKey(*)'],keyGrammarPatterns:['455/1/mapKey(*)','268/1/mapKey(*)'],occurrenceSchemas:['227/1','461/1','463/1','464/1'],routes:[],transitionRoutes:[],maxSettlementWork:8,modelCount:6,runSpecimenCount:7,inputOuterEntry:['signed DueAt','unsigned Phase','typed1001 EventTypeId','exact458/1 or478/1 Payload','empty canonical list Dependencies']},preservedChecks:freeze.checks.length,document:fp('docs/planning/CAMPAIGN3_EMBODIED_MODEL_PACKAGING_REV1.md'),script:fp('scripts/inspect-embodied-model-packaging.mjs'),limitations:['Inherited inventory decoded, not new declarations compiled.','New numeric profile is proposed receiving scope, not runtime qualification.','No new model/run digest or canonical image produced.']};
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({schemas:329,unionEntries:report.proposed.unionEntries,slot0Items:report.proposed.slot0Items,roles:45,preserved:freeze.checks.length}));
