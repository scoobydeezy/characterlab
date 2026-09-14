import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/ATTENTION_JOIN_SCHEDULER_REVIEW_REV1.json';assert(!fs.existsSync(output));
const path='src/test/attentionJoinScheduler.test.ts';
const faults=[
 ['omit-completion-guard','options.strict!==false&&(!state.delivery||parent!==state.delivery.id)','false','JXP-D'],
 ['omit-second-parent','additionalCausalParentEventIds:[parent]','additionalCausalParentEventIds:[]','JXP-A'],
 ['omit-payload-equality','||key(event.payload)!==key(state.delivery.payload)','','JXP-F'],
 ['deliver-after-join','options.late?50n:15n','50n','JXP-A'],
];
const baseline=JSON.parse(fs.readFileSync('docs/planning/ATTENTION_JOIN_SCHEDULER_TESTS_REV1.json'));assert(baseline.success&&baseline.numPassedTests===7);
const results=[];
for(const fault of faults){let substitutions=0;const temporary='docs/planning/.attention-join-'+fault[0]+'.json';assert(!fs.existsSync(temporary));
 const run=await startVitest('test',[path],{config:false,watch:false,pool:'forks',maxWorkers:1,fileParallelism:false,reporters:['json'],outputFile:temporary},{plugins:[{name:'join-fixture-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+path)){assert.equal(code.split(fault[1]).length-1,1);substitutions++;return code.replace(fault[1],fault[2]);}}}]});
 try{await run.close();const report=JSON.parse(fs.readFileSync(temporary));assert.equal(substitutions,1);const failed=report.testResults.flatMap(r=>r.assertionResults).filter(r=>r.status==='failed');assert(failed.some(r=>r.fullName.includes(fault[3])));results.push({name:fault[0],removed:fault[1],inserted:fault[2],requiredWitness:fault[3],failedWitnesses:failed.map(r=>r.fullName),detected:true});}finally{if(fs.existsSync(temporary))fs.unlinkSync(temporary);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),prior=JSON.parse(fs.readFileSync('docs/planning/GENERAL_ATTENTION_COMPONENT_QUALIFICATION_REV1.json'));
for(const source of prior.sources)assert.equal(fp(source.path).sha256,source.sha256);
fs.writeFileSync(output,JSON.stringify({status:'JOIN SCHEDULER EXPRESSIBILITY REVIEWED; PUBLIC AJB-A..M NOT PASSED',tests:7,faults:results,sources:[path,'src/substrate/scheduler.ts','docs/planning/ATTENTION_JOIN_SCHEDULER_VECTORS.md','docs/planning/ATTENTION_FEEDBACK_JOIN_BINDING_REV2.md','scripts/review-attention-join-scheduler.mjs'].map(fp),testEvidence:fp('docs/planning/ATTENTION_JOIN_SCHEDULER_TESTS_REV1.json'),preserved:fp('docs/planning/GENERAL_ATTENTION_COMPONENT_QUALIFICATION_REV1.json'),limits:['Fault substitutions operate on the fixture adapter, not a production feedback implementation.','Generic allocated-parent and opaque-dependency behavior is preserved.','No public source/subject/feedback, save decoder, allocation, model or corpus qualification.']},null,2)+'\n');process.exitCode=0;console.log({tests:7,fixtureFaults:4,public:'NOT PASSED'});

