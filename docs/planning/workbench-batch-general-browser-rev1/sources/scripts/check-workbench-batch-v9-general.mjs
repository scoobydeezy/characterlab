import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-batch-general-rev1';assert(!fs.existsSync(root));
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const catalog=read('src/workbench/batchCatalogV9.json'),old=read('src/workbench/batchCatalogV8.json');
assert.deepEqual(catalog.jobs.slice(0,947),old.jobs);
const nativeRoot='docs/planning/workbench-general-cohort-rev1',native=read(nativeRoot+'/receipt.json');
const files=new Set();
function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;
 for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){
  const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);
 }}
for(const p of ['src/workbench/BatchWorkbench.tsx','src/workbench/batchWorker.ts','src/workbench/batchWorkerClient.ts',
 'src/test/workbenchBatchV9.test.ts','scripts/check-workbench-batch-v9-general.mjs','scripts/build-workbench-batch-catalog-v9.mjs',nativeRoot+'/receipt.json'])visit(p);
const sources=[...files].sort().map(path=>{const bytes=fs.readFileSync(path),target=root+'/sources/'+path;
 fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,bytes,{flag:'wx'});return {path,sha256:sha(bytes)};});
fs.writeFileSync(root+'/manifest.json',JSON.stringify({status:'FROZEN BEFORE EXECUTION',sources,roles:43,prefixes:568},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {BatchSession}=await server.ssrLoadModule('/src/workbench/batchSession.ts'),{batchReport}=await server.ssrLoadModule('/src/workbench/BatchWorkbench.tsx');
 const jobs=catalog.jobs.filter(j=>j.experimentId==='general'),batch=new BatchSession(jobs);let printed=0;
 batch.subscribe(()=>{const s=batch.snapshot();if(s.current>printed){printed=s.current;console.log(`PASS ${printed}/43 General recipes`);}});
 await batch.run();const snapshot=batch.snapshot();
 if(snapshot.status!=='complete')fs.writeFileSync(root+'/failure.json',JSON.stringify(snapshot,null,2)+'\n',{flag:'wx'});
 assert.equal(snapshot.status,'complete');assert.equal(snapshot.results.length,43);
 for(const result of snapshot.results){
  const artifact=native.artifacts.find(a=>a.recipe===result.job.name),bytes=fs.readFileSync(nativeRoot+'/'+artifact.path);assert.equal(sha(bytes),artifact.sha256);
  const original=JSON.parse(bytes);assert.equal(original.seed,result.job.seedHex);assert.equal(original.prefixes.length,result.prefixes.length);
  for(const [i,p]of result.prefixes.entries())for(const key of ['prefix','clock','modelHash','runHash','stateHash','saveHash'])assert.equal(p[key],original.prefixes[i][key]);
 }
 const report=batchReport(snapshot);assert.deepEqual(report.originals.general,catalog.general);
 assert.equal(snapshot.results.reduce((n,r)=>n+r.prefixes.length,0),568);
 const prior=read('docs/planning/workbench-batch-parity-rev8/receipt.json');
 const oldReport=batchReport(prior.report.snapshot);
 for(const [key,value]of Object.entries(prior.report.originals))assert.deepEqual(oldReport.originals[key],value,key);
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS GENERAL V9 BATCH COHORT',sources,roles:43,prefixes:568,report,
  scope:'All43 General calendars join six original native identity/state/clock fields at568 prefixes. Original947 V8 declarations and export originals unchanged. Full990 V9 re-execution, browser execution, other corpus/successors and Campaign4 entry remain separate.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS43 General recipes/568 prefixes; previous exports unchanged');
}finally{await server.close();}
