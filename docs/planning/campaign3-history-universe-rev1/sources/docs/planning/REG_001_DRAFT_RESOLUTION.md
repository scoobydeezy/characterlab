# REG-001 — Draft resolution, revision 5

**Status: SHAPE ACCEPTED**, `regulatory-reference/0.5-candidate`, 2026-09-05.
Shape accepted 2026-09-05. Canonical implementation NOT YET AUTHORIZED; permanent allocation deferred to Campaign 2 F. REG-A..R are frozen, NOT PASSED.
Owner: the unadapted regulatory reference seam. ADAPT owns learned displacement.
Architecture edge: unadapted determinants → reference operating point; reference plus separately
owned adaptation displacement → adapted operating reference. No physiology or learning transition.
Depends on accepted substrate/0.2-candidate, state/0.2-candidate, ordering/0.2-candidate,
ordering-phases/2-candidate, trace/0.2-candidate, PRJ and IDN shape contracts. REG owns the
shared variable vocabulary and signed-displacement bound relation; ADAPT consumes REG.
Supersedes: nothing. EVID's accepted NoStateWrites substrate is not widened to implement adaptation.

## Substrate inspection findings

| Requested surface | Actual finding and consequence |
|---|---|
| RegulatoryVariableId | ADAPT §2.14e proposes a new model vocabulary namespace, not a world referent. No src definition or accepted numeric allocation exists. REG uses that symbolic identity, not another regulatory-axis identity. |
| Variable definition / interval | ADAPT §2.15b/d assigns unit, scale and absolute admissible interval to RegulatoryVariableDefinition, but does not give a canonical implemented definition. No accepted general unadapted operating point exists. REG must specify that missing declaration. |
| Units and scale | ObservationChannel (201) has typed UnitId and exact rational Precision. BoundedEffectTruth (200) has exact rational bounds; the src oracle uses ExactRational. These are not a general regulatory-variable numeric profile. ADAPT's scaled-integer choice is a draft requirement, not an existing observation codec to copy verbatim. No accepted generic regulatory unit namespace or unit-conversion registry was found. |
| Character/body/constitution | STATE_MODEL names constitutional, developmental and embodied classes and ownership rules, but src has no canonical body/constitutional parameter family or named owner supplying this reference. IDN supplies the authored CharacterId role, not physiology. Recognition/catalog state cannot stand in for constitution. |
| Analytical time | src/substrate/time.ts implements LinearRateParameters (120), LinearAnalyticalAnchor (121), LinearParameterRegistry and materializeLinear. Parameters and anchor are exact canonical values; SimInstant is in [0, Int64.MaxValue]. Rate scale is a temporal divisor, not a physical-value scale. |
| Materialization | materializeLinear uses floorDiv, preserves exact remainder, returns a value without mutating the anchor, and rejects out-of-bounds values. applySemanticLinearTransition explicitly re-anchors after a caller-provided transition. That callback is not a committed reference provider; REG does not use it. |
| Numeric representation | cenc/1 signed/unsigned integers and reduced rationals; bigint exact arithmetic; floorDiv and ties-to-even helpers. Linear parameter magnitude/bounds are bigint, not implicitly Int64. Only time has the stated Int64 limit. REG addition needs no floating point or new arithmetic. |
| State/value grammar | Accepted leaf grammar is UnsignedCounter, MembershipMarker or CanonicalRecord. ADAPT therefore proposes a record for signed displacement and absence ≡ zero baseline. REG neither changes that grammar nor owns that leaf. Generic cross-family bound validation and ADAPT StateWrites remain unfinished. |
| Governance | Canonical parameter/anchor values and registry commitment exist. No accepted body callback provides R0. Merely accepting a closure under an ID would recreate VAL-001; the closed declaration below instead fixes every operand and the exact interpreter. |

Inspection anchors: [ADAPT §2.15](ADAPT_001_DRAFT_RESOLUTION.md),
[state model](../formal/STATE_MODEL.md), [time implementation](../../src/substrate/time.ts),
[observation implementation](../../src/observation/observation.ts),
[exact arithmetic](../../src/substrate/exactMath.ts),
[reference mechanism ledger](REFERENCE_MECHANISM_LEDGER.md).

## Expressibility and integration findings

An additive semantic declaration is unavoidable: existing analytical arithmetic does not say which
character/variable domain it describes or that its inputs exclude adaptation/current
physiology. REG supplies that meaning. It does not build a body model to obtain it.

Two explicit integration obligations remain for review, rather than being hidden in callbacks:

1. ADAPT's later writing extension must call this exact bound relation against its signed candidate
   displacement and admit the required governed reference. Its own exact state-family addressing and
   state-validator hook are not implemented or fully shaped by EVID's NoStateWrites-only base.
