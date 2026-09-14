import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source='docs/planning/GA_LOCAL_RESERVE_PUBLIC_CARRIER_REV1.json',output='docs/planning/GA_LOCAL_RESERVE_PUBLIC_CARRIER_REVIEW_REV1.json';assert(!fs.existsSync(output));const original=JSON.parse(fs.readFileSync(source));
const allocation=JSON.parse(fs.readFileSync('docs/formal/EMBODIED_RESERVE_ALLOCATION_TABLE.json'));
function validate(p){
 const records=new Map(p.records.map(r=>[r.name,r])),names=n=>records.get(n).fields.map(f=>f.name),type=(n,f)=>records.get(n).fields.find(x=>x.name===f).type;
 assert.equal(records.size,9);assert.deepEqual(names('LocalReserveKey'),['Character','Reserve']);assert.equal(type('LocalReserveKey','Reserve').name,'LocalReserveId');
 assert.equal(p.newIdentityFamilies.length,1);const family=p.newIdentityFamilies[0];assert.equal(family.name,'LocalReserveId');assert.equal(family.allocator,null);assert(!Object.hasOwn(family,'namespace'));assert.deepEqual(family.members,['local-reserve/A','local-reserve/B','local-reserve/C']);
 assert.deepEqual(type('LocalReserveState','Anchors'),{kind:'map',key:{kind:'ref',name:'LocalReserveKey'},value:{kind:'ref',name:'ReserveAnchor'},min:3,max:3});
 assert.equal(p.root.classification,'PhysicalBody');assert.equal(p.root.keyRecord,'LocalReserveKey');assert.equal(p.root.owner,'authority/local-reserve');assert.equal(p.root.removalAllowed,false);assert.deepEqual(p.stateMapKeyRoles,[]);assert.deepEqual(p.cognitiveReads,[]);
 assert.deepEqual(names('LocalReserveReplenishmentResult'),['Key','At','Prior','Next','Result']);assert.equal(type('LocalReserveReplenishmentResult','Result').name,'ReserveReplenishmentResult');
 for(const [name,id] of [['ReserveAnchor',454],['ReserveReplenishmentResult',479]]){assert(allocation.records.some(r=>r.name===name&&r.typeId===id));assert.equal(p.external[name],'existing'+id);}
 assert.equal(type('LocalReserveChannel','Signal').name,'InteroceptiveSignalId');assert.equal(type('LocalReserveChannel','Reserve').name,'LocalReserveKey');
 assert.deepEqual([type('LocalReserveChannelRegistry','Channels').min,type('LocalReserveChannelRegistry','Channels').max],[3,9]);assert.equal(type('LocalReserveSamplingRequest','Channels').min,1);
 assert(!records.has('ReserveAnchor'));assert(!records.has('ReserveParameters'));assert(!records.has('ReserveReplenishmentResult'));
}
validate(original);const field=(p,n,f)=>p.records.find(r=>r.name===n).fields.find(x=>x.name===f);
const faults=[
 ['physical-is-safe-signal',p=>field(p,'LocalReserveKey','Reserve').type.name='InteroceptiveSignalId'],
 ['runtime-physical-allocator',p=>p.newIdentityFamilies[0].allocator='shared runtime'],
 ['premature-namespace',p=>p.newIdentityFamilies[0].namespace=1145],
 ['merge-three-anchors',p=>field(p,'LocalReserveState','Anchors').type.max=1],
 ['scalar-composite-key',p=>p.stateMapKeyRoles.push({root:'LocalReserveState',namespace:1002})],
 ['physical-as-memory',p=>p.root.classification='episodic-memory'],
 ['cognitive-physical-read',p=>p.cognitiveReads.push('LocalReserveState')],
 ['parallel-numeric-result',p=>field(p,'LocalReserveReplenishmentResult','Result').type.name='NewResult'],
 ['widen-old-owner',p=>p.root.owner='authority/embodied-reserve']
];for(const [name,mutate]of faults){const p=structuredClone(original);mutate(p);assert.throws(()=>validate(p),undefined,name);}
for(const s of original.sources)assert.equal(createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'SYMBOLIC LOCAL RESERVE CARRIER REVIEW PASS',records:9,faults:faults.map(([name])=>({name,detected:true})),sources:[source,'scripts/review-ga-local-reserve-public-carrier.mjs'].map(fp),limits:['No allocation, actual model compiler, source registration or physical-state persistence qualification.','Bijection, actual key/parameter and channel/observer binding remain fixed-compiler checks.']},null,2)+'\n');
