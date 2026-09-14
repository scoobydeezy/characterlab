import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/BODY_FORMATION_EVIDENCE_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/bodySelectionOccurrence.ts',tests='src/test/bodySelectionOccurrence.test.ts',panel='src/test/concernSignificanceSourceComposition.test.ts',panelTests='docs/formal/BODY_SELECTION_OCCURRENCE_COMPONENT.md';
const faults=[
  [
    "empty-selector-skips-occurrence",
    "src/campaign3/bodySelectionOccurrence.ts",
    "src/test/bodySelectionOccurrence.test.ts",
    "const selectionId=allocate();",
    "const selectionId=selected.audit.every(r=>r.disposition!=='Selected')?0n:allocate();",
    "BO-A"
  ],
  [
    "missing-sample-is-unavailable",
    "src/campaign3/bodySelectionOccurrence.ts",
    "src/test/bodySelectionOccurrence.test.ts",
    "||input.samples.length!==input.declarations.length",
    "",
    "BO-C"
  ],
  [
    "view-uses-experience-identity",
    "src/campaign3/bodySelectionOccurrence.ts",
    "src/test/bodySelectionOccurrence.test.ts",
    "views.set(view,{selectionId,view:selected.view})",
    "views.set(view,{selectionId:input.opportunityId??0n,view:selected.view})",
    "BO-A"
  ],
  [
    "acquisition-reused-as-body-source",
    "src/test/concernSignificanceSourceComposition.test.ts",
    "src/test/concernSignificanceSourceComposition.test.ts",
    "evidence.sourceSelectionId);return acquisition;",
    "acquisition);return acquisition;",
    "SC-AC"
  ],
  [
    "wrong-panel-support-accepted",
    "src/campaign3/contextualBodySelection.ts",
    "src/test/contextualBodySelection.test.ts",
    "||!e.supportingObservationIds.some(id=>id.observerId===e.observerId&&id.observationId===c.panel.observation)",
    "",
    "CB-B"
  ],
  [
    "context-aliases-supplied-object",
    "src/campaign3/contextualBodySelection.ts",
    "src/test/contextualBodySelection.test.ts",
    "context=structuredClone(c);",
    "context=c;",
    "CB-C"
  ],
  [
    "undeclared-context-fields-carried",
    "src/campaign3/contextualBodySelection.ts",
    "src/test/contextualBodySelection.test.ts",
    "exact(c,['experience','context','panel']);",
    "",
    "CB-E"
  ],
  [
    "accept-unfrozen-experience-producer",
    "src/campaign3/contextualBodySelection.ts",
    "src/test/contextualBodySelection.test.ts",
    "||e.transformationVersion!=='semantic-binding/0.1-candidate#SEM-001H'",
    "",
    "CB-B"
  ],
  [
    "empty-selection-forms-acquisition",
    "src/campaign3/bodyFormationEvidence.ts",
    "src/test/contextualBodySelection.test.ts",
    "if(!selected.groups.length)return {kind:'NoFormation' as const,selectionId:selected.selectionId};",
    "",
    "BF-B"
  ],
  [
    "selection-reused-as-acquisition",
    "src/campaign3/bodyFormationEvidence.ts",
    "src/test/contextualBodySelection.test.ts",
    "const acquisitionId=allocate();",
    "const acquisitionId=selected.selectionId;",
    "BF-A"
  ],
  [
    "one-acquisition-per-view",
    "src/campaign3/bodyFormationEvidence.ts",
    "src/test/contextualBodySelection.test.ts",
    "const acquisitionId=allocate();",
    "const acquisitionId=selected.groups.flatMap(g=>g.samples).map(()=>allocate()).at(-1)!;",
    "BF-A"
  ]
];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'BODY FORMATION EVIDENCE REVIEW PASS',faults:results,sources:[source,tests,panel,panelTests,'src/campaign3/bodyFormationEvidence.ts','docs/formal/BODY_FORMATION_EVIDENCE_COMPONENT.md','src/campaign3/contextualBodySelection.ts','src/test/contextualBodySelection.test.ts','docs/formal/CONTEXTUAL_BODY_SELECTION_COMPONENT.md','scripts/review-body-formation-evidence.mjs'].map(fp),limits:['Actual component audit and selected capability; unallocated body codecs/public gates remain open.','Canonical fixture memory payload and PRJ are still trusted component boundaries.']},null,2)+'\n');process.exitCode=0;
