import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-paged-choices-ui-rev1',script='scripts/check-workbench-disposition-paged-choices-ui.mjs',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
for(const s of read(root+'/freeze.json').sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
if(process.argv.includes('--oracle')){
 fs.writeFileSync(root+'/verifier.mjs',fs.readFileSync(script),{flag:'wx'});const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
 try{const {DispositionPagedPair:Pair}=await server.ssrLoadModule('/src/workbench/dispositionPagedPair.ts'),stages=[],prior='docs/planning/workbench-disposition-choice-rev2',bytes=fs.readFileSync(prior+'/reports.json.gz');assert.equal(sha(bytes),read(prior+'/receipt.json').artifact.sha256);const original=JSON.parse(gunzipSync(bytes));
  for(const id of ['model/0/13','input/Seed0']){const pair=await Pair.create(id);await pair.advance();const v=pair.summary();assert.deepEqual(v.choices,original.find(r=>r.comparison===id&&r.a.prefix===1));stages.push({choices:v.choices,reports:['a','b'].map(b=>pair.diagnostic(b,v[b].saveHash,{kind:'eventState',eventId:'19'})),hashes:['a','b'].flatMap(b=>['modelHash','runHash','stateHash','saveHash','projectionHash'].map(k=>v[b][k]))});}
  fs.writeFileSync(root+'/oracle.json',JSON.stringify({stages},null,2)+'\n',{flag:'wx'});console.log('PASS paged choices oracle and retained-original parity');
 }finally{await server.close();}
}else{
 const o=read(root+'/oracle.json'),b=read(root+'/browser.json');assert.equal(b.stages.length,2);assert.equal(sha(fs.readFileSync(script)),sha(fs.readFileSync(root+'/verifier.mjs')));
 for(const [i,c]of b.stages.entries()){assert.deepEqual(JSON.parse(c.choices),o.stages[i].choices);assert.deepEqual(c.hashes,o.stages[i].hashes);assert.deepEqual(c.alerts,[]);}
 for(const c of b.links){assert.equal(c.mode,'Timeline');assert.deepEqual(JSON.parse(c.report),o.stages[c.stage].reports[c.branch==='a'?0:1]);assert.deepEqual(c.hashes,o.stages[c.stage].hashes);}
 assert.deepEqual(b.links.map(c=>c.branch),['b','a']);assert(b.links.every(c=>c.stage===1));assert.deepEqual(b.restored,b.stages[0]);assert.equal(o.stages[1].choices.firstDifference.outcome,'different choice');
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED PAGED CHOICE BROWSER',scope:'Constitution and Seed0 pairs at1/1 agree with native and retained original choices; Seed0 first recorded difference and both branch-owned decision links preserve identities; prior pair checkpoint restoration. No full-horizon, successful-execution, player-knowledge or general causal-significance claim.',artifacts:['oracle.json','browser.json','choices.png','verifier.mjs'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))}))},null,2)+'\n',{flag:'wx'});console.log('PASS bounded paged recorded choices');
}
