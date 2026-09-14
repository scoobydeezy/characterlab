import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/PANEL_BODY_OPPORTUNITY_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/panelBodyOpportunity.ts',tests='src/test/panelBodyOpportunity.test.ts',panel='src/campaign3/trialPanelPerception.ts',panelTests='src/test/panelVisualEventComposition.test.ts';
const faults=[
 ['require-both-present',source,tests,"emitsCharacterAccessibleEvidence:sample.kind==='Present'||present.length>0","emitsCharacterAccessibleEvidence:sample.kind==='Present'&&present.length>0",'PB-A'],
 ['body-absence-as-support',source,tests,'s.schema.typeId===461n','(s.schema.typeId===461n||s.schema.typeId===463n)','PB-A'],
 ['omit-panel-support',source,tests,"if(sample.kind==='Present')support.push({observerId,observationId:observation});",'','PB-A'],
 ['duplicate-experience-reservation',source,tests,'const support=present.map','if(reservation)next();const support=present.map','PB-A'],
 ['publish-before-reservation',source,tests,'const present=batch.samples.filter','tx.commit();const present=batch.samples.filter','PB-C'],
 ['alias-returned-context',panel,panelTests,"return structuredClone({transition,ends,context:transition?.perceptualEventReferentId,stage:sample.kind==='Present'?sample.stage:undefined,visualEventTransition});","return {transition,ends,context:transition?.perceptualEventReferentId,stage:sample.kind==='Present'?sample.stage:undefined,visualEventTransition};",'PVE-F'],
 ['allow-stale-candidate',panel,panelTests,'closed||get(token)!==prior','closed','PVE-G']
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'PANEL/BODY SOURCE COMPONENT REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'scripts/review-panel-body-opportunity.mjs'].map(fp),limits:['Trusted source/lane/allocator; no public PRJ/completion or persistence proof.','The duplicate-reservation fault inserts an extra shared-allocator consumption; the exact branch allocation count detects it.']},null,2)+'\n');process.exitCode=0;
