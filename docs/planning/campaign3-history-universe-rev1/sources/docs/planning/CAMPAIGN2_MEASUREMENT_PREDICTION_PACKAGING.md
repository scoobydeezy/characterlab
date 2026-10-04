# Measurement prediction profile packaging — revision 1

2026-09-09. Profile proposal for materialization review; no runtime activation.
Consumes corrected measurement-prediction/0.2-candidate and both frozen allocation
tables. In particular the active schemas are367/2 and368/2, never their old schema1.

## Proposed exact profile tuple

| Owner | Identifier |
|---|---|
| Rules | rules/campaign2-measurement-prediction/0.1-candidate |
| Registry | campaign2-measurement-prediction-registry/0.1-candidate |
| Trace | campaign2-measurement-prediction-trace-binding/0.1-candidate |
| Persistence | campaign2-measurement-prediction-persistence/0.1-candidate |
| Numeric | numeric/measurement-prediction-exact/0.1-candidate |

Keep content/0.2-candidate, campaign2-parameters/0.1-candidate, the probe original-
input profile and the addressed-RNG version unchanged. Content and parameter bytes
remain identical to the memory source selected by the same existing controls;
MaxSettlementWorkPerSimulationInstant remains100. New MaxEvidenceCount=64 belongs
to the committed prediction definition's bounded domain, not an unrecorded option.

The semantic bundle retains the accepted memory bundle in order, then appends:
measurement-prediction/0.2-candidate; application-registration/0.1-candidate;
read-registration/0.2-candidate; target-projection/0.1-candidate;
opportunity/0.1-candidate; application-ablation/0.1-candidate;
read-ablation/0.1-candidate; the new trace profile; the new persistence profile.
The seven component names have the full measurement-prediction prefix. Numeric
selection remains its independent ModelIdentity field, not an alias of RulesVersion.

## Data-only specimen construction and admissible controls

Reuse the frozen memory source constructor for its exact available/permitted,
formation and recall declarations. Append prediction application/read enabled or
disabled registrations as the two new independently committed controls. This gives
64 combinations of six exact booleans, not runtime callbacks or mutable flags.
The eventual factory must snapshot plain bytes/strings and derive those choices
from exact declarations, then compare the entire expected source. No caller-
supplied projection, evaluator, resolver, scheduler or state adapter is accepted.

Review construction of canonical declarations is permitted after the numeric
freeze; it is not an execution facade. A constructor may not activate a model or
label a record as an authenticated runtime occurrence.

## Registry deltas

| Slot | Exact change |
|---|---|
| 0 | Eleven active schema descriptors:359..366/schema1,367/2,368/2,369/1. Add prediction definition359, application registration364, read registration368/2, opportunity369. Add only application to279/2 TransitionRoutes and only366/schema1→278(field1,role1127) to279/3 OccurrenceIdentities. Materialize only existing belief-expectation Storage in284. |
| 1 | Preserve phase registry bytes. No new phase. |
| 2 | Add authority/belief-expectation for362/1/MapKey(*), value grammar361, RemovalAllowed=false. |
| 3 | Preserve existing read-only declarations, including IDN. Prediction is an owned writable family, not a second read-only family. |
| 4 | Add canonical-record key grammar360 for362/1/MapKey(*). |
| 5 | Add the twenty frozen new identity roles. Reuse existing203/2 and237/2 and all embedded roles; no duplicate role positions. |

Definition359 names the existing diagnostic channel1005, observed subject1002 and
unit1039 copied from the safe332 channel declaration, plus unsigned64. It contains
no R0,D,regulatory-variable ID or hidden readout function. Source metadata equality
is enforced before prediction read. Stable prediction/occurrence/opportunity
members are exactly those in the frozen table.

Application364 embeds343 selector[2,2,2], the existing qualified subject accessor,
and363 keyed target requirement for362/1 and definition/measurement-prediction.
Normal read368/2 uses266 cue selector1, same subject,363 target, conditional367/2
output schema366/1 and NoStateWrites273. The367/2 field2 is absent, including its
canonical presence byte; the shared map is the only occurrence-rule source.

The new registrations contain their projection requirements directly. Do not add
unallocated wrapper records, a slot7, or a global accessor registry. Existing memory
wrappers remain exactly their selected frozen values.

