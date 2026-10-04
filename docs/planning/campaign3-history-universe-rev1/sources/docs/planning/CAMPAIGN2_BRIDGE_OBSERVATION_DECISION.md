# C2-BRIDGE-OBS-001 — fixed bridge observation provenance

2026-09-06. **ACCEPTED WITH SOLE-OCCURRENCE CLARIFICATION.** The former D receiving conflict is resolved; implementation is authorized. Integrated qualification remains separately gated.

## Concrete conflict

Accepted ADAPT_001_CONSEQUENCE_BRIDGE_DRAFT.md, Exact source and receiving lifecycle, requires
calling `compilePermittedEvidence` on the fixed pulse/channel and receiving a PresentObservation
with point interval [1,1], no tokens and **no safe source references**. It explicitly says:
“Reject an unexpected result rather than replacing it with a hand-authored observation.”

The actual `src/observation/observation.ts` implementation always returns
`safeSourceReferences: [truth.truthRecordId]` for a present observation. Empty provenance slots
and channel visibility do not change this. `OBSERVATION_AND_EVIDENCE.md` Epistemic permissions
allows that truth handle only in its named one-effect control and explicitly withholds general
character-accessible provenance. The type-203 closure validator also requires exact
TransformationVersion `observation/0.1-candidate`.

`campaign2BridgeInspection.test.ts` reproduces the mismatch with D's exact rational pulse,
precision, polarity, measurement mode and missingness. All expected measurement fields match;
the reference list contains FixtureConsequenceTruthId/1121. Varying only that truth ID changes
the complete type-203 bytes. This is a passing reproduction, **not a bridge gate PASS**.

Campaign-1's scalar-support fixture cites the real ObservationId from a measurement but does
not implement a producer of a complete type-203 record with the truth reference removed.
SEM's type-216 support identity and type-227 envelope are not a replacement observation compiler.
No existing safe-observation projection was found in active observation/SEM source.

## Accepted narrow resolution

Amend D's receiving recipe to name a closed bridge-owned measurement projection:

1. Invoke the unchanged bounded observation compiler on the exact committed bridge channel and
   fixed pulse, keeping its raw result strictly inside the truth-side adapter.
2. Require a present result with the exact fixed interval/kind/precision, empty tokens, correct
   ObservationId/observer/subject/channel/time, and the single exact input truth reference.
   Unexpected raw results still reject; nothing is replaced with a fabricated measurement.
3. Derive the bridge's complete type-203 observation by preserving fields 1..9 exactly, setting
   field 10 to exact `list([])`, and setting field 11 to a new scoped transformation version:
   `authored-fact-observation/0.1-candidate` (accepted).
4. Admit that exact version/field closure explicitly in the canonical observation validator:
   fixed point [1,1], precision 1, empty tokens/references. Structural decoding recognizes this
   grammar; actual bridge origin still requires the existing staged R→bridge association.
   The old transformation version and old compiler/control behavior remain unchanged.
5. Bind this projection version through the accepted bridge declaration's governed executable
   meaning and the concrete first-model RulesVersion/bundle before activation. Record the D
   amendment explicitly; do not claim that the old compiler directly produced the projected bytes.
6. Emit only the projected observation to the bridge's observation/SEM path. Raw result, pulse
   truth ID and actual source ancestry remain truth-side/omniscient. Allocate ObservationId once;
   projection allocates no replacement identity, certificate, canonical record or namespace.

This preserves the inherited measurement mathematics and D's observer-safe result. It is a
proposed explicit projection, not permission for arbitrary caller filters or field rewriting.
No new numeric allocation, character state, evidence-reference variant or EVID/REG/PRJ/IDN change.
The first-model bundle must commit the amended behavior; frozen allocation artifacts stay intact.

## Frozen proposed controls — NOT PASSED

- Exact fixed input invokes the real compiler, then produces a valid scoped type-203 observation.
- Different hidden count/subject/exposure/practice inputs cannot enter the projection operands.
- Vary only pulse truth identity: projected observation bytes remain identical; omniscient truth/execution context may differ.
- Leak a truth handle, hash, source EventId, AAI ID or token into the projected record: reject.
- Wrong raw measurement/version/reference, invalid channel or forged bridge origin: reject before
  SEM reservation or character output; any already staged observation allocation rolls back.
- Preserve the original observation/0.1 control bytes and validation behavior.
- One observation allocation, one SEM reservation, exact staged freeze and common-root ancestry;
  any later failure rolls back both branches, state, queue, trace and all allocations.

No proposed projection implementation has been written. The accepted source/input and
adaptation-only runtime work is documented separately in CAMPAIGN2_INPUT_ADAPTATION_IMPLEMENTATION.md.

## Acceptance amendment — 2026-09-06

ADAPT D owns authored-fact-observation/0.1-candidate. The raw type-203-shaped candidate is private, transaction-local, truth-side, non-staged and non-published. Only the projected value is the authoritative Observation occurrence and SupportingObservation target for the one allocated ObservationId. Never register or trace a competing authoritative raw observation under that ID. The projection has only raw candidate and fixed version as operands, preserves fields 1..9, and replaces only fields 10/11. No ancestry hash/token/flag substitutes for the removed reference. The bridge declaration at adaptation-input/0.31-candidate requires this exact projection; concrete RulesVersion binding remains before activation.

Additional frozen controls: BRIDGE-OBS-I rejects publication/registration/citation of both candidate and projected values as one occurrence; BRIDGE-OBS-J rejects recomputation or alteration of any copied field. Implementation is authorized; no numerical allocation or general OBS behavior change.

Implementation checkpoint — 2026-09-06: accepted projection and sole-observation OBS→SEM→EVID composition are implemented with component proof in CAMPAIGN2_BRIDGE_IMPLEMENTATION.md. Full suite 48 files / 375 tests and build PASS. Prior proposed/unimplemented paragraphs describe the decision-era state. Production unit identity is separately C2-OBS-UNIT-001; no activation or numeric allocation.
