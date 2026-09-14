import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source='docs/planning/GA_RECOLLECTION_CARRIER_REV3.json',output='docs/planning/GA_RECOLLECTION_CARRIER_REVIEW_REV3.json';assert(!fs.existsSync(output));const original=JSON.parse(fs.readFileSync(source));
function validate(p){
 assert.equal(p.status,'SYMBOLIC RECALL FIELD INVENTORY; PUBLIC REGISTRATION AND ALLOCATION OPEN');
 const names=new Map();for(const r of p.records){assert.deepEqual(Object.keys(r).sort(),['fields','name']);assert(!names.has(r.name));names.set(r.name,r);assert.equal(new Set(r.fields.map(f=>f.name)).size,r.fields.length);}
 const walk=t=>{if(t.kind==='ref'){assert(names.has(t.name)||Object.hasOwn(p.external,t.name));return[t.name];}if(t.kind==='enum'){assert(t.values.length);return[];}if(t.kind==='union'){assert.equal(t.alternatives.length,2);assert.equal(new Set(t.alternatives.map(r=>r.name)).size,2);return t.alternatives.flatMap(walk);}assert(['list','set'].includes(t.kind));assert(Number.isSafeInteger(t.min)&&Number.isSafeInteger(t.max)&&t.min>=0&&t.max>=t.min&&t.max<=32);return walk(t.element);};
 for(const r of p.records)for(const f of r.fields){assert.deepEqual(Object.keys(f).sort(),['name','type']);walk(f.type);}
 const fields=n=>names.get(n).fields.map(f=>f.name),field=(n,k)=>names.get(n).fields.find(f=>f.name===k).type;
 assert.deepEqual(fields('RecalledAcquisitionEvidence'),['Acquisition','Observer','At','SourceSelection','TransformationVersion','Content']);assert.equal(field('RecalledAcquisitionEvidence','Acquisition').name,'AcquisitionOccurrenceId');
 assert.deepEqual(fields('BodyRecallWinner'),['Evidence']);assert.deepEqual(fields('EventRecallWinner'),['Evidence','Score']);assert.deepEqual(fields('Recollection'),['Occurrence','Subject','At','Content']);
 assert.equal(field('PresentationEntry','Acquisition').name,'AcquisitionOccurrenceId');assert.equal(field('EventRecallScore','Acquisition').name,'AcquisitionOccurrenceId');
 for(const n of ['EventRecallResult','BodyRecallResult']){assert.deepEqual(field(n,'Disposition').values,['UnavailableCue','Evaluated']);assert.equal(field(n,'Winners').min,0);assert.equal(field(n,'Winners').max,32);}
 assert.equal(field('PresentationEntry','Times').min,1);assert.equal(field('PresentationEntry','Times').max,32);assert.equal(field('PresentationInput','Recollections').max,32);assert.deepEqual(p.storage,['PresentationLedger']);
 const reachable=new Set();const reach=(n,stack=[])=>{assert(!stack.includes(n));reachable.add(n);if(names.has(n))for(const f of names.get(n).fields)for(const x of walk(f.type))reach(x,[...stack,n]);};reach('Recollection');
 assert(!reachable.has('EventRecallResult'));assert(!reachable.has('BodyRecallResult'));assert(!reachable.has('PresentationLedger'));
 assert.equal(field('EventRecallWinner','Evidence').name,'RecalledAcquisitionEvidence');assert.equal(field('BodyRecallWinner','Evidence').name,'RecalledAcquisitionEvidence');
 return {records:names.size,fields:p.records.reduce((n,r)=>n+r.fields.length,0),recollectionReachability:[...reachable].sort()};
}
const checked=validate(original),r=(p,n)=>p.records.find(r=>r.name===n),f=(p,n,k)=>r(p,n).fields.find(f=>f.name===k);
const cases=[
 ['source-selection-as-memory-id',p=>f(p,'RecalledAcquisitionEvidence','Acquisition').type.name='SelectionOccurrenceId'],
 ['body-numeric-score',p=>r(p,'BodyRecallWinner').fields.push({name:'Score',type:{kind:'ref',name:'NonnegativeRational'}})],
 ['retention-credit-as-recollection',p=>r(p,'RecalledAcquisitionEvidence').fields.push({name:'Protection',type:{kind:'ref',name:'NonnegativeRational'}})],
 ['initial-formation-as-recall',p=>{p.external.AcquisitionFormationEvidence='initial output';f(p,'BodyRecallWinner','Evidence').type.name='AcquisitionFormationEvidence';}],
 ['old-two-winner-bound',p=>f(p,'EventRecallResult','Winners').type.max=2],
 ['empty-recall-allocates-winner',p=>f(p,'BodyRecallResult','Winners').type.min=1],
 ['selection-history-key',p=>f(p,'PresentationEntry','Acquisition').type.name='SelectionOccurrenceId'],
 ['unbounded-history',p=>f(p,'PresentationEntry','Times').type.max=1000],
 ['extra-acquisition-identity',p=>r(p,'Recollection').fields.push({name:'NewAcquisition',type:{kind:'ref',name:'AcquisitionOccurrenceId'}})],
 ['premature-record-number',p=>r(p,'Recollection').recordTypeId=99999]
];const faults=cases.map(([name,mutate])=>{const p=structuredClone(original);mutate(p);assert.throws(()=>validate(p),name);return{name,rejected:true};});
for(const s of original.sources)assert.equal(createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'RECOLLECTION STRUCTURAL REVIEW PASS; PUBLIC GATES OPEN',...checked,faults,sources:[source,'scripts/build-ga-recollection-carrier.mjs','scripts/review-ga-recollection-carrier.mjs'].map(fp),limits:['Checks proposed fields/bounds; actual kind/winner/header equality and producer authentication remain public execution obligations.','Imported positive-content definitions retain separate source and schema qualification gates.']},null,2)+'\n');
