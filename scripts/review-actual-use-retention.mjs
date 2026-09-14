import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/ACTUAL_USE_RETENTION_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source="src/test/concernSignificanceSourceComposition.test.ts",tests="src/test/concernSignificanceSourceComposition.test.ts",panel='docs/planning/GA_ACTUAL_USE_RETENTION_RESOLUTION_REV1.md',panelTests='src/campaign3/retainedAttributionUse.ts';
const faults=[
  [
    "grant-unconsumed-newer-credit",
    "src/test/concernSignificanceSourceComposition.test.ts",
    "src/test/concernSignificanceSourceComposition.test.ts",
    "qualifiedUseMode==='SuppliedComparator'?applyQualifiedSignificantUse",
    "true?applyQualifiedSignificantUse",
    "SC-Y"
  ],
  [
    "discard-actual-consumer-use",
    "src/test/concernSignificanceSourceComposition.test.ts",
    "src/test/concernSignificanceSourceComposition.test.ts",
    "const used=applyQualifiedSignificantUse(memory,result.consumed,71n);",
    "const used=memory;",
    "SC-Y"
  ],
  [
    "discard-focal-significance",
    "src/test/concernSignificanceSourceComposition.test.ts",
    "src/test/concernSignificanceSourceComposition.test.ts",
    "creditEnabled&&qualified.kind==='Qualifies'",
    "false&&qualified.kind==='Qualifies'",
    "SC-Y"
  ]
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'ACTUAL USE RETENTION REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'scripts/review-actual-use-retention.mjs'].map(fp),limits:['Actual component consumer and retention contrast; public qualification remains open.','The supplied-use and focal-last controls remain explicit, not public proof.']},null,2)+'\n');process.exitCode=0;
