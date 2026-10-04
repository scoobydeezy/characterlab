# Observer-relative marker tracking component

Version `observed-marker-tracking/0.1-candidate`; SHAPE ACCEPTED at component scope
by primary-agent self-review, 2026-09-11. Implements a candidate algorithm beneath
SEM-001A, preserving that contract's identity meaning. No public observation grammar,
world channel, persistent layout, allocation or corpus verdict is accepted here.

One opaque component instance owns one nonempty observer ID, initially empty actual
SEM continuant-file state and no prior marker sweep. It accepts at most eight sweeps,
each containing zero to eight detections. Sweep fields are exactly ObserverId,
ObservationId, OccurredAt and Detections; each detection has exactly DetectionId and
optional Glyph. Glyph is an observed categorical value0..7, not an identifier or
truth-origin hash. Missing Glyph is unknown. Times are nonnegative and strictly
increasing. Source occurrence ordinals are nonnegative and never reused in the
instance; detection list is strictly increasing by its source ordinal.

For each current glyph, continuation occurs only when that glyph has exactly one
current detection and exactly one detection in the immediately previous sweep.
Otherwise allocate a NewTrack via actual applyPerceptualTrackTransition. Continuation
uses the previous detection's actual PerceptualReferentId, never a file synthesized
from a glyph or a port. Missing/ambiguous glyphs do not merge files. Disappearance is
not retirement; an empty sweep clears the matching window, not active SEM files.

Every transition cites the current supporting observation; continuation also cites
the previous supporting observation, canonically ordered. The adapter returns actual
SEM217 transitions with the accepted SEM-001A transformation version. It allocates no
ObservationId, DetectionId, tracking-transition ID or alias ConceptId. Candidate SEM
state, previous sweep, used occurrences and horizon advance atomically only after
every detection succeeds. Invalid input leaves the component byte/structurally unchanged.
Instances are unforgeable and outputs/snapshots detached. No character-learning write.

Exact own data fields are checked before getters can run. Foreign observer, unknown
field/truth contamination, invalid/repeated identity, malformed glyph, reversed time,
unbounded sweep and horizon overflow reject. A future canonical adapter must bind
these operands to an actual permitted producer and exact retained tracking reads;
this component does not authenticate externally supplied observations.

Frozen vectors OMT-A..H: new/continued files with same actual SEM identities; glyph
swap across hidden physical objects preserves wrong tracking; duplicate glyphs never
merge; missing/empty-window fragmentation; observer separation; ordinal relabelling
without feature inference; atomic malformed/replayed rejection and detached outputs;
bounded horizon with no counter reuse. Historical truth correction is prohibited.

Review proof: unique prior/current matching gives an injective partial correspondence;
all other detections allocate fresh SEM files. Thus two current detections cannot
share one file through this algorithm. Truth identity is absent, so physical-object
swaps can produce observer-relative continuity errors. The maximum number of newly
allocated files is64. General tracking, appearance uncertainty, recognition, public
encoding and cross-modality continuity remain unqualified.
