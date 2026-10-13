import {it,expect} from 'vitest';
import {runSemShortcutControls} from '../workbench/semShortcutControls';
import {digest} from '../workbench/canonical';
it('records original integrated refusal and structural witnesses repeatably',async()=>{
 const r=await runSemShortcutControls();expect(await runSemShortcutControls()).toEqual(r);expect(r.cases).toHaveLength(12);
 expect(r.cases.map(c=>c.failures.map(f=>f.code))).toEqual([['UNKNOWN_SEMANTIC_NAMESPACE','INVALID_OCCURRENCE_ORDINAL'],Array(4).fill('UNADMITTED_CONTRACT_VERSION'),['FORBIDDEN_TRUTH_FIELD'],['ILLEGAL_UNION_LAYOUT'],[],[],[],['FORBIDDEN_EMISSION_TARGET'],['FORBIDDEN_TRUTH_FIELD'],[],['UNKNOWN_SEMANTIC_FIELD'],['UNADMITTED_CONTRACT_VERSION']]);
 for(const c of r.cases){expect(await digest(new TextEncoder().encode(c.evidence.exact))).toBe(c.evidence.sha256);const p=JSON.parse(c.evidence.exact);expect(p.assertions.every((a:{passed:boolean})=>a.passed)).toBe(true);expect(c.assertions).toBeGreaterThan(0);}
});
