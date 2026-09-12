import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';import {attentionModelTools} from './attention-model-tools.mjs';
const folder='docs/planning/attention-model-review-rev2';assert(!fs.existsSync(folder));
const fp=p=>({path:p,sha256:createHash('sha256').update(fs.readFileSync(p)).digest('hex')});
const freeze=JSON.parse(fs.readFileSync('docs/formal/ATTENTION_ALLOCATION_FREEZE_AUDIT.json'));for(const f of [...freeze.artifacts,freeze.numericReview,freeze.shape])assert.deepEqual(fp(f.path),f);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{const t=await attentionModelTools(server),{createModelIdentity,createRunIdentity,commitManifest}=await server.ssrLoadModule('/src/substrate/identity.ts'),enc=t.c.canonicalEncode,hex=v=>Buffer.from(v).toString('hex'),models=[],runs=[];fs.mkdirSync(folder);
 const state=t.c.list([]),seed=Uint8Array.from({length:32},(_,i)=>i+1);fs.writeFileSync(folder+'/initial-state.cenc.hex',hex(enc(state))+'\n');
 for(const scene of t.d.scenes)fs.writeFileSync(folder+'/input-'+scene.name+'.cenc.hex',hex(enc(t.original(scene)))+'\n');
 for(const m of t.d.models){const source=t.source(m.name),slots=t.decode(source.registry).items;assert.equal(slots.length,6);for(const k of ['content','registry','parameters'])assert.equal(hex(enc(t.decode(source[k]))),hex(source[k]));
  const identity=await createModelIdentity({...source,contentManifest:await commitManifest(t.decode(source.content)),registryManifest:await commitManifest(t.decode(source.registry)),parameterSet:await commitManifest(t.decode(source.parameters))});const dir=folder+'/'+m.name;fs.mkdirSync(dir);const files=[];
  for(const [name,bytes] of Object.entries({content:source.content,registry:source.registry,parameters:source.parameters,'model-identity':identity.canonicalBytes})){const p=dir+'/'+name+'.cenc.hex';fs.writeFileSync(p,hex(bytes)+'\n');files.push(fp(p));}
  models.push({...m,modelIdentity:hex(identity.canonicalBytes),files,descriptors:slots[0].items.filter(r=>r.schema.typeId===172n).length,registryEntries:slots[0].items.filter(r=>r.schema.typeId===171n).length});
  for(const scene of t.d.scenes){const run=await createRunIdentity({modelIdentity:identity,initialState:await commitManifest(state),orderedInputSequence:await commitManifest(t.original(scene)),runSeed:seed});runs.push({model:m.name,scene:scene.name,runIdentity:hex(run.canonicalBytes)});}
 }
 assert.equal(new Set(models.map(m=>m.modelIdentity)).size,32);assert.equal(new Set(runs.map(r=>r.runIdentity)).size,224);
 fs.writeFileSync(folder+'/REVIEW.json',JSON.stringify({status:'MATERIALIZED PROPOSAL; NOT FROZEN OR ACTIVATED',versions:t.versions,models,runs,seed:hex(seed),sharedFiles:['initial-state',...t.d.scenes.map(s=>'input-'+s.name)].map(n=>fp(folder+'/'+n+'.cenc.hex')),sources:['scripts/attention-model-tools.mjs','scripts/materialize-attention-models.mjs','docs/formal/ATTENTION_ALLOCATION_TABLE.json','docs/formal/ATTENTION_PUBLIC_SHAPE_MANIFEST.json'].map(fp)},null,2)+'\n');console.log({models:models.length,runs:runs.length,descriptors:models[0].descriptors,registryEntries:models[0].registryEntries});
}finally{await server.close();}
