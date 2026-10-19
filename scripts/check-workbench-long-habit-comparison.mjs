import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-long-habit-comparison-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),planPath='docs/planning/LONGITUDINAL_HABIT_PLAN_REV2.json',plan=read(planPath),matrix=read('docs/planning/LONGITUDINAL_HABIT_MATRIX_REV2.json');
assert(!fs.existsSync(root));assert.equal(matrix.planSha256,sha(fs.readFileSync(planPath)));fs.mkdirSync(root,{recursive:true});
const predecessor='docs/planning/workbench-long-habit-reuse-rev1/sources',paths=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else paths.push(p.slice(predecessor.length+1));}}walk(predecessor);
for(const p of paths)assert.equal(sha(fs.readFileSync(p)),sha(fs.readFileSync(predecessor+'/'+p)),p);
paths.push('src/workbench/longHabitComparison.ts','src/test/workbenchLongHabitComparison.test.ts','scripts/check-workbench-long-habit-comparison.mjs');
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));for(const s of sources){const out=root+'/sources/'+s.path;fs.mkdirSync(out.slice(0,out.lastIndexOf('/')),{recursive:true});fs.writeFileSync(out,fs.readFileSync(s.path),{flag:'wx'});}
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'}),results=[],inputs=[];let aligned=0;
try{
 const {LongHabitWorkbenchRun}=await server.ssrLoadModule('/src/workbench/longHabitAdapter.ts'),{LONG_HABIT_COMPARISONS,compareLongHabitSnapshots}=await server.ssrLoadModule('/src/workbench/longHabitComparison.ts');
 assert.equal(LONG_HABIT_COMPARISONS.length,2848);
 for(let seed=0;seed<8;seed++){
  const snapshots=new Map();
  for(const [index,p]of plan.runs.entries())if(p.profile.seed===seed){
   const originalPath=`docs/planning/longitudinal-habit-execution-rev2/${String(index).padStart(3,'0')}.json`,bytes=fs.readFileSync(originalPath),original=JSON.parse(bytes);assert(matrix.artifacts.some(a=>a.path===originalPath&&a.sha256===sha(bytes)));assert.equal(original.planSha256,matrix.planSha256);assert.equal(original.runIdentity,p.runIdentity);assert.equal(original.modelIdentity,p.modelIdentity);inputs.push({index,path:originalPath,sha256:sha(bytes)});
   const run=await LongHabitWorkbenchRun.create(index),rows=[];
   for(let prefix=0;prefix<=16;prefix++){const snapshot=run.snapshot();assert.equal(snapshot.saveHash,original.prefixes[prefix].saveHash);assert.equal(snapshot.pairHash,original.prefixes[prefix].pairHash);rows.push(snapshot);if(prefix<16)assert(await run.advance());}
   assert.deepEqual(run.snapshot().state,original.state);snapshots.set(index,rows);
  }
  assert.equal(snapshots.size,120);
  for(const [index,spec]of LONG_HABIT_COMPARISONS.entries())if(plan.runs[spec.control].profile.seed===seed){
   const a=snapshots.get(spec.control),b=snapshots.get(spec.candidate),reports=[];
   for(let prefix=0;prefix<=16;prefix++){
    const before=[JSON.stringify(a[prefix]),JSON.stringify(b[prefix])],report=await compareLongHabitSnapshots(spec.id,a[prefix],b[prefix]);assert.equal(report.status,'ALIGNED_RECEIVER_PREFIX');assert.deepEqual(await compareLongHabitSnapshots(spec.id,a[prefix],b[prefix]),report);assert.deepEqual([JSON.stringify(a[prefix]),JSON.stringify(b[prefix])],before);assert(report.identity.sourceRunEqual);assert(report.identity.reusedNativeSaveEqual);assert.equal(report.rng.correspondence,'NOT_INFERRED_FROM_SEED');
    assert.deepEqual(report.rng.controlDraws,a[prefix].state.rows.map(r=>({at:r.at,draws:r.choice.draws})));assert.deepEqual(report.rng.candidateDraws,b[prefix].state.rows.map(r=>({at:r.at,draws:r.choice.draws})));
    if(spec.factor==='law'&&plan.runs[spec.candidate].profile.law==='Stored')assert(report.fields.every(f=>f.equal));
    if(spec.factor==='keepEpisodes')for(const name of ['standing','history','cache','belief','goals','cues','opportunities','availability','strength','performance','observations','probabilities','actions','arbitration','nuclei'])assert(report.fields.find(f=>f.name===name).equal,`${spec.id}/${prefix}/${name}`);
    reports.push(report);aligned++;
   }
   const file=`pair-${String(index).padStart(4,'0')}.json.gz`;fs.writeFileSync(root+'/'+file,gzipSync(JSON.stringify({index,spec,reports})+'\n'),{flag:'wx'});results.push({path:file,sha256:sha(fs.readFileSync(root+'/'+file))});
  }
  console.log(`PASS seed ${seed}:120 current receiver trajectories and356 comparisons/6052 aligned prefixes`);
 }
 assert.equal(aligned,48416);assert.equal(inputs.length,960);assert.equal(results.length,2848);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS CURRENT LONG HABIT COMPARISON COHORT',sources,inputs,results,counts:{receiverCases:960,receiverPrefixes:16320,pairs:2848,alignedPrefixes:aligned,lawPairs:768,retentionPairs:480,relearningPairs:640,cuePairs:480,visibilityPairs:480},scope:'Current receiver snapshots matched to original REV2 prefix and pair commitments. All declared single-factor comparisons cover all original cases and17 prefixes. Derived/Stored field equality and retention behavioral equality checked separately from memory/loss diagnostics. Seed matching does not establish RNG correspondence. Source bytes are reused; no fresh native execution, browser qualification, observer-safe narration or general law selection.'},null,2)+'\n',{flag:'wx'});console.log('PASS 2848 comparisons/48416 aligned prefixes');
}finally{await server.close();}
