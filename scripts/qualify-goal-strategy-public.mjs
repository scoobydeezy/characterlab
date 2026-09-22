import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'GOAL_STRATEGY_PUBLIC_PLAN_REV1.json',resultPath=p+'GOAL_STRATEGY_PUBLIC_RESULT_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/goalStrategyFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/goalStrategyModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/goalStrategyFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/goalStrategyCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const matrix=[...[1,2,3,4].map(law=>({law,name:'main'})),...Object.keys(fx.cases()).filter(n=>n!=='main').map(name=>({law:1,name}))];
 if(process.argv.includes('--plan')) {
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compileGoalStrategyModel(m.goalStrategyRecipe(row.law)),inputs=fx.ordered(fx.cases()[row.name]),run=await m.compileGoalStrategyInputs(model,fx.initialState,inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'goal-strategy-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('deterministic ordinary planner; same seed, no random draws'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/GOAL_STRATEGY_PUBLIC_CONTRACT.md','docs/formal/GOAL_STRATEGY_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-goal-strategy-model-rev1/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/goalStrategy'+n+'.ts'),'src/test/goalStrategyFixtures.ts','src/test/goalStrategyPublic.test.ts','src/test/goalStrategyRuntime.test.ts','src/test/goalStrategyComponent.test.ts','src/campaign3/goalStrategyComponent.ts','docs/formal/GOAL_STRATEGY_COMPONENT_CONTRACT.md','scripts/qualify-goal-strategy-public.mjs'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'bounded adopted goal, mutable strategy and perceived fulfillment; no general search, persistence or control law',initialState:hex(fx.initialState),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 4 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of plan.runs) {
   const source=m.goalStrategyRecipe(row.law),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createGoalStrategyRun(await factory.prepareGoalStrategyModel(source),{initialState:fx.initialState,orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restoreGoalStrategyRun(source,{initialState:fx.initialState,orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodeGoalStrategy(run.snapshot().outputs),'list'),observerViews=[run.observerView(0)];
   views.set(`${row.law}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.law}/${row.name}: ${saves.length} exact prefixes`);
  }
  const get=(name,law=1)=>views.get(`${law}/${name}`),f=data.dataField,rec=data.dataRecord,items=data.dataItems,key=data.dataKey;
  const routes=(name,law=1)=>fx.records(get(name,law).outputs,1001n).map(v=>Number(f(v,6n).value));
  assert.deepEqual(routes('main'),[0,1,1,2,0,2,0]);
  assert.deepEqual(routes('main',2),[0,1,1,2,0,0,0]);
  assert.deepEqual(routes('main',3),[0,1,1,1,1,1,1]);
  assert.deepEqual(routes('main',4),[0,1,0,0,0,0,0]);
  assert.deepEqual(fx.records(get('main').outputs,1001n).map(v=>f(v,5n)),[false,true,true,true,true,true,false]);
  const completion=fx.records(get('main').outputs,1003n)[5];assert.equal(Number(f(completion,3n).value),2);assert.equal(f(completion,4n),true);
  for(const [a,b] of [['retained','hiddenCause'],['noOutcome','hiddenSuccess'],['hiddenExternal','absentExternal'],['denied','noDisplay']])assert.deepEqual(get(a).observerViews,get(b).observerViews);
  for(const name of ['fulfilled','external','falseCriterion'])assert.equal(Number(f(rec(items(f(fx.records(get(name).outputs,1004n)[1],3n),'list')[0],993n),2n).value),2);
  assert.equal(Number(f(fx.records(get('expiry').outputs,1001n).at(-1),8n).value),1);
  assert.equal(items(f(rec(f(fx.records(get('duplicate').outputs,1006n).at(-1),3n),997n),1n),'list').length,1);
  assert.equal(f(fx.records(get('adoptionCriterion').outputs,1001n).at(-1),5n),true);
  assert.deepEqual(routes('noAdoption'),[0,0,0]);
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:4,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
 }
} finally {await server.close();}