2. If R0 varies, an unchanged stored D can become invalid as time advances. Write-time checking alone
   is insufficient. The authoritative-use/settled-validity obligation belongs in ADAPT's
   materialization/settlement contract. This draft chooses rejection, not clamping, automatic decay,
   retrospective redefinition or a feedback correction. ADAPT owns the exact enforcement hook.

These are not reasons to reopen EVID or elevate VAL-001. REG cannot claim its invariant is already
enforced by the existing single-record leaf validator.

## Semantic purpose

R0 is the **unadapted reference**, not the current physiological value and not a previous adapted
reference. This version treats its determinants as explicitly authored immutable model data.
It does not claim to derive them from age, hormones, latent traits or a constitution subsystem.
That thin control preserves character-relative variation without inventing those mechanisms.

## Required phenomena

PHEN-ADAPT-001 1.8.0-draft: equal unadapted determinants with different adaptation history preserve
R0 while allowing different D. Preserve PHEN-DET-001 and the constitution/learning separation in
P3-009/P3-010. This does not prove physiological plausibility or any adaptation curve.

## Domain and codomain — exact symbolic declarations

**Upstream ownership:** REG owns RegulatoryVariableId, RegulatoryVariableDefinition,
RegulatoryReferenceDefinition, referenceOperatingPoint and adaptedReferenceIsValid. D means a signed
displacement in V's canonical lattice. ADAPT owns its persistent record, key, authority, StateWrites,
kinetics and transitions. Campaign 2 F allocates RegulatoryVariableId under the REG surface.

**Focused unit inspection:** ObservationChannel field 5 (type 201) is TypedIdentifierValue in
src/observation/observation.ts; decoding checks only the generic identifier tag. No accepted UnitId
family, unit definitions, or general/observation-only semantic scope was found. Observation tests
use fixture namespaces 24004, 25012 and 26004, respectively in observation.test.ts,
observationIntegration.test.ts and phenSem001Measurement.test.ts. These are not a governed unit
registry. Reusing their IDs would elevate fixture vocabulary into general authority.

**Disposition:** no Unit field or unit token. Each RegulatoryVariableId defines its own abstract
scalar domain and is the dimensional/semantic discriminator. Equal scales or bounds do not make
two variables compatible. There is no conversion or cross-variable comparison. Physical units
require a versioned governed vocabulary and explicit bridge semantics when a phenomenon earns them.

**Exact symbolic shapes:**

```
RegulatoryVariableDefinition          canonical nested record
    Scale                           positive canonical unsigned integer
    Minimum                         canonical signed integer
    Maximum                         canonical signed integer
```

Minimum ≤ Maximum. Unit-bearing definitions are outside the admitted schema.
The fixed numeric grammar of this contract is SignedScaledInteger: integer n denotes
n/Scale in V's own abstract level, with one lattice step 1/Scale. No alternative grammar or quantizer flag exists.

```
RegulatoryCharacterReferenceKey
    CharacterId                     IDN authored Character role

RegulatoryReferenceDefinition        canonical nested record
    CharacterReferences             canonical map<RegulatoryCharacterReferenceKey, LinearAnalyticalAnchor>
    Parameters                      canonical map<RegulatoryReferenceParameterId, LinearRateParameters>
```

This is a distinct definition family from the variable record: both are bundled in one registry
entry value `RegulatoryVariableRegistration { VariableDefinition, ReferenceDefinition }`, keyed by
the single RegulatoryVariableId, to avoid duplicate global StableIds. Proposed RegistryKindId
member `registry/regulatory-variable` admits exactly that schema with
DefinitionVersion = regulatory-reference/0.5-candidate and the RegulatoryVariableId StableId family.
No ProviderId, reference occurrence, family ID, binding ID or duplicate variable field is introduced.

The wrapper's sole field uses CanonicalRoleConstraint:
RecordField(RegulatoryCharacterReferenceKey, CharacterId): RequiredNamespace = 1002,
DomainValidatorId = validator/character-qualification. This is PRJ RecordField, not StateMapKey on a registry map.
No new role position and no raw SemanticReferentId cast. Same CharacterId gives byte-identical
wrapper keys, so canonical map duplicate-key rejection establishes uniqueness structurally.
Using IDN's accepted qualification predicate, define exactly:

```
QualifyingCharacters(M) = {
    S in SemanticReferentId namespace 1002 |
    origin(S) = AuthoredContent
    AND GovernedContentDefinition(S).SemanticKind = semantic-kind/character
}

for every registered V:
keys(CharacterReferences(V)) = {
    RegulatoryCharacterReferenceKey(C) | C in QualifyingCharacters(M)
}
```

