/**
 * Default Phase 1 scenario: Mina, a Connection Need, and two candidate
 * relationships (Glen, Priya) plus a always-available baseline Action —
 * enough to run Brief §28's primary Phase-1 experiment ("Mina learns Glen
 * reliably satisfies Connection") and its §29 paired counterfactual
 * (identical setup, Priya instead of Glen).
 *
 * All authored constants here are research knobs, not claims — the UI
 * exposes every one of them as a slider so a user can re-run the
 * experiment under different assumptions rather than trusting these
 * defaults.
 */

import { Rational, ratOf } from '../kernel/rational';
import { needId, conceptKey, canonicalActionKey, asConceptKey, NeedId, ConceptKey, CanonicalActionKey } from '../kernel/canonical';
import { NeedDef } from './needs';
import { ActionDef } from './actions';
import { WorldOutcomeTable } from './outcome';
import { CharacterState, createCharacter, withExpectation } from './character';
import { ChoiceParams } from './choice';
import { NeedExpectationParams, initialExpectation } from './expectation';
import { CycleParams, ExperienceContext, SaturationParams } from './cycle';
import { SalienceParams } from './salience';
import { ActivationParams } from './activation';
import { AssociationLearningParams } from './associations';
import { MemoryCycleParams } from './memory';
import { EventClock } from '../kernel/event';
import { DecisionParams, Decision, Option } from './decision';
import { ReasonChannelPolarityTable } from './identity';
import { SemanticReasonChannelId } from './decision';

export const NEED_CONNECTION: NeedId = needId('need.connection');
export const NEED_REST: NeedId = needId('need.rest');

export const PERSON_MINA: ConceptKey = conceptKey('person.mina');
export const PERSON_GLEN: ConceptKey = conceptKey('person.glen');
export const PERSON_PRIYA: ConceptKey = conceptKey('person.priya');
export const ACTIVITY_STAY_HOME: ConceptKey = conceptKey('activity.stay_home');

export const ACTION_VISIT_GLEN: CanonicalActionKey = canonicalActionKey('action.visit_glen');
export const ACTION_VISIT_PRIYA: CanonicalActionKey = canonicalActionKey('action.visit_priya');
export const ACTION_STAY_HOME: CanonicalActionKey = canonicalActionKey('action.stay_home');
/** Not a candidate in ordinary choice (Mina does not "choose" to be
 * betrayed) — triggered only as a scripted UI event, per Brief §28's
 * "Betrayal: A high-confidence positive expectation receives sharply
 * negative evidence." Shares Glen's `subject` so it lands on the exact
 * same NeedExpectation(person.glen, *) entries ordinary visits built up. */
export const ACTION_BETRAYAL_GLEN: CanonicalActionKey = canonicalActionKey('action.betrayal_glen');

export const WORLD_FLAG_GLEN_AVAILABLE = 'glen_available';
export const WORLD_FLAG_PRIYA_AVAILABLE = 'priya_available';

/** Phase 2 concept universe additions — a Context concept (used by the
 * Habit experiment: Context → Action association) and a Location every
 * ordinary Experience in this scenario happens at. Declared here rather
 * than discovered at runtime, per Brief §13's prohibition on anonymous
 * graph nodes and model/associations.ts's fixed-universe design. */
export const CONTEXT_EVENING: ConceptKey = conceptKey('context.evening');
export const LOCATION_HOME: ConceptKey = conceptKey('location.home');

/** Phase 2.5b — Brief §13 Scenario C/D's "object/location becomes
 * causal" concepts. Not part of `conceptUniverse()` below: the Semantic
 * Salience experiments (experiments/semanticSalience.ts) exercise
 * `computeSemanticSalience` directly rather than running a full
 * associative-learning cycle against these, so they never need a fixed
 * association-graph row/column the way ordinary scenario concepts do. */
export const OBJECT_LAMP: ConceptKey = conceptKey('object.lamp');
export const LOCATION_BAKERY: ConceptKey = conceptKey('location.bakery');

/**
 * Phase 2.9 — the dinner-vs-work Decision axis (Brief §36's own worked
 * trace example) plus a second, independent speak-up-vs-stay-quiet axis
 * (plan scoping note: Experiment I's identity fault line needs two
 * ALREADY-established, genuinely opposing identities; recombining Options
 * from these two independent axes into one ad-hoc Decision — see
 * experiments/identityFormation.ts — creates that fault line without
 * needing a third set of Actions). Achievement/Recognition/Security are
 * new Needs, each independent of Connection/Rest, so each axis has genuine
 * Need-sourced pressure on both sides rather than one side winning by
 * construction. `defaultReasonChannelMapping()`/`defaultSemanticReasonPolarity()`
 * below are what actually tie each Need (via its semantic reason channel)
 * to the IdentityExpressionChannel(s) it evidences.
 */
export const NEED_ACHIEVEMENT: NeedId = needId('need.achievement');
export const NEED_RECOGNITION: NeedId = needId('need.recognition');
export const NEED_SECURITY: NeedId = needId('need.security');

export const ACTIVITY_WORK: ConceptKey = conceptKey('activity.work');
/** Speak Up's own subject — what NeedExpectation(x, Recognition) is learned
 * against. */
