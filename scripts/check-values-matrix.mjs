import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='docs/planning/values-matrix-rev2',read=f=>JSON.parse(fs.readFileSync(f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const plan=read(dir+'/plan.json');for(const x of plan.artifacts)assert.equal(sha(x.path),x.sha256,x.path);
assert.equal(plan.models.length,4);assert.equal(plan.runs.length,256);assert.equal(plan.prefixes,1248);
const records=plan.runs.map(r=>{const x=read(`${dir}/run-${r.index}.json`);assert.equal(x.status,'PASS');assert.equal(x.runIdentity,r.runIdentity);assert.equal(x.law,plan.models[r.model].law);assert.equal(x.name,r.name);assert.equal(x.seed,r.seed);assert.equal(x.prefixes.length,r.originals.length+1);assert.equal(x.final.length,6);assert(x.changedOriginalRejected);assert.equal(x.expired.status,'NoCandidates');assert.equal(x.expired.chosen,null);assert.deepEqual(x.final.map(f=>f.context),plan.contexts);return x;});
const get=(law,name,seed)=>records.find(r=>r.law===law&&r.name===name&&r.seed===seed),final=(law,name,seed,context=0)=>get(law,name,seed).final[context].result;
let divergentChoices=0,equalChoices=0;
for(let seed=0;seed<8;seed++){
 for(const name of ['Positive','Withheld','Unlinked','Neutral','Contradiction','Reversal','TargetB','Duplicate']){
  const a=get('Accumulated',name,seed),b=get('Refold',name,seed);assert.deepEqual(a.final,b.final);
  assert.deepEqual(a.prefixes.map(x=>[x.probe,x.successor]),b.prefixes.map(x=>[x.probe,x.successor]));
 }
 const positive=final('Accumulated','Positive',seed);assert.equal(positive.contribution,'3/4');
 for(const name of ['TargetB','Duplicate'])assert.deepEqual(final('Accumulated',name,seed),positive);
 for(const name of ['Withheld','Unlinked']){const x=final('Accumulated',name,seed);assert.equal(x.view.mean,null);assert.equal(x.contribution,'0/1');}
 const neutral=final('Accumulated','Neutral',seed);assert.equal(neutral.view.mean,'0/1');assert.equal(neutral.view.weight,'3/4');
 assert.equal(final('Accumulated','Contradiction',seed).contribution,'2/5');assert.equal(final('Latest','Contradiction',seed).contribution,'-1/2');assert.equal(final('Accumulated','Reversal',seed).contribution,'-2/9');
 assert.equal(final('NoConsolidation','Positive',seed).contribution,'0/1');assert.equal(final('NoConsolidation','Positive',seed,2).contribution,'3/4');
 for(const context of [2,3])assert.deepEqual(final('Accumulated','Positive',seed,context),positive);
 const need=final('Accumulated','Positive',seed,1),unlinked=final('Accumulated','Positive',seed,5),noGoal=final('Accumulated','Positive',seed,4);
 assert.equal(need.contribution,'0/1');assert.deepEqual(need,unlinked);assert.notDeepEqual(need.probabilities,positive.probabilities);assert.deepEqual(noGoal.view,positive.view);assert.notDeepEqual(noGoal.probabilities,positive.probabilities);
 if(need.chosen===positive.chosen)equalChoices++;else divergentChoices++;
 for(const row of records.filter(r=>r.seed===seed)){const terminal=row.prefixes.at(-1);assert.deepEqual(terminal.probe.probabilities,terminal.successor.probabilities);assert.deepEqual(terminal.probe.view,terminal.successor.view);}
}
assert(divergentChoices>0);
const report={status:'PASS BOUNDED VALUES MATRIX; NO NATIVE QUALIFICATION',models:4,runs:256,prefixes:1248,inputSuccessors:992,committingSuccessors:960,idempotentSuccessors:32,terminalSuccessors:256,finalReceivingContexts:1536,positiveVsNeedOnly:{divergentChoices,equalChoices},findings:['Stored and Refold exact projections/reasons/resolutions agree across all cases.','Accumulation retains positive2/5 after one contradiction; Latest becomes-1/2; sustained contradiction gives-2/9.','Known neutral differs from absent evidence; missing linkage does not acquire.','NeedOnly at demand1 equals ValuesOnly here; Joint equality preserves complete overlap, not independent necessity.','Controlled target change and gap preserve preference; no learned recognition or physical execution claim.'],limits:['One successor per prefix, not every full tail.','Four models use the same admitted outcome/category fixtures and controlled inherited Task carrier.','No private physical world simulated; hidden-truth invariance is a boundary property tested by forbidden-field admission, not a physical intervention.','No goal lifecycle, appraisal consumer, age integration or native public admission.'],artifacts:[dir+'/plan.json',...records.map(x=>`${dir}/run-${x.index}.json`),'scripts/check-values-matrix.mjs'].map(path=>({path,sha256:sha(path)}))};
const out=dir+'/check.json';if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read(out),report);
console.log(JSON.stringify({...report,artifacts:report.artifacts.length}));
