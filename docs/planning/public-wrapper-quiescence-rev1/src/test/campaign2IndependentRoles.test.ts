import {it,expect} from 'vitest';
import {compareIndependentRoles} from './fixtures/campaign2RoleComparison';
it('independent origin/IDN and role oracle agrees on exact acceptance and error carrier across empty/populated content',async()=>{
 const report=await compareIndependentRoles();expect(report).toHaveLength(234);
 for(const row of report)expect(row.actual,row.name).toBe(row.expected);
});
