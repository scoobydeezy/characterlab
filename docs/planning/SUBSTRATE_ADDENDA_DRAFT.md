# Campaign 2 Substrate Addenda — Draft Resolution

**Document status, revision 11** (2026-09-06, project-local; shared accessor allocation clarification). Both parts are accepted, at different
levels, and no single sentence applies to both:

```
Part 1  PRJ-001    SHAPE ACCEPTED · projection/0.3-candidate-addendum · 2026-09-05
                   canonical implementation NOT yet authorized
                   permanent numeric allocation deferred to Campaign 2 F
                   P0–P12b frozen as the implementation gate, not passed

Part 2  WRT-001    ACCEPTED · state/0.3-candidate-addendum · 2026-09-05
                   implemented and proven; suite 315 tests / 38 files
```

Resolution records for both are in [OPEN_DECISIONS](../formal/OPEN_DECISIONS.md). The suite standing
at 315 is the expected state for a shape-only acceptance: `PRJ-001` adds no code today.

Two substrate changes that `IDN-001` `0.3-draft` §5.1 established are required before any Campaign 2
seam can be built. They are drafted together because they were found together, and are **separately
versioned and separately accepted** because they are different mechanisms with different blast radii:

```
Part 1  PRJ-001   projection/0.3-candidate-addendum
        event-dependent projected-field requirement · read-only state
        families · state key grammar · canonical role constraints
        a new capability nothing depends on yet

Part 2  WRT-001   state/0.3-candidate-addendum
        write-path validation order and failure subreasons
        changes the first divergence of EVERY invalid write
```

**Accepting Part 1 does not certify Part 2**, and the reverse held in practice: Part 2 was accepted on
its own evidence and implemented while Part 1 was still draft, and Part 1 was later shape-accepted on
its own. Part 2 is a pre-existing defect in accepted substrate that `IDN-001` discovered but does not
own: it alters the reported first divergence for every invalid
write in the system, so it carries its own adversarial vectors and its own audit of existing fixtures.
Neither part may be accepted by inheriting the other's evidence. The `TRC-001`/`TRC-002` allocation
addendum is the precedent for carrying a narrow extension to accepted substrate.

**Dispositions.**

- **Revision 1** — both directions accepted; Part 1 not shape-complete, Part 2 near.
- **Revision 2** — admission-before-selector ordering; schema-equality source selection replaced; the
  role constraint renamed and re-scoped; composite keys made recursive; the roster's grammars closed;
  role enforcement extended; failed-read trace semantics fixed; Part 2 restructured around a shared
  leaf-resolution primitive.
- **Revision 3** — `SourceInputRef` removed as an abstraction over a substrate with one payload; key
  *shape* separated from key *role*; the `StateMapValue` constraint position dropped as unwitnessed;
  the patch-write role boundary added; and, from the failure-representation inspection, Part 2's open
  item closed — which made `WRT-001` **smaller** than revision 2 assumed.
- **Revision 4** — Part 2 implemented and proven.
- **Revision 5** — `WRT-001` acceptance recorded; `PRJ-001` becomes the sole `P0`.
- **Revision 6** — the wrapper-projection question answered: the existing `derived` machinery does not
  compose, on two counts. Governed field projection and eager required reads added; the impossible
  `P1a` replaced; the last `StateMapValue` prose removed; the `PRJ-001`↔allocation cycle broken by
  splitting shape acceptance from implementation activation.
- **Revision 7** — Part 1 restated as one closed `EventDependentProjectedFieldRequirement` (§1.4);
  composite state-key grammar added, which was the largest remaining hole (§1.6); the
  `RequiredPresence` Boolean removed so totality is structural (§1.10); `OutputRole` compatibility
  added (§1.4); the declaration made the executor rather than a named closure (§1.11); role-failure
  ordering composed explicitly with accepted `WRT-001` under a frozen `CANONICAL_ROLE_VIOLATION`
  (§1.9); and the symbolic surface stated for shape acceptance (§1.12).
---
- **Revision 8** — the five remaining symbolic gaps closed: the hidden `StateFamily`/`KeyGrammarRef`
  identities removed in favour of `StatePathPattern` (§1.6); immutable-family overlap rules frozen
  (§1.8); `CanonicalIdentityRole` extracted with an exact, deliberately non-inferential compatibility
  rule serving both uses (§1.7); key-shape failure frozen as `INVALID_PATH` ahead of role validation
  (§1.9); and the requirement's trace identity resolved to `(SeamId, SeamVersion, OutputAccessor)` —
  which inspection showed already exists in committed trace — with accessor uniqueness across static
  and dynamic projections (§1.11).
- **Revision 9** — the final five symbolic corrections: `TargetStatePathTemplate` frozen as a
  constrained `StatePathPattern` with deterministic completion (§1.4a); canonical collection and
  uniqueness semantics frozen for every new definition family, with grammar↔family closure made
  bidirectional so an orphan grammar cannot own a validation rule (§1.12); `CharacterObserverBindingValue`
  restored to the symbolic surface as `IDN-001`'s witness record rather than a generic envelope
  (§1.12); both new failure codes bound to the accepted `StateFailureCode` union, correcting
  revision 8's claim that `REQUIRED_PROJECTION_VALUE_ABSENT` was reused (§1.12); and this history put
  in chronological order.
- **Revision 10** — grammar coverage restated over *admission of this addendum* rather than over
  "new versus legacy" family, which was development chronology absent from `ModelIdentity` and not
  decidable by any validator (§1.6, §1.12); `P7b` rewritten as total bidirectional closure in a
  PRJ-enabled model, and `P7c` added to prove non-admitting models are untouched. **Shape accepted at
  this revision.**

---

## Part 1 — `PRJ-001` projection, read-only state, role constraints

### 1.1 What exists, established by inspection

`ProjectionBinding` is `direct` (one concrete `StatePath`) or `derived` (`projectionPath`,
`sourcePaths`, `transformationId`, a derivation). `ContractReadProjection` validates every binding path
against the registered `ReadDomain` at construction, records each read in `actualReadRecords` with
path, presence, value and derived sources, and fails `UNKNOWN_ACCESSOR` for any undeclared accessor.
Authoritative reads are constrained by `ReadDomain` patterns, **not** by writable-leaf declarations.

Two consequences retire otherwise-plausible designs. A wildcard `ReadDomain` pattern plus a single
**exact** binding is not "wildcard domain then filter locally" — the domain admits the family, the
binding admits one key, and a transition reads only through declared accessors. And a non-writable
family is already readable, so an immutable family needs no authority to be projectable.

### 1.2 What is missing — six gaps, all established by inspection

