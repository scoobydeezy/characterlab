# Campaign-2 origin implementation checkpoint

2026-09-06. Implements `referent-origin/0.1-candidate` over the now permanent
`origin-allocation/0.1-candidate`. The conditional review's machine gate passes with 43 checks.
1037/1122 are frozen; Campaign-2 and VAL allocation bytes are unchanged. No new semantic decision
is required for this origin correction. Factory activation remains pending.

## Implemented components

- `src/substrate/referentOrigin.ts`: explicit authored/runtime construction, closed nested family
  validation, and one shared-allocator consumption per runtime entity creation. No counter,
  registry, resolver callback, extra identity record, or occurrence-identity rule is added.
- SEM binding/resolution serialization and catalog state paths now preserve complete nested IDs.
  Recursive SEM and Campaign-2 encoding/decoding rejects malformed origin families. Existing SEM
  in-memory string maps use a lossless lowercase cenc/1 byte key of the entire typed identity;
  this key is a representation, not a local content name or second identity. Key decoding performs
  no origin inference. Schema-bearing StableIds require the owning decoder's admitted schema registry;
  the key decoder accepts that registry explicitly. The current migrated oracle corpus uses primitive
  typed content StableIds. Factory integration must supply the complete committed decoding context
  if a model admits schema-bearing StableIds; it must not infer or allocate a replacement identity.
- The compiled VAL content handle qualifies CharacterId by authored origin, exact complete typed
  StableId lookup, and exact character kind. Structural origin errors precede qualification;
  well-formed runtime or missing authored referents fail `StateContractError` with
  `CANONICAL_ROLE_VIOLATION`. Public data-only factory activation is not implemented by this handle.
- FCT-3 begins with declaration-position uniqueness/existence and recursive record-field role
  validation. RequiredNamespace checks belong to the role interpreter; structural codecs check
  the physical atom and its actual family payload. VAL declaration operands remain owned by VAL
  construction and retain `INVALID_CONFIGURATION`. The two accepted PRJ failure codes extend
  StateFailureCode. StateMapKey roles are retained for later enforcement after key-grammar validation.

FCT-3 continued into `src/campaign2/stateModel.ts`: total keyed-family grammar coverage, exact
pattern uniqueness, read-only/writable disjointness, key-shape-before-role validation, initial and
restored state validation, validated path restoration/reads, and patch validation through the
existing WRT permission order. IDN's declared binding family must have its exact immutable shape
and both mandatory role declarations; namespace-only CharacterId declarations cannot substitute.
The legacy state validator remains unchanged for non-admitting models. Dynamic subject projection
has not yet been connected: its shared admitted-input capability must precede selector extraction.

The byte intake now verifies the intrinsic Uint8Array brand and copies natively. Object and proxy
impostors reject without executing slice/iterator/species/getter hooks; tests cover those paths.

## Corpus migration and preservation

`src/test/fixtures/referentOrigin.ts` explicitly assigns authored origins to migrated SEM fixture
identities. Namespace 20 there is a local content StableId control, never an origin namespace.
Truth and observer-owned candidate producers choose their identities independently. Correct,
incorrect, ambiguous and withdrawn recognition still run through the existing regression corpus.
Canonical catalog ordering and renderer expectations now use complete identity bytes instead of
local-name ordering or a `person.` prefix. No truth lookup or candidate truth-correction was added.

The previous PHEN-SEM acceptance documents and recorded verdict are unchanged. They remain evidence
for the corpus actually executed then. The current suite is separate corrected-origin regression
evidence; old text identity bytes and migrated nested bytes, including affected model/run identity
commitments, are not asserted equivalent. The reference tree is unchanged.

## Bounded proof map

| Control | Current evidence and limit |
|---|---|
| ORIGIN-A/B | New origin suite proves equal local ordinal separation and complete typed StableId retention; VAL test distinguishes same local name under another namespace |
| ORIGIN-C | The same runtime identity passes the explicitly declared ExposureReferentId role on RegulatoryExposureFact and fails its CharacterId role; full state/projection integration remains pending |
| ORIGIN-D | Authored character positive passes. Wrong-kind content is rejected by current VAL construction; the valid second-kind model branch is conditional under VAL-T and is not fabricated |
| ORIGIN-E | Malformed/text-only/unknown nested origins reject structurally before character qualification |
| ORIGIN-F | Different content records sharing a StableId reject during generic CONTENT compilation; missing resolution fails the character role |
| ORIGIN-G | Exact canonical save/load snapshot and subsequent allocator continuation pass using the accepted scheduler/persistence substrate |
| ORIGIN-G2 | Interleaved occurrence/entity IDs stay unique; save/load continuation matches; shifted entity/binding ordinals preserve permitted role evidence |
| ORIGIN-H | Text-only binding/resolution construction and Campaign-2 codec intake reject. Final restricted-factory bypass coverage remains pending |
| ORIGIN-I | Machine audit rejects 20/21 as permanent homes; codec negatives reject them as inner origin namespaces. Final profile activation audit remains pending |

These are component observations, not an assertion that every origin/factory vector is globally
passed. Initial source checkpoint was 325 tests. Validation on 2026-09-06:

- Full source suite: 42 files / 338 tests PASS after PRJ state-model and byte-intake work.
- The additional IDN model-declaration control then passed with the complete five-test state-model
  suite. Current source inventory is 339 tests. No prior global phenotype verdict is rewritten.
- TypeScript --noEmit PASS; production TypeScript/Vite build PASS; reference boundary PASS.
- Frozen Campaign-2 audit 60 checks PASS, VAL audit 40 checks PASS, origin audit 43 checks PASS.
- Diff whitespace check PASS. No reference source or historical verdict document was modified.

No release qualification is inferred from a passing build.

## Remaining construction work

Continue FCT-3: admission-before-subject projection, exact role compatibility, required source
handling and accessor opacity, full initial/static REG/ADAPT validation and model compilation.
Schema-bearing content StableId decoding context must remain explicit in any adapter using SEM byte
keys. No current model inventory is silently widened to another content kind.

Then FCT-4 adapters, the first concrete model's RulesVersion/bundle/profile binding before FCT-5,
restricted create/restore facade, FCT-6 and integrated VAL/persistence/phenomenon qualification.
No belief, memory, value, habit, relationship, person-model or identity-learning mutation is added
by the origin work. The accepted EVID zero-state-write and observer-safe boundaries remain intact.
