# Retained Phenomenon Corpus

**CorpusVersion:** `corpus/0.2.0-draft`

**CorpusManifestSchema:** `CorpusManifestEntry` type 174, schema version 1

**CorpusManifestDigest:** `0c4f7f69c0496f90f55224e312fb00279f109909f2ec44d9057d0552925d9aca`

**Status:** initial populated corpus; fixtures require formal seam contracts before implementation

The corpus is the common exam for the intact architecture and every reduction. Scenarios are fixtures; phenomena are obligations. One phenomenon may require several fixtures, and one fixture may exercise several phenomena.

The `EXP-*` and `P3-*` entries in the [Reference Mechanism Preservation Ledger](REFERENCE_MECHANISM_LEDGER.md) are the remaining historical intake queue. They are not considered transferred until represented here with the complete fields below; old scenario code cannot masquerade as a phenomenon specification.

## Aggregate versioning

`CorpusVersion` identifies an ordered manifest of `(PhenomenonId, Version)` pairs sorted by canonical typed ID. Adding, removing, or changing a member increments the aggregate version. Editorial changes that cannot affect setup, observation, comparison, or verdict do not.

`CorpusManifestDigest` is `SHA256(cenc/1 set of CorpusManifestEntry records)` and commits to the manifest below independently of source-table order. A verdict records the aggregate corpus version and digest plus the versions of all fixtures actually executed. Adding, removing, or changing an entry changes the digest and requires an intentional aggregate-version update.

## Manifest

| PhenomenonId | Version | Historical intake | Primary obligation |
|---|---|---|---|
| `PHEN-ADAPT-001` | `1.0.0-draft` | `P3-012`, North-Star embodied adaptation | hidden exposure may update adaptation but never cognition directly |
| `PHEN-BIO-001` | `1.0.0-draft` | `MEC-017`, `MEC-018`, `EXP-011`, `EXP-012` | stochastic biography changes future decision boundaries |
| `PHEN-COMMIT-001` | `1.0.0-draft` | `MEC-020`, `EXP-013` | commitment pressure follows concrete lifecycle identity |
| `PHEN-DECISION-001` | `1.0.0-draft` | `MEC-015`–`MEC-019`, `EXP-010` | settled versus unresolved authorship and frozen expression |
| `PHEN-DET-001` | `1.0.0-draft` | `SUB-004`, `SUB-008`, `SUB-009` | exact replay and random-address independence |
| `PHEN-EPI-001` | `1.0.0-draft` | `EXP-002`, `EXP-008`, `RET-006`, `RET-014` | hidden truth cannot alter character evidence |
| `PHEN-LEARN-001` | `1.0.0-draft` | `MEC-001`, `MEC-002`, `EXP-002` | censored evidence changes belief only when informative |
| `PHEN-MEM-001` | `1.0.0-draft` | `MEC-010`, `EXP-006` | recency, retrieval reinforcement, bounded access, and decay |
| `PHEN-REASON-001` | `1.0.0-draft` | `MEC-012`–`MEC-016`, `EXP-009`, `EXP-014` | semantic reason independence and correlation control |

---

## `PHEN-ADAPT-001` — Automatic adaptation without cognitive leakage

**Version:** `1.0.0-draft`

**Required setup domain:** Two timelines share model, character state, permitted observations, authored inputs, and random addresses. Timeline A receives a hidden physiological exposure or valid practice event; Timeline B receives none. The immediate observation projection is deliberately identical. A later matched challenge can expose the changed regulatory or procedural state through its ordinary causal effects.

**Interventions:** Toggle only actual exposure/practice; independently toggle whether a later sensor or performance opportunity legitimately reveals its effects; replace the typed automatic-adaptation route with character-learning evidence as a negative control.

**Observable obligation:** The qualifying exposure/practice changes only its registered regulatory or procedural adaptation target. Beliefs, expectations, episodic memory, person models, values, habits, identity, and current character learning evidence remain structurally equal while permitted observations are equal. A later matched challenge may diverge through the changed adaptation state and only then generate different character evidence.

**Causal counterfactual obligation:** A model that requires conscious observation before all adaptation fails the hidden-exposure case. A model that places hidden exposure on the character-learning bus produces a forbidden immediate cognitive divergence.

**Epistemic obligation:** Actual exposure, practice truth, and adaptation mutation provenance remain truth/trace-side unless separately projected through a permitted observation seam. The adaptation itself may causally change later sensations or performance without granting retrospective knowledge of its hidden cause.

**Historical/developmental horizon:** One hidden exposure or practice event, its adaptation transition, an observation-equivalent interval, and one later matched challenge.

