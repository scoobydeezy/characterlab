/** Audit measured public evidence, preservation and exact comparison witnesses. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root='docs/planning/',read=p=>JSON.parse(fs.readFileSync(p));
const digest=b=>createHash('sha256').update(b).digest('hex');
const fp=path=>({path,sha256:digest(fs.readFileSync(path))});
const destination=root+'GA_PUBLIC_QUALIFICATION_REV1.json';assert(!fs.existsSync(destination));
assert.equal(execFileSync('git',['status','--porcelain','--','reference'],{encoding:'utf8'}).trim(),'');
assert.equal(execFileSync('git',['diff','--name-only','HEAD','--','docs/formal'],{encoding:'utf8'}).trim(),'');
const resultPath=root+'general-attention-public-comparisons-rev1/RESULTS.json',results=read(resultPath);
const replayPath=root+'general-attention-public-replay-rev1/RESULTS.json',replays=read(replayPath);
const freezePath=root+'campaign3-general-attention-model-rev2/FREEZE.json',freeze=read(freezePath);
function checkFile(file){assert.equal(digest(fs.readFileSync(file.path)),file.sha256,file.path);}
results.runs.forEach(r=>checkFile(r.file));checkFile(results.freeze);
for(const m of freeze.models)Object.values(m.files).forEach(checkFile);
Object.values(freeze.shared).forEach(checkFile);
const runs=new Map(results.runs.map(r=>[r.name,read(r.file.path)]));
assert.equal(runs.size,43);assert.equal(new Set([...runs.values()].map(r=>r.modelIdentity)).size,43);
const activeStages=new Set([...runs.values()].flatMap(r=>Object.keys(r.stageCounts)));
assert.equal(activeStages.size,77);
for(const r of runs.values()){const m=freeze.models.find(m=>m.name===r.name);assert.equal(r.modelIdentity,m.modelIdentity);assert.equal(r.runIdentity,m.runIdentity);assert(r.maximumInstantWork<=92);}
for(const r of replays.runs){const original=runs.get(r.name);checkFile(r.state);assert.equal(r.modelIdentity,original.modelIdentity);assert.equal(r.runIdentity,original.runIdentity);assert.deepEqual(r.hashes,Object.fromEntries(['state','outputs','trace','save'].map(k=>[k,original.hashes[k]])));assert.equal(r.graph.digest,original.graphDigest);}
assert.equal(replays.runs.filter(r=>r.replay?.allCompleteSavesEqual).length,2);
const at=(name,time)=>runs.get(name).ranks.find(r=>r.at===String(time));
const focal=name=>runs.get(name).candidates.map(c=>c.units.find(u=>u.roles.includes('causal-role/actor'))?.strength);
const firstScores=name=>at(name,7).scores.map(s=>({acquiredAt:s.acquiredAt,base:s.base,pull:s.pull,score:s.score}));
const footprint=[];
for(const law of ['Independent','HistoricalShared','HistoricalHybrid','RetiredFlat']){
 const sparse='footprint-'+law+'-sparse',dense='footprint-'+law+'-dense',a=runs.get(sparse),b=runs.get(dense);
 assert(a.selected.counts.every(n=>n===1));assert(b.selected.counts.every(n=>n===2));assert.equal(a.selected.capacity,2);assert.equal(b.selected.capacity,2);
 const graphs=[sparse,dense].map(name=>replays.runs.find(r=>r.name===name).graph);
 footprint.push({law,sparseFocal:focal(sparse),denseFocal:focal(dense),focalEqual:JSON.stringify(focal(sparse))===JSON.stringify(focal(dense)),graphMass:graphs.map(g=>g.mass),scale:100,firstScores:[firstScores(sparse),firstScores(dense)],winnerAcquiredAt:[sparse,dense].map(name=>at(name,7).winners.map(id=>at(name,7).scores.find(s=>s.acquisition===id).acquiredAt))});
}
assert.deepEqual(footprint.map(f=>f.focalEqual),[true,false,true,true]);
assert.deepEqual(footprint.map(f=>f.graphMass[1]),[[],[[0,20],[20,0]],[[0,92],[92,0]],[[0,100],[100,0]]]);
const baseline=runs.get('baseline'),zero=runs.get('recall-k0');
for(const name of ['denied-port','unresolved-role'])assert(runs.get(name).candidates.every(c=>c.units.every(u=>!u.roles.includes('causal-role/actor'))));
for(const [name,count] of [['select-k0',0],['select-k1',1],['select-k2',2]])assert(runs.get(name).selected.counts.every(n=>n===count));
assert.deepEqual(at('baseline',7).scores,at('recall-k0',7).scores);
assert.notDeepEqual(at('baseline',8).scores,at('recall-k0',8).scores);
assert(zero.history.every(h=>h.presentations.length===1));
const scoreByTime=(name,t,acquiredAt)=>at(name,t).scores.find(s=>s.acquiredAt===String(acquiredAt));
assert.equal(scoreByTime('baseline',8,5).base,scoreByTime('recall-k0',8,5).base);
assert.equal(scoreByTime('baseline',8,6).base,'5/6');assert.equal(scoreByTime('recall-k0',8,6).base,'1/3');
assert.equal(scoreByTime('recall-k0',7,6).base,'1/2');
for(const [name,k] of [['recall-k0',0],['recall-k1',1],['baseline',2]])assert(runs.get(name).ranks.every(r=>r.winners.length<=k));
for(const rank of baseline.ranks)for(const h of baseline.history){const count=h.presentations.filter(t=>t===rank.at).length;assert.equal(count,rank.winners.includes(h.acquisition)?1:0);}
const tied=at('presentation-no-decay',7),older=tied.scores.find(s=>s.acquiredAt==='5'),newer=tied.scores.find(s=>s.acquiredAt==='6');assert.equal(older.score,newer.score);assert(tied.winners.includes(older.acquisition));assert(!tied.winners.includes(newer.acquisition));
const spatial=runs.get('allocation-spatial'),encoding=runs.get('feedback-encoding'),retrieval=runs.get('feedback-retrieval'),both=runs.get('feedback-both');
assert.deepEqual(spatial.candidates,retrieval.candidates);assert.equal(spatial.graphDigest,retrieval.graphDigest);assert.notDeepEqual(spatial.ranks,retrieval.ranks);assert.deepEqual(encoding.candidates,both.candidates);assert.equal(encoding.graphDigest,both.graphDigest);assert.notEqual(spatial.graphDigest,encoding.graphDigest);
for(const [name,source,branch] of [['source-zero-concern','1','1'],['source-no-prediction-access','2','3'],['source-capacity1','2','3'],['source-denied-probe','2','3'],['source-no-task-access','3','3']])assert(runs.get(name).modulations.every(m=>m.source===source&&m.branch===branch&&m.residual==='1/1'&&m.omega==='1/1'));
const retention=['credit-age-only','credit-use-only','credit-shared-protection','credit-significance-first'].map(name=>({name,attribution:runs.get(name).attribution,memory:runs.get(name).finalMemory}));
assert(retention.every(r=>r.attribution.length===1&&r.attribution[0].disposition==='1'&&r.attribution[0].consumed===16&&r.attribution[0].targets===1&&r.memory.significantChildren===1));
assert.deepEqual(retention.map(r=>[r.memory.usedChildren,r.memory.lateAcquisitions]),[[14,2],[16,0],[16,0],[16,0]]);
assert.equal(retention[1].memory.digest,retention[2].memory.digest);assert.equal(retention[1].memory.digest,retention[3].memory.digest);
const checks=[];
for(const p of ['GA_FULL_SOURCE_TESTS_2026_09_20.json','GA_REFERENCE_TESTS_2026_09_20.json']){const t=read(root+p);assert(t.success);assert.equal(t.numFailedTests,0);assert.equal(t.numPendingTests,0);checks.push({file:fp(root+p),tests:t.numPassedTests,files:t.testResults.length});}
const receipt={status:'BOUNDED GENERAL ATTENTION PUBLIC QUALIFICATION PASS',fixture:fp(root+'GA_CORPUS_FIXTURE_1_0_0.md'),corpusVersion:results.corpusVersion,experimentIdentity:results.experimentIdentity,experimentDigest:results.experimentDigest,publicRuns:43,comparisons:results.comparisons.length,maximumObservedInstantWork:Math.max(...[...runs.values()].map(r=>r.maximumInstantWork)),wholeModelBounds:freeze.budget,footprint,memory:{firstK0AndK2ScoresEqual:true,laterSelectedOnlyReinforcement:true,initialBaseAt6:'1/2',laterUnretrievedBaseAt6:'1/3',laterRetrievedBaseAt6:'5/6',exactTie:{older:older.acquisition,newer:newer.acquisition,score:older.score,selected:tied.winners}},feedback:{encodingChangesGraph:true,retrievalPreservesEncodingAndGraph:true,knownZeroUnavailableDisabledRemainDistinct:true,law:'Candidate A only; A/B/C unresolved per VER-C3-CONCERN-002'},retention,preservation:{priorModels:35,priorImageFiles:247,referenceUnchanged:true},tests:checks,sources:[resultPath,replayPath,freezePath,root+'GA_MODEL_IMAGE_REVIEW_REV2_2026_09_19.json'].map(fp),script:fp('scripts/audit-general-attention-qualification.mjs'),limits:['This finite fixture does not qualify general Affect, Need, surprise, arbitrary modalities or long-horizon cognition.','RetiredFlat remains a negative control; score or graph differences do not establish psychological necessity.','Two current baseline templates are replacement-only; 77 active GA/inherited event types have rollback witnesses.','Full source regression preserves existing bounded corpus fixtures, not PASS for every corpus member.'],counters:{highestAllocated:706,allocatedSinceVerdictOrCorpusMember:0}};
fs.writeFileSync(destination,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({status:receipt.status,runs:43,comparisons:receipt.comparisons,tests:checks}));
