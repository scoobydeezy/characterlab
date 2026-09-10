// Separate numeric review. Does not import the proposal generator or execute EMB.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const base='docs/planning/EMBODIED_RESERVE_ALLOCATION_DRAFT';
const output='docs/planning/EMBODIED_RESERVE_ALLOCATION_REVIEW_REV1.json';
assert(!fs.existsSync(output),'preserve previous review');
const read=p=>fs.readFileSync(p,'utf8');
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const x=JSON.parse(read(base+'.json')),md=read(base+'.md');
for(const f of [x.shape,...x.sourceFingerprints])assert.deepEqual(fp(f.path),f);
const shape=JSON.parse(read(x.shape.path));for(const f of [shape.verdict,shape.manifest])assert.deepEqual(fp(f.path),f);
const manifest=JSON.parse(read(shape.manifest.path));for(const f of manifest.packet)assert.deepEqual(fp(f.path),f);
const grammar=JSON.parse(read('docs/planning/CAMPAIGN3_EMBODIED_TYPED_INVENTORY_REV2.json'));
assert.deepEqual(x.records.map(r=>({name:r.name,fields:r.fields.map(({id,...f})=>f)})),grammar.records.map(({name,fields})=>({name,fields})));
assert.deepEqual(x.records.map(r=>r.typeId),Array.from({length:32},(_,i)=>453+i));
for(const r of x.records){assert.equal(r.schemaVersion,1);assert.deepEqual(r.fields.map(f=>f.id),r.fields.map((_,i)=>i+1));}
const section=(start,end)=>md.split('## '+start)[1].split('## '+end)[0];
const rows=s=>s.split(/\r?\n/).filter(l=>/^\| \d/.test(l)).map(l=>l.split('|').slice(1,-1).map(c=>c.trim()));
const displayedRecords=rows(section('Record and field assignments','Namespace and exact members')).map(([id,name,fields])=>({typeId:Number(id),name,fields:fields.split('; ').map(s=>{const m=/^(\d+):(\w+)(\?)?$/.exec(s);assert(m);return {id:Number(m[1]),name:m[2],required:!m[3]};})}));
assert.deepEqual(displayedRecords,x.records.map(({typeId,name,fields})=>({typeId,name,fields:fields.map(({id,name,required})=>({id,name,required}))})));
const memberRows=rows(section('Namespace and exact members','Unions and finite fields')).map(([ns,payload])=>({namespace:Number(ns),payload:JSON.parse(payload)}));
assert.deepEqual(memberRows,x.members.map(({namespace,payload})=>({namespace,payload})));
assert(md.includes('Propose1142 PressureOccurrenceId over the existing shared runtime ordinal allocator.'));
assert.deepEqual(x.namespaces,[{namespace:1142,name:'PressureOccurrenceId',scope:'run-scoped occurrence',payload:'unsigned-runtime-ordinal',allocator:'existing shared run runtime allocator; no new allocator'}]);
const unionSection=section('Unions and finite fields','Role and implementation boundaries');
const unionRows=rows(unionSection).filter(r=>r.length===5).map(([record,tag,name,required,forbidden])=>({recordTypeId:Number(record),tag:Number(tag),name,requiredFields:required.split(',').map(Number),forbiddenFields:forbidden==='none'?[]:forbidden.split(',').map(Number)}));
assert.deepEqual(unionRows,x.unionVariants.map(({recordTypeId,tag,name,requiredFields,forbiddenFields})=>({recordTypeId,tag,name,requiredFields,forbiddenFields})));
assert.deepEqual(rows(unionSection).filter(r=>r.length===3).map(([position,value,name])=>({recordTypeId:Number(position.split('/')[0]),fieldId:Number(position.split('/')[1]),value:Number(value),name})),x.finiteValues);
assert.deepEqual(x.finiteValues.map(v=>[v.recordTypeId,v.fieldId,v.value]),[[475,11,1],[476,8,1]]);
const byName=new Map(x.records.map(r=>[r.name,r]));
for(const u of grammar.unionMatrices)for(const [i,v] of u.variants.entries()){
 const record=byName.get(u.record),f=n=>record.fields.find(f=>f.name===n).id;
 const actual=x.unionVariants.find(a=>a.recordTypeId===record.typeId&&a.name===v.tag);assert(actual);
 assert.equal(actual.tag,i+1);assert.deepEqual(actual.requiredFields,v.required.map(f));assert.deepEqual(actual.forbiddenFields,v.forbidden.map(f));
 if(v.sampleSchema)assert.deepEqual(actual.sampleSchema,{typeId:byName.get(v.sampleSchema).typeId,schemaVersion:1});
}
assert.deepEqual(x.unionDefinitions,x.unionVariants.map(v=>({recordTypeId:v.recordTypeId,tag:v.tag,requiredPayloadFieldIds:v.requiredFields.filter(n=>n!==1),forbiddenPayloadFieldIds:v.forbiddenFields})));
const positions=[...x.roles,...x.mapKeyRoles,...x.collectionIdentityChecks];assert.equal(positions.length,43);
for(const r of x.records)for(const f of r.fields)for(const m of f.type.matchAll(/id:(\w+)/g)){
 const p=positions.filter(p=>p.recordTypeId===r.typeId&&p.fieldId===f.id);assert.equal(p.length,1);assert.equal(p[0].family,m[1]);
 assert.equal(p[0].requiredNamespace,m[1]==='PressureOccurrenceId'?1142:Number.parseInt(grammar.identityRoles[m[1]],10));
 assert.deepEqual(p[0].domainValidatorId,m[1]==='CharacterId'?{namespace:1021,payload:'validator/character-qualification'}:null);
 assert.equal(p[0].position,f.type.startsWith('map<')?'StateMapKey':f.type.startsWith('set<')?'SetMember':'RecordField');
}
assert.deepEqual(x.occurrenceIdentities.map(o=>[o.recordTypeId,o.schemaVersion,o.identityFieldId,o.requiredNamespace]),[[461,1,1,1115],[463,1,1,1115],[464,1,1,1142]]);
assert.deepEqual(x.typeAliases,{EmbodiedSample:[{typeId:461,schemaVersion:1},{typeId:463,schemaVersion:1}]});
assert.deepEqual(x.existingRecordReferences,grammar.externalSchemaReferences);
const tables=x.sourceFingerprints.filter(f=>f.path.endsWith('_TABLE.json')).map(f=>JSON.parse(read(f.path)));
const key=m=>JSON.stringify([m.namespace??m.namespaceId,m.payload]);
for(const r of x.records)assert(!tables.some(t=>[...t.records??[],...t.schemaSuccessors??[]].some(v=>v.typeId===r.typeId)));
assert(!tables.some(t=>[...t.namespaces??[],...t.occurrenceNamespaces??[]].some(n=>(n.namespace??n.namespaceId)===1142)));
for(const m of x.members)assert(!tables.some(t=>(t.members??[]).some(v=>key(v)===key(m))));
assert.equal(new Set(x.members.map(key)).size,43);
const vocab=JSON.parse(read('docs/planning/CAMPAIGN3_EMBODIED_VOCABULARY_REV1.json'));
const expectedMembers=vocab.members.map(m=>({namespace:m.existingNamespace,payload:m.payload}));
const witness=read('docs/planning/CAMPAIGN3_EMBODIED_PROFILE_WITNESS_DRAFT.md');
for(const match of witness.matchAll(/^\| (definition\/[a-z0-9-]+) \|/gm))expectedMembers.push({namespace:1027,payload:match[1]});
expectedMembers.push({namespace:1000,payload:'observer/embodied-subject'},{namespace:1005,payload:'channel/embodied-fuel-level'},{namespace:1038,payload:'character/embodied-subject'});
for(const v of x.unionVariants)expectedMembers.push({namespace:1024,payload:[v.recordTypeId,v.tag]});
assert.deepEqual(x.members.map(({namespace,payload})=>({namespace,payload})),expectedMembers);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
let schemaPairs,roundTrips=0;
try{
 const {cognitiveSupportedSchemas}=await server.ssrLoadModule('/src/campaign2/cognitiveCodecs.ts');
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const old=cognitiveSupportedSchemas();schemaPairs=old.length;assert.equal(Math.max(...old.map(s=>Number(s.typeId))),452);
 const registry=new c.RecordSchemaRegistry();for(const s of old)registry.register(s);
 for(const r of x.records)registry.register({typeId:BigInt(r.typeId),schemaVersion:1n,name:r.name,fields:r.fields.map(f=>({id:BigInt(f.id),name:f.name,required:f.required}))});
 const round=v=>{const bytes=c.canonicalEncode(v);assert.deepEqual(c.canonicalEncode(c.canonicalDecode(bytes,registry)),bytes);roundTrips++;return Buffer.from(bytes).toString('hex');};
 assert.equal(new Set(x.members.map(m=>round(c.typedIdentifier(m.namespace,Array.isArray(m.payload)?c.list(m.payload.map(c.unsigned)):c.text(m.payload))))).size,43);
 const s=id=>old.find(s=>Number(s.typeId)===id);
 const rec=(id,values)=>c.record(s(id),new Map(values.map((v,i)=>[BigInt(i+1),v])));
 assert.deepEqual(s(259).fields.map(f=>f.name),['RecordTypeId','VariantTag','RequiredPayloadFieldIds','ForbiddenPayloadFieldIds']);
 for(const u of x.unionDefinitions){assert(!u.requiredPayloadFieldIds.includes(1));round(rec(259,[c.unsigned(u.recordTypeId),c.unsigned(u.tag),c.set(u.requiredPayloadFieldIds.map(c.unsigned)),c.set(u.forbiddenPayloadFieldIds.map(c.unsigned))]));}
 for(const r of x.records)round(rec(172,[c.unsigned(r.typeId),c.unsigned(1),c.text(r.name),c.list(r.fields.map(f=>rec(173,[c.unsigned(f.id),c.text(f.name),f.required])))]));
}finally{await server.close();}
assert.equal(roundTrips,79);
const frozen=JSON.parse(read('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json'));for(const f of frozen.checks)assert.deepEqual(fp(f.path),{path:f.path,sha256:f.sha256});
for(const f of x.sourceFingerprints)assert.deepEqual(fp(f.path),f);
fs.writeFileSync(output,JSON.stringify({status:'MECHANICAL NUMERIC REVIEW PASS; NOT YET PERMANENT',reviewedArtifacts:[base+'.json',base+'.md'].map(fp),shape:x.shape,counts:{records:32,fields:128,namespaces:1,members:43,unionVariants:4,finiteValues:2,recordRoles:40,mapKeyRoles:1,collectionChecks:2,occurrenceDefinitions:3},canonicalDeclarationRoundTrips:roundTrips,existingRuntimeSchemaPairs:schemaPairs,preservedChecks:frozen.checks.length,checks:['Independent Markdown record/field/member/union/finite table parsing matches JSON.','Exact accepted field grammar, required/forbidden matrices and identity roles match.','One-to-one vocabulary plus witness and union member coverage; no orphan additions.','Prior formal tables and current runtime schemas exclude proposed allocations.','Actual canonical member,259 union and172/173 descriptor round trips pass.','Alias uses exact two schemas; occurrence definitions reuse1115 and add1142 only.','All frozen fingerprints remain unchanged.'],limitations:['Declaration round trips do not execute new EMB record-domain codecs.','No behavior, model activation or runtime vector qualified.'],script:fp('scripts/review-embodied-reserve-allocation.mjs')},null,2)+'\n');
console.log(JSON.stringify({status:'NUMERIC REVIEW PASS',roundTrips,records:32,fields:128,members:43,preserved:446}));
