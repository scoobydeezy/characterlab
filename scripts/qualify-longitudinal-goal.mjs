import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gzipSync,gunzipSync} from 'node:zlib';import {Worker,isMainThread,workerData,parentPort} from 'node:worker_threads';import {createServer} from 'vite';
const p='docs/planning/',planFile=p+'LONGITUDINAL_GOAL_PLAN_REV1.json',dir=p+'longitudinal-goal-execution-rev1/',sha=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const prior=JSON.parse(fs.readFileSync(p+'LONGITUDINAL_GOAL_IMPLEMENTATION_CHECK_REV1.json'));
for(const a of prior.artifacts)assert.equal(sha(fs.readFileSync(a.path)),a.sha256,a.path);
const artifacts=[...prior.artifacts,{path:'scripts/qualify-longitudinal-goal.mjs',sha256:sha(fs.readFileSync('scripts/qualify-longitudinal-goal.mjs'))}];
const rowFile=(i,suffix)=>dir+String(i).padStart(3,'0')+'.'+suffix;
async function runtime(){const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});return {server,m:await server.ssrLoadModule('/src/campaign3/longitudinalGoal.ts'),c:await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),codec:await server.ssrLoadModule('/src/campaign3/receivingCodecs.ts')};}
if(isMainThread&&process.argv.includes('--plan')){
 const {server,m,c,codec}=await runtime();try{
  const ids=await server.ssrLoadModule('/src/substrate/identity.ts'),rng=await server.ssrLoadModule('/src/substrate/random.ts'),models=[],runs=[];
  for(const law of m.LAWS)for(const keepEpisodes of law==='FineStanding'?[false,true]:[false]){
   const model=await ids.createModelIdentity({rulesVersion:m.VERSION,contentSchemaVersion:m.VERSION,contentManifest:await ids.commitManifest(c.text(JSON.stringify(artifacts))),parameterSchemaVersion:m.VERSION,parameterSet:await ids.commitManifest(c.text(JSON.stringify({law,keepEpisodes}))),numericProfileVersion:'longitudinal-goal-exact-with-declared-integer-receiver',randomAlgorithmVersion:rng.RANDOM_ALGORITHM_VERSION,registrySchemaVersion:m.VERSION,registryManifest:await ids.commitManifest(c.list([]))});models.push({law,keepEpisodes,id:model});
   for(const mode of ['Maintained','Withdrawn','Replaced'])for(let seed=0;seed<8;seed++){
    const r=await m.createLongitudinalGoalRun(law,mode,seed,keepEpisodes),id=await ids.createRunIdentity({modelIdentity:model,initialState:await ids.commitManifest(codec.decodeReceiving(r.save())),orderedInputSequence:await ids.commitManifest(c.list([c.text(mode),c.bytes(m.originalInputs())])),runSeed:new Uint8Array(32).fill(seed)});
    runs.push({law,keepEpisodes,mode,seed,modelIdentity:hex(model.canonicalBytes),runIdentity:hex(id.canonicalBytes),id});
   }
  }
  assert.equal(models.length,5);assert.equal(runs.length,120);assert.equal(new Set(runs.map(x=>x.runIdentity)).size,120);
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'longitudinal-goal-harness/0.1-candidate'),comparison=await ids.createComparisonCase(models.map(x=>x.id),runs.map(x=>x.id),c.text('All8 seeds x3 goal lifecycles x4 receiver laws under original episode expiry; FineStanding additionally all8 x3 with KeepAll. Every original prefix0..16 restored and immediate successor compared. No trajectory selection. Source saves match across goals/laws. Native source, component receiving owner.'));
  fs.writeFileSync(planFile,JSON.stringify({status:'FROZEN BEFORE QUALIFICATION',artifacts,models:models.map(({id,...x})=>({...x,modelIdentity:hex(id.canonicalBytes)})),runs:runs.map(({id,...x})=>x),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),required:{runs:120,prefixes:2040,advancing:1920,terminal:120}},null,2)+'\n',{flag:'wx'});console.log('Frozen5 models/120 runs/2040 required prefix successors.');
 }finally{await server.close();}
}else{
 const plan=JSON.parse(fs.readFileSync(planFile));assert.deepEqual(plan.artifacts,artifacts);fs.mkdirSync(dir,{recursive:true});const planSha256=sha(fs.readFileSync(planFile));
 if(!isMainThread){
  const {server,m}=await runtime();try{
   for(const [i,row] of plan.runs.entries()){
    if(i%4!==workerData.part)continue;
    const file=rowFile(i,'json');
    if(workerData.phase==='trajectories'){
     if(fs.existsSync(file)){const old=JSON.parse(fs.readFileSync(file));assert.equal(old.planSha256,planSha256);assert.equal(old.runIdentity,row.runIdentity);assert.equal(sha(fs.readFileSync(rowFile(i,'saves.gz'))),old.saveArchiveSha256);continue;}
     const run=await m.createLongitudinalGoalRun(row.law,row.mode,row.seed,row.keepEpisodes),saves=[run.save()],nativeHashes=[sha(run.nativeSave())];while(await run.step()){saves.push(run.save());nativeHashes.push(sha(run.nativeSave()));}
     assert.equal(saves.length,17);const state=run.snapshot();assert.equal(state.prefix,16);assert.equal(state.rows[8].at,14);assert.equal(state.rows[8].episodes===0,!row.keepEpisodes);assert.equal(state.rows[7].standing,state.rows[8].standing);assert(state.rows.slice(8).every(x=>x.choice.chosen!==null));
     const archive=gzipSync(Buffer.from(JSON.stringify(saves.map(x=>Buffer.from(x).toString('base64')))));fs.writeFileSync(rowFile(i,'saves.gz'),archive,{flag:'wx'});
     fs.writeFileSync(file,JSON.stringify({...row,planSha256,prefixHashes:saves.map(sha),nativeHashes,saveArchiveSha256:sha(archive),state},null,2)+'\n',{flag:'wx'});parentPort.postMessage({phase:'trajectory',i});
    }else{
     const original=JSON.parse(fs.readFileSync(file));assert.equal(original.planSha256,planSha256);assert.equal(original.runIdentity,row.runIdentity);const archive=fs.readFileSync(rowFile(i,'saves.gz'));assert.equal(sha(archive),original.saveArchiveSha256);const saves=JSON.parse(gunzipSync(archive)).map(x=>new Uint8Array(Buffer.from(x,'base64')));assert.deepEqual(saves.map(sha),original.prefixHashes);
     for(let prefix=0;prefix<=16;prefix++){
      const receipt=rowFile(i,'prefix'+prefix+'.json');if(fs.existsSync(receipt)){const old=JSON.parse(fs.readFileSync(receipt));assert.deepEqual(old,{planSha256,runIdentity:row.runIdentity,prefix,saveHash:original.prefixHashes[prefix],successorHash:original.prefixHashes[Math.min(prefix+1,16)],advanced:prefix<16});continue;}
      const r=await m.restoreLongitudinalGoalRun(row.law,row.mode,row.seed,row.keepEpisodes,prefix,saves[prefix]);assert.deepEqual(r.save(),saves[prefix]);assert.equal(await r.step(),prefix<16);assert.deepEqual(r.save(),saves[Math.min(prefix+1,16)]);
      fs.writeFileSync(receipt,JSON.stringify({planSha256,runIdentity:row.runIdentity,prefix,saveHash:original.prefixHashes[prefix],successorHash:original.prefixHashes[Math.min(prefix+1,16)],advanced:prefix<16})+'\n',{flag:'wx'});parentPort.postMessage({phase:'prefix',i,prefix});
     }
    }
   }
  }finally{await server.close();}
 }else{
  const phase=process.argv.includes('--replay')?'replay':'trajectories';let completed=0;
  await Promise.all(Array.from({length:4},(_,part)=>new Promise((resolve,reject)=>{const worker=new Worker(new URL(import.meta.url),{workerData:{part,phase}});worker.on('message',v=>{completed++;console.log(JSON.stringify({...v,completed}));});worker.on('error',reject);worker.on('exit',code=>code?reject(Error('worker '+part+' exit '+code)):resolve());})));
  console.log('Completed '+phase+'; existing verified receipts reused, new receipts='+completed+'.');
 }
}
