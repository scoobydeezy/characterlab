import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'REINFORCEMENT_PLAN_REV1.json',resultPath=p+'REINFORCEMENT_RESULT_REV1.json',viewsPath=p+'REINFORCEMENT_VIEWS_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/dependenceSubstitutes.ts'),fx=await server.ssrLoadModule('/src/test/reinforcementFixtures.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),random=await server.ssrLoadModule('/src/substrate/random.ts');
 const original=JSON.parse(fs.readFileSync(p+'SUBSTITUTION_PLAN_REV1.json'));
 for(const a of original.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
 const sourcePaths=['docs/formal/REINFORCEMENT_FEEDBACK_EXPERIMENT_CONTRACT.md',p+'SUBSTITUTION_PLAN_REV1.json',p+'SUBSTITUTION_CLOSURE_REV1.json',p+'REINFORCEMENT_EXPLORATION_REV1.json','src/test/reinforcementFixtures.ts','src/test/reinforcementFeedback.test.ts','scripts/qualify-reinforcement.mjs'];
 const artifacts=sourcePaths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),cases=fx.reinforcementCases(),modelMap=new Map(),version='reinforcement-feedback-experiment/0.1-candidate';
 for(const law of m.LAWS){const identity=await ids.createModelIdentity({rulesVersion:m.VERSION,contentSchemaVersion:m.VERSION,contentManifest:await ids.commitManifest(c.list([m.substitutionContent(),c.text(JSON.stringify(original.artifacts))])),parameterSchemaVersion:m.VERSION,parameterSet:await ids.commitManifest(c.text(law)),numericProfileVersion:'exact-rational/substitution-component',randomAlgorithmVersion:random.RANDOM_ALGORITHM_VERSION,registrySchemaVersion:m.VERSION,registryManifest:await ids.commitManifest(c.list([]))});assert.equal(hex(identity.canonicalBytes),original.models.find(x=>x.law===law).identity);modelMap.set(law,identity);}
 const matrix=[...Array.from({length:8},(_,seed)=>['full','withheld'].map(name=>({law:'MeanHistory',name,seed}))).flat(),...m.LAWS.filter(law=>law!=='MeanHistory').flatMap(law=>['full','withheld'].map(name=>({law,name,seed:2}))),...Object.keys(cases).filter(n=>!['full','withheld'].includes(n)).map(name=>({law:'MeanHistory',name,seed:2}))];
 const runs=[];for(const row of matrix){const identity=await ids.createRunIdentity({modelIdentity:modelMap.get(row.law),initialState:await ids.commitManifest(c.list([])),orderedInputSequence:await ids.commitManifest(c.text(JSON.stringify(cases[row.name]))),runSeed:new Uint8Array(32).fill(row.seed)});runs.push({...row,input:cases[row.name],modelIdentity:hex(modelMap.get(row.law).canonicalBytes),runIdentity:hex(identity.canonicalBytes),identity});}

 if(process.argv.includes('--plan')){
  assert.equal(new Set(runs.map(r=>r.runIdentity)).size,runs.length);
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',version,'reinforcement-harness/0.1-candidate'),comparison=await ids.createComparisonCase([...modelMap.values()],runs.map(r=>r.identity),c.list([c.text('all seeds0..7 paired full/withheld, five unchanged models, frozen feedback/control domain')]));
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE COMPONENT EXPERIMENT',date:'2026-09-26',scope:version,reusedModelVersion:m.VERSION,artifacts,content:hex(c.canonicalEncode(m.substitutionContent())),models:[...modelMap].map(([law,id])=>({law,identity:hex(id.canonicalBytes)})),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});console.log(`Frozen5 models/${runs.length} distinct runs.`);
 }else{
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));assert.deepEqual(plan.artifacts,artifacts);const results=[],views=[];let prefixes=0,advancing=0;
  for(const row of plan.runs){assert.equal(row.runIdentity,runs.find(r=>r.law===row.law&&r.name===row.name&&r.seed===row.seed).runIdentity);const run=m.createSubstitutionRun(row.law,row.input,row.seed),saves=[run.save()];while(await run.step())saves.push(run.save());
   for(let i=0;i<saves.length;i++){const restored=await m.restoreSubstitutionRun(row.law,row.input,saves[i],row.seed);assert.deepEqual(restored.save(),saves[i]);const next=await restored.step();assert.equal(next,i<8);assert.deepEqual(restored.save(),saves[Math.min(i+1,8)]);prefixes++;if(next)advancing++;}
   const snapshot=run.snapshot(),safe=run.observerView();results.push({law:row.law,name:row.name,seed:row.seed,modelIdentity:row.modelIdentity,runIdentity:row.runIdentity,prefixHashes:saves.map(hash),saveSha256:hash(run.save()),snapshotSha256:hash(JSON.stringify(snapshot)),safeSha256:hash(JSON.stringify(safe))});views.push({law:row.law,name:row.name,seed:row.seed,snapshot,safe});console.log(`${row.law}/${row.name}/${row.seed}:9 exact component saves/continuations`);
  }
  const get=(name,seed=2,law='MeanHistory')=>views.find(v=>v.name===name&&v.seed===seed&&v.law===law),diverged=[];
  for(let seed=0;seed<8;seed++){const a=get('full',seed).snapshot,b=get('withheld',seed).snapshot;assert.equal(a.rows[3].resolution,b.rows[3].resolution);assert.equal(a.rows[3].expression,b.rows[3].expression);assert(b.rows.slice(3).every(r=>r.beliefBefore.join(',')==='1/2,1/2'));if(JSON.stringify(a.rows.map(r=>r.intent))!==JSON.stringify(b.rows.map(r=>r.intent)))diverged.push(seed);}
  assert.deepEqual(diverged,[2,3,4,5,6,7]);assert.deepEqual(get('full').snapshot.rows.slice(3).map(r=>r.intent),[0,0,0,0,0]);assert.deepEqual(get('withheld').snapshot.rows.slice(3).map(r=>r.intent),[0,1,0,0,0]);
  assert.equal(get('full').snapshot.rows[7].beliefBefore[0],'5/6');assert.equal(get('failure').snapshot.rows[4].beliefBefore[0],'1/3');
  for(const [a,b] of [['falseSuccess','trueSuccess'],['withheld','hiddenFailure']])assert.deepEqual(get(a).safe,get(b).safe);
  for(const name of ['noDemand','unavailable','unseenTraining'])assert(get(name).snapshot.rows.slice(3).every(r=>r.intent===-1));
  fs.writeFileSync(viewsPath,JSON.stringify({planSha256:hash(fs.readFileSync(planPath)),views},null,2)+'\n',{flag:'wx'});
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',scope:'component saves/transactions; not public scheduler admission',planSha256:hash(fs.readFileSync(planPath)),models:5,newModels:0,divergedSeeds:diverged,runs:results.length,prefixes,advancing,terminal:prefixes-advancing,results},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({models:5,newModels:0,divergedSeeds:diverged,runs:results.length,prefixes,advancing}));
 }
}finally{await server.close();}
