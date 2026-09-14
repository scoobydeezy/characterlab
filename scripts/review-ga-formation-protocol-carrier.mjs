import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source='docs/planning/GA_FORMATION_PROTOCOL_CARRIER_REV2.json',output='docs/planning/GA_FORMATION_PROTOCOL_CARRIER_REVIEW_REV2.json';assert(!fs.existsSync(output));const original=JSON.parse(fs.readFileSync(source));
function validate(p){
 assert.equal(p.status,'SYMBOLIC DESCRIPTOR INVENTORY; PUBLIC HOOKS AND ALLOCATION OPEN');
 assert.deepEqual(p.cognitiveReadDomains,[]);assert.deepEqual(p.cognitiveWritableFamilies,[]);
 const names=new Map();for(const r of p.records){assert.deepEqual(Object.keys(r).sort(),['fields','name']);assert(!names.has(r.name));names.set(r.name,r);assert.equal(new Set(r.fields.map(f=>f.name)).size,r.fields.length);for(const f of r.fields)assert.deepEqual(Object.keys(f).sort(),['name','type']);}
 const walk=t=>{if(t.kind==='ref'){assert(names.has(t.name)||Object.hasOwn(p.external,t.name));return[t.name];}if(t.kind==='enum'){assert(t.values.length);assert.equal(new Set(t.values).size,t.values.length);return[];}assert(['map','set'].includes(t.kind));assert(Number.isSafeInteger(t.min)&&Number.isSafeInteger(t.max)&&t.min>=0&&t.max>=t.min&&t.max<=32);return t.kind==='map'?[...walk(t.key),...walk(t.value)]:walk(t.element);};
 for(const r of p.records)for(const f of r.fields)walk(f.type);
 const fields=n=>names.get(n).fields.map(f=>f.name),field=(n,k)=>names.get(n).fields.find(f=>f.name===k).type;
 assert.deepEqual(fields('QualifiedFormationSource'),['Character','Selection']);assert.equal(field('QualifiedFormationSource','Selection').name,'SelectionOccurrenceId');
 assert.deepEqual(fields('FormationSuccess'),['Acquisition','FormedAt','CompleteLoss']);
 assert.deepEqual(fields('FormationGovernanceValue'),['AdmittedSources','SuccessfulFormations']);
 for(const f of ['AdmittedSources','SuccessfulFormations']){const t=field('FormationGovernanceValue',f);assert.equal(t.kind,'map');assert.equal(t.key.name,'QualifiedFormationSource');assert.equal(t.min,0);assert.equal(t.max,32);}
 assert.equal(field('FormationGovernanceValue','AdmittedSources').value.name,'FormationAdmission');assert.equal(field('FormationGovernanceValue','SuccessfulFormations').value.name,'FormationSuccess');
 assert.deepEqual(fields('FormationSourceBinding'),['Producer','AuditSchema','SelectionField','ViewSchema','Projection','AcquisitionKind']);assert.equal(field('FormationSourceBinding','Projection').name,'DefinitionId');
 assert.deepEqual(field('RuntimeProtocolStateDeclaration','Classification').values,['RuntimeProtocol']);assert.equal(field('RuntimeProtocolStateDeclaration','RemovalAllowed').name,'False');
 assert.deepEqual(fields('FormationOwnerDisposition'),['Formed','NewCompleteLoss']);assert.equal(field('FormationOwnerDisposition','Formed').value.name,'FormationSuccess');
 assert.deepEqual(p.storage,['FormationGovernanceState']);assert.deepEqual(p.runtimeOnly,['FormationOwnerDisposition']);
 const reachable=new Set();const reach=(n,stack=[])=>{assert(!stack.includes(n));reachable.add(n);if(names.has(n))for(const f of names.get(n).fields)for(const x of walk(f.type))reach(x,[...stack,n]);};reach('FormationGovernanceState');reach('FormationOwnerDisposition');
 assert.deepEqual([...reachable].filter(n=>!names.has(n)).sort(),['AcquisitionOccurrenceId','Boolean','CharacterId','Instant','SelectionOccurrenceId']);
 return {records:names.size,fields:p.records.reduce((n,r)=>n+r.fields.length,0),metadataReachability:[...reachable].sort()};
}
const checked=validate(original),r=(p,n)=>p.records.find(r=>r.name===n),f=(p,n,k)=>r(p,n).fields.find(f=>f.name===k);
const cases=[
 ['cognitive-classification',p=>f(p,'RuntimeProtocolStateDeclaration','Classification').type.values=['EpisodicMemory']],
 ['cognitive-read-grant',p=>p.cognitiveReadDomains.push('FormationGovernanceState')],
 ['cognitive-write-grant',p=>p.cognitiveWritableFamilies.push('FormationGovernanceState')],
 ['removable-history',p=>f(p,'RuntimeProtocolStateDeclaration','RemovalAllowed').type.name='Boolean'],
 ['unbounded-domain',p=>f(p,'FormationGovernanceValue','AdmittedSources').type.max=33],
 ['missing-projection',p=>r(p,'FormationSourceBinding').fields=r(p,'FormationSourceBinding').fields.filter(f=>f.name!=='Projection')],
 ['kind-duplicated-in-success',p=>r(p,'FormationSuccess').fields.push({name:'Kind',type:{kind:'ref',name:'FormationAdmission'}})],
 ['source-is-acquisition',p=>f(p,'QualifiedFormationSource','Selection').type.name='AcquisitionOccurrenceId'],
 ['payload-in-owner-result',p=>{p.external.Sample='payload';r(p,'FormationOwnerDisposition').fields.push({name:'Sample',type:{kind:'ref',name:'Sample'}});}],
 ['numeric-root',p=>r(p,'FormationGovernanceState').typeId=99999]
];const faults=cases.map(([name,mutate])=>{const p=structuredClone(original);mutate(p);assert.throws(()=>validate(p),name);return{name,rejected:true};});
for(const s of original.sources)assert.equal(createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'PROTOCOL DESCRIPTOR STRUCTURAL REVIEW PASS; PUBLIC HOOKS OPEN',...checked,faults,sources:[source,'scripts/build-ga-formation-protocol-carrier.mjs','scripts/review-ga-formation-protocol-carrier.mjs'].map(fp),limits:['Inventory checks do not execute public admission or prove the runtime success-subset/monotonicity invariant.','Existing protocol transition components retain their separate test scope; actual public source and owner binding remain open.']},null,2)+'\n');
