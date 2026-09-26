import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'PROCRASTINATION_PUBLIC_PLAN_REV2.json',resultPath=p+'PROCRASTINATION_PUBLIC_RESULT_REV2.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/procrastinationFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/procrastinationModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/procrastinationFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/procrastinationCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const matrix=[...[[1,1],[2,1],[3,1],[4,1]].map(([candidate,law])=>({candidate,law,name:'main'})),...Object.keys(fx.procrastinationCases()).filter(n=>n!=='main').map(name=>({candidate:1,law:1,name})),{candidate:3,law:1,name:'unknown'},{candidate:3,law:1,name:'corrected'}];
 if(process.argv.includes('--plan')) {
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compileProcrastinationModel(m.procrastinationRecipe({candidate:row.candidate,law:row.law})),inputs=fx.procrastinationInputs(fx.procrastinationCases()[row.name]),run=await m.compileProcrastinationInputs(model,canonical.canonicalEncode((await m.compileProcrastinationModel(m.procrastinationRecipe())).initial.canonicalValue()),inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  assert.equal(new Set(runs.map(r=>r.runIdentity)).size,runs.length,'Duplicate public case identity');
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.PROCRASTINATION_VERSION,'procrastination-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('same seed and fixed stage occurrence addresses across candidates; inherited exact reason dice and ties'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/PROCRASTINATION_PUBLIC_CONTRACT.md','docs/formal/PROCRASTINATION_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-procrastination-model-rev2/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/procrastination'+n+'.ts'),'src/test/procrastinationFixtures.ts','src/test/procrastinationPublic.test.ts','src/test/procrastinationRuntime.test.ts','scripts/qualify-procrastination-public.mjs'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'bounded actual postponement under retained accessible feasible work goal and independent immediate motive; no universal temporal valuation law',initialState:hex(canonical.canonicalEncode((await m.compileProcrastinationModel(m.procrastinationRecipe())).initial.canonicalValue())),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 4 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of plan.runs) {
   const source=m.procrastinationRecipe({candidate:row.candidate,law:row.law}),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createProcrastinationRun(await factory.prepareProcrastinationModel(source),{initialState:canonical.canonicalEncode((await m.compileProcrastinationModel(m.procrastinationRecipe())).initial.canonicalValue()),orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restoreProcrastinationRun(source,{initialState:canonical.canonicalEncode((await m.compileProcrastinationModel(m.procrastinationRecipe())).initial.canonicalValue()),orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodeProcrastination(run.snapshot().outputs),'list'),observerViews=[run.observerView(0)];
   views.set(`${row.candidate}/${row.law}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.candidate}/${row.law}/${row.name}: ${saves.length} exact prefixes`);
  }
  const get=(name,candidate=1,law=1)=>views.get(candidate+'/'+law+'/'+name),f=data.dataField,rec=data.dataRecord,items=data.dataItems;
  const records=(name,type,candidate=1,law=1)=>get(name,candidate,law).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
  const ev=(name,c=1)=>records(name,1360n,c),discount=(name,c=1)=>ev(name,c).map(v=>f(v,7n));
  assert.equal(discount('main')[1],true);assert.equal(discount('main',2)[1],false);assert.equal(discount('unknown')[1],false);assert.equal(discount('unknown',3)[1],true);assert.equal(discount('corrected')[2],true);assert.equal(discount('corrected')[3],false);assert.equal(discount('corrected',3)[3],true);assert.equal(discount('main')[5],false);
  const raw=records('main',1362n),choices=records('main',1364n),e=ev('main');const signals=items(f(raw[1],3n),'list');assert.equal(signals.length,2);assert.notDeepEqual(f(rec(signals[0],402n),1n),f(rec(signals[1],402n),1n));assert.notDeepEqual(f(rec(signals[0],402n),2n),f(rec(signals[1],402n),2n));
  assert.equal(f(e[1],2n),true);assert.equal(f(e[1],3n),true);assert.equal(f(e[1],5n),true);assert(choices.slice(1,5).some((c,i)=>f(e[i+1],2n)===true&&f(e[i+1],3n)===true&&f(e[i+1],5n)===true&&data.dataKey(f(c,7n))!==data.dataKey(items(f(rec(f(raw[i+1],2n),1376n),3n),'list')[0])));
  assert(records('main',1369n).slice(1,6).some(v=>f(v,3n)===true));assert.notDeepEqual(f(choices[1],4n),f(records('main',1364n,2)[1],4n));
  const status=(name,i,c=1)=>f(rec(f(records(name,1361n,c)[i],2n),1356n),2n).value;
  assert.equal(status('main',3,4),2n);assert.equal(status('deniedExecution',5),4n);assert.equal(status('cancelled',2),3n);
  for(const name of ['noGoal','noAccess','unavailableNow'])assert.equal(items(f(records(name,1376n)[1],3n),'list').length,1);
  assert.equal(f(ev('unknown')[1],8n),false);assert.equal(f(ev('unavailableFuture')[1],8n),true);assert.equal(f(ev('unavailableFuture')[1],9n).value,1n);
  assert.deepEqual(choices.slice(0,5),records('falseForecast',1364n).slice(0,5));assert.equal(f(ev('falseForecast')[5],5n),false);
  for(const [a,b] of [['main','falseUnitOutcome'],['unknown','denied'],['deniedExecution','hiddenPhysical']])assert.deepEqual(get(a).observerViews,get(b).observerViews);
  fs.writeFileSync(p+'PROCRASTINATION_PUBLIC_VIEWS_REV2.json',JSON.stringify({planSha256:hash(fs.readFileSync(planPath)),views:[...views].map(([key,v])=>[key,{outputs:hex(canonical.canonicalEncode(canonical.list(v.outputs))),observerViews:v.observerViews.map(hex)}])},null,2)+'\n',{flag:'wx'});
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:4,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
 }
} finally {await server.close();}
