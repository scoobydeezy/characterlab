# LEARN implementation findings — 2026-09-21

LEARN-TEST-001: the first focused run passed18/19. The lattice assertion incorrectly
expected25961/500000 for27/520, one millionth too low. Exact nearest rounding gives
51923/1000000. Corrected only the assertion; raw posterior27/520 and the production
ties-to-even operator were correct. LEARN_PUBLIC_TESTS_REV1.json is preserved;
the successor test receipt must remain distinct. No frozen model/contract/plan change.

LEARN-SCOPE-002: the historical repeated-bound CaseD starts with zero precision.
After its first1/10 bound the mean equals1/10, so the next five are uninformative.
An established below-bound prior can instead accept multiple identical bounds.
The supplementary public repeatedEstablished case preserves this limitation; the
candidate is not a universal repeated-report deduplicator. Accepted-bound precision
still receives full point-like credit, not a calibrated censored posterior.

LEARN-SCOPE-003: the point21/50 in the corpus is the final admitted measurement,
not a hidden true efficacy value read by the learner. Independent physical trials
reset their observed bounded setup; no general body-state ownership is implied.