**(a) Bindings are static.** `TransitionSeamContract.bindings` is a field on the contract;
`createContractEventHandler` builds the projection from it before the transition runs, with no access
to the admitted input.

**(b) An immutable state family has no declaration site.** Value grammars are declared on *owned*
leaves and checked by `validateNewValue` on write. A family with no writable pattern has neither.

**(c) A canonical position cannot express a role.** `RecordFieldSchema` is `{ id, name, required }` —
no type, no namespace, no validator.

**(d) There is no input-slot vocabulary.** `ScheduledEvent` carries a single
`payload: CanonicalValue`; there are no named slots and no admitted-occurrence positions.

**(e) There is no key grammar of any kind.** A map-key selector is any `CanonicalValue`;
`validatePattern` checks only that the wildcard's `selectorKind` is one of three strings. Owned leaf
families declare a `LeafValueGrammar` and nothing about their keys.

**(f) The derived transformation is an ungoverned closure, evaluated lazily.** See §1.3.

Gap (c) is broader than identity, and it is why the fix is a constraint registry rather than a change
to `RecordFieldSchema`: adding a field to that structure changes every schema's encoding and therefore
every registry-manifest digest in the project, for a property only some positions need.

### 1.3 The existing `derived` machinery does not compose — inspected against eight conditions

The question was whether the accepted `derived` projection could express
`Bindings[input.ObserverId] → CharacterObserverBindingValue → field CharacterId` with no new
mechanism. **Six conditions hold and two fail.**

**What holds.** A derived binding carries its own `sourcePaths`, so once bindings compile per
invocation a derived binding can carry the dynamic roster path directly — meaning **no separate direct
binding is needed**, and the wrapper record therefore has no accessor at all. `transformationId` is a
static field. `actualReadRecords` records each source's path, presence and value in `derivedSources`.
And `derive` receives only source read values — no state handle, no event handle — so it cannot
perform additional reads.

**Failure 1 — the transformation is an anonymous closure.**

```
derive: (sources: readonly StateReadValue[]) => CanonicalValue
```

Nothing constrains it to field extraction and nothing commits it, so `transformationId` names a
transformation `ModelIdentity` cannot check, and what a transition sees may drift from what the model
says. The project has already ruled on this shape: the accepted `TRC-001`/`TRC-002` record rejects
"anonymous predicate validators … cannot be committed, so leaf admissibility could drift from model
identity". A closure deciding what a psychological transition sees of a character's identity is the
same defect one layer up.

**Failure 2 — derived reads are lazy.** `ContractReadProjection` validates paths at construction but
performs no reads there; sources are read inside `read(key)`, while the transition is already running.
`state.read` also returns `{presence: false}` for an absent path rather than failing, so absence flows
into the derivation. *Recorded nuance:* the derived branch pushes `presence: true` unconditionally into
the read record — real source presence lives only in `derivedSources`, which is where a
required-presence check must look.

### 1.4 Decision — one closed requirement, not two composed objects

The inspection's simplification is carried all the way into the shape. A separate direct accessor plus
a separate field projection would leave two objects whose *composition* must itself be governed. One
requirement instead:

```
EventDependentProjectedFieldRequirement
├── SelectorSourceFieldId    a field of the admitted ScheduledEvent payload
├── TargetStatePathTemplate  StatePathPattern — see §1.4a
├── ProjectedFieldId         one governed field of the target value's record type
├── OutputRole               CanonicalIdentityRole — what the consuming seam requires
└── OutputAccessor           the only transition-visible accessor; unique within the contract
```

Runtime semantics:

```
admitted payload
    → SelectorSourceFieldId
    → compile the exact target StatePath
    → validate it against ReadDomain
    → required authoritative read
    → validate the source value against the family's value grammar
    → ProjectedFieldId extraction
    → expose OutputAccessor
```

**The source read is internal and has no transition-visible accessor at all.** Wrapper opacity is
therefore structural rather than conventional: there is no accessor to withhold. Deliberately
excluded, each because it reopens something:

```
a selector computed by transition code       → cross-observer lookup under a new name
an expression language                       → an unbounded dynamic-query engine
a selector derived from another state read   → read chaining outside the declared domain
a wildcard binding handed to the transition  → the registry itself
enumeration of any kind                      → topology becomes visible
more than one mapKey slot                    → a composite selector grammar nothing has asked for
a second accessor for the source record      → the wrapper, and everything else in it
```

**(1.4a) `TargetStatePathTemplate` is a `StatePathPattern`, not a new type.** Inspection: a
`StatePathPattern` is `{rootStateTypeId, fieldId, selectors}` with concrete `bigint` root and field,
and each selector either `{kind: 'wildcard', selectorKind}` or `{kind: 'exact', selector}`. "Everything
fixed except one mapKey" is therefore already expressible, so the template reuses the accepted
vocabulary and v0.1 constrains which patterns are admissible as templates:

```
exactly one selector is a mapKey wildcard — the slot SelectorSourceFieldId fills
root and field components are concrete
every other selector, if any, is exact
no second wildcard · no stableListItem wildcard · no typedEntity wildcard
```

The consequence that matters is completion determinism: one admitted selector value and one committed
template yield **exactly one** concrete `StatePath`, with no second completion consistent with the
requirement (`P1`).

**Model-construction obligations.** The requirement compiles only when all of these hold:

```
SelectorSourceFieldId   exists in the admitted payload schema, is required for the
                        admitted variant, and carries a CanonicalRoleConstraint whose
                        role is compatible with the target map key's role
target family           declares the required StateKeyGrammar (§1.6)
target value grammar    is CanonicalRecord(SourceRecordType)
ProjectedFieldId        exists in SourceRecordType, is required, and its
                        CanonicalRoleConstraint is compatible with OutputRole
ReadDomain              admits the target path template
```

**`OutputRole` is not a duplicate of the field's own constraint**, and the difference is the point:

```
field constraint  → what the stored field means
OutputRole        → what the consuming seam requires
compatibility     → the type-check between them
```

Without it, changing `ProjectedFieldId` from `CharacterId` to a sentinel field would merely produce a
*different valid model* while the accessor still claimed to be a resolved character subject. With it,
that model fails closure.

### 1.5 Decision — admission strictly precedes selector extraction

```
1. identify the transition contract
2. validate and admit the input — schema · producing seam · basis/variant
   · source occurrence · required source-field constraints
3. extract the governed selector source
4. compile the one exact target StatePath
5. validate it against ReadDomain
6. perform the required read and the field projection
7. construct ContractReadProjection
8. run the transition
```

