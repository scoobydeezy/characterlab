import React from 'react';
import { Engine } from '../state/useEngine';
import { Rational } from '../../kernel/rational';
import { Slider, Toggle } from './Slider';
import { DecisionExpression, OptionProbability, InfluenceRoll } from '../../model/decision';
import { DecisionSample } from '../../experiments/decisionResolution';
import { RepeatedRun } from '../../experiments/identityFormation';
import { CompiledNucleus, ModifierFamilyId } from '../../model/diceCompiler';
import { nucleusKeyString } from '../../model/reasonNucleus';
import { ConsolidatedContribution } from '../../kernel/evidenceOverlap';
import { ACTION_KEEP_DINNER_PROMISE, ACTION_STAY_AT_WORK } from '../../model/scenario';

/**
 * Phase 2.9 — Brief §6-14's Decision Authorship / Acquired Identity / Role
 * of Dice, made visible: the live `DecisionParams` controls (die-scale
 * thresholds, resolution-mode thresholds, identity-strength/confidence
 * constants, the identity-feedback ablation switch) and all eleven of Brief
 * §30's required experiments (A-D & K: decision mechanics; E, G, H, I, J:
 * identity formation; F: the flagship seed-divergence demonstration).
 * Grouped into three subsections, following `Phase2ExperimentsPanel`'s own
 * per-experiment `<h3>` convention one level down (`<h4>` per experiment,
 * `<h3>` per group) since this panel has more run-buttons than any other.
 * Every experiment here is a self-contained read-only probe exactly like
 * the Phase-2/2.5a experiments elsewhere in this app: it builds its own
 * `defaultDecisionScenario()` baseline internally and never touches Mina's
 * live timeline, only this panel's own result state.
 */

function shortLabel(id: string): string {
  const parts = id.split('.');
  return parts[parts.length - 1];
}

function fmt(r: Rational, digits = 4): string {
  return r.toDisplayNumber().toFixed(digits);
}

function Badge({ ok, good, bad }: { ok: boolean; good: string; bad: string }) {
  return <span className={`exp-badge ${ok ? 'exp-badge--good' : 'exp-badge--warn'}`}>{ok ? good : bad}</span>;
}

function FlagRow({ flags }: { flags: readonly { label: string; ok: boolean }[] }) {
  return (
    <p className="panel__hint">
      {flags.map((f, i) => (
        <React.Fragment key={f.label}>
          {i > 0 && ' · '}
          {f.label}: <Badge ok={f.ok} good="yes" bad="no" />
        </React.Fragment>
      ))}
    </p>
  );
}

