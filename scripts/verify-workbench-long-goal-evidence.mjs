import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='docs/planning/workbench-long-goal-parity-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const r=read(root+'/receipt.json'),planPath='docs/planning/LONGITUDINAL_GOAL_PLAN_REV1.json',plan=read(planPath),planHash=sha(fs.readFileSync(planPath));
assert.equal(r.cases.length,120);assert.equal(plan.runs.length,120);assert.equal(r.artifacts.length,2040);
for(const s of r.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(root+'/sources/'+s.path)),s.sha256,s.path);}
const artifacts=new Map(r.artifacts.map(a=>[a.path,a.sha256]));assert.equal(artifacts.size,2040);
let advancing=0,terminal=0;
for(const [index,c]of r.cases.entries()){
 assert.equal(c.index,index);assert.equal(c.prefixes,17);assert.equal(c.planHash,planHash);
 assert.equal(c.runHash,sha(Buffer.from(plan.runs[index].runIdentity,'hex')));
 const bytes=fs.readFileSync(c.historicalPath),old=JSON.parse(bytes);
 assert.equal(sha(bytes),c.historicalSha256);assert.equal(sha(fs.readFileSync(c.archivePath)),c.archiveSha256);
 assert.equal(old.saveArchiveSha256,c.archiveSha256);assert.equal(old.planSha256,planHash);
 assert.equal(old.runIdentity,plan.runs[index].runIdentity);assert.equal(old.modelIdentity,plan.runs[index].modelIdentity);
 assert.equal(old.prefixHashes.length,17);assert.equal(old.nativeHashes.length,17);
 const {prefixes,...binding}=c;
 for(let prefix=0;prefix<17;prefix++){
  const file=`case-${String(index).padStart(3,'0')}-prefix-${String(prefix).padStart(2,'0')}.json`,bytes=fs.readFileSync(root+'/'+file);
  assert.equal(sha(bytes),artifacts.get(file));assert.deepEqual(JSON.parse(bytes),{...binding,prefix,saveHash:old.prefixHashes[prefix],nativeSaveHash:old.nativeHashes[prefix],successorHash:old.prefixHashes[Math.min(prefix+1,16)],advanced:prefix<16});
  if(prefix<16)advancing++;else terminal++;
 }
}
assert.deepEqual(r.counts,{cases:120,prefixes:2040,advancing,terminal});
fs.writeFileSync(root+'/verification.json',JSON.stringify({status:'PASS INDEPENDENT LONG GOAL EVIDENCE JOIN',counts:r.counts,artifacts:[root+'/receipt.json','scripts/verify-workbench-long-goal-evidence.mjs'].map(path=>({path,sha256:sha(fs.readFileSync(path))})),scope:'Verifies all2040 saved checkpoint/continuation records against120 original case identities and exact archive bindings; current/frozen sources match. The completed runtime audit separately proves restoration, detached snapshots and terminal state equality. This join does not repeat runtime execution or establish browser, narration, successor universality or Campaign4 entry.'},null,2)+'\n',{flag:'wx'});
console.log('PASS LONG goal 120 cases / 2040 checkpoints / 1920 continuations / 120 terminal checks');
