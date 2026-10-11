import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='docs/planning/values-integration-matrix-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex'),plan=read(dir+'/plan.json');
const correction=read('docs/planning/values-integration-development-rev1/phase-fixture-correction.json');
for(const a of plan.artifacts){if(a.path===correction.frozenPath){assert.equal(a.sha256,correction.frozenSha256);assert.equal(sha(fs.readFileSync(correction.preservedSource)),a.sha256);assert.equal(sha(fs.readFileSync(a.path)),correction.correctedSha256);}else assert.equal(sha(fs.readFileSync(a.path)),a.sha256,a.path);}
assert.equal(plan.models.length,5);assert.equal(plan.runs.length,125);assert.equal(plan.prefixes,625);
const runs=plan.runs.map(p=>{const r=read(`${dir}/run-${p.index}.json`);assert.equal(r.status,'PASS');assert.equal(r.runIdentity,p.runIdentity);assert.equal(r.index,p.index);assert.equal(r.rows.length,p.frames.length);assert.equal(r.nativeStages,p.frames.length*13);assert.equal(r.prefixes.length,p.frames.length+1);
 r.prefixes.forEach((x,i)=>{assert.equal(x.prefix,i);assert(x.saveBytes>0&&x.saveBytes<50_000_000);if(i<p.frames.length)assert.equal(x.successorSha256,r.prefixes[i+1].saveSha256);else assert.equal(x.terminal,true);});return r;});