## Numeric binding

Bind the original component operators exactly as specified by their retained
contracts, plus prediction's exact rational sum/product/division and canonical
support cardinality. Division occurs only by positive n+1. First-profile observed
points are integer tenths in[0,10]; n is a mathematical integer in[1,64], derived
from canonical unique observation support. Arithmetic is arbitrary precision;
no Number arithmetic on semantic values, rounding, clipping, decay, confidence
transform, random distribution or conversion is reachable.

The proof oracle is the exact sum of admitted points divided by their count.
The stored denominator divides10*n, but a denominator/range check alone does not
authenticate history. Learned zero remains present. Numeric/exact-1 is preserved
as the old bounded profile, not modified to cover these operations.

## Phase140 composition: explicit successor, not a global relaxation

The memory profile's exclusive dispatcher cannot admit its formation child and a
prediction child together. This new RulesVersion declares exactly these alternatives:

1. Existing ADAPT batch only, with its unchanged rules, frozen view and closure.
2. One authenticated M1 pair: the selected memory formation/ablation child and the
   selected prediction application/ablation child from the same actual342 producer.
3. Their two exact private suppression-padding children, from the M1 padding slot.
4. No140 work.

No mixed ADAPT plus M1 pair, ordinary external140 event, unmatched half-pair,
duplicate member, late insertion, foreign342 or additional writer is admitted.
Original input's one-source-per-probe-instant rule remains unchanged. The pair
requires exact parent/source association, not only equal input record bytes.

Both pair members have independent event-bound IDN/read capabilities. Each owns
only its own leaf family; no shared mutable projection instance is introduced.
Prediction sees the frozen pre140 prior; formation's insert and prediction's set
are staged and checked as separate exact-authority patches before whole-instant
commit. If either fails, neither commits. Disabled consumers still occupy their
declared slots and preserve the generation/read-opportunity topology.

The first public profile has at most one prediction application per instant and
reads only its own key. Independent-target/collision generic controls must be
reported separately. Disjoint keys make a live-versus-frozen numerical comparison
non-discriminating in this bounded case; do not claim a detected freeze mutant
from that comparison. Prove the actual projection/lifecycle binding and preserve
the generic frozen-prior requirement without granting cross-key reads to force a
counterexample.

## Actual generation and work accounting

At the real M1 slot, the preserved formation child is first, prediction application
second and delayed prediction-read cue third. Its private suppression counterpart
has the same scheduling slots. The existing memory recall cue remains intake-owned
and precedes the new read at the later instant's phase20 versus40.

Relative to the memory specimen, each M1 slot adds exactly two generated events:
one same-instant140 application/padding and one future40 read/padding. Application
adds zero runtime-ordinal slots; future read always adds one. Work ceiling counts
executed events under the existing scheduler definition, not mathematical operations.
Materialization must derive the full old/new event table and verify it stays within
100, including consecutive source instants where prior recall/read coexists with
a new probe. A formula for the delta does not replace that derivation.

## Trace and persistence

Every executed event uses the successor ModelIdentity and the appropriate retained
component SeamId/version. Reusing a compiled source component is not permission to
emit an old-model trace or alias model commitments. One160 per event remains.

M1 trace records its exact three allocated children. Application has source342,
actual IDN/prior reads and exact patch/diff, no output or child. Prediction read has
InputProjection=cue, SourceRecordIds empty, real IDN/prior read, conditional366 and
no patch. Its actual state dependency is not a fake scheduler parent. Private
padding remains non-cognitive and consumes only its declared slots.

Restore extends complete S0/input prefix replay and whole-save equality to the
prediction family and pending read/padding associations. Restore cannot reconstruct
a forecast from current REG, or transfer authority from a supplied source hash.
The old save profile does not admit these records/events. New and old models retain
independent exact identities. Still zero RNG draws: PERSIST-I remains deferred.

## Materialization and review gate

Construct review bytes from accepted allocations and these declarations, enumerate
the64 control combinations and exact active schemas, validate field/role/source
references by semantic name, and preserve all previous frozen artifacts. Review
the actual model digest, event/work accounting, retired-field rejection, whole
profile selection and old-profile exclusion before freezing a production specimen.
No application/read evaluator or activation API is authorized by this draft.
