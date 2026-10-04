# Selected descriptions and receiver inventory — 2026-09-20

**Disposition:** LOCAL DISPOSITION. Component source implemented; public shape proposed.
**Stage:** A/B source production and C aggregate/pairwise comparison. Public D/E open.
**Counters:** highest allocated706; since last verdict/member0. **Owner ruling:** none.

## What changed

Implemented `multisource-selected-descriptions/0.1-candidate` under its accepted
component contract. Actual selected same-signal observations now supply singleton,
duplicate and two-view aggregate descriptions with complete evidence ancestry.
The aggregate is a conservative interval hull, not a sum of different reserves or
a claim of optimal sensor fusion. Unavailable support makes the whole description
unavailable; it cannot silently become a singleton. Known zero retains its basis.

`MULTISOURCE_PUBLIC_SHAPE_REV1.json` proposes fourteen field-defined source/receiver
record shapes, variants, cardinalities and stage ownership. Internal reference checks
resolve all inherited/symbolic record references. It allocates no IDs and explicitly
lists the remaining model/profile, registration, integration and downstream gates.
It is not an allocation-ready whole-model inventory.

The new raw key separates description identity from ground identity. Existing495
has no description identity for task sources; using extra task keys to work around
that would change semantic motive ownership. A successor key/envelope is required.
Old499's ancestors and old source contracts remain unchanged.

## Evidence

`MULTISOURCE_DESCRIPTION_TESTS_REV1.json`: **57 tests/six files PASS**, including eight
new description tests and all preceding multisource/body/receiving component controls.
Build and reference boundary PASS. Full source/reference suites were not rerun.

For actual level20, widths10/20 and threshold60, singleton a/b and hull(a,b) produce
strengths1/2,1/3,1/3 and bases{a},{b},{a,b}. Aggregate coverage yields third0 and bounded
total5/11. Pairwise-max leaves third1/6 and total1/2. The equal-magnitude tie is explicitly
declared with b before the hull; arbitrary source renaming is not qualified. Duplicating
one description preserves baseline1/3 versus uncovered1/2. Original samples, exact
intervals, negative polarity, missing support, capacity and known-zero cases are tested.

These same-signal views are not claimed statistically independent. Independently
intervened A/B reserve controls from the prior source work remain separate. The new
tests also preserve hidden-within-bin equality, declaration/channel order invariance,
observer/signal isolation and counterfeit/reused-capability rejection.

## Stage C competitor and North Star transfer

GroundAggregate versus GroundPairwise/Uncovered now has actual selected-description
operands. FamilyNormalized remains the prior negative candidate; no repaired law is
silently substituted. Separate motives sharing evidence and redundant descriptions
within one motive remain distinct. Preserve MEC-012/013/014/016 and EXP-009/014.
No Need ownership, hidden truth overlap key or cross-domain exchange rate is adopted.

## Next gate

Finish the whole public profile/registration and downstream receiver inventory,
including the separately versioned integration that dispatches both family assessments
from one selection. The current join is single-view; the new description component
is a distinct successor, not a hidden flag widening it. The draft explicitly calls
out its proposed four-description integration versus this component's maximum three.
Resolve that integration, immutable definition/action/source bindings and actual
arbitration/expression ancestry before allocation. Then public model execution,
rollback and replay. **RO-C3-001 stays ACTIVE; PHEN-MULTI stays PARTIAL.**
