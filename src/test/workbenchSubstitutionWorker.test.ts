import {it,expect,vi,afterEach} from 'vitest';
import {SubstitutionWorkbenchRun,type SubstitutionCheckpoint} from '../workbench/substitutionAdapter';
afterEach(()=>{vi.unstubAllGlobals();vi.resetModules();});
it('serializes component initialization and preserves public SUBSTITUTION snapshots through worker restore',async()=>{
 let handle:(event:MessageEvent)=>Promise<void>=async()=>{throw Error('No handler');};const replies:{id:number;result?:unknown;error?:string}[]=[];
 vi.stubGlobal('self',{addEventListener:(_name:string,fn:typeof handle)=>{handle=fn;},postMessage:(r:typeof replies[number])=>replies.push(r)});await import('../workbench/substitutionWorker');let id=0;
 const send=async(data:object)=>{const own=++id;await handle({data:{id:own,...data}} as MessageEvent);return replies.find(r=>r.id===own)!;};
 expect((await send({operation:'create',program:'unknown'})).error).toContain('Unknown');const pending=send({operation:'create',program:'LatestHistory/diversified'});expect((await send({operation:'create',program:'MeanHistory/diversified'})).error).toContain('in flight');const direct=await SubstitutionWorkbenchRun.create();expect((await pending).result).toEqual(direct.snapshot());await direct.advance();expect((await send({operation:'advance'})).result).toEqual({moved:true,snapshot:direct.snapshot()});const checkpoint=(await send({operation:'checkpoint'})).result as SubstitutionCheckpoint;
 vi.resetModules();await import('../workbench/substitutionWorker');expect((await send({operation:'restore',checkpoint})).result).toEqual(direct.snapshot());await direct.advance();expect((await send({operation:'advance'})).result).toEqual({moved:true,snapshot:direct.snapshot()});
},600000);
