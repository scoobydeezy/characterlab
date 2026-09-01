# Authored Content Governance

**Status:** deferred contract scaffold, version `content/0.1-draft`

Authored content includes semantic world facts, action and communication definitions, skills, norms, goals, commitments, scenario fixtures, concept registries, and mappings from content concepts into formal seam inputs. Content supplies facts and affordances; it may not secretly perform psychological interpretation.

## Model-identity obligation

Every authoritative run names `ContentVersion` and `RegistryVersion`. `ContentVersion` commits to a canonical manifest of content records and their schema versions. `RegistryVersion` commits to typed identifier namespaces, canonical ordering, and any fixed semantic vocabularies used by formal contracts. A content change that can affect execution requires a new content version or manifest digest.

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

**Open decision `CONTENT-001`:** define the canonical manifest encoding, digest algorithm, schema-evolution rules, and initial registries. Until accepted, authored-content implementation beyond isolated fixtures is blocked.
