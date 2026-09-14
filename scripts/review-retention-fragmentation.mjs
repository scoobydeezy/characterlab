import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/RETENTION_FRAGMENTATION_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/retentionFragmentation.ts',tests='src/test/retentionFragmentation.test.ts';
const faults=[
 ['retain-removed-content','!removed.get(a.id)?.has(u.key)','true','RF-A'],
 ['keep-empty-acquisition','if(units.length)acquisitions.push','if(true)acquisitions.push','RF-B'],
 ['count-views-as-slots','usage[a.kind]+=units.length','usage[a.kind]+=units.reduce((n,u)=>n+u.views.length,0)','RF-C'],
 ['discard-survivor-view','views:u.views.map(b=>b.slice())','views:u.views.slice(0,1).map(b=>b.slice())','RF-A'],
 ['borrow-kind-capacity','usage[k]>capacity[k]','usage.EventContinuant+usage.Interoceptive>capacity.EventContinuant+capacity.Interoceptive','RF-D'],
 ['alias-source-bytes','b=>b.slice()','b=>b','RF-E'],
 ['ignore-duplicate-loss',"if(set.has(loss.unit))fail('duplicate loss');",'','RF-F'],
];
const results=[];
for(const [name,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.retention-fault-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[tests],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'retention-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+source)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);const failed=report.testResults.flatMap(t=>t.assertionResults).filter(t=>t.status==='failed');assert(failed.some(t=>t.fullName.includes(witness)),name);results.push({name,removed,inserted,witness,detected:true,failed:failed.map(t=>t.fullName)});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const baseline='docs/planning/RETENTION_FRAGMENTATION_TESTS_REV1.json',b=JSON.parse(fs.readFileSync(baseline));assert(b.success&&b.numPassedTests===8);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({status:'LOSS MECHANICS CHECKED AT COMPONENT SCOPE',faults:results,sources:[source,tests,'docs/formal/RETENTION_FRAGMENTATION_COMPONENT.md','scripts/review-retention-fragmentation.mjs'].map(fp),baseline:fp(baseline),limits:['Loss plans are supplied; no survival-priority policy is qualified.','No public producer, subject, owner, metadata or persistence qualification.','Component symbols, ordinals and safety bounds are not permanent public allocations or parameters.']},null,2)+'\n');process.exitCode=0;
