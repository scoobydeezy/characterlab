// Data-only model packet; no generated cognitive event or public factory is activated.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {cognitiveDeclarationTools} from './cognitive-model-declarations.mjs';
const folder='docs/planning/campaign2-cognitive-declaration-review';assert(!fs.existsSync(folder));
const hash=b=>createHash('sha256').update(b).digest('hex'),fp=path=>({path,sha256:hash(fs.readFileSync(path))});
const paths=['scripts/cognitive-model-declarations.mjs','scripts/materialize-cognitive-declaration-review.mjs','docs/formal/TASK_COGNITIVE_SHAPE_MANIFEST.json','docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json','docs/formal/TASK_COGNITIVE_PLAN_LEAF_ALLOCATION_TABLE.json','src/campaign2/taskModelReview.ts','src/campaign2/taskCodecs.ts'];const before=paths.map(fp);
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try{
 const t=await cognitiveDeclarationTools(server),{canonicalEncode:enc}=t.c;
 const {commitManifest,createModelIdentity}=await server.ssrLoadModule('/src/substrate/identity.ts');
 const controlModels=[];let baseline;
 for(const recipe of t.recipes){
  const source=t.source(recipe),slots=t.decode(source.registry).items;assert.equal(slots.length,6);assert.deepEqual(enc(t.decode(source.registry)),source.registry);
  const rows=slots[0].items.filter(v=>v.schema?.typeId===171n),descriptors=slots[0].items.filter(v=>v.schema?.typeId===172n);
  assert.equal(new Set(rows.map(r=>t.key(t.f(r,1)))).size,rows.length,'unique StableIds');
  assert.equal(new Set(descriptors.map(r=>t.f(r,1).value+'/'+t.f(r,2).value)).size,descriptors.length,'unique descriptors');
  assert.deepEqual(descriptors.filter(r=>t.f(r,1).value===373n).map(r=>t.f(r,2).value),[2n]);
  for(const added of t.allocation.records)assert(descriptors.some(d=>t.f(d,1).value===BigInt(added.typeId)));
  const ad=rows.find(r=>t.f(r,1).payload?.value==='definition/transition-admission');assert(ad);
  const occurrences=t.f(t.f(ad,4),3).entries;
  for(const o of t.allocation.occurrenceIdentities){const found=occurrences.filter(([k])=>t.f(k,1).value===BigInt(o.recordTypeId));assert.equal(found.length,1);assert.equal(t.f(t.f(found[0][1],2),1).value,BigInt(o.requiredNamespace));}
  const unions=rows.filter(r=>t.f(r,1).namespaceId===1024n&&t.f(r,4).schema.typeId===259n&&t.f(t.f(r,4),1).value>=377n);assert.equal(unions.length,17);
  assert.equal(t.f(t.decode(source.parameters).items[0],1).value,27n);
  const identity=await createModelIdentity({...source,contentManifest:await commitManifest(t.decode(source.content)),registryManifest:await commitManifest(t.decode(source.registry)),parameterSet:await commitManifest(t.decode(source.parameters))});
  controlModels.push({recipe,modelDigest:hash(identity.canonicalBytes),registryDigest:hash(source.registry),rows:rows.length,descriptors:descriptors.length});
  if(recipe==='baseline')baseline={source,identity};
 }
 assert.equal(new Set(controlModels.map(m=>m.modelDigest)).size,21);
 assert.deepEqual(paths.map(fp),before);fs.mkdirSync(folder);
 for(const field of ['content','registry','parameters'])fs.writeFileSync(folder+'/'+field+'.cenc.hex',Buffer.from(baseline.source[field]).toString('hex')+'\n');
 fs.writeFileSync(folder+'/model-identity.cenc.hex',Buffer.from(baseline.identity.canonicalBytes).toString('hex')+'\n');
 fs.writeFileSync(folder+'/CONTROLS.json',JSON.stringify(controlModels,null,2)+'\n');
 const report={status:'INITIAL CANONICAL DECLARATION CONSTRUCTION; WHOLE MODEL REVIEW PENDING',sourceFingerprints:before,profiles:t.profiles,semanticBundle:t.bundle,controlModels,baselineModelDigest:hash(baseline.identity.canonicalBytes),checks:['21 distinct canonical commitments','six-slot construction and complete codec round trip','unique registry StableIds and type/version descriptors','373/schema2 only in new descriptor manifest','14 added output identity rules and17 payload-only union rows','declared maxWork27','source preservation'],limits:['Full receiving registry/source/role/contextual grammar validation is not executed by this initial construction.','No ownership/mutation, generated-source, random or persistence runtime qualification.','Do not activate or freeze this model from these structural counts alone.']};
 fs.writeFileSync(folder+'/REVIEW_MANIFEST.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,models:21,baseline:report.baselineModelDigest}));
}finally{await server.close();}
