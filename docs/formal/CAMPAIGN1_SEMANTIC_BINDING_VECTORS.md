# Campaign 1 Semantic-Binding Conformance Vectors

**Status:** planned candidate manifest, version `campaign1-semantic-binding-vectors/0.1-candidate`

These vectors govern `semantic-binding/0.1-candidate`, `SEM-001`, and `PHEN-SEM-001`. Campaign 0 vectors and accepted bounded-observation vectors remain mandatory substrate controls. No row is executable until the candidate contract resolves its record identities, registries, phase map, and provenance policy.

| Vector | Required proof | Current evidence |
|---|---|---|
| `CV-SEM-001` | Two world events containing identical referents in different `EventRoleId` bindings produce structurally distinct truth bindings and permitted perceived bindings. | pending |
| `CV-SEM-002` | One referent simultaneously occupying several event roles retains every binding occurrence; no referent-keyed deduplication occurs. | pending |
| `CV-SEM-003` | Visibility is binding-specific. Mina, Darius, and Glen receive exactly their declared permitted binding sets from the same event. | pending |
| `CV-SEM-004` | A visible but unrecognized entity yields a `PerceptualReferentId` and no truth-side `SemanticReferentId`. | pending |
| `CV-SEM-005` | Correct recognition and confident misrecognition attach different hypotheses to equal perceptual evidence without changing that evidence. | pending |
| `CV-SEM-006` | Later correction appends a new hypothesis/belief transition; the original experience and contemporaneous hypothesis remain byte-identical. | pending |
| `CV-SEM-007` | Truth binding IDs and truth referent IDs are structurally absent from character evidence. Stable opaque-handle equality cannot reveal that two hidden sources are equal. | pending |
| `CV-SEM-008` | `EventRoleId` and `CausalRoleId` remain independently present and typed; deriving a causal role cannot erase or mutate event-role evidence. | pending |
| `CV-SEM-009` | Character-relative causal-role evidence changes only when permitted observations change, never when only hidden truth-side causal structure changes. | pending |
| `CV-SEM-010` | Every perceived binding has complete omniscient trace ancestry to one truth binding and observation operation, while the character projection cannot traverse that ancestry. | pending |
| `CV-SEM-011` | Scalar measurement evidence is referenced as supporting evidence and is neither required for every binding nor treated as referent identity or role evidence. | pending |
| `CV-SEM-012` | Deterministic omniscient, contemporaneous-character, and current-reinterpretation renderers consume typed records; changing presentation metadata changes no authoritative record. | pending |
| `CV-SEM-013` | Perceptual-referent allocation obeys the accepted observer/track scope across same-track, interrupted-track, save/load, and replay fixtures. | blocked on allocation decision |
| `CV-SEM-014` | Invalid registry IDs, multiplicity, hidden references, forged perceptual IDs, illegal causal derivation, or noncanonical order abort the complete instant with no committed state, allocation, trace, or output. | pending |
| `CV-SEM-015` | Equal truth-side semantic facts with different permitted sensory evidence produce different perceptual classifications; hidden facts never copy through merely because they are registered. | pending |
| `CV-SEM-016` | Perceptual classification, track continuity, and instance recognition are independently intervenable: each can change while the other two remain structurally fixed where the fixture permits. | pending |
| `CV-SEM-017` | Every perceptual classification uses a registered facet and exact declared value type; unknown facets, freeform tags, and wrong-typed values fail closure and roll back. Missing classification remains distinct from an explicit boolean-false assertion. | pending |
| `CV-SEM-018` | Classification alone produces no appraisal, affect, motive, pressure, or Reason. The `ClassificationToPressure` shortcut fails read-domain or receiving-seam closure. | pending |

## Mandatory `PHEN-SEM-001` fixture

Truth event:

```text
Mina skipped rope with Glen in the Library using the Lead Pipe.
```

The fixture uses separately identified bindings for action, actor, companion, location, and instrument. Observer projections are:

```text
Mina:    action-like referent + companion-like person + place + instrument
Darius:  actor-like person + action-like referent + place; no Glen binding; no instrument
Glen:    actor-like person + action-like referent + place + instrument
```

The character projections use perceptual referents, not the truth identities named in this explanatory table. Their permitted classification evidence also differs: one observer receives person-like but no identity evidence, one receives interior-space-like but not the truth location identity, and one receives object-like/metal-like evidence without the truth object identity. At least one observer begins unfamiliar, one produces a correct recognition hypothesis, and one produces a misrecognition later corrected.

The fixture independently varies:

```text
classification: object-like / metal-like / unresolved
tracking: same continuous perceived instance / interrupted new instance
recognition: unresolved / correct candidate / incorrect candidate / corrected candidate
```

No one axis is inferred merely from another.

## Required negative controls and first divergence

Each control must either fail structural closure or report its first illegal field/consequence:

- `TruthIdentityCopy`;
- `ReferentKeyedBinding`;
- `SlotWideVisibility`;
- `EventRoleEqualsCausalRole`;
- hidden-truth causal-role derivation;
- `OpaqueButLinkableTruthHandle`;
- `RecognitionRewrite`;
- `TruthFacetCopy`;
- `FreeformTagBag`;
- `ClassificationToPressure`;
- `AuthoritativeProse`.

## Acceptance gate

`SEM-001` closes only when:

1. every vector is `PASS`;
2. permanent record/enum IDs, governed role definitions, and the finite typed semantic-facet definitions used by the fixture are registered;
3. exact perceptual-referent allocation and lifecycle rules are accepted;
4. the event, observation, experience, and recognition phases are registered;
5. character evidence contains no unobserved truth identity, unobserved truth classification, or linkable secret handle;
6. the complete multi-observer fixture passes through immediate consumers and save/load replay;
7. all negative controls report exact first divergence or closure failure; and
8. classification cannot directly enter psychological-pressure seams;
9. full ontology inheritance and affordance closure remain explicitly deferred to `ONT-001`; and
10. the observation verdict and campaign ledgers record the accepted scope without broadening `MATH-006`.
