import {createBatchRun, type BatchJob, type BatchRunView, type InspectableBatchRun} from './experimentRegistry';

export const BATCH_VERSION = 'workbench-batch/0.9';
export const BATCH_LIMITS = Object.freeze({jobs: 990, prefixesPerJob: 33, simultaneousRuns: 1});
export interface BatchPrefix extends BatchRunView {expectedSaveHash: string; matchesFrozenSave: boolean;}
export interface BatchResult {job: BatchJob; status: 'queued' | 'running' | 'complete' | 'failed'; prefixes: BatchPrefix[]; error?: string;}
export interface BatchSnapshot {
  version: string; status: 'idle' | 'running' | 'paused' | 'complete' | 'failed';
  current: number; results: BatchResult[];
  retention: string;
}
type Factory = (job: BatchJob) => Promise<InspectableBatchRun>;
const copy = <T,>(value: T): T => structuredClone(value);
const hash = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{64}$/.test(v);
export class BatchSession {
  #snapshot: BatchSnapshot; #factory: Factory; #run?: InspectableBatchRun;
  #busy = false; #stop = false; #listeners = new Set<() => void>();
  constructor(jobs: readonly BatchJob[], factory: Factory = createBatchRun) {
    if (!jobs.length || jobs.length > BATCH_LIMITS.jobs || new Set(jobs.map(j => j.id)).size !== jobs.length) throw Error(`Batch requires 1–${BATCH_LIMITS.jobs} uniquely identified jobs`);
    for (const job of jobs) {
      if ((job.seedHex !== undefined && (job.experimentId !== 'general' || !hash(job.seedHex))) || typeof job.id !== 'string' || job.id.length > 160 || typeof job.name !== 'string' || job.name.length > 160 || !['values', 'reason', 'epi', 'learn', 'belief', 'affect', 'decision', 'commit', 'work', 'skill', 'habit', 'social', 'relationship', 'long', 'general'].includes(job.experimentId) || !Number.isInteger(job.seed) || job.seed < 0 || job.seed > 255 || !(typeof job.law === 'number' && Number.isFinite(job.law) || typeof job.law === 'string' && job.law.length <= 80) || job.appraisal !== undefined && (typeof job.appraisal !== 'string' || job.appraisal.length > 80) || job.expectedSaveHashes.length < 1 || job.expectedSaveHashes.length > BATCH_LIMITS.prefixesPerJob || !job.expectedSaveHashes.every(hash)) throw Error('Invalid bounded batch job');
    }
    this.#factory = factory;
    this.#snapshot = {version: BATCH_VERSION, status: 'idle', current: 0, results: jobs.map(job => ({job: copy(job), status: 'queued', prefixes: []})), retention: 'Exact profile/program references and every prefix hash are retained. Raw traces are omitted explicitly from this summary; inspect or replay the original program through its adapter.'};
  }
  snapshot() {return copy(this.#snapshot);}
  subscribe(listener: () => void) {this.#listeners.add(listener); return () => {this.#listeners.delete(listener);};}
  #emit() {for (const listener of this.#listeners) listener();}
  pause() {this.#stop = true;}
  #record(result: BatchResult, view: BatchRunView) {
    const previous = result.prefixes.at(-1);
    if (view.prefix !== result.prefixes.length || view.total !== result.job.expectedSaveHashes.length - 1 || view.complete !== (view.prefix === view.total) || typeof view.clock !== 'string' || view.clock.length > 80 || ![view.modelHash, view.runHash, view.stateHash, view.saveHash].every(hash) || previous && (previous.modelHash !== view.modelHash || previous.runHash !== view.runHash)) throw Error('Adapter prefix or identity contract mismatch');
    const expectedSaveHash = result.job.expectedSaveHashes[view.prefix];
    result.prefixes.push({...copy(view), expectedSaveHash, matchesFrozenSave: view.saveHash === expectedSaveHash});
    if (view.saveHash !== expectedSaveHash) throw Error(`Frozen save mismatch at prefix ${view.prefix}`);
  }
  async run() {
    if (this.#busy) throw Error('Batch command already in flight');
    if (this.#snapshot.status === 'failed') throw Error('Failed batches are immutable; create a new batch to retry');
    if (this.#snapshot.status === 'complete') return;
    this.#busy = true; this.#stop = false; this.#snapshot.status = 'running'; this.#emit();
    try {
      while (this.#snapshot.current < this.#snapshot.results.length) {
        if (this.#stop) {this.#snapshot.status = 'paused'; break;}
        const result = this.#snapshot.results[this.#snapshot.current];
        result.status = 'running';
        if (!this.#run) {this.#run = await this.#factory(copy(result.job)); this.#record(result, this.#run.view()); this.#emit();}
        while (!this.#run.view().complete && !this.#stop) {
          if (!await this.#run.advance()) throw Error('Adapter stopped before the declared horizon');
          this.#record(result, this.#run.view()); this.#emit();
          // Yield between public commits so pause and other UI work can be handled.
          await new Promise(resolve => setTimeout(resolve, 0));
        }
        if (this.#run.view().complete) {
          if (await this.#run.advance()) throw Error('Adapter advanced beyond the declared horizon');
          const terminal = this.#run.view();
          const last = result.prefixes.at(-1)!;
          if ((['prefix', 'total', 'complete', 'clock', 'modelHash', 'runHash', 'stateHash', 'saveHash'] as const).some(k => terminal[k] !== last[k])) throw Error('Terminal call changed the committed view');
          result.status = 'complete'; this.#snapshot.current++; this.#run = undefined; this.#emit();
        }
        if (this.#stop && this.#snapshot.current < this.#snapshot.results.length) {this.#snapshot.status = 'paused'; break;}
      }
      if (this.#snapshot.current === this.#snapshot.results.length) this.#snapshot.status = 'complete';
    } catch (error) {
      this.#snapshot.status = 'failed';
      const result = this.#snapshot.results[this.#snapshot.current];
      result.status = 'failed'; result.error = error instanceof Error ? error.message.slice(0, 2000) : String(error).slice(0, 2000);
      this.#run = undefined;
    } finally {this.#busy = false; this.#emit();}
  }
}
