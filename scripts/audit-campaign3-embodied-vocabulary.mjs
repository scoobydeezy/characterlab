// Proposed vocabulary consistency/preservation audit, not allocation approval.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const output='docs/planning/CAMPAIGN3_EMBODIED_VOCABULARY_REV1.json';
assert(!fs.existsSync(output),'preserve receipt; use a new revision');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const members=[];const add=(family,existingNamespace,payload)=>members.push({family,existingNamespace,payload,status:'PROPOSED; NOT ALLOCATED'});
for(const s of ['embodied-reserve','embodied-level-observation','embodied-pressure','embodied-replenishment'])add('SeamId',1036,'seam/'+s);
const events=[['embodied-level-sample',10],['embodied-level-tracking-slot',11],['embodied-level-binding-slot',12],['embodied-level-classification-slot',13],['embodied-level-settlement',14],['embodied-pressure-present',60],['embodied-pressure-unavailable',60],['embodied-reserve-replenishment',110]].map(([s,phase])=>({payload:'event/'+s,phase}));
for(const e of events)add('EventTypeId',1001,e.payload);
for(const s of ['EmbodiedPresentPressureTransition','EmbodiedUnavailablePressureTransition'])add('TransitionKindId',1009,s);
add('ProjectionAccessorId',1028,'accessor/embodied-reserve-anchor');add('MutationAuthorityId',1025,'authority/embodied-reserve');
add('ModalityId',1006,'modality/embodied-fuel-level');add('ObservationUnitId',1039,'unit/embodied-fuel-stock');
const dispatch=[
 ['embodied-reserve-parameters','embodied-reserve','ReserveParameters'],['embodied-reserve-bodies','embodied-reserve','ReserveBodyRegistryDefinition'],
 ['embodied-level-channel','embodied-level-observation','LevelChannelDefinition'],['embodied-pressure-definition','embodied-pressure','PressureDefinition'],
 ['embodied-level-source-registration','embodied-source-admission','LevelSourceRegistration'],
 ['embodied-pressure-present-registration','embodied-pressure-admission','PresentPressureRegistration'],
 ['embodied-pressure-unavailable-registration','embodied-pressure-admission','UnavailablePressureRegistration'],
 ['embodied-replenishment-definition','embodied-replenishment','ReserveReplenishmentDefinition'],
 ['embodied-replenishment-registration','embodied-replenishment','ReserveReplenishmentRegistration'],
].map(([kind,version,schema])=>({kind:'registry/'+kind,targetVersion:version+'/0.1-candidate',schema,status:'PROPOSED'}));
for(const r of dispatch)add('RegistryKindId',1023,r.kind);
assert.equal(new Set(members.map(m=>m.existingNamespace+':'+m.payload)).size,members.length);
const typed=JSON.parse(fs.readFileSync('docs/planning/CAMPAIGN3_EMBODIED_TYPED_INVENTORY_REV1.json'));
for(const r of dispatch)assert(typed.records.some(s=>s.name===r.schema),r.schema);
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(dir+'/'+e.name):e.name.endsWith('.json')?[dir+'/'+e.name]:[]);}
const strings=new Set();function visit(x){if(typeof x==='string')strings.add(x);else if(x&&typeof x==='object')for(const y of Object.values(x))visit(y);}
const scanned=files('docs/formal');for(const p of scanned)visit(JSON.parse(fs.readFileSync(p)));
const collisions=members.filter(m=>strings.has(m.payload));assert.equal(collisions.length,0,JSON.stringify(collisions));
const frozen=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json'));for(const f of frozen.checks)assert.equal(hash(f.path),f.sha256,f.path);
const doc='docs/planning/CAMPAIGN3_EMBODIED_VOCABULARY_DISPATCH_DRAFT.md';
const report={status:'SYM-2 VOCABULARY/DISPATCH PROPOSAL; NO NUMERIC OR SHAPE ACCEPTANCE',members,events,dispatch,
 newFailureSymbols:['EMBODIED_TARGET_PATH_VIOLATION','EMBODIED_TIME_ORDER_VIOLATION'],
 remaining:['SYM-3 closed instance IDs and specimen data','SYM-3 exact restore-code mapping','whole composed shape review','separate allocation and profile packaging'],
 checks:{members:members.length,dispatchRows:dispatch.length,formalJsonScanned:scanned.length,exactStringCollisions:collisions.length,preservedChecks:frozen.checks.length},
 limitation:'Exact string scan does not replace semantic review, permanent member allocation or runtime controls.',
 document:{path:doc,sha256:hash(doc)},typedInventory:{path:'docs/planning/CAMPAIGN3_EMBODIED_TYPED_INVENTORY_REV1.json',sha256:hash('docs/planning/CAMPAIGN3_EMBODIED_TYPED_INVENTORY_REV1.json')},
 script:{path:'scripts/audit-campaign3-embodied-vocabulary.mjs',sha256:hash('scripts/audit-campaign3-embodied-vocabulary.mjs')}};
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.checks));
