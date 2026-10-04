# Retained-window source transaction

`marker-window-transaction/0.1-candidate`, 2026-09-13. LOCAL DISPOSITION — no owner
ruling required. Local publication support for marker-window-tracking/0.1-candidate.

The actual requested multimodal source accepts this separate owner implementation
alongside the preserved history-replaying control. The new implementation retains
only observer, SEM file state and last tracking window. Construction from supplied
state is a trusted component operation, not canonical restore or admission. The
tracking operator validates the state/window before preparing a sweep.

An unforgeable manager permits one pending candidate. Preparation changes neither
owner value. Preview is detached, close aborts, and stale/repeated commits reject.
The combined source validates this candidate before committing its panel and marker
owner candidates, after successful semantic freezing. Its synchronous commit path
executes no external callback between validation and publication. The actual runtime
must still stage all owner writes within its whole-instant transaction.

WMT-A freezes token/pending/abort/repeated-commit and preview-detachment controls.
WMT-B freezes reconstruction at every prefix using only the two retained values.
GSO-H compares complete source outputs against the history control for every request,
presence and lane combination. GSO-I executes all fifteen allocation-failure slots
against the retained-window owner and verifies unchanged values and exact retry.
These component controls do not qualify public checkpoint persistence, occurrence
replay admission, panel-state reconstruction or the still-unregistered source graph.
