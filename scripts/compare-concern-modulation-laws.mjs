/**
 * OD-C3-001 obligation 1: the shape-different Candidate B comparator.
 *
 * Ruling 2026-09-14 accepted `residual × (1−q)` / `ω_A = 1+q` as Candidate A only, and
 * requires at least one materially different modulation SHAPE — thresholded/gated or
 * saturating, not a recalibrated `1+q/2` — before General Attention treats the
 * modulation law as settled.
 *
 * Candidate B (saturating), selected locally under the escalation policy:
 *     f(q) = q/(1+q)                      <- the architecture's OWN accepted bounded
 *                                            response (EAM-1 / boundedEncodingResponse)
 *     residualPool = residual × (1 − f(q))  = residual/(1+q)
 *     ω_A          = 1 + f(q)
 *
 * B is A with q replaced by the project's existing bounded response. It introduces no
 * new mathematics, no free parameter and no new psychological state. Same q ∈ [0,1],
 * same source and cross-instant join, same eligibility and K; only the shape differs.
 *
 * Measured at both consumers of the feedback:
 *   residualPool -> peripheral spatial allocation (allocateSpatialContext)
 *   ω_A          -> associative-pull weight in retrieval ranking (rankAccessibleEpisodes)
 *
 * Pure arithmetic. No identity, canonical record, allocation, record type, public
 * ingress or state writer. Reads accepted kernels only; writes one receipt.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';

const OUT = 'docs/planning/CONCERN_MODULATION_COMPARISON_REV1.json';
const server = await createServer({configFile: false, server: {middlewareMode: true, preTransformRequests: false}, optimizeDeps: {noDiscovery: true, include: []}, appType: 'custom'});
try {
  const m = await server.ssrLoadModule('/src/campaign3/encodingAccessMath.ts');
  const spatial = await server.ssrLoadModule('/src/campaign3/spatialContextAllocation.ts');
  const {ExactRational: Q} = await server.ssrLoadModule('/src/substrate/exactMath');
  const q = (n, d = 1) => Q.of(BigInt(n), BigInt(d));
  const str = x => `${x.numerator}/${x.denominator}`;
  const one = q(1), zero = q(0);

  const RESIDUAL = q(1, 5);                                  // MEC-005 residual pool
  const QS = [[0, 1], [1, 4], [1, 2], [2, 3], [3, 4], [1, 1]];

  // ---- the two laws ----
  const A = qv => ({residualPool: RESIDUAL.multiply(one.subtract(qv)), omegaA: one.add(qv)});
  const B = qv => {const f = m.boundedEncodingResponse(qv); return {residualPool: RESIDUAL.multiply(one.subtract(f)), omegaA: one.add(f)};};
  const LAWS = {'candidate-a-linear': A, 'candidate-b-saturating': B};

  // ---- consumer 1: peripheral spatial allocation ----
  const CAL = {minX: 0n, maxX: 1n, minY: 0n, maxY: 1n, focalWeight: q(1)};
  const DETECTIONS = [
    {detectionId: 0n, position: {x: 0n, y: 0n}},   // focal
    {detectionId: 1n, position: {x: 5n, y: 5n}},   // peripheral
    {detectionId: 2n, position: {x: 6n, y: 6n}},   // peripheral
  ];
  const allocate = pool => spatial.allocateSpatialContext(DETECTIONS, {...CAL, residualPool: pool})
    .filter(r => r.spatialClass === 'SpatialPeripheral').map(r => str(r.allocation));

  // ---- consumer 2: retrieval ranking ----
  // Recent-but-unassociated X versus old-but-associated Y. As omega_A rises, Y overtakes X.
  const NOW = 10n;
  const EPISODES = [
    {key: 'x-recent', retainedKeys: ['kx'], presentations: [NOW - 1n]},   // base 1/2
    {key: 'y-associated', retainedKeys: ['ky'], presentations: [NOW - 3n]}, // base 1/4
  ];
  const ACTIVATION = new Map([['kx', q(1, 10)], ['ky', q(1, 4)]]);
  const RANK = {lambda: one, exponent: 1, omegaB: one, k: 1};
  const rank = omegaA => {
    const r = m.rankAccessibleEpisodes(EPISODES, ACTIVATION, NOW, {...RANK, omegaA});
    return {top: r.selected[0].key, scores: Object.fromEntries(r.scored.map(s => [s.key, str(s.score)]))};
  };

  const results = {};
  for (const [name, law] of Object.entries(LAWS)) {
    results[name] = QS.map(([n, d]) => {
      const qv = q(n, d), out = law(qv);
      return {
        q: str(qv),
        residualPool: str(out.residualPool),
        omegaA: str(out.omegaA),
        peripheralAllocation: allocate(out.residualPool),
        retrieval: rank(out.omegaA),
      };
    });
  }

  // ---- analysis ----
  const neutral = name => results[name][0];
  const identicalAtNeutral = JSON.stringify(neutral('candidate-a-linear')) === JSON.stringify(neutral('candidate-b-saturating'));
  const flipPoint = name => results[name].find(r => r.retrieval.top === 'y-associated')?.q ?? null;
  const divergentInterior = QS.slice(1).some(([n, d]) => {
    const i = QS.findIndex(([a, b]) => a === n && b === d);
    return results['candidate-a-linear'][i].residualPool !== results['candidate-b-saturating'][i].residualPool;
  });

  // ---- claims ----
  // C1 identical at the declared neutral point q=0.
  assert.equal(identicalAtNeutral, true);
  // C2 materially different inside (0,1] at the allocation consumer.
  assert.equal(divergentInterior, true);
  // C3 the endpoint claims A freezes and B declines: A zeroes the pool and doubles
  //    omega_A at q=1; B leaves half the pool and reaches 3/2.
  const aEnd = results['candidate-a-linear'].at(-1), bEnd = results['candidate-b-saturating'].at(-1);
  assert.equal(aEnd.residualPool, '0/1'); assert.equal(aEnd.omegaA, '2/1');
  assert.equal(bEnd.residualPool, '1/10'); assert.equal(bEnd.omegaA, '3/2');
  // C4 BEHAVIOURAL DIVERGENCE: A flips the retrieval ranking inside (0,1]; B never does.
  //    The exact crossover is omega_A* = 5/3, i.e. q = 2/3 for A. At exactly that point
  //    the two scores TIE and the canonical key tie-break keeps the recency winner, so
  //    the observed flip is at the next sampled q. This boundary is recorded, not smoothed.
  const tie = results['candidate-a-linear'].find(r => r.q === '2/3');
  assert.equal(tie.omegaA, '5/3');
  assert.equal(tie.retrieval.scores['x-recent'], tie.retrieval.scores['y-associated']);
  assert.equal(tie.retrieval.top, 'x-recent');
  assert.equal(flipPoint('candidate-a-linear'), '3/4');
  assert.equal(flipPoint('candidate-b-saturating'), null);
  // C5 peripheral encoding is not merely scaled: A extinguishes it, B never does.
  assert.deepEqual(aEnd.peripheralAllocation, ['0/1', '0/1']);
  assert.deepEqual(bEnd.peripheralAllocation, ['1/20', '1/20']);

  const fp = p => ({path: p, sha256: createHash('sha256').update(fs.readFileSync(p)).digest('hex')});
  fs.writeFileSync(OUT, JSON.stringify({
    status: 'EXECUTED — Candidate A versus Candidate B modulation shapes, component scope',
    obligation: 'OD-C3-001 obligation 1 (ruling 2026-09-14): a shape-different comparator',
    selectedLocally: 'Candidate B chosen under CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md; it changes modulation shape only and introduces no new psychological state or causal mechanism, so it does not return for a ruling.',
    candidates: {
      'candidate-a-linear': 'residualPool = residual × (1 − q); ω_A = 1 + q. Accepted first named candidate; implemented in src/campaign3/priorConcernFeedback.ts. Unchanged by this comparison.',
      'candidate-b-saturating': 'f(q) = q/(1+q) is the architecture\'s own accepted bounded response (EAM-1). residualPool = residual × (1 − f(q)) = residual/(1+q); ω_A = 1 + f(q). No new mathematics, no free parameter, no new state.',
    },
    shapeDifferenceArgument: 'B is A with q replaced by the project\'s existing bounded response, so the difference is functional form and not calibration: A is linear in q and reaches its endpoints exactly, B saturates and never does. A recalibrated 1+q/2 would have been rejected as a calibration change.',
    declaredDomain: {
      residual: str(RESIDUAL), q: QS.map(([n, d]) => `${n}/${d}`),
      neutralPoint: '0/1',
      allocationConsumer: 'allocateSpatialContext with focalWeight 1, one focal and two peripheral detections in an 8×8 cell grid',
      retrievalConsumer: 'rankAccessibleEpisodes, lambda 1, exponent 1, omegaB 1, K 1, now 10; x-recent base 1/2 pull 1/10; y-associated base 1/4 pull 1/4',
    },
    results,
    analysis: {
      identicalAtNeutralPoint: identicalAtNeutral,
      divergentInsideInterval: divergentInterior,
      retrievalCrossover: {
        exactOmegaAStar: '5/3',
        'candidate-a-linear': {reachesCrossover: true, crossoverAtQ: '2/3', tieAtCrossover: true, tieResolvedBy: 'canonical key order, preserving the recency winner', firstSampledFlipAtQ: flipPoint('candidate-a-linear')},
        'candidate-b-saturating': {reachesCrossover: false, maximumOmegaA: '3/2', firstSampledFlipAtQ: flipPoint('candidate-b-saturating')},
      },
      endpointBehaviour: {
        'candidate-a-linear': 'q=1 extinguishes the peripheral pool entirely (0/1) and doubles associative pull weight (2/1)',
        'candidate-b-saturating': 'q=1 halves the peripheral pool (1/10 of a 1/5 residual) and reaches ω_A 3/2; neither endpoint is attained',
      },
    },
    findings: [
      'The two shapes are identical at the declared neutral point q=0 and diverge throughout (0,1], as the ruling requires of a comparator.',
      'The divergence is behaviourally visible, not merely numeric: Candidate A reverses the retrieval ranking inside (0,1], promoting an older associated episode over a more recent unassociated one, while Candidate B never reverses it at any q. Same input, same source, same eligibility and K.',
      'The exact crossover is omega_A* = 5/3. Candidate A attains it precisely at q = 2/3, where the two episode scores are exactly equal and the canonical key tie-break preserves the recency winner; the flip is therefore observed from the next sampled q. Candidate B tops out at omega_A = 3/2 and cannot reach the crossover at any q. That B fails to reach it is a property of the shape, not of the sampling.',
      'The candidates encode different psychological claims at the extreme. A says maximal concern abolishes peripheral encoding and doubles associative pull. B says peripheral attention is suppressed but never extinguished and associative pull saturates. Neither is currently earned.',
      'The retrieval consumer is where the modulation law bites hardest: ω_A is the associative-pull weight in RetrievalScore = ω_B·Base + ω_A·pull, so the shape of the concern coupling directly determines whether mood-congruent retrieval can overtake recency.',
    ],
    limits: [
      'Pure arithmetic at component scope. No identity, canonical record, allocation, record type, public ingress, state writer or corpus promotion. src/campaign3/priorConcernFeedback.ts is unmodified.',
      'This establishes that the modulation SHAPE is load-bearing and that Candidate A is not the only admissible law. It does NOT establish which shape is psychologically correct — that needs an accepted downstream observable, which remains BLOCKED on the encoding-strength and retrieval-probe seams.',
      'One residual value, one detection geometry, one two-episode retrieval fixture. The flip point 2/3 is specific to this fixture and is not a general threshold.',
      'Candidate B is a comparator, not a proposal to replace Candidate A. Promoting either to a registered component with an allocation is separate work.',
      'PHEN-ATTN-001 receives no PASS from this comparison; per VER-C3-ATTN-001 its encoding-footprint clause and later retrieval probe remain BLOCKED.',
    ],
    sources: ['src/campaign3/encodingAccessMath.ts', 'src/campaign3/spatialContextAllocation.ts',
      'docs/planning/CAMPAIGN3_PENDING_OWNER_DECISIONS.md', 'scripts/compare-concern-modulation-laws.mjs']
      .filter(p => fs.existsSync(p)).map(fp),
  }, null, 2) + '\n');

  console.log(JSON.stringify({
    identicalAtNeutral, divergentInsideInterval: divergentInterior,
    retrievalFlip: {A: flipPoint('candidate-a-linear'), B: flipPoint('candidate-b-saturating')},
    endpointPool: {A: aEnd.residualPool, B: bEnd.residualPool},
    endpointOmegaA: {A: aEnd.omegaA, B: bEnd.omegaA},
  }, null, 2));
} finally {
  await server.close();
}
