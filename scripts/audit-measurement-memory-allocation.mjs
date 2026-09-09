import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),prefix='docs/formal/MEASUREMENT_MEMORY_';
const raw=p=>fs.readFileSync(new URL(p,root)),read=p=>raw(p).toString('utf8');
const t=JSON.parse(read(prefix+'ALLOCATION_TABLE.json')),md=read(prefix+'ALLOCATION_REVIEW.md'),checks=[];
function eq(name,a,b){assert.deepEqual(a,b,name);checks.push({name,status:'PASS'});}
eq('allocation lifecycle',['REVIEW CANDIDATE','PERMANENT AND FROZEN'].includes(t.status),true);
eq('allocation version',t.version,t.status==='PERMANENT AND FROZEN'?'measurement-memory-allocation/0.1-candidate':'measurement-memory-allocation/0.1-draft');
eq('accepted authority',read(t.authority).includes('**Status: WHOLE SHAPE ACCEPTED.**'),true);
eq('Markdown lifecycle',md.includes('**Status: '+t.status+'.**'),true);
const names=['MeasurementEpisodeLearningEvidence','EventDependentProjectedFieldPathRequirement','MeasurementEpisodeKey','MeasurementEpisode','MeasurementEpisodeState','MemoryFormationRegistration','MemoryFormationDefinition','MeasurementEpisodeReadRequirement','MeasurementRecallOpportunityDefinition','MeasurementRecallCue','MeasurementRecollection','RecallRegistration','DelayedRecallEventAdmission','RecollectionOutputDefinition'];
const fields=['MeasurementEpisodeLearningEvidenceId Source337 TransformationVersion','SelectorSourceFieldPath TargetStatePathTemplate ProjectedFieldId OutputRole OutputAccessor','CharacterId CognitiveMeasurementEvidenceId','LearningEvidence','Episodes','ExecutingSeamId ExecutingSeamVersion TransitionDefinition IngressDefinition','InputAdmission ReadDomain OutputDefinitions WriteCapability','SubjectAccessor EvidenceSourceFieldId TargetStatePathTemplate OutputAccessor','ProducingTransitionKind RecallEventTypeId RecallDelay','ObserverId CognitiveMeasurementEvidenceId','MeasurementRecollectionId Episode TransformationVersion','ExecutingSeamId ExecutingSeamVersion InputAdmission ReadDomain OutputDefinitions WriteCapability','InputRecordSchema OpportunityDefinitionId','OutputRecordSchema'];
const types=['1125 337 text','list<FieldId> 149 FieldId 263 1028','1002 1124','342','map<344,345>','1036 text 348 276','274 set<149> set<277> 322','1028 FieldId 149 1028','1009 1001 SimDuration','1000 1124','1126 345 text','1036 text 354 set<149> set<355> 273','254 1027','254'];
eq('exact record names',t.records.map(r=>r.name),names);
const closure=read('docs/planning/CAMPAIGN2_MEASUREMENT_MEMORY_SYMBOLIC_CLOSURE.md');
for(const [i,r]of t.records.entries()){
 eq(r.name+' append ID',r.typeId,342+i);eq(r.name+' version',r.schemaVersion,1);
 eq(r.name+' fields',r.fields.map(f=>f.name),fields[i].split(' '));
 eq(r.name+' types',r.fields.map(f=>f.type),types[i].split(' '));
 eq(r.name+' required IDs',r.fields.map(f=>[f.id,f.required]),r.fields.map((_,j)=>[j+1,true]));
 eq(r.name+' accepted inventory',closure.includes(r.name),true);
 eq(r.name+' Markdown parity',md.includes(`| ${r.typeId} | ${r.name} | ${r.fields.map(f=>`${f.id} ${f.name}:${f.type}`).join('; ')} |`),true);
}
eq('namespaces',t.namespaces,[{namespace:1125,name:'MeasurementEpisodeLearningEvidenceId',scope:'run-scoped occurrence',payload:'unsigned-runtime-ordinal'},{namespace:1126,name:'MeasurementRecollectionId',scope:'run-scoped occurrence',payload:'unsigned-runtime-ordinal'}]);
eq('exact members',t.members.map(m=>[m.namespace,m.payload]),[[1009,'MeasurementEpisodeEvidenceTransition'],[1009,'MemoryFormationTransition'],[1009,'MeasurementRecallTransition'],[1036,'seam/measurement-episodic-memory'],[1001,'event/measurement-episode-evidence'],[1001,'event/measurement-episode-formation'],[1001,'event/measurement-exact-recall'],[1001,'event/measurement-episode-evidence-padding'],[1001,'event/measurement-episode-formation-padding'],[1001,'event/measurement-future-padding'],[1027,'definition/measurement-recall-opportunity'],[1023,'registry/measurement-recall-opportunity'],[1025,'authority/measurement-episode-formation'],[1032,'leaf/measurement-episode'],[1028,'accessor/measurement-episode-read']]);
for(const m of t.members){eq(m.payload+' NFC',m.payload.normalize('NFC'),m.payload);eq(m.payload+' parity',md.includes(`| ${m.namespace} | ${m.payload} |`),true);}
for(const n of t.namespaces)eq(n.name+' parity',md.includes(`| ${n.namespace} | ${n.name} | ${n.payload} |`),true);
eq('roles',t.roles.map(r=>[r.recordTypeId,r.fieldId,r.requiredNamespace]),[[342,1,1125],[343,5,1028],[344,1,1002],[344,2,1124],[347,1,1036],[349,1,1028],[349,4,1028],[350,1,1009],[350,2,1001],[351,1,1000],[351,2,1124],[352,1,1126],[353,1,1036],[354,2,1027]]);
for(const r of t.roles){eq('validator '+r.recordTypeId+'/'+r.fieldId,r.domainValidatorId,r.recordTypeId===344&&r.fieldId===1?'validator/character-qualification':null);eq('role parity '+r.recordTypeId+'/'+r.fieldId,md.includes(`| ${r.recordTypeId} | ${r.fieldId} | ${r.requiredNamespace} | ${r.domainValidatorId??'absent'} |`),true);}
eq('only genuine new occurrence rules',t.occurrenceIdentities,[{recordTypeId:342,schemaVersion:1,identityFieldId:1,requiredNamespace:1125,domainValidatorId:null},{recordTypeId:352,schemaVersion:1,identityFieldId:1,requiredNamespace:1126,domainValidatorId:null}]);
eq('existing observer role',t.reusedRoles,[{recordTypeId:203,fieldId:2,requiredNamespace:1000,domainValidatorId:null}]);
eq('no union or finite allocation',[t.unionVariants,t.finiteValues],[[],[]]);
eq('exact state realization',t.state,{root:346,field:1,keyRecord:344,valueRecord:345,authority:'authority/measurement-episode-formation',leaf:'leaf/measurement-episode',removalAllowed:false,logicalFamily:'episodic-memory',route:'route/character-learning',topologyDefinitionVersion:'adaptation-input/0.31-candidate'});
const priorRecords=new Set(),priorNamespaces=new Set(),priorMembers=new Set();
for(const p of t.preservedSources){
 eq('preserved '+p.path,crypto.createHash('sha256').update(raw(p.path)).digest('hex'),p.sha256);
 if(p.path.endsWith('_ALLOCATION_TABLE.json')){const v=JSON.parse(read(p.path));for(const r of v.records??[])priorRecords.add(r.typeId);for(const n of v.namespaces??[])priorNamespaces.add(n.namespace);for(const m of v.members??[])priorMembers.add(m.namespace+':'+m.payload);}
}
eq('previous record maximum',Math.max(...priorRecords),341);eq('previous namespace maximum',Math.max(...priorNamespaces),1124);
for(const r of t.records)eq('unused record '+r.typeId,priorRecords.has(r.typeId),false);
for(const n of t.namespaces)eq('unused namespace '+n.namespace,priorNamespaces.has(n.namespace),false);
for(const m of t.members)eq('unused member '+m.payload,priorMembers.has(m.namespace+':'+m.payload),false);
eq('frozen sixteen vectors',(read('docs/planning/CAMPAIGN2_MEASUREMENT_MEMORY_DRAFT.md').match(/^\| MEMR-[A-P] \|/gm)||[]).length,16);
eq('runtime remains gated',read(t.authority).includes('runtime implementation is not authorized'),true);
fs.writeFileSync(new URL(prefix+'ALLOCATION_AUDIT.json',root),JSON.stringify({status:'PASS',allocationStatus:t.status,scope:'allocation consistency only; no runtime controls passed',tableSha256:crypto.createHash('sha256').update(raw(prefix+'ALLOCATION_TABLE.json')).digest('hex'),checks},null,2)+'\n');
console.log(`${checks.length} allocation checks PASS; ${t.status}; no runtime controls passed.`);
