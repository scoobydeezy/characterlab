// TRACE-MODEL-BYTE-A: actual deletion + fresh-process reconstruction; no derived input reaches child.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const folder=path.resolve(root,'docs/planning/campaign2-trace-model');
const names=['content','parameters','registry','content-identity','parameter-identity','registry-identity','model-identity'];
const files=[...names.flatMap(n=>[`${n}.cenc.hex`,`${n}.json`]),'REVIEW_MANIFEST.json'];
const targets=files.map(n=>path.resolve(folder,n));
for(const p of targets)assert.equal(path.dirname(p),folder,'deletion stays in exact artifact directory');
const before=targets.map(p=>fs.readFileSync(p));
let passed=false;
try{
  for(const p of targets)fs.unlinkSync(p);
  assert(targets.every(p=>!fs.existsSync(p)),'all stored bytes/renderings/identities/review digests absent');
  execFileSync(process.execPath,[path.join(root,'scripts/materialize-campaign2-trace-model.mjs'),'--write'],{cwd:root,stdio:'pipe',windowsHide:true});
  targets.forEach((p,i)=>assert.deepEqual(fs.readFileSync(p),before[i],files[i]));
  passed=true;
  const report={control:'TRACE-MODEL-BYTE-A',status:'PASS',deletedArtifacts:files,freshProcess:true,
    childInputs:'source declarations and accepted exact versions construct identities; old packet is comparison evidence only; no replacement derived artifact',
    comparisons:files.map((name,i)=>({name,sha256:crypto.createHash('sha256').update(before[i]).digest('hex'),result:'byte-identical'}))};
  fs.writeFileSync(path.join(root,'docs/planning/CAMPAIGN2_TRACE_MODEL_BYTE_A.json'),JSON.stringify(report,null,2)+'\n');
  console.log('TRACE-MODEL-BYTE-A PASS: 15 artifacts deleted and reproduced byte-identically in a fresh process.');
}finally{
  // Failure never strands the user's review packet partially deleted.
  if(!passed)targets.forEach((p,i)=>fs.writeFileSync(p,before[i]));
}
