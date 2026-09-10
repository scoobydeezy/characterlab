// Internal construction helper; model inputs remain data-only. No execution/activation.
import fs from 'node:fs';import assert from 'node:assert/strict';
export async function embodiedDeclarationTools(server){
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const codec=await server.ssrLoadModule('/src/campaign3/embodiedCodecs.ts');
 const {statePathPatternValue}=await server.ssrLoadModule('/src/substrate/state.ts');
 const {semanticReferentFromAuthoredContent}=await server.ssrLoadModule('/src/substrate/referentOrigin.ts');
 const allocation=JSON.parse(fs.readFileSync('docs/formal/EMBODIED_RESERVE_ALLOCATION_TABLE.json'));
 const old=codec.decodeEmbodied(Uint8Array.from(Buffer.from(fs.readFileSync('docs/planning/campaign2-task-cognitive-model/registry.cenc.hex','utf8').trim(),'hex')));
 const {unsigned:u,signed:i,rational:q,text:t,list,set,map,canonicalEncode:enc}=c;
 const id=(ns,p)=>c.typedIdentifier(ns,t(p)),schemas=codec.embodiedSupportedSchemas();
 const schema=name=>typeof name==='number'?codec.embodiedSchema(BigInt(name)):schemas.find(s=>s.name===name&&s.typeId>=453n);
 const r=(name,values)=>{const s=schema(name);assert(s,name);return codec.embodiedRecord(Number(s.typeId),values);};
 const raw=(type,fields)=>c.record(codec.embodiedSchema(BigInt(type)),new Map(Object.entries(fields).map(([n,v])=>[BigInt(n),v])));
 const def=s=>id(1027,'definition/'+s),event=s=>id(1001,'event/'+s),seam=s=>id(1036,'seam/'+s),version=s=>s+'/0.1-candidate';
 const ref=name=>r(254,[u(schema(name).typeId),u(1)]);
 const char=semanticReferentFromAuthoredContent(id(1038,'character/embodied-subject')),observer=id(1000,'observer/embodied-subject');
 const unit=id(1039,'unit/embodied-fuel-stock'),channel=id(1005,'channel/embodied-fuel-level');
 const role=(ns,qualified=false)=>raw(263,{1:u(ns),...(qualified?{2:id(1021,'validator/character-qualification')}:{})});
 const pattern=(root,exact=false)=>statePathPatternValue({rootStateTypeId:BigInt(root),fieldId:1n,selectors:[exact?{kind:'exact',selector:{kind:'mapKey',key:char}}:{kind:'wildcard',selectorKind:'mapKey'}]});
 const roster=pattern(268),body=pattern(455),bodyRead=pattern(455,true);
 const projection=(field=1)=>set([r(266,[u(field),roster,u(1),role(1002,true),id(1028,'ResolvedCharacterSubject')])]);
 const entry=(stable,kind,ver,value)=>r(171,[stable,id(1023,kind),t(ver),value]);
 const instances=(name,kind,ver,value)=>entry(def(name),'registry/'+kind,version(ver),value);
 const inherited=old.items[0].items.filter(v=>v.schema.typeId===172n||(v.schema.typeId===171n&&v.fields.get(2n).payload.value==='registry/union-variant-definition'));
 const addedDescriptors=allocation.records.map(s=>r(172,[u(s.typeId),u(1),t(s.name),list(s.fields.map(f=>r(173,[u(f.id),t(f.name),f.required])))]));
 const unionVersion=old.items[0].items.find(v=>v.schema.typeId===171n&&v.fields.get(2n).payload.value==='registry/union-variant-definition').fields.get(3n).value;
 const unions=allocation.unionDefinitions.map(v=>entry(c.typedIdentifier(1024,list([u(v.recordTypeId),u(v.tag)])),'registry/union-variant-definition',unionVersion,r(259,[u(v.recordTypeId),u(v.tag),set(v.requiredPayloadFieldIds.map(u)),set(v.forbiddenPayloadFieldIds.map(u))])));
 const kind=id(1004,'semantic-kind/character');
 const val=[entry(kind,'registry/semantic-kind','content-kind/0.1-candidate',r(329,[ref(170)])),entry(id(1021,'validator/character-qualification'),'registry/domain-validator','governed-domain-validator/0.1-candidate',r(330,[kind]))];
 const positions=[...allocation.roles,...allocation.mapKeyRoles].map(p=>({type:p.recordTypeId,field:p.fieldId,map:p.position==='StateMapKey',ns:p.requiredNamespace,qualified:p.domainValidatorId!==null}));
 positions.push({type:267,field:1,map:false,ns:1002,qualified:true},{type:268,field:1,map:true,ns:1000,qualified:false},{type:227,field:1,map:false,ns:1106,qualified:false},{type:227,field:2,map:false,ns:1000,qualified:false});
 const roles=set(positions.map(p=>r(265,[raw(264,{1:u(p.map?2:1),[p.map?3:2]:u(p.type),4:u(p.field)}),role(p.ns,p.qualified)])));
 const leaf=r(153,[body,r(152,[u(3),u(454)]),false]);
 const owner=r(154,[id(1025,'authority/embodied-reserve'),set([leaf])]);
 const ownership=r(155,[t('mutation-authority/0.1-candidate#TRC-001-002-addendum'),set([owner])]);
 const readOnly=set([r(262,[roster,r(152,[u(3),u(267)])])]),keys=set([body,roster].map(p=>r(261,[p,r(260,[u(1)])])));
 const occurrence=map([[227,1106],[461,1115],[463,1115],[464,1142]].map(([type,ns])=>[ref(type),r(278,[u(1),role(ns)])]));
 const shared=entry(def('transition-admission'),'registry/transition-admission','transition-admission/0.4-candidate',r(279,[set([]),map([]),occurrence]));
 const noWrite=r(273,[u(1)]),pressureOutput=set([r(277,[ref('EmbodiedPressureOutput'),u(1)])]);
 const profiles={rulesVersion:'rules/campaign3-embodied-reserve/0.1-candidate',registrySchemaVersion:'campaign3-embodied-registry/0.1-candidate',contentSchemaVersion:'content/0.2-candidate',parameterSchemaVersion:'campaign3-embodied-parameters/0.1-candidate',numericProfileVersion:'numeric/embodied-reserve-exact/0.1-candidate',randomAlgorithmVersion:'rng/sha256-addressed-128-v1-candidate'};
 const models=['baseline','slower','coarser','denied','unavailable','overflow','work7'];
 function source(name='baseline'){
  assert(models.includes(name));
  const rows=[...inherited,...addedDescriptors,...unions,...val,shared];
  const add=(name,kind,ver,payload)=>rows.push(instances(name,kind,ver,payload));
  add('embodied-reserve-parameters','embodied-reserve-parameters','embodied-reserve',r('ReserveParameters',[unit,q(100,1),q(1,name==='slower'?2:1)]));
  add('embodied-reserve-bodies','embodied-reserve-bodies','embodied-reserve',r('ReserveBodyRegistryDefinition',[set([r('ReserveBodyBinding',[char,def('embodied-reserve-parameters')])])]));
  add('embodied-level-channel','embodied-level-channel','embodied-level-observation',r('LevelChannelDefinition',[channel,observer,unit,id(1006,'modality/embodied-fuel-level'),q(100,1),q(name==='coarser'?20:10,1),name!=='unavailable',name!=='denied']));
  add('embodied-pressure','embodied-pressure-definition','embodied-pressure',r('PressureDefinition',[def('embodied-level-channel'),q(60,1)]));
  add('embodied-level-source','embodied-level-source-registration','embodied-source-admission',r('LevelSourceRegistration',[seam('embodied-level-observation'),t(version('embodied-level-observation')),r('LevelSourceDefinition',[ref('LevelSamplingOpportunity'),set([roster,bodyRead]),projection(),set([def('embodied-level-channel')]),def('embodied-reserve-bodies'),r('LevelSampleOutputChoice',[ref('EmbodiedLevelObservation'),ref('UnavailableLevelSample')]),noWrite]),r('LevelInputOnlyOrigin',[event('embodied-level-sample'),u(10)])]));
  for(const present of [true,false]){
   const branch=present?'Present':'Unavailable';
   const prerequisite=present?r('PresentWithFrozenSupport',[def('embodied-level-source'),t(version('embodied-level-observation')),event('embodied-level-sample'),u(10),ref('EmbodiedLevelObservation'),t('semantic-binding/0.1-candidate#SEM-001H'),u(1),event('embodied-level-settlement'),u(14),ref(227),u(1)]):r('UnavailableOpportunityResult',[def('embodied-level-source'),t(version('embodied-level-observation')),event('embodied-level-sample'),u(10),ref('UnavailableLevelSample'),event('embodied-level-settlement'),u(14),u(1)]);
   const admission=r(branch+'LevelInputAdmission',[ref(present?'EmbodiedLevelObservation':'UnavailableLevelSample'),prerequisite]);
   const definition=r(branch+'PressureTransitionDefinition',[admission,set([roster]),pressureOutput,noWrite,projection(2),def('embodied-pressure')]);
   rows.push(entry(id(1009,'Embodied'+branch+'PressureTransition'),'registry/embodied-pressure-'+branch.toLowerCase()+'-registration',version('embodied-pressure-admission'),r(branch+'PressureRegistration',[seam('embodied-pressure'),t(version('embodied-pressure')),definition,r('LevelPressureIngressDefinition',[event('embodied-pressure-'+branch.toLowerCase()),u(60)])])));
  }
  for(const amount of [30,5,60])add('embodied-delivery-'+amount,'embodied-replenishment-definition','embodied-replenishment',r('ReserveReplenishmentDefinition',[char,def('embodied-reserve-parameters'),unit,q(amount===60&&name==='overflow'?64:amount,1)]));
  add('embodied-replenishment','embodied-replenishment-registration','embodied-replenishment',r('ReserveReplenishmentRegistration',[seam('embodied-replenishment'),t(version('embodied-replenishment')),ref('ReserveReplenishmentInput'),r('LevelInputOnlyOrigin',[event('embodied-reserve-replenishment'),u(110)]),set([30,5,60].map(n=>def('embodied-delivery-'+n))),def('embodied-reserve-bodies'),set([bodyRead]),set([body]),id(1025,'authority/embodied-reserve'),ref('ReserveReplenishmentResult')]));
  assert.equal(rows.length,425);
  const content=r(170,[id(1038,'character/embodied-subject'),kind,...Array.from({length:14},()=>list([]))]);
  return {...profiles,content:enc(set([content])),registry:enc(list([set(rows),old.items[1],ownership,readOnly,keys,roles])),parameters:enc(list([r(133,[u(name==='work7'?7:8)])]))};
 }
 return {c,codec,source,models,profiles,char,observer,r,id,def,event,role,ref};
}
