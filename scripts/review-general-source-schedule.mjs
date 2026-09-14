import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/GENERAL_SOURCE_SCHEDULE_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source="src/campaign3/generalSourceSchedule.ts",tests="src/test/generalSourceSchedule.test.ts",panel='docs/formal/GENERAL_SOURCE_SCHEDULE_COMPONENT.md',panelTests='src/test/concernSignificanceSourceComposition.test.ts';
const faults=[
  [
    "one-slot-for-two-selectors",
    "src/campaign3/generalSourceSchedule.ts",
    "src/test/generalSourceSchedule.test.ts",
    "selections+=Number(u.bodySelection)+Number(u.visualSelection)",
    "selections+=Math.max(Number(u.bodySelection),Number(u.visualSelection))",
    "GSS-B"
  ],
  [
    "couple-cue-to-encoding",
    "src/campaign3/generalSourceSchedule.ts",
    "src/test/generalSourceSchedule.test.ts",
    "if((u.bodySelection||u.bodyCue)&&requested===null",
    "if(u.bodyCue&&!u.bodySelection||(u.bodySelection||u.bodyCue)&&requested===null",
    "GSS-A"
  ],
  [
    "current-goal-assessment",
    "src/campaign3/generalSourceSchedule.ts",
    "src/test/generalSourceSchedule.test.ts",
    "||original.lane!=='Consequence'",
    "",
    "GSS-E"
  ],
  [
    "lifecycle-assessment-overlap",
    "src/campaign3/generalSourceSchedule.ts",
    "src/test/generalSourceSchedule.test.ts",
    "||lifecycle.has(original.at)",
    "",
    "GSS-E"
  ]
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'GENERAL SOURCE SCHEDULE REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'scripts/review-general-source-schedule.mjs'].map(fp),limits:['Compiled-data schedule controls; no public admission qualification.','Actual source coverage, work bounds, identities and runtime completion remain separate.']},null,2)+'\n');process.exitCode=0;
