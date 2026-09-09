// Independent receiving-declaration audit, not runtime semantics or activation.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {cognitiveDeclarationTools} from './cognitive-model-declarations.mjs';
const output='docs/planning/COGNITIVE_DEFINITION_CLOSURE_REVIEW_REV1.json';assert(!fs.existsSync(output));
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const paths=['scripts/cognitive-model-declarations.mjs','scripts/review-cognitive-definition-closure.mjs','docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json','docs/planning/campaign2-cognitive-declaration-review/REVIEW_MANIFEST.json'];const before=paths.map(fp);
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try{
 const t=await cognitiveDeclarationTools(server),{f,key}=t,{canonicalEncode:enc,record,list,set}=t.c;
 const definitions={
  'task-workspace':[378,'task-workspace'],'task-concern':[385,'task-concern'],'task-motive':[392,'task-motive'],'task-candidates':[435,'task-candidates'],'task-reason-source':[436,'task-reason-source'],'task-reason-dice':[437,'task-reason-dice'],'task-arbitration':[440,'task-arbitration'],'protocol-execution':[434,'protocol-execution'],'protocol-observation':[451,'protocol-observation'],'task-instruction-one':[389,'task-instruction'],'task-instruction-two':[389,'task-instruction'],'protocol-contact-one':[391,'protocol-action'],'protocol-contact-two':[391,'protocol-action'],
 };
 const references={
  'TaskWorkspaceDefinition.PredictionDefinitionId':359,'PlanInstructionDefinition.ProtocolActionDefinitionId':391,'TaskWorkspaceSourceRegistration.AgendaDefinitionId':378,'TaskConcernRegistration.ConcernDefinitionId':385,'TaskMotiveRegistration.MotiveDefinitionId':392,'TaskCandidateRegistration.CandidateDefinitionId':435,'TaskRawSignalRegistration.ReasonSourceDefinitionId':436,'TaskReasonCompilationRegistration.ReasonDiceDefinitionId':437,'TaskArbitrationRegistration.ArbitrationDefinitionId':440,'ProtocolExecutionRegistration.ExecutionDefinitionId':434,
 };
 const addMembers=t.allocation.members.filter(m=>typeof m.payload==='string');
 let checkedFields=0,checkedReferences=0;
 function review(source){
  const slots=t.decode(source.registry).items,rows=slots[0].items.filter(v=>v.schema?.typeId===171n),byId=new Map(rows.map(r=>[key(f(r,1)),r]));
  for(const [name,[type,kind]] of Object.entries(definitions)){const row=byId.get(key(t.id(1027,'definition/'+name)));assert(row,'required definition '+name);assert.equal(f(row,4).schema.typeId,BigInt(type));assert.equal(f(row,4).schema.schemaVersion,1n);assert.equal(f(row,2).payload.value,'registry/'+kind);}
  const primitive=(value,type)=>{if(type==='bool'){assert.equal(typeof value,'boolean');return;}assert(value&&typeof value==='object');assert.equal(value.kind,{u:'unsigned',i:'signed',q:'rational',text:'text'}[type]);};
  function typed(value,grammar){
   const m=/^(\w+)(?:\((.*)\))?$/.exec(grammar);assert(m);const [,kind,body]=m;
   if(!body){if(['u','i','q','bool','text'].includes(kind))return primitive(value,kind);if(/^\d+$/.test(kind))return typed(value,'r('+kind+')');if(t.allocation.identifierAliases[kind]!==undefined)return typed(value,'id('+kind+')');return typed(value,'r('+kind+')');}
   if(kind==='r'){const target=/^\d+$/.test(body)?BigInt(body):BigInt(t.allocation.records.find(r=>r.name===body)?.typeId??-1);assert.equal(value?.schema?.typeId,target);return;}
   if(kind==='id'){assert.equal(value?.kind,'typedIdentifier');const ns=t.allocation.identifierAliases[body];assert.equal(value.namespaceId,BigInt(ns));if(ns>=1040&&ns<=1043)assert(addMembers.some(m=>m.namespace===ns&&m.payload===value.payload.value),'closed discriminator');return;}
   if(kind==='enum'){primitive(value,'u');assert(t.allocation.finiteValues.find(e=>e.name===body)?.values.some(v=>BigInt(v.value)===value.value));return;}
   const args=body.split(',');assert.equal(value?.kind,kind);if(kind==='map')for(const [a,b] of value.entries){typed(a,args[0]);typed(b,args[1]);}else{assert(['set','list'].includes(kind));for(const child of value.items)typed(child,body);}
  }
  function visit(value){if(typeof value==='boolean')return;if(value.kind==='record'){
   const schema=t.allocation.records.find(r=>BigInt(r.typeId)===value.schema.typeId);
   if(schema){assert.equal(value.schema.schemaVersion,1n);for(const field of schema.fields){const v=value.fields.get(BigInt(field.id));if(v===undefined){assert(!field.required);continue;}typed(v,field.type);checkedFields++;
    const target=references[schema.name+'.'+field.name];if(target){const row=byId.get(key(v));assert(row,'missing referenced definition');assert.equal(f(row,4).schema.typeId,BigInt(target),'reference has wrong definition kind');checkedReferences++;}
   }}
   if(value.schema.typeId===416n){const specs=f(value,2).items;assert.equal(specs.length,2);for(const id of specs){const row=byId.get(key(id));assert(row);assert.equal(f(row,4).schema.typeId,370n);}}
   if(value.schema.typeId===448n){assert.equal(f(f(value,3),1).value,415n);assert.equal(f(f(value,3),2).value,1n);assert.equal(f(value,4).payload.value,'accessor/task-identity-history');}
   if(value.schema.typeId===447n){assert.equal(f(f(value,3),1).value,373n);assert.equal(f(f(value,3),2).value,2n);assert.equal(f(value,4).payload.value,'accessor/task-plan-binding');}
   if(value.schema.typeId===451n){assert.equal(f(value,1).payload.value,'ProtocolExecutionTransition');assert.equal(f(f(value,2),1).value,433n);assert.equal(f(f(value,6),1).value,310n);assert.deepEqual(f(value,5).entries.map(([k,v])=>[Number(k.value),v.payload.value]),['observation','tracking','bindings','classification','experience'].map((n,i)=>[120+i,'event/protocol-'+n]));assert.deepEqual(f(value,7).items.map(v=>Number(f(v,1).value)).sort((a,b)=>a-b),[203,227]);assert.equal(f(f(value,3),5).namespaceId,1039n);assert.equal(f(f(value,3),5).payload.value,'unit/fixture-pulse');}
   for(const child of value.fields.values())visit(child);
  }else if(value.kind==='list'||value.kind==='set')value.items.forEach(visit);else if(value.kind==='map')for(const [a,b] of value.entries){visit(a);visit(b);}}
  visit(slots[0]);return rows;
 }
 for(const recipe of t.recipes)review(t.source(recipe));
 const base=t.source(),slots=t.decode(base.registry).items;
 const replace=(v,n,x)=>record(v.schema,new Map([...v.fields].map(([i,a])=>[i,i===BigInt(n)?x:a])));
 const mutate=(name,change)=>({...base,registry:enc(list(slots.map((v,i)=>i===0?set(v.items.map(r=>r.schema?.typeId===171n&&f(r,1).payload?.value===name?change(r):r)):v)))});
 assert.throws(()=>review(mutate('definition/task-instruction-one',r=>replace(r,4,replace(f(r,4),1,t.id(1027,'definition/task-concern'))))),/wrong definition kind/);
 assert.throws(()=>review(mutate('definition/protocol-observation',r=>replace(r,4,replace(f(r,4),1,t.id(1009,'TaskArbitrationTransition'))))));
 assert.throws(()=>review(mutate('definition/task-concern',r=>replace(r,2,t.id(1023,'registry/protocol-action')))));
 assert.deepEqual(paths.map(fp),before);
 fs.writeFileSync(output,JSON.stringify({status:'RECEIVING DECLARATION CHECKS PASS; MODEL FREEZE PENDING',sourceFingerprints:before,models:21,definitionRowsPerModel:13,checkedFields,checkedReferences,rejectedMutations:['instruction refers to wrong definition kind','observation projection names wrong producer','definition stored under wrong registry kind'],scope:'New definition/registration primitive and reference grammar plus exact controller/read targets. Not live source authentication, new psychological record runtime validation or behavioral qualification.'},null,2)+'\n');
 console.log(JSON.stringify({models:21,checkedFields,checkedReferences,rejectedMutations:3}));
}finally{await server.close();}
