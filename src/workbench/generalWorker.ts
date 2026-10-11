import {GeneralWorkbenchRun, type GeneralCheckpoint} from './generalAdapter';
let run: GeneralWorkbenchRun | undefined;
self.addEventListener('message', async (event: MessageEvent<{id: number; operation: string; recipe?: string; checkpoint?: GeneralCheckpoint}>) => {
  const request = event.data;
  try {
    let result: unknown;
    if (request.operation === 'create') {if (run) throw Error('Already initialized'); run = await GeneralWorkbenchRun.create(request.recipe); result = run.snapshot();}
    else if (request.operation === 'restore') {if (run) throw Error('Already initialized'); run = await GeneralWorkbenchRun.restore(request.checkpoint!); result = run.snapshot();}
    else if (!run) throw Error('General worker not initialized');
    else if (request.operation === 'advance') {const moved = await run.advance(); result = {moved, snapshot: run.snapshot()};}
    else if (request.operation === 'checkpoint') result = run.checkpoint();
    else throw Error('Unknown inspection command');
    self.postMessage({id: request.id, result});
  } catch (error) {self.postMessage({id: request.id, error: error instanceof Error ? error.message : String(error)});}
});
