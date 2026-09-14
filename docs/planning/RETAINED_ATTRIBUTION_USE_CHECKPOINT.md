# Retained attribution use checkpoint

2026-09-12. `retained-attribution-use-component/0.1-candidate`.

[29 tests pass](RETAINED_ATTRIBUTION_USE_TESTS_REV3.json): RU-A..I, RA-A..C, the nine
original attribution vectors and eight protection-policy controls. RU-A compares
actual retained-view projection against byte-equal detached operands: same Supported
answer, different consumed addresses and later survivor. RU-B examines alpha then
stops at missing outcome evidence; Unavailable credits alpha, not bound beta or the
co-acquired sibling. RU-E stops before alpha and credits nothing. RU-G checks 28
admissible missing/motion/interval combinations against the original assessment.

The actual deterministic scheduler fixture commits result and protection at t3,
then applies retention at t4. Both Supported and Unavailable yield old-alpha survival;
removing retained use restores newer-beta survival without changing the answer.
Late beforeCommit failure preserves state, outputs, trace, clock, queue and allocator.
Reading committed outputs produces no feedback. Result IDs use the fixture runtime
allocator, not a newly allocated production namespace.

[Six current-source substitutions detected](RETAINED_ATTRIBUTION_USE_REVIEW_REV2.json):
bound-is-used, Supported-only protection, omitted use, same-instant formation,
ignored read domain and rational snapshot alias. TypeScript and boundary checks pass.

Self-review corrected two implementation issues: exact-rational instances needed
detachment despite readonly TypeScript fields; and domain validation needed its own
function rather than running the whole attribution assessment and discarding its
answer. Original verdict mathematics remain unchanged. REV1/REV2 test receipts and
REV1 fault receipt are preserved historical evidence; REV3 tests and REV2 faults
describe current source.

## Explicit proof limits

The admission set, committed-memory snapshot and projection adapter are trusted
component inputs. The adapter decodes fixture interval bytes, not a newly admitted
public observation record. Same observer/candidate, four actual ordered trials,
subject PRJ, public role/read domain and producer authentication remain unproved.
The session token authenticates its local calculation only. finish returns candidates;
only the scheduler fixture proves atomic commit. No permanent result/receipt schema,
canonical save/load, public owner grant or corpus promotion is inferred.

The North Star's retained content / recollection and importance / accessibility
distinctions are preserved. No truth, reward, need, belief or importance operand was
added. This is useful evidence toward the mandatory use comparison, not public GA
qualification. Outcome-derived significance remains a separate architectural gap.
