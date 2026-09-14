import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p)),fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const input='docs/planning/GA_REGISTRATION_WRITE_SCOPE_CORRECTION_REV1.json',out='docs/planning/GA_REGISTRATION_WRITE_SCOPE_REVIEW_REV1.json';assert(!fs.existsSync(out));
const p=read(input),base=read('docs/formal/GENERAL_ATTENTION_CARRIER_CANDIDATE.json'),old=base.records.find(r=>r.name==='GeneralStageRegistration'),graph=read('docs/planning/GA_COMPOSED_LOGICAL_TOPOLOGY_REV2.json');
for(const f of p.sources)assert.deepEqual(fp(f.path),f);
const pathStages=new Set(['current-track','consequence-track','goal-command-owner','goal-deadline-owner','local-reserve-replenishment']);
function audit(x){
 assert.equal(x.records.length,2);const [cap,wrapper]=x.records;
 assert.equal(cap.name,'GeneralPathWriteCapability');assert.deepEqual(cap.fields,[{name:'Authority',type:{kind:'ref',name:'MutationAuthorityId'}},{name:'Paths',type:{kind:'set',element:{kind:'ref',name:'StatePathPattern'},min:1,max:16}}]);
 assert.equal(wrapper.name,'GeneralStageRegistrationV02');assert.equal(wrapper.fields.length,old.fields.length);
 old.fields.forEach((f,i)=>assert.deepEqual(wrapper.fields[i],f.name==='WriteAuthorization'?{name:f.name,type:{kind:'union',alternatives:[{kind:'ref',name:'TransitionWriteAuthorization'},{kind:'ref',name:'GeneralPathWriteCapability'}]}}:f));
 assert.equal(x.stages.length,67);
 graph.stages.forEach((s,i)=>{const t=x.stages[i];assert.equal(t.name,s.name);assert.deepEqual(t.roots,s.writes);assert.deepEqual(t.route,s.route);assert.equal(t.writeMode,!s.writes.length?'ReadOnly':pathStages.has(s.name)?'ExactPaths':'LearningFamilies');if(t.writeMode==='LearningFamilies')assert.deepEqual(t.route,['route/character-learning']);assert(!t.roots.some(r=>r.includes('FormationGovernance')));});
 assert.equal(x.status,'SYMBOLIC CORRECTION; NO ALLOCATION');
}
audit(p);
const faults=[['rewrite-frozen-name',p=>p.records[1].name='GeneralStageRegistration'],['silent-read-domain-change',p=>p.records[1].fields[7].type.max=1024],['empty-path-permission',p=>p.records[0].fields[1].type.min=0],['scalar-family-paths',p=>p.records[0].fields[1].type.element.name='Campaign2StateFamilyId'],['capability-union-alias',p=>p.records[1].fields[8].type.alternatives[1].name='TransitionWriteAuthorization'],['physical-learning-route',p=>p.stages.find(s=>s.name==='local-reserve-replenishment').route=['route/character-learning']],['perception-readonly-lie',p=>p.stages.find(s=>s.name==='current-track').writeMode='ReadOnly'],['protocol-writer',p=>p.stages.find(s=>s.name==='ordinary-memory-formation').roots.push('FormationGovernanceState')]].map(([name,change])=>{const x=structuredClone(p);change(x);assert.throws(()=>audit(x),name);return {name,rejected:true};});
const roles=[...p.roles,...base.roles.filter(r=>r.path.startsWith('GeneralStageRegistration.')).map(r=>({...r,path:r.path.replace('GeneralStageRegistration.','GeneralStageRegistrationV02.')}))];
const boundaries=[{path:'GeneralPathWriteCapability.Paths[*]',record:'StatePathPattern',mode:'InheritedRecordRoles',source:'existing149'},...base.recordBoundaries.filter(r=>r.path.startsWith('GeneralStageRegistration.')).map(r=>({...r,path:r.path.replace('GeneralStageRegistration.','GeneralStageRegistrationV02.')})),{path:'GeneralStageRegistrationV02.WriteAuthorization',record:'GeneralPathWriteCapability',mode:'RecurseDeclaredRecord'}];
fs.writeFileSync(out,JSON.stringify({status:'WRITE-SCOPE SUCCESSOR SHAPE REVIEW PASS',records:2,roles,boundaries,pathStages:[...pathStages],faults,sources:[input,'scripts/review-ga-write-scope-correction.mjs'].map(fp),limits:['No numeric allocation or model qualification','Exact stage paths, role domains and holder equality remain compiler obligations']},null,2)+'\n');
console.log('Write-scope successor shape reviewed; eight faults rejected.');
