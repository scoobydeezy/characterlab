// Data-only model construction for allocation review. No semantic handler or runtime.
import fs from 'node:fs';
import assert from 'node:assert/strict';
export async function cognitiveDeclarationTools(server){
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {taskSupportedSchemas,decodeTask}=await server.ssrLoadModule('/src/campaign2/taskCodecs.ts');
 const {taskModelReviewSource,TASK_BUNDLE}=await server.ssrLoadModule('/src/campaign2/taskModelReview.ts');
 const {statePathPatternValue}=await server.ssrLoadModule('/src/substrate/state.ts');
 const {recordRole}=await server.ssrLoadModule('/src/campaign2/firstModelCandidate.ts');
 const allocation=JSON.parse(fs.readFileSync('docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json','utf8'));
 const added=[...allocation.records,...allocation.schemaSuccessors].map(r=>({typeId:BigInt(r.typeId),schemaVersion:BigInt(r.schemaVersion),name:r.name,fields:r.fields.map(f=>({id:BigInt(f.id),name:f.name,required:f.required}))}));
 const schemas=[...taskSupportedSchemas(),...added],registry=new c.RecordSchemaRegistry();for(const s of schemas)registry.register(s);
 const schema=(type,version)=>{const matches=schemas.filter(s=>typeof type==='string'?s.name===type:s.typeId===BigInt(type)).filter(s=>version===undefined||s.schemaVersion===BigInt(version));if(matches.length===2&&matches.every(s=>s.typeId===373n)&&version===undefined)return matches.find(s=>s.schemaVersion===2n);assert.equal(matches.length,1,'exact schema '+type);return matches[0];};
 const r=(type,values,version)=>{const s=schema(type,version);assert(values.length<=s.fields.length);return c.record(s,new Map(values.map((v,i)=>[s.fields[i].id,v])));};
 const named=(type,values)=>{const s=schema(type);return c.record(s,new Map(Object.entries(values).map(([name,v])=>{const f=s.fields.find(f=>f.name===name);assert(f,name);return [f.id,v];})));};
 const {list,set,map,text,unsigned:u,signed,rational:q,canonicalEncode:enc}=c;
 const id=(n,p)=>c.typedIdentifier(n,text(p)),f=(v,n)=>{const value=v.fields.get(BigInt(n));assert(value!==undefined,'field '+n);return value;},key=v=>Buffer.from(enc(v)).toString('hex');
 const ref=type=>{const s=schema(type);return r(254,[u(s.typeId),u(s.schemaVersion)]);};
 const role=(ns,validator)=>named(263,{RequiredNamespace:u(ns),...(validator?{DomainValidatorId:id(1021,validator)}:{})});
 const replace=(v,n,value)=>c.record(v.schema,new Map([...v.fields].map(([k,a])=>[k,k===BigInt(n)?value:a])));
 const pattern=(root,field=1)=>statePathPatternValue({rootStateTypeId:BigInt(root),fieldId:BigInt(field),selectors:[{kind:'wildcard',selectorKind:'mapKey'}]});
 const entry=(stable,version,value,kind='registry/transition-registration')=>r(171,[stable,id(1023,kind),text(version),value]);
 const version=stem=>stem+'/0.1-candidate',seam=stem=>id(1036,'seam/'+stem),def=p=>id(1027,'definition/'+p),transition=p=>id(1009,p),event=p=>id(1001,'event/'+p);
 const noWrite=()=>r(273,[u(1)]),output=type=>set([r(277,[ref(type),u(1)])]);
 const admission=(type,parent)=>r(274,[ref(type),named(275,{VariantTag:u(2),ProducingTransitionKind:transition(parent)}),u(1)]);
 const ingress=(name,phase)=>r(276,[event(name),u(1),u(phase),u(1),u(1)]);
 const ordinary=(stem,input,parent,name,phase,out,reads=[])=>r(272,[seam(stem),text(version(stem)),r(271,[admission(input,parent),set(reads),output(out),noWrite()]),ingress(name,phase)]);
 const fieldPath=steps=>list(steps.map(([type,field])=>{const s=schema(type),f=s.fields.find(f=>f.name===field);assert(f,type+'.'+field);return u(f.id);}));
 const recipes=['baseline','workspace-zero','workspace-one','workspace-two','task-access-off','forecast-access-off','concern-off','base-off','plan-access-off','standing-access-off','execution-blocked','protocol-observer-off','equal-criteria','deadline-overlap','history-boundary','standing-integer','context-integer','die-six','die-eight','die-ten','die-twelve'];
 const profiles={orderedInput:'campaign2-task-cognitive-ordered-input/0.1-candidate',trace:'campaign2-task-cognitive-trace-binding/0.1-candidate',persistence:'campaign2-task-cognitive-persistence/0.1-candidate'};
 const bundle=[...TASK_BUNDLE,...allocation.executingVersions,'task-cognitive-path/0.1-candidate','task-cognitive-plan-leaf/0.1-candidate',...Object.values(profiles)];
 function source(recipe='baseline'){
  assert(recipes.includes(recipe));const base=taskModelReviewSource(),slots=decodeTask(base.registry).items,old=slots[0].items;
  const row=payload=>{const xs=old.filter(v=>v.kind==='record'&&v.schema.typeId===171n&&f(v,1).payload?.kind==='text'&&f(v,1).payload.value===payload);assert.equal(xs.length,1,payload);return xs[0];};
  const oldBridge=row('definition/authored-fact-consequence-bridge'),channel=f(f(oldBridge,4),1).entries[0][1];
  const roster=pattern(268),tasks=pattern(373),prediction=pattern(362),plans=pattern(373,2),identity=pattern(415),subject=id(1028,'ResolvedCharacterSubject'),channelId=id(1041,'CommitmentFidelity');
  const rawPath=fieldPath([['TaskCandidateOptions','MotiveContext'],['TaskMotiveContext','Concern'],['TaskConcern','Appraisal'],['TaskAppraisal','Workspace'],['TaskWorkspace','CharacterId']]);
  const identityReq=path=>r('TaskIdentityReadRequirement',[path,channelId,identity,id(1028,'accessor/task-identity-history')]);
  const sourceReg=r('TaskWorkspaceSourceRegistration',[seam('task-workspace'),text(version('task-workspace')),ref(377),event('deliberation-opportunity'),def('task-workspace'),set([roster,tasks,prediction]),output(381),noWrite(),set([r(266,[u(1),roster,u(1),role(1002,'validator/character-qualification'),subject])]),set([r('TaskWorkspaceTaskRequirement',[subject,set([def('task-a'),def('task-b')]),tasks,id(1028,'accessor/workspace-task-status')])]),set([r(363,[subject,def('measurement-prediction'),prediction,id(1028,'accessor/measurement-prediction-prior')])])]);
  const concernReg=r('TaskConcernRegistration',[ordinary('task-appraisal-affect',384,'TaskAppraisalTransition','task-concern',50,388),def('task-concern')]);
  const planReq=r('TaskPlanBindingRequirement',[fieldPath([['TaskMotiveContext','Concern'],['TaskConcern','Appraisal'],['TaskAppraisal','Workspace'],['TaskWorkspace','CharacterId']]),fieldPath([['TaskMotiveContext','Concern'],['TaskConcern','Appraisal'],['TaskAppraisal','Workspace'],['TaskWorkspace','Tasks']]),plans,id(1028,'accessor/task-plan-binding')]);
  const applicationPath=fieldPath([['DecisionQualification','DecisionExpression'],['DecisionExpression','ChosenIntent'],['ChosenIntent','DecisionResolution'],['DecisionResolution','ReasonContext'],['TaskReasonContext','RawSignalContext'],['TaskRawSignalContext','CandidateOptions'],['TaskCandidateOptions','MotiveContext'],['TaskMotiveContext','Concern'],['TaskConcern','Appraisal'],['TaskAppraisal','Workspace'],['TaskWorkspace','CharacterId']]);
  const application=r('TaskIdentityApplicationRegistration',[seam('task-identity-evidence'),text(version('task-identity-evidence')),admission(429,'TaskQualificationTransition'),set([identity]),set([]),named(322,{VariantTag:u(2),MutationAuthority:id(1025,'authority/task-identity-evidence'),WritableFamilies:set([id(1031,'identity-disposition')])}),ingress('task-identity-application',140),identityReq(applicationPath)]);
  const registrations=[
   ['TaskWorkspaceTransition','task-workspace',sourceReg],
   ['TaskAppraisalTransition','task-appraisal-affect',ordinary('task-appraisal-affect',381,'TaskWorkspaceTransition','task-appraisal',50,384)],
   ['TaskConcernTransition','task-appraisal-affect',concernReg],
   ['TaskMotiveTransition','task-motive-context',r('TaskMotiveRegistration',[ordinary('task-motive-context',388,'TaskConcernTransition','task-motive',60,394),def('task-motive')])],
   ['TaskCandidateTransition','task-option-construction',r('TaskCandidateRegistration',[ordinary('task-option-construction',394,'TaskMotiveTransition','task-candidates',70,398,[plans]),def('task-candidates'),planReq])],
   ['TaskRawSignalTransition','task-reason-source',r('TaskRawSignalRegistration',[ordinary('task-reason-source',398,'TaskCandidateTransition','task-raw-signals',80,403,[identity]),def('task-reason-source'),identityReq(rawPath)])],
   ['TaskReasonCompilationTransition','reason-dice',r('TaskReasonCompilationRegistration',[ordinary('reason-dice',403,'TaskRawSignalTransition','task-reasons',80,408),def('task-reason-dice')])],
   ['TaskArbitrationTransition','task-arbitration',r('TaskArbitrationRegistration',[ordinary('task-arbitration',408,'TaskReasonCompilationTransition','task-arbitration',80,409),def('task-arbitration'),r('ChosenIntentIngressDefinition',[event('task-intent'),u(90),ref(409),u(1)])])],
   ['TaskIntentTransition','task-decision-expression',ordinary('task-decision-expression',409,'TaskArbitrationTransition','task-intent',90,425)],
   ['TaskExpressionTransition','task-decision-expression',ordinary('task-decision-expression',425,'TaskIntentTransition','task-expression',90,426)],
   ['TaskPlanTransition','bounded-protocol-execution',ordinary('bounded-protocol-execution',425,'TaskIntentTransition','task-plan',100,431)],
   ['TaskAttemptTransition','bounded-protocol-execution',ordinary('bounded-protocol-execution',431,'TaskPlanTransition','task-attempt',110,432)],
   ['ProtocolExecutionTransition','bounded-protocol-execution',r('ProtocolExecutionRegistration',[ordinary('bounded-protocol-execution',432,'TaskAttemptTransition','protocol-execution',110,433),def('protocol-execution')])],
   ['ProtocolActualFactBridgeTransition','bounded-protocol-execution',ordinary('bounded-protocol-execution',433,'ProtocolExecutionTransition','protocol-actual-fact',110,307)],
   ['TaskQualificationTransition','task-identity-evidence',ordinary('task-identity-evidence',426,'TaskExpressionTransition','task-qualification',130,429)],
   ['TaskIdentityApplicationTransition','task-identity-evidence',application],
  ].map(([name,stem,value])=>entry(transition(name),version(stem),value));
  const thresholds={'die-six':[[1,100],[1,20],[1,10],[1,5],[3,10]],'die-eight':[[1,100],[1,50],[1,20],[1,10],[1,5]],'die-ten':[[1,100],[1,50],[3,100],[1,20],[1,10]],'die-twelve':[[1,100],[1,50],[3,100],[1,25],[1,20]]}[recipe]??[[1,5],[2,5],[3,5],[4,5],[1,1]];
  const definitions=[
   ['task-workspace','task-workspace',r(378,[def('measurement-prediction'),u({'workspace-zero':0,'workspace-one':1,'workspace-two':2}[recipe]??3),recipe!=='task-access-off',recipe!=='forecast-access-off'])],
   ['task-concern','task-appraisal-affect',r(385,[q(1,1),recipe!=='concern-off'])],
   ['task-motive','task-motive-context',r(392,[q(1,10),recipe!=='base-off'])],
   ['task-candidates','task-option-construction',r(435,[recipe!=='plan-access-off'])],
   ['task-reason-source','task-reason-source',r(436,[recipe!=='standing-access-off',q(1,10)])],
   ['task-reason-dice','reason-dice',r(437,[r(438,thresholds.map(([n,d])=>q(n,d))),q(37,100),r(439,[q(1,recipe==='standing-integer'?10:1),u(3)]),r(439,[q(1,recipe==='context-integer'?10:1),u(3)])])],
   ['task-arbitration','task-arbitration',r(440,[q(1,2),q(1,2)])],
   ['protocol-execution','bounded-protocol-execution',r(434,[!['execution-blocked','history-boundary'].includes(recipe)])],
   ['protocol-observation','protocol-consequence-observation',r(451,[transition('ProtocolExecutionTransition'),ref(433),channel,recipe!=='protocol-observer-off',map(['observation','tracking','bindings','classification','experience'].map((n,i)=>[u(120+i),event('protocol-'+n)])),ref(310),set([ref(203),ref(227)])])],
   ['task-instruction-one','task-plan-context',r(389,[def('protocol-contact-one')]),'task-instruction'],
   ['task-instruction-two','task-plan-context',r(389,[def('protocol-contact-two')]),'task-instruction'],
   ['protocol-contact-one','bounded-protocol-execution',r(391,[u(1)]),'protocol-action'],
   ['protocol-contact-two','bounded-protocol-execution',r(391,[u(2)]),'protocol-action'],
  ].map(([name,stem,value,kind])=>entry(def(name),version(stem),value,'registry/'+(kind??name)));
  const adRow=row('definition/transition-admission'),ad=f(adRow,4);
  const joinedAdmission=replace(replace(adRow,3,text('task-cognitive-path/0.1-candidate')),4,r(279,[f(ad,1),map([...f(ad,2).entries,...['TaskQualificationTransition','TaskIdentityApplicationTransition'].map(t=>[transition(t),id(1026,'route/character-learning')])]),map([...f(ad,3).entries,...allocation.occurrenceIdentities.map(o=>[ref(o.recordTypeId),r(278,[u(1),role(o.requiredNamespace)])])])]));
  const topologyRow=row('definition/campaign2-state-families'),topology=f(topologyRow,4);
  const families=f(topology,1).entries.map(([family,value])=>{const n=family.payload.value;if(n==='prospective-commitments')return [family,replace(value,2,named(286,{VariantTag:u(2),RootStateTypeId:u(373),LeafFields:map([[id(1032,'leaf/task-commitment'),u(1)],[id(1032,'leaf/task-instruction'),u(2)]])}))];if(n==='identity-disposition')return [family,replace(value,2,named(286,{VariantTag:u(2),RootStateTypeId:u(415),LeafFields:map([[id(1032,'leaf/identity-evidence'),u(1)]])}))];return [family,value];});
  const joinedTopology=replace(replace(topologyRow,3,text('task-cognitive-path/0.1-candidate')),4,r(284,[map(families)]));
  const specs=['a','b'].map((suffix,i)=>{const old=row('definition/task-'+suffix),value=f(old,4);const end=recipe==='deadline-overlap'?2+i:recipe==='history-boundary'?99+i:10+i;let next=replace(value,6,signed(end));if(recipe==='equal-criteria'){next=replace(replace(next,3,q(4,1)),4,q(6,1));}return [old,replace(old,4,next)];});
  const exposure=old.find(v=>v.kind==='record'&&v.schema.typeId===171n&&f(v,4).kind==='record'&&f(v,4).schema.typeId===318n&&f(f(f(v,4),5),1).value===1n);assert(exposure,'one regulatory exposure registration');
  const ext=f(exposure,4),td=f(ext,3),input=f(td,1);const joinedExposure=replace(exposure,4,replace(ext,3,replace(td,1,replace(input,2,named(321,{VariantTag:u(2),ProducingTransitionKind:transition('ProtocolActualFactBridgeTransition')})))));
  const changed=new Map([[key(adRow),joinedAdmission],[key(topologyRow),joinedTopology],[key(exposure),joinedExposure],...specs.map(([a,b])=>[key(a),b])]);
  const descriptors=added.map(s=>r(172,[u(s.typeId),u(s.schemaVersion),text(s.name),list(s.fields.map(f=>r(173,[u(f.id),text(f.name),f.required])))]));
  const unionRows=allocation.unionDefinitions.map(v=>entry(c.typedIdentifier(1024,list([u(v.recordTypeId),u(v.tag)])),version('task-cognitive-path'),r(259,[u(v.recordTypeId),u(v.tag),set(v.requiredPayloadFieldIds.map(u)),set(v.forbiddenPayloadFieldIds.map(u))]),'registry/union-variant-definition'));
  const inherited=old.filter(v=>!(v.kind==='record'&&v.schema.typeId===172n&&f(v,1).value===373n)).map(v=>changed.get(key(v))??v);
  const owners=replace(slots[2],2,set([...f(slots[2],2).items,r(154,[id(1025,'authority/task-identity-evidence'),set([r(153,[identity,r(152,[u(3),u(414)]),false])])])]));
  let replacedTruthRole=0;const inheritedRoles=slots[5].items.map(v=>{if(v.kind==='record'&&v.schema.typeId===265n){const p=f(v,1);if(f(p,1).value===1n&&f(p,2).value===200n&&f(p,4).value===9n){assert.equal(f(f(v,2),1).value,1121n);replacedTruthRole++;return replace(v,2,role(1141));}}return v;});assert.equal(replacedTruthRole,1);
  const roles=allocation.roles.map(v=>recordRole(v.recordTypeId,v.fieldId,role(v.requiredNamespace,v.domainValidatorId)));
  const registryValue=list([set([...inherited,...descriptors,...unionRows,...definitions,...registrations]),slots[1],owners,set([...slots[3].items,r(262,[plans,r(152,[u(3),u(390)])])]),set([...slots[4].items,r(261,[plans,r(260,[u(2),u(371)])]),r(261,[identity,r(260,[u(2),u(412)])])]),set([...inheritedRoles,...roles])]);
  return {...base,rulesVersion:'rules/campaign2-task-cognitive/0.1-candidate',registrySchemaVersion:'campaign2-task-cognitive-registry/0.1-candidate',numericProfileVersion:'numeric/task-cognitive-exact/0.1-candidate',registry:enc(registryValue),parameters:enc(list([r(133,[u(27)])]))};
 }
 return {c,allocation,schemas,registry,r,named,ref,f,key,id,source,recipes,profiles,bundle,decode:bytes=>c.canonicalDecode(bytes,registry),predecessor:taskModelReviewSource};
}