The content definitions are those admitted to M; unresolved definitions never qualify. This exact
set equality rejects both missing and extraneous keys. It depends on no roster, active cast, body,
ObserverId, binding or state presence. A run may use a subset without changing model declarations.
This intentionally total finite product is the initial applicability domain. No absent/not-applicable
variant, implicit zero reference, or dependency on ObserverId/binding presence exists. Empty cast or
empty variable set cannot satisfy the positive REG fixture; it contains at least one of each.

LinearParameterRegistry is a runtime class with a private Map, not a canonical schema/codec.
The local Parameters map is necessary canonical packaging. Each key equals its value's embedded
ParameterIdentity; duplicate keys fail structurally. Values populate the existing runtime registry
unchanged. The equality check is representation consistency, not uniqueness-by-field logic and
not a second parameter authority.

Across all REG entries in M, parameter ownership is globally singular:

```
V1 != V2 => keys(Parameters(V1)) intersection keys(Parameters(V2)) = {}
```

Every RegulatoryReferenceParameterId belongs to exactly one V and exactly one complete parameter record.
Reuse across variables fails even when bytes agree. Several characters within one V may share its
parameter. No composite identity or cross-variable alias is introduced. A later shared parameter
registry requires a versioned extension. The disjoint maps can populate one existing runtime
LinearParameterRegistry without ambiguous lookup or duplicate insertion.

**Identity-domain inspection and ownership:** type 120's ParameterIdentity and type 121's
GoverningParameterIdentity are TypedIdentifierValue in time.ts, with no frozen universal parameter
namespace. Their existing schemas can carry a new typed family unchanged. Type-101 ParameterIdentity
is a separate parameter-set digest record and is not the identity used in these fields.

REG defines the new symbolic family RegulatoryReferenceParameterId. Every Parameters map key,
embedded LinearRateParameters.ParameterIdentity and REG anchor.GoverningParameterIdentity must
inhabit that family. Map key equals embedded identity; each anchor resolves locally. These are
REG's closed contextual construction checks, not global role constraints on all type-120/121 uses.
Their namespace receives no permanent number before F.

The owning REG Parameters map is the sole authoritative declaration site. Across V, a
RegulatoryReferenceParameterId has one owner, even when duplicate declarations have equal bytes.
Within V, several character anchors may share its parameter. A byte-identical copy or permitted
reference elsewhere remains a copy/reference, not another declaration. Merely containing a type-120
value gives neither executable parameter authority nor authority to invalidate REG construction.
No whole-manifest occurrence scan or inferred non-REG declaration set is used.

Other identity families with the same payload remain distinct typed identities. A future seam
seeking executable definition authority for RegulatoryReferenceParameterId must explicitly admit
that family and prove compatibility with REG ownership; references or copies do not grant it.
Generic non-REG parameter ownership is deferred to its own receiving contracts, not inferred from
canonical record presence or separate runtime registry instances.

Reuse complete accepted type-120 parameters and type-121 anchors, with these **closed constraints**:

- AnchorInstant = 0, fixed once. ValueAtAnchor is signed in the variable's lattice.
- ExactBoundedRemainder = 0 at this authored anchor, removing fractional seeded alternatives.
- GoverningParameterIdentity resolves to exactly one entry of Parameters. No unused parameter
  definitions; every entry is referenced and its key equals its embedded ParameterIdentity.
- ValueMinimum and ValueMaximum in each TIME parameter equal the variable's Minimum/Maximum.
- Rate is exact signed lattice ticks per TIME Scale simulation-time ticks. TIME Scale is positive
  and may differ from the **variable's value Scale**: they have different dimensions and must never
  be equated by name. The accepted TIME encoding/identity is preserved.
- Model construction validates materialization at both SimInstant endpoints 0 and Int64.MaxValue
  against the variable interval. Monotonic affine-floor behavior then proves totality at every valid T.

The provider is the one fixed `materializeLinear` operation over this record, not an arbitrary
function or provider-kind escape hatch. Rate=0 represents a constant with TIME Scale=1 as its normal
form. For nonzero rates require gcd(abs(Rate), TIME Scale)=1 to avoid equivalent rate encodings.
Existing TIME typed-identifier fields are reused with RegulatoryReferenceParameterId; identities are not derived from character IDs or numeric magnitudes.

R0 returns the existing cenc/1 signed integer value in the resolved variable domain. There is no
allocated reference result or persisted R0 record. For tracing, the source registration key, full
accepted definition, T, result and existing materialization remainder are enough.

