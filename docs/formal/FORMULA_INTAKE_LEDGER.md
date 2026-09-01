# Vivarium Formula Intake Ledger

**Source snapshot:** `../vivarium/Docs/CharacterLabMathematicalReference.md` at Vivarium commit `95e93866146fafcde25fa59f7f60ab62c9384f4a`

**Status:** initial classification; no row is adopted merely by appearing here

The source is a useful compilation of formulas with mixed age, purpose, and authority. CharacterLab must classify each candidate, verify it against current Vivarium source, then restate any adopted formula in a versioned seam contract.

## Classification

| Source area | Initial class | CharacterLab use | Required action |
|---|---|---|---|
| integer/rational/fixed-point primitives | substrate candidate | oracle and candidate representations | specify signed rounding, overflow, exact domains |
| canonical ordering, event queue, state hashing | substrate candidate | replay controls | restate encoding/order; structural equality remains proof |
| analytical progression | substrate candidate with defect | time advancement | resolve partition invariance and remainder |
| addressed randomness | substrate candidate with caveat | deterministic sampling | specify bounded rejection/fallback and quantify bias |
| Needs / MPS / fulfillment | competing mechanism or historical control | embodiment and motivation campaigns | do not treat MPS equations as North-Star facts |
| signal field and quadratic statistics | competing mechanism | appraisal/reason experiments | correct coefficient convention and distribution assumptions |
| belief update / Kalman forms | competing mechanism | belief and expectation campaigns | define evidence semantics and preserve covariance validity |
| decision contests, dice/modifier grammar, and identity feedback | retained reference substrate and mandatory initial control | arbitration and identity-feedback campaigns | formalize and port Phase 2.9–2.97 first; reduce or replace only after an explicit comparison verdict |
| personality/identity equations | obsolete or competing | disposition/person-model campaigns | separate self, observer belief, constitution, adaptation |
| relationship formulas | competing or Vivarium-only | social consolidation campaign | preserve directionality and epistemic boundaries |
| population, economy, spatial/world formulas | Vivarium-only | scale constraints at most | exclude from character causal state unless a seam needs them |

## Known mathematical hazards

### `MATH-001` Analytical progression is partition-sensitive

If the implementation applies `floor(rate × elapsed)` and re-anchors after each event, equal total elapsed time can yield different progress. Example: rate `1/2` for two units yields `1` uninterrupted, while two one-unit intervals yield `0 + 0`. CharacterLab needs exact accumulated remainder or an explicit decision that event partitioning is causal.

**Accepted disposition:** `substrate/0.2-candidate` uses analytical anchors, no incidental re-anchoring, and exact bounded remainder for linear rates. All `CV-TIME-*` pass, including negative-rate and failing truncation controls. `TIME-001`/`MATH-001` closed with Campaign 0 on 2026-09-01.

### `MATH-002` Signal-field coefficient convention is ambiguous

The Vivarium implementation stores each upper-triangular interaction once. The matching polynomial is:

```text
f(z) = b + Σ_i w_i z_i + Σ_{i≤j} q_ij z_i z_j
```

Writing the same stored coefficients as a symmetric `zᵀQz` double-counts off-diagonal terms unless `Q_ij = q_ij/2`. Variance calculations may symmetrize an auxiliary matrix; evaluation and statistical notation must not be conflated.

### `MATH-003` Quadratic variance assumes a distribution

Closed-form quadratic variance using fourth-moment identities is valid only under its stated distributional assumptions, commonly multivariate Gaussian inputs. Mean/covariance alone do not determine general fourth moments. Any adopted formula must declare the input distribution or track additional moments.

### `MATH-004` Entrywise covariance clamps do not preserve positive semidefiniteness

Clamping fixed-point covariance entries independently can produce an invalid covariance matrix. A belief contract must define a PSD-preserving representation/projection or restrict the state so validity is mechanically guaranteed.

### `MATH-005` Bounded rejection with modulo fallback has residual bias

Vivarium's deterministic sampler retries rejection a finite number of times and then falls back to modulo. This guarantees termination but is not mathematically unbiased. CharacterLab must either accept and bound that bias as part of the model or choose a different total mapping.

**Accepted disposition:** `substrate/0.2-candidate` restricts spans to `m <= 2^32`, uses 128-bit SHA-256-derived candidates, two rejection candidates, and a fresh modulo fallback with a declared ideal-candidate total-variation bound below `2^-290`. Exact/reduced-width `CV-RNG-*` and `PHEN-DET-001` pass. `RND-001`/`MATH-005` closed with Campaign 0 on 2026-09-01.

### `MATH-006` Authored measurement values are not a semantic compiler

An exact update equation does not explain how world events become observations, likelihoods, reliability, censoring, or missing evidence. Event→perception→measurement compilation is a separate seam and must be proven independently.

## Intake statuses

Each formula entry eventually receives one status:

- `ADOPTED` — restated in a named accepted seam contract;
- `CONTROL` — preserved for a comparison experiment;
- `VIVARIUM_ONLY` — relevant to production surroundings, not character architecture;
- `OBSOLETE` — contradicted by current source or superseded semantics;
- `UNRESOLVED` — potentially relevant but not yet formally classified.

The ledger records provenance; the accepting seam contract owns executable meaning.

## Re-intake and upstream-change process

The pinned Vivarium commit is an immutable evidence snapshot, not a subscription to upstream behavior. Re-intake is required when any of the following occurs:

- a CharacterLab campaign proposes to adopt or compare a Vivarium formula;
- the Vivarium mathematical reference or its governing source code changes in an area already classified here;
- CharacterLab updates the pinned Vivarium baseline intentionally;
- an adopted CharacterLab contract is shown to cite an obsolete or mistranscribed Vivarium formula.

Re-intake must:

1. record the previous and proposed Vivarium commit hashes;
2. diff the mathematical reference and the current authoritative Vivarium source that implements or supersedes it;
3. identify every affected ledger row and CharacterLab seam contract;
4. rerun or revise the row's mathematical-hazard analysis;
5. preserve the prior classification in change history;
6. update this document's source snapshot only after the affected rows are disposed;
7. version any changed CharacterLab seam contract and rerun its declared corpus.

An upstream Vivarium change never mutates an already accepted CharacterLab contract automatically. Until explicit re-intake completes, the pinned snapshot and current CharacterLab contract remain the reproducible comparison basis.
