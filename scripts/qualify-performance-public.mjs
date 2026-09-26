import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'PERFORMANCE_PUBLIC_PLAN_REV1.json',resultPath=p+'PERFORMANCE_PUBLIC_RESULT_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/performanceFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/performanceModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/performanceFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/performanceCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const matrix=[...[1,2,3,4].map(law=>({law,name:'main'})),...Object.keys(fx.cases()).filter(n=>n!=='main').map(name=>({law:1,name})),{law:4,name:'noFeedback'},{law:4,name:'hiddenDenied'},{law:3,name:'transientFailure'}];
 if(process.argv.includes('--plan')) {
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compilePerformanceModel(m.performanceRecipe(row.law)),inputs=fx.ordered(fx.cases()[row.name]),run=await m.compilePerformanceInputs(model,fx.initialState,inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'performance-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('deterministic ordinary planner; same seed, no random draws'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/PERFORMANCE_PUBLIC_CONTRACT.md','docs/formal/PERFORMANCE_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-performance-model-rev1/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/performance'+n+'.ts'),'src/test/performanceFixtures.ts','src/test/performancePublic.test.ts','src/test/performanceRuntime.test.ts','src/campaign3/goalStrategyComponent.ts','docs/formal/GOAL_STRATEGY_COMPONENT_CONTRACT.md','scripts/qualify-performance-public.mjs'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'own-performance feedback changes later ordinary strategy under fixed goal and availability; candidate thresholds, no causal diagnosis or optimal control law',initialState:hex(fx.initialState),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 4 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of plan.runs) {
   const source=m.performanceRecipe(row.law),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createPerformanceRun(await factory.preparePerformanceModel(source),{initialState:fx.initialState,orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restorePerformanceRun(source,{initialState:fx.initialState,orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodePerformance(run.snapshot().outputs),'list'),observerViews=[run.observerView(0)];
   views.set(`${row.law}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.law}/${row.name}: ${saves.length} exact prefixes`);
  }
  const get=(name,law=1)=>views.get(`${law}/${name}`),f=data.dataField,rec=data.dataRecord,items=data.dataItems,key=data.dataKey;
  const records=(name,type,law=1)=>fx.records(get(name,law).outputs,type),routes=(name,law=1)=>records(name,1304n,law).map(v=>Number(f(v,6n).value));
  assert.deepEqual(routes('main'),[0,1,1,2,2,2,2,2]);assert.deepEqual(routes('main',2),[0,1,1,1,1,1,1,1]);assert.equal(routes('transientFailure',3)[2],2);
  for(const n of ['positiveFeedback','transientFailure','noFeedback','oneHiddenFailure','noAlternative'])assert.deepEqual(routes(n),[0,1,1,1,1,1,1,1]);
  assert.deepEqual(routes('gappedFailures'),[0,1,1,1,1,2,2,2]);assert.deepEqual(routes('repeatFailures'),[0,1,1,2,2,1,1,2]);assert.equal(Number(f(records('repeatFailures',1304n)[6],11n).value),1);
  assert.deepEqual(routes('noAdoption'),Array(8).fill(0));assert.equal(records('noAdoption',1301n).filter(o=>f(o,4n).value===3n).length,0);
  assert.deepEqual(routes('fulfilled'),[0,1,1,2,0,0,0,0]);assert.deepEqual(routes('external'),[0,1,0,0,0,0,0,0]);
  const e=records('main',1304n),goals=e.slice(1).map(v=>items(f(v,3n),'list')[0]);for(const g of goals)assert.deepEqual(g,goals[0]);for(const v of e.slice(1)){assert.equal(Number(f(v,8n).value),3);assert.equal(Number(f(v,9n).value),3);}
  assert.deepEqual(e.map(v=>Number(f(v,11n).value)),[0,0,1,2,0,0,0,0]);assert.equal(f(e[3],12n),true);
  const execution=records('main',1306n)[3];assert.equal(Number(f(execution,3n).value),2);assert.equal(f(execution,4n),true);assert.equal(records('main',1305n).length,7);
  assert.deepEqual(records('transientFailure',1305n).slice(0,2),records('main',1305n).slice(0,2));
  for(const [a,b] of [['main','hiddenCause'],['main','falseFailure'],['noFeedback','hiddenDenied'],['deniedDisplay','noDisplay']])assert.deepEqual(get(a).observerViews,get(b).observerViews);
  assert.notDeepEqual(get('noFeedback',4).observerViews,get('hiddenDenied',4).observerViews);
  fs.writeFileSync(p+'PERFORMANCE_PUBLIC_VIEWS_REV1.json',JSON.stringify({planSha256:hash(fs.readFileSync(planPath)),views:[...views].map(([key,v])=>[key,{outputs:hex(canonical.canonicalEncode(canonical.list(v.outputs))),observerViews:v.observerViews.map(hex)}])},null,2)+'\n',{flag:'wx'});
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:4,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
 }
} finally {await server.close();}
