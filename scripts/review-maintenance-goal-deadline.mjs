import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/MAINTENANCE_GOAL_DEADLINE_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/bodilyMaintenanceGoal.ts',tests='src/test/maintenanceGoalDeadline.test.ts',panel='docs/formal/MAINTENANCE_GOAL_DEADLINE_COMPONENT.md',panelTests='src/test/concernSignificanceSourceComposition.test.ts';
const faults=[
  [
    "expire-withdrawn",
    "src/campaign3/bodilyMaintenanceGoal.ts",
    "src/test/maintenanceGoalDeadline.test.ts",
    "if(g.status==='Withdrawn')return Object.freeze({kind:'AlreadyWithdrawn' as const,state:Object.freeze(prior)});",
    "if(false)return Object.freeze({kind:'AlreadyWithdrawn' as const,state:Object.freeze(prior)});",
    "GD-B"
  ],
  [
    "deadline-time-not-bound",
    "src/campaign3/bodilyMaintenanceGoal.ts",
    "src/test/maintenanceGoalDeadline.test.ts",
    "if(typeof now!=='bigint'||now!==g.expiresAt)throw Error('GOAL_DEADLINE_TIME');",
    "if(typeof now!=='bigint')throw Error('GOAL_DEADLINE_TIME');",
    "GD-C"
  ],
  [
    "withdrawal-history-rewritten",
    "src/campaign3/bodilyMaintenanceGoal.ts",
    "src/test/maintenanceGoalDeadline.test.ts",
    "kind:'AlreadyWithdrawn' as const,state:Object.freeze(prior)",
    "kind:'AlreadyWithdrawn' as const,state:Object.freeze(prior.map(x=>({...x,changedAt:now})))",
    "GD-B"
  ]
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'MAINTENANCE GOAL DEADLINE REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'scripts/review-maintenance-goal-deadline.mjs'].map(fp),limits:['Actual lifecycle owner guard and source composition; not registered deadline authentication.','Scheduling association, once-only ingress, PRJ and public persistence remain open.']},null,2)+'\n');process.exitCode=0;
