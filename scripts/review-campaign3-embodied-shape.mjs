// Integrity and proof-vector inventory for a human-readable symbolic shape review.
// This script does not decide architectural acceptance or execute EMB behavior.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const output='docs/planning/CAMPAIGN3_EMBODIED_SHAPE_REVIEW_REV1.json';
assert(!fs.existsSync(output),'preserve existing review; use a new revision');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifestPath='docs/planning/CAMPAIGN3_EMBODIED_REVIEW_MANIFEST_REV1.json';
const manifest=JSON.parse(fs.readFileSync(manifestPath));
for(const file of [...manifest.packet,...manifest.inspectedRoleSources])assert.equal(hash(file.path),file.sha256,file.path);
const vectors=[];
for(const file of manifest.packet.filter(f=>f.path.endsWith('.md'))){
  for(const line of fs.readFileSync(file.path,'utf8').split(/\r?\n/)){
    const match=line.match(/^(?:\| |\* )((?:EMB|EOBS|EING|EREG|EREP|ECOMP|EROLE)-[A-O])(?:\s|:)/);
    if(!match)continue;
    assert(!vectors.some(v=>v.id===match[1]),`duplicate vector ${match[1]}`);
    vectors.push({id:match[1],source:file.path,exactLine:line,disposition:/^EMB-[MNO]$/.test(match[1])?'DEFERRED RECEIVING DEPENDENCY':'FROZEN; NOT PASSED'});
  }
}
const counts={EMB:15,EOBS:15,EING:14,EREG:12,EREP:12,ECOMP:6,EROLE:5};
for(const [prefix,count] of Object.entries(counts))assert.equal(vectors.filter(v=>v.id.startsWith(prefix+'-')).length,count,prefix);
assert.equal(vectors.length,79);
const frozen=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json'));
for(const file of frozen.checks)assert.equal(hash(file.path),file.sha256,file.path);
const authorities=['AGENTS.md','CharacterLab — Ideal Character Architecture North Star.md','CHARACTER_ARCHITECTURE.md','CharacterLab — Ideal Character Research Program Brief.md','docs/planning/REFERENCE_MECHANISM_LEDGER.md'];
const verdict='docs/formal/EMBODIED_RESERVE_SHAPE_ACCEPTANCE.md';
const script='scripts/review-campaign3-embodied-shape.mjs';
fs.writeFileSync(output,JSON.stringify({disposition:'BOUNDED WHOLE SYMBOLIC SHAPE ACCEPTED; NOT ALLOCATED OR RUNTIME QUALIFIED',reviewer:'Primary agent self-review requested by user; no external review claimed',verdict:{path:verdict,sha256:hash(verdict)},manifest:{path:manifestPath,sha256:hash(manifestPath)},authorities:authorities.map(path=>({path,sha256:hash(path)})),records:manifest.records,fields:manifest.fields,proofVectors:vectors,implementationObligations:76,deferredReceivingObligations:3,packetHashesChecked:manifest.packet.length,inspectedSourceHashesChecked:manifest.inspectedRoleSources.length,preservedChecks:frozen.checks.length,script:{path:script,sha256:hash(script)},limitations:['File and vector integrity only; acceptance reasoning is in the verdict.','No new runtime, codec, persistence or adversarial vector executed.','No permanent number, ModelIdentity or corpus commitment allocated.']},null,2)+'\n');
console.log(JSON.stringify({packetFiles:manifest.packet.length,proofVectors:vectors.length,frozenNotPassed:76,deferred:3,preserved:frozen.checks.length}));
