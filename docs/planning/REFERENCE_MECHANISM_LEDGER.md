# Reference Mechanism Preservation Ledger

**Status:** active preservation gate

**Purpose:** prevent valuable pre-refoundation mechanisms, findings, and fixtures from disappearing without a deliberate decision

This ledger does not restore the previous architecture wholesale. It records what the historical CharacterLab actually earned, what remains a useful control, what was only proposed, and what was explicitly corrected or retired.

## 1. Source index

- [Original deterministic-model brief](../../reference/CharacterLab%20%E2%80%94%20Deterministic%20Cognitive%20Reference%20Model%20Brief.md)
- [Phase 2.5 research brief](../../reference/CharacterLab%20%E2%80%94%20Phase%202.5%20Research%20Brief.md)
- [Phase 2.9 research brief](../../reference/CharacterLab%20%E2%80%94%20Phase%202.9%20Research%20Brief.md)
- [Phase 2.97 research brief](../../reference/CharacterLab%20%E2%80%94%20Phase%202.97%20Research%20Brief.md)
- [Phase 3 research brief](../../reference/CharacterLab%20%E2%80%94%20Phase%203%20Research%20Brief.md)
- [Phase 3 implementation plan](../../reference/CharacterLab%20%E2%80%94%20Phase%203%20Implementation%20Plan.md)
- [Historical research log](../../reference/RESEARCH.md)
- [Historical implementation map](../../reference/IMPLEMENTATION_README.md)
- `reference/src/` and `reference/src/test/` — executable controls and regression evidence

## 2. Dispositions

| Disposition | Meaning |
|---|---|
| `PORT` | Earned substrate or mechanism that must populate the first fresh reference implementation after a new seam contract exists. |
| `CONTROL` | Keep runnable under an explicit historical/control identity for comparison; it is not the default architecture. |
| `CONTRACT` | Preserve the semantic boundary, invariant, or causal distinction even if its old representation changes. |
| `CORPUS` | Preserve as a named phenomenon, counterfactual, proof, or regression fixture. |
| `CANDIDATE` | Valuable unproven hypothesis. It may enter a campaign but has not earned implementation authority. |
| `RETIRED` | Known-bad or superseded mechanism. Preserve only as history or a negative control; never silently reactivate. |

Every listed item must eventually receive a recorded outcome: accepted port and contract version, named control, corpus-only preservation, explicit supersession, or a justified retirement. Absence from the new source tree is not a verdict.

### `PORT` is not `RETAINED`

`PORT` is a construction and comparison obligation, not a reduction verdict. It means the earned historical mechanism must be re-expressed through the new truth/evidence, ordering, mutation, numeric, and trace contracts so the refounded architecture has a strong initial implementation and an executable control. Every ported mechanism begins `UNRESOLVED` in the active Verdict Ledger until the new corpus and counterfactual methodology support another verdict.

The cluster `MEC-012` through `MEC-020` is a deliberate research bet: Phase 2.9–2.97 supplied unusually deep tests and closure audits, so omitting that pipeline would destroy more evidence than starting with it costs. Porting it does not exempt it from ablation, substitution, calibration review, or later retraction. It exempts it only from being silently discarded before those comparisons can run.

## 3. Earned deterministic and research substrate

