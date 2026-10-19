# Revision1 checker finding

2026-10-19. The first search cohort checker incorrectly assumed the native parity
archive retained complete `state` objects. Its rows retain hashes and observer
records instead. The checker rejected undefined with "Diagnostic search requires
finite JSON data" and emitted no PASS receipt. Frozen sources preserve this attempt.
Revision2 reads the full-state browser archive already joined to native commitments.
No production code was changed to correct this evidence-source mistake.