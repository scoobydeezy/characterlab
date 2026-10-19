import {it,expect} from 'vitest';
import {SubstitutionWorkbenchRun as Run} from '../workbench/substitutionAdapter';
it('preserves concentrated versus diversified repertoire and exact restored continuation',async()=>{
 const a=await Run.create('LatestHistory/concentrated'),b=await Run.create();
 for(let i=0;i<5;i++){await a.advance();await b.advance();}
 const cp=b.checkpoint(),restored=await Run.restore(cp);expect(restored.snapshot()).toEqual(b.snapshot());
 await a.advance();await b.advance();await restored.advance();expect(restored.checkpoint()).toEqual(b.checkpoint());
 expect(a.snapshot().observer.rows.at(-1)!.intent).toBe(-1);expect(b.snapshot().observer.rows.at(-1)!.intent).toBe(1);
 expect(a.snapshot().state.physical.reduce((a,b)=>a+b)).toBe(4);expect(b.snapshot().state.physical.reduce((a,b)=>a+b)).toBe(5);
 await expect(Run.restore({...cp,prefix:4})).rejects.toThrow('prefix mismatch');
 await expect(Run.restore({...cp,program:'LatestHistory/concentrated'})).rejects.toThrow('identity/digest');
 await expect(Run.restore({...cp,saveHash:'0'.repeat(64)})).rejects.toThrow('identity/digest');
},600000);
it('keeps physical truth separate and protects committed snapshots during overlap',async()=>{
 const a=await Run.create('LatestHistory/deniedFeedback'),b=await Run.create('LatestHistory/hiddenBlocked');
 const pending=a.advance();expect(()=>a.snapshot()).toThrow('advancing');expect(()=>a.checkpoint()).toThrow('advancing');await expect(a.advance()).rejects.toThrow('in flight');await pending;await b.advance();
 while(await a.advance())await b.advance();expect(a.snapshot().observer).toEqual(b.snapshot().observer);expect(a.snapshot().state.physical).not.toEqual(b.snapshot().state.physical);
 const view=a.snapshot(),before=a.checkpoint();view.state.physical[0]=999;view.observer.rows.length=0;expect(a.checkpoint()).toEqual(before);expect(a.snapshot().observer.rows).toHaveLength(8);expect(await a.advance()).toBe(false);expect(a.checkpoint()).toEqual(before);
},600000);