| ID | Mechanism or asset | Disposition | Preservation obligation |
|---|---|---|---|
| `SUB-001` | Reduced exact rational arithmetic | `PORT` | Use as the reference oracle; preserve canonical reduction, sign rules, exact equality, and algebraic tests. |
| `SUB-002` | Integer lattice quantization with ties-to-even and largest-remainder allocation | `PORT` + `CONTROL` | Port shared primitives after the numeric profile is formalized. Preserve exact-budget and quantization-bound tests; do not assume the historical scale is optimal. |
| `SUB-003` | Stable typed semantic identifiers and canonical ordering | `PORT` | Port the identity/order discipline, then replace historical registries with current versioned registries. |
| `SUB-004` | Counter-addressed deterministic randomness | `PORT` | Preserve draw independence, stable causal addressing, replay, and purpose separation. The hash/range-mapping algorithm still requires the new formal random contract. |
| `SUB-005` | Exact finite discrete distributions, convolution, and fair tie-share win probabilities | `PORT` | Required by the retained dice grammar. Preserve normalization and brute-force-enumeration proofs. |
| `SUB-006` | Exact linear algebra with fixed pivot order and typed singularity | `PORT` + `CONTROL` | Reuse as an oracle/tool for mechanisms that actually require matrix solving; do not make it a character primitive by default. |
| `SUB-007` | Aggregate-coverage correlated-evidence consolidation | `PORT` | Preserve `EvidenceBasis` provenance, canonical ordering, and the `{1}`, `{2}`, `{1,2}` collective-redundancy regression. The earlier pairwise-max algorithm is retired. |
| `SUB-008` | Structured causal trace, state snapshots/hashes, and first-divergence replay | `PORT` | Port the tested discipline into the new trace schema. Hashes remain diagnostics rather than proof of structural equality. |
| `SUB-009` | Paired counterfactual harness with coupled random addresses | `PORT` | Reuse for every seam comparison so the intervention is the only intended difference. |
| `SUB-010` | Named legacy/default parameter bundles and phase-end re-baselining | `PORT` as research method | Preserve the ability to run old and candidate models side by side. Once a candidate earns canonical status, rename the displaced model as a control rather than leaving two ambiguous defaults. |
| `SUB-011` | “Correct forward; do not rewrite findings” research-log discipline | `CONTRACT` | Corrections must retain the failed hypothesis, diagnosis, replacement, and validating cases. |
| `SUB-012` | Exact monotonic bounded-response transform | `PORT` + `CONTROL` | Preserve as a shared candidate utility with its bounds/monotonicity proofs; do not assume every psychological saturation uses the same curve. |
| `SUB-013` | Inspectable experiment UI, trace viewer, counterfactual panels, and calibration sweeps | `CONTROL` as research tooling | Preserve the ability to expose real authoritative inputs, intermediate values, exact probabilities, and paired outputs. Rebuild views around new contracts rather than porting old UI component boundaries. |

**Campaign 0 port status (2026-09-01):** `SUB-003`, the addressed-draw portion of `SUB-004`, and the explicit coupling-map portion of `SUB-009` are accepted substrate ports under the immutable identifier `substrate/0.2-candidate`. The implementation replaces the historical delimiter/FNV-derived 64-bit word with registered `cenc/1` records and domain-separated SHA-256-derived 128-bit candidates while preserving pure addressing, unrelated-draw independence, purpose separation, and paired coupling. Historical controls, all Campaign 0 vectors, save/load trace continuation, first divergence, and `PHEN-DET-001` pass. This acceptance does not yet port the psychological dice/modifier/identity loop; that remains a mandatory Campaign 2 reference.

`SUB-001` has an accepted Campaign 0 reference port with bigint-only construction, canonical reduction, sign-correct floor/ceiling division, and ties-to-even rounding. The 0C analytical-time implementation resolves the known separately floored interval defect by retaining exact remainder and prohibiting incidental re-anchoring. All `CV-TIME-*`, integrated continuation fixtures, and the preserved historical `rational.test.ts` control pass.

The ordering and persistence portion of `SUB-008` has an accepted Campaign 0 reference port: global monotonic event/sequence allocation replaces the historical per-tick string ID, pending work is ordered by `(DueAt, Phase, EventSequence)`, a complete instant commits atomically, and canonical saves restore IDs and allocator continuation without serializing handlers. Canonical values are deep-copied at scheduler authority boundaries. Accepted `SEM-001H` extends the phase manifest to `ordering-phases/2-candidate` with current/consequence perception lanes and a non-schedulable settlement sentinel without changing scheduler ordering or transaction semantics. `CV-ORD-*`, `CV-SAVE-*`, all generic and concrete `CV-TXN-001` boundaries, `CV-SEM-081..090`, first-divergence proof, integrated continuation, and the preserved deterministic-replay control pass.

## 4. Earned causal and cognitive mechanisms

