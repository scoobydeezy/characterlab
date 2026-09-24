import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const execute=promisify(execFile),workerArg=process.argv.find(x=>x.startsWith('--worker=')),worker=workerArg===undefined?undefined:Number(workerArg.slice(9));
if(worker!==undefined)assert(Number.isInteger(worker)&&worker>=0&&worker<4);
const workerRoot='docs/planning/interpretation-public-workers-rev1';
const p='docs/planning/',planPath=p+'INTERPRETATION_PUBLIC_PLAN_REV1.json',resultPath=p+'INTERPRETATION_PUBLIC_RESULT_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/interpretationFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/interpretationModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/interpretationFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/interpretationCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 // negative and misleading intentionally share inputs; one public RunIdentity covers both roles.
 const matrix=[...[[1,1],[1,2],[1,3],[2,1],[3,1],[4,1],[5,1],[6,1]].map(([law,pressure])=>({law,pressure,name:'main'})),...Object.keys(fx.cases()).filter(n=>n!=='main'&&n!=='misleading').map(name=>({law:1,pressure:1,name})),{law:1,pressure:2,name:'hiddenIntent'},{law:3,pressure:1,name:'hiddenIntent'},{law:2,pressure:1,name:'unknownContext'},{law:3,pressure:1,name:'unknownContext'},...['hiddenTruth','hiddenIntent','noA','noB','unknownBelief','deniedPrivateChange'].map(name=>({law:1,pressure:3,name}))];
 if(process.argv.includes('--plan')) {
  fs.mkdirSync(workerRoot,{recursive:true});
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compileInterpretationModel(m.interpretationRecipe(row.law,row.pressure)),inputs=fx.ordered(fx.cases()[row.name]),run=await m.compileInterpretationInputs(model,fx.initialState,inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'interpretation-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('same declared seed; inherited addressed dice for contested choices, no seed search'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/INTERPRETATION_PUBLIC_CONTRACT.md','docs/formal/INTERPRETATION_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-interpretation-model-rev1/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/interpretation'+n+'.ts'),'src/test/interpretationFixtures.ts','src/test/interpretationPublic.test.ts',...['cognitiveTransforms','cognitiveMath','cognitiveChoice','cognitiveArbitration'].map(n=>'src/campaign2/'+n+'.ts'),'scripts/qualify-interpretation-public.mjs'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'context-dependent interpretation of a chosen causal explanation through a controlled two-glyph channel; no general language or causal-discovery qualification',initialState:hex(fx.initialState),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 8 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of worker===undefined?[]:plan.runs.filter((_,i)=>i%4===worker)) {
   const source=m.interpretationRecipe(row.law,row.pressure),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createInterpretationRun(await factory.prepareInterpretationModel(source),{initialState:fx.initialState,orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restoreInterpretationRun(source,{initialState:fx.initialState,orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodeInterpretation(run.snapshot().outputs),'list'),observerViews=[run.observerView(0),run.observerView(1)];
   views.set(`${row.law}/${row.pressure}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.law}/${row.pressure}/${row.name}: ${saves.length} exact prefixes`);
  }
  if(worker!==undefined){
   fs.writeFileSync(workerRoot+'/'+worker+'.json',JSON.stringify({planSha256:hash(fs.readFileSync(planPath)),results:rows,restores,advancing,views:[...views].map(([k,v])=>[k,{outputs:hex(canonical.canonicalEncode(canonical.list(v.outputs))),observerViews:v.observerViews.map(hex)}])},null,2)+'\n',{flag:'wx'});
  }else{
   await Promise.all([0,1,2,3].map(async i=>{const child=await execute(process.execPath,['scripts/qualify-interpretation-public.mjs','--worker='+i],{maxBuffer:1024*1024});process.stdout.write(child.stdout);if(child.stderr)process.stderr.write(child.stderr);}));
   for(const i of [0,1,2,3]){const w=JSON.parse(fs.readFileSync(workerRoot+'/'+i+'.json'));assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));rows.push(...w.results);restores+=w.restores;advancing+=w.advancing;for(const [k,v] of w.views){assert(!views.has(k));views.set(k,{outputs:data.dataItems(codec.decodeInterpretation(Uint8Array.from(Buffer.from(v.outputs,'hex'))),'list'),observerViews:v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex')))});}}
   rows.sort((a,b)=>plan.runs.findIndex(r=>r.runIdentity===a.runIdentity)-plan.runs.findIndex(r=>r.runIdentity===b.runIdentity));assert.equal(rows.length,plan.runs.length);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,plan.runs.length);
  const math=await server.ssrLoadModule('/src/campaign3/interpretationMath.ts'),choice=await server.ssrLoadModule('/src/campaign2/cognitiveChoice.ts');
  const get=(name,law=1,pressure=1)=>views.get(law+'/'+pressure+'/'+name),f=data.dataField,items=data.dataItems,key=data.dataKey;
  const records=(name,type,law=1,pressure=1)=>get(name,law,pressure).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),u=canonical.unsigned,list=canonical.list,q=canonical.rational;
  const knowledge=(name,i,law=1,pressure=1)=>f(records(name,1126n,law,pressure).filter(v=>key(f(v,2n))===key(m.HOLDERS[i])).at(-1),4n),value=(name,i,law=1,pressure=1)=>math.estimate(knowledge(name,i,law,pressure),law===5);
  const meanings=(name,i,law=1,pressure=1)=>records(name,1130n,law,pressure).filter(v=>key(f(f(v,2n),2n))===key(m.HOLDERS[i]));
  for(const x of records('main',1124n))eq(f(x,5n),list([u(1)]));eq(f(records('main',1121n)[0],5n),list([true]));eq(f(meanings('main',1)[0],3n),list([true]));eq(f(meanings('main',2)[0],3n),list([false]));eq(f(meanings('main',2)[1],3n),list([true]));
  eq(value('main',1),list([q(2,3)]));eq(value('main',2),list([q(1,3)]));eq(value('main',1,5),list([q(0,1)]));eq(value('main',1,2),list([q(1,1)]));eq(records('main',1129n),records('main',1129n,2));eq(f(meanings('main',1)[2],3n),list([false]));eq(f(meanings('main',1,2)[2],3n),list([true]));
  eq(value('correct',2),list([q(2,3)]));eq(value('unknownContext',1),list([]));eq(items(f(knowledge('unknownContext',1),1n),'list').length,3);eq(value('unknownContext',1,2),list([q(1,1)]));eq(value('unknownContext',1,3),list([q(2,3)]));
  eq(value('negative',1),list([q(0,1)]));eq(f(records('negative',1125n)[0],3n),true);eq(f(records('negative',1121n)[0],5n),f(meanings('negative',1)[0],3n));
  for(const name of ['failed','unknownSpeaker','unknownBelief','noA'])eq(value(name,1),list([]));eq(value('noB',2),list([]));eq(value('main',1,1,2),list([]));for(const t of [425n,426n,1121n])eq(records('main',t),records('failed',t));
  eq(records('main',1130n),records('main',1130n,4));eq(value('main',1,4),list([]));eq(value('main',1,6),list([]));eq(items(f(knowledge('main',1,6),1n),'list').length,3);
  for(const pressure of [1,3]){for(const name of ['hiddenTruth','hiddenIntent'])eq(get('main',1,pressure).observerViews,get(name,1,pressure).observerViews);eq(get('main',1,pressure).observerViews[1],get('noA',1,pressure).observerViews[1]);eq(get('main',1,pressure).observerViews[0],get('noB',1,pressure).observerViews[0]);eq(get('unknownBelief',1,pressure).observerViews,get('deniedPrivateChange',1,pressure).observerViews);}
  eq(get('main',1,2).observerViews,get('hiddenIntent',1,2).observerViews);eq(records('main',1129n,3),records('hiddenIntent',1129n,3));assert.notDeepEqual(get('main',3).observerViews,get('hiddenIntent',3).observerViews);
  for(const out of records('main',409n,1,3)){const d=choice.chosenData(out);assert.equal(items(f(d,9n),'list').length,2);for(const p of items(f(d,2n),'list'))eq(f(p,2n),q(1,2));}
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:8,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
  }
 }
} finally {await server.close();}
