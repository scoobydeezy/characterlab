# Recency Retention Baseline component checkpoint

2026-09-12. Implements
[recency-retention-component/0.1-candidate](../formal/RECENCY_RETENTION_COMPONENT.md)
in [the policy component](../../src/campaign3/recencyRetention.ts), composing the actual
fragmentation component rather than reimplementing loss.

[Sixteen tests pass](RECENCY_RETENTION_TESTS_REV1.json): eight recency and eight
fragmentation controls. Recency controls cover time versus misleading ordinal magnitude,
canonical equal-time ties, original-age preservation after partial loss, zero capacity,
kind separation, complete-candidate permutations, invalid/future metadata, exact
multi-view retention and detached payloads. Changing evaluation time alone does not
refresh original acquisition time or change survivors.

[Six source mutations](RECENCY_RETENTION_REVIEW_REV1.json) are detected by named
recency witnesses: oldest-first ordering, reversed ties, survivor rejuvenation,
zero-capacity retaining one, input-order priority and future acquisition admission.
Mutations run in memory; production source bytes are unchanged. The receipt commits
the policy, imported fragmentation source, tests and formal component version.

The initial TypeScript check caught a misspelled test capacity property; it was fixed
before the passing test receipt. This was a fixture typo, not a semantic correction.

The candidate set and times are trusted component inputs. The component cannot prove
public producer identity, successful formation or owner authorization. Loss addresses
contain no payload; old input objects must not become an owner's hidden archive.
Output ordering uses component canonical addresses, not a permanent public grammar.

Integration review exposed the [same-barrier formation/loss decision](GENERAL_ATTENTION_SAME_BARRIER_ACQUISITION_DECISION.md):
the policy can legitimately remove all units of a newly proposed acquisition, but
cannot decide whether that proposal becomes an authoritative historical acquisition.
Resolve that before finalizing the occurrence-bearing evidence carrier and phase140
owner/output declarations. This is not a failure of the recency law or a request to
reopen unit costs, partitioning or tie semantics.

Acquired protection remains a mandatory comparison before broad memory sufficiency
or General Attention closure. No public retention, persistent restore, model/corpus
promotion or permanent allocation is claimed by this checkpoint.
