# C2-MODEL-PACK-001 — first-model registry composition

**Status: SHAPE ACCEPTED WITH CROSS-SLOT CLARIFICATIONS.** 2026-09-06. No allocation, semantic redesign or activation.

## Inspection finding

The accepted factory design requires complete committed declarations and an exact first
RulesVersion / semantic bundle / persistence-profile binding before FCT-5. Current components
do not yet realize that combined input boundary:

| Actual substrate | Existing representation / limitation |
|---|---|
| contentManifest.ts compileRegistryManifest | Canonical set of type-172 schema descriptors and type-171 semantic entries; duplicate schema/StableId checks. |
| valDeclarations.ts compileContent | Consumes that set, skipping 172 and indexing 171. Cannot take bare ownership/phase/role collections as entries. |
| stateModel.ts | Separately consumes type-155 ownership, set of type-262 read-only definitions and set of type-261 key grammars. |
| valDeclarations.ts | Separately consumes declaration bytes including type-265 role constraints. |
| scheduler.ts | Type-134 phase registry and type-133 OrderingParameters already exist. Internal runtime still accepts a separately supplied work limit. |
| Campaign-2 runtime tests | Supply separate compiler fragments and test identities, including empty model commitments. These are component controls, not the authoritative first model. |
| PRJ accepted collections | Read-only/key-grammar/role definitions are canonical sets with explicit uniqueness rules. No new declaration order is allowed. |

Repository searches found no accepted first-profile RegistryManifest composition or existing
registry kind/member binding for these standalone ownership/phase/PRJ collections. The accepted
formal records are expressible. The unresolved issue is their exact receiving model commitment.
This does not reopen any of their semantics or accepted allocations.

## Accepted resolution

For the first bounded Campaign-2 profile, propose RegistrySchemaVersion
`campaign2-registry/0.1-candidate` interpreting exactly this six-element cenc/1 list:

| Zero-based position | Exact value | Owner and admission |
|---|---|---|
| 0 | Existing canonical set of type-172 descriptors and type-171 entries | Existing CONTENT registry format and complete closed-entry admission. |
| 1 | OrderingPhaseRegistry/134 | Exact ordering-phases/2-candidate registry, including non-schedulable 150. |
| 2 | StateOwnershipRegistry/155 | Existing mutation-authority/0.1-candidate#TRC-001-002-addendum; sole ownership source. |
| 3 | Set of ReadOnlyStateFamilyDefinition/262 | PRJ uniqueness and overlap/grammar checks. |
| 4 | Set of StateKeyGrammarDefinition/261 | Participates in cross-slot keyed-family coverage with positions 2 and 3; PRJ precedence. |
| 5 | Set of CanonicalRoleConstraint/265 | Exact Position uniqueness and role validity; participates in whole-model VAL reference closure. |

These positions are a proposed versioned manifest layout, not allocated record fields or new IDs.
No wrapper record, registry kind, registry-definition member or allocation is introduced. The
existing CONTENT registry set stays intact in position 0; its compiler is not globally widened.
The complete six-element value supplies the existing RegistryManifestDigest. Position-0 commitment
may be an internal intermediate, but cannot substitute for the complete model commitment.

Model preparation decodes/copies the complete manifest once, validates all six positions, then
passes detached components from that same snapshot to the existing compilers. Callers cannot
supply a second ownership/role/phase set, a derived override or an independent registry digest.
Changing any authoritative collection changes RegistryIdentity and consequently ModelIdentity.
Empty sets occupy their slots explicitly. Missing/extra slots, wrong record types, duplicate
definition keys, unsupported entries and conflicting declarations reject before activation.

Event-dependent projected-field requirements retain their accepted transition-owned context;
this layout creates no global projection map or accessor registry. The proposed first bounded
model has no general RequiredDynamic subject projection: EVID remains zero-read; ADAPT owns its
two exact scoped accessors. Future additional transition declarations need their own accepted
admitting shape; an extra manifest slot is not silently inferred.

ParameterSchemaVersion `campaign2-parameters/0.1-candidate` is proposed to mean exactly
list([OrderingParameters/133]), with one positive unsigned work limit at 133/1. This preserves the
existing parameter identity home. Missing/extra parameters reject for this profile. The limit is
read from these committed bytes; the future factory has no work-limit argument. REG parameters
and anchors remain in their existing registry definitions, never copied into this parameter set.

ContentSchemaVersion stays `content/0.2-candidate`, with the accepted character-kind specialization
and permanent GovernedContentDefinitionId/1038 restriction. No content record is replaced.

## Concrete first-model direction for the subsequent manifest freeze

Proposed RulesVersion: `rules/campaign2-bounded-bridge/0.1-candidate`. This is a review name,
not an accepted alias for current test strings. Bind it to the registry/parameter profiles above,
`campaign2-ordered-input/0.1-candidate`, and `campaign2-persistence/0.1-candidate`.
Keep observation/0.1-candidate, authored-fact-observation/0.1-candidate,
semantic-binding/0.1-candidate#SEM-001H, character-learning-evidence/0.5-candidate,
transition-admission/0.4-candidate, transition-admission-extension/0.6-candidate,
adaptation-input/0.31-candidate, adaptation-settlement/0.2-candidate,
regulatory-reference/0.5-candidate, identity-binding/0.5-candidate,
projection/0.3-candidate-addendum, state/0.3-candidate-addendum and accepted VAL versions unchanged.
The supported build schema inventory is broader than admitted execution closure.

