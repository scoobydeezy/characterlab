import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/CANONICAL_CHILD_KEY_REVIEW_REV1.json';assert(!fs.existsSync(output));const file='src/campaign3/canonicalChildKeys.ts',tests='src/test/canonicalChildKeys.test.ts';
const faults=[
 ['reverse-canonical-order','const ordered=[...originals.keys()].sort()','const ordered=[...originals.keys()].sort().reverse()','CK-B'],
 ['leak-survivor-label','key:keys.original(u.key)','key:u.key','CK-A'],
 ['leak-loss-label','unit:keys.original(l.unit)','unit:l.unit','CK-B'],
 ['share-decoded-key','return cloneCanonicalValue(value!);','return value!;','CK-F'],
 ['remove-key-work-bound','if(bytes.length>4096)fail();','','CK-E']
];const results=[];
for(const [name,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.canonical-child-${name}.json`;assert(!fs.existsSync(temp));const v=await startVitest('test',[tests],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'canonical-child-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'CANONICAL CHILD ADAPTER REVIEW PASS',faults:results,sources:[file,tests,'src/campaign3/significanceFirstRetention.ts','scripts/review-canonical-child-keys.mjs'].map(fp),limits:['Input key roles/subject and actual producing owner remain upstream obligations.','Temporary labels never leave the wrapper; no public canonical namespace is allocated here.']},null,2)+'\n');process.exitCode=0;
