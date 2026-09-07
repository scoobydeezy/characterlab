import {it,expect} from 'vitest';
import {compareIndependentReg} from './fixtures/campaign2RegComparison';
it('REG authored references and adapted bounds agree with independent signed-floor expectations',async()=>{
 const cases=await compareIndependentReg();expect(cases).toHaveLength(252);
 for(const c of cases)expect(c.agrees,c.name).toBe(true);
});
