import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',hex=b=>Buffer.from(b).toString('hex'),hash=b=>createHash('sha256').update(b).digest('hex'),read=f=>JSON.parse(fs.readFileSync(p+f));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/craving.ts'),fx=await server.ssrLoadModule('/src/test/cravingFixtures.ts'),body=await server.ssrLoadModule('/src/test/bodyOwnershipFixtures.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),d=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),codec=await server.ssrLoadModule('/src/campaign3/embodiedCodecs.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),random=await server.ssrLoadModule('/src/substrate/random.ts');
 async function sources(){
  const base=body.bodyCases().find(x=>x.name==='depleted-refill'),results={},packets={};
  for(const [name,amount,model] of [['depleted',2,'baseline'],['hidden6',6,'baseline'],['hidden9',9,'baseline'],['full',100,'baseline'],['denied',2,'denied']]){
   const initialState=c.canonicalEncode(c.set(d.dataItems(codec.decodeEmbodied(base.initialState),'set').map(v=>{const value=d.dataField(v,2n);if(value.kind!=='record'||value.schema.typeId!==454n)return v;return c.record(v.schema,new Map([...v.fields,[2n,c.record(value.schema,new Map([...value.fields,[1n,c.rational(amount,1)]]))]]));})));
   const result=await body.runBodyCase({...base,name,model,initialState},true);results[name]=result;
   const records=d.dataItems(codec.decodeEmbodied(Buffer.from(result.sourceOutputs,'hex')),'list').filter(v=>v.kind==='record'&&v.schema.typeId===464n);
   assert.equal(records.length,2);const observer=d.dataKey(d.dataField(records[0],2n));assert(records.every(v=>d.dataKey(d.dataField(v,2n))===observer));
   packets[name]={observer,pressures:result.probes.map(v=>v.mediated==='Unavailable'?null:v.mediated)};
  }
  assert.equal(new Set(Object.values(packets).map(v=>v.observer)).size,1);assert.deepEqual(packets.hidden6,packets.hidden9);
  return {status:'PASS',publicRuns:5,publicPrefixes:Object.values(results).reduce((n,v)=>n+v.prefixes,0),packets,results};
 }
 if(process.argv.includes('--sources')){const value=await sources();fs.writeFileSync(p+'CRAVING_SOURCES_REV1.json',JSON.stringify(value,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(value.packets));}
 else{
  const source=read('CRAVING_SOURCES_REV1.json'),cases=fx.cravingCases(source.packets),observer=source.packets.depleted.observer;
  const paths=['docs/formal/CRAVING_COMPONENT_CONTRACT.md','src/campaign3/craving.ts','src/test/cravingFixtures.ts','src/test/craving.test.ts','src/test/bodyOwnershipFixtures.ts','src/test/embodiedFixtures.ts','src/campaign3/embodiedRuntime.ts','scripts/qualify-craving.mjs',p+'CRAVING_SOURCES_REV1.json'];
  const artifacts=paths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),models=[],runs=[];
  for(const law of m.LAWS){const identity=await ids.createModelIdentity({rulesVersion:m.VERSION,contentSchemaVersion:m.VERSION,contentManifest:await ids.commitManifest(c.text(JSON.stringify({observer,artifacts}))),parameterSchemaVersion:m.VERSION,parameterSet:await ids.commitManifest(c.text(law)),numericProfileVersion:'exact-rational/craving',randomAlgorithmVersion:random.RANDOM_ALGORITHM_VERSION,registrySchemaVersion:m.VERSION,registryManifest:await ids.commitManifest(c.list([]))});models.push({law,identity});
   for(const [name,frames] of Object.entries(cases)){const runIdentity=await ids.createRunIdentity({modelIdentity:identity,initialState:await ids.commitManifest(c.list([])),orderedInputSequence:await ids.commitManifest(c.text(JSON.stringify(frames))),runSeed:new Uint8Array(32)});runs.push({law,name,frames,modelIdentity:hex(identity.canonicalBytes),identity:runIdentity});}
  }
  const uniqueRuns=[...new Map(runs.map(r=>[hex(r.identity.canonicalBytes),r])).values()];
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.VERSION,'craving-harness/0.1-candidate'),comparison=await ids.createComparisonCase(models.map(x=>x.identity),uniqueRuns.map(x=>x.identity),c.text('four laws; whole15-case roster; same observer public pressure plus fallible reports'));
  const plan={status:'FROZEN BEFORE QUALIFICATION',observer,artifacts,models:models.map(x=>({law:x.law,identity:hex(x.identity.canonicalBytes)})),experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),runs:uniqueRuns.map(({identity,...x})=>({...x,runIdentity:hex(identity.canonicalBytes)})),comparisons:runs.map(({identity,...x})=>({...x,runIdentity:hex(identity.canonicalBytes)}))};assert.equal(plan.runs.length,56);assert.equal(plan.comparisons.length,60);
  if(process.argv.includes('--plan')){fs.writeFileSync(p+'CRAVING_PLAN_REV1.json',JSON.stringify(plan,null,2)+'\n',{flag:'wx'});console.log('Frozen4 component models/56 distinct runs/60 comparison rows.');}
  else{
   assert.deepEqual(read('CRAVING_PLAN_REV1.json'),plan);assert(!fs.existsSync(p+'CRAVING_RESULT_REV1.json'));assert.deepEqual(await sources(),source);
   const results=[];let prefixes=0;
   for(const row of runs){const run=m.createCravingRun(row.law,observer,row.frames),saves=[],snapshots=[];for(let i=0;i<=4;i++){saves.push(run.save());snapshots.push(run.snapshot());if(i<4)assert(run.step());}
    for(let i=0;i<=4;i++){const restored=m.restoreCravingRun(row.law,observer,row.frames,saves[i]);assert.deepEqual(restored.snapshot(),snapshots[i]);for(let j=i+1;j<=4;j++){assert(restored.step());assert.deepEqual(restored.snapshot(),snapshots[j]);}assert.deepEqual(restored.save(),saves[4]);assert.equal(restored.step(),false);prefixes++;}
    results.push({law:row.law,name:row.name,modelIdentity:row.modelIdentity,runIdentity:hex(row.identity.canonicalBytes),prefixHashes:saves.map(hash),snapshot:run.snapshot()});
   }
   const get=(law,name)=>results.find(x=>x.law===law&&x.name===name).snapshot;
   for(const law of m.LAWS){assert.deepEqual(get(law,'mixed'),get(law,'falseReports'));assert.deepEqual(get(law,'hidden6'),get(law,'hidden9'));assert.deepEqual(get(law,'noCue').history,get(law,'mixed').history);assert(get(law,'denied').rows.every(r=>r.urge===null));for(const name of ['unavailable','restrained']){assert.deepEqual(get(law,name).rows.map(r=>r.urge),get(law,'mixed').rows.map(r=>r.urge));assert(get(law,name).rows.every(r=>!r.eligible));}}
   assert.notEqual(get('MeanProduct','mixed').rows[2].urge,get('MeanBottleneck','mixed').rows[2].urge);
   fs.writeFileSync(p+'CRAVING_RESULT_REV1.json',JSON.stringify({status:'PASS',models:4,runs:56,comparisonRows:60,distinctPrefixes:280,componentPrefixes:prefixes,advancing:240,terminal:60,publicRuns:5,publicPrefixes:source.publicPrefixes,planSha256:hash(fs.readFileSync(p+'CRAVING_PLAN_REV1.json')),results},null,2)+'\n',{flag:'wx'});console.log('PASS4 models/56 distinct runs/60 comparisons/300 component prefix checks;5 public body runs/'+source.publicPrefixes+' public prefixes.');
  }
 }
}finally{await server.close();}
