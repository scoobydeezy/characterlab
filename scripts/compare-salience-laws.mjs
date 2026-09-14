/**
 * Work-order item 1 (CAMPAIGN3_WORK_ORDER_2026_09_14.md): GENERAL_ATTENTION_CLOSURE_PLAN
 * closure obligation #2, executed as a pure arithmetic comparison.
 *
 * Compares the four encoding-allocation laws already implemented in
 * encoding-access-math/0.1-candidate (EAM-2) under declared interventions:
 *   EXP-007  causal role      — does focal evidence change focal encoding?
 *   EXP-015  semantic footprint — does irrelevant co-tag count change focal encoding,
 *                                the focal association edge, or total learned mass?
 *
 * Measures at three levels, because they do not agree:
 *   (1) z_focal                      — the allocation output
 *   (2) focal association edge       — what reaches learning, swept over quantization scale
 *   (3) total row mass + overflow    — how much associative budget the event consumes
 *
 * No identities, canonical records, public ingress, state ownership, allocation or
 * record types. Reads the kernel only; writes one receipt.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';

const OUT = 'docs/planning/SALIENCE_LAW_COMPARISON_REV1.json';
const LAWS = ['independent', 'historical-shared', 'historical-hybrid', 'retired-flat'];
const FOOTPRINTS = [1, 2, 4, 8];
const SCALES = [100n, 10000n, 1000000n];

const server = await createServer({configFile: false, server: {middlewareMode: true}, appType: 'custom'});
try {
  const m = await server.ssrLoadModule('/src/campaign3/encodingAccessMath.ts');
  const {ExactRational: Q} = await server.ssrLoadModule('/src/substrate/exactMath.ts');
  const q = (n, d = 1) => Q.of(BigInt(n), BigInt(d));
  const str = x => `${x.numerator}/${x.denominator}`;
  const zero = q(0), one = q(1);

  const FOCAL = {base: q(3, 10), role: one, attention: one, need: q(1, 2), surprise: zero, alphaN: one, alphaS: zero};
  const ROLES = {Cause: one, Target: q(9, 10), Incidental: q(1, 5)};
  const POOL = q(1, 5), BUDGET = q(1, 5), THRESHOLD = q(1, 5), ETA = one;
  const labels = n => ['focal', ...Array.from({length: n}, (_, i) => `irrelevant${String(i).padStart(2, '0')}`)];
  const focalRaw = role => m.encodingRaw({...FOCAL, role});
  const irrelevantRaw = attention =>
    m.encodingRaw({base: q(3, 10), role: ROLES.Incidental, attention, need: zero, surprise: zero, alphaN: one, alphaS: zero});

  /** Encode focal + n irrelevant co-tags. `conserved` splits MEC-005's residual pool across them. */
  function encode(law, n, regime, role = one) {
    const attention = regime === 'conserved' ? m.residualAttention(POOL, n) : POOL;
    const raw = [focalRaw(role), ...Array.from({length: n}, () => irrelevantRaw(attention))];
    return m.encodingBudget(labels(n), raw, law, BUDGET, THRESHOLD);
  }
  function associate(law, n, scale, regime = 'conserved') {
    const z = encode(law, n, regime), ls = labels(n);
    const r = m.associationCandidate(ls, ls.map(() => ls.map(() => zero)), z, {scale, eta: ETA, lambda: zero, elapsed: zero});
    return {
      zIrrelevant: str(z[1]),
      focalEdge: str(r.values[0][1]),
      rowMass: r.rows[0].mass.reduce((a, b) => a + b, 0n).toString(),
      rowMassOfScale: str(Q.of(r.rows[0].mass.reduce((a, b) => a + b, 0n), scale)),
      overflowed: r.rows[0].overflow,
    };
  }

  // ---------- Level 1: z_focal ----------
  const allocation = {};
  for (const regime of ['conserved', 'unconserved']) {
    allocation[regime] = {};
    for (const law of LAWS) {
      const series = [0, ...FOOTPRINTS].map(n => ({n, zFocal: str(encode(law, n, regime)[0])}));
      allocation[regime][law] = {series, focalInvariantUnderFootprint: series.every(s => s.zFocal === series[0].zFocal)};
    }
  }

  // ---------- Level 1b: causal role (EXP-007) ----------
  const roleResponse = {};
  for (const law of LAWS) {
    const series = Object.entries(ROLES).map(([name, value]) => ({role: name, roleFactor: str(value), zFocal: str(encode(law, 2, 'conserved', value)[0])}));
    const distinct = new Set(series.map(s => s.zFocal)).size;
    roleResponse[law] = {series, roleSensitive: distinct === series.length, distinctOutcomes: distinct};
  }

  // ---------- Level 2: focal association edge, swept over quantization scale ----------
  const edge = {};
  for (const scale of SCALES) {
    edge[scale.toString()] = Object.fromEntries(LAWS.map(law => {
      const series = FOOTPRINTS.map(n => ({n, focalEdge: associate(law, n, scale).focalEdge}));
      return [law, {series, allZero: series.every(s => s.focalEdge === '0/1'), invariant: series.every(s => s.focalEdge === series[0].focalEdge)}];
    }));
  }

  // ---------- Level 3: total associative mass consumed, and budget saturation ----------
  const MASS_SCALE = 1000000n;
  const mass = Object.fromEntries(LAWS.map(law => {
    const series = FOOTPRINTS.map(n => ({n, ...associate(law, n, MASS_SCALE)}));
    const values = series.map(s => BigInt(s.rowMass));
    const spread = values.reduce((a, b) => a > b ? a : b) - values.reduce((a, b) => a < b ? a : b);
    const peak = values.reduce((a, b) => a > b ? a : b);
    return [law, {
      series,
      saturatesBudget: values.every(v => v === MASS_SCALE),
      overflowsFromFootprint: series.find(s => s.overflowed)?.n ?? null,
      peakMassOfScale: str(Q.of(peak, MASS_SCALE)),
      // Reported exactly rather than hidden behind a threshold. Bound is 2% of peak,
      // which is above the observed worst case (independent, 40/3720 = 1.08%).
      spreadOverPeak: str(Q.of(spread, peak)),
      massConservedAcrossFootprint: values.every(v => v !== MASS_SCALE) && spread * 50n <= peak,
    }];
  }));

  const signature = law => JSON.stringify([
    allocation.conserved[law].series, allocation.unconserved[law].series, roleResponse[law].series,
    SCALES.map(s => edge[s.toString()][law].series), mass[law].series,
  ]);
  const pairs = [];
  for (let i = 0; i < LAWS.length; i++) for (let j = i + 1; j < LAWS.length; j++)
    pairs.push({a: LAWS[i], b: LAWS[j], distinguishable: signature(LAWS[i]) !== signature(LAWS[j])});

  // ---------- Claims the verdict rests on ----------
  // A1 allocation-level footprint invariance holds for independent and hybrid, not shared.
  assert.equal(allocation.conserved['independent'].focalInvariantUnderFootprint, true);
  assert.equal(allocation.unconserved['independent'].focalInvariantUnderFootprint, true);
  assert.equal(allocation.conserved['historical-hybrid'].focalInvariantUnderFootprint, true);
  assert.equal(allocation.unconserved['historical-shared'].focalInvariantUnderFootprint, false);
  // A2 retired-flat carries no focal evidence: role-blind. Every other law is role-sensitive.
  assert.equal(roleResponse['retired-flat'].roleSensitive, false);
  assert.equal(roleResponse['retired-flat'].distinctOutcomes, 1);
  for (const law of LAWS.filter(l => l !== 'retired-flat')) assert.equal(roleResponse[law].roleSensitive, true);
  // A3 the D=100 all-zero independent edge is a quantization-floor artifact, not an invariance.
  assert.equal(edge['100']['independent'].allZero, true);
  assert.equal(edge['10000']['independent'].allZero, false);
  // A4 at resolving scale NO law has a footprint-invariant focal edge. The 1/n per-edge
  //    dependence is therefore not specific to the retired control.
  for (const law of LAWS) assert.equal(edge['1000000'][law].invariant, false);
  // A5 the real RET-001 defect: flat saturates the whole associative budget at every
  //    footprint and overflows from n=2; the three derived laws conserve total mass.
  assert.equal(mass['retired-flat'].saturatesBudget, true);
  assert.equal(mass['retired-flat'].overflowsFromFootprint, 2);
  for (const law of LAWS.filter(l => l !== 'retired-flat')) {
    assert.equal(mass[law].saturatesBudget, false);
    assert.equal(mass[law].massConservedAcrossFootprint, true);
    assert.equal(mass[law].overflowsFromFootprint, null);
  }
  // A6 historical EXP-015 witness: flat tagging caps the focal edge at exactly 1/2 at n=2.
  assert.equal(associate('retired-flat', 2, 100n).focalEdge, '1/2');
  // A7 no merger is available on this domain.
  assert.ok(pairs.every(p => p.distinguishable));

  const fp = p => ({path: p, sha256: createHash('sha256').update(fs.readFileSync(p)).digest('hex')});
  fs.writeFileSync(OUT, JSON.stringify({
    status: 'EXECUTED — four-law arithmetic comparison at component scope',
    contract: 'encoding-access-math/0.1-candidate (EAM-2), unchanged and not reopened',
    obligation: 'GENERAL_ATTENTION_CLOSURE_PLAN.md closure obligation #2',
    workOrder: 'CAMPAIGN3_WORK_ORDER_2026_09_14.md item 1',
    verdictEntry: 'VER-C3-SALIENCE-001',
    provenanceNote: 'Re-run from the repository root to regenerate this receipt with the complete source fingerprint set; the sources list fingerprints only files present at run time.',
    laws: LAWS,
    declaredDomain: {
      focalEvidence: 'base 3/10, attention 1, need 1/2, alphaN 1, surprise 0; raw = 9/20 at Cause',
      roles: Object.fromEntries(Object.entries(ROLES).map(([k, v]) => [k, str(v)])),
      residualPool: str(POOL), budget: str(BUDGET), threshold: str(THRESHOLD), eta: str(ETA),
      footprints: FOOTPRINTS, quantizationScales: SCALES.map(String), massScale: MASS_SCALE.toString(),
      attentionRegimes: {
        conserved: 'MEC-005 residual pool split across n incidental units; total incidental attention fixed',
        unconserved: 'each incidental unit holds the full pool value; total incidental attention grows with n',
      },
    },
    level1_allocation: allocation,
    level1b_roleResponse: roleResponse,
    level2_associationEdge: edge,
    level3_totalMassAndSaturation: mass,
    pairwiseDistinguishability: pairs,
    findings: [
      'Allocation-level footprint invariance (independent, hybrid) does NOT confer learning-level footprint invariance. At resolving quantization no law has a footprint-invariant focal edge.',
      'The ~1/n per-edge dependence is common to all four laws and is therefore not the RET-001 defect. For the three derived laws it follows from a conserved attentional resource divided among n partners, which is the intended behaviour.',
      'The RET-001 defect is budget saturation: flat tagging consumes 100% of the associative row budget at every footprint and overflows from n=2, so total learned mass carries no information about the focal evidence. The three derived laws hold total mass essentially constant and evidence-proportional.',
      'MEC-005 residual-pool conservation is load-bearing for MEC-007 shared allocation: shared z_focal degrades monotonically with footprint only in the unconserved regime.',
      'A quantization-floor artifact is visible and is reported rather than suppressed: at D=100 the independent focal edge is zero at every footprint, which reads as invariance and is not.',
    ],
    limits: [
      'Pure arithmetic. No identity, canonical record, allocation, record type, public ingress, state writer, source admission or corpus promotion.',
      'Establishes which laws are behaviourally distinguishable, and isolates the retired control. Does NOT establish which of the three derived laws is psychologically correct — that needs the encoding -> later-retrieval probe, BLOCKED on its own seam.',
      'MEC-005 stays CONTROL+CONTRACT; MEC-007/CTL-004 stay CONTROL; MEC-008 stays CONTROL with its sole-writer and largest-remainder invariants; RET-001 stays retired, executable only as this named negative comparison.',
      'One focal evidence vector, one incidental profile, one prior graph (empty), eta=1, no decay. Richer priors, several focal units and nonzero decay are untested.',
      'A hard top-K selector still does not establish a continuous salience law; the bounded public ATTN profile is unchanged.',
    ],
    sources: ['src/campaign3/encodingAccessMath.ts', 'docs/formal/ENCODING_ACCESS_MATH.md',
      'docs/planning/GENERAL_ATTENTION_CLOSURE_PLAN.md', 'scripts/compare-salience-laws.mjs']
      .filter(p => fs.existsSync(p)).map(fp),
  }, null, 2) + '\n');

  console.log(JSON.stringify({
    roleSensitive: Object.fromEntries(LAWS.map(l => [l, roleResponse[l].roleSensitive])),
    allocationFootprintInvariant: Object.fromEntries(LAWS.map(l => [l, allocation.conserved[l].focalInvariantUnderFootprint])),
    edgeFootprintInvariantAtD1e6: Object.fromEntries(LAWS.map(l => [l, edge['1000000'][l].invariant])),
    saturatesBudget: Object.fromEntries(LAWS.map(l => [l, mass[l].saturatesBudget])),
    massConserved: Object.fromEntries(LAWS.map(l => [l, mass[l].massConservedAcrossFootprint])),
    peakMassOfBudget: Object.fromEntries(LAWS.map(l => [l, mass[l].peakMassOfScale])),
    massSpreadOverPeak: Object.fromEntries(LAWS.map(l => [l, mass[l].spreadOverPeak])),
    allPairsDistinguishable: pairs.every(p => p.distinguishable),
  }, null, 2));
} finally {
  await server.close();
}
