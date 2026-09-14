# Visual cue event-file composition

`visual-cue-event-component/0.1-candidate`, 2026-09-13. Local bounded source join.

For the first ninth visual cue, the earlier panel context has actually ended and
the panel channel is not sampled. Allocate a new immediately ended SEM event-file
using the same observer's actual event-file owner/counter. Do not manufacture an
Unavailable panel observation or restart a second event counter. The cue receives
no trial-context companion. Existing observer/time/observation/detection replay
guards apply. This narrow operation rejects an active prior panel window rather
than silently closing or borrowing an unsampled context. A broader overlapping
source would need its own explicit composition, not inferred segmentation.

The actual visual cue still owes its observation, continuant tracking, unresolved
role binding where no role was observed, and frozen SEM experience. This component
only owns its event-file operation. It grants no recall, encoding or public source
authority. Public whole-instant publication/persistence remain OPEN.