| ID | Mechanism or finding | Disposition | Preservation obligation |
|---|---|---|---|
| `MEC-001` | Generic `EvidentialEstimate(mean, precision)` and its `NeedExpectation(subject, need)` specialization | `CONTROL` + `CANDIDATE` | Preserve the exact precision-weighted/prediction-error equivalence and resistance-to-isolated-contradiction tests. Re-evaluate which belief/expectation domains legitimately share this representation. |
| `MEC-002` | Informative-bound gating for censored evidence | `CONTROL` + `CORPUS` | Preserve the four named cases: weak compatible bound, inconsistent bound, zero-information saturation, and genuine point evidence after repeated censoring. Accepted-bound precision over-crediting remains a known approximation. |
| `MEC-003` | Bounded-effect decomposition: `Capacity`, `Applied`, `Overflow`, and `EvidenceKind` | `CONTROL` + `CONTRACT` | Preserve the exact identity wherever a bounded effect exists. The historical use of authoritative `Applied` as the character's observation is a perfect-interoception control; the new evidence kind must be computed from the permitted perceived measurement. It does not prove that every Need is a stored bounded meter. `Overflow` remains omniscient trace information. |
| `MEC-004` | truth-side `EffectProvenance → perceptual projection → derived causal roles → SemanticExperience` | `PORT` with boundary correction; restricted token, event-pattern, continuant-recognition, and safe causal-role/provenance controls now present; integrated port blocked by parent `SEM-001` | This is the strongest earned world-truth-to-character-evidence control. Preserve separately identified actor/target/instrument/cause participation, but distinguish semantic `EventRole` from analytical `CausalRole`; keep full provenance, truth referent/action identity, and unobserved world facets on the trace side. `SemanticExperience` receives event-grouped perceptual referents, typed observed classification, and only observer-safe evidence admitted by each consumer's exact `ReadDomain`. Classification, tracking, recognition, retained state, appraisal, and evidence quality remain separate. Accepted `SEM-001G` replaces hidden provenance joins and winner-takes-all causal roles with a closed same-observer reference grammar plus zero-or-more nonrecursive character-relative causal-role claims. The current `(ConceptId, CausalRoleId, VisibleProvenanceSlotId)` path is permanently `CONTROL-SEM-LEGACY-CONCEPT-TOKEN`, valid only where the channel establishes identity, one role suffices, and no hidden link leaks. Historical direct action-key projection remains a control; accepted `SEM-001E` replaces its default character-evidence role with event-file pattern classification. Accepted `SEM-001F` permits continuant candidate identity only through observer-owned catalog/templates or a mapped identity claim. Learned action identity remains downstream. |
| `MEC-005` | Character-relative attention separated from perception | `CONTROL` + `CONTRACT` | Preserve the distinction and residual-pool control. Fixed role weights and pool size remain candidate calibration, not invariants. |
| `MEC-006` | Evidence-aware surprise for point/lower-bound/upper-bound observations | `PORT` as a shared classification/control | Preserve the rule that censored distance is surprising only when it contradicts the prior. All consumers must share the same evidence semantics. |
| `MEC-007` | Multiplicative semantic-salience reference model | `CONTROL` | Preserve base category, event-specific causal role, attention, realized Need relevance, surprise, bounded response, and complete trace factors. The independent budget is the historical canonical control; shared/hybrid budgets remain alternatives. |
| `MEC-008` | Weighted association learning with one mutation authority, row budget, and largest-remainder normalization | `CONTROL` | Preserve as the first association-learning control plus its exact invariants. The global association graph is not automatically the new cognitive backbone. |
| `MEC-009` | Exact spreading activation and accessibility-filtered retrieval | `CONTROL` | Preserve stability/uniqueness, quantize-at-commit, bounded candidate retrieval, and canonical tie behavior. Compare against cheaper/local alternatives. |
| `MEC-010` | Episodic accessibility from recency, retrieval frequency, decay, and retrieval reinforcement | `CONTROL` + `CORPUS` | Preserve hand-computed regression cases. The new memory lifecycle must add reconstruction/consolidation without losing these discriminating behaviors. |
| `MEC-011` | Availability/preconditions separated from accessibility/relevance | `CONTRACT` | World feasibility and “currently on my mind” must remain independently intervenable. Historical substitution tests are the negative control. |
| `MEC-012` | Reason Nuclei keyed by option, motive, referent, and resolved direction | `PORT` | Preserve exact semantic grouping, independent motives/referents, one active nucleus per resolved grouping, stable IDs, and no runtime interpretation. Re-test whether direction belongs in identity or resolved state. |
| `MEC-013` | Cognitive-signal source roles | `PORT` | Preserve `MotiveGenerating`, `StandingDisposition`, `SituationalEvidence`, and `ContextModulating` as separately traceable roles. New source families must emit into this contract rather than invent private dice. |
| `MEC-014` | Two-stage reason consolidation | `PORT` | Preserve “sum compatible raw causes, then bound/floor once,” plus a separate unfiltered evidence basis where required. This prevents path-dependent threshold artifacts and identity self-contamination. |
| `MEC-015` | Dice/modifier grammar and exact arbitration | `PORT` | Mandatory initial arbitration implementation: base die, standing modifier, situational modifier, exact option distributions, `Margin`, `Contest`, `Stake`, `AuthorshipPotential`, resolution mode, and counter-addressed roll. |
| `MEC-016` | Modifier activation rule | `PORT` | A modifier may alter a genuine active motive but cannot create semantic motivation from zero. Preserve weak-motive rescue and zero-motive exclusion tests. |
| `MEC-017` | `DecisionExpression` as frozen contextual choice meaning | `PORT` | Preserve alternatives, reasons, opposition, uncertainty, stakes, intervention, chosen intent, and frozen dice expression independently of execution success. |
| `MEC-018` | Acquired identity evidence and reinforcing standing-modifier loop | `PORT` | Preserve authorship-weighted evidence, consolidation, self-stabilization, fault lines, contradiction, transformation, and no authored trait bonus. Prevent feedback from becoming evidence for itself. |
| `MEC-019` | Intent/attempt/outcome separation | `CONTRACT` + `CORPUS` | Preserve the failed-execution case: a choice can express commitment or courage even when world interference prevents success. |
| `MEC-020` | Commitments as non-Need motive-generating sources with lifecycle identity | `PORT` as a control seam | Preserve active-only pressure, disappearance on retirement, and independent IDs for recurring instances. Do not model an obligation as an immortal appetite. |
| `MEC-021` | Salience-weighted referent attribution for multi-participant memory | `CONTROL` + `CORPUS` | Preserve proportional multi-participant attribution and single-participant backward equivalence. Causal non-participant referents remain an explicit unsupported case. |
| `MEC-022` | Frozen historical calibration/provenance | `CONTRACT` | A later change to thresholds, dice bands, salience, or identity must not recompute what an old choice or memory meant at the time. |

