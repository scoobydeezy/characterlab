import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/campaign3-skill-model-rev1';assert(!fs.existsSync(root));const hash=b=>createHash('sha256').update(b).digest('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {skillRecipe,compileSkillModel}=await server.ssrLoadModule('/src/campaign3/skillModel.ts'),{canonicalEncode:enc}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),profiles=[];
 for(const initial of [0,.5,1])for(const practiceLaw of [1,2,3])for(const executionLaw of [1,2])profiles.push({name:'k'+initial+'-p'+practiceLaw+'-e'+executionLaw,settings:{initial,practiceLaw,executionLaw}});
 for(const initial of [0,.5,1])for(const executionLaw of [3,4])profiles.push({name:'k'+initial+'-bad-e'+executionLaw,settings:{initial,executionLaw}});
 profiles.push({name:'permanent-impairment',settings:{permanent:true}},{name:'last-observation',settings:{beliefLaw:2}},{name:'no-learning',settings:{beliefLaw:3}});
 const models=[];for(const {name,settings} of profiles){const source=skillRecipe(settings),model=await compileSkillModel(source),directory=root+'/'+name;fs.mkdirSync(directory,{recursive:true});const files=Object.entries({...source,'model-identity':model.modelIdentity.canonicalBytes,'initial-state':enc(model.initial.canonicalValue())}).map(([name,bytes])=>{const path=directory+'/'+name+'.cenc.hex',data=Buffer.from(bytes).toString('hex')+'\n';fs.writeFileSync(path,data,{flag:'wx'});return {path,sha256:hash(data)};});models.push({name,settings:model.settings,modelIdentity:Buffer.from(model.modelIdentity.canonicalBytes).toString('hex'),files});}
 fs.writeFileSync(root+'/FREEZE.json',JSON.stringify({date:'2026-09-21',status:'FROZEN before public qualification',contractSha256:hash(fs.readFileSync('docs/formal/SKILL_PUBLIC_CONTRACT.md')),allocationSha256:hash(fs.readFileSync('docs/formal/SKILL_PUBLIC_ALLOCATION_TABLE.json')),models},null,2)+'\n',{flag:'wx'});console.log('Frozen '+models.length+' skill models');
}finally{await server.close();}