export const ACTIVITY_MEETING: ConceptKey = conceptKey('activity.meeting');
/** Stay Quiet's own subject — deliberately DISTINCT from `ACTIVITY_MEETING`
 * (an earlier draft of this scenario gave both Options the same subject,
 * which silently made NeedExpectation(subject, *) identical for both —
 * `evaluateAction` sums a contribution for every Need the character has
 * against ONE subject, so two Options sharing a subject can never differ on
 * Need-sourced pressure alone, exactly the bug `defaultActions()`'s own
 * Glen/Priya/Stay-Home three-way split already avoids by construction). */
export const ACTIVITY_CAUTION: ConceptKey = conceptKey('activity.caution');

export const ACTION_KEEP_DINNER_PROMISE: CanonicalActionKey = canonicalActionKey('action.keep_dinner_promise');
export const ACTION_STAY_AT_WORK: CanonicalActionKey = canonicalActionKey('action.stay_at_work');
export const ACTION_SPEAK_UP: CanonicalActionKey = canonicalActionKey('action.speak_up');
export const ACTION_STAY_QUIET: CanonicalActionKey = canonicalActionKey('action.stay_quiet');

/**
 * The full set of concepts that participate in the associative graph
 * (Brief §13–14). Every subject, Action, Location, and Context concept any
 * scripted or autonomous Experience in this scenario can touch MUST be
 * listed here — model/associations.ts's updateAssociations only ever
 * updates rows/columns within this fixed universe, so an engaged concept
 * missing from this list would silently fail to learn any association
 * (see model/associations.ts's module comment). Betrayal is deliberately
 * excluded: it shares Glen's `subject` for NeedExpectation purposes but is
 * not meant to participate in ordinary associative learning as its own
 * node.
 */
export function conceptUniverse(): ConceptKey[] {
  return [
    asConceptKey(NEED_CONNECTION),
    asConceptKey(NEED_REST),
    PERSON_GLEN,
    PERSON_PRIYA,
    ACTIVITY_STAY_HOME,
    asConceptKey(ACTION_VISIT_GLEN),
    asConceptKey(ACTION_VISIT_PRIYA),
    asConceptKey(ACTION_STAY_HOME),
    CONTEXT_EVENING,
    LOCATION_HOME,
    // Phase 2.9 additions — see the Decision axis constants above. Added to
    // the ONE shared concept universe (rather than a separate universe just
    // for Decision cycles) so ordinary and Decision cycles run over the
    // same associative graph, per Brief §41's "one canonical architecture."
    // These rows start, and stay, all-zero for every pre-2.9 experiment,
    // which never engages them — no existing numeric result changes.
    asConceptKey(NEED_ACHIEVEMENT),
    asConceptKey(NEED_RECOGNITION),
    asConceptKey(NEED_SECURITY),
    ACTIVITY_WORK,
    ACTIVITY_MEETING,
    ACTIVITY_CAUTION,
    asConceptKey(ACTION_KEEP_DINNER_PROMISE),
    asConceptKey(ACTION_STAY_AT_WORK),
    asConceptKey(ACTION_SPEAK_UP),
    asConceptKey(ACTION_STAY_QUIET),
  ];
}

export interface ScenarioConfig {
  readonly seed: string;
  readonly needDefs: readonly NeedDef[];
  readonly actions: readonly ActionDef[];
  readonly outcomeTables: ReadonlyMap<CanonicalActionKey, WorldOutcomeTable>;
  readonly cycleParams: CycleParams;
}

export function defaultNeedDefs(): NeedDef[] {
  return [
    {
      needId: NEED_CONNECTION,
      origin: 'Core',
      setPoint: ratOf(4, 5), // 0.8
      coreImportance: ratOf(1),
      // Deliberately set equal to Glen's outcome magnitude (see
      // defaultOutcomeTables): this keeps repeated visits from marching the
      // Level into the [0,1] ceiling clamp (Brief §10), which would
      // otherwise attenuate the *observed* r_n on later repetitions and
      // bias learned mu downward for reasons that have nothing to do with
      // the phenomenon under study. A smaller decay is a legitimate and
      // interesting scenario to try from the UI (satiation/ceiling effects
      // are a real, if secondary, research question) — this default just
      // isn't fighting the primary experiment's own instrumentation.
      passiveRate: ratOf(-2, 5), // -0.40 per tick
      urgencyExponent: 2,
    },
    {
      needId: NEED_REST,
      origin: 'Core',
      setPoint: ratOf(7, 10), // 0.7
      coreImportance: ratOf(3, 5), // 0.6 — matters, but less than Connection
      passiveRate: ratOf(-1, 25), // -0.04 per tick
      urgencyExponent: 2,
    },
  ];
}

/**
 * Phase 2.9 — the three Needs backing the two Decision axes (see the
 * Decision axis constants' doc comment above). Each is independent of
 * Connection/Rest and of each other, so the dinner-vs-work and speak-up-vs-
 * stay-quiet axes each have genuine Need-sourced pressure on both sides
 * rather than one side winning by construction. Core importances/decay
 * rates are chosen to land near a genuine 50/50 Contest under
 * `defaultDecisionScenario()`'s initial levels — research knobs, not final
 * balance, exactly like `defaultNeedDefs()` above.
 */
