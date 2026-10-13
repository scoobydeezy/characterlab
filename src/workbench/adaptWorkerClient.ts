import type {compareAdapt} from './adaptComparison';
import type {AdaptSnapshot, AdaptCheckpoint} from './adaptAdapter';
export class AdaptWorkerClient {
  #worker = new Worker(new URL('./adaptWorker.ts', import.meta.url), {type: 'module'});
  #next = 0; #busy = false; #disposed = false; #snapshot!: AdaptSnapshot;
  #pending = new Map<number, {resolve: (value: unknown) => void; reject: (error: Error) => void}>();
  private constructor() {
    this.#worker.onmessage = event => {if (this.#disposed) return; const {id, error, result} = event.data, request = this.#pending.get(id); if (!request) return; this.#pending.delete(id); error ? request.reject(new Error(error)) : request.resolve(result);};
    this.#worker.onerror = event => {event.preventDefault(); this.dispose(new Error(event.message || 'Adapt worker failed'));};
    this.#worker.onmessageerror = () => this.dispose(new Error('Adapt worker message decoding failed'));
  }
  async #call<T>(operation: string, data: object = {}): Promise<T> {
    if (this.#disposed) throw Error('Adapt worker disposed');
    if (this.#busy) throw Error('Adapt worker command already in flight');
    this.#busy = true;
    try {const id = ++this.#next; return await new Promise<T>((resolve, reject) => {this.#pending.set(id, {resolve: value => resolve(value as T), reject}); this.#worker.postMessage({id, operation, ...data});});}
    finally {this.#busy = false;}
  }
  static async create(program = 'count-0') {const client = new AdaptWorkerClient(); try {client.#snapshot = await client.#call('create', {program}); return client;} catch (e) {client.dispose(); throw e;}}
  static async restore(checkpoint: AdaptCheckpoint) {const client = new AdaptWorkerClient(); try {client.#snapshot = await client.#call('restore', {checkpoint}); return client;} catch (e) {client.dispose(); throw e;}}
  snapshot() {return structuredClone(this.#snapshot);}
  async advance() {const result = await this.#call<{moved: boolean; snapshot: AdaptSnapshot}>('advance'); this.#snapshot = result.snapshot; return result.moved;}
  compare(checkpoint:AdaptCheckpoint) {return this.#call<ReturnType<typeof compareAdapt>>('compare',{checkpoint});}
  checkpoint() {return this.#call<AdaptCheckpoint>('checkpoint');}
  dispose(error = new Error('Adapt worker disposed')) {if (this.#disposed) return; this.#disposed = true; this.#worker.terminate(); for (const request of this.#pending.values()) request.reject(error); this.#pending.clear();}
}