## Closed governed construction interpreter

`registry/regulatory-variable` admits one closed construction algorithm, fixed by this contract
version and interpreted by substrate code. No SemanticRegistryEntry callback or configurable
predicate may replace or supplement its semantics. Inputs are the model's committed regulatory
registrations, canonical schemas/roles and admitted authored content definitions. It reads no run
state. Its exact closure is:

1. Validate each variable definition's exact schema, positive Scale and Minimum ≤ Maximum.
2. Validate CharacterReferences canonical wrapper keys and the IDN Character role.
3. Validate Parameters canonical typed-identifier keys and complete type-120 values.
4. Require each parameter map key to equal its embedded ParameterIdentity.
5. Require every anchor's GoverningParameterIdentity to resolve locally in that V's Parameters.
6. Require every parameter to be referenced by at least one anchor.
7. Require each parameter's ValueMinimum/ValueMaximum to equal V's Minimum/Maximum.
8. Require the character key set to equal exactly the wrapper image of QualifyingCharacters(M).
9. Require parameter keys, embedded parameter identities and anchor governing identities to inhabit
   RegulatoryReferenceParameterId; require distinct variables' parameter-key sets to be disjoint,
   even for identical values. No occurrence scan outside authoritative REG declaration sites.
10. Validate complete type-121 anchors, zero AnchorInstant/remainder and the rate normal forms
    above; apply accepted TIME parameter validity, including positive TIME Scale.
11. Materialize each anchor at 0 and Int64.MaxValue using only accepted materializeLinear;
    both calls must succeed in V's bounds.

Apply these passes in numbered order over entries and map keys in canonical byte order; pass 9
compares the complete REG declaration set. Any construction-check failure rejects model compilation with
INVALID_CONFIGURATION before run creation. Inherited decoding/role/TIME errors may identify the
inner failure at their boundary; they cannot turn a failed check into admitted configuration.
No new nested diagnostic representation is claimed.

The registry kind, schema/version and full declaration bytes are model-committed. Changed admitted
declarations change ModelIdentity. Changing the closed algorithm requires a versioned contract
change; interpreter behavior changed under fixed declarations is a mutation defect that REG-M
must detect. This is the specified interpreter, not a promise that a future helper will define it.
It does not make VAL-001 a prerequisite or authorize canonical implementation before F.

## Variable domains, ranges, and applicability

R0, D and R0+D use the same signed lattice and the same resolved VariableDefinition, not independently
selectable unit/scale metadata. R0 and the effective absolute reference must lie in [Minimum,Maximum].
**D is a displacement, not an absolute value**: its valid interval at T is
[Minimum−R0(T), Maximum−R0(T)]. Imposing the absolute interval on D would contradict REG's signed
displacement meaning, e.g. R0=80 on [0,100] permits D=−30 but rejects +30.

No quantization occurs at addition. TIME materialization alone uses its already accepted floor/remainder
semantics; REG does not replace it with nearest rounding. D is already an exact signed lattice value.
V resolves the only numeric domain before arithmetic. No caller-supplied domain descriptor exists.
Using a displacement selected under V1 for V2 is a downstream semantic-key violation. ADAPT must
preserve C,V from its state/candidate key through the REG call. A bare signed scalar cannot prove
its origin; key preservation is an explicit ADAPT integration proof gate, not unit comparison.

## Registered ReadDomain and capability-limited projection

The provider reads only its model-committed variable/reference declarations and explicit T. No
authoritative state paths, roster, experience, belief, current physiology or learned D are read to
produce R0. CharacterId is supplied by the future caller's legitimate state-addressing path; REG
validates its role and exact map lookup, never resolves observer identity itself.

The bound relation receives D separately from ADAPT's legitimate candidate/current-state projection.
That does not grant the provider access to the entire adaptation state or change R0's arguments.

## Actual-read recording and derived-input provenance

Record C, V, T and the exact governed parameter/anchor values used, materialized R0, proposed D and
sum in the caller's existing trace input/output projections. Model identity commits declarations.
No truth-side reference output becomes observer evidence; EVID remains independent of REG.

## Authoritative StatePatch writes and sole MutationAuthorityId

None. No REG state root, learned leaf, mutation authority or patch. The reference table is immutable
model data, not a copy of a nonexistent constitutional state family. There is no existing body owner
to name, and REG does not fabricate one. Later mutable developmental determinants require their own
owner/read/ordering contract and a versioned provider extension.

## Epistemic permissions and forbidden knowledge

This is an upstream truth-side reference for ADAPT validation, not cognitive knowledge. D, previous
adapted reference, current physiology and psychological state cannot affect reference evaluation.
No observation, appraisal or identity inference can read REG by virtue of its existence.

