import type {BatchJob} from './experimentRegistry';
import type {BatchSnapshot} from './batchSession';
export type BatchWorkerRequest = {type: 'init'; jobs: BatchJob[]} | {type: 'run'; id: number} | {type: 'pause'};
export type BatchWorkerResponse = {type: 'ready'} | {type: 'snapshot'; snapshot: BatchSnapshot} | {type: 'done'; id: number} | {type: 'error'; id?: number; message: string};
