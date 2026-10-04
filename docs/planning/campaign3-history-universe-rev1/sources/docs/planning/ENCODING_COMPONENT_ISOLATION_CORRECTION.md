# Encoding component isolation correction

2026-09-11. Primary-agent adversarial review identified two JavaScript representation
gaps before public integration: readonly rationals are not frozen at runtime, and
array mapping can skip sparse entries. EAM could expose its shared zero/one constants;
the selected encoder returned its internal role-calibration rational. Hostile mutation
of these results could affect subsequent component calls despite unchanged inputs.

EAM now freezes its private constants and rejects sparse/executable/nonplain arrays
at every list boundary. The selected encoder returns a fresh role rational. The
numeric laws, accepted versions and selected capability boundary do not change.
No global ExactRational or historical component behavior was changed.

Three new regression vectors cover shared-constant mutation, sparse operand lists and
role-calibration mutation. New forward receipts must reexecute all original formula
and encoding vectors/faults in addition to these. Earlier receipts remain historical
commitments to their exact prior source hashes; they are not rewritten or aliased.
Neither correction creates a public encoding, persistence or corpus qualification.
