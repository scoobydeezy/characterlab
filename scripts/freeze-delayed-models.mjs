import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/campaign3-delayed-model-rev1';assert(!fs.existsSync(root),'immutable destination exists');
const hash=b=>createHash('sha256').update(b).digest('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {delayedRecipe,compileDelayedModel}=await server.ssrLoadModule('/src/campaign3/delayedModel.ts');
 const models=[];
 for(const law of [1,2,3]){
  const source=delayedRecipe(law),model=await compileDelayedModel(source),name=`law-${law}`,directory=root+'/'+name;fs.mkdirSync(directory,{recursive:true});
  const files=Object.entries({...source,'model-identity':model.modelIdentity.canonicalBytes}).map(([name,bytes])=>{const path=directory+'/'+name+'.cenc.hex',data=Buffer.from(bytes).toString('hex')+'\n';fs.writeFileSync(path,data,{flag:'wx'});return {path,sha256:hash(data)};});
  models.push({name,law,modelIdentity:Buffer.from(model.modelIdentity.canonicalBytes).toString('hex'),files});
 }
 fs.writeFileSync(root+'/FREEZE.json',JSON.stringify({date:'2026-09-25',status:'FROZEN; public qualification not implied',contractSha256:hash(fs.readFileSync('docs/formal/DELAYED_PUBLIC_CONTRACT.md')),allocationSha256:hash(fs.readFileSync('docs/formal/DELAYED_PUBLIC_ALLOCATION_TABLE.json')),models},null,2)+'\n',{flag:'wx'});
 console.log('Frozen3 delayed models.');
}finally{await server.close();}
