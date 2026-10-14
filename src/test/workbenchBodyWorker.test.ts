import {it,expect,vi,afterEach} from 'vitest';
import {BodyWorkbenchRun,type BodyCheckpoint} from '../workbench/bodyAdapter';
import {inspectBodyOwnership} from '../workbench/bodyOwnership';
afterEach(()=>{vi.unstubAllGlobals();vi.resetModules();});
it('preserves public source parity and active checkpoint during independent ownership inspection',async()=>{
 let handle:(event:MessageEvent)=>Promise<void>=async()=>{throw Error('No handler');};const replies:{id:number;result?:unknown;error?:string}[]=[];
 vi.stubGlobal('self',{addEventListener:(_name:string,fn:typeof handle)=>{handle=fn;},postMessage:(r:typeof replies[number])=>replies.push(r)});await import('../workbench/bodyWorker');let id=0;
 const send=async(data:object)=>{const own=++id;await handle({data:{id:own,...data}} as MessageEvent);return replies.find(r=>r.id===own)!;};
 expect((await send({operation:'create',program:'unknown'})).error).toContain('Unknown');
 const pending=send({operation:'create',program:'kinetic-fast'});expect((await send({operation:'create',program:'baseline'})).error).toContain('in flight');
 const direct=await BodyWorkbenchRun.create('kinetic-fast');expect((await pending).result).toEqual(direct.snapshot());await direct.advance();expect((await send({operation:'advance'})).result).toEqual({moved:true,snapshot:direct.snapshot()});
 const checkpoint=(await send({operation:'checkpoint'})).result as BodyCheckpoint;
 const inspecting=send({operation:'ownership'});expect((await send({operation:'advance'})).error).toContain('in flight');expect((await inspecting).result).toEqual(await inspectBodyOwnership('kinetic-fast'));expect((await send({operation:'checkpoint'})).result).toEqual(checkpoint);
 vi.resetModules();await import('../workbench/bodyWorker');expect((await send({operation:'restore',checkpoint})).result).toEqual(direct.snapshot());await direct.advance();expect((await send({operation:'advance'})).result).toEqual({moved:true,snapshot:direct.snapshot()});
},600000);
