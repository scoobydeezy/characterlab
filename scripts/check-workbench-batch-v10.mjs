import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-batch-parity-rev10',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root),'Preserve prior/live evidence');
const catalog=read('src/workbench/batchCatalogV10.json'),previous=read('src/workbench/batchCatalogV9.json');
assert.deepEqual(catalog.jobs.slice(0,990),previous.jobs);assert.equal(catalog.jobs.length,1068);
const files=new Set();
function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;
 for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){
  const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);
 }}
for(const p of ['src/workbench/BatchWorkbench.tsx','src/workbench/batchWorker.ts','src/workbench/batchWorkerClient.ts','src/test/workbenchBatchV10.test.ts',
 'scripts/check-workbench-batch-v10.mjs','scripts/build-workbench-batch-catalog-v10.mjs','package.json','package-lock.json',
 'docs/planning/workbench-batch-parity-rev8/receipt.json','docs/planning/workbench-batch-general-rev1/receipt.json',
 'docs/planning/workbench-public-source-batch-rev1/receipt.json'])visit(p);
const sources=[...files].sort().map(path=>{const bytes=fs.readFileSync(path),copy=root+'/sources/'+path;
 fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,bytes,{flag:'wx'});return {path,copy,sha256:sha(bytes)};});
const sourceRoot=path.resolve(root,'sources');
fs.writeFileSync(root+'/manifest.json',JSON.stringify({status:'FROZEN BEFORE EXECUTION',sources,roles:1068,prefixes:7284,
 executionRoot:sourceRoot,currentSourceHold:false,scope:'Vite executes only the frozen source tree; installed dependency versions are bound by package lock. Current checkout may advance; frozen copies must remain unchanged.'},null,2)+'\n',{flag:'wx'});
const server=await createServer({root:sourceRoot,configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {BatchSession}=await server.ssrLoadModule('/src/workbench/batchSession.ts'),{batchReport}=await server.ssrLoadModule('/src/workbench/BatchWorkbench.tsx');
 const batch=new BatchSession(catalog.jobs);let printed=0;
 batch.subscribe(()=>{const s=batch.snapshot();if(s.current>=printed+20){printed=s.current;console.log(`PASS ${printed}/1068 execution roles`);}});
 await batch.run();const snapshot=batch.snapshot();
 if(snapshot.status!=='complete')fs.writeFileSync(root+'/failure.json',JSON.stringify(snapshot,null,2)+'\n',{flag:'wx'});
 assert.equal(snapshot.status,'complete');assert.equal(snapshot.results.length,1068);
 assert.equal(snapshot.results.reduce((n,r)=>n+r.prefixes.length,0),7284);
 for(const r of snapshot.results){assert.equal(r.status,'complete');assert(r.prefixes.every(p=>p.matchesFrozenSave));}
 const report=batchReport(snapshot);assert.deepEqual(report.snapshot.results.map(r=>r.job),catalog.jobs);
 const old=read(sourceRoot+'/docs/planning/workbench-batch-parity-rev8/receipt.json');
 for(const [key,value]of Object.entries(old.report.originals))assert.deepEqual(report.originals[key],value,key);
 const general=read(sourceRoot+'/docs/planning/workbench-batch-general-rev1/receipt.json');
 assert.deepEqual(report.originals.general,general.report.originals.general);
 const publicSources=read(sourceRoot+'/docs/planning/workbench-public-source-batch-rev1/receipt.json');
 for(const prior of [...general.report.snapshot.results,...publicSources.results]){
  const current=snapshot.results.find(r=>r.job.id===prior.job.id);assert.deepEqual(current.job,prior.job);
  assert.equal(current.prefixes.length,prior.prefixes.length);
  for(const [i,p]of current.prefixes.entries())for(const key of ['prefix','total','complete','clock','modelHash','runHash','stateHash','saveHash'])assert.equal(p[key],prior.prefixes[i][key]);
 }
 assert.deepEqual(report.originals.body,catalog.body);assert.deepEqual(report.originals.multisource,catalog.multisource);
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS FULL V10 NATIVE BATCH',sources,roles:1068,prefixes:7284,report,
 scope:'Fresh full1068-role frozen-source execution, all7284 native save commitments, terminal no-ops and prior original export preservation. General/public-source complete view joins checked. Full browser, other corpus/component successors, language and Campaign4 entry remain separate.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS full1068 roles/7284 prefixes');
}finally{await server.close();}
