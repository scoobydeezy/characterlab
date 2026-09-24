import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'RECOLLECTION_PUBLIC_PLAN_REV2.json',resultPath=p+'RECOLLECTION_PUBLIC_RESULT_REV2.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/recollectionFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/recollectionModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/recollectionFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/recollectionCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const matrix=[...[1,2,3,4,5].map(law=>({law,name:'main'})),...Object.keys(fx.cases()).filter(n=>n!=='main').map(name=>({law:1,name})),{law:4,name:'hiddenTruth'}];
 if(process.argv.includes('--plan')) {
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compileRecollectionModel(m.recollectionRecipe(row.law)),inputs=fx.ordered(fx.cases()[row.name]),run=await m.compileRecollectionInputs(model,fx.initialState,inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'recollection-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('deterministic ordinary planner; same seed, no random draws'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/RECOLLECTION_PUBLIC_CONTRACT.md','docs/formal/RECOLLECTION_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-recollection-model-rev1/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/recollection'+n+'.ts'),'src/test/recollectionFixtures.ts','src/test/recollectionPublic.test.ts','scripts/qualify-recollection-public.mjs'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'routine episodic fragmentation and category-default reconstruction; no general recognition, importance or downstream behavior qualification',initialState:hex(fx.initialState),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 5 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of plan.runs) {
   const source=m.recollectionRecipe(row.law),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createRecollectionRun(await factory.prepareRecollectionModel(source),{initialState:fx.initialState,orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restoreRecollectionRun(source,{initialState:fx.initialState,orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodeRecollection(run.snapshot().outputs),'list'),observerViews=[run.observerView(0)];
   views.set(`${row.law}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.law}/${row.name}: ${saves.length} exact prefixes`);
  }
  const get=(name,law=1)=>views.get(law+'/'+name),f=data.dataField,rec=data.dataRecord,items=data.dataItems;
  const records=(name,type,law=1)=>get(name,law).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);
  const recalls=(name,law=1)=>records(name,1049n,law),field=(name,index,n,law=1)=>f(recalls(name,law).at(index),BigInt(n)),eq=(a,b)=>assert.deepEqual(a,b),u=canonical.unsigned,list=canonical.list;
  eq(field('main',3,4),u(1));eq(field('main',3,6),list([true]));eq(field('main',4,6),list([true]));eq(field('main',5,4),u(3));eq(field('main',5,6),list([false]));
  eq(field('main',-1,4,2),u(2));eq(field('main',-1,6,2),list([]));eq(field('main',-1,4,3),u(1));eq(field('main',-1,6,3),list([true]));
  eq(field('main',5,4,5),u(3));eq(field('main',6,4,5),u(1));eq(field('main',6,6,5),list([false]));
  eq(field('newRegularity',5,6),list([false]));eq(field('newRegularity',-1,6),list([true]));eq(recalls('newRegularity').slice(0,6),recalls('main').slice(0,6));
  for(const name of ['tie','allUnknown']){eq(field(name,-1,4),u(2));eq(field(name,-1,6),list([]));}
  for(const name of ['unseen','unknownEpisode'])eq(field(name,-1,4),u(0));
  eq(field('sameInstant',2,4),u(0));eq(field('knownFalse',-1,6),list([false]));eq(field('otherCategory',-1,6),list([true]));eq(field('missingDetail',3,4),u(3));
  for(const type of [1042n,1050n,1051n])eq(records('main',type),records('noQueries',type));
  for(const [a,b] of [['main','hiddenTruth'],['denied','absent'],['main','falseDisplay']])eq(get(a).observerViews,get(b).observerViews);
  assert.notDeepEqual(get('main',4).observerViews,get('hiddenTruth',4).observerViews);
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:5,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
 }
} finally {await server.close();}
