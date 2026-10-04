# Ordinary acquisition: carrier and admission draft

2026-09-12. **PARTIAL SYMBOLIC DRAFT; NOT ALLOCATION INPUT.** Consumes accepted
[identity B](GENERAL_ATTENTION_ACQUISITION_IDENTITY_RESOLUTION.md) and the
[formation protocol](ATTENTION_ACQUISITION_FORMATION_PROTOCOL_REV1.md). Field names
below are symbolic; no field numbers, record IDs or public producers are assigned.

## Common carrier

Propose AcquisitionFormationEvidence with exactly these common semantic fields:

| Field | Meaning / role |
|---|---|
| Acquisition | AcquisitionOccurrenceId; the sole fresh occurrence of this result |
| Observer | Existing ObserverId; source observer, checked before subject projection |
| At | Existing SimInstant; actual acquisition instant, never future outcome time |
| SourceSelection | SelectionOccurrenceId; authenticated selection provenance |
| Content | Closed variant: EventContinuantContent or InteroceptiveContent |
| TransformationVersion | Exact admitted producing seam version |

AcquisitionKind is the Content discriminator, not a second independently disagreeing
tag. No additional EpisodeId, FormationId, signal-group occurrence or duplicate
top-level ExperienceId is introduced. The source selection remains bound to its
actual experience/opportunity through producer admission; an ID alone is not a
resolver. The body selection producer's use of the selection role requires its own
explicit admission and output contract; old visual532/534 are not widened.

Character ownership is attached through required PRJ/IDN after payload admission.
The retained entry is at `(qualified CharacterId, Acquisition)` and preserves the
same initial evidence bytes. This envelope unifies addressing, not evidence content.
Whether canonical storage embeds the envelope or carries an equivalent lossless
typed initial entry must be fixed at whole shape; it cannot allocate another identity.

This refines the earlier propagation plan's conceptual addition to RetainedEncoding:
the acquisition header must occur once in the final envelope, not be duplicated in
both the envelope and an unchanged nested RetainedEncoding. The plan was an affected-
field inventory, not permission to nest redundant headers. Earlier wrapper bytes and
their checks remain historical; a complete successor packet is still required.

## Positive content only

EventContinuantContent carries the existing proposed RetainedEncodingUnit semantics:
the exact positive-strength units, selected binding/claim closure, admitted historical
factors and spatial witness where present. Its calibration remains DefinitionId,
not GovernedContentDefinitionId. The final child layout removes common header fields
already owned by the envelope. No full selected view or evaluation enters storage.

InteroceptiveContent carries nonempty selected signal groups. Each group carries
InteroceptiveSignalId plus the exact bounded present sample basis admitted for that
signal/opportunity. Samples remain separately identifiable observations and keep
their exact intervals; different views are not averaged, intersected or converted
into an exact hidden amount. No visual role, BodyContinuant, event-file or association
node is fabricated. No numerical strength, pressure, Need or appraisal field is
introduced merely to match visual fields.

Finite maxima for groups, views, encoded bytes and retained acquisitions must be
explicit committed profile parameters with finite compiler limits. This draft does
not choose those values. Source/grouping component bounds are not automatically
the public profile bounds. A bound violation rejects; it cannot silently discard
evidence inside a selected group or reinterpret truncation as a sensory absence.

## Admission matrix

| Receiver | Required origin and validation before persistent reads |
|---|---|
| Phase130 evidence producer | Exact completed selected-encoding result and admitted producer; same observer/time; positive content equals the authenticated selected retained subset |
| Phase140 formation | Exact completed AcquisitionFormationEvidence parent output; candidate occurrence belongs to that output; full bytes match; required PRJ/IDN binds owner |
| Auxiliary formation writers | Same admitted evidence and declared batch association, before their own qualified owner reads; no input reconstructed from another provisional write |
| Later recollection/consolidation | Actual qualified retained acquisition or an explicitly declared same-instant positive formation composition; typed ID alone is insufficient |

Both producing and formation transitions participate in route/character-learning.
The producer writes no persistent family. Formation writes only the declared ordinary
memory family; auxiliary state updates have their own exact authorities and read/write
declarations. Current evidence does not become consequence269/270. No automatic
adaptation input is admitted and no CharacterEvidenceRef variant follows by implication.

Producer authentication proves origin, not causal truth. Neither carrier provenance
nor a shared observer/time/acquisition identity supplies attribution. Consequence
sensing has a distinct ExperienceId even at the same instant. A later assessment
must read only admitted retained evidence through the ordinary-memory contract.

## Review findings and remaining dependencies

The proposed header has one occurrence and one source link, with subject ownership
derived rather than duplicated. It has no physical reserve key, truth handle, raw
archive accessor, future factor or causal-credit tag. Empty/zero/unavailable formation
has no positive carrier. Whole-instant failure leaves no committed carrier or entry.

The older visual four-entry insert-only ledger does not yet define combined peer
retention, pruning or bounded replay history. Separate acquisition gates do not
settle those questions. The [retention scope decision](GENERAL_ATTENTION_RETENTION_SCOPE_DECISION.md)
is needed before fixing combined storage bounds and overflow behavior. Common ordinary
memory authority is already accepted; a shared resource budget is not thereby accepted.

Exact child fields, finite bounds, cue semantics, retention/pruning, occurrence/output
declarations, owner paths, complete registration, persistent replay and whole-shape
acceptance remain gates. No public carrier codec or canonical runtime is implemented.
