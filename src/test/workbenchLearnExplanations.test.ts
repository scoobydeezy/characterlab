import {expect,it} from 'vitest';
import {LearnWorkbenchRun} from '../workbench/learnAdapter';
import {explainLearn} from '../workbench/learnExplanations';
it('distinguishes unknown, stored zero, missing evidence and bounded measurement',async()=>{
 const a=await LearnWorkbenchRun.create('1/1/zero'),b=await LearnWorkbenchRun.create('2/1/zero'),m=await LearnWorkbenchRun.create('1/1/missing');
 await a.advance();await b.advance();await m.advance();
 const unknown=a.snapshot().explanations[0],known=b.snapshot().explanations[0];
 expect(unknown.measurement).toBe('0/1');expect(unknown.posteriorKnown).toBe(false);expect(unknown.applied).toBe(false);
 expect(known.posteriorKnown).toBe(true);expect(known.human).toContain('retired negative control');
 expect(unknown.kind).toBe('Lower bound');expect(m.snapshot().explanations).toEqual([]);
 expect(()=>explainLearn([true],1,1)).toThrow('Unclassified');expect(()=>explainLearn([],4,1)).toThrow('profile');
},600000);
it('uses evaluation-time records and preserves hidden-truth independence',async()=>{
 const a=await LearnWorkbenchRun.create('1/2/repeated'),b=await LearnWorkbenchRun.create('1/2/hidden');
 await a.advance();const first=a.snapshot().explanations[0];
 while(await a.advance()){}while(await b.advance()){}
 expect(a.snapshot().explanations[0]).toEqual(first);expect(a.snapshot().explanations).toEqual(b.snapshot().explanations);
 expect(first.human).toContain('ties-to-even');expect(first.human).toContain('not calibrated confidence');
 expect(a.snapshot().explanations.at(-1)?.kind).toBe('Point');
},600000);
