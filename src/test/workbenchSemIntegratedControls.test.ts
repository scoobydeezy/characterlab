import {it,expect} from 'vitest';
import {runSemIntegratedControls} from '../workbench/semIntegratedControls';
it('preserves canonical identity, poisoned-label and complete committed rollback witnesses',async()=>{
 const r=await runSemIntegratedControls();expect(await runSemIntegratedControls()).toEqual(r);expect(r.chains).toHaveLength(3);
 for(const c of r.chains){expect(c.identities.length).toBeGreaterThan(0);for(const i of c.identities){expect(i.accepted).toBe(true);expect(i.correctField).toBe(true);if(i.occurrence)expect(i.payloadKind).toBe('unsigned');}expect(new Set(c.identities.filter(i=>i.occurrence).map(i=>i.namespace)).size).toBeGreaterThanOrEqual(5);}
 const glen=r.chains.find(c=>c.observer==='character/glen')!;expect(glen).toBeDefined();expect(r.poison.canonicalHex).toBe(glen.canonicalHex);expect(r.poison.originalLabels).not.toEqual(r.poison.poisonedLabels);
 for(const id of ['210','211','216','212','213','223','224','225','227','237','240','235','236'])expect(glen.recordTypes).toContain(id);
 expect(glen.recordTypes).not.toContain('241');expect(glen.recordTypes).not.toContain('242');expect(Object.values(r.rollback.preserved)).toEqual([true,true,true,true]);expect(r.rollback.after.status).not.toEqual(r.rollback.before.status);
});
