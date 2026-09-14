# Strength graph retention component checkpoint

2026-09-12. [Component contract](../formal/STRENGTH_GRAPH_RETENTION_COMPONENT.md)
implements the [accepted A ruling](GENERAL_ATTENTION_GRAPH_PRIORITY_RESOLUTION.md).
[Fourteen tests pass](STRENGTH_GRAPH_RETENTION_TESTS_REV1.json): seven new selector
cases and seven edge-plan cases. [Five source mutations](STRENGTH_GRAPH_RETENTION_REVIEW_REV1.json)
are detected: strongest-first, reversed ties, either missing resource stop constraint,
and address-only priority. TypeScript check passes.

Coordinated node release follows weight order even when one stronger deletion would
free a node sooner. Actual EAM newly learned weak edges can immediately lose. Surviving
weights stay exact and equal slot cost is preserved. Canonical ties are tested separately
from unequal-weight behavioral controls. Empty and zero-budget cases are inhabited.

SR-E is a supplied-operand victim reversal, not lawful selective weakening. The current
EAM operator scales prior edges uniformly; it cannot reduce .6 to .3 while holding .4
fixed with learning absent. Uniform positive multiplication preserves strict ordering,
and monotonic quantization can only collapse it into a tie. That tie would test mechanical
tie handling rather than the ruling's intended selective-weakening fingerprint.

## Scope decision required

**A — retain the split proof scope (recommended).** Accept selector behavior on complete
resolved operands, retain producer-level selective reversal as OPEN for a future explicit
weakening contract, and continue owner/lifecycle closure. Do not label the requested
lawful selective witness passed. Existing uniform weakening stays unchanged.

**B — investigate selective weakening now.** First authorize a new research seam specifying
which evidence may weaken which relation, exact mathematics, ownership, ordering and
trace. This introduces a new character mechanism and must not be implemented as an
arbitrary per-edge override merely to satisfy a test.

The planning ruling explicitly requested a lawful selective witness, so silently dropping
it or adding that mechanism would exceed implementation discretion. This decision changes
proof scope or mechanism scope; it does not reopen accepted strength ordering or edge loss.
Public scheduler, rollback, replay/persistence and overall General Attention remain OPEN.
