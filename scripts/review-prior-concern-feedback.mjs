import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/PRIOR_CONCERN_FEEDBACK_REVIEW_REV1.json';assert(!fs.existsSync(output));const file='src/campaign3/priorConcernFeedback.ts',tests='src/test/priorConcernFeedback.test.ts';
const faults=[
 ['same-instant-feedback','carry.sourceAt>=at','carry.sourceAt>at','PCF-D'],
 ['foreign-subject-feedback',"if(key(carry.subject)!==key(subject))fail('SUBJECT');",'','PCF-D'],
 ['reverse-residual-modulation','Q.of(1n).subtract(q!)','Q.of(1n).add(q!)','PCF-A'],
 ['zero-is-unavailable',"q===undefined?'Unavailable'","q===undefined||q.numerator===0n?'Unavailable'",'PCF-B'],
 ['ignore-disabled-model','const active=enabled&&q!==undefined','const active=q!==undefined','PCF-C'],
 ['borrow-other-task-response','||key(f(rec(responses[0],387n),1n))!==key(task)','', 'PCF-E'],
 ['leak-appraisal-in-carry','response:cloneCanonicalValue(response)}','response:cloneCanonicalValue(response),appraisal:a}', 'PCF-A']
];const results=[];
for(const [name,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.canonical-recall-${name}.json`;assert(!fs.existsSync(temp));const v=await startVitest('test',[tests],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'canonical-recall-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'PRIOR CONCERN FEEDBACK REVIEW PASS',faults:results,sources:[file,tests,'src/campaign2/cognitiveTransforms.ts','scripts/review-prior-concern-feedback.mjs'].map(fp),limits:['Actual character-side transformations execute, but forecast/status and producer instant are trusted fixture operands.','Public same-run completion, subject projection, scheduled delivery and persistence remain open.']},null,2)+'\n');process.exitCode=0;
