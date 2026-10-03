import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'IMPORTANCE_URGENCY_PLAN_REV1.json',resultPath=p+'IMPORTANCE_URGENCY_RESULT_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/importanceUrgency.ts'),fx=await server.ssrLoadModule('/src/test/importanceUrgencyFixtures.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),rng=await server.ssrLoadModule('/src/substrate/random.ts'),base=await server.ssrLoadModule('/src/campaign3/multisourceModelRecipe.ts');
 const visited=new Set();function visit(file){file=file.replaceAll('\\','/');if(visited.has(file))return;visited.add(file);const source=fs.readFileSync(file,'utf8');for(const match of source.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(file),match[1]);const child=[stem,stem+'.ts',path.join(stem,'index.ts')].find(f=>fs.existsSync(f)&&fs.statSync(f).isFile());assert(child,stem);visit(child);}}
 for(const f of ['src/campaign3/importanceUrgency.ts','src/test/importanceUrgency.test.ts','src/test/importanceUrgencyFixtures.ts','src/substrate/identity.ts'])visit(f);
 const artifacts=[...visited,'docs/formal/IMPORTANCE_URGENCY_COMPONENT_CONTRACT.md','scripts/qualify-importance-urgency.mjs'].sort().map(path=>({path,sha256:hash(fs.readFileSync(path))}));
 const b=base.multisourceBase(),content=c.list([c.text('respond/importance-task;other/other-task;fixed competitor500;I0,500,1000;U0,1000;residual product denominator2000'),b.get('task-reason-dice'),b.get('task-arbitration')]);
 const models=new Map();for(const law of m.LAWS)models.set(law,await ids.createModelIdentity({rulesVersion:m.VERSION,contentSchemaVersion:m.VERSION,contentManifest:await ids.commitManifest(c.list([content,c.text(JSON.stringify(artifacts))])),parameterSchemaVersion:m.VERSION,parameterSet:await ids.commitManifest(c.text(law)),numericProfileVersion:'exact-rational/importance-urgency',randomAlgorithmVersion:rng.RANDOM_ALGORITHM_VERSION,registrySchemaVersion:m.VERSION,registryManifest:await ids.commitManifest(c.list([]))}));
 const cases={highLow:fx.importanceFrames(1000,0),highHigh:fx.importanceFrames(1000,1000),lowLow:fx.importanceFrames(500,0),lowHigh:fx.importanceFrames(500,1000),zero:fx.importanceFrames(0),absent:fx.importanceFrames(null),hidden:fx.importanceFrames(),deniedAdoption:fx.importanceFrames(),deniedAdoptionChanged:fx.importanceFrames(500),deniedUrgency:fx.importanceFrames(),deniedUrgencyChanged:fx.importanceFrames()};
 cases.hidden.forEach(f=>f.hiddenUrgency=0);for(const n of ['deniedAdoption','deniedAdoptionChanged'])cases[n][0].adoptionVisible=false;
 for(const n of ['deniedUrgency','deniedUrgencyChanged'])cases[n].forEach(f=>{f.urgencyVisible=false;if(n.endsWith('Changed'))f.urgency=0;});
 const runs=[];for(const law of m.LAWS)for(const [name,inputs] of Object.entries(cases))for(const seed of ['highLow','highHigh','lowLow','lowHigh'].includes(name)?[0,1,2,3,4,5,6,7]:[7]){
  const initialState=await ids.commitManifest(c.text(JSON.stringify(m.createImportanceRun(law,inputs,seed).snapshot()))),identity=await ids.createRunIdentity({modelIdentity:models.get(law),initialState,orderedInputSequence:await ids.commitManifest(c.text(JSON.stringify(inputs))),runSeed:new Uint8Array(32).fill(seed)});
  runs.push({law,name,seed,inputs,modelIdentity:hex(models.get(law).canonicalBytes),runIdentity:hex(identity.canonicalBytes),identity});
 }
 assert.equal(runs.length,195);assert.equal(new Set(runs.map(r=>r.runIdentity)).size,195);
 if(process.argv.includes('--plan')){
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'importance-urgency-harness/0.1-candidate'),comparison=await ids.createComparisonCase([...models.values()],runs.map(r=>r.identity),c.text('Same motive, options, efficacy, fixed competing ground and seed; independent importance/urgency and lossy-product collision. All seeds0..7 retained.'));
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE QUALIFICATION',version:m.VERSION,artifacts,content:hex(c.canonicalEncode(content)),models:[...models].map(([law,id])=>({law,modelIdentity:hex(id.canonicalBytes)})),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});console.log('FROZEN5 models/195 distinct component runs.');
 }else{
  const plan=JSON.parse(fs.readFileSync(planPath));assert.deepEqual(plan.artifacts,artifacts);assert.deepEqual(plan.runs,runs.map(({identity,...r})=>r));assert(!fs.existsSync(resultPath));
  const results=[];for(const row of plan.runs){const run=m.createImportanceRun(row.law,row.inputs,row.seed),saves=[run.save()];while(await run.step())saves.push(run.save());for(let i=0;i<=6;i++){const restored=await m.restoreImportanceRun(row.law,row.inputs,row.seed,i,saves[i]);assert.deepEqual(restored.save(),saves[i]);assert.equal(await restored.step(),i<6);assert.deepEqual(restored.save(),saves[Math.min(i+1,6)]);}results.push({...row,inputs:undefined,prefixHashes:saves.map(hash),safe:run.observerView(),snapshot:run.snapshot()});}
  const get=(law,name,seed=7)=>results.find(r=>r.law===law&&r.name===name&&r.seed===seed),chosen=r=>r.safe.rows.map(x=>x.choice.chosen),divergent=[];
  for(let seed=0;seed<8;seed++){
   for(const name of ['highLow','highHigh','lowLow','lowHigh'])assert.deepEqual(get('Factored',name,seed).safe,get('RefoldImportance',name,seed).safe);
   const a=get('Factored','highLow',seed).safe.rows,b=get('Factored','lowHigh',seed).safe.rows;assert.deepEqual(a[0].choice,b[0].choice);assert.equal(a[1].strength,500);assert.equal(b[1].strength,250);assert.notDeepEqual(a[1].choice.probabilities,b[1].choice.probabilities);
   assert.notDeepEqual(get('Factored','highLow',seed).safe.rows[0].choice.probabilities,get('Factored','highHigh',seed).safe.rows[0].choice.probabilities);
   if(JSON.stringify(chosen(get('Factored','highLow',seed)))!==JSON.stringify(chosen(get('Factored','lowHigh',seed))))divergent.push(seed);
  }
  for(const law of m.LAWS)for(const [a,b] of [['highHigh','hidden'],['deniedAdoption','deniedAdoptionChanged'],['deniedUrgency','deniedUrgencyChanged']])assert.deepEqual(get(law,a).safe,get(law,b).safe);
  assert.equal(get('FrozenProduct','lowHigh').safe.rows[1].strength,500);assert.equal(get('Factored','lowHigh').safe.rows[1].strength,250);
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',scope:'Component selection and exact component prefix replay; no native admission/physical execution.',planSha256:hash(fs.readFileSync(planPath)),models:5,runs:195,prefixes:1365,advancing:1170,terminal:195,collisionPairChoiceDivergentSeeds:divergent,results},null,2)+'\n',{flag:'wx'});console.log('PASS5 models/195 runs/1365 prefixes; collision-pair sequence differences '+JSON.stringify(divergent));
 }
}finally{await server.close();}
