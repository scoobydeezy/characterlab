# First Campaign-2 model: governed content StableId home

**Status: RESOLVED — SYMBOLIC SHAPE ACCEPTED; ALLOCATION FROZEN.** 2026-09-06.
Decision label: `C2-CONTENT-ID-001`. Review accepted 2026-09-06.

Current authority: [content-definition-id/0.1-candidate](../formal/CONTENT_DEFINITION_ID.md).
The separate 37-check numeric gate passed before implementation; 1038 is permanent and frozen
in CONTENT_ID_ALLOCATION_TABLE.json. The six-test component suite covers CONTENT-ID-A..H,
including model commitment sensitivity and generic CONTENT polymorphism. CONTENT-ID-F also
has a source capability inspection: the constructor has no allocator dependency.
Factory activation and integrated qualification remain pending.

The inspection below records the reason for the accepted producer boundary.

## Inspected distinction

`referent-origin/0.1-candidate` and its permanent allocation remain accepted. Exactly two inner
origin families are admitted: 1037 AuthoredContentOriginId and 1122 RuntimeEntityOriginId.
An authored origin structurally contains the complete canonical TypedIdentifierValue equal to
one GovernedContentDefinition.StableId. CharacterId qualification is implemented with that exact
relation and the accepted character-kind predicate.

This slot is structurally expressible now. Neither the origin codec nor generic CONTENT requires
another stored field or another mapping. The remaining question is the identity authority for the
first production producer's actual content StableId values, beneath the origin wrapper.

| Inspected authority/source | Finding |
|---|---|
| CONTENT_GOVERNANCE.md, content/0.2-candidate | Requires stable typed identities and governed content; 170/1 already owns StableId. It does not name a concrete shared content-definition identity namespace. |
| src/substrate/contentManifest.ts, compileGovernedContentManifest | StableId is TypedIdentifierValue; canonical validity, uniqueness and content references are checked. Canonical acceptance alone does not assign a permanent identity-family meaning. |
| src/test/contentGovernance.test.ts:14–15 | Existing CONTENT identities use namespace 23000 with text payloads content/action/help and content/action/thank, in the fixture control. |
| SEM numeric registry and frozen Campaign-2, VAL and origin tables | No ContentDefinitionId, GovernedContentDefinitionId, AuthoredContentId or equivalent general content-definition home was found. Existing named families have other declared roles. |
| Current origin/VAL/PRJ tests | Use explicit namespace-20 content StableIds as local controls. Namespace 20 is never used as an admitted origin family. These tests do not establish a permanent production content-ID allocation. |
| EVID accepted registry-packaging inspection | Explicitly distinguishes a codec accepting a canonical StableId from authority to repurpose another identity family's semantic role. This is the relevant preservation precedent, not a new generic namespace-rejection rule. |

The previous review authorizes permanent 1037/1122 after audit. It does not assign a text-payload
base content-ID family. AuthoredContentOriginId cannot simply be given text instead: its accepted
payload is a complete typed StableId. ObserverId, RegistryDefinitionId, SemanticKindId and other
named permanent families must not be borrowed merely because they can encode the desired text.
Nor does the existing 23000 test, by itself, authorize promotion to permanent content identity.

## Accepted symbolic resolution

Add one CONTENT-owned identity family admitted for the first Campaign-2 producer's uses of the existing 170/1 StableId position:

```text
GovernedContentDefinitionId
    model/content scope
    nonempty canonical NFC text payload
    immutable authored identity
    unique by complete canonical identity within committed content
    no display-name matching, aliasing, case folding, or runtime allocation
```

The first production character content definitions explicitly use that family for their StableId.
Their semantic referents then use:

```text
SemanticReferentId / 1002 (
    AuthoredContentOriginId / 1037 (
        GovernedContentDefinitionId(exact authored content key)
    )
)
```

This fills an already required slot. It introduces no extra copy of that slot, character identity,
origin family, registry entry, resolver, binding, provenance graph, record, state root or save field.
It does not restrict the general authored-origin payload grammar to this one StableId family.
Other complete typed StableIds remain structurally representable under the accepted contract;
their use by an authoritative producer still needs its own legitimate identity authority.
No new CanonicalRoleConstraint on 170/1 field 1 is proposed, and VAL's kind/qualification semantics
are not changed. Only the first producer's governed identity home is being settled.

The separate append-only audit passed all 37 checks. Namespace 1038 is permanent and frozen
under content-id-allocation/0.1-candidate. Neither 20/21 nor 23000 was promoted, and no
previous allocation bytes changed. Individual values remain model-authored, not registry members.
The review selected the concrete governed family; the earlier alternative of interpreting
fixture namespaces as production authority was not selected.

## Bounded impact and completed independent work

This resolves first-model content identity without reopening origin, IDN, PRJ, EVID, REG or
ADAPT. src/campaign2/contentProfile.ts enforces the accepted family at construction; the generic
VAL/CONTENT compiler continues to accept legitimate typed StableIds from other families.

Meanwhile, origin codecs, exact CharacterId qualification, recursive record-role validation,
PRJ keyed-family grammar coverage, read-only/writable disjointness, initial/restore/read/patch
validation and WRT precedence have been implemented incrementally. Negative byte-intake controls
reject object/proxy impostors without invoking their getters. Legacy component fixtures retain clearly identified local content-ID controls. New first-profile
controls use the permanent family. No historical fixture result is relabelled as byte-equivalent.

Subject-projection construction still needs the shared admitted-input capability before selector
extraction. Remaining FCT-3 REG/ADAPT construction, FCT-4 runtime adapters, first profile binding,
FCT-5 facade and integrated qualification remain pending. No activation is claimed.

## Component verification

CONTENT-ID-A..H have component evidence in src/test/contentDefinitionId.test.ts (six tests).
A checks grammar including non-NFC, empty and non-UTF-8-representable host text; B/D preserve
complete canonical equality through authored origins; C rejects duplicate StableIds; E proves
content/model commitment sensitivity; G preserves runtime-origin exclusion; H rejects fixture
families only at the first-profile boundary while generic CONTENT remains polymorphic.
F is supported by source inspection of the pure constructor with no allocator dependency, plus
repeated authored-construction controls. It does not claim whole-factory allocation qualification.
The separate mechanical audit passes namespace collision, preservation and complete MD/JSON parity.