export function decisionNeedDefs(): NeedDef[] {
  return [
    {
      needId: NEED_ACHIEVEMENT,
      origin: 'Core',
      setPoint: ratOf(4, 5), // 0.8
      coreImportance: ratOf(1),
      passiveRate: ratOf(-2, 5), // -0.40 per tick — mirrors Connection's own tuning
      urgencyExponent: 2,
    },
    {
      needId: NEED_RECOGNITION,
      origin: 'Core',
      setPoint: ratOf(7, 10), // 0.7
      coreImportance: ratOf(4, 5), // 0.8
      passiveRate: ratOf(-3, 10), // -0.30 per tick
      urgencyExponent: 2,
    },
    {
      needId: NEED_SECURITY,
      origin: 'Core',
      setPoint: ratOf(7, 10), // 0.7
      coreImportance: ratOf(4, 5), // 0.8
      passiveRate: ratOf(-3, 10), // -0.30 per tick
      urgencyExponent: 2,
    },
  ];
}

/** All Needs any Phase 2.9 Decision experiment can require — ordinary
 * `defaultNeedDefs()` plus `decisionNeedDefs()` — used by
 * `defaultDecisionScenario()` below. Kept as its own function (rather than
 * changing `defaultNeedDefs()` itself) so every pre-2.9 scenario/experiment
 * keeps exactly its original two-Need character unless it explicitly opts
 * into the Decision axes. */
export function allDecisionNeedDefs(): NeedDef[] {
  return [...defaultNeedDefs(), ...decisionNeedDefs()];
}

/** Phase 2.5c — each Action's `subjectRole` is a semantic fact about that
 * Action's own event structure (see `ActionDef.subjectRole`'s doc comment),
 * not a per-character weight. Visiting/staying are ordinary social/
 * activity participation — Conversation-like — so their subjects bind as
 * `'Participant'`; Betrayal is the one Action in this scenario whose
 * subject directly causes a sharp negative Need effect, so it binds as
 * `'Cause'` (Attack-like — the agent responsible for what happened), not
 * the generic `'Target'` every subject used to get regardless of what kind
 * of interaction it was. */
export function defaultActions(): ActionDef[] {
  return [
    {
      actionKey: ACTION_VISIT_GLEN,
      displayName: 'Visit Glen',
      subject: PERSON_GLEN,
      subjectRole: 'Participant',
      preconditionHolds: (flags) => flags.has(WORLD_FLAG_GLEN_AVAILABLE),
    },
    {
      actionKey: ACTION_VISIT_PRIYA,
      displayName: 'Visit Priya',
      subject: PERSON_PRIYA,
      subjectRole: 'Participant',
      preconditionHolds: (flags) => flags.has(WORLD_FLAG_PRIYA_AVAILABLE),
    },
    {
      actionKey: ACTION_STAY_HOME,
      displayName: 'Stay Home',
      subject: ACTIVITY_STAY_HOME,
      subjectRole: 'Participant',
      preconditionHolds: () => true,
    },
  ];
}

export function betrayalAction(): ActionDef {
  return {
    actionKey: ACTION_BETRAYAL_GLEN,
    displayName: 'Betrayal (Glen)',
    subject: PERSON_GLEN,
    subjectRole: 'Cause',
    preconditionHolds: () => true,
  };
}

export function betrayalOutcomeTable(): WorldOutcomeTable {
  return {
    actionKey: ACTION_BETRAYAL_GLEN,
    effects: [{ needId: NEED_CONNECTION, magnitude: ratOf(-9, 10), noiseHalfWidth: ratOf(0) }], // -0.90, no noise: a single sharp, unambiguous betrayal
  };
}

/**
 * Aversive outcome for the Phase-2 Avoidance experiment
 * (experiments/avoidance.ts) — reuses ordinary ACTION_VISIT_GLEN (unlike
 * Betrayal, this is meant to be experienced repeatedly, not once) but with
 * a small negative Rest effect instead of Connection's usual positive one.
 *
 * Rest, not Connection, is deliberately the target Need here: Connection's
 * passiveRate (-0.40/tick, tuned in defaultNeedDefs() to offset Glen's own
 * +0.40 positive outcome) decays so fast on its own that ANY repeated
 * negative Connection outcome floor-clamps the Need within 1-2 repetitions
 * regardless of magnitude — at that point the observed r_n become 0 (the
 * Need literally cannot fall further) and NeedExpectation's learned μ gets
 * pulled back toward 0 rather than converging to the true effect, exactly
 * mirroring Phase 1's ceiling-saturation finding but at the opposite
 * boundary. Rest's much gentler -0.04/tick decay avoids that confound long
 * enough (5 repetitions, with this -0.08 magnitude, land exactly on the
 * boundary without clamping) to observe genuine avoidance — a monotonically
 * declining Pr(this action) — before the same floor artifact reappears on
 * later repetitions. See RESEARCH.md's Phase 2 entry for the traced numbers
 * and why this is reported as a feature of the experiment's own tuning, not
 * a randomly-chosen coincidence.
 */