## 5. Earned findings that must become corpus obligations

| ID | Finding or fixture family | Disposition | What must survive |
|---|---|---|---|
| `EXP-001` | Reliable satisfier preference | `CORPUS` | Repeated evidence changes expectation and confidence; established evidence resists one contradiction without a hand-authored attachment stat. |
| `EXP-002` | Saturation and censoring | `CORPUS` | Equal true effects under different capacity produce different raw deltas but not false efficacy conclusions; hidden Overflow never becomes character evidence. |
| `EXP-003` | Habit/accessibility | `CORPUS` | Repeated context/action co-experience makes an action retrievable from context alone; exact historical `1/2` edge strength is retired as a flat-tag artifact. |
| `EXP-004` | Associative substitution negative result | `CORPUS` | Mere target unavailability does not change accessibility; precondition filtering and learned preference remain separately attributable. |
| `EXP-005` | Avoidance without a generic inhibition stat | `CORPUS` | Repeated aversive evidence reduces preference; boundary-clipped observations do not erase an established negative expectation. |
| `EXP-006` | Memory accessibility | `CORPUS` | Recency, repetition, retrieval reinforcement, decay, top-K bounds, and tie ordering remain separately testable. |
| `EXP-007` | Semantic salience cases | `CORPUS` | Same object changing causal role, attention gating, Need relevance, evidence-aware surprise, perception exclusion, and trace completeness. |
| `EXP-008` | Saturation/salience non-leakage | `CORPUS` | Observationally equivalent Applied/evidence states remain salience-equivalent regardless of hidden Overflow. |
| `EXP-009` | Reason separation and correlation suite | `CORPUS` | Same referent/different motives stay separate; same motive/different referents stay separate; correlated derivations do not stack; independent evidence does. |
| `EXP-010` | Dice grammar calibration and richness | `CORPUS` | Several independent reasons produce several dice, exact convolved probabilities, deterministic replay, and modifier/base-die sweeps. Preserve the finding that the historical `+1` modifier was slightly louder than a die-bracket step. |
| `EXP-011` | Biography authorship / seed divergence | `CORPUS` | Identically authored characters differing only in early addressed rolls can acquire different identity and later resolve the same decision differently. |
| `EXP-012` | Identity formation and change | `CORPUS` | Acquisition from zero, gradual influence, weak-signal combination, fault line, self-stabilization, contradiction resistance, and eventual transformation under sustained evidence. |
| `EXP-013` | Commitment lifecycle | `CORPUS` | Pressure exists only while the concrete commitment is live; a new recurrence is a new referent; a permanent commitment pressure can incorrectly lock decisions into Auto. |
| `EXP-014` | Aggregate evidence redundancy | `CORPUS` | `{1}` and `{2}` together make later `{1,2}` fully redundant; pairwise-only overlap must fail this control. |
| `EXP-015` | Semantic-footprint/association-budget interaction | `CORPUS` | Changing how many concepts an event encodes changes achievable pairwise association strength. Tagging policy must be an explicit intervention, not invisible authoring trivia. |

