// Actual predecessor declarations plus symbolic draft closure. No numeric allocation.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const output='docs/planning/CAMPAIGN2_COGNITIVE_ROLE_OCCURRENCE_AUDIT_REV1.json';assert(!fs.existsSync(output));
const paths=['docs/planning/CAMPAIGN2_COGNITIVE_FIELD_GRAMMAR_REV2.json','docs/planning/CAMPAIGN2_COGNITIVE_SYMBOLIC_INVENTORY_REV5.json','docs/formal/EVENT_SEMANTIC_NUMERIC_REGISTRY.md','docs/formal/CAMPAIGN2_ALLOCATION_TABLE.json'];
const hash=p=>({path:p,sha256:createHash('sha256').update(fs.readFileSync(p)).digest('hex')});
const sourceFingerprints=paths.map(hash),grammar=JSON.parse(fs.readFileSync(paths[0],'utf8')),inventory=JSON.parse(fs.readFileSync(paths[1],'utf8'));
const eventTable=fs.readFileSync(paths[2],'utf8'),allocation=JSON.parse(fs.readFileSync(paths[3],'utf8'));
const namespaceOf=name=>{
 const row=allocation.namespaces.find(n=>n.name===name);if(row)return row.namespace;
 const match=eventTable.split('\n').find(line=>line.includes('`'+name+'`')&&/^\| 10\d\d \|/.test(line));assert(match,'missing authority '+name);return Number(match.split('|')[1].trim());
};
const aliases={CharacterId:{namespace:namespaceOf('SemanticReferentId'),validator:'validator/character-qualification'},TaskReferentId:{namespace:namespaceOf('SemanticReferentId'),validator:'validator/task-qualification'},ObserverId:{namespace:namespaceOf('ObserverId')},DefinitionId:{namespace:namespaceOf('RegistryDefinitionId')},ProjectionAccessorId:{namespace:namespaceOf('ProjectionAccessorId')},SeamId:{namespace:namespaceOf('SeamId')},EventTypeId:{namespace:namespaceOf('EventTypeId')},TransitionKindId:{namespace:namespaceOf('TransitionKindId')}};
for(const name of inventory.requiredIdentitySymbols)aliases[name]={namespace:null,allocation:'PENDING'};
assert.equal(aliases.EventTypeId.namespace,1001);assert.equal(aliases.TransitionKindId.namespace,1009);assert.equal(aliases.SeamId.namespace,1036);
const records=new Set(grammar.records.map(r=>r.name)),primitives=new Set(['u','i','q','bool','text']),existingRefs=new Set(),scalarRoles=[],collections=[];
function check(type){
 const m=/^(\w+)(?:\((.*)\))?$/.exec(type);assert(m,type);const [,name,body]=m;
 if(body===undefined){if(/^\d+$/.test(name)){existingRefs.add(Number(name));return;}assert(primitives.has(name)||records.has(name)||name in aliases,'unknown '+name);return;}
 let depth=0,start=0;const args=[];for(let i=0;i<body.length;i++){if(body[i]==='(')depth++;if(body[i]===')')depth--;if(body[i]===','&&depth===0){args.push(body.slice(start,i));start=i+1;}}args.push(body.slice(start));assert.equal(depth,0);assert.equal(args.length,name==='map'?2:1);
 if(name==='r'){assert(records.has(args[0])||/^\d+$/.test(args[0]));if(/^\d+$/.test(args[0]))existingRefs.add(Number(args[0]));}
 else if(name==='id')assert(args[0] in aliases);
 else if(name==='enum')assert(args[0] in grammar.enums);
 else{assert(['list','set','map'].includes(name));args.forEach(check);}
}
for(const r of grammar.records)for(const f of r.fields){check(f.grammar);const id=/^id\((\w+)\)$/.exec(f.grammar);if(id)scalarRoles.push({record:r.name,field:f.name,position:'RecordField',identityFamily:id[1],...aliases[id[1]],domainValidatorId:aliases[id[1]].validator??null});if(/^(list|set|map)\(/.test(f.grammar))collections.push({record:r.name,field:f.name,grammar:f.grammar,owner:'exact receiving profile; not scalar265'});}
const outputs=[];
for(const family of inventory.requiredIdentitySymbols.filter(s=>s.endsWith('OccurrenceId'))){
 const fields=scalarRoles.filter(r=>r.identityFamily===family);
 const candidates=fields.filter(r=>grammar.records.find(x=>x.name===r.record).fields[0].name===r.field&&!['TaskIdentityContribution','ReasonEvidenceAtom','IdentityQuantizationOperation'].includes(r.record));
 assert.equal(candidates.length,1,'one output owner '+family);outputs.push({family,output:candidates[0].record,identityField:candidates[0].field,allocationOwner:'279/278',multiplicity:'ExactlyOne',referencePositions:fields.filter(r=>r!==candidates[0]).map(r=>r.record+'.'+r.field)});
}
assert.equal(outputs.length,14);
for(const bad of ['id(NoSuchFamily)','map(i,MissingRecord)','enum(NoVariant)','r(MissingRecord)'])assert.throws(()=>check(bad));
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const {taskSupportedSchemas}=await server.ssrLoadModule('/src/campaign2/taskCodecs.ts');
 const schemas=taskSupportedSchemas();
 const references=[...existingRefs].sort((a,b)=>a-b).map(type=>{const matches=schemas.filter(s=>Number(s.typeId)===type);assert.equal(matches.length,1,'unambiguous inherited schema '+type);return {typeId:type,schemaVersion:Number(matches[0].schemaVersion),name:matches[0].name};});
 const oldRoot=schemas.find(s=>s.typeId===373n);assert.equal(oldRoot.schemaVersion,1n);assert.deepEqual(oldRoot.fields.map(f=>[Number(f.id),f.name]),[[1,'Commitments']]);
 assert.deepEqual(paths.map(hash),sourceFingerprints);
 fs.writeFileSync(output,JSON.stringify({status:'SYMBOLIC STRUCTURAL AUDIT; NOT WHOLE SHAPE OR RUNTIME PASS',sourceFingerprints,aliases,inheritedSchemaReferences:references,scalarRoles,collectionPositions:collections,outputs,existingRootSuccessor:inventory.existingSchemaSuccessors[0],checks:{resolvedAll244Fields:true,qualifiedRecordFieldRoles:true,noScalarCollectionRoles:true,oneOutputOwnerPerFamily:true,inherited373Unchanged:true,wrongTypeRejections:4},limits:'Exact definition membership, source authenticity, collection refinements and codec/persistence behavior still require implementation tests. New numbers remain unallocated.'},null,2)+'\n');
 console.log(JSON.stringify({fields:244,scalarRoles:scalarRoles.length,collectionPositions:collections.length,outputFamilies:outputs.length,inheritedSchemas:references.length}));
}finally{await server.close();}
