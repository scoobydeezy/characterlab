import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-persistence-batch-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const manifest=read(root+'/manifest.json'),receipt=read(root+'/receipt.json');assert.equal(receipt.status,'PASS PREPARED PERSISTENCE BATCH TRANSPORT');assert.deepEqual(receipt.sources,manifest.sources);
for(const s of manifest.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);}
const catalog=read(root+'/sources/src/workbench/batchCatalogV11.json');assert.deepEqual(receipt.results.map(r=>r.job),catalog.jobs.slice(1068));
let prefixes=0;
for(const result of receipt.results){
 const id=result.job.experimentId,original=catalog[id],p=original.programs.find(p=>p.name===result.job.name),m=original.models.find(m=>m.name===p.model);
 assert.equal(p.runSeed,'00'.repeat(32));assert.equal(result.job.seed,0);assert.equal(result.job.law,p.model);
 const prior=read(root+`/sources/docs/planning/${id==='adapt'?'workbench-adapt-parent-parity-rev1':'workbench-det-parity-rev1'}/receipt.json`).results.find(r=>r.program===p.name),expected=prior.prefixes??prior.checks;
 assert.equal(result.prefixes.length,expected.length);
 for(const [i,v]of result.prefixes.entries()){
  for(const k of ['prefix','clock','stateHash','saveHash'])assert.equal(v[k],expected[i][k]);
  assert.equal(v.prefix,i);assert.equal(v.total,expected.length-1);assert.equal(v.complete,i===expected.length-1);
  assert.equal(v.modelHash,sha(Buffer.from(m.modelIdentity,'hex')));assert.equal(v.runHash,result.prefixes[0].runHash);
  assert.equal(v.saveHash,result.job.expectedSaveHashes[i]);prefixes++;
 }
}
assert.equal(receipt.results.length,4);assert.equal(prefixes,26);
const verifier=fs.readFileSync('scripts/verify-workbench-persistence-batch.mjs');fs.writeFileSync(root+'/verifier.mjs',verifier,{flag:'wx'});
fs.writeFileSync(root+'/acceptance.json',JSON.stringify({status:'PASS INDEPENDENT PERSISTENCE TRANSPORT RECONCILIATION',roles:4,prefixes,sourcesVerified:manifest.sources.length,sourceHoldReleased:true,
 receiptSha256:sha(fs.readFileSync(root+'/receipt.json')),verifierSha256:sha(verifier),
 scope:'Exact declarations,seeds,model hashes and all26 prior clock/state/save commitments reconciled. Separate native run/output/trace/terminal checks remain evidenced by the frozen writer. Shared worker/UI and remaining corpus controls stay open.'},null,2)+'\n',{flag:'wx'});
console.log(`PASS4/26; released ${manifest.sources.length} current-source holds`);
