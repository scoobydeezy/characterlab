# Three-local-reserve public carrier inventory

2026-09-13. LOCAL representation disposition. Symbolic draft; no allocation.
Consumes the owner-authorized synthetic three-local-reserve source and its component
contract. It is not a claim about human physiology or a new Need model.

## Substrate reuse and identity

The old ReserveState455 is keyed solely by CharacterId and therefore cannot represent
three separately keyed compartments for one character. Keep it and all old models
unchanged. Reuse exact ReserveAnchor454 for each new compartment's amount/anchor time,
and ReserveParameters453 for its immutable unit/capacity/rate definition. Do not create
a parallel anchor, clock, rational, binning or replenishment law.

Name the previously owed physical identity family **LocalReserveId**, distinct from
the already proposed InteroceptiveSignalId. Its payload is nonempty canonical NFC text;
the first model admits exactly local-reserve/A, local-reserve/B and local-reserve/C.
Neither family is an occurrence and neither has a runtime allocator. Namespace and
fixed-member numbers remain unallocated. Component prefix strings are not production
identities or aliases. LocalReserveId is not CharacterId, ChannelId, UnitId or REG's
RegulatoryVariableId. The earlier component contract explicitly leaves the distinct
physical/signal namespaces for this public closure.

LocalReserveKey pairs the actual CharacterId with LocalReserveId. The new physical
root uses that composite record key and exact454 value. Its map admits exactly the
three declared keys for the one-character first model. Each key's Character scalar
requires1002 plus character qualification; its Reserve scalar requires the proposed
physical family and exact compiled membership. There is no scalar StateMapKey role
on the enclosing composite. The key grammar names LocalReserveKey and recurses.

The first parameters retain the existing unit/embodied-fuel-stock identity in1039,
the stock discriminator used by the reused law. Equal unit identity does not permit
transfer, pooling, rate coupling or an OBS↔REG conversion. No new unit or conversion
mechanism is required. Independent capacities/rates and actual amounts still belong
to three separate physical keys.

## Governed source definitions

LocalReserveBodyRegistry binds exactly three LocalReserveKeys to their actual
ReserveParameters453 DefinitionIds. LocalReserveChannel binds a channel/observer to
one physical key and one safe signal, with positive width and exact availability/
permission booleans. The closed compiler proves one-to-one physical/signal coverage,
one to three views per signal, exactly three distinct signals, and each channel's
observer maps through accepted IDN to the key's character. Definition lookup and
physical bindings stay in the trusted source; cognition receives only the existing
safe declaration/sample projections.

Requested channels are an explicit nonempty bounded set on a body sampling request.
Unrequested channels emit no unavailable sample. A zero-capacity selector remains a
separate decision downstream. The general combined-source original must distinguish
an absent body request from a body request whose actual observations are unavailable.

LocalReserveReplenishment names one declared key and nonnegative delivery. It is a
world-side input, not cognitive evidence. The source records the actual prior/next454
anchors and reuses ReserveReplenishmentResult479 for Before, PotentialEffect, Applied,
Overflow and After. There is no parallel numeric result or duplicate Supplied field.
Those trace-side fields cannot enter461 samples, retained views, cue or goal assessment.
Use the existing replenishReserve operator, including its zero-delivery reanchor law.

## Ownership and completeness

LocalReserveState is **PhysicalBody** state, not a character-learning family and not
RuntimeProtocol. Its new exact authority owns only its three declared composite-key
leaves. The old authority/embodied-reserve gains no new root implicitly. Cognitive
direct and recursively derived reads must exclude it; the permitted observation
producer alone receives the exact physical read projection. Source restoration must
validate all three keys/anchors against the committed model and replayed prefix.

This adds the previously missing physical source root to the seven-root cognitive/
perception/protocol inventory. That older inventory's seven-root count never covered
physical local reserve state. No allocation or actual compiler coverage follows from
this draft. Exact world-side input registration, source output identity rules, body/
visual/panel request composition, canonical traces and complete-prefix proof remain open.
