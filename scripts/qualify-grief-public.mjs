import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const execute=promisify(execFile),workerArg=process.argv.find(x=>x.startsWith('--worker=')),worker=workerArg===undefined?undefined:Number(workerArg.slice(9));
if(worker!==undefined)assert(Number.isInteger(worker)&&worker>=0&&worker<4);
const workerRoot='docs/planning/grief-public-workers-rev1';
const p='docs/planning/',planPath=p+'GRIEF_PUBLIC_PLAN_REV1.json',resultPath=p+'GRIEF_PUBLIC_RESULT_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/griefFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/griefModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/griefFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/griefCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const matrix=[...[[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[1,2]].map(([law,goal])=>({law,goal,name:'main'})),...Object.keys(fx.cases()).filter(n=>n!=='main').map(name=>({law:1,goal:1,name})),{law:5,goal:1,name:'hiddenReturn'},{law:2,goal:1,name:'temporary'},{law:3,goal:1,name:'noAlternative'}];
 if(process.argv.includes('--plan')) {
  fs.mkdirSync(workerRoot,{recursive:true});
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compileGriefModel(m.griefRecipe(row.law,row.goal)),inputs=fx.ordered(fx.cases()[row.name]),run=await m.compileGriefInputs(model,fx.initialState,inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'grief-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('same declared 32-byte seed13; this inference profile consumes no random draws'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/GRIEF_PUBLIC_CONTRACT.md','docs/formal/GRIEF_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-grief-model-rev1/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/grief'+n+'.ts'),'src/test/griefFixtures.ts','src/test/griefPublic.test.ts',...['cognitiveTransforms','cognitiveMath','cognitiveChoice','cognitiveArbitration'].map(n=>'src/campaign2/'+n+'.ts'),'src/campaign3/affectFactorComparison.ts','scripts/qualify-grief-public.mjs'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'admitted future-contact belief and acquired history distinguish temporary absence from bounded loss appraisal; false reports and corrections; prospective responses only',initialState:hex(fx.initialState),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 7 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of worker===undefined?[]:plan.runs.filter((_,i)=>i%4===worker)) {
   const source=m.griefRecipe(row.law,row.goal),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createGriefRun(await factory.prepareGriefModel(source),{initialState:fx.initialState,orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restoreGriefRun(source,{initialState:fx.initialState,orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodeGrief(run.snapshot().outputs),'list'),observerViews=[run.observerView(0),run.observerView(1)];
   views.set(`${row.law}/${row.goal}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.law}/${row.goal}/${row.name}: ${saves.length} exact prefixes`);
  }
  if(worker!==undefined){
   fs.writeFileSync(workerRoot+'/'+worker+'.json',JSON.stringify({planSha256:hash(fs.readFileSync(planPath)),results:rows,restores,advancing,views:[...views].map(([k,v])=>[k,{outputs:hex(canonical.canonicalEncode(canonical.list(v.outputs))),observerViews:v.observerViews.map(hex)}])},null,2)+'\n',{flag:'wx'});
  }else{
   await Promise.all([0,1,2,3].map(async i=>{const child=await execute(process.execPath,['scripts/qualify-grief-public.mjs','--worker='+i],{maxBuffer:1024*1024});process.stdout.write(child.stdout);if(child.stderr)process.stderr.write(child.stderr);}));
   for(const i of [0,1,2,3]){const w=JSON.parse(fs.readFileSync(workerRoot+'/'+i+'.json'));assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));rows.push(...w.results);restores+=w.restores;advancing+=w.advancing;for(const [k,v] of w.views){assert(!views.has(k));views.set(k,{outputs:data.dataItems(codec.decodeGrief(Uint8Array.from(Buffer.from(v.outputs,'hex'))),'list'),observerViews:v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex')))});}}
   rows.sort((a,b)=>plan.runs.findIndex(r=>r.runIdentity===a.runIdentity)-plan.runs.findIndex(r=>r.runIdentity===b.runIdentity));assert.equal(rows.length,plan.runs.length);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,plan.runs.length);
  const get=(name,law=1,goal=1)=>views.get(law+'/'+goal+'/'+name),f=data.dataField,key=data.dataKey,items=data.dataItems;
  const records=(name,type,law=1,goal=1)=>get(name,law,goal).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),list=canonical.list,q=canonical.rational,u=canonical.unsigned;
  const apps=(name,i=0,law=1,goal=1)=>records(name,1287n,law,goal).filter(x=>key(f(x,3n))===key(m.HOLDERS[i]));
  const lens=a=>[8n,9n,10n,11n].map(k=>f(a,k));
  const prob=(name,at=4,k=0,law=1,goal=1)=>{const p=records(name,1288n,law,goal).find(x=>key(f(f(x,2n),3n))===key(m.HOLDERS[0])&&key(f(f(x,2n),2n))===key(canonical.signed(at))&&key(f(x,3n))===key(u(k+1)));return f(items(f(p,6n),'list').find(x=>key(f(x,1n))===key(m.OPTIONS[0][k][0])),2n);};
  eq([8n,9n,10n,11n,12n,13n,14n].map(k=>f(apps('main')[3],k)),[1,1,1,0,0,1,0].map(n=>list([q(n,1)])));
  eq(prob('main'),q(7,9));eq(prob('main',4,1),q(1,2));eq(prob('temporary'),q(1,2));eq(prob('temporary',4,1),q(7,9));eq(prob('uncertain'),q(47,72));
  eq(f(apps('uncertain')[3],12n),list([q(1,2)]));eq(f(apps('uncertain')[3],10n),list([q(1,2)]));eq(f(apps('uncertain')[3],11n),list([q(1,2)]));
  for(const n of ['temporary','uncertain'])eq(f(apps(n)[3],5n),f(apps('main')[3],5n));
  eq(f(apps('oneSupport')[3],8n),list([q(1,2)]));eq(prob('oneSupport'),q(47,72));
  for(const n of ['selfSufficient','noHistory','witnessA']){eq(f(apps(n)[3],8n),list([q(0,1)]));eq(f(apps(n)[3],12n),list([q(0,1)]));eq(prob(n),q(1,2));}
  eq(f(apps('main')[7],9n),list([q(2,3)]));eq(f(apps('oneSupport')[7],9n),list([q(1,2)]));
  for(const n of ['noAlternative','noDemand']){eq(f(apps(n)[3],10n),f(apps('main')[3],10n));eq(prob(n),prob('main'));}
  eq(f(apps('noAlternative')[3],14n),list([q(1,1)]));eq(f(apps('present')[3],10n),list([q(0,1)]));eq(f(apps('present')[3],12n),list([q(0,1)]));eq(f(apps('present')[3],8n),list([q(1,1)]));
  for(const n of ['noReport','deniedReport']){eq(f(apps(n)[3],12n),list([]));eq(f(apps(n)[3],10n),list([]));eq(f(apps(n)[3],13n),list([q(1,1)]));}
  eq(f(apps('missingCue')[3],12n),list([q(0,1)]));eq(f(apps('missingCue')[3],10n),list([]));
  eq(f(apps('main')[7],12n),list([q(1,1)]));eq(prob('main',8),q(1,2));eq(prob('main',8,1),q(7,9));eq(f(apps('main')[3],5n),f(apps('main')[6],5n));
  for(const n of ['noCorrection','deniedCorrection','foreignCorrection']){eq(f(apps(n)[7],10n),list([q(1,1)]));eq(prob(n,8),q(7,9));eq(apps(n).slice(0,5),apps('main').slice(0,5));}
  eq(apps('main').filter(a=>key(f(a,4n))===key(m.TARGETS[0])),apps('otherTarget').filter(a=>key(f(a,4n))===key(m.TARGETS[0])));
  eq(prob('main',4,0,2),prob('temporary',4,0,2));eq(prob('main',4,1,2),q(7,9));eq(prob('main',4,0,3),q(1,2));eq(prob('noAlternative',4,0,3),q(7,9));
  for(const law of [2,3,6])eq(records('main',1289n),records('main',1289n,law));
  eq(f(apps('main',0,4)[3],12n),list([q(0,1)]));eq(f(apps('main',0,4)[3],10n),list([q(0,1)]));eq(f(apps('main',0,6)[3],12n),list([]));
  for(const t of [1280n,1281n,1287n,1289n])eq(records('main',t),records('main',t,1,2));for(const k of [0,1])eq(prob('main',4,k,1,2),q(1,2));
  for(const n of ['hiddenWorld','hiddenReturn','denied'])eq(get('main').observerViews,get(n).observerViews);eq(get('main').observerViews[1],get('noA').observerViews[1]);eq(get('main').observerViews[0],get('noB').observerViews[0]);assert.notDeepEqual(get('main',5).observerViews,get('hiddenReturn',5).observerViews);
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:7,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
  }
 }
} finally {await server.close();}
