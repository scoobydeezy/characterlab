import {afterEach,expect,it,vi} from 'vitest';
import {AdaptWorkerClient} from '../workbench/adaptWorkerClient';
class Port{static last:Port;requests:{id:number;operation:string}[]=[];terminated=false;onmessage?: (e:{data:unknown})=>void;onerror?:(e:{message:string;preventDefault():void})=>void;onmessageerror?:()=>void;constructor(){Port.last=this;}postMessage(q:{id:number;operation:string}){this.requests.push(q);}terminate(){this.terminated=true;}reply(result:unknown){this.onmessage?.({data:{id:this.requests.at(-1)!.id,result}});}}
afterEach(()=>vi.unstubAllGlobals());
it('rejects overlapping worker commands and detaches returned snapshots',async()=>{vi.stubGlobal('Worker',Port);const pending=AdaptWorkerClient.create(),port=Port.last;port.reply({prefix:0,fields:[]});const client=await pending;const detached=client.snapshot();detached.prefix=99;expect(client.snapshot().prefix).toBe(0);const step=client.advance();await expect(client.advance()).rejects.toThrow('in flight');port.reply({moved:true,snapshot:{prefix:1,fields:[]}});expect(await step).toBe(true);expect(client.snapshot().prefix).toBe(1);client.dispose();await expect(client.advance()).rejects.toThrow('disposed');expect(port.terminated).toBe(true);});
it('releases pending commands on worker failure',async()=>{vi.stubGlobal('Worker',Port);const pending=AdaptWorkerClient.create(),port=Port.last;port.reply({prefix:0});const client=await pending;const step=client.advance();port.onerror?.({message:'native worker failed',preventDefault(){}});await expect(step).rejects.toThrow('native worker failed');expect(port.terminated).toBe(true);await expect(client.checkpoint()).rejects.toThrow('disposed');});

it('authenticates comparison checkpoints in the native worker without replacing its run',async()=>{
 let handle:(event:MessageEvent)=>Promise<void>=async()=>{throw Error('worker handler absent');};const replies:{id:number;result?:unknown;error?:string}[]=[];
 vi.stubGlobal('self',{addEventListener:(_name:string,fn:typeof handle)=>{handle=fn;},postMessage:(r:typeof replies[number])=>replies.push(r)});
 await import('../workbench/adaptWorker');const {AdaptWorkbenchRun}=await import('../workbench/adaptAdapter');const other=await AdaptWorkbenchRun.create('count-1');for(let i=0;i<2;i++)await other.advance();
 let id=0;const send=async(operation:string,data:object={})=>{await handle({data:{id:++id,operation,...data}} as MessageEvent);return replies.at(-1)!;};
 await send('create',{program:'count-0'});await send('advance');await send('advance');const before=(await send('checkpoint')).result;
 const good=await send('compare',{checkpoint:other.checkpoint()});expect(good.error).toBeUndefined();expect(good.result).toMatchObject({aligned:true});expect((good.result as {reveal:unknown}).reveal).not.toBeNull();
 const bad=await send('compare',{checkpoint:{...other.checkpoint(),saveHash:'0'.repeat(64)}});expect(bad.error).toContain('digest');expect((await send('checkpoint')).result).toEqual(before);
},600000);
