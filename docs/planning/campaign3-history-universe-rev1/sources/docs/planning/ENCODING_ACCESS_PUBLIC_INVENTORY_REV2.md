# Encoding/access public inventory — revision 2

2026-09-11. DRAFT, not whole-shape accepted. This replaces revision1's proposed
storage sketch, not any accepted contract. No numeric allocation or public runtime
activation. The user has authorized autonomous resolution of the remaining design
and review work; no permission request is pending.

## Executed findings and their limits

The actual selected-capability encoder has eight passing tests and five detected
source faults (SELECTED_ENCODING_REVIEW_REV1.json). It consumes only selected SEM
binding/claim bytes, preserves their existing refs and computes exact factors. Need
and surprise are explicitly disabled. It has no subject, state or public provenance
authority. Its three-unit uniform-prior case has total raw <=9/10, so it cannot
exercise shared-budget1 normalization; do not promote that comparison as evidence
against footprint dependence. EAM's independent arithmetic witnesses do exercise it.

Actual SEM marker tracking has nine tests and six faults after the dense-list
structural correction. Positive spatial allocation has eight tests and five faults.
SpatialPeripheral is a geometric classification, not CausalRole Incidental. The
historical residual-membership control remains separately owed. These independently
qualified components cannot be glued together by supplying new fields to the old
closed SelectedView.

Inspection of compileRequiredProjections shows a concrete integration gap: it admits
272/318, the exact EMB registrations465/469/470, or receiving515. Attention541 is
not admitted. A future encoder cannot call the base constructor with541 or read the
roster directly. A successor registration/admission adapter must bind its exact
payload schema and invoke the same PRJ/IDN requirement algorithm with its own actual
admitted-input capability. No fake base wrapper or duplicate observer roster.

Inspection of StateModel/ContractReadProjection shows another concrete gap: direct
and derived reads cover named paths. AuthoritativeState.entries() is not a declared
character candidate-query capability. A wildcard in ReadDomain alone does not earn
unlogged enumeration. The inventory therefore chooses bounded governed owner leaves
instead of an auxiliary candidate index or a scan of arbitrary episode keys.

## Proposed storage refinement

Three separate physical leaves, all keyed by the actual qualified CharacterId:

1. EpisodeLedger: at most four entries in formation order. Each entry has the
   existing SelectionOccurrenceId and exact EncodingEvidence once. Insertion appends
   one previously absent selection; every previous entry remains byte-identical.
   Only authority/attention-episode-formation writes this leaf. Empty selections
   create no episode. No episode ID is allocated. The semantic address remains
   (CharacterId, SelectionOccurrenceId), now inside a bounded governed owner value.
2. AssociationGraph: at most12 distinct PerceptualReferentId keys in canonical order,
   exact lattice rows, and LastUpdatedAt. Only authority/attention-association-update
   writes it. A row is explicit and the matrix dimension, zero diagonal, quantization
   and row bounds are validated. This is a typed bounded record, not an ungoverned
   string map. New nodes come only from newly encoded selected evidence; prior node
   identities never change meaning. Whole-owner graph reads are exact logged reads.
3. PresentationLedger: at most four entries keyed by existing SelectionOccurrenceId,
   each with at most eight nondecreasing presentation times. Only a separate
   authority/attention-presentation-update writes it, both for initial encoding and
   later successful recollection. Episode formation does not write this leaf.
   No global event archive or redundant candidate index exists.

EpisodeLedger and PresentationLedger materialize distinct physical leaves of the
existing logical episodic-memory family; AssociationGraph materializes associations.
Every write has expected-old checks and its exact authority. Existing measurement
memory leaves, key shapes, accessors and histories remain unchanged. The bound12
fits EAM's frozen32-node domain; exceeding it rejects rather than truncates. Removal,
fragmentation and long-horizon compaction remain MEM extensions, not silently retired.

The single-owner values make completeness testable: recall reads exactly the subject's
whole EpisodeLedger, AssociationGraph and PresentationLedger via three fixed
declared accessors. It may not derive subject from their contents. Every ledger
entry is validated against its key/owner/evidence and every history key must match
one episode. The authoritative stage ordering must ensure these invariants at every
successful instant; an interrupted intermediate stage is never a save prefix.

