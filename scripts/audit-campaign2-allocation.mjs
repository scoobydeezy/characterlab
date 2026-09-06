// Specification audit only; does not construct or validate runtime records.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, base), 'utf8');
const tablePath = 'docs/formal/CAMPAIGN2_ALLOCATION_TABLE.json';
const markdownPath = 'docs/formal/CAMPAIGN2_PERMANENT_ALLOCATION.md';
const t = JSON.parse(read(tablePath));
const md = read(markdownPath).replace(/\r\n/g, '\n');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const checks = [];
function equal(name, actual, expected) {
  assert.deepEqual(actual, expected, name);
  checks.push({ name, status: 'PASS' });
}
function rows(section) {
  const body = md.split(`## ${section}\n`)[1];
  assert.ok(body, section);
  return body.split('\n## ')[0].split('\n').filter(l => l.startsWith('| '))
    .slice(1).map(l => l.split('|').slice(1, -1).map(c => c.trim()));
}
equal('version admitted', /^campaign2-allocation\/0\.2-(draft|candidate)$/.test(t.version), true);
equal('counts', [t.records.length, t.namespaces.length, t.members.length, t.unionVariants.length, t.finiteValues.length], [69,18,58,32,10]);
equal('exact record IDs', t.records.map(r => r.typeId), Array.from({length:69}, (_,i) => 260+i));
equal('all schema versions explicitly 1 in Markdown and JSON', md.includes('Every allocated schema version is 1.') || md.includes('Every proposed schema version is 1.'), true);
equal('record and field parity, including types and required flags', rows('Record and field allocations'), t.records.map(r => {
  assert.equal(r.schemaVersion, 1);
  return [String(r.typeId), r.owner, r.name, r.fields.map(f => `${f.id}: ${f.name}${f.required ? '' : '?'}: ${f.type}`).join('; ')];
}));
equal('all namespace rows exact parity', rows('Typed identity allocation'), t.namespaces.map(n => [String(n.namespace), n.name, n.owner, n.payload]));
equal('all member rows exact parity', rows('Required member payloads'), t.members.map(m => [String(m.namespace), '`'+m.payload+'`', m.owner]));
for (const m of t.members) {
  assert.equal(m.name, m.payload);
  assert.equal(m.encoding, 'NFC text');
  assert.ok(m.payload.length && m.payload.normalize('NFC') === m.payload);
}
equal('all union layouts exact parity', rows('Closed tagged-union layouts'), t.unionVariants.map(u => [String(u.typeId), String(u.tag), u.name, u.requiredFields.join(', ') || 'none', u.forbiddenFields.join(', ') || 'none']));
equal('all finite values exact parity', rows('Other finite field values'), t.finiteValues.map(v => [v.position, String(v.value), v.name]));
for (const key of ['records','unionVariants','finiteValues']) equal(`prior ${key} preserved`, hash(JSON.stringify(t[key])), t.priorAllocation[key]);
equal('prior namespace rows preserved', hash(JSON.stringify(t.namespaces.slice(0,16))), t.priorAllocation.namespaces);
equal('prior member rows preserved', hash(JSON.stringify(t.members.slice(0,53))), t.priorAllocation.members);
for (const [name, keys] of [
  ['namespace', t.namespaces.map(n=>n.namespace)],
  ['member', t.members.map(m=>`${m.namespace}:${m.payload}`)],
  ['union', t.unionVariants.map(u=>`${u.typeId}:${u.tag}`)],
  ['finite value', t.finiteValues.map(v=>`${v.position}:${v.value}`)]
]) equal(`unique ${name} keys`, new Set(keys).size, keys.length);
for (const u of t.unionVariants) {
  const r = t.records.find(r=>r.typeId===u.typeId);
  assert.equal(u.record,r.name);
  equal(`exhaustive union partition ${u.typeId}/${u.tag}`, [...u.requiredFields,...u.forbiddenFields].sort((a,b)=>a-b), r.fields.map(f=>f.id));
  assert.ok(r.fields.filter(f=>f.required).every(f=>u.requiredFields.includes(f.id)));
}
equal('shared namespaces', t.namespaces.filter(n=>[1004,1036].includes(n.namespace)), [
  {name:'SemanticKindId',namespace:1004,owner:'CONTENT/shared',payload:'text'},
  {name:'SeamId',namespace:1036,owner:'trace/transition substrate',payload:'text'}
]);
const shared = t.members.filter(m=>[1004,1036].includes(m.namespace));
equal('bidirectional accepted shared vocabulary', shared.map(m=>`${m.namespace}:${m.payload}`).sort(), t.acceptedIdentityUses.map(u=>`${u.namespace}:${u.symbol}`).sort());
equal('exact shared vocabulary', shared.map(m=>m.payload).sort(), ['semantic-kind/character','seam/event-truth-to-pre-recognition-experience','seam/character-learning-evidence','seam/automatic-adaptation','seam/truth-to-permitted-evidence'].sort());
for (const u of t.acceptedIdentityUses) equal(`source use ${u.symbol}`, read(u.source).includes(u.symbol), true);
const source = 'docs/formal/OBSERVATION_AND_EVIDENCE.md';
const observation = read(source);
const lines = observation.split(/\r?\n/);
const declaration = '**SeamId:** `seam/truth-to-permitted-evidence`';
const acceptance = '**Status:** accepted bounded-measurement seam with restricted semantic-token control, version `observation/0.1-candidate` (accepted 2026-09-01; immutable candidate-era identifier retained)';
equal('gate B exact accepted observation authority', lines[2], acceptance);
equal('gate B exact observation SeamId declaration', lines[4], declaration);
const result = {
  version:t.version, status:'PASS',
  tableSha256:hash(read(tablePath)), markdownSha256:hash(read(markdownPath)),
  counts:{records:69,namespaces:18,members:58,unionVariants:32,finiteValues:10},
  gates:{A:'PASS: exact complete Markdown/JSON parity',B:'PASS: direct accepted observation declaration'},
  observationAnchor:{source,acceptanceLine:3,acceptance,seamIdLine:5,declaration,sourceSha256:hash(observation)},
  checks,
  limitations:['Specification checks only; runtime, codec and phenomenon gates are not passed by this audit.','VAL-001 remains independent.']
};
if (process.argv.includes('--write')) {
  const auditPath = 'docs/formal/CAMPAIGN2_ALLOCATION_AUDIT.json';
  const audit = JSON.parse(read(auditPath));
  audit.version=t.version;
  audit.status=t.status === 'ACCEPTED AND FROZEN' ? 'PASS: PERMANENT ALLOCATION ACCEPTED AND FROZEN; FINAL MECHANICAL GATES A/B PASS' : 'PASS: FINAL MECHANICAL GATES A/B';
  audit.tableSha256=result.tableSha256;
  audit.finalMechanicalGate=result;
  audit.limitations=result.limitations;
  fs.writeFileSync(new URL(auditPath,base), JSON.stringify(audit,null,2)+'\n');
}
console.log(JSON.stringify({version:t.version,gates:result.gates,checks:checks.length,observationAnchor:result.observationAnchor},null,2));
