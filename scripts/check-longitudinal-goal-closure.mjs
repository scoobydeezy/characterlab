import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const p='docs/planning/',sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),read=n=>JSON.parse(fs.readFileSync(p+n));
const matrix=read('LONGITUDINAL_GOAL_MATRIX_REV1.json'),plan=read('LONGITUDINAL_GOAL_PLAN_REV1.json');
assert.equal(matrix.status,'COMPLETE MATRIX PASS');assert.equal(matrix.models,5);assert.equal(matrix.runs,120);assert.equal(matrix.prefixesVerified,2040);assert.equal(matrix.prefixesRequired,2040);assert.equal(matrix.planSha256,sha(p+'LONGITUDINAL_GOAL_PLAN_REV1.json'));
for(const a of [...plan.artifacts,...matrix.artifacts])assert.equal(sha(a.path),a.sha256,a.path);
const rows=plan.runs.map((identity,i)=>{const r=read('longitudinal-goal-execution-rev1/'+String(i).padStart(3,'0')+'.json');for(const k of Object.keys(identity))assert.deepEqual(r[k],identity[k]);assert.equal(r.planSha256,matrix.planSha256);return r;});
const get=(law,mode,seed,keep=false)=>rows.find(r=>r.law===law&&r.mode===mode&&r.seed===seed&&r.keepEpisodes===keep),choices=r=>r.state.rows.slice(8).map(x=>x.choice.chosen);
let advanced=0,terminal=0;for(const a of matrix.artifacts.filter(a=>/\.prefix\d+\.json$/.test(a.path))){const r=JSON.parse(fs.readFileSync(a.path));assert.equal(r.planSha256,matrix.planSha256);assert.equal(r.advanced,r.prefix<16);if(r.advanced)advanced++;else terminal++;}assert.equal(advanced,1920);assert.equal(terminal,120);
let goalWithdraw=0,goalReplace=0;
for(let seed=0;seed<8;seed++){
 const maintained=get('FineStanding','Maintained',seed),withdrawn=get('FineStanding','Withdrawn',seed),replaced=get('FineStanding','Replaced',seed);
 goalWithdraw+=Number(JSON.stringify(choices(maintained))!==JSON.stringify(choices(withdrawn)));goalReplace+=Number(JSON.stringify(choices(maintained))!==JSON.stringify(choices(replaced)));
 for(const r of rows.filter(r=>r.seed===seed))assert.deepEqual(r.nativeHashes,get('FineStanding','Maintained',seed,r.keepEpisodes).nativeHashes);
 for(const mode of ['Maintained','Withdrawn','Replaced']){
  const c=get('GoalEqualsOpportunity',mode,seed),expected=get('FineStanding',mode==='Maintained'?'Withdrawn':mode,seed);assert.deepEqual(c.state,expected.state);
 }
}
assert.equal(goalWithdraw,8);assert.equal(goalReplace,8);
const count=(law,kind)=>matrix.comparisons.filter(x=>x[law][kind]).length;
assert.equal(matrix.comparisons.length,24);assert.equal(count('fineVsNoFeedback','probabilities'),18);assert.equal(count('fineVsNoFeedback','actions'),14);assert.equal(count('coarseVsNoFeedback','probabilities'),0);assert.equal(count('coarseVsNoFeedback','actions'),0);
assert(matrix.comparisons.every(x=>x.retentionActionsEqual));assert.deepEqual([...new Set(matrix.comparisons.filter(x=>x.standing==='0/1').map(x=>x.seed))].sort(),[4,5]);
for(const [file,n] of [['LONGITUDINAL_GOAL_DEVELOPMENT_TESTS_REV2.json',7],['LONGITUDINAL_GOAL_HORIZON_TESTS_REV1.json',1],['LONGITUDINAL_GOAL_REFERENCE_TESTS_REV1.json',328]]){const t=read(file);assert(t.success);assert.equal(t.numPassedTests,n);assert.equal(t.numFailedTests,0);}
const build=read('LONGITUDINAL_GOAL_CLOSURE_BUILD_REV1.json');assert.equal(build.exitCode,0);assert.equal(build.planSha256,matrix.planSha256);
const preserved=read('longitudinal-goal-development-rev1/PRESERVATION.json');for(const a of preserved.files)assert.equal(sha(a.preserved),a.sha256);
const files=['LONGITUDINAL_GOAL_PLAN_REV1.json','LONGITUDINAL_GOAL_MATRIX_REV1.json','LONGITUDINAL_GOAL_TRAJECTORIES_REV1.json','LONGITUDINAL_GOAL_IMPLEMENTATION_CHECK_REV1.json','LONGITUDINAL_GOAL_DEVELOPMENT_TESTS_REV1.json','LONGITUDINAL_GOAL_DEVELOPMENT_TESTS_REV2.json','LONGITUDINAL_GOAL_HORIZON_TESTS_REV1.json','LONGITUDINAL_GOAL_REFERENCE_TESTS_REV1.json','LONGITUDINAL_GOAL_CLOSURE_BUILD_REV1.json','longitudinal-goal-development-rev1/PRESERVATION.json','CAMPAIGN3_LONGITUDINAL_GOAL_QUALIFICATION.md','LONGITUDINAL_ROUTINE_READINESS.md'];
const closure={status:'PASS',verdict:'VER-C3-LONGITUDINAL-GOAL-001',models:5,runs:120,prefixes:2040,advancing:advanced,terminal,priorFocusedTests:8,priorReferenceTests:328,freshBuild:true,counters:[1508,0],scope:'Bounded acquired biography/current goal/episode-expiry/later-choice composition; native source with component owners, no new native admission.',artifacts:[...files.map(n=>({path:p+n,sha256:sha(p+n)})),{path:'scripts/check-longitudinal-goal-closure.mjs',sha256:sha('scripts/check-longitudinal-goal-closure.mjs')}]};
if(process.argv.includes('--write'))fs.writeFileSync(p+'LONGITUDINAL_GOAL_CLOSURE_REV1.json',JSON.stringify(closure,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read('LONGITUDINAL_GOAL_CLOSURE_REV1.json'),closure);
console.log('PASS bounded longitudinal goals:5 models/120 runs/2040 restored prefixes; prior8+328 tests reverified/fresh build;1508/0.');
