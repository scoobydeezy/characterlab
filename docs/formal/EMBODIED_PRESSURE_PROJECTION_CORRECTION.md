# EMB pressure projection: correct-forward model disposition

Accepted 2026-09-10 by primary-agent adversarial review under the user's autonomous
implementation/review instruction. No external review is claimed.

The first materialized model mistakenly reused source field 1 for both pressure
requirements. `LevelSamplingOpportunity/459.ObserverId` is field 1; both
`EmbodiedLevelObservation/461.ObserverId` and `UnavailableLevelSample/463.ObserverId`
are field 2. Field 1 in the samples is ObservationId and cannot select the IDN roster.
This violated the already accepted ObserverId projection, rather than exposing a
new semantic decision. Existing PRJ's role compatibility check correctly rejects it.

The governing cohort is now `docs/planning/campaign3-embodied-model-rev2/FREEZE.json`.
Its baseline ModelIdentity digest is
`cae46fcb4da4c9711ee24153854ca2eb976ec9dcad9a2394acb5861489007844`.
The earlier `campaign3-embodied-model/FREEZE.json` and all its exact files remain
historical, superseded and ineligible for activation. Their commitments are not
aliases of the corrected commitments. No historical bytes are rewritten.

Both pressure requirements now select field 2. The source still selects field 1.
All three requirements are compiled by the real shared PRJ implementation during
declaration admission, before model activation. No role bypass, new selector grammar,
identity, allocation, seam mathematics or RulesVersion semantics is introduced.
Seven models and seven run identities are recomputed in the corrected cohort;
single-operand semantic comparisons and input timelines remain as accepted.

Historical evidence receipts include source fingerprints as well as immutable data.
Current scheduler failure-code typing and shared PRJ dispatch are explicit source
extensions, so their historical fingerprints are not represented as unchanged.
Revision-2 receipts enumerate these source changes separately; all remaining
historical receipt entries are checked byte-for-byte. Runtime qualification remains
open. The full active-suite retry reports 1,072/1,072 tests passing; it predates
qualification of this new EMB runtime and is not EMB behavioral evidence.