function OptionProbabilityTable({ probs }: { probs: readonly OptionProbability[] }) {
  return (
    <table className="exp-table">
      <thead>
        <tr>
          <th>Option</th>
          <th>Pr (pre-roll)</th>
        </tr>
      </thead>
      <tbody>
        {probs.map((p) => (
          <tr key={p.optionKey}>
            <td>{shortLabel(p.optionKey)}</td>
            <td>{(p.probability.toDisplayNumber() * 100).toFixed(2)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function InfluenceRollTable({ rolls }: { rolls: readonly InfluenceRoll[] }) {
  if (rolls.length === 0) return <p className="panel__hint">No dice rolled (auto-resolved, or every Influence stayed below the die floor).</p>;
  return (
    <table className="exp-table">
      <thead>
        <tr>
          <th>Option</th>
          <th>Die</th>
          <th>Sign</th>
          <th>Roll</th>
          <th>Contribution</th>
        </tr>
      </thead>
      <tbody>
        {rolls.map((r) => (
          <tr key={r.influenceId}>
            <td>{shortLabel(r.optionKey)}</td>
            <td>d{r.faces}</td>
            <td>{r.sign > 0 ? '+' : '−'}</td>
            <td>{r.rollValue}</td>
            <td>{r.signedContribution}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DecisionExpressionView({ label, expr }: { label?: string; expr: DecisionExpression }) {
  return (
    <div className="exp-result-block">
      {label && (
        <p>
          <strong>{label}</strong>
        </p>
      )}
      <div className="exp-table-wrap">
        <OptionProbabilityTable probs={expr.preRollOptionProbabilities} />
      </div>
      <p className="panel__hint">
        Margin={fmt(expr.margin)} · Contest={fmt(expr.contest)} · Stake={fmt(expr.stake)} · AuthorshipPotential=
        {fmt(expr.authorshipPotential)} · Mode=<strong>{expr.resolutionMode}</strong>
      </p>
      <div className="exp-table-wrap">
        <InfluenceRollTable rolls={expr.influenceRolls} />
      </div>
      <p className="panel__hint">
        Chosen option: <strong>{shortLabel(expr.chosenOption)}</strong> · Chosen intent: <strong>{shortLabel(expr.chosenIntent)}</strong>
      </p>
      {expr.identityExpressions.length > 0 && (
        <p className="panel__hint">
          Identity expressions:{' '}
          {expr.identityExpressions
            .map((ie) => `${ie.channel} (alignment=${fmt(ie.alignment, 3)}, expressionStrength=${fmt(ie.expressionStrength, 3)})`)
            .join(' · ')}
        </p>
      )}
    </div>
  );
}

function DecisionSampleView({ sample }: { sample: DecisionSample }) {
  return (
    <div>
      <DecisionExpressionView label={sample.label} expr={sample.decisionExpression} />
      <p className="panel__hint">
        Physically executed action: <strong>{shortLabel(sample.executedAction.actionKey)}</strong>
      </p>
    </div>
  );
}

function RepeatedRunSummary({ run, title }: { run: RepeatedRun; title: string }) {
  const first = run.rounds[0];
  const last = run.rounds[run.rounds.length - 1];
  return (
    <div className="exp-table-wrap">
      <p className="panel__hint">
        <strong>{title}</strong> — {run.rounds.length} rounds. IdentityStrength(CommitmentFidelity): first={fmt(first.identityStrengthCommitmentFidelity)},
        last={fmt(last.identityStrengthCommitmentFidelity)}.
      </p>
      <table className="exp-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Chosen</th>
            <th>Mode</th>
            <th>Contest</th>
            <th>Margin</th>
            <th>AuthorshipPotential</th>
            <th>IdentityStrength(CF)</th>
            <th>IdentityConfidence(CF)</th>
          </tr>
        </thead>
        <tbody>
          {run.rounds.map((r) => (
            <tr key={r.round}>
              <td>{r.round + 1}</td>
              <td>{shortLabel(r.decisionExpression.chosenOption)}</td>
              <td>{r.decisionExpression.resolutionMode}</td>
              <td>{fmt(r.decisionExpression.contest)}</td>
              <td>{fmt(r.decisionExpression.margin)}</td>
              <td>{fmt(r.decisionExpression.authorshipPotential)}</td>
              <td>{fmt(r.identityStrengthCommitmentFidelity)}</td>
              <td>{fmt(r.identityConfidenceCommitmentFidelity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Phase 2.97 — Brief §64's REASON-header worked-example layout, rendered as
 * a compact table: one row per correlation-trace contribution (base motive,
 * standing, and situational contributions all concatenated in
 * `CompiledNucleus.correlationTrace`), showing exactly how much correlation
 * discount, if any, each raw signal actually received.
 */
function CorrelationTraceTable({ trace }: { trace: readonly ConsolidatedContribution[] }) {
  if (trace.length === 0) return <p className="panel__hint">No contributions recorded.</p>;
  return (
    <table className="exp-table">
      <thead>
        <tr>
          <th>Signal</th>
          <th>Raw magnitude</th>
          <th>Overlap w/ prior</th>
          <th>Independent fraction</th>
          <th>Effective</th>
        </tr>
      </thead>
      <tbody>
        {trace.map((c) => (
          <tr key={c.id}>
            <td>{c.id}</td>
            <td>{fmt(c.rawMagnitude, 3)}</td>
            <td>{fmt(c.overlapWithPrior, 3)}</td>
            <td>{fmt(c.independentFraction, 3)}</td>
            <td>{fmt(c.effective, 3)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** One `CompiledNucleus`, in full — Key / Base Motive / Base Die / Standing /
 * Situational / Final Expression / Exact Distribution / Option Contribution
 * (Brief §64), plus its own correlation trace underneath. */
function CompiledNucleusView({ nucleus }: { nucleus: CompiledNucleus }) {
  const support = [...nucleus.distribution.pmf.entries()].sort((a, b) => Number(a[0] - b[0]));
  return (
    <div className="exp-result-block">
      <p>
        <strong>{nucleusKeyString(nucleus.key)}</strong>
      </p>
      <p className="panel__hint">
        Base motive (B_n)={fmt(nucleus.baseMotiveStrength, 3)} · Reason relevance (R_n)={fmt(nucleus.reasonRelevance, 3)} · Base
        die=d{nucleus.baseDie} · Standing={nucleus.standingModifier >= 0 ? '+' : ''}
        {nucleus.standingModifier} · Situational={nucleus.situationalModifier >= 0 ? '+' : ''}
        {nucleus.situationalModifier} · Final modifier={nucleus.finalModifier >= 0 ? '+' : ''}
        {nucleus.finalModifier}
      </p>
      <div className="exp-table-wrap">
        <table className="exp-table">
          <thead>
            <tr>
              <th>Face value</th>
              <th>Pr</th>
            </tr>
          </thead>
          <tbody>
            {support.map(([value, p]) => (
              <tr key={value.toString()}>
                <td>{value.toString()}</td>
                <td>{(p.toDisplayNumber() * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="panel__hint">Correlation trace ({nucleus.sourceSignals.length} source signal(s)):</p>
      <div className="exp-table-wrap">
        <CorrelationTraceTable trace={nucleus.correlationTrace} />
      </div>
    </div>
  );
}

/** Every active `CompiledNucleus` for one Option — the "Decision should not
 * display hundreds of dice" grammar (Context section) made visible: however
 * many nuclei a real psychological situation produced, each one gets its own
 * row, never a flattened summary. */
function ReasonNucleusTraceTable({ nuclei, title }: { nuclei: readonly CompiledNucleus[]; title?: string }) {
  return (
    <div>
      {title && (
        <p>
          <strong>{title}</strong> — {nuclei.length} active nucleus(es)
        </p>
      )}
      {nuclei.length === 0 && <p className="panel__hint">No active nuclei (either no genuine motive, or below θ_reason).</p>}
      {nuclei.map((n) => (
        <CompiledNucleusView key={nucleusKeyString(n.key)} nucleus={n} />
      ))}
    </div>
  );
}

export function DecisionPanel({ engine }: { engine: Engine }) {
  const {
    snapshot,
    updateDecisionParams,
    runExperimentAUI,
    runExperimentBUI,
    runExperimentCUI,
    runExperimentDUI,
    runExperimentKUI,
    runExperimentEUI,
    runExperimentGUI,
    runExperimentHUI,
    runExperimentIUI,
    runExperimentJUI,
    runExperimentFUI,
    runTargetAUI,
    runTargetBUI,
    runTargetCUI,
    runTargetDUI,
    runTargetEUI,
    runReasonNucleusAUI,
    runReasonNucleusBUI,
    runReasonNucleusCUI,
    runCorrelatedEvidenceDUI,
    runCorrelatedEvidenceEUI,
    runCorrelatedEvidenceFUI,
    runIdentityModifierGUI,
    runIdentityModifierHUI,
    runIdentityModifierIUI,
    runSituationalJUI,
    runDiceRichnessKUI,
    runCalibrationLUI,
    runOldVsNewMUI,
    runSeedDivergenceNUI,
  } = engine;
  const {
    decisionParams,
    expAResult,
    expBResult,
    expCResult,
    expDResult,
    expKResult,
    expEResult,
    expGResult,
    expHResult,
    expIResult,
    expJResult,
    expFResult,
    targetAResult,
    targetBResult,
    targetCResult,
    targetDResult,
    targetEResult,
    reasonNucleusAResult,
    reasonNucleusBResult,
    reasonNucleusCResult,
    correlatedEvidenceDResult,
    correlatedEvidenceEResult,
    correlatedEvidenceFResult,
    identityModifierGResult,
    identityModifierHResult,
    identityModifierIResult,
    situationalJResult,
    diceRichnessKResult,
    calibrationLResult,
    oldVsNewMResult,
    seedDivergenceNResult,
  } = snapshot;

  const updateModifierUnit = (familyId: ModifierFamilyId, unit: Rational) => {
    const family = decisionParams.reasonNucleus.modifierFamilies.get(familyId);
    if (!family) return;
    const modifierFamilies = new Map(decisionParams.reasonNucleus.modifierFamilies);
    modifierFamilies.set(familyId, { ...family, unit });
    updateDecisionParams({ reasonNucleus: { ...decisionParams.reasonNucleus, modifierFamilies } });
  };
  const standingIdentityUnit = decisionParams.reasonNucleus.modifierFamilies.get('StandingIdentity')?.unit ?? Rational.ZERO;
  const recentExperienceUnit = decisionParams.reasonNucleus.modifierFamilies.get('RecentExperience')?.unit ?? Rational.ZERO;

  return (
    <section className="panel">
      <h2>Decision Authorship, Acquired Identity &amp; the Role of Dice (Phase 2.9 — §6-14, §30)</h2>
      <p className="panel__hint">
        A Decision resolves an explicitly-authored small-Option dilemma: exact pre-roll probabilities from every
        surviving Influence's signed die, Margin/Contest/Stake/AuthorshipPotential classify how much is genuinely at
        stake, and — only when warranted — real dice are rolled through the counter-addressed oracle. A resolved
        Decision's identity-consistency channel then leaves biographical evidence (IdentityEvidence) that can, in
        turn, feed back into future Decisions as one more Influence — never a dictating one.
      </p>

      <div className="control-grid">
        <Slider
          label="Die scale: weak"
          value={decisionParams.dieScale.weak.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateDecisionParams({ dieScale: { ...decisionParams.dieScale, weak: Rational.fromDecimal(v) } })}
          title="|signedStrength| below this gets no die at all — dropped entirely."
        />
        <Slider
          label="Die scale: moderate (d6)"
          value={decisionParams.dieScale.moderate.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateDecisionParams({ dieScale: { ...decisionParams.dieScale, moderate: Rational.fromDecimal(v) } })}
        />
        <Slider
          label="Die scale: strong (d8)"
          value={decisionParams.dieScale.strong.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateDecisionParams({ dieScale: { ...decisionParams.dieScale, strong: Rational.fromDecimal(v) } })}
        />
        <Slider
          label="Die scale: very strong (d10)"
          value={decisionParams.dieScale.veryStrong.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateDecisionParams({ dieScale: { ...decisionParams.dieScale, veryStrong: Rational.fromDecimal(v) } })}
        />
        <Slider
          label="Die scale: extreme (d12)"
          value={decisionParams.dieScale.extreme.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateDecisionParams({ dieScale: { ...decisionParams.dieScale, extreme: Rational.fromDecimal(v) } })}
        />
        <Slider
          label="θ_roll (Contest below ⇒ Auto)"
          value={decisionParams.thetaRoll.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateDecisionParams({ thetaRoll: Rational.fromDecimal(v) })}
        />
        <Slider
          label="θ_player (AuthorshipPotential at/above ⇒ player-facing)"
          value={decisionParams.thetaPlayer.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateDecisionParams({ thetaPlayer: Rational.fromDecimal(v) })}
        />
        <Slider
          label="θ_trait (trait-consolidation strength floor)"
          value={decisionParams.thetaTrait.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateDecisionParams({ thetaTrait: Rational.fromDecimal(v) })}
        />
        <Slider
          label="θ_confidence (trait-consolidation confidence floor)"
          value={decisionParams.thetaConfidence.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateDecisionParams({ thetaConfidence: Rational.fromDecimal(v) })}
        />
        <Slider
          label="K_I (identity-strength half-saturation)"
          value={decisionParams.kI.toDisplayNumber()}
          min={0.5}
          max={5}
          step={0.1}
          onChange={(v) => updateDecisionParams({ kI: Rational.fromDecimal(v) })}
        />
        <Slider
          label="K_C (identity-confidence half-saturation)"
          value={decisionParams.kC.toDisplayNumber()}
          min={0.5}
          max={5}
          step={0.1}
          onChange={(v) => updateDecisionParams({ kC: Rational.fromDecimal(v) })}
        />
        <Toggle
          label="Identity feedback enabled"
          checked={decisionParams.identityFeedbackEnabled}
          onChange={(checked) => updateDecisionParams({ identityFeedbackEnabled: checked })}
          title="Ablation switch (scoping decision 6): when off, no identity_consistency Influence is generated."
        />
        <Toggle
          label="Compilation mode: Reason Nuclei (Phase 2.97)"
          checked={decisionParams.compilationMode === 'reasonNuclei'}
          onChange={(checked) => updateDecisionParams({ compilationMode: checked ? 'reasonNuclei' : 'legacy' })}
          title="'legacy' (off) is Phase 2.95's frozen SemanticReasonChannelId baseline. 'reasonNuclei' (on) routes through the new MotiveChannel×Referent×Direction compiler below. All Experiments A-K/Targets A-E above always run in 'legacy' mode internally regardless of this switch — it only affects live decisions you script elsewhere in the app."
        />
        <Slider
          label="θ_reason (Reason Nuclei activation floor)"
          value={decisionParams.reasonNucleus.thetaReason.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateDecisionParams({ reasonNucleus: { ...decisionParams.reasonNucleus, thetaReason: Rational.fromDecimal(v) } })}
          title="R_n below this ⇒ an existing (B_n != 0) nucleus stays a real but non-dice-active reason."
        />
        <Slider
          label="Reason Nuclei base die: d4 threshold"
          value={decisionParams.reasonNucleus.thresholds.d4.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) =>
            updateDecisionParams({
              reasonNucleus: { ...decisionParams.reasonNucleus, thresholds: { ...decisionParams.reasonNucleus.thresholds, d4: Rational.fromDecimal(v) } },
            })
          }
        />
        <Slider
          label="Reason Nuclei base die: d6 threshold"
          value={decisionParams.reasonNucleus.thresholds.d6.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) =>
            updateDecisionParams({
              reasonNucleus: { ...decisionParams.reasonNucleus, thresholds: { ...decisionParams.reasonNucleus.thresholds, d6: Rational.fromDecimal(v) } },
            })
          }
        />
        <Slider
          label="Reason Nuclei base die: d8 threshold"
          value={decisionParams.reasonNucleus.thresholds.d8.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) =>
            updateDecisionParams({
              reasonNucleus: { ...decisionParams.reasonNucleus, thresholds: { ...decisionParams.reasonNucleus.thresholds, d8: Rational.fromDecimal(v) } },
            })
          }
        />
        <Slider
          label="Reason Nuclei base die: d10 threshold"
          value={decisionParams.reasonNucleus.thresholds.d10.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) =>
            updateDecisionParams({
              reasonNucleus: { ...decisionParams.reasonNucleus, thresholds: { ...decisionParams.reasonNucleus.thresholds, d10: Rational.fromDecimal(v) } },
            })
          }
        />
        <Slider
          label="Reason Nuclei base die: d12 threshold"
          value={decisionParams.reasonNucleus.thresholds.d12.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) =>
            updateDecisionParams({
              reasonNucleus: { ...decisionParams.reasonNucleus, thresholds: { ...decisionParams.reasonNucleus.thresholds, d12: Rational.fromDecimal(v) } },
            })
          }
        />
        <Slider
          label="Modifier family unit: StandingIdentity"
          value={standingIdentityUnit.toDisplayNumber()}
          min={0.05}
          max={1}
          step={0.01}
          onChange={(v) => updateModifierUnit('StandingIdentity', Rational.fromDecimal(v))}
          title="Consolidated standing strength worth exactly +1 integer modifier point. Experiment L's own finding: at the default 0.25, one modifier step outweighs a whole base-die bracket step — a wider unit here narrows that gap."
        />
        <Slider
          label="Modifier family unit: RecentExperience"
          value={recentExperienceUnit.toDisplayNumber()}
          min={0.05}
          max={1}
          step={0.01}
          onChange={(v) => updateModifierUnit('RecentExperience', Rational.fromDecimal(v))}
          title="Consolidated situational strength worth exactly +1 integer modifier point (Experiment J/L)."
        />
      </div>

      <h3>Decision mechanics — Experiments A, B, C, D, K (§30)</h3>

      <h4>A — Residual uncertainty</h4>
      <p className="panel__hint">
        Two comparably-pressured Options: neither existing state nor (unmodeled) personality should deterministically
        pick a winner — both pre-roll probabilities stay nontrivial and dice are used.
      </p>
      <div className="button-row">
        <button onClick={() => runExperimentAUI()}>Run Experiment A</button>
      </div>
      {expAResult && (
        <>
          <DecisionSampleView sample={expAResult.sample} />
          <FlagRow
            flags={[
              { label: 'Both probabilities nontrivial', ok: expAResult.bothProbabilitiesNontrivial },
              { label: 'Dice used (not Auto)', ok: expAResult.usedDice },
            ]}
          />
        </>
      )}

      <h4>B — Obvious choice</h4>
      <p className="panel__hint">
        Keep Dinner made overwhelmingly stronger on both urgency and established expectation — Margin should rise,
        Contest fall, the Decision auto-resolve, and no dice roll.
      </p>
      <div className="button-row">
        <button onClick={() => runExperimentBUI()}>Run Experiment B</button>
      </div>
      {expBResult && (
        <>
          <DecisionSampleView sample={expBResult.sample} />
          <FlagRow
            flags={[
              { label: 'Margin high', ok: expBResult.marginHigh },
              { label: 'Contest low', ok: expBResult.contestLow },
              { label: 'Auto-resolved', ok: expBResult.autoResolved },
              { label: 'No dice rolled', ok: expBResult.noDiceRolled },
            ]}
          />
        </>
      )}

      <h4>C — Trivial uncertainty</h4>
      <p className="panel__hint">
        The brief's own "tea or coffee?" example: both Options' expectations are genuine but tiny, so every Influence
        stays below the die floor. May still need a quiet tie-break roll, but never becomes player-facing, and
        Identity Evidence stays at zero.
      </p>
      <div className="button-row">
        <button onClick={() => runExperimentCUI()}>Run Experiment C</button>
      </div>
      {expCResult && (
        <>
          <DecisionSampleView sample={expCResult.sample} />
          <FlagRow
            flags={[
              { label: 'Not player-facing', ok: expCResult.notPlayerFacing },
              { label: 'Low stake', ok: expCResult.lowStake },
              { label: 'Identity evidence stays small', ok: expCResult.identityEvidenceStaysSmall },
            ]}
          />
        </>
      )}

      <h4>D — Meaningful conflict</h4>
      <p className="panel__hint">
        Both Options get a strong, well-established, comparably-sized expectation — a genuine near-balanced conflict.
        AuthorshipPotential should be high, the Decision player-facing, and the winning Option should create
        substantial Identity Evidence.
      </p>
      <div className="button-row">
        <button onClick={() => runExperimentDUI()}>Run Experiment D</button>
      </div>
      {expDResult && (
        <>
          <DecisionSampleView sample={expDResult.sample} />
          <FlagRow
            flags={[
              { label: 'High authorship potential', ok: expDResult.highAuthorship },
              { label: 'Player-facing', ok: expDResult.playerFacing },
              { label: 'Substantial identity evidence', ok: expDResult.substantialIdentityEvidence },
            ]}
          />
        </>
      )}

      <h4>K — Intent versus physical outcome</h4>
      <p className="panel__hint">
        Reuses D's contested setup, once resolved normally and once with the physically-executed action/outcome
        forcibly substituted (Betrayal, unrelated to either Option) — the chosen intent should be unaffected by what
        physically happens next.
      </p>
      <div className="button-row">
        <button onClick={() => runExperimentKUI()}>Run Experiment K</button>
      </div>
      {expKResult && (
        <>
          <DecisionSampleView sample={expKResult.baseline} />
          <DecisionSampleView sample={expKResult.forced} />
          <FlagRow
            flags={[
              { label: 'Chosen intent preserved across the forced substitution', ok: expKResult.intentPreserved },
              { label: 'Physical outcome differs from chosen intent', ok: expKResult.physicalOutcomeDiffers },
            ]}
          />
        </>
      )}

      <h3>Identity formation — Experiments E, G, H, I, J (§30)</h3>

      <h4>E — Trait acquisition</h4>
      <p className="panel__hint">
        Repeated ~4:1-biased dinner-vs-work Decisions with identity feedback disabled (isolating behavior alone):
        CommitmentFidelity evidence should accumulate, its IdentityStrength rise, and the single-channel "Dependable"
        trait eventually consolidate — with no trait ever explicitly authored onto the character.
      </p>
      <div className="button-row">
        <button onClick={() => runExperimentEUI()}>Run Experiment E</button>
      </div>
      {expEResult && (
        <>
          <RepeatedRunSummary run={expEResult.run} title="E — repeated dinner-vs-work rounds" />
          <FlagRow
            flags={[
              { label: 'Evidence accumulated', ok: expEResult.evidenceAccumulated },
              { label: 'Identity strength rose', ok: expEResult.strengthRose },
              { label: '"Dependable" trait consolidated by end', ok: expEResult.traitConsolidatedByEnd },
            ]}
          />
        </>
      )}

      <h4>G — Identity feedback</h4>
      <p className="panel__hint">
        Starting from E's consolidated identity, presents another matching Decision once with identity feedback on,
        once off. The compatible Option's probability should be measurably higher with feedback — a real reason,
        never a dictating one.
      </p>
      <div className="button-row">
        <button onClick={() => runExperimentGUI()}>Run Experiment G</button>
      </div>
      {expGResult && (
        <>
          <DecisionExpressionView label="With identity feedback" expr={expGResult.withIdentity} />
          <DecisionExpressionView label="Without identity feedback" expr={expGResult.withoutIdentity} />
          <FlagRow
            flags={[
              { label: "Compatible option's probability rises with feedback", ok: expGResult.compatibleOptionProbabilityRises },
              { label: 'Neither run dictated the option (no 0/1 probability)', ok: expGResult.neitherOptionDictated },
            ]}
          />
        </>
      )}

      <h4>H — Self-stabilization</h4>
      <p className="panel__hint">
        The same repeated-Decision harness continued for many more rounds, feedback enabled throughout: as
        CommitmentFidelity strengthens, Contest should fall and per-round identity-evidence growth should slow — a
        self-limiting loop, checked by comparing the first third of rounds against the last third.
      </p>
      <div className="button-row">
        <button onClick={() => runExperimentHUI()}>Run Experiment H</button>
      </div>
      {expHResult && (
        <>
          <RepeatedRunSummary run={expHResult.run} title="H — repeated dinner-vs-work rounds (feedback enabled)" />
          <p className="panel__hint">
            Average Contest — first third: {fmt(expHResult.averageContestFirstThird)}, last third: {fmt(expHResult.averageContestLastThird)}. Evidence
            growth (Σ|expressionStrength|) — first third: {fmt(expHResult.evidenceGrowthFirstThird)}, last third: {fmt(expHResult.evidenceGrowthLastThird)}.
          </p>
          <FlagRow
            flags={[
              { label: 'Contest fell (first third → last third)', ok: expHResult.contestFell },
              { label: 'Evidence growth slowed', ok: expHResult.evidenceGrowthSlowed },
            ]}
          />
        </>
      )}

      <h4>I — Identity fault line</h4>
      <p className="panel__hint">
        Establishes two independent, opposing identities (CommitmentFidelity vs. RiskAcceptance) then presents a
        cross-axis Decision pitting one against the other, in a contested setting (both Options already survive on
        raw Need alone) and an obvious-baseline setting (one Option already floored). Identity can shift a decision
        between two Options already in the dice — it cannot rescue one Need pressure already ruled out.
      </p>
      <div className="button-row">
        <button onClick={() => runExperimentIUI()}>Run Experiment I</button>
      </div>
      {expIResult && (
        <>
          <p className="panel__hint">
            CommitmentFidelity strength={fmt(expIResult.commitmentFidelityStrength)} · RiskAcceptance strength=
            {fmt(expIResult.riskAcceptanceStrength)}
          </p>
          <DecisionExpressionView label="Contested — with identity" expr={expIResult.contestedWithIdentity} />
          <DecisionExpressionView label="Contested — without identity" expr={expIResult.contestedWithoutIdentity} />
          <DecisionExpressionView label="Obvious baseline — with identity" expr={expIResult.obviousBaselineWithIdentity} />
          <DecisionExpressionView label="Obvious baseline — without identity" expr={expIResult.obviousBaselineWithoutIdentity} />
          <FlagRow
            flags={[
              { label: 'Both identities substantially established', ok: expIResult.bothIdentitiesSubstantiallyEstablished },
              { label: 'Identity measurably shifted the contested decision', ok: expIResult.identityMeasurablyShiftedTheContestedDecision },
              { label: 'Neither run dictated the contested decision', ok: expIResult.neitherRunDictatedTheContestedDecision },
              { label: 'Identity cannot rescue a floored option', ok: expIResult.identityCannotRescueAFlooredOption },
            ]}
          />
        </>
      )}

      <h4>J — Contradiction</h4>
      <p className="panel__hint">
        After E consolidates "Dependable," repeated high-authorship Decisions express the OPPOSITE tendency
        (feedback disabled, isolating pure behavioral counter-evidence). One contradiction should not erase the
        trait; many should measurably weaken and eventually un-consolidate it.
      </p>
      <div className="button-row">
        <button onClick={() => runExperimentJUI()}>Run Experiment J</button>
      </div>
      {expJResult && (
        <>
          <p className="panel__hint">
            IdentityStrength(CommitmentFidelity) — after E: {fmt(expJResult.strengthAfterE)}, after many contradictions:{' '}
            {fmt(expJResult.strengthAfterManyContradictions)}
          </p>
          <FlagRow
            flags={[
              { label: 'Consolidated after E', ok: expJResult.consolidatedAfterE },
              { label: 'Still consolidated after one contradiction', ok: expJResult.consolidatedAfterOneContradiction },
              { label: 'Still consolidated after many contradictions', ok: expJResult.consolidatedAfterManyContradictions },
              { label: 'Strength dropped', ok: expJResult.strengthDropped },
            ]}
          />
        </>
      )}

      <h3>Seed divergence — Experiment F (§30, flagship)</h3>
      <p className="panel__hint">
        "Dice cumulatively author character identity": two timelines, identical initial state and identical
        Decision sequence, only the RNG seed differs. Early rolls should diverge, the acquired identities should
        differ, and a later matching Decision should be answered differently by each — purely because of which way
        the dice fell.
      </p>
      <div className="button-row">
        <button onClick={() => runExperimentFUI()}>Run Experiment F</button>
      </div>
      {expFResult && (
        <>
          <RepeatedRunSummary run={expFResult.timelineA} title="Timeline A" />
          <RepeatedRunSummary run={expFResult.timelineB} title="Timeline B" />
          <p className="panel__hint">
            Final IdentityStrength(CommitmentFidelity) — A: {fmt(expFResult.identityStrengthA)}, B: {fmt(expFResult.identityStrengthB)}
          </p>
          <FlagRow
            flags={[
              { label: 'First-round dice rolls differed', ok: expFResult.firstRoundRollsDiffered },
              { label: 'Early decision expressions differed', ok: expFResult.earlyDecisionExpressionsDiffered },
              { label: 'Acquired identities differed', ok: expFResult.acquiredIdentitiesDiffered },
              { label: 'Later probabilities differed', ok: expFResult.laterProbabilitiesDiffered },
            ]}
          />
          <DecisionExpressionView label="Later matching decision — Timeline A" expr={expFResult.laterDecisionA} />
          <DecisionExpressionView label="Later matching decision — Timeline B" expr={expFResult.laterDecisionB} />
        </>
      )}

      <h3>Reason consolidation — Targets A-E (Phase 2.95, external review)</h3>
      <p className="panel__hint">
        An external review of the Phase 2.9 write-up traced two reported limitations (E's feedback-off-only
        acquisition; I's cancel-or-flip fault line) to one root cause: identity's own contribution was assembled as a
        separately-floored Influence, so it could never combine with an already-present but individually sub-floor
        Need signal. Phase 2.95 folds identity's raw per-channel pull into the SAME semantic-channel pool as
        Need/accessibility, summed and bound-and-floored together once. These five targets are the review's own
        required verification suite for that fix.
      </p>

      <h4>Target A — Gradual identity influence</h4>
      <p className="panel__hint">
        Sweeping established CommitmentFidelity evidence from 0 to 30 against a fixed dinner-vs-work baseline: the
        resolved probability should never fall (identity never makes an already-favored option less likely) and never
        fully dictate the Action, even at saturation. Honest scoping: the die-scale's five authored bands make this
        one visible bracket transition, not a perfectly smooth ramp.
      </p>
      <div className="button-row">
        <button onClick={() => runTargetAUI()}>Run Target A</button>
      </div>
      {targetAResult && (
        <>
          <p className="panel__hint">
            {targetAResult.samples.length} samples, support 0 → 30. p(Keep Dinner) — first: {fmt(targetAResult.samples[0].pKeepDinner)} (
            {targetAResult.samples[0].resolutionMode}), last: {fmt(targetAResult.samples[targetAResult.samples.length - 1].pKeepDinner)} (
            {targetAResult.samples[targetAResult.samples.length - 1].resolutionMode}). Largest single-step jump:{' '}
            {fmt(targetAResult.largestSingleStepJump)}.
          </p>
          <FlagRow
            flags={[
              { label: 'Probability monotonic non-decreasing', ok: targetAResult.probabilityMonotonicNondecreasing },
              { label: 'Never fully dictates, even at saturation', ok: targetAResult.neverFullyDictatesEvenAtSaturation },
              { label: 'At least one real transition occurred', ok: targetAResult.atLeastOneRealTransitionOccurred },
            ]}
          />
        </>
      )}

      <h4>Target B — Weak-signal combination</h4>
      <p className="panel__hint">
        Keep Dinner's own raw Need-sourced pressure is real but individually below the influence floor — alone it
        gets no die at all. A weak CommitmentFidelity establishment on the same channel is added: neither alone
        clears the floor, but consolidated together they do, giving Keep Dinner a real, surviving die.
      </p>
      <div className="button-row">
        <button onClick={() => runTargetBUI()}>Run Target B</button>
      </div>
      {targetBResult && (
        <>
          <DecisionExpressionView label="Without identity feedback" expr={targetBResult.withoutIdentity} />
          <DecisionExpressionView label="With identity feedback" expr={targetBResult.withIdentity} />
          <FlagRow
            flags={[
              { label: 'Need alone never clears the floor', ok: targetBResult.needAloneNeverClearsTheFloor },
              { label: 'Identity alone would be too weak too', ok: targetBResult.identityAloneWouldBeTooWeakToo },
              { label: 'Combined, they clear it', ok: targetBResult.combinedTheyClearIt },
            ]}
          />
        </>
      )}

      <h4>Target C — A real identity fault line</h4>
      <p className="panel__hint">
        An opposing, previously-uninvolved identity (RiskAcceptance, anchored to Speak Up) should turn Contest UP —
        making an otherwise fairly one-sided matchup more genuinely contested — without flipping which option leads
        or collapsing the decision to Auto. Contrast Experiment I's cancel-or-flip finding above.
      </p>
      <div className="button-row">
        <button onClick={() => runTargetCUI()}>Run Target C</button>
      </div>
      {targetCResult && (
        <>
          <DecisionExpressionView label="Without identity feedback" expr={targetCResult.withoutIdentity} />
          <DecisionExpressionView label="With identity feedback" expr={targetCResult.withIdentity} />
          <FlagRow
            flags={[
              { label: 'Both runs player-facing', ok: targetCResult.bothRunsPlayerFacing },
              { label: 'Contest increased', ok: targetCResult.contestIncreased },
              { label: 'Keep Dinner still favored, but less so', ok: targetCResult.keepDinnerStillFavoredButLessSo },
              { label: 'Neither probability hit 0 or 1', ok: targetCResult.neitherProbabilityHitZeroOrOne },
            ]}
          />
        </>
      )}

      <h4>Target D — Transformation with feedback active</h4>
      <p className="panel__hint">
        Reusing Experiment E's consolidated starting state, the same sustained contradiction bias Experiment J uses —
        but with identity feedback left ON throughout, no ablation. A modest (one die-bracket) increase in the
        contradiction's own raw pressure over J's level is what actually lets it win consistently enough to erode
        CommitmentFidelity, rather than being swamped by identity's own resistance.
      </p>
      <div className="button-row">
        <button onClick={() => runTargetDUI()}>Run Target D</button>
      </div>
      {targetDResult && (
        <>
          <p className="panel__hint">
            IdentityStrength(CommitmentFidelity) — after acquisition: {fmt(targetDResult.strengthAfterAcquisition)} (consolidated=
            {String(targetDResult.consolidatedAfterAcquisition)}), after {targetDResult.rounds} rounds of sustained contradiction:{' '}
            {fmt(targetDResult.strengthAfterSustainedContradiction)} (consolidated={String(targetDResult.consolidatedAfterSustainedContradiction)})
          </p>
          <FlagRow
            flags={[
              { label: 'Consolidated after acquisition', ok: targetDResult.consolidatedAfterAcquisition },
              { label: 'No longer consolidated after sustained contradiction', ok: !targetDResult.consolidatedAfterSustainedContradiction },
              { label: 'Strength dropped with feedback active', ok: targetDResult.strengthDroppedWithFeedbackActive },
            ]}
          />
        </>
      )}

      <h4>Target E — Canonical acquisition with feedback ON, from zero</h4>
      <p className="panel__hint">
        The same dinner-vs-work bias Experiment E/H use, from a completely fresh scenario (zero identity evidence),
        for 200 rounds — feedback at its ordinary default the whole time, no ablation override. CommitmentFidelity
        should rise, consolidate "Dependable," then self-stabilize at a fixed strength.
      </p>
      <div className="button-row">
        <button onClick={() => runTargetEUI()}>Run Target E</button>
      </div>
      {targetEResult && (
        <>
          <p className="panel__hint">
            Final IdentityStrength(CommitmentFidelity)={fmt(targetEResult.finalStrength)}, final IdentityConfidence=
            {fmt(targetEResult.finalConfidence)}, stabilized by round={targetEResult.stabilizedByRound ?? 'still moving'} of{' '}
            {targetEResult.roundsRun}
          </p>
          <FlagRow
            flags={[
              { label: 'Evidence accumulated without any ablation', ok: targetEResult.evidenceAccumulatedWithoutAblation },
              { label: '"Dependable" trait consolidated', ok: targetEResult.traitConsolidated },
            ]}
          />
        </>
      )}

      <h3>Reason Nuclei — Phase 2.97 (Experiments A-N)</h3>
      <p className="panel__hint">
        A new compiler layered in front of the SAME, untouched dice/probability math above: raw pressure now projects
        onto a (MotiveChannel × ReferentKey × MotiveDirection) triple instead of one flat semantic channel, so a
        Decision can express "several independently-intelligible motives about the same person" or "the same motive
        about two different people" without merging reasons that shouldn't merge. Every experiment below builds its
        own scenario internally, always running its Decisions under <code>compilationMode: 'reasonNuclei'</code>
        regardless of the toggle above (which only affects live decisions scripted elsewhere in the app).
      </p>

      <h4>A — Baseline nucleus formation</h4>
      <p className="panel__hint">
        A first-ever Decision, one Need seeded per Option's own subject: exactly one MotiveGenerating nucleus per
        Option, never more, never fewer — the pipeline doesn't manufacture nuclei the scenario's real pressure
        doesn't support.
      </p>
      <div className="button-row">
        <button onClick={() => runReasonNucleusAUI()}>Run Experiment A</button>
      </div>
      {reasonNucleusAResult && (
        <>
          <p className="panel__hint">
            Keep Dinner channels: {reasonNucleusAResult.keepDinnerChannels.join(', ') || '(none)'} · Stay At Work
            channels: {reasonNucleusAResult.stayAtWorkChannels.join(', ') || '(none)'}
          </p>
          <ReasonNucleusTraceTable nuclei={reasonNucleusAResult.trace.get(ACTION_KEEP_DINNER_PROMISE) ?? []} title="Keep Dinner Promise" />
          <ReasonNucleusTraceTable nuclei={reasonNucleusAResult.trace.get(ACTION_STAY_AT_WORK) ?? []} title="Stay At Work" />
          <FlagRow
            flags={[
              { label: "Keep Dinner's referents are all Glen", ok: reasonNucleusAResult.keepDinnerReferentsAreAllGlen },
              { label: "Stay At Work's referents are all Work", ok: reasonNucleusAResult.stayAtWorkReferentsAreAllWork },
              { label: 'No spurious channels formed', ok: reasonNucleusAResult.noSpuriousChannels },
            ]}
          />
        </>
      )}

      <h4>B — Same referent, several motives</h4>
      <p className="panel__hint">
        Glen (Keep Dinner Promise's subject) is seeded with real Connection, Achievement, and Recognition pressure —
        one Option should carry three independently-intelligible nuclei about the SAME referent, a distinction
        Phase 2.95's flat channel consolidation could not preserve.
      </p>
      <div className="button-row">
        <button onClick={() => runReasonNucleusBUI()}>Run Experiment B</button>
      </div>
      {reasonNucleusBResult && (
        <>
          <p className="panel__hint">Distinct motive channels: {reasonNucleusBResult.distinctMotiveChannels.join(', ') || '(none)'}</p>
          <ReasonNucleusTraceTable nuclei={reasonNucleusBResult.keepDinnerNuclei} title="Keep Dinner Promise" />
          <FlagRow
            flags={[
              { label: 'All share Glen as referent', ok: reasonNucleusBResult.allShareGlenAsReferent },
              { label: 'At least three independent nuclei', ok: reasonNucleusBResult.atLeastThreeIndependentNuclei },
            ]}
          />
        </>
      )}

      <h4>C — Same motive, different referents</h4>
      <p className="panel__hint">
        Both Keep Dinner Promise (Glen) and Stay At Work (the Work activity) get a real Connection-mapped
        NeedExpectation — the SAME MotiveChannel on two DIFFERENT referents, which must resolve to two independent
        nuclei rather than one merged one (Central Consolidation is keyed on the full Option/Channel/Referent triple).
      </p>
      <div className="button-row">
        <button onClick={() => runReasonNucleusCUI()}>Run Experiment C</button>
      </div>
      {reasonNucleusCResult && (
        <>
          <p className="panel__hint">
            Keep Dinner's Connection nucleus:{' '}
            {reasonNucleusCResult.keepDinnerConnectionNucleus ? nucleusKeyString(reasonNucleusCResult.keepDinnerConnectionNucleus.key) : '(none)'} · Stay At
            Work's Connection nucleus:{' '}
            {reasonNucleusCResult.stayAtWorkConnectionNucleus ? nucleusKeyString(reasonNucleusCResult.stayAtWorkConnectionNucleus.key) : '(none)'}
          </p>
          <FlagRow
            flags={[
              { label: 'Both present', ok: reasonNucleusCResult.bothPresent },
              { label: 'Referents differ', ok: reasonNucleusCResult.referentsDiffer },
              { label: 'Independent nuclei', ok: reasonNucleusCResult.independentNuclei },
            ]}
          />
        </>
      )}

      <h4>D — Correlated evidence: real dual derivation</h4>
      <p className="panel__hint">
        One retrieved memory legitimately feeds two independently-derived situational signals about the SAME
        (Option, MotiveChannel, Referent) triple, sharing one EvidenceBasis — the Reference Correlation Consolidator
        must treat the second as entirely redundant (Overlap=1) rather than letting it inflate the situational
        modifier.
      </p>
      <div className="button-row">
        <button onClick={() => runCorrelatedEvidenceDUI()}>Run Experiment D</button>
      </div>
      {correlatedEvidenceDResult && (
        <>
          {correlatedEvidenceDResult.nucleus && <CompiledNucleusView nucleus={correlatedEvidenceDResult.nucleus} />}
          <FlagRow
            flags={[
              { label: 'Nudge signal fully overlaps and contributes nothing', ok: correlatedEvidenceDResult.nudgeFullyOverlapsAndContributesNothing },
              { label: 'A naive independent sum would have been larger', ok: correlatedEvidenceDResult.naiveIndependentSumWouldHaveBeenLarger },
            ]}
          />
        </>
      )}

      <h4>E — Correlated evidence: real independent evidence</h4>
      <p className="panel__hint">
        Two separate Keep Dinner Promise choices create two distinct memories with disjoint EvidenceBasis sets — both
        must stack FULLY before bounding, unlike D's fully-redundant case.
      </p>
      <div className="button-row">
        <button onClick={() => runCorrelatedEvidenceEUI()}>Run Experiment E</button>
      </div>
      {correlatedEvidenceEResult && (
        <>
          {correlatedEvidenceEResult.nucleus && <CompiledNucleusView nucleus={correlatedEvidenceEResult.nucleus} />}
          <FlagRow
            flags={[
              { label: 'Both memory signals kept full weight', ok: correlatedEvidenceEResult.bothMemorySignalsKeptFullWeight },
              { label: 'Combined exceeds either alone', ok: correlatedEvidenceEResult.combinedExceedsEitherAlone },
            ]}
          />
        </>
      )}

      <h4>F — Correlated evidence: the brief's own partial-overlap spec</h4>
      <p className="panel__hint">
        The brief's own hand-authored worked example (basis {'{1,2,3}'} vs. {'{3,4,5}'}, magnitudes 5 and 3): a real
        partial overlap (1/5) strictly between D's full redundancy and E's full independence.
      </p>
      <div className="button-row">
        <button onClick={() => runCorrelatedEvidenceFUI()}>Run Experiment F</button>
      </div>
      {correlatedEvidenceFResult && (
        <>
          <p className="panel__hint">
            Overlap={fmt(correlatedEvidenceFResult.overlap, 3)} · First contribution effective=
            {fmt(correlatedEvidenceFResult.firstContribution.effective, 3)} · Second contribution effective=
            {fmt(correlatedEvidenceFResult.secondContribution.effective, 3)}
          </p>
          <FlagRow flags={[{ label: "Matches the brief's spec exactly", ok: correlatedEvidenceFResult.matchesBriefSpecExactly }]} />
        </>
      )}

      <h4>G — Identity as a standing modifier, present vs. ablated</h4>
      <p className="panel__hint">
        A genuinely-bootstrapped WorkPersistence identity gives Stay At Work's already-active 'Achievement' nucleus a
        nonzero standing modifier — ablating that same identity's evidence removes the modifier without touching the
        nucleus's own base motive strength.
      </p>
      <div className="button-row">
        <button onClick={() => runIdentityModifierGUI()}>Run Experiment G</button>
      </div>
      {identityModifierGResult && (
        <>
          <p className="panel__hint">WorkPersistence strength={fmt(identityModifierGResult.workPersistenceStrength, 3)}</p>
          {identityModifierGResult.withIdentityNucleus && (
            <CompiledNucleusView nucleus={identityModifierGResult.withIdentityNucleus} />
          )}
          {identityModifierGResult.withoutIdentityNucleus && (
            <CompiledNucleusView nucleus={identityModifierGResult.withoutIdentityNucleus} />
          )}
          <FlagRow
            flags={[
              { label: 'Both activate on Need alone', ok: identityModifierGResult.bothActivateOnNeedAlone },
              { label: 'Standing modifier present only with identity', ok: identityModifierGResult.standingModifierPresentOnlyWithIdentity },
              { label: 'Base motive strength unaffected by ablation', ok: identityModifierGResult.baseMotiveStrengthUnaffectedByAblation },
            ]}
          />
        </>
      )}

      <h4>H — A modifier cannot create meaning from nothing (closure audit, Check 1 + second correction)</h4>
      <p className="panel__hint">
        Pre-closure-audit finding: CommitmentFidelity's real, nonzero evidence mapped only to the 'Commitment'
        MotiveChannel, which no Need in this scenario generated pressure for — so no 'Commitment'-channel nucleus
        could ever exist. Check 1's original fix (`NEED_COMMITMENT`, a Core Need) was later corrected on review:
        modeling a specific obligation as a Need conflated "an obligation exists" with "an appetite requires
        satisfaction," and referented it to the stakeholder (Glen) rather than the obligation itself. The current
        fix (`model/commitment.ts`, `scenario.ts::defaultCommitments()`) is a real, non-Need `MotiveGenerating`
        source referented to the commitment itself (`COMMITMENT_DINNER_WITH_GLEN`), so the nucleus now exists,
        CommitmentFidelity's ablation leaves its base motive strength untouched, and a genuinely strong
        CommitmentFidelity identity produces a real, nonzero standing modifier on it. The underlying rule still
        holds elsewhere: 'Caregiving' has no Need-sourced source in this scenario, so real, substantial,
        directly-injected Caregiving evidence still forms no nucleus.
      </p>
      <div className="button-row">
        <button onClick={() => runIdentityModifierHUI()}>Run Experiment H</button>
      </div>
      {identityModifierHResult && (
        <>
          <p className="panel__hint">
            CommitmentFidelity strength={fmt(identityModifierHResult.commitmentFidelityStrength, 3)} · Channels that did form:{' '}
            {identityModifierHResult.channelsThatDidForm.join(', ') || '(none)'} · Strong-bootstrap CommitmentFidelity
            strength={fmt(identityModifierHResult.strongCommitmentFidelityStrength, 3)}
          </p>
          <FlagRow
            flags={[
              { label: 'CommitmentFidelity evidence is genuinely nonzero', ok: identityModifierHResult.commitmentFidelityEvidenceIsGenuinelyNonzero },
              { label: "'Commitment'-channel nucleus now exists (Check 1 fix)", ok: identityModifierHResult.commitmentChannelNucleusNowExists },
              { label: 'Commitment base motive strength unaffected by CommitmentFidelity ablation', ok: identityModifierHResult.commitmentBaseMotiveStrengthUnaffectedByAblation },
              { label: 'Caregiving evidence is genuinely nonzero (injected)', ok: identityModifierHResult.caregivingEvidenceIsGenuinelyNonzero },
              { label: "No 'Caregiving'-channel nucleus exists despite real evidence", ok: identityModifierHResult.noCaregivingChannelNucleusExistsDespiteRealEvidence },
              { label: 'Standing modifier is nonzero with a genuinely strong CommitmentFidelity identity (second correction)', ok: identityModifierHResult.commitmentStandingModifierNonzeroWhenIdentityIsStrong },
              { label: 'Commitment nucleus referent is the commitment itself, not the stakeholder', ok: identityModifierHResult.commitmentNucleusReferentIsTheCommitmentItself },
            ]}
          />
        </>
      )}

      <h4>I — Weak-but-genuine motive rescued by a real standing modifier</h4>
      <p className="panel__hint">
        The scenario's own unmodified Glen/Connection seed is real but too weak to clear θ_reason on its own. A real,
        weakly-established SocialApproach identity on the SAME channel rescues the nucleus into existence, at the
        floor d4 base die.
      </p>
      <div className="button-row">
        <button onClick={() => runIdentityModifierIUI()}>Run Experiment I</button>
      </div>
      {identityModifierIResult && (
        <>
          {identityModifierIResult.withSocialApproachNucleus && <CompiledNucleusView nucleus={identityModifierIResult.withSocialApproachNucleus} />}
          <FlagRow
            flags={[
              { label: 'Nucleus absent without identity', ok: identityModifierIResult.nucleusAbsentWithoutIdentity },
              { label: 'Nucleus present and floored (d4) with identity', ok: identityModifierIResult.nucleusPresentAndFlooredWithIdentity },
            ]}
          />
        </>
      )}

      <h4>J — Situational modifiers</h4>
      <p className="panel__hint">
        Need level, NeedExpectation, and identity evidence held byte-identical across two runs — only the retrieval
        set's supportive memory differs. Base motive strength stays identical while the situational modifier
        responds.
      </p>
      <div className="button-row">
        <button onClick={() => runSituationalJUI()}>Run Experiment J</button>
      </div>
      {situationalJResult && (
        <>
          {situationalJResult.noHistoryNucleus && <CompiledNucleusView nucleus={situationalJResult.noHistoryNucleus} />}
          {situationalJResult.supportiveHistoryNucleus && <CompiledNucleusView nucleus={situationalJResult.supportiveHistoryNucleus} />}
          <FlagRow
            flags={[
              { label: 'Memory retrieved only in the supportive run', ok: situationalJResult.memoryRetrievedOnlyInSupportiveRun },
              { label: 'Base motive strength identical', ok: situationalJResult.baseMotiveStrengthIdentical },
              { label: 'Situational modifier differs', ok: situationalJResult.situationalModifierDiffers },
              { label: 'Supportive run has the larger situational modifier', ok: situationalJResult.supportiveRunHasLargerSituationalModifier },
            ]}
          />
        </>
      )}

      <h4>K — Dice grammar richness</h4>
      <p className="panel__hint">
        One Option driven to four simultaneously-active, independent nuclei — the combined dice-pool PMF must be
        EXACTLY the convolution of each nucleus's own distribution, never an approximation.
      </p>
      <div className="button-row">
        <button onClick={() => runDiceRichnessKUI()}>Run Experiment K</button>
      </div>
      {diceRichnessKResult && (
        <>
          <p className="panel__hint">Distinct motive channels: {diceRichnessKResult.distinctMotiveChannels.join(', ') || '(none)'}</p>
          <ReasonNucleusTraceTable nuclei={diceRichnessKResult.nuclei} title="Keep Dinner Promise" />
          <FlagRow
            flags={[
              { label: 'At least four independent nuclei', ok: diceRichnessKResult.atLeastFourIndependentNuclei },
              { label: 'Combined PMF sums to exactly 1', ok: diceRichnessKResult.combinedPmfSumsToExactlyOne },
              { label: 'Combined support matches the additive range', ok: diceRichnessKResult.combinedSupportMatchesAdditiveRange },
            ]}
          />
        </>
      )}

      <h4>L — Calibration sweeps</h4>
      <p className="panel__hint">
        Pure kernel-level sweeps: how much a single +1 integer modifier is worth in win-probability terms at d8,
        versus moving a whole base-die bracket (d8 → d10) — a calibration recommendation, not a psychological
        finding.
      </p>
      <div className="button-row">
        <button onClick={() => runCalibrationLUI()}>Run Experiment L</button>
      </div>
      {calibrationLResult && (
        <>
          <p className="panel__hint">
            One modifier step (d8, +1) shifts P(win) by {fmt(calibrationLResult.oneModifierStepShift, 4)}. One base-die bracket step (d8→d10)
            shifts P(win) by {fmt(calibrationLResult.oneBaseDieBracketShift, 4)}.
          </p>
          <div className="exp-table-wrap">
            <table className="exp-table">
              <thead>
                <tr>
                  <th>Modifier</th>
                  <th>P(with modifier wins)</th>
                </tr>
              </thead>
              <tbody>
                {calibrationLResult.modifierSweepAtD8.map((r) => (
                  <tr key={r.modifier}>
                    <td>{r.modifier >= 0 ? '+' : ''}{r.modifier}</td>
                    <td>{(r.pWithModifierWins.toDisplayNumber() * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="exp-table-wrap">
            <table className="exp-table">
              <thead>
                <tr>
                  <th>Base die</th>
                  <th>P(wins) vs. d8</th>
                </tr>
              </thead>
              <tbody>
                {calibrationLResult.baseDieSweepAgainstD8.map((r) => (
                  <tr key={r.dieFaces}>
                    <td>d{r.dieFaces}</td>
                    <td>{(r.pWins.toDisplayNumber() * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <FlagRow
            flags={[
              {
                label: 'A modifier step is smaller than a bracket step (currently FALSE at defaults — a real calibration finding)',
                ok: calibrationLResult.modifierStepIsSmallerThanBracketStep,
              },
            ]}
          />
        </>
      )}

      <h4>M — Old vs. new compilation, side by side</h4>
      <p className="panel__hint">
        The identical CharacterState/Decision/Seed run through both the frozen legacy pipeline and the new Reason
        Nuclei pipeline — dice counts, probabilities, and trace labels compared directly, never inferred from
        separate runs.
      </p>
      <div className="button-row">
        <button onClick={() => runOldVsNewMUI()}>Run Experiment M</button>
      </div>
      {oldVsNewMResult && (
        <>
          <p className="panel__hint">
            p(Keep Dinner) — legacy: {fmt(oldVsNewMResult.pKeepDinnerLegacy)}, reasonNuclei: {fmt(oldVsNewMResult.pKeepDinnerReasonNuclei)}, delta=
            {fmt(oldVsNewMResult.probabilityDelta)}. Chosen — legacy: {shortLabel(oldVsNewMResult.legacyChosenOption)}, reasonNuclei:{' '}
            {shortLabel(oldVsNewMResult.reasonNucleiChosenOption)}. Mode — legacy: {oldVsNewMResult.legacyResolutionMode}, reasonNuclei:{' '}
            {oldVsNewMResult.reasonNucleiResolutionMode}.
          </p>
          <div className="exp-table-wrap">
            <table className="exp-table">
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Legacy dice</th>
                  <th>Legacy labels</th>
                  <th>ReasonNuclei dice</th>
                  <th>ReasonNuclei labels</th>
                </tr>
              </thead>
              <tbody>
                {oldVsNewMResult.perOption.map((o) => (
                  <tr key={o.option}>
                    <td>{shortLabel(o.option)}</td>
                    <td>{o.legacyDiceCount}</td>
                    <td>{o.legacyInfluenceLabels.map(shortLabel).join(', ') || '(none)'}</td>
                    <td>{o.reasonNucleiDiceCount}</td>
                    <td>{o.reasonNucleiLabels.join(', ') || '(none)'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h4>N — Seed divergence under the Reason Nuclei pipeline</h4>
      <p className="panel__hint">
        Phase 2.9's flagship paired-seed harness, rerun entirely under <code>compilationMode: 'reasonNuclei'</code>:
        two identical timelines, only the RNG seed differs — early rolls, choices, and acquired identity should still
        genuinely diverge, and a later matching decision should still be answered differently.
      </p>
      <div className="button-row">
        <button onClick={() => runSeedDivergenceNUI()}>Run Experiment N</button>
      </div>
      {seedDivergenceNResult && (
        <>
          <RepeatedRunSummary run={seedDivergenceNResult.timelineA} title="Timeline A" />
          <RepeatedRunSummary run={seedDivergenceNResult.timelineB} title="Timeline B" />
          <p className="panel__hint">
            Final IdentityStrength(CommitmentFidelity) — A: {fmt(seedDivergenceNResult.identityStrengthA)}, B:{' '}
            {fmt(seedDivergenceNResult.identityStrengthB)}
          </p>
          <FlagRow
            flags={[
              { label: 'First-round dice rolls differed', ok: seedDivergenceNResult.firstRoundRollsDiffered },
              { label: 'Early decision expressions differed', ok: seedDivergenceNResult.earlyDecisionExpressionsDiffered },
              { label: 'Acquired identities differed', ok: seedDivergenceNResult.acquiredIdentitiesDiffered },
              { label: 'Later probabilities differed', ok: seedDivergenceNResult.laterProbabilitiesDiffered },
            ]}
          />
        </>
      )}
    </section>
  );
}