**Exact comparison rule:** Exact structural equality across all character-epistemic state before the later revealing observation; exact inequality in the targeted adaptation state after the qualifying event; zero mutation in every non-target authority; first cognitive divergence, if any, must descend from a later permitted observation.

**Required trace fields:** exposure/practice truth, adaptation-input type, target authority, pre/post adaptation state, character-learning evidence emitted, observation projection, mutation diff, and causal ancestry of the first later cognitive divergence.

**Applicable seams:** world/body truth, practice, automatic adaptation input, regulatory/procedural adaptation, interoception/performance observation, trace, mutation authority.

**Reopen conditions:** adaptation becomes behaviorally dependent on awareness, expectation, attribution, or strategy; a qualifying exposure cannot be defined without perception; or one event legitimately updates both routes without separable records.

---

## `PHEN-DET-001` — Exact replay and addressed-random independence

**Version:** `1.0.0-draft`

**Required setup domain:** Any accepted seam fixture with a complete `ModelIdentity`, canonical initial state, ordered input sequence, run seed, and at least two distinct random addresses. Include one fixture with no random draw and one with an authoritative draw.

**Interventions:** Replay without changes; insert draws under unrelated addresses; change one component of the target address; save and reload immediately before the target event.

**Observable obligation:** Identical runs produce structurally identical states, outputs, failures, pending events, and trace records. Unrelated draws do not change the target word or downstream result. Changing the target address may change its word but changes no earlier record.

**Causal counterfactual obligation:** A mutable sequential RNG must fail the inserted-draw intervention whenever the insertion shifts the target result.

**Epistemic obligation:** Random addresses and words are trace data, not character knowledge unless an observation seam exposes a result.

**Historical/developmental horizon:** One event, a save/load boundary, and a multi-event replay containing an inserted unrelated draw.

**Exact comparison rule:** Canonical structural equality for unchanged records; exact word equality at the target address after unrelated insertion; first divergence at or downstream of the changed target address.

**Required trace fields:** model/run identity, event order, complete random address, raw word, distribution-mapping version, output, mutation diff, parent event.

**Applicable seams:** deterministic substrate, scheduler, trace, save/load, arbitration.

**Reopen conditions:** random algorithm or address schema change, serialization change, scheduler identity change, or replay divergence.

---

## `PHEN-EPI-001` — Observational equivalence under hidden Overflow

**Version:** `1.0.0-draft`

**Required setup domain:** Two timelines share model, character, prior belief, perceived concepts, attention, and a bounded positive channel at state `19/20`. Timeline A applies potential effect `1/10`; Timeline B applies `4/5`. Both authoritatively apply `1/20`, yielding different hidden Overflow.

**Interventions:** Swap only potential-effect magnitude while holding the permitted perceived/interoceptive measurement and evidence reliability fixed.

**Observable obligation:** Character-accessible observation, evidence kind, semantic encoding, salience, belief update, and immediate downstream cognition are structurally identical.

**Causal counterfactual obligation:** The omniscient trace differs in potential effect and Overflow. A model that reads either hidden field into cognition must produce a detectable forbidden difference.

**Epistemic obligation:** Full `EffectProvenance`, potential effect, capacity, and Overflow remain truth/trace-side. Character evidence contains only the permitted projection and safe provenance references.

**Historical/developmental horizon:** One observation plus every same-event learning and encoding consumer.

**Exact comparison rule:** Exact structural equality for every character-accessible record and post-event character state; exact inequality for truth-side potential-effect and Overflow fields.

**Required trace fields:** effect decomposition, observation projection, evidence kind, semantic encoding, learning inputs/outputs, prohibited-read audit.

**Applicable seams:** world outcome, interoception, perception, SemanticExperience, surprise, learning evidence, salience.

**Reopen conditions:** a legitimate sensor exposes additional magnitude, a character-accessible hedonic signal is introduced, or permitted evidence distinguishes the timelines.

---

## `PHEN-LEARN-001` — Informativeness under censored evidence

**Version:** `1.0.0-draft`

**Required setup domain:** Exact estimate state with no decay, observation precision `2`, and four lower-bound cases: established `(mean=2/5, precision=50)` with bound `1/10`; established `(1/20,50)` with bound `1/10`; nonnegative prior with bound `0`; and six repeated bounds `1/10` followed by point evidence `21/50`.

**Interventions:** Change only whether the bound contradicts the prior, whether it is zero-information, repetition count, or whether final evidence is a point.

**Observable obligation:** A compatible weak bound changes neither mean nor non-decayed precision; an inconsistent bound moves mean upward and grows precision; a zero-information bound manufactures neither; repeated identical bounds grow precision only on the first newly informative occurrence; later point evidence moves more than under the retired unconditional-growth control.

