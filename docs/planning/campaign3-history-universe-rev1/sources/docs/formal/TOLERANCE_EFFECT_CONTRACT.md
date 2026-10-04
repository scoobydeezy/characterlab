# Tolerance effect component — 2026-09-26

**LOCAL DISPOSITION: ACCEPTED for implementation.**
Version `tolerance-effect-component/0.1-candidate`. No owner ruling or permanent
allocation. North Star13 explicitly requires regulatory adaptation to attenuate the
effect of the same stimulus. ADAPT supplies the separate truth-side tolerance state;
the existing displacement probe supplies no tolerance consumer. This contract adds
a world-side component challenge, not a scheduled transition or character read.

## Exact finite semantics

Reuse unchanged firstTraceModel, adaptation-input/0.31-candidate and its public
factory/save/restore. Four authored exposure occurrences at instants2..5 each carry
count0 or1. They settle through the accepted phase110/140 route. State root302,
field1, exact ToleranceKey(character, exposure, regulatory variable) is the sole
attenuation operand. Absent key means zero; committed magnitude t is integer0..10.
Sensitization, displacement and load must not be read as tolerance.

An independent world challenge samples the completed prefix (including initial
prefix), then applies equal stimulus d to a fresh controlled reserve b of capacity10.
It is a later diagnostic intervention: its stimulus does NOT itself create an
exposure event, and its result does NOT feed back into the saved public run.
The four training occurrences, challenge dose and current reserve are distinct.
Use exact rationals, d in[0,10], b in[0,10]. Three committed candidate laws:

* Reciprocal: potential = d/(1+t).
* Linear: potential = d*(10-t)/10.
* Unattenuated: potential = d (effect-link ablation, not absence of adaptation).

Reuse embodied replenishReserve: applied=min(potential,10-b),
overflow=potential-applied, after=b+applied. Return tolerance, potential, applied,
overflow and after as world diagnostics only. Never call these character evidence.
No physiological universality or historical formula port is asserted. Monotonic
attenuation is the candidate behavior, not a selected universal quantitative law.

## Frozen comparison and proof burden

Three component ModelIdentities commit underlying public ModelIdentity, source
hashes, exact law and content. Each run commits initial state, ordered inputs and
challenge inputs separately from the unchanged underlying public RunIdentity.
Freeze all identities before qualification. Repeated [1,1,1,1], naive [0,0,0,0],
spaced [1,0,1,0], saturated-reserve, unrelated-key and non-tolerance-initial-state
controls share the four-event topology. Repeated versus naive must retain equal
initial bytes and differ only in actual contact counts. Other-leaf controls start
sensitization/displacement/load at2, but tolerance absent. Exact challenge values
at every prefix must be restored with the complete original public save, state,
outputs and trace; count terminal and advancing prefixes separately.

Independent arithmetic tests cover all t0..10 and dose0..10; verify saturation can
hide declining potential, wrong keys do not transfer tolerance, zero-count events
do not reset adaptation, and changes to other leaves do not change attenuation.
No recovery law is introduced. Constant persistence over zero exposure is not a
withdrawal claim. No sensor, expectation, motive, decision, compensation or dose
escalation is implemented. Existing ADAPT observer-boundary qualification remains
prior evidence; this composition makes no new public receiving-horizon claim.

MEC003/EXP002 retain potential/applied/overflow and saturation distinctions.
EXP001, MEC019 and identity feedback remain preserved separate controls, with no
new learning or intent claim here. RO008/010/015/019/020 retain wider integration,
epistemic and law-selection debts; RO021 historical gate remains mandatory.
Reopen for scheduled consumption, recovery, cross-tolerance, sensitization,
perceived tolerance or compensatory behavior. No existing state is retired.
