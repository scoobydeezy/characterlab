import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/RECENCY_RETENTION_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/recencyRetention.ts',tests='src/test/recencyRetention.test.ts';
const faults=[
 ['oldest-first','a.at>b.at?-1:1','a.at<b.at?-1:1','RR-A'],
 ['reverse-address-tie','compare(a.address,b.address)','compare(b.address,a.address)','RR-B'],
 ['rejuvenate-survivors','acquiredAt:times.get(a.id)!','acquiredAt:now','RR-C'],
 ['zero-capacity-keeps-one','units.slice(capacity[kind])','units.slice(Math.max(1,capacity[kind]))','RR-D'],
 ['input-order-winners','units.sort((a,b)=>a.at!==b.at?(a.at>b.at?-1:1):compare(a.address,b.address));','','RR-A'],
 ['permit-future-acquisition','||a.acquiredAt>now','','RR-F'],
];
const results=[];
for(const [name,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.recency-fault-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[tests],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'recency-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+source)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const r=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);const failed=r.testResults.flatMap(t=>t.assertionResults).filter(t=>t.status==='failed');assert(failed.some(t=>t.fullName.includes(witness)),name);results.push({name,removed,inserted,witness,detected:true,failed:failed.map(t=>t.fullName)});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const baseline='docs/planning/RECENCY_RETENTION_TESTS_REV1.json',b=JSON.parse(fs.readFileSync(baseline));assert(b.success&&b.numPassedTests===16);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({status:'RECENCY BASELINE COMPONENT CHECKED',faults:results,sources:[source,'src/campaign3/retentionFragmentation.ts',tests,'src/test/retentionFragmentation.test.ts','docs/formal/RECENCY_RETENTION_COMPONENT.md','scripts/review-recency-retention.mjs'].map(fp),baseline:fp(baseline),limits:['No public source/admission, acquisition commit semantics, owner or persistence qualification.','No reinforcement/importance law or general memory sufficiency.']},null,2)+'\n');process.exitCode=0;
