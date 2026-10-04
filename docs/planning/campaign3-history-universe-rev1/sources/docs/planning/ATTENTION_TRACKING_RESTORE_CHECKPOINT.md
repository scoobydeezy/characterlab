# Attention tracking transaction and reconstruction checkpoint

2026-09-12. Primary-agent review qualifies MTX-A..H at component scope under
[marker-tracking-transaction/0.1-candidate](../formal/TRANSACTIONAL_MARKER_TRACKING_COMPONENT.md).
General ATTN-001 remains OPEN. No numeric allocation, public model, corpus member or
existing tracking law changes.

## Finding and resolution

The proposed TrackingWindow contains the most recent matching window; it cannot
reconstruct the tracker's complete used-observation set or committed sweep count.
Restoring only that window would weaken replay rejection and the eight-sweep bound.
The new component reconstructs the unchanged observed-marker tracker by replaying
every committed sweep from a fresh tracker. It retains the full guards without
inventing another canonical provenance or persistence root.

Each new sweep runs against a separate reconstructed candidate. Preview is detached;
commit publishes it once, and abort discards it. A later-stage failure can therefore
leave committed tracking unchanged and permit a retry with identical identities.
The component enforces proposal ownership and prevents a second pending proposal.
Caller mutation cannot alter the privately copied committed replay inputs.

This resolves the component expressibility question. It does not qualify public
scheduler rollback: the later-stage exception in MTX-H is simulated. Nor does accepting
a component prefix authenticate that prefix as a public run history.

## Executed evidence

The [current test report](TRANSACTIONAL_MARKER_TRACKING_TESTS_REV2.json) records
eight new controls and nine retained tracking controls passing. Revision1 is retained
as the earlier test report; revision2 strengthens the caller-mutation witness with
a further commit that consumes the copied history.

The [adversarial receipt](TRANSACTIONAL_MARKER_TRACKING_REVIEW_REV1.json) detects
seven substitutions in the actual component: premature publication, last-window-only
replay, foreign-manager commit, omitted committed-tracker publication, a second pending
proposal, retained caller prefix and retained caller input. All previously qualified
general-attention component source fingerprints remain unchanged.

All nine prefix cuts, including empty and eight-sweep prefixes, reconstruct the same
actual OMT snapshots and continued suffixes as uninterrupted execution. Old ordinal
rejection and the ninth-sweep rejection survive reconstruction. Invalid input, abort,
foreign/forged/stale proposals and caller/preview mutation preserve the committed facts.

TypeScript and the reference import boundary pass. Read-only verification of the
prior bounded public attention receipt passes:32 models,224 specimens,434 restores
and453 preserved EMB fingerprints. This verifies the existing receipt; those public
runs do not qualify the new transaction component's future adapter.

## Required public integration

The future public adapter must:

1. Derive each sweep from the admitted observation source and execute the required
   logged canonical perception reads; private reconstructed facts must agree with
   those reads before use.
2. Begin and preview tracking provisionally, publish its canonical perception effects
   through the declared owner, and commit the private manager only after scheduler
   settlement succeeds. Abort it on every failed instant.
3. Restore by replaying the authenticated original input prefix through the actual
   adapter. Do not accept a caller-supplied MarkerSweep history as public restore data.
4. Compare the complete canonical save, including perception leaves and generated
   pending work, before returning a live restored run. A matching TrackingWindow alone
   is insufficient.
5. Execute public prefix/suffix, old-ordinal, horizon, late-failure rollback and retry
   controls against that adapter within the final bounded work budget.

These obligations refine the [stage inventory](ATTENTION_MEMORY_DECLARATION_REVIEW_REV1.md);
they do not retroactively modify its reviewed artifact. The final TrackingWindow
schema, source/read registrations and public work budget remain declaration gates.

## Next checkpoint

Complete exact wrapper schemas, admitted-input identity roles and output/result-slot
closure, together with the upstream concern acquisition graph and total model bounds.
Then review the whole symbolic package before a separate allocation gate and exact
model packaging. Public encoding, retrieval and corpus promotion remain unqualified.
