import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),hex=b=>Buffer.from(b).toString('hex');
const file='docs/planning/campaign3-multisource-model-rev2/FREEZE.json',v=read(file),out='docs/planning/campaign3-history-multisource-freeze-rev1/';
assert.equal(sha(v.contract),v.contractSha256);assert.equal(sha('docs/formal/MULTISOURCE_PUBLIC_ALLOCATION_TABLE.json'),v.allocationSha256);assert.equal(v.allocationCorrection,'MS-ALLOC-CORR-001');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,watch:null},appType:'custom'});
try{
 const {multisourceRecipe,MS_CASES,MS_LAWS}=await server.ssrLoadModule('/src/campaign3/multisourceModelRecipe.ts'),{compileMultisourceModel}=await server.ssrLoadModule('/src/campaign3/multisourceModel.ts');
 const expected=MS_CASES.flatMap(c=>MS_LAWS.filter(l=>l!=='DescriptionDice'||['duplicate','aggregate','orphan-removed'].includes(c)).map(l=>({caseName:c,law:l})));assert.deepEqual(v.models.map(({caseName,law})=>({caseName,law})),expected);
 const groups=new Map(),rows=[];
 for(const m of v.models){const recipe=multisourceRecipe(m.caseName,m.law),compiled=await compileMultisourceModel(recipe.source);assert.equal(recipe.name,m.name);assert.equal(hex(compiled.modelIdentity.canonicalBytes),m.modelIdentity);compiled.initialState(recipe.initialState);
  assert.deepEqual(Object.fromEntries(Object.entries(recipe.source).filter(([,x])=>typeof x==='string')),v.versions);
  const files={content:recipe.source.content,registry:recipe.source.registry,parameters:recipe.source.parameters,'model-identity':compiled.modelIdentity.canonicalBytes,'initial-state':recipe.initialState,'ordered-inputs':recipe.orderedInputs};assert.equal(m.files.length,6);
  for(const[name,b]of Object.entries(files)){const p=file.slice(0,-'FREEZE.json'.length)+m.name+'/'+name+'.cenc.hex',f=m.files.find(f=>f.path===p);assert(f);assert.equal(sha(p),f.sha256);assert.equal(fs.readFileSync(p,'utf8'),hex(b)+'\n');}
  if(!groups.has(m.modelIdentity))groups.set(m.modelIdentity,[]);groups.get(m.modelIdentity).push(m.name);rows.push({name:m.name,caseName:m.caseName,law:m.law,compilerRepresentative:compiled.name});
 }
 assert.equal(v.models.length,55);assert.equal(groups.size,43);
 const result={status:'55 SCENARIO IMAGES /43 DISTINCT MODEL IDENTITIES VERIFIED',freeze:{path:file,sha256:sha(file)},rows,identityGroups:[...groups].map(([identity,names])=>({modelIdentitySha256:createHash('sha256').update(Buffer.from(identity,'hex')).digest('hex'),names})),models:43,scenarios:55,files:330,scope:'Exact recipe roster,model compilation,initial-state admission and six frozen image files per scenario;no runtime trajectory or matched DescriptionDice intervention rerun. Shared model identity does not imply identical S0 or ordered inputs.',checkerSha256:sha('scripts/check-history-multisource-freeze.mjs')};
 fs.mkdirSync(out,{recursive:true});const dest=out+'canonical-check.json';if(fs.existsSync(dest))assert.deepEqual(read(dest),result);else fs.writeFileSync(dest,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(result.status);
}catch(e){console.error(e.message);process.exitCode=1;}finally{await server.close();}
