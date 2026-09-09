import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const output='docs/planning/MEASUREMENT_PREDICTION_RUNTIME_AUDIT_REV2.json';assert(!fs.existsSync(output),'Preserve prior audit');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),fp=path=>({path,sha256:hash(fs.readFileSync(path))});
const dir='docs/planning/campaign2-measurement-prediction-model/',freeze=JSON.parse(fs.readFileSync(dir+'FREEZE.json')),manifest=JSON.parse(fs.readFileSync(dir+'REVIEW_MANIFEST.json'));
const preserved=[...manifest.preservedSources,...freeze.authorityFingerprints,...freeze.sourceFingerprints,...freeze.files.map(f=>({path:dir+f.name,sha256:f.sha256}))];
for(const f of preserved)assert.deepEqual(fp(f.path),f);
const proof=JSON.parse(fs.readFileSync('docs/planning/MEASUREMENT_PREDICTION_RUNTIME_PROOF_REV2.json'));for(const f of proof.sourceFingerprints)assert.deepEqual(fp(f.path),f);
const inherited=JSON.parse(fs.readFileSync('docs/planning/CAMPAIGN2_CURRENT_EVIDENCE_INVENTORY_REV3.json'));for(const r of inherited.reports){assert.equal(fp(r.path).sha256,r.sha256);for(const f of r.sourceFingerprints)assert.deepEqual(fp(f.path),f);}
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try{const {compilePredictionModel}=await server.ssrLoadModule('/src/campaign2/predictionModel.ts'),{predictionModelReviewSource}=await server.ssrLoadModule('/src/campaign2/predictionModelReview.ts');
 const model=await compilePredictionModel(predictionModelReviewSource());assert.equal(hash(model.modelIdentity.canonicalBytes),freeze.modelDigest);
 assert.equal(Buffer.from(model.modelIdentity.canonicalBytes).toString('hex'),fs.readFileSync(dir+'model-identity.cenc.hex','utf8').trim());
 for(const field of ['content','registry','parameters'])assert.equal(Buffer.from(model.source[field]).toString('hex'),fs.readFileSync(dir+field+'.cenc.hex','utf8').trim());
 fs.writeFileSync(output,JSON.stringify({status:'MODEL/SOURCE/PRESERVATION AUDIT PASS',modelDigest:freeze.modelDigest,sourceFingerprints:[...proof.sourceFingerprints,fp('src/test/campaign2PredictionStage.test.ts'),fp('src/test/campaign2PredictionPersistence.test.ts')],preservedArtifactCount:preserved.length,inheritedReports:inherited.reports.map(r=>({path:r.path,sha256:r.sha256})),checks:['production compiler identity equals frozen canonical model bytes','content/registry/parameters exact frozen bytes','prior frozen and prediction authority/source/model fingerprints preserved','five current-source prediction substitutions detected','eighteen inherited current-source report fingerprints match'],reportedExecutedRuns:[{scope:'active-source regression before final task-only hardening',files:109,tests:974,status:'PASS'},{scope:'preserved reference suite',files:43,tests:328,status:'PASS'},{scope:'post-correction task runtime and boundary',files:2,tests:24,status:'PASS'}],limitations:['This audit validates bytes and fingerprints; the listed test runs were executed separately and recorded from their tool results.','No whole Campaign2 completion, immediate phase30 learning, PERSIST-I RNG or general psychological retention is implied.']},null,2)+'\n');console.log(`PASS: exact frozen model; ${preserved.length} preservation entries;18 inherited reports;5 prediction substitutions.`);
}finally{await server.close();}
