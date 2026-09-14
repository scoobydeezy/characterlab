# Local reserve replenishment production

`local-reserve-replenishment-production/0.1-candidate`, 2026-09-13.
LOCAL DISPOSITION — no owner ruling required. Trusted physical-source component.

For an admitted local-reserve target, materialize its prior anchor at the supplied
instant using the existing reserve law, then execute the existing replenishReserve
operator. Return the actual prior anchor, newly anchored result and exact numeric
Before/PotentialEffect/Applied/Overflow/After values. Zero delivery still reanchors.
Unknown targets, invalid instants or invalid delivery reject without changing source.

The old source capability remains immutable. Result inspection is detached from the
new source and cannot alter it. No runtime identity is allocated. Existing observation
methods still return only their safe signal result; they do not return this record.
The canonical adapter reuses ReserveAnchor/454 and ReserveReplenishmentResult/479
inside the proposed LocalReserveReplenishmentResult carrier.

The public stage is a world-side original at phase110 with exact LocalReserveKey
admission and physical mutation authority. It is not a character-learning transition
and performs no PRJ/IDN cognitive subject inference. Actual canonical state ownership,
registration, rollback and source-output exclusion still require public qualification.
