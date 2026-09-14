import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const input='docs/planning/GA_VISUAL_PIPELINE_CARRIER_REV1.json',output='docs/planning/GA_VISUAL_PIPELINE_REVIEW_REV1.json';assert(!fs.existsSync(output));
const p=JSON.parse(fs.readFileSync(input));
function validate(p){
 const records=new Map(p.records.map(r=>[r.name,r]));assert.equal(records.size,16);
 const fields=n=>records.get(n).fields.map(f=>f.name),type=(n,f)=>records.get(n).fields.find(x=>x.name===f).type;
 function walk(t){if(t.kind==='ref')assert(records.has(t.name)||Object.hasOwn(p.external,t.name),'unknown terminal '+t.name);else if(t.kind==='optional')walk(t.value);else if(t.kind==='list'){assert(Number.isInteger(t.min)&&Number.isInteger(t.max)&&t.min>=0&&t.max>=t.min);walk(t.element);}else assert(t.kind==='enum');}
 for(const r of p.records){assert.equal(new Set(fields(r.name)).size,r.fields.length);for(const f of r.fields)walk(f.type);}
 assert.deepEqual(fields('EncodingJoinInput'),['ObserverId','Selected','Calibration']);
 assert.deepEqual(fields('ExtendedSelected'),['Selected','SpatialWitnesses','Context']);
 assert.deepEqual(type('ExtendedSelected','Selected'),{kind:'ref',name:'SelectedEvidenceView'});
 assert.equal(type('ExtendedSelected','SpatialWitnesses').max,3);
 assert.deepEqual(fields('RetainedEncodingUnit'),['Unit','Bindings','Claims','Factors','Strength','SpatialWitness']);
 assert.equal(type('RetainedEncodingUnit','Strength').name,'PositiveUnitRational');
 assert.deepEqual(type('RetainedEncodingUnit','Claims'),{kind:'list',element:{kind:'ref',name:'CausalRoleEvidence'},min:1,max:1});
 assert.equal(type('PositiveVisualCandidate','Children').min,0);assert.equal(type('PositiveVisualCandidate','Children').max,3);
 assert.deepEqual(fields('PositiveVisualCandidate'),['Selection','Observer','At','Calibration','Children']);
 assert.equal(type('VisualCueInput','Source').name,'VisualOpportunityEvidence');
 assert.deepEqual(fields('CueEvidence'),['Observer','Observation','At','Experience','Status','Detection','File']);
 assert.equal(type('ObservedFeatureDetection','Role').name,'EventRoleEvidence');
 assert.equal(type('ObservedFeatureDetection','Position').kind,'optional');
 assert.equal(type('VisualOpportunityEvidence','Experience').kind,'optional');
 assert.equal(type('VisualOpportunityEvidence','Context').kind,'optional');
 const registry=fs.readFileSync('src/semanticBinding/semanticSchemaRegistry.ts','utf8');
 for(const [name,id] of [['PerceptualTrackTransition',217],['PerceptualEventTransition',219],['EventRoleEvidence',223]]){
  assert(registry.includes(`schema(${id},'${name}'`));assert(p.external[name].startsWith('existing'+id));
 }
 return {records:records.size,fields:p.records.reduce((n,r)=>n+r.fields.length,0)};
}
const coverage=validate(p),field=(p,n,f)=>p.records.find(r=>r.name===n).fields.find(x=>x.name===f);
const faults=[
 ['outcome-gates-immediate-encoding',p=>p.records.find(r=>r.name==='EncodingJoinInput').fields.push({name:'Feedback',type:{kind:'ref',name:'ExperienceId'}})],
 ['full-source-encoder-grant',p=>field(p,'ExtendedSelected','Selected').type.name='VisualOpportunityEvidence'],
 ['zero-strength-retained',p=>field(p,'RetainedEncodingUnit','Strength').type.name='UnitRational'],
 ['copied-initial-envelope',p=>p.records.find(r=>r.name==='RetainedEncodingUnit').fields.push({name:'InitialEnvelope',type:{kind:'ref',name:'VisualOpportunityEvidence'}})],
 ['multiple-role-claims',p=>field(p,'RetainedEncodingUnit','Claims').type.max=2],
 ['empty-selection-forced-child',p=>field(p,'PositiveVisualCandidate','Children').type.min=1],
 ['cue-gated-on-encoding',p=>field(p,'VisualCueInput','Source').type.name='ExtendedSelected'],
 ['cue-sample-resolver',p=>p.records.find(r=>r.name==='CueEvidence').fields.push({name:'Source',type:{kind:'ref',name:'VisualOpportunityEvidence'}})],
 ['missing-position-as-zero',p=>field(p,'ObservedFeatureDetection','Position').type={kind:'ref',name:'GridPosition'}],
 ['misidentified-sem-record',p=>p.external.PerceptualEventTransition='existing222; admitted SEM-C']
];
for(const [name,mutate] of faults){const copy=structuredClone(p);mutate(copy);assert.throws(()=>validate(copy),undefined,name);}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({status:'SYMBOLIC VISUAL CARRIER REVIEW PASS',coverage,faults:faults.map(([name])=>({name,detected:true})),sources:[input,'scripts/review-ga-visual-pipeline-carrier.mjs','src/semanticBinding/semanticSchemaRegistry.ts'].map(fp),limits:['Structural inventory review only; no actual admission, byte codec, source authentication or runtime qualification.','Existing SEM record numbers verified against registry; proposed wrapper records remain unallocated.']},null,2)+'\n');