## Proposed causal graph and carriers

Formation: actual safe observation → actual SEM interpretation → selected view →
pure factor calculation → EncodingEvidence → required subject projection → episode
append → association update → initial presentation update.

Recall: a later actual observation → actual observer-relative marker continuation
→ cue extraction → required subject projection → exact owner-leaf reads → activation
and accessibility → Recollection → presentation update. No caller-supplied episode
list, remembered file ID, activation vector or presentation count is admitted.

EncodingEvidence needs an exact new canonical shape containing the existing selected
envelope534 once, derived factor rows and committed calibration references. It gains
no second occurrence merely for wrapping a SelectionId. Its row provenance references
the carried original bindings/claims. The old selected-only capability is transferred
to this consumer; the terminal diagnostic does not also consume it.

A generated RecallOpportunity needs ObserverId and the actual permitted cue output.
It has scheduler identity and exact parent binding; no CueId. The cue means a current
perceived file match, not recognition of a true entity. For a cue file absent from
the graph, record NoKnownAssociationMatch. Do not confuse that with an unavailable
cue. Candidate episodes and their known graph keys stay complete in either case.
Exact retrieval produces a new Recollection occurrence only when K>0 and an episode
is selected; output includes retained historical bytes and score determinants.
Score calculation is read-only. Subsequent presentation updates are separately
identified by the actual committed recollection output and cannot run twice.

Encoding calculation is current-event processing. State consolidation is proposed
at phase140, matching the existing memory ownership precedent; successive registered
stages use scheduler parent ordering. Later recall occurs at a strictly later instant
and performs no same-event belief read/write. The complete graph, route closure,
phase legality, work/output/occurrence bounds and failure rollback must be frozen
before acceptance. Phase150 remains nonschedulable. Ordinary memories do not bypass
OutcomeEvaluation→CharacterLearningEvidence or redefine that separate EVID slice.

## Source and feedback gates still open

- Public observation must carry actual permitted glyph and coordinate readouts,
  feature availability and supporting observation identity. A component input is
  not an authenticated source. A governed profile must bind coordinates to actual
  physical observations while keeping hidden object identity trace-side.
- The first three-port source cannot simply admit new SEM feature IDs, new causal
  derivation functions or extra selected-view alternatives. Such source extensions
  need their exact schema/version, evidence scope and output closure.
- Spatial allocation and role allocation remain separate named models. No claim
  that one earns reduction of the historical Incidental control is made. Role/cause,
  relevance and evidence-aware surprise still need their named source dispositions.
- TaskConcern is current-event producer output. A later feedback opportunity must
  carry the authentic earlier output through scheduled causal edges in the same
  run, preserve its original provenance and reject future/foreign/replayed claims.
  No persistent mood family or caller-authored concern value is implied. Unknown
  concern stays unavailable, not numeric zero. The modulation law needs its own
  fixed calibration and disabled-feedback comparator.
- Exact registration/admission/PRJ extension, symbolic schema table, leaf/value roles,
  occurrence/output rules, finite model recipe and whole-prefix replay remain to be
  specified together. Do not allocate a partial table from this sketch.

## Adversarial review of the refinement

This resolves candidate enumeration without inventing an index or using private
state.entries() as a character read. It also avoids two writers on initial versus
retrieval presentation history. It does not resolve source authentication, whole
registration shape or later affect merely by drawing their arrows. Four episodes
are a bounded attention experiment horizon, not a universal memory capacity.

Required faults include: read foreign owner before qualification; omit an owner
ledger entry from candidates; insert a cue ID from truth; reinforce during ranking;
reinforce twice on replay; rewrite an old episode on append; mutate graph through
the episode writer; use current concern to modify its producing appraisal; admit an
unknown cue as observed zero; normalize independent focal encoding across unrelated
selected units; and use shared-budget comparisons entirely below their threshold
while claiming the normalization branch was tested.

Next: finish the observer-safe source and delayed feedback contracts, then one whole
symbolic schema/declaration packet. Component qualification remains useful evidence
but cannot substitute for these gates. General ATTN and corpus promotion stay OPEN.
