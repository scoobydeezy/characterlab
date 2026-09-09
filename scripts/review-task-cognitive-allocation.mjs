// Independent numeric audit: displayed tables, frozen authority and actual registry codecs.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const draft='docs/planning/TASK_COGNITIVE_ALLOCATION_DRAFT.json',md='docs/planning/TASK_COGNITIVE_ALLOCATION_DRAFT.md',output='docs/planning/TASK_COGNITIVE_ALLOCATION_AUDIT.json';assert(!fs.existsSync(output));
const read=p=>fs.readFileSync(p,'utf8'),fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const x=JSON.parse(read(draft)),display=read(md),shape=JSON.parse(read('docs/formal/TASK_COGNITIVE_SHAPE_MANIFEST.json')),grammar=JSON.parse(read(shape.fieldGrammar.path));
for(const f of x.sourceFingerprints)assert.deepEqual(fp(f.path),f);
const humanRecords=[...display.matchAll(/^## (\d+)\/(\d+) (\w+)\r?\n\r?\n\| Field \| Name \| Required \| Type \|\r?\n\|---\|---\|---\|---\|\r?\n((?:\|.*\r?\n)+)/gm)].map(m=>({typeId:Number(m[1]),schemaVersion:Number(m[2]),name:m[3],fields:m[4].trim().split('\n').map(line=>{const [,id,name,required,type]=line.split('|').map(s=>s.trim());return {id:Number(id),name,required:required==='true',type};})}));assert.deepEqual(humanRecords,[...x.records,...x.schemaSuccessors]);
const humanNamespaces=display.split('## Namespace additions')[1].split('## Fixed members')[0].split('\n').filter(l=>/^\| \d+ \|/.test(l)).map(l=>{const [,namespace,name,payload]=l.split('|').map(s=>s.trim());return {name,namespace:Number(namespace),payload};});assert.deepEqual(humanNamespaces,x.namespaces);
const humanMembers=display.split('## Fixed members')[1].split('\n').filter(l=>/^\| \d+ \|/.test(l)).map(l=>{const [,namespace,payload]=l.split('|').map(s=>s.trim());return {namespace:Number(namespace),payload:JSON.parse(payload)};});assert.deepEqual(humanMembers,x.members);
assert.deepEqual(x.records.map(r=>r.typeId),Array.from({length:76},(_,i)=>377+i));assert.deepEqual(x.namespaces.map(n=>n.namespace),[1040,1041,1042,1043,...Array.from({length:14},(_,i)=>1128+i)]);
assert.equal(x.records.reduce((n,r)=>n+r.fields.length,0),244);assert.equal(x.roles.length,52);assert.equal(x.members.length,103);assert.equal(x.unionVariants.length,17);
for(const r of x.records){const g=grammar.records.find(g=>g.name===r.name);assert(g);assert.deepEqual(r.fields,g.fields.map((f,i)=>({id:i+1,name:f.name,required:!f.optional,type:f.grammar})));}
const old=x.sourceFingerprints.filter(f=>f.path.endsWith('ALLOCATION_TABLE.json')).map(f=>JSON.parse(read(f.path)));
for(const r of x.records)assert(!old.some(t=>(t.records??[]).some(old=>old.typeId===r.typeId)));
for(const n of x.namespaces)assert(!old.some(t=>(t.namespaces??[]).some(old=>old.namespace===n.namespace)));
for(const m of x.members)assert(!old.some(t=>(t.members??[]).some(old=>old.namespace===m.namespace&&JSON.stringify(old.payload)===JSON.stringify(m.payload))));
assert.deepEqual(x.schemaSuccessors,[{typeId:373,schemaVersion:2,name:'TaskCommitmentState',fields:[{id:1,name:'Commitments',required:true,type:'map(371,372)'},{id:2,name:'AdoptedInstructions',required:true,type:'map(371,AdoptedTaskInstruction)'}]}]);
const unionDefinitions=x.unionVariants.map(u=>({recordTypeId:u.recordTypeId,tag:u.tag,requiredPayloadFieldIds:u.requiredFields.filter(f=>f!==1),forbiddenPayloadFieldIds:u.forbiddenFields}));
for(const u of unionDefinitions){assert(!u.requiredPayloadFieldIds.includes(1));assert(x.members.some(m=>m.namespace===1024&&JSON.stringify(m.payload)===JSON.stringify([u.recordTypeId,u.tag])));}
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const {taskSupportedSchemas}=await server.ssrLoadModule('/src/campaign2/taskCodecs.ts');
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const oldSchemas=taskSupportedSchemas();assert(Math.max(...oldSchemas.map(s=>Number(s.typeId)))<377);
 const registry=new c.RecordSchemaRegistry();for(const s of oldSchemas)registry.register(s);
 for(const r of [...x.records,...x.schemaSuccessors])registry.register({typeId:BigInt(r.typeId),schemaVersion:BigInt(r.schemaVersion),name:r.name,fields:r.fields.map(f=>({id:BigInt(f.id),name:f.name,required:f.required}))});
 const memberBytes=x.members.map(m=>{const v=c.typedIdentifier(m.namespace,Array.isArray(m.payload)?c.list(m.payload.map(c.unsigned)):c.text(m.payload));const bytes=c.canonicalEncode(v);assert.deepEqual(c.canonicalEncode(c.canonicalDecode(bytes,registry)),bytes);return Buffer.from(bytes).toString('hex');});assert.equal(new Set(memberBytes).size,103);
 // Existing generic259 has payload-only fields. Do not serialize the tag field as payload.
 const s259=oldSchemas.find(s=>s.typeId===259n);assert.deepEqual(s259.fields.map(f=>f.name),['RecordTypeId','VariantTag','RequiredPayloadFieldIds','ForbiddenPayloadFieldIds']);
 for(const u of unionDefinitions){const value=c.record(s259,new Map([[1n,c.unsigned(u.recordTypeId)],[2n,c.unsigned(u.tag)],[3n,c.set(u.requiredPayloadFieldIds.map(c.unsigned))],[4n,c.set(u.forbiddenPayloadFieldIds.map(c.unsigned))]]));const bytes=c.canonicalEncode(value);assert.deepEqual(c.canonicalEncode(c.canonicalDecode(bytes,registry)),bytes);}
 const old373=oldSchemas.find(s=>s.typeId===373n);assert.equal(old373.schemaVersion,1n);assert.equal(old373.fields.length,1);assert.equal(old373.fields[0].id,1n);
 for(const f of x.sourceFingerprints)assert.deepEqual(fp(f.path),f);
 fs.writeFileSync(output,JSON.stringify({status:'MECHANICAL ALLOCATION REVIEW PASS; NOT PERMANENT',reviewedArtifacts:[draft,md].map(fp),sourceFingerprints:x.sourceFingerprints,counts:{newRecords:76,newFields:244,existingRootSuccessors:1,appendedExistingFields:1,newDiscriminatorNamespaces:4,newOccurrenceNamespaces:14,fixedMembers:103,scalarRoles:52,unionBranches:17},unionDefinitions,checks:['displayed record/namespace/member tables independently parsed','one-to-one symbolic field grammar coverage','prior record/namespace/member collision exclusion','actual old registry max376 and373/schema1 unchanged','both373 schema versions coexist in generic registry','103 exact canonical member payload round trips, no fixture promotion','17 existing259 payload-only rows exclude discriminator field1','all prior frozen fingerprints preserved'],limits:'Declaration codec and numeric consistency only. No new semantic handler, model activation, runtime control or persistence qualification.'},null,2)+'\n');
 console.log(JSON.stringify({status:'MECHANICAL ALLOCATION REVIEW PASS',records:76,namespaces:18,members:103,unionRows:17}));
}finally{await server.close();}
