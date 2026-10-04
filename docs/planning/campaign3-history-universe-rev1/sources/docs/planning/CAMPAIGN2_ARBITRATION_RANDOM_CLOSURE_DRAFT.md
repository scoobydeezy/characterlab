# Exact task arbitration and addressed draws

Status: DRAFT. Version: task-arbitration/0.1-draft. No new numeric allocations or
runtime qualification. This closes mathematical direction beneath the reason and
conditional-intent drafts; registration and persistence composition remain pending.

## Finite exact distributions and preserved arbitration

Distribution is a canonical map from signed integer score to positive rational mass.
Duplicate scores reject at record admission; the constructing convolution explicitly
adds products landing on one score. Zero masses are omitted. Support is nonempty and
mass sums exactly1. PointMass(0) is the empty convolution identity. Uniform dN has
mass1/N at each1..N. Convolution and signed reflection preserve exact normalization.
No sampled estimate or floating-point weight enters analytical probabilities.

There are0..2 complete candidates and at most2 active nuclei across them, because
there are at most2 actual task origins. With die faces at most12, enumerate at most
144 elementary die combinations for a brute-force control. The analytical definition
for option o is the sum over joint independent score combinations of their product
mass times1/k if o shares the maximum with exactly k candidates, otherwise0. This
matches the actual historical fair tie-share winProbabilities. Numeric score order
and canonical candidate-key ordering are distinct; neither uses locale string order.

No candidates yields NoOptions. Candidates but no active nuclei yields NoActiveReasons.
Neither calls the resolver or draws. Otherwise every candidate participates, including
a candidate with point mass0 from no active nuclei. Do not silently discard that
alternative: it may beat an Avoid distribution and is still an available action.

Rank by descending exact win probability, then full canonical candidate-key bytes.
Use this same leading pair for p1,p2 and M1,M2. With only one candidate, p2=M2=0.
For candidate o, M(o)=sum(abs(E[each active signed nucleus distribution])). Then:

    Margin = p1-p2
    Contest = 1-Margin
    ConflictMass = min(M1,M2)
    Stake = ConflictMass/(1+ConflictMass)
    AuthorshipPotential = Contest*Stake

With fixed model thresholds0<ThetaRoll≤1 and0≤ThetaPlayer≤1:
Contest<ThetaRoll gives Auto; otherwise AuthorshipPotential≥ThetaPlayer gives
PlayerFacingRoll; otherwise QuietRoll. Auto selects the leading candidate without
draws. This includes genuine one-candidate settlement. No chosen intent means no
expression; low authorship is not itself a prohibition on acting.

For either roll mode, draw each active nucleus's uniform face, add its standing and
context integer modifiers, then multiply the entire sum by its direction sign.
Sum these signed contributions per option. Select the sole maximum directly; for
multiple maxima, make one uniform tie draw among canonical-key-sorted leaders.
Never replace this grammar by a single weighted option draw. PlayerFacingRoll records
the mode; the first autonomous scaffold resolves it deterministically with no UI wait
or external choice override. A later interactive mode requires its own input contract.

## Accepted random substrate, not historical hash reuse

Use RandomRunOracle.drawBounded under rng/sha256-addressed-128-v1-candidate. A die
uses span N and face=result+1; a tie uses span k and the selected zero-based index.
Retain the accepted candidate0/1 rejection and candidate2 fallback, recorded in full.
Analytical uniform distributions are exact mathematical objects; finite hash mapping
has the separately documented less-than2^-290 total-variation bound under its stated
assumption. Do not claim an exactly unbiased pseudorandom generator or replace the
accepted bounded mapper with historical floor(u*N).

RandomAddress/110 and SubjectBinding/111 are reused. Allocate no shadow decision
identity. Reserve the DecisionResolution output's one occurrence at arbitration entry;
use that exact typed occurrence as CausalRootId for its draws and final output.
The occurrence is allocated even for NoOptions/NoActiveReasons, which make no draws.

New symbolic vocabulary requires its own allocation gate: RandomPurposeId and
RandomSubjectRoleId families. Production allocation-table and semantic namespace
inventory inspection found no existing families for those roles. Test namespaces10001..10007 are controls only;
never promote them. The two purposes are decision/reason-face and decision/tie-break;
any later admitted comparison roles must be distinct. The three subject roles are actor, action and
task. Fixed members are symbolic until a separate complete inventory is accepted.

For a reason face, SubjectBindings are actor→CharacterId, action→the actual
ProtocolActionDefinitionId, task→the actual task SemanticReferentId. DrawIndex=0.
These complete bindings distinguish the only two possible nuclei without assigning
an ordinal among surviving reasons. Direction is an operand, not a new address:
the same uniform face can compare an Approach/Avoid intervention. No signal magnitude,
model digest, die size, iteration order or previous draw enters the address.

For a tie, SubjectBindings contains actor only and DrawIndex=0 under the distinct
tie purpose. The resolution occurrence identifies the frozen candidate set. The
bounded span supplies the actual leader count; no tied-option ordering is omitted
from the resolution record. Identical local addresses cannot execute twice.