## 6. Valuable Phase 3 material that was never validated

The Phase 3 brief and implementation plan contain substantial design work, but no Phase 3 implementation or experiment was completed. These items are preserved as `CANDIDATE` or `CORPUS`, never as earned mechanisms.

| ID | Proposed distinction or test family | Disposition | Preservation obligation |
|---|---|---|---|
| `P3-001` | World truth → perception → belief → appraisal | `CONTRACT` + `CORPUS` | Preserve the four-way separation and tests for false belief, missing evidence, and differing appraisal from equal belief. |
| `P3-002` | Typed conditional predictions and prediction opportunities | `CANDIDATE` + `CORPUS` | Preserve `ConditionKey`, `OutcomeKey`, opportunity identity, and explicit `OutcomeOccurred` / `SafeOpportunity` / `CensoredOpportunity` / `NoOpportunity` cases. |
| `P3-003` | Non-event evidence | `CONTRACT` + `CORPUS` | A safe non-event teaches only when a relevant opportunity occurred; never accumulate “nothing happened” once per tick. |
| `P3-004` | Threat appraisal factorization | `CANDIDATE` + `CORPUS` | Preserve likelihood, severity, vulnerability, and perceived control as independent interventions. The historical product formula remains only one candidate. |
| `P3-005` | Fear, relief, avoidance, extinction, and generalization | `CORPUS` | Threat generates motives rather than commands; no generic Fear die; relief is not belief evidence; generalization is directional; false fear and cue conditioning remain required cases. |
| `P3-006` | Observer-relative social evidence and belief | `CONTRACT` + `CORPUS` | No privileged access to another mind, subject/domain-specific beliefs, misleading evidence, correction, correlated evidence, private identity separation, and multiple beliefs per person. |
| `P3-007` | Trust and suspicion as derived behavior | `CANDIDATE` + `CORPUS` | Preserve tests before deciding whether either needs independent state. |
| `P3-008` | Social-evaluation threat, embarrassment timing, and jealousy | `CORPUS` | Preserve anticipatory versus observed/retrospective timing and competing-belief explanations; do not implement labels as state. |
| `P3-009` | Constitution, identity, belief, and appraisal separation | `CONTRACT` + `CORPUS` | Constitution may bias appraisal or standing reasons but cannot manufacture evidence, duplicate identity, mutate from a single roll, or eliminate agency. |
| `P3-010` | Same evidence/different people and same constitution/different biographies | `CORPUS` | Preserve as the minimum discrimination suite for constitutional projections. The historical seven-dimensional vector and quadratic projection are candidate controls only. |
| `P3-011` | Same-time evidence ordering and explicit decay | `CANDIDATE` + `CORPUS` | Preserve ordering and partition tests when the current event contract is specified. |
| `P3-012` | Unfinished original phenomenon backlog | `CORPUS` | Reconcile betrayal, grief/loss, rumination, obsession, healthy motivational multiplicity, value formation/revision, and addiction against the North-Star corpus. Their old proposed mechanisms are not implied by preserving the phenomena. |

## 7. Historical controls that remain useful but are not current premises