The forbidden shape is reading the roster from an input that has not yet been admitted. A forged or
wrong-route record would move the first divergence from `INPUT_NOT_ADMITTED` to a subject failure, and
an instrumented authoritative read would happen for a record that should never have crossed the seam.
This is the reason `SEM-001G` made admission relational rather than a property of a record inspected
in isolation.

### 1.6 Decision — state key grammar, atomic and composite

Inspection found no key grammar at all (§1.2e). Revision 6 defined only the atomic case, which left a
hole large enough to matter: a tolerance path whose selector is *some other* canonical record is
accepted by the `mapKey` wildcard, its fields may each be individually valid, and nothing states that
this family requires *this* record type. That reproduces the invalidity→absence collapse `P9b` exists
to eliminate, one level up.

Both variants are witnessed by current Campaign 2 work, so both are in v0.1:

```
StateKeyGrammar
    = IdentityKey                      one canonical identity atom
    | CanonicalRecordKey(RecordTypeId) one canonical record of exactly that type

CharacterObserverBindingState.Bindings → IdentityKey
tolerance · sensitization · regulatory adaptation
  · accumulated load · procedural competence
                                       → CanonicalRecordKey(<that family's key record>)
```

**Shape and role stay separately owned**, so nothing needs a precedence rule:

```
StateKeyGrammar          what canonical shape the key has
CanonicalRoleConstraint  what identity domains its atomic positions admit
```

**Writable families need this too, and `OwnedLeafDefinition` must not churn.** Modifying that accepted
structure would change existing registry encodings for a property they do not have. So the grammar is
declared additively — keyed by the structural thing that already exists, with **no new identity**:

```
StateKeyGrammarDefinition
├── Pattern      StatePathPattern
└── KeyGrammar   StateKeyGrammar
```

Revision 7 wrote `StateFamily` and a `KeyGrammarRef`, which was an allocation problem hiding as prose:
there is no accepted `StateFamilyId`, and a definition referenced by `Ref` needs an identity of its
own. `StatePathPattern` is accepted, structural, and is already the lookup key a writable family
carries as `OwnedLeafDefinition.Pattern` — so one mechanism serves both kinds of family and nothing is
minted.

```
0 or 1 StateKeyGrammarDefinition per exact StatePathPattern
declaration order is irrelevant
```

**Coverage is a property of admitting this addendum, not of when a family was written.** Earlier
revisions said accepted families may remain undeclared while "every new Campaign 2 keyed family" must
declare one — but *legacy* and *new* are facts about development chronology, absent from
`ModelIdentity`. A model-construction validator could only decide them by consulting document history,
allocation order, or a hard-coded exception list, and runtime semantics may not come from any of those.
So the rule is stated over admission:

```
a model that does NOT admit projection/0.3-candidate-addendum
    retains accepted legacy StatePath behaviour; no grammar is required

a model that DOES admit it
    EVERY keyed state family it declares has exactly one StateKeyGrammarDefinition
```

with the participating set defined executably:

```
keyed state family = a declared OwnedLeafDefinition or ReadOnlyStateFamilyDefinition
                     whose Pattern contains the governed mapKey selector
```

This still churns nothing. `OwnedLeafDefinition` records are unchanged, and a Campaign 1 model that
does not adopt this addendum stays byte-for-byte governed by its accepted contract. A Campaign 2 model
that adopts it declares grammars for the keyed families it carries — including accepted older families
that participate in *that* model — and its `RegistryIdentity`/`ModelIdentity` changes accordingly,
because it has opted into stronger `StatePath` validation. That is the honest reading: the difference
is what a model admits, not when someone wrote a family.

### 1.7 Decision — `CanonicalRoleConstraint`, narrowly scoped

> A `CanonicalRoleConstraint` refines a canonical **identity-valued** position by required namespace
> and, where applicable, a governed domain validator. It does not define arbitrary scalar, record,
> collection, or union typing. General schema typing remains a separate question if it is ever needed.

The identity-role shape appears in two places — what a stored position admits, and what a consuming
seam requires — so it is defined **once**:

```
CanonicalIdentityRole
├── RequiredNamespace  mandatory
└── DomainValidatorId  OPTIONAL refinement

CanonicalRoleConstraint
├── Position           RecordField(RecordTypeId, FieldId)
│                    | StateMapKey(RootStateTypeId, FieldId)
└── Role               CanonicalIdentityRole
```

The validator is optional because the two restrictions are different depths: `ObserverId` needs only
its namespace, `CharacterId` needs namespace 1002 *and* the character-kind validator. Inspection found
no mandatory per-namespace validator to reuse, so making it mandatory would mint an empty `ObserverId`
validator whose only purpose was satisfying a record shape.

**Compatibility is mechanical, and deliberately conservative in v0.1.** "Compatible" may not be left
to semantic interpretation, so:

```
namespace                      exact equality required
consumer declares no validator any stored validator is acceptable
consumer requires validator V  the stored role must declare exactly V
```

```
stored 1002 + CharacterValidator  ·  consumer 1002 + CharacterValidator  → compatible
stored 1002 + CharacterValidator  ·  consumer 1002 only                  → compatible
stored 1002 only                  ·  consumer 1002 + CharacterValidator  → INCOMPATIBLE
validator A                       ·  validator B                          → INCOMPATIBLE
```

No validator implication, no subset reasoning, no ontology inference — those are domain logic and
would earn their own seam (`ONT-001` territory), not a quiet widening here. **One rule, two uses:** it
governs `ProjectedFieldId` ↔ `OutputRole` (§1.4) and `SelectorSourceFieldId` ↔ target map-key role
(`P1a`) identically.

**Composite keys are validated recursively, never as one opaque value:**

```
canonical-record key or value   → recursively constrain its RECORD FIELDS
identity-atom map key           → StateMapKey CanonicalRoleConstraint
identity-atom state value       → not expressible, and not admitted in v0.1
```

The third line is a closed door rather than an omission: accepted `LeafValueGrammar` cannot witness a
raw identity-valued leaf, so a role position for one would have no legal witness. Registration is one
constraint per exact position, held as a canonically sorted set; changing a position, its namespace, or
its validator changes `RegistryIdentity` / `ModelIdentity`.

### 1.8 Decision — the roster's shapes

`LeafValueGrammar` has exactly three tags and a raw typed identity is none of them, so
`Bindings[ObserverId] → CharacterId` is not expressible. The thin resolution:

```
Bindings[ObserverId] → CharacterObserverBindingValue { CharacterId }

KeyGrammar               = IdentityKey
LeafValueGrammar         = CanonicalRecord(CharacterObserverBindingValue)
CanonicalRoleConstraint  = RecordField(CharacterObserverBindingValue, CharacterId)
                           → namespace 1002 + character validator
StateMapKey constraint   → namespace 1000
```

