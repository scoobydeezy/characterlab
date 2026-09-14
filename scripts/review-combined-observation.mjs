import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/COMBINED_OBSERVATION_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/combinedObservationOpportunity.ts',tests='src/test/combinedObservationOpportunity.test.ts',panel='src/campaign3/panelBodyOpportunity.ts',panelTests='src/test/panelBodyOpportunity.test.ts';
const faults=[
 ['body-only-reservation',source,tests,"present.length>0||panelSample.kind==='Present'||visualSample.kind==='Present'",'present.length>0','CO-A'],
 ['lose-visual-only-event',source,tests,"panelSample.kind==='Present'||visualSample.kind==='Present'?next():undefined","panelSample.kind==='Present'?next():undefined",'CO-A'],
 ['unavailable-visual-as-support',source,tests,"if(visualSample.kind==='Present')support.push",'if(true)support.push','CO-A'],
 ['derive-actor-from-position',source,tests,"eventRoleEvidence:{kind:'unresolved' as const}","eventRoleEvidence:{kind:'exact' as const,eventRoleId:'event-role/actor'}",'CO-B'],
 ['publish-before-freeze',source,tests,'const reservation=admitObservationLane','tx.commit();const reservation=admitObservationLane','CO-C'],
 ['panel-body-umbrella-tag',panel,panelTests,"transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'","transformationVersion:'semantic-binding/0.1-candidate'",'PB-E'],
 ['body-only-umbrella-tag','src/campaign3/localReserveObservation.ts',panelTests,"transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'","transformationVersion:'semantic-binding/0.1-candidate'",'PB-E']
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'COMBINED SOURCE COMPONENT REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'scripts/review-combined-observation.mjs'].map(fp),limits:['Trusted source/lane/allocator; no public PRJ/completion or persistence proof.','All-three sampling is explicit; public request schedule and actual role channel remain open.']},null,2)+'\n');process.exitCode=0;
