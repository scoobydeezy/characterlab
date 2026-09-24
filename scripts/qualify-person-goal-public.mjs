import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const execute=promisify(execFile),workerArg=process.argv.find(x=>x.startsWith('--worker=')),worker=workerArg===undefined?undefined:Number(workerArg.slice(9));
if(worker!==undefined)assert(Number.isInteger(worker)&&worker>=0&&worker<4);
const workerRoot='docs/planning/personGoal-public-workers-rev1';
const p='docs/planning/',planPath=p+'PERSON_GOAL_PUBLIC_PLAN_REV1.json',resultPath=p+'PERSON_GOAL_PUBLIC_RESULT_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/personGoalFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/personGoalModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/personGoalFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/personGoalCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const matrix=[...[[1,1],[2,1],[3,1],[4,1],[1,2]].map(([law,goal])=>({law,goal,name:'main'})),...Object.keys(fx.cases()).filter(n=>n!=='main').map(name=>({law:1,goal:1,name})),{law:4,goal:1,name:'privacy'},{law:4,goal:1,name:'hiddenGoal'},{law:2,goal:1,name:'failed'}];
 if(process.argv.includes('--plan')) {
  fs.mkdirSync(workerRoot,{recursive:true});
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compilePersonGoalModel(m.personGoalRecipe(row.law,row.goal)),inputs=fx.ordered(fx.cases()[row.name]),run=await m.compilePersonGoalInputs(model,fx.initialState,inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'person-goal-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('same declared 32-byte seed13; this inference profile consumes no random draws'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/PERSON_GOAL_PUBLIC_CONTRACT.md','docs/formal/PERSON_GOAL_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-person-goal-model-rev1/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/personGoal'+n+'.ts'),'src/test/personGoalFixtures.ts','src/test/personGoalPublic.test.ts',...['cognitiveTransforms','cognitiveMath','cognitiveChoice','cognitiveArbitration'].map(n=>'src/campaign2/'+n+'.ts'),'src/campaign3/affectFactorComparison.ts','scripts/qualify-person-goal-public.mjs'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'target adopted desired state, ordinary strategy, attempted route, achieved outcome and observer goal inference; observer appraisal only',initialState:hex(fx.initialState),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 5 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of worker===undefined?[]:plan.runs.filter((_,i)=>i%4===worker)) {
   const source=m.personGoalRecipe(row.law,row.goal),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createPersonGoalRun(await factory.preparePersonGoalModel(source),{initialState:fx.initialState,orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restorePersonGoalRun(source,{initialState:fx.initialState,orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodePersonGoal(run.snapshot().outputs),'list'),observerViews=[run.observerView(0),run.observerView(1)];
   views.set(`${row.law}/${row.goal}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.law}/${row.goal}/${row.name}: ${saves.length} exact prefixes`);
  }
  if(worker!==undefined){
   fs.writeFileSync(workerRoot+'/'+worker+'.json',JSON.stringify({planSha256:hash(fs.readFileSync(planPath)),results:rows,restores,advancing,views:[...views].map(([k,v])=>[k,{outputs:hex(canonical.canonicalEncode(canonical.list(v.outputs))),observerViews:v.observerViews.map(hex)}])},null,2)+'\n',{flag:'wx'});
  }else{
   await Promise.all([0,1,2,3].map(async i=>{const child=await execute(process.execPath,['scripts/qualify-person-goal-public.mjs','--worker='+i],{maxBuffer:1024*1024});process.stdout.write(child.stdout);if(child.stderr)process.stderr.write(child.stderr);}));
   for(const i of [0,1,2,3]){const w=JSON.parse(fs.readFileSync(workerRoot+'/'+i+'.json'));assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));rows.push(...w.results);restores+=w.restores;advancing+=w.advancing;for(const [k,v] of w.views){assert(!views.has(k));views.set(k,{outputs:data.dataItems(codec.decodePersonGoal(Uint8Array.from(Buffer.from(v.outputs,'hex'))),'list'),observerViews:v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex')))});}}
   rows.sort((a,b)=>plan.runs.findIndex(r=>r.runIdentity===a.runIdentity)-plan.runs.findIndex(r=>r.runIdentity===b.runIdentity));assert.equal(rows.length,plan.runs.length);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,plan.runs.length);
  const get=(name,law=1,goal=1)=>views.get(law+'/'+goal+'/'+name),f=data.dataField,key=data.dataKey;
  const records=(name,type,law=1,goal=1)=>get(name,law,goal).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),list=canonical.list,q=canonical.rational,u=canonical.unsigned;
  const js=(name,i=0,law=1,goal=1)=>records(name,1186n,law,goal).filter(x=>key(f(x,3n))===key(m.HOLDERS[i]));
  const apps=(name,i=0,law=1,goal=1)=>records(name,1187n,law,goal).filter(x=>key(f(f(x,2n),3n))===key(m.HOLDERS[i]));
  eq(js('main').map(x=>f(x,6n)),[list([]),list([]),list([q(1,2)]),list([q(1,4)]),list([q(9,10)])]);eq(f(js('main',1)[3],6n),list([q(3,4)]));eq(f(apps('main')[3],5n),list([q(3,4),q(3,4)]));
  eq(records('main',1181n).map(x=>f(x,4n)),[0,1,2,4,1].map(u));for(const g of records('main',1191n))eq(g,records('main',1191n)[0]);
  eq(js('main').map(x=>f(x,6n)),js('alternate').map(x=>f(x,6n)));assert.notDeepEqual(records('main',1181n),records('alternate',1181n));eq(records('main',1191n),records('alternate',1191n));
  eq(f(js('failed')[4],6n),list([q(3,4)]));for(const [name,law] of [['failed',2],['unavailable',1],['unknown',1],['main',3]])for(const j of js(name,0,law))eq(f(j,6n),list([]));eq(records('failed',1190n),records('main',1190n));
  for(const t of [1181n,1190n,1182n,1183n,1186n,1188n,1191n])eq(records('main',t),records('main',t,1,2));eq(f(apps('main',0,1,2)[3],5n),list([q(1,4),q(1,4)]));
  eq(js('main').slice(0,3),js('accurate').slice(0,3));eq(f(js('accurate')[3],6n),list([q(3,4)]));eq(records('main',1182n),records('accurate',1182n));eq(f(js('main',0,2)[4],6n),list([q(3,4)]));
  eq(f(js('noAction')[4],6n),list([q(3,4)]));eq(f(js('noOutcome')[4],6n),list([q(3,4)]));
  eq(get('privacy').observerViews,get('hiddenGoal').observerViews);eq(get('privacy').observerViews,get('deniedMirror').observerViews);eq(get('main').observerViews[1],get('noA').observerViews[1]);for(const n of ['noB','otherMirror'])eq(get('main').observerViews[0],get(n).observerViews[0]);assert.notDeepEqual(get('privacy',4).observerViews,get('hiddenGoal',4).observerViews);
  eq(f(js('privacy',0,4)[1],6n),list([q(1,1)]));eq(f(js('hiddenGoal',0,4)[1],6n),list([q(0,1)]));
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:5,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
  }
 }
} finally {await server.close();}
