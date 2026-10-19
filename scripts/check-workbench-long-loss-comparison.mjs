import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-long-loss-comparison-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),plan=read('docs/planning/LONGITUDINAL_PERSONAL_LOSS_PLAN_REV1.json'),prior=read('docs/planning/workbench-long-loss-parity-rev1/receipt.json');assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const paths=prior.sources.map(s=>{assert.equal(sha(fs.readFileSync(s.path)),s.sha256);return s.path;});paths.push('src/workbench/longLossComparison.ts','src/test/workbenchLongLossComparison.test.ts','scripts/check-workbench-long-loss-comparison.mjs');const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));for(const s of sources){const out=root+'/sources/'+s.path;fs.mkdirSync(out.slice(0,out.lastIndexOf('/')),{recursive:true});fs.writeFileSync(out,fs.readFileSync(s.path),{flag:'wx'});}
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'}),results=[],inputs=[];let aligned=0,matched=0;
try{
 const {LongLossWorkbenchRun}=await server.ssrLoadModule('/src/workbench/longLossAdapter.ts'),{LONG_LOSS_COMPARISONS,compareLongLossSnapshots}=await server.ssrLoadModule('/src/workbench/longLossComparison.ts');assert.equal(LONG_LOSS_COMPARISONS.length,904);
 for(let seed=0;seed<8;seed++){
  const snapshots=new Map();
  for(const [index,p]of plan.runs.entries())if(p.profile.seed===seed){
   const receiptPath=`case-${String(index).padStart(3,'0')}.json`,receiptBytes=fs.readFileSync('docs/planning/workbench-long-loss-parity-rev1/'+receiptPath);assert.equal(sha(receiptBytes),prior.results.find(r=>r.path===receiptPath).sha256);const receipt=JSON.parse(receiptBytes),bytes=fs.readFileSync(receipt.originalPath);assert.equal(sha(bytes),receipt.originalSha256);const original=JSON.parse(bytes);assert.equal(original.runIdentity,p.runIdentity);assert.equal(original.modelIdentity,p.modelIdentity);inputs.push({index,path:receipt.originalPath,sha256:sha(bytes)});
   const run=await LongLossWorkbenchRun.create(index),rows=[];for(let prefix=0;prefix<=12;prefix++){const s=run.snapshot();assert.equal(s.saveHash,original.prefixes[prefix].saveHash);assert.equal(s.runHash,sha(Buffer.from(p.runIdentity,'hex')));rows.push(s);if(prefix<12)await run.advance();}assert.deepEqual(run.snapshot().state,original.state);snapshots.set(index,rows);
  }
  assert.equal(snapshots.size,60);
  for(const [index,spec]of LONG_LOSS_COMPARISONS.entries())if(plan.runs[spec.control].profile.seed===seed){
   const a=snapshots.get(spec.control),b=snapshots.get(spec.candidate),reports=[];
   for(let prefix=0;prefix<=12;prefix++){
    const before=[JSON.stringify(a[prefix]),JSON.stringify(b[prefix])],report=await compareLongLossSnapshots(spec.id,a[prefix],b[prefix]);assert.equal(report.status,'ALIGNED_COMPONENT_PREFIX');assert.deepEqual(await compareLongLossSnapshots(spec.id,a[prefix],b[prefix]),report);assert.deepEqual([JSON.stringify(a[prefix]),JSON.stringify(b[prefix])],before);assert.equal(report.fields.length,17);assert.equal(report.rng.correspondence,'NOT_INFERRED_FROM_SEED');
    for(const [side,s]of [['controlDraws',a[prefix]],['candidateDraws',b[prefix]]])assert.deepEqual(report.rng[side],s.state.rows.map(r=>({at:r.at,draws:r.choice.draws})));
    if(spec.evidenceMatched){assert(report.fields.filter(f=>f.authority==='character-side-state-or-decision-diagnostic').every(f=>f.equal));assert.deepEqual(report.rng.controlDraws,report.rng.candidateDraws);matched++;}
    reports.push(report);aligned++;
   }
   const path=`pair-${String(index).padStart(3,'0')}.json.gz`;fs.writeFileSync(root+'/'+path,gzipSync(JSON.stringify({index,spec,reports})+'\n'),{flag:'wx'});results.push({path,sha256:sha(fs.readFileSync(root+'/'+path))});
  }
  console.log(`PASS loss seed${seed}:60 cases/113 pairs/1469 aligned prefixes`);
 }
 assert.equal(inputs.length,480);assert.equal(results.length,904);assert.equal(aligned,11752);assert.equal(matched,2080);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS ALL DECLARED LONG LOSS COMPARISONS',sources,inputs,results,counts:{cases:480,receiverPrefixes:6240,pairs:904,alignedPrefixes:aligned,evidenceMatchedPairs:160,evidenceMatchedPrefixes:matched},scope:'All original cases and all13 prefixes across declared condition/law contrasts and matched-evidence controls. Current saves equal original qualification. Exact17-field reports, repeated/nonmutation checks and addressed draws retained.160 matched-evidence pairs preserve character-side diagnostics and draws; physical completion is separately labeled. No browser, character narration, clinical law selection or native admission claim.'},null,2)+'\n',{flag:'wx'});console.log('PASS904 loss pairs/11752 aligned prefixes');
}finally{await server.close();}
