# Canonical State Model

**Status:** registry scaffold, version `state/0.1-draft`

## State classes

| Class | Examples | Authority rule |
|---|---|---|
| Constitutional | body parameters, developmental constraints | Persistent and versioned; never inferred from display values |
| Developmental | age-linked stage, maturational state | Advanced only by its named transition authority |
| Dynamic embodied | physiology, regulatory state | Current authoritative values with explicit time anchoring |
| Learned persistent | beliefs, expectations, skills, habits, relationships, identity evidence | Mutated only from typed learning/consolidation evidence |
| Character-relative epistemic | encoded experience, recollection, recognition, person models | Contains only information available through permitted observation |
| Active cognitive | workspace, candidate options, reasons, appraisals, intent, pre-attempt snapshot | Event-scoped unless a seam explicitly persists it |
| World truth | actual events, attempts, outcomes | Not character state; readable by the character only through observation seams |
| Trace | authoritative execution/provenance record | Not character knowledge and never a hidden cognitive input |

## Mutation authority

Every persistent field has exactly one registered mutation authority. Other seams emit typed evidence or requests; they do not write the field directly.

| State family | Proposed sole authority | Status |
|---|---|---|
| immediate belief/expectation evidence | Learning Evidence application | unresolved specification |
| episodic/imprint memory | Memory encoding/consolidation | unresolved specification |
| associations | Consolidation | unresolved specification |
| skills and habits | Consolidation | unresolved specification |
| person models and relationships | Social learning/consolidation | unresolved specification |
| self/identity/disposition | Identity/dispositional consolidation | unresolved specification |

“Proposed” is not permission to implement. The seam ledger must replace each unresolved row with a versioned contract before code writes that state.

## Snapshot rule

Outcome evaluation reads a frozen pre-attempt snapshot containing the chosen intent, relevant expectations/beliefs, prospection, decision expression, and declared state projections. It must not reconstruct “what the character expected” from state already changed by the outcome.

## Identity and copying

State identity uses stable typed IDs and canonical registries. Copies used for counterfactuals are deep authoritative snapshots. Shared mutable aliases between variants are forbidden. Derived caches must either be absent from equality or be reproducible and validated from authoritative state.
