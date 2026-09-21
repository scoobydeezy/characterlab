# SKILL implementation findings — 2026-09-21

SKILL-IMPL-001: the initial call to inherited arbitration supplied a zero roll
threshold, which its closed domain forbids. The initial public test receipt is
preserved as SKILL_PUBLIC_TESTS_REV1.json. Corrected to1 (player threshold0).
With one candidate, contest is identically0, so every admissible positive roll
threshold gives the same probability1/Auto result. This fixes API conformance;
no psychological competitor or frozen model/input byte changes. The single-option
decision is explicitly asserted and remains an instruction-bound control, not a
general confidence-sensitive choice qualification.

Initial typechecking also caught a mechanical scheduler-option rename during the
plumbing port; restored the existing maxSettlementWorkPerSimulationInstant with
the contract's12-stage bound. Neither issue requires an architectural ruling.
