import {it,expect} from 'vitest';
import {runSemAcceptanceControls} from '../workbench/semAcceptanceControls';
import {createAcceptanceRecorder} from '../workbench/semAcceptanceRecorder';
it('executes ten original gates, completeness and actual multi-observer replay',async()=>{
 const r=await runSemAcceptanceControls();expect(await runSemAcceptanceControls()).toEqual(r);
 expect(r.conditions.map(c=>c.item)).toEqual([1,2,3,4,5,6,7,8,9,10]);expect(r.groups.map(g=>g.cases.length)).toEqual([11,2]);
 expect(r.conditions[5].kind).toBe('Reference plus executable supplement');expect(r.conditions[6].kind).toBe('Ledger reference');
 for(const g of r.groups)for(const c of g.cases){const p=JSON.parse(c.evidence.exact);expect(p.assertions).toHaveLength(c.assertions);expect(p.assertions.every((a:{passed:boolean})=>a.passed)).toBe(true);}
 expect(r.groups[0].cases[7].failures.map(f=>f.code)).toEqual(Array(9).fill('FORBIDDEN_EMISSION_TARGET'));
 const replay=JSON.parse(r.groups[1].cases[0].evidence.exact);expect(replay.assertions.filter((a:{actual:string;expected:string})=>a.actual.length>1000&&a.actual===a.expected).length).toBeGreaterThanOrEqual(4);
 const allocator=JSON.parse(r.groups[1].cases[1].evidence.exact);expect(allocator.assertions.some((a:{negated:boolean;passed:boolean})=>a.negated&&a.passed)).toBe(true);
});
it('fails for missing/wrong exceptions, missing values and false numeric/null predicates',async()=>{
 type Recorder=ReturnType<typeof createAcceptanceRecorder>;
 const bad=[(r:Recorder)=>r.expect(()=>{}).toThrowError({code:'NO'}),(r:Recorder)=>r.expect(()=>{throw {code:'WRONG'};}).toThrowError({code:'NO'}),(r:Recorder)=>r.expect(undefined).toBeDefined(),(r:Recorder)=>r.expect(0n).toBeGreaterThan(0n),(r:Recorder)=>r.expect(1).toBeGreaterThan(0n),(r:Recorder)=>r.expect(null).not.toBeNull()];
 for(const body of bad){const r=createAcceptanceRecorder();r.it('deliberate failure',async()=>{await Promise.resolve();body(r);});await expect(r.finish()).rejects.toThrow();}
 const r=createAcceptanceRecorder();r.it('number and bigint comparisons',()=>{r.expect(1).toBeGreaterThan(0);r.expect(1n).toBeGreaterThan(0n);});expect(await r.finish()).toHaveLength(1);
});