The subsequent concrete-byte packet must include all of the following, even where execution
does not exercise the declaration:

| Surface | First bounded specimen inventory to materialize |
|---|---|
| CONTENT / VAL | One authored character; exact character kind/329 and character validator/330; exhaustive role/reference closure. |
| Topology / WRT / PRJ | Ten logical families, exactly five materialized ADAPT maps under two owners; eight cognitive families unmaterialized; five key grammars; empty read-only collection; no roster-dependent EVID path. |
| Domains / REG | Five leaf definitions; one load domain; one procedure; one REG variable with complete character coverage and its own exact anchor/parameter definitions. No Unit field. |
| Rules / consumers | Both V06 consumers, exact assigned rules/read domains, settlement singleton and all terminal-output/occurrence definitions. Rule values and specimen magnitudes are model data to enumerate explicitly. |
| Source / bridge | Exact source singleton and required bridge singleton for this specimen; one committed observer/channel/modality/subject; UnitId/1039(unit/fixture-pulse); namespace-only 201/5 role. |
| EVID | Both accepted V04 registrations; 227→269→270; zero reads/writes and mandatory phase-130 ingress. |
| Shared admission | One V04 singleton containing both routes and all four transition assignments; exact occurrence/output closure. |
| Inherited schemas / unions | Explicit complete descriptors and admitted union entries from frozen C0/OBS/SEM/C2/VAL authorities, with no omitted unexercised declaration or caller schema override. |
| Ordering / parameters | Exact 134 and one committed 133; specimen work limit explicitly chosen in the byte packet. |

The model may admit only authored InputOnly source events at 110; execution closure contains
110, 120..124, 130 and 140. No random consumer, continuing coupling, run-owned analytical anchor,
current-lane recognition pipeline or arbitrary handler enters that closure. Therefore the accepted
persistence profile can derive list([]) independently for 132/8, /9 and /10, subject to actual
closure checks. Original complete ordered inputs remain required separately on restore.

## Review boundary and frozen controls

The immediate decision is the exact receiving registry/parameter layout above. It is needed
before materializing authoritative combined manifest bytes. This proposal is not the final
first-model numeric-value inventory or its byte freeze; those remain required before FCT-5.
No current test fragment is promoted to that model by this document.

MODEL-PACK-A..F, FROZEN PROPOSED CONTROLS, NOT PASSED:

1. Mutate each of the six registry components separately: recomputed model identity changes;
   each compiler sees the matching changed declaration or rejects it.
2. Wrong arity/type, duplicate keys and unknown or unused semantic entries reject construction.
3. Separate conflicting copies/digest-only substitutes cannot enter the future factory.
4. Changing the committed work limit changes ParameterIdentity and actual settlement bounds;
   no host work-limit override is admitted.
5. Fixed RulesVersion cannot bind a foreign registry/parameter/input/persistence profile.
6. Admitting a draw, run anchor or continuing coupling fails this bounded profile's closure;
   empty persistence metadata is not inferred merely from an empty initial state.

SUB-003 identity, SUB-008 atomic persistence and SUB-011 forward correction are preserved.
No reference mechanism is replaced. FCT-4 completion, FCT-5/6, VAL and PHEN-ADAPT remain pending.


## Acceptance and implementation continuation — 2026-09-06

C2-MODEL-PACK-001 is accepted with the six-slot registry and one-slot parameter layouts above.
RulesVersion bundle shape is accepted; actual version fields and declarations remain independent
ModelIdentity operands, never synthesized from RulesVersion. Ordered-input and persistence profile
selection is fixed by its compatibility bundle, with no caller selector/default/latest.

Keyed-family closure is one cross-slot equation: patterns(position4) equals WritableKeyedPatterns
(position2) union ReadOnlyKeyedPatterns(position3), exactly once per pattern. Missing writable or
read-only coverage, orphan grammars and writable/read-only overlap reject.

VAL collects DomainValidatorId through CanonicalRoleConstraint.Role, admitted
EventDependentProjectedFieldRequirement.OutputRole and OccurrenceIdentityRule.IdentityRole across
the complete committed model, including nested position-0 declarations. Referenced validators
equal declared validators. Position 5 alone does not prove that closure. Trusted permanent schemas
decode every slot; type-172 descriptors must agree and cannot supply interpretation.

MODEL-PACK-G (cross-slot grammar closure) and MODEL-PACK-H (whole-model role/validator closure)
are frozen alongside A–F. Concrete first-model bytes are the remaining review gate before FCT-5.
See CAMPAIGN2_FIRST_MODEL_BYTE_REVIEW.md for materialization and scoped implementation evidence.
Earlier proposed/pending layout wording is historical; no accepted seam or allocation is reopened.


2026-09-06 first-model byte freeze: the review accepted all specimen values and the RulesVersion
bundle and authorized conditional freeze once numeric/random authority was anchored.
numeric/exact-1 now has the accepted bounded formal definition in BOUNDED_NUMERIC_PROFILE.md.
The exact RNG spelling was already fixed by accepted DETERMINISTIC_SUBSTRATE.md:173.
RegulatoryReferenceParameterId/1030 prose corrected without changing bytes. MODEL-BYTE-A PASS:
15 generated artifacts actually removed and recreated from source in a fresh process. All seven
previous artifact hashes remain unchanged. Concrete bytes ACCEPTED AND FROZEN; FCT-5 UNBLOCKED
TO BEGIN. Full runtime/restore, VAL, FCT-4/6 and PHEN-ADAPT qualification remain pending.
