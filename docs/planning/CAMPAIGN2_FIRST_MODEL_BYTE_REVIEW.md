# First bounded Campaign-2 model — concrete byte review

**Status: CONCRETE BYTES ACCEPTED AND FROZEN.** 2026-09-06.
Implements accepted C2-MODEL-PACK-001 with both cross-slot clarifications. This packet requests
the concrete model freeze required before FCT-5; it does not request activation or a phenomenon verdict.

## Complete artifacts and reproducibility

[REVIEW_MANIFEST.json](campaign2-first-model/REVIEW_MANIFEST.json) inventories all seven exact
cenc/1 byte artifacts, sizes, SHA-256 values, actual ModelIdentity version components, fixed
input/persistence profiles and the exact semantic compatibility matrix. Every artifact has a
`.cenc.hex` encoding and a decoded JSON rendering; neither rendering replaces the bytes.

| Artifact | Bytes | Exact SHA-256 |
|---|---:|---|
| [Content manifest](campaign2-first-model/content.json) | 124 | 5d950405ca403c527029c16ffaadc1f12ed0b0785ac79f44f4bc20142ae2b1dd |
| [Parameter manifest](campaign2-first-model/parameters.json) | 11 | 689e8db5bcd83878d3fed0b65f1bb733ee8e50d34969c7d2cb3e02d2c445a8c4 |
| [Registry manifest](campaign2-first-model/registry.json) | 45760 | 1104a2a43c33f62c15ebf7ceb9b5e2ef050b67a8a3d658b14199c04158f8b764 |
| [ModelIdentity](campaign2-first-model/model-identity.json) | 337 | 40bcb3c3feec3e3eaaa35161b8164cfdb56eb11f0bd452393f9ec08af489ffd0 |

ContentIdentity, ParameterIdentity and RegistryIdentity are also materialized as exact records
100, 101 and 102. Their bytes are derived from the actual manifests, not supplied by a test or caller.
The ModelDigest above is diagnostic; all complete source bytes accompany it.

`node scripts/materialize-campaign2-model.mjs --verify` regenerates and recompiles the candidate in
a fresh process and verifies exact byte, readable-rendering and review-manifest parity. `--write`
is the explicit materialization operation. No scheduler is constructed by this script.

## Values proposed for freeze

These values are explicit specimen choices, not psychological or physical assertions. They are
not inherited as authority merely because some earlier controls used similar integers.

| Operand | Exact candidate value |
|---|---|
| RulesVersion | rules/campaign2-bounded-bridge/0.1-candidate |
| ContentSchemaVersion | content/0.2-candidate |
| RegistrySchemaVersion | campaign2-registry/0.1-candidate |
| ParameterSchemaVersion | campaign2-parameters/0.1-candidate |
| NumericProfileVersion | numeric/exact-1 — accepted bounded semantics in [BOUNDED_NUMERIC_PROFILE.md](../formal/BOUNDED_NUMERIC_PROFILE.md); no universal numeric-profile claim |
| RandomAlgorithmVersion | rng/sha256-addressed-128-v1-candidate; no random consumer in this model |
| Work limit, 133/1 | 100 settlement work items per simulation instant |
| Sole authored content | GovernedContentDefinitionId/1038("character/bridge-subject"), kind semantic-kind/character; remaining required type-170 fields are explicit empty lists |
| Character identity | SemanticReferentId/1002(AuthoredContentOriginId/1037(the complete 1038 ID above)); no new CharacterId namespace |
| REG variable | RegulatoryVariableId/1029("variable/fixture-regulation"); scale 10, bounds [0,100] |
| REG parameter | RegulatoryReferenceParameterId/1030("parameter/fixture-reference"); rate numerator 0, denominator 1, bounds [0,100] |
| REG character reference | Value 50, remainder 0, anchor instant 0, exact parameter ID above; complete singleton character coverage |
| Tolerance / sensitization scales | 10 / 10; accepted distinct bounded/nonnegative domains remain unchanged |
| Load domain | LoadDomainId/1033("load/fixture-load"); scale 10, Bounded capacity 10 |
| Procedure | ProcedureId/1034("procedure/fixture-practice"); competence scale 10 |
| Observer | ObserverId/1000("observer/bridge-subject") |
| Channel / modality | ObservationChannelId/1005("channel/fixture-pulse"), ModalityId/1006("modality/fixture-pulse") |
| Channel subject | Complete authored character semantic referent above |
| Unit | ObservationUnitId/1039("unit/fixture-pulse"); exact permanent member; 201/5 namespace-only role, no DomainValidator |
| Other channel operands | Increase, BoundedStateChange, precision 1, AlwaysPresent, empty visible-provenance slots, no experimental control |

Five rules use distinct AdaptationRuleId/1035 payloads. All have Step +1 and Always gate:

