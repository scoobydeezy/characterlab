import {it,expect,vi,afterEach} from 'vitest';
import {BioWorkerClient} from '../workbench/bioWorkerClient';
class Port {
 static latest:Port;onmessage?:(event:{data:unknown})=>void;onmessageerror?:()=>void;
 requests:{id:number;operation:string}[]=[];terminated=false;
 constructor(){Port.latest=this;}postMessage(request:{id:number;operation:string}){this.requests.push(request);}terminate(){this.terminated=true;}
 reply(result:unknown){this.onmessage?.({data:{id:this.requests.at(-1)!.id,result}});}
}
afterEach(()=>vi.unstubAllGlobals());
it('serializes commands, detaches snapshots and rejects pending work on disposal',async()=>{
 vi.stubGlobal('Worker',Port);const pending=BioWorkerClient.create();const port=Port.latest;port.reply({prefix:0,records:[]});const client=await pending;
 const step=client.advance();await expect(client.advance()).rejects.toThrow('in flight');port.reply({moved:true,snapshot:{prefix:1,records:[]}});expect(await step).toBe(true);
 const view=client.snapshot();view.prefix=99;expect(client.snapshot().prefix).toBe(1);
 const capture=client.checkpoint();client.dispose();await expect(capture).rejects.toThrow('disposed');expect(port.terminated).toBe(true);port.reply({prefix:99});expect(client.snapshot().prefix).toBe(1);await expect(client.advance()).rejects.toThrow('disposed');
});
it('terminates a worker whose startup reply cannot be decoded',async()=>{
 vi.stubGlobal('Worker',Port);const pending=BioWorkerClient.create();Port.latest.onmessageerror?.();await expect(pending).rejects.toThrow('decoding');expect(Port.latest.terminated).toBe(true);
});
