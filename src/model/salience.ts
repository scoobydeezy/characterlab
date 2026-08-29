/**
 * Semantic Salience, per Brief §4-14, §25-27 — Phase 2.5b, corrected and
 * completed by Phase 2.5c ("Experience Interpretation").
 *
 * Phase 2's RESEARCH.md finding: `W[context.evening][action.visit_glen]`
 * caps at exactly 1/2 because `cycle.ts` currently tags every Experience's
 * concepts with a flat co-activation weight of 1.0 and lets them compete
 * for the same row-substochastic budget. That flat-1.0 tagging is an
 * authoring artifact of the code, not a deliberate psychological claim —
 * this module is CharacterLab's answer to "what should that weight
 * actually be, derived from general rules instead of hand-authored per
 * scenario?" (Brief §5.1: "The system must not require authored
 * instructions such as 'Glen = 0.92, Bakery = 0.24, Lamp = 0.03'.")
 *
 * The pipeline (Brief §25): a WORLD EVENT is PERCEIVED (hard 0/1 gate) and
 * ATTENDED (continuous strength, now itself derived — see "Attention" below);
 * perceived-and-attended concepts get a baseline encoding prior from their
 * ontological CATEGORY and a strongly-modulating weight from their CAUSAL
 * ROLE in this specific event (Brief §7: "The same Object category must be
 * capable of receiving dramatically different salience because its causal
 * role changed" — a Table that is merely Incidental at dinner versus the
 * Cause of a fall); NEED RELEVANCE and evidence-aware SURPRISE (see below)
 * further modulate the result; a SALIENCE BUDGET model turns the raw scores
 * into final per-concept encoding strengths z_i, which replace cycle.ts's
 * flat 1.0 as the co-activation signal fed to
 * `associations.ts::updateAssociations`.
 *
 * PHASE 2.5C — "Experience Interpretation" — three corrections from
 * post-2.5b review, all reflected in this file:
 *
 * 1. **Causal role now derives mechanically from `EffectProvenance`, not
 *    from a hand-authored role on each concept.** 2.5b's `WorldEventDescriptor`
 *    still required whoever wrote a scenario to directly assign, say, "Lamp
 *    = Cause" — legitimate as far as it went (Brief §5.1 permits authoring
 *    causal roles), but too easy to mistake for solving "a raw world event
 *    derives its own tags," when what had actually been solved was "a
 *    semantically pre-described event derives its own weights." The fix:
 *    describe what physically/causally happened (`EffectProvenance` — who
 *    acted, on whom, with what, where, what actually caused the observed
 *    effect) and mechanically derive every concept's role from that via
 *    `deriveWorldEventDescriptor` — the one and only place a CausalRole is
 *    assigned. An Action definition (`model/actions.ts::ActionDef.subjectRole`)
 *    declares which grammatical/semantic role its subject plays (Conversation
 *    → Participant, Attack → Target) exactly the way a verb has an argument
 *    structure — semantics, not psychological weight (Brief §5.1's own
 *    distinction) — and `cycle.ts` reads that to build the ordinary-Experience
 *    provenance instead of hardcoding "subject → Target."
 * 2. **Attention is now fully derived, not authored per concept.** 2.5b's
 *    `unattended: true` flag proved perception ≠ attention (a real, useful
 *    finding, kept) but was itself an authored toggle — moving the
 *    hand-authoring problem from "Lamp salience = .02" to "Lamp unattended =
 *    true" rather than eliminating it. Non-Incidental roles keep their fixed
 *    `DEFAULT_ATTENTION_BY_ROLE` value (a first bounded deterministic model —
 *    "direct target/cause automatically attended... active participant
 *    strongly attended"); Incidental-role concepts now DERIVE their
 *    attention by splitting a fixed residual pool among however many
 *    Incidental concepts this Experience actually has — "Incidental
 *    perceived competes for residual attention" is now a computation, not a
 *    flag any caller sets.
 * 3. **Surprise now consumes evidence semantics, not a raw clipped delta.**
 *    2.5b computed surprise as |r-μ| even when r was Applied, a
 *    boundary-clipped observation — exactly the epistemic mistake Phase 2.5a
 *    identified for LEARNING, now shown to leak into SALIENCE too: a
 *    saturated, uninformative observation could read as "wildly surprising"
 *    purely because the boundary clipped it far from μ, inflating an event's
 *    salience for no real reason. `SurpriseEvidence`/`surpriseMagnitude` fix
 *    this by branching on the SAME `EvidenceKind` Phase 2.5a's
 *    `expectation.ts` already defines: a `'point'` observation still uses
 *    |r-μ|; a `'lower_bound'` observation (true effect ≥ L) uses
 *    `max(0, L-μ)` — "did the evidence prove something incompatible with my
 *    belief," not "how far is a censored number from my point estimate";
 *    `'upper_bound'` is the mirror, `max(0, μ-U)`. Need relevance is
 *    deliberately UNCHANGED — it still uses the Need's realized regulatory
 *    effect (Brief §9's own framing: "how much did this matter to the Need I
 *    was experiencing," a question the censoring critique does not touch,
 *    since even a small realized change is a genuine fact about how much
 *    that Need was regulated, censored or not).
 *
 * What is authored here (global, fixed, one-time tables: BASE_SALIENCE by
 * ConceptCategory, ROLE_WEIGHT by CausalRole, DEFAULT_ATTENTION_BY_ROLE)
 * versus what must never be authored (a named entity's own psychological
 * weight, e.g. "Glen = 0.92") is the exact line Brief §5.1 draws. Every
 * number below is a category- or role-level prior, applied identically
 * regardless of which specific Person/Object/Location fills that role —
 * "Category is a prior. Context [i.e. causal role] determines the
 * event-specific result" (Brief §6).
 */

