import {it,expect} from 'vitest';
import {compareDeclarationCoverage} from './fixtures/campaign2DeclarationComparison';
it('VAL declaration coverage and recursive record admission match the finite construction-labelled corpus',async()=>{
 const cases=await compareDeclarationCoverage();expect(cases).toHaveLength(359);
 for(const c of cases)expect(c.agrees,JSON.stringify(c)).toBe(true);
});
