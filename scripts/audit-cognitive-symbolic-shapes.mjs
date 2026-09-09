// Symbolic field grammar coverage. No canonical descriptor or numeric allocation is constructed.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const input='docs/planning/CAMPAIGN2_COGNITIVE_SYMBOLIC_INVENTORY_REV4.json',output='docs/planning/CAMPAIGN2_COGNITIVE_FIELD_GRAMMAR_REV1.json';assert(!fs.existsSync(output));
const inventory=JSON.parse(fs.readFileSync(input,'utf8'));
// Field types follow the inventory's ordered names; optionality is inherited separately.
const types={
 DeliberationOpportunity:'id(ObserverId) id(DefinitionId)',
 TaskWorkspaceDefinition:'id(DefinitionId) u bool bool',
 WorkspaceTaskItem:'r(371) id(DefinitionId)',
 WorkspaceForecast:'enum(WorkspaceForecast) r(361)',
 TaskWorkspace:'id(WorkspaceOccurrenceId) id(CharacterId) id(DefinitionId) list(WorkspaceTaskItem) r(WorkspaceForecast)',
 TaskAssessment:'enum(TaskAssessment) q',
 TaskAppraisalItem:'r(371) r(TaskAssessment)',
 TaskAppraisal:'id(AppraisalOccurrenceId) r(TaskWorkspace) list(TaskAppraisalItem)',
 TaskConcernDefinition:'q bool',
 TaskConcernResponse:'enum(TaskConcernResponse) q',
 TaskConcernItem:'r(371) r(TaskConcernResponse)',
 TaskConcern:'id(ConcernOccurrenceId) r(TaskAppraisal) list(TaskConcernItem)',
 PlanInstructionDefinition:'id(DefinitionId)',
 AdoptedTaskInstruction:'id(DefinitionId)',
 ProtocolActionDefinition:'u',
 TaskMotiveDefinition:'q bool',
 TaskMotiveItem:'r(371) q',
 TaskMotiveContext:'id(MotiveContextOccurrenceId) r(TaskConcern) list(TaskMotiveItem)',
 ProceduralCandidateKey:'id(CharacterId) id(DefinitionId)',
 ProceduralCandidateOrigin:'r(371) id(DefinitionId)',
 ProceduralCandidate:'r(ProceduralCandidateKey) set(ProceduralCandidateOrigin)',
 TaskCandidateOptions:'id(CandidateOptionsOccurrenceId) r(TaskMotiveContext) list(ProceduralCandidate)',
 ReasonEvidenceAtom:'enum(ReasonEvidenceAtom) r(237) id(QualificationOccurrenceId)',
 ReasonEvidenceBasis:'map(ReasonEvidenceAtom,q)',
 TaskRawSignalKey:'r(ProceduralCandidateKey) r(371) enum(SourceRole)',
 TaskRawSignal:'r(TaskRawSignalKey) q r(ReasonEvidenceBasis)',
 TaskRawSignalContext:'id(RawSignalContextOccurrenceId) r(TaskCandidateOptions) set(TaskRawSignal) map(ProceduralCandidateKey,q)',
 ReasonNucleusKey:'r(ProceduralCandidateKey) id(MotiveChannelId) id(TaskReferentId) enum(Direction)',
 CoverageContribution:'r(TaskRawSignalKey) q r(ReasonEvidenceBasis)',
 CoverageResult:'r(TaskRawSignalKey) q q q q',
 ReasonRoleSummary:'q q q list(CoverageResult)',
 CompiledReasonNucleus:'r(ReasonNucleusKey) r(ReasonRoleSummary) q u i i r(ExactScoreDistribution)',
 TaskReasonContext:'id(ReasonContextOccurrenceId) r(TaskRawSignalContext) list(CompiledReasonNucleus)',
 DecisionResolution:'id(DecisionResolutionOccurrenceId) i r(TaskReasonContext) r(DecisionResult)',
 CognitiveRandomCandidateAttempt:'u u bool',
 CognitiveRandomDraw:'r(110) r(112) u u u bool list(CognitiveRandomCandidateAttempt)',
 TaskIdentityKey:'id(CharacterId) id(IdentityChannelId)',
 TaskIdentityContribution:'id(QualificationOccurrenceId) id(DecisionResolutionOccurrenceId) i q',
 TaskIdentityEvidence:'list(TaskIdentityContribution)',
 TaskIdentityState:'map(TaskIdentityKey,TaskIdentityEvidence)',
 TaskWorkspaceTaskRequirement:'id(ProjectionAccessorId) set(DefinitionId) r(149) id(ProjectionAccessorId)',
 TaskWorkspaceSourceRegistration:'id(SeamId) text r(254) id(EventTypeId) id(DefinitionId) set(149) set(277) r(273) set(266) set(TaskWorkspaceTaskRequirement) set(363)',
 TaskConcernRegistration:'r(272) id(DefinitionId)',
 DecisionResult:'enum(DecisionResult) r(ChosenDecisionData)',
 ChosenDecisionData:'r(ProceduralCandidateKey) list(OptionProbability) q q q q q enum(ResolutionMode) list(ReasonDraw) r(DecisionTieBreak)',
 OptionProbability:'r(ProceduralCandidateKey) q',
 ReasonDraw:'r(ReasonNucleusKey) u i i r(CognitiveRandomDraw) u i',
 DecisionTieBreak:'enum(DecisionTieBreak) list(ProceduralCandidateKey) r(CognitiveRandomDraw) r(ProceduralCandidateKey)',
 ExactScoreDistribution:'map(i,q)',
 ChosenIntent:'id(ChosenIntentOccurrenceId) r(DecisionResolution)',
 DecisionExpression:'id(DecisionExpressionOccurrenceId) r(ChosenIntent) list(ChannelExpression) r(FixtureQualificationContext)',
 ChannelExpression:'id(IdentityChannelId) q',
 FixtureQualificationContext:'text enum(CostRepresentation) enum(FearRepresentation) enum(ChoiceInterventionRepresentation)',
 DecisionQualification:'id(QualificationOccurrenceId) r(DecisionExpression) r(QualificationResult)',
 QualificationResult:'enum(QualificationResult) q q enum(RejectionReason)',
 ActionPlan:'id(ActionPlanOccurrenceId) r(ChosenIntent) u',
 ActionAttempt:'id(ActionAttemptOccurrenceId) r(ActionPlan)',
 ExecutionOutcome:'id(ExecutionOutcomeOccurrenceId) r(ActionAttempt) u',
 ExecutionDefinition:'bool',
 TaskCandidateDefinition:'bool',
 TaskReasonSourceDefinition:'bool q',
 ReasonDiceDefinition:'r(BaseDieThresholds) q r(ModifierDefinition) r(ModifierDefinition)',
 BaseDieThresholds:'q q q q q',
 ModifierDefinition:'q u',
 TaskArbitrationDefinition:'q q',
 TaskMotiveRegistration:'r(272) id(DefinitionId)',
 TaskCandidateRegistration:'r(272) id(DefinitionId) r(TaskPlanBindingRequirement)',
 TaskRawSignalRegistration:'r(272) id(DefinitionId) r(TaskIdentityReadRequirement)',
 TaskReasonCompilationRegistration:'r(272) id(DefinitionId)',
 TaskArbitrationRegistration:'r(272) id(DefinitionId) r(ChosenIntentIngressDefinition)',
 ProtocolExecutionRegistration:'r(272) id(DefinitionId)',
 TaskPlanBindingRequirement:'list(u) list(u) r(149) id(ProjectionAccessorId)',
 TaskIdentityReadRequirement:'list(u) id(IdentityChannelId) r(149) id(ProjectionAccessorId)',
 ChosenIntentIngressDefinition:'id(EventTypeId) u r(254) enum(ChosenIngressRule)',
 TaskIdentityApplicationRegistration:'id(SeamId) text r(274) set(149) set(277) r(322) r(276) r(TaskIdentityReadRequirement)',
 ProtocolObservationBridgeDefinition:'id(TransitionKindId) r(254) r(201) bool map(u,EventTypeId) r(254) set(254)',
 IdentityQuantizationOperation:'id(QualificationOccurrenceId) enum(CounterKind) q u u q',
};
const enums={WorkspaceForecast:['Unavailable','Known'],TaskAssessment:['UnknownForecast','Below','Within','Above'],TaskConcernResponse:['Unavailable','Known'],ReasonEvidenceAtom:['Observation','QualifiedExpression'],SourceRole:['MotiveGenerating','SituationalEvidence','StandingDisposition'],Direction:['Approach','Avoid'],DecisionResult:['NoOptions','NoActiveReasons','Chosen'],ResolutionMode:['Auto','QuietRoll','PlayerFacingRoll'],DecisionTieBreak:['None','Present'],CostRepresentation:['NotRepresented'],FearRepresentation:['NotRepresented'],ChoiceInterventionRepresentation:['ExcludedByInputProfile'],QualificationResult:['Eligible','Rejected'],RejectionReason:['ZeroAuthorship','NoExpressedChannel'],ChosenIngressRule:['ChosenOnly'],CounterKind:['Support','Opposition']};
assert.deepEqual(Object.keys(types).sort(),inventory.records.map(r=>r.name).sort());
const records=inventory.records.map(r=>{const t=types[r.name].split(' ');assert.equal(t.length,r.fields.length,r.name);return {name:r.name,fields:r.fields.map((f,i)=>({...f,grammar:t[i]})),numericAllocation:null};});
const unionRules={
 WorkspaceForecast:{Unavailable:[],Known:['PredictionValue']},
 TaskAssessment:{UnknownForecast:[],Below:['Distance'],Within:[],Above:['Distance']},
 TaskConcernResponse:{Unavailable:[],Known:['Intensity']},
 ReasonEvidenceAtom:{Observation:['ObservationReference'],QualifiedExpression:['QualificationOccurrenceId']},
 DecisionResult:{NoOptions:[],NoActiveReasons:[],Chosen:['ChosenData']},
 DecisionTieBreak:{None:[],Present:['Leaders','Draw','SelectedKey']},
 QualificationResult:{Eligible:['Weight','SignedContribution'],Rejected:['RejectionReason']},
};
for(const [name,variants] of Object.entries(unionRules)){
 const r=records.find(r=>r.name===name);assert(r);assert.deepEqual(Object.keys(variants),enums[name]);
 for(const allowed of Object.values(variants))for(const f of allowed)assert(r.fields.some(x=>x.name===f&&x.optional),name+'.'+f);
 for(const f of r.fields.filter(f=>f.optional))assert(Object.values(variants).some(v=>v.includes(f.name)),name+'.'+f.name);
}
fs.writeFileSync(output,JSON.stringify({status:'SYMBOLIC FIELD GRAMMAR COVERED; NOT WHOLE SHAPE ACCEPTANCE OR ALLOCATION',sourceInventory:input,notation:'r is record; id is typed identifier; collection element names resolve to declared records, existing numeric schemas, identifier aliases or primitives. Enum member order assigns no numeric values.',records,enums,unionRules,checks:{allRecordsCovered:true,allFieldsCovered:true,optionalUnionFieldCoverage:true,noNumericAllocation:true},limits:'Relational/cardinality/refinement predicates remain in the named seam drafts and must be independently audited. This file alone is not a model validator.'},null,2)+'\n');
console.log(JSON.stringify({records:records.length,fields:records.reduce((n,r)=>n+r.fields.length,0),unions:Object.keys(unionRules).length,enums:Object.keys(enums).length,status:'symbolic coverage only'}));
