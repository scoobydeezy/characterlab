import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'TEMPORAL_PLAN_REV1.json',resultPath=p+'TEMPORAL_RESULT_REV1.json',viewsPath=p+'TEMPORAL_VIEWS_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/temporalGoalConflict.ts'),fx=await server.ssrLoadModule('/src/test/temporalGoalFixtures.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),random=await server.ssrLoadModule('/src/substrate/random.ts');
 const sourcePaths=['docs/formal/TEMPORAL_GOAL_CONFLICT_CONTRACT.md','src/campaign3/temporalGoalConflict.ts','src/test/temporalGoalFixtures.ts','src/test/temporalGoalConflict.test.ts','src/campaign2/cognitiveMath.ts','src/campaign2/cognitiveTransforms.ts','src/campaign2/cognitiveArbitration.ts','src/campaign2/cognitiveChoice.ts','src/campaign3/multisourceModelRecipe.ts','src/substrate/random.ts','scripts/qualify-temporal-goals.mjs'];
 const artifacts=sourcePaths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),cases=fx.temporalCases(),seed=new Uint8Array(32).fill(7),modelMap=new Map();
 for(const law of m.LAWS){const identity=await ids.createModelIdentity({rulesVersion:m.VERSION,contentSchemaVersion:m.VERSION,contentManifest:await ids.commitManifest(c.list([m.temporalContent(),c.text(JSON.stringify(artifacts))])),parameterSchemaVersion:m.VERSION,parameterSet:await ids.commitManifest(c.text(law)),numericProfileVersion:'exact-rational/temporal-component',randomAlgorithmVersion:random.RANDOM_ALGORITHM_VERSION,registrySchemaVersion:m.VERSION,registryManifest:await ids.commitManifest(c.list([]))});modelMap.set(law,identity);}
 const matrix=[...m.LAWS.map(law=>({law,name:'main'})),...Object.keys(cases).filter(n=>n!=='main').map(name=>({law:'HorizonRelative',name})),...['shortWeak','longWeak'].map(name=>({law:'NoTemporalBias',name}))];
 const runs=[];for(const row of matrix){const identity=await ids.createRunIdentity({modelIdentity:modelMap.get(row.law),initialState:await ids.commitManifest(c.list([])),orderedInputSequence:await ids.commitManifest(c.text(JSON.stringify(cases[row.name]))),runSeed:seed});runs.push({...row,input:cases[row.name],modelIdentity:hex(modelMap.get(row.law).canonicalBytes),runIdentity:hex(identity.canonicalBytes),identity});}
 if(process.argv.includes('--plan')){
  assert.equal(new Set(runs.map(r=>r.runIdentity)).size,runs.length);
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'temporal-goal-harness/0.1-candidate'),comparison=await ids.createComparisonCase([...modelMap.values()],runs.map(r=>r.identity),c.list([c.text('same seed/address grammar; independent goals and selective lifecycle interventions'),c.bytes(seed)]));
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE COMPONENT EXPERIMENT',date:'2026-09-26',scope:m.VERSION,seed:hex(seed),artifacts,content:hex(c.canonicalEncode(m.temporalContent())),models:[...modelMap].map(([law,id])=>({law,identity:hex(id.canonicalBytes)})),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});console.log(`Frozen4 models/${runs.length} distinct runs.`);
 }else{
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));assert.deepEqual(plan.artifacts,artifacts);const results=[],views=[];let prefixes=0,advancing=0;
  for(const row of plan.runs){assert.equal(row.runIdentity,runs.find(r=>r.law===row.law&&r.name===row.name).runIdentity);const run=m.createTemporalRun(row.law,row.input),saves=[run.save()];while(await run.step())saves.push(run.save());
   for(let i=0;i<saves.length;i++){const restored=await m.restoreTemporalRun(row.law,row.input,saves[i]);assert.deepEqual(restored.save(),saves[i]);const next=await restored.step();assert.equal(next,i<8);assert.deepEqual(restored.save(),saves[Math.min(i+1,8)]);prefixes++;if(next)advancing++;}
   const snapshot=run.snapshot(),safe=run.observerView();results.push({law:row.law,name:row.name,modelIdentity:row.modelIdentity,runIdentity:row.runIdentity,prefixHashes:saves.map(hash),saveSha256:hash(run.save()),snapshotSha256:hash(JSON.stringify(snapshot)),safeSha256:hash(JSON.stringify(safe))});views.push({law:row.law,name:row.name,snapshot,safe});console.log(`${row.law}/${row.name}:9 exact component saves/continuations`);
  }
  const get=(name,law='HorizonRelative')=>views.find(v=>v.name===name&&v.law===law),base=get('main').snapshot,first=base.rows[1],loser=1-first.intent;
  assert.deepEqual(first.goalsBefore.map(g=>g.status),['Open','Open']);assert.equal(first.goalsAfter[loser].status,'Open');assert(base.rows.slice(2).some(r=>r.intent===loser));assert.deepEqual(base.goals.map(g=>g.status),['Fulfilled','Fulfilled']);assert.deepEqual(base.physical,[1,3]);assert(base.addresses.length>0);
  for(const [name,i] of [['cancelShort',0],['cancelLong',1]]){const s=get(name).snapshot;assert.equal(s.rows[1].goalsAfter[i].status,'Cancelled');assert.equal(s.rows[1].goalsAfter[1-i].status,'Open');assert.equal(s.rows[2].intent,1-i);assert(s.rows.slice(2).every(r=>r.intent!==i));}
  for(const [name,i] of [['noShort',0],['noLong',1],['shortUnavailable',0],['longUnavailable',1],['shortInaccessible',0],['longInaccessible',1]])assert(get(name).snapshot.rows.every(r=>r.intent!==i));
  const missing=get('missingReceipt').snapshot;assert.deepEqual(missing.goals.map(g=>g.progress),[0,0]);assert.deepEqual(missing.goals.map(g=>g.status),['DeadlineMissed','DeadlineMissed']);assert(missing.physical.reduce((a,b)=>a+b)>0);
  const corrected=get('forecastCorrection').snapshot;assert.equal(corrected.rows[1].expression,missing.rows[1].expression);assert.equal(corrected.rows[2].values[1],'1/1');assert.equal(missing.rows[2].values[1],'1/4');
  for(const [a,b] of [['missingReceipt','hiddenBlocked'],['falseReceipt','trueReceipt'],['deniedAdoption','hiddenAdoption']])assert.deepEqual(get(a).safe,get(b).safe);
  for(const law of ['DropLoser','SharedRetirement'])assert(get('main',law).snapshot.goals.some(g=>g.status==='Cancelled'));
  const data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),codec=await server.ssrLoadModule('/src/campaign3/receivingCodecs.ts'),choice=await server.ssrLoadModule('/src/campaign2/cognitiveChoice.ts');
  const prob=(name,law='HorizonRelative')=>data.dataField(choice.chosenData(codec.decodeReceiving(Uint8Array.from(Buffer.from(get(name,law).snapshot.rows[1].resolution,'hex')))),2n);
  assert.notDeepEqual(prob('main'),prob('main','NoTemporalBias'));for(const name of ['shortWeak','longWeak'])assert.notDeepEqual(prob('main','NoTemporalBias'),prob(name,'NoTemporalBias'));
  fs.writeFileSync(viewsPath,JSON.stringify({planSha256:hash(fs.readFileSync(planPath)),views},null,2)+'\n',{flag:'wx'});
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',scope:'component saves/transactions; not public scheduler admission',planSha256:hash(fs.readFileSync(planPath)),models:4,runs:results.length,prefixes,advancing,terminal:prefixes-advancing,results},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({models:4,runs:results.length,prefixes,advancing}));
 }
}finally{await server.close();}
