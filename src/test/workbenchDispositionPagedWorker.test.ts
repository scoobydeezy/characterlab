import {it,expect,vi,afterEach} from 'vitest';
import {DispositionPagedRun,type DispositionInspectionSummary} from '../workbench/dispositionPagedAdapter';
import type {DispositionCheckpoint} from '../workbench/dispositionAdapter';
afterEach(()=>{vi.unstubAllGlobals();vi.resetModules();});
it('delivers bounded pages and rejects stale revisions and overlapping commands through the worker',async()=>{
 let handle:(event:MessageEvent)=>Promise<void>=async()=>{throw Error('No handler');};const replies:{id:number;result?:unknown;error?:string}[]=[];
 vi.stubGlobal('self',{addEventListener:(_name:string,fn:typeof handle)=>{handle=fn;},postMessage:(r:typeof replies[number])=>replies.push(structuredClone(r))});await import('../workbench/dispositionPagedWorker');let id=0;
 const send=async(data:object)=>{const own=++id;await handle({data:{id:own,...data}} as MessageEvent);return replies.find(r=>r.id===own)!;};
 expect((await send({operation:'textPage'})).error).toContain('not initialized');expect((await send({operation:'create',program:'unknown'})).error).toContain('Unknown');
 const pending=send({operation:'create'});expect((await send({operation:'create'})).error).toContain('in flight');const direct=await DispositionPagedRun.create(),first=(await pending).result as DispositionInspectionSummary;expect(first).toEqual(direct.summary());
 await direct.advance();expect((await send({operation:'advance'})).result).toEqual({moved:true,summary:direct.summary()});const current=direct.summary(),request={operation:'textPage',saveHash:current.saveHash,selector:{kind:'projection'},offset:0,limit:64};
 expect((await send(request)).result).toEqual(direct.textPage(current.saveHash,{kind:'projection'},0,64));expect((await send({...request,saveHash:first.saveHash})).error).toContain('Stale');expect((await send({...request,limit:65537})).error).toContain('bounds');
 const checkpoint=(await send({operation:'checkpoint'})).result as DispositionCheckpoint;expect(checkpoint).toEqual(direct.checkpoint());
 vi.resetModules();await import('../workbench/dispositionPagedWorker');expect((await send({operation:'restore',checkpoint})).result).toEqual(current);expect((await send(request)).result).toEqual(direct.textPage(current.saveHash,{kind:'projection'},0,64));
},600000);
