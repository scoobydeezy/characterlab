import type {DetSnapshot} from './detDeter';
import type {compareDet} from './detComparison';
import type {DetCheckpoint} from './adaptDeter';
export class DetWorkerClient {
  #worker = new Worker(new URL('./detWorker.ts', import.meta.url), {type: 'module'});
  #next = 0; #busy = false; #disposed = false; #snapshot!: DetSnapshot;
  #pending = new Map<number, {resolve: (value: unknown) => void; reject: (error: Error) => void}>();
  private constructor() {
    this.#worker.onmessage = event => {if (this.#disposed) return; const {id, error, result} = event.data, request = this.#pending.get(id); if (!request) return; this.#pending.delete(id); error ? request.reject(new Error(error)) : request.resolve(result);};
    this.#worker.onerror = event => {event.preventDefault(); this.dispose(new Error(event.message || 'Det worker failed'));};
    this.#worker.onmessageerror = () => this.dispose(new Error('Det worker message decoding failed'));
  }
  async #call<T>(operation: string, data: object = {}): Promise<T> {
    if (this.#disposed) throw Error('Det worker disposed');
    if (this.#busy) throw Error('Det worker command already in flight');
    this.#busy = true;
    try {const id = ++this.#next; return await new Promise<T>((resolve, reject) => {this.#pending.set(id, {resolve: value => resolve(value as T), reject}); this.#worker.postMessage({id, operation, ...data});});}
    finally {this.#busy = false;}
  }
  static async create(program = 'baseline') {const client = new DetWorkerClient(); try {client.#snapshot = await client.#call('create', {program}); return client;} catch (e) {client.dispose(); throw e;}}
  static async restore(checkpoint: DetCheckpoint) {const client = new DetWorkerClient(); try {client.#snapshot = await client.#call('restore', {checkpoint}); return client;} catch (e) {client.dispose(); throw e;}}
  snapshot() {return structuredClone(this.#snapshot);}
  async advance() {const result = await this.#call<{moved: boolean; snapshot: DetSnapshot}>('advance'); this.#snapshot = result.snapshot; return result.moved;}
  compare(checkpoint:DetCheckpoint) {return this.#call<ReturnType<typeof compareDet>>('compare',{checkpoint});}
  checkpoint() {return this.#call<DetCheckpoint>('checkpoint');}
  dispose(error = new Error('Det worker disposed')) {if (this.#disposed) return; this.#disposed = true; this.#worker.terminate(); for (const request of this.#pending.values()) request.reject(error); this.#pending.clear();}
}