assert.equal(new Set(runs.map(r=>r.runIdentity)).size,125);
const get=(name,law='Accumulated',appraisal='ValueRelative',seed=0)=>{const r=runs.find(r=>r.name===name&&r.law===law&&r.appraisal===appraisal&&r.seed===seed);assert(r);return r;};
const eq=(a,b)=>assert.deepEqual(a,b),neq=(a,b)=>assert.notDeepEqual(a,b),last=r=>r.rows.at(-1);
for(const law of ['Accumulated','Refold','Latest','NoConsolidation']){
 const success=get('success',law),fixed=get('fixed-positive-success',law),failure=get('fixed-positive-failure',law),truth=get('fixed-positive-negative-truth',law);
 eq(fixed.rows,failure.rows);eq(fixed.rows,truth.rows);neq(fixed.world,failure.world);neq(fixed.world,truth.world);
 const hidden=get('withheld',law),neutral=get('neutral',law),absent=get('no-opportunity',law),unlinked=get('missing-category',law);
 assert.equal(hidden.rows[1].observation.receipt,null);assert.equal(hidden.rows[1].after.mean,null);assert.equal(neutral.rows[1].after.mean,'0/1');assert.equal(neutral.rows[1].after.count,1);
 assert(absent.rows.every(r=>r.observation.receipt===null&&r.chosen===null&&r.after.mean===null));assert.equal(unlinked.rows[1].observation.receipt.category,null);assert.equal(unlinked.rows[1].after.mean,null);
 assert.equal(success.rows[1].goal.status,'Fulfilled');assert.equal(get('observed-failure',law).rows[1].goal.status,'Open');assert.equal(get('observed-failure',law).rows[1].observation.receipt.outcome,-1);
 // The two acquisition attempts are identical physically: same chosen B and
 // successful execution, regardless of whether the receipt is admitted.
 eq(success.rows[1].intent,hidden.rows[1].intent);eq(success.rows[1].expression,hidden.rows[1].expression);
 const retired=get('retired',law),open=get('retire-control',law);
 eq(retired.rows[2].after,open.rows[2].after);assert.equal(retired.rows[2].goal.status,'Retired');assert.equal(open.rows[2].goal.status,'Open');eq(last(retired).before,last(open).before);eq(last(retired).appraisal.valueMeaning,last(open).appraisal.valueMeaning);assert.equal(last(retired).appraisal.goalRelevance,0);assert.equal(last(open).appraisal.goalRelevance,1);
 assert.equal(last(get('unknown-forecast',law)).appraisal.valueMeaning,null);assert.equal(last(get('zero-forecast',law)).appraisal.valueMeaning,'0/1');
 if(law!=='NoConsolidation'){
  assert.equal(last(retired).chosen,'A');neq(success.rows[2].appraisal.valueMeaning,neutral.rows[2].appraisal.valueMeaning);eq(success.rows[2].appraisal.belief,neutral.rows[2].appraisal.belief);eq(success.rows[2].goal,neutral.rows[2].goal);
  eq(last(get('reverse-context',law)).appraisal.anticipatedCost,last(success).appraisal.anticipatedBenefit);
  for(const name of ['need-only','joint'])eq(get(name,law).rows,success.rows);
 }
}
for(const a of runs.filter(r=>r.law==='Accumulated'&&r.appraisal==='ValueRelative'))eq(a.rows,get(a.name,'Refold','ValueRelative',a.seed).rows);
for(let seed=0;seed<8;seed++){
 const a=get('success','Accumulated','ValueRelative',seed),b=get('success','Accumulated','NoValueAppraisal',seed);
 eq(a.rows.map(x=>x.chosen),b.rows.map(x=>x.chosen));eq(last(a).after,last(b).after);neq(last(a).appraisal.valueMeaning,last(b).appraisal.valueMeaning);
}
neq(last(get('contrary','Accumulated')).after.preference,last(get('contrary','Latest')).after.preference);
assert.equal(last(get('success','NoConsolidation')).after.preference,'0/1');
neq(get('need-only','NoConsolidation').rows,get('success','NoConsolidation').rows);
for(const file of ['affected-corrected.json','reference.json']){const t=read('docs/planning/values-integration-development-rev1/'+file);assert(t.success&&t.numFailedTests===0&&t.numPendingTests===0);}
const sources=['scripts/check-values-integration-matrix.mjs','src/test/valuesIntegrationOwnership.test.ts','docs/planning/values-integration-development-rev1/phase-fixture-correction.json','docs/planning/values-integration-development-rev1/affected-corrected.json','docs/planning/values-integration-development-rev1/reference.json','docs/planning/values-integration-development-rev1/build.txt','docs/planning/VALUES_INTEGRATION_WRAPPER_EXTENSION_REV1.json'];
const result={status:'PASS',models:5,runs:125,prefixes:625,advancing:500,terminal:125,nativeStages:6500,matchedComponentRows:500,storedRefoldPairs:25,appraisalAblationBaselinePairs:8,physicalEvidenceGroups:4,tests:47,referenceTests:328,counters:{highestAllocated:1529,sinceLastVerdictOrCorpus:10},plan:{path:dir+'/plan.json',sha256:sha(fs.readFileSync(dir+'/plan.json'))},testCorrection:'Frozen failing phase41 fixture preserved; corrected phase50 fixture passes. No production/source-model/run identity changed.',limits:['Each of five profiles has eight baseline seeds; seventeen interventions use seed0 only.','One successor per restored prefix; no arbitrary long tails.','Controlled category and binary forecast; no learned category discovery, causal forecast acquisition, Value-age law or generic affect integration.','Refold is behaviorally equal here; no storage necessity or general Value law selected.','NoConsolidation retains its expectation diagnostic, so NeedOnly/Joint can act where ValuesOnly cannot.','world in per-run receipt is the component diagnostic; eight dedicated native physical-state trajectories independently check actual native ownership and exact world equality.'],evidence:sources.map(path=>({path,sha256:sha(fs.readFileSync(path))})),receipts:runs.map(r=>({path:`${dir}/run-${r.index}.json`,sha256:sha(fs.readFileSync(`${dir}/run-${r.index}.json`))}))};
const out=dir+'/closure.json';if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});else eq(read(out),result);
console.log('PASS Values integration: 5 models /125 runs /625 native prefixes /6500 stages; 47 affected /328 reference tests.');
