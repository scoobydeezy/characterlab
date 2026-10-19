import {it,expect,vi,afterEach} from 'vitest';
import {LongGoalWorkbenchRun,type LongGoalCheckpoint} from '../workbench/longGoalAdapter';
afterEach(()=>{vi.unstubAllGlobals();vi.resetModules();});
it('serializes component initialization and preserves receiver/native-source snapshots through worker restore',async()=>{
 let handle:(event:MessageEvent)=>Promise<void>=async()=>{throw Error('No handler');};const replies:{id:number;result?:unknown;error?:string}[]=[];
 vi.stubGlobal('self',{addEventListener:(_name:string,fn:typeof handle)=>{handle=fn;},postMessage:(r:typeof replies[number])=>replies.push(r)});await import('../workbench/longGoalWorker');let id=0;
 const send=async(data:object)=>{const own=++id;await handle({data:{id:own,...data}} as MessageEvent);return replies.find(r=>r.id===own)!;};
 expect((await send({operation:'create',index:120})).error).toContain('Unknown');const pending=send({operation:'create',index:0});expect((await send({operation:'create',index:1})).error).toContain('in flight');const direct=await LongGoalWorkbenchRun.create();expect((await pending).result).toEqual(direct.snapshot());await direct.advance();expect((await send({operation:'advance'})).result).toEqual({moved:true,snapshot:direct.snapshot()});const checkpoint=(await send({operation:'checkpoint'})).result as LongGoalCheckpoint;
 vi.resetModules();await import('../workbench/longGoalWorker');expect((await send({operation:'restore',checkpoint})).result).toEqual(direct.snapshot());await direct.advance();expect((await send({operation:'advance'})).result).toEqual({moved:true,snapshot:direct.snapshot()});
},600000);
