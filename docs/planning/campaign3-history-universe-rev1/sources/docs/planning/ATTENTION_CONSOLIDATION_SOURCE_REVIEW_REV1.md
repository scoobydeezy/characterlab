# Attention consolidation: scheduler and source inspection

2026-09-12. Primary-agent adversarial review under autonomous authorization.
Accepted lifecycle B is unchanged. No public source, record, owner, model or number
is introduced by this review. General ATTN-001 remains OPEN.

## Executed substrate findings

The actual DeterministicScheduler supports the required atomic composition without
changing phase ordering. A fixture adapter preflights a base proposal and a separate
consolidation receipt against B0 and declared batch inputs. Each member returns B0;
only finish publishes the combined state. Both members remain terminal. Reversing
their execution order leaves final content and history equal. This is composition,
not permission for a handler to read an uncommitted sibling write.

Six new CB-A..F tests execute that scheduler: base durable before later consolidation;
base durable without any outcome; same-instant order independence with B0-only member
visibility; rejection of an unencoded target; whole-instant rollback on late combined
failure; and preservation of a previously committed base when later consolidation
fails. Four existing AMB scheduler tests also pass, including rejection of a chained
phase140 writer. The first ten-test report is preserved separately.

These fixtures use explicit test strings and simple content, not production IDs or
admission. They prove scheduler expressibility, not authenticated source binding,
PRJ/IDN, public memory reads, a lawful psychological effect or whole-prefix restore.
EL-B1..12 therefore remain public proof obligations, NOT PASSED by these fixtures.

## Accepted sources do not yet supply an event effect

| Inspected source | What it supplies | What it does not supply |
|---|---|---|
| measurement-evidence-carriage/0.1-candidate | Authenticated embedded203, exact diagnostic level and safe unit context | Effect of an event; body fuel semantics; causal attribution; general payload lookup |
| embodied-level-observation/0.1-candidate | A permitted current reserve bin, or unavailable source metadata | Consequence-lane sensing or exact hidden level |
| embodied-pressure/0.1-candidate | Deficit pressure from the admitted bin's upper bound and safe threshold | Applied replenishment, event efficacy, future pressure or a general stored Need |
| embodied-replenishment/0.1-candidate | Truth-side before/potential/applied/overflow/after | Character evidence or a character-readable causal link |
| SEM-001G causal-role evidence | Observer-relative analytical roles from permitted bindings | Arbitrary event-to-event causality, action-effect magnitude or permission to traverse trace ancestry |
| character-learning-evidence/0.5-candidate | Consequence227 →269 →270 with exact immediate-source carriage | Numeric interpretation, appraisal, causal attribution, belief reads or effect resolution |

Source locations: src/campaign3/embodiedMath.ts, embodiedRuntime.ts and
embodiedReplenishment.ts; docs/formal/EMBODIED_RESERVE_SHAPE_ACCEPTANCE.md;
docs/formal/MEASUREMENT_EVIDENCE_CARRIAGE.md; docs/formal/EVENT_SEMANTIC_BINDING.md
§SEM-001G; docs/planning/EVID_001_DRAFT_RESOLUTION.md. Historical “not implemented”
sentences in accepted shape receipts are not current qualification dispositions.

The public EMB source presently senses at10 and applies replenishment at110. Its
accepted scope explicitly excludes consequence sensing. Moving that sampler to120
or handing replenishment output479 to cognition would broaden the source contract.
Neither is an adapter convenience under the current frozen model.

## Concrete non-identifiability witness

The new OI-A..C tests invoke actual accepted EMB math, not a replacement formula.
Capacity100, bin width10, pressure threshold60, with no elapsed depletion:

| Hidden realization | Before | Delivered/applied | After | Perceived before/after bins | Derived before/after pressure |
|---|---:|---:|---:|---|---|
| A | 20 | 10 | 30 | 20..30 then30..40 | 1/2 then1/3 |
| B | 29 | 1 | 30 | 20..30 then30..40 | 1/2 then1/3 |

The observed operands are identical while applied effect differs tenfold. This is
a mathematical component counterexample to recovering exact realized effect from
these operands, even if a future authorized consequence sampler supplies the second
bin. It is not an executed public two-sample profile.

OI-B holds perceived bins and applied effect equal while changing potential/overflow
at capacity. OI-C holds both bins and zero pressure equal while applied effect is0
versus5. Thus neither pressure relief nor absence of pressure is an alias for realized
effect. A hidden-truth-derived field would split OI-A illegally at the character boundary.

Even an admitted net level change would not independently establish that a particular
event caused it. Common subject, temporal order, source IDs, tracking continuity and
shared delivery ancestry provide no such cognitive claim by themselves. The current
source packet also lacks a prior estimate whose meaning is this event's effect;
the existing diagnostic-level prediction cannot be relabeled as that estimate.

## Review disposition

[Combined report](ATTENTION_CONSOLIDATION_SOURCE_TESTS_REV1.json):13 tests pass,
comprising six new lifecycle fixtures, three actual-math source counterexamples and
four retained barrier tests. [Earlier report](ATTENTION_CONSOLIDATION_BARRIER_TESTS_REV1.json)
retains the preceding ten-test run. No new production source changed.

The arithmetic counterexamples prove insufficient information, not the right
psychological response. That remaining distinction is made concrete in the
[consolidation credit decision](GENERAL_ATTENTION_CONSOLIDATION_CREDIT_DECISION.md).
Existing32 draft recipes and work bounds exclude the new source/lifecycle and must
not be promoted as if these tests supplied its public proof.

A further declaration debt is explicit: initial acquisition must enter the
architecture's registered character-learning boundary through a newly specified
selected-encoding evidence basis. An empty or correct route tag alone is insufficient.
This can be designed under lifecycle B without changing consequence-only269/270 or
pretending a current experience is a consequence. EVID's explicit allowance for
other future learning-evidence paths is preserved; no generic union is widened here.
