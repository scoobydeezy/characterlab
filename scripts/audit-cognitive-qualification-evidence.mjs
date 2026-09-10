import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const output='docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json';assert(!fs.existsSync(output));
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const predecessor=read('docs/planning/COGNITIVE_PREDECESSOR_PRESERVATION_REV1.json');
const reports=[...predecessor.results.map(r=>r.current),'docs/planning/COGNITIVE_RUNTIME_COHORT_REV2.json','docs/planning/COGNITIVE_SOURCE_SUBSTITUTIONS_REV2.json','docs/planning/COGNITIVE_HISTORY_BOUNDARY_REV2.json','docs/planning/COGNITIVE_COVERAGE_REFERENCE_REV1.json','docs/planning/COGNITIVE_MATH_REFERENCE_COMPARISON_REV2.json','docs/planning/COGNITIVE_MODEL_ADMISSION_REV1.json'];
const checks=[];
function scan(v,owner){if(!v||typeof v!=='object')return;if(typeof v.path==='string'&&typeof v.sha256==='string'){assert.equal(hash(v.path),v.sha256,owner+': '+v.path);checks.push({owner,path:v.path,sha256:v.sha256});}for(const x of Object.values(v))scan(x,owner);}
for(const p of reports)scan(read(p).sourceFingerprints,p);
const frozen=['docs/formal/TASK_COGNITIVE_SHAPE_MANIFEST.json','docs/formal/TASK_COGNITIVE_ALLOCATION_FREEZE_AUDIT.json','docs/planning/campaign2-task-cognitive-model/FREEZE.json'];
for(const p of frozen)scan(read(p),p);
const freeze=read(frozen[2]);for(const file of freeze.files){const p=path.posix.join(path.posix.dirname(frozen[2]),file.name);assert.equal(hash(p),file.sha256);checks.push({owner:frozen[2],path:p,sha256:file.sha256});}
for(const r of predecessor.results){if(r.sha256)assert.equal(hash(r.current),r.sha256);if(r.historicalSha256)assert.equal(hash(r.historical),r.historicalSha256);}
const sources=fs.readdirSync('src/campaign2').filter(n=>n.endsWith('.ts')).map(n=>'src/campaign2/'+n),tests=fs.readdirSync('src/test').filter(n=>/^campaign2Cognitive.*\.test\.ts$/.test(n)).map(n=>'src/test/'+n);
fs.writeFileSync(output,JSON.stringify({status:'CURRENT EVIDENCE AND FROZEN ARTIFACT FINGERPRINTS PASS',reports:reports.map(p=>({path:p,sha256:hash(p)})),checks,implementationAndTests:[...sources,...tests].map(p=>({path:p,sha256:hash(p)})),scope:'Fingerprints establish exact receipt/source consistency and preserved commitments, not behavioral qualification. Test outcomes and public/component boundaries are recorded in CAMPAIGN2_COGNITIVE_QUALIFICATION.md.'},null,2)+'\n');console.log(JSON.stringify({reports:reports.length,checks:checks.length,status:'PASS'}));
