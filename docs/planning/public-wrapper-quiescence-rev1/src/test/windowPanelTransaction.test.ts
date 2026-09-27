import {it,expect} from 'vitest';
import {createWindowPanelManager as create,prepareWindowPanel as prepare,windowPanelSnapshot as snapshot} from '../campaign3/windowPanelTransaction';
const observer='observer/a',panel=(n:number)=>({observer,observation:BigInt(n*10),detection:BigInt(n*10+1),sample:{kind:'Present' as const,at:BigInt(n),glyph:0,stage:n===1?'Before' as const:n===4?'After' as const:'Motion' as const}});
it('WPT-A: pending token, abort, stale/repeated commit and result detachment',()=>{
 const m=create(observer),initial=snapshot(m);expect(()=>prepare({} as typeof m,panel(1))).toThrow();
 const p=prepare(m,panel(1));expect(()=>prepare(m,panel(2))).toThrow();expect(snapshot(m)).toEqual(initial);p.close();expect(()=>p.commit()).toThrow();expect(snapshot(m)).toEqual(initial);
 const q=prepare(m,panel(1));if('context'in q.result)(q.result.context as {observerId:string}).observerId='changed';q.commit();expect(snapshot(m).window.active!.context.observerId).toBe(observer);expect(()=>q.commit()).toThrow();q.close();
});
it('WPT-B: every prefix restores only last window and SEM event files',()=>{
 const all=[1,2,3,4].map(panel),m=create(observer);for(const p of all)prepare(m,p).commit();const expected=snapshot(m);
 for(let n=0;n<=4;n++){const before=create(observer);for(const p of all.slice(0,n))prepare(before,p).commit();const s=snapshot(before),after=create(observer,s.files,s.window);for(const p of all.slice(n))prepare(after,p).commit();expect(snapshot(after)).toEqual(expected);expect(Object.keys(snapshot(after)).sort()).toEqual(['files','observer','window']);}
});
