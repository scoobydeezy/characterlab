import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'RUMINATION_PUBLIC_PLAN_REV1.json',resultPath=p+'RUMINATION_PUBLIC_RESULT_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/ruminationFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/ruminationModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/ruminationFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/ruminationCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const matrix=[...[[1,1],[2,1],[3,1],[4,1]].map(([candidate,law])=>({candidate,law,name:'main'})),...Object.keys(fx.ruminationCases()).filter(n=>n!=='main').map(name=>({candidate:1,law:1,name})),{candidate:3,law:1,name:'unbroken'},{candidate:2,law:1,name:'externalLoad'}];
 if(process.argv.includes('--plan')) {
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compileRuminationModel(m.ruminationRecipe({candidate:row.candidate,law:row.law})),inputs=fx.ruminationInputs(fx.ruminationCases()[row.name]),run=await m.compileRuminationInputs(model,canonical.canonicalEncode((await m.compileRuminationModel(m.ruminationRecipe())).initial.canonicalValue()),inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.RUMINATION_VERSION,'rumination-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('same seed and fixed stage occurrence addresses across candidates; inherited exact reason dice and ties'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/RUMINATION_PUBLIC_CONTRACT.md','docs/formal/RUMINATION_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-rumination-model-rev1/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/rumination'+n+'.ts'),'src/test/ruminationFixtures.ts','src/test/ruminationPublic.test.ts','src/test/ruminationRuntime.test.ts','scripts/qualify-rumination-public.mjs'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'bounded maintained-goal inhibition of learned candidate under competing neutral-card load; no general rumination resource or fatigue law',initialState:hex(canonical.canonicalEncode((await m.compileRuminationModel(m.ruminationRecipe())).initial.canonicalValue())),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 4 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of plan.runs) {
   const source=m.ruminationRecipe({candidate:row.candidate,law:row.law}),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createRuminationRun(await factory.prepareRuminationModel(source),{initialState:canonical.canonicalEncode((await m.compileRuminationModel(m.ruminationRecipe())).initial.canonicalValue()),orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restoreRuminationRun(source,{initialState:canonical.canonicalEncode((await m.compileRuminationModel(m.ruminationRecipe())).initial.canonicalValue()),orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodeRumination(run.snapshot().outputs),'list'),observerViews=[run.observerView(0)];
   views.set(`${row.candidate}/${row.law}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.candidate}/${row.law}/${row.name}: ${saves.length} exact prefixes`);
  }
  const get=(name,candidate=1,law=1)=>views.get(candidate+'/'+law+'/'+name),f=data.dataField,rec=data.dataRecord,items=data.dataItems;
  const records=(name,type,candidate=1,law=1)=>get(name,candidate,law).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
  const inhibit=(name,c=1)=>records(name,1318n,c).map(v=>f(v,5n));
  assert.deepEqual(inhibit('main'),[false,false,false,false,true,false,false,true]);
  const access=(name,c=1)=>records(name,1318n,c).map(v=>f(v,7n));
  assert.deepEqual(access('main'),[false,false,false,true,false,true,true,false]);
  assert(access('main',2).every(x=>x===false));assert(access('main',3).every(x=>x===false));
  assert.deepEqual(access('main',4),[false,false,false,true,false,true,false,false]);
  assert.equal(inhibit('main',2)[3],true);assert.equal(inhibit('main',3)[4],false);
  assert.deepEqual(inhibit('unbroken'),inhibit('unbroken',3));
  assert.equal(inhibit('externalLoad',2)[4],false);assert.equal(inhibit('main')[4],true);
  for(const [a,b] of [['main','hiddenTruth'],['main','hiddenReward'],['main','falseResolution'],['absent','denied'],['absent','nonrecipient'],['unresolved','hiddenResolution']])assert.deepEqual(get(a).observerViews,get(b).observerViews);
  for(const h of records('main',837n).slice(3))assert.deepEqual(f(h,4n),f(h,5n));
  const ev=records('main',1318n);for(const i of [4,5,6])assert.deepEqual(f(ev[i],6n),f(ev[3],6n));
  for(const c of [2,3,4])for(let i=0;i<8;i++)assert.deepEqual(f(records('main',1318n,c)[i],6n),f(ev[i],6n));
  assert.equal(items(f(records('main',827n)[3],3n),'list').length,2);assert.equal(items(f(records('main',827n)[4],3n),'list').length,1);
  const execution=records('main',1327n);assert.equal(f(execution[4],3n),false);assert.equal(f(execution[7],3n),false);assert(execution.slice(3).some(x=>f(x,3n)===true));
  assert.equal(f(records('main',1328n)[2],2n).value,3n);assert.equal(items(f(data.dataRecord(f(ev[2],6n),1329n),1n),'list').length,0);
  fs.writeFileSync(p+'RUMINATION_PUBLIC_VIEWS_REV1.json',JSON.stringify({planSha256:hash(fs.readFileSync(planPath)),views:[...views].map(([key,v])=>[key,{outputs:hex(canonical.canonicalEncode(canonical.list(v.outputs))),observerViews:v.observerViews.map(hex)}])},null,2)+'\n',{flag:'wx'});
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:4,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
 }
} finally {await server.close();}
