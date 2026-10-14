import {it,expect,vi,afterEach} from 'vitest';
import {BioWorkbenchRun,type BioCheckpoint} from '../workbench/bioAdapter';
afterEach(()=>{vi.unstubAllGlobals();vi.resetModules();});
it('rejects overlapping initialization and preserves actual component parity through the worker',async()=>{
 let handle:(event:MessageEvent)=>Promise<void>=async()=>{throw Error('No handler');};
 const replies:{id:number;result?:unknown;error?:string}[]=[];
 vi.stubGlobal('self',{addEventListener:(_name:string,fn:typeof handle)=>{handle=fn;},postMessage:(r:typeof replies[number])=>replies.push(r)});
 await import('../workbench/bioWorker');let id=0;
 const send=async(data:object)=>{const own=++id;await handle({data:{id:own,...data}} as MessageEvent);return replies.find(r=>r.id===own)!;};
 expect((await send({operation:'create',name:'unknown'})).error).toContain('Unknown');
 const pending=send({operation:'create',name:'Earned/6'});
 expect((await send({operation:'create',name:'Earned/0'})).error).toContain('in flight');
 const direct=await BioWorkbenchRun.create('Earned/6');expect((await pending).result).toEqual(direct.snapshot());
 for(let i=0;i<5;i++){await direct.advance();expect((await send({operation:'advance'})).result).toEqual({moved:true,snapshot:direct.snapshot()});}
 const checkpoint=(await send({operation:'checkpoint'})).result as BioCheckpoint;expect(checkpoint).toEqual(direct.checkpoint());
 expect((await send({operation:'restore',checkpoint})).error).toContain('initialized');
 vi.resetModules();await import('../workbench/bioWorker');expect((await send({operation:'restore',checkpoint})).result).toEqual(direct.snapshot());
 await direct.advance();expect((await send({operation:'advance'})).result).toEqual({moved:true,snapshot:direct.snapshot()});
},600000);
