# Campaign2 AD-E7 binding isolation and remaining-control crosswalk

Date: 2026-09-09. Status: substrate correction submitted; whole AD-E7 OPEN.

## Finding and owning contract

The accepted read-evidence correction remains unchanged. Continuing the requested
crosswalk found a separate constructor-alias defect in ContractReadProjection under
`state/0.2-candidate` and CV-READ-001/002, consumed by ADAPT's immutable rule projection.
The constructor validated caller-owned bindings against ReadDomain, then retained
the same object. After construction, mutating that object could redirect later reads
outside the validated path. TypeScript readonly declarations did not prevent this
runtime alias mutation.

The initial three-test assay had two failures: a direct read returned the other
character's7 instead of the admitted character's4, and a replaced derived callback
returned999 instead of4. Exact-domain construction rejection and interface-exposure
controls already passed. These are generic substrate constructor tests, not evidence
of a public Campaign2 binding injection API.

## Implemented correction

`src/substrate/state.ts` now constructs a private binding snapshot first, then
validates and retains that same snapshot. It copies the binding collection, each
binding, accessor identity, direct path, derived projection path, source paths and
transformation identity, and captures the selected derive function.

Mutation of the original objects therefore cannot rebind an existing projection.
It is harmless mutation of detached caller data, not a newly supported rebinding
operation. The projection exposes no rebind method. This fixes the owning substrate
boundary rather than adding a parallel ADAPT reader or silently broadening ReadDomain.
Generic wildcard domains remain permitted when declared; cross-character rejection
in the new test uses an **exact** one-character ReadDomain, not a global character ban.

The correction does not make arbitrary trusted derive closures pure or isolate their
external captured variables. The selected function is captured, not sandboxed.
No state snapshot policy changes: ADAPT still supplies its existing private frozen
state. No new schema, numeric allocation, identity role, runtime profile or error
family is introduced. Generic and historical contract versions retain their identifiers.

## Concrete remaining-control crosswalk

| Requested control | Actual evidence and current disposition |
|---|---|
| Static/dynamic OutputAccessor uniqueness | Existing campaign2TransitionAdmission FCT-G/K/IDN-8d case rejects a static binding colliding with the required dynamic accessor; preserved |
| Static/static and dynamic/dynamic uniqueness | Two additional assertions in that same compiler test now reject duplicate static accessors and distinct requirements sharing one accessor; actual compileRequiredProjections, not a test-only registry |
| Rebinding after construction | New projectionBindingIsolation direct and derived tests exercise source aliases; pre-correction failed, corrected PASS; narrow substrate correction acceptance requested |
| Actual object sharing across evaluations | Existing five-distinct-instance positive and accepted staged substitution negatives are supporting evidence; a direct actual-sharing control still remains |
| Executor-supplied bindings | Public factory is data-only and fixed ADAPT evaluator constructs bindings internally; explicit binding-named negative and complete composition mapping remain |
| Interleaving | Batch token/order checks exist; targeted reentrant/read-evaluation control remains |
| Undeclared accessor/read | Existing state CV-READ-001 executes ILLEGAL_READ for an out-of-domain binding and UNKNOWN_ACCESSOR for a forged accessor; no duplicated test required |
| Cross-character read | New generic exact-domain witness rejects other-character binding with ILLEGAL_READ; this does not alone qualify ADAPT subject confinement across every profile |
| Enumeration/topology | New generic instance exposes no own enumerable fields or entries/keys/state/bindings/rebind API; existing required-projection result exposes only read; not a universal hostile-code reflection claim |
| Owning PRJ mappings | Existing declaration test covers INVALID_PATH and CANONICAL_ROLE_VIOLATION, required projection covers REQUIRED_PROJECTION_VALUE_ABSENT/UNKNOWN_ACCESSOR; generic state covers ILLEGAL_READ/UNKNOWN_ACCESSOR |

Declaration compiler negatives are component evidence. They are not a claim that
the frozen public ADAPT profile admits caller-authored auxiliary binding collections.
Final AD-E7 consolidation must retain that distinction and map the public exclusion.

## Validation and mutation evidence

`projectionBindingIsolation.test.ts`: three tests PASS. Initial targeted run:
32 tests/four files PASS, including generic state, required projections and accepted
ADAPT read-evidence controls. The later full run also executes the two added
declaration assertions. TypeScript checking PASS.

Final fresh-source suite: **98 files / 697 tests PASS**, explicit
`src/test/**/*.test.ts` include; reference tests excluded. All166 recorded preserved
source/frozen-packet fingerprints match their review/freeze manifests. No frozen
artifact was rewritten.

`scripts/prove-projection-binding-isolation.mjs` records
`CAMPAIGN2_PROJECTION_BINDING_ISOLATION_PROOF.json`: baseline three PASS; restoring
the caller binding alias DETECTED; preserving a nested direct-path alias DETECTED.
Each anchor is unique, the direct isolation witness must fail, and unhandled errors
are excluded. Source/test fingerprints remain unchanged during the assay; no mutant
is written to source. Prior substrate/evaluator-sensitive reports remain historical
unless explicitly refreshed for a new whole B/FCT claim.

SUB-008 read/trace evidence and SUB-009 explicit controls retain their preservation
dispositions; no historical mechanism is imported, retired or silently narrowed.
The reference tree and frozen model artifacts are unchanged.

## Requested review

Accept the narrow owning-substrate binding snapshot correction and bounded isolation
controls. Whole AD-E7 remains OPEN for the crosswalk gaps above. AD-E3/4/8/9/10/13
remain PASS; whole B/FCT and Campaign2 OPEN. VAL QUALIFIED, bounded no-RNG
PERSIST-A..H PASS, conditional/deferred PERSIST-I and PHEN-ADAPT PASS unchanged.

## Accepted disposition received 2026-09-09

Narrow binding-isolation correction ACCEPTED, including snapshot-before-validation,
direct/derived member replacement and nested aliases in submitted scope. Generic
exact-domain and bounded interface evidence is accepted; wildcard domains are not
narrowed. Detached-data mutation is not rebinding. Anonymous derive-closure captured
state purity is explicitly NOT QUALIFIED. Static/static, dynamic/dynamic and
static/dynamic declaration uniqueness carry forward as supporting PASS evidence.
Reviewed tree:98 files/697 tests PASS, TypeScript PASS,166 fingerprints PASS, three
binding tests PASS and two alias mutants DETECTED. Whole AD-E7 remains OPEN pending
actual sharing, executor-binding/public composition and active-interleaving controls.
