import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const execute=promisify(execFile),workerArg=process.argv.find(x=>x.startsWith('--worker=')),worker=workerArg===undefined?undefined:Number(workerArg.slice(9));
if(worker!==undefined)assert(Number.isInteger(worker)&&worker>=0&&worker<4);
const workerRoot='docs/planning/attributed-public-workers-rev1';
const p='docs/planning/',planPath=p+'ATTRIBUTED_PUBLIC_PLAN_REV1.json',resultPath=p+'ATTRIBUTED_PUBLIC_RESULT_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/attributedFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/attributedModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/attributedFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/attributedCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const matrix=[...[[1,1],[1,2],[1,3],[2,1],[3,1],[4,1]].map(([law,pressure])=>({law,pressure,name:'main'})),...Object.keys(fx.cases()).filter(n=>n!=='main').map(name=>({law:1,pressure:1,name})),...['hiddenTarget','targetAbsent'].map(name=>({law:4,pressure:1,name})),{law:2,pressure:1,name:'reportChange'},{law:1,pressure:2,name:'hiddenTarget'},...['hiddenTruth','hiddenTarget','targetAbsent','otherReport','deniedReceipt','failed'].map(name=>({law:1,pressure:3,name}))];
 if(process.argv.includes('--plan')) {
  fs.mkdirSync(workerRoot,{recursive:true});
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compileAttributedModel(m.attributedRecipe(row.law,row.pressure)),inputs=fx.ordered(fx.cases()[row.name]),run=await m.compileAttributedInputs(model,fx.initialState,inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'attributed-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('same declared seed; inherited addressed dice for contested choices, no seed search'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/ATTRIBUTED_PUBLIC_CONTRACT.md','docs/formal/ATTRIBUTED_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-attributed-model-rev1/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/attributed'+n+'.ts'),'src/test/attributedFixtures.ts','src/test/attributedPublic.test.ts',...['cognitiveTransforms','cognitiveMath','cognitiveChoice','cognitiveArbitration'].map(n=>'src/campaign2/'+n+'.ts'),'scripts/qualify-attributed-public.mjs'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'fallible observer-owned target-belief reports consumed by actual explanation choice; no general mentalizing or factive knowledge claim',initialState:hex(fx.initialState),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 6 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of worker===undefined?[]:plan.runs.filter((_,i)=>i%4===worker)) {
   const source=m.attributedRecipe(row.law,row.pressure),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createAttributedRun(await factory.prepareAttributedModel(source),{initialState:fx.initialState,orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restoreAttributedRun(source,{initialState:fx.initialState,orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodeAttributed(run.snapshot().outputs),'list'),observerViews=[run.observerView(0),run.observerView(1),run.observerView(2)];
   views.set(`${row.law}/${row.pressure}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.law}/${row.pressure}/${row.name}: ${saves.length} exact prefixes`);
  }
  if(worker!==undefined){
   fs.writeFileSync(workerRoot+'/'+worker+'.json',JSON.stringify({planSha256:hash(fs.readFileSync(planPath)),results:rows,restores,advancing,views:[...views].map(([k,v])=>[k,{outputs:hex(canonical.canonicalEncode(canonical.list(v.outputs))),observerViews:v.observerViews.map(hex)}])},null,2)+'\n',{flag:'wx'});
  }else{
   await Promise.all([0,1,2,3].map(async i=>{const child=await execute(process.execPath,['scripts/qualify-attributed-public.mjs','--worker='+i],{maxBuffer:1024*1024});process.stdout.write(child.stdout);if(child.stderr)process.stderr.write(child.stderr);}));
   for(const i of [0,1,2,3]){const w=JSON.parse(fs.readFileSync(workerRoot+'/'+i+'.json'));assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));rows.push(...w.results);restores+=w.restores;advancing+=w.advancing;for(const [k,v] of w.views){assert(!views.has(k));views.set(k,{outputs:data.dataItems(codec.decodeAttributed(Uint8Array.from(Buffer.from(v.outputs,'hex'))),'list'),observerViews:v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex')))});}}
   rows.sort((a,b)=>plan.runs.findIndex(r=>r.runIdentity===a.runIdentity)-plan.runs.findIndex(r=>r.runIdentity===b.runIdentity));assert.equal(rows.length,plan.runs.length);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,plan.runs.length);
  const math=await server.ssrLoadModule('/src/campaign3/attributedMath.ts'),choice=await server.ssrLoadModule('/src/campaign2/cognitiveChoice.ts');
  const get=(name,law=1,pressure=1)=>views.get(law+'/'+pressure+'/'+name),f=data.dataField,items=data.dataItems,key=data.dataKey;
  const records=(name,type,law=1,pressure=1)=>get(name,law,pressure).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),u=canonical.unsigned,list=canonical.list,q=canonical.rational;
  const knowledge=(name,i,law=1,pressure=1)=>f(records(name,1143n,law,pressure).filter(v=>key(f(v,2n))===key(m.HOLDERS[i])).at(-1),4n);
  const purposes=(name,law=1,pressure=1)=>records(name,1138n,law,pressure).map(x=>f(x,4n));
  const probes=(name,i,law=1,pressure=1)=>records(name,1136n,law,pressure).filter(x=>key(f(x,3n))===key(m.HOLDERS[i]));
  eq(purposes('main'),[u(2),u(2),u(1)]);eq(purposes('reportChange'),[u(1),u(1),u(1)]);eq(purposes('main',2),[u(2),u(2),u(2)]);
  eq(probes('main',0).map(x=>f(x,5n)),probes('reportChange',0).map(x=>f(x,5n)));eq(probes('main',1).map(x=>f(x,5n)),[list([false]),list([false]),list([false])]);
  eq(knowledge('failed',1),knowledge('reportChangeFixed',1));assert.notDeepEqual(purposes('failed'),purposes('reportChangeFixed'));eq(probes('main',0).map(x=>f(x,6n)),[u(3),u(3),u(2)]);eq(probes('main',2).map(x=>f(x,6n)),[u(2),u(2),u(2)]);
  eq(math.attribution(knowledge('unknown',0),1),0);eq(math.attribution(knowledge('ignorance',0),1),1);eq(purposes('ignorance'),[u(1),u(1),u(1)]);eq(math.attribution(knowledge('noNewReport',0),1),3);eq(items(f(f(knowledge('noNewReport',0),2n),4n),'list').length,1);eq(math.attribution(knowledge('main',0,3),3),0);
  eq(math.claim(knowledge('main',1)),list([true]));eq(math.claim(knowledge('failed',1)),list([false]));eq(math.claim(knowledge('deniedReceipt',1)),list([false]));for(const t of [425n,426n,1138n]){eq(records('main',t),records('failed',t));eq(records('main',t),records('deniedReceipt',t));}
  eq(purposes('unknownOwn'),[u(2),u(2),u(2)]);eq(records('negativeOwn',1138n).slice(0,2).map(x=>f(x,5n)),[list([false]),list([false])]);
  for(const pressure of [1,3]){for(const name of ['hiddenTruth','hiddenTarget','targetAbsent','deniedReceipt','failed'])for(const i of [0,2])eq(get('main',1,pressure).observerViews[i],get(name,1,pressure).observerViews[i]);eq(get('main',1,pressure).observerViews[0],get('otherReport',1,pressure).observerViews[0]);}
  eq(get('unknownOwn').observerViews[0],get('deniedOwnChange').observerViews[0]);eq(get('main',1,2).observerViews[0],get('hiddenTarget',1,2).observerViews[0]);assert.notDeepEqual(get('main',4).observerViews[0],get('hiddenTarget',4).observerViews[0]);assert.notDeepEqual(get('main',4).observerViews[0],get('targetAbsent',4).observerViews[0]);
  for(const out of records('main',409n,1,3)){const d=choice.chosenData(out);assert.equal(items(f(d,9n),'list').length,2);for(const p of items(f(d,2n),'list'))eq(f(p,2n),q(1,2));}
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:6,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
  }
 }
} finally {await server.close();}
