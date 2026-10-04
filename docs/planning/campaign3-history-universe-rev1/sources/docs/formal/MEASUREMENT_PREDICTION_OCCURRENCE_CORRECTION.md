# Measurement prediction: occurrence-governance correction

2026-09-09. **Accepted corrective shape by agent self-review.**
Current composed version: **measurement-prediction/0.2-candidate**.
Current read registration: **measurement-prediction-read-registration/0.2-candidate**.
All other component meanings and version labels remain as reviewed.

This document explicitly supersedes the occurrence-output portion of
MEASUREMENT_PREDICTION.md and its revision1 planning composition. Those artifacts
remain unchanged history. No prediction runtime/model has been constructed or
activated. PRED-A..P remain NOT PASSED and Campaign2 remains OPEN.

## Error found after the first numeric review

The proposal called275 an OutputOccurrenceRule. The accepted substrate says:

- 275 is TransitionInputProducerV04, used inside274 for producer authentication.
- 278 is OccurrenceIdentityRule: IdentityFieldId and IdentityRole.
- 279/3 is the shared OccurrenceIdentities map from exact schema reference to278.

These are verified in CAMPAIGN2_PERMANENT_ALLOCATION.md and the actual
compileOccurrenceIdentities implementation. The initial audit checked numeric
existence and field ordering, but did not check the referenced schema's semantic
name. Its PASS was allocation consistency only and missed this contract error.
The earlier whole-shape self-acceptance is superseded in this narrow respect.

The occurrence rule is already available through279/3. Merely replacing275 with278
in the new output definition would duplicate that authority unnecessarily. The
corrected output definition declares only the schema and its registration fixes
conditional cardinality. The sole identity rule is the existing shared map entry:

    (MeasurementPredictionReadout/366, schema1)
        -> OccurrenceIdentityRule/278(
             IdentityFieldId=1,
             IdentityRole=(RequiredNamespace=1127, DomainValidatorId=absent))

This is not a new identity/provenance system. Registered output and shared rule
must agree through the existing compiler. Producer275 retains its original use
inside application input admission274 and is not redefined.

## Correct-forward schema revisions

Permanent type/field/member/namespace assignments from the first allocation are not
renumbered, reused or erased. Draft and accepted allocation bytes/digests remain
unchanged. Append the following explicit schema revisions:

| Record | New schema | Field changes |
|---|---:|---|
| MeasurementPredictionReadOutputDefinition/367 | 2 | Field1 OutputRecordSchema remains required254/1. Field2 OutputOccurrenceRule is retired, declared optional for canonical field-presence encoding, and MUST be absent in every admitted value. Its old number/name are reserved and never reused. |
| MeasurementPredictionReadRegistration/368 | 2 | All ten field IDs/names/presence rules remain. Field7 OutputDefinitions refers to set<367/schema2>, replacing the old explicit367/schema1 reference. |

Schema367/2 serializes the retired field2 with presence0, as cenc/1 requires for a
declared absent field. Field2 presence1 rejects under this version; it is not an
extension point. No new variant tag or finite-value allocation is introduced.
Schema367/1 and368/1 remain historical allocation artifacts and are excluded from
the future prediction profile. They have never been admitted by a production model.

All other prediction records retain schema1. Readout366/schema1 and its1127
identity remain unchanged. No namespace, member, role position or occurrence entry
is added by this correction. The new profile's schema inventory selects exactly
367/2 and368/2; it must not choose the first schema matching only RecordTypeId.

Normal application/read use composed ExecutingSeamVersion0.2. Application
registration grammar0.1, target projection0.1, opportunity0.1 and both ablation
semantics0.1 remain unchanged in meaning; read registration grammar is now0.2.
Its disabled form also uses368/2 with empty outputs. No old model version or
manifest is silently rebound.

## Required added negative controls

PRED-E and output-closure validation must reject367/1,368/1 and367/2 with retired
field2 present; missing/mismatched singleton occurrence rule and wrong output role
must reject before activation. Read output allocation must use the actual shared
rule and runtime allocator. No second rule stored in a registration is consulted.

The revised numeric audit checks semantic names of every reused active schema
reference, not only whether its number exists. It must specifically detect the
old275-as-occurrence-rule substitution. This is a mechanical contract check, not
a claimed runtime mutation witness.

## Disposition

Prediction target, exact mean, supports, ownership, timing and ablation semantics
are unchanged. Whole shape is accepted as corrected at0.2 by agent self-review.
Separate schema-revision allocation audit/freeze follows; full model/profile
packaging still precedes implementation. No runtime conformance or full campaign
completion is inferred from this repair.
