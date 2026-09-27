import {it,expect} from 'vitest';
import {compareIndependentGates} from './fixtures/campaign2GateComparison';
it('FrozenBaseline uses a distinct frozen source across positive/negative steps, no-ops, removals and rejection',async()=>{
 const cases=await compareIndependentGates();expect(cases).toHaveLength(72);
 for(const c of cases)expect(c.agrees,JSON.stringify(c)).toBe(true);
},30000);
