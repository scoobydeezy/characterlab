import {afterEach, expect, it, vi} from 'vitest';
import {GeneralWorkerClient} from '../workbench/generalWorkerClient';
import {associationCellDifference, type AssociationProjection} from '../workbench/associationProjection';

class Port {
  static latest: Port;
  onmessage?: (event: {data: unknown}) => void;
  onerror?: (event: {message: string; preventDefault(): void}) => void;
  onmessageerror?: () => void;
  requests: {id: number; operation: string}[] = [];
  terminated = false;
  constructor() {Port.latest = this;}
  postMessage(message: {id: number; operation: string}) {this.requests.push(message);}
  terminate() {this.terminated = true;}
  reply(result: unknown) {this.onmessage?.({data: {id: this.requests.at(-1)!.id, result}});}
}
afterEach(() => vi.unstubAllGlobals());
it('serializes worker commands and retains detached last committed state on failure', async () => {
  vi.stubGlobal('Worker', Port);
  const creating = GeneralWorkerClient.create();
  const port = Port.latest;
  port.reply({prefix: 0, graph: null});
  const client = await creating;
  const advancing = client.advance();
  await expect(client.advance()).rejects.toThrow('in flight');
  port.reply({moved: true, snapshot: {prefix: 1, graph: null}});
  expect(await advancing).toBe(true);
  const view = client.snapshot(); view.prefix = 999;
  expect(client.snapshot().prefix).toBe(1);
  const failing = client.checkpoint();
  port.onerror?.({message: 'worker stopped', preventDefault() {}});
  await expect(failing).rejects.toThrow('worker stopped');
  expect(port.terminated).toBe(true);
  port.reply({prefix: 999});
  expect(client.snapshot().prefix).toBe(1);
  await expect(client.advance()).rejects.toThrow('disposed');
});
it('cleans up worker startup failure', async () => {
  vi.stubGlobal('Worker', Port);
  const creating = GeneralWorkerClient.create();
  Port.latest.onmessageerror?.();
  await expect(creating).rejects.toThrow('decoding');
  expect(Port.latest.terminated).toBe(true);
});
it('aligns cells by exact identities across reordered and missing concepts', () => {
  const graph = (ids: string[], fractions: string[][]): AssociationProjection => ({version: 'association-inspection/0.1', scale: '100', updatedAt: '3', nodes: ids.map(id => ({id, label: id, exact: id})), weights: fractions.map(row => row.map(exact => ({units: '0', exact, display: 0})))});
  const a = graph(['a','b'], [['0/1','1/20'],['1/50','0/1']]);
  const b = graph(['b','a'], [['0/1','1/50'],['1/20','0/1']]);
  expect(associationCellDifference(a,b,'a','b')).toEqual({before:'1/20',after:'1/20',changed:false});
  expect(associationCellDifference(a,graph(['a'],[['0/1']]),'a','b')).toEqual({before:'1/20',after:null,changed:true});
});
