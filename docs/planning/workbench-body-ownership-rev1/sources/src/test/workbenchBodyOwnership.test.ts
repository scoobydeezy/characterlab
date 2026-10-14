import {it,expect} from 'vitest';
import {inspectBodyOwnership} from '../workbench/bodyOwnership';
it('retains same-evidence/different-body controls without making hidden truth character evidence',async()=>{
 const a=await inspectBodyOwnership('alias41'),b=await inspectBodyOwnership('alias49'),fine=await inspectBodyOwnership('fine41');
 const value=(r:typeof a,id:string)=>r.probes[0].values.find(v=>v.candidate===id)!.pressure;
 expect(a.probes[0].diagnosticBody).not.toBe(b.probes[0].diagnosticBody);expect(value(a,'Mediated')).toEqual({kind:'Known',exact:'0/1'});expect(value(a,'Mediated')).toEqual(value(b,'Mediated'));expect(value(a,'IndependentNeed')).not.toEqual(value(b,'IndependentNeed'));expect(value(fine,'Mediated')).toEqual({kind:'Known',exact:'1/6'});
 expect(value(a,'MeterBehindSensor')).toEqual(value(a,'Mediated'));expect(value(a,'CachedEvidence')).toEqual(value(a,'Mediated'));
},600000);
it('preserves unavailable pressure and absent motive ground separately from known zero',async()=>{
 const r=await inspectBodyOwnership('denied');expect(r.probes.length).toBeGreaterThan(0);
 for(const p of r.probes){expect(p.values.find(v=>v.candidate==='Mediated')!.pressure).toEqual({kind:'Unavailable'});expect(p.values.find(v=>v.candidate==='CachedEvidence')!.pressure).toEqual({kind:'Unavailable'});expect(p.values.find(v=>v.candidate==='IndependentNeed')!.pressure.kind).toBe('Known');expect(p.ground).toBe('NoGround');}
 await expect(inspectBodyOwnership('unknown')).rejects.toThrow('original');
},600000);
