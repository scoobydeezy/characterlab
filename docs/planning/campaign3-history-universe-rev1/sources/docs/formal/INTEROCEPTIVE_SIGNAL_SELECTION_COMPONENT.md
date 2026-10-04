# Interoceptive signal selection component

2026-09-12. `interoceptive-signal-selection-component/0.1-candidate`.
**Component shape accepted by primary-agent adversarial review under autonomous
authorization.** No public identity, grouping source or memory schema is accepted here.

Inputs are one explicitly identified sensing opportunity, one observer/instant, a
detached channel→signal declaration and0..N actual-shaped EMB461/463 samples. The
opportunity is a nonnegative structural bigint placeholder for the existing admitted
sensing event identity; it is not inferred from At. Public source projection and
run binding remain unqualified. Strings used as signal keys are component symbols,
not allocated SignalIds or a production identity encoding.

The caller supplies limits for declared signals, views per signal, retained bytes
per signal and selection capacity. Limits are safe integers with signal/view maxima
1..16, payload ceiling1..65536 and capacity0..maxSignals. These are finite component
input domains, not a chosen public model. Test limits3/3/4096/2 do not freeze public
parameters. Declared signals and channels must themselves fit the bounds.

Channel IDs are actual canonical1005 text identities; observer is canonical1000.
Signal symbols are nonempty NFC strings of at most64 UTF-8 bytes. Duplicate channels,
sample occurrences or sample channels reject. Each sample must have the declared
observer/instant, known channel, exact461/463 schema and current EMB producer version.
The actual codec validates and detaches every sample. The source adapter must later
authenticate this whole projection; well-shaped declarations alone grant no authority.

Group only by the explicit signal mapping within this opportunity. Missing/absent
views add no numeric operand. A signal with no present sample is Unavailable, not a
zero-valued signal. A present group has one equal-priority candidate irrespective of
view count; canonical text-byte ordering of signal symbols breaks ties. This is an
explicit baseline control, not a body salience or physiological importance law.

Preserve all present sample bytes in a selected group, sorted by canonical channel
identity solely for serialization. Do not combine, prefer, intersect or discard
contradictory values. If the sum of their canonical byte lengths exceeds the supplied
per-signal budget, reject the batch rather than silently truncating its evidence.
Other source payload/metadata bounds must still be fixed by the later public model.

The opaque one-use view contains only selected groups and the detached observer,
instant and explicit opportunity identity. No unselected payload archive survives in
it. Consumption returns new decoded values and revokes the view; close also revokes.
Trace-side audit contains only signal symbols, counts and selection disposition.
No memory write, subject projection, pressure calculation, evidence integration or
attribution occurs in this component. The sample-level component remains unchanged.

Frozen component tests: SG-A duplicate views consume one slot; SG-B three signals
contend even for equal sample values; SG-C contradictory samples remain exact;
SG-D same-time opportunities remain distinct; SG-E independent view/byte/count bounds;
SG-F invalid grouping, observer, time, occurrence and declaration rejection;
SG-G ordering, detached data and revoked views; SG-H unavailable versus zero-pressure
present data. Public source and durable acquisition obligations remain NOT PASSED.
