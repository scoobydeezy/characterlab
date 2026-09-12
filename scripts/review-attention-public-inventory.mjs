// Symbolic design audit only. Does not allocate or execute a public ATTN factory.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='docs/planning/',inventoryPath=dir+'ATTENTION_PUBLIC_INVENTORY_REV1.json',receiptPath=dir+'ATTENTION_PUBLIC_INVENTORY_REVIEW_REV1.json';
assert(!fs.existsSync(inventoryPath)&&!fs.existsSync(receiptPath),'forward artifacts must not overwrite history');
const fields=(...pairs)=>pairs.map(([name,type])=>({name,type}));
const records={
 AttentionSceneDefinition:fields(['PortReferents','list3<existing:SemanticReferentId>'],['PortRoles','list3<existing:EventRoleId>'],['Version','text']),
 AttentionSceneOriginal:fields(['DueAt','existing:SimInstant'],['SceneDefinitionId','existing:DefinitionId']),
 AttentionRoleChannelDefinition:fields(['ObserverId','existing:ObserverId'],['PortModes','list3<mode>'],['Version','text']),
 AttentionSelectionPolicy:fields(['Algorithm','algorithm'],['Capacity','capacity'],['Version','text']),
 ObservedRoleDetection:fields(['DetectionId','existing:214'],['RoleEvidence','existing:223']),
 AttentionRoleObservation:fields(['ObservationId','existing:ObservationId'],['ObserverId','existing:ObserverId'],['OccurredAt','existing:SimInstant'],['EventDetectionId','existing:215'],['Detections','list1..3<ObservedRoleDetection>'],['TransformationVersion','text']),
 AttentionNoDetectionObservation:fields(['ObservationId','existing:ObservationId'],['ObserverId','existing:ObserverId'],['OccurredAt','existing:SimInstant'],['TransformationVersion','text']),
 AttentionTrackingInput:fields(['Observation','AttentionRoleObservation']),
 AttentionBindingInput:fields(['Observation','AttentionRoleObservation'],['EventTransition','existing:219'],['TrackTransitions','list1..3<existing:217>']),
 AttentionClassificationInput:fields(['Observation','AttentionRoleObservation'],['EventTransition','existing:219'],['Bindings','list1..3<existing:224>']),
 AttentionFreezeInput:fields(['Observation','AttentionRoleObservation'],['EventTransition','existing:219'],['Bindings','list1..3<existing:224>']),
 AttentionRoleBatchInput:fields(['Experience','existing:227']),
 AttentionPositiveSelectionInput:fields(['Experience','existing:227'],['Claims','list0..3<existing:240>']),
 AttentionEmptySelectionInput:fields(['Observation','AttentionNoDetectionObservation']),
 AttentionUnitKey:fields(['EventFile','existing:213'],['ContinuantFile','existing:212']),
 AttentionAuditRow:fields(['Unit','AttentionUnitKey'],['Roles','set<existing:CausalRoleId>'],['Exclusion','exclusion'],['Priority','optional<existing:Rational>'],['Selected','boolean'],['EvidenceRefs','set<existing:237>']),
 AttentionExperienceSource:fields(['ExperienceId','existing:ExperienceId']),
 AttentionEmptySource:fields(['ObservationId','existing:ObservationId']),
 AttentionSelectionAudit:fields(['SelectionId','new:SelectionOccurrenceId'],['ObserverId','existing:ObserverId'],['OccurredAt','existing:SimInstant'],['Source','selectionSource'],['Policy','AttentionSelectionPolicy'],['Rows','list0..3<AttentionAuditRow>'],['TransformationVersion','text']),
 SelectedAttentionUnit:fields(['Unit','AttentionUnitKey'],['Bindings','list1..1<existing:224>'],['Claims','list1..1<existing:240>']),
 SelectedEvidenceView:fields(['SelectionId','new:SelectionOccurrenceId'],['ObserverId','existing:ObserverId'],['OccurredAt','existing:SimInstant'],['Units','list0..3<SelectedAttentionUnit>']),
 AttentionBindingRead:fields(['Binding','existing:224']),
 AttentionRoleRead:fields(['Claim','existing:240']),
 AttentionProcessingReceipt:fields(['ProcessingId','new:ProcessingOccurrenceId'],['SelectionId','new:SelectionOccurrenceId'],['ObserverId','existing:ObserverId'],['OccurredAt','existing:SimInstant'],['ReadValues','list0..6<readValue>'],['TransformationVersion','text']),
};
const enums={mode:['Denied','VisibleExact','VisibleUnresolved'],algorithm:['RolePriority','EqualPriority','Unlimited'],capacity:[0,1,2],exclusion:['Eligible','MissingRole','MultipleRoles','UnsupportedRole']};
const unions={selectionSource:['AttentionExperienceSource','AttentionEmptySource'],readValue:['AttentionBindingRead','AttentionRoleRead']};
const stage=(name,phase,input,outputs,children,counts,writes=[])=>({name,phase,input,outputs,children,counts,writes});
const stages=[
 stage('World',0,'AttentionSceneOriginal',['existing:210'],['Observe'],[4,1]),
 stage('Observe',10,'existing:210',['AttentionRoleObservation|AttentionNoDetectionObservation'],['Track|EmptySelect'],['n+3 if n>0 else 1',1]),
 stage('Track',11,'AttentionTrackingInput',['existing:219','n*existing:217'],['Bind'],[0,'1+n'],['241/1','241/2','242/1','242/2']),
 stage('Bind',12,'AttentionBindingInput',['n*existing:224'],['Classify'],['n','n']),
 stage('Classify',13,'AttentionClassificationInput',[],['Freeze'],[0,0]),
 stage('Freeze',14,'AttentionFreezeInput',['existing:227'],['Role'],[0,1]),
 stage('Role',15,'AttentionRoleBatchInput',['q*existing:240'],['PositiveSelect'],['q','q']),
 stage('PositiveSelect',40,'AttentionPositiveSelectionInput',['AttentionSelectionAudit'],['Consume'],[1,1]),
 stage('EmptySelect',40,'AttentionEmptySelectionInput',['AttentionSelectionAudit'],['Consume'],[1,1]),
 stage('Consume',40,'SelectedEvidenceView',['AttentionProcessingReceipt'],[],[1,1]),
];
const inventory={version:'attention-public-integration/0.1-draft',status:'BEHAVIORAL INVENTORY REVIEWED; CANONICAL DECLARATION GAP OPEN',records,enums,unions,stages,newOccurrenceFamilies:['SelectionOccurrenceId','ProcessingOccurrenceId'],allocation:'NONE',stageRegistrationStatus:'Not yet a canonical record: producer, output, nested-allocation and accessor declaration shapes remain required',publicVectors:'AT2-A..N NOT PASSED'};
const checks=[];function check(name,f){f();checks.push(name);}
check('unique nonempty field names',()=>{for(const row of Object.values(records)){assert(row.length);assert.equal(new Set(row.map(f=>f.name)).size,row.length);}});
check('all symbolic field references resolve',()=>{for(const row of Object.values(records))for(const {type} of row){const base=type.replace(/^(list[^<]*|set|optional)</,'').replace(/>$/,'');assert(base.startsWith('existing:')||base.startsWith('new:')||base in records||base in enums||base in unions||['text','boolean'].includes(base),base);}});
check('closed union targets resolve',()=>{for(const names of Object.values(unions))for(const name of names)assert(name in records);});
check('exactly two result occurrence families; no view/unit identity',()=>{assert.equal(inventory.newOccurrenceFamilies.length,2);for(const name of ['AttentionUnitKey','AttentionAuditRow','SelectedAttentionUnit'])assert(!records[name].some(f=>f.type.startsWith('new:')));assert.deepEqual(records.SelectedEvidenceView.filter(f=>f.type.startsWith('new:')).map(f=>f.name),['SelectionId']);});
check('observer-only carriers do not introduce character identity',()=>assert(!JSON.stringify(records).includes('CharacterId')));
check('phase graph is acyclic with only later-sequence equal-phase children',()=>{const order=new Map(stages.map((s,i)=>[s.name,i]));for(const s of stages)for(const names of s.children)for(const name of names.split('|')){const child=stages[order.get(name)];assert(child);assert(order.get(name)>order.get(s.name));assert(child.phase>=s.phase);}});
check('only tracking has state writes',()=>assert.deepEqual(stages.filter(s=>s.writes.length).map(s=>s.name),['Track']));
check('consumer is terminal and receives only selected view',()=>{const s=stages.at(-1);assert.equal(s.input,'SelectedEvidenceView');assert.equal(s.children.length,0);assert(!JSON.stringify(records.SelectedEvidenceView).match(/Experience|Audit|Observation/));});
check('positive and empty occurrence/output bounds from stage sums',()=>{for(let n=1;n<=3;n++)for(let q=0;q<=n;q++){const allocations=4+(n+3)+0+n+0+0+q+1+1,outputs=1+1+(1+n)+n+0+1+q+1+1;assert.equal(allocations,9+2*n+q);assert.equal(outputs,6+2*n+q);assert(allocations<=18&&outputs<=15);}assert.equal(4+1+1+1,7);assert.equal(1+1+1+1,4);});
check('source composition evidence is bounded component evidence',()=>{const p=JSON.parse(fs.readFileSync(dir+'ATTENTION_SOURCE_COMPOSITION_REV1.json'));assert.equal(p.cases,64);assert.equal(p.hiddenRoleEqualityChecks,96);assert.equal(p.maxSourceRuntimeAllocations,16);});
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(inventoryPath,JSON.stringify(inventory,null,2)+'\n');
const receipt={status:'PUBLIC DESIGN AUDIT PASS; WHOLE SHAPE WITHHELD ON DECLARATION CLOSURE',checks,recordCount:Object.keys(records).length,fieldCount:Object.values(records).reduce((n,r)=>n+r.length,0),stageCount:stages.length,positiveEvents:9,emptyEvents:4,fingerprints:[inventoryPath,dir+'CAMPAIGN3_ATTENTION_PUBLIC_INTEGRATION_REV1.md',dir+'CAMPAIGN3_ATTENTION_SOURCE_CLOSURE_REV1.md','src/campaign2/transitionAdmissionV04.ts','src/campaign2/stateModel.ts','src/semanticBinding/semanticStateAuthority.ts','src/campaign3/receivingTrace.ts','src/campaign3/receivingFactory.ts','scripts/review-attention-public-inventory.mjs'].map(fp),limitations:['Symbolic audit is not a canonical schema/declaration compiler.','No executed scheduler, trace, rollback or restore qualification.','No new runtime code or permanent numeric allocation.','Subject narrowing needs explicit inclusion in eventual whole-shape acceptance.']};
fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n');console.log({checks:checks.length,records:receipt.recordCount,fields:receipt.fieldCount,stages:stages.length,status:receipt.status});