## Preconditions

The model admits this exact registry schema/version, validates variable domains, Character roles,
totality, anchor/parameter closure and endpoint bounds. Run creation validates the model's existing
identity and character use; a run cannot introduce a character outside the authored map without
the already required IDN runtime-character extension. All requested instants are valid SimInstants.

## Totality, typed failures, instant rollback, and failed-run behavior

Model compilation uses INVALID_CONFIGURATION for malformed declarations, including unit-bearing schemas,
invalid scale/interval, missing/extraneous reference entries, inconsistent parameter map key/value
identities, unused/unresolved parameters and non-total endpoint bounds. Inherited canonical and
role validation retain their boundary failures.

The REG semantic boundary adds only these codes, with no numeric allocation:

| Code | Meaning and first boundary |
|---|---|
| REG_UNKNOWN_VARIABLE | Query refers to no admitted variable definition; never numeric zero. |
| REG_ADAPTED_REFERENCE_OUT_OF_RANGE | Exact sum lies below Minimum or above Maximum, including a retained D invalidated by time. Candidate/state validation fails; never clips. |

Invalid CharacterId retains PRJ CANONICAL_ROLE_VIOLATION; an absent qualifying-character entry is
INVALID_CONFIGURATION. Invalid T retains TIME INVALID_INSTANT; legitimate TIME arithmetic errors
retain their TIME codes at that boundary. For otherwise valid input order is variable resolution →
character role/wrapper lookup → canonical signed D for validation → T → materialization → sum bounds.
Malformed D is an inherited input-shape failure. No operand-side domain metadata is admitted.
REG owns the exact local carrier and translation below; ADAPT must not recreate it from a Boolean
or invent a string. These are closed operation-result sums, not scheduler codes or persisted records.

```
RegulatoryReferenceFailureCode = REG_UNKNOWN_VARIABLE | REG_ADAPTED_REFERENCE_OUT_OF_RANGE
ReferenceResult = ReferenceValue(canonical signed integer) | Failure(REG_UNKNOWN_VARIABLE)
AdaptedReferenceValidationResult = Valid
                                | Failure(REG_UNKNOWN_VARIABLE)
                                | Failure(REG_ADAPTED_REFERENCE_OUT_OF_RANGE)

referenceOperatingPoint(C,V,T) -> ReferenceResult
validateAdaptedReference(C,V,T,D) -> AdaptedReferenceValidationResult
```

Unknown V returns the typed Failure(REG_UNKNOWN_VARIABLE), including from validation. Otherwise
referenceOperatingPoint returns ReferenceValue(R0). For otherwise admitted C,V,T,D,
adaptedReferenceIsValid is the mathematical Boolean relation; it is not defined for unknown V or
malformed arguments. validateAdaptedReference invokes the same reference operation, propagates
unknown-variable failure unchanged, and returns Valid iff the relation holds; otherwise it returns
Failure(REG_ADAPTED_REFERENCE_OUT_OF_RANGE). Inherited role/input/TIME failures retain their typed
boundary behavior and are not silently converted to false. No untyped throw or message parsing.

These local sums have no standalone canonical encoding, occurrence identity or allocated record
type. If ADAPT later persists a result in a trace/diagnostic, its integration contract must specify
that canonical representation at F; it cannot serialize a host exception or invent REG meaning.

A REG contract error carries its flat typed code at the validation boundary; an invoking scheduler
uses its existing state-validation failure envelope and records REG context. No claim is made that
today's diagnostic schema preserves the inner code structurally. ADAPT's writing extension must
freeze that integration before implementation, following WRT's boundary discipline rather than
parsing messages as proof. ADAPT owns candidate rejection, rollback and the no-write enforcement hook;
REG introduces no global scan, scheduler hook or clock-advance authority.

## Exact transformation

For valid C,V,T, let A=CharacterReferences[RegulatoryCharacterReferenceKey(C)]
and P=resolve(A.GoverningParameterIdentity):

```
R0(C,V,T) is the scalar inside successful referenceOperatingPoint(C,V,T)
R0(C,V,T) = materializeLinear(A,T,P).value
         = A.ValueAtAnchor + floorDiv(T * P.Rate, P.Scale)

effective = R0(C,V,T) + D
adaptedReferenceIsValid(C,V,T,D) = (Minimum(V) <= effective <= Maximum(V))
valid abbreviates adaptedReferenceIsValid
```

The second line abbreviates the accepted operation under the frozen zero anchor/remainder; the
implementation must preserve full accepted remainder behavior, including for negative rates.
Any state-absence baseline is downstream ADAPT policy, never a REG dependency or absent R0.

