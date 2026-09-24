import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'FAMILIARITY_PUBLIC_PLAN_REV1.json',resultPath=p+'FAMILIARITY_PUBLIC_RESULT_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/familiarityFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/familiarityModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/familiarityFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/familiarityCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const matrix=[...[1,2,3,4,5].map(law=>({law,name:'main'})),...Object.keys(fx.cases()).filter(n=>n!=='main').map(name=>({law:1,name})),{law:5,name:'hiddenIdentity'},{law:4,name:'unknownFeatures'},{law:3,name:'recent'}];
 if(process.argv.includes('--plan')) {
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compileFamiliarityModel(m.familiarityRecipe(row.law)),inputs=fx.ordered(fx.cases()[row.name]),run=await m.compileFamiliarityInputs(model,fx.initialState,inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'familiarity-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('deterministic ordinary planner; same seed, no random draws'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/FAMILIARITY_PUBLIC_CONTRACT.md','docs/formal/FAMILIARITY_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-familiarity-model-rev1/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/familiarity'+n+'.ts'),'src/test/familiarityFixtures.ts','src/test/familiarityPublic.test.ts','scripts/qualify-familiarity-public.mjs'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'feature familiarity after episodic detail loss; controlled person/place displays, no instance identity or downstream reward qualification',initialState:hex(fx.initialState),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 5 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of plan.runs) {
   const source=m.familiarityRecipe(row.law),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createFamiliarityRun(await factory.prepareFamiliarityModel(source),{initialState:fx.initialState,orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restoreFamiliarityRun(source,{initialState:fx.initialState,orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodeFamiliarity(run.snapshot().outputs),'list'),observerViews=[run.observerView(0)];
   views.set(`${row.law}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.law}/${row.name}: ${saves.length} exact prefixes`);
  }
  const get=(name,law=1)=>views.get(law+'/'+name),f=data.dataField,rec=data.dataRecord,items=data.dataItems;
  const records=(name,type,law=1)=>get(name,law).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);
  const results=(name,law=1)=>records(name,1062n,law),field=(name,index,n,law=1)=>f(results(name,law).at(index),BigInt(n)),eq=(a,b)=>assert.deepEqual(a,b),u=canonical.unsigned,list=canonical.list,q=canonical.rational;
  eq(field('main',0,4),u(1));eq(field('main',-1,4),u(5));eq(field('main',-1,5),list([q(1,2)]));eq(field('place',-1,4),u(5));
  eq(field('same',-1,4),u(4));eq(field('novel',-1,4),u(3));eq(field('otherCategory',-1,4),u(1));eq(field('detailChanged',-1,5),list([q(1,1)]));
  for(const name of ['noFeatures','unknownFeatures']){eq(field(name,-1,4),u(2));eq(field(name,-1,5),list([]));}
  eq(field('falseFeatures',-1,4),u(4));eq(field('unknownFeatures',-1,4,4),u(4));eq(field('partialKnown',-1,4),u(4));
  eq(field('main',-1,4,2),u(3));eq(field('main',-1,4,3),u(2));eq(field('recent',-1,4,3),u(5));
  assert.equal(items(field('tie',-1,6),'list').length,2);eq(field('changing',-1,4),u(4));eq(field('changing',-1,5),list([q(1,1)]));
  eq(get('changing').outputs.slice(0,get('main').outputs.length),get('main').outputs);
  const c=rec(items(field('main',-1,7),'list')[0],1061n);eq(f(c,6n),list([]));eq(f(c,2n),u(1));eq(f(c,3n),u(1));
  for(const [a,b] of [['main','hiddenIdentity'],['deniedFirst','absentFirst']])eq(get(a).observerViews,get(b).observerViews);
  assert.notDeepEqual(get('main',5).observerViews,get('hiddenIdentity',5).observerViews);
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:5,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
 }
} finally {await server.close();}