This is not the retired pair record: the key carries `ObserverId`, the value record carries only
`CharacterId`. Extending state leaf grammar with a typed-identity scalar to save a one-field wrapper is
rejected. The family is a `ReadOnlyStateFamilyDefinition` — no authority, no writable pattern, included
in save/load and `InitialStateDigest`, readable through `ReadDomain`.

**Immutability must be a property of the model, not of one definition's missing field.** Nothing in
revision 7 stopped a read-only `Pattern` from overlapping an `OwnedLeafDefinition.Pattern`, which would
leave one concrete path read-only or writable depending on which registry a caller consulted. Two
closure rules, proven at model construction:

```
every ReadOnlyStateFamilyDefinition.Pattern
    disjoint from every OwnedLeafDefinition.Pattern
read-only patterns
    pairwise non-overlapping
```

The second has no demonstrated exception — two immutable declarations over one path could only
disagree about its grammar — so it is frozen closed rather than left permissive.

### 1.9 Decision — role enforcement, and how it composes with accepted `WRT-001`

`IDN-001` §2.2 requires five boundaries; inspection showed two of them reachable rather than
structurally impossible (`restoreStatePath` builds a mapKey from raw canonical values with no check;
`state.read` performs no role validation).

```
initial-state construction · decode · restore   constraint at canonical construction
StatePath construction                          constrained key positions validated when a
                                                path is built or restored
character-state read                            CANONICAL_ROLE_VIOLATION, never absence
patch write                                     CANONICAL_ROLE_VIOLATION, before writability
```

**Path validation composes with `WRT-001` as a refinement of step 1, not a competing order.** Accepted
`WRT-001` owns structural validity → `resolveWritableLeaf` → authority; `PRJ-001` refines the first
step and changes nothing after it:

```
1a. structural StatePath syntax            INVALID_PATH               WRT-001, accepted
1b. StateKeyGrammar shape                  INVALID_PATH               PRJ-001, new check
1c. canonical role validity                CANONICAL_ROLE_VIOLATION   PRJ-001, new code
2.  resolveWritableLeaf                    UNDECLARED_WRITABLE_PATH   WRT-001, accepted
3.  authority                              NON_OWNING_AUTHORITY       WRT-001, accepted
```

**Key-shape failure reuses `INVALID_PATH` rather than minting a code.** A selector that is not the
family's declared key grammar — a canonical record of the wrong `RecordTypeId`, or a record where an
identity atom is required — is a malformed path, which is exactly what `INVALID_PATH` already names.
Role validity is a different claim: the key is *well-formed for this family* and one of its identity
positions carries an inadmissible value. Hence:

```
wrong key record type                         → INVALID_PATH
right key record type, wrong CharacterId or
  wrong variable role inside it               → CANONICAL_ROLE_VIOLATION
```

`P11a` asserts that ordering, so role validation is never reached for a key whose type was never right.
`WRT-001`'s meaning is intact: no invalid path reaches writable-leaf resolution. `P9b` and `P9c` assert
`CANONICAL_ROLE_VIOLATION` by name rather than by prose.

### 1.10 Decision — required-only projection, and exact missingness

Revision 6 carried a `RequiredPresence` Boolean, whose `false` branch contradicted the totality
guarantee: a projection that can carry absence is not total, and `P5` cannot be a universal invariant
while `P4` permits an absent-but-successful projection. The only witness — `IDN-001` — is always
required. So v0.1 removes the Boolean:

> **An `EventDependentProjectedFieldRequirement` is always required.** Existing accepted static and
> optional projection semantics are unchanged and remain lazy.

That makes totality true by construction rather than by rule. Exact semantics:

```
source path absent
    → REQUIRED_PROJECTION_VALUE_ABSENT, field extraction never runs
source present, value not a valid CanonicalRecord(SourceRecordType)
    → canonical/state validation failure
source valid, ProjectedFieldId required
    → the exact field value

no fabricated default · no missing-as-false · no sentinel
```

**When the failure happens, stated so that it is possible.** Detecting absence requires performing the
roster read, so the failure cannot precede that read. What it precedes is everything the transition
owns:

```
the required roster lookup happens DURING projection construction
if absent, the transition never begins — so the failure precedes
    any transition-owned state read
    any occurrence or output allocation
    any semantic evaluation depending on the subject
```

**A failed required read leaves no committed read artifact.** Aborted work does not enter committed
trace, and a failed instant does not commit: the attempt may appear in non-authoritative
failure-diagnostic provenance, and no `actualReadRecord` survives rollback.

If a future seam genuinely needs an optional event-dependent projection, it earns the
`Required | Optional` grammar and its own missingness semantics — including the fact that the accepted
derived branch's unconditional `presence: true` is exactly wrong for an absent source.

### 1.11 Decision — the declaration is the executor

Rejecting the anonymous closure is not enough on its own: a `transformationId` resolving to a lookup
table of runtime functions would restore the same defect under declarative prose, with the committed
definition saying *field extraction* while some separately authored body did something else.

> **The runtime executor interprets the closed declaration itself.** `ProjectCanonicalRecordField(FieldId)`
> is a generic substrate operation — fetch exactly that field of an already-authorised projected
> record. There is no seam-specific executable callback.

*Marked choice, of the two available:* `transformationId` names **the committed projection requirement
itself**, rather than a separate `ProjectionTransformDefinition`. There is exactly one projection per
requirement, so an intermediate definition would be an indirection with no second consumer.

**The composite requirement identity already exists in committed trace; no ProjectionRequirementId
is minted.** The accessor component needs the shared allocation clarification below. Inspection:
`ActualReadRecord` carries `accessorId: TypedIdentifierValue` and an optional
`transformationId: TypedIdentifierValue`, and the enclosing `TraceRecord` (type 160) carries `SeamId`
and `SeamVersion`. So:

```
ProjectionRequirementIdentity = (SeamId, SeamVersion, OutputAccessor)
```

is exact from data already committed, with no new ProjectionRequirementId namespace. Campaign 2 F
does allocate the shared ProjectionAccessorId family for the existing OutputAccessor position.
Its missing permanent family was identified during F inspection; this clarifies allocation and
does not reopen the accepted projection shape. `transformationId` carries the
requirement's `OutputAccessor` identity — deliberately the same value as `accessorId`, because under
this addendum *the transformation is the requirement* and the requirement is named by its accessor.
The redundancy is intentional and keeps the field's meaning ("what transformed this") true; the
alternative — omitting the optional field — would read as "no transformation" for a value that was
transformed.

This is only exact if an accessor names one requirement, so **`OutputAccessor` is unique within a
`TransitionSeamContract`, across static and event-dependent projections alike**. Uniqueness only
within the new requirements would let a dynamic requirement collide with an accepted static binding
and let declaration order decide which is visible (`P2a`).

