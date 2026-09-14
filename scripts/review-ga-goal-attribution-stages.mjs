import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const input='docs/planning/GA_GOAL_ATTRIBUTION_STAGE_CLOSURE_REV1.json',output='docs/planning/GA_GOAL_ATTRIBUTION_STAGE_REVIEW_REV1.json';assert(!fs.existsSync(output));const original=JSON.parse(fs.readFileSync(input));const get=(p,n)=>p.stages.find(s=>s.name===n);
function validate(p){
 assert.equal(p.records.length,10);assert.equal(new Set(p.records.map(r=>r.name)).size,10);assert.equal(p.stages.length,13);assert.equal(new Set(p.stages.map(s=>s.name)).size,13);assert.deepEqual(p.newIdentityFamilies,[]);assert.deepEqual(p.numericAllocations,[]);
 for(const r of p.records)assert.deepEqual(r.fields[0],{name:'ObserverId',type:{kind:'ref',name:'ObserverId'}});
 const phases={'goal-command-proposal':40,'goal-command-owner':140,'goal-deadline-owner':140,'goal-outcome-assessment':130,'focal-consequence-delivery':15,'goal-qualification-delivery':15,'retained-attribution':50,'attribution-use-dispatch':130,'ordinary-memory-use':140,'attribution-result-delivery':15,'significance-opportunity':0,'significance-join':130,'ordinary-memory-significance':140};
 for(const s of p.stages){assert.equal(s.phase,phases[s.name]);assert.equal(s.projection,'Required PRJ/IDN via direct field1 after exact producer/original admission');for(const n of s.next){assert(get(p,n));assert(get(p,n).phase>=s.phase);}if(s.phase===140){assert.deepEqual(s.outputs,[]);assert.deepEqual(s.next,[]);assert(!s.future);assert.equal(s.allocation,'None');assert(s.batch.includes('common B0, no sibling reads'));assert.deepEqual(s.reads,s.writes);}else assert.deepEqual(s.writes,[]);if(!['goal-outcome-assessment','goal-command-owner','goal-deadline-owner','ordinary-memory-use','ordinary-memory-significance'].includes(s.name))assert.deepEqual(s.reads,[]);}
 assert.deepEqual(get(p,'goal-command-proposal').future,['goal-deadline-owner']);assert(get(p,'goal-command-proposal').futureGate.includes('Adopt only'));assert(get(p,'goal-deadline-owner').terminal.includes('Withdrawn is unchanged'));
 assert.equal(get(p,'goal-outcome-assessment').allocation,'One GoalOutcomeAssessmentId');assert.deepEqual(get(p,'goal-outcome-assessment').reads,['MaintenanceGoalState']);assert.deepEqual(get(p,'goal-outcome-assessment').future,['focal-consequence-delivery','goal-qualification-delivery']);assert.equal(get(p,'retained-attribution').allocation,'One RetainedAttributionResultId');
 for(const s of p.stages)assert.deepEqual(s.route,['attribution-use-dispatch','ordinary-memory-use','significance-join','ordinary-memory-significance'].includes(s.name)?['route/character-learning']:[]);
 assert.deepEqual(p.records.find(r=>r.name==='FocalConsequenceDelivery').fields.map(f=>f.name),['ObserverId','Consequence','AssessedAt','TargetOriginal','DueAt']);assert.deepEqual(p.records.find(r=>r.name==='RetainedAttributionInput').fields.map(f=>f.name),['ObserverId','Focus','Recollections']);
 assert.equal(p.joins.assessment.parents.length,2);assert.equal(p.joins.attribution.parents.length,3);assert.equal(p.joins.significance.parents.length,3);assert(p.joins.attribution.checks.includes('no unselected memory reload'));assert(p.joins.attribution.operands.includes('no authored trial pairing'));assert(p.joins.significance.operands.includes('no historical metric evidence or current goal reappraisal'));assert(p.binding.completion.includes('before PRJ/read'));assert(p.binding.restore.includes('complete-prefix replay'));assert(p.scope.assessmentAbsence.includes('remains a profile closure obligation'));
 assert.equal(p.work.wholeModelCeiling,null);assert.equal(p.work.assessmentAdditionalRecallEvents,3);assert.equal(p.work.attributionReceivingEvents,4);assert.equal(p.work.significanceReceivingEvents,5);
}
validate(original);const faults=[
 ['assessment-physical-read',p=>get(p,'goal-outcome-assessment').reads.push('LocalReserveState')],
 ['attribution-unselected-read',p=>get(p,'retained-attribution').reads=['GeneralEpisodeState']],
 ['early-assessment',p=>get(p,'goal-outcome-assessment').phase=40],
 ['deadline-from-owner',p=>get(p,'goal-command-owner').future=['goal-deadline-owner']],
 ['reuse-old-evid-identity',p=>get(p,'goal-outcome-assessment').allocation='One OutcomeEvaluationId/1116'],
 ['delivery-allocates-again',p=>get(p,'goal-deadline-owner').allocation='One GoalOutcomeAssessmentId'],
 ['terminal-output',p=>get(p,'ordinary-memory-significance').outputs=['QualifiedSignificanceJoin']],
 ['authored-focal-child',p=>p.records.find(r=>r.name==='RetainedAttributionInput').fields.push({name:'FocalChild',type:{kind:'ref',name:'RetainedChildAddress'}})],
 ['metric-in-focal-delivery',p=>p.records.find(r=>r.name==='FocalConsequenceDelivery').fields.push({name:'Before',type:{kind:'ref',name:'GoalClosedInterval'}})],
 ['missing-qualification-parent',p=>p.joins.significance.parents.pop()],
 ['recompute-withdrawn-goal',p=>p.joins.significance.operands='Read current goal and recompute'],
 ['namespace-only-subject',p=>get(p,'retained-attribution').projection='Read supplied CharacterId'],
 ['pretend-whole-ceiling',p=>p.work.wholeModelCeiling=32],
 ['claim-absent-consequence-closed',p=>p.scope.assessmentAbsence='Closed by positive tests'],
 ];for(const [name,mutate]of faults){const p=structuredClone(original);mutate(p);assert.throws(()=>validate(p),name);}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});for(const s of original.sources)assert.deepEqual(fp(s.path),s);fs.writeFileSync(output,JSON.stringify({status:'SYMBOLIC GOAL/ATTRIBUTION STAGE REVIEW PASS',records:10,stages:13,faults:faults.map(([name])=>({name,rejected:true})),sources:[input,'scripts/review-ga-goal-attribution-stages.mjs'].map(fp),limits:['Partial declaration consistency only; absent-consequence targets and whole public gates remain open.']},null,2)+'\n');
