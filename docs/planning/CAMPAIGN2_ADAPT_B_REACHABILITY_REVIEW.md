# ADAPT B reachability and remaining operation controls

2026-09-09. Decision requested on qualification scope. No production source,
model language, numeric allocation or frozen artifact changed in this pass.

## Accepted checkpoint

The supplied review accepts CAMPAIGN2_ADAPT_WRITE_BOUNDARY_REVIEW and its bounded
target/diff/publication evidence. The correction implements the governed B prefix
in direction; whole B, AD-E4, AD-E8 and FCT remain OPEN. VAL remains QUALIFIED,
bounded PERSIST and deferred PERSIST-I are unchanged, and PHEN-ADAPT remains PASS.
Acceptance is recorded forward in OPEN_DECISIONS, SEAM_LEDGER and VERDICT_LEDGER.

## Decision: scope of the family-root witness

The review suggests a regulatory transition writing a procedural leaf, assuming
one shared authority owns both. That assumption does not hold for the frozen seam:

- ADAPT_001_CONSOLIDATION_DRAFT section2 requires each materialized writable family
  to have its singleton storage authority and states: “One transition cannot
  aggregate the two adaptation authorities.”
- adaptationDomains validates root302 against authority/regulatory-adaptation and
  root303 against authority/procedural-skill. Changing ownership rejects topology.
- adaptationTransitions validates each consumer's exact authority and singleton
  writable family, and rejects cross-basis targets/gates.
- A regulatory operation at root303 therefore fails NON_OWNING_AUTHORITY before
  transition-family membership. Reversing those failures would violate the accepted
  prefix. Existing executable authority-prefix control verifies that earlier rejection.

Consequently, under the current admitted two-root topology, a broad-authority-owned
operation in another transition family is not reachable. No shared authority should
be introduced merely to obtain TRANSITION_WRITE_SCOPE_VIOLATION.

**Recommended ruling:** accept split evidence: a direct component positive/negative
control of the scope interpreter plus an explicit current-model reachability
exclusion. This does not label the component control an admitted factory execution.
If a production-reachable later-family failure is still mandatory, retain it as an
unpassed conditional obligation requiring a separately governed topology; do not
reinterpret the accepted two authorities.

The new component test uses the actual compiled state model, a real authority-owned
operation and the same exact path. Ordinary WRT and scope allowing302 succeed.
A counterfactual internal scope permitting303 rejects with
TRANSITION_WRITE_SCOPE_VIOLATION, both for a fresh operation and a stale-precondition
variant with no permitted exact target. That proves the check and its local precedence,
but the production capability compiler cannot derive that authority/root pairing.
The test and proof report explicitly label this limitation.

## Alternate qualified subject

The first attempt to run a two-character specimen through the bounded compiler
correctly failed its one-character gate. This failed assay is not target-guard evidence
and the compiler was not widened.

The replacement is another explicit split control:

- The declared second subject uses the existing admitted Character kind and exact
  REG character coverage, without a second kind/validator or a roster.
- The generic registry/state-model compiler qualifies it, validates its key and
  permits an ordinary broad-authority write to that key.
- The scope whose target came from the real C1 evaluation rejects the C2 key with
  ADAPTATION_TARGET_PATH_VIOLATION.
- The same two-character source remains excluded by compileBoundedModelDeclarations.

This witnesses generic qualified-subject authorization. It is not a public bounded
two-character run. Please include this split in the qualification-scope ruling.

## New operation and provenance evidence

All cases use admitted state/targets and actual WRT; no new effective-write rule:

| Challenge | Observed failure / control |
|---|---|
| Wrong target + Remove, with absent old state | ADAPTATION_TARGET_PATH_VIOLATION |
| Exact target + Remove, with absent old state | STALE_PRECONDITION |
| Exact target + equal-value Set, differing from governed increment | ADAPTATION_MUTATION_DIFF_VIOLATION |
| Wrong target + equal-value Set | ADAPTATION_TARGET_PATH_VIOLATION |

For both equal-value cases, a separate ordinary-WRT call first succeeds, leaves
canonical state identical and reports one structural diff. This preserves WRT's
existing behavior rather than inventing a generic equal-value-Set error. ADAPT's
effective-diff equality owns the rejection when the target is legal.
Failures leave initial state unchanged and publish no completed execution evidence.

The provenance control swaps tolerance/sensitization TargetPath associations in
the staged per-rule evaluations while preserving the aggregate patch bytes.
It fails TRANSITION_OUTPUT_VIOLATION before completed evidence publication. This
tests post-evaluation reassignment, not every faulty resolver that constructs a
wrong association before expected evidence is captured; that stronger limitation remains.

## Verification and disposition

`src/test/campaign2MutationEvidence.test.ts`:23 tests PASS; TypeScript PASS.
`scripts/prove-campaign2-write-boundary.mjs` produced
[CAMPAIGN2_ADAPT_WRITE_BOUNDARY_PROOF_REV3.json](CAMPAIGN2_ADAPT_WRITE_BOUNDARY_PROOF_REV3.json):
23-test baseline PASS and four substitutions DETECTED:

1. Skip family-scope check (component scope only).
2. Skip exact-target check.
3. Skip actual-diff check.
4. Skip staged-output check.

Source/test fingerprints are verified unchanged during the assay. The predecessor
reports, including the survived redundant guard, remain untouched historical records.
Other source-sensitive historical proofs have not been relabeled or refreshed by
this run. No new whole-B/FCT claim is made.

Decision requested: approve the stated generic-component / admitted-profile-exclusion
split for family-root and alternate-qualified-subject evidence, or retain a separately
governed future production-profile witness as a condition. The recommendation preserves
accepted model semantics and makes the scope of every positive control explicit.

## 2026-09-09 ruling

Split-scope ruling APPROVED. Both generic-component positives and frozen-profile
exclusions PASS. Future production witnesses are conditional on separately accepted
profiles making the branches reachable, not current blockers. No topology widening
is authorized or required. Remove/equal-value and staged association controls and
rev3's four substitutions are accepted in their recorded scopes. Whole B, AD-E4,
AD-E8 and FCT remain OPEN pending consolidation. The later vector proposal is in
[CAMPAIGN2_AD_E4_E8_CONSOLIDATION_REVIEW.md](CAMPAIGN2_AD_E4_E8_CONSOLIDATION_REVIEW.md).