| ID | Historical model | Disposition | Proper use |
|---|---|---|---|
| `CTL-001` | Stored bounded Need meters and MPS-driven urgency | `CONTROL` | Embodiment/Need ownership comparison. Do not assume Need is necessarily stored state. |
| `CTL-002` | `(mean, precision)` expectation per subject/Need | `CONTROL` | Compare against richer belief/contingency representations. |
| `CTL-003` | Global row-substochastic association graph | `CONTROL` | Compare against local/indexed or domain-specific association mechanisms. |
| `CTL-004` | Independent multiplicative salience budget | `CONTROL` | First salience model, not a universal attention law. |
| `CTL-005` | Legacy pooled semantic-channel Decision compiler | `CONTROL` | Required old-vs-Reason-Nuclei comparison; never restore as the default. |
| `CTL-006` | Seven-dimensional immutable latent personality and quadratic projections | `CONTROL` + `CANDIDATE` | Useful constitutional comparison and Phase 3 fixture source; not an accepted ontology. |
| `CTL-007` | Values derived from repeated Need satisfaction | `CANDIDATE` | Preserve the original formation/revision tests; the North Star does not assume this derivation. |
| `CTL-008` | Acquired/withdrawal Need model of addiction | `CONTROL` | Whole-system addiction comparison only. It is explicitly not the accepted explanation. |
| `CTL-009` | Universal action candidate list with additive scoring | `CONTROL` | Compare against option construction and heterogeneous arbitration; never treat it as the canonical action architecture. |
| `CTL-010` | Experienced Reward | `CANDIDATE` | Remains trace-only until a phenomenon requires a character-accessible hedonic signal with its own derivation. |

## 8. Explicitly corrected, superseded, or prohibited mechanisms

| ID | Retired mechanism | Disposition | Reason |
|---|---|---|---|
| `RET-001` | Flat `z=1` concept tagging | `RETIRED` + `CONTROL` | Makes tag count and row competition silently determine learning strength. Keep only as named legacy salience. |
| `RET-002` | Hand-authored causal role or per-concept attention flags | `RETIRED` | Replaced by structured provenance and deterministic derivation. |
| `RET-003` | Raw `abs(Applied - mean)` surprise for censored evidence | `RETIRED` | Confuses measurement clipping with contradictory evidence. |
| `RET-004` | Naive clipped delta treated as an exact point observation | `RETIRED` + `CONTROL` | Produces boundary-dependent mislearning. |
| `RET-005` | Precision growth from every censored observation | `RETIRED` | Compatible or zero-information bounds do not justify confidence growth. |
| `RET-006` | `Overflow → NeedExpectation` or `Overflow → Salience` | `RETIRED` / prohibited | Leaks simulator truth unavailable to the character; twice-tested non-necessity. |
| `RET-007` | Identity contribution bounded/floored separately from matching ordinary pressure | `RETIRED` | Created all-or-nothing behavior from pipeline placement. Consolidate compatible raw causes once. |
| `RET-008` | Identity as its own independent die | `RETIRED` as default + `CONTROL` | Standing modifier preserved all tested behavior without manufacturing a separate motive. |
| `RET-009` | Pairwise-maximum correlation discount | `RETIRED` | Misses collective redundancy; aggregate prior evidence coverage replaced it. |
| `RET-010` | Commitment represented as a Core Need | `RETIRED` | Confuses an obligation with a recurring appetite and loses independent commitment identity. |
| `RET-011` | Permanent/immortal commitment pressure | `RETIRED` | Active pressure must follow lifecycle; permanent pressure can lock arbitration into Auto. |
| `RET-012` | Named acquired trait as an independent simulation bonus | `RETIRED` / prohibited | Traits are derived descriptions of identity evidence; matching underlying identity may modify reasons once. |
| `RET-013` | Recomputing old DecisionExpressions or memories under current calibration/state | `RETIRED` / prohibited | Rewrites biography and destroys replay/provenance. |
| `RET-014` | Copying full `EffectProvenance` or authoritative `Applied` directly into character-accessible `SemanticExperience` | `RETIRED` as a new-port pattern | The historical type contains truth-side provenance and assumes perfect observation of the bounded state change. The new architecture requires perception/interoception to project what the character can know; full truth remains trace-only. |

## 9. Known historical limitations that must remain visible

- Analytical progression based on separately floored intervals is partition-sensitive unless remainder is retained.
- Accepted censored bounds receive full point-like precision in the historical rule; no experiment yet required a richer posterior, but the approximation is real.
- Historical modifier calibration made one `+1` step slightly stronger than an entire base-die bracket transition.
- Memory-based referent attribution was tested over participants; a salient causal object that is not a participant remains unsupported.
- Historical `SemanticExperience` correctly excluded `Overflow` but still embedded full `EffectProvenance`, authoritative `Applied`, and truth-side concept identities; copying that type unchanged would violate the stricter North-Star truth/evidence, recognition, and interoception boundaries.
- `ReasonNucleusKey` includes direction even though the implementation groups the option/motive/referent triple and resolves one net direction afterward; the cleaner type boundary remains unresolved.
- The historical association and activation mechanisms were validated on small research cases, not Vivarium-scale storage and retrieval.
- Phase 3 formulas, seven-dimensional personality, values, acquired Needs, and addiction mechanisms were planned or drafted, not empirically earned.

