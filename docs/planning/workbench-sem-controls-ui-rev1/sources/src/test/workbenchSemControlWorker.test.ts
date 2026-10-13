import {it,expect,vi,afterEach} from 'vitest';
import receipt from '../../docs/planning/workbench-sem-controls-rev1/receipt.json';
afterEach(()=>vi.unstubAllGlobals());
it('delivers all qualified component reports without changing any integrated prefix',async()=>{
 let handle:(event:MessageEvent)=>Promise<void>=async()=>{throw Error('handler absent');};const replies:{id:number;result?:unknown;error?:string}[]=[];
 vi.stubGlobal('self',{addEventListener:(_name:string,fn:typeof handle)=>{handle=fn;},postMessage:(r:typeof replies[number])=>replies.push(r)});await import('../workbench/semWorker');let id=0;
 const send=async(operation:string)=>{await handle({data:{id:++id,operation}} as MessageEvent);const reply=replies.at(-1)!;expect(reply.error).toBeUndefined();return reply.result;};
 await send('create');for(let prefix=0;prefix<=3;prefix++){
  const before=await send('checkpoint'),report=await send('controls') as {cases:unknown;pairs:unknown};
  expect(report.cases).toEqual(receipt.results);expect(report.pairs).toEqual(receipt.pairs);expect(await send('checkpoint')).toEqual(before);
  if(prefix<3)await send('advance');
 }
});
