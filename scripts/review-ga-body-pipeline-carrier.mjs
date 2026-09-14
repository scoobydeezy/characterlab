import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source='docs/planning/GA_BODY_PIPELINE_CARRIER_REV3.json',output='docs/planning/GA_BODY_PIPELINE_CARRIER_REVIEW_REV3.json';assert(!fs.existsSync(output));const original=JSON.parse(fs.readFileSync(source));
function validate(p){
 assert.equal(p.status,'SYMBOLIC BODY FIELD INVENTORY; PUBLIC REGISTRATION AND ALLOCATION OPEN');assert.deepEqual(p.storage,[]);
 const names=new Map();for(const r of p.records){assert.deepEqual(Object.keys(r).sort(),['fields','name']);assert(!names.has(r.name));names.set(r.name,r);assert.equal(new Set(r.fields.map(f=>f.name)).size,r.fields.length);}
 const walk=t=>{if(t.kind==='ref'){assert(names.has(t.name)||Object.hasOwn(p.external,t.name));return[t.name];}if(t.kind==='optional')return walk(t.value);if(t.kind==='enum'){assert(t.values.length);return[];}assert(['list','set'].includes(t.kind));assert(Number.isSafeInteger(t.min)&&Number.isSafeInteger(t.max)&&t.min>=0&&t.max>=t.min&&t.max<=9);return walk(t.element);};
 for(const r of p.records)for(const f of r.fields){assert.deepEqual(Object.keys(f).sort(),['name','type']);walk(f.type);}
 const fields=n=>names.get(n).fields.map(f=>f.name),field=(n,k)=>names.get(n).fields.find(f=>f.name===k).type;
 assert.deepEqual(fields('SafeSignalDeclaration'),['Channel','Signal']);assert.deepEqual(fields('BodyOpportunityEvidence'),['Observer','At','Samples','Experience','Declarations','Context']);
 assert.deepEqual(field('BodyOpportunityEvidence','Context'),{kind:'optional',value:{kind:'ref',name:'PerceivedTrialContextEvidence'}});
 assert.equal(field('BodyOpportunityEvidence','Experience').kind,'optional');assert.equal(field('BodyOpportunityEvidence','Samples').max,9);
 for(const n of ['BodySelectionInput','BodyCueInput']){assert.deepEqual(fields(n),['ObserverId','Source']);assert.equal(field(n,'Source').name,'BodyOpportunityEvidence');}
 for(const n of ['BodySelectionAudit','BodySelectedView']){assert.equal(field(n,'Selection').name,'SelectionOccurrenceId');assert.equal(field(n,'Opportunity').kind,'optional');}
 assert.equal(field('BodySelectedView','Groups').min,0);assert.equal(field('BodySelectedView','Groups').max,3);assert.equal(field('BodySelectedView','Groups').element.name,'PositiveBodySignalGroup');
 assert.deepEqual(fields('BodySelectedView'),['Selection','Observer','At','Opportunity','Groups']);
 assert.deepEqual(fields('BodySignalCue'),['Observer','At','Opportunity','Status','Signals','SupportingObservationIds']);assert.deepEqual(field('BodySignalCue','Status').values,['Present','Absent']);assert.equal(field('BodySignalCue','Signals').min,0);
 const reached=new Set();const reach=(n,stack=[])=>{assert(!stack.includes(n));reached.add(n);if(names.has(n))for(const f of names.get(n).fields)for(const x of walk(f.type))reach(x,[...stack,n]);};reach('BodySignalCue');
 for(const n of ['BodyOpportunityEvidence','EmbodiedSample','PreRecognitionSemanticExperience','PerceivedTrialContextEvidence','SelectionOccurrenceId'])assert(!reached.has(n),'cue leak '+n);
 return {records:names.size,fields:p.records.reduce((n,r)=>n+r.fields.length,0),cueReachability:[...reached].sort()};
}
const checked=validate(original),r=(p,n)=>p.records.find(r=>r.name===n),f=(p,n,k)=>r(p,n).fields.find(f=>f.name===k);
const cases=[
 ['missing-context-attachment',p=>r(p,'BodyOpportunityEvidence').fields.pop()],
 ['force-experience-for-absence',p=>f(p,'BodyOpportunityEvidence','Experience').type={kind:'ref',name:'PreRecognitionSemanticExperience'}],
 ['selection-gates-cue',p=>f(p,'BodyCueInput','Source').type.name='BodySelectedView'],
 ['selection-is-experience',p=>f(p,'BodySelectionAudit','Selection').type.name='ExperienceId'],
 ['no-empty-selection',p=>f(p,'BodySelectedView','Groups').type.min=1],
 ['selection-retains-source-archive',p=>r(p,'BodySelectedView').fields.push({name:'Source',type:{kind:'ref',name:'BodyOpportunityEvidence'}})],
 ['cue-carries-samples',p=>r(p,'BodySignalCue').fields.push({name:'Samples',type:{kind:'list',element:{kind:'ref',name:'EmbodiedSample'},min:0,max:9}})],
 ['physical-key-in-safe-declaration',p=>{p.external.LocalReserveId='physical';r(p,'SafeSignalDeclaration').fields.push({name:'Physical',type:{kind:'ref',name:'LocalReserveId'}});}],
 ['widen-source-bound',p=>f(p,'BodyOpportunityEvidence','Samples').type.max=10],
 ['premature-record-number',p=>r(p,'BodySelectedView').typeId=99999]
];const faults=cases.map(([name,mutate])=>{const p=structuredClone(original);mutate(p);assert.throws(()=>validate(p),name);return{name,rejected:true};});
for(const s of original.sources)assert.equal(createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'BODY PIPELINE STRUCTURAL REVIEW PASS; PUBLIC GATES OPEN',...checked,faults,sources:[source,'scripts/build-ga-body-pipeline-carrier-rev3.mjs','scripts/review-ga-body-pipeline-carrier.mjs'].map(fp),limits:['Field/bound checks only. Exact requested-channel bijection and completed producer/context/subject binding remain public qualification obligations.','Conditional support/experience presence must be enforced by actual combined-source admission, not inferred from schemas alone.']},null,2)+'\n');
