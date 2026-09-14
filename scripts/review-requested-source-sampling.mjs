import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/REQUESTED_SOURCE_SAMPLING_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/requestedSourceSampling.ts',tests='src/test/requestedSourceSampling.test.ts',panel='src/campaign3/combinedObservationOpportunity.ts',panelTests='src/test/combinedObservationOpportunity.test.ts';
const faults=[
 ['sample-unrequested-panel',source,tests,'const panelResult=request.panel?','const panelResult=true?','RSS-A'],
 ['sample-unrequested-visual',source,tests,'const visualResult=request.visual?','const visualResult=true?','RSS-A'],
 ['erase-unavailable-observation',source,tests,'...(panelResult?{panel:panelResult}:{})',"...(panelResult?.sample.kind==='Present'?{panel:panelResult}:{})",'RSS-B'],
 ['cross-modality-duplicate',source,tests,'||used.has(id)','', 'RSS-D'],
 ['omit-body-in-combined',panel,panelTests,'bodyChannels:channels,panel:true,visual:true','bodyChannels:null,panel:true,visual:true','CO-A']
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'REQUESTED SOURCE SAMPLING REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'scripts/review-requested-source-sampling.mjs'].map(fp),limits:['Explicit component requests only; public model and registration remain open.','Enclosing allocator rollback is not qualified by these pure sampling checks.']},null,2)+'\n');process.exitCode=0;
