import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/PREPARED_POSITIVE_SPATIAL_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/positiveSpatialCandidate.ts',tests='src/test/positiveSpatialCandidate.test.ts',panel='src/campaign3/selectedSpatialEncoding.ts',panelTests='src/test/spatialEvidenceBinding.test.ts';
const faults=[
 ['bypass-earlier-concern',source,tests,'projectPositive(encodePreparedSpatialWithPriorConcern(token,law,carry,subject,enabled))','projectPositive(encodePreparedSpatialEvidence(token,law))','PPC-B'],
 ['retain-zero-child',source,tests,"filter(r=>r.status==='Positive')","filter(r=>r.status==='Positive'||r.status==='KnownZero')",'PPC-B'],
 ['feedback-as-retained-content',source,tests,"candidate:{version:","candidate:{feedback:('feedback' in evaluation?evaluation.feedback:undefined),version:",'PPC-B'],
 ['retain-prepared-capability',panel,tests,'prepared.delete(token);\n return operands;','\n return operands;','PPC-A']
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'PREPARED POSITIVE SPATIAL REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'scripts/review-prepared-positive-spatial.mjs'].map(fp),limits:['Selected-only component projection and earlier-concern variant; completed producer and subject remain upstream premises.','No public formation or canonical persistence qualification.']},null,2)+'\n');process.exitCode=0;
