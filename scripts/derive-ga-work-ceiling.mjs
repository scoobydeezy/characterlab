/**
 * GA resume step 4: derive a genuine whole-model work ceiling.
 *
 * GENERAL_ATTENTION_PAUSE_CHECKPOINT_2026_09_13 warns: "67 templates is not an
 * event-count ceiling. Inherited source/prediction stages and repeated rank/owner
 * invocations must be included." GA_COMPOSED_LOGICAL_TOPOLOGY_REV2 carries
 * wholeModelWorkCeiling: null.
 *
 * This derives the GA-LOCAL bound from the composed logical graph. It is a lower bound
 * on the whole-model ceiling, not the ceiling: inherited stages live in other manifests
 * and are enumerated below as the remaining addend.
 *
 * Three structures make a naive per-template count wrong:
 *   joins        two stages declare "exactly one join" over several parents
 *   replacements two stages "Replace X iff ..." and are mutually exclusive with X
 *   gated edges  18 conditional edges are disjoint from the 48 `next` edges
 *
 * Pure graph analysis. Allocates nothing, writes one receipt, modifies no source.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const TOPOLOGY = 'docs/planning/GA_COMPOSED_LOGICAL_TOPOLOGY_REV2.json';
const OUT = 'docs/planning/GA_WORK_CEILING_REV1.json';
const t = JSON.parse(fs.readFileSync(TOPOLOGY, 'utf8'));
const stages = t.stages, S = Object.fromEntries(stages.map(s => [s.name, s]));

const JOIN = new Set(['retained-attribution', 'significance-join']);
const REPLACE = {'prior-concern-visual-encoding': 'current-visual-encoding',
                 'prior-concern-event-rank': 'current-event-rank'};

const key = (a, b) => JSON.stringify([a, b]);
const edges = new Map();
const bump = (a, b) => edges.set(key(a, b), (edges.get(key(a, b)) ?? 0) + 1);
for (const s of stages) for (const n of s.next ?? []) bump(s.name, typeof n === 'string' ? n : n.to);
const nextOnly = new Set(edges.keys());
for (const e of t.conditionalEdges) bump(e.from, e.to);
for (const k of edges.keys()) assert.ok(S[JSON.parse(k)[1]], 'edge to unknown stage');
assert.equal(edges.size, nextOnly.size + t.conditionalEdges.length);

const preds = {};
for (const [k, mult] of edges) {const [a, b] = JSON.parse(k); (preds[b] ??= []).push([a, mult]);}
const order = [], seen = new Set();
function visit(u) {if (seen.has(u)) return; seen.add(u); for (const [a] of preds[u] ?? []) visit(a); order.push(u);}
for (const u of Object.keys(S)) visit(u);
for (const [k] of edges) {const [a, b] = JSON.parse(k); assert.ok(order.indexOf(a) < order.indexOf(b), 'cycle');}

function invocations(lane) {
  const inv = {};
  for (const u of order) {
    if (u in REPLACE && !lane) {inv[u] = 0; continue;}
    if (Object.values(REPLACE).includes(u) && lane) {inv[u] = 0; continue;}
    const p = preds[u] ?? [];
    if (!p.length) inv[u] = 1;
    else if (JOIN.has(u)) inv[u] = p.some(([a]) => inv[a] > 0) ? 1 : 0;
    else inv[u] = p.reduce((sum, [a, k]) => sum + inv[a] * k, 0);
  }
  return inv;
}
const summarize = lane => {
  const inv = invocations(lane);
  const byPhase = {}, outputsByPhase = {};
  let events = 0, outputs = 0;
  for (const [n, c] of Object.entries(inv)) {
    events += c; outputs += c * (S[n].outputs?.length ?? 0);
    byPhase[S[n].phase] = (byPhase[S[n].phase] ?? 0) + c;
    outputsByPhase[S[n].phase] = (outputsByPhase[S[n].phase] ?? 0) + c * (S[n].outputs?.length ?? 0);
  }
  const peak = Object.entries(byPhase).sort((a, b) => b[1] - a[1])[0];
  return {events, outputs, byPhase, outputsByPhase, peakPhase: {phase: Number(peak[0]), events: peak[1]},
          repeated: Object.entries(inv).filter(([, c]) => c > 1).sort((a, b) => b[1] - a[1]).map(([n, c]) => ({stage: n, invocations: c})),
          inactive: Object.entries(inv).filter(([, c]) => c === 0).map(([n]) => n)};
};

const baseline = summarize(false), priorConcern = summarize(true);
const inv = invocations(false);
const joinDetail = [...JOIN].sort().map(j => ({
  join: j, parentCompletions: (preds[j] ?? []).reduce((s, [a, k]) => s + inv[a] * k, 0), invocations: inv[j]}));
const naiveOvercount = joinDetail.reduce((s, j) => s + j.parentCompletions - j.invocations, 0);
const trueRoots = order.filter(n => !(preds[n] ?? []).length).length;

assert.equal(stages.length, 67);
assert.equal(t.wholeModelWorkCeiling, null);
assert.ok(baseline.events > stages.length);
assert.equal(baseline.events, 80);
assert.equal(baseline.peakPhase.phase, 130);
assert.equal(baseline.events, priorConcern.events);
assert.equal(baseline.outputs, priorConcern.outputs);
assert.notDeepEqual(baseline.inactive, priorConcern.inactive);
for (const j of joinDetail) {assert.ok(j.parentCompletions > j.invocations); assert.equal(j.invocations, 1);}

const fp = p => ({path: p, sha256: createHash('sha256').update(fs.readFileSync(p)).digest('hex')});
fs.writeFileSync(OUT, JSON.stringify({
  status: 'DERIVED - GA-local work bound; whole-model ceiling still requires the inherited addend',
  resumeStep: 'GENERAL_ATTENTION_PAUSE_CHECKPOINT_2026_09_13 step 4',
  topologyVersion: t.version,
  topologyDeclaresCeiling: t.wholeModelWorkCeiling,
  method: {
    graph: {stages: stages.length, nextEdges: nextOnly.size, conditionalEdges: t.conditionalEdges.length, totalEdges: edges.size, acyclic: true, trueRoots},
    joinSemantics: 'Stages whose gate says "exactly one join" are invoked once however many parents complete.',
    replacementSemantics: 'Stages whose gate says "Replace X iff ..." are mutually exclusive with X; both lanes are evaluated.',
    conditionalEdgesAreDisjoint: 'The 18 conditional edges share no pair with the 48 next edges, so a graph built from next alone misclassifies every gated child as an externally scheduled root and reports 26 roots instead of 12.'},
  gaLocalBound: {baselineLane: baseline, priorConcernReplacementLane: priorConcern},
  joinConvergence: joinDetail,
  findings: [
    'The checkpoint warning is confirmed with a number: the GA-local maximum is ' + baseline.events + ' stage invocations in one instant against ' + stages.length + ' templates, a gap of ' + (baseline.events - stages.length) + ' driven by repeated rank and owner invocations exactly as predicted.',
    'Nine stages are invoked more than once; ordinary-memory-formation, event-presentation-owner and event-presentation-dispatch each reach four invocations.',
    'Phase ' + baseline.peakPhase.phase + ' is the busiest at ' + baseline.peakPhase.events + ' invocations, with phase 140 next; any per-phase budget must be sized on those two rather than on an average.',
    'Both declared joins converge genuinely: ' + joinDetail.map(j => j.join + ' takes ' + j.parentCompletions + ' parent completions to ' + j.invocations + ' invocation').join('; ') + '. Summing per parent would overcount by ' + naiveOvercount + '.',
    'The prior-concern replacement lane is work-neutral: identical event and output totals, differing only in which stages are inactive. The concern feedback path therefore does not enlarge the work budget, which is useful to have established before registration binds it.',
    'Building the graph from next alone yields 26 apparent roots; merging the disjoint conditional edges gives ' + trueRoots + '. An analysis that misses that distinction both misplaces the roots and undercounts the fan-out.'],
  remainingAddendForWholeModelCeiling: [
    'Inherited Campaign 2 cognitive stages, which have their own committed work accounting.',
    'Inherited measurement-prediction stages.',
    'Inherited EMB receiving stages.',
    'Any repeated invocation of an inherited stage caused by GA fan-out, counted at GA multiplicity rather than at the inherited manifest multiplicity.',
    'Runtime slot accounting, a separate budget from events and outputs that cannot be derived from this graph.'],
  limits: [
    'GA-LOCAL ONLY. A lower bound on the whole-model ceiling, not the ceiling. Do not freeze a ModelIdentity or a work budget against this number alone.',
    'Derived from the composed logical topology, not from an executed run. Registration may add or merge stages, which changes it.',
    'Events and outputs only. Runtime slots require the runtime.',
    'Allocates nothing, promotes nothing, qualifies nothing. General Attention remains OPEN.'],
  sources: [TOPOLOGY, 'scripts/derive-ga-work-ceiling.mjs'].filter(p => fs.existsSync(p)).map(fp),
}, null, 2) + '\n');

console.log(JSON.stringify({templates: stages.length, gaLocalMaxEvents: baseline.events,
  gaLocalMaxOutputs: baseline.outputs, peakPhase: baseline.peakPhase, trueRoots,
  replacementLaneWorkNeutral: baseline.events === priorConcern.events,
  joinOvercountAvoided: naiveOvercount, repeated: baseline.repeated.slice(0, 4)}, null, 2));
