import {it,expect,vi,afterEach} from 'vitest';
import {ControlWorkbenchRun,type ControlCheckpoint} from '../workbench/controlAdapter';
afterEach(()=>{vi.unstubAllGlobals();vi.resetModules();});
it('serializes component initialization and preserves public CONTROL snapshots through worker restore',async()=>{
 let handle:(event:MessageEvent)=>Promise<void>=async()=>{throw Error('No handler');};const replies:{id:number;result?:unknown;error?:string}[]=[];
 vi.stubGlobal('self',{addEventListener:(_name:string,fn:typeof handle)=>{handle=fn;},postMessage:(r:typeof replies[number])=>replies.push(r)});await import('../workbench/controlWorker');let id=0;
 const send=async(data:object)=>{const own=++id;await handle({data:{id:own,...data}} as MessageEvent);return replies.find(r=>r.id===own)!;};
 expect((await send({operation:'create',program:'unknown'})).error).toContain('Unknown');const pending=send({operation:'create',program:'1/1/main'});expect((await send({operation:'create',program:'2/1/main'})).error).toContain('in flight');const direct=await ControlWorkbenchRun.create();expect((await pending).result).toEqual(direct.snapshot());await direct.advance();expect((await send({operation:'advance'})).result).toEqual({moved:true,snapshot:direct.snapshot()});const checkpoint=(await send({operation:'checkpoint'})).result as ControlCheckpoint;
 vi.resetModules();await import('../workbench/controlWorker');expect((await send({operation:'restore',checkpoint})).result).toEqual(direct.snapshot());await direct.advance();expect((await send({operation:'advance'})).result).toEqual({moved:true,snapshot:direct.snapshot()});
},600000);
