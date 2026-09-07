// Delete only the exact generated packet files, recreate in a fresh process, then verify again.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const target=path.resolve(root,'docs/planning/campaign2-measurement-evidence-model');
assert.equal(path.dirname(target),path.resolve(root,'docs/planning'));
const artifacts=['content','parameters','registry','content-identity','parameter-identity','registry-identity','model-identity'];
const names=[...artifacts.flatMap(n=>[n+'.cenc.hex',n+'.json']),'REVIEW_MANIFEST.json'].sort();
assert.deepEqual(fs.readdirSync(target).sort(),names);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const before=names.map(name=>({name,sha256:hash(fs.readFileSync(path.join(target,name)))}));
for(const name of names){const p=path.resolve(target,name);assert.equal(path.dirname(p),target);fs.unlinkSync(p);}
for(const args of [['--write'],[]]){
 const result=spawnSync(process.execPath,['scripts/materialize-campaign2-measurement-evidence-model.mjs',...args],{cwd:root,encoding:'utf8',windowsHide:true});
 process.stdout.write(result.stdout??'');process.stderr.write(result.stderr??'');assert.equal(result.status,0);
}
for(const f of before)assert.equal(hash(fs.readFileSync(path.join(target,f.name))),f.sha256);
fs.writeFileSync(path.join(root,'docs/planning/CAMPAIGN2_MEASUREMENT_EVIDENCE_REMATERIALIZATION_PROOF.json'),JSON.stringify({status:'PASS',scope:'fresh-process delete/rematerialize/verify; no runtime qualification',deletedAndReproducedFiles:before,freshProcesses:2},null,2)+'\n');
console.log('All 15 packet files reproduced after deletion; separate fresh-process verification PASS.');
