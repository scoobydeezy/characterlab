import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/GA_VISUAL_RECALL_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/test/concernSignificanceSourceComposition.test.ts',tests=source,panel='src/campaign3/trialPanelPerception.ts',panelTests='src/test/visualCueEvent.test.ts';
const faults=[
 ['component-tag-in-sem',panel,panelTests,"version='semantic-binding/0.1-candidate#SEM-001C'","version='trial-panel-perception/0.1-candidate'",'VCE-D'],
 ['borrow-unsampled-context',panel,panelTests,"if(s.window)fail('UNSAMPLED_ACTIVE_CONTEXT');",'','VCE-B'],
 ['repeat-visual-observation',panel,panelTests,'visual.observation<0n||s.observations.has(visual.observation)||s.visualObservations.has(visual.observation)','visual.observation<0n||s.observations.has(visual.observation)','VCE-C'],
 ['event-capacity-bypass',source,tests,'k:eventRecallSlots','k:8','SC-N'],
 ['manufacture-current-visual-cue',source,tests,'visible:hiddenPositionAt!==71n','visible:true','SC-O']
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'VISUAL RECALL INTEGRATION REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'scripts/review-ga-visual-recall.mjs'].map(fp),limits:['Supplied role/subject, fixture serialization and trusted source/lane/allocator remain component premises.','Source-fixture substitutions expose the coupled recall-capacity and current-sensing boundaries; public registration is not inferred.']},null,2)+'\n');process.exitCode=0;