export function aversiveOutcomeTable(): WorldOutcomeTable {
  return {
    actionKey: ACTION_VISIT_GLEN,
    effects: [{ needId: NEED_REST, magnitude: ratOf(-8, 100), noiseHalfWidth: ratOf(0) }], // -0.08, no noise
  };
}

/**
 * Phase 2.9 — the four Options backing the two Decision axes. Each binds
 * its own new subject (`ACTIVITY_WORK`/`ACTIVITY_MEETING`) rather than
 * reusing `PERSON_GLEN` for anything but Keep Dinner, so each Option's
 * NeedExpectation is independent and must be seeded/learned on its own
 * (`defaultDecisionScenario()` below seeds all four via `withExpectation`,
 * mirroring `saturationSalienceInteraction.ts`'s established
 * seed-the-prior-directly pattern rather than requiring a live learning
 * history before any Decision experiment can run). All four are ordinary
 * social/activity participation — Conversation-like — so `subjectRole` is
 * `'Participant'` throughout, exactly like `defaultActions()` above.
 */
export function decisionActions(): ActionDef[] {
  return [
    {
      actionKey: ACTION_KEEP_DINNER_PROMISE,
      displayName: 'Keep Dinner Promise',
      subject: PERSON_GLEN,
      subjectRole: 'Participant',
      preconditionHolds: () => true,
    },
    {
      actionKey: ACTION_STAY_AT_WORK,
      displayName: 'Stay At Work',
      subject: ACTIVITY_WORK,
      subjectRole: 'Participant',
      preconditionHolds: () => true,
    },
    {
      actionKey: ACTION_SPEAK_UP,
      displayName: 'Speak Up',
      subject: ACTIVITY_MEETING,
      subjectRole: 'Participant',
      preconditionHolds: () => true,
    },
    {
      actionKey: ACTION_STAY_QUIET,
      displayName: 'Stay Quiet',
      subject: ACTIVITY_CAUTION,
      subjectRole: 'Participant',
      preconditionHolds: () => true,
    },
  ];
}

export function decisionOutcomeTables(): Map<CanonicalActionKey, WorldOutcomeTable> {
  const m = new Map<CanonicalActionKey, WorldOutcomeTable>();
  m.set(ACTION_KEEP_DINNER_PROMISE, {
    actionKey: ACTION_KEEP_DINNER_PROMISE,
    effects: [{ needId: NEED_CONNECTION, magnitude: ratOf(2, 5), noiseHalfWidth: ratOf(1, 20) }], // 0.40 ± 0.05 — mirrors Visit Glen
  });
  m.set(ACTION_STAY_AT_WORK, {
    actionKey: ACTION_STAY_AT_WORK,
    effects: [{ needId: NEED_ACHIEVEMENT, magnitude: ratOf(2, 5), noiseHalfWidth: ratOf(1, 20) }], // 0.40 ± 0.05
  });
  m.set(ACTION_SPEAK_UP, {
    actionKey: ACTION_SPEAK_UP,
    effects: [
      { needId: NEED_RECOGNITION, magnitude: ratOf(2, 5), noiseHalfWidth: ratOf(1, 20) }, // 0.40 ± 0.05
      { needId: NEED_SECURITY, magnitude: ratOf(-1, 10), noiseHalfWidth: ratOf(1, 50) }, // -0.10 ± 0.02 — speaking up carries genuine risk
    ],
  });
  m.set(ACTION_STAY_QUIET, {
    actionKey: ACTION_STAY_QUIET,
    effects: [{ needId: NEED_SECURITY, magnitude: ratOf(1, 5), noiseHalfWidth: ratOf(1, 20) }], // 0.20 ± 0.05 — learned against ACTIVITY_CAUTION, Stay Quiet's own subject
  });
  return m;
}

export function defaultOutcomeTables(): Map<CanonicalActionKey, WorldOutcomeTable> {
  const m = new Map<CanonicalActionKey, WorldOutcomeTable>();
  m.set(ACTION_VISIT_GLEN, {
    actionKey: ACTION_VISIT_GLEN,
    effects: [
      { needId: NEED_CONNECTION, magnitude: ratOf(2, 5), noiseHalfWidth: ratOf(1, 20) }, // 0.40 ± 0.05
      { needId: NEED_REST, magnitude: ratOf(-1, 20), noiseHalfWidth: ratOf(1, 50) }, // -0.02 ± 0.02 (visiting is a little tiring)
    ],
  });
  m.set(ACTION_VISIT_PRIYA, {
    actionKey: ACTION_VISIT_PRIYA,
    effects: [
      { needId: NEED_CONNECTION, magnitude: ratOf(3, 20), noiseHalfWidth: ratOf(1, 20) }, // 0.15 ± 0.05 — weaker than Glen, initially
      { needId: NEED_REST, magnitude: ratOf(1, 50), noiseHalfWidth: ratOf(1, 100) }, // +0.02 — low-key, restful
    ],
  });
  m.set(ACTION_STAY_HOME, {
    actionKey: ACTION_STAY_HOME,
    effects: [{ needId: NEED_REST, magnitude: ratOf(1, 10), noiseHalfWidth: ratOf(1, 50) }], // +0.10 ± 0.02
  });
  m.set(ACTION_BETRAYAL_GLEN, betrayalOutcomeTable());
  return m;
}

