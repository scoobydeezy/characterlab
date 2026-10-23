import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-batch-parity-rev8',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root),'Preserve previous or live evidence');
const catalog=read('src/workbench/batchCatalogV8.json'),previous=read('docs/planning/workbench-batch-parity-rev7/receipt.json'),long=read('src/workbench/longCatalog.json');
assert.equal(catalog.jobs.length,947);assert.deepEqual(catalog.jobs.slice(0,915),previous.report.snapshot.results.map(r=>r.job));
for(const s of catalog.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
const files=new Set();
function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of ['src/workbench/BatchWorkbench.tsx','src/workbench/batchWorker.ts','src/workbench/batchWorkerClient.ts','src/test/workbenchBatchV8.test.ts','scripts/check-workbench-batch-v8.mjs','scripts/build-workbench-batch-catalog-v8.mjs','docs/planning/workbench-batch-parity-rev7/receipt.json'])visit(p);
const sources=[...files].sort().map(path=>{const bytes=fs.readFileSync(path),target=root+'/sources/'+path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,bytes,{flag:'wx'});return {path,sha256:sha(bytes)};});
fs.writeFileSync(root+'/manifest.json',JSON.stringify({status:'FROZEN BEFORE EXECUTION',sources,roles:947,prefixes:6388},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {BatchSession}=await server.ssrLoadModule('/src/workbench/batchSession.ts'),{batchReport}=await server.ssrLoadModule('/src/workbench/BatchWorkbench.tsx');
 const batch=new BatchSession(catalog.jobs);let printed=0;
 batch.subscribe(()=>{const s=batch.snapshot();if(s.current>=printed+20){printed=s.current;console.log(`PASS ${printed}/947 execution roles`);}});
 await batch.run();const snapshot=batch.snapshot();
 if(snapshot.status!=='complete')fs.writeFileSync(root+'/failure.json',JSON.stringify({snapshot},null,2)+'\n',{flag:'wx'});
 assert.equal(snapshot.status,'complete');assert.equal(snapshot.results.length,947);
 assert.equal(snapshot.results.reduce((n,r)=>n+r.prefixes.length,0),6388);
 assert(snapshot.results.every(r=>r.status==='complete'&&r.prefixes.every(p=>p.matchesFrozenSave)));
 const report=batchReport(snapshot);assert.deepEqual(report.snapshot.results.map(r=>r.job),catalog.jobs);
 for(const [key,value]of Object.entries(previous.report.originals))assert.deepEqual(report.originals[key],value,key);
 assert.deepEqual(report.originals.long.programs,long.programs);assert.deepEqual(report.originals.long.models,long.models);assert.deepEqual(report.originals.long.sources,long.sources);
 const native=read('docs/planning/workbench-long-parity-rev2/receipt.json');
 for(const r of snapshot.results.filter(r=>r.job.experimentId==='long')){
  const entry=native.results.find(e=>e.program===r.job.name),bytes=fs.readFileSync('docs/planning/workbench-long-parity-rev2/'+entry.path);assert.equal(sha(bytes),entry.sha256);const expected=JSON.parse(bytes).prefixes;
  assert.equal(r.prefixes.length,expected.length);for(const [i,p]of r.prefixes.entries())for(const key of ['prefix','clock','modelHash','runHash','stateHash','saveHash'])assert.equal(p[key],expected[i][key]);
 }
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 for(const s of catalog.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS SHARED V8 BATCH EXECUTION',sources,programs:947,prefixes:6388,report,scope:'Fresh full947-role execution; previous915 declarations and exported originals retained exactly, plus32 original LONG source programs/513 prefixes. Every frozen save matches; LONG identities/state/clock also join qualified originals. Terminal no-ops and all prefix retention checked by shared session. Browser, component successors, full corpus, narrative and Campaign4 entry remain separate.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS947 execution roles /6388 prefixes');
}finally{await server.close();}
