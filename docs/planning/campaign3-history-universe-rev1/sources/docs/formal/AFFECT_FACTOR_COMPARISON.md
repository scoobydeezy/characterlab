# Affect factor arithmetic comparison

**Accepted component contract**, 2026-09-20. `affect-factor-comparison/0.1-candidate`.
LOCAL DISPOSITION, no owner ruling. No record or occurrence allocation.

Input is four experimental ExactRational operands p,s,v,c in[0,1]. Unknown is an
explicit missing input, not a number; any missing factor makes the result unavailable.
Reject out-of-domain values, unknown field names and unsupported candidate names.
These inputs have no observer-evidence authority and cannot seed character state.

E=p*s*(1+v)/2; U=E*(1-c); H=E*(2-c)/2.
HistoricalProduct returns coordinate H; SplitExposure returns E,U;
ScalarUncontrolled returns U. Return exact reduced rational values, no quantization,
randomness, feedback, mutation or implicit confidence multiplier.

Required checks: zero/one boundaries; monotonicity of E/U/H in p,s,v and
nonincrease of U/H in c; E independent of c; unknown distinct from known zero;
all16 binary factorial cells; interior half-factor interventions; equal-U/different-E
collision; no mutation of caller operands. Preserve H's nonzero value at c=1.

This implements only the pre-allocation comparison in CAMPAIGN3_AFFECT_READINESS.md.
It does not qualify affect, learned control, persistence, reasons or later feedback.
The product is a historical candidate (Phase3 Brief §25), not the canonical law.
