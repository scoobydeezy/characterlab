import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),planFile=p+'IDENTITY_PUBLIC_PLAN_REV1.json',plan=read(planFile);
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(plan.models.length,16);assert.equal(new Set(plan.models.map(m=>m.modelIdentity)).size,16);assert.equal(plan.runs.length,84);assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,84);assert(plan.experimentIdentity&&plan.comparisonCase);
const files=plan.runs.map(r=>p+'IDENTITY_PUBLIC_RUN_'+r.index+'_REV1.json'),runs=files.map(read);
let advancing=0,terminal=0;
for(const [i,r]of runs.entries()){
 const original=plan.runs[i];assert.equal(r.status,'PASS');assert.equal(r.index,i);assert.equal(r.runIdentity,original.runIdentity);assert.equal(r.planSha256,sha(planFile));assert.deepEqual(r.prefixes.map(x=>x.at),original.prefixes);assert.equal(r.semantic.length,original.count);
 for(const x of r.prefixes){assert.match(x.sha256,/^[a-f0-9]{64}$/);assert.match(x.nextSha256,/^[a-f0-9]{64}$/);if(x.at===original.count){terminal++;assert.equal(x.nextSha256,x.sha256);assert.equal(r.saveSha256,x.sha256);}else{advancing++;const next=r.prefixes.find(y=>y.at===x.at+1);if(next)assert.equal(x.nextSha256,next.sha256);}}
 if(r.family==='Task'){assert(r.priorMatch);const prior=read(p+'IDENTITY_ELIGIBILITY_RUN_'+i+'_REV2.json');assert.deepEqual(r.semantic,prior.rows.map(({at,chosen,authorship,probabilities,contribution,strength,executed})=>({at,chosen,authorship,probabilities,contribution,strength,executed})));}
 if(r.law==='NoFeedback')assert(r.priorMatch);
}
assert.equal(advancing,344);assert.equal(terminal,84);assert.equal(plan.prefixes,428);
for(let part=0;part<4;part++){const r=read(p+'IDENTITY_PUBLIC_PART'+part+'_REV1.json');assert.equal(r.status,'PASS');assert.equal(r.planSha256,sha(planFile));assert.deepEqual(r.completed,files.filter((_,i)=>i%4===part));}
const get=(family,scenario,law='Threshold',seed=family==='Task'?6:7,unit=16)=>{const r=runs.find(x=>x.family===family&&x.scenario===scenario&&x.law===law&&x.seed===seed&&x.unit===unit);assert(r,[family,scenario,law,seed,unit].join('/'));return r;},task=(...a)=>get('Task',...a),bio=(...a)=>get('Biological',...a),zero='0/1';
assert.equal(task('Meaningful').observerSha256,task('FailedExecution').observerSha256);assert.notEqual(task('Meaningful').stateSha256,task('FailedExecution').stateSha256);
for(const s of ['Meaningful','Trivial','Constrained','PartialPressure'])assert.deepEqual(task(s,'Refold').semantic,task(s).semantic);
assert.deepEqual(bio('matched','Refold').semantic,bio('matched').semantic);
assert.equal(bio('hidden').observerSha256,bio('hiddenChanged').observerSha256);assert.notEqual(bio('hidden').stateSha256,bio('hiddenChanged').stateSha256);
for(const law of ['Threshold','Frequency']){const rows=bio('noGoal',law).semantic;assert(rows.every(r=>r.qualification.status===5&&r.qualification.contribution===zero&&r.strength===zero));}
for(const [scenario,status]of [['trivial',2],['constrained',3]]){const rows=bio(scenario).semantic;assert(rows.some(r=>r.qualification.status===status));assert(rows.every(r=>r.strength===zero));}
assert(bio('trivial','Frequency').semantic.some(r=>r.strength!==zero));assert(bio('constrained','IgnorePressure').semantic.some(r=>r.strength!==zero));
const biological=[];
for(let seed=0;seed<8;seed++){
 const a=bio('matched','Threshold',seed),b=bio('matched','NoFeedback',seed),changes=a.semantic.flatMap((r,i)=>JSON.stringify(r.choice.probabilities)!==JSON.stringify(b.semantic[i].choice.probabilities)?[i+1]:[]);
 assert.deepEqual(a.semantic.map(r=>r.choice.chosen),b.semantic.map(r=>r.choice.chosen));assert.deepEqual(a.semantic.slice(0,8),b.semantic.slice(0,8));
 biological.push({seed,probabilityChanges:changes,chosenSequenceEqual:true,thresholdStrength:a.semantic.at(-1).strength,noFeedbackStrength:b.semantic.at(-1).strength});
}
assert.deepEqual(biological.filter(r=>r.probabilityChanges.length).map(r=>r.seed),[0,2,7]);for(const r of biological.filter(r=>r.probabilityChanges.length))assert.deepEqual(r.probabilityChanges,[11,12]);
assert.deepEqual(bio('matched','Threshold',7,1).semantic,bio('matched','NoFeedback',7,1).semantic);assert.deepEqual(bio('matched','NoFeedback',7,1).semantic,bio('matched','NoFeedback',7,16).semantic);
const result={status:'PASS',version:plan.version,scope:plan.sourceScope,models:16,runs:84,nativePrefixes:428,advancing,terminal,taskComponentMatches:52,biologicalNoFeedbackMatches:9,biological,coarseStanding:'Unit1 is inert over admitted bounded standing; retained separate model.',planSha256:sha(planFile),files:files.map(path=>({path,sha256:sha(path)}))},out=p+'IDENTITY_PUBLIC_RESULT_REV1.json';
if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read(out),result);
console.log('PASS identity public:16 models/84 runs/428 native prefixes;3/8 biological probability contrasts,8/8 equal sampled sequences.');
