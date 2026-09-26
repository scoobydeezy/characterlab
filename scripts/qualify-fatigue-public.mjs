import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'FATIGUE_PUBLIC_PLAN_REV1.json',resultPath=p+'FATIGUE_PUBLIC_RESULT_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/fatigueFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/fatigueModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/fatigueFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/fatigueCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const matrix=[...[[1,1],[2,1],[3,1],[4,1]].map(([candidate,law])=>({candidate,law,name:'main'})),...Object.keys(fx.fatigueCases()).filter(n=>n!=='main').map(name=>({candidate:1,law:1,name})),{candidate:3,law:1,name:'motorChallenge'},{candidate:4,law:1,name:'mild'}];
 if(process.argv.includes('--plan')) {
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compileFatigueModel(m.fatigueRecipe({candidate:row.candidate,law:row.law})),inputs=fx.fatigueInputs(fx.fatigueCases()[row.name]),run=await m.compileFatigueInputs(model,canonical.canonicalEncode((await m.compileFatigueModel(m.fatigueRecipe())).initial.canonicalValue()),inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  assert.equal(new Set(runs.map(r=>r.runIdentity)).size,runs.length,'Duplicate public case identity');
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.FATIGUE_VERSION,'fatigue-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('same seed and fixed stage occurrence addresses across candidates; inherited exact reason dice and ties'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/FATIGUE_PUBLIC_CONTRACT.md','docs/formal/FATIGUE_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-fatigue-model-rev1/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/fatigue'+n+'.ts'),'src/test/fatigueFixtures.ts','src/test/fatiguePublic.test.ts','src/test/fatigueRuntime.test.ts','scripts/qualify-fatigue-public.mjs'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'bounded sensor-mediated fatigue impairing actual cognitive control; no endogenous accumulation or universal resource law',initialState:hex(canonical.canonicalEncode((await m.compileFatigueModel(m.fatigueRecipe())).initial.canonicalValue())),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 4 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of plan.runs) {
   const source=m.fatigueRecipe({candidate:row.candidate,law:row.law}),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createFatigueRun(await factory.prepareFatigueModel(source),{initialState:canonical.canonicalEncode((await m.compileFatigueModel(m.fatigueRecipe())).initial.canonicalValue()),orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restoreFatigueRun(source,{initialState:canonical.canonicalEncode((await m.compileFatigueModel(m.fatigueRecipe())).initial.canonicalValue()),orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodeFatigue(run.snapshot().outputs),'list'),observerViews=[run.observerView(0)];
   views.set(`${row.candidate}/${row.law}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.candidate}/${row.law}/${row.name}: ${saves.length} exact prefixes`);
  }
  const get=(name,candidate=1,law=1)=>views.get(candidate+'/'+law+'/'+name),f=data.dataField,rec=data.dataRecord,items=data.dataItems;
  const records=(name,type,candidate=1,law=1)=>get(name,candidate,law).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
  const inhibit=(name,c=1)=>records(name,1339n,c).map(v=>f(v,5n));
  const impair=(name,c=1)=>records(name,1339n,c).map(v=>f(v,7n));
  assert.deepEqual(inhibit('main'),[false,false,false,true,false,false,false,true]);
  assert.deepEqual(impair('main'),[false,false,false,false,true,true,true,false]);
  for(const c of [2,3])assert(impair('main',c).every(x=>x===false));assert.deepEqual(impair('main',4),impair('main'));
  assert.equal(impair('mild')[4],false);assert.equal(impair('mild',4)[4],true);
  assert.deepEqual(inhibit('externalLoad'),inhibit('main'));assert(impair('externalLoad').every(x=>x===false));
  assert.equal(impair('missingRecovery')[7],true);assert(impair('missingOnset').every(x=>x===false));
  for(const [a,b] of [['main','falseFatigue'],['main','falseRecovery'],['main','hiddenReward'],['absent','denied']])assert.deepEqual(get(a).observerViews,get(b).observerViews);
  for(const h of records('main',837n).slice(3))assert.deepEqual(f(h,4n),f(h,5n));
  const ev=records('main',1339n);for(const i of [5,6])assert.deepEqual(f(ev[i],6n),f(ev[4],6n));for(const c of [2,3,4])for(let i=0;i<8;i++)assert.deepEqual(f(records('main',1339n,c)[i],6n),f(ev[i],6n));
  assert.equal(f(ev[2],8n),false);assert.equal(f(ev[3],8n),true);assert.equal(f(ev[3],9n).value,0n);
  assert.equal(items(f(records('main',827n)[4],3n),'list').length,2);assert.equal(items(f(records('main',827n)[7],3n),'list').length,1);
  const execution=records('main',1348n);assert.equal(f(execution[3],3n),false);assert.equal(f(execution[7],3n),false);assert(execution.slice(4,7).some(x=>f(x,3n)===true));
  assert.deepEqual(records('motorChallenge',1344n)[3],records('motorChallenge',1344n,3)[3]);assert.deepEqual(records('motorChallenge',1345n)[3],records('motorChallenge',1345n,3)[3]);assert.equal(f(records('motorChallenge',1348n)[3],3n),true);assert.equal(f(records('motorChallenge',1348n,3)[3],3n),false);
  fs.writeFileSync(p+'FATIGUE_PUBLIC_VIEWS_REV1.json',JSON.stringify({planSha256:hash(fs.readFileSync(planPath)),views:[...views].map(([key,v])=>[key,{outputs:hex(canonical.canonicalEncode(canonical.list(v.outputs))),observerViews:v.observerViews.map(hex)}])},null,2)+'\n',{flag:'wx'});
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:4,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
 }
} finally {await server.close();}
