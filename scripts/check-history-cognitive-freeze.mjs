import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';import {cognitiveDeclarationTools} from './cognitive-model-declarations.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex'),sha=p=>hash(fs.readFileSync(p)),read=p=>JSON.parse(fs.readFileSync(p)),folder='docs/planning/campaign2-task-cognitive-model',out='docs/planning/campaign3-history-cognitive-freeze-rev1/';
const recovered=read(out+'source-recovery.json').recovered;assert(recovered);assert.equal(sha(recovered.path),recovered.sha256);
let original=fs.readFileSync('scripts/freeze-cognitive-model.mjs','utf8');function once(a,b){assert.equal(original.split(a).length,2);original=original.replace(a,b);}
once('assert(!fs.existsSync(target));','assert(fs.existsSync(target));');
once("fp=path=>({path,sha256:hash(fs.readFileSync(path))});","fp=path=>({path,sha256:hash(fs.readFileSync(path==='src/campaign2/taskDeclarations.ts'?"+JSON.stringify(recovered.path)+":path))});");
once('fs.mkdirSync(target);for(const name of files)fs.copyFileSync(source+\'/\'+name,target+\'/\'+name);',"for(const name of files)assert.deepEqual(fs.readFileSync(source+'/'+name),fs.readFileSync(target+'/'+name));");
once("fs.writeFileSync(target+'/FREEZE.json',JSON.stringify(freeze,null,2)+'\\n');","assert.deepEqual(freeze,JSON.parse(fs.readFileSync(target+'/FREEZE.json')),'exact historical freeze equality');");
assert(!original.includes('writeFileSync')&&!original.includes('mkdirSync')&&!original.includes('copyFileSync'));
try{await import('data:text/javascript;base64,'+Buffer.from(original).toString('base64'));
 const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,watch:null},appType:'custom'});
 try{const t=await cognitiveDeclarationTools(server),{compileCognitiveModel}=await server.ssrLoadModule('/src/campaign2/cognitiveModel.ts'),v=read(folder+'/FREEZE.json'),rows=[];
  assert.deepEqual(t.recipes,v.models.map(m=>m.recipe));assert.deepEqual(t.bundle,v.semanticBundle);assert.deepEqual(t.profiles,v.profiles);
  for(const recipe of t.recipes){const source=t.source(recipe),model=await compileCognitiveModel(source),slots=t.decode(source.registry).items;assert.equal(model.recipe,recipe);assert.equal(slots.length,6);
   const row={recipe,modelDigest:hash(model.modelIdentity.canonicalBytes),registryDigest:hash(source.registry),rows:slots[0].items.filter(r=>r.schema?.typeId===171n).length,descriptors:slots[0].items.filter(r=>r.schema?.typeId===172n).length};assert.deepEqual(row,v.models.find(m=>m.recipe===recipe));rows.push(row);
   if(recipe==='baseline')for(const [name,b]of Object.entries({content:source.content,registry:source.registry,parameters:source.parameters,'model-identity':model.modelIdentity.canonicalBytes}))assert.equal(fs.readFileSync(folder+'/'+name+'.cenc.hex','utf8'),Buffer.from(b).toString('hex')+'\n');
  }
  assert.equal(rows.length,21);assert.equal(new Set(rows.map(r=>r.modelDigest)).size,21);
  const result={status:'21 COGNITIVE RECIPES ADMITTED;EXACT FREEZE RECEIPT VERIFIED',models:21,semanticBundle:78,rows,freeze:{path:folder+'/FREEZE.json',sha256:sha(folder+'/FREEZE.json')},historicalSource:recovered,scope:'Current compatible declaration admission and exact identity/registry/count reconstruction;historical freeze fingerprints use exact recovered source. No runtime vectors,live source,RNG,persistence,whole Campaign2 or independent chronology claim.',checkerSha256:sha('scripts/check-history-cognitive-freeze.mjs')};const dest=out+'canonical-check.json';if(fs.existsSync(dest))assert.deepEqual(read(dest),result);else fs.writeFileSync(dest,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(result.status);
 }finally{await server.close();}
}catch(e){console.error(e.message);process.exitCode=1;}
