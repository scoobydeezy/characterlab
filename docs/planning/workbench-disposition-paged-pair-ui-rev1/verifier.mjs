import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-paged-pair-ui-rev1',script='scripts/check-workbench-disposition-paged-pair-ui.mjs',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const freeze=read(root+'/freeze.json');for(const s of freeze.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
if(process.argv.includes('--oracle')){
 fs.writeFileSync(root+'/verifier.mjs',fs.readFileSync(script),{flag:'wx'});const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
 try{const {DispositionPagedPair:Pair}=await server.ssrLoadModule('/src/workbench/dispositionPagedPair.ts'),pair=await Pair.create('model/0/13'),stages=[];
  for(const action of [null,'a','b','both']){if(action)await pair.advance(action);const v=pair.summary(),reports=['a','b'].map(b=>pair.diagnostic(b,v[b].saveHash,{kind:'storedState'})),source=v.comparison.fields.find(f=>f.root==='1457')?.bSource;
   stages.push({comparison:v.comparison,reports,page:source?pair.textPage('b',source.saveHash,source.selector):null,hashes:['a','b'].flatMap(b=>['modelHash','runHash','stateHash','saveHash','projectionHash'].map(k=>v[b][k]))});
  }
  fs.writeFileSync(root+'/oracle.json',JSON.stringify({stages},null,2)+'\n',{flag:'wx'});console.log('PASS paired browser oracle 0/0,1/0,1/1,2/2');
 }finally{await server.close();}
}else{
 assert.equal(sha(fs.readFileSync(root+'/verifier.mjs')),sha(fs.readFileSync(script)));const o=read(root+'/oracle.json'),b=read(root+'/browser.json');
 for(const [i,c]of b.stages.entries()){assert.deepEqual(JSON.parse(c.comparison),o.stages[i].comparison);assert.deepEqual(c.hashes,o.stages[i].hashes);assert.deepEqual(c.alerts,[]);}
 assert.equal(b.stages.length,4);assert(b.unequalBothDisabled);assert(b.branchSwitchCleared);assert(b.staleNextDisabled);assert(b.restoredNextEnabled);
 for(const [i,c]of b.reports.entries())assert.deepEqual(JSON.parse(c),o.stages[2].reports[i]);
 assert.equal(b.page.text,o.stages[2].page.text);assert.equal(b.page.revision,o.stages[2].page.saveHash);assert.deepEqual(JSON.parse(b.page.selection),o.stages[2].page.selector);
 assert.deepEqual(b.restored,b.stages[2]);assert.equal(b.retainedDiagnostic,b.reports[1]);assert.equal(b.restoredDiagnostic,b.reports[1]);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED PAIRED UI',scope:'Actual worker creation, unequal alignment, individual/joint advancement, branch diagnostics and source identity, paired checkpoint restoration and stale-page guards. Constitution contrast only, prefixes0..2. Run/pause, full horizon, all30 contrasts, accessibility and integrated six-mode entry remain unqualified.',artifacts:['browser.json','oracle.json','pair.png','verifier.mjs'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))}))},null,2)+'\n',{flag:'wx'});console.log('PASS bounded paired browser');
}
