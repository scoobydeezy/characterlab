# Transactional marker tracking component

`marker-tracking-transaction/0.1-candidate`. SHAPE ACCEPTED at component scope by
primary-agent review, 2026-09-12. Composes observed-marker-tracking/0.1-candidate
unchanged. No public restore, canonical snapshot format, persistent root, allocation
or source authentication is accepted here.

One opaque manager owns an observer and an initially empty or replayed committed
prefix of at most eight actual MarkerSweep component inputs. Replay starts with a
fresh actual OMT tracker and applies every sweep in order. It reconstructs all OMT
facts, including active SEM files/counters, previous markers, observation/time,
sweep count and used source ordinals. No guard is discarded or inferred from only
the last visible window. The prefix is copied after validation, never retained as
a mutable caller array. Prefix lists must be plain, dense and nonexecutable.

Begin creates a fresh candidate tracker by replaying the committed prefix, then
applies one new sweep. Failure changes neither committed facts nor pending state.
Success returns an opaque pending proposal. At most one proposal may be pending.
Preview returns detached actual transitions and candidate OMT snapshot. It grants
no write authority. The proposal is tied to its originating manager.

Commit atomically publishes the candidate and revokes the proposal. Abort revokes
it without changing committed facts. Wrong-manager, forged, stale and repeated
proposal use rejects without consuming a different pending proposal. An aborted
sweep's ordinals remain available for a valid retry because it never committed.
Eight committed sweeps retain the original horizon and replay guards after restart.

The first public adapter must commit this component only after successful scheduler
settlement; on any failed instant it must abort the pending proposal. Publishing
inside a tracking handler before later stages settle is prohibited. Every canonical
perception read still needs its accepted logged projection, and cached OMT facts
must agree with those reads before use. Replay is not an unlogged character archive
read or an alternative source of perception truth.

The proposed public restore strategy is original-prefix replay: reconstruct the
manager through the actual admitted source during replay and compare the complete
canonical save, including perception leaves and pending generated work, before
returning a live run. The component constructor's prefix argument is **not** a public
input or persistence certificate. Public save/restore remains unqualified until that
adapter executes its source, projection, queue and whole-save checks.

Frozen MTX-A..H: every committed prefix and continued suffix matches uninterrupted
actual OMT; old ordinal rejection survives reconstruction; ninth sweep still rejects;
preview and abort preserve committed facts; failed begin is atomic; foreign/forged/
reused proposals reject; caller and preview mutation cannot alter history; a simulated
later-stage failure aborts tracking and retry matches uninterrupted identities.

MEC-005's perception/attention distinction and SEM-001A false-tracking semantics
remain unchanged. This component adds transaction handling, not a new tracking law.
It does not decide the final canonical TrackingWindow schema or public replay budget.
