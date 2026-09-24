import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/campaign3-personstate-model-rev2';assert(!fs.existsSync(root),'immutable destination exists');
const hash=b=>createHash('sha256').update(b).digest('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {personstateRecipe,compilePersonStateModel}=await server.ssrLoadModule('/src/campaign3/personstateModel.ts');
 const models=[];
 for(const [law,pressure,goal] of [[1,1,1],[1,2,1],[1,3,1],[1,1,2],[2,1,1],[3,1,1],[4,1,1],[5,1,1]]){
  const source=personstateRecipe(law,pressure,goal),model=await compilePersonStateModel(source),name=`law-${law}-pressure-${pressure}-goal-${goal}`,directory=root+'/'+name;fs.mkdirSync(directory,{recursive:true});
  const files=Object.entries({...source,'model-identity':model.modelIdentity.canonicalBytes}).map(([name,bytes])=>{const path=directory+'/'+name+'.cenc.hex',data=Buffer.from(bytes).toString('hex')+'\n';fs.writeFileSync(path,data,{flag:'wx'});return {path,sha256:hash(data)};});
  models.push({name,law,pressure,goal,modelIdentity:Buffer.from(model.modelIdentity.canonicalBytes).toString('hex'),files});
 }
 fs.writeFileSync(root+'/FREEZE.json',JSON.stringify({date:'2026-09-24',status:'FROZEN; public qualification not implied',contractSha256:hash(fs.readFileSync('docs/formal/PERSONSTATE_PUBLIC_CONTRACT.md')),allocationSha256:hash(fs.readFileSync('docs/formal/PERSONSTATE_PUBLIC_ALLOCATION_TABLE.json')),models},null,2)+'\n',{flag:'wx'});
 console.log('Frozen8 personstate models.');
}finally{await server.close();}