export function defaultChoiceParams(): ChoiceParams {
  return { epsilon: ratOf(1, 2), gamma: 3 };
}

export function defaultExpectationParams(): NeedExpectationParams {
  return {
    lambdaQ: ratOf(1, 50), // slow passive precision decay
    rho0: ratOf(2),
    sigma: ratOf(1),
    rhoMin: ratOf(1, 10),
    rhoMax: ratOf(20),
    kC: ratOf(3),
  };
}

/**
 * θ_A = 0 and K_A = 3 (all three ordinary Actions) by default: Phase 2's
 * accessibility filter starts fully permissive so existing Phase-1
 * behavior and experiments are unaffected until a user (or a Phase-2
 * experiment) deliberately raises θ_A to see filtering take effect. β=0.5
 * is a middle-of-the-road spreading decay — high enough that a two-hop
 * path (Context → shared concept → Action) still contributes visibly.
 */
export function defaultActivationParams(): ActivationParams {
  return { beta: ratOf(1, 2), thetaA: ratOf(0), kA: 3 };
}

/** λ_a (atrophy) slower than η (learning) so a handful of repeated
 * co-activations visibly build an association before decay erodes it —
 * mirrors the same design intent as Connection's decay-vs-magnitude
 * tuning in defaultNeedDefs() above. */
export function defaultAssociationLearningParams(): AssociationLearningParams {
  return { lambdaA: ratOf(1, 20), eta: ratOf(3, 10) };
}

export function defaultMemoryParams(): MemoryCycleParams {
  return { lambdaM: ratOf(1, 10), dM: 1, omegaB: ratOf(7, 10), omegaA: ratOf(3, 10), retrievalK: 3 };
}

/**
 * Phase 2.5e — RE-BASELINED. `'censored'` (Phase 2.5a's one-sided update
 * rule, corrected in "Correction 2") is now CharacterLab's canonical
 * default: post-2.5d review classified Brief §24 DERIVED and closed Phase
 * 2.5, at which point running the *known-worse*, superseded `'naive'` rule
 * by default stopped being defensible as "the compatibility baseline" and
 * started being "the bug we already found and fixed, left switched on."
 * `'naive'` is not deleted — see `legacySaturationParams()` below — it is
 * retired from ordinary execution to an explicitly-named experimental
 * control, for exactly the comparisons (Brief §21/§22's sweep and
 * counterfactual) that need to show canonical-vs-superseded side by side.
 * κ=1/2 is unchanged: still an arbitrary, clearly-labeled placeholder for
 * the trace-only Experienced-Reward quantity; see RESEARCH.md's Phase
 * 2.5a entry for why no authored value is "the" right one yet.
 */
export function defaultSaturationParams(): SaturationParams {
  return { learningMode: 'censored', kappa: ratOf(1, 2) };
}

/**
 * Phase 2.5e — the RETIRED naive/pre-2.5a learning rule, kept alive under
 * its own name for exactly two purposes: (1) the required Brief §21/§22
 * experiments, which must still show what the superseded rule does so the
 * corrected rule's improvement stays demonstrable, not just asserted; and
 * (2) any future "canonical vs. FlatSalienceBaseline"-style control
 * comparison. Nothing in ordinary CharacterLab execution reaches for this
 * function anymore — `defaultSaturationParams()` above does.
 */
export function legacySaturationParams(): SaturationParams {
  return { learningMode: 'naive', kappa: ratOf(1, 2) };
}

/** Phase 2.5b default: `budgetMode: 'independent'` (Brief §12 Model A) is
 * the simplest starting hypothesis — no shared-budget competition, so no
 * `budget`/`hybridThreshold` tuning is needed to get a first result.
 * αN=αS=1 give Need relevance and surprise equal, unscaled weight in the
 * §11 raw-salience product. All arbitrary, clearly-labeled placeholders —
 * see RESEARCH.md's Phase 2.5b entry for what varying them changes. This
 * table is consulted only when `salienceMode: 'derived'` — Phase 2.5e's
 * canonical default, see `defaultCycleParams` below — is also set. */
export function defaultSalienceParams(): SalienceParams {
  return { alphaN: ratOf(1), alphaS: ratOf(1), budgetMode: 'independent', budget: ratOf(1), hybridThreshold: ratOf(1, 2) };
}

/**
 * Phase 2.5e — RE-BASELINED. `salienceMode: 'derived'` (Phase 2.5b/c's
 * fully-mechanical causal-role/attention/evidence-aware-surprise pipeline)
 * is now CharacterLab's canonical default, alongside `'censored'` learning
 * above — together, "the canonical CharacterLab model" this phase
 * consolidates Phases 0-2.5d's surviving findings into (see RESEARCH.md's
 * Phase 2.5e entry for the full pipeline diagram and the historical-finding
 * re-baseline this default change required). `'legacy'` (flat co-activation
 * weight 1.0 for every engaged concept, hand-authored-input-shaped
 * WorldEventDescriptor) is retired from ordinary execution the same way
 * `'naive'` is — not deleted, kept as `legacyCycleParams()`'s identity, for
 * exactly the same two reasons: required historical-baseline comparisons,
 * and any future FlatSalienceBaseline-style control condition.
 */
