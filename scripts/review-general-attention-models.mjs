/** Independent canonical-image/identity review; no public activation. */
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const folder='docs/planning/general-attention-model-review-rev3',out='docs/planning/GA_MODEL_IMAGE_REVIEW_REV2_2026_09_19.json';assert(!fs.existsSync(out));
const fp=p=>({path:p,sha256:createHash('sha256').update(fs.readFileSync(p)).digest('hex')});
const review=JSON.parse(fs.readFileSync(folder+'/REVIEW.json','utf8')),hex=b=>Buffer.from(b).toString('hex'),read=file=>{assert.deepEqual(fp(file.path),file);return Uint8Array.from(Buffer.from(fs.readFileSync(file.path,'utf8').trim(),'hex'));};
for(const file of review.sources)assert.deepEqual(fp(file.path),file);assert(review.sources.length>100);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const {decodeGeneralAttention:decode}=await server.ssrLoadModule('/src/campaign3/generalAttentionCodecs.ts'),{generalBindingContext}=await server.ssrLoadModule('/src/campaign3/generalBindingProfile.ts');
 const {compileGeneralDeclarations}=await server.ssrLoadModule('/src/campaign3/generalDeclarations.ts'),{createGeneralSourceRuntime}=await server.ssrLoadModule('/src/campaign3/generalSourceRuntime.ts');
 const {createModelIdentity,createRunIdentity,commitManifest}=await server.ssrLoadModule('/src/substrate/identity.ts');
 const {canonicalEncode:enc,list,set}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const context=generalBindingContext(),value=b=>decode(b,context),content=read(review.shared.content),roles=read(review.shared.roles),checks=[];
 for(const image of review.models){
  const files=Object.fromEntries(Object.entries(image.files).map(([k,v])=>[k,read(v)]));
  const packet={recipe:image.name,content,roles,definitions:files.definitions,registrations:files.registrations};
  const model=await compileGeneralDeclarations(packet),registry=value(files.registry),parameters=value(files.parameters);
  assert.equal(hex(enc(registry)),hex(files.registry));assert.equal(hex(enc(parameters)),hex(files.parameters));
  assert.equal(hex(enc(list([files.definitions,roles,files.registrations,model.inheritedSource.definitionBytes(),model.state.ownershipBytes()].map(value)))),hex(files.registry));
  assert.equal(hex(model.initial.bytes()),hex(files.initial));assert.equal(hex(createGeneralSourceRuntime(model).originalBytes()),hex(files.originals));
  const identity=await createModelIdentity({...review.versions,contentManifest:await commitManifest(value(content)),registryManifest:await commitManifest(registry),parameterSet:await commitManifest(parameters)});
  assert.equal(hex(identity.canonicalBytes),image.modelIdentity);assert.equal(hex(files.identity),image.modelIdentity);
  const run=await createRunIdentity({modelIdentity:identity,initialState:await commitManifest(value(files.initial)),orderedInputSequence:await commitManifest(value(files.originals)),runSeed:Uint8Array.from(Buffer.from(review.seed,'hex'))});assert.equal(hex(run.canonicalBytes),image.runIdentity);
  const rows=value(files.definitions).items;
  await assert.rejects(compileGeneralDeclarations({...packet,definitions:enc(set(rows.slice(1)))}));
  await assert.rejects(compileGeneralDeclarations({...packet,roles:enc(set([]))}));
  await assert.rejects(compileGeneralDeclarations({...packet,registrations:enc(set(value(files.registrations).items.slice(1)))}));
  checks.push({model:image.name,exactModel:true,exactRun:true,originalCalendar:true,requiredInitialState:true,negativeControls:3});
 }
 assert.equal(review.models.length,43);assert.equal(new Set(review.models.map(m=>m.modelIdentity)).size,43);assert.equal(review.aliases.length,0);
 const priorPath='docs/planning/campaign3-general-attention-model-rev1/FREEZE.json',prior=JSON.parse(fs.readFileSync(priorPath));let preservedFiles=0;
 for(const old of prior.models){const next=review.models.find(m=>m.name===old.name);assert(next);assert.equal(next.modelIdentity,old.modelIdentity);assert.equal(next.runIdentity,old.runIdentity);for(const [part,file] of Object.entries(old.files)){assert.deepEqual(fp(file.path),file);assert.equal(next.files[part].sha256,file.sha256);preservedFiles++;}}
 for(const [part,file] of Object.entries(prior.shared)){assert.deepEqual(fp(file.path),file);assert.equal(review.shared[part].sha256,file.sha256);preservedFiles++;}
 const receipt={status:'EXACT GA MODEL IMAGE REVIEW PASS; NOT YET FROZEN',models:43,distinctModels:43,checks,negativeControls:checks.length*3,budget:review.budget,proposal:fp(folder+'/REVIEW.json'),reviewedSources:review.sources,script:fp('scripts/review-general-attention-models.mjs'),preservation:{prior:fp(priorPath),models:prior.models.length,files:preservedFiles},scope:['All exact source, S0, ownership, registration, parameter and content bytes independently recommitted.','129 missing-definition/role/registration controls reject.','All35 prior models and247 frozen image files remain byte-identical.','Runtime/corpus qualification is separate.','Revision1 is rejected; no prior frozen bytes changed.'],counters:{highestAllocated:706,allocatedSinceVerdictOrCorpusMember:0}};
 fs.writeFileSync(out,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({models:43,negativeControls:129,status:receipt.status}));
}finally{await server.close();}
