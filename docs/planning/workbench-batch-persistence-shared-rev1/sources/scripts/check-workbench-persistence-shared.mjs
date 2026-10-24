import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-batch-persistence-shared-rev1';assert(!fs.existsSync(root),'Preserve existing evidence');
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex'),bytes=h=>Uint8Array.from(Buffer.from(h,'hex'));
const catalog=read('src/workbench/batchCatalogV11.json'),previous=read('src/workbench/batchCatalogV10.json');assert.deepEqual(catalog.jobs.slice(0,1068),previous.jobs);
const paths=new Set();function visit(p){p=p.replaceAll('\\','/');if(paths.has(p))return;paths.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;
 for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){
  const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);
 }}
for(const p of ['src/workbench/BatchWorkbench.tsx','src/workbench/batchWorker.ts','src/workbench/batchWorkerClient.ts','src/test/workbenchBatchV11.test.ts',
 'scripts/check-workbench-persistence-shared.mjs','scripts/build-workbench-batch-catalog-v11.mjs','package.json','package-lock.json',
 'docs/planning/workbench-persistence-batch-rev1/receipt.json','docs/planning/workbench-adapt-parent-parity-rev1/receipt.json','docs/planning/workbench-det-parity-rev1/receipt.json'])visit(p);
const sources=[...paths].sort().map(path=>{const b=fs.readFileSync(path),copy=root+'/sources/'+path;fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,b,{flag:'wx'});return {path,copy,sha256:sha(b)};});
fs.writeFileSync(root+'/manifest.json',JSON.stringify({status:'FROZEN BEFORE EXECUTION',sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {BatchSession}=await server.ssrLoadModule('/src/workbench/batchSession.ts'),{batchReport}=await server.ssrLoadModule('/src/workbench/BatchWorkbench.tsx');
 const batch=new BatchSession(catalog.jobs.slice(1068));await batch.run();const snapshot=batch.snapshot();assert.equal(snapshot.status,'complete');assert.equal(snapshot.current,4);
 const prior=read('docs/planning/workbench-persistence-batch-rev1/receipt.json');assert.equal(snapshot.results.length,4);
 for(const [i,r]of snapshot.results.entries()){
  assert.equal(r.status,'complete');assert.deepEqual(r.job,prior.results[i].job);assert.equal(r.prefixes.length,prior.results[i].prefixes.length);
  for(const [j,p]of r.prefixes.entries()){
   const {expectedSaveHash,matchesFrozenSave,...view}=p;assert.deepEqual(view,prior.results[i].prefixes[j]);assert.equal(matchesFrozenSave,true);assert.equal(expectedSaveHash,p.saveHash);
  }
 }
 const report=batchReport(snapshot);assert.deepEqual(report.originals.adapt,catalog.adapt);assert.deepEqual(report.originals.det,catalog.det);
 for(const s of sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);}
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS SHARED PERSISTENCE BATCH',sources,roles:4,prefixes:26,report,currentSourceHold:false,
 scope:'All four new V11 public roles through shared session/report transport,26 original prefixes and terminal no-ops; exact prior native views and complete ADAPT/DET originals. Prior1068 declarations unchanged; fresh full1072 execution, browser and remaining corpus controls not inferred.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS shared4 roles/26 prefixes; source hold released');
}catch(error){fs.writeFileSync(root+'/failure.json',JSON.stringify({error:String(error),stack:error.stack},null,2)+'\n',{flag:'wx'});throw error;}finally{await server.close();}
