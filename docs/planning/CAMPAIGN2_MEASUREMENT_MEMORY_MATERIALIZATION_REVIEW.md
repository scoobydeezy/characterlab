# Measurement-memory materialization review — revision 1

2026-09-08. **BLOCKED: C2-MEM-PACK-002. No admitted model or concrete freeze claimed.**

Wrapper allocation356–358 is now permanent at memory-wrapper-allocation/0.1-candidate; its201 allocation checks pass. The memory allocation342–355 is untouched. The review-only materializer builds the accepted17-descriptor delta and all16 a/p/F/R specimens from declaration constructors, without loading prior packet bytes as construction inputs. Historical packets are preservation controls only.

## Discovered IDN declaration gap

The inherited measurement-evidence packet includes the267/1 CharacterId role but **does not include a StateMapKey role for268.Bindings/1**. The accepted successor adds exactly14 memory record-field roles; none supplies that position. The frozen allocations are internally consistent, but the resulting model lacks an existing substrate prerequisite.

`src/campaign2/stateModel.ts:77` requires a materialized IDN family to have both its map-key and projected-character roles. It calls `content.mapKeyRole(268n,1n)` and rejects when absent. `src/campaign2/valDeclarations.ts:155` looks specifically for CanonicalRolePosition VariantTag2, RootStateTypeId268, FieldId1. The existing203/2 ObserverId record-field role cannot satisfy that distinct position.

The materializer independently inspects parent and successor slot5 and records zero matching map-key roles in both. The earlier exact-constructor equality checks did not catch this: equality to a constructor is not proof of substrate admissibility. All generated hashes are therefore explicitly labeled **blocked review specimens**, not admitted ModelIdentities. Runtime implementation remains gated.

## Proposed precise repair — NOT APPLIED

Amend the accepted slot5 delta to **15 declarations:14 frozen memory record-field roles plus one IDN map-key role**, using only existing canonical schemas:

```text
CanonicalRoleConstraint/265/1
    Position = CanonicalRolePosition/264/1
        VariantTag = unsigned(2)  // StateMapKey
        RootStateTypeId = unsigned(268)
        FieldId = unsigned(1)
        RecordTypeId = absent
    Role = CanonicalIdentityRole/263/1
        RequiredNamespace = unsigned(1000)
        DomainValidatorId = absent
```

This is a successor model-data declaration at an existing position grammar. It needs no new record, namespace, member, wrapper role, or allocation correction. Do not alter historical packets or either frozen memory allocation table. No role is placed on the344 composite key itself; its nested roles remain correct. IDN roster values remain S0/run data.

The proposed declaration's exact canonical bytes and readable form are in REVIEW_MANIFEST.json under blocker. It has not been inserted into any model. Acceptance will change registry bytes and all16 model commitments; the current digest must not be frozen.

## Work completed and evidence scope

The materializer emits canonical hex/readable artifacts for content, parameters, registry and their identities, plus16 complete registry/model-identity byte pairs in CONTROL_COMMITMENTS.json. The reference true/true/true/true **blocked specimen** digest is:

```text
58a49146718a42ec918787fbce5c5aac86b41b84baeedada7140ee685838ff46
```

Checks cover17 descriptors exactly once; wrappers356/357/358; bare inherited rows and350; sparse346/1/MapKey(*) authority; exact IDN family/key declarations;14-role delta; signed delay1;41-entry bundle; distinct16 commitments; wrong profile/representation/requirements; missing registry entries; requirement-byte sensitivity; bounded canonical-set permutation; original-input compiler reuse on empty/single/multiple probe cases and exclusion of generated memory event kinds. Preservation fingerprints cover133 prior formal/packet files.

MEM-PACK-D/G sensitivity is a commitment-layer result: changing requirements while retaining the inner registration changes hashes, but malformed variants do not become admitted models. MEM-PACK-E nontrivial permutation is a substrate-set witness, not a fabricated larger valid memory profile. Ordered-input evidence is a bounded corpus using the unchanged compiler, not universal enumeration or memory runtime execution. Static injection rejection is at the review data boundary; factory activation is not implemented.

The exact script can be rerun without --write to compare every emitted artifact in a fresh process. Its final manifest reports concrete check results and the IDN blocker. Reproducibility of these bytes does not cure the missing declaration or qualify MEM-PACK-A..G/MEMR-A..P.

## Next decision

Accept the one existing-schema IDN role addition and change slot5's concrete delta from14 to15, preserving the meaning that only14 are new memory record-field roles and zero are wrapper roles. Then rematerialize all16 commitments, audit the corrected IDN closure and request concrete model freeze. Until that decision, do not freeze these specimens or implement the runtime. ADAPT-9b, parent control9, PHEN-ADAPT and Campaign2 remain OPEN.

## Executed verification

The review materializer completed with531 checks and133 preservation fingerprints. A second,
fresh Node process without --write reproduced every emitted file byte-for-byte, including
all16 registry/model commitments and the blocked manifest. git diff --check passed.
These are reproducibility/consistency results only; the two explicit missing-role checks
confirm C2-MEM-PACK-002 rather than passing IDN admission.
