import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const execute=promisify(execFile),workerArg=process.argv.find(x=>x.startsWith('--worker=')),worker=workerArg===undefined?undefined:Number(workerArg.slice(9));
if(worker!==undefined)assert(Number.isInteger(worker)&&worker>=0&&worker<4);
const workerRoot='docs/planning/personstate-public-workers-rev1';
const p='docs/planning/',planPath=p+'PERSONSTATE_PUBLIC_PLAN_REV1.json',resultPath=p+'PERSONSTATE_PUBLIC_RESULT_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/personstateFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/personstateModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/personstateFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/personstateCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const matrix=[...[[1,1,1],[1,2,1],[1,3,1],[1,1,2],[2,1,1],[3,1,1],[4,1,1],[5,1,1]].map(([law,pressure,goal])=>({law,pressure,goal,name:'main'})),...Object.keys(fx.cases()).filter(n=>n!=='main').map(name=>({law:1,pressure:1,goal:1,name})),...['hiddenIntent','noA','noB','otherCue'].map(name=>({law:1,pressure:3,goal:1,name})),{law:5,pressure:1,goal:1,name:'hiddenIntent'},{law:2,pressure:1,goal:1,name:'cueChanged'},{law:3,pressure:1,goal:1,name:'cueChanged'}];
 if(process.argv.includes('--plan')) {
  fs.mkdirSync(workerRoot,{recursive:true});
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compilePersonStateModel(m.personstateRecipe(row.law,row.pressure,row.goal)),inputs=fx.ordered(fx.cases()[row.name]),run=await m.compilePersonStateInputs(model,fx.initialState,inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'personstate-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('same declared seed; inherited addressed dice for contested choices, no seed search'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/PERSONSTATE_PUBLIC_CONTRACT.md','docs/formal/PERSONSTATE_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-personstate-model-rev1/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/personstate'+n+'.ts'),'src/test/personstateFixtures.ts','src/test/personstatePublic.test.ts',...['cognitiveTransforms','cognitiveMath','cognitiveChoice','cognitiveArbitration'].map(n=>'src/campaign2/'+n+'.ts'),'src/campaign3/affectFactorComparison.ts','scripts/qualify-personstate-public.mjs'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'separate learned conduct impression and current-intent estimate feeding goal-relative appraisal; stable target policy is a research control, not general personality',initialState:hex(fx.initialState),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 8 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of worker===undefined?[]:plan.runs.filter((_,i)=>i%4===worker)) {
   const source=m.personstateRecipe(row.law,row.pressure,row.goal),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createPersonStateRun(await factory.preparePersonStateModel(source),{initialState:fx.initialState,orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restorePersonStateRun(source,{initialState:fx.initialState,orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodePersonState(run.snapshot().outputs),'list'),observerViews=[run.observerView(0),run.observerView(1)];
   views.set(`${row.law}/${row.pressure}/${row.goal}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.law}/${row.pressure}/${row.goal}/${row.name}: ${saves.length} exact prefixes`);
  }
  if(worker!==undefined){
   fs.writeFileSync(workerRoot+'/'+worker+'.json',JSON.stringify({planSha256:hash(fs.readFileSync(planPath)),results:rows,restores,advancing,views:[...views].map(([k,v])=>[k,{outputs:hex(canonical.canonicalEncode(canonical.list(v.outputs))),observerViews:v.observerViews.map(hex)}])},null,2)+'\n',{flag:'wx'});
  }else{
   await Promise.all([0,1,2,3].map(async i=>{const child=await execute(process.execPath,['scripts/qualify-personstate-public.mjs','--worker='+i],{maxBuffer:1024*1024});process.stdout.write(child.stdout);if(child.stderr)process.stderr.write(child.stderr);}));
   for(const i of [0,1,2,3]){const w=JSON.parse(fs.readFileSync(workerRoot+'/'+i+'.json'));assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));rows.push(...w.results);restores+=w.restores;advancing+=w.advancing;for(const [k,v] of w.views){assert(!views.has(k));views.set(k,{outputs:data.dataItems(codec.decodePersonState(Uint8Array.from(Buffer.from(v.outputs,'hex'))),'list'),observerViews:v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex')))});}}
   rows.sort((a,b)=>plan.runs.findIndex(r=>r.runIdentity===a.runIdentity)-plan.runs.findIndex(r=>r.runIdentity===b.runIdentity));assert.equal(rows.length,plan.runs.length);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,plan.runs.length);
  const math=await server.ssrLoadModule('/src/campaign3/personstateMath.ts'),choice=await server.ssrLoadModule('/src/campaign2/cognitiveChoice.ts');
  const get=(name,law=1,pressure=1,goal=1)=>views.get(law+'/'+pressure+'/'+goal+'/'+name),f=data.dataField,items=data.dataItems,key=data.dataKey;
  const records=(name,type,law=1,pressure=1,goal=1)=>get(name,law,pressure,goal).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),u=canonical.unsigned,list=canonical.list,q=canonical.rational;
  const apps=(name,i=1,law=1,pressure=1,goal=1)=>records(name,1153n,law,pressure,goal).filter(x=>key(f(x,3n))===key(m.HOLDERS[i]));
  const last=(name,i=1,law=1,pressure=1,goal=1)=>apps(name,i,law,pressure,goal)[3];
  const knowledge=(name,i=1,law=1,pressure=1,goal=1)=>f(records(name,1160n,law,pressure,goal).filter(x=>key(f(x,2n))===key(m.HOLDERS[i])).at(-1),4n);
  eq(f(last('main'),5n),list([q(2,3)]));eq(f(last('main'),6n),list([q(0,1)]));eq(f(last('main',2),5n),list([q(2,3)]));eq(f(last('main',2),6n),list([q(1,1)]));eq(f(records('main',1155n)[3],5n),list([true]));
  eq(f(last('main'),9n),list([q(1,1),q(1,1)]));eq(f(last('main',2),9n),list([q(0,1),q(0,1)]));eq(f(knowledge('main'),1n),f(knowledge('cueChanged'),1n));eq(f(last('cueChanged'),5n),f(last('main'),5n));eq(f(last('cueChanged'),9n),list([q(0,1),q(0,1)]));eq(apps('main').slice(0,3),apps('cueChanged').slice(0,3));
  eq(knowledge('main'),knowledge('main',1,1,1,2));for(const k of [5n,6n])eq(f(last('main'),k),f(last('main',1,1,1,2),k));eq(f(last('main',1,1,1,2),9n),list([q(0,1),q(0,1)]));
  eq(f(last('main',1,2),5n),list([q(1,2)]));eq(f(last('main',1,2),6n),list([q(1,2)]));eq(f(last('main',1,3),6n),list([q(2,3)]));eq(f(last('main',1,4),5n),list([]));eq(f(last('main',1,4),6n),list([q(0,1)]));assert.notDeepEqual(f(last('main',1,2),5n),f(last('cueChanged',1,2),5n));eq(f(last('main',1,3),6n),f(last('cueChanged',1,3),6n));
  eq(f(last('noHistory'),5n),list([]));eq(f(last('neutral'),5n),list([q(1,2)]));eq(f(last('negative'),5n),list([q(0,1)]));eq(f(last('missingCue'),6n),list([]));eq(f(last('missingCue'),9n),list([]));eq(f(apps('missingThenReturn')[2],6n),list([]));eq(f(last('missingThenReturn'),6n),list([q(0,1)]));
  for(const t of [425n,426n,1155n]){eq(records('main',t),records('failed',t));eq(records('main',t),records('cueChanged',t));eq(records('main',t),records('main',t,1,1,2));}eq(items(f(knowledge('failed'),1n),'list').length,0);eq(f(apps('main')[0],5n),list([]));eq(f(apps('main')[1],5n),list([q(1,1)]));eq(apps('main').slice(0,4),apps('visibleLast').slice(0,4));assert.notDeepEqual(f(knowledge('main'),1n),f(knowledge('visibleLast'),1n));
  for(const pressure of [1,3]){eq(get('main',1,pressure).observerViews,get('hiddenIntent',1,pressure).observerViews);eq(get('main',1,pressure).observerViews[1],get('noA',1,pressure).observerViews[1]);eq(get('main',1,pressure).observerViews[0],get('noB',1,pressure).observerViews[0]);eq(get('main',1,pressure).observerViews[0],get('otherCue',1,pressure).observerViews[0]);}
  eq(get('main').observerViews,get('main',1,2).observerViews);eq(get('missingCue').observerViews[0],get('deniedCueChange').observerViews[0]);assert.notDeepEqual(get('main',5).observerViews,get('hiddenIntent',5).observerViews);
  const draw=choice.chosenData(records('main',409n,1,3)[3]);assert.equal(items(f(draw,9n),'list').length,2);for(const p of items(f(draw,2n),'list'))eq(f(p,2n),q(1,2));
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:8,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
  }
 }
} finally {await server.close();}
