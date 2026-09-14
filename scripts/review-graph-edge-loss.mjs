import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/GRAPH_EDGE_LOSS_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/graphEdgeLoss.ts',tests='src/test/graphEdgeLoss.test.ts';
const faults=[
 ['ignore-node-bound','result.keys.length>capacity.nodes||','','EL-A'],
 ['ignore-edge-bound','||edges>capacity.edges','','EL-C'],
 ['delete-reverse-too','matrix[i][j]=Q.of(0n);','matrix[i][j]=Q.of(0n);matrix[j][i]=Q.of(0n);','EL-B'],
 ['leave-selected-edge','matrix[i][j]=Q.of(0n);','','EL-B'],
 ['allow-duplicate','if(seen.has(address))throw new Error(\'GRAPH_LOSS_DUPLICATE\');','','EL-E'],
 ['count-weight-as-cost','row.filter(v=>v.numerator!==0n).length','row.filter(v=>v.compare(Q.of(1n,2n))>=0).length','EL-G'],
];
const results=[];
for(const [name,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.edge-loss-fault-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[tests],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'edge-loss-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+source)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const r=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);const failed=r.testResults.flatMap(t=>t.assertionResults).filter(t=>t.status==='failed');assert(failed.some(t=>t.fullName.includes(witness)),name);results.push({name,witness,detected:true,failed:failed.map(t=>t.fullName)});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const baseline='docs/planning/GRAPH_EDGE_LOSS_TESTS_REV1.json',b=JSON.parse(fs.readFileSync(baseline));assert(b.success&&b.numPassedTests===17);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({status:'EXPLICIT EDGE LOSS COMPONENT FAULT CONTROLS PASS',faults:results,sources:[source,'src/campaign3/graphZeroState.ts','src/campaign3/encodingAccessMath.ts',tests,'docs/formal/GRAPH_EDGE_LOSS_COMPONENT.md','scripts/review-graph-edge-loss.mjs'].map(fp),baseline:fp(baseline),limits:['Explicit plan validation only; no victim selection.','No public scheduler, owner or persistence qualification.']},null,2)+'\n');process.exitCode=0;
