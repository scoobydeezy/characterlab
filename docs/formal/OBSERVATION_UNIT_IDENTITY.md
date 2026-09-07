# Observation unit identity

**Status: SYMBOLIC SHAPE ACCEPTED.** 2026-09-06.
Contract: `observation-unit-identity/0.1-candidate`. Acceptance: C2-OBS-UNIT-001.

| Symbolic family | Scope | Payload grammar |
|---|---|---|
| ObservationUnitId | model/observation vocabulary | nonempty canonical UTF-8 NFC text |

Equality is complete canonical typed-identifier byte equality. No runtime allocation, aliases,
case folding or display-name equivalence. This identity discriminator implies no physical
dimension, conversion ratio, measurement scale, SI compatibility or cross-channel comparability.

| Family | Fixed member | Admitting owner |
|---|---|---|
| ObservationUnitId | unit/fixture-pulse | first Campaign-2 bridge profile |

AllowedBridgeUnits is exactly the singleton above. It names only the abstract magnitude language
of the already fixed observable marker: Before 0, After 1, bounds [0,2], observed point [1,1],
precision 1. It does not name exposure, repetitions, dose, regulatory change or skill gain.
It is a fixed contract member, not arbitrary model-authored unit vocabulary.

## Admission and ownership

Generic ObservationChannel/201 field 5 remains TypedIdentifierValue. The first Campaign-2 bridge
requires a namespace-only CanonicalIdentityRole for ObservationUnitId, with no DomainValidator.
That role checks the family only. The bridge/profile compiler separately requires the exact
unit/fixture-pulse member. Source facts, AAI and character state cannot choose the unit.

The complete channel/bridge declaration commits this choice. The first RulesVersion/bundle
must bind the exact accepted semantics before activation. An unknown member rejects rather than
creating a new unit definition. A future second unit needs an explicitly versioned fixed token or
a separately accepted governed UnitDefinition mechanism; this version supplies neither.

REG retains its independently defined abstract scalar lattices, with no Unit field, conversion
or observation-unit reuse. Generic observation/0.1 control behavior and fixture bytes remain valid
under their own scope. No global narrowing of type 201 field 5 is authorized.

No UnitDefinition, unit registry, conversion table, dimension identity, scale parameter,
equivalence relation, validator, record, provenance type or occurrence is introduced.

## Frozen implementation controls — NOT PASSED

| Control | Obligation |
|---|---|
| OBS-UNIT-A | Wrong namespace rejects first bridge profile. |
| OBS-UNIT-B | Empty/non-NFC payload rejects. |
| OBS-UNIT-C | Correct namespace with wrong member rejects. |
| OBS-UNIT-D | Fixture namespaces cannot substitute. |
| OBS-UNIT-E | Channel, modality, regulatory-variable and content identities cannot be cast to unit identity. |
| OBS-UNIT-F | Unit comes only from committed channel, not facts, AAI or character state. |
| OBS-UNIT-G | Unit-bearing model declarations participate in model commitment; invalid alternate members still reject. |
| OBS-UNIT-H | Count intervention preserves unit and observer-safe branch bytes. |
| OBS-UNIT-I | No conversion/rescaling operation enters OBS, projection, REG or ADAPT. |

Numeric allocation is authorized only as the next separate step. This symbolic acceptance freezes
no number and passes no implementation gate. First-profile enforcement awaits allocation freeze.


## Subsequent allocation and implementation disposition — 2026-09-06

The separate numeric review ACCEPTED AND FROZE observation-unit-allocation/0.1-candidate:
ObservationUnitId/1039 and the sole unit/fixture-pulse member. The earlier allocation-pending and
NOT PASSED statements above record the symbolic-acceptance boundary. Executed OBS-UNIT-A..I
component evidence is now recorded in
[the implementation checkpoint](../planning/CAMPAIGN2_OBSERVATION_UNIT_IMPLEMENTATION.md).
Whole-factory and phenomenon qualification remain pending. The identity semantics are unchanged.
