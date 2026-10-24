import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-batch-browser-rev10',nativeRoot='docs/planning/workbench-batch-parity-rev10';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
if(process.argv.includes('--freeze')){
 assert(!fs.existsSync(root));const manifest=read(nativeRoot+'/manifest.json');
 for(const s of manifest.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);}
 const build='C:/Users/scoob/AppData/Local/Temp/characterlab-workbench-662',assets=[];
 function visit(relative=''){for(const entry of fs.readdirSync(path.join(build,relative),{withFileTypes:true})){
  const name=path.join(relative,entry.name);if(entry.isDirectory())visit(name);else{const served=path.join(build,name),bytes=fs.readFileSync(served),copy=path.join(root,'assets',name);fs.mkdirSync(path.dirname(copy),{recursive:true});fs.writeFileSync(copy,bytes,{flag:'wx'});assets.push({served,copy,sha256:sha(bytes)});}
 }}visit();assert(assets.some(a=>a.served.endsWith('index.html')));
 const verifier='scripts/check-workbench-batch-v10-browser.mjs',bytes=fs.readFileSync(verifier);fs.writeFileSync(root+'/verifier.mjs',bytes,{flag:'wx'});
 fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources:manifest.sources,assets,verifierSha256:sha(bytes),nativeManifest:{path:nativeRoot+'/manifest.json',sha256:sha(fs.readFileSync(nativeRoot+'/manifest.json'))},currentSourceHold:false,
 scope:'Full1068-role V10 browser execution against immutable served/copied assets and frozen native source copies. Native completion required for acceptance. Current checkout may advance.'},null,2)+'\n',{flag:'wx'});
 console.log('FROZEN V10 browser source/build identity');
}else{
 const freeze=read(root+'/freeze.json'),native=read(nativeRoot+'/receipt.json'),b=read(root+'/browser.json');
 assert.equal(sha(fs.readFileSync(freeze.nativeManifest.path)),freeze.nativeManifest.sha256);
 assert.equal(sha(fs.readFileSync(root+'/verifier.mjs')),freeze.verifierSha256);
 for(const s of freeze.sources)assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);
 for(const a of freeze.assets){assert.equal(sha(fs.readFileSync(a.served)),a.sha256,a.served);assert.equal(sha(fs.readFileSync(a.copy)),a.sha256,a.copy);}
 assert.equal(native.status,'PASS FULL V10 NATIVE BATCH');assert.deepEqual(native.sources,freeze.sources);
 const results=native.report.snapshot.results;assert.equal(results.length,1068);
 assert.equal(b.status,'1068/1068 execution roles complete · 7284 prefixes checked');assert.deepEqual(b.alerts,[]);
 assert.deepEqual(b.rows,results.map(r=>({id:r.job.id,status:r.status,checks:r.prefixes.length+'/'+r.job.expectedSaveHashes.length,seed:r.job.seedHex??String(r.job.seed)})));
 assert.deepEqual(b.hashes,results.flatMap(r=>r.prefixes.flatMap(p=>[p.saveHash,p.expectedSaveHash])));
 const report=JSON.stringify(native.report,null,2);assert.equal(b.preview,report.slice(0,64000));
 assert.equal(b.downloadLabel,'Download complete JSON ('+Buffer.byteLength(report).toLocaleString('en-US')+' bytes)');
 assert(b.limitCaption.includes('at most 1068 execution roles and 33 retained prefixes per program'));
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS FULL V10 BROWSER BATCH',roles:1068,prefixes:7284,displayedHashes:b.hashes.length,freeze,
 artifacts:['browser.json','complete.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),
 scope:'Full registered1068-role batch, exact seed displays,7284 native prefix commitments,report preview and byte declaration. Download transport, remaining corpus/component successors,language and Campaign4 entry remain separate.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS full1068-role browser batch');
}
