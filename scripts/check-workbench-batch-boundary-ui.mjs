import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-batch-boundary-ui-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
if(process.argv.includes('--freeze')){
 assert(!fs.existsSync(root));const baseline=read('docs/planning/workbench-batch-persistence-shared-rev1/receipt.json');
 const changed=['src/workbench/BatchWorkbench.tsx','src/workbench/batchSession.ts'];
 for(const s of baseline.sources){assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);if(!changed.includes(s.path))assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);}
 const sources=[...changed,'src/workbench/batchExecutionBoundary.ts','src/workbench/BatchExecutionBoundaryCell.tsx','src/test/workbenchBatchBoundarySession.test.ts','scripts/check-workbench-batch-boundary-ui.mjs'].map(p=>{
  const b=fs.readFileSync(p),copy=root+'/sources/'+p;fs.mkdirSync(path.dirname(copy),{recursive:true});fs.writeFileSync(copy,b,{flag:'wx'});return {path:p,copy,sha256:sha(b)};
 });
 const build='C:/Users/scoob/AppData/Local/Temp/characterlab-workbench-664',assets=[];
 function visit(relative=''){for(const entry of fs.readdirSync(path.join(build,relative),{withFileTypes:true})){
  const name=path.join(relative,entry.name);if(entry.isDirectory())visit(name);else{const served=path.join(build,name),b=fs.readFileSync(served),copy=path.join(root,'assets',name);fs.mkdirSync(path.dirname(copy),{recursive:true});fs.writeFileSync(copy,b,{flag:'wx'});assets.push({served,copy,sha256:sha(b)});}
 }}visit();assert(assets.some(a=>a.served.endsWith('index.html')));
 const prior='docs/planning/workbench-batch-persistence-browser-rev1/adapt.json';
 fs.writeFileSync(root+'/freeze.json',JSON.stringify({baselineSources:baseline.sources,sources,assets,prior:{path:prior,sha256:sha(fs.readFileSync(prior))},currentSourceHold:false},null,2)+'\n',{flag:'wx'});
 console.log('FROZEN shared boundary UI build664');
}else{
 const freeze=read(root+'/freeze.json');for(const s of [...freeze.baselineSources,...freeze.sources])assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);
 for(const a of freeze.assets){assert.equal(sha(fs.readFileSync(a.served)),a.sha256,a.served);assert.equal(sha(fs.readFileSync(a.copy)),a.sha256,a.copy);}
 assert.equal(sha(fs.readFileSync(freeze.prior.path)),freeze.prior.sha256);const prior=read(freeze.prior.path),b=read(root+'/browser.json');
 assert.equal(b.status,prior.status);assert.deepEqual(b.alerts,[]);assert.deepEqual(b.hashes,prior.hashes);assert.equal(b.preview,prior.preview);assert.equal(b.downloadLabel,prior.downloadLabel);
 assert.deepEqual(b.headings,['Program','Execution boundary','Law / seed','Status','Prefix checks','Exact evidence']);
 assert.deepEqual(b.rows,prior.rows.map(r=>({...r,kind:'public-run',label:'Public run',step:'One complete native instant. Native scheduler clock.',qualification:'The named public run contract and original program determine execution.'})));
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED SHARED BOUNDARY UI',roles:2,prefixes:8,displayedHashes:b.hashes.length,freeze,
  artifacts:['browser.json','browser.png'].map(p=>({path:p,sha256:sha(fs.readFileSync(root+'/'+p))})),
  scope:'Existing ADAPT parent pair through built worker: both public-run boundary cells,seed/status/hash columns and unchanged report preview/size match accepted browser evidence. BIO/SEM labels and clocks have prepared unit coverage only; their shared admission remains gated by full native audit. No full batch,download or entry acceptance.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS boundary UI2 roles/8 prefixes/16 hash strings');
}
