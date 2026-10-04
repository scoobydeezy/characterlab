# `IDN-001` — Draft Resolution

**Status:** revision 6. **SHAPE ACCEPTED** as `identity-binding/0.5-candidate` (2026-09-05,
project-local); resolution record in [OPEN_DECISIONS](../formal/OPEN_DECISIONS.md). This is
contract/shape acceptance only:

```
canonical implementation      NOT YET AUTHORIZED
permanent numeric allocation  deferred to Campaign 2 F
controls of §4                frozen implementation gate, not claimed passed
suite                         remains 315 — expected for shape-only acceptance
```

Accepted shape resolution of the closed register decision `IDN-001` — *observer/character identity binding*.
It lives in `docs/planning/`, below `docs/formal/` in the authority hierarchy.

`IDN-001` exists because `ADAPT-001` §2.14 keys every Campaign 2 persistent state family to a
`CharacterId`, and because that identity is a governed role over accepted namespace 1002 rather than a
new namespace. Both consequences need a contract: what makes a semantic referent a character, and how
a perspective identity relates to a person identity. It is a **prerequisite** of `ADAPT-001`, and
every other Campaign 2 seam that writes character state needs it equally.

**Dispositions.** Revision 1: direction accepted. Revision 2: qualification moved to the canonical role
boundary, reverse cardinality resolved as `0..N`, the resolver replaced by transition-entry resolution,
the character-kind validator guarded against circularity. Revision 3: the resolver retired as a runtime
object in favour of projection-compiled resolution, the roster placed canonically, the recognition
precedent corrected, and the projection-vocabulary question answered as disposition **B**. **Revision 4
rebases onto the now-accepted substrate**: `PRJ-001`'s `EventDependentProjectedFieldRequirement`
replaces the provisional `SubjectProjectionRequirement` (§2.4); the roster takes the accepted wrapper
representation (§2.5); `SUBJECT_UNBOUND` is retired as an authoritative code in favour of
`REQUIRED_PROJECTION_VALUE_ABSENT` (§2.9); the five role boundaries are rebased onto accepted
enforcement rather than described per call site (§2.2); the character kind and validator are frozen
symbolically (§2.1); and acceptance is split from allocation (§5).

**Revision 5** closes the last four: the `CONTENT-001`
kind-validator relation is inspected and the two validators kept distinct (§2.1a); the roster gains an
access-closure rule that forbids every alternate read channel the accepted projection vocabulary still
permits (§2.8a, control 8d); the allocation inventory is corrected to include the two new namespace
members (§5); and two terms are cleaned up.

**Revision 6** is the acceptance revision: control 8d gains its third
mutation — a second event-dependent requirement over the roster, the alternate channel the *new*
machinery itself permits — and the frozen gate is stated as all controls in §4 so a later inserted
control cannot fall outside it.

---

## 1. Scope

This decision settles:

1. what qualifies a `SemanticReferentId` as a `CharacterId`, and where that is enforced;
2. the cardinality of the `ObserverId` → `CharacterId` relation, including its partiality;
3. whether the binding may change within a run, and who owns it if so;
4. which identity tier the qualification rule, the schema, and the roster each belong to;
5. what the binding may **not** be used for.

It does **not** settle what a character *is* psychologically, whether every character has a body, or
any state family's contents.

---

## 2. Decision

### 2.1 Character qualification — the kind, the validator, and what it does not mean

`CharacterId` is a governed character role over the accepted `SemanticReferentId` family (namespace
1002). The rule that decides membership is a truth-side governed fact already carried by the
referent's own definition:

> A `SemanticReferentId` qualifies as a `CharacterId` exactly when its origin is authored content and
> that `GovernedContentDefinition`'s `SemanticKind` is the registered character kind.

