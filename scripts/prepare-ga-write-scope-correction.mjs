import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const path='docs/planning/GA_REGISTRATION_WRITE_SCOPE_CORRECTION_REV1.json';assert(!fs.existsSync(path));
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),read=p=>JSON.parse(fs.readFileSync(p));
const source='docs/formal/GENERAL_ATTENTION_CARRIER_CANDIDATE.json',old=read(source).records.find(r=>r.name==='GeneralStageRegistration');
const wrapper=structuredClone(old);wrapper.name='GeneralStageRegistrationV02';wrapper.fields.find(f=>f.name==='WriteAuthorization').type={kind:'union',alternatives:[{kind:'ref',name:'TransitionWriteAuthorization'},{kind:'ref',name:'GeneralPathWriteCapability'}]};
const records=[{name:'GeneralPathWriteCapability',fields:[{name:'Authority',type:{kind:'ref',name:'MutationAuthorityId'}},{name:'Paths',type:{kind:'set',element:{kind:'ref',name:'StatePathPattern'},min:1,max:16}}]},wrapper];
const topology=read('docs/planning/GA_COMPOSED_LOGICAL_TOPOLOGY_REV2.json');
const stages=topology.stages.map(s=>({name:s.name,writeMode:s.writes.length===0?'ReadOnly':s.route.includes('route/character-learning')?'LearningFamilies':'ExactPaths',roots:s.writes,route:s.route}));
fs.writeFileSync(path,JSON.stringify({version:'general-attention-registration-write-scope/0.1-draft',status:'SYMBOLIC CORRECTION; NO ALLOCATION',records,stages,
 roles:[{path:'GeneralPathWriteCapability.Authority',identity:'MutationAuthorityId',namespace:1025,mode:'CanonicalRecordField'}],
 inherited:['TransitionWriteAuthorization is existing322 WriteCapabilityV06, unchanged','StatePathPattern is existing149, unchanged'],
 limits:['No protocol-root write through a transition','Exact path set must match the fixed stage and admitted model','No owner or family is merged','704/1 remains frozen; no alias to this successor'],sources:[source,'docs/planning/GA_COMPOSED_LOGICAL_TOPOLOGY_REV2.json','docs/planning/GA_REGISTRATION_WRITE_SCOPE_CORRECTION_REV1.md','scripts/prepare-ga-write-scope-correction.mjs'].map(fp)},null,2)+'\n');
console.log('Two-record write-scope successor proposed without numeric assignment.');
