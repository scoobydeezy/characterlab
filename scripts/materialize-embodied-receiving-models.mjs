import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
import {embodiedReceivingDeclarationTools} from './embodied-receiving-declaration-tools.mjs';
const folder='docs/planning/embodied-receiving-model-review-rev1';assert(!fs.existsSync(folder));
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'}),fp=p=>({path:p,sha256:createHash('sha256').update(fs.readFileSync(p)).digest('hex')});
try{
 const t=await embodiedReceivingDeclarationTools(server),{createModelIdentity,commitManifest}=await server.ssrLoadModule('/src/substrate/identity.ts');
 const models=[],hex=b=>Buffer.from(b).toString('hex');
 fs.mkdirSync(folder,{recursive:true});
 for(const name of t.models){const source=t.source(name),slots=t.decode(source.registry).items;assert.equal(slots.length,6);
  const semantic=slots[0].items.filter(r=>r.schema.typeId===171n);assert.equal(new Set(semantic.map(r=>t.key(t.f(r,1)))).size,semantic.length,'unique registry stable IDs');
  const descriptors=slots[0].items.filter(r=>r.schema.typeId===172n);assert.equal(new Set(descriptors.map(r=>`${t.f(r,1).value}/${t.f(r,2).value}`)).size,descriptors.length,'unique descriptors');
  for(const field of ['content','registry','parameters'])assert.equal(hex(t.c.canonicalEncode(t.decode(source[field]))),hex(source[field]),'canonical round trip');
  const identity=await createModelIdentity({...source,contentManifest:await commitManifest(t.decode(source.content)),registryManifest:await commitManifest(t.decode(source.registry)),parameterSet:await commitManifest(t.decode(source.parameters))});
  const dir=path.join(folder,name);fs.mkdirSync(dir);
  for(const [field,bytes] of Object.entries({...Object.fromEntries(['content','registry','parameters'].map(f=>[f,source[f]])),'model-identity':t.c.canonicalEncode(identity.value)}))fs.writeFileSync(path.join(dir,field+'.cenc.hex'),hex(bytes)+'\n');
  models.push({name,modelIdentity:hex(t.c.canonicalEncode(identity.value)),descriptors:descriptors.length,semanticEntries:semantic.length,stageRegistrations:semantic.filter(r=>t.f(r,4).schema?.typeId===515n).length,files:['content','registry','parameters','model-identity'].map(f=>fp(path.join(dir,f+'.cenc.hex').replaceAll('\\','/')))});
 }
 fs.writeFileSync(folder+'/REVIEW.json',JSON.stringify({status:'CANONICAL DECLARATIONS MATERIALIZED; NOT FROZEN OR ACTIVATED',versions:t.versions,models,sources:['scripts/embodied-receiving-declaration-tools.mjs','scripts/materialize-embodied-receiving-models.mjs','docs/formal/EMBODIED_RECEIVING_ALLOCATION_TABLE.json','docs/formal/EMBODIED_RECEIVING_SHAPE_MANIFEST.json','docs/formal/EMBODIED_RECEIVING_DEADLINE_ROUTE_CLARIFICATION.md'].map(fp),limits:['Round trips and unique identities do not prove model role/reference/transition admission.','Independent declaration/role/PRJ/state review is required before freeze.','No runtime handler or public run was created.']},null,2)+'\n');
 console.log(JSON.stringify(models.map(({name,descriptors,semanticEntries,stageRegistrations})=>({name,descriptors,semanticEntries,stageRegistrations}))));
}finally{await server.close();}
