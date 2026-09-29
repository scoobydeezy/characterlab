import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'INTOXICATION_CONTROL_PLAN_REV1.json',sha=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex'),bytes=s=>new Uint8Array(Buffer.from(s,'hex')),read=f=>JSON.parse(fs.readFileSync(f)),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const fx=await server.ssrLoadModule('/src/test/intoxicationControlFixtures.ts'),analysis=await server.ssrLoadModule('/src/test/sleepControlAnalysis.ts'),m=await server.ssrLoadModule('/src/campaign3/identityPublicModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/identityPublicFactory.ts'),native=await server.ssrLoadModule('/src/test/identityPublicFixtures.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 if(process.argv.includes('--freeze')){
  const graph=new Set();function visit(file){file=file.replaceAll('\\','/');if(graph.has(file))return;graph.add(file);if(!file.endsWith('.ts'))return;for(const match of fs.readFileSync(file,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const base=path.resolve(path.dirname(file),match[1].split('?')[0]),found=[base,base+'.ts',base+'.json',path.join(base,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(found);visit(path.relative(process.cwd(),found));}}
  ['src/test/intoxicationControlFixtures.ts','src/test/sleepControlAnalysis.ts','src/test/intoxicationControl.test.ts','src/test/identityPublicFixtures.ts','src/campaign3/identityPublicFactory.ts','src/substrate/identity.ts'].forEach(visit);
  for(const f of ['docs/formal/INTOXICATION_CONTROL_EXPERIMENT_CONTRACT.md','scripts/qualify-intoxication-control.mjs','scripts/check-intoxication-control.mjs'])graph.add(f);
  const roster=[];for(let seed=0;seed<4;seed++)for(const scenario of ['Sober','Slow','Fast'])roster.push({scenario,law:'Full',seed});
  for(const scenario of ['BlindSober','BlindSlow','FalseSober','Interference'])roster.push({scenario,law:'Full',seed:0});
  roster.push({scenario:'HighCompetence',law:'Full',seed:1});
  for(const scenario of ['Sober','Slow','Fast'])roster.push({scenario,law:'NoControl',seed:0});
  const models=[],runs=[],compiled=new Map(),runObjects=[];
  for(const [index,row]of roster.entries()){
   const c=fx.intoxicationCase(row.scenario,row.law,row.seed),signature=sha(Buffer.concat([c.source.parameters,c.source.registry]));let e=compiled.get(signature);
   if(!e){e={model:await m.compileIdentityModel(c.source),index:models.length};compiled.set(signature,e);models.push({law:row.law,source:{parameters:hex(c.source.parameters),registry:hex(c.source.registry)},modelIdentity:hex(e.model.modelIdentity.canonicalBytes)});}
   const input=await m.compileIdentityInputs(e.model,c.initialState,c.orderedInputs,c.runSeed);runObjects.push(input.runIdentity);runs.push({...row,index,model:e.index,initialState:hex(c.initialState),orderedInputs:hex(c.orderedInputs),runIdentity:hex(input.runIdentity.canonicalBytes),prefixes:index<3?[0,2,7,8,10,11,12]:[0,12]});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0','intoxication-control-experiment/0.1-candidate','intoxication-control-harness/0.1'),comparison=await ids.createComparisonCase(runs.map(r=>[...compiled.values()].find(e=>e.index===r.model).model.modelIdentity),runObjects,canonical.text('Fixed20-run intoxication/clearance/control/execution roster. Full seeds0..3 sober/slow/fast; seed0 masked/biased sensing and interference; high competence seed1; NoControl triplet. Selected55 native prefixes; no outcome selection.'));
  write(planPath,{status:'FROZEN BEFORE QUALIFICATION',version:'intoxication-control-experiment/0.1-candidate',nativeVersion:m.VERSION,artifacts:[...graph].sort().map(path=>({path,sha256:sha(fs.readFileSync(path))})),models,runs,experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),prefixes:runs.reduce((n,r)=>n+r.prefixes.length,0)});console.log('FROZEN 5 models/20 runs/55 prefixes');
 }else{
  const plan=read(planPath);for(const a of plan.artifacts)assert.equal(sha(fs.readFileSync(a.path)),a.sha256,a.path);
  const part=Number(process.argv.find(x=>x.startsWith('--part='))?.split('=')[1]??0);assert([0,1].includes(part));
  for(const row of plan.runs.filter(r=>r.index%2===part)){
   const out=p+'INTOXICATION_CONTROL_RUN_'+row.index+'_REV1.json';if(fs.existsSync(out)){const old=read(out);assert.equal(old.status,'PASS');assert.equal(old.planSha256,sha(fs.readFileSync(planPath)));assert.equal(old.runIdentity,row.runIdentity);console.log('verified completed '+row.index);continue;}
   try{
    const model=plan.models[row.model],source={parameters:bytes(model.source.parameters),registry:bytes(model.source.registry)},input={initialState:bytes(row.initialState),orderedInputs:bytes(row.orderedInputs),runSeed:new Uint8Array(32).fill(row.seed)},run=await factory.createIdentityPublicRun(await factory.prepareIdentityModel(source),input);
    assert.equal(hex(run.modelIdentity()),model.modelIdentity);assert.equal(hex(run.runIdentity()),row.runIdentity);
    const wanted=new Set(row.prefixes.flatMap(i=>[i,Math.min(i+1,12)])),saves=new Map([[0,run.save()]]);let count=0;while(await run.settleNextInstant()){count++;if(wanted.has(count))saves.set(count,run.save());}assert.equal(count,12);
    const prefixes=[];for(const at of row.prefixes){const saved=saves.get(at),r=await factory.restoreIdentityPublicRun(source,{initialState:input.initialState,orderedInputs:input.orderedInputs,save:saved});assert.deepEqual(r.save(),saved);assert.equal(await r.settleNextInstant(),at<12);assert.deepEqual(r.save(),saves.get(Math.min(at+1,12)));prefixes.push({at,saveSha256:sha(saved),nextSha256:sha(r.save()),bytes:saved.length});}
    const semantic=analysis.sleepSummary(native.nativeOutputs(run));write(out,{status:'PASS',planSha256:sha(fs.readFileSync(planPath)),index:row.index,scenario:row.scenario,law:row.law,seed:row.seed,modelIdentity:model.modelIdentity,runIdentity:row.runIdentity,prefixes,observerSha256:sha(run.observerView()),stateSha256:sha(run.snapshot().state),semantic});console.log('PASS '+row.index+' '+row.scenario+'/'+row.law+'/'+row.seed+' '+prefixes.length+' prefixes');
   }catch(e){write(p+'INTOXICATION_CONTROL_FAILURE_'+row.index+'_'+Date.now()+'.json',{status:'FAIL',index:row.index,planSha256:sha(fs.readFileSync(planPath)),error:String(e)});throw e;}
  }
 }
}finally{await server.close();}
