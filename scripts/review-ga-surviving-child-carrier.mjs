import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source='docs/planning/GA_SURVIVING_CHILD_CARRIER_REV3.json',output='docs/planning/GA_SURVIVING_CHILD_CARRIER_REVIEW_REV3.json';assert(!fs.existsSync(output));
const original=JSON.parse(fs.readFileSync(source));
function validate(p){
 assert.equal(p.status,'DRAFT CARRIER FIELD CLOSURE; NOT WHOLE PUBLIC SHAPE OR ALLOCATION INPUT');
 const names=new Map();for(const r of p.records){assert.deepEqual(Object.keys(r).sort(),['fields','name']);assert(!names.has(r.name));names.set(r.name,r);assert.equal(new Set(r.fields.map(f=>f.name)).size,r.fields.length);for(const f of r.fields)assert.deepEqual(Object.keys(f).sort(),['name','type']);}
 const walk=t=>{if(t.kind==='ref'){assert(names.has(t.name)||Object.hasOwn(p.external,t.name),t.name);return [t.name];}if(t.kind==='optional')return walk(t.value);if(t.kind==='union'){assert(t.alternatives.length===2);assert.equal(new Set(t.alternatives.map(x=>x.name)).size,2);return t.alternatives.flatMap(walk);}if(t.kind==='enum'){assert(t.values.length>0);assert.equal(new Set(t.values).size,t.values.length);return [];}assert(['list','set'].includes(t.kind));assert(Number.isSafeInteger(t.min)&&Number.isSafeInteger(t.max)&&t.min>=0&&t.max>=t.min&&t.max<=96);return walk(t.element);};
 for(const r of p.records)for(const f of r.fields)walk(f.type);
 const fields=n=>names.get(n).fields.map(f=>f.name),field=(n,k)=>names.get(n).fields.find(f=>f.name===k).type;
 const header=['Acquisition','Observer','At','SourceSelection','TransformationVersion','Content'];
 for(const n of ['AcquisitionFormationEvidence','RetainedAcquisition']){assert.deepEqual(fields(n),header);assert.equal(field(n,'Acquisition').name,'AcquisitionOccurrenceId');assert.equal(field(n,'SourceSelection').name,'SelectionOccurrenceId');}
 assert.deepEqual(fields('PositiveEventChildEvidence'),['Encoding','Context']);assert.deepEqual(fields('PositiveBodySignalGroup'),['Signal','Views']);assert.deepEqual(fields('RetainedBodyView'),['Sample','Context']);assert.equal(field('RetainedBodyView','Sample').name,'EmbodiedLevelObservation');
 for(const n of ['SurvivingEventChild','SurvivingBodyChild']){assert.deepEqual(fields(n),['Evidence','UseProtection','OutcomeSignificanceDirections']);assert.equal(field(n,'OutcomeSignificanceDirections').kind,'set');assert.deepEqual(field(n,'OutcomeSignificanceDirections').element.values,['MovingCloser','MovingFarther']);}
 const reachable=new Set();function reach(n,stack=[]){assert(!stack.includes(n),'recursive content');reachable.add(n);if(names.has(n))for(const f of names.get(n).fields)for(const child of walk(f.type))reach(child,[...stack,n]);}
 assert.deepEqual(p.storage,['SurvivingEpisodeLedger']);p.storage.forEach(n=>reach(n));assert(!reachable.has('AcquisitionFormationEvidence'),'forgotten initial envelope retained');
 const l=p.proposedCompilerLimits;assert.equal(l.maximumQualifiedSources,32);assert.equal(l.maximumRetainedAcquisitions,32);assert.equal(l.maximumChildrenPerAcquisition,3);assert.equal(l.maximumViewsPerBodySignal,3);assert.equal(l.maximumChildrenPerKind,32*3);
 assert.equal(field('SurvivingEpisodeLedger','Entries').min,0);assert.equal(field('SurvivingEpisodeLedger','Entries').max,l.maximumRetainedAcquisitions);
 for(const n of ['PositiveEventAcquisitionContent','PositiveBodyAcquisitionContent','SurvivingEventContent','SurvivingBodyContent']){assert.equal(field(n,'Children').min,1);assert.equal(field(n,'Children').max,3);}
 return {records:names.size,fields:p.records.reduce((n,r)=>n+r.fields.length,0),storageReachability:[...reachable].sort()};
}
const checked=validate(original),record=(p,n)=>p.records.find(r=>r.name===n),field=(p,n,k)=>record(p,n).fields.find(f=>f.name===k);
const cases=[
 ['initial-envelope-archive',p=>record(p,'RetainedAcquisition').fields.push({name:'Initial',type:{kind:'ref',name:'AcquisitionFormationEvidence'}})],
 ['parallel-episode-identity',p=>record(p,'RetainedAcquisition').fields.push({name:'Episode',type:{kind:'ref',name:'AcquisitionOccurrenceId'}})],
 ['selection-is-acquisition',p=>field(p,'RetainedAcquisition','Acquisition').type.name='SelectionOccurrenceId'],
 ['fresh-self-credit',p=>record(p,'PositiveEventChildEvidence').fields.push({name:'UseProtection',type:{kind:'ref',name:'Boolean'}})],
 ['body-encoding-strength',p=>record(p,'PositiveBodySignalGroup').fields.push({name:'Strength',type:{kind:'ref',name:'Boolean'}})],
 ['retain-unavailable-sample',p=>field(p,'RetainedBodyView','Sample').type.name='UnavailableLevelSample'],
 ['no-empty-memory',p=>field(p,'SurvivingEpisodeLedger','Entries').type.min=1],
 ['direction-list-count',p=>field(p,'SurvivingEventChild','OutcomeSignificanceDirections').type.kind='list'],
 ['open-content-union',p=>field(p,'RetainedAcquisition','Content').type.alternatives.push({kind:'ref',name:'AcquisitionFormationEvidence'})],
 ['unbounded-entries',p=>field(p,'SurvivingEpisodeLedger','Entries').type.max=100000],
 ['premature-numeric-record',p=>record(p,'RetainedAcquisition').typeId=99999],
 ['batch-bound-exceeds-horizon',p=>p.proposedCompilerLimits.maximumRetainedAcquisitions=33]
];
const faults=cases.map(([name,mutate])=>{const p=structuredClone(original);mutate(p);assert.throws(()=>validate(p),name);return {name,rejected:true};});
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'SURVIVING CHILD CARRIER STRUCTURAL REVIEW PASS; PUBLIC GATES OPEN',...checked,faults,sources:[source,'scripts/build-ga-surviving-child-carrier.mjs','scripts/review-ga-surviving-child-carrier.mjs'].map(fp),limits:['Structural draft checks only. External SEM/positive-child definitions retain their separate authority.','Does not qualify source authenticity, scalar identity roles, public state writes or persistence.']},null,2)+'\n');
