# Campaign 3 — pending owner decisions

Created 2026-09-14 by the owner-directed correction pass.

This file holds **only** items that meet the escalation criteria in
`CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md`. It is not a general question queue.
Resolve an item by recording the ruling here and in the relevant contract, then move
the entry to the resolved section at the bottom.

**Open: 1.**

---

## OPEN — `OD-C3-001` Ratify the concern → attention feedback edge

**Escalation basis:** policy criterion 3 ("a major new causal mechanism is being
committed"), whose first named example is **affect → retrieval**. Criterion 4 also
applies: the shape of this edge will constrain every later affect model, and getting
it wrong forces a rewrite to express `PHEN-AFFECT-001`.

**Why this is being raised.** The policy is otherwise being honored well — the
use→retention consumer was correctly escalated and ruled on 2026-09-12
(`GENERAL_ATTENTION_USE_CONSUMER_RESOLUTION.md`), and the log records many other
owner resolutions. But `ATTENTION_FEEDBACK_JOIN_REVIEW_REV1.md` closes with *"This is a
design requirement to resolve autonomously, not a request for a new user decision."*
That is right about the **join and registration mechanics**, which are plainly local.
It is not right about the **existence and shape of the edge itself**, which is the first
affect-shaped feedback into cognition anywhere in the programme.

### What is actually implemented

`src/campaign3/priorConcernFeedback.ts`, component
`prior-concern-feedback-component/0.1-candidate`. A prior-instant transient concern
`q ∈ [0,1]`, carried across a committed instant boundary with an explicit two-parent
join at phase 40, modulates continuous encoding allocation:

```
residualPool = residual × (1 − q)
omegaA       = 1 + q
```

with three declared branches — `EnabledKnown`, `BaselineWithoutAvailableFeedback`
(enabled but no available feedback), and `DisabledFeedback`. Unmatched, duplicated,
foreign-run and stale carries reject. An absent expected parent is a failed join,
distinct from a delivered `Unavailable` response.

### What the decision is

Ratify, amend, or decline the following four claims. They are the parts that are
precedent, as distinct from the registration details.

1. **A transient scalar concern in `[0,1]` may cross an instant boundary and modulate
   attention allocation at all.** This is the edge's existence.
2. **It narrows the residual (incidental) pool multiplicatively — `residual × (1 − q)` —
   and scales focal weight as `1 + q`.** These are the specific laws that will anchor
   later affect models by precedent.
3. **It modulates continuous encoding allocation only; role eligibility and capacity `K`
   are unchanged.** This is the narrow claim; the broader "concern narrows what can be
   selected at all" is *not* being committed.
4. **`DisabledFeedback` remains a permanent comparator**, not a temporary scaffold to be
   removed once the enabled branch works.

### Considerations for the ruling

**Supporting.** North Star §11.5 (affect may alter encoding and accessibility without
rewriting truth) and §30's *"frightened person whose attention narrows around threat"*
both call for exactly this edge, and §5.4 requires that affect change salience without
commanding action — which claim 3 preserves. Architecture §3.2's `Affect → Percept`
edge is canonical. The implementation is careful: the contract explicitly declines to
call transient `TaskConcern` general affect, and the disabled branch is real rather than
nominal. This is the highest-value structural item in the repository, because it converts
the architecture from a near-feed-forward pipeline into a system with a closed loop.

**Against, or to amend.** The multiplicative `(1 − q)` form is one of several defensible
laws and no competing form has been compared — an additive or threshold form would make
different predictions at small `q`. `ω_A = 1 + q` doubles focal weight at `q = 1`, which
is a calibration commitment made by a component contract rather than by an experiment.
And a transient task-concern scalar is standing in for affect; if `PHEN-AFFECT-001` later
requires factorized threat (likelihood / severity / vulnerability / control, per `P3-004`),
a single `q` may not extend, and the precedent set here would need explicit superseding.

**Recommended disposition (external review):** ratify claims 1, 3 and 4; ratify claim 2
**as a named first candidate with a required comparator** rather than as the law —
i.e. require at least one alternative modulation form to be declared as a Stage C
competitor before GA closes, exactly as the selection profile already does with
equal-priority and unlimited-capacity controls. That keeps the loop, keeps the precedent
honest, and costs one more component model.

**If declined:** GA can still close on selection, encoding and retrieval without any
feedback edge, with `priorConcernFeedback.ts` retained as an unactivated component.

**Blocking:** do not close General Attention or promote `PHEN-ATTN-002` to a PASS while
this is open.

---

## Resolved

*(none yet — move entries here with the ruling, date, and the contract updated)*

For the historical record of decisions already ruled on, see `CAMPAIGN3_LOG.md` and the
individual `*_RESOLUTION.md` files in this directory.
