// Current admission control, not a reconstruction of the unarchived failed materializer.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const dir='docs/planning/campaign3-attention-model-rev2',freeze=JSON.parse(fs.readFileSync(dir+'/FREEZE.json'));
const bytes=p=>new Uint8Array(Buffer.from(fs.readFileSync(p,'utf8').trim(),'hex'));
const fp=p=>({path:p,sha256:createHash('sha256').update(fs.readFileSync(p)).digest('hex')});
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,watch:null},appType:'custom'});
try{
 const f=await server.ssrLoadModule('/src/campaign3/attentionFactory.ts'),c=await server.ssrLoadModule('/src/campaign3/attentionCodecs.ts'),d=await server.ssrLoadModule('/src/campaign2/canonicalData.ts');
 const name='role-k1-channel-13',source={...freeze.versions,...Object.fromEntries(['content','registry','parameters'].map(k=>[k,bytes(`${dir}/${name}/${k}.cenc.hex`)]))};
 const handle=await f.prepareAttentionModel(source),ordinary={initialState:bytes(dir+'/initial-state.cenc.hex'),orderedInputs:bytes(dir+'/input-base.cenc.hex'),runSeed:new Uint8Array(Buffer.from(freeze.seed,'hex'))};
 assert.equal(ordinary.runSeed.length,32);const run=await f.createAttentionRun(handle,ordinary);
 assert.equal(d.dataKey(c.decodeAttention(run.runIdentity())),freeze.runs.find(r=>r.model===name&&r.scene==='base').runIdentity);
 const rejected=[];for(const length of [0,4,31,33]){
  let caught;try{await f.createAttentionRun(handle,{...ordinary,runSeed:new Uint8Array(length)});}catch(error){caught=error;}
  assert(caught,`seed length ${length} must reject`);rejected.push({length,name:caught.name,message:caught.message});
 }
 const result={status:'PASS',scope:'Current factory seed-length admission only; no settlement, historical failed-script recovery or new public matrix.',acceptedSeedBytes:32,rejected,sources:[dir+'/FREEZE.json','src/campaign3/attentionFactory.ts','src/substrate/identity.ts','scripts/check-history-attention-seed-admission.mjs'].map(fp)};
 const out='docs/planning/campaign3-history-attention-routing-rev1/seed-admission.json';
 if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
 console.log({accepted:32,rejected:rejected.map(x=>x.length)});
}finally{await server.close();}
