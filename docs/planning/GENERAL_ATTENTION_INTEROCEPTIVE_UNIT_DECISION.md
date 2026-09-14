# What consumes one interoceptive acquisition slot?

2026-09-12. **OPEN architectural decision.** Separate bounded body acquisition is
accepted and unchanged. This fixes the unit inside that gate, not visual/body competition.

## Concrete distinction

One bodily reserve is observed through three channels. They may differ in resolution
or may be identical readouts with different observation/channel identities. At body
capacity2, do they consume three competing acquisition slots, or one signal-level slot
with multiple supporting observations?

The actual [component counterexamples](INTEROCEPTIVE_ACQUISITION_COMPONENT_CHECKPOINT.md)
now execute both resolutions and identical readouts through accepted EMB arithmetic,
codecs and the sample-selection control. The control counts three. The existing
public EMB profile supplies only one channel and does not settle this generalized case.

## Recommendation: one bodily signal per acquisition opportunity

Count an explicitly identified observer-side bodily signal as one acquisition unit
per bounded opportunity. Multiple channels/readings of that signal are its bounded
evidence basis, not additional competing units. Signal identity/grouping must be
declared by the admitted observation model and available in its safe projection;
never infer it from hidden body paths, equal numerical values or channel-name parsing.

This prevents duplicate sensor descriptions from consuming additional retention slots
merely because they acquired different IDs. It does not mean observations are free:
source work, number of views per signal and retained byte volume must all have separate
finite bounds. Nor does grouping grant a more precise value: contradictory or differently
resolved samples keep their evidence semantics; no automatic intersection or averaging
is accepted here. Evidence from different instants is not merged merely by signal ID.

Genuine capacity+1 contention must then be witnessed by at least three admitted
signal units at capacity2. That requires a bounded multi-signal source beyond the
one-reserve EMB profile. It must define physical/sensory meanings without inventing
new Need meters or psychological priorities solely to fill the pool. The sample-level
component remains an explicit control rather than being changed or relabeled in place.

## Alternative: each admitted channel sample is one unit

Retain the current equal-priority control's sample granularity in the first public
model. Distinct admitted channels at one instant can compete even when they report
the same underlying signal. Source membership and sampling frequency become part
of the cognitive resource model. Duplicate-channel and duplicate-occurrence rejection
still apply, but two separate channels of the same quantity may consume two slots.

Under this alternative, redundant descriptions can crowd out another readout. That
footprint dependence must remain a measured prediction, not be hidden or called
signal diversity. Public source admission still cannot invent extra arbitrary aliases
at runtime. The finite channel set, physics and sampling schedule must be committed.
Grouping by signal remains a named comparator; neither model is universally true by
construction.

## Why this requires an architectural ruling

The accepted separate-gate review requires genuine within-modality contention but does
not define whether the unit is a sample or a bodily signal. Its explicit caution about
whether persistent sensation counts as one candidate or many is relevant here. These
choices predict different remembered evidence under sensor duplication, change the
candidate key and source domain, and determine the required positive experiment.
Choosing three aliases just to pass the bound would decide the resource ontology
through fixture convenience. The North Star does not supply that unit definition.

## Frozen discriminating obligations

Hold body state, time, visual state and available signal meanings fixed; duplicate
an admitted readout through another channel. Record candidate count, displaced units,
retained evidence and later attribution availability. Separately add a genuinely
different signal while keeping the first signal's evidence fixed; prove the configured
bound can exclude a unit. Preserve unavailable/zero distinctions and never recover
excluded sample bytes through trace or a hidden store.

Different readings of one opportunity cannot fabricate independent trial repetitions
for contrastive attribution under either model. Source permission and actual provenance
must bind the distinction; ordinal differences alone do not prove repeated experience.

**Requested ruling:** signal-per-opportunity acquisition units (recommended), or
channel-sample acquisition units for the first public body gate. No public allocation
or persistent carrier is proposed before this semantic choice is recorded.
