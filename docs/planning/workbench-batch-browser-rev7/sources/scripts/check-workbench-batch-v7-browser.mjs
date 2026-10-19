import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-batch-browser-rev7',parent='docs/planning/workbench-batch-parity-rev7/receipt.json',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
if(process.argv.includes('--freeze')){
 assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const files=new Set();
 function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
 for(const p of ['src/workbench/BatchWorkbench.tsx','src/workbench/batchWorker.ts','src/workbench/batchWorkerClient.ts','scripts/check-workbench-batch-v7-browser.mjs'])visit(p);
 const sources=[...files].sort().map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return {path:p,sha256:sha(bytes)};});
 const native=read(parent);assert.equal(native.status,'PASS SHARED BATCH EXECUTION');assert.equal(native.programs,915);assert.equal(native.prefixes,5875);
 fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources,parent:{path:parent,sha256:sha(fs.readFileSync(parent))},scope:'Full915-role browser batch. DOM diagnostics and bounded preview only; no download or checkpoint-file transfer.'},null,2)+'\n',{flag:'wx'});console.log(`FROZEN ${sources.length} sources for full browser batch`);
}else{
 const freeze=read(root+'/freeze.json'),native=read(parent),b=read(root+'/browser.json');assert.equal(sha(fs.readFileSync(parent)),freeze.parent.sha256);
 for(const s of freeze.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(root+'/sources/'+s.path)),s.sha256,s.path);}
 const snapshot=native.report.snapshot,report=JSON.stringify(native.report,null,2);assert.equal(snapshot.status,'complete');assert.equal(snapshot.results.length,915);
 assert.equal(b.status,'915/915 execution roles complete · 5875 prefixes checked');assert(b.limitCaption.includes('at most 915 execution roles and 33 retained prefixes per program'));
 assert.deepEqual(b.rows,snapshot.results.map(r=>({id:r.job.id,status:r.status,checks:r.prefixes.length+'/'+r.job.expectedSaveHashes.length})));
 assert.deepEqual(b.hashes,snapshot.results.flatMap(r=>r.prefixes.flatMap(p=>[p.saveHash,p.expectedSaveHash])));
 assert.equal(b.preview,report.slice(0,64000));assert.equal(b.downloadLabel,'Download complete JSON ('+Buffer.byteLength(report).toLocaleString('en-US')+' bytes)');
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS FULL V7 BROWSER BATCH',roles:915,prefixes:5875,displayedHashes:b.hashes.length,sources:freeze.sources,parent:freeze.parent,artifacts:['browser.json','complete.png'].map(p=>({path:p,sha256:sha(fs.readFileSync(root+'/'+p))})),scope:'All915 displayed execution rows and5875 prefix/expected hash pairs match completed native batch qualification. Exact bounded preview and declared full byte count agree. Full download transport, all successor cohorts, language and Campaign4 entry remain unqualified.'},null,2)+'\n',{flag:'wx'});console.log('PASS full915-role browser batch');
}