`P6b` therefore mutation-tests the *executable link* — same committed declaration, altered runtime
extraction behaviour, test fails — not merely that changing `ProjectedFieldId` changes `ModelIdentity`.
Those prove different things.

### 1.12 The symbolic surface proposed for shape acceptance

All symbolic. No permanent numbers; allocation is Campaign 2 **F**.

```
StateKeyGrammar
    = IdentityKey
    | CanonicalRecordKey(RecordTypeId)

StateKeyGrammarDefinition
├── Pattern                StatePathPattern
└── KeyGrammar             StateKeyGrammar

ReadOnlyStateFamilyDefinition
├── Pattern                StatePathPattern
└── ValueGrammar           accepted LeafValueGrammar vocabulary

CanonicalIdentityRole
├── RequiredNamespace
└── DomainValidatorId?

CanonicalRoleConstraint
├── Position               RecordField(RecordTypeId, FieldId)
│                        | StateMapKey(RootStateTypeId, FieldId)
└── Role                   CanonicalIdentityRole

EventDependentProjectedFieldRequirement
├── SelectorSourceFieldId
├── TargetStatePathTemplate  StatePathPattern, constrained per §1.4a
├── ProjectedFieldId
├── OutputRole               CanonicalIdentityRole
└── OutputAccessor           the existing projection-accessor type

CharacterObserverBindingValue
└── CharacterId              required
```

`CharacterObserverBindingValue` is **`IDN-001`'s witness record**, not a generic projection type: it
exists because a raw typed identity is not an accepted `LeafValueGrammar` (§1.8), and `PRJ-001` accepts
only the substrate machinery that makes it valid. Its role constraint is
`RecordField(CharacterObserverBindingValue, CharacterId) → namespace 1002 + character validator`.
Nothing here licenses treating the wrapper as a reusable projection envelope.

**Collections.** Every new definition family is a canonical **set** with an exact uniqueness key, and
none carries declaration-order semantics:

```
StateKeyGrammarDefinitions              set · unique by exact StatePathPattern
ReadOnlyStateFamilyDefinitions          set · unique by exact StatePathPattern
CanonicalRoleConstraints                set · unique by exact Position
EventDependentProjectedFieldRequirements
                                        set within a TransitionSeamContract
                                        unique by OutputAccessor
```

The last one is what makes `P2a` and the trace-identity choice structural rather than conventional:
one `OutputAccessor` names one projection — static **or** event-dependent — within one contract. Static
bindings live in the contract's existing accepted collection, so model closure performs that uniqueness
check **across collections**, not only within the new one.

**Closure rules**, all proven at model construction:

```
one key grammar per exact family Pattern; declaration order irrelevant

IN A MODEL ADMITTING projection/0.3-candidate-addendum:
  every keyed family Pattern  → exactly one StateKeyGrammarDefinition   forward
  every StateKeyGrammarDefinition → exactly one keyed family Pattern    reverse

read-only patterns pairwise disjoint, and disjoint from writable patterns
OutputAccessor unique within a TransitionSeamContract, static and dynamic alike
role compatibility uses the exact v0.1 rule of §1.7 — one rule, two uses
wrong key grammar precedes role validation
requirement trace identity = (SeamId, SeamVersion, OutputAccessor)
```

The reverse direction is not symmetry for its own sake: an orphan grammar definition would change path
validation for a structural pattern no state family owns — a validation rule with no owner. Neither
direction refers to when a family was introduced; a model that does not admit this addendum is
governed by its accepted contract unchanged (§1.6).

**Failure codes, with their owning vocabulary.** Inspection: neither new code exists in the codebase
or in any accepted document, so both are introduced by this addendum — revision 8 wrongly listed
`REQUIRED_PROJECTION_VALUE_ABSENT` as reused. Both extend the accepted closed union
**`StateFailureCode`**: role validation runs at `StatePath` construction, read and patch write, all
state-contract operations; and required-projection absence is raised by `ContractReadProjection`
construction, whose sibling failures `ILLEGAL_READ` and `UNKNOWN_ACCESSOR` are already members.

```
NEW, extending StateFailureCode
    CANONICAL_ROLE_VIOLATION            well-shaped path, inadmissible identity role
    REQUIRED_PROJECTION_VALUE_ABSENT    well-formed required projection, target entry absent

REUSED, accepted StateFailureCode member
    INVALID_PATH                        wrong path syntax, or wrong key grammar
```

Adding members to a closed union is the same additive move `WRT-001` made and carries the same
obligation: a member's meaning must be single. No new identity namespace is required by this surface.

### 1.13 Proof plan

