import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-batch-scoped-shared-rev1';assert(!fs.existsSync(root),'Preserve existing evidence');
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const acceptedRoot='docs/planning/workbench-scoped-batch-rev2',accepted=read(acceptedRoot+'/acceptance.json');
assert.equal(accepted.status,'PASS INDEPENDENT SCOPED TRANSPORT RECONCILIATION');
assert.equal(sha(fs.readFileSync(acceptedRoot+'/receipt.json')),accepted.receiptSha256);
const catalog=read('src/workbench/batchCatalogV12.json'),previous=read('src/workbench/batchCatalogV11.json');assert.deepEqual(catalog.jobs.slice(0,1072),previous.jobs);
const paths=new Set();function visit(p){p=p.replaceAll('\\','/');if(paths.has(p))return;paths.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;
 for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){
  const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);
 }}
for(const p of ['src/workbench/BatchWorkbench.tsx','src/workbench/batchWorker.ts','src/workbench/batchWorkerClient.ts','src/test/workbenchBatchV12.test.ts',
 'scripts/check-workbench-scoped-shared.mjs','scripts/build-workbench-batch-catalog-v12.mjs','package.json','package-lock.json',
 acceptedRoot+'/receipt.json',acceptedRoot+'/acceptance.json'])visit(p);
const sources=[...paths].sort().map(path=>{const b=fs.readFileSync(path),copy=root+'/sources/'+path;fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,b,{flag:'wx'});return {path,copy,sha256:sha(b)};});
fs.writeFileSync(root+'/manifest.json',JSON.stringify({status:'FROZEN BEFORE EXECUTION',sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {BatchSession}=await server.ssrLoadModule('/src/workbench/batchSession.ts'),{batchReport}=await server.ssrLoadModule('/src/workbench/BatchWorkbench.tsx');
 const batch=new BatchSession(catalog.jobs.slice(1072));await batch.run();const snapshot=batch.snapshot();assert.equal(snapshot.status,'complete');assert.equal(snapshot.current,14);
 const prior=read('docs/planning/workbench-scoped-batch-rev2/receipt.json');assert.equal(snapshot.results.length,14);
 for(const [i,r]of snapshot.results.entries()){
  assert.equal(r.status,'complete');assert.deepEqual(r.job,prior.results[i].job);assert.equal(r.prefixes.length,prior.results[i].prefixes.length);
  for(const [j,p]of r.prefixes.entries()){
   const {expectedSaveHash,matchesFrozenSave,...view}=p;assert.deepEqual(view,prior.results[i].prefixes[j]);assert.equal(matchesFrozenSave,true);assert.equal(expectedSaveHash,p.saveHash);
  }
 }
 const report=batchReport(snapshot);assert.deepEqual(report.originals.bio,catalog.bio);assert.deepEqual(report.originals.sem,catalog.sem);
 assert.equal(report.executionBoundaries.filter(b=>b.kind==='composed-component').length,13);assert.equal(report.executionBoundaries.filter(b=>b.kind==='fixed-scheduler-harness').length,1);
 for(const s of sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);}
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS SHARED BIO SEM SCOPED BATCH',sources,roles:14,prefixes:264,report,currentSourceHold:false,
 scope:'All14 BIO component/SEM harness roles through shared session/report transport,264 original prefixes and terminal no-ops; exact accepted transport views,originals and boundary metadata. Prior1072 declarations unchanged; no public factory promotion,fresh full1086 execution,browser or complete corpus inference.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS shared14 roles/264 prefixes; source hold released');
}catch(error){fs.writeFileSync(root+'/failure.json',JSON.stringify({error:String(error),stack:error.stack},null,2)+'\n',{flag:'wx'});throw error;}finally{await server.close();}
