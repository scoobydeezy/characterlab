import {it,expect} from 'vitest';
import {runSemPhenomenonControls} from '../workbench/semPhenomenonControls';
import {createPhenomenonRecorder} from '../workbench/semPhenomenonRecorder';
it('records complete original binding and causal phenomenon assertions repeatably',async()=>{
 const r=await runSemPhenomenonControls();expect(await runSemPhenomenonControls()).toEqual(r);expect(r.groups.map(g=>g.cases.length)).toEqual([10,6]);
 for(const g of r.groups)for(const c of g.cases){const parsed=JSON.parse(c.evidence.exact);expect(parsed.assertions).toHaveLength(c.assertions);expect(parsed.assertions.every((a:{passed:boolean})=>a.passed)).toBe(true);}
 const mapping=JSON.parse(r.groups[1].cases[1].evidence.exact);expect(mapping.assertions.some((a:{actual:string})=>a.actual==='"causal-role/participant"')).toBe(true);expect(mapping.assertions.some((a:{actual:string})=>a.actual==='"causal-role/location"')).toBe(true);
});
it('fails when numeric or defined predicates are false',()=>{
 for(const body of [(r:ReturnType<typeof createPhenomenonRecorder>)=>r.expect(undefined).toBeDefined(),(r:ReturnType<typeof createPhenomenonRecorder>)=>r.expect(0).toBeGreaterThan(0),(r:ReturnType<typeof createPhenomenonRecorder>)=>r.expect('1').toBeGreaterThan(0)]){const r=createPhenomenonRecorder();expect(()=>r.it('deliberate failure',()=>body(r))).toThrow();}
});
