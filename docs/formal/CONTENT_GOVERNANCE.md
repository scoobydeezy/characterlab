# Authored Content Governance

**Status:** accepted Campaign 0 contract, version identifier `content/0.2-candidate` (accepted 2026-09-01)

The immutable candidate-era identifier is retained on acceptance because renaming an identity-bearing contract would itself change manifests and `ModelIdentity` without changing semantics.

Authored content includes semantic world facts, action and communication definitions, skills, norms, goals, commitments, scenario fixtures, concept registries, and mappings from content concepts into formal seam inputs. Content supplies facts and affordances; it may not secretly perform psychological interpretation.

## Model-identity obligation

Every authoritative run names:

```text
ContentIdentity  = (ContentSchemaVersion, ContentManifestDigest)
RegistryIdentity = (RegistrySchemaVersion, RegistryManifestDigest)
```

The schema versions define how canonical bytes are interpreted. The SHA-256 digests commit to the exact manifests encoded by `cenc/1` in the deterministic-substrate contract. Friendly release names may exist but are non-authoritative. A content or registry change that can affect execution changes its manifest digest automatically; a schema-semantics change also changes its schema version.

## Required content record properties

Every authoritative definition must state:

- stable typed ID and schema version;
- semantic kind;
- declared inputs, outputs, preconditions, and world effects;
- units, domains, and bounds for authored quantities;
- epistemic visibility and observation affordances;
- lifecycle/applicability rules;
- referenced registry IDs;
- validation invariants;
- source/provenance and change history.

## Forbidden authoring shortcuts

Content may not directly author:

- a character's interpretation, appraisal, affect, belief, memory, identity, or trait conclusion;
- a per-character semantic salience score;
- private target state into an observer's evidence;
- a roll modifier without a typed causal signal and Reason-Nucleus path;
- outcome success when the content defines only intent or attempt;
- an LLM-produced authoritative classification;
- a scenario-specific exception to formal ordering, quantization, randomness, or mutation rules.

Content may author semantic argument structure—such as actor, target, companion, instrument, affected entity, or commitment referent—when that structure is a fact about the action or world event. Each event-role occurrence has its own binding identity; referent identity is not the binding key. A formal perception seam determines which bindings a character can discriminate, and a later recognition/interpretation seam determines which truth-side identities the character may hypothesize. Visibility alone never authorizes copying a truth referent into character evidence.

World semantic classification uses governed typed facet definitions, not unrestricted tags. Each facet definition fixes a stable ID, exact value type/domain, applicability, version, and receiving-seam permissions. Content may describe objective or operational semantics such as kind, material, form, measurable physical properties, or registered affordances. It may not disguise appraisal as ontology by authoring universal `Scary`, `Likeable`, `Relaxing`, `Bad`, or psychologically `Valuable` facts. A facet may make an action or inference applicable; it cannot directly author psychological pressure.

`SEM-001` may register a finite facet vocabulary needed to prove perceptual classification without truth leakage. `ONT-001` owns later inheritance, facet implication, affordance closure, and non-cognitive world consumers. Neither decision authorizes copying truth-side facets into character evidence without observation.

## Validation and status

Before content can enter an authoritative corpus fixture or executable model, a deterministic validator must reject unknown IDs, duplicate IDs, invalid references, noncanonical ordering, out-of-domain values, illegal cycles, missing lifecycle data, and fields forbidden by the receiving seam contract.

**Resolved decision `CONTENT-001`:** type 170 supplies the initial governed content schema; types 171–173 commit semantic registry entries and the canonical record-schema registry; type 174 commits the ordered phenomenon corpus independently of source-table order. Exact content, registry, and corpus manifest bytes and SHA-256 digests, every-authoritative-field sensitivity, presentation-only insensitivity, deterministic semantic-kind domain validation, unknown/duplicate reference rejection, cycle rejection, and malformed-registry controls pass in `src/test/contentGovernance.test.ts`. New content kinds still require their own registered deterministic validator and receiving seam contract; this acceptance does not authorize authored psychological interpretations.


## Campaign 2 SemanticKind allocation clarification (2026-09-06)

The accepted SemanticKind position has TypedIdentifierValue representation but lacked a permanent
family. The Campaign 2 allocation review assigns shared CONTENT-owned SemanticKindId/1004 and
exact nonempty UTF-8 NFC member semantic-kind/character, canonical byte equality without aliases
or case folding. The required non-test member audit found no other accepted permanent kind value
for this admitting model. Fixture 23001 and fixture-only kinds are not authority. This completes
the existing symbolic position without altering IDN qualification or content/0.2-candidate.
C2-F-ID-1 is frozen NOT PASSED. Numeric allocation acceptance remains pending; this clarification
does not resolve VAL-001 or authorize relying on the uncommitted CONTENT validator closure.