## Random addresses and distribution mapping

Not applicable: no randomness or stochastic provider selection.

## Quantization and rounding points

TIME floorDiv is the sole time quantization, with exact bounded remainder. No float conversion,
rounding at lookup, clipping at bounds or rescaling between operands. cenc signed integers are not
limited to Int64; no unannounced overflow range is introduced for scalar values.

## Canonical collection ordering and tie rules

Maps use accepted canonical byte order; duplicate keys
fail even if values agree. Character order, variable order and incidental query order change nothing.

## Event phase and timing semantics

**Decision: T is required; time-varying linear R0 is admitted, not only constant fixtures.** This
finite contract forbids arbitrary development/circadian/hormone functions, not time variation itself.
Requiring endpoints in bounds intentionally excludes unbounded linear drift beyond the declared
interval over the full supported clock. It adds no clamp or finite-run horizon to the substrate.

At phase-140 ADAPT candidate validation, evaluate at the executing event's exact DueAt T, against
the common frozen pre-adaptation projection required by ADAPT. Reference determinants are immutable
model data, so earlier same-T physiological or adaptation changes cannot change R0. There are no
same-T mutable constitutional/developmental inputs to order in this version. Such inputs require
a future version; this is not an ORD-005 decision or an eternal-constant architectural assertion.

The provider computes on demand from its original anchor. No read persists R0, changes a remainder,
or re-anchors. Do not call applySemanticLinearTransition for a query. Save/load retains normal model
identity/declarations and ADAPT state/clock, with no REG current-value cache as authority.

**ADAPT integration obligation:** every authoritative use and settled validity of stored D at T
must satisfy REG.valid(C,V,T,D). Time-only invalidity fails authoritative validation, with no clamp,
repair of R0 or rewrite of constitution. ADAPT final consolidation owns the exact pre-state,
materialization/settlement hook and rollback. REG does not prescribe a global scan on clock advance.
The no-write case is an explicit ADAPT integration gate. Phase-140 candidate validation uses
event.DueAt and ADAPT's frozen pre-adaptation state/candidate projection.

Save/load preserves exact R0 and validity at restored T; ADAPT owns stored-D admission there.
For unchanged D, monotone R0 means valid endpoint sums imply validity between them; this arithmetic
fact does not prescribe an enforcement hook. Reads at arbitrary T do not advance authoritative time.

## Postconditions

R0 is exactly determined by C,V,T and ModelIdentity because this candidate deliberately commits all
reference determinants to the model. Different authored baseline/rate choices change ModelIdentity;
different adaptation histories may share it. Moving those determinants to run-seeded constitutional
state later would change REG-A's conditioning and requires an explicit contract revision.

## Invariants

R0 does not depend on D or physiological state; R0 and the adapted reference stay in the declared
absolute interval at valid authoritative boundaries; each lookup has zero mutation; persistent
constitution is neither invented nor rewritten by regulatory adaptation. Registered does not imply
cognitively admitted, and reference validation does not authorize ADAPT writes.

## Trace records and provenance

Existing trace projections identify the exact model definition, anchor/parameters, time and scalar
result. No new provenance system, source occurrence, event, ExperienceId or character evidence.

## Candidate mechanisms and control implementations

Preservation intake: SUB-001/003/008/009 PORT through existing exact arithmetic, canonical identity,
trace and paired comparison; TIME portion of SUB-008 reused directly. SUB-002 rounding controls
preserved while this seam adds no new rounding. MEC-003 CONTRACT stays ADAPT's bounded-effect
obligation, not a claim that every regulator is a Need meter. CTL-001 and CTL-006 remain CONTROL /
CANDIDATE for later physiology and constitution; no historical meter or seven-dimensional formula
is adopted. P3-009/P3-010 CONTRACT/CORPUS supply constitution/history separation. SUB-012 and
CTL-008 remain later response/adaptation CONTROL candidates; no kinetics imported. RET-006/014
remain prohibited truth-to-cognition paths. Historical time/rational replay controls remain in
reference/ read-only; no historical test or research finding is claimed passed by this draft.

## Competing models / ablations

Frozen negative controls substitute current physiology, R0+D or previous adapted reference for R0;
admit duplicated domains or cross-variable D; round with floats; mutate the anchor on read; allow callback-defined providers;
omit time-only D revalidation. None is an accepted alternative or psychological reduction verdict.

## Equivalence relation and tolerances

Exact canonical scalar/reference/definition/state equality with zero tolerance. Paired adaptation
histories keep C,V,T and model declarations fixed; D may differ, R0 must not. Trace identity and
allocator activity unrelated to REG do not become numerical inputs.

