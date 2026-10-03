import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const p='docs/planning/',dir=p+'longitudinal-goal-execution-rev1/',sha=b=>createHash('sha256').update(b).digest('hex'),planFile=p+'LONGITUDINAL_GOAL_PLAN_REV1.json',plan=JSON.parse(fs.readFileSync(planFile)),planSha256=sha(fs.readFileSync(planFile));
for(const a of plan.artifacts)assert.equal(sha(fs.readFileSync(a.path)),a.sha256,a.path);
assert.equal(plan.models.length,5);assert.equal(plan.runs.length,120);assert.equal(new Set(plan.runs.map(x=>x.runIdentity)).size,120);
const rows=[],receipts=[];let prefixes=0;
for(const [i,identity] of plan.runs.entries()){
 const base=dir+String(i).padStart(3,'0'),r=JSON.parse(fs.readFileSync(base+'.json'));assert.equal(r.planSha256,planSha256);for(const k of Object.keys(identity))assert.deepEqual(r[k],identity[k]);assert.equal(r.state.rows.length,16);assert.equal(r.nativeHashes.length,17);assert.equal(r.prefixHashes.length,17);
 const archive=fs.readFileSync(base+'.saves.gz');assert.equal(sha(archive),r.saveArchiveSha256);const saves=JSON.parse(gunzipSync(archive));assert.deepEqual(saves.map(x=>sha(Buffer.from(x,'base64'))),r.prefixHashes);
 for(let prefix=0;prefix<=16;prefix++){const file=base+'.prefix'+prefix+'.json';if(!fs.existsSync(file))continue;const s=JSON.parse(fs.readFileSync(file));assert.deepEqual(s,{planSha256,runIdentity:r.runIdentity,prefix,saveHash:r.prefixHashes[prefix],successorHash:r.prefixHashes[Math.min(prefix+1,16)],advanced:prefix<16});prefixes++;receipts.push({path:file,sha256:sha(fs.readFileSync(file))});}
 rows.push(r);receipts.push({path:base+'.json',sha256:sha(fs.readFileSync(base+'.json'))},{path:base+'.saves.gz',sha256:r.saveArchiveSha256});
}
const get=(law,mode,seed,keepEpisodes=false)=>rows.find(r=>r.law===law&&r.mode===mode&&r.seed===seed&&r.keepEpisodes===keepEpisodes),trajectory=r=>r.state.rows.slice(8),probabilities=r=>trajectory(r).map(x=>x.choice.probabilities),choices=r=>trajectory(r).map(x=>x.choice.chosen),different=(a,b)=>JSON.stringify(a)!==JSON.stringify(b);
const comparisons=[];
for(let seed=0;seed<8;seed++){
 for(const mode of ['Maintained','Withdrawn','Replaced']){
  const fine=get('FineStanding',mode,seed),none=get('NoFeedback',mode,seed),coarse=get('SeparateOwners',mode,seed),keep=get('FineStanding',mode,seed,true);
  assert.deepEqual(fine.nativeHashes,none.nativeHashes);assert.deepEqual(fine.nativeHashes,coarse.nativeHashes);assert.deepEqual(choices(fine),choices(keep));assert.deepEqual(probabilities(fine),probabilities(keep));assert.equal(fine.state.rows[8].episodes,0);assert(keep.state.rows[8].episodes>0);
  assert.equal(fine.state.rows[8].standing,fine.state.rows[7].standing);assert.deepEqual(fine.nativeHashes,get('FineStanding','Maintained',seed).nativeHashes);
  comparisons.push({seed,mode,standing:fine.state.rows[8].standing,fineVsNoFeedback:{probabilities:different(probabilities(fine),probabilities(none)),actions:different(choices(fine),choices(none))},coarseVsNoFeedback:{probabilities:different(probabilities(coarse),probabilities(none)),actions:different(choices(coarse),choices(none))},retentionActionsEqual:true});
 }
 const maintained=get('FineStanding','Maintained',seed),withdrawn=get('FineStanding','Withdrawn',seed),replaced=get('FineStanding','Replaced',seed),conflated=get('GoalEqualsOpportunity','Maintained',seed);
 assert.deepEqual(choices(withdrawn),choices(conflated));assert.deepEqual(probabilities(withdrawn),probabilities(conflated));assert(different(probabilities(maintained),probabilities(withdrawn)));assert(different(probabilities(maintained),probabilities(replaced)));
 assert.equal(maintained.state.rows[8].goalsBefore[0].status,'Open');assert.equal(withdrawn.state.rows[8].goalsBefore[0].status,'Withdrawn');assert.deepEqual(replaced.state.rows[8].goalsBefore.map(g=>g.status),['Withdrawn','Open']);
}
if(!process.argv.includes('--trajectories'))assert.equal(prefixes,2040,'All joined prefixes required before qualification');
const result={status:prefixes===2040?'COMPLETE MATRIX PASS':'TRAJECTORIES PASS; PREFIX GATE OPEN',planSha256,models:5,runs:120,prefixesVerified:prefixes,prefixesRequired:2040,comparisons,artifacts:[{path:planFile,sha256:planSha256},...receipts,{path:'scripts/check-longitudinal-goal-matrix.mjs',sha256:sha(fs.readFileSync('scripts/check-longitudinal-goal-matrix.mjs'))}]};
if(process.argv.includes('--write'))fs.writeFileSync(p+(prefixes===2040?'LONGITUDINAL_GOAL_MATRIX_REV1.json':'LONGITUDINAL_GOAL_TRAJECTORIES_REV1.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:result.status,runs:120,prefixes,fineProbabilityContrasts:comparisons.filter(x=>x.fineVsNoFeedback.probabilities).length,fineActionContrasts:comparisons.filter(x=>x.fineVsNoFeedback.actions).length,coarseProbabilityContrasts:comparisons.filter(x=>x.coarseVsNoFeedback.probabilities).length}));