**Refused: `CandidateDomain`.** Accepted record type 228 already stores a `CandidateDomain` of
`Person | DiscreteObject | PlaceOrRegion` beside a `CandidateSemanticReferentId`, validated at
closure. It looks exactly like the qualification we need. It is not: `CandidateDomain` is what *an
observer believes a candidate is* — observer-owned character state, per observer, seeded per run.
Deciding truth-side state addressing by reading an observer's catalog would make *who has a body*
depend on *who someone thinks they saw*, and would let one observer's seeded beliefs change another
character's writable state paths. It inverts the epistemic direction the architecture is built to keep
straight.

**The symbolic inventory this needs, and what it does not need.** Inspection: `SemanticKind` is a
governed typed identifier on `GovernedContentDefinition` field 2, drawn from the accepted semantic-kind
namespace and resolved against registered entries with deterministic per-kind validators; the accepted
`DomainValidatorId` family (namespace 1021) is the identity family `PRJ-001`'s `CanonicalIdentityRole`
already uses. Neither a character kind nor its validator exists yet, so both are named here:

```
semantic-kind/character         the frozen SemanticKind member; Campaign 2 allocation
                                supplies shared SemanticKindId / 1004

validator/character-qualification
                                a DomainValidatorId (namespace 1021) whose committed
                                predicate is:

    referent origin is AuthoredContent
    AND its GovernedContentDefinition.SemanticKind == semantic-kind/character
```

The earlier claim that both namespaces were already permanent was disproved by F inspection.
SemanticKindId/1004 is a shared CONTENT allocation completion; DomainValidatorId/1021 was already
permanent. IDN's character predicate and semantic version remain unchanged. F also allocates the
roster record shapes (§5).

**The validator is committed model logic, not a callback**, on the same ground `PRJ-001` used to reject
the anonymous `derive` closure and `TRC-001`/`TRC-002` used to reject anonymous predicate validators:
an uncommittable predicate lets what qualifies drift from what `ModelIdentity` says qualifies.

### 2.1a The `CONTENT-001` kind validator is a different obligation — inspected

Accepted `CONTENT-001` requires every `SemanticKind` to have a deterministic validator, absent which
content commitment fails. That could have meant `semantic-kind/character` and
`validator/character-qualification` are one thing. Inspection says they are not:

```
registry / declaration   compileGovernedContentManifest takes semanticValidators as a
                         compile-time argument list; the semanticKindId → validator relation
                         is a Map built from it, not a registry record
identity family          none — ContentSemanticValidator is keyed by the KIND's id and has
                         no identity of its own, so DomainValidatorId cannot inhabit it
input signature          validate(definition: GovernedContentInput): void
committed?               NO — only the kind's registered ID reaches the manifest; the
                         validator's behaviour is a closure passed as an argument
```

So the two propositions are structurally distinct, and **disposition A** holds:

```
CONTENT-001 kind validator     "is this authored definition legal as semantic-kind/character?"
                               input: a GovernedContentDefinition
                               mechanism: the accepted CONTENT-001 per-kind validator

validator/character-qualification
                               "may this referent occupy a CharacterId position?"
                               input: a SemanticReferentId
                               mechanism: DomainValidatorId (namespace 1021), per PRJ-001
```

`IDN-001` therefore carries **two** symbolic validator facts, and does not make them synonyms merely
because both are called validators. `semantic-kind/character` requires a `CONTENT-001` kind validator
by that accepted mechanism; the character role requires the `DomainValidatorId` above.

**One finding recorded, deliberately not made a blocker.** The `CONTENT-001` kind validator is itself
an uncommitted closure — the same defect class `TRC-001`/`TRC-002` rejected for leaf validators and
`PRJ-001` rejected for the derived-projection transformation. It is inherited from an accepted contract
rather than created here, and it does **not** reach this contract's predicate: `IDN-001` qualification
reads whether a definition's `SemanticKind` *equals* `semantic-kind/character`, and that assignment is
field 2 of the governed definition, committed to the content manifest digest. The uncommitted validator
governs whether such a definition is *well-formed content*, not whether the kind matches. So
`IDN-001`'s rule depends only on committed data. Whether content-kind validators should themselves
become committable definitions is a real question for a `CONTENT-*` follow-up, and is named here so it
is not lost.

