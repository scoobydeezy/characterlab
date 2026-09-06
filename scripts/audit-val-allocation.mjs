// Mechanical specification audit; no runtime qualification is implied.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), 'utf8');
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
const tablePath = 'docs/formal/VAL_ALLOCATION_TABLE.json';
const markdownPath = 'docs/formal/VAL_PERMANENT_ALLOCATION.md';
const t = JSON.parse(read(tablePath));
const md = read(markdownPath).replace(/\r\n/g, '\n');
const authority = read(t.authority);
const base = JSON.parse(read(t.baseAllocation.path));
const checks = [];
function eq(name, actual, expected) {
  assert.deepEqual(actual, expected, name);
  checks.push({name, status:'PASS'});
}
function rows(section) {
  const body = md.split(`## ${section}\n`)[1];
  assert.ok(body, section);
  return body.split('\n## ')[0].split('\n').filter(l=>l.startsWith('| ')).slice(1)
    .map(l=>l.split('|').slice(1,-1).map(c=>c.trim()));
}
eq('accepted VAL shape authority', authority.includes('**Status: SHAPE ACCEPTED 2026-09-06;'), true);
eq('frozen base version', base.version, t.baseAllocation.version);
eq('frozen base accepted status', base.status, 'ACCEPTED AND FROZEN');
eq('complete frozen base bytes unchanged', hash(read(t.baseAllocation.path)), t.baseAllocation.sha256);
eq('exact additive record IDs', t.records.map(r=>r.typeId), [329,330]);
eq('append immediately after base record maximum', Math.max(...base.records.map(r=>r.typeId))+1, 329);
eq('exact record names', t.records.map(r=>r.name), ['GovernedContentKindDefinition','SemanticKindRoleValidatorDefinition']);
eq('record/field Markdown-JSON parity', rows('Records'), t.records.flatMap(r=>r.fields.map(f=>[String(r.typeId),r.name,String(r.schemaVersion),String(f.id),f.name,f.type,String(f.required)])));
eq('exact schema/field shapes', t.records.map(r=>[r.schemaVersion,r.fields]), [
  [1,[{id:1,name:'ContentSchema',type:'CanonicalRecordSchemaRef',required:true}]],
  [1,[{id:1,name:'RequiredSemanticKind',type:'SemanticKindId',required:true}]]
]);
eq('exact members', t.members, [{namespace:1023,payload:'registry/semantic-kind'},{namespace:1023,payload:'registry/domain-validator'}]);
eq('member Markdown-JSON parity', rows('Registry-kind members'), t.members.map(m=>[String(m.namespace),m.payload]));
eq('entry binding Markdown-JSON parity', rows('Governed entry bindings'), t.bindings.map(b=>[String(b.stableIdNamespace),b.stableIdPayload,b.registryKind,b.definitionVersion,`${b.definitionTypeId}/${b.definitionSchemaVersion}`]));
eq('binding IDs/versions', t.bindings.map(b=>[b.stableIdNamespace,b.stableIdPayload,b.definitionVersion]), [
  [1004,'semantic-kind/character','content-kind/0.1-candidate'],
  [1021,'validator/character-qualification','governed-domain-validator/0.1-candidate']
]);
for (const key of ['namespaces','unionVariants','finiteValues','unresolved']) eq(`no added ${key}`, t[key], []);
const registrySources = ['docs/formal/CANONICAL_RECORD_REGISTRY.md','docs/formal/EVENT_SEMANTIC_NUMERIC_REGISTRY.md','docs/formal/STATE_MODEL.md'];
const priorRegistryEvidence = registrySources.map(path=>({path,sha256:hash(read(path))}));
const occupied = registrySources.flatMap(p=>[...read(p).matchAll(/^\|\s*(\d+)\s*\|/gm)].map(m=>Number(m[1])));
for (const r of t.records) {
  eq(`record ${r.typeId} absent prior registry tables`, occupied.includes(r.typeId), false);
  eq(`record ${r.name} accepted symbolic use`, authority.includes(r.name+' {'), true);
}
eq('RegistryKindId/1023 inherited home', /\| 1023 \| `RegistryKindId`/.test(read('docs/formal/EVENT_SEMANTIC_NUMERIC_REGISTRY.md')), true);
for (const m of t.members) {
  eq(`member ${m.payload} canonical NFC`, m.payload.normalize('NFC'), m.payload);
  eq(`member ${m.payload} new relative to Campaign-2`, base.members.some(b=>b.namespace===m.namespace && b.payload===m.payload), false);
  eq(`member ${m.payload} absent prior permanent registry sources`, registrySources.some(p=>read(p).includes(m.payload)), false);
  eq(`member ${m.payload} accepted symbolic use`, authority.includes(m.payload), true);
  eq(`member ${m.payload} bound exactly once`, t.bindings.filter(b=>b.registryKind===m.payload).length, 1);
}
for (const b of t.bindings) {
  eq(`existing StableId ${b.stableIdPayload}`, base.members.some(m=>m.namespace===b.stableIdNamespace && m.payload===b.stableIdPayload), true);
  eq(`definition ${b.definitionTypeId} uniquely bound`, t.records.filter(r=>r.typeId===b.definitionTypeId && r.schemaVersion===b.definitionSchemaVersion).length, 1);
}
eq('exact table keys; no hidden allocation category', Object.keys(t).sort(), ['version','status','date','authority','baseAllocation','records','namespaces','members','bindings','unionVariants','finiteValues','unresolved'].sort());
eq('Markdown version parity', md.includes('`'+t.version+'`'), true);
eq('definition ownership clarification', md.includes('no additive CanonicalRoleConstraint'), true);
const permanent=t.status==='PERMANENT AND FROZEN';
eq('Markdown status parity', md.includes('**Status: '+t.status+'.**'), true);
const report = {version:t.version,status:permanent?'PASS: PERMANENT AND FROZEN; FINAL MACHINE GATE PASSED':'PASS: MECHANICAL AUDIT; NUMERIC ACCEPTANCE PENDING',tableSha256:hash(read(tablePath)),markdownSha256:hash(read(markdownPath)),baseAllocation:t.baseAllocation,priorRegistryEvidence,allocationSnapshot:t,authority:{path:t.authority,sha256:hash(authority)},counts:{records:2,fields:2,members:2,bindings:2,newNamespaces:0},checks,limitations:[...(permanent?[]:['Numeric proposal is not yet accepted permanent allocation.']),'VAL-A..W and implementation/build-release qualification are not passed by this audit.','Canonical activation remains unauthorized.']};
if (process.argv.includes('--write')) fs.writeFileSync(new URL('docs/formal/VAL_ALLOCATION_AUDIT.json',root),JSON.stringify(report,null,2)+'\n');
if(process.argv.includes('--verify') || process.argv.includes('--write')) {
  assert.deepEqual(JSON.parse(read('docs/formal/VAL_ALLOCATION_AUDIT.json')),report,'stored audit exactly matches recomputed result and machine table');
  console.log('Stored audit exactly matches recomputed result and complete allocation snapshot.');
}
console.log(JSON.stringify({status:report.status,counts:report.counts,checks:checks.length},null,2));
