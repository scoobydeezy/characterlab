# Observed-marker tracking dense-list correction

2026-09-11. Primary-agent adversarial review found that JavaScript Array.map skips
holes. The component rejected executable/extra array properties but had not required
every position below Length to exist. A sparse list could therefore reach the SEM
loop with an undefined entry rather than reject at the structural boundary. Candidate
state remained private, so this did not publish partial tracking state.

The source now rejects sparse lists before reading or mapping detections. This is a
correction to the existing exact-list contract, with no semantic version, identity,
record or public-source extension. OMT-G gains a named sparse-list rejection and
atomicity witness. The empty dense list remains valid.

OBSERVED_MARKER_TRACKING_REVIEW_REV1.json and its source hashes remain historical.
The forward receipt owns current source qualification; it must rerun all eight
original vectors, this additional vector, and the original five source faults plus
removal of the new dense-list guard. No public encoding or corpus verdict follows.
