import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source='docs/planning/GA_STATE_ROOT_KEY_INVENTORY_REV1.json',output='docs/planning/GA_STATE_ROOT_KEY_REVIEW_REV1.json';assert(!fs.existsSync(output));const original=JSON.parse(fs.readFileSync(source));
function validate(p){
 assert.equal(p.roots.length,7);assert.equal(new Set(p.roots.map(r=>r.root)).size,7);assert.equal(p.stateMapKeyRoles.length,6);
 const records=new Map(p.records.map(r=>[r.name,r])),field=(n,f)=>records.get(n).fields.find(x=>x.name===f).type;
 assert.equal(records.size,12);
 for(const root of p.roots){
  assert.equal(root.removalAllowed,false);
  if(root.classification==='RuntimeProtocol'){
   assert.equal(root.root,'FormationGovernanceState');assert.equal(root.key,null);assert.deepEqual(root.selectors,[]);assert(!p.stateMapKeyRoles.some(r=>r.root===root.root));assert.equal(root.owner,'authority/formation-governance');continue;
  }
  const role=p.stateMapKeyRoles.filter(r=>r.root===root.root&&r.field===root.field);assert.equal(role.length,1);assert.equal(role[0].role,'StateMapKey');
  assert.deepEqual(root.selectors,[{kind:'mapKey',type:root.key}]);assert.deepEqual(field(root.root,root.field),{kind:'map',key:{kind:'ref',name:root.key},value:{kind:'ref',name:root.value},min:1,max:1});
  if(root.key==='CharacterId'){assert.equal(role[0].requiredNamespace,1002);assert.equal(role[0].domainValidator,'validator/character-qualification');assert(['episodic-memory','associations','prospective-commitments'].includes(root.classification));}
  else {assert.equal(root.key,'ObserverId');assert.equal(role[0].requiredNamespace,1000);assert(!Object.hasOwn(role[0],'domainValidator'));assert.equal(root.classification,'Perception');assert.equal(root.owner,'authority/perception');}
 }
 const values=Object.fromEntries(p.roots.map(r=>[r.root,r.value]));assert.equal(values.GeneralEpisodeState,'SurvivingEpisodeLedger');assert.equal(values.GeneralPresentationState,'PresentationLedger');assert.equal(values.MaintenanceGoalState,'MaintenanceGoalLedger');
 for(const f of ['Nodes','Rows'])assert.deepEqual([field('AssociationGraph',f).min,field('AssociationGraph',f).max],[0,27]);
 assert.deepEqual([field('AssociationMassRow','Masses').min,field('AssociationMassRow','Masses').max],[0,27]);
 assert.deepEqual(records.get('TrackingWindow').fields.map(f=>f.name),['At','Observation','Items']);assert.equal(field('TrackingWindow','Observation').kind,'optional');assert.equal(field('TrackingWindow','Items').max,3);
 assert.deepEqual(records.get('TrialPanelWindow').fields.map(f=>f.name),['At','Active']);assert.equal(field('TrialPanelWindow','Active').kind,'optional');
 assert(!records.has('FormationGovernanceState'));assert(p.status.includes('OPEN'));
}
validate(original);const root=(p,n)=>p.roots.find(r=>r.root===n),field=(p,n,f)=>p.records.find(r=>r.name===n).fields.find(x=>x.name===f).type;
const faults=[
 ['missing-root-key-role',p=>p.stateMapKeyRoles.pop()],
 ['character-key-without-domain',p=>delete p.stateMapKeyRoles[0].domainValidator],
 ['observer-key-as-character',p=>p.stateMapKeyRoles.find(r=>r.requiredNamespace===1000).requiredNamespace=1002],
 ['protocol-as-cognitive-map',p=>root(p,'FormationGovernanceState').selectors=[{kind:'mapKey',type:'CharacterId'}]],
 ['perception-as-learning',p=>root(p,'GeneralTrackingState').classification='episodic-memory'],
 ['old-selection-ledger',p=>root(p,'GeneralEpisodeState').value='EpisodeLedger'],
 ['delete-empty-root',p=>root(p,'GeneralEpisodeState').removalAllowed=true],
 ['graph-cannot-be-empty',p=>field(p,'AssociationGraph','Nodes').min=1],
 ['silent-graph-bound-truncation',p=>field(p,'AssociationGraph','Nodes').max=12],
 ['tracking-payload-history',p=>p.records.find(r=>r.name==='TrackingWindow').fields.push({name:'History',type:{kind:'ref',name:'ObservationId'}})],
 ['permanent-active-context',p=>field(p,'TrialPanelWindow','Active').kind='ref']
];for(const [name,mutate] of faults){const p=structuredClone(original);mutate(p);assert.throws(()=>validate(p),undefined,name);}
for(const s of original.sources)assert.equal(createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'SYMBOLIC ROOT/KEY REVIEW PASS',roots:7,newRecords:12,stateMapKeyRoles:6,faults:faults.map(([name])=>({name,detected:true})),sources:[source,'scripts/review-ga-state-root-key-inventory.mjs'].map(fp),limits:['Field/role topology only; no allocated type or public state compiler.','Graph cross-field invariants, nested subject equality, initial values and whole-prefix reconstruction remain actual compiler/runtime obligations.']},null,2)+'\n');
