# Campaign 3 — pending owner decisions

Created 2026-09-14 by the owner-directed correction pass.

This file holds **only** items that meet the escalation criteria in
`CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md`. It is not a general question queue.
Resolve an item by recording the ruling here and in the relevant contract, then move
the entry to the resolved section at the bottom.

**Open: 0.**

---

## RESOLVED — `OD-C3-002` Design direction for the concern modulation law

**OWNER DESIGN RULING, 2026-09-14**, issued after `VER-C3-CONCERN-001` showed the
modulation shape is behaviourally load-bearing. Discharged same day by
`VER-C3-CONCERN-002`.

### Ruling as issued

> A and B have successfully demonstrated that modulation shape is behaviorally
> load-bearing. Neither is accepted as the final law. Preserve A and B as comparators.
> For the intended character model, increasing concern must monotonically narrow
> incidental encoding and strengthen concern-associated retrieval; sufficiently strong
> concern must be capable of reversing retrieval against ordinary recency, while generic
> maximum concern must not by itself force the incidental encoding pool to exact zero.
> Encoding suppression and retrieval amplification are separate effects and need not
> share one transfer function. Develop the next serious candidate locally under those
> qualitative constraints and compare it against A/B; escalate again only if satisfying
> them requires a new psychological state or causal mechanism.

### The architectural content of this ruling

The decisive clause is the last substantive one. A and B both applied **one** transfer
function to **two** different consequences:

```text
        A and B                              the ruling
            q                                     q
            |                                     |
   +--------+--------+                 +----------+----------+
   v                 v                 v                     v
1 - g(q)           g(q)              E(q)                  R(q)
(encoding)      (retrieval)        (encoding)           (retrieval)

   one shared curve                      two independent curves
```

Nothing in the North Star requires equal gain, equal saturation or the same shape for
attentional narrowing and retrieval bias. Treating them as one curve was an artifact of
how the first candidate happened to be written, not a modelling decision anyone made.

### Qualitative constraints the eventual law must satisfy

| | Constraint |
|---|---|
| C1 | `E(0) = 1` — baseline reproduced at neutral concern |
| C2 | `E` monotonically decreasing |
| C3 | `E(1) > 0` — generic maximum concern must not force the incidental pool to exact zero |
| C4 | `R(0) = 0` — baseline reproduced at neutral concern |
| C5 | `R` monotonically increasing |
| C6 | **AMENDED 2026-09-14, see below.** ~~`omega_A` must be able to pass the demonstrated retrieval crossover by `q = 1`~~ |
| C7 | both arms bounded / saturating rather than divergent |

Concern must still never directly command a choice.

### C6 amended — fixture-relative, 2026-09-14

The original C6 wording was too broad, as the robustness probe
(`CONCERN_RETRIEVAL_CEILING_REV1.json`) showed: there is no single generic recency
crossover. The required associative weight depends on the particular competing memories,
and a fixture may need `6/5`, `5/3`, `2` or higher. The amended constraint:

> **C6 (amended).** Concern feedback must be capable of producing behaviourally
> meaningful retrieval reordering in **at least one explicitly declared corpus
> phenomenon/fixture where such reordering is psychologically required**. It is **not**
> required to overcome arbitrary recency advantages. For each corpus fixture that
> requires concern-driven retrieval reordering, the declared modulation candidate must be
> capable of crossing **that fixture's** measured or derived retrieval threshold within
> its admitted concern domain. The modulation family's **maximum achievable retrieval
> bias is part of its behavioural contract and must remain visible.**

This makes the obligation phenomenon-relative, which is what was actually wanted, and it
stops the architecture being tuned around one convenient two-memory fixture.

**Behavioural characterisation to keep visible.** Each candidate's maximum associative-pull
bound is now part of its recorded contract: A `ω_A ≤ 2` (attained at `q = 1`), B `3/2`,
C g3 `7/4`, C g10 `21/11`, C g100 `201/101`. The family bound is `ω_A ≤ 2` because
`R = f(g·q) ≤ 1` for every gain.

**Boundary trade-off, retained as characterisation not defect.** Candidate A uniquely
attains `ω_A = 2`, and only while driving incidental encoding to zero. The decoupling in
`VER-C3-CONCERN-002` is therefore only *partial*: within the tested family the extreme
end still couples maximum retrieval amplification to complete peripheral suppression.
Candidate C buys a useful interior region, not an escape from the bounded-response ceiling.

**Reopen condition, not a current work item.** If a required phenomenon needs a fixture
crossover `≥ 2`, gain adjustment inside the current bounded-response family cannot supply
it, and the **response bound / family itself** must become a comparator. Until a required
phenomenon actually demands it, `ω_A ≤ 2` is a property of this family and **not a
defect**; do not implement a higher-bound family, and do not enlarge the mechanism for a
hypothetical fixture. The corpus currently exercises below the ceiling, so the model
remains viable.

### Dispositions

- **Candidate A — useful but over-aggressive. Retained as comparator.** Proves meaningful
  retrieval reversal; suspect on hard-zero peripheral encoding at `q = 1`. Fails C3.
- **Candidate B — useful but underpowered. Retained as comparator.** Bounded, saturating
  encoding behaviour; its retrieval gain can never reach the demonstrated crossover.
  Fails C6.
- **Candidate C — developed locally, satisfies all seven.** See `VER-C3-CONCERN-002`.

### Standing caution

Do not freeze one scalar-concern law as the universal `Affect -> Attention` law. A later
affect model may modulate the two arms differently — which is an argument for keeping
them separate, not for freezing this family. The current work proves the **feedback
topology**, not final affect psychology.

