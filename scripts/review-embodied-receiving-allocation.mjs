// Independent numeric gate. Keeps the reviewed proposal and prior allocations intact.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const output='docs/formal/EMBODIED_RECEIVING_ALLOCATION_TABLE.json',review='docs/planning/EMBODIED_RECEIVING_ALLOCATION_REVIEW_REV1.json';assert(!fs.existsSync(output));assert(!fs.existsSync(review));
const read=p=>JSON.parse(fs.readFileSync(p)),fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const draftPath='docs/planning/EMBODIED_RECEIVING_ALLOCATION_DRAFT.json',draft=read(draftPath),inventory=read('docs/planning/EMBODIED_RECEIVING_SYMBOLIC_INVENTORY_REV3.json'),vocab=read('docs/planning/EMBODIED_RECEIVING_VOCABULARY_REV2.json');
const priorPaths=fs.readdirSync('docs/formal').filter(p=>p.endsWith('ALLOCATION_TABLE.json')).map(p=>'docs/formal/'+p),before=priorPaths.map(fp);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try {
 const {embodiedSupportedSchemas}=await server.ssrLoadModule('/src/campaign3/embodiedCodecs.ts'),prior=new Set(embodiedSupportedSchemas().map(s=>Number(s.typeId)));
 let checks=0;const check=(test,message)=>{checks++;assert(test,message);};
 function audit(a){
  check(a.records.length===inventory.records.length,'record coverage');
  const names=new Map(a.records.map(r=>[r.name,r]));check(names.size===31,'unique names');
  a.records.forEach((r,i)=>{const symbolic=inventory.records[i];check(r.name===symbolic.name&&r.typeId===485+i&&r.schemaVersion===1&&!prior.has(r.typeId),'available one-to-one record');check(r.fields.length===symbolic.fields.length,'field coverage');r.fields.forEach((f,j)=>{check(f.id===j+1&&f.name===symbolic.fields[j].name&&f.type===symbolic.fields[j].type&&f.required===symbolic.fields[j].required,'exact field realization');});});
  assert.deepEqual(a.members,vocab.members.map(m=>({family:m.family,namespace:m.existingNamespace,payload:m.payload})));checks++;
  for(const p of priorPaths)for(const m of read(p).members??[])check(!a.members.some(n=>n.namespace===Number(m.namespace??m.namespaceId??m.requiredNamespace)&&n.payload===m.payload),'no prior member reuse');
  check(a.newNamespaces.length===0,'no new namespace');assert.deepEqual(a.existingRecordReferences,inventory.existingRecords);assert.deepEqual(a.identifierAliases,inventory.existingIdentityFamilies);checks+=2;
  const row=(name)=>names.get(name),field=(record,name)=>row(record).fields.find(f=>f.name===name).id;
  assert.deepEqual(a.roles,vocab.scalarRoles.map(r=>({recordTypeId:row(r.record).typeId,fieldId:field(r.record,r.field),family:r.family,requiredNamespace:r.requiredNamespace,domainValidatorId:r.domainValidator})));checks++;
  const s=vocab.stateMapKeyRole;assert.deepEqual(a.mapKeyRoles,[{recordTypeId:row(s.record).typeId,fieldId:field(s.record,s.field),family:s.family,requiredNamespace:s.requiredNamespace,domainValidatorId:s.domainValidator,position:'StateMapKey'}]);checks++;
  assert.deepEqual(a.collectionIdentityChecks,vocab.collectionIdentityChecks.map(r=>({recordTypeId:row(r.record).typeId,fieldId:field(r.record,r.field),family:r.family,requiredNamespace:r.requiredNamespace,domainValidatorId:r.domainValidator,containerGrammar:r.containerGrammar})));checks++;
  const unionExpected=[];for(const u of inventory.unions)u.variants.forEach((v,i)=>unionExpected.push({recordTypeId:row(u.record).typeId,tag:i+1,name:v.name,requiredPayloadFieldIds:v.required.map(n=>field(u.record,n)),forbiddenPayloadFieldIds:v.forbidden.map(n=>field(u.record,n))}));assert.deepEqual(a.unionDefinitions,unionExpected);checks++;
  const finiteExpected=vocab.finiteDomains.filter(d=>!inventory.unions.some(u=>u.record===d.record)).map(d=>({recordTypeId:row(d.record).typeId,fieldId:field(d.record,d.field),values:d.values.map((name,i)=>({name,value:d.inheritedNumbers?.[i]??i+1}))}));assert.deepEqual(a.finiteDomains,finiteExpected);checks++;
  assert.deepEqual(a.occurrenceIdentities,inventory.occurrenceOutputs.map(o=>({recordTypeId:row(o.output).typeId,schemaVersion:1,fieldId:1,family:o.family,requiredNamespace:inventory.existingIdentityFamilies[o.family]})));checks++;
  check(a.records.reduce((n,r)=>n+r.fields.length,0)===110&&a.members.length===49&&a.unionDefinitions.length===5&&a.occurrenceIdentities.length===10,'surface totals');
  assert.deepEqual(fp(a.sourceManifest.path),a.sourceManifest);for(const p of a.preservation)assert.deepEqual(fp(p.path),p);checks+=a.preservation.length+1;
 }
 audit(draft);const passedChecks=checks;
 for(const mutate of [a=>a.records[0].typeId=484,a=>a.records[0].fields[0].id=2,a=>a.members.pop(),a=>a.unionDefinitions.pop(),a=>a.occurrenceIdentities[0].requiredNamespace=1142,a=>a.mapKeyRoles[0].domainValidatorId=null]){const altered=structuredClone(draft);mutate(altered);assert.throws(()=>audit(altered));}
 assert.deepEqual(priorPaths.map(fp),before);
 const permanent={...draft,version:'embodied-receiving-allocation/0.1-candidate',status:'PERMANENT AND FROZEN',acceptedProposal:fp(draftPath),numericReview:review,permanence:['No renumbering, reuse or insertion-by-shifting.','New families/members append through their separate gates.','Record adjacency has no semantic meaning.']};
 fs.writeFileSync(output,JSON.stringify(permanent,null,2)+'\n');
 fs.writeFileSync(review,JSON.stringify({status:'NUMERIC ALLOCATION ACCEPTED AND FROZEN BY PRIMARY-AGENT REVIEW',checks:passedChecks,negativeControls:6,recordRange:[485,515],fields:110,fixedMembers:49,newNamespaces:0,unionVariants:5,proposal:fp(draftPath),acceptedTable:fp(output),priorAllocations:before,limits:['Numeric consistency, not runtime qualification.','Thirteen exact models must be materialized/reviewed/frozen before activation.','EMB-M..O and ER-A..R remain NOT PASSED.']},null,2)+'\n');
 console.log(JSON.stringify({checks:passedChecks,negativeControls:6,range:[485,515],members:49,newNamespaces:0}));
} finally {await server.close();}
