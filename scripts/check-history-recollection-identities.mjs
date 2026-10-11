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

  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compileRecollectionModel(m.recollectionRecipe(row.law)),inputs=fx.ordered(fx.cases()[row.name]),run=await m.compileRecollectionInputs(model,fx.initialState,inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'recollection-public-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('deterministic ordinary planner; same seed, no random draws'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/RECOLLECTION_PUBLIC_CONTRACT.md','docs/formal/RECOLLECTION_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-recollection-model-rev1/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/recollection'+n+'.ts'),'src/test/recollectionFixtures.ts','src/test/recollectionPublic.test.ts','scripts/qualify-recollection-public.mjs'];
  const actual={status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'routine episodic fragmentation and category-default reconstruction; no general recognition, importance or downstream behavior qualification',initialState:hex(fx.initialState),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)};assert.deepEqual(actual,JSON.parse(fs.readFileSync(planPath)));
  const path='docs/planning/campaign3-history-memory-access-rev1/recollection-identities.json',v={status:'PASS',models:5,runs:20,scope:'Whole original REV2 plan including canonical model/run/experiment/comparison, empty initial state, seed, inputs and source bindings',planSha256:hash(fs.readFileSync(planPath)),checkerSha256:hash(fs.readFileSync('scripts/check-history-recollection-identities.mjs'))};if(fs.existsSync(path))assert.deepEqual(JSON.parse(fs.readFileSync(path)),v);else fs.writeFileSync(path,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 5 models, ExperimentIdentity and ComparisonCase.`);

} finally {await server.close();}
