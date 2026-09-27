import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),planFile=p+'IDENTITY_ELIGIBILITY_PLAN_REV1.json',plan=read(planFile);
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(plan.models.length,6);assert.equal(new Set(plan.models.map(m=>m.modelIdentity)).size,6);assert.equal(plan.runs.length,52);assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,52);assert(plan.experimentIdentity&&plan.comparisonCase);
const files=plan.runs.map(r=>p+'IDENTITY_ELIGIBILITY_RUN_'+r.index+'_REV1.json'),runs=files.map(read);
for(const [i,r]of runs.entries()){
 const original=plan.runs[i];assert.equal(r.status,'PASS');assert.equal(r.index,i);assert.equal(r.runIdentity,original.runIdentity);assert.equal(r.planSha256,sha(planFile));assert.equal(r.prefixes.length,6);assert.equal(r.rows.length,5);
 for(let j=0;j<6;j++){assert.equal(r.prefixes[j].at,j);assert.equal(r.prefixes[j].nextSha256,r.prefixes[Math.min(j+1,5)].sha256);}assert.equal(r.saveSha256,r.prefixes[5].sha256);
}
for(let part=0;part<4;part++){const r=read(p+'IDENTITY_ELIGIBILITY_PART'+part+'_REV1.json');assert.equal(r.status,'PASS');assert.equal(r.planSha256,sha(planFile));assert.deepEqual(r.completed,files.filter((_,i)=>i%4===part));}
const get=(scenario,law='Threshold',seed=6)=>{const r=runs.find(x=>x.scenario===scenario&&x.law===law&&x.seed===seed);assert(r);return r.rows;},zero='0/1',probe=r=>r[4],primary=[];
for(let seed=0;seed<8;seed++){
 const a=get('Meaningful','Threshold',seed),b=get('Trivial','Threshold',seed),c=get('Constrained','Threshold',seed);
 assert.deepEqual(a.slice(0,4).map(r=>r.chosen),b.slice(0,4).map(r=>r.chosen));assert.deepEqual(a.slice(0,4).map(r=>r.chosen),c.slice(0,4).map(r=>r.chosen));
 assert.equal(a[0].resolution,c[0].resolution);assert(a.slice(0,4).every(r=>r.disposition==='Accepted'));assert(b.slice(0,4).every(r=>r.disposition==='Insignificant'));assert(c.slice(0,4).every(r=>r.disposition==='Constrained'));
 assert.equal(probe(b).strength,zero);assert.equal(probe(c).strength,zero);
 primary.push({seed,choices:a.slice(0,4).map(r=>r.chosen),strength:probe(a).strength,meaningfulProbabilities:probe(a).probabilities,trivialProbabilities:probe(b).probabilities,changed:JSON.stringify(probe(a).probabilities)!==JSON.stringify(probe(b).probabilities)});
}
const a=get('Meaningful'),instruction=get('Instructed'),failure=get('FailedExecution'),forced=get('Forced');
assert.deepEqual(instruction.map(r=>r.resolution),a.map(r=>r.resolution));assert.equal(probe(instruction).strength,probe(a).strength);
assert.deepEqual(failure.map(r=>r.expression),a.map(r=>r.expression));assert.deepEqual(failure.map(r=>r.journal),a.map(r=>r.journal));assert(failure.every(r=>r.executed===0));
assert(forced.slice(0,4).every(r=>r.executed===1&&r.expression===null&&r.resolution===null&&r.addresses.length===0&&r.disposition==='NoQualification'));assert.equal(probe(forced).strength,zero);
assert.notEqual(a[1].raw,get('WorkOnly')[1].raw);assert.notEqual(a[0].raw,get('HomeOnly')[0].raw);
for(const s of ['Meaningful','Trivial','Constrained','PartialPressure'])assert.deepEqual(get(s,'Refold'),get(s));
assert.equal(probe(get('Meaningful','NoFeedback')).strength,probe(a).strength);assert.notDeepEqual(probe(get('Meaningful','NoFeedback')).probabilities,probe(a).probabilities);
for(const s of ['Trivial','Constrained'])assert.notEqual(probe(get(s,'Frequency')).strength,zero);
assert.notEqual(probe(get('Constrained','IgnorePressure')).strength,zero);
for(const s of ['PartialSignificance','PartialPressure']){assert.equal(probe(get(s)).strength,zero);assert.notEqual(probe(get(s,'Graded')).strength,zero);}
for(const s of ['Trivial','Constrained'])assert.equal(probe(get(s,'Graded')).strength,zero);
const summary={status:'PASS',scope:plan.scope,models:6,runs:52,componentPrefixes:312,advancing:260,terminal:52,planSha256:sha(planFile),primary,files:files.map(path=>({path,sha256:sha(path)}))};
const target=p+'IDENTITY_ELIGIBILITY_RESULT_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(target,JSON.stringify(summary,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read(target),summary);
console.log('PASS identity eligibility:6 models/52 runs/312 component prefixes; '+primary.filter(r=>r.changed).length+'/8 matched probes differ.');
