import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/workbench-epi-parity-rev1',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(`${root}/receipt.json`),'immutable receipt exists');
const planPath='docs/planning/EPI_PUBLIC_EXPERIMENT_PLAN_REV1.json',resultPath='docs/planning/EPI_PUBLIC_EXPERIMENT_REV1.json';
const plan=JSON.parse(fs.readFileSync(planPath)),prior=JSON.parse(fs.readFileSync(resultPath));
const paths=['src/workbench/epiAdapter.ts','src/workbench/nativeTimeline.ts','scripts/check-workbench-epi.mjs'];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {EpiWorkbenchRun}=await server.ssrLoadModule('/src/workbench/epiAdapter.ts');
 const {epiRecipe}=await server.ssrLoadModule('/src/campaign3/epiModel.ts');
 const factory=await server.ssrLoadModule('/src/campaign3/epiFactory.ts');
 const {canonicalEncode,set}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const results=[];const views=new Map();
 for(const row of plan.runs){
  const id=`${row.law}/${row.numeric}/${row.name}`,adapter=await EpiWorkbenchRun.create(id);
  const native=await factory.createEpiRun(await factory.prepareEpiModel(epiRecipe(row.law,row.numeric)),{initialState:canonicalEncode(set([])),orderedInputs:Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),runSeed:new Uint8Array(32).fill(19)});
  const prefixes=[];
  do{
   const s=adapter.snapshot();assert.equal(s.saveHash,sha(native.save()));assert.equal(s.stateHash,sha(native.snapshot().state));
   assert.equal(s.characterOutputsHash,sha(native.characterView().outputs));assert.equal(s.characterStateHash,sha(native.characterView().state));
   prefixes.push({prefix:s.prefix,saveHash:s.saveHash,stateHash:s.stateHash,characterOutputsHash:s.characterOutputsHash,events:s.timeline.length});
   const a=await adapter.advance(),b=await native.settleNextInstant();assert.equal(a,b);if(!a)break;
  }while(prefixes.length<66);
  const s=adapter.snapshot(),old=prior.results.find(r=>r.name===row.name&&r.law===row.law&&r.numeric===row.numeric);
  assert.equal(s.complete,true);assert.equal(prefixes.length,old.prefixes);assert.equal(s.saveHash,old.saveSha256);assert.equal(s.characterOutputsHash,old.characterOutputsSha256);assert.equal(s.characterStateHash,old.stateSha256);
  views.set(id,s);results.push({id,lawfulCharacterAccess:s.lawfulCharacterAccess,prefixes});
 }
 for(const numeric of [1,2])for(const name of ['established','informative','fresh','missing']){
  const a=views.get(`1/${numeric}/${name}A`),b=views.get(`1/${numeric}/${name}B`);
  assert.equal(a.characterOutputs,b.characterOutputs);assert.equal(a.characterStateHash,b.characterStateHash);
  assert.notEqual(a.researchOutputs,b.researchOutputs);
 }
 for(const law of [2,3])for(const numeric of [1,2]){const a=views.get(`${law}/${numeric}/establishedA`),b=views.get(`${law}/${numeric}/establishedB`);assert.equal(a.lawfulCharacterAccess,false);assert.notEqual(a.characterOutputs,b.characterOutputs);}
 for(const source of sources)assert.equal(sha(fs.readFileSync(source.path)),source.sha256);
 fs.mkdirSync(root,{recursive:true});for(const source of sources){const target=`${root}/sources/${source.path}`;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(source.path),{flag:'wx'});}
 fs.writeFileSync(`${root}/receipt.json`,JSON.stringify({status:'PASS COMPLETE FROZEN EPI ADAPTER COHORT',sources,reference:[planPath,resultPath].map(path=>({path,sha256:sha(fs.readFileSync(path))})),runs:results.length,prefixes:results.reduce((n,r)=>n+r.prefixes.length,0),results,scope:['All72 frozen original EPI programs; seed19; six existing public models.','Safe character projection remains separate from raw researcher outputs.','Leak controls explicitly violating; no narrative renderer or browser qualification yet.','Complete-prefix restore tested separately; no arbitrary runtime intervention.']},null,2)+'\n',{flag:'wx'});
 console.log(`PASS ${results.length} EPI programs / ${results.reduce((n,r)=>n+r.prefixes.length,0)} exact prefixes`);
}finally{await server.close();}
