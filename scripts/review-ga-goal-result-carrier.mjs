import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source='docs/planning/GA_GOAL_RESULT_CARRIER_REV1.json',output='docs/planning/GA_GOAL_RESULT_CARRIER_REVIEW_REV1.json';assert(!fs.existsSync(output));
const original=JSON.parse(fs.readFileSync(source));
function validate(p){
 assert.equal(p.status,'SYMBOLIC FIELD INVENTORY; PUBLIC SHAPE AND ALLOCATION OPEN');
 const names=new Map();for(const r of p.records){assert.deepEqual(Object.keys(r).sort(),['fields','name']);assert(!names.has(r.name));names.set(r.name,r);assert.equal(new Set(r.fields.map(f=>f.name)).size,r.fields.length);for(const f of r.fields)assert.deepEqual(Object.keys(f).sort(),['name','type']);}
 const walk=t=>{switch(t.kind){case'ref':assert(names.has(t.name)||Object.hasOwn(p.external,t.name),t.name);return[t.name];case'enum':assert(t.values.length);assert.equal(new Set(t.values).size,t.values.length);return[];case'union':assert(t.alternatives.length>=2);assert.equal(new Set(t.alternatives.map(x=>x.name)).size,t.alternatives.length);return t.alternatives.flatMap(walk);case'list':case'set':assert(Number.isSafeInteger(t.min)&&Number.isSafeInteger(t.max)&&t.min>=0&&t.max>=t.min&&t.max<=16);return walk(t.element);default:assert.fail(t.kind);}};
 for(const r of p.records)for(const f of r.fields)walk(f.type);
 const fields=n=>names.get(n).fields.map(f=>f.name),field=(n,k)=>names.get(n).fields.find(f=>f.name===k).type;
 assert.deepEqual(fields('MaintenanceGoalKey'),['Character','GoalReferent']);assert.equal(field('MaintenanceGoalKey','GoalReferent').name,'SemanticReferentId');
 assert.deepEqual(fields('AdoptedMaintenanceGoal'),['Spec','AdoptedAt','Status','ChangedAt']);assert.equal(field('MaintenanceGoalLedger','Entries').min,0);assert.equal(field('MaintenanceGoalLedger','Entries').max,16);
 assert.deepEqual(fields('GoalQualificationCarry'),['Assessment','Observer','Goal','Consequence','AssessedAt','Qualification','TransformationVersion']);
 assert.deepEqual(fields('GoalQualificationDelivery'),['TargetOriginal','DueAt','Carry']);
 assert.deepEqual(fields('QualifiedSignificanceJoin'),['Qualification','Attribution']);
 assert.equal(field('GoalOutcomeAssessment','Assessment').name,'GoalOutcomeAssessmentId');assert.equal(field('GoalQualificationCarry','Assessment').name,'GoalOutcomeAssessmentId');assert.equal(field('RetainedAttributionResult','Result').name,'RetainedAttributionResultId');
 assert.deepEqual(field('GoalQualificationCarry','Qualification'),field('GoalOutcomeAssessment','Qualification'));
 assert.deepEqual(field('GoalQualifies','Direction').values,['MovingCloser','MovingFarther']);
 assert.deepEqual(field('GoalQualificationUnavailable','Cause').values,['Absent','Pending','Withdrawn','Expired','MissingEvidence']);
 assert.deepEqual(fields('RetainedAttributionResult'),['Result','Observer','Character','Consequence','At','TransformationVersion','Disposition','Consumed','Targets']);
 for(const [f,max] of [['Consumed',16],['Targets',1]])assert.deepEqual(field('RetainedAttributionResult',f),{kind:'set',element:{kind:'ref',name:'RetainedChildAddress'},min:0,max});
 const reach=(n,stack=[])=>{assert(!stack.includes(n),'recursive carrier');return new Set([n,...(names.has(n)?names.get(n).fields.flatMap(f=>walk(f.type).flatMap(x=>[...reach(x,[...stack,n])])):[])]);};
 const carry=reach('GoalQualificationDelivery'),join=reach('QualifiedSignificanceJoin');
 for(const n of ['ExactInterval','GoalDistanceAssessment','GoalOutcomeAssessment','MaintenanceGoalSpec','AdoptedMaintenanceGoal','DefinitionId','RetainedViewAddress']){assert(!carry.has(n),'carry leaks '+n);assert(!join.has(n),'join leaks '+n);}
 assert.deepEqual(p.storage,['MaintenanceGoalLedger']);assert.deepEqual(p.traceOnly,['GoalOutcomeAssessment']);
 return {records:names.size,fields:p.records.reduce((n,r)=>n+r.fields.length,0),deliveryReachability:[...carry].sort(),joinReachability:[...join].sort()};
}
const checked=validate(original),record=(p,n)=>p.records.find(r=>r.name===n),field=(p,n,k)=>record(p,n).fields.find(f=>f.name===k);
const cases=[
 ['carry-full-appraisal',p=>record(p,'GoalQualificationCarry').fields.push({name:'Basis',type:{kind:'ref',name:'GoalOutcomeAssessment'}})],
 ['indirect-numeric-qualification',p=>record(p,'GoalQualifies').fields.push({name:'Distance',type:{kind:'ref',name:'ExactInterval'}})],
 ['join-view-archive',p=>record(p,'QualifiedSignificanceJoin').fields.push({name:'View',type:{kind:'ref',name:'RetainedViewAddress'}})],
 ['reuse-task-appraisal-identity',p=>field(p,'GoalOutcomeAssessment','Assessment').type.name='AppraisalOccurrenceId'],
 ['parallel-qualification-occurrence',p=>record(p,'GoalQualificationCarry').fields.push({name:'QualificationId',type:{kind:'ref',name:'GoalOutcomeAssessmentId'}})],
 ['missing-target-original',p=>record(p,'GoalQualificationDelivery').fields.shift()],
 ['absence-is-zero',p=>field(p,'GoalQualificationUnavailable','Cause').type.values=['Zero']],
 ['erase-farther',p=>field(p,'GoalQualifies','Direction').type.values=['MovingCloser']],
 ['credit-unrelated-siblings',p=>field(p,'RetainedAttributionResult','Targets').type.max=16],
 ['force-use-for-unavailable',p=>field(p,'RetainedAttributionResult','Consumed').type.min=1],
 ['mutable-goal-baseline',p=>record(p,'AdoptedMaintenanceGoal').fields.push({name:'Desired',type:{kind:'ref',name:'ExactInterval'}})],
 ['new-numeric-record',p=>record(p,'GoalOutcomeAssessment').recordTypeId=99999]
];
const faults=cases.map(([name,mutate])=>{const p=structuredClone(original);mutate(p);assert.throws(()=>validate(p),name);return{name,rejected:true};});
for(const s of original.sources)assert.equal(createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256,s.path);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'GOAL RESULT STRUCTURAL REVIEW PASS; PUBLIC GATES OPEN',...checked,faults,sources:[source,'scripts/build-ga-goal-result-carrier.mjs','scripts/review-ga-goal-result-carrier.mjs'].map(fp),limits:['Structural reachability and field checks only; semantic role, source authenticity and state admission not qualified.','OriginalAddress and ExactInterval still need exact canonical substrate bindings before allocation.']},null,2)+'\n');
