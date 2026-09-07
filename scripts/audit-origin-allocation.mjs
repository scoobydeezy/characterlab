// Mechanical allocation review only; neither numeric acceptance nor runtime qualification.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), 'utf8');
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
const tablePath = 'docs/formal/ORIGIN_ALLOCATION_TABLE.json';
const mdPath = 'docs/formal/ORIGIN_PERMANENT_ALLOCATION.md';
const reportPath = 'docs/formal/ORIGIN_ALLOCATION_AUDIT.json';
const t = JSON.parse(read(tablePath));
const md = read(mdPath).replace(/\r\n/g, '\n');
const authority = read(t.authority);
const checks = [];
function eq(name, actual, expected) {
  assert.deepEqual(actual, expected, name);
  checks.push({name, status:'PASS'});
}
eq('symbolic shape accepted', authority.includes('**Status: SYMBOLIC SHAPE ACCEPTED.**'), true);
eq('exact contract version', authority.includes('`referent-origin/0.1-candidate`'), true);
eq('conditionally accepted permanent status', t.status, 'PERMANENT AND FROZEN');
eq('Markdown status parity', md.includes('**Status: '+t.status+'.**'), true);
eq('exact allocation version', t.version, 'origin-allocation/0.1-candidate');
eq('Markdown version parity', md.includes('`'+t.version+'`'), true);
eq('outer namespace unchanged', t.outerNamespace, 1002);
eq('exact additive namespaces and payloads', t.namespaces, [
  {namespace:1037,name:'AuthoredContentOriginId',scope:'model/content',payload:'canonical TypedIdentifierValue equal to content StableId'},
  {namespace:1122,name:'RuntimeEntityOriginId',scope:'run',payload:'unsigned runtime ordinal from shared allocator'}
]);
eq('no duplicate namespace', new Set(t.namespaces.map(n=>n.namespace)).size, 2);
const symbolicTable=authority.replace(/\r\n/g,'\n').split('| Symbolic family | Payload grammar |\n')[1];
assert.ok(symbolicTable,'accepted symbolic family inventory exists');
const symbolicRows=symbolicTable.split('\n\n')[0].split('\n').slice(1)
  .filter(l=>l.startsWith('| ')).map(l=>l.split('|').slice(1,-1).map(c=>c.trim()));
eq('accepted symbolic/numeric family and grammar bijection',symbolicRows,t.namespaces.map(n=>[n.name,n.payload]));
const rows=md.split('## Namespaces\n')[1].split('\n## ')[0].split('\n')
  .filter(l=>l.startsWith('| ')).slice(1).map(l=>l.split('|').slice(1,-1).map(c=>c.trim()));
eq('complete namespace Markdown/JSON parity', rows, t.namespaces.map(n=>[String(n.namespace),n.name,n.scope,n.payload]));
const empty=['records','members','bindings','unionVariants','finiteValues','occurrenceDefinitions','stateRoots','saveFields'];
for(const key of empty) eq(`no added ${key}`,t[key],[]);
eq('exact table keys',Object.keys(t).sort(),['version','status','date','authority','preservedSources','outerNamespace','namespaces',...empty].sort());
eq('complete preservation source inventory',t.preservedSources.map(s=>s.path),[
  'docs/formal/CAMPAIGN2_ALLOCATION_TABLE.json','docs/formal/VAL_ALLOCATION_TABLE.json',
  'docs/formal/CANONICAL_RECORD_REGISTRY.md','docs/formal/EVENT_SEMANTIC_NUMERIC_REGISTRY.md','docs/formal/STATE_MODEL.md'
]);
const priorNamespaces=[];
for(const source of t.preservedSources) {
  const data=read(source.path);
  eq(`preserved complete bytes: ${source.path}`,hash(data),source.sha256);
  if(source.path.endsWith('.json')) {
    const prior=JSON.parse(data);
    eq(`frozen prior status: ${source.path}`,['ACCEPTED AND FROZEN','PERMANENT AND FROZEN'].includes(prior.status),true);
    priorNamespaces.push(...prior.namespaces.map(n=>n.namespace));
  } else {
    // Conservatively include every numeric-leading table row, even record IDs, plus prose.
    priorNamespaces.push(...[...data.matchAll(/^\|\s*`?(\d+)`?\s*\|/gm)].map(m=>Number(m[1])));
    for(const n of t.namespaces) eq(`no earlier candidate mention: ${n.namespace} in ${source.path}`,new RegExp(`\\b${n.namespace}\\b`).test(data),false);
  }
}
for(const n of t.namespaces) {
  eq(`namespace ${n.namespace} has no prior collision`,priorNamespaces.includes(n.namespace),false);
  eq(`namespace ${n.namespace} is not fixture 20/21`,[20,21].includes(n.namespace),false);
  eq(`symbolic family ${n.name} in accepted contract`,authority.includes(n.name),true);
}
eq('fixture 20/21 absent from permanent source tables',priorNamespaces.some(n=>n===20||n===21),false);
const base=JSON.parse(read(t.preservedSources[0].path));
eq('authored appends frozen shared/model allocation range',Math.max(...base.namespaces.map(n=>n.namespace).filter(n=>n>=1000&&n<1100))+1,1037);
eq('runtime appends frozen run-scoped identity range',Math.max(...base.namespaces.map(n=>n.namespace).filter(n=>n>=1100))+1,1122);
const report={version:t.version,status:'PASS: PERMANENT AND FROZEN; FINAL MACHINE GATE PASSED',
  tableSha256:hash(read(tablePath)),markdownSha256:hash(read(mdPath)),
  authority:{path:t.authority,sha256:hash(authority)},allocationSnapshot:t,
  counts:{namespaces:2,records:0,members:0,occurrenceDefinitions:0},checks,
  limitations:['ORIGIN-A..I and affected SEM regressions are not passed by this audit.','Factory activation and integrated qualification remain pending.']};
if(process.argv.includes('--write')) fs.writeFileSync(new URL(reportPath,root),JSON.stringify(report,null,2)+'\n');
if(process.argv.includes('--write')||process.argv.includes('--verify')) {
  assert.deepEqual(JSON.parse(read(reportPath)),report,'stored audit equals recomputed full proposal audit');
}
console.log(JSON.stringify({status:report.status,counts:report.counts,checks:checks.length},null,2));
