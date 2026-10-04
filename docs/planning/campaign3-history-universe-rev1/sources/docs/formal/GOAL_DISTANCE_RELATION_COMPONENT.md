# Goal-distance relation component

2026-09-13. `goal-distance-relation-component/0.1-candidate`.
Primary-agent component shape acceptance implements the user's exact relation ruling.

Consume the bodily-maintenance-goal component's trusted state/read context and a
declared signal domain. Only a MetricInterval declaration admits this operation;
numeric ordinal domains do not. Definitions are trusted component model inputs,
not evidence that public signal-distance semantics have already been qualified.
The selected signal must match the active goal. Before/after evidence is either
absent or an exact closed interval inside that same declared domain. Malformed or
foreign-domain evidence rejects, not Unavailable. Goal reads use the assessment
instant, explicit lifecycle and historical-read restrictions of the goal component.

For G=[g,h], d(x)=max(g-x,0,x-h). For E=[l,u], compute exact rational distance bounds:
dMin=max(g-u,0,l-h), dMax=max(d(l),d(u)). MovingCloser requires after.max<before.min;
MovingFarther requires after.min>before.max; SameDistance requires both ranges to
be the same exact singleton. Otherwise emit IndeterminateRelation. No rounding,
midpoints, clipping, confidence or expected value is used.

Position is BelowGoal iff u<g, AboveGoal iff l>h, WithinGoal iff g<=l and u<=h,
otherwise AmbiguousPosition. Boundaries are inclusive. Preserve both endpoint
positions independently of distance. Derive Attainment for determinate outside→within,
Violation for within→determinate outside, NoBoundaryChange for two within or two
determinate outside positions, and IndeterminateBoundary if either is ambiguous.
The boundary-only comparator projects these positions/boundary without distances.

An absent/pending/withdrawn/expired concern returns Unavailable with its reason;
missing evidence returns Unavailable/MissingEvidence. Valid but directionally
ambiguous evidence returns an Assessed result with IndeterminateRelation. These
are distinct from SameDistance. The exact active concern basis is detached into
the assessment so later lifecycle changes cannot alter this candidate value.

Outputs are read-only candidate values, not committed public result occurrences.
No significance, utility, reward, Need, importance or retention write is performed.
The caller must authenticate actual consequence time, subject, signal definition,
evidence provenance and commit/persistence in the future public contract. No such
authority follows from matching numeric values or component symbols. GR-A..H are
component vectors; no allocation or corpus promotion follows from their execution.
