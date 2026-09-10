// Separate numeric proposal after whole symbolic acceptance; not a freeze.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const output='docs/planning/EMBODIED_RECEIVING_ALLOCATION_DRAFT.json';assert(!fs.existsSync(output));
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const manifest=JSON.parse(fs.readFileSync('docs/formal/EMBODIED_RECEIVING_SHAPE_MANIFEST.json'));
for(const file of manifest.files)assert.deepEqual(fp(file.path),file);
const inventory=JSON.parse(fs.readFileSync('docs/planning/EMBODIED_RECEIVING_SYMBOLIC_INVENTORY_REV3.json')),vocabulary=JSON.parse(fs.readFileSync('docs/planning/EMBODIED_RECEIVING_VOCABULARY_REV2.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try {
 const {embodiedSupportedSchemas}=await server.ssrLoadModule('/src/campaign3/embodiedCodecs.ts');
 const schemas=embodiedSupportedSchemas();assert.equal(Math.max(...schemas.map(s=>Number(s.typeId))),484,'recheck next available record range');
 const records=inventory.records.map((r,i)=>({typeId:485+i,schemaVersion:1,name:r.name,fields:r.fields.map((f,j)=>({id:j+1,...f}))}));
 const byName=new Map(records.map(r=>[r.name,r])),field=(r,f)=>{const row=byName.get(r);assert(row);const found=row.fields.find(x=>x.name===f);assert(found);return found.id;};
 const roles=vocabulary.scalarRoles.map(r=>({recordTypeId:byName.get(r.record).typeId,fieldId:field(r.record,r.field),family:r.family,requiredNamespace:r.requiredNamespace,domainValidatorId:r.domainValidator}));
 const state=vocabulary.stateMapKeyRole,mapKeyRoles=[{recordTypeId:byName.get(state.record).typeId,fieldId:field(state.record,state.field),family:state.family,requiredNamespace:state.requiredNamespace,domainValidatorId:state.domainValidator,position:'StateMapKey'}];
 const collectionIdentityChecks=vocabulary.collectionIdentityChecks.map(r=>({recordTypeId:byName.get(r.record).typeId,fieldId:field(r.record,r.field),family:r.family,requiredNamespace:r.requiredNamespace,domainValidatorId:r.domainValidator,containerGrammar:r.containerGrammar}));
 const unionDefinitions=inventory.unions.flatMap(u=>u.variants.map((v,i)=>({recordTypeId:byName.get(u.record).typeId,tag:i+1,name:v.name,requiredPayloadFieldIds:v.required.map(f=>field(u.record,f)),forbiddenPayloadFieldIds:v.forbidden.map(f=>field(u.record,f))})));
 const finiteDomains=vocabulary.finiteDomains.filter(d=>!inventory.unions.some(u=>u.record===d.record)).map(d=>({recordTypeId:byName.get(d.record).typeId,fieldId:field(d.record,d.field),values:d.values.map((name,i)=>({name,value:d.inheritedNumbers?.[i]??i+1}))}));
 const occurrenceIdentities=inventory.occurrenceOutputs.map(o=>({recordTypeId:byName.get(o.output).typeId,schemaVersion:1,fieldId:1,family:o.family,requiredNamespace:inventory.existingIdentityFamilies[o.family]}));
 const members=vocabulary.members.map(m=>({family:m.family,namespace:m.existingNamespace,payload:m.payload}));
 const result={version:'embodied-receiving-allocation/0.1-draft',status:'NUMERIC PROPOSAL; NOT PERMANENT',authority:'docs/formal/EMBODIED_RECEIVING_SHAPE_ACCEPTANCE.md',sourceManifest:fp('docs/formal/EMBODIED_RECEIVING_SHAPE_MANIFEST.json'),records,members,roles,mapKeyRoles,collectionIdentityChecks,unionDefinitions,finiteDomains,occurrenceIdentities,existingRecordReferences:inventory.existingRecords,identifierAliases:inventory.existingIdentityFamilies,newNamespaces:[],counts:{records:records.length,fields:records.reduce((n,r)=>n+r.fields.length,0),members:members.length,unionVariants:unionDefinitions.length,finiteDomains:finiteDomains.length,roles:roles.length,mapKeyRoles:1,collectionIdentityChecks:collectionIdentityChecks.length,outputIdentities:occurrenceIdentities.length},preservation:manifest.files};
 fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
 const rows=records.map(r=>`|${r.typeId}/1|${r.name}|${r.fields.map(f=>`${f.id} ${f.name}`).join('; ')}|`).join('\n');
 fs.writeFileSync('docs/planning/EMBODIED_RECEIVING_ALLOCATION_DRAFT.md',`# EMB receiving numeric proposal\n\nSeparate allocation gate; not frozen. Whole symbolic shape is already accepted.\nPropose records485..515/1,110 fields,49 fixed text members and five union variants.\nNo new namespace. Existing families and all previous allocations remain unchanged.\n\n|Record|Name|Fields|\n|---|---|---|\n${rows}\n\nThe JSON companion owns exact member payloads, scalar/map/collection roles, union tags,\nfinite stage values and occurrence mappings. Independent one-to-one and availability\nreview is required before permanence. No implementation/model activation yet.\n`);
 console.log(JSON.stringify(result.counts));
} finally {await server.close();}
