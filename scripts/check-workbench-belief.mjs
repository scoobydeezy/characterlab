import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-belief-parity-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),bytes=s=>Uint8Array.from(Buffer.from(s,'hex'));
assert(!fs.existsSync(`${root}/receipt.json`),'immutable receipt exists');
const planPath='docs/planning/BELIEF_EXPERIMENT_PLAN_REV1.json',resultPath='docs/planning/BELIEF_PUBLIC_EXPERIMENT_REV1.json',plan=JSON.parse(fs.readFileSync(planPath)),prior=JSON.parse(fs.readFileSync(resultPath));
const paths=['src/workbench/beliefAdapter.ts','src/workbench/nativeTimeline.ts','src/workbench/canonical.ts','scripts/check-workbench-belief.mjs'];const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {BeliefWorkbenchRun}=await server.ssrLoadModule('/src/workbench/beliefAdapter.ts');const {beliefRecipe}=await server.ssrLoadModule('/src/campaign3/beliefModel.ts');const factory=await server.ssrLoadModule('/src/campaign3/beliefFactory.ts');
 const {canonicalDecode,RecordSchemaRegistry}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),{beliefSupportedSchemas}=await server.ssrLoadModule('/src/campaign3/beliefCodecs.ts');const registry=new RecordSchemaRegistry(beliefSupportedSchemas()),decode=b=>canonicalDecode(b,registry);
 const {exactText}=await server.ssrLoadModule('/src/workbench/canonical.ts'),{nativeTimeline}=await server.ssrLoadModule('/src/workbench/nativeTimeline.ts');
 const results=[],views=new Map();
 for(const row of plan.runs){
  const adapter=await BeliefWorkbenchRun.create(row.name),native=await factory.createBeliefRun(await factory.prepareBeliefModel(beliefRecipe(row.law,row.goal)),{initialState:bytes(plan.initialState),orderedInputs:bytes(row.orderedInputs),runSeed:bytes(plan.runSeed)}),old=prior.results.find(r=>r.name===row.name),prefixes=[];
  do{const s=adapter.snapshot(),n=native.snapshot();assert.equal(s.saveHash,sha(native.save()));assert.equal(s.saveHash,old.prefixes[s.prefix].saveSha256);assert.equal(s.stateHash,sha(n.state));assert.equal(s.outputsHash,sha(n.outputs));assert.equal(s.admittedOutputs,exactText(decode(n.outputs)));assert.deepEqual(s.timeline,nativeTimeline(decode(n.trace).items));
   prefixes.push({prefix:s.prefix,saveHash:s.saveHash,stateHash:s.stateHash,outputsHash:s.outputsHash,events:s.timeline.length});
   const a=await adapter.advance(),b=await native.settleNextInstant();assert.equal(a,b);if(!a)break;
  }while(prefixes.length<34);
  const s=adapter.snapshot();assert.equal(s.complete,true);assert.equal(prefixes.length,old.prefixes.length);assert.equal(s.saveHash,old.finalSaveSha256);assert.equal(s.outputsHash,old.safeOutputSha256);assert.equal(s.stateHash,old.stateSha256);
  views.set(row.name,s);results.push({id:row.name,prefixes});
 }
 for(const law of [1,2,3]){
  const a=views.get(`misleading-law-${law}`),b=views.get(`hidden-law-${law}`);assert.equal(a.outputsHash,b.outputsHash);assert.equal(a.stateHash,b.stateHash);assert.notEqual(a.saveHash,b.saveHash);
  for(const goal of [0,1])assert.equal(a.stateHash,views.get(`goal-${goal}-law-${law}`).stateHash);
  assert.equal(views.get(`independent-law-${law}`).outputsHash,views.get(`permuted-law-${law}`).outputsHash);
 }
 const prefixes=results.reduce((n,r)=>n+r.prefixes.length,0);assert.equal(results.length,48);assert.equal(prefixes,381);
 for(const source of sources){assert.equal(sha(fs.readFileSync(source.path)),source.sha256);const target=`${root}/sources/${source.path}`;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(source.path),{flag:'wx'});}
 fs.writeFileSync(`${root}/receipt.json`,JSON.stringify({status:'PASS COMPLETE FROZEN BELIEF ADAPTER COHORT',sources,reference:[planPath,resultPath].map(path=>({path,sha256:sha(fs.readFileSync(path))})),runs:results.length,prefixes,results,scope:['48 frozen original programs; seed7; all381 retained save hashes.','Admitted outputs separate from researcher state and raw trace.','Hidden-world output/state, goal-independent belief and target permutation equalities preserved.','No browser, narrative or batch qualification yet; complete-tail checkpoint behavior tested separately.']},null,2)+'\n',{flag:'wx'});console.log(`PASS48 BELIEF programs/${prefixes} exact prefixes`);
}finally{await server.close();}
