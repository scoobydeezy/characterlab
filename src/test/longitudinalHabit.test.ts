import {it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {createHabitReceiver as create,restoreHabitReceiver as restore,type HabitProfile} from '../campaign3/longitudinalHabit';
const profile:HabitProfile={law:'Derived',seed:0,alternateCue:false,visible:true,keepEpisodes:false,relearning:'Observed'};
const standing=Array.from({length:16},()=>Q.of(0n));
async function run(change:Partial<HabitProfile>={},count=16){const r=create({...profile,...change});for(let i=0;i<count;i++)await r.step(standing[i]);return r;}
it('actual observed practice creates its own episodes; intervening observations remove them without changing cue history',async()=>{
 const r=await run({},7);expect(r.recallPractice()).toHaveLength(6);const before=r.snapshot();await r.step(Q.of(0n));const after=r.snapshot(),gap=after.rows[7];
 expect(r.recallPractice()).toHaveLength(0);expect(gap.losses).toHaveLength(6);expect(gap.historyBefore).toBe(gap.historyAfter);expect(after.history).toBe(before.history);
 expect(after.protocol.filter(p=>p.source.startsWith('admitted-30')).every(p=>p.completeLoss)).toBe(true);
});
it('KeepAll retains exact practice content while current belief, goals and habit behavior remain identical',async()=>{
 const a=await run({},10),b=await run({keepEpisodes:true},10);expect(a.recallPractice()).toHaveLength(0);expect(b.recallPractice()).toHaveLength(6);
 expect(a.snapshot().history).toBe(b.snapshot().history);expect(a.snapshot().goals).toEqual(b.snapshot().goals);
 expect(a.snapshot().rows.map(x=>x.choice)).toEqual(b.snapshot().rows.map(x=>x.choice));
});
it('a rest goal inhibits available learned action, then release exposes a neutral response without changing past practice',async()=>{
 const s=(await run({},11)).snapshot();for(const i of [8,9])expect(s.rows[i]).toMatchObject({available:true,performed:false,practiceBefore:0});
 expect(s.rows[10].choice.mode).toBe('QuietRoll');expect(s.rows[10].beliefBefore).toBe(false);expect(s.rows[10].goalsBefore.every(g=>g.status==='Withdrawn')).toBe(true);
});
it('renewed actual practice and admitted positive outcomes restore availability after extinction; report-only controls do not',async()=>{
 for(let seed=0;seed<8;seed++){
  const a=(await run({seed})).snapshot(),h=(await run({seed,relearning:'Hidden'})).snapshot(),u=(await run({seed,relearning:'Unavailable'})).snapshot();
  expect(a.rows[12].performed).toBe(true);expect(a.rows[13].performed).toBe(true);expect(a.rows[14]).toMatchObject({beliefBefore:false,available:true,strength:'447/512'});
  expect(h.rows[12]).toMatchObject({performed:true,observed:false});expect(u.rows[12]).toMatchObject({opportunity:false,performed:false});
  for(const x of [h,u])expect(x.rows[14]).toMatchObject({beliefBefore:false,available:false,strength:'63/128',performed:false});
 }
});
it('changed cue blocks old history but can acquire its own new response through observed practice',async()=>{
 const s=(await run({alternateCue:true})).snapshot();expect(s.rows[10]).toMatchObject({strength:'0/1',available:false,performed:false});expect(s.rows[14]).toMatchObject({cue:true,strength:'3/4',available:true,beliefBefore:false});
});
it('stored and derived readers agree across eight seeds and both retention settings',async()=>{
 for(let seed=0;seed<8;seed++)for(const keepEpisodes of [false,true]){const a=(await run({seed,keepEpisodes})).snapshot(),b=(await run({seed,keepEpisodes,law:'Stored'})).snapshot();expect(a.rows).toEqual(b.rows);expect(a.memory).toEqual(b.memory);expect(a.protocol).toEqual(b.protocol);}
});
it('belief-only and erased-history controls differ from learned availability without conflating episodic and habit owners',async()=>{
 const b=(await run({law:'ExplicitBeliefOnly'})).snapshot(),e=(await run({law:'EraseHistory',keepEpisodes:true})).snapshot();expect(b.rows[10].available).toBe(false);expect(b.rows[14].available).toBe(false);expect(e.rows[10].available).toBe(false);expect(e.rows[10].practiceBefore).toBe(6);
});
it('hidden initial outcomes produce neither practice episodes nor acquired history',async()=>{
 const r=await run({visible:false},8);expect(r.recallPractice()).toHaveLength(0);expect(r.snapshot().rows.slice(1,7).every(x=>x.performed&&!x.observed)).toBe(true);expect(r.snapshot().protocol).toHaveLength(6);
});
it('memory, governance, learning and goal lifecycle roll back atomically; publication and caller mutations cannot leak',async()=>{
 for(const prefix of [7,9,13])for(const fault of ['after-choice','before-commit'] as const){const r=await run({},prefix),saved=r.save(),pending=r.step(Q.of(0n),fault);for(const read of [r.save,r.snapshot,r.recallPractice])expect(read).toThrow('LH_BUSY');await expect(r.step(Q.of(0n))).rejects.toThrow('LH_CONCURRENT');await expect(pending).rejects.toThrow('LH_INJECTED');expect(r.save()).toEqual(saved);await r.step(Q.of(0n));}
 const r=await run({keepEpisodes:true},7),saved=r.save(),memory=r.recallPractice();memory[0][0]^=255;r.snapshot().memory.length=0;expect(r.save()).toEqual(saved);
});
it('every original prefix restores complete state and its immediate successor, including terminal and rejected changed originals',async()=>{
 const r=create(profile),saves=[r.save()];for(const q of standing){await r.step(q);saves.push(r.save());}
 for(let prefix=0;prefix<=16;prefix++){const s=await restore(profile,standing,prefix,saves[prefix]);expect(await s.step(Q.of(0n))).toBe(prefix<16);expect(s.save()).toEqual(saves[Math.min(prefix+1,16)]);}
 await expect(restore({...profile,keepEpisodes:true},standing,8,saves[8])).rejects.toThrow('LH_SAVE_MISMATCH');
});
