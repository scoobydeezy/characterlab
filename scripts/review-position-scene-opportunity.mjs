import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/POSITION_SCENE_OPPORTUNITY_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source="src/campaign3/positionSceneOpportunity.ts",tests="src/test/positionSceneOpportunity.test.ts",panel=source,panelTests=tests;
const faults=[
  [
    "batch-binding-slot-reuse",
    "src/campaign3/positionSceneOpportunity.ts",
    "src/test/positionSceneOpportunity.test.ts",
    "perceivedBindingId:next()",
    "perceivedBindingId:0n",
    "PSO-A"
  ],
  [
    "early-perception-publication",
    "src/campaign3/positionSceneOpportunity.ts",
    "src/test/positionSceneOpportunity.test.ts",
    "const event=tx?.result.transition",
    "tx?.commit();const event=tx?.result.transition",
    "PSO-C"
  ],
  [
    "false-experience-reservation",
    "src/campaign3/positionSceneOpportunity.ts",
    "src/test/positionSceneOpportunity.test.ts",
    "emitsCharacterAccessibleEvidence:detected.length>0",
    "emitsCharacterAccessibleEvidence:true",
    "PSO-B"
  ],
  [
    "fabricated-source-role",
    "src/campaign3/positionSceneOpportunity.ts",
    "src/test/positionSceneOpportunity.test.ts",
    "eventRoleEvidence:detected.find(d=>d.detectionId===t.currentDetectionId.detectionOccurrenceId)!.role",
    "eventRoleEvidence:{kind:'unresolved' as const}",
    "PSO-D"
  ]
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'POSITION SCENE OPPORTUNITY REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'scripts/review-position-scene-opportunity.mjs'].map(fp),limits:['Actual component scene/SEM/selection/encoding, not public staged registration.','Enclosing allocator rollback, PRJ, content membership and complete-prefix state validation remain unqualified.']},null,2)+'\n');process.exitCode=0;