| # | Control | Obligation |
|---|---|---|
| P0 | Admission precedes everything | an unadmitted input carrying a syntactically usable `ObserverId` fails admission with **zero** path compilation, zero state read, and zero `actualReadRecord`. The first divergence is the admission failure |
| P1 | The selector comes from the input | the compiled path's mapKey equals the admitted payload's field value; a key supplied from transition code is not expressible |
| P1b | Completion is deterministic | one admitted selector value and one committed template yield exactly one concrete `StatePath`; a template with a second wildcard, a non-mapKey wildcard, or a non-concrete root/field fails contract construction |
| P1a | The selector source is statically valid | at **model construction**: `SelectorSourceFieldId` exists, is required for the admitted variant, and its role is compatible with the target map key's role. Mutations — field missing; field optional where required; source namespace ≠ target-key namespace; incompatible validator — each fail contract construction. A selector→target relation that can only fail at runtime must not compile |
| P2a | Accessor collision fails contract construction | a dynamic requirement reusing an `OutputAccessor` already supplied by a static or dynamic projection in the same contract fails to compile. Without this, declaration order decides which accessor is visible, and the requirement's trace identity stops being exact |
| P2 | Exactly one accessor exists | the transition reads `OutputAccessor` and nothing else; any other key fails `UNKNOWN_ACCESSOR`, and no accessor for the source record exists to try |
| P3 | The `ReadDomain` still governs | a compiled path outside the registered patterns fails at projection construction, as a static binding does |
| P4 | Required absence aborts construction | an absent source fails with `REQUIRED_PROJECTION_VALUE_ABSENT` before the transition runs. There is no optional branch in v0.1 to compare against — totality is structural |
| P4a | A failed required read commits nothing | after the failure, no `actualReadRecord` survives rollback into committed trace |
| P5 | The projection is total by construction | no boundness flag, `Maybe`, or status value exists anywhere in a successfully constructed projection — not withheld by rule, absent from the shape |
| P5a | Model closure is proven separately from runtime validation | P1a and the §1.4 obligations are **model-definition** checks; P9–P9c are **runtime** guards. Without the first, a nonsensical contract registers and fails every invocation; without the second, a well-formed contract consumes forged bytes |
| P6 | Instrumented but blind | on success, `actualReadRecords` names the exact path, selector, value and requirement identity, while the transition sees only the projected field |
| P6a | Wrapper opacity | adding a harmless sentinel field to `CharacterObserverBindingValue` leaves the transition-visible projection byte-identical with respect to `CharacterId` and exposes no accessor for it. The simulator-side read may contain both, because that is the authoritative value |
| P6b | The declaration is the executor | same committed declaration, altered runtime extraction behaviour → fails. Distinct from, and stronger than, "changing `ProjectedFieldId` changes `ModelIdentity`" |
| P6c | Output-role compatibility is enforced at model construction | pointing `ProjectedFieldId` at a field whose `CanonicalRoleConstraint` is incompatible with `OutputRole` fails contract construction — it does not become a different valid model |
| P7 | Requirement is model identity, compilation is not | changing selector source, target, projected field, output role or accessor changes `ModelIdentity`; running one model over a different event does not |
| P7a | Collections are sets with exact uniqueness keys | duplicate `StatePathPattern` grammar definitions, duplicate read-only family patterns, duplicate constraint `Position`s, and duplicate `OutputAccessor`s each fail model construction; reordering any collection changes no identity and no behaviour |
| P7b | Grammar↔family closure is total and bidirectional in a PRJ-enabled model | in a model admitting `projection/0.3-candidate-addendum`: an **accepted older** keyed family carried by that model with no grammar fails; a newly introduced keyed family with no grammar fails identically; a grammar matching no declared family fails; two grammars for one family fail. Nothing distinguishes the first two cases, because nothing may |
| P7c | Non-admitting models are untouched | the same accepted model **without** `projection/0.3-candidate-addendum` continues to validate under its accepted contract, with no grammar required and byte-identical identity. This is what proves the addendum additive rather than retroactive |
| P8a | Immutable-family exclusivity | a read-only pattern overlapping a writable pattern fails model construction, as does a read-only pattern overlapping another read-only pattern. "No writable path" must be a property of the model, not of one definition's missing field |
| P8 | Read-only family is readable and unwritable | it survives save/load, contributes to `InitialStateDigest`, is projectable, and declares no writable path |
| P9 | Role constraints hold at every canonical path | a violating value fails at construction, at decode, and at restore; removing the check at any one is detected |
| P9a | …and at `StatePath` construction | a forged `CharacterId` reaching `restoreStatePath` fails rather than producing a usable path |
| P9b | …and at read | a character-state lookup keyed by a non-qualifying namespace-1002 value fails with exactly `CANONICAL_ROLE_VIOLATION` and does **not** return absence |
| P9c | …and at patch write | a path carrying a non-qualifying value fails with exactly `CANONICAL_ROLE_VIOLATION`, ahead of `UNDECLARED_WRITABLE_PATH` and `NON_OWNING_AUTHORITY`, and mutates nothing |
| P10 | Constraints cover both witnessed position kinds | violating values in a constrained atomic map **key** and in a constrained **record field** each fail |
| P11 | Composite keys validate recursively | a tolerance-shaped key with a valid `CharacterId` but a wrong-namespace variable field fails at that field, naming it — not at the key as a whole |
| P11a | Wrong canonical key record type | a tolerance path whose selector is a valid canonical record of the **wrong** `RecordTypeId` fails with exactly `INVALID_PATH` — it does not return absence, and role validation of its fields is never reached. Without this, P11 only proves field validation inside a key whose type someone already assumed correct |
| P12a | Role compatibility is exact, not inferential | a stored namespace-only role against a consumer requiring a validator is **incompatible**; two different validator IDs are incompatible; a stored validator against a consumer requiring none is compatible. Any implication or subset reasoning between validators fails this |
| P12b | Requirement identity is exact in trace | `(SeamId, SeamVersion, OutputAccessor)` identifies the requirement that produced a projected value, from committed trace alone and with no new namespace |
| P12 | Optional validator stays optional | a namespace-only constraint admits any correctly-namespaced identity; adding a validator then rejects the values it should |

`P9`–`P11a` are what make `IDN-001` control 1 real rather than aspirational.
---

## PRJ allocation clarification — ProjectionAccessorId (2026-09-06)

**Decision recorded; projection/0.3-candidate-addendum semantics remain shape accepted.**
ProjectionAccessorId is one shared typed identity family owned by the projection substrate / PRJ
allocation surface. Its representation is the existing TypedIdentifierValue. Permanent namespace
and exact canonical member payloads are deferred to Campaign 2 F; no number is allocated here.
IDN and ADAPT consume shared members, not seam-local families.

Required symbolic members, preserving accepted spelling:

```
ResolvedCharacterSubject
accessor/adaptation-target-prior
accessor/adaptation-gate-prior
```

The family identifies a named projection/read requirement within a governing seam/version. It does
not globally define a path or value. Complete requirement identity remains
(SeamId, SeamVersion, OutputAccessor), now with OutputAccessor inhabiting ProjectionAccessorId.
The same member may occur in distinct seam/version scopes; duplicate declarations within one
TransitionSeamContract still fail the accepted cross-collection uniqueness check.

CanonicalIdentityRole: RequiredNamespace = the F-allocated ProjectionAccessorId namespace;
DomainValidatorId absent. For Campaign-2 contracts admitting PRJ/ADAPT extensions, validate
EventDependentProjectedFieldRequirement.OutputAccessor and every newly declared static/dynamic/
ADAPT-local accessor at contract construction. Wrong namespace fails INVALID_CONFIGURATION before
runtime projection construction. IDN's ResolvedCharacterSubject and E's two fixed members must use
this family. A production static accessor joining an extended contract is explicitly migrated with
that contract; no implicit acceptance of an old fixture namespace or global legacy migration.

Runtime copies the already validated accessor into ActualReadRecord. Do not globally constrain
ActualReadRecord.accessorId (type 147), change its encoding, or add a trace-side validation authority.
Legacy contracts outside the addendum retain their accepted typed-accessor behavior. Canonical
identity equality still checks uniqueness across static and dynamic declaration collections.

No ProjectionRequirementId, accessor registry, ProjectionAccessorDefinition or AccessorMeaningRecord
is introduced. Meaning is committed by the requirement declaration or version-fixed interpreter.
Changing a declared OutputAccessor changes committed contract bytes and ModelIdentity. Changing
E's version-fixed accessor members requires an ADAPT semantic version change, not a registry edit.

