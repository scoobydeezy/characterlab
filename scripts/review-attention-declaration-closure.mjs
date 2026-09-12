// Adversarial symbolic/schema and existing-content expressibility review.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const input='docs/planning/ATTENTION_SYMBOLIC_DECLARATIONS_REV1.json',output='docs/planning/ATTENTION_DECLARATION_CLOSURE_REVIEW_REV1.json';assert(!fs.existsSync(output));
const d=JSON.parse(fs.readFileSync(input)),checks=[],faults=[];
function validate(x){
 assert.equal(Object.keys(x.records).length,26);assert.equal(Object.values(x.records).reduce((n,r)=>n+r.length,0),89);
 const names=new Set(Object.keys(x.records));for(const [name,row] of Object.entries(x.records)){assert.equal(new Set(row.map(f=>f.name)).size,row.length,name);for(const f of row){let type=f.type;while(/^(optional|set|list[^<]*)</.test(type))type=type.slice(type.indexOf('<')+1,-1);assert(names.has(type)||type in x.enums||type.startsWith('existing:')||type.startsWith('new:')||['text','boolean','unsigned'].includes(type),type);}}
 assert.deepEqual(x.newOccurrenceFamilies,['SelectionOccurrenceId','ProcessingOccurrenceId']);
 assert.equal(x.stages.length,10);assert.equal(new Set(x.stages.map(s=>s.eventType)).size,10);
 const stageNames=['World','Observe','Track','Bind','Classify','Freeze','Role','PositiveSelect','EmptySelect','Consume'];
 assert.deepEqual(x.stages.map(s=>s.name),stageNames);
 const parents=[[],['World'],['Observe'],['Track'],['Bind'],['Classify'],['Freeze'],['Role'],['Observe'],['PositiveSelect','EmptySelect']];
 x.stages.forEach((s,i)=>{assert.deepEqual(s.parents,parents[i]);assert.equal(s.phase,[0,10,11,12,13,14,15,40,40,40][i]);assert.deepEqual(s.writes,i===2?['241/1','241/2','242/1','242/2']:[]);});
 assert.equal(x.stages.at(-1).input,'SelectedEvidenceView');assert.deepEqual(x.stages.at(-1).children,[]);
 assert.equal(x.stages[1].outputDefinitions.length,2);assert.equal(x.stages[4].outputDefinitions.length,0);
 assert.deepEqual(x.unions.map(u=>u.variants.map(v=>[v.required,v.forbidden])),[[[['ExperienceId'],['ObservationId']],[['ObservationId'],['ExperienceId']]],[[['Binding'],['Claim']],[['Claim'],['Binding']]]]);
 for(const role of x.roles){if(typeof role.record==='string'){const f=x.records[role.record].find(f=>f.name===role.field);assert(f);assert(f.type.includes(':'+role.family));}if(role.namespace!=='PENDING')assert.equal(role.namespace,x.identityFamilies[role.family]);assert.equal(role.validator,null);}
 assert.equal(new Set(x.roles.map(r=>r.record+'/'+r.field)).size,x.roles.length);
 assert.equal(x.collectionChecks.length,3);assert(!x.roles.some(r=>r.field==='PortReferents'||r.field==='PortRoles'||r.field==='Roles'));
 assert.equal(new Set(x.members.map(m=>m.namespace+'/'+m.payload)).size,52);for(const m of x.members){assert.equal(m.namespace,x.identityFamilies[m.family]);assert.equal(m.payload.normalize('NFC'),m.payload);assert(m.payload.length);}
 assert.equal(x.scenes.length,7);for(const s of x.scenes){assert.deepEqual(s.ports,['a','b','c']);assert.equal(s.roles.length,3);assert(s.roles.every(r=>['Actor','Target','Participant','Instrument','Beneficiary'].includes(r)));}
 assert.equal(x.models.length,32);assert.equal(new Set(x.models.slice(0,27).map(m=>m.modes.join('/'))).size,27);for(const m of x.models){assert(m.modes.every(v=>x.enums.mode.includes(v)));assert([0,1,2].includes(m.capacity));assert.equal(m.work,m.name==='work8'?8:9);}
 assert.equal(x.inherited.descriptors.length,297);assert.equal(x.inherited.executableEntriesInherited,0);assert.deepEqual(x.inherited.descriptors.filter(r=>r.type===373).map(r=>r.version),[2]);
 assert.equal(x.occurrenceRules.length,11);assert.equal(x.occurrenceRules.find(r=>r.record==='214').field,'DetectionOccurrenceId');assert.equal(x.occurrenceRules.find(r=>r.record==='215').field,'EventDetectionOccurrenceId');assert(!x.occurrenceRules.some(r=>['SelectedEvidenceView','217','219'].includes(r.record)));
 assert(!Object.values(x.records).flat().some(f=>f.type.includes('CharacterId')));
}
validate(d);checks.push('closed symbolic types, union layouts, scalar/collection roles, source graph and finite models');
for(const [name,mutate] of [
 ['duplicate event kind',x=>x.stages[2].eventType=x.stages[1].eventType],
 ['consumer truth input',x=>x.stages.at(-1).input='existing:210'],
 ['selector writes',x=>x.stages[7].writes=['241/1']],
 ['consumer bypasses selection',x=>x.stages.at(-1).parents=['Role']],
 ['mixed source union',x=>x.unions[0].variants[0].required.push('ObservationId')],
 ['observer role misnamespace',x=>x.roles.find(r=>r.family==='ObserverId').namespace=1002],
 ['validator smuggling',x=>x.roles[0].validator='validator/character-qualification'],
 ['fake wrapper occurrence',x=>x.occurrenceRules.push({record:'SelectedEvidenceView',field:'SelectionId'})],
 ['detection identity wrong field',x=>x.occurrenceRules.find(r=>r.record==='214').field='ObserverId'],
 ['unadmitted source role',x=>x.scenes[0].roles[0]='Cause'],
 ['work limit widened',x=>x.models[0].work=10],
 ['historical descriptor promoted',x=>x.inherited.descriptors.find(r=>r.type===373).version=1],
]){const x=structuredClone(d);mutate(x);assert.throws(()=>validate(x),name);faults.push(name);}
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});let contentProbe;
try{const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),content=await server.ssrLoadModule('/src/substrate/contentManifest.ts'),sem=await server.ssrLoadModule('/src/semanticBinding/semanticSchemaRegistry.ts');
 for(const row of d.occurrenceRules.filter(r=>/^\d+$/.test(r.record))){const schema=sem.SEMANTIC_RECORD_SCHEMAS.find(s=>s.typeId===BigInt(row.record)),f=schema.fields.find(f=>f.name===row.field);assert(f?.required);assert(d.roles.some(r=>r.record===Number(row.record)&&r.field===row.field));}checks.push('all existing occurrence fields resolve to required scalar fields with roles');
 const empty=c.list([]),kind=c.typedIdentifier(1004n,c.text('semantic-kind/attention-scene-object'));
 const inputs=['a','b','c'].map(p=>({stableId:c.typedIdentifier(1038n,c.text('content/attention-port-'+p)),semanticKind:kind,...Object.fromEntries(['declaredInputs','declaredOutputs','preconditions','worldEffects','unitsDomainsBounds','epistemicVisibility','observationAffordances','lifecycle','validationInvariants','sourceProvenance','changeHistory','formalSeamMappings'].map(k=>[k,empty])),referencedRegistryIds:[],referencedContentIds:[]}));
 const result=await content.compileGovernedContentManifest(inputs,[kind],[{semanticKindId:kind,validate:()=>{}}]);assert(result);checks.push('generic governed content accepts three finite non-character object definitions');
 const {compileValDeclarations}=await server.ssrLoadModule('/src/campaign2/valDeclarations.ts');const val=compileValDeclarations(c.canonicalEncode(c.set([])),c.canonicalEncode(c.set([])));
 const contentValue=c.set(inputs.map(v=>content.compileContentDefinition(content.createGovernedContentDefinition(v)).canonicalDefinition));
 await assert.rejects(()=>val.compileContent(c.canonicalEncode(contentValue),c.canonicalEncode(c.set([]))),/unsupported content semantic kind/);checks.push('existing VAL character-only content boundary remains closed');
 contentProbe='Generic content positive; existing character-only compiler rejection. Proposed member text is a research specimen, not an allocated/frozen model.';
}finally{await server.close();}
const fp=p=>({path:p,sha256:createHash('sha256').update(fs.readFileSync(p)).digest('hex')});
assert.equal(fp(d.inherited.source.path).sha256,d.inherited.source.sha256);assert.equal(fp(d.script.path).sha256,d.script.sha256);
const old=JSON.parse(fs.readFileSync('docs/planning/CAMPAIGN3_EMBODIED_QUALIFICATION.json'));const preservation=[...old.evidence,...old.verifiedFingerprints,old.script];for(const f of preservation)assert.equal(fp(f.path).sha256,f.sha256,f.path);
fs.writeFileSync(output,JSON.stringify({status:'DECLARATION SHAPE REVIEW PASS; NOT PUBLIC RUNTIME QUALIFICATION',checks,detectedSymbolicFaults:faults,counts:d.counts,contentProbe,preservedEMBFingerprints:preservation.length,fingerprints:[input,'docs/planning/CAMPAIGN3_ATTENTION_DECLARATION_CLOSURE_REV1.md','src/substrate/contentManifest.ts','src/campaign2/valDeclarations.ts','src/campaign2/stateModel.ts','src/campaign2/occurrenceIdentity.ts','scripts/review-attention-declaration-closure.mjs'].map(fp)},null,2)+'\n');console.log({checks:checks.length,faults:faults.length,preserved:preservation.length});
