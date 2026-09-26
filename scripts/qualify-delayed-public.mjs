import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'DELAYED_PUBLIC_PLAN_REV1.json',resultPath=p+'DELAYED_PUBLIC_RESULT_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/delayedFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/delayedModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/delayedFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/delayedCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const matrix=[...[1,2,3].map(law=>({law,name:'main'})),...Object.keys(fx.cases()).filter(n=>n!=='main').map(name=>({law:1,name})),...[2,3].flatMap(law=>['delay2','delay4'].map(name=>({law,name})))];
 if(process.argv.includes('--plan')) {
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compileDelayedModel(m.delayedRecipe(row.law)),inputs=fx.ordered(fx.cases()[row.name]),run=await m.compileDelayedInputs(model,fx.initialState,inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'delayed-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('same seed; exact inherited reason dice; changed delay/law, prediction and delivery'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/DELAYED_PUBLIC_CONTRACT.md','docs/formal/DELAYED_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-delayed-model-rev1/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/delayed'+n+'.ts'),'src/test/delayedFixtures.ts','src/test/delayedPublic.test.ts','src/test/delayedRuntime.test.ts','scripts/qualify-delayed-public.mjs'];
  assert.equal(new Set(runs.map(r=>r.runIdentity)).size,runs.length,'duplicate run identities');
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'own-delayed feedback changes later ordinary strategy under fixed goal and availability; candidate thresholds, no causal diagnosis or optimal control law',initialState:hex(fx.initialState),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 3 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of plan.runs) {
   const source=m.delayedRecipe(row.law),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createDelayedRun(await factory.prepareDelayedModel(source),{initialState:fx.initialState,orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restoreDelayedRun(source,{initialState:fx.initialState,orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodeDelayed(run.snapshot().outputs),'list'),observerViews=[run.observerView(0)];
   views.set(`${row.law}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.law}/${row.name}: ${saves.length} exact prefixes`);
  }
  const get=(name,law=1)=>views.get(`${law}/${name}`),f=data.dataField,rec=data.dataRecord,items=data.dataItems,key=data.dataKey;
  const records=(name,type,law=1)=>fx.records(get(name,law).outputs,type),app=(name,law=1)=>records(name,1386n,law)[1],choice=(name,law=1)=>f(records(name,1390n,law)[1],7n),prob=(name,law=1)=>f(records(name,1390n,law)[1],4n);
  const q=canonical.rational;
  assert.deepEqual(choice('main'),m.OPTIONS[1]);assert.deepEqual(choice('immediateLarge'),m.OPTIONS[0]);
  for(const [name,value] of [['main',q(1,2)],['delay2',q(1,3)],['delay4',q(1,5)],['uncertain',q(1,4)],['cost',q(1,4)]])assert.deepEqual(f(app(name),6n),value);
  assert.deepEqual(f(app('delay2',2),6n),q(1,1));assert.deepEqual(f(app('delay2',3),6n),q(1,4));
  assert.notDeepEqual(prob('delay4'),prob('delay4',2));assert.notDeepEqual(prob('delay4',3),prob('delay4',2));
  for(const n of ['unknown','unavailable'])assert.deepEqual(choice(n),m.OPTIONS[0]);assert.deepEqual(choice('absentOffer'),m.OPTIONS[2]);
  assert.notDeepEqual(f(app('unknown'),3n),f(app('unavailable'),3n));
  const truth=records('main',1399n);assert.equal(items(f(truth[1],3n),'list').length,0);const delivery=rec(items(f(truth[2],3n),'list')[0],1397n);assert.equal(f(delivery,1n).value,3n);assert.deepEqual(f(delivery,2n),q(1,1));
  assert.equal(records('main',1383n).length,6);assert.equal(items(f(rec(f(records('main',1400n).at(-1),3n),1384n),2n),'list').length,1);
  assert.equal(records('missing',1383n).length,0);assert.deepEqual(f(records('failed',1383n)[0],5n),q(0,1));
  assert.deepEqual(records('failed',1392n).slice(0,2),records('main',1392n).slice(0,2));
  assert.deepEqual(records('main',1399n),records('zeroReceipt',1399n));assert.notDeepEqual(f(records('main',1400n).at(-1),3n),f(records('zeroReceipt',1400n).at(-1),3n));
  for(const [a,b] of [['missing','hiddenMissing'],['truePromised','falseReceipt'],['lateReceipt','hiddenLate'],['deniedOffer','hiddenOffer'],['main','lateWorldChange']])assert.deepEqual(get(a).observerViews,get(b).observerViews);
  assert.equal(f(records('lateReceipt',1383n)[0],3n).value,7n);
  fs.writeFileSync(p+'DELAYED_PUBLIC_VIEWS_REV1.json',JSON.stringify({planSha256:hash(fs.readFileSync(planPath)),views:[...views].map(([key,v])=>[key,{outputs:hex(canonical.canonicalEncode(canonical.list(v.outputs))),observerViews:v.observerViews.map(hex)}])},null,2)+'\n',{flag:'wx'});
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:3,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
 }
} finally {await server.close();}
