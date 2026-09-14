import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const output='docs/planning/GA_REGISTRY_MEMBER_SHAPE_REV1.json';assert(!fs.existsSync(output));
const read=p=>JSON.parse(fs.readFileSync(p)),fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const topology='docs/planning/GA_COMPOSED_LOGICAL_TOPOLOGY_REV2.json',allocation='docs/formal/GENERAL_ATTENTION_CARRIER_ALLOCATION_TABLE.json';
const graph=read(topology),table=read(allocation),byName=new Map(table.records.map(r=>[r.name,r]));
const stages=graph.stages.map(s=>({name:s.name,phase:s.phase,input:s.input,outputs:s.outputs,
 transition:'transition/general-attention-'+s.name,event:'event/general-attention-'+s.name,seam:'seam/general-attention-'+s.name,
 meaning:'Fixed stage template; admitted model binds exact version, reads, write authorization and definitions.'}));
const accessors=[
 ['episodes-prior','GeneralEpisodeState','CharacterId','SurvivingEpisodeLedger','Identity'],
 ['event-recall-evidence','GeneralEpisodeState','CharacterId','RecalledAcquisitionEvidence','EventPartition'],
 ['body-recall-evidence','GeneralEpisodeState','CharacterId','RecalledAcquisitionEvidence','BodyPartition'],
 ['association-prior','GeneralAssociationState','CharacterId','AssociationGraph','Identity'],
 ['presentations-prior','GeneralPresentationState','CharacterId','PresentationLedger','Identity'],
 ['goals-prior','MaintenanceGoalState','CharacterId','MaintenanceGoalLedger','Identity'],
 ['tracking-prior','GeneralTrackingState','ObserverId','TrackingWindow','Identity'],
 ['panel-prior','TrialPanelContextState','ObserverId','TrialPanelWindow','Identity']
].map(([name,root,key,result,projection])=>({member:'accessor/general-attention-'+name,root,field:'Value',rootTypeId:byName.get(root).typeId,fieldId:1,key,result,resultTypeId:byName.get(result).typeId,projection,missingLeaf:'Reject invalid state; never synthesize empty',cognitive:true}));
const authorities=[
 ['authority/general-attention-ordinary-memory',['GeneralEpisodeState'],'Episodic owner only'],
 ['authority/general-attention-association',['GeneralAssociationState'],'Independent graph owner only'],
 ['authority/general-attention-presentation',['GeneralPresentationState'],'Presentation owner only'],
 ['authority/general-attention-goal-lifecycle',['MaintenanceGoalState'],'Adopt/withdraw/expiry owner only'],
 ['authority/formation-governance',['FormationGovernanceState'],'Runtime protocol hook only; not cognitive'],
 ['authority/general-attention-local-reserve',['LocalReserveState'],'Physical owner only; exact qualified composite key']
].map(([member,roots,scope])=>({member,roots,scope}));
const other=[
 {family:'SemanticKindId',member:'semantic-kind/bodily-maintenance-goal',meaning:'Governed adopted bodily goal; distinct from holder and immutable specification'},
 {family:'DomainValidatorId',member:'validator/maintenance-goal-qualification',meaning:'Fixed content-kind predicate; compiler separately proves spec/content/referent/holder bijection'},
 {family:'RegistryKindId',member:'registry/general-attention-definition',meaning:'Closed exact schema/version-governed declarations; no executable payload'}
];
const members=[...stages.flatMap(s=>[{family:'TransitionKindId',member:s.transition},{family:'EventTypeId',member:s.event},{family:'SeamId',member:s.seam}]),...accessors.map(a=>({family:'ProjectionAccessorId',member:a.member})),...authorities.map(a=>({family:'MutationAuthorityId',member:a.member})),...other];
assert.equal(new Set(members.map(m=>m.family+'/'+m.member)).size,members.length);
fs.writeFileSync(output,JSON.stringify({version:'general-attention-registry-member-shape/0.1-draft',status:'SYMBOLIC MEMBER PROPOSAL; NO PERMANENT MEMBER ASSIGNMENT',members,stages,accessors,authorities,
 reused:['ResolvedCharacterSubject and existing PRJ/IDN character qualification','authority/perception for exact new observer windows only when model authorization extends its declared roots','Existing SEM active/counter accessors and task/prediction producer declarations','Existing identity namespaces; no new namespace family'],
 pending:['Exact definition/content/member instances for each model','Canonical role declarations and exact domain membership','Exact stage versions, compiled ReadDomain/write patterns and definition references','Whole-model work ceiling and output-slot execution','ModelIdentity/RulesVersion packaging and public qualification'],sources:[topology,allocation,'docs/planning/GA_ACCESSOR_CLOSURE_REV1.md','docs/planning/GA_IDENTITY_ROLE_CLOSURE_REV1.md','scripts/prepare-ga-registry-members.mjs'].map(fp)},null,2)+'\n');
console.log(JSON.stringify({members:members.length,stages:stages.length,accessors:accessors.length,authorities:authorities.length}));