**Forbidden dependencies.** The validator may not consult:

```
an ObserverId binding · the presence of character state · a recognition
CandidateDomain · body state · current activity
```

Each would make qualification depend on something qualification is a precondition of, and would let
seeding a roster or writing a state path retroactively create a character. Control 13 proves both
directions.

**What qualification means, stated narrowly.** The authored definition establishes *this semantic
entity belongs to the simulation's Character domain and may therefore occupy a `CharacterId`
position*. It does **not** assert:

```
an ObserverId exists · a body exists · any persistent state is materialized
the entity is conscious · the entity is currently active · the entity has psychology
```

Letting the validator mean "this entity has psychology state" would reintroduce the circularity the
forbidden-dependency list exists to prevent.

**The runtime-origin restriction.** `SemanticReferentId`'s nested origin admits authored content *and*
runtime entities, and only the authored half carries a `GovernedContentDefinition`. A character created
mid-run therefore has no kind to read. v0.1 restricts characters to authored content; a runtime-origin
referent does not qualify, and using one as a state subject is a typed failure rather than a silent
miss. This corrects `ADAPT-001`'s earlier claim that namespace 1002's runtime capacity meant "a
character born mid-run needs nothing extra": the identity family is future-proof, the qualification
rule is not yet general, and runtime-origin characters are a reopen condition (§6).

### 2.2 Role enforcement — declared here, propagated by `PRJ-001`

Qualification is a property of the referent, not of the encoded bytes: a `CharacterId` and any other
`SemanticReferentId` encode identically, because a role over a family is not a different family. That
is the correct trade — a separate namespace would buy byte-level distinguishability and pay with an
unregistered `SemanticReferentId` ↔ `CharacterId` relation — but it means the role has to become real
somewhere exact, and a check attached only to the write path leaves three of the four bypasses open
(seeded initial state, restore, and read never touch a `StatePatch`).

> **Every canonical field or key declared `CharacterId` validates the role. A raw `SemanticReferentId`
> does not become a valid `CharacterId` because code cast it, placed it, or restored it into that
> position.**

`IDN-001` no longer describes a bespoke check per call site. It declares one fact —

```
CharacterId role = namespace 1002 + validator/character-qualification
```

— as a `PRJ-001` `CanonicalIdentityRole`, and the accepted substrate propagates it:

```
initial-state construction · decode · restore   CanonicalRoleConstraint validation
StatePath construction                          StateKeyGrammar, then CanonicalRoleConstraint
character-state read                            CANONICAL_ROLE_VIOLATION, never absence
patch write                                     INVALID_PATH if the key grammar is wrong;
                                                CANONICAL_ROLE_VIOLATION if the role is;
                                                then WRT-001 writable-leaf resolution,
                                                then authority
```

The read case matters most: without it, a forged subject would be indistinguishable from a character
who simply has no state yet — absence standing in for invalidity, the collapse `ADAPT-001` §2.16
refuses one layer down.

### 2.3 The binding is a partial function with `0..N` in reverse

```
CharacterObserverBindingState.Bindings map invariants

per ObserverId    at most one CharacterId          the map key enforces it
per CharacterId   zero or more ObserverIds         0..N, for free
a repeated ObserverId                              duplicate map key — whatever the value
```

A partial many-to-one relation represents a non-character observer, a character with no observer, a
character with one, and a character with several perspective identities — without asserting that
`ObserverId` and person identity are equivalent. This claims nothing about multi-perspective characters
being behaviourally important; only that the relation can represent one without redesign, which is the
cheap direction to be wrong in.

**Partiality is the half that needs stating.** Nothing accepted says every `ObserverId` is
character-backed, and this contract does not decide that it is. Unboundness is a **contextual**
failure, not an invalid observer: it fails only at a seam that actually requires a character.

```
unbound observer perceives an event                      permitted
unbound observer produces an observer-relative record    permitted where that seam allows it
character-state read or write for that observer          fails — see §2.9
```

### 2.4 Subject resolution — the accepted `PRJ-001` instantiation

