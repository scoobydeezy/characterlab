import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-long-routine-comparison-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),planPath='docs/planning/LONGITUDINAL_ROUTINE_PLAN_REV1.json',plan=read(planPath),matrix=read('docs/planning/LONGITUDINAL_ROUTINE_MATRIX_REV1.json');
assert(!fs.existsSync(root));assert.equal(matrix.planSha256,sha(fs.readFileSync(planPath)));fs.mkdirSync(root,{recursive:true});
const predecessor='docs/planning/workbench-long-routine-reuse-rev1/sources',paths=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else paths.push(p.slice(predecessor.length+1));}}walk(predecessor);
for(const p of paths)assert.equal(sha(fs.readFileSync(p)),sha(fs.readFileSync(predecessor+'/'+p)),p);
paths.push('src/workbench/longRoutineComparison.ts','src/test/workbenchLongRoutineComparison.test.ts','scripts/check-workbench-long-routine-comparison.mjs');
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));for(const s of sources){const out=root+'/sources/'+s.path;fs.mkdirSync(out.slice(0,out.lastIndexOf('/')),{recursive:true});fs.writeFileSync(out,fs.readFileSync(s.path),{flag:'wx'});}
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'}),results=[],inputs=[];let aligned=0;
try{
 const {LongRoutineWorkbenchRun}=await server.ssrLoadModule('/src/workbench/longRoutineAdapter.ts'),{LONG_ROUTINE_COMPARISONS,compareLongRoutineSnapshots}=await server.ssrLoadModule('/src/workbench/longRoutineComparison.ts');
 assert.equal(LONG_ROUTINE_COMPARISONS.length,1224);
 for(let seed=0;seed<8;seed++){
  const snapshots=new Map();
  for(const [index,p]of plan.runs.entries())if(p.profile.seed===seed){
   const originalPath=`docs/planning/longitudinal-routine-execution-rev1/${String(index).padStart(3,'0')}.json`,bytes=fs.readFileSync(originalPath),original=JSON.parse(bytes);assert(matrix.artifacts.some(a=>a.path===originalPath&&a.sha256===sha(bytes)));assert.equal(original.planSha256,matrix.planSha256);assert.equal(original.runIdentity,p.runIdentity);assert.equal(original.modelIdentity,p.modelIdentity);inputs.push({index,path:originalPath,sha256:sha(bytes)});
   const run=await LongRoutineWorkbenchRun.create(index),rows=[];
   for(let prefix=0;prefix<=16;prefix++){const snapshot=run.snapshot();assert.equal(snapshot.saveHash,original.prefixes[prefix].saveHash);assert.equal(snapshot.pairHash,original.prefixes[prefix].pairHash);rows.push(snapshot);if(prefix<16)assert(await run.advance());}
   assert.deepEqual(run.snapshot().state,original.state);snapshots.set(index,rows);
  }
  assert.equal(snapshots.size,63);
  for(const [index,spec]of LONG_ROUTINE_COMPARISONS.entries())if(plan.runs[spec.control].profile.seed===seed){
   const a=snapshots.get(spec.control),b=snapshots.get(spec.candidate),reports=[];
   for(let prefix=0;prefix<=16;prefix++){
    const before=[JSON.stringify(a[prefix]),JSON.stringify(b[prefix])],report=await compareLongRoutineSnapshots(spec.id,a[prefix],b[prefix]);assert.equal(report.status,'ALIGNED_RECEIVER_PREFIX');assert.deepEqual(await compareLongRoutineSnapshots(spec.id,a[prefix],b[prefix]),report);assert.deepEqual([JSON.stringify(a[prefix]),JSON.stringify(b[prefix])],before);assert.equal(report.identity.sourceRunEqual,spec.factor!=='keepEpisodes');if(spec.factor!=='keepEpisodes')assert(report.identity.reusedNativeSaveEqual);assert.equal(report.rng.correspondence,'NOT_INFERRED_FROM_SEED');
    assert.deepEqual(report.rng.controlDraws,a[prefix].state.rows.map(r=>({at:r.at,draws:r.choice.draws})));assert.deepEqual(report.rng.candidateDraws,b[prefix].state.rows.map(r=>({at:r.at,draws:r.choice.draws})));
    if(spec.factor==='law'&&plan.runs[spec.candidate].profile.law==='Stored')assert(report.fields.every(f=>f.equal));
    if(spec.factor==='keepEpisodes')assert(report.fields.every(f=>f.equal));assert.equal(report.fields.length,18);assert.equal(report.fields.find(f=>f.name==='performance').authority,'execution-diagnostic');
    reports.push(report);aligned++;
   }
   const file=`pair-${String(index).padStart(4,'0')}.json.gz`;fs.writeFileSync(root+'/'+file,gzipSync(JSON.stringify({index,spec,reports})+'\n'),{flag:'wx'});results.push({path:file,sha256:sha(fs.readFileSync(root+'/'+file))});
  }
  console.log(`PASS seed ${seed}:63 current receiver trajectories and153 comparisons/2601 aligned prefixes`);
 }
 assert.equal(aligned,20808);assert.equal(inputs.length,504);assert.equal(results.length,1224);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS CURRENT LONG ROUTINE COMPARISON COHORT',sources,inputs,results,counts:{receiverCases:504,receiverPrefixes:8568,pairs:1224,alignedPrefixes:aligned,lawPairs:384,retentionPairs:24,goalModePairs:336,cuePairs:240,visibilityPairs:240},scope:'Current receiver snapshots matched to original REV1 prefix and pair commitments. All declared single-factor comparisons cover all original cases and17 prefixes. Derived/Stored and native retention receiver-field equality checked separately from source identity. Goal lifecycle, history availability, actual performance and observed outcome remain distinct. Seed matching does not establish RNG correspondence. Source bytes are reused; no fresh native execution, browser qualification, observer-safe narration or general law selection.'},null,2)+'\n',{flag:'wx'});console.log('PASS 1224 comparisons/20808 aligned prefixes');
}finally{await server.close();}
