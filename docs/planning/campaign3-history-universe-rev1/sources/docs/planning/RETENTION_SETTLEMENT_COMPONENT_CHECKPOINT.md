# Formation and retention settlement checkpoint

2026-09-12. Actual scheduler fixture composition of the accepted formation-then-loss
direction, recency-retention-component/0.1-candidate and
retention-fragmentation-component/0.1-candidate. **Not public memory qualification.**

[Twenty-two tests pass](RETENTION_SETTLEMENT_TESTS_REV1.json): six new settlement
cases plus eight recency and eight fragmentation cases. The
[new fixture](../../src/test/retentionSettlement.test.ts) uses the actual scheduler
and its phase140 settlement adapter, with phase130 candidate occurrence reservations.

RS-A commits positive formation with intact surviving groups. RS-B commits historical
acquisition and explicit complete-loss disposition at zero capacity, with no current
target and no sample bytes in governance history. RS-C produces no acquisition/loss
when formation is absent. RS-D fails late and restores state, queue, clock, allocator,
outputs and trace. RS-E rejects replay of a source even after all its content is gone.
RS-F reverses terminal emission order and preserves the same partially surviving
acquisition identity and whole multi-view group. Member reads observe only common B0.

The fixture's history contains only occurrence, source, original time and complete-loss
status. Its eight-entry ceiling is an experiment safety bound, not a proposed lifetime
tombstone policy and not modeled forgetting. Retention is independently exercised at
capacities zero, one and four; those values are test parameters, not frozen public
capacities. These tests do not prove ongoing operation after history fills or compacts.

Fixed strings, raw bigint placeholders and synthesized sample bytes are fixture data.
The adapter supplies trusted formation transport; no public producer authentication,
PRJ/IDN, registered owner path or canonical acquisition/loss carrier is qualified.
No cognitive read API or transient-access seam is implemented. B0-only fixture reads
do not prove every public consumer is denied access to forgotten payloads.

The fixture emits payload-free formation/loss diagnostics. This establishes scheduler
expressibility without deciding the pending public full-evidence trace disposition.
It does not authorize changing frozen trace schemas, erasing historical commitments,
or exposing diagnostic buffers to ordinary cognition. The history flag records current
complete-loss status; append-only public loss provenance still requires a separate
exact bounded representation.

TypeScript checking passes. No new production state owner, public memory factory,
record/namespace allocation, model commitment or corpus promotion occurred.
Next: governed bounded formation/loss history, surviving-content reads and auxiliary
graph/presentation disposition, followed by public carrier/registration closure.
The acquired-protection comparison remains mandatory; General Attention is OPEN.
