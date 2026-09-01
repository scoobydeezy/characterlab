# Trace and Provenance

**Status:** schema scaffold, version `trace/0.1-draft`

Trace is the omniscient record used to reproduce and audit execution. It is not memory, belief, perception, or any other character-accessible channel.

## Canonical record envelope

Every authoritative transition emits an ordered record with:

```text
TraceRecord = {
  ModelIdentity,
  RunId,
  EventId,
  ParentEventId?,
  DueAt,
  Phase,
  SequenceId,
  SeamId,
  SeamVersion,
  RecordKind,
  SubjectIds[],
  SourceRecordIds[],
  InputProjection,
  OutputProjection,
  RandomAddresses[],
  QuantizationOperations[],
  MutationRecords[],
  Failure?
}
```

Each projection has a canonical encoding. Redaction for UI display produces a non-authoritative view; it never changes the stored trace.

## Provenance rules

1. Every derived authoritative value names the source records and transformation version that produced it.
2. Source lists are canonically ordered and duplicate-free.
3. A source may influence a result through multiple paths only when the receiving contract states how correlated evidence is handled.
4. Outcome truth records the actual attempt and world consequence. Character learning points to a distinct perceived/encoded-evidence record.
5. A missing observation is not a zero-valued observation.
6. Trace hashes help locate divergence but do not replace structural comparison.
7. Human explanations are generated from typed fields; free text is never the sole authoritative provenance.

## Comparison

A replay comparison reports the first differing record and field, plus its ancestry. A model comparison declares which fields must be exactly equal, which admit a versioned tolerance/equivalence relation, and which are intentionally different. “The final behavior looked similar” is not a trace comparison.

## Open obligations

- `TRC-001`: canonical binary/text encoding and schema evolution.
- `TRC-002`: state mutation diff format and pre/post structural proofs.
- `TRC-003`: privacy-safe projections for tools without collapsing epistemic boundaries.
- `TRC-004`: causal-overlap representation used by evidence consolidation.
