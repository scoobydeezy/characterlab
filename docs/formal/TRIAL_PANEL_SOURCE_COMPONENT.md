# Bounded trial panel source

`trial-panel-source-component/0.1-candidate` — locally accepted component shape,
2026-09-13. Implements the explicit perceived-context disposition under the Campaign3
escalation policy. Not a public observation schema, factory or allocation.

The first controlled source displays a neutral panel with a glyph0..7 and one of
three literal stage labels Before/Motion/After. These are observed labels in the
fixture, not stages inferred from delivery, success or motion. A label does not
assert causality, identify a retained target, qualify significance or create a trial.
The competing general segmentation mechanism remains deferred.

A trusted source constructor consumes a finite schedule of at most16 exact frames.
Each frame has nonnegative bigint At, Glyph0..7, the closed Stage, Visible:Boolean
and Permitted:Boolean. Times are unique and strictly increasing. This is an exact
sampling schedule; an unlisted instant returns Unavailable, with no interpolation
or remembered last display. Permission and visibility jointly gate the observation.
Denied and hidden frames have the same observer-facing Unavailable representation.
Numeric glyph0 is present, not absence. No flags explaining absence are released.

The source token owns a detached immutable schedule. A read returns only Present
with At/Glyph/Stage or Unavailable with At. There is no source-definition resolver,
delivery input, body identity, candidate/acquisition address or outcome field.
Reads neither mutate the schedule nor allocate occurrences. The enclosing accepted
observation producer must bind the read to its actual observation occurrence before
perception consumes it; this component does not supply public authentication.

Perception, not this display source, owns SEM event-file allocation and continuation.
A glyph is a fallible cue and never equals PerceptualEventReferentId. The first
controlled fixture may require consistent observed glyph across its three stages;
missing or conflicting evidence makes its context unavailable. It may not recover
the intended frame or context from this source's private schedule.

Frozen component checks: TP-A exact frame and zero; TP-B hidden/denied/unscheduled
indistinguishable; TP-C no executable/extra fields and finite sorted domain;
TP-D detached source/result and genuine token; TP-E no extra source information
from repeated reads. Public source registration, IDs and persistence remain OPEN.