**Causal counterfactual obligation:** The retired rule that grows precision on every observation fails the compatible, zero-information, and repeated-bound cases.

**Epistemic obligation:** The learner receives observation classification and measurement, never hidden Overflow or authored true efficacy.

**Historical/developmental horizon:** One update and a seven-observation sequence.

**Exact comparison rule:** Exact equality or strict rational inequalities stated above; no display tolerance. Internal representation may differ only if these observations and future point-update consequences remain equivalent.

**Required trace fields:** prior, evidence kind/value/precision, informativeness decision, quantization, posterior, comparison-control posterior.

**Applicable seams:** interoceptive observation, evidence classification, expectation/belief update.

**Reopen conditions:** upper-bound behavior differs, accepted-bound precision fails a requirement, decay changes the property, or richer posterior phenomena are added.

---

## `PHEN-MEM-001` — Memory accessibility is historical and bounded

**Version:** `1.0.0-draft`

**Required setup domain:** At least two episode/imprint records with controlled encoding times, equal semantic match, distinct retrieval histories, bounded `topK`, and a future observation time.

**Interventions:** Vary only encoding recency, repeat one retrieval, advance time without retrieval, and create an exact accessibility tie.

**Observable obligation:** More recent memory is initially more accessible; retrieval increases later accessibility relative to its unretrieved counterfactual; accessibility decays; selection never exceeds `topK`; ties resolve by canonical ID; only selected memories receive retrieval reinforcement.

**Causal counterfactual obligation:** Recomputing from current narrative importance alone or reinforcing every candidate differs on at least one fixture.

**Epistemic obligation:** Retrieval operates on character-retained imprints, not unavailable event truth. Current recollection may differ from the immutable truth trace.

**Historical/developmental horizon:** Multiple encoding times, one retrieval, and later comparison after decay.

**Exact comparison rule:** Strict ordering for recency/reinforcement, exact `topK` cardinality, exact canonical tie winner, and zero mutation for unselected records. The historical decay equation is a control, not the equivalence relation.

**Required trace fields:** candidate source, accessibility components, ordering, selected IDs, retrieval mutation, truth/imprint/recollection identities.

**Applicable seams:** encoding, memory retention, retrieval, recognition, workspace.

**Reopen conditions:** consolidation removes detail, reconstruction changes content, semantic indexing changes, or inaccessible-but-retained recall is required.

---

## `PHEN-REASON-001` — Independent reasons and correlated evidence

**Version:** `1.0.0-draft`

**Required setup domain:** Options with signals covering same motive/same referent; same referent/different motives; same motive/different referents; independent evidence `{1}` and `{2}`; later aggregate evidence `{1,2}`; positive and negative motive-generating contributions; zero base motive with nonzero modifier; weak nonzero base motive with matching modifier.

**Interventions:** Change one motive, referent, evidence basis, direction, or source role at a time.

**Observable obligation:** Exact semantic keys merge only matching reason identity; distinct motives or referents remain separate; `{1,2}` adds zero effective evidence after `{1}` and `{2}`; a modifier cannot create a zero-base reason; a matching modifier can rescue a weak genuine motive; one resolved reason contributes at most one base die.

**Causal counterfactual obligation:** Pooled-channel compilation, pairwise-only overlap, one-die-per-fact, and identity-as-independent-die controls are distinguishable.

**Epistemic obligation:** Every signal cites permitted character-relative evidence. No runtime LLM, embedding similarity, or hidden target state assigns motive/referent identity.

**Historical/developmental horizon:** One compilation plus any history required for the standing modifier.

**Exact comparison rule:** Exact nucleus counts and typed keys; exact zero for collective redundancy and zero-base modifier; strict increase for weak-motive rescue; exact provenance preservation.

**Required trace fields:** raw signal, source role, evidence basis, coverage calculation, consolidated strength, resolved key/direction, die/modifiers, rejected-source reason.

**Applicable seams:** motives, cognitive signals, Reason Nuclei, correlation consolidation, option appraisal.

**Reopen conditions:** causal non-participant referents are added, direction identity changes, new source roles cannot compile, or aggregate coverage becomes order-sensitive.

---

## `PHEN-DECISION-001` — Dice express unresolved authorship

**Version:** `1.0.0-draft`

**Required setup domain:** At least two live options under three exact regimes: one decisively favored; low-significance near-even conflict; high-significance near-even conflict. Each option has a complete exact distribution compiled from independent reasons.

**Interventions:** Vary only reason balance, significance, run seed, and world interference after intent.

