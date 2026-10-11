/** Versioned diagnostic capabilities; none of these objects is simulation authority. */
export const EXPERIMENT_REGISTRY_VERSION = 'workbench-experiments/0.4';
export type ExperimentId = 'values' | 'reason' | 'general' | 'epi';
export type BatchExperimentId = Exclude<ExperimentId, 'general' | 'epi'>;
export interface InspectionCapabilities {
  committedStep: {supported: true; boundary: string};
  checkpoint: {supported: true; authentication: string};
  runtimeIntervention: {supported: false; reason: string};
  graph: {supported: boolean; reason: string};
  matrix: {supported: boolean; reason: string};
  explanation: {supported: boolean; scope: string; qualification: string};
}
export interface ExperimentDescriptor {
  id: ExperimentId; label: string; seamVersion: string; corpusScope: string;
  capabilities: InspectionCapabilities;
}
const noIntervention = {supported: false as const, reason: 'The public contract admits original inputs on a fresh run; it exposes no runtime intervention ingress.'};
const checkpoint = {supported: true as const, authentication: 'Exact public save, original inputs, model, seed and complete prefix.'};
export const EXPERIMENTS: readonly ExperimentDescriptor[] = [
  {id: 'values', label: 'Values integration', seamVersion: 'values-integration-public/0.1-candidate', corpusScope: 'Values integrated qualification successor', capabilities: {
    committedStep: {supported: true, boundary: 'One whole instant, including all 13 native stages.'}, checkpoint, runtimeIntervention: noIntervention,
    graph: {supported: false, reason: 'This profile does not expose a memory or belief graph.'}, matrix: {supported: false, reason: 'This profile has no embedding or matrix representation.'},
    explanation: {supported: true, scope: 'Recorded Values evaluation factors', qualification: 'Native parity verified; complete language audit remains open.'},
  }},
  {id: 'reason', label: 'Joined reasoning', seamVersion: 'reason-public/0.3-candidate', corpusScope: 'PHEN-REASON-001, bounded joined-source qualification', capabilities: {
    committedStep: {supported: true, boundary: 'One whole training or probe instant; probes do not draw decisions.'}, checkpoint, runtimeIntervention: noIntervention,
    graph: {supported: false, reason: 'Source provenance is available, but this profile has no memory or belief graph.'}, matrix: {supported: false, reason: 'This profile has no embedding or matrix representation.'},
    explanation: {supported: true, scope: 'Recorded source roles, overlap, grouping and rejection', qualification: 'Native parity verified; complete language audit remains open.'},
  }},
  {id: 'general', label: 'General attention · graph inspection', seamVersion: 'rules/campaign3-general-attention/0.1-candidate', corpusScope: 'General-attention association inspection; two recipes qualified, corpus mapping incomplete', capabilities: {
    committedStep: {supported: true, boundary: 'One whole public instant; worker-owned execution.'}, checkpoint, runtimeIntervention: noIntervention,
    graph: {supported: true, reason: 'Actual directed Record625 association cells; layout distance is diagnostic.'}, matrix: {supported: true, reason: 'Exact association matrix and three selected target columns; no personality embedding.'},
    explanation: {supported: false, scope: 'Raw committed reads, diffs and outputs only', qualification: 'No observer-safe narrative renderer qualified for this profile.'},
  }},
  {id: 'epi', label: 'EPI · evidence boundary', seamVersion: 'epi-public/0.1-candidate', corpusScope: 'PHEN-EPI-001; 72 frozen public programs', capabilities: {committedStep: {supported: true, boundary: 'One whole native instant.'}, checkpoint, runtimeIntervention: noIntervention, graph: {supported: false, reason: 'This profile has belief and encoding leaves, no graph.'}, matrix: {supported: false, reason: 'No native matrix representation.'}, explanation: {supported: true, scope: 'Safe-profile encoding descriptions only', qualification: 'epi-encoding-explanation/0.1; frozen 72-program audit. Violating controls suppressed; full decision narrative remains unqualified.'}}},
];
export interface BatchRunView {
  prefix: number; total: number; complete: boolean; clock: string;
  modelHash: string; runHash: string; stateHash: string; saveHash: string;
}
export interface InspectableBatchRun {
  advance(): Promise<boolean>;
  view(): BatchRunView;
}
export interface BatchJob {
  id: string; experimentId: BatchExperimentId; name: string; seed: number;
  law: string | number; appraisal?: string;
  expectedSaveHashes: string[];
}
/** The common transport intentionally exposes no mutable runtime or private evaluator. */
export async function createBatchRun(job: BatchJob): Promise<InspectableBatchRun> {
  if (job.experimentId === 'values') {
    const [{ValuesWorkbenchRun}, {default: fixtures}] = await Promise.all([import('./valuesAdapter'), import('./valuesFixtures.json')]);
    const fixture = fixtures.cases.find(f => f.name === job.name);
    if (!fixture) throw Error('Unknown Values batch program');
    // Adapter ingress performs the contract's strict profile/frame validation.
    const run = await ValuesWorkbenchRun.create({profile: {law: job.law, appraisal: job.appraisal, seed: job.seed}, frames: fixture.frames} as Parameters<typeof ValuesWorkbenchRun.create>[0]);
    return {advance: () => run.advance(), view: () => {const s = run.snapshot(); return {prefix: s.prefix, total: 4, complete: s.prefix === 4, clock: s.clock, modelHash: s.modelHash, runHash: s.runHash, stateHash: s.stateHash, saveHash: s.saveHash};}};
  }
  if (job.experimentId === 'reason') {
    const {ReasonWorkbenchRun} = await import('./reasonAdapter');
    const run = await ReasonWorkbenchRun.create({law: Number(job.law), name: job.name, seed: job.seed});
    return {advance: () => run.advance(), view: () => {const {prefix, total, complete, clock, modelHash, runHash, stateHash, saveHash} = run.snapshot(); return {prefix, total, complete, clock, modelHash, runHash, stateHash, saveHash};}};
  }
  throw Error('Unsupported batch experiment');
}
