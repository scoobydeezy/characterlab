# Attention memory retention and symbolic inventory review

2026-09-12. Primary-agent design checkpoint. The accompanying symbolic inventory is
a draft domain record inventory, **not whole-shape acceptance or allocation input**.
It refines the earlier storage proposal without changing accepted component contracts.

## Corrected information boundary

The earlier proposal embedded the whole selected envelope in each episode. That
would retain bindings/claims for units whose spatial allocation was unavailable or
whose final encoding strength was zero. A later recall of the embedded envelope
could expose those units despite their exclusion from the encoding row set.

Separate EncodingEvaluation (trace-side full calculation) from RetainedEncoding
(the exact positive-strength content subset). Only units with final strength >0
enter RetainedEncoding. Known zero and unavailable remain different evaluation
statuses but neither contributes retained content, a new association node or a
presentation. If no positive unit remains, all three character storage writers are
no-ops. Existing perceptual history still records what was observed. This is not
deletion of perception or retroactive alteration of the selected view.

Each retained unit copies its selected bindings/claim and factor values exactly,
without a resolver to the omitted envelope. The retained SelectionOccurrenceId is
the existing source link, not an allocated episode ID or permission to retrieve
unretained bytes. Historical SEM support stays unchanged. No new CharacterEvidenceRef
alternative, truth link or parallel provenance graph is proposed.

Retired-flat remains a named control: eligible units with available operands acquire
its final strength1 and can be retained. An unavailable required spatial operand is
excluded before applying any budget law; flat tagging cannot turn missing allocation
into known evidence. Disabled-spatial uses an explicit constant1 allocation policy,
not a false claim that a missing position was observed.

## Exact draft storage relationships

EpisodeLedger is an append-only sequence of at most four positive encodings. Its
semantic address is qualified CharacterId plus the nested selection occurrence;
the occurrence is not copied into a redundant EpisodeId field. At values order the
history; opaque occurrence numbers do not supply chronology. Every append preserves
all previous entry bytes, and later retrieval copies only RetainedEncoding.

AssociationGraph nodes are the canonical union of positive retained continuant files,
at most12. On formation the proposal uses z for current positive files and0 for prior
nodes not coactivated now. That0 is a learning operand, not new absence evidence.
The prior graph is embedded into the expanded zero-edge matrix before EAM's exact
update. Initial elapsed is0; later elapsed is At-LastUpdatedAt. Quantization and row
normalization remain EAM-owned. Graph decay occurs on these updates; no silent
query-time decay or write is introduced. Recall reads the committed graph and its
explicit timestamp. A later continuous-decay alternative needs a separate contract.

PresentationLedger is written only by the presentation transition, both when seeding
the encoding time and after successful recollection. Each entry's first time equals
its retained encoding At. One original cue per instant means later times strictly
increase. Four cue instants plus formation give at most five presentations per entry;
the earlier draft's bound8 is unnecessary. Duplicate replay must reject through
producer binding, not merely be hidden by set deduplication.

At every successful whole instant, episode selections equal presentation selections,
graph nodes equal the union of retained files, and every retained observer projects
to the owner through actual PRJ/IDN. Within the transaction these structures can be
temporarily incomplete between their separate sole writers. A failure rolls back
the entire instant; no intermediate consistency state may be saved.

## Shape and cross-field obligations

Primitive domains: Cell/Glyph integers0..7; Instant nonnegative; SmallCount0..3;
UnitRational[0,1]; PositiveUnitRational(0,1]; NonnegativeRational>=0; LatticeMass integer
0..committed scale. Graph dimensions equal node count, diagonal0 and row mass<=scale.
No units/dimensions or conversions are implied by grid coordinates or lattice mass.

SpatialUnknown has no Position; known spatial classes require one. Positive/zero
evaluation rows require factors and the corresponding strength; unavailable has
neither. AvailableFile cue requires detection and file, unavailable has no file.
These are conditional shape requirements, not optional-field defaults. Every original
selected unit has exactly one evaluation status and positive rows biject retained units.
A stored positive unit's binding/claim keys, observer, event, time and role must match
the actual source unit; its spatial witness, if present, cannot name another unit.

FeedbackDelivery and EncodingEvaluation cannot be reachable from character storage.
The narrow response modulates factors before retention; the stored historical factor
is not recomputed from current affect. Source authentication remains the reviewed
join contract's obligation. CharacterId is supplied by actual required projection,
never inferred from an episode or copied from an unadmitted carry.

## Review limits and next gate

The machine audit checks domain-reference closure and forbidden storage reachability,
plus deliberate structural corruptions. It does not validate canonical codecs,
conditional fields in runtime values, producer authenticity, mathematics or WRT.
No new numeric IDs, state roots, fixed members or model identities are assigned.

The next packet must add exhaustive registrations, state/accessor roles, producer
occurrences and output closure, including actual source/feedback acquisition. General
ATTN and corpus remain open. Historical category, causal Incidental/Cause, realized
Need and evidence-aware surprise obligations are still not retired by this proposal.
