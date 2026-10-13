import {afterEach,expect,it,vi} from 'vitest';
import menu from '../workbench/multisourceMenu.json';
import {MULTISOURCE_PROGRAMS,MultisourceWorkbenchRun} from '../workbench/multisourceAdapter';
import {MULTISOURCE_CONTRASTS,compareMultisource} from '../workbench/multisourceComparison';
afterEach(()=>vi.unstubAllGlobals());
it('retains every qualified program and contrast in the small UI menu',()=>{expect(menu.programs).toEqual(MULTISOURCE_PROGRAMS.map(p=>({id:p.id})));expect(menu.contrasts).toEqual(MULTISOURCE_CONTRASTS.map(c=>({id:c.id,a:c.a,b:c.b,label:c.label})));});
it('produces the unchanged native report in the worker and rejects a forged checkpoint',async()=>{
 let handle:(event:MessageEvent)=>Promise<void>=async()=>{throw Error('worker handler absent');};const replies:{id:number;result?:unknown;error?:string}[]=[];
 vi.stubGlobal('self',{addEventListener:(_name:string,fn:typeof handle)=>{handle=fn;},postMessage:(r:typeof replies[number])=>replies.push(r)});await import('../workbench/multisourceWorker');let id=0;const send=async(operation:string,data:object={})=>{await handle({data:{id:++id,operation,...data}} as MessageEvent);return replies.at(-1)!;};
 const a=await MultisourceWorkbenchRun.create('hidden-21'),b=await MultisourceWorkbenchRun.create('hidden-29');while(await a.advance()){}while(await b.advance()){}await send('restore',{checkpoint:a.checkpoint()});const before=(await send('checkpoint')).result;
 const result=await send('compare',{contrast:'hidden-reserve',checkpoint:b.checkpoint()});expect(result.error).toBeUndefined();expect(result.result).toEqual(compareMultisource('hidden-reserve',a.snapshot(),b.snapshot()));expect(result.result).toMatchObject({outputsEqual:true,stateEqual:false});
 const bad=await send('compare',{contrast:'hidden-reserve',checkpoint:{...b.checkpoint(),saveHash:'0'.repeat(64)}});expect(bad.error).toContain('digest');expect((await send('checkpoint')).result).toEqual(before);
},600000);