| Rule payload | Match | Target / key derivation |
|---|---|---|
| rule/fixture-tolerance | Exposure to the complete character referent | regulatory-adaptation / leaf/tolerance; ExposureVariable with the sole REG variable |
| rule/fixture-sensitization | Same exposure | regulatory-adaptation / leaf/sensitization; ExposureVariable with the sole REG variable |
| rule/fixture-regulatory-displacement | Same exposure | regulatory-adaptation / leaf/regulatory-displacement; RegulatoryVariable with the sole REG variable |
| rule/fixture-accumulated-load | Same exposure | regulatory-adaptation / leaf/accumulated-load; Load with the sole load domain |
| rule/fixture-procedural-competence | Practice of the sole procedure | procedural-skill / leaf/procedural-competence; Procedure from admitted basis |

The exposure consumer owns the first four rules, with exact ReadDomain 302/1..4 wildcards.
The practice consumer owns the last rule, with exact ReadDomain 303/1 wildcard. Their targets
are disjoint. No count-dependent membership or new rule language is introduced. Other legal gate,
negative-step, no-match and removal branches remain required qualification controls even though
the first concrete specimen uses these five Always/+1 rules.

## Exhaustive model inventory

Position 0 contains **175 exact trusted schema descriptors** and **82 semantic entries**:
58 exact inherited SEM/C2 union entries plus the following 24 domain entries. Full descriptor,
union and field-by-field values appear in registry.json; unsupported build schemas are not inferred
to be active operations. Descriptor disagreement rejects before they could affect interpretation.

| Entries | Count | Exact definition/version home |
|---|---:|---|
| Character kind and character validator | 2 | 329 / content-kind/0.1-candidate; 330 / governed-domain-validator/0.1-candidate |
| definition/campaign2-state-families | 1 | Ten logical families; ADAPT 0.31 |
| Five permanent leaf members | 5 | leaf/tolerance, leaf/sensitization, leaf/regulatory-displacement, leaf/accumulated-load, leaf/procedural-competence; ADAPT 0.31 |
| Sole load and procedure definitions | 2 | Exact values above; ADAPT 0.31 |
| Sole REG variable registration | 1 | Nested domain/reference/anchor/parameter; REG 0.5 |
| Five named rules above | 5 | ADAPT 0.31 |
| Two V06 registrations | 2 | transition/regulatory-adaptation and transition/procedural-adaptation; wrapper extension 0.6, executing ADAPT 0.31 |
| Two V04 registrations | 2 | OutcomeEvaluationTransition and OutcomeLearningEvidenceTransition; wrapper admission 0.4, executing EVID 0.5 |
| Source, bridge, settlement and admission singletons | 4 | definition/authored-adaptation-facts, definition/authored-fact-consequence-bridge, definition/adaptation-settlement, definition/transition-admission; existing exact owners/versions |

Position 1 is the exact ordering-phases/2-candidate registry, including non-schedulable 150.
Position 2 has exactly two physical owners: regulatory-adaptation owns 302/1..4, procedural-skill
owns 303/1. Each has one mapKey wildcard, its exact canonical value record 297..301, and removal
allowed. No authority is copied into topology, grammar, role or parameter records.
Position 3 is set([]). Position 4 has exactly five RecordKey grammars, schemas 292..296, matched
against the union of positions 2 and 3 in one compilation pass. Position 5 has **58 exact role
constraints**: all C2 atomic typed-ID fields whose accepted allocation grammar names their family,
plus the explicitly scoped inherited OBS/SEM identity fields. CharacterId fields carry the sole
character validator; exposure fields remain namespace-only. All roles are explicit in registry.json.

The occurrence table contains 227→1106, 269→1116, 270→1117, 307→1118, 324→1119 and 325→1120,
each using required field 1 and its namespace-only role. D retains its own source/bridge occurrence
allocation, including pulse truth 1121 and observation 1115; no parallel allocator or identity is
introduced. The admission singleton contains exactly both routes and all four transition mappings.
EVID reads/writes nothing; the two phase-130 transitions are mandatory consequences of each actual
SEM freeze. Eight cognitive logical families remain unmaterialized.

## Compatibility and execution closure

The machine review manifest lists the exact semantic bundle. RulesVersion checks compatibility;
it never synthesizes actual ContentSchemaVersion, RegistrySchemaVersion, ParameterSchemaVersion
or their manifest bytes. Its fixed run profiles are campaign2-ordered-input/0.1-candidate and
campaign2-persistence/0.1-candidate, without a caller flag, default or latest alias.

AdmittedExecutionClosure for this specimen consists of authored source 110, required bridge
120..124, the two EVID consumers at 130 and the exclusive ADAPT consumers at 140. No ordinary
current-lane recognition, general learning, arbitrary handler, draw consumer or continuing coupling
is registered. Its five writable maps hold only integer magnitudes; it has no read-only/run-owned
anchor family. REG anchors remain exclusively nested in model declarations.
Thus the accepted bounded profile has the required no-run-anchor/no-draw/no-coupling direction for
132/8..10; actual save derivation/restore proof remains FCT-5. The build's support for other schemas
does not enter this execution closure. No model freeze implicitly freezes run inputs, seed or state.

