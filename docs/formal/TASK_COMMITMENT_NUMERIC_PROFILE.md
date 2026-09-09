# Task lifecycle exact numeric profile

**numeric/task-commitment-exact/0.1-candidate — internal profile shape acceptance.**
2026-09-09. Applies only to the pending task lifecycle model; no runtime qualification.

All operators selected by the predecessor measurement-prediction numeric profile
retain their exact semantics and quantization points. This additive profile provides
the following task operators for task-commitment/0.2-candidate:

| Operator | Domain and exact result |
|---|---|
| Desired interval validation | canonical rationals0≤l≤u≤10 |
| Measurement satisfaction | admitted point x satisfies l≤x≤u, inclusive |
| Task-window validation | signed canonical instants0≤a<d |
| Active eligibility | adopted Open status and a≤T<d |
| Deadline applicability | privately associated T=d; no tolerance |
| Quiescent expiry invariant | each present key with T≥d is terminal |

Rational comparison uses exact integer cross-products, with canonical positive
denominators and no floating-point conversion. Task time uses the existing exact
SimInstant grammar; no wall clock, periodic approximation or decrementing countdown.
No task state stores an additional numeric pressure, predicted value, deadline copy
or arithmetic accumulator. The retained satisfying time is copied from admitted
observation provenance and checked against the immutable window.

The admitted measurement points remain the predecessor's k/10, k∈0..100 domain;
task interval endpoints may be any canonical rational in[0,10]. No interval clipping,
nearest-reading snap, normalization by REG bounds or OBS↔REG unit conversion occurs.
The selected prediction/channel/unit spec supplies the reading meaning, not REG.

Source projection, typed identity ordering and storage iteration supply no numeric
psychological magnitude. Comparing canonical keys resolves iteration order only.
There are no random distributions, raw modifier units, concern gains or motive
calibrations in this profile. Those belong to separate future cognitive contracts.

The settlement-work ceiling remains the committed100 events per instant. The
derived successful consecutive-probe bound is17 (prior14, one task-measurement slot,
at most two deadline slots). This is a design accounting bound pending runtime
execution. Arbitrarily overloaded authored-fact instants still fail at the existing
ceiling and roll back; this profile does not exempt deadlines or silently drop work.

Exact model/profile binding and executed TC controls remain required before the
numeric profile can be relied on by an activated task runtime. No previous profile,
model or allocation commitment is renamed or treated as an alias.
