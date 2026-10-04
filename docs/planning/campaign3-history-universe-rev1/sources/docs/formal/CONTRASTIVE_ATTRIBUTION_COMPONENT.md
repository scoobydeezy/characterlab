# Contrastive attribution component

2026-09-12. Version `contrastive-attribution-component/0.1-candidate`.
**Component shape accepted by primary-agent adversarial review under autonomous
authorization. Not a public evidence/source contract or whole attribution seam.**

Consumes the accepted attribution-gated direction without requiring a stored causal
belief. Tests a single deliberately fallible hypothesis: repeated observable motion
contrasted with stationary observations may support attributing a subsequent increase
in an observed body level to the moving candidate. This is not causal certainty or
a numeric causal-effect estimate. This rule may fail through confounding.

## Exact bounded operands and rule

Exactly four observation trials; each trial has two positions or unavailable motion,
and before/after level intervals or unavailable levels. Coordinates are integers0..7.
Intervals are closed conservative bounds with exact rational endpoints,0<=L<=U<=100.
No trial carries truth identity, Applied, Potential, Overflow, credited episode,
psychological weight or caller-authored supported/caused flag.

The source must eventually authenticate that all trials concern the same perceived
candidate and qualified observer/subject, are actual distinct ordered acquisitions,
and carry retained permitted evidence. This component proves none of those facts;
its fixed-domain projection omits all identities and cannot authorize a public write.

A trial is Stroke iff its two positions are(0,0) then(1,0). It is Stationary iff
they are(0,0) then(0,0). Any other valid position pair supplies no eligible movement
contrast. These are uniform fixture kinematics, not a per-entity psychological tag.
The source may not move objects based on the desired assessment verdict.

Require exactly two Stroke and two Stationary trials. All four before intervals must
be identical. Missing evidence, other motion, unmatched baseline or missing contrast
yields Unavailable. It does not assert no causal relationship. Invalid arithmetic,
positions, sparse arrays or wrong cardinality rejects as malformed input.

For each complete trial form the conservative observed level-change interval:

    changeLower = after.lower - before.upper
    changeUpper = after.upper - before.lower

These are net observed changes, not realized replenishment contributions. Closed
bounds also safely enclose accepted half-open sensor bins; closure cannot create
strict separation absent from the original sets.

Return Supported only when both conditions hold:

    min(stroke changeLower) > 0
    min(stroke changeLower) > max(stationary changeUpper)

Otherwise return Unavailable. No tolerance, clipping, midpoint, confidence value,
reward semantics or inferred-zero branch exists. Strict equality does not support.
There is no negative-effect/contrary-attribution conclusion in this component.

Output is Supported or Unavailable only. It changes no state, graph, episode,
presentation count or historical encoding factor. The rule's hypothesis is that
the observable motion is connected to the larger subsequent increase. All four
trial operands must later be preserved as its evidence basis, including stationary
comparators; emitting only the favourable pair would misrepresent its derivation.

## Why this is a distinct attribution candidate

One movement followed by relief is insufficient. The candidate requires replicated
movement/stationary contrast, matched observed baseline and interval separation.
These add permitted connection evidence beyond temporal proximity. They do not
prove experimental randomization, absence of confounders or objective causation.
The physical source must permit identical observed contrasts both when motion causes
the change and when an independent hidden input causes it. Hidden truth cannot veto
Supported. Such an error is the hypothesis's limitation, not a source validation bug.

This deliberately narrow positive-increase rule is not general causal learning.
Negative effects, delayed credit, unequal baselines, uncertain continuous degrees,
causal graphs, corrections and ordinary temporal association remain separate work.
It is not a substitute for the historical Need relevance or surprise formula.

## Frozen component vectors

CA-A replicated separated intervals support; CA-B replacing motion with stationary
removes support while preserving level evidence; CA-C coarse overlapping intervals
are unavailable; CA-D endpoint equality unavailable; CA-E malformed/sparse inputs
reject; CA-F trial ordering and detached-result mutation do not change computation;
CA-G insufficient/missing/other-motion/mismatched-baseline cases unavailable;
CA-H same observed projection under caused versus independently driven histories
keeps Supported; CA-I no positive guaranteed change gives no support.

Public source admission, observation occurrences, authenticated retained history,
PRJ/IDN, current target connection, branch/output allocation, persistence and
consolidation qualification remain NOT PASSED. There is no numeric allocation.
