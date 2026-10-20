import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-batch-browser-rev8',nativeRoot='docs/planning/workbench-batch-parity-rev8',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
if(process.argv.includes('--freeze')){
 assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
 const manifest=read(nativeRoot+'/manifest.json');
 for(const s of manifest.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);assert.equal(sha(fs.readFileSync(nativeRoot+'/sources/'+s.path)),s.sha256);}
 const script='scripts/check-workbench-batch-v8-browser.mjs',bytes=fs.readFileSync(script);
 fs.writeFileSync(root+'/verifier.mjs',bytes,{flag:'wx'});
 fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources:manifest.sources,sourceRoot:nativeRoot+'/sources',manifest:{path:nativeRoot+'/manifest.json',sha256:sha(fs.readFileSync(nativeRoot+'/manifest.json'))},verifier:{path:script,sha256:sha(bytes)},scope:'Full947-role browser execution. Frozen source graph shares exact native pre-execution copies. Final native receipt required for acceptance. DOM diagnostics and bounded preview only; no download transport.'},null,2)+'\n',{flag:'wx'});
 console.log('FROZEN V8 browser sources');
}else{
 const freeze=read(root+'/freeze.json'),native=read(nativeRoot+'/receipt.json'),b=read(root+'/browser.json');
 assert.equal(sha(fs.readFileSync(freeze.manifest.path)),freeze.manifest.sha256);
 assert.equal(sha(fs.readFileSync(freeze.verifier.path)),freeze.verifier.sha256);assert.equal(sha(fs.readFileSync(root+'/verifier.mjs')),freeze.verifier.sha256);
 for(const s of freeze.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(freeze.sourceRoot+'/'+s.path)),s.sha256,s.path);}
 assert.deepEqual(native.sources,freeze.sources);assert.equal(native.status,'PASS SHARED V8 BATCH EXECUTION');
 const snapshot=native.report.snapshot,report=JSON.stringify(native.report,null,2);assert.equal(snapshot.status,'complete');assert.equal(snapshot.results.length,947);
 assert.equal(b.status,'947/947 execution roles complete · 6388 prefixes checked');assert(b.limitCaption.includes('at most 947 execution roles and 33 retained prefixes per program'));
 assert.deepEqual(b.rows,snapshot.results.map(r=>({id:r.job.id,status:r.status,checks:r.prefixes.length+'/'+r.job.expectedSaveHashes.length})));
 assert.deepEqual(b.hashes,snapshot.results.flatMap(r=>r.prefixes.flatMap(p=>[p.saveHash,p.expectedSaveHash])));
 assert.equal(b.preview,report.slice(0,64000));assert.equal(b.downloadLabel,'Download complete JSON ('+Buffer.byteLength(report).toLocaleString('en-US')+' bytes)');
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS FULL V8 BROWSER BATCH',roles:947,prefixes:6388,displayedHashes:b.hashes.length,sourceFreeze:freeze,parent:{path:nativeRoot+'/receipt.json',sha256:sha(fs.readFileSync(nativeRoot+'/receipt.json'))},artifacts:['browser.json','complete.png'].map(p=>({path:p,sha256:sha(fs.readFileSync(root+'/'+p))})),scope:'All947 rows and6388 prefix/expected pairs match complete native batch. Exact bounded preview and declared full byte count agree. File transport, all successor cohorts, language and Campaign4 entry remain separate.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS full947-role browser batch');
}
