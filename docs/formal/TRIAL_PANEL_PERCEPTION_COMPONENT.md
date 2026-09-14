# Trial-panel event-file perception

`trial-panel-perception/0.1-candidate` — locally accepted bounded cue-tracking
component, 2026-09-13. Uses actual SEM event-file start/continue/end operations.
No new identity family or generic segmentation law is introduced.

A private observer-owned window consumes at most16 strictly time-ordered completed
panel observations. Observation and positive event-detection identities are supplied
by the trusted producer; each role rejects replay independently. Positive panel
observations require a detection; unavailable observations forbid one. The public
producer/identity binding is still a separate unqualified gate.

A present Before cue starts a fresh event-file, ending any prior window. Otherwise
a present matching glyph continues the active file. A different glyph ends the old
file and starts a fresh one. An After observation is attached to the actual transition
and then ends its file. Missing/denied cue ends the visible window with no replacement.
A later matching glyph after that gap therefore starts a new file and cannot silently
recover the lost grouping. End is a fallible perceptual boundary, not a claim that a
world event objectively ceased. General segmentation remains a comparator.

Only observed glyph/stage and prior observer-owned window determine these operations.
No schedule index, body state, motion class, delivery, acquisition or assessment is
read. A new file for a Motion/After cue does not invent missing Before evidence;
the downstream complete-role grouping remains unavailable.

The operation computes all SEM transitions and candidate window state before publishing
the private token's new state. Failure changes neither file allocation nor replay sets.
Output contains actual transition/end records and the current safe context/stage;
it grants no observation resolver. Snapshot is inspection only, not public save input.

Frozen component controls: TC-A start/continue/end with existing SEM; TC-B absence
breaks continuity; TC-C changed glyph and repeated Before split files; TC-D foreign
observer/replay/time/domain failure atomicity; TC-E no lost-stage reconstruction.
