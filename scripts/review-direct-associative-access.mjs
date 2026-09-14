import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/DIRECT_ASSOCIATIVE_ACCESS_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/directAssociativeAccess.ts',tests='src/test/directAssociativeAccess.test.ts';
const faults=[
 ['double-count-zero-hop','solved.exact[i].subtract(b[i])','solved.exact[i]','DA-A'],
 ['gate-direct-by-graph','episodic.has(key)?cueSeed:zero','episodic.has(key)&&i!==undefined?cueSeed:zero','DA-A'],
 ['rounded-residual','solved.exact[i].subtract(b[i])','solved.quantized[i].subtract(b[i])','DA-E'],
 ['round-components-separately','roundEven(contribution.numerator*scale,contribution.denominator)','roundEven(directMatch.numerator*scale,directMatch.denominator)+roundEven(learnedSpread.numerator*scale,learnedSpread.denominator)','DA-D'],
 ['disable-graph-only-seed','graphKeys.map(k=>currentCue.get(k)??zero)','graphKeys.map(k=>retained.includes(k)?currentCue.get(k)??zero:zero)','DA-C'],
 ['create-rows-for-unmatched-cues','[...retained,...graphKeys]','[...retained,...graphKeys,...cues.keys()]','DA-F'],
];
const results=[];
for(const [name,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.direct-spread-fault-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[tests],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'direct-spread-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+source)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const r=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);const failed=r.testResults.flatMap(t=>t.assertionResults).filter(t=>t.status==='failed');assert(failed.some(t=>t.fullName.includes(witness)),name);results.push({name,removed,inserted,witness,detected:true,failed:failed.map(t=>t.fullName)});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const baseline='docs/planning/DIRECT_ASSOCIATIVE_ACCESS_TESTS_REV1.json',b=JSON.parse(fs.readFileSync(baseline));assert(b.success&&b.numPassedTests===8);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({status:'DIRECT/SPREAD COMPONENT SOURCE CONTROLS PASS',faults:results,sources:[source,'src/campaign3/encodingAccessMath.ts',tests,'docs/formal/DIRECT_ASSOCIATIVE_ACCESS_COMPONENT.md','scripts/review-direct-associative-access.mjs'].map(fp),baseline:fp(baseline),limits:['No public cue authentication or model qualification.','Graph capacity, orphan lifecycle and survival policy remain open.']},null,2)+'\n');process.exitCode=0;
