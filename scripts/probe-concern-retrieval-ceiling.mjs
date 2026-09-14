/**
 * Robustness probe for VER-C3-CONCERN-002's constraint C6.
 *
 * C6 ("omega_A must be able to pass the demonstrated retrieval crossover by q=1") was
 * evaluated against ONE two-episode fixture whose crossover happened to be 5/3. If the
 * crossover is a property of the fixture rather than of the law, C6 is not a real
 * constraint and the Candidate C result is fixture-specific.
 *
 * This sweeps fixture difficulty to produce a range of crossovers and asks, for each,
 * which candidates can reorder retrieval at any q <= 1. It also checks whether raising
 * the retrieval gain without bound rescues the hard cases, and whether the effect
 * survives K > 1 selection over more episodes.
 *
 * Pure arithmetic. Writes one receipt; modifies no source.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';

const OUT = 'docs/planning/CONCERN_RETRIEVAL_CEILING_REV1.json';
const server = await createServer({configFile: false, server: {middlewareMode: true, preTransformRequests: false}, optimizeDeps: {noDiscovery: true, include: []}, appType: 'custom'});
try {
  const m = await server.ssrLoadModule('/src/campaign3/encodingAccessMath.ts');
  const {ExactRational: Q} = await server.ssrLoadModule('/src/substrate/exactMath');
  const q = (n, d = 1) => Q.of(BigInt(n), BigInt(d));
  const str = x => `${x.numerator}/${x.denominator}`;
  const one = q(1);
  const f = x => m.boundedEncodingResponse(x);

  const QS = [[0,1],[1,4],[1,2],[2,3],[3,4],[1,1]].map(([n,d]) => q(n,d));
  const LAWS = {
    'A-linear':  v => one.add(v),
    'B (= C g=1)': v => one.add(f(v)),
    'C g=3':     v => one.add(f(q(3).multiply(v))),
    'C g=10':    v => one.add(f(q(10).multiply(v))),
    'C g=100':   v => one.add(f(q(100).multiply(v))),
  };

  // Fixture family: base gap fixed at 1/4 (x at now-1 -> 1/2, y at now-3 -> 1/4);
  // the pull gap is varied to place the crossover omega* at a target value.
  const NOW = 10n;
  const PULL_X = q(1, 10);
  const TARGETS = [[6,5],[3,2],[5,3],[2,1],[5,2],[3,1]];
  const fixtures = TARGETS.map(([tn, td]) => {
    const target = q(tn, td), gap = q(1, 4).divide(target), pullY = PULL_X.add(gap);
    return {crossover: str(target), pullX: str(PULL_X), pullY: str(pullY), _pullY: pullY};
  });

  const reorders = (pullY, omegaAof) => {
    const episodes = [{key: 'x-recent', retainedKeys: ['kx'], presentations: [NOW - 1n]},
                      {key: 'y-associated', retainedKeys: ['ky'], presentations: [NOW - 3n]}];
    const activation = new Map([['kx', PULL_X], ['ky', pullY]]);
    const hit = QS.find(v => m.rankAccessibleEpisodes(episodes, activation, NOW,
      {lambda: one, exponent: 1, omegaB: one, omegaA: omegaAof(v), k: 1}).selected[0].key === 'y-associated');
    return hit ? str(hit) : null;
  };

  const sweep = fixtures.map(fx => ({
    crossover: fx.crossover, pullY: fx.pullY,
    reordersAtQ: Object.fromEntries(Object.entries(LAWS).map(([n, law]) => [n, reorders(fx._pullY, law)])),
  }));

  // ---- the structural ceiling ----
  const ceiling = Object.fromEntries(Object.entries(LAWS).map(([n, law]) => [n, str(law(one))]));

  // ---- K>1 over four episodes: is the effect a top-1 artifact? ----
  const wide = (() => {
    const episodes = [
      {key: 'a-newest',   retainedKeys: ['ka'], presentations: [NOW - 1n]},
      {key: 'b-newish',   retainedKeys: ['kb'], presentations: [NOW - 2n]},
      {key: 'c-old',      retainedKeys: ['kc'], presentations: [NOW - 5n]},
      {key: 'd-oldest',   retainedKeys: ['kd'], presentations: [NOW - 8n]},
    ];
    const activation = new Map([['ka', q(1,20)], ['kb', q(1,10)], ['kc', q(2,5)], ['kd', q(9,20)]]);
    const sel = (omegaA, k) => m.rankAccessibleEpisodes(episodes, activation, NOW,
      {lambda: one, exponent: 1, omegaB: one, omegaA, k}).selected.map(s => s.key);
    return {k: 2, byLaw: Object.fromEntries(Object.entries(LAWS).map(([n, law]) =>
      [n, QS.map(v => ({q: str(v), selected: sel(law(v), 2)}))]))};
  })();

  // ---- claims ----
  // S1 the whole family is capped at omega_A = 2; only A attains it, and only at q=1.
  assert.equal(ceiling['A-linear'], '2/1');
  for (const n of ['B (= C g=1)', 'C g=3', 'C g=10', 'C g=100']) {
    const c = Q.of(...ceiling[n].split('/').map(BigInt));
    assert.ok(c.compare(q(2)) < 0, `${n} must stay strictly below 2`);
  }
  // S2 raising the gain without bound does NOT rescue a crossover at or above 2.
  const hard = sweep.find(s => s.crossover === '2/1');
  assert.ok(Object.values(hard.reordersAtQ).every(v => v === null), 'no law may reorder at crossover 2');
  const harder = sweep.filter(s => ['5/2','3/1'].includes(s.crossover));
  for (const h of harder) assert.ok(Object.values(h.reordersAtQ).every(v => v === null));
  // S3 C6 is genuinely fixture-relative: easy fixtures are reorderable by every law.
  const easy = sweep.find(s => s.crossover === '6/5');
  assert.ok(Object.values(easy.reordersAtQ).every(v => v !== null), 'every law reorders an easy fixture');
  // S4 the original 5/3 fixture sits in the band where the decoupling matters.
  const original = sweep.find(s => s.crossover === '5/3');
  assert.equal(original.reordersAtQ['B (= C g=1)'], null);
  assert.equal(original.reordersAtQ['A-linear'], '3/4');
  assert.equal(original.reordersAtQ['C g=3'], '3/4');
  // S5 the effect is not a top-1 artifact: the K=2 selected SET changes with q under A.
  const aWide = wide.byLaw['A-linear'];
  assert.notDeepEqual(aWide[0].selected, aWide.at(-1).selected);

  const fp = p => ({path: p, sha256: createHash('sha256').update(fs.readFileSync(p)).digest('hex')});
  fs.writeFileSync(OUT, JSON.stringify({
    status: 'EXECUTED — robustness probe of constraint C6 across fixture difficulty',
    motivation: 'VER-C3-CONCERN-002 evaluated C6 against a single fixture whose crossover was 5/3. This tests whether that constraint is a property of the law or of the fixture.',
    relatesTo: ['VER-C3-CONCERN-001', 'VER-C3-CONCERN-002', 'OD-C3-002'],
    declaredDomain: {
      baseGap: '1/4 (x-recent at now−1 → base 1/2; y-associated at now−3 → base 1/4)',
      pullX: str(PULL_X), crossoverTargets: TARGETS.map(([n, d]) => `${n}/${d}`),
      q: QS.map(str), lambda: '1', exponent: 1, omegaB: '1', now: NOW.toString(),
      crossoverFormula: 'omega* = (base_x − base_y) / (pull_y − pull_x)',
    },
    structuralCeiling: {
      omegaAAtQ1: ceiling,
      statement: 'R(q) = f(g·q) is bounded above by 1 for every gain, so omega_A = 1 + R is bounded above by 2 across the entire candidate family. A attains 2 exactly at q=1; every C attains it only in the limit of infinite gain. No member can exceed it.',
    },
    fixtureSweep: sweep,
    wideSelection: wide,
    findings: [
      'C6 is fixture-relative, as suspected. Every law reorders an easy fixture (crossover 6/5); no law reorders a hard one (crossover 2/1 or above). The constraint is only discriminating in the band between.',
      'The family has a hard structural ceiling of omega_A = 2, because R = f(g·q) is bounded by 1 for every gain. Raising the gain to 10 or 100 does not rescue a crossover at or above 2 — the limit is the bounded response itself, not the calibration.',
      'Candidate A is the unique member that ATTAINS the ceiling, and it does so precisely by paying E(1) = 0. Within this family, maximum retrieval amplification and non-annihilating encoding are in direct tension at the boundary; the decoupling buys a strictly interior region, not an escape from the trade.',
      'The original 5/3 fixture sits inside the discriminating band, so VER-C3-CONCERN-002 is not vacuous: B genuinely cannot reorder it and A and C genuinely can. The conclusion stands for fixtures in that band and only there.',
      'The effect is not an artifact of top-1 selection: over four episodes at K=2 the selected SET changes with q, so concern reorders membership and not merely the winner.',
    ],
    consequences: [
      'C6 must be restated as fixture-relative before it can serve as an acceptance criterion. "omega_A can pass THE crossover" is not well-formed; "omega_A can pass the crossover of a declared corpus fixture" is.',
      'If a required phenomenon ever needs reordering against a recency advantage whose crossover is at or above 2, no member of this family can supply it, and the bounded-response choice for R — not the gain — is what must be revisited.',
      'That is a question about the bound on R, which OD-C3-002 constraint C7 requires to be bounded but does not fix the value of. A family with R bounded by 2 (omega_A <= 3) is a different family and a legitimate future comparator.',
    ],
    limits: [
      'Pure arithmetic at component scope. No identity, canonical record, allocation, record type, public ingress, state writer or corpus promotion. No source modified.',
      'One base-gap value and one pull-x value; the crossover was varied only through pull-y. Varying lambda, the decay exponent or presentation counts would move the bases and is untested.',
      'This probe changes no verdict. It bounds the scope of VER-C3-CONCERN-002 rather than contradicting it.',
      'PHEN-ATTN-001 receives no PASS.',
    ],
    sources: ['src/campaign3/encodingAccessMath.ts', 'scripts/probe-concern-retrieval-ceiling.mjs'].filter(p => fs.existsSync(p)).map(fp),
  }, null, 2) + '\n');

  console.log('omega_A ceiling at q=1:', JSON.stringify(ceiling));
  console.log('\ncrossover | ' + Object.keys(LAWS).map(k => k.padStart(11)).join(' |'));
  for (const s of sweep) console.log(`${s.crossover.padStart(9)} | ` + Object.keys(LAWS).map(k => String(s.reordersAtQ[k] ?? '—').padStart(11)).join(' |'));
  console.log('\n(cell = first q at which retrieval reorders; — = never)');
} finally {
  await server.close();
}
