// Existing substrate controls only; no EMB runtime implementation or qualification.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {startVitest} from 'vitest/node';
const output='docs/planning/CAMPAIGN3_REPLENISHMENT_STATE_SUBSTRATE_REV1.json';
assert(!fs.existsSync(output),'preserve receipt; use a new revision');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const test='src/test/state.test.ts';
const paths=[test,'src/substrate/state.ts','src/campaign2/requiredProjection.ts','scripts/review-campaign3-replenishment-state-substrate.mjs'];
const fingerprints=()=>paths.map(path=>({path,sha256:hash(path)}));
const before=fingerprints();
const ctx=await startVitest('test',[test],{config:false,run:true,watch:false,include:['src/test/**/*.test.ts'],maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}]});
assert(ctx);
try{
 assert.equal(ctx.state.getUnhandledErrors().length,0);
 const tests=[];const walk=t=>{if(t.type==='test')tests.push({name:t.name,state:t.result?.state});for(const c of t.tasks??[])walk(c);};
 for(const file of ctx.state.getFiles())walk(file);
 assert.equal(tests.length,6);assert(tests.every(t=>t.state==='pass'));
 assert.deepEqual(fingerprints(),before);
 const frozen=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json'));
 for(const f of frozen.checks)assert.equal(hash(f.path),f.sha256,f.path);
 const draft='docs/planning/CAMPAIGN3_EMBODIED_REPLENISHMENT_PROFILE_DRAFT.md';
 fs.writeFileSync(output,JSON.stringify({status:'EXISTING STATE OWNERSHIP AND PATCH CONTROLS PASS',tests,
  scope:'Existing state ownership, read, patch, stale-precondition, alias and diff controls. Does not execute proposed replenishment admission, same-instant composition or any EREP public vector.',
  preservedChecks:frozen.checks.length,sourceFingerprints:before,draft:{path:draft,sha256:hash(draft)}},null,2)+'\n');
 console.log(JSON.stringify({status:'EXISTING SUBSTRATE PASS; EREP-A..L NOT PASSED',tests:tests.length,preservedChecks:frozen.checks.length}));
}finally{await ctx.close();}
