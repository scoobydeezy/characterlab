import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const hash=path=>crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const names=['ADAPT_WRITE_BOUNDARY_PROOF_REV6','BATCH_MUTATION_PROOF_REV2','APPLICABILITY_PROOF_REV3','INDEPENDENT_GATE_PROOF_REV2','RULE_OVERLAP_PROOF_REV2','MAGNITUDE_BOUNDARY_PROOF_REV3','REFERENCE_SETTLEMENT_PROOF_REV4','REG_PERSISTENCE_MUTATION_PROOF_REV4','STATE_INVARIANT_PROOF_REV2','PRJ_SUBSTITUTION_PROOF_REV4','BRIDGE_SUBSTITUTION_PROOF_REV3','EVID_REG_CONSTRUCTION_PROOF_REV5','STAGE_BOUNDARY_PROOF_REV5','ROUTE_SEPARATION_PROOF','ADAPT_ROLLBACK_PROOF_REV3','REG_KEY_PRESERVATION_PROOF','READ_EVIDENCE_PROOF_REV2','FCT_C_PROOF_REV4'];
const reports=names.map(name=>{
 const path=`docs/planning/CAMPAIGN2_${name}.json`,r=JSON.parse(fs.readFileSync(path));
 const rows=r.sourceFingerprints??(r.sourceFingerprint?[r.sourceFingerprint]:r.sources??[]);
 assert(rows.length,`missing fingerprints: ${path}`);
 for(const row of rows)assert.equal(hash(row.path),row.sha256,`${path}: stale ${row.path}`);
 return {path,sha256:hash(path),sourceFingerprints:rows};
});
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const path=`${dir}/${e.name}`;return path==='src/test'?[]:e.isDirectory()?walk(path):[path];});}
const productionSources=walk('src').sort().map(path=>({path,sha256:hash(path)}));
const root='docs/planning/campaign2-measurement-memory-model/',m=JSON.parse(fs.readFileSync(root+'REVIEW_MANIFEST.json')),f=JSON.parse(fs.readFileSync(root+'FREEZE.json'));
const preserved=[...m.preservedSources,...f.files.map(x=>({path:root+x.name,sha256:x.sha256}))];
for(const row of preserved)assert.equal(hash(row.path),row.sha256,row.path);
const path='docs/planning/CAMPAIGN2_CURRENT_EVIDENCE_INVENTORY_REV3.json';
assert(!fs.existsSync(path),'preserve historical inventory: choose a new revision path before rerunning');
fs.writeFileSync(path,JSON.stringify({status:'SOURCE/PACKET FINGERPRINT AUDIT PASS',reports,productionSources,preservationCount:preserved.length,limitations:['This audit checks source/report currency and preservation, not semantic sufficiency.','Production hashes identify reviewed source and do not enter ModelIdentity or create a binary identity.','Qualification scope and executed test results are recorded separately.']},null,2)+'\n');
console.log(`PASS: ${reports.length} current reports, ${productionSources.length} production files, ${preserved.length} preserved fingerprints`);

