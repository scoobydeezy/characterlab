// Actual canonical declaration construction. No task runtime is activated here.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const revision=process.argv[2]??'1';assert(/^[1-9][0-9]*$/.test(revision));
const folder=`docs/planning/campaign2-task-commitment-review${revision==='1'?'':'-rev'+revision}/`;
assert(!fs.existsSync(folder),'Preserve prior review');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),fp=path=>({path,sha256:hash(fs.readFileSync(path))});
const sources=['scripts/materialize-task-commitment-review.mjs','src/campaign2/taskCodecs.ts','src/campaign2/taskModelReview.ts','src/campaign2/taskDeclarations.ts','src/test/campaign2TaskDeclarations.test.ts','docs/planning/CAMPAIGN2_TASK_LIFECYCLE_PACKAGING.md','docs/planning/CAMPAIGN2_TASK_PACKAGING_REVIEW_2.md','docs/formal/TASK_COMMITMENT_CORRECTION_ALLOCATION_TABLE.json','docs/formal/TASK_COMMITMENT_KEY_ROLE_CORRECTION.md'];
const before=sources.map(fp),allocation=JSON.parse(fs.readFileSync('docs/formal/TASK_COMMITMENT_CORRECTION_ALLOCATION_TABLE.json'));
for(const f of allocation.sourceFingerprints)assert.deepEqual(fp(f.path),f);
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try{
 const {canonicalEncode:enc,list,set}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {commitManifest,createModelIdentity}=await server.ssrLoadModule('/src/substrate/identity.ts');
 const {decodeTask,taskSupportedSchemas}=await server.ssrLoadModule('/src/campaign2/taskCodecs.ts');
 const review=await server.ssrLoadModule('/src/campaign2/taskModelReview.ts');
 const {predictionModelReviewSource,PREDICTION_BUNDLE}=await server.ssrLoadModule('/src/campaign2/predictionModelReview.ts');
 const {compileTaskDeclarations}=await server.ssrLoadModule('/src/campaign2/taskDeclarations.ts');
 const {compileCampaign2StateModel}=await server.ssrLoadModule('/src/campaign2/stateModel.ts');
 const f=(v,n)=>v.fields.get(BigInt(n)),key=v=>Buffer.from(enc(v)).toString('hex'),rows=s=>s[0].items.filter(v=>v.schema?.typeId===171n),byName=(rs,name)=>{const found=rs.filter(r=>f(r,1).payload.value===name);assert.equal(found.length,1);return found[0];};
 const schemas=taskSupportedSchemas(),codec={decode:decodeTask,schema:n=>{const s=schemas.find(s=>s.typeId===n);assert(s);return s;}};
 assert.equal(schemas.filter(s=>s.typeId>=370n&&s.typeId<=376n).length,7);
 const controls=[];let normal,normalIdentity;
 for(const specimen of ['overlapping','coincident','recurrence'])for(let mask=0;mask<64;mask++){
  const flags=Array.from({length:6},(_,i)=>Boolean(mask&(1<<i))),source=review.taskModelReviewSource(specimen,...flags),slots=decodeTask(source.registry).items,base=predictionModelReviewSource(...flags),old=decodeTask(base.registry).items;
  const content=await compileTaskDeclarations(source.content,source.registry);content.validateRecordRoles(source.registry);
  compileCampaign2StateModel(enc(slots[2]),enc(slots[3]),enc(slots[4]),content,codec);
  assert.equal(key(decodeTask(content.characterContentBytes())),key(decodeTask(base.content)));
  assert.deepEqual(source.parameters,base.parameters);assert.equal(key(slots[1]),key(old[1]));assert.equal(key(slots[3]),key(old[3]));
  assert.equal(slots[0].items.length,old[0].items.length+13);assert.equal(slots[5].items.length,old[5].items.length+10);
  const rs=rows(slots),ors=rows(old),changed=['definition/transition-admission','definition/campaign2-state-families'];
  for(const row of ors)if(!changed.includes(f(row,1).payload.value))assert(rs.some(r=>key(r)===key(row)),'retained registry row changed');
  const ad=f(byName(rs,changed[0]),4),oad=f(byName(ors,changed[0]),4);assert.equal(f(ad,1).items.length,3);assert.equal(f(ad,2).entries.length,f(oad,2).entries.length+2);assert.equal(key(f(ad,3)),key(f(oad,3)));
  const families=f(f(byName(rs,changed[1]),4),1),oldFamilies=f(f(byName(ors,changed[1]),4),1);assert.equal(families.entries.length,11);
  for(const row of oldFamilies.entries)assert(families.entries.some(x=>key(list(x))===key(list(row))));
  const measurement=f(byName(rs,'TaskMeasurementSettlementTransition'),4),deadline=f(byName(rs,'TaskDeadlineSettlementTransition'),4);
  assert.equal(f(measurement,5).items.length,0);assert.equal(f(deadline,6).items.length,0);assert.equal(f(f(measurement,7),3).value,140n);
  assert.equal(f(measurement,2).value,'task-commitment/0.2-candidate');assert.equal(f(deadline,2).value,'task-commitment/0.2-candidate');
  const identity=await createModelIdentity({...source,contentManifest:await commitManifest(decodeTask(source.content)),registryManifest:await commitManifest(decodeTask(source.registry)),parameterSet:await commitManifest(decodeTask(source.parameters))});
  controls.push({specimen,flags,modelDigest:hash(identity.canonicalBytes),contentDigest:hash(source.content),registryDigest:hash(source.registry)});
  if(specimen==='overlapping'&&mask===63){normal=source;normalIdentity=identity;}
 }
 assert.equal(controls.length,192);assert.equal(new Set(controls.map(c=>c.modelDigest)).size,192);
 assert.deepEqual(review.TASK_BUNDLE.slice(0,PREDICTION_BUNDLE.length),PREDICTION_BUNDLE);assert.equal(review.TASK_BUNDLE.length,PREDICTION_BUNDLE.length+10);
 assert.deepEqual(sources.map(fp),before);for(const f of allocation.sourceFingerprints)assert.deepEqual(fp(f.path),f);
 fs.mkdirSync(folder);
 for(const field of ['content','registry','parameters'])fs.writeFileSync(folder+field+'.cenc.hex',Buffer.from(normal[field]).toString('hex')+'\n');
 fs.writeFileSync(folder+'model-identity.cenc.hex',Buffer.from(normalIdentity.canonicalBytes).toString('hex')+'\n');
 fs.writeFileSync(folder+'CONTROLS.json',JSON.stringify(controls,null,2)+'\n');
 const manifest={status:'CANONICAL DECLARATION REVIEW PASS; MODEL NOT FROZEN OR ACTIVE',semanticVersion:review.TASK_VERSION,normalModelDigest:hash(normalIdentity.canonicalBytes),sourceFingerprints:before,preservedSources:allocation.sourceFingerprints,profiles:review.TASK_PROFILES,semanticBundle:review.TASK_BUNDLE,counts:{specimens:3,controlCombinations:192,newSchemas:7,newRegistryRowsAndDescriptors:13,newRecordRoles:10,newStateMapKeyRoles:0,logicalFamilies:11,logicalRoutes:3},checks:['actual fixed two-kind CONTENT/reference validation','actual state ownership/key-grammar/role compilation','qualified character image equals prior content exactly','all retained registry rows except declared two extensions preserved','old family rows and occurrence map preserved','exact empty lifecycle output closures','all192 canonical model commitments distinct','full prior source fingerprint preservation'],eventBudget:{status:'DERIVED, NOT TASK RUNTIME EXECUTED',priorConsecutiveProbeEvents:14,taskMeasurementSlots:1,maxDeadlineSlots:2,derivedMaxProbeEvents:17,ceiling:100,authoredInputOverload:'existing typed ceiling failure; no promise of successful arbitrary batches'},limitations:['TC-A..L NOT PASSED.','Task runtime, public factory activation, initial deadline allocation and restore are not executed by this declaration audit.','Workspace/appraisal/motive/option drafts are not included.']};
 fs.writeFileSync(folder+'REVIEW_MANIFEST.json',JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({folder,status:manifest.status,controls:192,modelDigest:manifest.normalModelDigest}));
}finally{await server.close();}