export function defaultCycleParams(): CycleParams {
  return {
    deltaT: ratOf(1),
    choice: defaultChoiceParams(),
    expectation: defaultExpectationParams(),
    activation: defaultActivationParams(),
    associationLearning: defaultAssociationLearningParams(),
    memoryParams: defaultMemoryParams(),
    saturation: defaultSaturationParams(),
    salienceMode: 'derived',
    salience: defaultSalienceParams(),
    // Phase 2.9 — present on every CycleParams value regardless of mode
    // (mirrors saturation/salience already being unconditionally present):
    // `runAutonomousCycle`/`runScriptedExperience` never read `.decision`,
    // exactly as they never read `.salience` when salienceMode is 'legacy'.
    decision: defaultDecisionParams(),
  };
}

/**
 * Phase 2.5e — the RETIRED flat/naive baseline, bundled as one named
 * `CycleParams` identity so a comparison experiment can request "the old
 * architecture" in one call rather than hand-assembling the override. This
 * reproduces every Phase 0-2.5a finding byte-for-byte (the dual-mode
 * compatibility contract Phases 2.5a-c were built under) — it is what
 * "CharacterLab's behavior" meant before Phase 2.5e's re-baseline, and
 * stays available under this name for exactly that historical-comparison
 * role, not as a co-equal way to run CharacterLab day to day.
 */
export function legacyCycleParams(): CycleParams {
  return { ...defaultCycleParams(), saturation: legacySaturationParams(), salienceMode: 'legacy' };
}

/**
 * Phase 2.9 — die-scale thresholds, resolution-mode thresholds, and
 * trait-consolidation constants for `runDecisionCycle`. Research knobs, not
 * final balance, exactly like every other `default*Params` function in this
 * file. Thresholds are stated directly against `|signedStrength| ∈ (0,1)`
 * (Rational.boundedResponse's range), so "weak" through "extreme" partition
 * that interval into five bands per Brief §8's illustrative reference
 * scale. `thetaTrait`/`thetaConfidence`/`kI`/`kC` match the values already
 * exercised directly in `test/phase2_9Identity.test.ts`'s consolidation
 * cases.
 */
export function defaultDecisionParams(): DecisionParams {
  return {
    dieScale: {
      weak: ratOf(1, 10), // 0.10
      moderate: ratOf(1, 4), // 0.25
      strong: ratOf(9, 20), // 0.45
      veryStrong: ratOf(13, 20), // 0.65
      extreme: ratOf(17, 20), // 0.85
    },
    thetaRoll: ratOf(3, 10), // θ_roll = 0.30 — Contest below this auto-resolves
    thetaPlayer: ratOf(3, 10), // θ_player = 0.30 — AuthorshipPotential at/above this is player-facing
    thetaTrait: ratOf(3, 10), // θ_trait = 0.30
    thetaConfidence: ratOf(1, 2), // θ_confidence = 0.50
    kI: ratOf(2), // K_I = 2
    kC: ratOf(2), // K_C = 2
    identityFeedbackEnabled: true,
  };
}

/**
 * Phase 2.95 — the one authored polarity table (identity.ts's module
 * comment: a category/role-style table, authored once, globally, never
 * re-tuned per named entity), keyed by SEMANTIC reason channel rather than
 * raw NeedId — the only shape that makes sense once every raw Need/
 * accessibility/identity pressure is unconditionally consolidated into a
 * semantic channel before Alignment ever sees it (there is no longer a
 * "final DecisionInfluence" carrying a raw NeedId reasonChannel for a
 * polarity table to key against). Supersedes Phase 2.9's original
 * `defaultReasonChannelPolarity()` (removed — a raw-NeedId-keyed table has
 * no surviving consumer under Phase 2.95's consolidation pipeline). Each
 * semantic channel expresses through the identity channels that feed into
 * it (e.g., 'commitment' expresses through CommitmentFidelity and
 * RuleAdherence since both map to the commitment channel, per
 * `defaultReasonChannelMapping()` below). `identity_consistency`-sourced
 * pressure is deliberately never a KEY in this table (it is tagged
 * `identity:<channel>` and consolidated INTO a semantic channel by
 * `cycle.ts`, not treated as its own semantic channel) — the anti-double-
 * counting design identity.ts documents in detail.
 */
export function defaultSemanticReasonPolarity(): ReasonChannelPolarityTable {
  return {
    // 'commitment' channel: Connection need + CommitmentFidelity/RuleAdherence identities
    'commitment': { CommitmentFidelity: 1, RuleAdherence: 1 },

    // 'recognition' channel: Recognition need + RiskAcceptance/NoveltySeeking identities
    'recognition': { RiskAcceptance: 1, NoveltySeeking: 1 },

    // 'caretaking' channel: Caregiving and SelfSacrifice identities
    'caretaking': { Caregiving: 1, SelfSacrifice: 1 },

    // 'autonomy' channel: Security need + AuthorityDefiance/SelfProtection identities
    'autonomy': { AuthorityDefiance: 1, SelfProtection: 1 },

    // 'energetic' channel: Achievement/Rest + WorkPersistence identity
    'energetic': { WorkPersistence: 1 },

    // 'affiliation' channel: SocialApproach identity
    'affiliation': { SocialApproach: 1 },
  };
}

