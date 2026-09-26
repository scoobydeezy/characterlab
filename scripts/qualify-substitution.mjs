import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'SUBSTITUTION_PLAN_REV1.json',resultPath=p+'SUBSTITUTION_RESULT_REV1.json',viewsPath=p+'SUBSTITUTION_VIEWS_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/dependenceSubstitutes.ts'),fx=await server.ssrLoadModule('/src/test/substitutionFixtures.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),random=await server.ssrLoadModule('/src/substrate/random.ts');
 const sourcePaths=['docs/formal/DEPENDENCE_SUBSTITUTES_CONTRACT.md','src/campaign3/dependenceSubstitutes.ts','src/test/substitutionFixtures.ts','src/test/dependenceSubstitutes.test.ts','src/campaign2/cognitiveMath.ts','src/campaign2/cognitiveTransforms.ts','src/campaign2/cognitiveArbitration.ts','src/campaign2/cognitiveChoice.ts','src/campaign3/multisourceModelRecipe.ts','src/substrate/random.ts','scripts/qualify-substitution.mjs'];
 const artifacts=sourcePaths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),cases=fx.substitutionCases(),seed=new Uint8Array(32).fill(7),modelMap=new Map();
 for(const law of m.LAWS){const identity=await ids.createModelIdentity({rulesVersion:m.VERSION,contentSchemaVersion:m.VERSION,contentManifest:await ids.commitManifest(c.list([m.substitutionContent(),c.text(JSON.stringify(artifacts))])),parameterSchemaVersion:m.VERSION,parameterSet:await ids.commitManifest(c.text(law)),numericProfileVersion:'exact-rational/substitution-component',randomAlgorithmVersion:random.RANDOM_ALGORITHM_VERSION,registrySchemaVersion:m.VERSION,registryManifest:await ids.commitManifest(c.list([]))});modelMap.set(law,identity);}
 const matrix=[...m.LAWS.map(law=>({law,name:'diversified'})),...Object.keys(cases).filter(n=>n!=='diversified').map(name=>({law:'LatestHistory',name})),...['concentrated','correctedDiversified'].map(name=>({law:'ExpectationOnly',name})),{law:'HistoryOnly',name:'knownAlternative'},{law:'MeanHistory',name:'correctedConcentrated'},{law:'NoLearning',name:'knownAlternative'}];
 const runs=[];for(const row of matrix){const identity=await ids.createRunIdentity({modelIdentity:modelMap.get(row.law),initialState:await ids.commitManifest(c.list([])),orderedInputSequence:await ids.commitManifest(c.text(JSON.stringify(cases[row.name]))),runSeed:seed});runs.push({...row,input:cases[row.name],modelIdentity:hex(modelMap.get(row.law).canonicalBytes),runIdentity:hex(identity.canonicalBytes),identity});}
 if(process.argv.includes('--plan')){
  assert.equal(new Set(runs.map(r=>r.runIdentity)).size,runs.length);
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'substitution-harness/0.1-candidate'),comparison=await ids.createComparisonCase([...modelMap.values()],runs.map(r=>r.identity),c.list([c.text('same seed/address grammar; one shared relief task, equal total training, independent repertoire and safe feedback'),c.bytes(seed)]));
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE COMPONENT EXPERIMENT',date:'2026-09-26',scope:m.VERSION,seed:hex(seed),artifacts,content:hex(c.canonicalEncode(m.substitutionContent())),models:[...modelMap].map(([law,id])=>({law,identity:hex(id.canonicalBytes)})),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});console.log(`Frozen5 models/${runs.length} distinct runs.`);
 }else{
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));assert.deepEqual(plan.artifacts,artifacts);const results=[],views=[];let prefixes=0,advancing=0;
  for(const row of plan.runs){assert.equal(row.runIdentity,runs.find(r=>r.law===row.law&&r.name===row.name).runIdentity);const run=m.createSubstitutionRun(row.law,row.input),saves=[run.save()];while(await run.step())saves.push(run.save());
   for(let i=0;i<saves.length;i++){const restored=await m.restoreSubstitutionRun(row.law,row.input,saves[i]);assert.deepEqual(restored.save(),saves[i]);const next=await restored.step();assert.equal(next,i<8);assert.deepEqual(restored.save(),saves[Math.min(i+1,8)]);prefixes++;if(next)advancing++;}
   const snapshot=run.snapshot(),safe=run.observerView();results.push({law:row.law,name:row.name,modelIdentity:row.modelIdentity,runIdentity:row.runIdentity,prefixHashes:saves.map(hash),saveSha256:hash(run.save()),snapshotSha256:hash(JSON.stringify(snapshot)),safeSha256:hash(JSON.stringify(safe))});views.push({law:row.law,name:row.name,snapshot,safe});console.log(`${row.law}/${row.name}:9 exact component saves/continuations`);
  }
  const get=(name,law='LatestHistory')=>views.find(v=>v.name===name&&v.law===law),a=get('concentrated').snapshot,b=get('diversified').snapshot;
  assert.equal(a.world[3].physical.reduce((n,v)=>n+v),4);assert.equal(b.world[3].physical.reduce((n,v)=>n+v),4);
  assert.deepEqual(a.rows.slice(5).map(r=>r.intent),[-1,-1,-1]);assert.deepEqual(b.rows.slice(5).map(r=>r.intent),[1,1,1]);assert.equal(a.unserved,3);assert.equal(b.unserved,0);
  assert.deepEqual(get('diversified','ExpectationOnly').snapshot.rows.map(r=>r.intent),b.rows.map(r=>r.intent));
  assert.deepEqual(get('correctedConcentrated').snapshot.rows[5].beliefBefore,get('correctedDiversified').snapshot.rows[5].beliefBefore);
  assert.deepEqual(get('correctedConcentrated').snapshot.rows[5].admitted,[true,false]);assert.deepEqual(get('correctedDiversified').snapshot.rows[5].admitted,[true,true]);assert.deepEqual(get('correctedDiversified','ExpectationOnly').snapshot.rows[5].admitted,[false,false]);
  assert.equal(get('knownAlternative').snapshot.rows[5].intent,1);assert.equal(get('knownAlternative','HistoryOnly').snapshot.rows[5].intent,-1);
  assert.equal(a.rows[5].beliefBefore[1],null);assert.equal(get('knownFailure').snapshot.rows[5].beliefBefore[1],'0/1');
  for(const n of ['unavailable','noDemand','otherCue'])assert(get(n).snapshot.rows.slice(5).every(r=>r.intent===-1));assert.equal(get('restoredA').snapshot.rows[7].intent,0);
  assert.equal(get('correctedConcentrated','MeanHistory').snapshot.rows[5].beliefBefore[0],'4/5');
  for(const [x,y] of [['diversified','falseTraining'],['deniedFeedback','hiddenBlocked'],['falseSuccess','trueSuccess'],['deniedInfo','absentInfo']])assert.deepEqual(get(x).safe,get(y).safe);
  assert.equal(b.rows[5].expression,get('failure').snapshot.rows[5].expression);assert.equal(get('failure').snapshot.rows[6].beliefBefore[1],'0/1');assert(get('bothAvailable').snapshot.addresses.length>0);
  fs.writeFileSync(viewsPath,JSON.stringify({planSha256:hash(fs.readFileSync(planPath)),views},null,2)+'\n',{flag:'wx'});
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',scope:'component saves/transactions; not public scheduler admission',planSha256:hash(fs.readFileSync(planPath)),models:5,runs:results.length,prefixes,advancing,terminal:prefixes-advancing,results},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({models:5,runs:results.length,prefixes,advancing}));
 }
}finally{await server.close();}
