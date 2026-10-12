import {BatchSession} from './batchSession';
import type {BatchWorkerRequest, BatchWorkerResponse} from './batchWorkerProtocol';
let session: BatchSession | undefined;
const send = (message: BatchWorkerResponse) => self.postMessage(message);
self.addEventListener('message', async (event: MessageEvent<BatchWorkerRequest>) => {
  const request = event.data;
  try {
    if (request.type === 'init') {
      if (session) throw Error('Worker session already initialized');
      session = new BatchSession(request.jobs);
      session.subscribe(() => send({type: 'snapshot', snapshot: session!.snapshot()}));
      send({type: 'ready'});
    } else if (request.type === 'pause') {
      session?.pause();
    } else if (request.type === 'run') {
      if (!session) throw Error('Worker session is not initialized');
      await session.run(); send({type: 'done', id: request.id});
    }
  } catch (e) {send({type: 'error', id: request.type === 'run' ? request.id : undefined, message: e instanceof Error ? e.message.slice(0, 2000) : String(e).slice(0, 2000)});}
});