/**
 * Phase 2.95 — map from raw reason sources (Need IDs, identity channels,
 * accessibility) to semantic reason channels. Multiple weak signals mapping to
 * the same semantic channel will consolidate BEFORE the die floor, allowing
 * them to combine meaningfully rather than disappearing individually.
 *
 * This mapping is scenario-content: what a particular scenario's narrative
 * means by "commitment" (which needs/identities feed into it) is a choice
 * that can vary. This default version maps:
 *
 * - Connection need + Dependable/CommitmentFidelity → 'commitment' channel
 * - Achievement need + WorkPersistence → 'energetic' channel
 * - Recognition need + RiskAcceptance → 'recognition' channel
 * - Caregiving identity → 'caretaking' channel
 * - AuthorityDefiance identity → 'autonomy' channel
 * - Accessibility (general feasibility) → 'energetic' channel (feasibility supports effort)
 *
 * Not mapped (are not part of any semantic reason):
 * - identity_consistency itself (it's a derived, not raw, source — mapped by identity.ts)
 */
export function defaultReasonChannelMapping(): ReadonlyMap<string, SemanticReasonChannelId> {
  return new Map([
    // Needs map to primary semantic channels
    ['need.connection', 'commitment'],
    ['need.achievement', 'energetic'],
    ['need.recognition', 'recognition'],
    ['need.security', 'autonomy'],
    ['need.rest', 'energetic'],
    ['need.novelty', 'autonomy'],

    // Identity expression channels (used during feedback) map to semantic reasons
    // These will be prefixed when called from cycle.ts so we can distinguish raw from identity-sourced
    ['identity:CommitmentFidelity', 'commitment'],
    ['identity:WorkPersistence', 'energetic'],
    ['identity:RiskAcceptance', 'recognition'],
    ['identity:SelfProtection', 'autonomy'],
    ['identity:Caregiving', 'caretaking'],
    ['identity:AuthorityDefiance', 'autonomy'],
    ['identity:NoveltySeeking', 'recognition'],
    ['identity:SocialApproach', 'affiliation'],
    ['identity:SelfSacrifice', 'caretaking'],
    ['identity:RuleAdherence', 'commitment'],

    // Accessibility (general competence/feasibility) supports energetic pursuits
    ['accessibility', 'energetic'],
  ]);
}

/** Phase 2.9 — `defaultCycleParams()` already carries `decision:
 * defaultDecisionParams()` (every `CycleParams` value does, regardless of
 * mode — see its own comment); this alias just names the fact that the
 * SAME `CycleParams` value runs both ordinary and Decision cycles over one
 * shared `CharacterState`/associative graph (Brief §41), for experiment/UI
 * call sites that want to say so explicitly. */
export function defaultDecisionCycleParams(): CycleParams {
  return defaultCycleParams();
}

/** Phase 2.9 — the dinner-vs-work Decision (Brief §36's own worked trace
 * example): `Option`s are 1:1 backed by `ACTION_KEEP_DINNER_PROMISE` /
 * `ACTION_STAY_AT_WORK` (plan scoping decision 5 — an Option's identity IS
 * its `actionDef.actionKey`). `decisionId` reuses whatever `SimEvent.eventId`
 * the caller's `clock.emit`/`EventClock` produces for this Decision — callers
 * constructing a `Decision` value directly (as every experiment file does,
 * ahead of calling `runDecisionCycle`) supply a stable string of their own
 * choosing instead. */
export function dinnerVsWorkDecision(decisionId: string): Decision {
  const actions = decisionActions();
  const keepDinner = actions.find((a) => a.actionKey === ACTION_KEEP_DINNER_PROMISE)!;
  const stayAtWork = actions.find((a) => a.actionKey === ACTION_STAY_AT_WORK)!;
  const options: Option[] = [{ actionDef: keepDinner }, { actionDef: stayAtWork }];
  return { decisionId, actor: PERSON_MINA, options };
}

/** Phase 2.9 — the second, independent speak-up-vs-stay-quiet Decision axis
 * (see the Decision axis constants' doc comment above). */
export function speakUpVsStayQuietDecision(decisionId: string): Decision {
  const actions = decisionActions();
  const speakUp = actions.find((a) => a.actionKey === ACTION_SPEAK_UP)!;
  const stayQuiet = actions.find((a) => a.actionKey === ACTION_STAY_QUIET)!;
  const options: Option[] = [{ actionDef: speakUp }, { actionDef: stayQuiet }];
  return { decisionId, actor: PERSON_MINA, options };
}

