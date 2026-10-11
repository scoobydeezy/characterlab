import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'SLEEP_CONTROL_PLAN_REV1.json',sha=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex'),bytes=s=>new Uint8Array(Buffer.from(s,'hex')),read=f=>JSON.parse(fs.readFileSync(f)),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const O='docs/planning/campaign3-history-perturbation-control-rev1/';fs.mkdirSync(O,{recursive:true});const checks=[];
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const fx=await server.ssrLoadModule('/src/test/sleepControlFixtures.ts'),analysis=await server.ssrLoadModule('/src/test/sleepControlAnalysis.ts'),m=await server.ssrLoadModule('/src/campaign3/identityPublicModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/identityPublicFactory.ts'),native=await server.ssrLoadModule('/src/test/identityPublicFixtures.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');

  const plan=read(planPath);for(const a of plan.artifacts)assert.equal(sha(fs.readFileSync(a.path)),a.sha256,a.path);
  const part=Number(process.argv.find(x=>x.startsWith('--part='))?.split('=')[1]??0);assert([0,1].includes(part));
  for(const row of plan.runs.filter(r=>r.index%2===part)){
   const out=p+'SLEEP_CONTROL_RUN_'+row.index+'_REV1.json';assert(fs.existsSync(out));
   try{
    const model=plan.models[row.model],source={parameters:bytes(model.source.parameters),registry:bytes(model.source.registry)},input={initialState:bytes(row.initialState),orderedInputs:bytes(row.orderedInputs),runSeed:new Uint8Array(32).fill(row.seed)},run=await factory.createIdentityPublicRun(await factory.prepareIdentityModel(source),input);
    assert.equal(hex(run.modelIdentity()),model.modelIdentity);assert.equal(hex(run.runIdentity()),row.runIdentity);
    const wanted=new Set(row.prefixes.flatMap(i=>[i,Math.min(i+1,12)])),saves=new Map([[0,run.save()]]);let count=0;while(await run.settleNextInstant()){count++;if(wanted.has(count))saves.set(count,run.save());}assert.equal(count,12);
    const prefixes=[];for(const at of row.prefixes){const saved=saves.get(at),r=await factory.restoreIdentityPublicRun(source,{initialState:input.initialState,orderedInputs:input.orderedInputs,save:saved});assert.deepEqual(r.save(),saved);assert.equal(await r.settleNextInstant(),at<12);assert.deepEqual(r.save(),saves.get(Math.min(at+1,12)));prefixes.push({at,saveSha256:sha(saved),nextSha256:sha(r.save()),bytes:saved.length});}
    const semantic=analysis.sleepSummary(native.nativeOutputs(run));const actual={status:'PASS',planSha256:sha(fs.readFileSync(planPath)),index:row.index,scenario:row.scenario,law:row.law,seed:row.seed,modelIdentity:model.modelIdentity,runIdentity:row.runIdentity,prefixes,observerSha256:sha(run.observerView()),stateSha256:sha(run.snapshot().state),semantic};assert.deepEqual(actual,read(out));checks.push({index:row.index,prefixes:prefixes.length,resultSha256:sha(fs.readFileSync(out))});console.log('PASS '+row.index+' '+row.scenario+'/'+row.law+'/'+row.seed+' '+prefixes.length+' prefixes');
   }catch(e){write(O+'sleep-failure_'+row.index+'_'+Date.now()+'.json',{status:'FAIL',index:row.index,planSha256:sha(fs.readFileSync(planPath)),error:String(e)});throw e;}
  }

 const receipt={status:'PASS',scope:'Fresh native execution and selected original-prefix restores, one successor per prefix; original whole result equality.',family:'sleep',part,cases:checks.length,prefixes:checks.reduce((n,r)=>n+r.prefixes,0),checks,checkerSha256:sha(fs.readFileSync('scripts/replay-history-sleep-control.mjs'))};const target=O+'sleep-part'+part+'.json';if(fs.existsSync(target))assert.deepEqual(read(target),receipt);else write(target,receipt);
}finally{await server.close();}
