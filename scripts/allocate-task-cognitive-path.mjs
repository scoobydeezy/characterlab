// Mechanical proposal after internal whole-shape acceptance. Not permanent until separate review.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const draft='docs/planning/TASK_COGNITIVE_ALLOCATION_DRAFT.json',markdown='docs/planning/TASK_COGNITIVE_ALLOCATION_DRAFT.md';
for(const p of [draft,markdown])assert(!fs.existsSync(p));
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const shape=JSON.parse(fs.readFileSync('docs/formal/TASK_COGNITIVE_SHAPE_MANIFEST.json','utf8'));
for(const f of [shape.authority,shape.review,...shape.components,shape.inventory,shape.fieldGrammar,shape.structuralAudit])assert.deepEqual(fp(f.path),f);
const grammar=JSON.parse(fs.readFileSync(shape.fieldGrammar.path,'utf8')),audit=JSON.parse(fs.readFileSync(shape.structuralAudit.path,'utf8'));
const prior=fs.readdirSync('docs/formal').filter(n=>n.endsWith('ALLOCATION_TABLE.json')).map(n=>'docs/formal/'+n);
const sourceFingerprints=[...prior,'docs/formal/TASK_COGNITIVE_SHAPE_MANIFEST.json','docs/formal/CANONICAL_RECORD_REGISTRY.md','docs/formal/EVENT_SEMANTIC_NUMERIC_REGISTRY.md'].map(fp);
const recordIds=new Map(grammar.records.map((r,i)=>[r.name,377+i]));
const namespaces=[...['MotiveChannelId','IdentityChannelId','RandomPurposeId','RandomSubjectRoleId'].map((name,i)=>({name,namespace:1040+i,payload:'nonempty canonical UTF-8 NFC text'})),...audit.outputs.map((o,i)=>({name:o.family,namespace:1128+i,payload:'unsigned-runtime-ordinal'}))];
const ns=new Map(namespaces.map(n=>[n.name,n.namespace]));
const records=grammar.records.map(r=>({typeId:recordIds.get(r.name),schemaVersion:1,name:r.name,fields:r.fields.map((f,i)=>({id:i+1,name:f.name,required:!f.optional,type:f.grammar}))}));
const successor={typeId:373,schemaVersion:2,name:'TaskCommitmentState',fields:[{id:1,name:'Commitments',required:true,type:'map(371,372)'},{id:2,name:'AdoptedInstructions',required:true,type:'map(371,AdoptedTaskInstruction)'}]};
const roles=audit.scalarRoles.map(r=>({recordTypeId:recordIds.get(r.record),fieldId:records.find(x=>x.name===r.record).fields.find(f=>f.name===r.field).id,position:'RecordField',requiredNamespace:r.namespace??ns.get(r.identityFamily),domainValidatorId:r.domainValidatorId}));assert(roles.every(r=>Number.isInteger(r.requiredNamespace)));
const finiteValues=Object.entries(grammar.enums).map(([name,values])=>({name,values:values.map((name,i)=>({name,value:i+1}))}));
const unionVariants=Object.entries(grammar.unionRules).flatMap(([name,variants])=>{const r=records.find(r=>r.name===name);return Object.entries(variants).map(([variant,required],i)=>({recordTypeId:r.typeId,schemaVersion:1,tag:i+1,name:variant,requiredFields:[1,...required.map(n=>r.fields.find(f=>f.name===n).id)],forbiddenFields:r.fields.filter(f=>!f.required&&!required.includes(f.name)).map(f=>f.id)}));});
const members=[];const add=(namespace,payload)=>members.push({namespace,payload});
for(const [family,payloads] of [['MotiveChannelId',['Commitment']],['IdentityChannelId',['CommitmentFidelity']],['RandomPurposeId',['purpose/task-reason-face','purpose/task-decision-tie']],['RandomSubjectRoleId',['subject/actor','subject/action','subject/task']]])for(const p of payloads)add(ns.get(family),p);
const fixed=fs.readFileSync('docs/planning/CAMPAIGN2_COGNITIVE_FIXED_MEMBER_CLOSURE_DRAFT.md','utf8');
for(const line of fixed.split('\n')){
 const stage=/^\|(\w+Transition)\|(event\/[a-z-]+)\|(\d+)\|/.exec(line);if(stage){add(1009,stage[1]);add(1001,stage[2]);}
 const def=/^\|(definition\/[a-z-]+)\|(registry\/[a-z-]+)\|/.exec(line);if(def){add(1027,def[1]);if(!members.some(m=>m.namespace===1023&&m.payload===def[2]))add(1023,def[2]);}
}
for(const p of ['observation','tracking','bindings','classification','experience'])add(1001,'event/protocol-'+p);
for(const p of ['workspace-task-status','task-plan-binding','task-identity-history'])add(1028,'accessor/'+p);
add(1025,'authority/task-identity-evidence');add(1032,'leaf/identity-evidence');
const formal=fs.readFileSync('docs/formal/TASK_COGNITIVE_PATH.md','utf8');
const executingVersions=[...formal.matchAll(/^\|[^|]+\|([a-z-]+\/0\.1-candidate)\|$/gm)].map(m=>m[1]);assert.equal(executingVersions.length,13);
for(const version of executingVersions)add(1036,'seam/'+version.split('/')[0]);
// Existing namespace1024 uses the accepted canonical unsigned pair, never text.
for(const u of unionVariants)add(1024,[u.recordTypeId,u.tag]);
const occurrenceIdentities=audit.outputs.map(o=>({recordTypeId:recordIds.get(o.output),schemaVersion:1,identityFieldId:1,requiredNamespace:ns.get(o.family),domainValidatorId:null}));
const proposal={version:'task-cognitive-allocation/0.1-draft',status:'NUMERIC PROPOSAL; NOT PERMANENT',authority:'docs/formal/TASK_COGNITIVE_PATH.md',semanticVersion:'task-cognitive-path/0.1-candidate',sourceFingerprints,records,schemaSuccessors:[successor],namespaces,members,roles,finiteValues,unionVariants,occurrenceIdentities,existingRecordReferences:audit.inheritedSchemaReferences,identifierAliases:Object.fromEntries(Object.entries(audit.aliases).map(([name,a])=>[name,a.namespace??ns.get(name)])),executingVersions,notes:['DefinitionId is the RegistryDefinitionId1027 shorthand, not a new family.','Type373/schema1 and all prior fields remain unchanged.','Type373/schema2 field2 is the only appended existing-root field.','Union definition StableId1024 payload is canonical list<unsigned>[RecordTypeId,VariantTag].','No comparison key/role family, standalone coverage operand or second occurrence allocator.','Numeric adjacency carries no meaning. Model materialization and runtime gates remain open.']};
assert.equal(records.length,76);assert.equal(records.at(-1).typeId,452);assert.equal(members.length,new Set(members.map(m=>JSON.stringify(m))).size);
fs.writeFileSync(draft,JSON.stringify(proposal,null,2)+'\n');
const lines=['# Task cognitive allocation proposal','','Status: NUMERIC PROPOSAL, NOT PERMANENT. Shape is already internally accepted.',''];
for(const r of [...records,successor]){lines.push(`## ${r.typeId}/${r.schemaVersion} ${r.name}`,'','| Field | Name | Required | Type |','|---|---|---|---|',...r.fields.map(f=>`| ${f.id} | ${f.name} | ${f.required} | ${f.type} |`),'');}
lines.push('## Namespace additions','','| Namespace | Family | Payload |','|---|---|---|',...namespaces.map(n=>`| ${n.namespace} | ${n.name} | ${n.payload} |`),'','## Fixed members','','| Namespace | Exact payload JSON |','|---|---|',...members.map(m=>`| ${m.namespace} | ${JSON.stringify(m.payload)} |`),'');
fs.writeFileSync(markdown,lines.join('\n')+'\n');console.log(JSON.stringify({records:records.length,fields:244,successors:1,namespaces:namespaces.length,members:members.length,roles:roles.length,unions:unionVariants.length,permanent:false}));
