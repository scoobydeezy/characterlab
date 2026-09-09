// Exact model freeze after independent declaration and packaging reviews.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const source='docs/planning/campaign2-cognitive-declaration-review',target='docs/planning/campaign2-task-cognitive-model';assert(!fs.existsSync(target));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex'),fp=path=>({path,sha256:hash(fs.readFileSync(path))});
const packet=JSON.parse(fs.readFileSync(source+'/REVIEW_MANIFEST.json','utf8'));
const reports=['docs/planning/COGNITIVE_DECLARATION_JOIN_REVIEW_REV1.json','docs/planning/COGNITIVE_DEFINITION_CLOSURE_REVIEW_REV1.json','docs/planning/COGNITIVE_RECIPE_DIFFERENCE_REVIEW_REV1.json'];
for(const report of [packet,...reports.map(p=>JSON.parse(fs.readFileSync(p,'utf8')))])for(const f of report.sourceFingerprints)assert.deepEqual(fp(f.path),f);
const shape=JSON.parse(fs.readFileSync('docs/formal/TASK_COGNITIVE_SHAPE_MANIFEST.json','utf8'));for(const f of [shape.authority,shape.review,...shape.components,shape.inventory,shape.fieldGrammar,shape.structuralAudit])assert.deepEqual(fp(f.path),f);
assert.equal(packet.controlModels.length,21);assert.equal(new Set(packet.controlModels.map(c=>c.modelDigest)).size,21);assert.equal(packet.semanticBundle.length,78);
assert.equal(hash(Buffer.from(fs.readFileSync(source+'/model-identity.cenc.hex','utf8').trim(),'hex')),packet.baselineModelDigest);
const authority=['docs/formal/TASK_COGNITIVE_MODEL_PROFILE.md','docs/formal/TASK_COGNITIVE_SHAPE_MANIFEST.json','docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json','docs/formal/TASK_COGNITIVE_PLAN_LEAF_ADDITION.md','docs/formal/TASK_COGNITIVE_PLAN_LEAF_ALLOCATION_TABLE.json'];
const files=fs.readdirSync(source).sort();fs.mkdirSync(target);for(const name of files)fs.copyFileSync(source+'/'+name,target+'/'+name);
const freeze={status:'ACCEPTED AND FROZEN — BOUNDED TASK COGNITIVE PROFILE',acceptance:'independent internal review under explicit autonomous-work authorization',semanticVersion:'task-cognitive-path/0.1-candidate',modelDigest:packet.baselineModelDigest,profiles:packet.profiles,semanticBundle:packet.semanticBundle,models:packet.controlModels,authorityFingerprints:authority.map(fp),constructionEvidence:[...reports,source+'/REVIEW_MANIFEST.json'].map(fp),declarationSource:fp('scripts/cognitive-model-declarations.mjs'),files:files.map(name=>({name,sha256:hash(fs.readFileSync(target+'/'+name))})),runtime:'IMPLEMENTATION AUTHORIZED; ALL NEW RUNTIME VECTORS NOT PASSED',campaign2:'OPEN',preservation:'Correct-forward changes only. Historical drafts, model bytes and source fingerprints stay as reviewed; later implementation receipts do not rewrite this freeze.'};
fs.writeFileSync(target+'/FREEZE.json',JSON.stringify(freeze,null,2)+'\n');console.log(JSON.stringify({status:freeze.status,models:21,modelDigest:freeze.modelDigest}));
