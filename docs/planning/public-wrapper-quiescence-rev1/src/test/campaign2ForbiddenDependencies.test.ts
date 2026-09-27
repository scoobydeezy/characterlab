import {it,expect} from 'vitest';
import {compareForbiddenDependencies} from './fixtures/campaign2ForbiddenDependencies';
it('VAL-U fixed qualification does not inspect ten test-only ambient dependency stand-ins',async()=>{
 const cases=await compareForbiddenDependencies();expect(cases).toHaveLength(20);
 for(const c of cases)expect(c.agrees,JSON.stringify(c)).toBe(true);
});
