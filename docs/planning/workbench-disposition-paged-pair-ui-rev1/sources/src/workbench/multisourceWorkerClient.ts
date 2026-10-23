import type {MultisourceCheckpoint} from './multisourceAdapter';
import type {compareMultisource} from './multisourceComparison';
import type {MultisourceInspectionSnapshot as MultisourceSnapshot} from './multisourceInspection';
export class MultisourceWorkerClient {
  #worker = new Worker(new URL('./multisourceWorker.ts', import.meta.url), {type: 'module'});
  #next = 0; #busy = false; #disposed = false; #snapshot!: MultisourceSnapshot;
  #pending = new Map<number, {resolve: (value: unknown) => void; reject: (error: Error) => void}>();
  private constructor() {
    this.#worker.onmessage = event => {if (this.#disposed) return; const {id, error, result} = event.data, request = this.#pending.get(id); if (!request) return; this.#pending.delete(id); error ? request.reject(new Error(error)) : request.resolve(result);};
    this.#worker.onerror = event => {event.preventDefault(); this.dispose(new Error(event.message || 'Multisource worker failed'));};
    this.#worker.onmessageerror = () => this.dispose(new Error('Multisource worker message decoding failed'));
  }
  async #call<T>(operation: string, data: object = {}): Promise<T> {
    if (this.#disposed) throw Error('Multisource worker disposed');
    if (this.#busy) throw Error('Multisource worker command already in flight');
    this.#busy = true;
    try {const id = ++this.#next; return await new Promise<T>((resolve, reject) => {this.#pending.set(id, {resolve: value => resolve(value as T), reject}); this.#worker.postMessage({id, operation, ...data});});}
    finally {this.#busy = false;}
  }
  static async create(program = 'shared--GroundAggregate') {const client = new MultisourceWorkerClient(); try {client.#snapshot = await client.#call('create', {program}); return client;} catch (e) {client.dispose(); throw e;}}
  static async restore(checkpoint: MultisourceCheckpoint) {const client = new MultisourceWorkerClient(); try {client.#snapshot = await client.#call('restore', {checkpoint}); return client;} catch (e) {client.dispose(); throw e;}}
  snapshot() {return structuredClone(this.#snapshot);}
  async advance() {const result = await this.#call<{moved: boolean; snapshot: MultisourceSnapshot}>('advance'); this.#snapshot = result.snapshot; return result.moved;}
  checkpoint() {return this.#call<MultisourceCheckpoint>('checkpoint');}
  compare(contrast:string,checkpoint:MultisourceCheckpoint) {return this.#call<ReturnType<typeof compareMultisource>>('compare',{contrast,checkpoint});}
  dispose(error = new Error('Multisource worker disposed')) {if (this.#disposed) return; this.#disposed = true; this.#worker.terminate(); for (const request of this.#pending.values()) request.reject(error); this.#pending.clear();}
}
