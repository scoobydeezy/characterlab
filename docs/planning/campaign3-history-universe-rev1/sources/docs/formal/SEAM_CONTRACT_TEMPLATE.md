# Versioned Seam Contract Template

Copy this template for every authoritative edge or tightly coupled transition family in the Architecture Map. Delete no heading; write `not applicable` with a reason when a field truly does not apply.

```text
# <Seam name>

Status: DRAFT | CANDIDATE | ACCEPTED | SUPERSEDED
SeamId:
Version:
Architecture edges:
Owner:
Depends on:
Supersedes:

## Semantic purpose
## Required phenomena
## Domain and codomain
## Units, ranges, and applicability
## Registered ReadDomain and capability-limited projection
## Actual-read recording and derived-input provenance
## Authoritative StatePatch writes and sole MutationAuthorityId
## Epistemic permissions and forbidden knowledge
## Preconditions
## Totality, typed failures, instant rollback, and failed-run behavior
## Exact transformation
## Random addresses and distribution mapping
## Quantization and rounding points
## Canonical collection ordering and tie rules
## Event phase and timing semantics
## Postconditions
## Invariants
## Trace records and provenance
## Candidate mechanisms and control implementations
## Competing models / ablations
## Equivalence relation and tolerances
## Proof obligations and executable tests
## Applicable Campaign 0 conformance vectors
## Known domain exclusions
## Unresolved decisions
## Reopen conditions
## Change history
```

## Readiness rule

`ACCEPTED` requires zero unresolved decision capable of affecting an authoritative output, mutation, ordering, random result, epistemic boundary, invariant, or research verdict. Tests prove conformance to a contract; they do not create missing semantics.