Revisions 2 and 3 carried a provisional `SubjectProjectionRequirement`. It is superseded: `PRJ-001` is
shape-accepted, and `IDN-001` instantiates it rather than describing a mechanism of its own.

```
EventDependentProjectedFieldRequirement
├── SelectorSourceFieldId    the admitted payload's ObserverId field
├── TargetStatePathTemplate  CharacterObserverBindingState / Bindings / mapKey(*)
├── ProjectedFieldId         CharacterObserverBindingValue.CharacterId
├── OutputRole               namespace 1002 + validator/character-qualification
└── OutputAccessor           ResolvedCharacterSubject
```

```
admission → extract ObserverId → compile the exact binding StatePath
          → required roster read → project the CharacterId field
          → expose only ResolvedCharacterSubject → transition begins
```

No resolver object, no direct accessor for the wrapper record, no `Required` Boolean, and no
`IDN-001`-local projection mechanism. Everything that made the earlier design safe is now carried by
the accepted contract: the selector comes from the admitted payload and never from transition code;
the source read is internal and has no transition-visible accessor, so wrapper opacity is structural;
the projection is required-only and read during construction, so a successful projection is total by
construction; and the declaration is the executor.

**Boundness is therefore not representable**, so it cannot be branched on. A character transition has
exactly two states: the projection was built and carries a `CharacterId`, or it was not built and the
transition never ran.

### 2.5 The roster's exact symbolic shape

```
CharacterObserverBindingState
└── Bindings[ObserverId]
    → CharacterObserverBindingValue { CharacterId }
```

A raw typed identity is not an accepted `LeafValueGrammar`, so the value is a one-field record. This is
not the retired pair record: the key carries `ObserverId`, the value carries only `CharacterId`.
Instantiating the accepted `PRJ-001` definitions:

```
ReadOnlyStateFamilyDefinition
    Pattern       CharacterObserverBindingState / Bindings / mapKey(*)
    ValueGrammar  CanonicalRecord(CharacterObserverBindingValue)

StateKeyGrammarDefinition
    Pattern       the same pattern
    KeyGrammar    IdentityKey

CanonicalRoleConstraint
    StateMapKey(CharacterObserverBindingState, Bindings)
        → namespace 1000

CanonicalRoleConstraint
    RecordField(CharacterObserverBindingValue, CharacterId)
        → namespace 1002 + validator/character-qualification
```

`ObserverId` is the roster's semantic uniqueness key, and the cardinality of §2.3 follows from the map
rather than from a validator reconstructing function semantics afterwards. There is no run-scoped
`BindingId`: a binding is immutable relation state, not an event occurrence.

### 2.6 The binding is an immutable initial-state relation

*Marked choice, and the recognition precedent supports less of it than revision 2 claimed.* Recognition
catalogs establish the identity-tier split this contract reuses in §2.7, and the accepted inventory does
say "Recognition reads this state and cannot mutate it" — but `RecognitionKnowledgeState` **has** an
owning authority and removable leaves, so accepted learning or forgetting may mutate it later.
Recognition is a precedent for the tier split; it is not a precedent for a persistent relation with no
authority and no writable leaf. That combination is justified directly:

```
v0.1 admits no transition whose semantics reassign perspective identity
    → no binding path is declared writable
    → no MutationAuthorityId owns one
```

Immutability is the consequence of nothing legitimately writing it, not a property inherited from a
family that does have a writer. It is an **immutable initial-state relation, not ordinary persistent
character state**: it has persistence semantics — it survives save/load and is committed to
`InitialStateDigest` — without having a mutation authority, and calling it character state would make
its lack of an owner look like the unresolved-specification gap Campaign 2 exists to close.

`PRJ-001`'s `ReadOnlyStateFamilyDefinition` is what makes this expressible, and its exclusivity rules
make "no writable path" a property of the model rather than of a missing field.

### 2.7 Schema is model identity; the roster is not

