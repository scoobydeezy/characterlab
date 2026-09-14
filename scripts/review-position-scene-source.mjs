import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/POSITION_SCENE_SOURCE_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source="src/campaign3/positionSceneSource.ts",tests="src/test/positionSceneSource.test.ts",panel=source,panelTests=tests;
const faults=[
  [
    "ignore-visibility",
    "src/campaign3/positionSceneSource.ts",
    "src/test/positionSceneSource.test.ts",
    "i.visible&&i.permitted",
    "i.permitted",
    "PSS-C"
  ],
  [
    "reveal-unresolved-role",
    "src/campaign3/positionSceneSource.ts",
    "src/test/positionSceneSource.test.ts",
    "item.roleMode==='Preserve'",
    "true",
    "PSS-C"
  ],
  [
    "truth-marker-leak",
    "src/campaign3/positionSceneSource.ts",
    "src/test/positionSceneSource.test.ts",
    "return {position:{x:item.x",
    "return {marker:item.marker,position:{x:item.x",
    "PSS-A"
  ],
  [
    "authored-order-as-observed",
    "src/campaign3/positionSceneSource.ts",
    "src/test/positionSceneSource.test.ts",
    "items.sort((a,b)=>order(a)<order(b)?-1:order(a)>order(b)?1:0);",
    "",
    "PSS-B"
  ],
  [
    "world-binding-id-collision",
    "src/campaign3/positionSceneSource.ts",
    "src/test/positionSceneSource.test.ts",
    "||used.has(n)",
    "",
    "PSS-E"
  ]
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'POSITION SCENE SOURCE REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'scripts/review-position-scene-source.mjs'].map(fp),limits:['Actual SEM world materialization and safe multi-item projection; scene-object content qualification remains a compiled-model premise.','Observation/detection, public producer registration and persistence remain unqualified.']},null,2)+'\n');process.exitCode=0;
