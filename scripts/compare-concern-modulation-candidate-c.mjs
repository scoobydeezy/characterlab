/**
 * OD-C3-002 obligation: develop and compare a decoupled Candidate C.
 *
 * Owner design ruling 2026-09-14, after VER-C3-CONCERN-001 showed modulation shape is
 * behaviourally load-bearing: neither A nor B is accepted as the law. The eventual law
 * must satisfy qualitative constraints, and — the architectural finding — **encoding
 * suppression and retrieval amplification are separate effects and need not share one
 * transfer function**. A and B both conflated them.
 *
 *   Candidate A (linear):      E(q) = 1 − q          R(q) = q
 *   Candidate B (saturating):  E(q) = 1 − f(q)       R(q) = f(q)          [one curve, shared]
 *   Candidate C (decoupled):   E(q) = 1 − f(q)       R(q) = f(g·q)        [two curves]
 *
 * where f(x) = x/(1+x) is the architecture's own accepted bounded response (EAM-1).
 * C takes B's encoding arm unchanged and gives the retrieval arm an independent gain.
 * B is exactly C at g=1; A is the linear limit. No new psychological state, no new
 * mechanism, same q ∈ [0,1], same source, join, eligibility and K.
 *
 * Pure arithmetic. Writes one receipt; modifies no source.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';

const OUT = 'docs/planning/CONCERN_MODULATION_CANDIDATE_C_REV1.json';
const server = await createServer({configFile: false, server: {middlewareMode: true, preTransformRequests: false}, optimizeDeps: {noDiscovery: true, include: []}, appType: 'custom'});
try {
  const m = await server.ssrLoadModule('/src/campaign3/encodingAccessMath.ts');
  const spatial = await server.ssrLoadModule('/src/campaign3/spatialContextAllocation.ts');
  const {ExactRational: Q} = await server.ssrLoadModule('/src/substrate/exactMath');
  const q = (n, d = 1) => Q.of(BigInt(n), BigInt(d));
  const str = x => `${x.numerator}/${x.denominator}`;
  const one = q(1), zero = q(0);
  const f = x => m.boundedEncodingResponse(x);

  const RESIDUAL = q(1, 5);
  const GAIN = 3n;                                   // first declared retrieval gain for C
  const QS = [[0, 1], [1, 4], [1, 2], [2, 3], [3, 4], [1, 1]];
  const CROSSOVER = q(5, 3);                          // ω_A* demonstrated by VER-C3-CONCERN-001

  const CANDIDATES = {
    'candidate-a-linear':      {E: v => one.subtract(v),        R: v => v},
    'candidate-b-saturating':  {E: v => one.subtract(f(v)),     R: v => f(v)},
    'candidate-c-decoupled':   {E: v => one.subtract(f(v)),     R: v => f(q(GAIN).multiply(v))},
  };

  // consumers, identical to VER-C3-CONCERN-001
  const CAL = {minX: 0n, maxX: 1n, minY: 0n, maxY: 1n, focalWeight: one};
  const DETECTIONS = [{detectionId: 0n, position: {x: 0n, y: 0n}}, {detectionId: 1n, position: {x: 5n, y: 5n}}, {detectionId: 2n, position: {x: 6n, y: 6n}}];
  const peripheral = pool => spatial.allocateSpatialContext(DETECTIONS, {...CAL, residualPool: pool}).filter(r => r.spatialClass === 'SpatialPeripheral').map(r => str(r.allocation));
  const NOW = 10n;
  const EPISODES = [{key: 'x-recent', retainedKeys: ['kx'], presentations: [NOW - 1n]}, {key: 'y-associated', retainedKeys: ['ky'], presentations: [NOW - 3n]}];
  const ACTIVATION = new Map([['kx', q(1, 10)], ['ky', q(1, 4)]]);
  const rank = omegaA => m.rankAccessibleEpisodes(EPISODES, ACTIVATION, NOW, {lambda: one, exponent: 1, omegaB: one, omegaA, k: 1}).selected[0].key;

  const results = {};
  for (const [name, law] of Object.entries(CANDIDATES)) {
    results[name] = QS.map(([n, d]) => {
      const v = q(n, d), E = law.E(v), R = law.R(v), omegaA = one.add(R), pool = RESIDUAL.multiply(E);
      return {q: str(v), E: str(E), R: str(R), omegaA: str(omegaA), residualPool: str(pool),
              peripheralAllocation: peripheral(pool), retrievalTop: rank(omegaA),
              omegaAReachesCrossover: omegaA.compare(CROSSOVER) >= 0};
    });
  }

  // ---- constraint satisfaction against the owner's qualitative ruling ----
  const mono = (xs, dir) => xs.every((_, i) => i === 0 || (dir === 'down' ? xs[i].compare(xs[i - 1]) <= 0 : xs[i].compare(xs[i - 1]) >= 0));
  const constraints = {};
  for (const [name, law] of Object.entries(CANDIDATES)) {
    const vs = QS.map(([n, d]) => q(n, d));
    const Es = vs.map(law.E), Rs = vs.map(law.R);
    const maxOmega = one.add(Rs.at(-1));
    constraints[name] = {
      'C1 E(0)=1 baseline at neutral':              Es[0].equals(one),
      'C2 E monotonically decreasing':              mono(Es, 'down'),
      'C3 E(1)>0 concern does not annihilate':      Es.at(-1).compare(zero) > 0,
      'C4 R(0)=0 baseline at neutral':              Rs[0].equals(zero),
      'C5 R monotonically increasing':              mono(Rs, 'up'),
      'C6 omega_A can pass the crossover by q=1':   maxOmega.compare(CROSSOVER) >= 0,
      'C7 both arms bounded (R<=1, E in [0,1])':    Rs.every(r => r.compare(one) <= 0) && Es.every(e => e.compare(zero) >= 0 && e.compare(one) <= 0),
      satisfiesAll: false,
    };
    constraints[name].satisfiesAll = Object.entries(constraints[name]).filter(([k]) => k.startsWith('C')).every(([, v]) => v === true);
  }

  // ---- sensitivity: the gain tunes WHEN reordering becomes possible, and E is untouched ----
  const gainSweep = [1n, 2n, 3n, 4n, 6n].map(g => {
    const R = v => f(q(g).multiply(v));
    const firstReordering = QS.map(([n, d]) => q(n, d)).find(v => rank(one.add(R(v))) === 'y-associated');
    return {gain: g.toString(), omegaAAtQ1: str(one.add(R(one))), firstReorderingAtQ: firstReordering ? str(firstReordering) : null,
            EAtQ1: str(one.subtract(f(one))), equivalentTo: g === 1n ? 'candidate-b-saturating' : null};
  });

  // ---- the headline comparative: peripheral encoding retained where reordering occurs ----
  const atReordering = {};
  for (const name of Object.keys(CANDIDATES)) {
    const row = results[name].find(r => r.retrievalTop === 'y-associated');
    atReordering[name] = row ? {q: row.q, omegaA: row.omegaA, peripheralPoolRetained: row.E, residualPool: row.residualPool} : null;
  }

  // ---- claims ----
  // A fails the encoding constraint; B fails the retrieval constraint; C satisfies all.
  assert.equal(constraints['candidate-a-linear']['C3 E(1)>0 concern does not annihilate'], false);
  assert.equal(constraints['candidate-a-linear']['C6 omega_A can pass the crossover by q=1'], true);
  assert.equal(constraints['candidate-b-saturating']['C3 E(1)>0 concern does not annihilate'], true);
  assert.equal(constraints['candidate-b-saturating']['C6 omega_A can pass the crossover by q=1'], false);
  assert.equal(constraints['candidate-c-decoupled'].satisfiesAll, true);
  assert.equal(constraints['candidate-a-linear'].satisfiesAll, false);
  assert.equal(constraints['candidate-b-saturating'].satisfiesAll, false);
  // C and A reorder retrieval at the same q, but C retains far more peripheral encoding.
  assert.equal(atReordering['candidate-a-linear'].q, atReordering['candidate-c-decoupled'].q);
  assert.equal(atReordering['candidate-a-linear'].peripheralPoolRetained, '1/4');
  assert.equal(atReordering['candidate-c-decoupled'].peripheralPoolRetained, '4/7');
  assert.equal(atReordering['candidate-b-saturating'], null);
  // The gain moves the reordering threshold while leaving the encoding arm identical.
  assert.equal(new Set(gainSweep.map(g => g.EAtQ1)).size, 1);
  assert.equal(gainSweep.find(g => g.gain === '1').firstReorderingAtQ, null);
  assert.equal(gainSweep.find(g => g.gain === '6').firstReorderingAtQ, '1/2');

  const fp = p => ({path: p, sha256: createHash('sha256').update(fs.readFileSync(p)).digest('hex')});
  fs.writeFileSync(OUT, JSON.stringify({
    status: 'EXECUTED — decoupled Candidate C developed and compared against A and B',
    obligation: 'OD-C3-002 (owner design ruling 2026-09-14): develop the next serious candidate locally under the stated qualitative constraints and compare it against A/B',
    verdictEntry: 'VER-C3-CONCERN-002',
    architecturalFinding: 'Encoding suppression and retrieval amplification are separate consequences of the same concern state and need not share one transfer function. A and B both conflated them by construction; C separates them. B is exactly C at gain 1, and A is the linear limit, so the three form one family rather than three unrelated proposals.',
    candidates: {
      'candidate-a-linear': 'E(q) = 1 − q; R(q) = q. Fails C3: E(1) = 0 annihilates peripheral encoding.',
      'candidate-b-saturating': 'E(q) = 1 − f(q); R(q) = f(q), one shared curve. Fails C6: ω_A tops out at 3/2, below the demonstrated crossover 5/3, so it can never reorder retrieval.',
      'candidate-c-decoupled': `E(q) = 1 − f(q); R(q) = f(${GAIN}·q). Separate transfer functions. Satisfies all seven constraints.`,
    },
    declaredDomain: {
      boundedResponse: 'f(x) = x/(1+x), the accepted EAM-1 response; no new mathematics',
      retrievalGain: GAIN.toString(), residual: str(RESIDUAL), q: QS.map(([n, d]) => `${n}/${d}`),
      demonstratedCrossover: str(CROSSOVER),
      crossoverProvenance: 'ω_A* = 5/3 established by VER-C3-CONCERN-001 on this same fixture; it is a property of the fixture, not a general threshold',
      consumers: 'identical to VER-C3-CONCERN-001 — allocateSpatialContext for the encoding arm, rankAccessibleEpisodes for the retrieval arm',
    },
    results, constraintSatisfaction: constraints, peripheralRetainedAtReordering: atReordering, retrievalGainSensitivity: gainSweep,
    findings: [
      'Candidate A fails the owner constraint that generic maximum concern must not force the incidental pool to exact zero. Candidate B fails the constraint that strong concern must be capable of reordering retrieval against recency. Each fails a different constraint, which is why neither is the law.',
      'Candidate C satisfies all seven constraints, and does so by decoupling rather than by finding a better compromise curve. It takes B\'s encoding arm unchanged and gives the retrieval arm an independent gain.',
      'The decisive comparative: A and C reorder retrieval at the SAME q = 3/4, but A has only 1/4 of the peripheral pool left at that point while C retains 4/7 — roughly 2.3× as much. The behaviour the North Star wants is obtainable without A\'s extreme encoding claim.',
      'The retrieval gain moves the reordering threshold while leaving the encoding arm bit-identical across every gain tested: gain 1 (= Candidate B) never reorders, gain 3 reorders at q = 3/4, gain 6 at q = 1/2, and E(1) = 1/2 throughout. That is the decoupling doing exactly the work it was introduced for, and it makes the gain an interpretable quantity — the concern level at which concern-congruent recall can overtake recency.',
      'The constraints are therefore jointly satisfiable, which was not obvious in advance: it was possible that requiring both non-annihilating encoding and crossover-capable retrieval would need a new mechanism. It does not.',
    ],
    limits: [
      'Pure arithmetic at component scope. No identity, canonical record, allocation, record type, public ingress, state writer or corpus promotion. src/campaign3/priorConcernFeedback.ts is unmodified.',
      'C satisfies the owner\'s qualitative constraints; it is NOT thereby the accepted law. The gain 3 is a first declared constant, not a calibration result, and neither arm\'s curve family is earned.',
      'Which curve family is psychologically correct still needs an accepted downstream observable, BLOCKED on the encoding-strength and retrieval-probe seams.',
      'The crossover 5/3 is a property of this two-episode fixture. A richer retrieval fixture moves it and could change which gains satisfy C6.',
      'A and B are preserved as comparators per the ruling, not retired.',
      'TaskConcern remains un-qualified as the general Affect representation; a later affect model may modulate these two arms differently, which is an argument for keeping them separate rather than for freezing this family.',
      'PHEN-ATTN-001 receives no PASS from this comparison.',
    ],
    sources: ['src/campaign3/encodingAccessMath.ts', 'src/campaign3/spatialContextAllocation.ts',
      'docs/planning/CAMPAIGN3_PENDING_OWNER_DECISIONS.md', 'scripts/compare-concern-modulation-candidate-c.mjs']
      .filter(p => fs.existsSync(p)).map(fp),
  }, null, 2) + '\n');

  console.log(JSON.stringify({
    satisfiesAllConstraints: Object.fromEntries(Object.entries(constraints).map(([k, v]) => [k, v.satisfiesAll])),
    failedConstraint: {A: 'C3 E(1)>0', B: 'C6 crossover reachable', C: 'none'},
    peripheralRetainedAtReordering: Object.fromEntries(Object.entries(atReordering).map(([k, v]) => [k, v ? `${v.peripheralPoolRetained} at q=${v.q}` : 'never reorders'])),
    gainSweep: gainSweep.map(g => `g=${g.gain}: reorders at ${g.firstReorderingAtQ ?? 'never'}, E(1)=${g.EAtQ1}`),
  }, null, 2));
} finally {
  await server.close();
}
