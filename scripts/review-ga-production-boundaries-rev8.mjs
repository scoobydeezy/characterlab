import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/GA_PRODUCTION_BOUNDARIES_REVIEW_REV8.json';assert(!fs.existsSync(output));
const source='src/campaign3/bodySelectionOccurrence.ts',tests='src/test/bodySelectionOccurrence.test.ts',panel='src/test/concernSignificanceSourceComposition.test.ts',panelTests='docs/formal/BODY_SELECTION_OCCURRENCE_COMPONENT.md';
const faults=[["presentation-seeds-body","src/campaign3/eventPresentationSettlement.ts","src/test/eventPresentationSettlement.test.ts","for(const a of input.formed)if(a.kind==='EventContinuant')histories.set(a.id,[input.now]);","for(const a of input.formed)histories.set(a.id,[input.now]);","EPS-A"],["presentation-forgotten-history-retained","src/campaign3/eventPresentationSettlement.ts","src/test/eventPresentationSettlement.test.ts",".filter(([id])=>survivors.has(id))","","EPS-C"],["presentation-duplicate-occurrence","src/campaign3/eventPresentationSettlement.ts","src/test/eventPresentationSettlement.test.ts","seen.has(p.recollection)||","","EPS-B"],["presentation-overflow-truncated","src/campaign3/eventPresentationSettlement.ts","src/test/eventPresentationSettlement.test.ts","if(history.length===32)fail();","","EPS-F"],["presentation-rewrites-original-seed","src/campaign3/eventPresentationSettlement.ts","src/test/eventPresentationSettlement.test.ts","||row.instants[0]!==a.acquiredAt","","EPS-E"],["association-fixed-elapsed","src/campaign3/eventAssociationSettlement.ts","src/test/eventAssociationSettlement.test.ts","weights=associationCandidate(keys,expanded,keys.map(k=>activation.get(k)??Q.of(0n)),{...p,elapsed:Q.of(now-prior.lastUpdatedAt)}).values","weights=associationCandidate(keys,expanded,keys.map(k=>activation.get(k)??Q.of(0n)),{...p,elapsed:Q.of(1n)}).values","EAS-A"],["retention-rejuvenates-graph-clock","src/campaign3/eventAssociationSettlement.ts","src/test/eventAssociationSettlement.test.ts","lastUpdatedAt=prior.lastUpdatedAt;","lastUpdatedAt=now;","EAS-B"],["formation-fails-to-advance-graph-clock","src/campaign3/eventAssociationSettlement.ts","src/test/eventAssociationSettlement.test.ts",").values;lastUpdatedAt=now;",").values;","EAS-C"],["admit-empty-prior-node","src/campaign3/eventAssociationSettlement.ts","src/test/eventAssociationSettlement.test.ts","normalized.keys.length!==prior.keys.length||","","EAS-E"],["carrier-overflow-hidden-by-retention","src/campaign3/eventAssociationSettlement.ts","src/test/eventAssociationSettlement.test.ts","if(keys.length>30)fail();","","EAS-G"],['owner-protocol-ignores-actual-loss','src/campaign3/significantFormationSettlement.ts','src/test/concernSignificanceSourceComposition.test.ts','const survivors=memory.map(a=>a.id)','const survivors=combined.map(a=>a.id)','SC-AC'],["policy-cues-gated-by-selection","src/campaign3/observationExecutionPolicy.ts","src/test/observationExecutionPolicy.test.ts","bodyRecall:use.bodyCue","bodyRecall:use.bodyCue&&use.bodySelection","OEP-B"],["policy-reuses-baseline-slot","src/campaign3/observationExecutionPolicy.ts","src/test/observationExecutionPolicy.test.ts","resolveKind(copyId(id))","resolveKind(copyId(slot==='goalBaselineRecall'?copies.bodyRecall!:id))","OEP-C"],["policy-ignores-kind","src/campaign3/observationExecutionPolicy.ts","src/test/observationExecutionPolicy.test.ts","resolveKind(copyId(id))!==kinds[slot]","false","OEP-E"],["policy-resolver-mutates-bound-id","src/campaign3/observationExecutionPolicy.ts","src/test/observationExecutionPolicy.test.ts","resolveKind(copyId(id))","resolveKind(id)","OEP-F"],["age-control-uses-significance","src/campaign3/significantFormationSettlement.ts","src/test/ordinaryMemoryBatch.test.ts","prepare(input,ageOnly)","prepare(input,retainSignificanceFirst)","OMB-G"],["use-control-uses-significance","src/campaign3/significantFormationSettlement.ts","src/test/ordinaryMemoryBatch.test.ts","prepare(input,useOnly)","prepare(input,retainSignificanceFirst)","OMB-G"],["shared-control-uses-significance","src/campaign3/significantFormationSettlement.ts","src/test/ordinaryMemoryBatch.test.ts","prepare(input,retainSharedProtectionTier)","prepare(input,retainSignificanceFirst)","OMB-G"],["control-erases-ignored-significance","src/campaign3/significantFormationSettlement.ts","src/test/ordinaryMemoryBatch.test.ts","outcomeSignificanceDirections:[...original.outcomeSignificanceDirections]","outcomeSignificanceDirections:[]","OMB-H"],
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
    "return structuredClone(c) as PresentContext;",
    "return c as PresentContext;",
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
["permit-current-concern","src/campaign3/priorConcernFeedback.ts","src/test/visualFormationEvidence.test.ts","carry.sourceAt>=at","carry.sourceAt>at","VF-G"],["context-file-ignored","src/campaign3/retainedContextGrouping.ts","src/test/retainedContextGrouping.test.ts","rows.filter(r=>key(r.context)===contextKey)","rows","RCG-B"],
["position-order-by-identity","src/campaign3/retainedContextGrouping.ts","src/test/retainedContextGrouping.test.ts","a.panel.sample.at<b.panel.sample.at?-1:a.panel.sample.at>b.panel.sample.at?1:0","a.experience<b.experience?-1:a.experience>b.experience?1:0","RCG-A"],
["duplicate-context-admitted","src/campaign3/retainedContextGrouping.ts","src/test/retainedContextGrouping.test.ts","if(seen.has(r.experience))throw Error('TRIAL_DUPLICATE_EXPERIENCE');","","RCG-C"],
["same-instant-after-admitted","src/campaign3/retainedContextGrouping.ts","src/test/retainedContextGrouping.test.ts","motion[1].panel.sample.at>=after[0].panel.sample.at","motion[1].panel.sample.at>after[0].panel.sample.at","RCG-C"],
["wrong-position-identity","src/campaign3/retainedContextGrouping.ts","src/test/retainedContextGrouping.test.ts","startExperience:motion[0].experience","startExperience:motion[1].experience","RCG-A"],["goal-current-lane-admitted","src/campaign3/goalAssessmentProduction.ts","src/test/goalAssessmentProduction.test.ts","if(staged.reservation.lane!=='Consequence'||staged.stagedAtPhase!==124n||staged.experience.transformationVersion!=='semantic-binding/0.1-candidate#SEM-001H')throw Error('GOAL_ASSESSMENT_CONSEQUENCE');","","GAP-D"],
["goal-absence-allocates","src/campaign3/goalAssessmentProduction.ts","src/test/goalAssessmentProduction.test.ts","if(value.kind==='NoConsequence')return {...value};","","GAP-B"],
["goal-identity-reuses-experience","src/campaign3/goalAssessmentProduction.ts","src/test/goalAssessmentProduction.test.ts","const assessmentId=allocate();","const assessmentId=value.consequence;","GAP-A"],
["goal-carry-leaks-metrics","src/campaign3/goalAssessmentProduction.ts","src/test/goalAssessmentProduction.test.ts","qualification:projectGoalQualification(result)","qualification:result","GAP-A"],
["goal-capability-replayed","src/campaign3/goalAssessmentProduction.ts","src/test/goalAssessmentProduction.test.ts","prepared.delete(view);\n if(value.kind","\n if(value.kind","GAP-E"],
["goal-foreign-source-accepted","src/campaign3/goalAssessmentProduction.ts","src/test/goalAssessmentProduction.test.ts","if(validated.experience.observerId!==observer||validated.experience.occurredAt!==at)throw Error('GOAL_ASSESSMENT_SOURCE');","","GAP-D"],
["credit-changes-current-retention","src/campaign3/ordinaryMemoryBatch.ts","src/test/ordinaryMemoryBatch.test.ts","prepareFormation(x)","prepareFormation({...x,priorMemory:credited})","OMB-B"],
["batch-drops-use","src/campaign3/ordinaryMemoryBatch.ts","src/test/ordinaryMemoryBatch.test.ts","useProtection:old.useProtection","useProtection:u.useProtection","OMB-A"],
["batch-drops-significance","src/campaign3/ordinaryMemoryBatch.ts","src/test/ordinaryMemoryBatch.test.ts","outcomeSignificanceDirections:[...old.outcomeSignificanceDirections]","outcomeSignificanceDirections:[...u.outcomeSignificanceDirections]","OMB-A"],
["batch-result-replay","src/campaign3/ordinaryMemoryBatch.ts","src/test/ordinaryMemoryBatch.test.ts","finished=true;results.delete(token);","","OMB-F"],
["batch-current-is-prior","src/campaign3/ordinaryMemoryBatch.ts","src/test/ordinaryMemoryBatch.test.ts","a.acquiredAt>=x.now","a.acquiredAt>x.now","OMB-F"],
["calibration-floor-ignored","src/campaign3/selectedSpatialEncoding.ts","src/test/visualFormationEvidence.test.ts","finish(operands,calibration.law,calibration.budget,calibration.threshold)","finish(operands,calibration.law,Q.of(1n),calibration.threshold)","VF-I"],
["unlimited-uses-capacity","src/campaign3/canonicalVisualSelection.ts","src/test/visualFormationEvidence.test.ts","algorithm===2?selectEqualPriorityControl:selectUnlimitedAttentionControl","algorithm===2?selectEqualPriorityControl:selectAttention","VF-H"],
["equal-uses-role-priority","src/campaign3/canonicalVisualSelection.ts","src/test/visualFormationEvidence.test.ts","algorithm===2?selectEqualPriorityControl:selectUnlimitedAttentionControl","algorithm===2?selectAttention:selectUnlimitedAttentionControl","VF-H"],
["control-audit-claims-role","src/campaign3/canonicalVisualSelection.ts","src/test/visualFormationEvidence.test.ts","unsigned(algorithm)","unsigned(1)","VF-H"],
["unknown-encoding-law","src/campaign3/selectedSpatialEncoding.ts","src/test/visualFormationEvidence.test.ts","if(!['independent','historical-shared','historical-hybrid','retired-flat'].includes(calibration.law))throw Error('SPATIAL_ENCODING_CALIBRATION');","","VF-J"],
["hybrid-forced-to-conserve","src/campaign3/encodingAccessMath.ts","src/test/visualFormationEvidence.test.ts","return values.map((x,i)=>important[i]?committed[i]:denom.numerator?x.divide(denom):zero);","const result=values.map((x,i)=>important[i]?committed[i]:denom.numerator?x.divide(denom):zero),total=sum(result);return total.compare(one)>0?result.map(x=>x.divide(total)):result;","VF-I"]];const results=[];
for(const [name,file,test,removed,inserted,witness] of faults){let substitutions=0;const temp=`docs/planning/.panel-body-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[test],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'panel-body-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+file)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);assert(report.testResults.flatMap(t=>t.assertionResults).some(t=>t.status==='failed'&&t.fullName.includes(witness)),name);results.push({name,file,witness,detected:true});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'FORMATION EVIDENCE REVIEW PASS',faults:results,defendedSubstitution:{name:'visual-selected-cap-replayed',result:'Outer map deletion removal does not permit replay because the inner prepared encoding capability is independently consumed; not counted as a detected fault.'},sources:["src/campaign3/eventPresentationSettlement.ts","src/test/eventPresentationSettlement.test.ts","src/campaign3/eventAssociationSettlement.ts","src/test/eventAssociationSettlement.test.ts","src/test/observedAssociationRecall.test.ts",'src/campaign3/observationExecutionPolicy.ts','src/test/observationExecutionPolicy.test.ts','src/campaign3/significantFormationSettlement.ts','docs/formal/ORDINARY_MEMORY_BATCH_CONTROLS_COMPONENT.md',source,tests,panel,panelTests,'src/campaign3/bodyFormationEvidence.ts','docs/formal/BODY_FORMATION_EVIDENCE_COMPONENT.md','src/campaign3/contextualBodySelection.ts','src/test/contextualBodySelection.test.ts','docs/formal/CONTEXTUAL_BODY_SELECTION_COMPONENT.md','src/campaign3/perceivedTrialContext.ts','src/campaign3/visualFormationEvidence.ts','src/test/visualFormationEvidence.test.ts','src/campaign3/goalAssessmentProduction.ts','src/test/goalAssessmentProduction.test.ts','src/campaign3/ordinaryMemoryBatch.ts','src/test/ordinaryMemoryBatch.test.ts','src/campaign3/canonicalVisualSelection.ts','src/campaign3/encodingAccessMath.ts','src/campaign3/retainedContextGrouping.ts','src/test/retainedContextGrouping.test.ts','src/campaign3/positiveSpatialCandidate.ts','src/campaign3/priorConcernFeedback.ts','src/campaign3/selectedSpatialEncoding.ts','scripts/review-ga-production-boundaries-rev8.mjs'].map(fp),limits:['Actual component audit and selected capability; unallocated body codecs/public gates remain open.','Canonical fixture memory payload and PRJ are still trusted component boundaries.']},null,2)+'\n');process.exitCode=0;
