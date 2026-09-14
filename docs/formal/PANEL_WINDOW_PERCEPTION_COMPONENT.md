# Panel segmentation from retained owner state

`panel-window-perception/0.1-candidate`, 2026-09-13. LOCAL DISPOSITION — no owner
ruling required. Implements the previously proposed TrialPanelWindow with the
existing SEM-001C event-file owner; preserves trial-panel-perception semantics.

The candidate consumes only that owner state, the last panel window and an actual
admitted panel observation and/or visual event detection. Before or changed glyph
ends the prior context and starts a new one. Motion continues an available matching
context. After emits its context and then ends it. Observed Unavailable ends a prior
context. Unsampled panel state is never treated as observed absence; visual-only
consumption with an active panel context rejects. Visual input shares the actual
panel event when present, otherwise produces and immediately ends its own event.

The first-profile window is time0 with no active context. Every later operation has
a strictly later positive SimInstant. Any active window must name the single active
same-observer SEM event file. No source history or copied event counter is retained.
At most16 panel and10 visual sweeps imply at most26 new files; combined detections
share one file and cannot increase that bound. The compiled schedule owns the sweep
limits, while this operator also rejects a candidate exceeding26 allocated files.

All proposals and outputs are detached and supplied owners remain unchanged on
failure. Ordinals are typed by their accepted fields; equal numeric values in
observation1115 and event-detection1113 do not alias. Public source authenticity,
global occurrence replay protection, exact producer/output attachment, canonical
window admission and whole-instant publication remain runtime/compiler obligations.
This is not a public restore constructor or permission to read old observations.

PW-A freezes differential observed stage, glyph-change, missing and shared-visual
behavior. PW-B reconstructs every prefix using only the two owner values. PW-C
distinguishes unsampled context from actual absence and protects failed candidates.
PW-D rejects malformed, foreign or inconsistent windows without invoking getters.
PW-E protects typed-namespace separation and the independent finite file ceiling.
General event segmentation remains a future comparator; no semantic reduction or
corpus promotion follows from these bounded component controls.
