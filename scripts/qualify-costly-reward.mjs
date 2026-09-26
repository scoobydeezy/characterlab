import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',hex=b=>Buffer.from(b).toString('hex'),hash=b=>createHash('sha256').update(b).digest('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/costlyReward.ts'),fx=await server.ssrLoadModule('/src/test/costlyRewardFixtures.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),random=await server.ssrLoadModule('/src/substrate/random.ts');
 const paths=['docs/formal/COSTLY_REWARD_INTEGRATION_CONTRACT.md','src/campaign3/costlyReward.ts','src/test/costlyRewardFixtures.ts','src/test/costlyReward.test.ts','scripts/qualify-costly-reward.mjs','src/campaign2/cognitiveMath.ts','src/campaign2/cognitiveTransforms.ts','src/campaign2/cognitiveArbitration.ts','src/campaign2/cognitiveChoice.ts','src/campaign3/receivingCodecs.ts','src/campaign3/multisourceModelRecipe.ts'];
 const artifacts=paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),models=[],runs=[],cases=fx.costlyCases();
 for(const law of m.LAWS){
  const identity=await ids.createModelIdentity({rulesVersion:m.VERSION,contentSchemaVersion:m.VERSION,contentManifest:await ids.commitManifest(c.list([m.costlyContent(),c.text(JSON.stringify(artifacts))])),parameterSchemaVersion:m.VERSION,parameterSet:await ids.commitManifest(c.text(law)),numericProfileVersion:'exact-rational/costly-reward',randomAlgorithmVersion:random.RANDOM_ALGORITHM_VERSION,registrySchemaVersion:m.VERSION,registryManifest:await ids.commitManifest(c.list([]))});models.push({law,identity:hex(identity.canonicalBytes),raw:identity});
  for(const [name,frames] of Object.entries(cases)){
   if(law!=='MeanHistory'&&!['main','noLoad','withheld'].includes(name)&&!(law==='BeliefAccess'&&name==='otherCue'))continue;
   for(const seed of law==='MeanHistory'&&['main','noLoad','withheld'].includes(name)?[0,1,2,3,4,5,6,7]:[7]){
    const run=await ids.createRunIdentity({modelIdentity:identity,initialState:await ids.commitManifest(c.list([])),orderedInputSequence:await ids.commitManifest(c.text(JSON.stringify(frames))),runSeed:new Uint8Array(32).fill(seed)});runs.push({law,name,seed,frames,modelIdentity:hex(identity.canonicalBytes),runIdentity:hex(run.canonicalBytes),raw:run});
   }
  }
 }
 assert.equal(runs.length,50);assert.equal(new Set(runs.map(r=>r.runIdentity)).size,50);
 const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'costly-reward-harness/0.1-candidate'),comparison=await ids.createComparisonCase(models.map(x=>x.raw),runs.map(x=>x.raw),c.text('All eight main/noLoad/withheld seeds; six laws; prior exploration retained; narrow costly-reward behavior only'));
 const plan={status:'FROZEN BEFORE QUALIFICATION',artifacts,models:models.map(({raw,...x})=>x),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),runs:runs.map(({raw,...x})=>x)};
 if(process.argv.includes('--plan')){fs.writeFileSync(p+'COSTLY_REWARD_PLAN_REV1.json',JSON.stringify(plan,null,2)+'\n',{flag:'wx'});console.log('Frozen6 models/50 component runs.');}
 else{
  assert.deepEqual(JSON.parse(fs.readFileSync(p+'COSTLY_REWARD_PLAN_REV1.json')),plan);assert(!fs.existsSync(p+'COSTLY_REWARD_RESULT_REV1.json'));
  const results=[];
  for(const row of runs){
   const run=m.createCostlyRun(row.law,row.frames,row.seed),saves=[],snapshots=[],views=[];
   for(let i=0;i<=12;i++){saves.push(run.save());snapshots.push(run.snapshot());views.push(run.observerView());if(i<12)assert(await run.step());}
   for(let i=0;i<=12;i++){const restored=await m.restoreCostlyRun(row.law,row.frames,saves[i],row.seed);assert.deepEqual(restored.snapshot(),snapshots[i]);assert.deepEqual(restored.observerView(),views[i]);for(let j=i+1;j<=12;j++){assert(await restored.step());assert.deepEqual(restored.snapshot(),snapshots[j]);assert.deepEqual(restored.observerView(),views[j]);}assert.deepEqual(restored.save(),saves[12]);assert.equal(await restored.step(),false);}
   const snapshot=run.snapshot();results.push({law:row.law,name:row.name,seed:row.seed,modelIdentity:row.modelIdentity,runIdentity:row.runIdentity,prefixHashes:saves.map(hash),sequence:snapshot.rows.map(r=>r.intent<0?'-':r.intent===0?'A':'B').join(''),snapshot,observerView:run.observerView()});
   console.log(`Verified ${results.length}/50 ${row.law}/${row.name}/${row.seed}`);
  }
  const get=(law,name,seed=7)=>results.find(r=>r.law===law&&r.name===name&&r.seed===seed);
  let repeated=0;
  for(let seed=0;seed<8;seed++){const a=get('MeanHistory','main',seed),b=get('MeanHistory','noLoad',seed),d=get('MeanHistory','withheld',seed);assert(a.snapshot.rows.slice(4).every(r=>r.goal&&r.maintained));assert.equal(b.sequence,'AAAABBBBBBBB');assert.equal(a.sequence.slice(4,6),'BB');assert.equal(a.sequence.slice(10),'BB');assert.equal(a.snapshot.rows[6].resolution,d.snapshot.rows[6].resolution);assert.equal(d.snapshot.history.length,4);if(a.snapshot.world.slice(6,10).filter(r=>r.performedA&&r.reward&&r.harm).length>=2)repeated++;}
  assert(repeated>0);for(const [a,b] of [['trueReports','falseReports'],['withheld','hiddenDenied']])assert.deepEqual(get('MeanHistory',a).observerView,get('MeanHistory',b).observerView);
  const result={status:'PASS',models:6,runs:50,componentPrefixes:650,advancing:600,terminal:50,repeatedCostlySeeds:repeated,planSha256:hash(fs.readFileSync(p+'COSTLY_REWARD_PLAN_REV1.json')),results};
  fs.writeFileSync(p+'COSTLY_REWARD_RESULT_REV1.json',JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log('PASS6 models/50 runs/650 full component prefix continuations.');
 }
}finally{await server.close();}
