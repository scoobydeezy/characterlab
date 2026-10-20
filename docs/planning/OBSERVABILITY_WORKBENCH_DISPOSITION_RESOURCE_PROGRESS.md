# Disposition browser horizon and diagnostic size qualification

2026-10-20. IN PROGRESS. This work addresses the required runtime controls and
resource checks. It does not replace all-program coverage or the integrated demo.

## Original Plastic/Main browser run

Browser2/tab24 at127.0.0.1:4202 runs the isolated
`characterlab-disposition-choice-rev1` build served by preview session88884.
It shares the exact source freeze with the choice revision2 audit. The separate
`workbench-disposition-horizon-ui-rev1/freeze.json` binds all sources and its own
verifier, `scripts/check-workbench-disposition-horizon-ui.mjs`.

Run followed immediately by Pause completed exactly one native instant. The UI
returned Ready at prefix1 with Pause disabled. `paused.json` and
`pause-validation.json` establish that all five displayed model/run/state/save/
projection identities match the authenticated original prefix1 snapshot.

Run then resumed toward terminal18. Last recorded observation was prefix3 Working.
`start.json` and `started.png` record initiation only. Preserve tab24 with
markHandoff on continuation turns. Do not reload, reset, switch its top-level
experiment, replace its served build or infer terminal success from elapsed time.

After the UI reaches Complete, collect `browser.json` with the preserved paused
observation, terminal prefix/status/five hashes, disabled Step/Run states and180
Timeline options. Visit Character, Experiment, Reasoning, Timeline, Compare and
Architecture, recording each pressed mode and displayed alerts. Finally select
historical decision19 in Timeline, capture its exact record and unchanged five
hashes, and save/inspect `terminal.png`. Run the final verifier with sufficient
Node heap for parsing the original terminal snapshot. Only its completed receipt
establishes this bounded full-horizon browser result.

Mode availability does not prove every panel's content, heap usage or all-program
browser resource behavior. No latency, heap or responsiveness budget is claimed.

## Exact diagnostic byte census

The choice revision1 verifier failed at prefix14 because serializing two snapshots
into one string exceeded Node's string-size limit. That failure remains preserved;
revision2 uses incremental hashes of every value without narrowing the corpus.

Session94905 runs `scripts/check-workbench-disposition-snapshot-sizes.mjs`.
It authenticates all285 original compressed archives against the comparison
receipt, streams each full gzip decode, counts actual UTF-8 bytes and hashes the
complete decoded stream. It never parses a whole snapshot or concatenates the
corpus. Frozen verifier and parent-receipt bindings are in
`workbench-disposition-snapshot-sizes-rev1`. A completed receipt is still required.

Serialized diagnostic bytes are not JS string length, parsed-object memory, live
heap, browser memory or native checkpoint bytes. The census will inform resource
work; it does not itself establish a safe browser limit or authorize truncating
authoritative work or diagnostic history. Every original field/event is retained.
Campaign3 semantics, all18 conditional obligations and historical-source limits
remain unchanged.
