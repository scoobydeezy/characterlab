# Governed semantic referent origins

**Status: SYMBOLIC SHAPE ACCEPTED.** 2026-09-06.
Version: `referent-origin/0.1-candidate`.
Decision: C2-ORIGIN-001, alternative 2. Numeric assignments are separately accepted and frozen; see the
[permanent append-only allocation](ORIGIN_PERMANENT_ALLOCATION.md).

## Closed identity grammar

Exactly two origin families inhabit the nested payload of SemanticReferentId and
CandidateSemanticReferentId, both using the existing outer namespace 1002:

| Symbolic family | Payload grammar |
|---|---|
| AuthoredContentOriginId | canonical TypedIdentifierValue equal to content StableId |
| RuntimeEntityOriginId | unsigned runtime ordinal from shared allocator |

```text
SemanticReferentId = TypedIdentifier(1002, AuthoredContentOriginId | RuntimeEntityOriginId)
AuthoredContentOriginId.payload = complete canonical TypedIdentifierValue
RuntimeEntityOriginId.payload = canonical unsigned nonnegative runtime ordinal
```

An authored origin's payload is the complete typed StableId of a governed content definition.
It is not display text, a name, or a copied local payload. Authored resolution compares that
complete canonical value against GovernedContentDefinition.StableId in committed content and
requires exactly one match. Generic CONTENT validation already rejects duplicate StableIds.
There is no origin-to-content map, resolver callback, or secondary authored identity.

A runtime origin is allocated exactly once at runtime semantic entity creation through the
existing shared run-scoped typed runtime allocator, consuming it exactly once. No per-origin
counter is permitted. Interleaving may shift later ordinal values without semantic effect. It is immutable and opaque. Never derive it
from EventId, WorldEventId, array position, state path, hash, or content StableId. Its ordinal
has no semantic magnitude, ordering, age, similarity, or priority. Sharing the allocator with
occurrence families does not turn an entity identity into an occurrence identity. Save/load
preserves allocator continuation and every stored/reference occurrence of the referent exactly.

The authoritative Campaign-2 identity boundary rejects text-only outer payloads, unknown inner
namespaces, raw-text authored payloads, non-unsigned runtime payloads, negative runtime ordinals,
and malformed nested typed values. Only the two accepted inner origin families are admitted.
Namespaces 20/21 are historical fixture controls only and cannot stand in for these families.

## Character qualification and failure ownership

First validate the closed SemanticReferentId family. Only then apply the unchanged IDN role:
authored origin, exact singular committed-content resolution, and exact SemanticKind equality
to semantic-kind/character. This adds no CharacterId namespace. Runtime origins are valid
semantic referents, including ExposureReferentId positions, but cannot qualify CharacterId.

| Input | Boundary/result |
|---|---|
| Malformed or unknown nested origin | Canonical identity/family validation fails before the CharacterId predicate |
| Well-formed runtime origin in CharacterId position | CANONICAL_ROLE_VIOLATION |
| Well-formed authored origin with missing content | CANONICAL_ROLE_VIOLATION |
| Well-formed authored origin resolving to a non-character kind | CANONICAL_ROLE_VIOLATION |
| Duplicate content StableIds | Generic CONTENT construction rejects; never silently select a match |

No binding, state-presence, recognition CandidateDomain, body state, activity, or observer lookup
may replace this predicate. A valid origin does not by itself assert character qualification.
No new structural failure-code allocation is made here; the owning canonical boundary rejects
malformation without disguising it as failure of the narrower semantic role.

## Construction and conformance correction

Production construction must be origin-explicit, conceptually:

```text
semanticReferentFromAuthoredContent(governedContentStableId)
semanticReferentFromRuntimeEntity(runtimeEntityOriginId)
```

No authoritative from-string helper may guess origin. An upstream producer that cannot supply
its origin needs a seam decision rather than codec inference. Correct all authoritative SEM
construction/serialization paths, including candidate identities, before Campaign-2 relies on them.

This instantiates SEM's already accepted nested-origin intent. semantic-binding/0.1-candidate
need not bump solely for this conformance correction. Old text-only bytes and new nested bytes
are not equivalent. Historical fixtures/snapshots remain controls; migrate affected regression
inputs explicitly. Historical ModelIdentity/RunIdentity equality cannot be asserted where
committed bytes changed. The accepted PHEN-SEM result remains evidence for its executed corpus;
add corrected-origin regressions without rewriting that result. Behavior changes beyond identity
representation would require a SEM reopen decision.

## Frozen adversarial controls

All controls are **FROZEN, NOT PASSED**. Mechanical allocation checks do not pass runtime vectors.

| Vector | Required observation |
|---|---|
| ORIGIN-A | Equal local/content-looking values under authored and runtime origins produce unequal referent bytes; use a typed content StableId with unsigned local payload and the same runtime ordinal, preserving each grammar |
| ORIGIN-B | Authored resolution uses exact complete typed content StableId, not display/name text or an equal local payload under another namespace |
| ORIGIN-C | Runtime origin is valid ExposureReferentId but fails CharacterId |
| ORIGIN-D | Authored character kind qualifies; authored wrong kind does not |
| ORIGIN-E | Unknown inner namespace or malformed payload fails before CharacterId semantic qualification |
| ORIGIN-F | Duplicate/missing authored content cannot silently qualify |
| ORIGIN-G | Runtime creation, save/load, and allocator continuation preserve IDs without collision |
| ORIGIN-G2 | Interleave entity and occurrence allocations: distinct typed identities, unique IDs, exact save/load continuation, and unchanged semantic results despite ordinal shifts |
| ORIGIN-H | Text-only production construction cannot enter the authoritative Campaign-2 factory |
| ORIGIN-I | Substituting fixture namespaces 20/21 fails the Campaign-2 allocation/profile audit |

Affected SEM regression must cover authored origin through truth binding, observation and SEM
experience with unchanged semantic behavior, plus representable runtime origin. Existing
recognition/tracking fallibility, observer-safe provenance and truth boundaries remain mandatory.

## Preservation and deliberately deferred work

REFERENCE_MECHANISM_LEDGER SUB-003 stable typed identity and SUB-008 persistence/replay remain
accepted substrate PORT obligations. MEC-004's truth-to-observer-safe evidence boundary remains
a PORT with its accepted boundary correction; no historical
mechanism is imported or retired here. The fixture-only 20/21 distinction and previous SEM
corpus remain historical controls; corrected origins require their own regression evidence.

Origin implementation, CharacterId DomainValidator completion, corrected SEM
regressions, and FCT-3 compilation follow in that order. Integrated VAL, factory, persistence and
phenomenon qualification remain pending. Runtime-created CharacterId qualification is deferred
under IDN's existing restriction. No OriginDefinition, OriginKindId, OriginResolverId, origin
binding registry/record, new provenance graph, save field, or additional allocator is introduced.
This fixed versioned substrate rule adds no model-configurable origin semantics.
