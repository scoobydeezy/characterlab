// Committed-data construction after symbolic and numeric gates. No runtime activation.
import fs from 'node:fs';import assert from 'node:assert/strict';
import {embodiedDeclarationTools} from './embodied-declaration-tools.mjs';
export async function embodiedReceivingDeclarationTools(server){
 const b=await embodiedDeclarationTools(server),c=b.c;
 const allocation=JSON.parse(fs.readFileSync('docs/formal/EMBODIED_RECEIVING_ALLOCATION_TABLE.json'));
 const vocabulary=JSON.parse(fs.readFileSync('docs/planning/EMBODIED_RECEIVING_VOCABULARY_REV2.json'));
 const {statePathPatternValue}=await server.ssrLoadModule('/src/substrate/state.ts');
 const {semanticReferentFromAuthoredContent}=await server.ssrLoadModule('/src/substrate/referentOrigin.ts');
 const {unsigned:u,signed:i,rational:q,text:t,list,set,map,canonicalEncode:enc,record,RecordSchemaRegistry}=c;
 const added=allocation.records.map(r=>({typeId:BigInt(r.typeId),schemaVersion:1n,name:r.name,fields:r.fields.map(f=>({id:BigInt(f.id),name:f.name,required:f.required}))}));
 const schemas=[...b.codec.embodiedSupportedSchemas(),...added],schemaMap=new Map(schemas.map(s=>[s.typeId,s])),registry=new RecordSchemaRegistry(schemas);
 const schema=type=>{const s=schemaMap.get(BigInt(type));assert(s);return s;};
 const r=(type,values)=>record(schema(type),new Map(values.map((v,j)=>[BigInt(j+1),v]))),raw=(type,fields)=>record(schema(type),new Map(Object.entries(fields).map(([n,v])=>[BigInt(n),v])));
 const f=(v,n)=>{const value=v.fields.get(BigInt(n));assert(value!==undefined,'field '+n);return value;},key=v=>Buffer.from(enc(v)).toString('hex'),decode=bytes=>c.canonicalDecode(bytes,registry);
 const id=(ns,p)=>c.typedIdentifier(ns,t(p)),def=p=>id(1027,'definition/'+p),ref=type=>r(254,[u(type),u(schema(type).schemaVersion)]),replace=(v,n,value)=>record(v.schema,new Map([...v.fields].map(([k,x])=>[k,k===BigInt(n)?value:x])));
 const oldBytes=name=>Uint8Array.from(Buffer.from(fs.readFileSync('docs/planning/campaign2-task-cognitive-model/'+name+'.cenc.hex','utf8').trim(),'hex'));
 const old=decode(oldBytes('registry')).items,oldContent=decode(oldBytes('content')).items;
 const row=name=>{const matches=old[0].items.filter(v=>v.schema?.typeId===171n&&f(v,1).payload?.value===name);assert.equal(matches.length,1,name);return matches[0];};
 const prediction=row('definition/measurement-prediction'),C=f(f(prediction,4),2),O=b.observer;
 const characterContent=oldContent.find(v=>f(v,2).payload.value==='semantic-kind/character'),taskContent=oldContent.find(v=>f(v,1).payload.value==='content/task-a');assert(characterContent&&taskContent);
 const taskReferent=semanticReferentFromAuthoredContent(f(taskContent,1)),taskKey=r(371,[C,taskReferent]);
 function rebind(v){if(key(v)===key(b.char))return C;if(typeof v==='boolean')return v;if(v.kind==='record')return record(v.schema,new Map([...v.fields].map(([n,a])=>[n,rebind(a)])));if(v.kind==='list'||v.kind==='set')return c[v.kind](v.items.map(rebind));if(v.kind==='map')return map(v.entries.map(([a,x])=>[rebind(a),rebind(x)]));return v;}
 const pattern=(root,field=1)=>statePathPatternValue({rootStateTypeId:BigInt(root),fieldId:BigInt(field),selectors:[{kind:'wildcard',selectorKind:'mapKey'}]});
 const roster=pattern(268),tasks=pattern(373),plans=pattern(373,2),context=pattern(487),role=(ns,validator)=>raw(263,{1:u(ns),...(validator?{2:id(1021,validator)}:{})});
 const roleRow=(type,field,ns,validator,mapKey=false)=>r(265,[raw(264,{1:u(mapKey?2:1),[mapKey?3:2]:u(type),4:u(field)}),role(ns,validator)]);
 const entry=(stable,kind,version,value)=>r(171,[stable,id(1023,kind),t(version),value]);
 const models=['baseline','slower','coarser','denied','unavailable','task-base-off','task-plan-off','execution-blocked','quiet','auto','weak-task','work25','no-coverage-control'];
 const versions={rulesVersion:'rules/campaign3-embodied-receiving/0.1-candidate',registrySchemaVersion:'campaign3-embodied-receiving-registry/0.1-candidate',contentSchemaVersion:'content/0.2-candidate',parameterSchemaVersion:'campaign3-embodied-receiving-parameters/0.1-candidate',numericProfileVersion:'numeric/embodied-receiving-exact/0.1-candidate',randomAlgorithmVersion:'rng/sha256-addressed-128-v1-candidate'};
 const graph={workspace:['appraisal'],appraisal:['concern'],concern:['task-motive'],'task-motive':['task-candidates'],'task-candidates':['task-raw','mixed-candidates'],'task-raw':['mixed-raw'],'mixed-raw':['mixed-reasons'],'mixed-reasons':['resolution'],resolution:['intent'],intent:['expression','plan'],plan:['attempt'],attempt:['execution']};
 const stageByName=new Map(vocabulary.stages.map(s=>[s.stage,s]));
 const sources=stage=>stage==='body-options'?['event/embodied-pressure-present','event/embodied-pressure-unavailable']:stage==='mixed-candidates'?['task-candidates','body-options'].map(s=>stageByName.get(s).event):stage==='mixed-raw'?['task-raw','mixed-candidates'].map(s=>stageByName.get(s).event):Object.entries(graph).filter(([,children])=>children.includes(stage)).map(([s])=>stageByName.get(s).event);
 const typeRef=name=>/^\d+\//.test(name)?ref(Number(name.split('/')[0])):ref(allocation.records.find(r=>r.name===name).typeId);
 const occurrenceTypes=[[381,1128],[384,1129],[388,1130],[394,1131],[398,1132],[403,1133],...allocation.occurrenceIdentities.map(o=>[o.recordTypeId,o.requiredNamespace])];
 function source(name='baseline'){
  assert(models.includes(name));const base=b.source(['slower','coarser','denied','unavailable'].includes(name)?name:'baseline'),slots=decode(base.registry).items.map(rebind);
  const rows=slots[0].items.map(v=>{if(v.schema.typeId===171n&&[469n,470n].includes(f(v,4).schema?.typeId))return replace(v,4,replace(f(v,4),2,t('embodied-pressure/0.2-candidate')));if(v.schema.typeId===171n&&f(v,1).payload?.value==='definition/transition-admission'){const ad=f(v,4),route=id(1026,'route/prospective-control');return replace(v,4,r(279,[set([route]),map([[id(1009,'TaskDeadlineSettlementTransition'),route]]),map([...f(ad,3).entries,...occurrenceTypes.map(([type,ns])=>[ref(type),r(278,[u(1),role(ns)])])])]));}return v;});
  rows.push(...added.map(s=>r(172,[u(s.typeId),u(1),t(s.name),list(s.fields.map(f=>r(173,[u(f.id),t(f.name),f.required])))])));
  const unionVersion=f(rows.find(v=>v.schema.typeId===171n&&f(v,2).payload.value==='registry/union-variant-definition'),3).value;
  rows.push(...allocation.unionDefinitions.map(v=>entry(c.typedIdentifier(1024,list([u(v.recordTypeId),u(v.tag)])),'registry/union-variant-definition',unionVersion,r(259,[u(v.recordTypeId),u(v.tag),set(v.requiredPayloadFieldIds.map(u)),set(v.forbiddenPayloadFieldIds.map(u))]))));
  rows.push(row('semantic-kind/task-commitment'),row('validator/task-qualification'),prediction);
  const taskSpec=row('definition/task-a');rows.push(replace(taskSpec,4,replace(replace(f(taskSpec,4),5,i(0)),6,i(100))));
  const add=(name,kind,version,value)=>rows.push(entry(def(name),'registry/'+kind,version,value));
  for(const s of ['task-instruction-one','task-instruction-two','protocol-contact-one','protocol-contact-two'])rows.push(row('definition/'+s));
  add('task-workspace','task-workspace','task-workspace/0.1-candidate',r(378,[def('measurement-prediction'),u(3),true,false]));
  add('task-concern','task-concern','task-appraisal-affect/0.1-candidate',r(385,[q(1,1),true]));
  add('task-motive','task-motive','task-motive-context/0.1-candidate',r(392,[q(1,name==='weak-task'?20:4),name!=='task-base-off']));
  add('task-candidates','task-candidates','task-option-construction/0.1-candidate',r(435,[name!=='task-plan-off']));
  add('task-reason-source','task-reason-source','task-reason-source/0.1-candidate',r(436,[false,q(1,10)]));
  add('task-reason-dice','task-reason-dice','reason-dice/0.1-candidate',r(437,[r(438,[[1,20],[1,10],[1,5],[3,10],[2,5]].map(([n,d])=>q(n,d))),q(0,1),r(439,[q(1,1),u(3)]),r(439,[q(1,1),u(3)])]));
  add('task-arbitration','task-arbitration','task-arbitration/0.1-candidate',r(440,[q(1,name==='auto'?1:10),q(1,name==='quiet'?1:10)]));
  add('protocol-execution','protocol-execution','bounded-protocol-execution/0.1-candidate',r(434,[name!=='execution-blocked']));
  for(const [suffix,action] of [['a','one'],['a-copy','one'],['b','two']])add('embodied-response-'+suffix,'embodied-response-instruction','embodied-response-instruction/0.1-candidate',r(485,[def('embodied-pressure'),def('protocol-contact-'+action)]));
  for(const [j,s] of vocabulary.stages.entries()){
   const version=name==='no-coverage-control'&&['mixed-raw','mixed-reasons'].includes(s.stage)?'embodied-task-reasons-no-coverage-control/0.1-candidate':s.seam+'/0.1-candidate';
   const reads=s.stage==='workspace'?[roster,tasks]:s.stage==='task-candidates'?[plans]:s.stage==='body-options'?[context]:[];
   const projections=s.stage==='workspace'?[r(266,[u(1),roster,u(1),role(1002,'validator/character-qualification'),id(1028,'ResolvedCharacterSubject')])]:[];
   rows.push(entry(id(1009,s.transition),'registry/transition-registration',version,r(515,[u(j+1),id(1036,'seam/'+s.seam),t(version),id(1001,s.event),u(s.phase),typeRef(s.input),set(reads),r(273,[u(1)]),set(projections),set([r(277,[typeRef(s.output),u(1)])]),set(sources(s.stage).map(n=>id(1001,n)))])));
  }
  rows.push(row('TaskDeadlineSettlementTransition'));
  const topology=row('definition/campaign2-state-families'),prospective=f(f(topology,4),1).entries.filter(([k])=>k.payload.value==='prospective-commitments');assert.equal(prospective.length,1);
  rows.push(replace(topology,4,r(284,[map(prospective)])));
  const owner=r(154,[id(1025,'authority/prospective-commitments'),set([r(153,[tasks,r(152,[u(3),u(372)]),false])])]);
  const ownership=replace(slots[2],2,set([...f(slots[2],2).items,owner]));
  const readonly=set([...slots[3].items,r(262,[plans,r(152,[u(3),u(390)])]),r(262,[context,r(152,[u(3),u(486)])])]);
  const keys=set([...slots[4].items,r(261,[tasks,r(260,[u(2),u(371)])]),r(261,[plans,r(260,[u(2),u(371)])]),r(261,[context,r(260,[u(1)])])]);
  const roleMap=new Map(slots[5].items.map(v=>[key(f(v,1)),v]));
  // Retain inherited field roles used by the intact nested task source records.
  for(const v of old[5].items){if(v.schema.typeId!==265n)continue;const p=f(v,1),tag=f(p,1).value,type=f(p,tag===1n?2:3).value;if(tag===1n&&type>=359n&&type<=452n)roleMap.set(key(p),v);}
  for(const x of [...allocation.roles,...allocation.mapKeyRoles]){const v=roleRow(x.recordTypeId,x.fieldId,x.requiredNamespace,x.domainValidatorId,x.position==='StateMapKey');roleMap.set(key(f(v,1)),v);}
  return {...versions,content:enc(set([characterContent,taskContent])),registry:enc(list([set(rows),slots[1],ownership,readonly,keys,set([...roleMap.values()])])),parameters:enc(list([r(133,[u(name==='work25'?25:26)])]))};
 }
 return {c,allocation,vocabulary,schemas,schema,r,raw,f,key,decode,id,def,ref,role,pattern,models,versions,source,C,O,taskKey,taskReferent,characterContent,taskContent};
}
