import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/TENTH_SOURCE_INTEGRATION_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/test/concernSignificanceSourceComposition.test.ts',tests=source,panel='src/campaign3/observedMarkerTracking.ts',panelTests='src/test/tenSweepMarker.test.ts';
const faults=[
 ['hide-competitor-absence',source,tests,'visible:hiddenPositionAt!==73n','visible:true','SC-S'],
 ['literal-competing-payload',source,tests,"encodeView([Number(unit.spatialWitness.position.x),Number(unit.spatialWitness.position.y)],experience,'Motion')","time===73n?new Uint8Array([8]):encodeView([Number(unit.spatialWitness.position.x),Number(unit.spatialWitness.position.y)],experience,'Motion')",'SC-T'],
 ['keep-nine-bound',panel,panelTests,'return create(observer,10,3);','return create(observer,9,3);','N10-A'],
 ['unbounded-tenth-detections',panel,panelTests,'return create(observer,10,3);','return create(observer,10,8);','N10-B']
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'TENTH SOURCE INTEGRATION REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'scripts/review-tenth-source-integration.mjs'].map(fp),limits:['Actual tenth observation and positive encoding; world/channel declarations and source-audit identity remain component premises.','Later qualified use remains a supplied comparator premise, not public downstream-use authentication.']},null,2)+'\n');process.exitCode=0;
