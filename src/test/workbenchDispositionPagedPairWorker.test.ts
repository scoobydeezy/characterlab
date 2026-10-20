import {it,expect,vi,afterEach} from 'vitest';
afterEach(()=>{vi.unstubAllGlobals();vi.resetModules();});
it('routes branch-qualified pages and reports and preserves paired restore through the worker',async()=>{
 let handle:(event:MessageEvent)=>Promise<void>=async()=>{throw Error('No handler');};const replies:any[]=[];
 vi.stubGlobal('self',{addEventListener:(_name:string,fn:typeof handle)=>{handle=fn;},postMessage:(r:any)=>replies.push(structuredClone(r))});await import('../workbench/dispositionPagedPairWorker');let id=0;
 const send=async(data:object)=>{const own=++id;await handle({data:{id:own,...data}} as MessageEvent);return replies.find(r=>r.id===own)!;};
 expect((await send({operation:'checkpoint'})).error).toContain('not initialized');expect((await send({operation:'create',comparison:'unknown'})).error).toContain('Unknown');
 const pending=send({operation:'create',comparison:'model/0/13'});expect((await send({operation:'create',comparison:'model/0/13'})).error).toContain('in flight');const first=(await pending).result;expect(first.comparison.aligned).toBe(true);
 const moving=send({operation:'advance',branch:'both'});expect((await send({operation:'checkpoint'})).error).toContain('in flight');const current=(await moving).result.summary;expect(current.a.prefix).toBe(1);expect(current.b.prefix).toBe(1);
 const q={operation:'diagnostic',branch:'b',saveHash:current.b.saveHash,selection:{kind:'storedState'}};const report=(await send(q)).result;expect(report.identity.program).toBe('Plastic/ConstitutionPositive');expect(report.report.constitution.exact).toBe('1/8');
 expect((await send({...q,branch:'a'})).error).toContain('Stale');expect((await send({...q,branch:'invalid'})).error).toContain('branch');expect((await send({...q,saveHash:first.b.saveHash})).error).toContain('Stale');
 const field=current.comparison.fields.find((f:any)=>f.root==='1457'),source=field.bSource,pageRequest={operation:'textPage',branch:'b',saveHash:source.saveHash,selector:source.selector,offset:0,limit:4096},page=(await send(pageRequest)).result;expect(page.text).toContain('1/8');expect(page.selector).toEqual(source.selector);expect((await send({...pageRequest,limit:65537})).error).toContain('bounds');
 const checkpoint=(await send({operation:'checkpoint'})).result;expect(checkpoint.a.prefix).toBe(1);expect(checkpoint.b.prefix).toBe(1);
 vi.resetModules();await import('../workbench/dispositionPagedPairWorker');expect((await send({operation:'restore',checkpoint})).result).toEqual(current);expect((await send(q)).result).toEqual(report);expect((await send(pageRequest)).result).toEqual(page);
},600000);
