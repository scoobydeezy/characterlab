import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const input='docs/planning/GA_SOURCE_STAGE_CLOSURE_REV1.json',output='docs/planning/GA_SOURCE_STAGE_REVIEW_REV1.json';assert(!fs.existsSync(output));
const packet=JSON.parse(fs.readFileSync(input)),phaseSource=fs.readFileSync('src/semanticBinding/phaseOrdering.ts','utf8');
const recordFields={GeneralSamplingInput:['ObserverId','Original','World'],GeneralTrackingInput:['ObserverId','Samples','Use'],GeneralBindingInput:['ObserverId','Samples','Use','Tracks','Event'],GeneralFreezeInput:['ObserverId','Samples','Use','Tracks','Event','Bindings'],GeneralUseInput:['ObserverId','Use','Body','Visual','Claims']};
function validate(p){
 assert.equal(p.records.length,5);assert.deepEqual(p.newIdentityFamilies,[]);assert.deepEqual(p.numericAllocations,[]);assert.equal(p.sourceEventsPerOriginal,8);
 assert.equal(new Set(p.records.map(r=>r.name)).size,5);
 for(const r of p.records){assert.deepEqual(r.fields.map(f=>f.name),recordFields[r.name]);assert.deepEqual(r.fields[0].type,{kind:'ref',name:'ObserverId'});}
 const stages=new Map(p.stages.map(s=>[s.name,s]));assert.equal(stages.size,15);assert.equal(p.stages.length,15);
 const world=stages.get('world');assert.equal(world.phase,0);assert.deepEqual(world.next,['current-sample','consequence-sample']);assert.equal(world.childInput,'GeneralSamplingInput');
 for(const lane of ['current','consequence']){
  const ops=['sample','track','bind','classify','freeze','roles','dispatch'],suffixes=['Observation','TrackingAndSegmentation','BindingAndFeatureEvidence','Classification','ExperienceFreeze','CausalRole'];
  for(let i=0;i<ops.length;i++){
   const s=stages.get(lane+'-'+ops[i]);assert(s);const semanticName=lane[0].toUpperCase()+lane.slice(1)+suffixes[i];const phase=i===6?(lane==='current'?40:130):Number(phaseSource.match(new RegExp(semanticName+': (\\d+)n'))?.[1]);assert.equal(s.phase,phase);
   assert.deepEqual(s.route,[]);if(i!==1)assert.deepEqual(s.writes,[]);if(i!==0&&i!==1)assert.deepEqual(s.reads,[]);
   if(i===0){assert.deepEqual(s.reads,['LocalReserveState via bound sampling channel and PRJ/IDN']);assert.equal(s.subject,'ResolvedCharacterSubject for body request');}
   if(i===1){const values=['PerceptualContinuantFileState','PerceptualEventFileState','GeneralTrackingState','TrialPanelContextState'];assert.deepEqual(s.reads,values);assert.deepEqual(s.writes,values);}
   assert.deepEqual(s.next,i===6?[]:[lane+'-'+ops[i+1]]);assert.equal(s.childInput,i===6?null:stages.get(s.next[0]).input);
  }
 }
 // Five exact transport grammars, independent of graph edges.
 const fields=n=>Object.fromEntries(p.records.find(r=>r.name===n).fields.map(f=>[f.name,f.type]));
 assert.deepEqual(fields('GeneralSamplingInput').World,{kind:'optional',value:{kind:'ref',name:'WorldEventTruth'}});
 for(const n of ['GeneralTrackingInput','GeneralBindingInput','GeneralFreezeInput']){assert.deepEqual(fields(n).Samples,{kind:'ref',name:'CompletedRequestedSamples'});assert.deepEqual(fields(n).Use,{kind:'ref',name:'ObservationUsePlan'});}
 for(const [n,f,t]of [['GeneralBindingInput','Tracks','PerceptualTrackTransition'],['GeneralFreezeInput','Tracks','PerceptualTrackTransition'],['GeneralFreezeInput','Bindings','PerceivedBindingEvidence'],['GeneralUseInput','Claims','CausalRoleEvidence']])assert.deepEqual(fields(n)[f],{kind:'list',element:{kind:'ref',name:t},min:0,max:3});
 for(const n of ['GeneralTrackingInput','GeneralBindingInput','GeneralFreezeInput','GeneralUseInput'])assert(!JSON.stringify(fields(n)).includes('WorldEventTruth'));
}
validate(packet);const faults=[
 ['truth-in-perception',p=>p.records[1].fields.push({name:'World',type:{kind:'ref',name:'WorldEventTruth'}})],
 ['lost-use-plan',p=>p.records[2].fields=p.records[2].fields.filter(f=>f.name!=='Use')],
 ['wrong-subject-field',p=>p.records[0].fields[0].type.name='ObservationId'],
 ['early-consequence-sensing',p=>p.stages.find(s=>s.name==='consequence-sample').phase=110],
 ['cognitive-body-read',p=>p.stages.find(s=>s.name==='current-freeze').reads=['LocalReserveState']],
 ['binding-state-write',p=>p.stages.find(s=>s.name==='current-bind').writes=['GeneralTrackingState']],
 ['source-learning-route',p=>p.stages.find(s=>s.name==='current-sample').route=['route/character-learning']],
 ['orphan-lane',p=>p.stages[0].next=['current-sample']],
 ['mismatched-child-wrapper',p=>p.stages.find(s=>s.name==='current-track').childInput='GeneralUseInput'],
 ['early-numeric-allocation',p=>p.numericAllocations=[9999]],
];
for(const [name,mutate]of faults){const changed=structuredClone(packet);mutate(changed);assert.throws(()=>validate(changed),name);}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({status:'SOURCE TOPOLOGY/TRANSPORT REVIEW PASS',records:5,registrations:15,sourceEventsPerOriginal:8,faults:faults.map(([name])=>({name,detected:true})),sources:[input,'src/semanticBinding/phaseOrdering.ts','scripts/review-ga-source-stage-closure.mjs'].map(fp),limits:['Symbolic source-only graph; not whole public registration acceptance.','Exact state paths/accessors, output allocation clauses and downstream stages remain open.','The five wrappers are not yet included in the124-record identity crosswalk.']},null,2)+'\n');
