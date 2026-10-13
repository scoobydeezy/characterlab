import {afterEach,expect,it,vi} from 'vitest';
import {SemWorkbenchRun} from '../workbench/semAdapter';
import {verifySemReplay} from '../workbench/semReplay';
afterEach(()=>vi.unstubAllGlobals());
it('delivers exact SEM replay evidence through the actual worker at every prefix',async()=>{
 let handle:(event:MessageEvent)=>Promise<void>=async()=>{throw Error('worker handler absent');};const replies:{id:number;result?:unknown;error?:string}[]=[];
 vi.stubGlobal('self',{addEventListener:(_name:string,fn:typeof handle)=>{handle=fn;},postMessage:(r:typeof replies[number])=>replies.push(r)});await import('../workbench/semWorker');let id=0;const send=async(operation:string)=>{await handle({data:{id:++id,operation}} as MessageEvent);return replies.at(-1)!;};
 await send('create');const native=await SemWorkbenchRun.create();for(let prefix=0;prefix<=3;prefix++){const before=(await send('checkpoint')).result,result=await send('verify');expect(result.error).toBeUndefined();expect(result.result).toEqual(await verifySemReplay(native));expect(result.result).toMatchObject({prefix,projectionEqual:true});expect((result.result as {fields:{equal:boolean}[]}).fields.every(f=>f.equal)).toBe(true);expect((await send('checkpoint')).result).toEqual(before);if(prefix<3){await send('advance');await native.advance();}}
});