## RESOLVED — `OD-C3-001` Concern → attention feedback edge

**RATIFIED WITH SCOPE AMENDMENT, 2026-09-14.** Owner ruling. Recorded verbatim below,
followed by the obligations it creates.

### Ruling as issued

> 1. **Ratified:** a lawful prior-instant transient character concern may feed back into
>    later attention/encoding allocation. This establishes a general
>    transient-character-state → attention feedback seam; it does **not** qualify
>    `TaskConcern` as the project's general Affect representation.
> 2. **Candidate only:** `residual × (1−q)` and `ωA = 1+q` are accepted as the first named
>    modulation candidate, **not** as architectural law. At least one materially different
>    modulation form must be compared before General Attention treats this law as settled.
> 3. **Ratified:** the first candidate modifies continuous encoding allocation only.
>    Eligibility and capacity `K` remain unchanged.
> 4. **Ratified:** `DisabledFeedback` remains a permanent ablation/comparator alongside
>    `EnabledKnown` and `BaselineWithoutAvailableFeedback`.
>
> The comparator's exact formula may be selected locally under the Campaign 3 decision
> policy provided it changes only modulation shape and introduces no new psychological
> state or causal mechanism.
>
> General Attention remains OPEN. `PHEN-ATTN-001` must not receive a whole PASS merely
> from qualifying this feedback candidate.

### What precedent this sets, exactly

```text
prior character-side concern
        ↓
later attention allocation
```

**not**

```text
general Affect model
        ↓
perception solved
```

`PHEN-AFFECT-001` still owes the factorized threat/appraisal work. When it arrives it may
compile into this seam, replace its source, or demonstrate that a scalar `q` is
insufficient — none of which requires superseding a claim this ruling declined to make.

### Obligation 1 — a shape-different comparator, selected locally — **DISCHARGED 2026-09-14**

**Candidate B selected and compared; see `VER-C3-CONCERN-001` and
`CONCERN_MODULATION_COMPARISON_REV1.json`.** B is `f(q) = q/(1+q)` — the architecture's own
accepted bounded response — substituted for `q` in both terms, so the difference is shape
rather than calibration. The comparison found the shape **load-bearing**: A reverses the
retrieval ranking inside `(0,1]` and B cannot reach the crossover at any `q`. Which shape is
correct remains UNRESOLVED. The narrowed GA blocker is therefore satisfied for seam-existence
work; any broader verdict relying on the modulation law must cite that comparison.

Candidate A (`residual × (1−q)`, `ω_A = 1+q`) is the first named Concern-Modulated
Allocation Candidate. None of the following is frozen as architecture:

- that residual suppression is linear-multiplicative in `q`;
- that focal amplification is linear-additive in `q`;
- that `q = 1` exactly zeroes the incidental pool;
- that `q = 1` exactly doubles focal weight.

**Candidate B must differ in shape, not calibration.** A thresholded/gated or saturating
form is informative; changing `1+q` to `1+q/2` is not. Constraints — the comparator must:

- take the same input `q ∈ [0,1]`;
- use the same authorized source and cross-instant join;
- leave eligibility and `K` unchanged;
- differ **only** in modulation shape;
- behave identically at a clearly declared neutral point, presumably `q = 0`;
- make materially different predictions somewhere inside `(0,1]`;
- introduce no new psychological state.

Selecting B is a **local disposition** under the escalation policy and does not return
for a ruling — unless the proposed comparator introduces a new semantic mechanism rather
than an alternative modulation law.

### Obligation 2 — three branches stay distinct

`EnabledKnown`, `BaselineWithoutAvailableFeedback` and `DisabledFeedback` mark three
materially different states: the mechanism exists and has an admitted value; the
mechanism exists but no lawful prior feedback is available; the mechanism is absent from
the model. **Do not collapse the latter two into `q = 0`.** They mean different things,
and the distinction is what makes the later ablation and epistemic controls work.

### Obligation 3 — the GA blocker, narrowed

The blocker is deliberately **not** "GA waits on the modulation law":

- GA **may** qualify the *existence* of the concern → allocation feedback seam once the
  public source, join and path are proven.
- A broader GA model verdict that **relies on the specific modulation law** requires the
  Stage C comparator first.

Unrelated GA results are not held up by the numerical law. And qualifying this feedback
candidate does not give `PHEN-ATTN-001` a whole PASS — its encoding-footprint clause and
later retrieval probe remain BLOCKED on their own seams, per `VER-C3-ATTN-001`.

### Original escalation packet, preserved

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
cross-instant feedback from character-internal transient state into attention
allocation anywhere in the programme.

> **Framing correction applied in the ruling below.** This packet originally called the
> edge "the first affect-shaped feedback into cognition". That wording quietly makes
> `TaskConcern` a subtype of general Affect, which it is not and which nothing here
> earns. The ruling records the precedent as a *transient character-state → attention*
> seam. The original wording is preserved in this line for the record.

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

**Blocking:** do not close General Attention or promote `PHEN-ATTN-001` to a PASS while
this is open.

---


## Resolved

- `OD-C3-001` — concern → attention feedback edge. **RATIFIED WITH SCOPE AMENDMENT,
  2026-09-14.** Recorded in full above. Obligation 1 discharged by `VER-C3-CONCERN-001`.
- `OD-C3-002` — design direction for the modulation law. **OWNER DESIGN RULING,
  2026-09-14.** Recorded in full above. Discharged by `VER-C3-CONCERN-002`.

For the historical record of decisions already ruled on, see `CAMPAIGN3_LOG.md` and the
individual `*_RESOLUTION.md` files in this directory.
