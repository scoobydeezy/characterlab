# Three-local-reserve source component

2026-09-12. `local-reserve-source-component/0.1-candidate`.
**Component shape accepted by primary-agent review under autonomous authorization.**
This implements a synthetic source fixture, not a public physiology profile.

Exactly three independently keyed physical reserve definitions provide capacity,
rate, anchor instant and amount. Physical symbols use local-reserve/ and safe signal
symbols interoceptive-signal/ as separate component domains; these are not permanent
identifier encodings. Public distinct namespaces remain an allocation obligation.
Symbols are nonempty NFC strings with at most96 UTF-8 bytes. No array index is identity.

Each source configuration declares1..9 channels, at most three per safe signal,
with positive bin width, exact Boolean permission/availability, a physical key and
safe signal key. The first fixture requires exactly three distinct signals and a
bijection with the three physical reserves. Multiple channels may view one mapping;
unknown keys, alias signals for one reserve, merged reserves and duplicate channels
reject in this deliberately one-to-one fixture. This is not a universal grouping law.

Definitions and state are detached behind opaque handles. Querying materializes
each selected physical source through the actual accepted materializeReserve and
reserveBin operators. A permitted available channel returns only safe signal, channel
and exact interval. Every other channel returns the same unavailable shape without
level or the reason for absence. No physical key, anchor, rate, Applied, Potential,
Overflow or trace ancestry enters a safe output. Queries never reanchor state.

Replenishment materializes only its named reserve, uses the actual replenishReserve
operator and returns a new source handle with only that anchor updated at the target
instant. Even zero delivery follows the accepted reanchor law. The prior handle is
unchanged. The inspection function returns detached truth-side definition/anchor
projections solely for component proof; it is not an admitted cognitive accessor.

All rational values returned or retained are detached and frozen, including zero,
so caller mutation cannot alter imported exact-math constants or future source results.
No new pressure function, Need, motive, ranking, clock discretization or numerical
approximation is added. Kinetics interventions are different constructed models,
not mutation of committed model parameters within a run.

Public state roots, physical/signal IDs, channel registry, live source admission,
SEM grouping, trace, rollback and persistence remain NOT PASSED. Component source
outputs are arithmetic projections, not forged EMB sample occurrences. The public
successor must name its own source version rather than use the old singleton profile.
