# Fear/guilt construction findings — 2026-09-24

LOCAL DISPOSITION. No new psychological verdict and no owner ruling.

The initial fixture supplied a one-byte seed13. The substrate requires exactly32
bytes even for a profile consuming no random draws. FEAR_GUILT_TESTS_REV1.json
records20 failures before settlement. The corrected seed is32 bytes filled with13.
No public RunIdentity or experiment plan existed at that point; frozen model bytes
do not contain a seed and remain unchanged.

The initial test field helper called dataRecord without its required record type.
FEAR_GUILT_TESTS_REV2.json records15 passes/5 failures; FEAR_GUILT_BUILD_REV1.json
records the matching TypeScript rejection. The helper now explicitly checks record
kind and extracts fields. REV3 passed20 tests; REV4 adds a malformed-model, foreign
evidence and input-order regression for21 passes. No production mechanism was
changed to obtain these assertions.

fear-guilt-development-rev1 preserves the original fixture, test and runtime;
FEAR_GUILT_PRESERVATION_REV1.json binds that source and failure receipts. No failed
public cohort or psychological result was overwritten. RO-C3-019/020 preserve the
distinction between construction failure and experimental falsification.
