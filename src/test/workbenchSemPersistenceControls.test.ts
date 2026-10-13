import {it,expect} from 'vitest';
import {runSemPersistenceControls} from '../workbench/semPersistenceControls';
it('preserves actual native save/load bytes, rollback and bounded observer isolation',async()=>{
 const r=await runSemPersistenceControls();expect(await runSemPersistenceControls()).toEqual(r);expect(r.persistence.midpointEqual).toBe(true);expect(r.persistence.continuationEqual).toBe(true);const p=JSON.parse(r.persistence.evidence.exact);expect(p.beforeLoad).toEqual(p.afterLoad);expect(p.straight).toEqual(p.continued);
 expect(r.rollback.failure).toBe('injected semantic-state commit failure');expect(r.rollback.before.status).toBe('Active');expect(r.rollback.after.status).toBe('Failed');expect(Object.values(r.rollback.preserved)).toEqual([true,true,true,true]);
 const i=JSON.parse(r.isolation.evidence.exact);expect(i.solo.runtimeIds).toEqual([{$bigint:'500'},{$bigint:'501'}]);expect(i.interleaved.runtimeIds).toEqual([{$bigint:'501'},{$bigint:'503'}]);expect(r.isolation.sameObserverState).toBe(true);expect(r.isolation.sameObserverTransitions).toBe(true);expect(r.isolation.differentRuntimeIds).toBe(true);
});
