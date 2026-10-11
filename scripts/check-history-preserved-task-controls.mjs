import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),out='docs/planning/campaign3-history-preserved-metadata-rev1/';
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,watch:null},appType:'custom'});
try{
 const review=await server.ssrLoadModule('/src/campaign2/taskModelReview.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),codec=await server.ssrLoadModule('/src/campaign2/taskCodecs.ts'),decl=await server.ssrLoadModule('/src/campaign2/taskDeclarations.ts'),state=await server.ssrLoadModule('/src/campaign2/stateModel.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const path='docs/planning/campaign2-task-commitment-model/CONTROLS.json',expected=read(path),rows=[],schemas=codec.taskSupportedSchemas(),adapter={decode:codec.decodeTask,schema:n=>{const s=schemas.find(s=>s.typeId===n);assert(s);return s;}};
 for(const specimen of ['overlapping','coincident','recurrence'])for(let mask=0;mask<64;mask++){
  const flags=Array.from({length:6},(_,i)=>Boolean(mask&(1<<i))),source=review.taskModelReviewSource(specimen,...flags),content=await decl.compileTaskDeclarations(source.content,source.registry),slots=codec.decodeTask(source.registry).items;
  content.validateRecordRoles(source.registry);state.compileCampaign2StateModel(c.canonicalEncode(slots[2]),c.canonicalEncode(slots[3]),c.canonicalEncode(slots[4]),content,adapter);
  const identity=await ids.createModelIdentity({...source,contentManifest:await ids.commitManifest(codec.decodeTask(source.content)),registryManifest:await ids.commitManifest(codec.decodeTask(source.registry)),parameterSet:await ids.commitManifest(codec.decodeTask(source.parameters))});
  rows.push({specimen,flags,modelDigest:hash(identity.canonicalBytes),contentDigest:hash(source.content),registryDigest:hash(source.registry)});
 }
 assert.deepEqual(rows,expected);assert.equal(new Set(rows.map(r=>r.modelDigest)).size,192);
 const receipt={status:'PASS',source:{path,sha256:hash(fs.readFileSync(path))},models:192,specimens:3,flagCombinations:64,scope:'Exact historical control commitments reconstructed with current compatible declaration/state admission. No task runtime, deadline, restore or historical source-byte equivalence claim.',checkerSha256:hash(fs.readFileSync('scripts/check-history-preserved-task-controls.mjs'))};
 fs.mkdirSync(out,{recursive:true});const p=out+'task-controls-check.json';if(fs.existsSync(p))assert.deepEqual(read(p),receipt);else fs.writeFileSync(p,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(receipt));
}finally{await server.close();}
