import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/LOCAL_RESERVE_SOURCE_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/localReserveSource.ts',tests='src/test/localReserveSource.test.ts';
const faults=[
 ['mutate-prior-source','const reserves=new Map(f.reserves)','const reserves=f.reserves','LR-A'],
 ['read-first-reserve','f.reserves.get(c.physical)!','[...f.reserves.values()][0]','LR-B'],
 ['ignore-permission','!c.available||!c.permitted','!c.available','LR-D'],
 ['leak-physical-key','channel:c.channel,lower:','channel:c.channel,physical:c.physical,lower:','LR-C'],
 ['skip-zero-reanchor','const before=materializeReserve','if(delivery.numerator===0n)return source;const before=materializeReserve','LR-G'],
 ['mutable-output-rational','return Object.freeze(Q.of(q.numerator,q.denominator));','return Q.of(q.numerator,q.denominator);','LR-E']
];
const results=[];
for(const [name,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.local-reserve-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[tests],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'local-reserve-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+source)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const r=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);const failed=r.testResults.flatMap(t=>t.assertionResults).filter(t=>t.status==='failed');assert(failed.some(t=>t.fullName.includes(witness)),name);results.push({name,removed,inserted,witness,detected:true,failed:failed.map(t=>t.fullName)});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const baseline='docs/planning/LOCAL_RESERVE_SOURCE_TESTS_REV2.json',b=JSON.parse(fs.readFileSync(baseline));assert(b.success&&b.numPassedTests===8);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({status:'LR-A..H QUALIFIED AT COMPONENT SCOPE',faults:results,sources:[source,tests,'src/campaign3/embodiedMath.ts','docs/formal/LOCAL_RESERVE_SOURCE_COMPONENT.md','scripts/review-local-reserve-source.mjs'].map(fp),baseline:fp(baseline),limits:['Synthetic component physiology only.','No permanent physical/signal identity namespaces, canonical root or live-source authentication.','No pressure aggregation, Need, motive or public retention qualification.']},null,2)+'\n');process.exitCode=0;
