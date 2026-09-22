import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'CONTROL_PUBLIC_PLAN_REV2.json',resultPath=p+'CONTROL_PUBLIC_RESULT_REV2.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/controlFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/controlModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/controlFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/controlCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const matrix=[...[[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[1,2]].map(([candidate,law])=>({candidate,law,name:'main'})),...Object.keys(fx.controlCases()).filter(n=>n!=='main').map(name=>({candidate:1,law:1,name})),{candidate:4,law:1,name:'lost'}];
 if(process.argv.includes('--plan')) {
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compileControlModel(m.controlRecipe({candidate:row.candidate,law:row.law})),inputs=fx.controlInputs(fx.controlCases()[row.name]),run=await m.compileControlInputs(model,canonical.canonicalEncode((await m.compileControlModel(m.controlRecipe())).initial.canonicalValue()),inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.CONTROL_VERSION,'control-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('same seed and fixed stage occurrence addresses across candidates; inherited exact reason dice and ties'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/CONTROL_PUBLIC_CONTRACT.md','docs/formal/CONTROL_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-control-model-rev2/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/control'+n+'.ts'),'src/test/controlFixtures.ts','src/test/controlPublic.test.ts','src/test/controlBoundary.test.ts','scripts/qualify-control-public.mjs'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'bounded maintained-goal inhibition of learned candidate under competing neutral-card load; no general control resource or fatigue law',initialState:hex(canonical.canonicalEncode((await m.compileControlModel(m.controlRecipe())).initial.canonicalValue())),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 7 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of plan.runs) {
   const source=m.controlRecipe({candidate:row.candidate,law:row.law}),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createControlRun(await factory.prepareControlModel(source),{initialState:canonical.canonicalEncode((await m.compileControlModel(m.controlRecipe())).initial.canonicalValue()),orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restoreControlRun(source,{initialState:canonical.canonicalEncode((await m.compileControlModel(m.controlRecipe())).initial.canonicalValue()),orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodeControl(run.snapshot().outputs),'list'),observerViews=[run.observerView(0)];
   views.set(`${row.candidate}/${row.law}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.candidate}/${row.law}/${row.name}: ${saves.length} exact prefixes`);
  }
  const get=(name,candidate=1,law=1)=>views.get(candidate+'/'+law+'/'+name),f=data.dataField,rec=data.dataRecord,items=data.dataItems;
  const records=(name,type,candidate=1,law=1)=>get(name,candidate,law).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
  const inhibit=(name,c=1)=>records(name,1015n,c).map(v=>f(v,5n));
  assert.deepEqual(inhibit('main'),[false,false,false,true,false,true,true,false]);
  assert.equal(inhibit('main',2)[3],false);assert.equal(inhibit('main',3)[4],true);
  assert.equal(inhibit('lost')[4],false);assert.equal(inhibit('lost',4)[4],true);
  assert.equal(items(f(records('main',827n,5)[7],3n),'list').length,1);
  assert.equal(items(f(records('main',827n)[7],3n),'list').length,2);
  assert.equal(items(f(records('main',827n,6)[4],3n),'list').length,1);
  assert.notDeepEqual(f(rec(f(records('main',1015n)[3],1n),826n),5n),f(rec(f(records('main',1015n,1,2)[3],1n),826n),5n));
  for(const [a,b] of [['hidden','absent'],['main','hiddenReward']])assert.deepEqual(get(a).observerViews,get(b).observerViews);
  assert.deepEqual(f(records('main',1015n)[4],1n),f(records('noLoad',1015n)[4],1n));
  for(const h of records('main',837n).slice(3))assert.deepEqual(f(h,4n),f(h,5n));
  for(const name of ['otherCue','unseenTraining'])assert.equal(items(f(records(name,827n)[4],3n),'list').length,1);
  assert(inhibit('noGoal').every(x=>x===false));
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:7,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
 }
} finally {await server.close();}
