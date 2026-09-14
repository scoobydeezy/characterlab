import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source='docs/planning/GA_REGISTRATION_CARRIER_REV2.json',output='docs/planning/GA_REGISTRATION_CARRIER_REVIEW_REV1.json';assert(!fs.existsSync(output));
const original=JSON.parse(fs.readFileSync(source)),topology=JSON.parse(fs.readFileSync('docs/planning/GA_COMPOSED_LOGICAL_TOPOLOGY_REV2.json'));
const crosswalk=JSON.parse(fs.readFileSync('docs/planning/GA_IDENTITY_ROLE_CLOSURE_REV17.json'));
const records=crosswalk.sources.filter(s=>s.path.endsWith('.json')).flatMap(s=>JSON.parse(fs.readFileSync(s.path)).records??[]),byName=new Map(records.map(r=>[r.name,r]));
const registration=p=>p.records.find(r=>r.name==='GeneralStageRegistration');
const field=(p,n)=>registration(p).fields.find(f=>f.name===n);
function validate(p){
 assert.equal(p.records.length,3);assert.deepEqual(p.numericAllocations,[]);assert.deepEqual(p.newIdentityFamilies,[]);
 assert.deepEqual(registration(p).fields.map(f=>f.name),['Stage','Seam','Version','Event','Phase','Input','Outputs','ReadDomain','WriteAuthorization','SubjectProjection','Definitions']);
 assert.deepEqual(field(p,'Stage').type.values,topology.stages.map(s=>s.name));
 assert.deepEqual(field(p,'WriteAuthorization').type,{kind:'ref',name:'TransitionWriteAuthorization'});assert.equal(p.inherited.TransitionWriteAuthorization,'existing322');
 assert.deepEqual(field(p,'SubjectProjection').type,{kind:'optional',value:{kind:'ref',name:'SubjectProjectionRequirement'}});assert.equal(p.inherited.SubjectProjectionRequirement,'existing266');
 assert.deepEqual(field(p,'ReadDomain').type,{kind:'set',element:{kind:'ref',name:'StatePathPattern'},min:0,max:16});
 assert.deepEqual(field(p,'Outputs').type,{kind:'list',element:{kind:'ref',name:'GeneralOutputDeclaration'},min:0,max:3});
 assert.deepEqual(p.primitives.OutputCount,{canonical:'unsigned',minimum:0,maximum:32});
 assert.equal(p.primitives.PhaseOrdinal.canonical,'unsigned');assert.deepEqual(p.primitives.PhaseOrdinal.members,[...new Set(topology.stages.map(s=>s.phase))].sort((a,b)=>a-b));
 const d=p.records.find(r=>r.name==='GeneralOutputDeclaration');assert.deepEqual(d.fields.map(f=>f.name),['Schema','Minimum','Maximum','IdentityMode']);assert.deepEqual(d.fields[3].type.values,['FreshOwned','NestedOwnedAndReserved','BorrowedOnly','ObserverFileCounter','ReservedOwned']);
 const bindings=p.records.find(r=>r.name==='GeneralDefinitionBinding');assert.deepEqual(bindings.fields[1],{name:'Definition',type:{kind:'ref',name:'DefinitionId'}});assert.equal(new Set(bindings.fields[0].type.values).size,14);
}
validate(original);
const subjects=[];
for(const stage of topology.stages.filter(s=>s.projection||s.subject?.includes('ResolvedCharacter'))){
 if(stage.input==='DeliberationOpportunity/377'){subjects.push({stage:stage.name,input:stage.input,field:1,inherited:true});continue;}
 const input=byName.get(stage.input);assert(input,'input declared '+stage.input);assert.deepEqual(input.fields[0].type,{kind:'ref',name:'ObserverId'});subjects.push({stage:stage.name,input:stage.input,field:1,inherited:false});
}
const faults=[
 ['missing-stage',p=>field(p,'Stage').type.values.pop()],
 ['input-callback',p=>registration(p).fields.push({name:'Handler',type:{kind:'ref',name:'Callback'}})],
 ['replace-idn',p=>p.inherited.SubjectProjectionRequirement='new identity lookup'],
 ['replace-write-authority',p=>p.inherited.TransitionWriteAuthorization='new authority'],
 ['unbounded-output',p=>p.primitives.OutputCount.maximum=1024],
 ['phase150',p=>p.primitives.PhaseOrdinal.members.push(150)],
 ['no-physical-stage-phase',p=>p.primitives.PhaseOrdinal.members=p.primitives.PhaseOrdinal.members.filter(n=>n!==110)],
 ['reservation-becomes-fresh',p=>p.records.find(r=>r.name==='GeneralOutputDeclaration').fields[3].type.values.pop()],
 ['definition-is-occurrence',p=>p.records.find(r=>r.name==='GeneralDefinitionBinding').fields[1].type.name='AcquisitionOccurrenceId']
].map(([name,change])=>{const p=structuredClone(original);change(p);assert.throws(()=>validate(p),name);return {name,rejected:true};});
for(const s of original.sources)assert.equal(createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({status:'SYMBOLIC REGISTRATION CARRIER REVIEW PASS; PUBLIC COMPILER OPEN',stageTemplates:topology.stages.length,subjects,faults,sources:[source,'docs/planning/GA_COMPOSED_LOGICAL_TOPOLOGY_REV2.json','docs/planning/GA_IDENTITY_ROLE_CLOSURE_REV17.json','scripts/review-ga-registration-carrier.mjs'].map(fp),limits:['Schema/role expressibility and inherited projection reuse only.','The actual registered paths, source authentication, output slots and state patches remain unqualified.']},null,2)+'\n');
