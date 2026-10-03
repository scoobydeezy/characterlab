import {it,expect} from 'vitest';
import {createBiologicalRun,restoreBiologicalRun} from '../campaign3/biologicalIntegration';
import {regulatoryCase,REGULATORY_CASES} from './affectRegulatoryFixtures';
async function run(name:typeof REGULATORY_CASES[number],prefix=12){const c=regulatoryCase(name),r=createBiologicalRun(c.law,c.frames,c.config,0);for(let i=0;i<prefix;i++)await r.step();return r;}
it('identical complete body histories and current sensations admit different learned threat',async()=>{
 const a=(await run('FalseHarm',2)).snapshot(),b=(await run('NoHarm',2)).snapshot();expect(a.world).toEqual(b.world);expect(a.rows[1].before).toEqual(b.rows[1].before);expect(a.rows[1].beliefs.drug.harm).toBe(600);expect(b.rows[1].beliefs.drug.harm).toBe(0);expect(a.rows[1].affect.threat).toBe(270);expect(b.rows[1].affect.threat).toBe(0);
});
it('the existing strictly later appraisal impulse makes the third physical consequence differ',async()=>{
 const a=(await run('FalseHarm')).snapshot(),b=(await run('NoHarm')).snapshot(),c=(await run('NoImpulse')).snapshot();expect(a.world.slice(0,2)).toEqual(b.world.slice(0,2));expect(a.world[2].state.channels.stress.level).toBe(135);expect(b.world[2].state.channels.stress.level).toBe(0);expect(c.world).toEqual(b.world);expect(c.rows[1].affect).toEqual(a.rows[1].affect);expect(a.rows.map(r=>r.intent)).toEqual(b.rows.map(r=>r.intent));
});
it('goal-only and evidence-denial interventions do not become changes to the physical prehistory',async()=>{
 const a=(await run('FalseHarm',2)).snapshot();for(const name of ['NoGoal','DeniedHarm','NoReceipt'] as const){const b=(await run(name,2)).snapshot();expect(a.world).toEqual(b.world);expect(b.rows[1].affect.threat).toBe(name==='NoGoal'?0:null);}expect((await run('NoGoal',2)).snapshot().rows[1].beliefs).toEqual(a.rows[1].beliefs);
});
it('hidden physical changes preserve the complete component observer history',async()=>{const a=await run('HiddenA'),b=await run('HiddenB');expect(a.observerView()).toEqual(b.observerView());expect(a.snapshot().state).not.toEqual(b.snapshot().state);});
it('the decisive acquisition/appraisal prefixes restore exactly and faults preserve the original state',async()=>{
 const c=regulatoryCase('FalseHarm'),r=createBiologicalRun(c.law,c.frames,c.config,0),saves=[r.save()];for(let i=0;i<3;i++){await r.step();saves.push(r.save());}for(let i=0;i<3;i++){const x=await restoreBiologicalRun(c.law,c.frames,saves[i],c.config,0);await x.step();expect(x.save()).toEqual(saves[i+1]);}for(const fault of ['after-choice','before-commit'] as const){const x=await restoreBiologicalRun(c.law,c.frames,saves[2],c.config,0);await expect(x.step(fault)).rejects.toThrow('BIO_INTEGRATION_INJECTED');expect(x.save()).toEqual(saves[2]);}
});
