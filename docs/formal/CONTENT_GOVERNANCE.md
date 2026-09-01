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

Content may author semantic argument structure—such as actor, target, instrument, affected entity, or commitment referent—when that structure is a fact about the action or world event. A formal perception/interpretation seam determines what a particular character can observe and infer from it.

## Validation and status

Before content can enter an authoritative corpus fixture or executable model, a deterministic validator must reject unknown IDs, duplicate IDs, invalid references, noncanonical ordering, out-of-domain values, illegal cycles, missing lifecycle data, and fields forbidden by the receiving seam contract.

**Resolved decision `CONTENT-001`:** type 170 supplies the initial governed content schema; types 171–173 commit semantic registry entries and the canonical record-schema registry; type 174 commits the ordered phenomenon corpus independently of source-table order. Exact content, registry, and corpus manifest bytes and SHA-256 digests, every-authoritative-field sensitivity, presentation-only insensitivity, deterministic semantic-kind domain validation, unknown/duplicate reference rejection, cycle rejection, and malformed-registry controls pass in `src/test/contentGovernance.test.ts`. New content kinds still require their own registered deterministic validator and receiving seam contract; this acceptance does not authorize authored psychological interpretations.
