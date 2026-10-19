# Formation owner/protocol settlement component

2026-09-12. `formation-settlement-component/0.1-candidate`.
Component shape accepted by primary-agent self-review under autonomous authorization.
Trusted internal composition; public input and PRJ authentication remain external.

Prepare from detached prior memory/protocol, admitted source inputs, successful
formation metadata and matching fresh memory, instant, source limit and per-kind
retention capacities. Validate prior history/domain independently before extension;
prior live IDs exactly cover memory and match its kind/original acquisition time.
Fresh memory must exactly correspond to new successful formations, including kind,
identity and original time. Actual recency/fragmentation validates memory content.
Validate source replay and uniqueness before resolving retention.

resolveMemory executes recency-retention-component/0.1-candidate once. It issues an
opaque, frozen transaction-local handle held in a private WeakMap, not an occurrence
identity or serialized record. finish accepts only the actual handle from that session
once; copied, foreign or closed-session handles reject. It derives survivor metadata
from the actual result, reconciles protocol history, and validates the exact protocol
transition. No caller supplies a replacement survivor list at this join.

finish returns memory and protocol candidates to the trusted transaction coordinator,
not to a cognitive evaluator. The protocol calculation consumes only identities and
metadata; it does not inspect remembered child bytes. Preparation captures bounded
inputs; handles are nonpersistent and may not cross save/restore. close invalidates
the transaction. No public authority follows from importing this internal factory.

The component itself does not commit state, authenticate formation evidence, bind a
public hook descriptor or provide public identity roles. Whole-instant atomicity is
supplied by the scheduler adapter and separately tested. Fixed source/character strings
remain component operands, not new public identity schemas.