Reject borrowing DerivationFunctionId/1022, TransitionKindId, RegistryDefinitionId, DomainValidatorId
or EventTypeId. No test namespace promotion, hash-derived identity or seam-local numeric values.
This corrects the assumption that the accessor component already had a permanent family; it does
not change PRJ's selector grammar, projection semantics or requirement-identity tuple.

| Shared allocation/control vector | Frozen obligation — NOT PASSED |
|---|---|
| PRJ-F-ACCESSOR-1 | All three current members inhabit ProjectionAccessorId. Wrong namespace at an extended contract declaration, including a participating static accessor, fails INVALID_CONFIGURATION before runtime projection construction. Generic type-147 legacy records and non-admitting legacy contracts remain valid under their own contracts. |
| PRJ-F-ACCESSOR-2 | ResolvedCharacterSubject and the two ADAPT accessors coexist without identity collision where the governing contracts permit them; the same member in different seam/version scopes has distinct complete requirement identity. Fixture namespaces or DerivationFunctionId promoted into accessor authority fail the allocation audit. |

Retain P2a duplicate-declaration failure and P12b exact trace requirement identity. No new runtime
phenomenon or standalone prerequisite decision is needed. Allocation and implementation remain
unauthorized until their existing gates are met.

---

## Part 2 — `WRT-001` write-path validation order

### 2.1 The defect

`applyStatePatch` calls `registry.validateAuthority(...)` before `registry.validateNewValue(...)`.
`validateAuthority` fails when the supplied authority does not own the path; the check for whether the
path is a declared writable leaf at all lives in `validateNewValue` and runs second. Both raise
`ILLEGAL_WRITE`.

So a patch to a path that is **not writable by anyone** reports *mutation authority does not own the
proposed path* — naming a relationship to an authority that could not have owned it, because none can.
This contradicts `STATE_MODEL.md`'s own first-divergence rule, and it is the same class of defect as
the shared forbidden-field code that document already records having fixed. It is general: every
invalid write in the system reports through this ordering.

### 2.2 Decision — a common write-validation prefix

`WRT-001` accepts a **prefix**, not a total ordering of write validation:

```
COMMON WRITE-VALIDATION PREFIX

1. StatePath is structurally valid                or INVALID_PATH
2. resolveWritableLeaf(path)                      or UNDECLARED_WRITABLE_PATH
3. the supplied MutationAuthority owns that leaf  or NON_OWNING_AUTHORITY
```

**After the common prefix, operation-specific removal, expected-old/precondition, and value-grammar
validation retain the previously accepted `state/0.2-candidate` semantics and ordering. `WRT-001` does
not reorder them.** Revision 3 listed those steps as though this addendum owned them, then said in the
next sentence that `set` validates preconditions before values — two claims that cannot both be part
of an accepted contract. The prefix is what was implemented and proven; the rest is untouched.

One invariant carries the change:

> **An undeclared path never reaches authority resolution.**

`W4c` proves the prefix's own precedence — undeclared beats wrong authority beats invalid value —
without asserting anything about `set`/`remove` ordering downstream of it.

**Step 1 turned out not to be free, which W0 discovered rather than assumed.** `createStatePatch`
validated paths only inside its sort comparator, and a comparator is not invoked for a single-element
array — so structural validation was **arity-dependent**: the same malformed path reported
`INVALID_PATH` in a two-operation patch and reached writability resolution in a one-operation patch.
Implementation makes the check explicit and independent of sorting. This defect predates `WRT-001`
and was masked by the old ordering, which reported it as an ownership failure.

### 2.3 Decision — a shared leaf-resolution primitive, not value validation

The order alone is not enough, because today leaf existence is discovered *as a side effect of value
validation*. Inspection found three independent `#writable.find(...)` sites — in `validateNewValue`,
in `validateRemoval`, and reachable through `validateState` — which is why they can disagree about
first divergence. `Remove` has no proposed value at all, so discovering membership through a
value-validation operation is wrong for it by construction.

```
resolveWritableLeaf(StatePath)
    → the exact OwnedLeafDefinition
    | UNDECLARED_WRITABLE_PATH
```

then, on the resolved leaf: validate authority → validate operation or removal → validate value where
applicable → validate preconditions. **`applyStatePatch`, `validateState`, and any patch preflight
share this one primitive**, so they cannot disagree. Writable-family membership becomes a property of
the path, which is what it always was.

### 2.4 Decision — sibling codes, because the inspection removed the other option

**What the accepted failure representation actually is.** `StateFailureCode` is a **flat closed union
of eleven string literals** and `StateContractError` is `{ code, message }`. There is no structured
reason field, no subreason, and no nesting anywhere in it. The scheduler's `FailureDiagnostic` — the
canonical failure record, type 162 — carries a `SchedulerFailureCode` and a free-text `Message`, and a
state-contract failure reaches it as `STATE_VALIDATION_FAILURE` with the state code appearing only
inside that text.

So revision 2's outer-category-plus-subreason shape is **not available**: taking it would mean bolting
an ad-hoc reason field onto one error type, which is the option this addendum was told not to take.

**But the inspection also made the fix smaller.** Enumerating every site rather than assuming:

```
ILLEGAL_WRITE  'path is not a declared writable leaf'          validateNewValue
ILLEGAL_WRITE  'path is not a declared writable leaf'          validateRemoval
ILLEGAL_WRITE  'mutation authority does not own the proposed path'   validateAuthority
ILLEGAL_WRITE  'mutation authority claims paths outside the writable schema'  registry build
INVALID_VALUE  …                                               already a separate code
REMOVE_FORBIDDEN …                                             already a separate code
```

`ILLEGAL_WRITE` overloads exactly **two** runtime meanings, not three: the value case is already
`INVALID_VALUE` and the operation case is already `REMOVE_FORBIDDEN`. The taxonomy was almost right
and had one overloaded member. So:

```
ILLEGAL_WRITE  →  UNDECLARED_WRITABLE_PATH   the path is writable by nobody
               →  NON_OWNING_AUTHORITY       this authority does not own it
INVALID_VALUE      unchanged — no INVALID_LEAF_VALUE is needed
REMOVE_FORBIDDEN   unchanged
```

Two new members replace one overloaded member of a closed union, inside the accepted representation.
**No failure-structure addendum is required**, and revision 2's open item iv is closed. The
registry-build site keeps its own meaning and is out of scope for the runtime write path.

**One consequence to record rather than fix here.** Because a state failure reaches `FailureDiagnostic`
as `STATE_VALIDATION_FAILURE` plus text, a first-divergence comparison performed at the *diagnostic*
level still cannot see this distinction without parsing a message. Write-path first-divergence
comparisons are therefore made at the state-contract boundary, where the code is typed — which is what
existing fixtures already do. Carrying the state code structurally into the diagnostic is a real and
separate question, and it belongs to whatever decision owns the diagnostic record, not to this one.
Diagnostics remain non-authoritative and committed trace is unchanged; nothing here turns a message
into simulation state.

