import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/INTEROCEPTIVE_SELECTION_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/interoceptiveSelection.ts',tests='src/test/interoceptiveSelection.test.ts';
const faults=[
 ['retain-all','views.set(view,selected)','views.set(view,rows.map(r=>r.bytes))','IB-A'],
 ['ignore-capacity','selected.length<capacity','true','IB-A'],
 ['select-absent',"!r.present?'Unavailable':","false?'Unavailable':",'IB-D'],
 ['reusable-view','views.delete(view);return values','return values','IB-F'],
 ['ignore-observer-time','if(new Set(rows.map(r=>r.observer)).size>1||new Set(rows.map(r=>r.at)).size>1)', 'if(false)','IB-E'],
 ['duplicate-channels','new Set(rows.map(r=>r.channel)).size!==rows.length','false','IB-E']
];
const results=[];
for(const [name,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.interoceptive-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[tests],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'interoceptive-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+source)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const r=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);const failed=r.testResults.flatMap(t=>t.assertionResults).filter(t=>t.status==='failed');assert(failed.some(t=>t.fullName.includes(witness)),name);results.push({name,removed,inserted,witness,detected:true,failed:failed.map(t=>t.fullName)});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const baseline='docs/planning/INTEROCEPTIVE_SELECTION_TESTS_REV2.json',b=JSON.parse(fs.readFileSync(baseline));assert(b.success&&b.numPassedTests===7);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({status:'IB-A..G QUALIFIED AT COMPONENT SCOPE',faults:results,sources:[source,tests,'docs/formal/INTEROCEPTIVE_SELECTION_COMPONENT.md','scripts/review-interoceptive-selection.mjs'].map(fp),baseline:fp(baseline),limits:['Test channels do not prove actual public sensing or distinct body candidate semantics.','Equal priority is a declared control, not body salience.','No permanent memory carrier, writer, source admission or restore qualified.']},null,2)+'\n');process.exitCode=0;
