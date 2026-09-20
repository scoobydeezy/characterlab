/** Reviewable candidate images only. Never overwrites a review or frozen image. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const folder='docs/planning/general-attention-model-review-rev3';assert(!fs.existsSync(folder),'review already exists');
const fp=p=>({path:p,sha256:createHash('sha256').update(fs.readFileSync(p)).digest('hex')});
const hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const {buildGeneralDeclarationPacket}=await server.ssrLoadModule('/src/campaign3/generalDeclarations.ts');
 const {generalRecipeNames}=await server.ssrLoadModule('/src/campaign3/generalDefinitionProfile.ts');
 const {compileGeneralModelCandidate,generalCandidateVersions}=await server.ssrLoadModule('/src/campaign3/generalModelCandidate.ts');
 const {createGeneralSourceRuntime}=await server.ssrLoadModule('/src/campaign3/generalSourceRuntime.ts');
 const {deriveGeneralWorkBudget}=await server.ssrLoadModule('/src/campaign3/generalWorkBudget.ts');
 const {decodeGeneralAttention}=await server.ssrLoadModule('/src/campaign3/generalAttentionCodecs.ts');
 const {generalBindingContext}=await server.ssrLoadModule('/src/campaign3/generalBindingProfile.ts');
 const {canonicalEncode}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 fs.mkdirSync(folder);const files=[],models=[],shared=new Map(),seed=Uint8Array.from({length:32},(_,i)=>i+1);
 function write(name,bytes){const p=folder+'/'+name+'.cenc.hex';fs.writeFileSync(p,hex(bytes)+'\n');const file=fp(p);files.push(file);return file;}
 for(const [index,name] of generalRecipeNames().entries()){
  const packet=buildGeneralDeclarationPacket(name),candidate=await compileGeneralModelCandidate(packet),runtime=createGeneralSourceRuntime(candidate.model),prefix=String(index).padStart(2,'0');
  const images={definitions:packet.definitions,registrations:packet.registrations,registry:candidate.registryBytes(),parameters:candidate.parameterBytes(),initial:candidate.model.initial.bytes(),originals:runtime.originalBytes(),identity:candidate.identity.canonicalBytes};
  const imageFiles={};for(const [part,bytes] of Object.entries(images)){assert.equal(hex(canonicalEncode(decodeGeneralAttention(bytes,generalBindingContext()))),hex(bytes));imageFiles[part]=write(prefix+'-'+part,bytes);}
  for(const part of ['content','roles']){if(shared.has(part))assert.equal(hex(packet[part]),shared.get(part).bytes);else shared.set(part,{bytes:hex(packet[part]),file:write('shared-'+part,packet[part])});}
  const run=await candidate.runIdentity(images.originals,seed);
  models.push({name,modelIdentity:hex(candidate.identity.canonicalBytes),runIdentity:hex(run.canonicalBytes),files:imageFiles});
 }
 const sourcePaths=[...new Set([...server.moduleGraph.idToModuleMap.values()].map(m=>m.file&&path.resolve(m.file)).filter(p=>p&&p.startsWith(process.cwd()+path.sep)&&!p.includes('node_modules')).map(p=>path.relative(process.cwd(),p).replaceAll('\\','/')))].sort();
 assert(sourcePaths.length>100,'complete loaded source closure');
 const budget=deriveGeneralWorkBudget();
 const aliases=[...new Set(models.map(m=>m.modelIdentity))].map(identity=>models.filter(m=>m.modelIdentity===identity).map(m=>m.name)).filter(names=>names.length>1);
 const receipt={status:'MATERIALIZED CANDIDATE IMAGES; NOT FROZEN OR PUBLICLY ACTIVATED',versions:generalCandidateVersions,seed:hex(seed),models,shared:Object.fromEntries([...shared].map(([k,v])=>[k,v.file])),aliases,budget:JSON.parse(JSON.stringify(budget,(_,v)=>typeof v==='bigint'?v.toString():v)),sources:[...sourcePaths.map(fp),fp('scripts/materialize-general-attention-models.mjs')],counters:{highestAllocated:706,allocatedSinceVerdictOrCorpusMember:0}};
 fs.writeFileSync(folder+'/REVIEW.json',JSON.stringify(receipt,null,2)+'\n');
 console.log(JSON.stringify({models:models.length,distinctModels:new Set(models.map(m=>m.modelIdentity)).size,aliases,work:String(budget.work),outputs:String(budget.outputs),slots:String(budget.slots),sourceFiles:sourcePaths.length}));
}finally{await server.close();}
