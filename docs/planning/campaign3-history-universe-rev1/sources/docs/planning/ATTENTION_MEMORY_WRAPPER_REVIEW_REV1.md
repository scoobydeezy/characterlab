# Attention memory wrapper review

2026-09-12. Primary-agent adversarial design review. The accompanying
[packet](ATTENTION_MEMORY_WRAPPER_INVENTORY_REV1.json) combines the26 prior domain
records with22 wrapper/helper records:48 proposed records and139 named fields.
It resolves the22 local stage input references into explicit bounded field layouts.
This is a draft schema inventory, not whole-shape acceptance or allocation input.

## Correct-forward findings

The prior ExtendedObservation lacked CurrentEventDetectionId. Actual SEM event
tracking requires that existing observer-relative identity (record215, occurrence
namespace1113); a positive source cannot reconstruct it from a continuant detection
or silently allocate it at a later consumer. The revised draft carries EventDetection
iff the observation has detections. Observation produces it once, and tracking uses
that exact identity. Denied observations have neither it nor an experience reservation.
The conditional experience reservation remains the existing SEM-H operation.

SelectedSpatialWitness also lacked the actual detection needed to check attachment
to a track output. It now carries existing CurrentDetectionId alongside the unit key.
Spatial preparation must join detection→actual track→continuant/event unit under
equal observer/time/support and copy the same witness for selected units only.
Adding the detection does not grant a truth resolver or a read of the full observation.
No new identity family or provenance graph is proposed by either correction.

The earlier EncodingJoinInput observer field spelling becomes ObserverId in this
draft, matching the required top-level field convention of the proposed input roles.
No existing canonical record is renamed. Original inventories and their reviewed
fingerprints remain unchanged; this packet supersedes only their draft field choices.

## Wrapper boundaries

Positive cue input carries actual spatial preparation, including the frozen SEM
experience. Empty cue input carries an explicitly empty observation. The tagged
union prevents an optional arbitrary scene field from disguising a skipped SEM
reservation/settlement step. Exact designation of the cue detection remains a source
profile obligation; a caller cannot substitute a memory selection or file key.

Bound join inputs require ObserverId and the qualified Subject. Formation, association,
presentation and rank must still perform their own registered PRJ/IDN operations.
Carried observer equality is checked before projection, and copied Subject equality
after projection. Neither copying nor this draft schema establishes admission.

RecallResult traces all candidate scores but carries retained content only for winners.
RecollectionInput consumes that exact result; ReinforcementInput carries one or two
actual emitted recollections. It cannot carry an episode ledger or an authored list
of selection IDs. Unknown graph match remains distinct from unavailable cue: the
former may still yield winners through the explicitly declared baseline score.

Character storage still reaches only positive RetainedEncoding and its admitted
binding/claim/factor witnesses. Full selection, evaluation, feedback, spatial
preparation and ranking remain outside those owner leaves. Old selected record534,
the qualified capability implementation, EVID and all mutation owners are unchanged.

## Self-review and limits

The [machine receipt](ATTENTION_MEMORY_WRAPPER_REVIEW_REV1.json) checks field/reference
closure, bounded containers, required top-level observer fields, explicit cue branches,
storage reachability and retained scope. Thirteen deliberately corrupted packets must
reject, including missing event/detection links, optional owner observer, full-evaluation
retention, cue bypass, ledger transfer, truth insertion and premature allocation.
These are structural design checks, not executed public admission or runtime mutants.
Nested accepted SEM evidence remains governed by its existing observer-safe contract;
the symbolic checker does not re-prove its internals.

The North Star's truth/evidence boundary and separately owned memory lifecycle remain
the governing tests. MEC-005/007/008/009/010 and EXP-007/015 retain their recorded
control/corpus obligations. This packet adds no category, realized Need, surprise,
causal Incidental or feedback-capacity qualification. No reduction is inferred from
the thin homogeneous source or from these structural checks.

## Remaining gate

Complete canonical registration and scalar/map identity roles, exact occurrence and
transition-result slots, upstream probe/workspace/concern production, profile cue
designation and complete model/work bounds. Symbolic fields and enum alternatives
are not permanent numeric assignments. The new public runtime still requires whole
symbolic acceptance, separate allocation review, exact model packaging and executed
source/join/ownership/rollback/restore controls before corpus promotion.
