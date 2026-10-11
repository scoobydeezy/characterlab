// Reconstruct both historical ComparisonCase byte strings without running biology.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',out=p+'campaign3-history-biology-comparisons-rev1/';
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const read=f=>JSON.parse(fs.readFileSync(f));
const refs=[];
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const ids=await server.ssrLoadModule('/src/substrate/identity.ts');
 const codec=await server.ssrLoadModule('/src/campaign3/biologyPublicCodecs.ts');
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const decode=s=>codec.decodeBiologyPublic(new Uint8Array(Buffer.from(s,'hex')));
 for(const rev of [1,2]) {
  const path=p+`BIOLOGY_PUBLIC_COMPARISON_REV${rev}.json`,r=read(path);
  const planPath=p+`BIOLOGY_PUBLIC_PLAN_REV${rev+1}.json`,plan=read(planPath);
  const harness=rev===1?p+'biology-public-development-rev2/scripts/identify-biology-public-comparison.mjs':'scripts/identify-biology-public-comparison.mjs';
  assert.equal(r.planSha256,sha(planPath));assert.equal(r.harnessSha256,sha(harness));
  assert.equal(r.experimentIdentity,plan.experimentIdentity);
  const models=await Promise.all(plan.models.map(s=>ids.restoreModelIdentity(decode(s))));
  const runs=await Promise.all(plan.runs.map(s=>ids.restoreRunIdentity(decode(s.runIdentity))));
  assert.equal(models.length,28);assert.equal(runs.length,58);
  const rebuilt=await ids.createComparisonCase(models,runs,c.text(r.coupling));
  assert.equal(Buffer.from(rebuilt.canonicalBytes).toString('hex'),r.comparisonCase);
  const changed=await ids.createComparisonCase(models,[...runs].reverse(),c.text(r.coupling));
  assert.notEqual(Buffer.from(changed.canonicalBytes).toString('hex'),r.comparisonCase);
  const changedCoupling=await ids.createComparisonCase(models,runs,c.text(r.coupling+' altered'));
  assert.notEqual(Buffer.from(changedCoupling.canonicalBytes).toString('hex'),r.comparisonCase);
  refs.push({path,sha256:sha(path),plan:{path:planPath,sha256:sha(planPath)},harness:{path:harness,sha256:sha(harness)},models:models.length,runs:runs.length,comparisonBytes:rebuilt.canonicalBytes.length,negativeControls:2});
 }
 const v={status:'BOTH HISTORICAL COMPARISON IDENTITIES RECONSTRUCTED',sources:refs,scope:'Canonical ordered identity and coupling equality only. No biology execution, original qualification timing authentication, source adoption or current-runtime parity.',dependencies:['src/substrate/identity.ts','src/substrate/canonicalEncoding.ts','src/substrate/crypto.ts','src/campaign3/biologyPublicCodecs.ts'].map(path=>({path,sha256:sha(path)})),checkerSha256:sha('scripts/check-history-biology-comparisons.mjs')};
 fs.mkdirSync(out,{recursive:true});const file=out+'canonical-check.json';
 if(fs.existsSync(file))assert.deepEqual(read(file),v);else fs.writeFileSync(file,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
 console.log(v.status+':2 records,28 models/58 runs each;4 altered-order/coupling controls. No simulation.');
}finally{await server.close();}
