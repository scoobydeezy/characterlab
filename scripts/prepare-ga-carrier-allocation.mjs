// Numeric proposal only. Does not freeze assignments or activate canonical codecs.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const output='docs/planning/GA_CARRIER_ALLOCATION_DRAFT.json',markdown='docs/planning/GA_CARRIER_ALLOCATION_DRAFT.md';assert(!fs.existsSync(output)&&!fs.existsSync(markdown));
const read=p=>JSON.parse(fs.readFileSync(p)),fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const manifestPath='docs/formal/GENERAL_ATTENTION_CARRIER_SHAPE_MANIFEST.json',manifest=read(manifestPath);for(const f of manifest.files)assert.deepEqual(fp(f.path),f);
const shape=read(manifest.allocationInput),priorPaths=fs.readdirSync('docs/formal').filter(p=>p.endsWith('ALLOCATION_TABLE.json')).map(p=>'docs/formal/'+p);
const occupiedRecords=new Set(),occupiedNamespaces=new Set();
function scan(v){if(!v||typeof v!=='object')return;for(const [k,n] of Object.entries(v)){if(/namespace/i.test(k)&&Number.isInteger(n))occupiedNamespaces.add(n);if(k==='typeId'&&Number.isInteger(n))occupiedRecords.add(n);if(k==='identifierAliases')for(const ns of Object.values(n))if(Number.isInteger(ns))occupiedNamespaces.add(ns);}Object.values(v).forEach(scan);}
priorPaths.forEach(p=>scan(read(p)));
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});let existing;
try{existing=(await server.ssrLoadModule('/src/campaign3/attentionCodecs.ts')).attentionSupportedSchemas();}finally{await server.close();}
assert.equal(Math.max(...existing.map(s=>Number(s.typeId))),541);assert.equal(Math.max(...occupiedRecords),541);
const existingNames=new Set(existing.map(s=>s.name));for(const r of shape.records)assert(!existingNames.has(r.name),'new name collides with inherited codec '+r.name);
const records=shape.records.map((r,i)=>({typeId:542+i,schemaVersion:1,name:r.name,fields:r.fields.map((f,j)=>({id:j+1,name:f.name,required:f.type.kind!=='optional',type:f.type.kind==='optional'?f.type.value:f.type}))}));
const namespaces=shape.newIdentityFamilies.map((f,i)=>({...f,namespace:i<2?1044+i:1143+i}));
for(const r of records)assert(!occupiedRecords.has(r.typeId));for(const n of namespaces)assert(!occupiedNamespaces.has(n.namespace));
const byName=new Map(records.map(r=>[r.name,r])),family=new Map(namespaces.map(n=>[n.name,n.namespace]));
const fieldEnums=[],recordUnions=[];
function walk(type,r,f,path=''){
 if(type.kind==='enum')fieldEnums.push({recordTypeId:r.typeId,fieldId:f.id,path,members:type.values.map((name,i)=>({name,value:i+1}))});
 else if(type.kind==='union')recordUnions.push({recordTypeId:r.typeId,fieldId:f.id,path,members:type.alternatives.map(a=>({name:a.name,typeId:byName.get(a.name).typeId,schemaVersion:1}))});
 else if(type.kind==='list'||type.kind==='set')walk(type.element,r,f,path+'[*]');
 else if(type.kind==='map'){walk(type.key,r,f,path+'{key}');walk(type.value,r,f,path+'{value}');}
}
for(const r of records)for(const f of r.fields)walk(f.type,r,f);
const rolePositions=shape.roles.map(p=>{const split=p.path.indexOf('.'),r=byName.get(p.path.slice(0,split)),tail=p.path.slice(split+1),name=tail.split(/[\[{<]/)[0],f=r.fields.find(f=>f.name===name);assert(f);return {...p,recordTypeId:r.typeId,fieldId:f.id,requiredNamespace:p.namespace??family.get(p.symbolicFamily)};});
assert(rolePositions.every(p=>Number.isInteger(p.requiredNamespace)));
const ownedOccurrences=['AcquisitionFormationEvidence','GoalOutcomeAssessment','RetainedAttributionResult','Recollection','BodySelectionAudit'].map(name=>{const r=byName.get(name),f=r.fields[0],role=rolePositions.find(p=>p.recordTypeId===r.typeId&&p.fieldId===f.id);assert(role);return {recordTypeId:r.typeId,fieldId:f.id,namespace:role.requiredNamespace,scope:'Actual producer only; references in other records allocate nothing'};});
const packet={version:'general-attention-carrier-allocation/0.1-draft',status:'NUMERIC PROPOSAL; NOT PERMANENT',records,namespaces,fieldEnums,recordUnions,rolePositions,ownedOccurrences,
 scope:['RecordTypeIds, field ordinals, field-local finite tags and six namespace families only.','Role positions preserve symbolic validator obligations; this does not allocate registry members or admit CanonicalIdentityRole declarations.','No model identity, runtime activation, trace binding, output-slot qualification or work ceiling is assigned.'],
 pendingMembers:['Exact registry kinds, validators, accessors, mutation authorities, seams, event and transition members remain a separate symbolic/member packaging gate.'],
 priorAllocations:priorPaths.map(fp),sources:[manifestPath,manifest.allocationInput,'scripts/prepare-ga-carrier-allocation.mjs'].map(fp)};
fs.writeFileSync(output,JSON.stringify(packet,null,2)+'\n');
fs.writeFileSync(markdown,'# General attention carrier allocation proposal\n\nSeparate numeric gate; not permanent. Records542..704, vocabulary namespaces1044/1045 and occurrence namespaces1145..1148. No existing assignment changes.\n\nRegistry member allocation and public/model gates remain OPEN. Symbolic validator obligations are preserved, not replaced with namespace-only roles.\n\n| Type/version | Record | Fields |\n| --- | --- | --- |\n'+records.map(r=>`|${r.typeId}/1|${r.name}|${r.fields.map(f=>`${f.id} ${f.name}${f.required?'':'?'}`).join('; ')}|`).join('\n')+'\n\n| Namespace | Family | Payload |\n| --- | --- | --- |\n'+namespaces.map(n=>`|${n.namespace}|${n.name}|${n.payload}|`).join('\n')+'\n\nField-local enum tags and distinct-record union members are listed exactly in the accompanying JSON. They are numeric realization of the accepted layout, not new psychological ordering.\n');