## Proof obligations and executable tests

**REG-A..R are the frozen implementation gate, not executed or passed.**

| Vector | Required result |
|---|---|
| REG-A | Same C,V,T and ModelIdentity: identical reference bytes. Changing one authored reference/rate/domain declaration changes ModelIdentity. |
| REG-B | Different learned D and prior adapted reference, fixed declarations: identical R0. |
| REG-C | Change current physiological/body state, fixed declarations: identical R0 and no state read. |
| REG-D | No Unit field/token exists. Injecting one produces an unadmitted schema rejected before arithmetic; no unit comparison or token allocation. |
| REG-E | Operand-side scale/interval descriptors and alternate scalar grammar are unrepresentable. ADAPT mutant selects D under V1 but calls REG for V2, including identical scales/bounds: key-preservation integration rejects before arithmetic; REG never rescales or compares duplicate metadata. |
| REG-F | V's own abstract domain, Scale=1, interval [0,100], constant R0=80: D=−81 fails out-of-range. |
| REG-G | Same fixture, D=21 and D=30 fail out-of-range although those displacements lie in [0,100]. |
| REG-H | Same fixture, D=−80 and D=20 pass exactly at endpoints; D=−30 passes at 50. |
| REG-I | Save/load/replay at the same clock yields identical R0, D validation and reference parameters; no newly allocated reference or re-anchoring. |
| REG-J | Nonzero signed-rate control: query A→B→C, repeated C, and A→C from the same authored anchor; values/remainders agree and declarations are byte-identical. Include negative-rate floor behavior. |
| REG-K | Admissible time-varying witness: interval [0,100], initial 80, Rate=1, TIME Scale=Int64.MaxValue, value Scale=1. R0(0)=80 and R0(Int64.MaxValue)=81. A zero-rate fixture remains 80. Changed T affects only the committed formula. |
| REG-L | Paired same-provider/constitution-model histories with D=0 and D=10 at T=0 produce R0=80 in both, effective 80 and 90. No provider/constitutional bytes change. |
| REG-M | With declarations fixed, mutate each closed construction check in turn: key/value identity, local resolution, referenced-parameter closure, bound agreement, exact character totality, global parameter uniqueness, anchor/rate normal forms and endpoint totality. Malformed fixtures must distinguish each mutant from the closed interpreter (REG-N/Q and targeted construction fixtures); also retain D/body-read, wrong-key, rounding and callback mutants. Any skipped check must be detected, not merely tested on valid inputs. |
| REG-N | Missing C×V reference, duplicate character, non-character key, orphan parameter, bad anchor/remainder or endpoint overflow fails construction. Absent reference never equals zero. |
| REG-O | REG-K with retained D=20: valid at T=0, invalid at Int64.MaxValue without a write. REG.valid is false. ADAPT must reject authoritative use/settled validity and prove rollback at its chosen hook. No REG-owned scan, clamp or feedback repair. |
| REG-P | Query R0 repeatedly and across same-T phase-140 writes: no patch, allocator movement or authoritative cache/anchor change. Entire instant failure after candidate validation restores ADAPT state and trace. |
| REG-Q | Two distinct variables declare the same ParameterIdentity: INVALID_CONFIGURATION both when complete parameter bytes agree and when they differ. Control: several characters within one variable may share its single parameter entry. |
| REG-R | Wrong identity family in a parameter key/value or anchor fails INVALID_CONFIGURATION. The same RegulatoryReferenceParameterId owned by two V fails even for equal bytes (REG-Q). Positive control: a byte-identical inert copy or permitted reference outside the authoritative REG map does not become a second owner and does not fail REG construction. A different family with equal payload is not the same identity. |

REG-A additionally checks ReferenceValue and unknown-V Failure carriers for both operations;
REG-F/G check the exact out-of-range validation variant, REG-H checks Valid. No caller-produced
string or Boolean-to-error invention satisfies these vectors. REG-M also mutates identity-family
checks and substitutes a recursive occurrence scan; REG-R's negative and positive controls must
detect both mutants. An inert-copy fixture must be admitted by its own receiving schema; REG does
not grant new metadata or evidence permissions merely to supply this control.

## Applicable Campaign 0 conformance vectors

After accepted shape and F: relevant CV-TIME-001..006, CV-SAVE, CV-TXN, identity/registry/role,
read-domain and exact-numeric conformance, plus REG-A..R and ADAPT integration controls.
This document change runs none and implies no new suite evidence.

## Known domain exclusions