## 10. Historical executable evidence map

| Area | Primary preserved tests/fixtures |
|---|---|
| exact arithmetic, lattice, ordering, randomness, linear algebra | `reference/src/test/rational.test.ts`, `quantize.test.ts`, `canonical.test.ts`, `random.test.ts`, `linalg.test.ts` |
| distributions and arbitration probability | `reference/src/test/discreteDistribution.test.ts`, `phase2_9Decision.test.ts`, `phase2_9DecisionResolution.test.ts` |
| expectation and bounded effects | `reference/src/test/expectation.test.ts`, `needs.test.ts`, `phase2_5aRepresentation.test.ts`, `phase2_5Saturation.test.ts` |
| associations, activation, memory | `reference/src/test/associations.test.ts`, `activation.test.ts`, `memory.test.ts`, `phase2Experiments.test.ts` |
| semantic experience and salience | `reference/src/test/salience.test.ts`, `semanticExperience.test.ts`, `phase2_5Salience.test.ts`, `phase2_5cExperienceInterpretation.test.ts`, `phase2_5dSaturationSalienceInteraction.test.ts` |
| identity and DecisionExpression | `reference/src/test/phase2_9Identity.test.ts`, `phase2_9IdentityFormation.test.ts`, `phase2_95ReasonConsolidation.test.ts` |
| Reason Nuclei and correlation | `reference/src/test/reasonNucleus.test.ts`, `evidenceOverlap.test.ts`, `phase2_97ReasonNucleusFormation.test.ts`, `phase2_97CorrelatedEvidence.test.ts` |
| dice/modifier grammar and calibration | `reference/src/test/phase2_97DiceCompiler.test.ts`, `phase2_97DiceGrammarRichness.test.ts`, `phase2_97CalibrationSweeps.test.ts`, `phase2_97OldVsNewCompilation.test.ts` |
| reinforcing identity and seed divergence | `reference/src/test/phase2_97IdentityAsModifier.test.ts`, `phase2_97SeedDivergenceReasonNuclei.test.ts`, `phase2_9SeedDivergence.test.ts` |
| commitments and referent attribution | `reference/src/test/phase2_97CommitmentLifecycle.test.ts`, `phase2_97CognitiveSignals.test.ts`, `phase2_97SituationalModifiers.test.ts` |
| end-to-end replay/cycle integration | `reference/src/test/determinism.test.ts`, `phase2_9CycleIntegration.test.ts`, `phase2_97CycleIntegration.test.ts` |

This table identifies evidence to inspect and port; it does not claim every assertion remains valid under the new model identity.

## 11. Porting gate

Before a campaign or implementation touches a seam, it must:

1. list every ledger item applicable to that seam;
2. state whether each becomes a port, control, corpus obligation, candidate, or retirement;
3. cite the new seam-contract version that preserves its semantics;
4. identify the historical regression tests being ported or deliberately replaced;
5. record any changed representation or calibration;
6. run the relevant historical control and new model on the same declared corpus where comparison is possible;
7. update this ledger and the verdict ledger with the result.

This is the mechanism-level counterpart to the repository's `reference/` boundary: history cannot contaminate the new architecture automatically, and it cannot vanish automatically either.

## Campaign 2 bounded port qualification — 2026-09-09

The current result is recorded in CAMPAIGN2_COGNITIVE_QUALIFICATION.md and
CAMPAIGN2_COMPLETION_REVIEW.md, under task-cognitive-path/0.1-candidate. This update
completes the porting gate for that bounded task profile; PORT is not automatically
converted into a general RETAINED or reduction verdict.

- SUB-001/002/004/005/007/008/012: actual exact arithmetic, quantized ordered identity,
  addressed draws, finite distributions, aggregate coverage, structural trace/prefix
  replay and bounded transform execute. Actual historical differential controls pass
  for270 dice cases,11 identity histories and12 coverage comparisons. Whole reference
  suite43/328 passes. No reference import enters active source.
- SUB-003/010: frozen typed allocations, distinct old/new registries, model recipe
  commitments and historical receipts remain preserved. No fixture namespace promotion.
