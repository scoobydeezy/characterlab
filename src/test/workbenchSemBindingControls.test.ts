import {it,expect} from 'vitest';
import {runSemBindingControls} from '../workbench/semBindingControls';
it('preserves original binding multiplicity, scope, opacity, closure and rollback',async()=>{
 const r=await runSemBindingControls();expect(await runSemBindingControls()).toEqual(r);expect(()=>JSON.stringify(r)).not.toThrow();expect(r.cases).toHaveLength(8);expect(r.negatives).toHaveLength(12);
 const multi=r.cases[0];expect(multi.bindings).toHaveLength(2);expect(new Set(multi.bindings.map(b=>b.id)).size).toBe(2);expect(new Set(multi.bindings.map(b=>b.referent)).size).toBe(1);
 expect(r.cases[1].bindings.filter(b=>b.role==='event-role/companion')).toHaveLength(2);expect(r.replay).toEqual({structuralCopyEqual:true,reorderedEqual:true,shiftedGrammarEqual:true,shiftedIdsDiffer:true});
 expect(r.rollback.firstAllocated).toBe('90');expect(r.rollback.before.status).toBe('Active');expect(r.rollback.after.status).toBe('Failed');expect(r.rollback.preserved).toEqual({state:true,allocators:true,trace:true,outputs:true});
 expect(r.projection.map(p=>p.present)).toEqual([true,true,true,false]);expect(r.projection.map(p=>p.role)).toEqual([{kind:'exact',eventRoleId:'event-role/companion'},{kind:'exact',eventRoleId:'event-role/participant'},{kind:'unresolved'},null]);for(const p of r.projection.slice(0,3))expect(p.fields).toEqual(['eventRoleEvidence','perceptualReferentId']);
 expect(r.registry.roles).toContain('event-role/beneficiary');expect(r.registry.roles).not.toContain('event-role/context');expect(r.registry.roles).not.toContain('causal-role/cause');
 expect(r.negatives.slice(0,2).map(n=>n.failure.code)).toEqual(['REFERENT_DOMAIN_VIOLATION','REFERENT_DOMAIN_VIOLATION']);expect(r.negatives.slice(-4).map(n=>n.failure.code)).toEqual(['UNKNOWN_EVENT_ROLE','DUPLICATE_BINDING_PAIR','FORBIDDEN_BINDING_FIELD','ROLE_CARDINALITY_VIOLATION']);
});