```
qualification rule + binding schema + cardinality   → ModelIdentity / RegistryIdentity
the actual ObserverId ↔ CharacterId pairs           → initial state → InitialStateDigest
                                                      → RunIdentity
```

This is the accepted recognition-state split applied unchanged: "changing a schema or rule changes
`ModelIdentity`; changing Mina's seeded known candidates changes `RunIdentity`, not `ModelIdentity`."

The reason is not filing convenience. Putting the roster in `ModelIdentity` would make every cast change
look like a model revision, and would make two runs of one model structurally incomparable — precisely
what `PHEN-ADAPT-001`'s paired-timeline method depends on being false. A model is a psychology; a roster
is a run.

### 2.8 What the binding may not do

**It is not derivation.** Neither identity may be computed from the other, by convention, prefix, shared
payload, or a lookup table generated from one side. The binding is a registered relation or it is
nothing; a derived one is the identity hazard with the check removed.

**It is not admission.** A binding says who a perspective belongs to. It admits no record to any
transition, and no transition may accept an input because a binding exists. This is the
`registered ≠ admitted` invariant `SEM-001J` recorded, holding here without generalization.

**It is not route membership.** Route membership is `StateFamilyRoute` and `TransitionRoute`
(`ADAPT-001` §2.13); neither reads a binding.

**It is not evidence, and recognition may not read it.** If the binding were readable from the
recognition path, an observer could resolve *who someone is* by lookup — total collapse of a seam that
exists precisely because identity is inferred from cues and never handed over.

```
binding ReadDomain   transitions resolving a subject for state addressing
forbidden readers    recognition, classification, observation, and every
                     observer-side evidence producer
```

**It is not cognitive input.** No psychological semantics may branch on binding topology — not on
whether an observer is bound, not on how many observers a character has, not on whether two share one.
§2.4 makes this structural rather than advisory: the projection carries a total `CharacterId` and
nothing else.

### 2.8a Roster access closure — the alternate read channels must be closed explicitly

§2.4's requirement is safe, but `PRJ-001` **added** the event-dependent mechanism alongside the
accepted static `direct` and `derived` bindings; it did not remove them. Because the roster is a
readable `ReadOnlyStateFamilyDefinition`, this remains constructible unless `IDN-001` forbids it:

```
TransitionSeamContract
    ReadDomain includes the binding family
    static direct ProjectionBinding → Bindings[ObserverB]
    transition.read(that accessor)
```

which bypasses subject projection entirely, as would a legacy `derived` binding whose `sourcePath`
overlaps the roster. Controls 8 and 8a would pass an implementation carrying exactly that hidden
channel, because the *approved* projection is still safe. So the prohibition is stated over the
family, not over one mechanism:

> **Any `TransitionSeamContract` whose `ReadDomain` overlaps
> `CharacterObserverBindingState.Bindings` uses that family *only* as the internal source of
> `IDN-001`'s `EventDependentProjectedFieldRequirement`.**

```
MUST NOT   expose a static direct binding to that family
           expose a derived binding whose sourcePath overlaps that family
           expose the wrapper record through any accessor
           bind an exact roster entry chosen at model definition
           enumerate the family
```

For v0.1 the positive form is equally narrow — a biconditional, because a transition that does not
need a character subject has no reason to hold roster read capability at all:

```
roster family in ReadDomain  ↔  the exact IDN subject-projection instantiation exists

SelectorSourceFieldId  = the admitted ObserverId field
Target                 = CharacterObserverBindingState / Bindings / mapKey(*)
ProjectedField         = CharacterObserverBindingValue.CharacterId
OutputRole             = the Character role
OutputAccessor         = ResolvedCharacterSubject
```

Proven at model construction (control 8d), this makes "the transition sees one subject, not the
relation" structural across **every** accepted projection mechanism rather than only the intended one.

### 2.9 Authoritative failures

`PRJ-001` froze the substrate codes, so `IDN-001` names semantics rather than minting codes.
`SUBJECT_UNBOUND` is **retired as an authoritative code** and survives only as a diagnostic or renderer
label for one specific `REQUIRED_PROJECTION_VALUE_ABSENT` case — which keeps *projection mechanism*
separate from *domain interpretation*.

