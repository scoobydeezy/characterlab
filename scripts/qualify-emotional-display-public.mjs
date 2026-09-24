import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const execute=promisify(execFile),workerArg=process.argv.find(x=>x.startsWith('--worker=')),worker=workerArg===undefined?undefined:Number(workerArg.slice(9));
if(worker!==undefined)assert(Number.isInteger(worker)&&worker>=0&&worker<4);
const workerRoot='docs/planning/emotionalDisplay-public-workers-rev1';
const p='docs/planning/',planPath=p+'EMOTIONAL_DISPLAY_PUBLIC_PLAN_REV1.json',resultPath=p+'EMOTIONAL_DISPLAY_PUBLIC_RESULT_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/emotionalDisplayFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/emotionalDisplayModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/emotionalDisplayFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/emotionalDisplayCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const matrix=[...[[1,1,2],[1,2,2],[1,3,2],[2,2,2],[3,2,2],[4,2,2],[5,2,2],[6,2,2],[1,2,0],[1,2,1]].map(([law,pressure,severity])=>({law,pressure,severity,name:'main'})),...Object.keys(fx.cases()).filter(n=>n!=='main').map(name=>({law:1,pressure:2,severity:2,name})),{law:2,pressure:2,severity:2,name:'interior'},{law:4,pressure:2,severity:2,name:'noChannels'},...['hiddenTruth','noA','noB','unknown','deniedChange'].map(name=>({law:1,pressure:3,severity:2,name}))];
 if(process.argv.includes('--plan')) {
  fs.mkdirSync(workerRoot,{recursive:true});
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compileEmotionalDisplayModel(m.emotionalDisplayRecipe(row.law,row.pressure,row.severity)),inputs=fx.ordered(fx.cases()[row.name]),run=await m.compileEmotionalDisplayInputs(model,fx.initialState,inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'emotionalDisplay-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('same declared seed; inherited addressed dice for contested choices, no seed search'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/EMOTIONAL_DISPLAY_PUBLIC_CONTRACT.md','docs/formal/EMOTIONAL_DISPLAY_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-emotional-display-model-rev1/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/emotionalDisplay'+n+'.ts'),'src/test/emotionalDisplayFixtures.ts','src/test/emotionalDisplayPublic.test.ts',...['cognitiveTransforms','cognitiveMath','cognitiveChoice','cognitiveArbitration'].map(n=>'src/campaign2/'+n+'.ts'),'scripts/qualify-emotional-display-public.mjs','src/campaign3/affectFactorComparison.ts'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'private distress, chosen semantic assertion and independently observable emotional cue; controlled conditional evidence, no physiology or trust qualification',initialState:hex(fx.initialState),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 10 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of worker===undefined?[]:plan.runs.filter((_,i)=>i%4===worker)) {
   const source=m.emotionalDisplayRecipe(row.law,row.pressure,row.severity),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createEmotionalDisplayRun(await factory.prepareEmotionalDisplayModel(source),{initialState:fx.initialState,orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restoreEmotionalDisplayRun(source,{initialState:fx.initialState,orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodeEmotionalDisplay(run.snapshot().outputs),'list'),observerViews=[run.observerView(0),run.observerView(1)];
   views.set(`${row.law}/${row.pressure}/${row.severity}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.law}/${row.pressure}/${row.severity}/${row.name}: ${saves.length} exact prefixes`);
  }
  if(worker!==undefined){
   fs.writeFileSync(workerRoot+'/'+worker+'.json',JSON.stringify({planSha256:hash(fs.readFileSync(planPath)),results:rows,restores,advancing,views:[...views].map(([k,v])=>[k,{outputs:hex(canonical.canonicalEncode(canonical.list(v.outputs))),observerViews:v.observerViews.map(hex)}])},null,2)+'\n',{flag:'wx'});
  }else{
   await Promise.all([0,1,2,3].map(async i=>{const child=await execute(process.execPath,['scripts/qualify-emotional-display-public.mjs','--worker='+i],{maxBuffer:1024*1024});process.stdout.write(child.stdout);if(child.stderr)process.stderr.write(child.stderr);}));
   for(const i of [0,1,2,3]){const w=JSON.parse(fs.readFileSync(workerRoot+'/'+i+'.json'));assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));rows.push(...w.results);restores+=w.restores;advancing+=w.advancing;for(const [k,v] of w.views){assert(!views.has(k));views.set(k,{outputs:data.dataItems(codec.decodeEmotionalDisplay(Uint8Array.from(Buffer.from(v.outputs,'hex'))),'list'),observerViews:v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex')))});}}
   rows.sort((a,b)=>plan.runs.findIndex(r=>r.runIdentity===a.runIdentity)-plan.runs.findIndex(r=>r.runIdentity===b.runIdentity));assert.equal(rows.length,plan.runs.length);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,plan.runs.length);
  const math=await server.ssrLoadModule('/src/campaign3/emotionalDisplayMath.ts'),choice=await server.ssrLoadModule('/src/campaign2/cognitiveChoice.ts');
  const get=(name,law=1,pressure=2,severity=2)=>views.get(law+'/'+pressure+'/'+severity+'/'+name),f=data.dataField,items=data.dataItems;
  const records=(name,type,law=1,pressure=2,severity=2)=>get(name,law,pressure,severity).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),list=canonical.list,q=canonical.rational;
  const knowledge=(name,i,law=1,pressure=2,severity=2)=>f(records(name,1110n,law,pressure,severity).filter(v=>data.dataKey(f(v,2n))===data.dataKey(m.HOLDERS[i])).at(-1),4n);
  const value=(name,i,cue=false,law=1,pressure=2,severity=2)=>math.estimate(knowledge(name,i,law,pressure,severity),cue);
  eq(records('main',1113n),records('main',1113n,1,1));eq(f(records('main',1105n)[0],5n),list([false]));eq(f(records('main',1105n,1,1)[0],5n),list([true]));for(const v of records('calm',1105n))eq(f(v,5n),list([false]));
  eq(f(records('main',1113n)[0],8n),list([q(1,1),q(1,1)]));eq(f(records('calm',1113n)[0],8n),list([q(0,1),q(0,1)]));eq(f(records('main',1113n,1,2,0)[0],8n),list([q(0,1),q(0,1)]));eq(f(records('main',1113n,1,2,1)[0],8n),list([q(1,2),q(1,2)]));
  eq(f(records('reserve',1113n)[0],6n),list([q(0,1)]));eq(f(records('reserve',1113n)[0],8n),list([q(1,2),q(1,2)]));eq(f(records('control',1113n)[2],7n),list([q(1,1)]));eq(f(records('control',1113n)[2],8n),list([q(1,1),q(0,1)]));
  for(const name of ['unknown','missingContext','unknownControl'])for(const a of records(name,1113n))eq(f(a,8n),list([]));
  for(const t of [425n,426n,1105n])eq(records('main',t),records('failed',t));eq(value('failed',1),list([]));eq(value('failed',1,true),list([q(1,1)]));eq(value('noDisplay',1,true),list([]));eq(value('calm',1,true),list([q(0,1)]));
  eq(value('noChannels',1),list([]));eq(value('noChannels',1,true),list([]));eq(value('noChannels',1,true,4),list([q(1,1)]));eq(value('main',1,true,5),list([q(0,1)]));eq(value('main',1,true,3),list([]));
  eq(f(records('interior',1108n)[1],6n),list([q(1,4)]));eq(f(records('interior',1108n,2)[1],6n),list([q(0,1)]));
  eq(value('split',1),list([q(0,1)]));eq(value('split',1,true),list([]));eq(value('split',2),list([]));eq(value('split',2,true),list([q(1,1)]));eq(records('main',1100n),records('main',1100n,6));eq(value('main',1,true,6),list([]));
  for(const out of records('main',409n,1,3)){const d=choice.chosenData(out);assert.equal(items(f(d,9n),'list').length,2);for(const p of items(f(d,2n),'list'))eq(f(p,2n),q(1,2));}
  for(const pressure of [2,3]){eq(get('main',1,pressure).observerViews,get('hiddenTruth',1,pressure).observerViews);eq(get('main',1,pressure).observerViews[1],get('noA',1,pressure).observerViews[1]);eq(get('main',1,pressure).observerViews[0],get('noB',1,pressure).observerViews[0]);eq(get('unknown',1,pressure).observerViews,get('deniedChange',1,pressure).observerViews);}
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:10,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
  }
 }
} finally {await server.close();}
