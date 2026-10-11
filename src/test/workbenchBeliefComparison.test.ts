import {expect,it} from 'vitest';
import {BeliefWorkbenchRun} from '../workbench/beliefAdapter';
import {compareBelief} from '../workbench/beliefComparison';
it('separates model identity, belief equality and alignment for goal controls',async()=>{
 const a=await BeliefWorkbenchRun.create('misleading-law-1'),b=await BeliefWorkbenchRun.create('goal-0-law-1');
 await a.advance();expect(compareBelief('goal/1/0',a.snapshot(),b.snapshot()).beliefStateEqual).toBeNull();
 await b.advance();const c=compareBelief('goal/1/0',a.snapshot(),b.snapshot());
 expect(c.beliefStateEqual).toBe(true);expect(c.modelIdentityEqual).toBe(false);expect(c.exactSaveEqual).toBe(false);
 c.a.fields.length=0;expect(a.snapshot().fields.length).toBe(1);
 expect(()=>compareBelief('hidden/1',a.snapshot(),b.snapshot())).toThrow('ordered pair');
 expect(()=>compareBelief('goal/1/0',a.snapshot(),{...b.snapshot(),modelHash:a.snapshot().modelHash})).toThrow('distinct models');
},600000);