```
role-invalid subject          CANONICAL_ROLE_VIOLATION
unbound observer              REQUIRED_PROJECTION_VALUE_ABSENT
                              semantic label: subject unbound
roster mutation attempt       UNDECLARED_WRITABLE_PATH
wrong key grammar             INVALID_PATH
```

For an unbound observer the diagnostic context already carries the requirement, accessor, selector,
target path and transition, so a renderer can say *subject unbound* without a seam injecting a code
into projection mechanics. The transition never runs and cannot branch on either name.

---

## 3. Alternatives considered

| Alternative | Why rejected |
|---|---|
| A new permanent `CharacterId` namespace | Immediately owes an unregistered `SemanticReferentId` ↔ `CharacterId` relation, since a world event must know which persistent state belongs to its truth-side Actor. Identity multiplication with the connecting edge left implicit. |
| `CharacterId` ≡ `ObserverId` | Collapses a perspective identity into a person identity, foreclosing non-character observers and multi-perspective characters, and names truth-side character state for a perceptual role. |
| Qualification by `CandidateDomain` | Observer-owned belief deciding truth-side addressing (§2.1). |
| Qualification by an unstored predicate | Nothing validates a concrete key at write time; a lamp-keyed state path is indistinguishable from a valid one. |
| A validator that reads bindings or state presence | Circular: qualification would depend on something it is a precondition of. |
| An `IDN-001`-local subject resolver or projection requirement | Superseded by shape-accepted `PRJ-001`; a second read channel beside the accepted one is a hidden read channel however narrow. |
| An authoritative `SUBJECT_UNBOUND` code | Duplicates `REQUIRED_PROJECTION_VALUE_ABSENT` and puts domain interpretation inside projection mechanics. |
| Binding as a writable state family in v0.1 | Creates a mutable identity relation before any phenomenon needs one, leaving "what happens to state keyed by the old identity" unanswered. |

---

## 4. Proof plan

Every load-bearing guard is mutation-checked before implementation acceptance, per the discipline
`SEM-001` established. These are the frozen implementation vectors, not passed evidence at shape
acceptance.

