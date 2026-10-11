import {expect,it} from 'vitest';
import {BeliefWorkbenchRun} from '../workbench/beliefAdapter';
it('preserves unknown versus known zero and detaches inspection state',async()=>{
 const a=await BeliefWorkbenchRun.create('unknown-law-1'),b=await BeliefWorkbenchRun.create('knownZero-law-1');
 while(await a.advance()){}while(await b.advance()){}
 expect(a.snapshot().fields).toHaveLength(0);expect(b.snapshot().fields).toHaveLength(1);
 const s=b.snapshot();s.fields.length=0;expect(b.snapshot().fields).toHaveLength(1);
},600000);
it('authenticates and resumes complete original prefixes',async()=>{
 const a=await BeliefWorkbenchRun.create('mixed-law-1');const step=a.advance();
 expect(()=>a.snapshot()).toThrow('advancing');await expect(a.advance()).rejects.toThrow('in flight');await step;
 const c=a.checkpoint(),b=await BeliefWorkbenchRun.restore(c);
 let more=true;while(more){more=await a.advance();expect(await b.advance()).toBe(more);expect(b.checkpoint()).toEqual(a.checkpoint());}
 await expect(BeliefWorkbenchRun.restore({...c,program:'mixed-law-2'})).rejects.toThrow('mismatch');
 await expect(BeliefWorkbenchRun.restore({...c,prefix:33})).rejects.toThrow('Invalid');
},600000);
