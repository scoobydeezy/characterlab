import {afterEach, describe, expect, it, vi} from 'vitest';
import {BatchWorkerClient} from '../workbench/batchWorkerClient';
import type {BatchWorkerRequest, BatchWorkerResponse} from '../workbench/batchWorkerProtocol';
import type {BatchJob} from '../workbench/experimentRegistry';
const jobs: BatchJob[] = [{id: 'reason/1/collective', experimentId: 'reason', name: 'collective', law: 1, seed: 7, expectedSaveHashes: ['a'.repeat(64), 'b'.repeat(64)]}];
class WorkerPort {
  static last: WorkerPort;
  requests: BatchWorkerRequest[] = []; terminated = false;
  onmessage?: (e: {data: BatchWorkerResponse}) => void;
  onerror?: (e: {message: string; preventDefault(): void}) => void;
  onmessageerror?: () => void;
  constructor() {WorkerPort.last = this;}
  postMessage(message: BatchWorkerRequest) {this.requests.push(structuredClone(message));}
  terminate() {this.terminated = true;}
  deliver(message: BatchWorkerResponse) {this.onmessage?.({data: structuredClone(message)});}
}
afterEach(() => vi.unstubAllGlobals());
describe('Batch worker transport lifecycle', () => {
  it('preserves a pause requested before worker initialization', async () => {
    vi.stubGlobal('Worker', WorkerPort);
    const client = new BatchWorkerClient(jobs), port = WorkerPort.last;
    const running = client.run(); client.pause(); port.deliver({type: 'ready'}); await running;
    expect(client.snapshot().status).toBe('paused');
    expect(port.requests.some(r => r.type === 'run')).toBe(false);
    const resumed = client.run(); await Promise.resolve();
    const command = port.requests.find(r => r.type === 'run')!;
    expect(command.type).toBe('run');
    if (command.type !== 'run') throw Error('Missing run');
    const view = client.snapshot(); view.status = 'complete'; view.current = 1;
    port.deliver({type: 'snapshot', snapshot: view}); port.deliver({type: 'done', id: command.id});
    await resumed; expect(client.snapshot().status).toBe('complete'); client.dispose();
    expect(port.terminated).toBe(true);
  });
  it('rejects concurrent commands and retains failure despite late worker messages', async () => {
    vi.stubGlobal('Worker', WorkerPort);
    const client = new BatchWorkerClient(jobs), port = WorkerPort.last;
    port.deliver({type: 'ready'}); const running = client.run(); await Promise.resolve();
    await expect(client.run()).rejects.toThrow('in flight');
    const stale = client.snapshot();
    port.onerror?.({message: 'Worker execution failed', preventDefault() {}});
    await expect(running).rejects.toThrow('Worker execution failed');
    port.deliver({type: 'snapshot', snapshot: stale});
    expect(client.snapshot().status).toBe('failed');
    expect(client.snapshot().results[0].error).toBe('Worker execution failed');
    expect(port.terminated).toBe(true); client.dispose();
  });
  it('disposal releases a pending startup rather than leaving a run promise hanging', async () => {
    vi.stubGlobal('Worker', WorkerPort);
    const client = new BatchWorkerClient(jobs), running = client.run();
    client.dispose(); await expect(running).rejects.toThrow('disposed');
  });
});