import { Rational, ratOf } from '../kernel/rational';
import { ConceptKey, NeedId, compareCanonical } from '../kernel/canonical';
import { ConceptCategory } from './types';
import { EvidenceKind } from './expectation';

// ---------------------------------------------------------------------------
// Causal role (Brief §7)
// ---------------------------------------------------------------------------

export type CausalRole =
  | 'Actor'
  | 'Target'
  | 'Recipient'
  | 'Instrument'
  | 'Cause'
  | 'AffectedEntity'
  | 'Participant'
  | 'Location'
  | 'Context'
  | 'Incidental';

/**
 * R_i = RoleWeight(Role_i) — Brief §7. A concept's causal involvement in
 * THIS event, independent of what kind of thing it ontologically is.
 * Ordered so that "actually drove the outcome" (Actor/Cause) dominates,
 * "was acted upon" (Target/AffectedEntity/Recipient) is high,
 * "was used but didn't act" (Instrument) is high-medium, "was merely
 * present" (Participant/Location/Context) is low, and "had nothing to do
 * with it" (Incidental) is lowest — this is what lets the exact same
 * Table concept swing from negligible (Incidental, an ordinary dinner) to
 * dominant (Cause, Mina trips over it) without ever touching a
 * Table-specific number (Brief §7's worked example).
 */
export const ROLE_WEIGHT: Readonly<Record<CausalRole, Rational>> = {
  Actor: ratOf(1, 1),
  Cause: ratOf(1, 1),
  AffectedEntity: ratOf(9, 10),
  Target: ratOf(9, 10),
  Recipient: ratOf(4, 5),
  Instrument: ratOf(7, 10),
  Participant: ratOf(3, 5),
  Location: ratOf(2, 5),
  Context: ratOf(1, 5),
  Incidental: ratOf(1, 10),
};

/**
 * Default attention strength by role (Brief §8's "attention may be
 * derived from... direct participation... causal relevance" — a
 * deterministic default, not a per-scenario tuning). Every role except
 * `Incidental` uses this fixed value directly. `Incidental` is handled
 * specially by `deriveAttention` below (Phase 2.5c point 2): this table's
 * `Incidental` entry is the TOTAL residual pool incidental concepts split
 * between them, not a per-concept value — "Incidental perceived competes
 * for residual attention," now a computation rather than an authored flag.
 */
export const DEFAULT_ATTENTION_BY_ROLE: Readonly<Record<CausalRole, Rational>> = {
  Actor: ratOf(1, 1),
  Cause: ratOf(1, 1),
  AffectedEntity: ratOf(9, 10),
  Target: ratOf(9, 10),
  Recipient: ratOf(4, 5),
  Instrument: ratOf(4, 5),
  Participant: ratOf(3, 5),
  Location: ratOf(3, 5),
  Context: ratOf(2, 5),
  Incidental: ratOf(1, 5),
};

/**
 * Derive each perceived concept's attention A_i (Phase 2.5c point 2). Every
 * non-Incidental role gets its fixed `DEFAULT_ATTENTION_BY_ROLE` value.
 * Incidental-role concepts split that same table's `Incidental` entry
 * evenly among however many Incidental concepts this Experience actually
 * has — one incidental object gets the whole pool, three share it three
 * ways — so a cluttered scene deterministically dilutes each background
 * object's attention without any caller marking anything "unattended."
 * An unperceived concept's attention is irrelevant (its z is pinned to 0
 * elsewhere) and is reported as 0 here for consistency.
 */
