import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/workbench-learn-parity-rev1',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(`${root}/receipt.json`),'immutable receipt exists');
const planPath='docs/planning/LEARN_PUBLIC_EXPERIMENT_PLAN_REV1.json',resultPath='docs/planning/LEARN_PUBLIC_EXPERIMENT_REV1.json';
const plan=JSON.parse(fs.readFileSync(planPath)),prior=JSON.parse(fs.readFileSync(resultPath));
const paths=['src/workbench/learnAdapter.ts','src/workbench/nativeTimeline.ts','src/workbench/canonical.ts','scripts/check-workbench-learn.mjs'];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {LearnWorkbenchRun}=await server.ssrLoadModule('/src/workbench/learnAdapter.ts');
 const {learnRecipe}=await server.ssrLoadModule('/src/campaign3/learnModel.ts');
 const factory=await server.ssrLoadModule('/src/campaign3/learnFactory.ts');
 const {canonicalEncode,canonicalDecode,set,RecordSchemaRegistry}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {learnSupportedSchemas}=await server.ssrLoadModule('/src/campaign3/learnCodecs.ts');
 const {nativeTimeline}=await server.ssrLoadModule('/src/workbench/nativeTimeline.ts');
 const {exactText}=await server.ssrLoadModule('/src/workbench/canonical.ts');
 const registry=new RecordSchemaRegistry(learnSupportedSchemas()),decode=b=>canonicalDecode(b,registry);
 const results=[],views=new Map();
 for(const row of plan.runs){
  const id=`${row.law}/${row.numeric}/${row.name}`,adapter=await LearnWorkbenchRun.create(id);
  const native=await factory.createLearnRun(await factory.prepareLearnModel(learnRecipe(row.law,row.numeric)),{initialState:canonicalEncode(set([])),orderedInputs:Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),runSeed:new Uint8Array(32)});
  const prefixes=[];
  do{
   const s=adapter.snapshot(),n=native.snapshot();
   assert.equal(s.saveHash,sha(native.save()));assert.equal(s.stateHash,sha(n.state));assert.equal(s.outputsHash,sha(n.outputs));
   assert.equal(s.researchOutputs,exactText(decode(n.outputs)));assert.deepEqual(s.timeline,nativeTimeline(decode(n.trace).items));
   prefixes.push({prefix:s.prefix,saveHash:s.saveHash,stateHash:s.stateHash,outputsHash:s.outputsHash,events:s.timeline.length});
   const a=await adapter.advance(),b=await native.settleNextInstant();assert.equal(a,b);if(!a)break;
  }while(prefixes.length<66);
  const s=adapter.snapshot(),old=prior.results.find(r=>r.name===row.name&&r.law===row.law&&r.numeric===row.numeric);
  assert.equal(s.complete,true);assert.equal(prefixes.length,old.prefixes);assert.equal(s.saveHash,old.finalSaveSha256);assert.equal(s.outputsHash,old.outputsSha256);assert.equal(s.stateHash,old.stateSha256);
  views.set(id,s);results.push({id,prefixes});console.log(`PASS ${id}: ${prefixes.length} prefixes`);
 }
 for(const law of [1,2,3])for(const numeric of [1,2]){
  const a=views.get(`${law}/${numeric}/repeated`),b=views.get(`${law}/${numeric}/hidden`);
  assert.equal(a.outputsHash,b.outputsHash);assert.equal(a.stateHash,b.stateHash);
  assert.notEqual(a.saveHash,b.saveHash);
 }
 for(const source of sources)assert.equal(sha(fs.readFileSync(source.path)),source.sha256);
 fs.mkdirSync(root,{recursive:true});for(const source of sources){const target=`${root}/sources/${source.path}`;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(source.path),{flag:'wx'});}
 fs.writeFileSync(`${root}/receipt.json`,JSON.stringify({status:'PASS COMPLETE FROZEN LEARN ADAPTER COHORT',sources,reference:[planPath,resultPath].map(path=>({path,sha256:sha(fs.readFileSync(path))})),runs:results.length,prefixes:results.reduce((n,r)=>n+r.prefixes.length,0),results,scope:['All39 frozen original LEARN programs; seed0; six existing public models.','Researcher diagnostics only; no character-safe projection or narrative asserted.','Point and bound behavior, missing evidence and unknown posterior remain native.','Quantization witnesses remain in Record892; empty generic trace list is not absence of quantization.','Adapter complete-prefix restore tested separately; no browser or batch qualification.']},null,2)+'\n',{flag:'wx'});
 console.log(`PASS ${results.length} LEARN programs / ${results.reduce((n,r)=>n+r.prefixes.length,0)} exact prefixes`);
}finally{await server.close();}
