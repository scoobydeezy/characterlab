import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',hex=b=>Buffer.from(b).toString('hex'),hash=b=>createHash('sha256').update(b).digest('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/toleranceEffect.ts'),fx=await server.ssrLoadModule('/src/test/toleranceFixtures.ts'),factory=await server.ssrLoadModule('/src/campaign2/factory.ts'),first=await server.ssrLoadModule('/src/campaign2/firstTraceModel.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),math=await server.ssrLoadModule('/src/substrate/exactMath.ts'),random=await server.ssrLoadModule('/src/substrate/random.ts');
 const source=first.firstTraceModel(),model=await factory.prepareCampaign2Model(source),publicModel=hex(factory.campaign2ModelIdentity(model));
 const paths=['docs/formal/TOLERANCE_EFFECT_CONTRACT.md','src/campaign3/toleranceEffect.ts','src/campaign3/embodiedMath.ts','src/test/toleranceFixtures.ts','src/test/toleranceEffect.test.ts','src/campaign2/firstTraceModel.ts','src/campaign2/adaptationEvaluation.ts','src/campaign2/factory.ts','scripts/qualify-tolerance.mjs'];
 const artifacts=paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),models=[],runs=[];
 for(const law of m.LAWS){
  const identity=await ids.createModelIdentity({rulesVersion:m.VERSION,contentSchemaVersion:m.VERSION,contentManifest:await ids.commitManifest(c.text(JSON.stringify({publicModel,artifacts,capacity:10,dose:1}))),parameterSchemaVersion:m.VERSION,parameterSet:await ids.commitManifest(c.text(law)),numericProfileVersion:'exact-rational/tolerance-component',randomAlgorithmVersion:random.RANDOM_ALGORITHM_VERSION,registrySchemaVersion:m.VERSION,registryManifest:await ids.commitManifest(c.list([]))});models.push({law,identity});
  for(const row of fx.CASES){const runId=await ids.createRunIdentity({modelIdentity:identity,initialState:await ids.commitManifest(c.bytes(fx.toleranceInitial(row.other))),orderedInputSequence:await ids.commitManifest(c.list([c.bytes(fx.toleranceInputs(row.counts)),c.unsigned(row.before),row.wrong])),runSeed:new Uint8Array(32)});runs.push({...row,law,identity:runId,modelIdentity:hex(identity.canonicalBytes)});}
 }
 const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'tolerance-challenge-harness/0.1-candidate'),comparison=await ids.createComparisonCase(models.map(x=>x.identity),runs.map(x=>x.identity),c.text('all three laws; six fixed four-occurrence timelines; world-only later challenges'));
 const plan={status:'FROZEN BEFORE QUALIFICATION',date:'2026-09-26',scope:m.VERSION,artifacts,publicModel,models:models.map(x=>({law:x.law,identity:hex(x.identity.canonicalBytes)})),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),runs:runs.map(({identity,...row})=>({...row,runIdentity:hex(identity.canonicalBytes)}))};
 assert.equal(new Set(plan.runs.map(x=>x.runIdentity)).size,18);
 if(process.argv.includes('--plan')){fs.writeFileSync(p+'TOLERANCE_PLAN_REV1.json',JSON.stringify(plan,null,2)+'\n',{flag:'wx'});console.log('Frozen3 component models/18 runs.');}
 else{
  assert.deepEqual(JSON.parse(fs.readFileSync(p+'TOLERANCE_PLAN_REV1.json')),plan);assert(!fs.existsSync(p+'TOLERANCE_RESULT_REV1.json'));
  const results=[];let prefixes=0,advancing=0;
  const q=x=>`${x.numerator}/${x.denominator}`;
  for(const row of runs){
   const inputs=fx.toleranceInputs(row.counts),run=await factory.createCampaign2Run(model,{initialState:fx.toleranceInitial(row.other),orderedInputs:inputs,runSeed:new Uint8Array(32)}),saves=[],snapshots=[],views=[];
   const view=x=>{const v=m.challengeTolerance(x.snapshot().state,row.wrong?fx.otherToleranceKey:fx.toleranceKey,row.law,math.ExactRational.of(1n),math.ExactRational.of(BigInt(row.before)));return Object.fromEntries(Object.entries(v).map(([k,v])=>[k,typeof v==='bigint'?String(v):q(v)]));};
   for(let i=0;i<=4;i++){saves.push(run.save());snapshots.push(run.snapshot());views.push(view(run));if(i<4)assert.equal(await run.settleNextInstant(),true);}
   for(let i=0;i<=4;i++){
    const restored=await factory.restoreCampaign2Run(source,{orderedInputs:inputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);assert.deepEqual(restored.snapshot(),snapshots[i]);assert.deepEqual(view(restored),views[i]);
    for(let j=i+1;j<=4;j++){assert.equal(await restored.settleNextInstant(),true);assert.deepEqual(restored.snapshot(),snapshots[j]);assert.deepEqual(view(restored),views[j]);}assert.deepEqual(restored.save(),saves[4]);prefixes++;if(i<4)advancing++;
   }
   results.push({name:row.name,law:row.law,modelIdentity:row.modelIdentity,runIdentity:hex(row.identity.canonicalBytes),prefixHashes:saves.map(hash),snapshotHashes:snapshots.map(s=>hash(JSON.stringify(s,(_,v)=>typeof v==='bigint'?String(v):v))),views});
  }
  const get=(law,name)=>results.find(x=>x.law===law&&x.name===name).views;
  for(const law of m.LAWS){
   assert.deepEqual(get(law,'repeated'),get(law,'otherLeaves'));
   assert.deepEqual(get(law,'otherKey'),get(law,'naive'));
   assert.deepEqual(get(law,'spaced').map(v=>v.tolerance),['0','1','1','2','2']);
   assert(get(law,'saturated').every(v=>v.applied==='0/1'&&v.overflow===v.potential));
  }
  assert.deepEqual(get('Reciprocal','repeated').map(v=>v.potential),['1/1','1/2','1/3','1/4','1/5']);
  assert.deepEqual(get('Linear','repeated').map(v=>v.potential),['1/1','9/10','4/5','7/10','3/5']);
  assert(get('Unattenuated','repeated').every(v=>v.potential==='1/1'));
  fs.writeFileSync(p+'TOLERANCE_RESULT_REV1.json',JSON.stringify({status:'PASS',scope:m.VERSION,planSha256:hash(fs.readFileSync(p+'TOLERANCE_PLAN_REV1.json')),models:3,runs:18,prefixes,advancing,terminal:prefixes-advancing,results},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({status:'PASS',models:3,runs:18,prefixes,advancing}));
 }
}finally{await server.close();}
