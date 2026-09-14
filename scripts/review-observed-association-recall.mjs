import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/OBSERVED_ASSOCIATION_RECALL_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source="src/test/observedAssociationRecall.test.ts",tests='src/campaign3/directAssociativeAccess.ts',panel='docs/planning/GA_OBSERVED_ASSOCIATION_RECALL_REV1.md',panelTests='src/campaign3/canonicalEventRecall.ts';
const faults=[
  [
    "disable-actual-learning",
    "src/test/observedAssociationRecall.test.ts",
    "src/test/observedAssociationRecall.test.ts",
    "eta:learning?gain:zero",
    "eta:zero",
    "OAR-B"
  ],
  [
    "cue-from-old-file",
    "src/test/observedAssociationRecall.test.ts",
    "src/test/observedAssociationRecall.test.ts",
    "{kind:'Absent' as const};",
    "{kind:'Present' as const,key:labels!.original('k000')};",
    "OAR-D"
  ],
  [
    "ignore-complete-graph-loss",
    "src/test/observedAssociationRecall.test.ts",
    "src/test/observedAssociationRecall.test.ts",
    "if(loseGraph)graph=",
    "if(false)graph=",
    "OAR-C"
  ],
  [
    "direct-cue-needs-graph-membership",
    "src/campaign3/directAssociativeAccess.ts",
    "src/test/observedAssociationRecall.test.ts",
    "directMatch=episodic.has(key)?cueSeed:zero",
    "directMatch=episodic.has(key)&&i!==undefined?cueSeed:zero",
    "OAR-C"
  ]
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'OBSERVED ASSOCIATION RECALL REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'scripts/review-observed-association-recall.mjs'].map(fp),limits:['Observed-source association/recall composition; public gates remain open.','Canonical retained-view bytes do not qualify unallocated public owner schemas.']},null,2)+'\n');process.exitCode=0;