function deriveAttention(perceived: readonly PerceivedConcept[]): Map<ConceptKey, Rational> {
  const attention = new Map<ConceptKey, Rational>();
  const incidental = perceived.filter((p) => p.perceived && p.role === 'Incidental');
  const incidentalShare = incidental.length === 0 ? Rational.ZERO : DEFAULT_ATTENTION_BY_ROLE.Incidental.div(ratOf(incidental.length));
  for (const p of perceived) {
    if (!p.perceived) {
      attention.set(p.concept, Rational.ZERO);
      continue;
    }
    attention.set(p.concept, p.role === 'Incidental' ? incidentalShare : DEFAULT_ATTENTION_BY_ROLE[p.role]);
  }
  return attention;
}

// ---------------------------------------------------------------------------
// Category prior (Brief §6)
// ---------------------------------------------------------------------------

/**
 * B_i = BaseSalience(Category_i) — Brief §6's illustrative ordering
 * ("direct Action/target high... instrument medium-high... location
 * medium-low... passive object low... ambient context very low") mapped
 * onto CharacterLab's existing `ConceptCategory` union (model/types.ts,
 * declared in Phase 1, instantiated for the first time in Phase 2.5b).
 * "Exact values are an experimental parameter" (Brief §6) — these are a
 * starting hypothesis, re-runnable from the UI, not a claimed final answer.
 */
export const BASE_SALIENCE: Readonly<Record<ConceptCategory, Rational>> = {
  Action: ratOf(9, 10),
  Activity: ratOf(9, 10),
  Person: ratOf(4, 5),
  OutcomeConcept: ratOf(1, 2),
  Need: ratOf(1, 2),
  Location: ratOf(2, 5),
  Object: ratOf(3, 10),
  ValueConcept: ratOf(3, 10),
  TraitConcept: ratOf(3, 10),
  MemoryEpisode: ratOf(1, 5),
  Context: ratOf(1, 10),
};

/**
 * Derive a concept's ontological category from its own `namespace.slug`
 * identity (kernel/canonical.ts's branding contract) rather than from a
 * scenario-authored lookup table keyed by the specific concept — e.g.
 * `person.glen` and `person.priya` both resolve to `'Person'` via the
 * SAME rule, with no per-name entry anywhere. This is what makes category
 * assignment itself "no scenario-specific psychological weights"
 * (Brief §5.1): the rule is a fixed function of the namespace, not a
 * per-concept authored fact.
 */
export function categoryFromConceptKey(key: ConceptKey): ConceptCategory {
  const namespace = key.split('.')[0];
  switch (namespace) {
    case 'need':
      return 'Need';
    case 'person':
      return 'Person';
    case 'activity':
      return 'Activity';
    case 'action':
      return 'Action';
    case 'location':
      return 'Location';
    case 'context':
      return 'Context';
    case 'object':
      return 'Object';
    case 'value':
      return 'ValueConcept';
    case 'trait':
      return 'TraitConcept';
    case 'outcome':
      return 'OutcomeConcept';
    case 'memory':
      return 'MemoryEpisode';
    default:
      throw new RangeError(`categoryFromConceptKey: unrecognized namespace "${namespace}" in concept "${key}"`);
  }
}

// ---------------------------------------------------------------------------
// Perception and the world-event descriptor (Brief §4, §8)
// ---------------------------------------------------------------------------

/**
 * One concept as it was perceptually available to the character in a
 * WorldEventDescriptor (Brief §4's "Perceived Event"). `perceived` is the
 * hard P_i∈{0,1} gate (§8) — `perceived: false` structurally forces
 * z_i = 0 in `computeSemanticSalience` regardless of category, role, or
 * anything else (§27's Perception Exclusion obligation). Authoring
 * *perceptibility* is explicitly permitted by Brief §5.1 ("Scenario authors
 * may author... perceptibility"); authoring *attention* is not (Phase 2.5c
 * point 2) — this type intentionally has no attention field. The only
 * legitimate way to produce a `PerceivedConcept` is `deriveWorldEventDescriptor`
 * below, which assigns `role` mechanically from `EffectProvenance`.
 */
export interface PerceivedConcept {
  readonly concept: ConceptKey;
  readonly category: ConceptCategory;
  readonly role: CausalRole;
  readonly perceived: boolean;
}

/** Brief §4's "Perceived Event" — everything the character's Experience
 * this cycle makes available for semantic encoding. */
export interface WorldEventDescriptor {
  readonly perceived: readonly PerceivedConcept[];
}

