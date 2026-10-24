import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-batch-general-browser-rev1',nativeRoot='docs/planning/workbench-batch-general-rev1';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
// Freeze only after the corrected seed renderer is mounted and the original native audit completes.
if(process.argv.includes('--freeze')){
 assert(!fs.existsSync(root));const native=read(nativeRoot+'/receipt.json');
 assert.equal(native.status,'PASS GENERAL V9 BATCH COHORT');
 const changed=['src/workbench/BatchWorkbench.tsx','src/workbench/BatchSeed.tsx'];
 const files=[...new Set([...native.sources.map(s=>s.path),...changed,'scripts/check-workbench-batch-general-browser.mjs'])];
 for(const s of native.sources)if(!changed.includes(s.path))assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 const sources=files.map(path=>{const bytes=fs.readFileSync(path),copy=root+'/sources/'+path;
  fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,bytes,{flag:'wx'});return {path,copy,sha256:sha(bytes)};});
 fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources,native:{path:nativeRoot+'/receipt.json',sha256:sha(fs.readFileSync(nativeRoot+'/receipt.json'))},
  allowedPresentationSuccessor:changed,scope:'All43 General recipes, exact seed display,568 prefix pairs and export preview. Does not qualify full990-role browser execution.'},null,2)+'\n',{flag:'wx'});
 console.log('FROZEN corrected General batch browser source graph');
}else{
 const freeze=read(root+'/freeze.json'),native=read(freeze.native.path),b=read(root+'/browser.json');
 assert.equal(sha(fs.readFileSync(freeze.native.path)),freeze.native.sha256);
 for(const s of freeze.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);}
 const results=native.report.snapshot.results;assert.equal(results.length,43);
 assert.equal(b.status,'43/43 execution roles complete · 568 prefixes checked');
 assert.deepEqual(b.alerts,[]);
 assert.deepEqual(b.rows,results.map(r=>({id:r.job.id,status:r.status,checks:r.prefixes.length+'/'+r.job.expectedSaveHashes.length,seed:r.job.seedHex})));
 assert.deepEqual(b.hashes,results.flatMap(r=>r.prefixes.flatMap(p=>[p.saveHash,p.expectedSaveHash])));
 const report=JSON.stringify(native.report,null,2);
 assert.equal(b.preview,report.slice(0,64000));
 assert.equal(b.downloadLabel,'Download complete JSON ('+Buffer.byteLength(report).toLocaleString('en-US')+' bytes)');
 assert(b.limitCaption.includes('at most 990 execution roles and 33 retained prefixes per program'));
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS GENERAL V9 BROWSER BATCH',roles:43,prefixes:568,displayedHashes:b.hashes.length,freeze,
  artifacts:['browser.json','complete.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),
  scope:'All General execution rows, exact seed and prefix hashes match native batch; export preview and byte declaration exact. Download transport, full990 regression, remaining corpus/successors and Campaign4 entry remain open.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS43 General browser recipes/568 prefixes');
}
