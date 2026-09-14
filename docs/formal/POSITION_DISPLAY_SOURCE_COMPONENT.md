# Bounded positional display source

`position-display-source-component/0.1-candidate`, 2026-09-13.
LOCAL DISPOSITION — no owner ruling required. Controlled source component only.

The first four-trial attribution witness samples one displayed marker at each of
eight exact instants. Each immutable authored frame contains At, X, Y, Glyph,
Visible and Permitted. Times are nonnegative, unique and increasing; X/Y and Glyph
are integers0..7, matching the accepted spatial-cell and observed-marker domains.
The source contains at most8 frames. No interpolation or last-frame fallback occurs.
Unscheduled, hidden and denied frames all return Unavailable with At only. Present
returns At, Position(X,Y) and Glyph only. Position(0,0) and glyph0 remain present.

Reading neither allocates identity nor mutates the source. The actual observation
producer must supply ObservationId and detection occurrences before SEM tracking;
the displayed glyph is a fallible continuity cue, never a continuant identity.
This component carries no truth referent, trial label, stroke classification,
delivery, body reserve, acquisition/child target, outcome or causal assertion.
Later motion requires two independently retained observed positions under the
accepted grouping and position-pair consumer. The second frame cannot carry the
first position. Missing visibility cannot be repaired from the hidden frame table.

The narrow controlled display instantiates the already accepted positional-input
proposal. It does not implement general spatial perception or three-object selection.
Richer scene sensing remains a separate source generalization. Existing attention
source and positional allocation controls remain unchanged; no historical mechanism
is retired. Exact canonical records, observation occurrence binding, PRJ, combined
source reservation and whole-prefix source reconstruction remain OPEN.

Frozen component checks POS-A..E cover exact zero/one-position output, absence,
finite strict data admission, detachment and unchanged reads. Source integration
must consume the returned position instead of copying the authored fixture value.