/**
 * EffectProvenance (Phase 2.5c point 1) — what the simulator itself already
 * knows about how an Experience's effect came about, since it executed the
 * causal chain: "Lamp falls → hits Mina → Injury +0.4" is not a mystery the
 * character has to infer, it is the outcome system's own record of what it
 * just ran. Every named slot below maps onto exactly one `CausalRole`
 * (`ROLE_SLOTS`) — this is the ONLY vocabulary through which a role may be
 * assigned; nothing else in this codebase hand-sets a `PerceivedConcept.role`.
 *
 * `cause` is deliberately separate from `sourceAction`: the Action concept
 * itself (`sourceAction`, e.g. `action.lamp_falls`) is always the event's
 * mechanism and always gets `'Cause'`, but the physically/causally
 * responsible ENTITY within that action (e.g. `object.lamp`, or a hazardous
 * `location.bakery`) is a separate concept that also deserves `'Cause'` —
 * both can be true at once, and both are salient for the same reason.
 * `incidentalConcepts` names concepts that were part of the scene but that
 * provenance does NOT implicate in anything — the honest way to describe
 * "a lamp happened to be on the table," as a fact about the scene, not a
 * salience judgment.
 */
export interface EffectProvenance {
  readonly sourceAction: ConceptKey;
  readonly actor?: ConceptKey;
  readonly target?: ConceptKey;
  readonly recipient?: ConceptKey;
  readonly instrument?: ConceptKey;
  readonly cause?: ConceptKey;
  readonly affectedEntity?: ConceptKey;
  readonly location?: ConceptKey;
  readonly participants?: readonly ConceptKey[];
  readonly incidentalConcepts?: readonly ConceptKey[];
  readonly activeContext?: ReadonlySet<ConceptKey>;
  /** Perceptibility is the one thing a caller may still author per concept
   * (Brief §5.1) — e.g. "the Painting was never in Mina's field of view."
   * Every named concept defaults to perceived; list only the exceptions. */
  readonly perceptionOverrides?: ReadonlyMap<ConceptKey, boolean>;
}

const ROLE_SLOTS: ReadonlyArray<{ field: keyof EffectProvenance; role: CausalRole; multi: boolean }> = [
  { field: 'sourceAction', role: 'Cause', multi: false },
  { field: 'cause', role: 'Cause', multi: false },
  { field: 'actor', role: 'Actor', multi: false },
  { field: 'target', role: 'Target', multi: false },
  { field: 'recipient', role: 'Recipient', multi: false },
  { field: 'instrument', role: 'Instrument', multi: false },
  { field: 'affectedEntity', role: 'AffectedEntity', multi: false },
  { field: 'location', role: 'Location', multi: false },
  { field: 'participants', role: 'Participant', multi: true },
  { field: 'incidentalConcepts', role: 'Incidental', multi: true },
];

/**
 * The ONLY function in this codebase that assigns a `CausalRole` to a
 * concept — every role comes mechanically from which `EffectProvenance`
 * slot named that concept (Phase 2.5c point 1). A concept named by an
 * earlier-processed slot keeps that role even if a later slot also
 * mentions it (e.g. `sourceAction`/`cause` both map to `'Cause'` anyway;
 * a concept cannot fill two slots at once in practice, but first-wins is
 * the deterministic tie-break if it ever happens).
 */
export function deriveWorldEventDescriptor(provenance: EffectProvenance, categoryOf: (key: ConceptKey) => ConceptCategory = categoryFromConceptKey): WorldEventDescriptor {
  const perceived: PerceivedConcept[] = [];
  const seen = new Set<ConceptKey>();
  const add = (concept: ConceptKey, role: CausalRole) => {
    if (seen.has(concept)) return;
    seen.add(concept);
    const isPerceived = provenance.perceptionOverrides?.get(concept) ?? true;
    perceived.push({ concept, category: categoryOf(concept), role, perceived: isPerceived });
  };
  for (const c of provenance.activeContext ?? []) add(c, 'Context');
  for (const slot of ROLE_SLOTS) {
    const value = provenance[slot.field];
    if (!value) continue;
    if (slot.multi) {
      for (const c of value as readonly ConceptKey[]) add(c, slot.role);
    } else {
      add(value as ConceptKey, slot.role);
    }
  }
  return { perceived };
}

/**
 * A concept is causally connected to this Experience's Need outcome iff
 * `EffectProvenance` named it in any role slot OTHER than Location/
 * Context/Incidental — i.e. it was part of what happened, not merely
 * where it happened, what was in the air, or unrelated scenery (Phase
 * 2.5c point 1). This deliberately includes `Participant`: an ordinary
 * conversation partner ("Talk with Glen" → Glen is `Participant`, per
 * `ActionDef.subjectRole`) is very much implicated in why a Need moved,
 * even though he did not "cause" anything in the dramatic sense a falling
 * Lamp does.
 */