### 2.5 Proof plan, including the audit Part 1 does not need

| # | Control | Obligation |
|---|---|---|
| W0 | Structural path failure still comes first | a malformed or structurally invalid `StatePath` fails with the existing structural code, **not** `UNDECLARED_WRITABLE_PATH`. `resolveWritableLeaf` must not become the universal bucket for every bad path, and the accepted `INVALID_PATH` versus writability distinction survives the repair |
| W1 | Undeclared beats unowned | a patch to an undeclared path yields `UNDECLARED_WRITABLE_PATH`, never an ownership failure, whichever authority is supplied |
| W2 | The distinction is real | declaring the same path writable moves the failure to `NON_OWNING_AUTHORITY`. A control that cannot see this move is not testing what it claims |
| W3 | Order is not incidental | mutation: restoring the old ordering flips W1's code, and is detected |
| W4 | Grammar failures stay distinct | a declared, owned path with an invalid value yields the existing `INVALID_VALUE`, and a forbidden removal yields the existing `REMOVE_FORBIDDEN` — neither becomes one of the two new codes |
| W4a | Removal resolves without a value | `Remove` on an undeclared path yields `UNDECLARED_WRITABLE_PATH` through the same primitive, with no value-validation step reached |
| W4b | Entry points agree | `applyStatePatch`, `validateState` and any preflight report the same first divergence for the same path — they share `resolveWritableLeaf` |
| W4c | Simultaneous faults obey the declared ordering | a declared path with the wrong authority **and** an invalid value yields `NON_OWNING_AUTHORITY`; an undeclared path with the wrong authority **and** an invalid value yields `UNDECLARED_WRITABLE_PATH`. Independent single-fault cases prove the errors exist; only compound cases prove the precedence |
| W5 | **Every existing write-failure vector is reclassified deliberately** | each existing negative fixture is re-run and classified: same success behaviour, same rollback behaviour, same final authoritative state, same successful traces; only previously ambiguous invalid-write first divergences move, each intentionally |

### 2.6 W5 — the completed audit, from running the suite

Predicting the list from `grep` would have undercounted it. Running the repaired substrate against the
existing suite produced **four failing tests across five assertion sites**, every one an invalid-write
first divergence and none of them a behavioural change:

| Site | Old | New | Class |
|---|---|---|---|
| `mutationAuthorityIdentity.test.ts` — registered authority not owning the path | `ILLEGAL_WRITE` | `NON_OWNING_AUTHORITY` | code refined, meaning unchanged |
| `mutationAuthorityIdentity.test.ts` — `validateState` over an undeclared family | `ILLEGAL_WRITE` | `UNDECLARED_WRITABLE_PATH` | **encoded the ambiguity**; amended with the reason recorded |
| `semanticStateAuthority.test.ts` — resolution authority patching a perception counter | `ILLEGAL_WRITE` | `NON_OWNING_AUTHORITY` | code refined, meaning unchanged |
| `semanticStateAuthority.test.ts` — catalog path, wrong authority | `ILLEGAL_WRITE` | `NON_OWNING_AUTHORITY` | code refined, meaning unchanged |
| `semanticStateAuthority.test.ts` — resolution path, wrong authority | `ILLEGAL_WRITE` | `NON_OWNING_AUTHORITY` | code refined, meaning unchanged |

Four of five are genuine ownership failures whose meaning does not move; one is the ambiguity itself,
and it lives in `validateState` rather than `applyStatePatch` — which is why the audit had to cover
every entry point rather than the patch path alone. **No valid execution, authoritative state,
rollback, or successful trace changed anywhere in the suite**: 315 tests pass, and the only
differences are the five diagnostic codes above.

**Mutation evidence.** Restoring the pre-repair authority-first ordering fails W1, W2, W4a, W4b and
W4c. Removing the explicit structural validation fails W0. Both guards are load-bearing rather than
decorative.

---

## 3. Open — required before acceptance

**Acceptance has two levels, and conflating them creates a cycle.** `ADAPT-001` §5.5 places
`PRJ-001` before **F**, permanent numeric allocation; revision 4 then made `PRJ-001` acceptance
require field IDs allocated *by* **F**. Both cannot hold. The split mirrors the `SEM-001I.1 → I.2`
discipline that already worked:

```
CONTRACT / SHAPE ACCEPTANCE          before Campaign 2 allocation
    the symbolic surface of §1.12, in full
    exact field identities and names · requiredness · variant structure ·
    collection semantics · uniqueness · role constraints · identity-tier semantics

CANONICAL IMPLEMENTATION / PERSISTENCE ACTIVATION    after F supplies permanent IDs
    RecordTypeId · FieldId · namespace and tag IDs · root IDs
```

Shape acceptance is what later seam specifications actually need — they must know the projection
mechanism is valid, not that its numbers exist. **Once `PRJ-001` shape is accepted, `EVID-001` may be
drafted against it** without violating the allocation gate.

```
Part 1
i.    §1.12's symbolic surface freezes before PRJ acceptance; permanent
      numeric allocation is deferred to Campaign 2 F, and implementation
      of canonical persisted records is gated on it

Part 2
iii.  nothing — §2.6 records the completed audit. `ILLEGAL_WRITE` survives in the
      closed union for one registry-construction site only ("mutation authority
      claims paths outside the writable schema"), whose name is now arguably
      wrong for what it reports; renaming it is a separate cleanup, not this
      repair
```

## 4. Reopen conditions

A seam needs a composite selector, several admitted source instances, or a selector from something
other than an admitted input field; a read-only state family must become writable, which is a
mutation-authority question and not this addendum's; a key grammar richer than one identity from one
namespace is required; a role constraint must vary by run rather than by model; general canonical
field typing becomes necessary, which `CanonicalRoleConstraint` deliberately does not provide; or the
accepted failure-code vocabulary changes such that §2.4's distinctions need re-expressing.


Campaign 2 allocation clarification (2026-09-06): shared SeamId/1036 uses nonempty canonical
UTF-8 NFC text, exact byte equality, no aliases and no ordinal meaning. Campaign-2 admitting
V04/V06 ExecutingSeamId, FrozenSemanticExperienceProducer.ProducingSeamId and PRJ requirement
seam components use this family. Runtime trace copies validated values; generic historical
TraceRecord/type-160 fields and non-admitting legacy contracts are not globally narrowed. No seam
registry or definition record is introduced. The allocation remains a review candidate.
