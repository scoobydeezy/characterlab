import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/campaign3-affect-model-rev1';assert(!fs.existsSync(root),'immutable destination exists');
const hash=b=>createHash('sha256').update(b).digest('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {affectRecipe,compileAffectModel}=await server.ssrLoadModule('/src/campaign3/affectModel.ts');
 const profiles=[];for(const candidate of [1,2,3])for(const feedback of [false,true])profiles.push({name:`candidate-${candidate}-feedback-${feedback}`,settings:{candidate,feedback}});
 for(const severity of [0,.5])profiles.push({name:'severity-'+severity,settings:{severity}});
 for(const obligation of [0,.1,10])profiles.push({name:'obligation-'+obligation,settings:{obligation}});
 for(const learningLaw of [2,3])profiles.push({name:'learning-'+learningLaw,settings:{learningLaw}});
 profiles.push({name:'absolute-control',settings:{controlLaw:2}},{name:'no-safety-base',settings:{safety:0}},{name:'blocked-execution',settings:{execution:false}});
 // Factorial severity contrasts for all three serious candidates.
 for(const candidate of [1,3])profiles.push({name:`candidate-${candidate}-severity-half`,settings:{candidate,severity:.5}});
 const models=[];
 for(const {name,settings} of profiles){const source=affectRecipe(settings),model=await compileAffectModel(source),directory=root+'/'+name;fs.mkdirSync(directory,{recursive:true});
  const files=Object.entries({...source,'model-identity':model.modelIdentity.canonicalBytes,'initial-state':(await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts')).canonicalEncode(model.initial.canonicalValue())}).map(([name,bytes])=>{const path=directory+'/'+name+'.cenc.hex',data=Buffer.from(bytes).toString('hex')+'\n';fs.writeFileSync(path,data,{flag:'wx'});return {path,sha256:hash(data)};});
  models.push({name,settings:model.settings,modelIdentity:Buffer.from(model.modelIdentity.canonicalBytes).toString('hex'),files});
 }
 fs.writeFileSync(root+'/FREEZE.json',JSON.stringify({date:'2026-09-21',status:'FROZEN; public qualification not implied',contractSha256:hash(fs.readFileSync('docs/formal/AFFECT_PUBLIC_CONTRACT.md')),allocationSha256:hash(fs.readFileSync('docs/formal/AFFECT_PUBLIC_ALLOCATION_TABLE.json')),models},null,2)+'\n',{flag:'wx'});console.log(`Frozen ${models.length} affect models.`);
}finally{await server.close();}
