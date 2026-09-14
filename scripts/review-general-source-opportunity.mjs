import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/GENERAL_SOURCE_OPPORTUNITY_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source="src/campaign3/generalSourceOpportunity.ts",tests="src/test/generalSourceOpportunity.test.ts",panel='docs/formal/GENERAL_SOURCE_OPPORTUNITY_COMPONENT.md',panelTests='src/test/concernSignificanceSourceComposition.test.ts';
const faults=[
  [
    "unrequested-scene",
    "src/campaign3/generalSourceOpportunity.ts",
    "src/test/generalSourceOpportunity.test.ts",
    "const world=planned.visual?",
    "const world=scene?",
    "GSO-F"
  ],
  [
    "unrequested-panel",
    "src/campaign3/generalSourceOpportunity.ts",
    "src/test/generalSourceOpportunity.test.ts",
    "const p=planned.panel?",
    "const p=panel?",
    "GSO-F"
  ],
  [
    "extra-body-experience",
    "src/campaign3/generalSourceOpportunity.ts",
    "src/test/generalSourceOpportunity.test.ts",
    "body:{...batch,opportunityId:reservation?.experienceId??null,staged}",
    "body:{...batch,opportunityId:next(),staged}",
    "GSO-A"
  ],
  [
    "binding-slot-reuse",
    "src/campaign3/generalSourceOpportunity.ts",
    "src/test/generalSourceOpportunity.test.ts",
    "perceivedBindingId:next()",
    "perceivedBindingId:0n",
    "GSO-A"
  ],
  [
    "early-perception-publication",
    "src/campaign3/generalSourceOpportunity.ts",
    "src/test/generalSourceOpportunity.test.ts",
    "const staged=reservation?",
    "tx?.commit();const staged=reservation?",
    "GSO-C"
  ],
  [
    "erase-observed-role",
    "src/campaign3/generalSourceOpportunity.ts",
    "src/test/concernSignificanceSourceComposition.test.ts",
    "eventRoleEvidence:detected.find(i=>i.detectionId===t.currentDetectionId.detectionOccurrenceId)!.role",
    "eventRoleEvidence:{kind:'unresolved' as const}",
    "SC-A"
  ]
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'GENERAL SOURCE OPPORTUNITY REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'scripts/review-general-source-opportunity.mjs'].map(fp),limits:['Actual multimodal source composition; public registration remains open.','No allocator rollback, public PRJ or whole-source qualification is inferred.']},null,2)+'\n');process.exitCode=0;
