import {it,expect} from 'vitest';
import {createImportanceRun as create,restoreImportanceRun as restore,LAWS,type Law} from '../campaign3/importanceUrgency';
import {importanceFrames as frames} from './importanceUrgencyFixtures';
async function run(i:number|null=1000,u=1000,law:Law='Factored',seed=7){const r=create(law,frames(i,u),seed);while(await r.step()){}return r;}
it('independent importance and urgency change actual reason distributions with fixed competitor',async()=>{
 const a=await run(1000,0),b=await run(1000,1000),c=await run(500,0),d=await run(500,1000);
 expect([a,b,c,d].map(x=>x.snapshot().rows[0].strength)).toEqual([500,1000,250,500]);
 expect(a.snapshot().rows[0].choice.probabilities).not.toEqual(b.snapshot().rows[0].choice.probabilities);
 expect(a.snapshot().rows[0].choice.probabilities).not.toEqual(c.snapshot().rows[0].choice.probabilities);
});
it('equal initial products do not erase different retained importance when urgency recedes',async()=>{
 const a=(await run(1000,0)).snapshot(),b=(await run(500,1000)).snapshot();
 expect(a.rows[0].choice).toEqual(b.rows[0].choice);expect(a.rows[1].strength).toBe(500);expect(b.rows[1].strength).toBe(250);
 expect(a.rows[1].choice.probabilities).not.toEqual(b.rows[1].choice.probabilities);
 expect(a.rows.every(r=>r.importance===1000)).toBe(true);expect(b.rows.every(r=>r.importance===500)).toBe(true);
});
it('refold is exactly behaviorally equivalent across all eight declared seeds',async()=>{for(let seed=0;seed<8;seed++){const a=await run(500,1000,'Factored',seed),b=await run(500,1000,'RefoldImportance',seed);expect(a.observerView()).toEqual(b.observerView());expect(b.snapshot().importance).toBeNull();}});
it('collapsed competitors miss independent effects and subsequent urgency changes',async()=>{
 expect((await run(1000,0,'UrgencyOnly')).snapshot().rows[0].strength).toBe(0);
 expect((await run(1000,1000,'ImportanceOnly')).snapshot().rows[0].strength).toBe(500);
 expect((await run(500,1000,'FrozenProduct')).snapshot().rows[1].strength).toBe(500);
 expect((await run(500,1000)).snapshot().rows[1].strength).toBe(250);
});
it('unknown urgency differs from known zero; zero importance and absent adoption remain distinct',async()=>{
 const r=(await run()).snapshot();expect(r.rows[1].urgency).toBe(0);expect(r.rows[1].strength).toBe(500);expect(r.rows[2].urgency).toBeNull();expect(r.rows[2].strength).toBe(0);
 expect((await run(0)).snapshot().rows[0].importance).toBe(0);expect((await run(null)).snapshot().rows[0].importance).toBeNull();
 expect((await run(0)).snapshot().rows.every(x=>x.strength===0)).toBe(true);
});
it('hidden world and denied sources cannot enter later safe views',async()=>{
 for(const mode of ['hidden','adoption','urgency']){const a=frames(),b=frames();if(mode==='hidden')b.forEach(f=>f.hiddenUrgency=0);if(mode==='adoption'){a[0].adoptionVisible=b[0].adoptionVisible=false;b[0].adopt=500;}if(mode==='urgency'){a.forEach(f=>f.urgencyVisible=false);b.forEach(f=>{f.urgencyVisible=false;f.urgency=0;});}const x=create('Factored',a),y=create('Factored',b);while(await x.step())await y.step();expect(x.observerView()).toEqual(y.observerView());}
});
it('all laws restore every complete prefix and the next successor exactly',async()=>{for(const law of LAWS){const r=create(law,frames());for(let prefix=0;prefix<=6;prefix++){const restored=await restore(law,frames(),7,prefix,r.save());expect(restored.snapshot()).toEqual(r.snapshot());expect(await restored.step()).toBe(await r.step());expect(restored.save()).toEqual(r.save());}}},60000);
it('faults and concurrent settlement preserve committed history and retry draws',async()=>{for(const fault of ['after-choice','before-commit'] as const){const r=create('Factored',frames());await r.step();const before=r.save();await expect(r.step(fault)).rejects.toThrow('IU_INJECTED');expect(r.save()).toEqual(before);const restored=await restore('Factored',frames(),7,1,before);const pending=r.step();await expect(r.step()).rejects.toThrow('IU_CONCURRENT');await pending;await restored.step();expect(r.save()).toEqual(restored.save());}});
it('copies inputs, rejects getters/extra fields and rejects forged saves and changed originals',async()=>{
 const f=frames(),r=create('Factored',f);f[0].adopt=0;await r.step();expect(r.snapshot().rows[0].importance).toBe(1000);
 const bad=frames();Object.defineProperty(bad[0],'urgency',{get(){throw Error('GETTER_RAN');}});expect(()=>create('Factored',bad)).toThrow('IU_DATA');
 const extra=[{...frames()[0],extra:true},...frames().slice(1)];expect(()=>create('Factored',extra)).toThrow('IU_DATA');
 const saved=r.save();saved[saved.length-1]^=1;await expect(restore('Factored',frames(),7,1,saved)).rejects.toThrow('IU_SAVE_MISMATCH');
 await expect(restore('Factored',frames(500),7,1,r.save())).rejects.toThrow('IU_SAVE_MISMATCH');
});
