# Trace and Provenance

**Status:** accepted Campaign 0 contract, version identifier `trace/0.2-candidate` (accepted 2026-09-01)

Trace is the omniscient record used to reproduce and audit execution. It is not memory, belief, perception, or any other character-accessible channel.

## Artifact classes

```text
CommittedTrace
FailureDiagnostic
```

`CommittedTrace` is authoritative history of a successfully committed run prefix. `FailureDiagnostic` explains an aborted instant and is non-authoritative diagnostic evidence. A failed instant contributes no committed record, state mutation, emitted event, or allocator change. The diagnostic carries the failed `RunIdentity`, attempted instant, pre-instant structural identity, candidate transition data, failure code, and causal chain, but it never becomes character knowledge or a successful run event.

`TraceSchemaVersion` and `FailureDiagnosticSchemaVersion` are artifact metadata unless their semantics alter authoritative execution. Both use the canonical encoding primitives from `substrate/0.2-candidate`.

## Canonical committed-record envelope

Every authoritative transition stages an ordered record with:

```text
TraceRecord = {
  TraceSchemaVersion,
  ModelIdentity,
  RunIdentity,
  EventId,
  ParentEventId?,
  DueAt,
  Phase,
  EventSequence,
  SeamId,
  SeamVersion,
  RecordKind,
  SubjectIds[],
  SourceRecordIds[],
  RegisteredReadDomain,
  ActualReadRecords[],
  InputProjection,
  OutputProjection,
  RandomDrawRecords[],
  QuantizationOperations[],
  StatePatch,
  StructuralMutationDiff[],
  EmittedEvents[],
  InvariantResults[]
}
```

Every record and nested projection has canonical structural encoding. The ordered trace commits only with the containing simulation-instant transaction. Redaction for UI display produces a non-authoritative view; it never changes the stored trace.

Each random-draw record includes local `RandomAddress`, effective natural/coupled key, comparison key when present, internal candidate indexes and raw 128-bit candidates, rejection/fallback status, bounded span or weight total, and mapped result. Each actual-read record contains canonical state path, exact value supplied, and derived-value provenance where applicable. Each mutation diff contains path, old presence/value, new presence/value, and owning `MutationAuthorityId`.

## Provenance rules

1. Every derived authoritative value names the source records and transformation version that produced it.
2. Source lists are canonically ordered and duplicate-free.
3. A source may influence a result through multiple paths only when the receiving contract states how correlated evidence is handled.
4. Outcome truth records the actual attempt and world consequence. Character learning points to a distinct perceived/encoded-evidence record.
5. A missing observation is not a zero-valued observation.
6. Trace hashes help locate divergence but do not replace structural comparison.
7. Human explanations are generated from typed fields; free text is never the sole authoritative provenance.
8. A declared read domain is not evidence that a value was read; actual reads come from capability projection instrumentation.
9. Failure diagnostics may quote staged data for debugging but never appear as committed causal ancestors.
10. Opaque is not synonymous with epistemically safe. Equality, reuse, ordering, and cardinality of an otherwise opaque truth handle can reveal hidden linkage. Character-accessible records may carry only observer-safe references whose complete observable behavior is permitted by the producing seam; unrestricted truth joins remain in omniscient trace.

## Comparison

A replay comparison reports the first differing record and field, plus its ancestry. A model comparison declares which fields must be exactly equal, which admit a versioned tolerance/equivalence relation, and which are intentionally different. “The final behavior looked similar” is not a trace comparison.

A research comparison and verdict additionally record `ExperimentIdentity` plus its `ComparisonCase`, including ordered model/run identities and coupling specification. Those fields classify the comparison. Only an explicit `ComparisonDrawMap` included in canonical run input may affect effective random keys; experiment identity and corpus membership never do.

## Open obligations

- `TRC-001`: candidate canonical encoding and artifact separation are defined; close only after golden encoding, schema-evolution, committed/aborted separation, and first-divergence vectors pass.
- `TRC-002`: candidate patch-derived mutation diff and pre/post proof are defined; close only after exact-diff, illegal-authority, stale-precondition, and rollback vectors pass.
- `TRC-003`: privacy-safe projections for tools without collapsing epistemic boundaries.
- `TRC-004`: causal-overlap representation used by evidence consolidation.

The applicable [Campaign 0 Conformance Vectors](CONFORMANCE_VECTORS.md) passed before acceptance. Schema evolution, mutation semantics, or first-divergence failures reopen `TRC-001`/`TRC-002`.
