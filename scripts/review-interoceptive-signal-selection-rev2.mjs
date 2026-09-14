import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/INTEROCEPTIVE_SIGNAL_SELECTION_REVIEW_REV2.json';assert(!fs.existsSync(output));
const source='src/campaign3/interoceptiveSignalSelection.ts',tests='src/test/interoceptiveSignalSelection.test.ts';
const faults=[
 ['count-views-as-slots','retained.length<limits.capacity','retained.reduce((n,g)=>n+g.bytes.length,0)<limits.capacity','SG-A'],
 ['opportunity-from-time','opportunityId:input.opportunityId','opportunityId:input.at','SG-D'],
 ['discard-contradictory-views','values.map(v=>v.bytes)','values.slice(0,1).map(v=>v.bytes)','SG-C'],
 ['ignore-byte-bound',"if(values.reduce((n,v)=>n+v.bytes.length,0)>limits.maxBytesPerSignal)throw Error('signal retained byte budget exceeded');",'','SG-E'],
 ['reusable-view','views.delete(view);\n return','\n return','SG-G'],
 ['ignore-repeated-observation','||occurrences.has(o)','','SG-F'],
 ['retain-absent-signal',"!values.length?'Unavailable':","false?'Unavailable':",'SG-H']
];
const results=[];
for(const [name,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.signal-gate-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[tests],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'signal-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+source)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const r=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);const failed=r.testResults.flatMap(t=>t.assertionResults).filter(t=>t.status==='failed');assert(failed.some(t=>t.fullName.includes(witness)),name);results.push({name,removed,inserted,witness,detected:true,failed:failed.map(t=>t.fullName)});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const baseline='docs/planning/LOCAL_RESERVE_OPPORTUNITY_TESTS_REV1.json',b=JSON.parse(fs.readFileSync(baseline));assert(b.success&&b.numPassedTests===41);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({status:'SG-A..H QUALIFIED AT COMPONENT SCOPE',faults:results,sources:[source,tests,'docs/formal/INTEROCEPTIVE_SIGNAL_SELECTION_COMPONENT.md','scripts/review-interoceptive-signal-selection-rev2.mjs'].map(fp),baseline:fp(baseline),limits:['Safe grouping and opportunity identity are supplied component arguments, not public authenticated producer outputs.','Bounds in tests are not permanent public model parameters.','No physiological signal diversity, evidence integration or memory/restore qualification.']},null,2)+'\n');process.exitCode=0;
