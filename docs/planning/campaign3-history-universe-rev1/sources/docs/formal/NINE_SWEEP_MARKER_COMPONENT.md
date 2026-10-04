# Nine-sweep marker and display components

`nine-sweep-marker-component/0.1-candidate`, 2026-09-13. Local bounded successor
under GA_NINTH_VISUAL_CUE_LOCAL_DISPOSITION. No public model activation.

The explicit new tracker constructor admits9 committed visual sweeps, each with0..3
detections. It applies the unchanged observed-marker law and actual SEM transitions.
The explicit transaction-manager constructor replays up to9 sweeps under that same
fixed profile and preserves pending/abort/replay semantics. Tenth sweep or fourth
detection rejects. Empty sweeps still consume the horizon and break immediate marker
continuity under the existing law. All source ordinals remain nonreusable after commit.

The existing constructors remain8 sweeps and their existing8-detection bound. The
new nine-frame display constructor uses the same exact positional display projection,
but permits a ninth frame. No unbounded caller-selected capacity is added. Display
sampling has no identity authority and does not make a visual selector complete.
Source and tracker profile selection belongs to the fixed future model compiler.

These construction limits are not cognitive state or fields added to SEM snapshots.
The exact immutable model profile must govern reconstruction. Component prefix
replay is not a public save certificate or an unlogged cognitive evidence archive.
