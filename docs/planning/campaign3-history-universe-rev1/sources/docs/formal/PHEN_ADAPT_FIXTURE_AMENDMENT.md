# PHEN-ADAPT fixture alignment — amendment revision 1

Date: 2026-09-08. **Status: ACCEPTED; PHEN-ADAPT-001 PASS in bounded frozen-model scope.**
The user APPROVES the coherent current promotion: `PHEN-ADAPT-001/1.11.0`, `corpus/0.27.0`,
and digest `3cb09115d90485d5975968ffca419a4960a398326b6b6339a5b1e8e8fdcec276`.
[The accepted promotion](../planning/PHEN_ADAPT_CORPUS_PROMOTION_ACCEPTED.json) freezes the exact
manifest bytes; reconciliation is CLOSED.
The reviewed serialization was `1.11.0-draft` in `corpus/0.27.0-draft`; it remains preserved.
This amendment changes research-fixture obligations only. It does not change executable
`adaptation-input/0.31-candidate`, its N-rule grammar, schemas, allocations, runtime, model or profiles.

## Authority and correct-forward scope

The user accepted the joined same-S0 parent witness and ADAPT-9a/9b/control9. The user identified
one specification conflict and found the composed PHEN-ADAPT evidence otherwise sufficient.
Concrete model freeze did not silently repeal an accepted fixture restriction.

