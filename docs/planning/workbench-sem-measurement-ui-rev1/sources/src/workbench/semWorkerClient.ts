import type {SemInspectionSnapshot as SemSnapshot} from './semInspection';
import type {verifySemReplay} from './semReplay';
import type {runSemControlSuite} from './semControlSuite';
import type {runSemRecognitionControls} from './semRecognitionControls';
import type {runSemKnowledgeControls} from './semKnowledgeControls';
import type {runSemMeasurementControls} from './semMeasurementControls';
import type {SemCheckpoint} from './semAdapter';
export class SemWorkerClient {
  #worker = new Worker(new URL('./semWorker.ts', import.meta.url), {type: 'module'});
  #next = 0; #busy = false; #disposed = false; #snapshot!: SemSnapshot;
  #pending = new Map<number, {resolve: (value: unknown) => void; reject: (error: Error) => void}>();
  private constructor() {
    this.#worker.onmessage = event => {if (this.#disposed) return; const {id, error, result} = event.data, request = this.#pending.get(id); if (!request) return; this.#pending.delete(id); error ? request.reject(new Error(error)) : request.resolve(result);};
    this.#worker.onerror = event => {event.preventDefault(); this.dispose(new Error(event.message || 'Sem worker failed'));};
    this.#worker.onmessageerror = () => this.dispose(new Error('Sem worker message decoding failed'));
  }
  async #call<T>(operation: string, data: object = {}): Promise<T> {
    if (this.#disposed) throw Error('Sem worker disposed');
    if (this.#busy) throw Error('Sem worker command already in flight');
    this.#busy = true;
    try {const id = ++this.#next; return await new Promise<T>((resolve, reject) => {this.#pending.set(id, {resolve: value => resolve(value as T), reject}); this.#worker.postMessage({id, operation, ...data});});}
    finally {this.#busy = false;}
  }
  static async create() {const client = new SemWorkerClient(); try {client.#snapshot = await client.#call('create'); return client;} catch (e) {client.dispose(); throw e;}}
  static async restore(checkpoint: SemCheckpoint) {const client = new SemWorkerClient(); try {client.#snapshot = await client.#call('restore', {checkpoint}); return client;} catch (e) {client.dispose(); throw e;}}
  snapshot() {return structuredClone(this.#snapshot);}
  async advance() {const result = await this.#call<{moved: boolean; snapshot: SemSnapshot}>('advance'); this.#snapshot = result.snapshot; return result.moved;}
  verify() {return this.#call<Awaited<ReturnType<typeof verifySemReplay>>>('verify');}
  controls() {return this.#call<Awaited<ReturnType<typeof runSemControlSuite>>>('controls');}
  recognition() {return this.#call<Awaited<ReturnType<typeof runSemRecognitionControls>>>('recognition');}
  checkpoint() {return this.#call<SemCheckpoint>('checkpoint');}
  measurement() {return this.#call<Awaited<ReturnType<typeof runSemMeasurementControls>>>('measurement');}
  knowledge() {return this.#call<Awaited<ReturnType<typeof runSemKnowledgeControls>>>('knowledge');}
  dispose(error = new Error('Sem worker disposed')) {if (this.#disposed) return; this.#disposed = true; this.#worker.terminate(); for (const request of this.#pending.values()) request.reject(error); this.#pending.clear();}
}
