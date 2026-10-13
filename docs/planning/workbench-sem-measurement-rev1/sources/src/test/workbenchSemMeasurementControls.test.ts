import {it,expect} from 'vitest';
import {runSemMeasurementControls} from '../workbench/semMeasurementControls';
it('preserves actual measurement citation, optional support and atomic settlement failure',async()=>{
 const r=await runSemMeasurementControls();expect(await runSemMeasurementControls()).toEqual(r);
 expect(r.measurement.lower).toBe('1/10');
 expect(r.measurement).toMatchObject({citationMatches:true,namespace:'1115',supportOrdinal:'7100',role:{kind:'exact',eventRoleId:'event-role/instrument'},ordinarySupportKeys:['observationId','observerId']});expect(r.measurement.track).not.toBe('7100');expect(r.measurement.ordinaryCount).toBeGreaterThan(0);
 for(const forbidden of ['measurementInterval','precision','truth/effect'])expect(r.measurement.binding.exact).not.toContain(forbidden);
 expect(r.rollback.preserved).toEqual({state:true,allocators:true,trace:true,outputs:true});expect(r.rollback.before.status).toBe('Active');expect(r.rollback.after.status).not.toBe('Active');expect(r.rollback.before.allocators).toContain('700');
});
