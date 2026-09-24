import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'INFERENCE_CORRECTION_PUBLIC_PLAN_REV1.json',resultPath=p+'INFERENCE_CORRECTION_PUBLIC_RESULT_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const fx=await server.ssrLoadModule('/src/test/inferenceCorrectionFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/agencyModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/agencyFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/agencyCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {inferenceCorrectionReadout:readout}=await server.ssrLoadModule('/src/campaign3/inferenceCorrectionReadout.ts');
 const matrix=[...[1,2,3,4,5].map(law=>({law,name:'main'})),...Object.keys(fx.correctionCases()).filter(n=>n!=='main').map(name=>({law:1,name})),{law:2,name:'reordered'},{law:4,name:'hiddenBlock'}];
 if(process.argv.includes('--plan')) {
  const runs=[],models=[];
  for(const row of matrix) {
   const model=await m.compileAgencyModel(m.agencyRecipe(row.law)),inputs=fx.ordered(fx.correctionCases()[row.name]),run=await m.compileAgencyInputs(model,fx.initialState,inputs,fx.seed);
   models.push(model.modelIdentity);runs.push({...row,modelIdentity:hex(model.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),orderedInputs:hex(inputs),identity:run.runIdentity});
  }
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0','inference-correction-experiment/0.1-candidate','inference-correction-harness/0.1-candidate');
  const comparison=await ids.createComparisonCase(models,runs.map(r=>r.identity),canonical.list([canonical.text('same seed and resolution instant for unchanged decision inputs'),canonical.bytes(fx.seed)]));
  const paths=['docs/formal/INFERENCE_CORRECTION_EXPERIMENT.md','src/campaign3/inferenceCorrectionReadout.ts','src/test/inferenceCorrectionFixtures.ts','src/test/inferenceCorrection.test.ts','docs/formal/AGENCY_PUBLIC_CONTRACT.md','docs/formal/AGENCY_PUBLIC_ALLOCATION_TABLE.json',p+'campaign3-agency-model-rev3/FREEZE.json',...['Codecs','Model','Math','Runtime','Factory'].map(n=>'src/campaign3/agency'+n+'.ts'),'src/test/agencyFixtures.ts','src/test/agencyPublic.test.ts','src/test/agencyUnreceivedReport.test.ts','src/test/agencyPhaseContract.test.ts','scripts/qualify-inference-correction.mjs'];
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC QUALIFICATION',scope:'report-supported correction of the same observer-local obstruction proposition; no cause discovery, alternative diagnosis or calibrated trust',initialState:hex(fx.initialState),runSeed:hex(fx.seed),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),artifacts:paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),runs:runs.map(({identity,...r})=>r)},null,2)+'\n',{flag:'wx'});
  console.log(`Frozen ${runs.length} runs, 5 models, ExperimentIdentity and ComparisonCase.`);
 } else {
  assert(!fs.existsSync(resultPath));const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of plan.runs) {
   const source=m.agencyRecipe(row.law),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createAgencyRun(await factory.prepareAgencyModel(source),{initialState:fx.initialState,orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restoreAgencyRun(source,{initialState:fx.initialState,orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodeAgency(run.snapshot().outputs),'list'),observerViews=[run.observerView(0),run.observerView(1)];
   views.set(`${row.law}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.law}/${row.name}: ${saves.length} exact prefixes`);
  }
  const get=(name,law=1)=>views.get(law+'/'+name),f=data.dataField,rec=data.dataRecord,items=data.dataItems;
  const at=(name,time,law=1,observer=1,episode=1)=>readout(get(name,law).observerViews[observer],observer,episode).find(x=>x.at===BigInt(time));
  const fraction=x=>[String(x.numerator),String(x.denominator)];
  assert.deepEqual([3,5,7].map(t=>fraction(at('main',t))),[['1','1'],['1','2'],['1','3']]);
  assert.deepEqual(fraction(at('main',5,2)),['0','1']);assert.equal(at('main',7,3).diagnostic,'Unknown');
  assert.deepEqual(fraction(at('duplicate',7)),['1','2']);assert.deepEqual(fraction(at('noCorrection',7)),['1','1']);
  assert.deepEqual(fraction(at('wrongEpisode',7)),['1','1']);assert.deepEqual(fraction(at('wrongEpisode',7,1,1,2)),['0','2']);
  assert.equal(at('main',4).denominator,1n);assert.equal(at('main',6).denominator,2n);
  assert.deepEqual(get('main').observerViews,get('hiddenBlock').observerViews);
  assert.deepEqual(get('denied').observerViews[1],get('noCorrection').observerViews[1]);
  assert.notDeepEqual(get('main',4).observerViews[1],get('hiddenBlock',4).observerViews[1]);
  assert.equal(at('swapped',7,1,0).diagnostic,'SupportsAbsence');assert.equal(at('swapped',7).diagnostic,'Unknown');
  assert.equal(at('noInitialClaim',3).diagnostic,'Unknown');assert.equal(at('noInitialClaim',7).numerator,0n);
  assert.deepEqual(fraction(at('reordered',7)),['1','3']);assert.equal(at('reordered',7,2).diagnostic,'SupportsObstruction');
  const records=(name,t,law=1)=>get(name,law).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t);
  for(const t of [409n,425n,426n,974n,986n])assert.deepEqual(records('main',t),records('noCorrection',t));
  assert.equal(items(f(rec(f(records('main',986n,5)[0],3n),983n),1n),'list').length,0);
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:5,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:rows.length,restores,advancing}));
 }
} finally {await server.close();}
