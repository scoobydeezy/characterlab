import {afterEach,expect,it,vi} from 'vitest';
import {DetWorkerClient} from '../workbench/detWorkerClient';
class Port{
 static last:Port;requests:{id:number;operation:string}[]=[];terminated=false;
 onmessage?:(e:{data:unknown})=>void;onerror?:(e:{message:string;preventDefault():void})=>void;onmessageerror?:()=>void;
 constructor(){Port.last=this;}postMessage(q:{id:number;operation:string}){this.requests.push(q);}terminate(){this.terminated=true;}
 reply(result:unknown){this.onmessage?.({data:{id:this.requests.at(-1)!.id,result}});}
}
afterEach(()=>vi.unstubAllGlobals());
it('serializes DET commands, ignores unrelated replies and detaches cached snapshots',async()=>{
 vi.stubGlobal('Worker',Port);const pending=DetWorkerClient.create(),port=Port.last;port.reply({prefix:0,fields:[]});const client=await pending;
 const detached=client.snapshot();detached.prefix=99;expect(client.snapshot().prefix).toBe(0);
 const step=client.advance();await expect(client.checkpoint()).rejects.toThrow('in flight');port.onmessage?.({data:{id:999,result:{moved:true,snapshot:{prefix:999}}}});expect(client.snapshot().prefix).toBe(0);
 port.reply({moved:true,snapshot:{prefix:1,fields:[]}});expect(await step).toBe(true);expect(client.snapshot().prefix).toBe(1);
 const capture=client.checkpoint();client.dispose();await expect(capture).rejects.toThrow('disposed');expect(port.terminated).toBe(true);await expect(client.advance()).rejects.toThrow('disposed');
});
it('releases a pending DET comparison when worker message decoding fails',async()=>{
 vi.stubGlobal('Worker',Port);const pending=DetWorkerClient.create(),port=Port.last;port.reply({prefix:0});const client=await pending;
 const comparison=client.compare({version:'det-workbench/0.1',program:'baseline',prefix:0,saveHex:'',saveHash:''});port.onmessageerror?.();await expect(comparison).rejects.toThrow('decoding failed');expect(port.terminated).toBe(true);
});
