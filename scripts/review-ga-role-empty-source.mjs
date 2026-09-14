import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/GA_ROLE_EMPTY_SOURCE_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/test/concernSignificanceSourceComposition.test.ts',tests=source,panel='src/campaign3/attentionSelection.ts',panelTests='src/test/emptyVisualSelection.test.ts';
const faults=[
 ['ignore-role-channel-absence',source,tests,"time===hiddenRoleAt?'unresolved':'preserve'","'preserve'",'SC-P'],
 ['skip-no-detection-source',source,tests,'settleEmpty();return;','return;','SC-M'],
 ['skip-no-eligible-source',source,tests,'if(!encoded.candidate.units.length)settleEmpty();','', 'SC-P'],
 ['retain-world-referent',source,tests,"encodeView([Number(unit.spatialWitness.position.x),Number(unit.spatialWitness.position.y)],experience,'Motion')","encodeView([Number(unit.spatialWitness.position.x),Number(unit.spatialWitness.position.y)],{...experience,fixtureWorldMarker:worldMarkerKey},'Motion')",'SC-Q'],
 ['positive-as-no-detection',panel,panelTests,'Reflect.ownKeys(input.detections).length!==1||input.detections.length!==0','false','EVS-B']
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'ROLE PROJECTION AND EMPTY SOURCE REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'scripts/review-ga-role-empty-source.mjs'].map(fp),limits:['Actual SEM-B role materialization/projection, with fixture-authored world and channel declarations.','Governed public source, selection audit identity and PRJ/owner joins remain unqualified.']},null,2)+'\n');process.exitCode=0;
