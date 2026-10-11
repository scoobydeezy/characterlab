// Extend the preserved baseline-seven-prefix control to all seven frozen trajectories.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/campaign3-embodied-model-rev2',original='docs/planning/embodied-execution-rev3',out='docs/planning/campaign3-history-embodied-reserve-rev1/prefixes.json',freeze=JSON.parse(fs.readFileSync(root+'/FREEZE.json'));
const read=p=>new Uint8Array(Buffer.from(fs.readFileSync(p,'utf8').trim(),'hex')),hash=b=>createHash('sha256').update(b).digest('hex'),ref=path=>({path,sha256:hash(fs.readFileSync(path))});
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'}),rows=[];
try{
 const api=await server.ssrLoadModule('/src/campaign3/embodiedFactory.ts');
 for(const name of ['baseline','hidden89','slower','coarser','denied','unavailable','overflow']){
  const modelName=name==='hidden89'?'baseline':name,source={...freeze.versions,...Object.fromEntries(['content','registry','parameters'].map(k=>[k,read(`${root}/${modelName}/${k}.cenc.hex`)]))},input={initialState:read(`${root}/runs/${name}/initial-state.cenc.hex`),orderedInputs:read(`${root}/runs/${name}/ordered-inputs.cenc.hex`),runSeed:new Uint8Array(32)},model=await api.prepareEmbodiedModel(source),run=await api.createEmbodiedRun(model,input),prefixes=[run.save()];
  assert.deepEqual(run.runIdentity(),read(`${root}/runs/${name}/run-identity.cenc.hex`));while(await run.settleNextInstant())prefixes.push(run.save());assert.equal(prefixes.length,7);
  assert.deepEqual(run.save(),read(`${original}/${name}/final-save.cenc.hex`));
  for(const [index,save] of prefixes.entries()){
   const restored=await api.restoreEmbodiedRun(source,{initialState:input.initialState,orderedInputs:input.orderedInputs,save});assert.deepEqual(restored.save(),save);let successors=0;while(await restored.settleNextInstant())successors++;
   assert.deepEqual(restored.save(),read(`${original}/${name}/final-save.cenc.hex`));assert.deepEqual(restored.snapshot().outputs,read(`${original}/${name}/outputs.cenc.hex`));assert.deepEqual(restored.snapshot().trace,read(`${original}/${name}/trace.cenc.hex`));assert.equal(successors,6-index);
   rows.push({name,index,saveSha256:hash(save),successors,result:'PASS'});
  }
  console.log(name+': seven prefixes and complete remaining tails PASS');
 }
}finally{await server.close();}
assert.equal(rows.length,49);
const result={status:'PASS',rows,prefixes:49,trajectories:7,limits:['Fresh extension: original embodiedFactory test exercises seven prefixes of baseline only. Do not retroactively attribute all49 to the historical receipt.','Six distinct successful model recipes; hidden89 reuses baseline model with distinct initial state. Work7 failure recipe remains covered by rollback test, not this successful cohort.','Full remaining tails, not just one successor; finite frozen trajectories only.'],sources:[root+'/FREEZE.json',original+'/REVIEW.json','src/campaign3/embodiedFactory.ts','src/campaign3/embodiedRuntime.ts','src/test/embodiedFactory.test.ts','scripts/replay-history-embodied-reserve-prefixes.mjs'].map(ref)};
if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
