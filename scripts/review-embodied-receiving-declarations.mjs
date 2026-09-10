// Independent component review of materialized bytes; no constructor import.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const output='docs/planning/EMBODIED_RECEIVING_DECLARATION_REVIEW_REV1.json';assert(!fs.existsSync(output));
const folder='docs/planning/embodied-receiving-model-review-rev1',manifest=JSON.parse(fs.readFileSync(folder+'/REVIEW.json'));
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const checks=[],check=(name,fn)=>{fn();checks.push(name);},server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const {canonicalEncode:enc}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {decodeReceiving:decode,receivingSchema:schema}=await server.ssrLoadModule('/src/campaign3/receivingCodecs.ts');
 const {compileReceivingTaskContentDeclarations:compileContent}=await server.ssrLoadModule('/src/campaign2/taskDeclarations.ts');
 const {compileCampaign2StateModel}=await server.ssrLoadModule('/src/campaign2/stateModel.ts');
 const {compileOccurrenceIdentities}=await server.ssrLoadModule('/src/campaign2/occurrenceIdentity.ts');
 const {compileEmbodiedRequiredProjections:bodyPRJ,compileReceivingRequiredProjections:workspacePRJ}=await server.ssrLoadModule('/src/campaign2/requiredProjection.ts');
 const f=(v,n)=>v.fields.get(BigInt(n)),k=v=>Buffer.from(enc(v)).toString('hex');
 const spec=[['workspace',40,377,381],['appraisal',50,381,384],['concern',50,384,388],['task-motive',60,388,394],['body-options',70,464,489],['task-candidates',70,394,398],['mixed-candidates',70,491,492],['task-raw',80,398,403],['mixed-raw',80,498,499],['mixed-reasons',80,499,504],['resolution',80,504,508],['intent',90,508,509],['expression',90,509,511],['plan',100,509,512],['attempt',110,512,513],['execution',110,513,514]];
 for(const model of manifest.models){
  for(const file of model.files)check(model.name+' file commitment '+file.path,()=>assert.deepEqual(fp(file.path),file));
  const read=name=>Buffer.from(fs.readFileSync(folder+'/'+model.name+'/'+name+'.cenc.hex','utf8').trim(),'hex');
  const slots=decode(read('registry')).items,rows=slots[0].items.filter(v=>v.schema.typeId===171n),definitions=rows.map(v=>f(v,4));
  const content=await compileContent(read('content'),read('registry'));content.validateRecordRoles(read('registry'));checks.push(model.name+' actual two-kind content and recursive role compilation');
  const state=compileCampaign2StateModel(enc(slots[2]),enc(slots[3]),enc(slots[4]),content,{decode,schema});
  check(model.name+' exact five state families',()=>assert.deepEqual(state.declaredFamilies().map(x=>[Number(x.pattern.rootStateTypeId),Number(x.pattern.fieldId),x.readonly]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]),[[268,1,true],[373,1,false],[373,2,true],[455,1,false],[487,1,true]]));
  for(const type of [465n,469n,470n]){const registration=definitions.find(v=>v.schema?.typeId===type),d=f(registration,3);bodyPRJ(enc(registration),enc(f(d,type===465n?3:5)),[],state,content);checks.push(model.name+' actual body PRJ '+type);}
  const registrations=definitions.filter(v=>v.schema?.typeId===515n);check(model.name+' 16 unique stages',()=>assert.equal(new Set(registrations.map(v=>String(f(v,1).value))).size,16));
  for(const [index,[name,phase,input,out]] of spec.entries()){
   const registration=registrations.find(v=>f(v,1).value===BigInt(index+1));assert(registration);
   check(model.name+' '+name+' declared schema/phase/no-writes',()=>{assert.equal(f(registration,4).payload.value,'event/embodied-receiving-'+name);assert.equal(f(registration,5).value,BigInt(phase));assert.equal(f(f(registration,6),1).value,BigInt(input));assert.equal(f(f(registration,8),1).value,1n);assert.equal(f(registration,10).items.length,1);assert.equal(f(f(f(registration,10).items[0],1),1).value,BigInt(out));});
   if(name==='workspace'){workspacePRJ(enc(registration),enc(f(registration,9)),[],state,content);checks.push(model.name+' actual515 PRJ/IDN compilation');}
   else check(model.name+' '+name+' no repeated subject lookup',()=>assert.equal(f(registration,9).items.length,0));
  }
  const admission=definitions.find(v=>v.schema?.typeId===279n),occurrences=compileOccurrenceIdentities(enc(f(admission,3)),content,{decode,schema});
  check(model.name+'20 occurrence schema rules',()=>assert.equal([...occurrences.schemaKeys()].length,20));
  check(model.name+'deadline-only prospective route',()=>{assert.deepEqual(f(admission,1).items.map(v=>v.payload.value),['route/prospective-control']);assert.equal(f(admission,2).entries.length,1);assert.equal(f(admission,2).entries[0][0].payload.value,'TaskDeadlineSettlementTransition');});
  check(model.name+'all new descriptors present',()=>{for(let type=485;type<=515;type++)assert(slots[0].items.some(v=>v.schema.typeId===172n&&f(v,1).value===BigInt(type)));});
 }
}finally{await server.close();}
fs.writeFileSync(output,JSON.stringify({status:'STATIC DECLARATION COMPONENT REVIEW PASS; NOT MODEL FREEZE OR RUNTIME QUALIFICATION',checked:checks.length,checks,sources:[folder+'/REVIEW.json','src/campaign3/receivingCodecs.ts','src/campaign2/taskDeclarations.ts','src/campaign2/requiredProjection.ts','src/campaign3/receivingAdmission.ts','src/campaign3/receivingInputs.ts','scripts/review-embodied-receiving-declarations.mjs'].map(fp),limits:['Does not yet prove exact complete definition references or candidate-recipe differences.','Does not qualify RNG, graph joins, replay, behavior, or EMB-M..O.']},null,2)+'\n');console.log(JSON.stringify({checked:checks.length}));
