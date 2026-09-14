import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/GRAPH_ZERO_STATE_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/graphZeroState.ts',tests='src/test/graphZeroState.test.ts';
const faults=[
 ['ignore-incoming-edges','||validated.some(row=>row[i].numerator!==0n)','','GZ-A'],
 ['require-both-directions','||validated.some(row=>row[i].numerator!==0n)','&&validated.some(row=>row[i].numerator!==0n)','GZ-A'],
 ['epsilon-removal','v.numerator!==0n','v.numerator*1000n>v.denominator','GZ-B'],
 ['retain-empty-membership','.filter(i=>validated[i].some(v=>v.numerator!==0n)||validated.some(row=>row[i].numerator!==0n))','','GZ-C'],
 ['reweight-surviving-edge','Q.of(validated[i][j].numerator,validated[i][j].denominator)','Q.of(validated[i][j].numerator===0n?0n:1n)','GZ-B'],
];
// The epsilon mutant must affect both row and column tests; use one exact predicate replacement below.
faults[2]=['epsilon-removal','.filter(i=>validated[i].some(v=>v.numerator!==0n)||validated.some(row=>row[i].numerator!==0n))','.filter(i=>validated[i].some(v=>v.numerator*1000n>v.denominator)||validated.some(row=>row[i].numerator*1000n>row[i].denominator))','GZ-B'];
const results=[];
for(const [name,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.zero-state-fault-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[tests],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'zero-state-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+source)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const r=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);const failed=r.testResults.flatMap(t=>t.assertionResults).filter(t=>t.status==='failed');assert(failed.some(t=>t.fullName.includes(witness)),name);results.push({name,removed,inserted,witness,detected:true,failed:failed.map(t=>t.fullName)});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const baseline='docs/planning/GRAPH_ZERO_STATE_TESTS_REV1.json',b=JSON.parse(fs.readFileSync(baseline));assert(b.success&&b.numPassedTests===15);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({status:'ZERO-STATE COMPONENT FAULT CONTROLS PASS',faults:results,sources:[source,'src/campaign3/encodingAccessMath.ts',tests,'docs/formal/GRAPH_ZERO_STATE_COMPONENT.md','scripts/review-graph-zero-state.mjs'].map(fp),baseline:fp(baseline),limits:['Structural normalization only; no cognitive edge loss or resource policy.','No public owner timing or persistence qualification.']},null,2)+'\n');process.exitCode=0;
