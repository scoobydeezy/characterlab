import {it,expect,vi,afterEach} from 'vitest';
import receipt from '../../docs/planning/workbench-sem-binding-rev1/receipt.json';
afterEach(()=>vi.unstubAllGlobals());
it('delivers truth-binding controls without changing active prefixes',async()=>{
 let handle:(event:MessageEvent)=>Promise<void>=async()=>{throw Error('handler absent');};const replies:{result?:unknown;error?:string}[]=[];
 vi.stubGlobal('self',{addEventListener:(_name:string,fn:typeof handle)=>{handle=fn;},postMessage:(r:typeof replies[number])=>replies.push(r)});await import('../workbench/semWorker');let id=0;
 const send=async(operation:string)=>{await handle({data:{id:++id,operation}} as MessageEvent);const r=replies.at(-1)!;expect(r.error).toBeUndefined();return r.result;};
 await send('create');for(let prefix=0;prefix<=3;prefix++){const before=await send('checkpoint');expect(await send('bindings')).toEqual(receipt.report);expect(await send('checkpoint')).toEqual(before);if(prefix<3)await send('advance');}
});
