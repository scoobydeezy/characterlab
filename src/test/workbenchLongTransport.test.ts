import {it,expect,vi,afterEach} from 'vitest';
import {LongWorkerClient} from '../workbench/longWorkerClient';
class Port{
 static latest:Port;onmessage?:(event:{data:unknown})=>void;onmessageerror?:()=>void;requests:{id:number;operation:string}[]=[];terminated=false;failPost=false;
 constructor(){Port.latest=this;}postMessage(q:{id:number;operation:string}){if(this.failPost)throw Error('post failed');this.requests.push(q);}terminate(){this.terminated=true;}reply(result:unknown){this.onmessage?.({data:{id:this.requests.at(-1)!.id,result}});}
}
afterEach(()=>vi.unstubAllGlobals());
it('preserves detached committed state while serializing, recovering failed posts and disposing',async()=>{
 vi.stubGlobal('Worker',Port);const pending=LongWorkerClient.create(),port=Port.latest;port.reply({prefix:0,observerHex:'00'});const client=await pending;
 const step=client.advance();await expect(client.checkpoint()).rejects.toThrow('in flight');expect(client.snapshot().prefix).toBe(0);port.reply({moved:true,snapshot:{prefix:1,observerHex:'01'}});expect(await step).toBe(true);const copy=client.snapshot();copy.observerHex='changed';expect(client.snapshot().observerHex).toBe('01');
 port.failPost=true;await expect(client.checkpoint()).rejects.toThrow('post failed');port.failPost=false;
 const capture=client.checkpoint();client.dispose();await expect(capture).rejects.toThrow('disposed');expect(port.terminated).toBe(true);await expect(client.advance()).rejects.toThrow('disposed');port.reply({prefix:9});expect(client.snapshot().prefix).toBe(1);
});
it('cleans up startup decoding failure',async()=>{vi.stubGlobal('Worker',Port);const pending=LongWorkerClient.create();Port.latest.onmessageerror?.();await expect(pending).rejects.toThrow('decoding');expect(Port.latest.terminated).toBe(true);});
