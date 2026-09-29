import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),planPath=p+'SLEEP_CONTROL_PLAN_REV1.json',plan=read(planPath);
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(plan.models.length,2);assert.equal(plan.runs.length,20);assert.equal(plan.prefixes,52);assert(plan.experimentIdentity&&plan.comparisonCase);
const runs=plan.runs.map(row=>{const r=read(p+'SLEEP_CONTROL_RUN_'+row.index+'_REV1.json');assert.equal(r.status,'PASS');assert.equal(r.planSha256,sha(planPath));for(const k of ['index','scenario','law','seed','runIdentity'])assert.equal(r[k],row[k]);assert.equal(r.modelIdentity,plan.models[row.model].modelIdentity);assert.deepEqual(r.prefixes.map(x=>x.at),row.prefixes);assert.equal(r.semantic.length,12);for(const s of r.prefixes){assert(s.saveSha256&&s.nextSha256&&s.bytes>0);if(s.at===12)assert.equal(s.saveSha256,s.nextSha256);}return r;});
const run=(scenario,seed=0,law='Full')=>runs.find(r=>r.scenario===scenario&&r.seed===seed&&r.law===law),at=(r,n)=>r.semantic[n-1];
for(const r of runs){const learned=at(r,2);assert.equal(learned.status,1);assert.equal(learned.qualificationCount,1);assert.notEqual(learned.identity,'0/1');for(const s of r.semantic.slice(2)){assert.equal(s.status,6);assert.equal(s.journalHex,learned.journalHex);assert.equal(s.feedbackJournalHex,learned.journalHex);assert.equal(s.learningHex,learned.learningHex);assert.equal(s.identity,learned.identity);assert.equal(s.appraisal.beliefs.drug.sleep,0);assert.equal(s.appraisal.beliefs.drug.harm,0);assert.equal(s.physical.challenge,0);assert.equal(s.appraisal.before.intoxication,0);assert.equal(s.appraisal.before.stress,0);assert.equal(s.appraisal.before.arousal,500);}}
const seedResults=[];
for(let seed=0;seed<4;seed++){
 const [rest,dep,recover]=['Rested','Deprived','Recovered'].map(s=>run(s,seed));
 for(const r of [dep,recover])for(const [i,s]of r.semantic.entries()){assert.equal(s.journalHex,rest.semantic[i].journalHex);assert.equal(s.learningHex,rest.semantic[i].learningHex);assert.deepEqual(s.appraisal.goals,rest.semantic[i].appraisal.goals);assert.deepEqual(s.appraisal.beliefs,rest.semantic[i].appraisal.beliefs);assert.deepEqual(s.appraisal.habit,rest.semantic[i].appraisal.habit);}
 assert.deepEqual([at(rest,8).appraisal.control,at(dep,8).appraisal.control,at(recover,9).appraisal.control],[950,700,950]);
 assert(at(rest,8).appraisal.inhibited&&!at(dep,8).appraisal.inhibited&&at(recover,9).appraisal.inhibited);
 assert.deepEqual(at(dep,8).appraisal,at(recover,8).appraisal);assert.deepEqual(at(dep,8).choice,at(recover,8).choice);
 assert.equal(at(dep,8).physical.transition.state.sleepDebt,600);assert.equal(at(recover,8).physical.transition.state.sleepDebt,0);
 assert.notDeepEqual(at(rest,8).choice.probabilities,at(dep,8).choice.probabilities);
 for(const n of [8,9,12])for(const r of [rest,dep,recover])assert.equal(at(r,n).physical.executed,at(r,n).choice.chosen);
 seedResults.push({seed,identity:at(rest,2).identity,rested:at(rest,8).choice.chosen,deprived:at(dep,8).choice.chosen,recovered:at(recover,9).choice.chosen,deprivedProbabilities:at(dep,8).choice.probabilities});
}
assert.equal(run('BlindRested').observerSha256,run('BlindDeprived').observerSha256);assert.equal(at(run('BlindDeprived'),8).appraisal.control,null);assert.notEqual(at(run('BlindRested'),8).physical.transition.state.sleepDebt,at(run('BlindDeprived'),8).physical.transition.state.sleepDebt);
assert.equal(run('FailedExecution').observerSha256,run('Recovered').observerSha256);for(const n of [8,9,12])assert.equal(at(run('FailedExecution'),n).physical.executed,null);
const falseSignal=at(run('FalseRested'),8);assert.equal(falseSignal.physical.transition.state.sleepDebt,600);assert.equal(falseSignal.appraisal.before.sleepiness,0);assert.equal(falseSignal.appraisal.control,1000);assert(falseSignal.appraisal.inhibited);
const unmaintained=at(run('Unmaintained'),9);assert.deepEqual(unmaintained.appraisal.goals,{protection:true,work:false,maintained:false});assert.equal(unmaintained.appraisal.control,950);assert(!unmaintained.appraisal.inhibited);
for(const s of ['Rested','Deprived','Recovered']){const r=run(s,0,'NoControl');assert(!at(r,8).appraisal.inhibited);assert.deepEqual(at(r,8).choice,at(run('Rested',0,'NoControl'),8).choice);}
const result={status:'PASS',version:plan.version,models:2,runs:20,nativePrefixes:52,advancing:32,terminal:20,planSha256:sha(planPath),seedResults,receipts:runs.map(r=>({path:p+'SLEEP_CONTROL_RUN_'+r.index+'_REV1.json',sha256:sha(p+'SLEEP_CONTROL_RUN_'+r.index+'_REV1.json')}))};
const out=p+'SLEEP_CONTROL_RESULT_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read(out),result);console.log('PASS sleep/control:2 models/20 runs/52 native prefixes');