- SUB-009: natural-address deterministic replay and rollback are qualified; externally
  supplied comparison maps remain excluded from this profile. Existing substrate
  coupling stays a separately tested PORT/control; equal seeds alone do not pair
  differing addresses.
- MEC-011/012/014/015/016: bounded availability/relevance, task nuclei, raw-cause
  consolidation, all five die bands, three modes and zero-base/active-floor controls
  execute. Component Avoid and richer coverage are explicitly not public source claims.
- MEC-013: three historical source roles execute. ContextModulating remains a future
  separately traceable PORT obligation; it is neither admitted nor silently retired.
- MEC-017/018/019/022: frozen meaning, direct acquired-I standing, qualified ordered
  evidence, immutable historical expressions and intent/attempt/outcome separation
  execute. Positive/opposing/quantized histories are component controls; public
  empty-history feedback and64/65 boundary are genuine generated witnesses. Broad
  biography, coercion/cost and seed-space sufficiency remain corpus obligations.
- MEC-020: immutable adopted task instructions and active-only lifecycle pressure
  execute in the bounded non-Need control seam. No immortal pressure or Need relabeling.
- MEC-004/006 and predecessor observation/evidence/memory: accepted projection and
  interval semantics are preserved. Protocol2 remains censored; execution identity
  stays outside character evidence. Eighteen predecessor assays were refreshed.
- MEC-021, broader Need/social/efficacy and Phase3 candidates retain their prior
  CONTROL/CORPUS/CANDIDATE dispositions. CTL-005 remains a runnable historical pooled
  compiler control; no new old-vs-new reduction verdict is claimed.
- RET-007/008/009/012/013/014 remain retired/prohibited as already specified. Exact
  source substitutions detect local-I scaling, extra tickets, standing in meaning,
  lost aggregate history and protocol truth leakage. The collective redundancy
  fixture detects the retired pairwise-max alternative without claiming that the
  last-basis substitution is literally that algorithm.

The known weighted-Jaccard subset residual and historical calibration limitations
remain visible. No North-Star mechanism was eliminated by this port qualification.

## Campaign 3 pre-entry obligations — 2026-09-10

ATTN-001 now explicitly owns unimplemented perceptual attention/encoding salience.
MEC-005 remains CONTROL+CONTRACT, MEC-007 and CTL-004 remain CONTROL, and RET-001
remains retired; no new reduction verdict alters those dispositions. The residual
pool and independent/shared-budget alternatives must be compared through permitted
observer evidence. EXP-007/015 are preserved in the proposed ATTENTION intake,
which is not counted as a frozen corpus member before an intentional successor.

EMB-001 owns body-kinetics/interoception/embodied-motive expressibility. CTL-001 remains
a control; REG is implemented authored-reference mathematics, not an unimplemented
physiology model. The proposed BODY and MULTISOURCE entries preserve that difference.

The new VER-C3-PRE-IDENTITY-001 executes a public baseline/history-without-feedback
comparison and retains earned standing's activation effect in its four-seed matched
probe domain. General biography remains unqualified. Historical numeric reservation
is not a mandate to keep a mechanism active; future ablations use distinct model
commitments and may omit a retired mechanism while its old decoder remains replayable.

SUB-013 and TRC-003 remain explicit inspection/UI obligations. No observer-view
semantics or omitted feedback loop is retired by the current thin-path qualification.

Planning response, 2026-09-10: BODY + MULTISOURCE is the first new contract frontier;
CTL-001 remains a stored-meter control against the architecture's preferred
interoceptively mediated embodied pressure. Do not select a cross-family consolidation
law from provenance overlap alone. ATTN-001 separates permission, active selection,
encoding strength and later access; residual-pool and multiplicative salience are
comparison mechanisms. HABIT, RELATIONSHIP and LONGITUDINAL intake preserves P3-012
and EXP-011/012/013 without declaring their mechanisms ported or qualified. UI debt
does not block Campaign3 entry. See CAMPAIGN3_BODY_RESEARCH_FRONTIER.md.

2026-09-11 ATTN intake: [inspection and explicit mechanism dispositions](CAMPAIGN3_ATTENTION_INSPECTION.md)
preserve MEC-005 residual allocation, MEC-007/CTL-004 salience and MEC-008/009/010
learning/access controls. Proposed hard capacity is a new selection candidate, not a
claim that the historical continuous allocation already implemented top-K. RET-001/002
remain retired; no copied truth-provenance/category-name shortcut.
