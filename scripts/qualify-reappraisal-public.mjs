import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'REAPPRAISAL_PUBLIC_PLAN_REV1.json',resultPath=p+'REAPPRAISAL_PUBLIC_RESULT_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/reappraisalFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/reappraisalModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/reappraisalFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/reappraisalCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const matrix=[...[[1,1],[1,2],[2,1],[3,1],[4,1]].map(([law,projection])=>({law,projection,name:'main'})),...Object.keys(fx.cases()).filter(n=>n!=='main').map(name=>({law:1,projection:1,name})),{law:3,projection:1,name:'unknownBaseline'},{law:3,projection:1,name:'harmful'}];
 if(process.argv.includes('--plan')) {
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compileReappraisalModel(m.reappraisalRecipe(row.law,row.projection)),inputs=fx.ordered(fx.cases()[row.name]),run=await m.compileReappraisalInputs(model,fx.initialState,inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'reappraisal-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('deterministic ordinary planner; same seed, no random draws'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/REAPPRAISAL_PUBLIC_CONTRACT.md','docs/formal/REAPPRAISAL_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-reappraisal-model-rev1/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/reappraisal'+n+'.ts'),'src/test/reappraisalFixtures.ts','src/test/reappraisalPublic.test.ts','src/campaign3/affectFactorComparison.ts','docs/formal/AFFECT_FACTOR_COMPARISON.md','scripts/qualify-reappraisal-public.mjs'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'instructed prospective conditional reframing through previously acquired risk estimates; no physical mitigation, spontaneous selection or downstream action qualification',initialState:hex(fx.initialState),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 5 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of plan.runs) {
   const source=m.reappraisalRecipe(row.law,row.projection),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createReappraisalRun(await factory.prepareReappraisalModel(source),{initialState:fx.initialState,orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restoreReappraisalRun(source,{initialState:fx.initialState,orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodeReappraisal(run.snapshot().outputs),'list'),observerViews=[run.observerView(0)];
   views.set(`${row.law}/${row.projection}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.law}/${row.projection}/${row.name}: ${saves.length} exact prefixes`);
  }
  const get=(name,law=1,projection=1)=>views.get(law+'/'+projection+'/'+name),f=data.dataField,rec=data.dataRecord,items=data.dataItems;
  const records=(name,type,law=1,projection=1)=>get(name,law,projection).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);
  const apps=(name,law=1,projection=1)=>records(name,1032n,law,projection),values=(name,index,law=1,projection=1)=>items(f(apps(name,law,projection).at(index),7n),'list').map(v=>[String(v.numerator),String(v.denominator)]);
  assert.deepEqual(values('main',2),[['1','1']]);assert.deepEqual(values('main',3),[['0','1']]);assert.deepEqual(values('noRequest',3),[['1','1']]);assert.deepEqual(values('main',3,2),[['1','1']]);
  assert.deepEqual(values('harmful',2),[['0','1']]);assert.deepEqual(values('harmful',3),[['1','1']]);assert.deepEqual(values('harmful',3,3),[['0','1']]);
  assert.deepEqual(values('weighted',-1),[['1','2']]);assert.deepEqual(values('ineffective',-1),[['1','1']]);assert.equal(values('main',-1,1,2).length,2);
  for(const name of ['unknownBaseline','unknownProtected','emptyCatalogue','missingCatalogue','failed','sameInstant'])assert.equal(items(f(records(name,1035n).at(-1),3n),'list').length,0);
  assert.deepEqual(values('unknownBaseline',-1),[]);assert.deepEqual(values('unknownBaseline',-1,3),[['0','1']]);
  for(const type of [1027n,1036n])assert.deepEqual(records('main',type),records('noRequest',type));
  assert.deepEqual(records('main',1027n),records('main',1027n,4));assert.notDeepEqual(records('main',1036n),records('main',1036n,4));
  for(const [x,y] of [['main','hiddenTruth'],['denied','absent']])assert.deepEqual(get(x).observerViews,get(y).observerViews);
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:5,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
 }
} finally {await server.close();}
