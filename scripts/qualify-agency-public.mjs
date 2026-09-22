import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'AGENCY_PUBLIC_PLAN_REV3.json',resultPath=p+'AGENCY_PUBLIC_RESULT_REV3.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/agencyFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/agencyModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/agencyFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/agencyCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const matrix=[...[1,2,3,4,5].map(law=>({law,name:'main'})),...Object.keys(fx.cases()).filter(n=>n!=='main').map(name=>({law:1,name}))];
 if(process.argv.includes('--plan')) {
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compileAgencyModel(m.agencyRecipe(row.law)),inputs=fx.ordered(fx.cases()[row.name]),run=await m.compileAgencyInputs(model,fx.initialState,inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'agency-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('same seed and resolution instant for unchanged decision inputs'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/AGENCY_PUBLIC_CONTRACT.md','docs/formal/AGENCY_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-agency-model-rev3/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/agency'+n+'.ts'),'src/test/agencyFixtures.ts','src/test/agencyPublic.test.ts','src/test/agencyUnreceivedReport.test.ts','src/test/agencyPhaseContract.test.ts','scripts/qualify-agency-public.mjs'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'bounded obstruction occurrence attribution; no coercion, trust or cross-episode prediction qualification',initialState:hex(fx.initialState),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 5 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of plan.runs) {
   const source=m.agencyRecipe(row.law),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createAgencyRun(await factory.prepareAgencyModel(source),{initialState:fx.initialState,orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restoreAgencyRun(source,{initialState:fx.initialState,orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodeAgency(run.snapshot().outputs),'list'),observerViews=[run.observerView(0),run.observerView(1)];
   views.set(`${row.law}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.law}/${row.name}: ${saves.length} exact prefixes`);
  }
  const get=(name,law=1)=>views.get(`${law}/${name}`),f=data.dataField,rec=data.dataRecord,items=data.dataItems,key=data.dataKey;
  const knowledge=(name,i,law=1)=>{const probe=fx.records(get(name,law).outputs,981n).filter(v=>key(f(v,3n))===key(m.OBSERVERS[i])).at(-1);return items(f(rec(f(probe,4n),979n),1n),'list').map(v=>rec(v,978n));};
  for(const name of ['success','incompetent']) for(const type of [403n,408n,409n,425n,426n,432n])assert.deepEqual(fx.records(get('blocked').outputs,type),fx.records(get(name).outputs,type));
  for(const name of ['incompetent','otherBlocker'])assert.deepEqual(get('blocked').observerViews[1],get(name).observerViews[1]);
  assert.notDeepEqual(get('blocked').observerViews[0],get('otherBlocker').observerViews[0]);
  assert.deepEqual(get('blocked').observerViews,get('blockedIncompetent').observerViews);
  assert.deepEqual(get('hidden').observerViews,get('hiddenSuccess').observerViews);
  assert.deepEqual(get('unreceivedReport').observerViews[1],get('noReport').observerViews[1]);
  const fraction=b=>[String(f(b,2n).value),String(f(b,3n).value)];
  assert.deepEqual(fraction(knowledge('main',0)[0]),['1','2']);assert.deepEqual(fraction(knowledge('main',0,2)[0]),['0','1']);
  assert.equal(knowledge('main',0,3).length,0);assert.equal(knowledge('main',1,4).length,1);
  assert.equal(items(f(rec(f(fx.records(get('main',5).outputs,986n)[0],3n),983n),1n),'list').length,0);
  assert.equal(knowledge('swapped',0).length,0);assert.equal(knowledge('swapped',1).length,1);
  assert.equal(knowledge('both',0).length,1);assert.equal(knowledge('both',1).length,1);
  assert.deepEqual(fraction(knowledge('correction',1)[0]),['1','2']);assert.deepEqual(fraction(knowledge('duplicate',1)[0]),['0','1']);assert.equal(knowledge('repeated',0).length,2);
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:5,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
 }
} finally {await server.close();}
