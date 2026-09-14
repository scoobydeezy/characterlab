import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {startVitest} from 'vitest/node';
const output='docs/planning/CONCERN_SIGNIFICANCE_SOURCE_COMPOSITION_REVIEW_REV1.json';
assert(!fs.existsSync(output));
const source='src/test/concernSignificanceSourceComposition.test.ts';
const faults=[
 ['bypass-body-recall-capacity','71n,bodyRecallSlots)','71n,8)','SC-D'],
 ['credit-all-consumed-children','targets:result.attributedTargets','targets:result.consumed','SC-A'],
 ['reinterpret-after-withdrawal','const qualified=frozenQualification!;','const qualified=qualifyGoalOutcome({state:withdrawn,character,goal:"maintain",signal:"interoceptive-signal/A",now:71n,before:range(20,21),after:range(30,31),domains});','SC-A'],
];
const results=[];
for(const [name,removed,inserted,witness] of faults){
 let substitutions=0;
 const temp=`docs/planning/.concern-source-fault-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[source],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'concern-source-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+source)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const r=JSON.parse(fs.readFileSync(temp)),failed=r.testResults.flatMap(t=>t.assertionResults).filter(t=>t.status==='failed');assert.equal(substitutions,1);assert(failed.some(t=>t.fullName.includes(witness)),name);results.push({name,witness,detected:true});}
 finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({status:'CONTROLLED SOURCE COMPOSITION WIRING FAULTS DETECTED',faults:results,sources:[source,'scripts/review-concern-source-composition.mjs'].map(fp),baseline:fp('docs/planning/CONCERN_SIGNIFICANCE_SOURCE_COMPOSITION_TESTS_REV5.json'),limits:['Faults alter the controlled integration fixture, not public source authentication.','Historical qualification is a local immutable value; committed result delivery and persistence remain open.']},null,2)+'\n');
process.exitCode=0;