| # | Control | Obligation |
|---|---|---|
| 1 | Forged role, no patch involved | a non-character `SemanticReferentId` placed into a `CharacterId` field or key fails **canonical construction or restore** with `CANONICAL_ROLE_VIOLATION`, with no `StatePatch` anywhere in the test. A mutation-only check passes this and is caught here |
| 1a | Every role boundary enforces | initial-state construction, decode/restore, `StatePath` construction, character-state read, and patch write each reject a non-character subject; removing the check at any one of the five is detected |
| 2 | Qualification is truth-side | changing an observer's `RecognitionCandidateCatalogEntry` — including its `CandidateDomain` — changes no character's writable path set |
| 3 | Both non-qualification causes fail identically | a wrong-kind authored referent and a runtime-origin referent each fail with the same authoritative `CANONICAL_ROLE_VIOLATION` — one role predicate, one code. Validator diagnostics may distinguish *why* for audit; the state contract does not split. Neither becomes absence, and neither becomes a `CharacterId` |
| 4 | Unbound resolution is typed | an unbound `ObserverId` yields exactly `REQUIRED_PROJECTION_VALUE_ABSENT` — never a successful projection carrying an absent value, never a default, and never the observer identity reinterpreted as a character |
| 5 | Cardinality is exactly `0..N` | `A→Mina` then `A→Glen` fails as a duplicate map key; `A→Mina` then `A→Mina` **also** fails, because a repeated key is a duplicate whether or not its value agrees; `A→Mina` with `B→Mina` succeeds |
| 6 | No derivation | a payload-identical `ObserverId` and `CharacterId` are not thereby bound; resolution consults the registered relation and fails without one |
| 7 | Binding is not admission | a transition offered an input it does not admit still fails admission when a binding exists for its subject |
| 8 | Recognition cannot read a binding | the binding's paths are absent from every observer-side `ReadDomain`; an attempted read is structurally unavailable, not merely refused at runtime |
| 8a | The subject projection exposes one subject, not the binding relation | a transition can read its own resolved `CharacterId` and cannot enumerate bindings, reach another observer's, or observe whether two observers share a character |
| 8b | Unboundedness is scoped to the seam that needs it | an unbound observer perceives an event and produces observer-relative records successfully; only a character-state read or write yields `REQUIRED_PROJECTION_VALUE_ABSENT`. A design that invalidates the observer earlier fails this |
| 8c | The failure is total before any partial effect | on `REQUIRED_PROJECTION_VALUE_ABSENT` there is no character-transition output, no character-state read, and no allocator consumption attributable to a successful execution — checked by allocator-position delta, not by inspecting outputs |
| 8d | No alternate roster read channel | **A**: a static `direct` binding from an exact roster path under a second accessor fails contract/model construction. **B**: a `derived` binding whose source path overlaps the roster fails identically. **C**: a second `EventDependentProjectedFieldRequirement` whose target overlaps the roster and is not the exact `IDN-001` instantiation fails too — the alternate channel the *new* machinery itself permits, which an implementation could otherwise leave open while correctly banning A and B. All three would pass controls 8 and 8a while retaining a hidden read channel |
| 9 | A binding patch fails as an undeclared writable path | a patch proposing a roster mutation yields exactly `UNDECLARED_WRITABLE_PATH` — the path is not writable at all, not owned by the wrong authority |
| 9a | Declaring the roster writable changes the first divergence | negative mutation: declaring a writable pattern over the binding family moves the failure to `NON_OWNING_AUTHORITY`. If the control cannot see that move, it is not testing what it claims |
| 10 | Schema in `ModelIdentity` | changing the binding schema, its cardinality rule, or the qualification rule changes `ModelIdentity` |
| 11 | Roster in `RunIdentity` only | changing which character an observer is bound to changes `InitialStateDigest`/`RunIdentity` and leaves `ModelIdentity` byte-identical |
| 12 | Save/load and replay | bindings survive a persistence boundary byte-identically and replay exactly |
| 13 | Qualification and binding cannot manufacture each other | changing the roster cannot make a non-character referent qualify; changing character qualification cannot manufacture a binding. Both directions, because a validator reading either would be circular |
| 14 | Identity tiers move independently | same `ModelIdentity` and same character content with a different roster → different `RunIdentity`; same roster with a changed qualification rule or binding schema → different `ModelIdentity` |
| 15 | An authored kind change propagates through the normal chain | flipping a content entity between character and non-character kinds changes `ContentManifestDigest` → `ContentIdentity` → `ModelIdentity`, with the roster absorbing none of it |
| 15a | A kind flip invalidates a roster that still references it | with the roster held byte-identical, flipping `person.mina` to a non-character kind makes run/initial-state construction **fail role validation**: the roster now names a non-qualifying `CharacterId`. The roster must neither repair the content change nor remain valid because its own bytes did not move |

Control 11 is the one that would silently pass a wrong implementation: a roster mistakenly committed
into `ModelIdentity` still *works*, and surfaces only as two runs of one model being incomparable — the
failure `PHEN-ADAPT-001`'s paired-timeline method depends on being impossible and cannot detect for
itself.

---

## 5. Acceptance level and what remains

**Accepted substrate dependencies — all closed.** Revision 3 carried a disposition-**B** analysis
establishing that the accepted projection vocabulary could not express event-dependent subject
resolution. All three pieces are now resolved and are recorded here as history rather than as a live
design surface:

```
event-dependent projection                → PRJ-001, SHAPE ACCEPTED 2026-09-05
read-only family / role / key grammar     → PRJ-001, SHAPE ACCEPTED 2026-09-05
write-validation precision                → WRT-001, ACCEPTED and IMPLEMENTED 2026-09-05
```