export function causallyConnectedFromProvenance(provenance: EffectProvenance): ReadonlySet<ConceptKey> {
  const s = new Set<ConceptKey>([provenance.sourceAction]);
  if (provenance.cause) s.add(provenance.cause);
  if (provenance.actor) s.add(provenance.actor);
  if (provenance.target) s.add(provenance.target);
  if (provenance.recipient) s.add(provenance.recipient);
  if (provenance.instrument) s.add(provenance.instrument);
  if (provenance.affectedEntity) s.add(provenance.affectedEntity);
  for (const p of provenance.participants ?? []) s.add(p);
  return s;
}

/**
 * Maps an `ActionDef.subjectRole` (the Action's own authored semantic verb-
 * argument structure — Phase 2.5c point 1) onto the correct `EffectProvenance`
 * slot for that Action's `subject` concept. This is the single place that
 * translates "this Action binds its subject as role X" into "therefore put
 * the subject concept in provenance field Y" — kept here, next to `ROLE_SLOTS`
 * and `EffectProvenance` themselves, rather than duplicated at each call site
 * (currently only `cycle.ts`'s ordinary-Experience provenance construction).
 * `Location`/`Context`/`Incidental` are not meaningful bindings for an
 * Action's own subject (a subject is a participant in the action, never
 * merely the scenery it occurred in or ambient background), so they fall
 * back to `Participant` — the same "present and implicated, nothing more
 * specific claimed" reading `ActionDef.subjectRole` documents as its own
 * default for ordinary Conversation-like Actions.
 */
export function subjectRoleSlot(role: CausalRole, concept: ConceptKey): Partial<EffectProvenance> {
  switch (role) {
    case 'Actor':
      return { actor: concept };
    case 'Target':
      return { target: concept };
    case 'Recipient':
      return { recipient: concept };
    case 'Instrument':
      return { instrument: concept };
    case 'Cause':
      return { cause: concept };
    case 'AffectedEntity':
      return { affectedEntity: concept };
    case 'Participant':
    case 'Location':
    case 'Context':
    case 'Incidental':
    default:
      return { participants: [concept] };
  }
}

// ---------------------------------------------------------------------------
// Need relevance (Brief §9) — unchanged by Phase 2.5c (see module doc point 3)
// ---------------------------------------------------------------------------

export interface NeedImpact {
  readonly needId: NeedId;
  /** r_n = L_n(after) - L_n(before) — the REALIZED regulatory effect,
   * signed; magnitude is what matters for relevance (Brief §9 lists
   * "whether positive or negative" only as a *possible* determinant, not a
   * required one — a large loss and a large gain are both highly
   * Need-relevant, so this module weighs them symmetrically by |delta| and
   * documents the simplification here). Deliberately the REALIZED
   * (possibly boundary-clipped) effect, not an efficacy estimate: "how
   * much did this matter to the Need I was experiencing" is a true
   * question about what was regulated, unaffected by whether the
   * observation also under-measures the satisfier's general capability
   * (that is Surprise's/NeedExpectation's concern, not this one's — see
   * module doc point 3). */
  readonly delta: Rational;
  /** U_n — this Need's urgency at the time of the Experience (already
   * computed by cycle.ts's needUrgency; reused, not recomputed). */
  readonly urgency: Rational;
}

/**
 * N_i = NeedRelevance(i, Experience) — Brief §9. Nonzero only for
 * concepts the caller has identified as causally connected to the Need
 * outcome (`causallyConnectedFromProvenance`) — a concept that merely
 * shared the room with a Need-satisfying interaction is not thereby
 * "implicated in a currently important Need outcome." Bounded via the
 * existing `Rational.boundedResponse` kernel primitive (Phase 0), reused
 * rather than inventing a second bounding function.
 */
export function needRelevance(isCausallyConnected: boolean, impacts: readonly NeedImpact[]): Rational {
  if (!isCausallyConnected) return Rational.ZERO;
  let acc = Rational.ZERO;
  for (const impact of impacts) {
    acc = acc.add(impact.urgency.mul(impact.delta.abs()));
  }
  return Rational.boundedResponse(acc);
}

// ---------------------------------------------------------------------------
// Surprise (Brief §10) — evidence-aware per Phase 2.5c point 3
// ---------------------------------------------------------------------------

