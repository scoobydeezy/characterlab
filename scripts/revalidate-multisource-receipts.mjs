/** Current-code whole-save equality after decoder hardening; no new law/model. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const destination='docs/planning/MULTISOURCE_FINAL_REEXECUTION_REV1.json';assert(!fs.existsSync(destination));
const freeze=JSON.parse(fs.readFileSync('docs/planning/campaign3-multisource-model-rev2/FREEZE.json','utf8')),main=JSON.parse(fs.readFileSync('docs/planning/MULTISOURCE_PUBLIC_EXPERIMENT_REV1.json','utf8')),extra=JSON.parse(fs.readFileSync('docs/planning/MULTISOURCE_PUBLIC_INTERVENTIONS_REV1.json','utf8'));
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'}),hash=b=>createHash('sha256').update(b).digest('hex'),unhex=s=>new Uint8Array(Buffer.from(s.trim(),'hex'));
try{
 const {prepareMultisourceModel,createMultisourceRun}=await server.ssrLoadModule('/src/campaign3/multisourceFactory.ts'),results=[];
 const cases=[...main.results.map(r=>({name:r.name,imageName:r.name,expected:r.checkpoints.at(-1).saveSha256})),...extra.results.map(r=>({name:r.name,imageName:r.imageName,expected:r.saveSha256,initialState:unhex(r.initialState),orderedInputs:unhex(r.orderedInputs)}))];
 for(const c of cases){const image=freeze.models.find(m=>m.name===c.imageName),load=name=>unhex(fs.readFileSync(image.files.find(f=>f.path.endsWith('/'+name+'.cenc.hex')).path,'utf8'));
  const source={...freeze.versions,content:load('content'),registry:load('registry'),parameters:load('parameters')},model=await prepareMultisourceModel(source),run=await createMultisourceRun(model,{initialState:c.initialState??load('initial-state'),orderedInputs:c.orderedInputs??load('ordered-inputs'),runSeed:new Uint8Array(32).fill(7)});
  while(await run.settleNextInstant()){}const actual=hash(run.save());assert.equal(actual,c.expected,c.name);results.push({name:c.name,wholeSaveSha256:actual});if(results.length%10===0)console.log('Current-code whole-save equality '+results.length+'/62');
 }
 fs.writeFileSync(destination,JSON.stringify({date:'2026-09-20',disposition:'PASS; all accepted public runs reproduce the prior complete save bytes under the final explicit inherited-slot validator',runs:results.length,distinctModelIdentities:new Set(freeze.models.map(m=>m.modelIdentity)).size,codecSha256:hash(fs.readFileSync('src/campaign3/multisourcePublicCodecs.ts')),results},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
