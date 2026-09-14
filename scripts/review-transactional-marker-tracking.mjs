import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/TRANSACTIONAL_MARKER_TRACKING_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/transactionalMarkerTracking.ts',tests='src/test/transactionalMarkerTracking.test.ts';
const faults=[
 ['publish-during-begin','replay(f.observer,f.history)','{tracker:f.tracker,history:[...f.history]}','MTX-D'],
 ['last-window-only','for(const sweep of prefix)','for(const sweep of prefix.slice(-1))','MTX-A'],
 ['wrong-manager-commit','!p||p.manager!==manager||f.pending!==proposal','!p','MTX-F'],
 ['omit-committed-tracker','f.history=p.history;f.tracker=p.tracker;','f.history=p.history;','MTX-A'],
 ['allow-second-pending',"if(f.pending)fail('proposal already pending');",'','MTX-F'],
 ['retain-caller-prefix','history.push(structuredClone(sweep))','history.push(sweep)','MTX-G'],
 ['retain-caller-input','candidate.history.push(structuredClone(input))','candidate.history.push(input)','MTX-G'],
];
const results=[];
for(const fault of faults){let substitutions=0;const temporary='docs/planning/.marker-transaction-'+fault[0]+'.json';assert(!fs.existsSync(temporary));
 const run=await startVitest('test',[tests],{config:false,watch:false,pool:'forks',maxWorkers:1,fileParallelism:false,reporters:['json'],outputFile:temporary},{plugins:[{name:'marker-transaction-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+source)){assert.equal(code.split(fault[1]).length-1,1);substitutions++;return code.replace(fault[1],fault[2]);}}}]});
 try{await run.close();const report=JSON.parse(fs.readFileSync(temporary));assert.equal(substitutions,1);const failed=report.testResults.flatMap(r=>r.assertionResults).filter(r=>r.status==='failed');assert(failed.some(r=>r.fullName.includes(fault[3])),'missing witness '+fault[0]);results.push({name:fault[0],removed:fault[1],inserted:fault[2],requiredWitness:fault[3],failedWitnesses:failed.map(r=>r.fullName),detected:true});}finally{if(fs.existsSync(temporary))fs.unlinkSync(temporary);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),baseline='docs/planning/TRANSACTIONAL_MARKER_TRACKING_TESTS_REV2.json',report=JSON.parse(fs.readFileSync(baseline));assert(report.success&&report.numPassedTests===17);
const prior='docs/planning/GENERAL_ATTENTION_COMPONENT_QUALIFICATION_REV1.json';for(const f of JSON.parse(fs.readFileSync(prior)).sources)assert.equal(fp(f.path).sha256,f.sha256);
fs.writeFileSync(output,JSON.stringify({status:'MTX-A..H QUALIFIED AT COMPONENT SCOPE',tests:8,retainedTests:9,faults:results,sources:[source,tests,'src/campaign3/observedMarkerTracking.ts','docs/formal/TRANSACTIONAL_MARKER_TRACKING_COMPONENT.md','scripts/review-transactional-marker-tracking.mjs'].map(fp),testEvidence:fp(baseline),preserved:fp(prior),limits:['Replay inputs remain component inputs, not authenticated originals or public save bytes.','Public adapter must bind actual canonical perception reads, commit/abort to scheduler outcome and verify complete original-prefix save equality.','No new persistent root, canonical allocation or public restoration qualification.']},null,2)+'\n');process.exitCode=0;console.log({tests:8,retainedTests:9,faults:7,publicRestore:'NOT QUALIFIED'});
