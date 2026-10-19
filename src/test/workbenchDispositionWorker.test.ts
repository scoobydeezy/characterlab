import {it,expect,vi,afterEach} from 'vitest';
import {DispositionWorkbenchRun,type DispositionCheckpoint} from '../workbench/dispositionAdapter';
afterEach(()=>{vi.unstubAllGlobals();vi.resetModules();});
it('serializes native initialization and preserves public DISPOSITION snapshots through worker restore',async()=>{
 let handle:(event:MessageEvent)=>Promise<void>=async()=>{throw Error('No handler');};const replies:{id:number;result?:unknown;error?:string}[]=[];
 vi.stubGlobal('self',{addEventListener:(_name:string,fn:typeof handle)=>{handle=fn;},postMessage:(r:typeof replies[number])=>replies.push(r)});await import('../workbench/dispositionWorker');let id=0;
 const send=async(data:object)=>{const own=++id;await handle({data:{id:own,...data}} as MessageEvent);return replies.find(r=>r.id===own)!;};
 expect((await send({operation:'create',program:'unknown'})).error).toContain('Unknown');const pending=send({operation:'create',program:'Plastic/Main'});expect((await send({operation:'create',program:'Plastic/ConstitutionPositive'})).error).toContain('in flight');const direct=await DispositionWorkbenchRun.create();expect((await pending).result).toEqual(direct.snapshot());await direct.advance();expect((await send({operation:'advance'})).result).toEqual({moved:true,snapshot:direct.snapshot()});const checkpoint=(await send({operation:'checkpoint'})).result as DispositionCheckpoint;
 vi.resetModules();await import('../workbench/dispositionWorker');expect((await send({operation:'restore',checkpoint})).result).toEqual(direct.snapshot());await direct.advance();expect((await send({operation:'advance'})).result).toEqual({moved:true,snapshot:direct.snapshot()});
},600000);
