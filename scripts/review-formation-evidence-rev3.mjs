import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/FORMATION_EVIDENCE_REVIEW_REV3.json';assert(!fs.existsSync(output));
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
    "wrong-panel-support-accepted",
    "src/campaign3/perceivedTrialContext.ts",
    "src/test/contextualBodySelection.test.ts",
    "||!e.supportingObservationIds.some(id=>id.observerId===e.observerId&&id.observationId===c.panel.observation)",
    "",
    "CB-B"
  ],
  [
    "context-aliases-supplied-object",
    "src/campaign3/perceivedTrialContext.ts",
    "src/test/contextualBodySelection.test.ts",
    "return structuredClone(c);",
    "return c;",
    "CB-C"
  ],
  [
    "undeclared-context-fields-carried",
    "src/campaign3/perceivedTrialContext.ts",
    "src/test/contextualBodySelection.test.ts",
    "exact(c,['experience','context','panel']);",
    "",
    "CB-E"
  ],
  [
    "accept-unfrozen-experience-producer",
    "src/campaign3/perceivedTrialContext.ts",
    "src/test/contextualBodySelection.test.ts",
    "e.transformationVersion!=='semantic-binding/0.1-candidate#SEM-001H'||",
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
,["visual-empty-forms","src/campaign3/visualFormationEvidence.ts","src/test/visualFormationEvidence.test.ts","if(!facts.candidate.units.length)return {kind:'NoFormation' as const,selectionId:facts.selectionId};","","VF-B"],
["visual-selection-becomes-acquisition","src/campaign3/visualFormationEvidence.ts","src/test/visualFormationEvidence.test.ts","const acquisitionId=allocate();","const acquisitionId=facts.selectionId;","VF-A"],
["visual-per-child-identity","src/campaign3/visualFormationEvidence.ts","src/test/visualFormationEvidence.test.ts","const acquisitionId=allocate();","const acquisitionId=facts.candidate.units.map(()=>allocate()).at(-1)!;","VF-A"],
["visual-encoded-cap-replayed","src/campaign3/visualFormationEvidence.ts","src/test/visualFormationEvidence.test.ts","encoded.delete(view);\n if(!facts.candidate","\n if(!facts.candidate","VF-C"],
["visual-context-dropped","src/campaign3/visualFormationEvidence.ts","src/test/visualFormationEvidence.test.ts","context:companion,prepared","context:undefined,prepared","VF-A"],
["visual-zero-positive","src/campaign3/positiveSpatialCandidate.ts","src/test/visualFormationEvidence.test.ts","filter(r=>r.status==='Positive')","filter(r=>r.status!=='UnavailableAllocation')","VF-B"],["skip-prior-concern","src/campaign3/visualFormationEvidence.ts","src/test/visualFormationEvidence.test.ts","encodePreparedPositiveSpatialWithPriorConcern(facts.prepared,law,carry,subject,enabled)","encodePreparedPositiveSpatialWithPriorConcern(facts.prepared,law,carry,subject,false)","VF-F"],
["modulate-focal","src/campaign3/selectedSpatialEncoding.ts","src/test/visualFormationEvidence.test.ts","if(row.witness.spatialClass!=='SpatialPeripheral')return row;","","VF-F"],
["permit-current-concern","src/campaign3/priorConcernFeedback.ts","src/test/visualFormationEvidence.test.ts","carry.sourceAt>=at","carry.sourceAt>at","VF-G"]];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'FORMATION EVIDENCE REVIEW PASS',faults:results,defendedSubstitution:{name:'visual-selected-cap-replayed',result:'Outer map deletion removal does not permit replay because the inner prepared encoding capability is independently consumed; not counted as a detected fault.'},sources:[source,tests,panel,panelTests,'src/campaign3/bodyFormationEvidence.ts','docs/formal/BODY_FORMATION_EVIDENCE_COMPONENT.md','src/campaign3/contextualBodySelection.ts','src/test/contextualBodySelection.test.ts','docs/formal/CONTEXTUAL_BODY_SELECTION_COMPONENT.md','src/campaign3/perceivedTrialContext.ts','src/campaign3/visualFormationEvidence.ts','src/test/visualFormationEvidence.test.ts','src/campaign3/positiveSpatialCandidate.ts','src/campaign3/priorConcernFeedback.ts','src/campaign3/selectedSpatialEncoding.ts','scripts/review-formation-evidence-rev3.mjs'].map(fp),limits:['Actual component audit and selected capability; unallocated body codecs/public gates remain open.','Canonical fixture memory payload and PRJ are still trusted component boundaries.']},null,2)+'\n');process.exitCode=0;
