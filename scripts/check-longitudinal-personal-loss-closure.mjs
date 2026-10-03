import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const p='docs/planning/',sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),read=f=>JSON.parse(fs.readFileSync(p+f,'utf8'));
const plan=read('LONGITUDINAL_PERSONAL_LOSS_PLAN_REV1.json'),matrix=read('LONGITUDINAL_PERSONAL_LOSS_MATRIX_REV1.json');assert.equal(plan.status,'FROZEN BEFORE QUALIFICATION');assert.equal(matrix.status,'COMPONENT MATRIX PASS');assert.equal(matrix.planSha256,sha(p+'LONGITUDINAL_PERSONAL_LOSS_PLAN_REV1.json'));
for(const a of [...plan.artifacts,...matrix.artifacts])assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(plan.models.length,5);assert.equal(plan.runs.length,480);assert.equal(new Set(plan.runs.map(x=>x.runIdentity)).size,480);assert.equal(matrix.prefixes,6240);assert.equal(matrix.advancing,5760);assert.equal(matrix.terminal,480);assert.equal(matrix.faultChecks,8);assert.equal(matrix.nativeRuns,0);
const rows=plan.runs.map((r,i)=>{const x=read('longitudinal-personal-loss-execution-rev1/'+String(i).padStart(3,'0')+'.json');assert.equal(x.runIdentity,r.runIdentity);assert.equal(x.planSha256,matrix.planSha256);assert.deepEqual(x.state.profile,r.profile);assert.equal(x.state.rows.length,12);return x.state;});
const get=(law,condition,seed)=>rows.find(s=>s.profile.law===law&&s.profile.condition===condition&&s.profile.seed===seed),cognitive=s=>s.rows.map(({physicalContact,contactCompleted,supportCompleted,...r})=>r);
let hiddenPairs=0,falsePairs=0,recoveryPairs=0,executionPairs=0;const contrasts=[];
for(const law of plan.models.map(m=>m.law))for(let seed=0;seed<8;seed++){
 const loss=get(law,'ReportedLoss',seed),no=get(law,'NoLoss',seed),hidden=get(law,'HiddenLoss',seed),falseLoss=get(law,'FalseLoss',seed),corrected=get(law,'Corrected',seed),recovered=get(law,'Recovered',seed),failed=get(law,'FailedSupport',seed);
 assert.deepEqual(cognitive(no),cognitive(hidden));hiddenPairs++;assert.deepEqual(cognitive(loss),cognitive(falseLoss));falsePairs++;assert.deepEqual(cognitive(corrected),cognitive(recovered));recoveryPairs++;assert.deepEqual(cognitive(loss),cognitive(failed));executionPairs++;
 for(const x of [loss,no,hidden,falseLoss,corrected,recovered]){assert(x.rows.slice(0,2).every(r=>r.participated&&r.admitted));assert(x.rows.slice(2).every(r=>r.historyBefore===x.history&&r.historyAfter===x.history));assert(x.goals.every(g=>g.status==='Open'));}
 assert(loss.rows.slice(3).every(r=>!r.contactCompleted));assert(failed.rows.every(r=>!r.supportCompleted));
}
for(let seed=0;seed<8;seed++){
 const a=get('Latest','ReportedLoss',seed),no=get('Latest','NoLoss',seed),f=get('NoAffect','ReportedLoss',seed),strong=get('Latest','StrongContinuity',seed),corrected=get('Latest','Corrected',seed);
 const selected=s=>s.rows.slice(4,8).map(r=>r.choice.chosen),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 assert.deepEqual(a.rows.map(r=>r.appraisal),f.rows.map(r=>r.appraisal));assert.deepEqual(a.rows.map(r=>r.appraisal),strong.rows.map(r=>r.appraisal));
 assert.deepEqual(a.rows[4].appraisal.coordinates,['1/1','1/1']);assert.deepEqual(corrected.rows[8].appraisal.coordinates,['0/1','0/1']);assert.equal(get('Mean','Corrected',seed).rows[8].appraisal.likelihood,'1/3');
 assert.deepEqual(get('Latest','HighControl',seed).rows[4].appraisal.coordinates,['1/1','0/1']);assert.deepEqual(get('HistoricalProduct','HighControl',seed).rows[4].appraisal.coordinates,['1/2']);
 for(const condition of ['OneInteraction','MaskedAcquisition','WithdrawnGoal'])assert.equal(get('Latest',condition,seed).rows[4].appraisal.severity,'0/1');
 contrasts.push({seed,lossVersusNoLossProbability:!same(a.rows[4].choice.probabilities,no.rows[4].choice.probabilities),lossVersusNoLossActions:!same(selected(a),selected(no)),affectAblationActions:!same(selected(a),selected(f)),competingMotiveActions:!same(selected(a),selected(strong)),lossSupportActions:selected(a).filter(x=>x==='support').length,noLossSupportActions:selected(no).filter(x=>x==='support').length});
}
assert(contrasts.every(x=>x.lossVersusNoLossProbability));assert(contrasts.some(x=>x.lossVersusNoLossActions));assert(contrasts.some(x=>x.affectAblationActions));assert(contrasts.some(x=>x.competingMotiveActions));
const files=['LONGITUDINAL_PERSONAL_LOSS_PLAN_REV1.json','LONGITUDINAL_PERSONAL_LOSS_MATRIX_REV1.json','LONGITUDINAL_PERSONAL_LOSS_TESTS_REV1.json','LONGITUDINAL_PERSONAL_LOSS_REFERENCE_TESTS_REV1.json','LONGITUDINAL_PERSONAL_LOSS_BUILD_REV1.json','CAMPAIGN3_LONGITUDINAL_PERSONAL_LOSS_QUALIFICATION.md','AFFECT_REGULATORY_REDUCTION_READINESS.md'];
const result={status:'PASS',verdict:'VER-C3-LONGITUDINAL-LOSS-001',...plan.required,comparisons:{hiddenPairs,falsePairs,recoveryPairs,executionPairs,contrasts},tests:10,referenceTests:328,build:'PASS',counters:[1508,0],scope:'Bounded acquired valued-contact loss with actual later actions and independent execution. Controlled reports/goal adoption, component only; no native admission, clinical grief or affect dimensionality claim.',artifacts:[...files.map(f=>({path:p+f,sha256:sha(p+f)})),{path:'scripts/check-longitudinal-personal-loss-closure.mjs',sha256:sha('scripts/check-longitudinal-personal-loss-closure.mjs')}]};
if(process.argv.includes('--write'))fs.writeFileSync(p+'LONGITUDINAL_PERSONAL_LOSS_CLOSURE_REV1.json',JSON.stringify(result,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read('LONGITUDINAL_PERSONAL_LOSS_CLOSURE_REV1.json'),result);
console.log(JSON.stringify({status:result.status,runs:result.runs,prefixes:result.prefixes,comparisons:result.comparisons}));
