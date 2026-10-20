import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-general-history-rev1',cohort='docs/planning/workbench-general-comparison-cohort-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const files=new Set();function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of ['src/workbench/GeneralComparisonPanel.tsx','src/workbench/GeneralWorkbench.tsx','src/workbench/generalWorker.ts','scripts/check-workbench-general-history.mjs',cohort+'/receipt.json'])visit(p);
const sources=[...files].sort().map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return{path:p,sha256:sha(bytes)};});
fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {generalComparisonHistory:history,retainGeneralComparison:retain}=await server.ssrLoadModule('/src/workbench/generalComparisonHistory.ts'),{captureGeneralPair:capture,restoreGeneralPair:restore}=await server.ssrLoadModule('/src/workbench/generalPairCheckpoint.ts'),{GeneralWorkbenchRun:Run}=await server.ssrLoadModule('/src/workbench/generalAdapter.ts'),{compareGeneralSnapshots:compare}=await server.ssrLoadModule('/src/workbench/generalComparison.ts');
 const original=read(cohort+'/receipt.json'),results=[];let prefixes=0,allFirst;
 for(const p of original.pairs){
  const bytes=fs.readFileSync(cohort+'/'+p.path);assert.equal(sha(bytes),p.sha256);const decoded=gunzipSync(bytes);assert.equal(sha(decoded),p.decodedSha256);const reports=JSON.parse(decoded);if(!allFirst)allFirst=reports;
  let retained=[];
  for(const r of reports){
   retained=retain(retained,r);const h=history(retained),before=retained.filter(x=>x.control.prefix<=r.control.prefix);
   assert.deepEqual(h.observedPrefixes,before.map(x=>x.control.prefix));assert.deepEqual(h.missingPrefixes,[]);
   const state=before.find(x=>!x.identity.stateEqual),output=before.find(x=>x.status==='ALIGNED_COMMITTED_INSTANT'&&x.events.some(e=>e.outputsEqual===false));
   assert.equal(h.firstStateDifference?.prefix,state?.control.prefix);assert.equal(h.firstOutputDifference?.prefix,output?.control.prefix);
   for(const v of [h.firstStateDifference,h.firstOutputDifference])if(v)assert.equal(v.earliestProven,true);
   prefixes++;
  }
  const restored=retain(retained,reports[1],'restore');assert.deepEqual(restored,reports.slice(0,2));assert.deepEqual(retain(restored,reports[2]),reports.slice(0,3));
  const sparse=history(reports.slice(2));assert.deepEqual(sparse.missingPrefixes,[0,1]);for(const v of [sparse.firstStateDifference,sparse.firstOutputDifference])if(v)assert.equal(v.earliestProven,false);
  assert.throws(()=>history([reports[0],{...reports[0],scope:'conflicting'}]),/conflicting/);
  const detached=retain([],reports[0],'reset');detached[0].scope='edited';assert.notEqual(reports[0].scope,'edited');
  results.push({id:p.id,source:{path:cohort+'/'+p.path,sha256:p.sha256},history:history(retained)});
 }
 assert.equal(prefixes,471);
 // Missing/ambiguous event correspondence never manufactures output inequality.
 const ambiguous=structuredClone(allFirst[0]);ambiguous.events=[{key:'slot',controlIds:['a','b'],candidateIds:['c'],status:'AMBIGUOUS_STAGE_SLOT',outputsEqual:null}];assert.equal(history([ambiguous]).firstOutputDifference,null);
 const unqualified=structuredClone(allFirst[0]);unqualified.status='UNALIGNED_HORIZONS';const later=structuredClone(allFirst[1]);later.identity.stateEqual=false;assert.equal(history([unqualified,later]).firstStateDifference.earliestProven,false);
 const first=allFirst[0],pair=[await Run.create(first.spec.control,first.seed),await Run.create(first.spec.candidate,first.seed)];
 const saves=[];for(let i=0;i<=2;i++){if(i)for(const run of pair)await run.advance();const report=compare(first.spec.id,pair[0].snapshot(),pair[1].snapshot());assert.deepEqual(report,allFirst[i]);saves.push(await capture(first.spec.id,pair));}
 for(const saved of saves){const restored=await restore(saved,c=>Run.restore(c),()=>{});assert.deepEqual(compare(first.spec.id,restored[0].snapshot(),restored[1].snapshot()),allFirst[saved.a.prefix]);if(saved.a.prefix<2){for(const r of restored)await r.advance();assert.deepEqual(compare(first.spec.id,restored[0].snapshot(),restored[1].snapshot()),allFirst[saved.a.prefix+1]);}}
 let disposed=0;const corrupt=structuredClone(saves[1]);corrupt.b.saveHash='0'.repeat(64);await assert.rejects(()=>restore(corrupt,c=>Run.restore(c),()=>{disposed++;}),/digest/);assert.equal(disposed,1);
 for(const change of [v=>v.b.recipe='wrong',v=>v.a.seed='0'.repeat(64),v=>v.b.prefix++] ){const bad=structuredClone(saves[1]);change(bad);await assert.rejects(()=>restore(bad,c=>Run.restore(c),()=>{}),/mismatch|matching/);}
 assert.deepEqual(compare(first.spec.id,pair[0].snapshot(),pair[1].snapshot()),allFirst[2]);
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS GENERAL COMPARISON HISTORY AND BOUNDED PAIR RESTORE',sources,counts:{pairs:36,archivedPrefixes:prefixes,nativeCheckpoints:3,nativeContinuations:2},results,scope:'All471 frozen reports authenticated and checked for history retention, earliest diagnostic divergence, sparse history, truncation and detached inspection. One native pair restored at0/1/2 with continuation0→1 and1→2. Corrupt second save rejects and disposes first replacement, leaving originals intact. No full-pair replay, browser, causal-significance or integrated-entry claim.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS 36 pairs /471 retained reports;3 native paired checkpoints /2 continuations; negative cases PASS');
}finally{await server.close();}
