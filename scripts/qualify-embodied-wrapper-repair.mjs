import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/public-wrapper-quiescence-rev1',frozen='docs/planning/campaign3-embodied-model-rev2',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),bytes=p=>new Uint8Array(Buffer.from(fs.readFileSync(p,'utf8').trim(),'hex'));
const files=['src/campaign3/embodiedRuntime.ts','src/campaign3/scheduledWrapperQuiescence.ts','src/campaign3/publicWrapperQuiescence.ts','src/test/embodiedWrapperQuiescence.test.ts','scripts/qualify-embodied-wrapper-repair.mjs'];
const planPath=root+'/EMBODIED_REPAIR_PLAN.json';
if(process.argv.includes('--freeze')){fs.writeFileSync(planPath,JSON.stringify({scope:'Same seven frozen public embodied cases; all complete prefixes against preserved runtime and original final bytes',artifacts:files.map(path=>({path,sha256:sha(fs.readFileSync(path))}))},null,2)+'\n',{flag:'wx'});}else{
 for(const a of read(planPath).artifacts)assert.equal(sha(fs.readFileSync(a.path)),a.sha256);
 const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
 try{
  const api=await server.ssrLoadModule('/src/campaign3/embodiedFactory.ts'),old=await server.ssrLoadModule('/'+root+'/src/campaign3/embodiedFactory.ts'),freeze=read(frozen+'/FREEZE.json'),rows=[];
  for(const name of ['baseline','hidden89','slower','coarser','denied','unavailable','overflow']){
   const modelName=name==='hidden89'?'baseline':name,source={...freeze.versions,...Object.fromEntries(['content','registry','parameters'].map(k=>[k,bytes(frozen+'/'+modelName+'/'+k+'.cenc.hex')]))},initialState=bytes(frozen+'/runs/'+name+'/initial-state.cenc.hex'),orderedInputs=bytes(frozen+'/runs/'+name+'/ordered-inputs.cenc.hex'),input={initialState,orderedInputs,runSeed:new Uint8Array(32)},run=await api.createEmbodiedRun(await api.prepareEmbodiedModel(source),input),prior=await old.createEmbodiedRun(await old.prepareEmbodiedModel(source),input),saves=[run.save()];
   assert.deepEqual(run.runIdentity(),bytes(frozen+'/runs/'+name+'/run-identity.cenc.hex'));assert.deepEqual(run.save(),prior.save());
   while(await run.settleNextInstant()){assert(await prior.settleNextInstant());assert.deepEqual(run.save(),prior.save());saves.push(run.save());}assert.equal(await prior.settleNextInstant(),false);
   const prefixes=[];for(const [at,save]of saves.entries()){const restored=await api.restoreEmbodiedRun(source,{initialState,orderedInputs,save});assert.deepEqual(restored.save(),save);assert.equal(await restored.settleNextInstant(),at<saves.length-1);assert.deepEqual(restored.save(),saves[Math.min(at+1,saves.length-1)]);prefixes.push({at,sha256:sha(save),nextSha256:sha(restored.save())});}
   for(const [suffix,data]of [['outputs',run.snapshot().outputs],['trace',run.snapshot().trace],['final-save',run.save()]])assert.deepEqual(data,bytes('docs/planning/embodied-execution-rev3/'+name+'/'+suffix+'.cenc.hex'));
   rows.push({name,prefixes,runIdentitySha256:sha(run.runIdentity())});console.log(name+': '+prefixes.length+' identical prefixes');
  }
  fs.writeFileSync(root+'/EMBODIED_REPAIR_RESULT.json',JSON.stringify({status:'PASS',rows,planSha256:sha(fs.readFileSync(planPath))},null,2)+'\n',{flag:'wx'});
 }finally{await server.close();}
}