This corrects the historical index-among-all-reasons addressing to the accepted
substrate's semantic bindings. The dice grammar is preserved; identical old/new seed
strings do not promise identical raw draws. Cross-implementation math controls supply
matched faces, and end-to-end comparisons use accepted explicit injective coupling
maps when local causal-root occurrences differ. The first profile may exclude coupling
input while retaining independent substrate coupling controls; that scope must be
stated in its qualification rather than inferred from old receipts.

## Symbolic result and trace data

DecisionResolution: OccurrenceId, ReasonContext, Result.
Result is a closed union NoOptions, NoActiveReasons, Chosen. Chosen carries CandidateKey,
Probabilities, Margin, Contest, ConflictMass, Stake, AuthorshipPotential, ResolutionMode,
ReasonDraws, TieBreak. ReasonDraw records NucleusKey, BaseDie, StandingModifier,
SituationalModifier, full accepted RandomDrawRecord data, Face and SignedContribution.
TieBreak is absent for Auto or a unique rolled maximum; otherwise it carries ordered
leader keys, full draw data and selected key. Mode and result are not inferred from
whether a list happens to be empty. Exact canonical record schemas remain to close.

All arithmetic, emitted records and addresses must be recomputable from the live
reason context, frozen model and run seed. Draw trace contains actual raw candidates,
internal indices, rejection/fallback status and mapped value, with existing local/
effective address provenance. It may not claim a draw for Auto. The fresh occurrence
is the one output identity, not a state counter or a psychological magnitude.

### Canonical draw representation still needs explicit allocation

Inspection of trace.ts confirms TraceRecord/160 field14 is a list of CanonicalValue;
the current campaign trace adapter always emits an empty list. RandomDrawRecord is
a TypeScript interface, not an already registered canonical record. Reusing the RNG
algorithm does not provide its missing draw codec. Propose these exact symbolic
records, pending allocation:

* CognitiveRandomCandidateAttempt: InternalCandidateIndex, Candidate, Rejected.
* CognitiveRandomDraw: LocalAddress, EffectiveKey, Result, Span, Limit, Fallback,
  Attempts.

LocalAddress reuses110. EffectiveKey is the exact closed112 Natural or113 Coupled
record, with existing117 nested in the latter. No duplicate ComparisonKey field is
needed alongside that same key. InternalCandidateIndex is0..2, candidate is unsigned
less than2^128, and attempts is the actual ordered nonempty list of at most3 attempts.
The sequence must be exactly0, optionally1, optionally2 under the accepted rejection/
fallback rule. Span is1..2^32, Result<Span, Limit=floor(2^128/Span)*Span. All recorded
booleans and results are recomputed from the actual candidates and mapper rule.

These records introduce no occurrence identities and no new random source. They
canonically encode actual existing draw results for nested DecisionResolution and
Trace160. Both locations must carry identical bytes for the same draw. The trace
projection cannot invent a second candidate transcript. Historical generic110/111
remain polymorphic; exact new address namespaces/members are receiving-profile rules.

## Transaction and persistence expressibility finding

The actual RandomRunOracle marks an address used before its asynchronous draw and
has no snapshot/rollback API. Reusing that mutated oracle after a failed scheduler
instant would reject an otherwise valid retry. This is a real composition gap.
Do not solve it by disabling duplicate detection or omitting random state from audit.

Proposed bounded adapter: construct an instant-local oracle and keep a private
committed-address set at the runtime composition boundary. Before each draw, reject
membership in that set; within the instant the oracle rejects duplicates. At successful
whole-instant commit, publish all new addresses; on failure discard the local oracle
and pending addresses. No output/trace/private address publication occurs before the
same commit boundary. The resolution occurrence comes from the checkpointed shared
allocator, so failed instant retry reproduces its natural address and raw candidates.

Full-prefix restore reconstructs the committed-address set by executing and checking
the actual prior draws, just as it reconstructs other private causal associations.
It is derived runtime state, not a new authoritative save section. The eventual saved
random-relevant-ID projection must be computed from actual retained state, not filled
with an empty placeholder merely because prefix replay can regenerate the ledger.
Exactly which retained IDs belong to that projection depends on final identity-state
shape and requires the previously deferred PERSIST-I gate. No current no-RNG PASS
is promoted by this design. Mid-instant restore remains excluded.

## Proposed AR-A..L, all NOT PASSED

Exact mass/normalization and brute-force ties; no-options/no-reasons; one-option Auto;
threshold equality and canonical rank ties; two role modifiers with entire Avoid sign;
face and tie purpose separation; nonzero DrawIndex rejection in this profile; insertion/
enumeration independence; duplicate address rejection; raw-candidate fallback control;
post-draw failure retry with byte-equal trace; full-prefix save/restore and random ID
projection. Retained historical decision regressions and current substrate RNG controls
remain required comparison evidence, not substitutes for this integration.