Historical [ADAPT acceptance §2.7](../planning/ADAPT_001_DRAFT_RESOLUTION.md#27-rule-cardinality-and-one-result-per-rule)
states:

> `ADAPT-001` v0.1 additionally constrains the fixture — not the grammar — to exactly one
> applicable rule per admitted input, so `PHEN-ADAPT-001`'s comparison has one unambiguous target
> path. The 0/N cases remain expressible and are not foreclosed; they are simply not exercised by the
> first fixture, and a phenomenon that needs them does not require a grammar change.

PHEN-ADAPT `1.10.0-draft` repeated the one-rule restriction. The already frozen production model
instead resolves four independent single-path exposure rules, and the accepted witness executes
them. That historical discrepancy is retained here and in the unchanged ADAPT acceptance source.
The fixture-specific clauses and control interpretations listed below are now governed
by this accepted explicit addendum; other contract clauses remain unchanged. The current corpus
serialization uses the accepted suffix-free member; the reviewed draft remains historical.

## Replacement fixture rule

Both timelines resolve the same exact **nonempty** ApplicableRules set from the committed model.
Authored ActualContactCount may change evaluation results, but may not change that rule set.
The zero-count source and its dispatch/evaluations must execute at matching allocator positions.

Let `P(r)` be the exact StatePath derived from applicable rule `r` and the admitted semantic key.
Let `ExpectedTargetPaths = { P(r) | r in ApplicableRules }`. Each rule targets exactly one path.
Duplicate targets reject before evaluation, including targets of eventual NoStateChange results.

For each timeline, the fixture independently states the expected state-changing subset
`ExpectedChangedPaths ⊆ ExpectedTargetPaths`. The actual committed adaptation mutation-path set
must equal **exactly ExpectedChangedPaths**; every path outside it stays byte-identical.
Do not infer the expected subset from observed patches: that would make the isolation check circular.

For the frozen positive exposure fixture, with governed subject C and variable V:

| Rule target | Exact expected path | Count0 | Count1 |
|---|---|---|---|
| Tolerance | 302/1/mapKey(ToleranceKey(C,C,V)) | NoStateChange | StateChange to1 |
| Sensitization | 302/2/mapKey(SensitizationKey(C,C,V)) | NoStateChange | StateChange to1 |
| Regulatory displacement D | 302/3/mapKey(RegulatoryAdaptationKey(C,V)) | NoStateChange | StateChange to1 |
| Accumulated load | 302/4/mapKey(AccumulatedLoadKey(C,load/fixture-load)) | NoStateChange | StateChange to1 |

C is the existing governed character/bridge-subject identity; V is variable/fixture-regulation.
These are references to frozen vocabulary, not new allocations. Both initial states are identical
canonical baseline states. Count0's expected changed set is empty; count1's is all four paths.
Four rule evaluations do not authorize a single multi-leaf rule or extra mutation.

## Distinguished response-mediating path and control9

`P* = 302/3/mapKey(RegulatoryAdaptationKey(C,V))` is the distinguished response-mediating path.
The earlier intervention must create its D difference. The later diagnostic challenge must read
exactly P*, with its read equal to the earlier retained D result: absent baseline0 versus present1.
The probe may not read tolerance, sensitization or load as alternative adaptation inputs.

The later permitted measurement difference must descend through that read, and the first cognitive
divergence must descend through the permitted observation. The accepted fixture demonstrates
5 versus51/10, exact337→342→episode retention, and later352. Keep scheduler ancestry separate from
state-write/read dependency; neither exposure→independent probe nor formation→cue is a fabricated
scheduler-parent edge. Recall's IDN/episode reads are distinct from the probe's D-only read.

## Exact clause/control substitutions

| Historical location | Fixture interpretation after acceptance |
|---|---|
| ADAPT §2.7 final one-rule fixture paragraph | Replace with the same nonempty ApplicableRules/ExpectedTargetPaths/ExpectedChangedPaths definition above. Preserve the surrounding 0/1/N grammar. |
| ADAPT §2.8 matched no-op fixture singular “same rule” | Same applicable rule set, one independently traceable result per rule. |
| ADAPT §2.9 and PHEN exact mutation equality | Equality is to the independently specified expected state-changing subset for that timeline, not every evaluated/no-op target. |
| ADAPT §6 control1 whole-exposure “the target leaf” | Exactly the expected rule-derived changed target-path set differs. |
| ADAPT §6 control3 | Mechanically satisfied but non-discriminating at leaf-family granularity in this four-leaf fixture. |
| ADAPT §6 control3a | Committed mutation paths equal exactly ExpectedChangedPaths; no extra fifth path or missing expected path. |
| ADAPT §6 control9 | Name P* and require the exact earlier-result/later-read join and observation-mediated cognitive response. |
| ADAPT §6 fixture-version reference and PHEN manifest/body | Use accepted PHEN-ADAPT1.11.0/corpus0.27.0 for this amended fixture; retain1.10/0.26 as historical evidence. |

Singular language about an individual rule, key, path, dispatch occurrence or diagnostic D read
remains singular. Only descriptions of the whole exposure transaction become path-set language.

All four regulatory leaf families are targets, so control3 alone cannot discriminate a spill in
this fixture. Isolation rests on exact-path equality3a, wrong-exposure-key7g, wrong-variable-key7g′,
sole-owner/exact-path WRT and collision controls. Those obligations are retained, not replaced by
the vacuous leaf-family complement. Same-rule-set, same-S0/seed/input topology, route-closure,
observation, no-op, frozen snapshot, rollback and persistence requirements are unchanged.

## Existing evidence and acceptance boundary

[The accepted parent-pair report](../planning/CAMPAIGN2_ADAPT_PARENT_PAIR_PROOF.json) already checks
the identical four-rule dispatch set, four exact evaluated paths, count0 no-op/count1 state-change
results, exact four-path mutation set, non-target equality and distinguished D read/write join.
The user accepted that witness. No new behavioral witness is required or claimed by this amendment.

[Consolidation](../planning/CAMPAIGN2_PHEN_ADAPT_CONSOLIDATION_REVIEW.md) records the inherited and
memory proof composition. The user finds that corpus sufficient subject only to this alignment.
The user has accepted this alignment and the bounded PHEN-ADAPT PASS.
Blanket ADAPT/factory/VAL qualification, PHEN-MEM and Campaign2 completion are not inferred.

SUB-011 correct-forward accounting applies: the historical one-rule statement, old manifest
commitment and original implementation evidence remain available. No frozen artifact is rewritten.

## Corpus commitment accounting

The reviewed draft aggregate changed exactly one of ten members: PHEN-ADAPT1.10→1.11-draft. Its
historical digest is `181ce5711aee0eef8e7089e914906098e1183f7a592bce7d9096192993a57315`.
The accepted promotion changes only that member string to1.11.0, yielding current digest
`3cb09115d90485d5975968ffca419a4960a398326b6b6339a5b1e8e8fdcec276`.
This is status/version promotion, not new fixture semantics. No alias relates the commitments.
Historical corpus0.26 digest remains `42dc63048912b666c8d7cd4b4c58273f698f1f1950b3a1714c1b12bc7eaa46fc`.
[The amendment audit](../planning/PHEN_ADAPT_FIXTURE_AMENDMENT_AUDIT.json) retains both exact canonical
manifests and the sole member delta, compiled through the existing corpus-manifest substrate.
The historical contentGovernance golden remains unchanged. Neither corpus commitment enters
the frozen model's execution or changes its ModelIdentity.