## Campaign 2 permanent allocation accepted and frozen — 2026-09-06

The revision-2 review's final mechanical conditions A/B passed: exact complete Markdown/JSON
parity and the explicit observation/0.1-candidate SeamId declaration at
OBSERVATION_AND_EVIDENCE.md:5 (accepted status at line 3).
The [permanent registry addendum](CAMPAIGN2_PERMANENT_ALLOCATION.md) is now
**campaign2-allocation/0.2-candidate, ACCEPTED AND FROZEN**. This disposition supersedes earlier
allocation-pending statements; it does not revise accepted seam semantics. Records 260..328,
namespaces 1004, 1026..1036 and 1116..1121 as listed, all 58 member payloads, 32 union variants
and 10 finite field values are permanent. No renumbering, reuse or insertion by shifting; future
additions append. All earlier proposed assignments are preserved. Namespace 1004's prior
availability is historical; it is now assigned to CONTENT/shared SemanticKindId. SeamId/1036
is shared, with contextual Campaign-2 enforcement and no global legacy trace migration.

Allocation acceptance permits canonical construction of already shape-accepted surfaces subject
to their remaining implementation gates. No construction was performed by this disposition.
VAL-001 remains independent and must close before canonical reliance on affected governed
executable closures, including the CONTENT character-kind validator. ADAPT-001 remains formally
OPEN; PHEN-ADAPT-001, C2-F-ID-1/2 and all other unexecuted frozen gates remain NOT PASSED.
Allocation is not implementation proof for EVID, REG, IDN or PRJ; previous WRT proof is preserved.


## VAL-001 shape acceptance and additive allocation proposal — 2026-09-06

[VAL revision 2](../planning/VAL_001_DRAFT_RESOLUTION.md) is SHAPE ACCEPTED at governed-execution/0.1-candidate,
content-kind/0.1-candidate and governed-domain-validator/0.1-candidate. The required §3 correction
limits committed operands to model-semantic choices within an admitted contract. Build support
may reject activation without changing the already-defined model or entering ModelIdentity.
The separate content-kind and domain-validator definitions, exact supported-kind/reference
closure, construction order and model-admission/build-release split are frozen.

VAL is now an implementation-activation gate, not an architecture blocker. VAL-A..W remain
frozen NOT PASSED; VAL-T's future second-kind positive case remains conditional. Formal VAL-001
stays P1 OPEN until implementation qualification. Canonical activation is NOT YET AUTHORIZED.
Before the first real fixture activates, audit its additional authored type-170 kinds; any such
kind requires an accepted specialization. No IDN/PRJ/EVID/REG/ADAPT semantic change is authorized.

The authorized [additive numeric proposal](VAL_PERMANENT_ALLOCATION.md) assigns proposed record schemas
329/1 and 330/1 and two text members in existing RegistryKindId/1023. Its machine companion
and mechanical audit agree. The numeric proposal awaits acceptance; no new namespace, runtime
implementation or permanent reassignment occurs. Campaign-2 allocation/0.2-candidate is unchanged.
After numeric acceptance: authoritative factory design → implementation → VAL/inherited
conformance and mutants → build/release qualification → formal VAL closure.


## VAL permanent allocation frozen — 2026-09-06

The allocation review's conditional machine gate passed: [val-allocation/0.1-candidate](VAL_PERMANENT_ALLOCATION.md)
is PERMANENT AND FROZEN. Records 329/1 and 330/1 and the two RegistryKindId/1023 members are
permanent. No new namespace, renumbering or reuse; future additions append. The Campaign-2
allocation table's complete bytes and the reused StableId assignments are unchanged.

RequiredSemanticKind qualification belongs solely to VAL construction; no additive PRJ
CanonicalRoleConstraint is introduced for that definition field. Malformed declarations use
INVALID_CONFIGURATION; runtime CharacterId qualification retains CANONICAL_ROLE_VIOLATION.
ContentSchema requires no new identity role. VAL-A..W remain NOT PASSED; formal VAL-001 remains
P1 OPEN and canonical activation remains gated. Next substantive work is authoritative
Campaign-2 factory design, implementation and build/release qualification. No runtime code
or phenomenon proof is supplied by this allocation acceptance.
