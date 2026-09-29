import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'EMBARRASSMENT_PLAN_REV1.json',sha=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex'),read=f=>JSON.parse(fs.readFileSync(f)),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/embarrassment.ts'),fx=await server.ssrLoadModule('/src/test/embarrassmentFixtures.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),rng=await server.ssrLoadModule('/src/substrate/random.ts');
 const graph=new Set();function visit(file){file=file.replaceAll('\\','/');if(graph.has(file))return;graph.add(file);if(!file.endsWith('.ts'))return;for(const match of fs.readFileSync(file,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const base=path.resolve(path.dirname(file),match[1].split('?')[0]),found=[base,base+'.ts',base+'.json',path.join(base,'index.ts')].find(f=>fs.existsSync(f)&&fs.statSync(f).isFile());assert(found);visit(path.relative(process.cwd(),found));}}
 ['src/campaign3/embarrassment.ts','src/test/embarrassmentFixtures.ts','src/test/embarrassment.test.ts','src/substrate/identity.ts'].forEach(visit);
 ['docs/formal/EMBARRASSMENT_CONTRACT.md','scripts/qualify-embarrassment.mjs','scripts/check-embarrassment.mjs'].forEach(x=>graph.add(x));
 const artifacts=[...graph].sort().map(path=>({path,sha256:sha(fs.readFileSync(path))})),models=[];
 for(const [law,projection]of [...m.LAWS.map(law=>[law,2]),['Contextual',3]]){const identity=await ids.createModelIdentity({rulesVersion:m.VERSION,contentSchemaVersion:m.VERSION,contentManifest:await ids.commitManifest(c.list([m.embarrassmentContent(law),c.text(JSON.stringify(artifacts))])),parameterSchemaVersion:m.VERSION,parameterSet:await ids.commitManifest(c.list([c.text(law),c.unsigned(projection)])),numericProfileVersion:'exact-rational/embarrassment',randomAlgorithmVersion:rng.RANDOM_ALGORITHM_VERSION,registrySchemaVersion:m.VERSION,registryManifest:await ids.commitManifest(c.list([]))});models.push({law,projection,identity,modelIdentity:hex(identity.canonicalBytes)});}
 const roster=[];for(let seed=0;seed<8;seed++)for(const law of m.LAWS)roster.push({scenario:'Balanced',law,seed,projection:2});
 for(const scenario of fx.SCENARIOS.filter(s=>!['Balanced','FalseReport','DeniedUnchanged'].includes(s)))roster.push({scenario,law:'Contextual',seed:0,projection:2});
 for(let seed=1;seed<8;seed++)roster.push({scenario:'AvoidOnly',law:'Contextual',seed,projection:2});
 for(const scenario of ['NoMismatch','Unseen'])roster.push({scenario,law:'JudgmentOnly',seed:0,projection:2});
 for(const scenario of ['Mixed','Correction'])roster.push({scenario,law:'Latest',seed:0,projection:2});
 roster.push({scenario:'Balanced',law:'Contextual',seed:0,projection:3});
 const runs=[];for(const [index,row]of roster.entries()){const input=fx.embarrassmentFrames(row.scenario),model=models.find(m=>m.law===row.law&&m.projection===row.projection),identity=await ids.createRunIdentity({modelIdentity:model.identity,initialState:await ids.commitManifest(c.list([])),orderedInputSequence:await ids.commitManifest(c.text(JSON.stringify(input))),runSeed:new Uint8Array(32).fill(row.seed)});runs.push({...row,index,input,modelIdentity:model.modelIdentity,runIdentity:hex(identity.canonicalBytes),identity});}
 if(process.argv.includes('--freeze')){
  assert.equal(runs.length,69);assert.equal(new Set(runs.map(r=>r.runIdentity)).size,69);
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'embarrassment-harness/0.1'),comparison=await ids.createComparisonCase(models.map(m=>m.identity),runs.map(r=>r.identity),c.text('All seeds0..7 social affect/action contest across five laws; paired goal-only removal, epistemic/execution/display/calibration controls, scalar projection. All complete component prefixes; no native public admission.'));
  write(planPath,{status:'FROZEN BEFORE COMPONENT QUALIFICATION',version:m.VERSION,artifacts,models:models.map(({identity,...m})=>m),runs:runs.map(({identity,...r})=>r),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),prefixes:483});console.log('FROZEN6 models/69 runs/483 component prefixes');
 }else{
  const plan=read(planPath);assert.deepEqual(plan.artifacts,artifacts);assert.deepEqual(plan.models,models.map(({identity,...m})=>m));assert.deepEqual(plan.runs,runs.map(({identity,...r})=>r));
  for(const row of plan.runs){const out=p+'EMBARRASSMENT_RUN_'+row.index+'_REV1.json';if(fs.existsSync(out)){const r=read(out);assert.equal(r.status,'PASS');assert.equal(r.planSha256,sha(fs.readFileSync(planPath)));assert.equal(r.runIdentity,row.runIdentity);continue;}
   try{const run=await m.createEmbarrassmentRun(row.law,row.input,row.seed,row.projection),saves=[run.save()];while(await run.step())saves.push(run.save());assert.equal(saves.length,7);
    for(let i=0;i<7;i++){const restored=await m.restoreEmbarrassmentRun(row.law,row.input,saves[i],row.seed,row.projection);assert.deepEqual(restored.save(),saves[i]);assert.equal(await restored.step(),i<6);assert.deepEqual(restored.save(),saves[Math.min(i+1,6)]);}
    const snapshot=run.snapshot(),safe=run.observerView();write(out,{status:'PASS',planSha256:sha(fs.readFileSync(planPath)),index:row.index,scenario:row.scenario,law:row.law,projection:row.projection,seed:row.seed,modelIdentity:row.modelIdentity,runIdentity:row.runIdentity,prefixHashes:saves.map(sha),observerSha256:sha(JSON.stringify(safe)),snapshot});console.log('PASS '+row.index+' '+row.scenario+'/'+row.law+'/'+row.seed+'/'+row.projection+' seven prefixes');
   }catch(e){write(p+'EMBARRASSMENT_FAILURE_'+row.index+'_'+Date.now()+'.json',{status:'FAIL',index:row.index,error:String(e),planSha256:sha(fs.readFileSync(planPath))});throw e;}
  }
 }
}finally{await server.close();}