/**
 * One Need's evidence this Experience produced, in exactly the vocabulary
 * Phase 2.5a's `expectation.ts` already uses for learning (`EvidenceKind`)
 * — sharing that vocabulary is the fix itself: 2.5a and 2.5b previously
 * disagreed about what a censored observation means, because salience
 * computed surprise from the raw clipped delta while learning already knew
 * better. `observed` is `r` for `'point'` evidence, and the (numerically
 * identical) realized value for `'lower_bound'`/`'upper_bound'` evidence —
 * what differs between evidence kinds is not the NUMBER but which FORMULA
 * below is the epistemically correct way to read it.
 */
export interface SurpriseEvidence {
  readonly kind: EvidenceKind;
  readonly priorMu: Rational;
  readonly observed: Rational;
}

/**
 * Brief §10's `S_i = f_S(|δ|)`, generalized to respect evidence semantics:
 *  - `'point'`: `|r - μ|` — the original, unchanged formula for an exact
 *    observation.
 *  - `'lower_bound'` (a ceiling-saturated positive effect; true effect ≥
 *    L=observed): `max(0, L - μ)` — "did the evidence prove something
 *    incompatible with my belief?" If I believed +0.40 and a saturated
 *    observation only shows "at least +0.10," that proves nothing I didn't
 *    already believe (0.10 ≤ 0.40) — zero surprise, correctly, unlike
 *    |0.10-0.40|=0.30 which would wrongly call a completely uninformative
 *    observation "surprising." If I believed +0.02 and observe "at least
 *    +0.10," that IS incompatible with my belief (0.10 > 0.02) — surprise
 *    0.08, correctly.
 *  - `'upper_bound'` (a floor-saturated negative effect; true effect ≤
 *    U=observed): the mirror, `max(0, μ - U)`.
 */
export function surpriseMagnitude(evidence: SurpriseEvidence): Rational {
  switch (evidence.kind) {
    case 'point':
      return evidence.observed.sub(evidence.priorMu).abs();
    case 'lower_bound':
      return Rational.ZERO.max(evidence.observed.sub(evidence.priorMu));
    case 'upper_bound':
      return Rational.ZERO.max(evidence.priorMu.sub(evidence.observed));
  }
}

/**
 * S_i for a concept — the maximum evidence-aware surprise magnitude across
 * whatever Need evidence this Experience produced, nonzero only for
 * causally-connected concepts (an incidental Lamp did not become more
 * surprising because Glen behaved unexpectedly), bounded via
 * `Rational.boundedResponse` exactly as Need relevance is.
 */
export function surprise(isCausallyConnected: boolean, evidence: readonly SurpriseEvidence[]): Rational {
  if (!isCausallyConnected) return Rational.ZERO;
  let maxMagnitude = Rational.ZERO;
  for (const e of evidence) {
    const magnitude = surpriseMagnitude(e);
    if (magnitude.gt(maxMagnitude)) maxMagnitude = magnitude;
  }
  return Rational.boundedResponse(maxMagnitude);
}

// ---------------------------------------------------------------------------
// Raw salience (Brief §11)
// ---------------------------------------------------------------------------

/**
 * Raw_i = B_i · R_i · A_i · (1+α_N·N_i) · (1+α_S·S_i) — Brief §11's
 * candidate form, taken as CharacterLab's first tested hypothesis exactly
 * as the brief frames it ("This is a hypothesis, not a locked final
 * architecture"). Deterministic, decomposable (every factor is retained
 * in the trace — see `SalienceBreakdown` below), and uses no
 * scenario-specific weight: B_i and R_i come from the fixed global
 * tables above, A_i/N_i/S_i are all bounded, deterministic functions of
 * this Experience's own data.
 */
export function rawSalience(
  baseSalience: Rational,
  roleWeight: Rational,
  attention: Rational,
  needRelevanceValue: Rational,
  surpriseValue: Rational,
  alphaN: Rational,
  alphaS: Rational,
): Rational {
  return baseSalience
    .mul(roleWeight)
    .mul(attention)
    .mul(Rational.ONE.add(alphaN.mul(needRelevanceValue)))
    .mul(Rational.ONE.add(alphaS.mul(surpriseValue)));
}

// ---------------------------------------------------------------------------
// Salience budget (Brief §12)
// ---------------------------------------------------------------------------

export type SalienceBudgetMode = 'independent' | 'shared' | 'hybrid';

