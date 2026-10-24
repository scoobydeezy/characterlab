import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-public-source-batch-rev1';assert(!fs.existsSync(root));
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const catalog=read('src/workbench/batchCatalogV10.json'),previous=read('src/workbench/batchCatalogV9.json');assert.deepEqual(catalog.jobs.slice(0,990),previous.jobs);
const bodyRoot='docs/planning/workbench-body-parity-rev1',body=read(bodyRoot+'/receipt.json'),multi=read('docs/planning/workbench-multisource-parity-rev1/receipt.json');
const paths=['src/workbench/publicSourceBatch.ts','src/workbench/batchCatalogV10.json','src/workbench/bodyAdapter.ts','src/workbench/multisourceAdapter.ts',
 'src/workbench/bodyCatalog.json','src/workbench/multisourceCatalog.json','scripts/build-workbench-batch-catalog-v10.mjs','scripts/check-workbench-public-source-batch.mjs',
 'src/test/workbenchPublicSourceBatch.test.ts',bodyRoot+'/receipt.json','docs/planning/workbench-multisource-parity-rev1/receipt.json'];
const sources=paths.map(path=>{const bytes=fs.readFileSync(path),copy=root+'/sources/'+path;fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,bytes,{flag:'wx'});return {path,copy,sha256:sha(bytes)};});
fs.writeFileSync(root+'/manifest.json',JSON.stringify({sources,status:'FROZEN BEFORE EXECUTION'},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {createPublicSourceBatchRun}=await server.ssrLoadModule('/src/workbench/publicSourceBatch.ts');const results=[];
 for(const job of catalog.jobs.slice(990)){
  let expected;
  if(job.experimentId==='body'){const artifact=body.results.find(r=>r.program===job.name),bytes=fs.readFileSync(bodyRoot+'/'+artifact.path);assert.equal(sha(bytes),artifact.sha256);expected=JSON.parse(bytes).prefixes;}
  else expected=multi.results.find(r=>r.id===job.name).prefixes;
  const run=await createPublicSourceBatchRun(job),prefixes=[];
  for(const [i,original]of expected.entries()){
   const view=run.view();assert.equal(view.prefix,i);assert.equal(view.total,expected.length-1);assert.equal(view.complete,i===expected.length-1);
   for(const key of ['prefix','clock','saveHash','stateHash'])assert.equal(view[key],original[key]);
   if(job.experimentId==='body')for(const key of ['modelHash','runHash'])assert.equal(view[key],original[key]);
   assert.equal(view.saveHash,job.expectedSaveHashes[i]);prefixes.push(view);
   const moved=await run.advance();assert.equal(moved,i+1<expected.length);if(!moved)assert.deepEqual(run.view(),view);
  }
  results.push({job,prefixes});console.log(`PASS ${results.length}/78 public-source batch transports`);
 }
 assert.equal(results.length,78);assert.equal(results.reduce((n,r)=>n+r.prefixes.length,0),328);
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS PREPARED PUBLIC SOURCE BATCH TRANSPORT',sources,roles:78,prefixes:328,results,
 scope:'Prepared common transport for16 BODY and62 MULTISOURCE original programs; all retained prefix commitments and terminal no-ops verified. Prior990 declarations unchanged. Not yet admitted to shared BatchSession/worker/UI; full1068 replay/browser, other corpus/component successors and Campaign4 entry remain separate.'},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
