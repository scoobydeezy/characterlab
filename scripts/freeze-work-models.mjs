import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/campaign3-work-model-rev1';assert(!fs.existsSync(root));const hash=b=>createHash('sha256').update(b).digest('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {workRecipe,compileWorkModel}=await server.ssrLoadModule('/src/campaign3/workModel.ts'),{canonicalEncode:enc}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const models=[];
 for(const candidate of [1,2,3,4,5,6])for(const capacity of [0,1,2,3])for(const support of [false,true]){
  // Full factorial is finite and prevents cherry-picking cache/index equivalence.
  const settings={candidate,capacity,support},name=`c${candidate}-k${capacity}-s${Number(support)}`,source=workRecipe(settings),model=await compileWorkModel(source),directory=root+'/'+name;fs.mkdirSync(directory,{recursive:true});
  const files=Object.entries({...source,'model-identity':model.modelIdentity.canonicalBytes,'initial-state':enc(model.initial.canonicalValue())}).map(([name,bytes])=>{const path=directory+'/'+name+'.cenc.hex',data=Buffer.from(bytes).toString('hex')+'\n';fs.writeFileSync(path,data,{flag:'wx'});return {path,sha256:hash(data)};});
  models.push({name,settings,modelIdentity:Buffer.from(model.modelIdentity.canonicalBytes).toString('hex'),files});
 }
 fs.writeFileSync(root+'/FREEZE.json',JSON.stringify({date:'2026-09-21',status:'FROZEN before public qualification',contractSha256:hash(fs.readFileSync('docs/formal/WORKSPACE_CONTROL_CONTRACT.md')),allocationSha256:hash(fs.readFileSync('docs/formal/WORKSPACE_CONTROL_ALLOCATION_TABLE.json')),models},null,2)+'\n',{flag:'wx'});console.log('Frozen '+models.length+' workspace models');
}finally{await server.close();}
