# Cognitive failure ownership and failed-run boundary

Status: DRAFT. Exact failure strings proposed for the new profile; no production
error union is changed by this document.

Retain existing INVALID_CONFIGURATION for invalid committed models, declarations,
recipes and original-input configuration. Retain INPUT_NOT_ADMITTED for an unbound,
wrong-parent, wrong-time or forged generated cognitive source. Exact output grammar,
cardinality or identity-rule failure uses TRANSITION_OUTPUT_VIOLATION; generated child
mismatch uses TRANSITION_INGRESS_VIOLATION. Existing character/task qualification and
read/write authority failures remain StateContractError at their owning component;
the existing scheduler boundary wraps them according to its accepted rules.

Add these exact SchedulerFailureCode strings only in the new implementation:

| Code | Owning condition |
|---|---|
|COGNITIVE_STAGE_VIOLATION|Wrong new prepared140 grammar, incomplete seal/participants, or new controller lifecycle misuse.|
|IDENTITY_TARGET_COLLISION|Two new identity applications resolve the same target in one prepared stage.|
|IDENTITY_EVIDENCE_ALREADY_APPLIED|An otherwise admitted append repeats a retained qualification or resolution ID.|
|IDENTITY_EVIDENCE_ORDER_VIOLATION|A novel admitted contribution's time does not strictly follow retained history.|
|IDENTITY_EVIDENCE_LIMIT_EXCEEDED|A novel correctly ordered contribution would create entry65.|

Append predicates are checked in that order: duplicate identity, temporal order,
then capacity. This makes a repeated64th identity a duplicate failure, not a misleading
capacity failure. Source authentication and whole-stage target/seal checks precede
the history prior read. Rejected qualification reads no history and performs no append.
Malformed initial/retained state remains state admission failure, not one of these
otherwise-admitted append results. Generic RNG errors retain RandomContractError at
the component; a runtime draw failure is TRANSITION_FAILURE unless an earlier input
or output boundary owns the defect. Do not map it to psychological rejection.

Existing overflow, cascade, event, trace, invariant and illegal-write error owners
remain unchanged. All errors abort the whole instant, including state candidates,
outputs, trace, queue, allocators, private parent associations and pending RNG ledger.
No component catches an error and substitutes Unknown, no options, a zero contribution,
an unobserved outcome or a clipped result.

## Retry means reconstruction, not failed-run reactivation

The scheduler's Failed state remains terminal. The rollback/proof drafts' phrase
"retry with identical draws" means reconstructing a fresh run from the last accepted
quiescent S0/input prefix (or its authenticated save), then executing the attempted
instant after removing the test-only injected failure. It does not mean calling a
failed run again, changing its status to Active, or deleting a consumed-address entry
by hand. A second settle on the failed object must still reject RUN_NOT_ACTIVE.

The new factory restores through complete-prefix replay, not an arbitrary pre-instant
state patch. Tests compare the new execution's full raw draw transcript, allocated
identities, source bindings and committed result to the uninterrupted control. The
failed object's diagnostic may retain attempted data, but none is committed evidence.
This preserves the accepted scheduler semantics while testing transaction-local RNG
discard and deterministic reconstruction.