No tolerance/sensitization/load kinetics; no hormone or circadian formula; no homeostatic feedback,
body materialization design, development system, appraisal/regulation ORD-005, constitutional
inference, runtime character creation, nonlinear provider, mutable reference-source state, reference
re-anchoring, implicit conversions or persistent reference cache. No new writable state or authority.
Full SimInstant endpoint admissibility is a deliberate bound on this initial linear candidate, not
an assertion that real physiological references are globally linear.

## Unresolved decisions

REG-001 revision 5 is shape-accepted, 2026-09-05. This pass adds RegulatoryReferenceParameterId,
removes occurrence-based ownership and updates the allocation inventory. The full-clock
linear provider and semantic architecture are shape-accepted. ADAPT integration must be explicit, but
REG does not own or invent ADAPT's StateWrites extension. VAL-001 remains P1 without blocking this
pre-allocation draft. All schemas, registry kinds and IDs remain symbolic; no permanent allocation.

## Reopen conditions

A required phenomenon needs run-seeded/mutable determinants, nonlinear/cyclic or finite-window
reference, later anchor, physiological unit conversion, partial applicability or a recovery policy
for time-invalidated D. Amend the exact provider contract and its proof gate rather than adding a
callback or allowing learned state to redefine unadapted determinants.

## Change history

2026-09-05: first inspection-backed REG proposal, exact symbolic declarations and REG-A..P. No
acceptance, numeric allocation, canonical implementation or research verdict.

2026-09-05 revision 2: shared vocabulary moved upstream to REG; UnitId and runtime parameter-registry
inspection completed; closed abstract Unit, PRJ-compatible wrapper keys and parameter map proposed;
duplicate numeric metadata removed; exact enforcement timing remains ADAPT-owned. Semantic direction
accepted by review; shape acceptance still withheld. REG-A..P remain unexecuted.

2026-09-05 revision 3: removed Unit and its one-value token; V alone discriminates abstract domains.
Froze global parameter ownership, the eleven-pass construction interpreter, exact IDN-qualified
character-set equality and REG-Q; strengthened REG-M. REG-A..Q remain frozen, not passed.

2026-09-05 revision 4: closed REG-local operation results; inspected TIME/model ownership and added
whole-model REG/non-REG collision closure and REG-R. Exact IDN validator and nested registry wording
corrected. Shape acceptance still withheld pending review; no implementation or allocation.

## Campaign 2 F inventory — symbolic only

- New identity family: RegulatoryVariableId.
- New identity family: RegulatoryReferenceParameterId, used in existing TIME identifier positions.
- New RegistryKindId member: registry/regulatory-variable, with this closed versioned interpreter.
- New canonical nested record RegulatoryVariableDefinition: Scale, Minimum, Maximum.
- New canonical key record RegulatoryCharacterReferenceKey: CharacterId.
- New canonical nested record RegulatoryReferenceDefinition: CharacterReferences (wrapper-key →
  type-121 map), Parameters (RegulatoryReferenceParameterId → complete type-120 map).
- New canonical registry definition value RegulatoryVariableRegistration: VariableDefinition,
  ReferenceDefinition. Exactly one SemanticRegistryEntry per V, StableId = RegulatoryVariableId.
- PRJ RecordField constraint on RegulatoryCharacterReferenceKey.CharacterId:
  RequiredNamespace = 1002; DomainValidatorId = validator/character-qualification.
- Local RegulatoryReferenceFailureCode, ReferenceResult and AdaptedReferenceValidationResult
  have the exact variants above; no standalone canonical schemas/tags are requested by REG.
  Any later ADAPT diagnostic encoding must be explicitly included in its F inventory.

All new fields and map grammars above require symbolic-to-numeric allocation at F. Existing typed
identifier encoding, LinearRateParameters (120) and LinearAnalyticalAnchor (121) are reused unchanged;
the REG-specific identity family is newly allocated at F, not the TIME fields or record schemas.
No UnitId, ProviderId, ReferenceOccurrenceId, REG state root or MutationAuthorityId is introduced.

Revision 5 disposition: removed revision 4's whole-manifest scan; parameter ownership now comes from
the REG-specific identity domain and its authoritative registry sites. REG-R proves copy/reference
does not imply ownership. All other reviewed semantics remain intact. Shape acceptance is recorded; REG-A..R remain frozen, not passed. No permanent allocation or implementation.

Acceptance record — 2026-09-05: SHAPE ACCEPT revision 5 as regulatory-reference/0.5-candidate. No revision 6 design pass. All REG-A..R are frozen, not passed. REG closes ADAPT’s final prerequisite; ADAPT itself still requires final shape consolidation. VAL-001 remains P1 and does not reopen REG. No implementation authorization or permanent allocation before F.
