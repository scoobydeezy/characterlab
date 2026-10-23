import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-paged-pair-modes-rev1',script='scripts/check-workbench-disposition-paged-pair-modes.mjs',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const freeze=read(root+'/freeze.json');for(const s of freeze.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
if(process.argv.includes('--oracle')){
 fs.writeFileSync(root+'/verifier.mjs',fs.readFileSync(script),{flag:'wx'});const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
 try{const {DispositionPagedPair:Pair}=await server.ssrLoadModule('/src/workbench/dispositionPagedPair.ts'),pair=await Pair.create('model/0/13');await pair.advance();const view=pair.summary(),reports={};
  for(const branch of ['a','b']){reports[branch]={};for(const selection of [{kind:'storedState'},{kind:'reasons',eventId:'18'},{kind:'resolution',eventId:'18'},{kind:'architecture'},{kind:'eventState',eventId:'19'}])reports[branch][selection.kind]=pair.diagnostic(branch,view[branch].saveHash,selection);}
  fs.writeFileSync(root+'/oracle.json',JSON.stringify({comparison:view.comparison,hashes:['a','b'].flatMap(b=>['modelHash','runHash','stateHash','saveHash','projectionHash'].map(k=>view[b][k])),reports},null,2)+'\n',{flag:'wx'});console.log('PASS six-mode native oracle');
 }finally{await server.close();}
}else{
 assert.equal(sha(fs.readFileSync(root+'/verifier.mjs')),sha(fs.readFileSync(script)));const o=read(root+'/oracle.json'),b=read(root+'/browser.json');
 assert.deepEqual(b.modes,['Character','Experiment','Reasoning','Timeline','Compare','Architecture']);assert(b.draftDidNotMutate);assert(b.branchCleared);assert(b.historyRetained);
 for(const c of b.reports){assert.deepEqual(JSON.parse(c.envelope),o.reports[c.branch][c.kind]);assert.deepEqual(c.hashes,o.hashes);assert.deepEqual(c.alerts,[]);}
 assert.deepEqual(new Set(b.reports.map(c=>c.branch+':'+c.kind)),new Set(['a:storedState','b:storedState','b:reasons','b:resolution','b:eventState','b:architecture']));
 assert.deepEqual(JSON.parse(b.comparison),o.comparison);assert.equal(b.eventLinkMode,'Timeline');assert.equal(b.restoredMode,'Reasoning');assert.equal(b.historyEnvelope,b.reports.find(c=>c.kind==='resolution').envelope);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED SIX-MODE PAIR ROUTING',scope:'One declared constitution pair at1/1; same ten identities across all six modes, both branch state reports, reasons/resolution/event link/architecture, retained mode report and non-mutating draft. Does not qualify full-horizon behavior, all mode transitions, player language, latent-state views, summary export or integrated entry.',artifacts:['browser.json','oracle.json','modes.png','verifier.mjs'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))}))},null,2)+'\n',{flag:'wx'});console.log('PASS bounded six-mode routing');
}
