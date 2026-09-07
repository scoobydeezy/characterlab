# C2-OBS-UNIT-001 — governed identity for the fixed bridge's UnitId

2026-09-06. **SYMBOLICALLY ACCEPTED. Numeric allocation is the next separate review step.**

## Inspection and exact scope

The accepted D bridge requires a complete committed ObservationChannel/201, including its
required field 5 UnitId. Removing that field, using false, or inserting an untyped label would
violate the existing schema. The bridge projection correctly preserves the measured observation;
it does not eliminate the channel's required model declaration.

The actual observation compiler and channel decoder type UnitId as generic TypedIdentifierValue.
That makes the operand encodable, but does not assign its governed identity home. The accepted
REG draft already records this exact inspection in its “Focused unit inspection” paragraph:
no accepted UnitId family, definition or scope was found; old observation controls use fixture
namespaces 24004/25012/26004. REG consequently removed its proposed Unit field and retained
independent scalar lattices. That accepted REG disposition remains unchanged.

The current permanent inventory supplies ObserverId/1000, ObservationChannelId/1005 and
ModalityId/1006. Source and formal/planning searches found no allocated observation UnitId family.
The C2 bridge composition now uses the existing channel/modality families; its UnitId remains
explicitly local test vocabulary. Namespaces 20/21 and historical test namespaces are not promoted.
GovernedContentDefinitionId is a content definition identity, RegulatoryVariableId is a lattice
discriminator, and neither is an accepted observation-unit identity.

This blocks a production-ready first-model bridge inventory, not component testing. It does not
reopen C2-BRIDGE-OBS-001, the observation measurement, SEM, EVID, REG or ADAPT mathematics.
The scoped projection, sole-occurrence control, actual OBS→SEM→EVID path and paired runtime
controls have been implemented independently using explicitly non-production test vocabulary.

## Accepted symbolic resolution

Accept `observation-unit-identity/0.1-candidate`:

```text
ObservationUnitId
    dedicated governed typed-identifier family
    payload: nonempty canonical NFC text
    equality: complete canonical typed-identifier bytes

first bridge profile member
    unit/fixture-pulse
```

The existing canonical field remains named UnitId. This proposal neither adds nor renames a field.
The new family supplies its identity domain for the first bridge. The first model admits exactly
the member above at ObservationChannel/201 field 5, with a namespace-only CanonicalIdentityRole
and no DomainValidator. Global observation/0.1 controls retain their prior generic decoding scope.

`unit/fixture-pulse` names the abstract magnitude unit of D's already fixed observable marker:
Before 0, After 1, bounds [0,2], measurement [1,1], precision 1. It says nothing about hidden
contact count, repetitions, dose, reward, regulatory scale, physiological quantity or skill gain.
The channel owns this fixed choice; source facts and character state cannot supply it.

No unit arithmetic, dimension system, conversion, equivalence relation, UnitDefinition record,
unit registry, parameter, validator, occurrence or provenance token is added. The accepted symbol
and its exact interpretation are committed through the complete channel/bridge declaration and
the concrete first-model RulesVersion/bundle. A different unit language requires an accepted
profile/contract extension; generic typed-ID encodability grants no such permission.

After symbolic acceptance, use the existing additive allocation/audit process to assign the
namespace and freeze this member. No numeric value is selected in this decision packet. Do not
implement production namespace checks or first-model bytes until that allocation is accepted.

## Proposed frozen controls — NOT PASSED

- Wrong identity namespace, empty/non-NFC text or unadmitted first-profile member rejects.
- Fixture namespaces cannot stand in for the production UnitId family.
- ChannelId, ModalityId, content identity and RegulatoryVariableId cannot be cast to UnitId.
- Unit choice is read only from the committed channel; changed declaration changes ModelIdentity.
- Count-only intervention leaves unit/channel and observation/X/E/L bytes unchanged.
- No conversion or rescaling enters measurement, projection, REG or ADAPT evaluation.
- Existing observation control bytes and frozen allocation artifacts remain unchanged.

## Explicitly deferred

Physical dimensions, general unit vocabulary/conversion, cross-channel comparability, sensor
calibration, dose/duration semantics and REG unit semantics. The separate concrete RulesVersion
and complete first-model dispatch matrix still require review before FCT-5; this packet does not
claim that the current test fixture is an authoritative model or that FCT-4/5/6 are qualified.

## Symbolic acceptance — 2026-09-06

ObservationUnitId and unit/fixture-pulse are accepted at observation-unit-identity/0.1-candidate. AllowedBridgeUnits is a fixed singleton, not open authored vocabulary. CanonicalIdentityRole checks namespace only; the bridge/profile compiler separately checks the exact member, with no DomainValidator. Generic ObservationChannel.UnitId and REG remain unchanged. OBS-UNIT-A..I are frozen NOT PASSED.

The separate allocation candidate is docs/formal/OBSERVATION_UNIT_PERMANENT_ALLOCATION.md with machine table and audit alongside it: namespace 1039, one exact fixed member, zero records. Mechanical audit passes 77 checks. The candidate is not frozen and no runtime namespace/member enforcement is implemented before numeric acceptance.


2026-09-06 numeric verdict: observation-unit-allocation/0.1-candidate ACCEPTED AND FROZEN.
ObservationUnitId/1039 and unit/fixture-pulse are permanent; no renumbering/reuse/shifting,
open vocabulary, DomainValidator, unit mathematics or REG change. Audit: 77 checks PASS.
First-profile namespace/member enforcement now has component evidence in
[CAMPAIGN2_OBSERVATION_UNIT_IMPLEMENTATION.md](CAMPAIGN2_OBSERVATION_UNIT_IMPLEMENTATION.md).
Earlier pending-allocation notes are historical. Allocation alone passed no runtime gate.
