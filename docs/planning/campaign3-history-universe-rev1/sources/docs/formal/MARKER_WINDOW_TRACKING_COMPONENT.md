# Marker tracking from the retained window

`marker-window-tracking/0.1-candidate`, 2026-09-13. LOCAL DISPOSITION — no owner
ruling required. Implements the previously proposed TrackingWindow and existing
SEM-001A file-state composition. Component contract only; public registration,
numeric allocation, state admission and persistence qualification remain OPEN.

The owner candidate consumes one admitted observer's actual completed sweep, the
existing PerceptualContinuantFileState/241, and only the last TrackingWindow. It
uses the accepted unique-observed-glyph rule unchanged. A glyph must occur exactly
once in both the previous and current sweep to continue the previous file. Missing
or ambiguous glyphs allocate new observer-relative files through SEM. An empty
sweep empties the matching window; it does not retire existing SEM files or permit
matching an older hidden archive. Wrong objective continuity remains possible.

The first profile has one observer, at most three detections per sweep, ten compiled
sweeps and at most thirty allocated files. The existing source-schedule compiler
owns the ten-sweep limit. This operator checks the three-item and thirty-file bounds;
it adds neither a copied sweep counter nor a source-ID history to perception state.
Initial window is time0, absent observation and no items, with an empty SEM owner.
Later windows have positive time and an observation, including empty sweeps. Items
must be distinct active same-observer files. Inputs and output candidates are detached.

Observation1115 and detection1112 are different identity families. Equal numeric
payloads across them are permitted. Incoming detections are strictly ordered and
unique within their own batch. Same/earlier time or immediately repeated observation
rejects locally. Global occurrence uniqueness, actual source producer association,
once-only transition admission, window/root provenance and the whole-run bound are
runtime/compiler obligations. This pure operator does not authenticate caller data
or promise to detect replay of an older occurrence relabeled with a later time.

Only the tracking registration may publish the proposed SEM state and window
together under perception authority. No episode, learned graph, character-learning
protocol or physical root is read or written. The function returns candidates and
does not publish either owner. Any failure leaves the supplied values unchanged.
The old history-replaying component remains a differential control; its private
history and untyped numeric replay set are not proposed public state.

Frozen component vectors: MW-A differential continuity/ambiguity/absence; MW-B
every-prefix reconstruction from only owner state and last window; MW-C namespace
separation; MW-D failed candidate leaves both owners unchanged; MW-E malformed or
foreign retained window rejects; MW-F no older-window resurrection; MW-G three-item
and thirty-file bounds, including a late bound failure. These are component proofs,
not whole-prefix runtime restoration qualification.
