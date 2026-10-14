import {it,expect,vi,afterEach} from 'vitest';
import {BodyWorkerClient} from '../workbench/bodyWorkerClient';
class Port{
 static latest:Port;onmessage?:(event:{data:unknown})=>void;onmessageerror?:()=>void;requests:{id:number;operation:string}[]=[];terminated=false;failPost=false;
 constructor(){Port.latest=this;}postMessage(q:{id:number;operation:string}){if(this.failPost)throw Error('post failed');this.requests.push(q);}terminate(){this.terminated=true;}reply(result:unknown){this.onmessage?.({data:{id:this.requests.at(-1)!.id,result}});}
}
afterEach(()=>vi.unstubAllGlobals());
it('keeps committed state detached and serializes/disposes ownership requests',async()=>{
 vi.stubGlobal('Worker',Port);const pending=BodyWorkerClient.create('denied'),port=Port.latest;port.reply({prefix:0,fields:[]});const client=await pending;
 const report=client.ownership();await expect(client.advance()).rejects.toThrow('in flight');port.reply({program:'denied'});expect(await report).toEqual({program:'denied'});expect(client.snapshot().prefix).toBe(0);const copy=client.snapshot();copy.prefix=99;expect(client.snapshot().prefix).toBe(0);
 port.failPost=true;await expect(client.checkpoint()).rejects.toThrow('post failed');port.failPost=false;
 const capture=client.checkpoint();client.dispose();await expect(capture).rejects.toThrow('disposed');expect(port.terminated).toBe(true);await expect(client.advance()).rejects.toThrow('disposed');
});
it('cleans up startup decoding failure',async()=>{vi.stubGlobal('Worker',Port);const pending=BodyWorkerClient.create();Port.latest.onmessageerror?.();await expect(pending).rejects.toThrow('decoding');expect(Port.latest.terminated).toBe(true);});
