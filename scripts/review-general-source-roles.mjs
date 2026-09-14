import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/GENERAL_SOURCE_ROLES_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source="src/campaign3/generalSourceRoles.ts",tests="src/test/generalSourceRoles.test.ts",panel='docs/formal/GENERAL_SOURCE_ROLE_BATCH_COMPONENT.md',panelTests='src/test/concernSignificanceSourceComposition.test.ts';
const faults=[
  [
    "reserve-on-unresolved",
    "src/campaign3/generalSourceRoles.ts",
    "src/test/generalSourceRoles.test.ts",
    "const used=new Set<bigint>();",
    "allocate();const used=new Set<bigint>();",
    "GSR-B"
  ],
  [
    "reuse-placeholder",
    "src/campaign3/generalSourceRoles.ts",
    "src/test/generalSourceRoles.test.ts",
    "causalRoleEvidenceId:n",
    "causalRoleEvidenceId:0n",
    "GSR-A"
  ],
  [
    "infer-contiguous-slots",
    "src/campaign3/generalSourceRoles.ts",
    "src/test/generalSourceRoles.test.ts",
    "const n=allocate();",
    "const n=100n+BigInt(used.size);",
    "GSR-A"
  ],
  [
    "duplicate-allocation-accepted",
    "src/campaign3/generalSourceRoles.ts",
    "src/test/generalSourceRoles.test.ts",
    "||used.has(n)",
    "",
    "GSR-D"
  ]
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'GENERAL SOURCE ROLES REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'scripts/review-general-source-roles.mjs'].map(fp),limits:['Actual SEM-G output allocation; public producer matching remains open.','No new role mathematics, identity family or state authority.']},null,2)+'\n');process.exitCode=0;
