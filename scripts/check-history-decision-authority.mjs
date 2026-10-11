import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
await import('./check-decision-closure.mjs');
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(f,'utf8')),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),ref=path=>({path,sha256:sha(path)});
const cp=read(p+'DECISION_COMPONENT_PLAN_REV1.json'),cr=read(p+'DECISION_COMPONENT_EXPERIMENT_REV1.json');
assert.equal(cr.planSha256,sha(p+'DECISION_COMPONENT_PLAN_REV1.json'));for(const s of cp.sources)assert.equal(sha(s.path),s.sha256);
assert.equal(cr.rows.length,576);assert.equal(cr.exactReplays,576);assert.equal(cr.publicRuns,0);assert.equal(cr.prefixRestores,0);
assert.equal(new Set(cr.rows.map(r=>JSON.stringify([r.law,r.regime,r.seed,r.permitted]))).size,576);
for(const law of cp.laws)for(const regime of cp.regimes)for(const seed of cp.seeds)for(const permitted of cp.permissions)assert(cr.rows.some(r=>r.law===law&&r.regime===regime&&r.seed===seed&&r.permitted===permitted));
const original=fs.readFileSync('scripts/qualify-decision-components.mjs','utf8'),a=original.indexOf('const get=(law,regime'),b=original.indexOf('fs.writeFileSync(outPath',a);assert(a>0&&b>a);
const divergences=new Function('assert','rows','plan',original.slice(a,b)+';return divergences;')(assert,cr.rows,cp);assert.deepEqual(divergences,cr.decorativeDivergenceSeeds);
const plan=read(p+'DECISION_PUBLIC_EXPERIMENT_PLAN_REV1.json'),result=read(p+'DECISION_PUBLIC_EXPERIMENT_REV1.json');
assert.equal(result.results.reduce((n,r)=>n+r.prefixes,0),360);
for(let i=0;i<174;i++)for(const k of ['law','name','seed','modelIdentity','runIdentity','orderedInputs'])assert.deepEqual(result.results[i][k],plan.runs[i][k]);
const failed=[];
for(const [name,passed,count] of [['DECISION_COMPONENT_TESTS_REV1.json',3,1],['DECISION_PUBLIC_TESTS_REV1.json',8,14]]){
 const v=read(p+name);assert.equal(v.numPassedTests,passed);assert.equal(v.numFailedTests,count);const failures=v.testResults.flatMap(t=>t.assertionResults).filter(a=>a.status==='failed');assert.equal(failures.length,count);
 if(count===14)for(const a of failures)assert(a.failureMessages[0].startsWith('SaveContractError: only an active quiescent run can produce a continuation save'));
 failed.push({source:ref(p+name),passed,failed:count,failures:failures.map(a=>({name:a.fullName,firstLine:a.failureMessages[0].split('\n')[0]}))});
}
const receipt={status:'PASS; HQ011 OPEN',scope:'Original public closure and original component stored-row assertions rechecked.576 component cases and174 public runs remain distinct historical evidence;no fresh runtime,replays,rollback or tests.',componentCases:576,publicRuns:174,publicPrefixes:360,componentDivergenceSeeds:divergences,failed,sources:['scripts/check-decision-closure.mjs','scripts/qualify-decision-components.mjs',p+'DECISION_COMPONENT_PLAN_REV1.json',p+'DECISION_COMPONENT_EXPERIMENT_REV1.json',p+'DECISION_PUBLIC_EXPERIMENT_PLAN_REV1.json',p+'DECISION_PUBLIC_EXPERIMENT_REV1.json',p+'DECISION_VALIDATION_CLOSURE_REV1.json'].map(ref),checker:ref('scripts/check-history-decision-authority.mjs')};
const O=p+'campaign3-history-decision-authority-rev1/';fs.mkdirSync(O,{recursive:true});if(fs.existsSync(O+'canonical-check.json'))assert.deepEqual(read(O+'canonical-check.json'),receipt);else fs.writeFileSync(O+'canonical-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log('PASS: DECISION component/public evidence and failed test boundaries preserved.');
