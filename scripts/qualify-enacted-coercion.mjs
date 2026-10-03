import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'ENACTED_COERCION_PLAN_REV1.json',resultPath=p+'ENACTED_COERCION_RESULT_REV1.json',hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const visited=new Set();function visit(file){file=file.replaceAll('\\','/');if(visited.has(file))return;visited.add(file);for(const match of fs.readFileSync(file,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(file),match[1].split('?')[0]),child=[stem,stem+'.ts',path.join(stem,'index.ts')].find(f=>fs.existsSync(f)&&fs.statSync(f).isFile());assert(child,stem);visit(child);}}
for(const file of ['src/campaign3/enactedCoercion.ts','src/test/enactedCoercion.test.ts','src/test/enactedCoercionFixtures.ts','src/substrate/identity.ts'])visit(file);
const artifacts=[...visited,'docs/formal/ENACTED_COERCION_COMPONENT_CONTRACT.md','scripts/qualify-enacted-coercion.mjs'].sort().map(path=>({path,sha256:hash(fs.readFileSync(path))}));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/enactedCoercion.ts'),fx=await server.ssrLoadModule('/src/test/enactedCoercionFixtures.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),codec=await server.ssrLoadModule('/src/campaign3/receivingCodecs.ts');
 if(process.argv.includes('--plan')){
  const ids=await server.ssrLoadModule('/src/substrate/identity.ts'),rng=await server.ssrLoadModule('/src/substrate/random.ts'),models=new Map();
  for(const law of m.LAWS)models.set(law,await ids.createModelIdentity({rulesVersion:m.VERSION,contentSchemaVersion:m.VERSION,contentManifest:await ids.commitManifest(c.text(JSON.stringify(artifacts))),parameterSchemaVersion:m.VERSION,parameterSet:await ids.commitManifest(c.text(law)),numericProfileVersion:'inherited-exact-dice-millionth-identity-integer-mean',randomAlgorithmVersion:rng.RANDOM_ALGORITHM_VERSION,registrySchemaVersion:m.VERSION,registryManifest:await ids.commitManifest(c.list([]))}));
  const runs=[];for(const [law,model] of models)for(const [name,frames] of Object.entries(fx.coercionCases()))for(let seed=0;seed<8;seed++){
   const run=m.createCoercionRun(law,frames,seed),id=await ids.createRunIdentity({modelIdentity:model,initialState:await ids.commitManifest(codec.decodeReceiving(run.save())),orderedInputSequence:await ids.commitManifest(c.text(JSON.stringify(frames))),runSeed:new Uint8Array(32).fill(seed)});runs.push({law,name,seed,frames,modelIdentity:hex(model.canonicalBytes),runIdentity:hex(id.canonicalBytes),id});
  }
  assert.equal(runs.length,576);assert.equal(new Set(runs.map(x=>x.runIdentity)).size,576);
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'enacted-coercion-harness/0.1-candidate'),comparison=await ids.createComparisonCase([...models.values()],runs.map(x=>x.id),c.text('Six candidates, twelve controlled sources, every seed0..7. Actual refusal consequences precede admitted learning and later choice/qualification. All whole prefixes and immediate successors; no native scheduler claim.'));
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE QUALIFICATION',artifacts,models:[...models].map(([law,id])=>({law,modelIdentity:hex(id.canonicalBytes)})),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),runs:runs.map(({id,...x})=>x)},null,2)+'\n',{flag:'wx'});console.log('Frozen6 models/576 runs.');
 }else{
  const plan=JSON.parse(fs.readFileSync(planPath));assert.deepEqual(plan.artifacts,artifacts);assert(!fs.existsSync(resultPath));const results=[];
  for(const row of plan.runs){
   const run=m.createCoercionRun(row.law,row.frames,row.seed),saves=[run.save()];while(await run.step())saves.push(run.save());
   for(let prefix=0;prefix<=4;prefix++){const restored=await m.restoreCoercionRun(row.law,row.frames,row.seed,prefix,saves[prefix]);assert.deepEqual(restored.save(),saves[prefix]);assert.equal(await restored.step(),prefix<4);assert.deepEqual(restored.save(),saves[Math.min(prefix+1,4)]);}
   const state=run.snapshot();for(const x of state.rows){const frame=row.frames[x.at-1];assert(x.prior.every(e=>e.at<x.at&&e.holder===m.TARGET&&e.demander===x.demander));assert.equal(x.penaltyAttempt,x.executed==='refuse');assert.equal(x.loss,x.penaltyAttempt&&frame.power?frame.penalty:0);assert.equal(x.evidence!==null,x.penaltyAttempt&&frame.access);assert.equal(x.pressure,frame.demand&&row.law!=='NoPressure'?(x.anticipatedCost??0):0);if(x.evidence)assert.equal(x.evidence.cost,frame.display??x.loss);}
   assert.equal(state.resources,4000-state.rows.reduce((sum,x)=>sum+x.loss,0));const {frames,...identity}=row;results.push({...identity,prefixHashes:saves.map(hash),targetHash:hash(JSON.stringify(run.targetView())),state});if(results.length%64===0)console.log('Verified '+results.length+'/576 complete runs and original-prefix successors.');
  }
  const get=(name,seed,law='Threshold')=>results.find(r=>r.name===name&&r.seed===seed&&r.law===law),counts={probabilityChanges:0,choiceChanges:0,firstRefusals:0,firstCompliances:0,meanLatestDifferences:0,constrainedExpressions:0};
  for(let seed=0;seed<8;seed++){
   const a=get('main',seed).state.rows,b=get('withheld',seed).state.rows;
   counts.firstRefusals+=Number(a[0].choice.chosen==='refuse');counts.firstCompliances+=Number(a[0].choice.chosen==='comply');counts.probabilityChanges+=Number(JSON.stringify(a.map(x=>x.choice.probabilities))!==JSON.stringify(b.map(x=>x.choice.probabilities)));counts.choiceChanges+=Number(JSON.stringify(a.map(x=>x.choice.chosen))!==JSON.stringify(b.map(x=>x.choice.chosen)));
   counts.meanLatestDifferences+=Number(JSON.stringify(get('correction',seed).state.rows.map(x=>x.anticipatedCost))!==JSON.stringify(get('correction',seed,'Latest').state.rows.map(x=>x.anticipatedCost)));
   for(const law of m.LAWS){
    assert.equal(get('explicitHigh',seed,law).targetHash,get('hiddenPower',seed,law).targetHash);
    const main=get('main',seed,law).state.rows,failed=get('failedLater',seed,law).state.rows;
    assert.deepEqual(main[1].expression,failed[1].expression);assert.deepEqual(main[1].qualification,failed[1].qualification);
    assert.equal(get('otherDemander',seed,law).state.rows[1].anticipatedCost,null);
    assert.deepEqual(get('noDemand',seed,law).state.evidence,[]);
   }
   assert.deepEqual(a.map(x=>x.expression),get('main',seed,'IgnorePressure').state.rows.map(x=>x.expression));
   for(const x of a)if(x.pressure>=500){counts.constrainedExpressions++;assert.equal(x.qualification.contribution,'0/1');}
   assert.deepEqual(get('falseZero',seed).state.rows.map(x=>x.choice),b.map(x=>x.choice));
  }
  assert(counts.firstRefusals&&counts.firstCompliances&&counts.probabilityChanges&&counts.choiceChanges&&counts.constrainedExpressions&&counts.meanLatestDifferences);
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:6,runs:576,prefixes:2880,advancing:2304,terminal:576,counts,results},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(counts));
 }
}finally{await server.close();}