**Observable obligation:** Settled preference chooses without a roll; unresolved low-significance choice uses quiet stochastic resolution; unresolved high-significance choice exposes the same authoritative roll as player-facing; pre-roll probabilities normalize exactly; identical address/seed replays; chosen intent and frozen `DecisionExpression` survive prevented execution.

**Causal counterfactual obligation:** Always-roll, never-roll, decorative-dice, opaque-weighted-choice, and intent-equals-outcome controls each fail at least one regime.

**Epistemic obligation:** The character may know cognitively available reasons but not the raw random word or hidden future interference unless explicitly observed.

**Historical/developmental horizon:** One decision through post-attempt observation and historical recording.

**Exact comparison rule:** Exact normalization/replay; exact mode for registered thresholds; `DecisionExpression` equality across prevented/successful execution when pre-attempt decision state is identical; distinct outcome records.

**Required trace fields:** options, reasons, dice expressions, distributions, margin/contest/stake/authorship, mode, random address/result, intent, pre-attempt snapshot, attempt, outcome, expression.

**Applicable seams:** reason compilation, option appraisal, arbitration, intent, execution, trace, memory.

**Reopen conditions:** significance changes authoritative math, multi-option conflict invalidates metrics, control conflict is conflated with uncertainty, or a different grammar meets all obligations.

---

## `PHEN-BIO-001` — Early stochastic choices author later differences

**Version:** `1.0.0-draft`

**Required setup domain:** Two characters with identical model, content, initial state, inputs, and non-decision random addresses. Decision seeds produce at least one different early meaningful result. A later probe uses an identical third seed and identical external state.

**Interventions:** Couple or vary only early decision addresses; ablate identity feedback; reverse qualifying expressions; hold probe randomness fixed.

**Observable obligation:** Different early intents produce different frozen expressions, identity evidence, and later standing modifiers. The matched probe may differ because biography differs. Ablating feedback removes the future decision effect while preserving history. Sustained contrary high-authorship evidence can weaken or transform identity; one contradiction need not erase it.

**Causal counterfactual obligation:** Authored-trait, display-only-trait, history-without-feedback, and recomputed-history controls are distinguishable.

**Epistemic obligation:** Identity evidence derives from frozen contextual expressions and permitted feedback, not success alone or omniscient labels.

**Historical/developmental horizon:** Multiple contested decisions, consolidation, one matched probe, and sustained contradiction.

**Exact comparison rule:** Exact equality before first differing roll; first downstream divergence descends from that roll; strict identity-evidence difference by probe; ablation preserves histories but removes matching modifier; old expressions remain structurally identical after later identity change.

**Required trace fields:** coupled addresses, roll ancestry, expressions, identity updates, consolidation, standing modifier, probe distribution/mode/intent, ablation markers.

**Applicable seams:** arbitration, DecisionExpression, identity evidence, consolidation, standing modifiers, memory.

**Reopen conditions:** identity is derived/compressed equivalently, authorship weighting changes, or mature identity eliminates all meaningful uncertainty.

---

## `PHEN-COMMIT-001` — Commitment pressure follows concrete lifecycle identity

**Version:** `1.0.0-draft`

**Required setup domain:** One character with strong matching commitment identity; no active commitment; one active concrete commitment; the same commitment retired; and a new recurrence with a distinct stable ID.

**Interventions:** Add, retire, and replace only the concrete instance while holding identity and all other state fixed.

**Observable obligation:** No active commitment yields no commitment motive; active commitment yields one correctly referented motive; retirement removes it despite persistent identity; the recurrence yields a new referent and never resurrects the retired instance.

**Causal counterfactual obligation:** Commitment-as-Core-Need, immortal pressure, and reused-ID recurrence controls fail at least one state.

**Epistemic obligation:** Others learn about the commitment only through permitted communication, observation, or records; private existence is not automatically social knowledge.

**Historical/developmental horizon:** Creation, active decision, terminal transition, and recurrence.

**Exact comparison rule:** Exact zero/one commitment-reason cardinality; exact referent equality for active instances and inequality across recurrences; identity state unchanged across retirement-only intervention.

**Required trace fields:** commitment ID/version/state, lifecycle event, applicability, generated pressure, reason referent, standing modifier, retirement cause.

**Applicable seams:** authored content, goals/commitments, motives, reasons, consolidation, social evidence.

**Reopen conditions:** partial fulfillment, conflicting beneficiaries, delegation, recurring-series identity, or lifecycle consequences require new distinctions.

---

## Entry template for subsequent intake

```text
PhenomenonId:
Version:
Historical intake:
Required setup domain:
Intervention(s):
Observable obligation:
Causal counterfactual obligation:
Epistemic obligation:
Historical/developmental horizon:
Exact comparison rule:
Required trace fields:
Applicable seams:
Reopen conditions:
```
