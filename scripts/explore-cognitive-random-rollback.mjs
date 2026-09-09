// Actual substrate composition experiment. Test namespaces are not production allocation.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const output='docs/planning/COGNITIVE_RANDOM_ROLLBACK_EXPLORATION_REV1.json';assert(!fs.existsSync(output));
const paths=['src/substrate/random.ts','src/substrate/canonicalEncoding.ts','src/substrate/crypto.ts','scripts/explore-cognitive-random-rollback.mjs'];
const hash=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),before=paths.map(hash);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),{RandomRunOracle}=await server.ssrLoadModule('/src/substrate/random.ts');
 const id=(n,s)=>c.typedIdentifier(n,c.text(s)),address={causalRootId:id(10001,'research/decision'),purposeId:id(10002,'research/reason-face'),subjectBindings:[{subjectRoleId:id(10003,'actor'),subjectId:id(10004,'research/character')}],drawIndex:0n},seed=new Uint8Array(32);
 const oracle=new RandomRunOracle(seed),first=await oracle.drawBounded(address,6n);
 await assert.rejects(()=>oracle.drawBounded(address,6n),/used more than once/);
 const retry=await new RandomRunOracle(seed).drawBounded(address,6n);assert.deepEqual(retry,first);
 const committed=new Set(),key=JSON.stringify(address,(_,v)=>typeof v==='bigint'?v.toString():v);
 const begin=()=>{const local=new RandomRunOracle(seed),pending=new Set();return {async draw(a){const k=JSON.stringify(a,(_,v)=>typeof v==='bigint'?v.toString():v);assert(!committed.has(k),'committed address reused');const result=await local.drawBounded(a,6n);pending.add(k);return result;},commit(){for(const k of pending)committed.add(k);}};};
 const failed=begin();assert.deepEqual(await failed.draw(address),first);assert.equal(committed.size,0); // simulated later failure: discard this local adapter
 const successful=begin();assert.deepEqual(await successful.draw(address),first);successful.commit();assert(committed.has(key));
 await assert.rejects(()=>begin().draw(address),/committed address reused/);
 const tie={...address,purposeId:id(10002,'research/tie-break')};await begin().draw(tie);
 assert.deepEqual(paths.map(hash),before);
 fs.writeFileSync(output,JSON.stringify({status:'EXECUTED SUBSTRATE COMPOSITION EXPLORATION; NOT PERSIST-I OR COGNITIVE RUNTIME QUALIFICATION',sourceFingerprints:before,checks:{existingOracleRejectsRepeatedAddress:true,discardAndRecreateReproducesFullDrawRecord:true,failedLocalAdapterPublishesNoCommittedAddress:true,retryMatchesOriginalDraw:true,successfulCommitPublishesAddress:true,laterInstantRejectsCommittedReuse:true,distinctPurposeRemainsAdmissible:true},limitations:['The tiny local adapter is research instrumentation, not an accepted runtime implementation.','A later scheduler failure is simulated by discarding the adapter; the actual complete-instant scheduler integration remains untested.','Full-prefix restore and the successor random-relevant-authoritative-ID projection remain unresolved.','Research test namespaces are historical-style controls and cannot be promoted to production vocabulary.','Comparison uses complete returned draw records, not only mapped results.']},null,2)+'\n');
 console.log('PASS: seven substrate composition checks; no PERSIST-I promotion');
}finally{await server.close();}
