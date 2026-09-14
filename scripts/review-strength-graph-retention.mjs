import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/STRENGTH_GRAPH_RETENTION_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/strengthGraphRetention.ts',tests='src/test/strengthGraphRetention.test.ts';
const faults=[
 ['strongest-first','a.weight.compare(b.weight)','b.weight.compare(a.weight)','SR-A'],
 ['reverse-tie','compare(a.address,b.address)','compare(b.address,a.address)','SR-C'],
 ['ignore-node-pressure','nodes<=capacity.nodes&&','','SR-B'],
 ['ignore-edge-pressure','&&edges<=capacity.edges','','SR-A'],
 ['address-only','a.weight.compare(b.weight)||','','SR-E'],
];const results=[];
for(const [name,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.strength-fault-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[tests],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'strength-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+source)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const r=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);const failed=r.testResults.flatMap(t=>t.assertionResults).filter(t=>t.status==='failed');assert(failed.some(t=>t.fullName.includes(witness)),name);results.push({name,witness,detected:true,failed:failed.map(t=>t.fullName)});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const baseline='docs/planning/STRENGTH_GRAPH_RETENTION_TESTS_REV1.json',b=JSON.parse(fs.readFileSync(baseline));assert(b.success&&b.numPassedTests===14);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({status:'STRENGTH GRAPH COMPONENT FAULT CONTROLS PASS',faults:results,sources:[source,'src/campaign3/graphEdgeLoss.ts',tests,'docs/formal/STRENGTH_GRAPH_RETENTION_COMPONENT.md','scripts/review-strength-graph-retention.mjs'].map(fp),baseline:fp(baseline),limits:['Supplied resolved graph only.','Selective weakening producer, public owner and persistence not qualified.']},null,2)+'\n');process.exitCode=0;
