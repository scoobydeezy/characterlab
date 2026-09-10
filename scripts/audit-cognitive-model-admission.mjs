// Independent frozen declaration constructor against production receiving admission.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {cognitiveDeclarationTools} from './cognitive-model-declarations.mjs';
const output='docs/planning/COGNITIVE_MODEL_ADMISSION_REV1.json';
assert(!fs.existsSync(output),'preserve prior audit; use a new revision');
const paths=['src/campaign2/cognitiveModel.ts','src/campaign2/cognitiveDeclarations.ts','src/campaign2/taskDeclarations.ts','src/campaign2/cognitiveCodecs.ts','scripts/cognitive-model-declarations.mjs','docs/planning/campaign2-task-cognitive-model/FREEZE.json','scripts/audit-cognitive-model-admission.mjs'];
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),before=paths.map(fp);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const tools=await cognitiveDeclarationTools(server);
 const {compileCognitiveModel}=await server.ssrLoadModule('/src/campaign2/cognitiveModel.ts');
 const freeze=JSON.parse(fs.readFileSync('docs/planning/campaign2-task-cognitive-model/FREEZE.json','utf8'));
 const models=[];
 for(const recipe of tools.recipes){
  const admitted=await compileCognitiveModel(tools.source(recipe));
  const digest=Buffer.from(admitted.modelIdentity.digest).toString('hex');
  assert.equal(admitted.recipe,recipe);assert.equal(digest,freeze.models.find(m=>m.recipe===recipe).modelDigest);
  models.push({recipe,modelDigest:digest,status:'PASS'});
 }
 assert.deepEqual(paths.map(fp),before);
 fs.writeFileSync(output,JSON.stringify({status:'ALL 21 FROZEN MODEL DECLARATIONS ADMITTED',models,sourceFingerprints:before,limits:['Declaration and structural ownership admission only.','No public run, state semantic qualification, live source authenticity, RNG or persistence witness.']},null,2)+'\n');
 console.log(JSON.stringify({models:models.length,status:'PASS'}));
}finally{await server.close();}