**Acceptance is split exactly as `PRJ-001`'s was**, so that `IDN-001` need not demand numbers that
`ADAPT-001` says cannot be allocated until `IDN-001` closes:

```
CONTRACT / SHAPE ACCEPTANCE          before Campaign 2 allocation
    the CharacterId role · validator/character-qualification semantics and its
    forbidden dependencies · semantic-kind/character as a registered kind ·
    roster cardinality · the immutable roster's symbolic shape · the exact
    PRJ-001 projection instantiation · roster access closure · identity-tier
    rules · failure semantics · ALL CONTROLS IN §4 as the frozen implementation
    gate — stated as the whole section so a later inserted control cannot fall
    outside the acceptance sentence

CAMPAIGN 2 F — permanent numeric allocation

    record and state shapes
        CharacterObserverBindingState root
        CharacterObserverBindingValue RecordTypeId
        Bindings FieldId
        CharacterId FieldId

    new members of already-accepted namespaces
        semantic-kind/character
        validator/character-qualification

    registration required by §2.1a
        the CONTENT-001 kind validator for semantic-kind/character,
        by that accepted mechanism
```

**"No new namespace" is true; "no allocation for those members" would not be.** The two names above
are new permanent members inside accepted namespaces and still require registry entries in the
Campaign 2 pass. Revision 4 stated the first correctly and let the second follow from it, which it does
not.

Canonical implementation and persistence activation follow **F**, alongside `PRJ-001`'s.

**Open after this revision: nothing at shape level.** One finding is recorded rather than open —
`CONTENT-001` kind validators are uncommitted closures (§2.1a), inherited from an accepted contract and
outside this contract's predicate. The symbolic surface is:

```
CharacterId                       governed role over SemanticReferentId namespace 1002
semantic-kind/character           registered SemanticKind member
validator/character-qualification DomainValidatorId (1021); authored origin AND
                                  GovernedContentDefinition.SemanticKind == semantic-kind/character
                                  distinct from the CONTENT-001 kind validator (§2.1a)

CharacterObserverBindingState
└── Bindings[ObserverId] → CharacterObserverBindingValue

CharacterObserverBindingValue
└── CharacterId                   required
```

---

## 6. Reopen conditions

A character is created during a run, requiring runtime-origin qualification (§2.1); a character's
perspective identity changes within a run — body transfer, possession, replacement; binding semantics
need ordering or priority among a character's several `ObserverId`s; several `ObserverId`s must be fused
into one cognitive perspective; one `ObserverId` must legitimately map to several `CharacterId`s — the
three that genuinely exceed `0..N`, which itself is already permitted and reopens nothing; a
non-character observer is required by a phenomenon rather than merely permitted; or an accepted seam
needs to read a binding from an observer-side `ReadDomain`, which reopens §2.8's sharpest prohibition
and should be treated as a redesign rather than an exception.


### Shared accessor allocation clarification (2026-09-06)

ResolvedCharacterSubject keeps its accepted symbolic spelling and inhabits shared PRJ-owned
ProjectionAccessorId, represented as TypedIdentifierValue with a namespace-only role and no
DomainValidator. Campaign 2 F assigns the permanent namespace and exact member payload together
with ADAPT's two accessor members; none is assigned here. See [PRJ allocation clarification](SUBSTRATE_ADDENDA_DRAFT.md#prj-allocation-clarification--projectionaccessorid-2026-09-06).
Wrong namespace is INVALID_CONFIGURATION at the extended contract-definition boundary. This is
an allocation-home clarification, not an IDN/PRJ semantic change or a narrowing of generic type 147.


Allocation clarification (2026-09-06): the proposed campaign2-allocation/0.2 table supplies
SemanticKindId/1004 with exact nonempty NFC payload semantic-kind/character. It is distinct from
DomainValidatorId/1021 and validator/character-qualification. Wrong namespace fails Campaign-2
content/IDN construction. This corrects an allocation-home assumption, not the qualification rule.
Permanent-allocation acceptance remains pending; VAL-001 activation dependency is unchanged.
