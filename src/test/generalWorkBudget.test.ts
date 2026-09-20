import {it,expect} from 'vitest';
import {deriveGeneralWorkBudget} from '../campaign3/generalWorkBudget';
it('adds inherited stages and uses output cardinalities and reserved/nested slots',()=>{
 const budget=deriveGeneralWorkBudget();
 expect(budget.baseline.work).toBe(80);expect(budget.feedback.work).toBe(80);
 expect(budget.inherited.work).toBe(12);expect(budget.work).toBe(92n);
 expect(budget.baseline.outputs).toBeGreaterThan(58);
 const stages=new Map(budget.baseline.stages.map(s=>[s.stage,s]));
 expect(stages.get('current-sample')!.slotMaximum).toBe(16);
 expect(stages.get('current-freeze')!.slotMaximum).toBe(0);
 expect(stages.get('ordinary-memory-formation')!.invocations).toBe(4);
 expect(stages.get('retained-attribution')!.invocations).toBe(1);
 expect(stages.get('significance-join')!.invocations).toBe(1);
 expect(stages.get('current-recollection')!.outputMaximum).toBeGreaterThan(1);
});
