import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-paged-history-ui-rev1',script='scripts/check-workbench-disposition-paged-history-ui.mjs',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
for(const s of read(root+'/freeze.json').sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
if(process.argv.includes('--oracle')){
 fs.writeFileSync(root+'/verifier.mjs',fs.readFileSync(script),{flag:'wx'});const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
 try{const {DispositionPagedPair:Pair}=await server.ssrLoadModule('/src/workbench/dispositionPagedPair.ts'),stages=[];
  for(const id of ['model/0/13','model/0/2']){const pair=await Pair.create(id);await pair.advance();const v=pair.summary();stages.push({history:v.history,hashes:['a','b'].flatMap(b=>['modelHash','runHash','stateHash','saveHash','projectionHash'].map(k=>v[b][k]))});}
  fs.writeFileSync(root+'/oracle.json',JSON.stringify({stages},null,2)+'\n',{flag:'wx'});console.log('PASS compact history browser oracle');
 }finally{await server.close();}
}else{
 const o=read(root+'/oracle.json'),b=read(root+'/browser.json');assert.equal(b.stages.length,2);assert.equal(sha(fs.readFileSync(script)),sha(fs.readFileSync(root+'/verifier.mjs')));
 for(const [i,c]of b.stages.entries()){assert.deepEqual(JSON.parse(c.history),o.stages[i].history);assert.deepEqual(c.hashes,o.stages[i].hashes);assert.deepEqual(c.alerts,[]);const expected=['a','b'].flatMap(branch=>o.stages[i].history[branch].rows.map(r=>[branch.toUpperCase(),String(r.prefix),r.constitution.exact,r.plastic?.exact??'No stored leaf (Refold)']));assert.deepEqual(c.cells,expected);}
 assert.deepEqual(b.restored,b.stages[0]);assert.equal(b.refoldPlasticPoints,2);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED PAGED HISTORY BROWSER',scope:'Constitution pair and Refold contrast at1/1; exact native compact history/table/ten identities, two A plastic points and no invented B Refold points, recreation and paired checkpoint restore. Does not qualify full horizon, latent-state visualization or complete integrated entry.',artifacts:['oracle.json','browser.json','history.png','verifier.mjs'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))}))},null,2)+'\n',{flag:'wx'});console.log('PASS bounded paged stored history');
}
