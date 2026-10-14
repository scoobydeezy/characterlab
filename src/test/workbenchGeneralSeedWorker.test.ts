import {it,expect,vi,afterEach} from 'vitest';
import freeze from '../../docs/planning/campaign3-general-attention-model-rev2/FREEZE.json';
import {digest,fromHex} from '../workbench/canonical';
afterEach(()=>vi.unstubAllGlobals());
it('rejects malformed seeds and forwards the complete frozen seed through worker creation',async()=>{
 let handle:(event:MessageEvent)=>Promise<void>=async()=>{throw Error('handler absent');};const replies:{result?:unknown;error?:string}[]=[];
 vi.stubGlobal('self',{addEventListener:(_name:string,fn:typeof handle)=>{handle=fn;},postMessage:(r:typeof replies[number])=>replies.push(r)});await import('../workbench/generalWorker');let id=0;
 const send=async(data:object)=>{await handle({data:{id:++id,...data}} as MessageEvent);return replies.at(-1)!;};
 expect((await send({operation:'create',recipe:'baseline',seed:'01'})).error).toContain('seed');
 const created=await send({operation:'create',recipe:'baseline',seed:freeze.seed});expect(created.error).toBeUndefined();expect(created.result).toMatchObject({runHash:await digest(fromHex(freeze.models[0].runIdentity))});
 expect((await send({operation:'advance'})).error).toBeUndefined();
 const c=await send({operation:'checkpoint'});expect(c.error).toBeUndefined();expect(c.result).toMatchObject({version:'general-workbench/0.2',seed:freeze.seed,prefix:1});
},600000);
