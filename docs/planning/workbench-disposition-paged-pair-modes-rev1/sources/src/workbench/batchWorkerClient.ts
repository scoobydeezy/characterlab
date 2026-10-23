import {BatchSession, type BatchSnapshot} from './batchSession';
import type {BatchJob} from './experimentRegistry';
import type {BatchWorkerRequest, BatchWorkerResponse} from './batchWorkerProtocol';
/** A dedicated worker owns the batch. Only detached diagnostic summaries cross to React. */
export class BatchWorkerClient {
  #worker: Worker; #snapshot: BatchSnapshot; #listeners = new Set<() => void>();
  #busy = false; #disposed = false; #failed = false; #pauseRequested = false; #next = 0;
  #pending = new Map<number, {resolve: () => void; reject: (error: Error) => void}>();
  #ready: Promise<void>; #readyResolve!: () => void; #readyReject!: (e: Error) => void;
  constructor(jobs: readonly BatchJob[]) {
    // Synchronous validation bounds ingress before the worker is created.
    this.#snapshot = new BatchSession(jobs).snapshot();
    this.#ready = new Promise((resolve, reject) => {this.#readyResolve = resolve; this.#readyReject = reject;});
    // A startup error is also reflected in snapshot(); avoid an unhandled rejection
    // if the user has not pressed Run yet.
    void this.#ready.catch(() => {});
    this.#worker = new Worker(new URL('./batchWorker.ts', import.meta.url), {type: 'module'});
    this.#worker.onmessage = (event: MessageEvent<BatchWorkerResponse>) => {
      if (this.#disposed || this.#failed) return;
      const message = event.data;
      if (message.type === 'ready') this.#readyResolve();
      else if (message.type === 'snapshot') {this.#snapshot = structuredClone(message.snapshot); this.#emit();}
      else if (message.type === 'done') {this.#pending.get(message.id)?.resolve(); this.#pending.delete(message.id);}
      else if (message.type === 'error') this.#fail(new Error(message.message));
    };
    this.#worker.onerror = event => {event.preventDefault(); this.#fail(new Error(event.message || 'Batch worker failed'));};
    this.#worker.onmessageerror = () => this.#fail(new Error('Batch worker message could not be decoded'));
    this.#send({type: 'init', jobs: structuredClone([...jobs])});
  }
  #send(message: BatchWorkerRequest) {this.#worker.postMessage(message);}
  #emit() {for (const listener of this.#listeners) listener();}
  #fail(error: Error) {
    if (this.#disposed || this.#failed) return;
    this.#failed = true;
    this.#readyReject(error);
    for (const pending of this.#pending.values()) pending.reject(error);
    this.#pending.clear(); this.#busy = false;
    this.#snapshot.status = 'failed';
    const result = this.#snapshot.results[this.#snapshot.current];
    if (result) {result.status = 'failed'; result.error = error.message.slice(0, 2000);}
    this.#worker.terminate(); this.#emit();
  }
  snapshot() {return structuredClone(this.#snapshot);}
  subscribe(listener: () => void) {this.#listeners.add(listener); return () => {this.#listeners.delete(listener);};}
  pause() {if (this.#disposed) return; this.#pauseRequested = true; this.#send({type: 'pause'});}
  async run() {
    if (this.#disposed) throw Error('Batch session disposed');
    if (this.#busy) throw Error('Batch command already in flight');
    if (this.#snapshot.status === 'failed') throw Error('Failed batches are immutable; prepare a new batch');
    if (this.#snapshot.status === 'complete') return;
    this.#busy = true; this.#pauseRequested = false; this.#snapshot.status = 'running'; this.#emit();
    try {
      await this.#ready;
      if (this.#disposed) throw Error('Batch session disposed');
      if (this.#pauseRequested) {this.#snapshot.status = 'paused'; return;}
      const id = ++this.#next;
      await new Promise<void>((resolve, reject) => {this.#pending.set(id, {resolve, reject}); this.#send({type: 'run', id});});
    } finally {this.#busy = false; if (!this.#disposed) this.#emit();}
  }
  dispose() {
    if (this.#disposed) return;
    this.#disposed = true; this.#worker.terminate();
    const error = new Error('Batch session disposed'); this.#readyReject(error);
    for (const pending of this.#pending.values()) pending.reject(error);
    this.#pending.clear(); this.#listeners.clear();
  }
}