/**
 * Phase 2.5c locks `'independent'` (Model A) as the reference default —
 * see `scenario.ts::defaultSalienceParams` — until a dedicated experiment
 * specifically about limited attentional/encoding CAPACITY motivates
 * `'shared'`/`'hybrid'`. Reasoning (post-2.5b review): the association
 * graph already enforces a competitive budget downstream
 * (`Σ_j W_ij ≤ 1`, associations.ts). Normalizing salience against a SECOND
 * shared Experience-level budget on top of that would let an irrelevant
 * extra concept dilute the important ones before they even reach
 * association learning — quietly reintroducing the tag-count effect Phase
 * 2.5b exists to eliminate, just one level up the pipeline. "Limited
 * attention" (a real, now-modeled phenomenon — see `deriveAttention` above)
 * and "limited associative capacity" (already `associations.ts`'s job) are
 * two different constraints; conflating them here was not something this
 * project had actually tested yet. `'shared'`/`'hybrid'` remain implemented
 * and available (both are mathematically sound: bounded, exact,
 * deterministic — `salience.test.ts` still checks both directly) for
 * exactly that future experiment, not deleted.
 */
export interface SalienceParams {
  readonly alphaN: Rational;
  readonly alphaS: Rational;
  readonly budgetMode: SalienceBudgetMode;
  /** B — the shared/hybrid models' encoding-capacity budget. Unused by
   * 'independent'. */
  readonly budget: Rational;
  /** Hybrid model's importance cutoff: a concept with Raw_i at or above
   * this threshold keeps independent (budget-exempt) encoding; the rest
   * compete for what's left of `budget` (Brief §12's "Important concepts
   * may retain independent salience up to a threshold, after which
   * low-salience concepts compete for remaining encoding capacity"). */
  readonly hybridThreshold: Rational;
}

/**
 * Why this module does NOT reuse `associations.ts::updateAssociations`'s
 * BigInt lattice-quantization + largest-remainder reallocation machinery
 * for the shared/hybrid budget models, even though both are "normalize a
 * set of nonnegative Rationals against a shared cap": that machinery
 * exists because W is PERSISTED, accumulated state — Σ_j W_ij must stay
 * EXACTLY 1 (not merely close) across thousands of future decay/Hebbian
 * updates, or quantization drift compounds indefinitely. Semantic
 * salience z is recomputed fresh from scratch every single Experience —
 * nothing about it persists or accumulates — so a plain exact `Rational`
 * division already satisfies the "exact rational arithmetic" contract
 * (Brief §3.1) with no drift to guard against, and z_i is not required to
 * sum to any particular total (Brief §12 bounds each z_i, it does not
 * require Σz_i = B). Reusing the lattice/BigInt path here would add
 * complexity to solve a persistence problem this module doesn't have.
 */
function sumRational(values: readonly Rational[]): Rational {
  let acc = Rational.ZERO;
  for (const v of values) acc = acc.add(v);
  return acc;
}

interface RawEntry {
  readonly concept: ConceptKey;
  readonly raw: Rational;
}

function applyIndependent(entries: readonly RawEntry[]): Map<ConceptKey, Rational> {
  const z = new Map<ConceptKey, Rational>();
  for (const e of entries) z.set(e.concept, Rational.boundedResponse(e.raw));
  return z;
}

/** z_i = Raw_i / max(B, Σ_j Raw_j) — Brief §12 Model B. Bounded in [0,1]
 * by construction: the denominator is at least Σ_j Raw_j, which (all
 * terms nonnegative) is at least any single Raw_i. */
function applyShared(entries: readonly RawEntry[], budget: Rational): Map<ConceptKey, Rational> {
  const total = sumRational(entries.map((e) => e.raw));
  const denom = budget.max(total);
  const z = new Map<ConceptKey, Rational>();
  for (const e of entries) {
    z.set(e.concept, denom.isZero() ? Rational.ZERO : e.raw.div(denom));
  }
  return z;
}

/** Brief §12 Model C: entries at/above `hybridThreshold` keep independent
 * (Model A) encoding; the remainder compete for whatever budget those
 * "important" concepts didn't already consume, via Model B restricted to
 * that low-salience subset. */
function applyHybrid(entries: readonly RawEntry[], budget: Rational, hybridThreshold: Rational): Map<ConceptKey, Rational> {
  const important = entries.filter((e) => e.raw.gte(hybridThreshold));
  const low = entries.filter((e) => e.raw.lt(hybridThreshold));

  const z = new Map<ConceptKey, Rational>();
  let importantZSum = Rational.ZERO;
  for (const e of important) {
    const zi = Rational.boundedResponse(e.raw);
    z.set(e.concept, zi);
    importantZSum = importantZSum.add(zi);
  }

  const leftoverBudget = budget.sub(importantZSum).max(Rational.ZERO);
  const lowTotal = sumRational(low.map((e) => e.raw));
  const denom = leftoverBudget.max(lowTotal);
  for (const e of low) {
    z.set(e.concept, denom.isZero() ? Rational.ZERO : e.raw.div(denom));
  }
  return z;
}