/** Phase 2.9 — an ad-hoc Decision recombining one Option from EACH
 * independent axis (Keep Dinner's CommitmentFidelity vs Speak Up's
 * RiskAcceptance, by default) — used only by Experiment I (identity fault
 * line, experiments/identityFormation.ts): once both axes have separately
 * built a strong, opposing identity, this Decision is the first place both
 * identity-consistency pressures compete on the SAME two Options. Nothing
 * new is authored for this — it simply reuses two existing ActionDefs as a
 * fresh Decision, exactly per plan scoping decision 5 (Option identity IS
 * its ActionDef's actionKey; a Decision is nothing more than a named set of
 * such Options). */
export function crossAxisFaultLineDecision(
  decisionId: string,
  optionA: CanonicalActionKey = ACTION_KEEP_DINNER_PROMISE,
  optionB: CanonicalActionKey = ACTION_SPEAK_UP,
): Decision {
  const actions = decisionActions();
  const a = actions.find((act) => act.actionKey === optionA)!;
  const b = actions.find((act) => act.actionKey === optionB)!;
  return { decisionId, actor: PERSON_MINA, options: [{ actionDef: a }, { actionDef: b }] };
}

/**
 * Phase 2.9 — a character-state factory analogous to `defaultScenario()`/
 * `createInitialCharacterState()`, but over `allDecisionNeedDefs()` and the
 * full concept universe (Decision axes included), with Need levels and
 * seeded NeedExpectations chosen so BOTH Decision axes start genuinely
 * contested (near-50/50, Brief §36's own worked example) rather than one
 * side winning by construction — individual experiments then move levels/
 * priors from this baseline to land in whichever Auto/Quiet/Player-facing
 * regime each one specifically needs (mirroring
 * `saturationSalienceInteraction.ts`'s `priorOverride`-from-a-shared-baseline
 * pattern). All four Decision-axis subjects need an explicitly seeded
 * NeedExpectation before first use: unlike Glen/Priya (which existing
 * Phase-1 experiments learn live), `ACTIVITY_WORK`/`ACTIVITY_MEETING` are
 * brand-new subjects with no learning history, and an unseeded (μ=0,τ=0)
 * subject contributes exactly 0 to Score(a) (expectation.ts's own
 * documented kernel property) — silently forcing every Decision Option to
 * rely on accessibility/identity alone, which is not what any experiment
 * here intends to test.
 */
export function defaultDecisionScenario(seed = 'characterlab-decision-seed'): CharacterState {
  const needDefs = allDecisionNeedDefs();
  const initialLevels = new Map<NeedId, Rational>([
    [NEED_CONNECTION, ratOf(1, 2)],
    [NEED_REST, ratOf(6, 10)],
    [NEED_ACHIEVEMENT, ratOf(1, 2)],
    [NEED_RECOGNITION, ratOf(1, 2)],
    [NEED_SECURITY, ratOf(6, 10)],
  ]);
  let state = createCharacter(PERSON_MINA, needDefs, initialLevels, conceptUniverse());
  // Seed a moderate, roughly comparable NeedExpectation for every
  // Decision-axis subject — a stand-in for "Mina has done each of these
  // before and has a rough sense of what each one is worth," exactly the
  // role `withExpectation` already plays in saturationSalienceInteraction.ts.
  state = withExpectation(state, PERSON_GLEN, NEED_CONNECTION, { ...initialExpectation(0), mu: ratOf(2, 5), tau: ratOf(3) });
  state = withExpectation(state, ACTIVITY_WORK, NEED_ACHIEVEMENT, { ...initialExpectation(0), mu: ratOf(2, 5), tau: ratOf(3) });
  state = withExpectation(state, ACTIVITY_MEETING, NEED_RECOGNITION, { ...initialExpectation(0), mu: ratOf(2, 5), tau: ratOf(3) });
  state = withExpectation(state, ACTIVITY_CAUTION, NEED_SECURITY, { ...initialExpectation(0), mu: ratOf(1, 5), tau: ratOf(3) });
  return state;
}

export function defaultScenario(seed = 'characterlab-default-seed'): ScenarioConfig {
  return {
    seed,
    needDefs: defaultNeedDefs(),
    actions: defaultActions(),
    outcomeTables: defaultOutcomeTables(),
    cycleParams: defaultCycleParams(),
  };
}

export function createInitialCharacterState(config: ScenarioConfig): CharacterState {
  const initialLevels = new Map<NeedId, Rational>([
    [NEED_CONNECTION, ratOf(1, 2)], // starts moderately unsatisfied
    [NEED_REST, ratOf(6, 10)],
  ]);
  return createCharacter(PERSON_MINA, config.needDefs, initialLevels, conceptUniverse());
}

/** Every ordinary Experience in this scenario happens at home; "evening"
 * is the one Context concept a user/experiment can toggle on or off (the
 * Habit experiment's Context → Action association target). */
export function defaultExperienceContext(eveningActive: boolean): ExperienceContext {
  return { activeConcepts: eveningActive ? new Set([CONTEXT_EVENING]) : new Set(), location: LOCATION_HOME };
}

export function defaultWorldFlags(): Set<string> {
  return new Set([WORLD_FLAG_GLEN_AVAILABLE, WORLD_FLAG_PRIYA_AVAILABLE]);
}

export function createEventClock(): EventClock {
  return new EventClock();
}
