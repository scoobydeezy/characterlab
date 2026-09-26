import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/campaign3-rumination-model-rev1';assert(!fs.existsSync(root),'immutable destination exists');
const hash=b=>createHash('sha256').update(b).digest('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {ruminationRecipe,compileRuminationModel}=await server.ssrLoadModule('/src/campaign3/ruminationModel.ts');
 const models=[];
 for(const [candidate,law] of [[1,1],[2,1],[3,1],[4,1]]){
  const source=ruminationRecipe({candidate,law}),model=await compileRuminationModel(source),name=`candidate-${candidate}-law-${law}`,directory=root+'/'+name;fs.mkdirSync(directory,{recursive:true});
  const files=Object.entries({...source,'model-identity':model.modelIdentity.canonicalBytes}).map(([name,bytes])=>{const path=directory+'/'+name+'.cenc.hex',data=Buffer.from(bytes).toString('hex')+'\n';fs.writeFileSync(path,data,{flag:'wx'});return {path,sha256:hash(data)};});
  models.push({name,candidate,law,modelIdentity:Buffer.from(model.modelIdentity.canonicalBytes).toString('hex'),files});
 }
 fs.writeFileSync(root+'/FREEZE.json',JSON.stringify({date:'2026-09-25',status:'FROZEN; public qualification not implied',contractSha256:hash(fs.readFileSync('docs/formal/RUMINATION_PUBLIC_CONTRACT.md')),allocationSha256:hash(fs.readFileSync('docs/formal/RUMINATION_PUBLIC_ALLOCATION_TABLE.json')),models},null,2)+'\n',{flag:'wx'});
 console.log('Frozen4 rumination models.');
}finally{await server.close();}