// ---------------------------------------------------------------------------
// The full pipeline (Brief §25)
// ---------------------------------------------------------------------------

export interface SalienceBreakdown {
  readonly concept: ConceptKey;
  readonly category: ConceptCategory;
  readonly role: CausalRole;
  readonly perceived: boolean;
  readonly baseSalience: Rational;
  readonly roleWeight: Rational;
  readonly attention: Rational;
  readonly needRelevance: Rational;
  readonly surprise: Rational;
  readonly raw: Rational;
  readonly z: Rational;
}

export interface SemanticSalienceResult {
  readonly budgetMode: SalienceBudgetMode;
  /** Canonical ConceptKey order — deterministic regardless of input
   * iteration order (Brief §27 Deterministic Salience). */
  readonly breakdown: readonly SalienceBreakdown[];
}

/**
 * The Phase 2.5b/c pipeline entrypoint: WORLD EVENT (descriptor, itself
 * mechanically derived from `EffectProvenance` — see `deriveWorldEventDescriptor`)
 * → PERCEPTUAL FILTER → derived ATTENTION → CAUSAL ROLE → NEED RELEVANCE /
 * evidence-aware SURPRISE → SALIENCE BUDGET → SEMANTIC EXPERIENCE (Brief
 * §25). Every concept in `descriptor.perceived` with `perceived: false`
 * gets z_i = 0 unconditionally (§27 Perception Exclusion) and is excluded
 * from the budget-model competition entirely — "cannot receive semantic
 * salience merely because it existed in the same world space" (§8) means it
 * never competed for encoding capacity in the first place, not merely that
 * it lost the competition.
 */
export function computeSemanticSalience(
  descriptor: WorldEventDescriptor,
  causallyConnected: ReadonlySet<ConceptKey>,
  needImpacts: readonly NeedImpact[],
  surpriseEvidence: readonly SurpriseEvidence[],
  params: SalienceParams,
): SemanticSalienceResult {
  const perceivedOnly = descriptor.perceived.filter((p) => p.perceived);
  const attentionByConcept = deriveAttention(descriptor.perceived);

  const rawByConceptEntries: { pc: PerceivedConcept; entry: RawEntry; N: Rational; S: Rational; A: Rational }[] = [];
  for (const pc of perceivedOnly) {
    const connected = causallyConnected.has(pc.concept);
    const N = needRelevance(connected, needImpacts);
    const S = surprise(connected, surpriseEvidence);
    const A = attentionByConcept.get(pc.concept) ?? Rational.ZERO;
    const B = BASE_SALIENCE[pc.category];
    const R = ROLE_WEIGHT[pc.role];
    const raw = rawSalience(B, R, A, N, S, params.alphaN, params.alphaS);
    rawByConceptEntries.push({ pc, entry: { concept: pc.concept, raw }, N, S, A });
  }

  const rawEntries = rawByConceptEntries.map((e) => e.entry);
  const zByConcept =
    params.budgetMode === 'independent'
      ? applyIndependent(rawEntries)
      : params.budgetMode === 'shared'
        ? applyShared(rawEntries, params.budget)
        : applyHybrid(rawEntries, params.budget, params.hybridThreshold);

  const breakdown: SalienceBreakdown[] = rawByConceptEntries.map(({ pc, entry, N, S, A }) => ({
    concept: pc.concept,
    category: pc.category,
    role: pc.role,
    perceived: true,
    baseSalience: BASE_SALIENCE[pc.category],
    roleWeight: ROLE_WEIGHT[pc.role],
    attention: A,
    needRelevance: N,
    surprise: S,
    raw: entry.raw,
    z: zByConcept.get(pc.concept) ?? Rational.ZERO,
  }));

  // Unperceived concepts still appear in the trace/breakdown (so a query
  // like "was the Lamp ever considered at all" is answerable), pinned at
  // z=0 and never having entered the budget competition above.
  for (const pc of descriptor.perceived) {
    if (pc.perceived) continue;
    breakdown.push({
      concept: pc.concept,
      category: pc.category,
      role: pc.role,
      perceived: false,
      baseSalience: BASE_SALIENCE[pc.category],
      roleWeight: ROLE_WEIGHT[pc.role],
      attention: Rational.ZERO,
      needRelevance: Rational.ZERO,
      surprise: Rational.ZERO,
      raw: Rational.ZERO,
      z: Rational.ZERO,
    });
  }

  breakdown.sort((a, b) => compareCanonical(a.concept, b.concept));

  return { budgetMode: params.budgetMode, breakdown };
}
