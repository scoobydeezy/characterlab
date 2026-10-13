import {afterEach,expect,it,vi} from 'vitest';
afterEach(()=>vi.unstubAllGlobals());
it('delivers actual draw diagnostics and authenticates replay comparison without replacing the active run',async()=>{
 let handle:(event:MessageEvent)=>Promise<void>=async()=>{throw Error('worker handler absent');};const replies:{id:number;result?:unknown;error?:string}[]=[];
 vi.stubGlobal('self',{addEventListener:(_name:string,fn:typeof handle)=>{handle=fn;},postMessage:(r:typeof replies[number])=>replies.push(r)});
 await import('../workbench/detWorker');let id=0;const send=async(operation:string,data:object={})=>{await handle({data:{id:++id,operation,...data}} as MessageEvent);return replies.at(-1)!;};
 expect((await send('create',{program:'equal-criteria'})).error).toBeUndefined();await send('advance');await send('advance');const checkpoint=(await send('checkpoint')).result;
 const compared=await send('compare',{checkpoint});expect(compared.error).toBeUndefined();expect(compared.result).toMatchObject({kind:'same-program-replay',saveEqual:true,drawRecordsEqual:true,identityContributionCounts:[0,0]});expect((compared.result as {draws:unknown[][]}).draws[0].length).toBeGreaterThan(0);
 const bad=await send('compare',{checkpoint:{...checkpoint as object,saveHash:'0'.repeat(64)}});expect(bad.error).toContain('digest');expect((await send('checkpoint')).result).toEqual(checkpoint);
},600000);