## Implementation and proof disposition

`modelPackaging.ts` implements six-slot decoding, exact trusted descriptor/union parity,
whole-model VAL traversal, cross-slot state-model compilation, fixed bounded entry dispatch,
domain/rule/admission/bridge composition, real commitments and one-slot parameter compilation.
EVID's existing specialization checks are shared with construction, without creating an ingress
context during model preparation. `firstModelCandidate.ts` is a review builder, not a production
default. No FCT-5 create/restore facade or public activation entry point is added.

**Validation: 50 source files / 386 tests PASS; build and reference boundary PASS.** All five
permanent allocation audits pass (60 / 40 / 43 / 37 / 77 checks). Fresh-process materialization
and stored byte/rendering parity pass. No prior frozen artifact or reference source is changed.

| Control | Evidence / remaining scope |
|---|---|
| MODEL-PACK-A | Real full-registry commitment and candidate/parameter identity sensitivity exercised; exhaustive independent per-slot mutations remain qualification work. |
| MODEL-PACK-B | Arity/carrier/descriptor mutants reject; complete trusted union inventory enforced. Exhaustive closed-entry mutants remain FCT qualification. |
| MODEL-PACK-C | Mutating all caller bytes and version fields during async preparation preserves the original compiled identity; an independently supplied ModelIdentity field rejects. |
| MODEL-PACK-D | Parameter change changes actual ModelIdentity; internal candidate runtime uses compiled limit. Limit 8 fails/rolls back where committed 100 succeeds. Future public-facade override controls remain FCT-5. |
| MODEL-PACK-E | Foreign required version fields reject; exact input/persistence selection is bound to RulesVersion. No default selection. |
| MODEL-PACK-F | Specimen closure inspected; persistence-derivation and closure-expansion mutants remain NOT PASSED. |
| MODEL-PACK-G | Missing writable/read-only grammar, orphan grammar and writable/read-only overlap independently reject. |
| MODEL-PACK-H | Whole-manifest traversal detects validator references nested in slot-0 occurrence rules even after removing all slot-5 validator references; removing its declaration rejects. Existing VAL tests cover all three accepted role-bearing schema positions, including 266. No 266 container is invented for the zero-projection bounded model. |

The nested occurrence-role test isolates VAL traversal; its synthetic role is not a new legal
EVID occurrence identity. Internal runtime controls also execute one exposure source and one practice
source from the real candidate: four then one adaptation evaluations and inhabited EVID output.
These tests are component evidence, not whole FCT-4/6, VAL or PHEN-ADAPT acceptance.

SUB-001 exact arithmetic, SUB-003 typed identity, SUB-008 atomic state/identity handling,
SUB-009 control comparisons and SUB-011 forward corrections remain in force. Historical mechanisms
are not retired, substituted or copied from reference code. No new allocation is requested.

## Requested decision

Review and freeze the concrete values, exact compatibility matrix and seven byte artifacts in
REVIEW_MANIFEST.json, including work limit 100 and the explicit numeric/exact-1 binding above.
FCT-5 may begin only after that byte review; authoritative activation and qualification remain
separate gates. The currently generated artifacts remain REVIEW CANDIDATE until that verdict.


## Final authority correction and conditional freeze — 2026-09-06

The review accepted the semantic inventory, every specimen value, work limit 100 and the exact
RulesVersion bundle. It withheld byte freeze only pending the two version authority anchors and
authorized freeze without another semantic review once those anchors were resolved and bytes
reproduced. The accepted bounded contract is now
[BOUNDED_NUMERIC_PROFILE.md](../formal/BOUNDED_NUMERIC_PROFILE.md), exact numeric/exact-1.
RandomAlgorithmVersion was already explicitly fixed at
[DETERMINISTIC_SUBSTRATE.md:173](../formal/DETERMINISTIC_SUBSTRATE.md) under accepted substrate
and RND-001; no bookkeeping rename, RNG proof or algorithm change was needed.

MODEL-BYTE-A PASS: all seven .cenc.hex files, seven decoded JSON renderings (including identities),
and REVIEW_MANIFEST.json were actually deleted, reconstructed from source alone in a new process,
and compared byte-for-byte. [Stored evidence](CAMPAIGN2_MODEL_BYTE_A.json) records all 15 comparisons.
The seven source/identity byte artifacts reproduce their previously reviewed bytes exactly; all
seven hashes are unchanged. Only disposition/authority metadata and the 1030 prose correction change.

The conditional freeze is satisfied: all seven artifacts and the compatibility matrix are
ACCEPTED AND FROZEN together. ModelDigest remains
40bcb3c3feec3e3eaaa35161b8164cfdb56eb11f0bd452393f9ec08af489ffd0.
FCT-5 is UNBLOCKED TO BEGIN. No create/restore facade or authoritative activation is inferred.
PHEN-ADAPT, complete AD-E branch/mutation proof, FCT-4/6 and VAL qualification remain pending.
Earlier candidate/withheld wording above records review history, not the current disposition.
