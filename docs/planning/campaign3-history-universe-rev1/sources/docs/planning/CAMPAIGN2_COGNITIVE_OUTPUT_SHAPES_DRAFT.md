# Exact decision and execution output shapes

Status: DRAFT. This completes missing output field orders in symbolic inventoryrev1;
all fields and variant tags remain unallocated. New schemas are version1 proposals,
not additions to existing frozen codecs. A nested source is exact accepted bytes,
not reconstructed from current state or independently trusted caller data.

## Decision result

TaskRawSignalContext is refined to four fields: OccurrenceId, CandidateOptions,
Signals, NonIdentitySemanticPressure. The earlier StandingIdentityRead field is
removed before allocation. Actual identity read values and skipped-read diagnostics
stay in the owning trace; raw signals retain the exact projected strength and basis.
This avoids both recursively copied history and ablation diagnostics entering cognition.

DecisionResolution fields: OccurrenceId, OccurredAt, ReasonContext, Result.
OccurredAt is added explicitly to the earlier three-field proposal before acceptance:
it freezes the decision instant for later expression/support extraction. It equals
the authentic arbitration event DueAt, is positive signed integer, and every generated
same-instant consumer validates equality. The schema has not previously been allocated.

DecisionResult fields: VariantTag, ChosenData?. NoOptions and NoActiveReasons permit
only VariantTag; Chosen requires ChosenData. Their exact finite values await allocation.
ChosenDecisionData fields: CandidateKey, Probabilities, Margin, Contest, ConflictMass,
Stake, AuthorshipPotential, ResolutionMode, ReasonDraws, TieBreak.

OptionProbability fields: CandidateKey, Probability. Probabilities is a canonical-key
ordered list with exactly one entry per candidate and mass exactly1. Probability is
rational0..1. The exact solver verifies the entire vector, not only its normalization.

ReasonDraw fields: NucleusKey, BaseDie, StandingModifier, SituationalModifier, Draw,
Face, SignedContribution. Draw is CognitiveRandomDraw. ReasonDraws is ordered by the
full canonical nucleus key. Face is1..BaseDie and equals Draw.Result+1. SignedContribution
is the exact signed whole dice expression. Auto requires the list empty; a roll mode
requires exactly one draw per active nucleus. No separate draw occurrence IDs.

DecisionTieBreak fields: VariantTag, Leaders?, Draw?, SelectedKey?. None permits only
the tag; Present requires all three payloads. Leaders is the canonical ordered list
of actual maximum-score candidates with length2 in this bounded profile. Its Draw
span is2 and selected index identifies SelectedKey. A unique maximum requires None;
Auto requires None. Selection in ChosenData must equal the exact resolved winner.

ExactScoreDistribution fields: Masses, a canonical signed-integer→positive-rational
map as specified in the arbitration draft. It is an inline value, not an output
occurrence. CompiledReasonNucleus.Distribution uses this exact record.

## Intent, meaning and qualification

ChosenIntent fields: OccurrenceId, DecisionResolution. The resolution must be Chosen.
Do not duplicate CandidateKey beside it: the selected complete tuple is already frozen
there. Producer/source/child checks authenticate the entire live resolution.

DecisionExpression fields: OccurrenceId, ChosenIntent, ChannelExpressions,
QualificationContext. All pre-roll alternatives, reasons, costs represented by actual
reason distributions, draws and probabilities remain reachable in the nested source.
The expression does not fetch later state or attach a physical outcome.

ChannelExpression fields: IdentityChannelId, Alignment. ChannelExpressions is a
canonical ordered list containing exactly the profile's one CommitmentFidelity channel
when semantic pressure is nonzero on any alternative; otherwise it is empty. Zero
alignment is retained for a touched channel. Its exact calculation excludes standing
and winning probability. Expression strength is not stored here: the separate qualifier
owns the contribution after its explicit applicability decision.

FixtureQualificationContext fields: ScopeVersion, CostRepresentation,
FearRepresentation, ChoiceInterventionRepresentation. ScopeVersion names the exact
free-fixture qualifier. CostRepresentation and FearRepresentation are the closed
NotRepresented values. ChoiceInterventionRepresentation is ExcludedByInputProfile,
verified against the committed model, not caller assertion. These finite constants
do not mean experienced cost/fear/coercion equals zero. A profile that can represent
choice coercion/override is incompatible with this qualifier version.

DecisionQualification fields: OccurrenceId, DecisionExpression, Result.
QualificationResult fields: VariantTag, Weight?, SignedContribution?, RejectionReason?.
Eligible requires Weight and SignedContribution, forbids RejectionReason. Rejected
requires RejectionReason and forbids the numeric fields. Eligible weight equals frozen
AuthorshipPotential, and contribution equals the one channel Alignment*Weight.
Both must be nonzero under this profile. Rejection reasons are exactly ZeroAuthorship
and NoExpressedChannel, checked in that order. An empty channel list or its zero
alignment gives the latter. Structural source/operand failures abort instead of
producing a psychological rejection. Qualification always produces one output and
one identity-application child, including its authentic rejected cases.

## Planning, attempt and world output

ActionPlan fields: OccurrenceId, ChosenIntent, RequestedContactCount. The count is
extracted from the exact selected ProtocolActionDefinition and frozen in the plan.
The registry definition can be resolved only for that selected action; another row
or a caller-supplied count cannot replace it. Actor/action identity remains in the
one nested complete candidate key.

ActionAttempt fields: OccurrenceId, ActionPlan. There is no chosen-action override,
second request count or implicit successful-outcome field. The separate occurrence
means the attempt actually reached its110 transition, not that it succeeded.

ExecutionOutcome fields: OccurrenceId, ActionAttempt, CompletedContactCount. The
actual immutable ExecutionDefinition has one field Permitted, consumed only by its
execution adapter. CompletedContactCount equals requested when permitted and0
otherwise. No permission field is copied to the character's safe consequence input.

ActualFactBridge emits existing307/305 from this completed count and exact actor,
with existing1118 occurrence. The observation bridge derives actual bounded-effect
truth from the same completed count, preserving the independent requested count in
the attempt. Both bridges must authenticate the same live execution source. A copied
record from a prior run or an unbound generated event cannot create either branch.

## Absence and ownership checks

NoOptions/NoActiveReasons still emit the one DecisionResolution, but none of intent,
expression, qualification, plan, attempt or outcome. Auto chosen resolution creates
the full chosen route even with no random draws. A blocked execution creates the
attempt and outcome, explicit count0 adaptation input and permission-governed safe
observation; it does not erase expression/qualification already generated.

All new output identities are one-per-output via279/278. Inline result, draw, context,
distribution and channel records allocate no IDs. None is a new authoritative state
family; only the separately registered identity application changes retained identity.
Original evidence and qualification refs remain the only reason-basis atoms.
