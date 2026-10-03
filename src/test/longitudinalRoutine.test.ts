import {it,expect,vi} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeLongitudinal as decode} from '../campaign3/longitudinalCodecs';
import {createRoutineReceiver,createLongitudinalRoutineRun as create,restoreLongitudinalRoutineRun as restore,type RoutineProfile} from '../campaign3/longitudinalRoutine';
vi.setConfig({testTimeout:300000});
const profile:RoutineProfile={law:'Derived',mode:'Maintained',seed:0,alternateCue:false,visible:true,keepEpisodes:false};
async function receiver(change:Partial<RoutineProfile>={},n=16){const r=createRoutineReceiver({...profile,...change});for(let i=0;i<n;i++)await r.step(Q.of(0n));return r;}
it('actual practice builds cue history; interruption and a negative report preserve that history',async()=>{
 const s=(await receiver({},9)).snapshot(),training=s.rows.slice(1,7),gap=s.rows[7],resumed=s.rows[8];
 expect(training.every(r=>r.performed&&r.observed)).toBe(true);expect(gap.performed).toBe(false);expect(gap.beliefAfter).toBe(false);
 expect(gap.historyAfter).toBe(gap.historyBefore);expect(resumed.historyBefore).toBe(gap.historyAfter);
 expect(resumed.strength).toBe('63/64');expect(resumed.available).toBe(true);expect(resumed.performed).toBe(true);
 expect(resumed.goalsBefore[0].status).toBe('Open');expect(resumed.beliefBefore).toBe(false);
});
it('same physical practice without admitted outcomes does not acquire cue availability',async()=>{
 const r=(await receiver({visible:false},9)).snapshot();expect(r.rows.slice(1,7).every(x=>x.performed&&!x.observed)).toBe(true);
 expect(r.rows[8]).toMatchObject({strength:'0/1',available:false,performed:false});
});
it('cue mismatch, ignored history and erased history break resumption; scheduled-only bypasses learning',async()=>{
 for(const change of [{alternateCue:true},{law:'ExplicitBeliefOnly' as const},{law:'EraseHistory' as const}])expect((await receiver(change,9)).snapshot().rows[8].performed).toBe(false);
 const s=(await receiver({law:'ScheduledOnly',visible:false,alternateCue:true},9)).snapshot();expect(s.rows[8]).toMatchObject({strength:'0/1',available:true,performed:true});
});
it('stored and derived summaries give identical behavior across every instant and eight seeds',async()=>{
 for(let seed=0;seed<8;seed++){const a=(await receiver({seed,mode:'Withdrawn'})).snapshot(),b=(await receiver({seed,mode:'Withdrawn',law:'Stored'})).snapshot();expect(a.rows).toEqual(b.rows);expect(a.history).toBe(b.history);expect(a.cache).toBe(b.cache);}
});
it('retired goals permit a neutral cue response; an opposed goal inhibits without erasing history',async()=>{
 for(let seed=0;seed<8;seed++){const a=(await receiver({seed,mode:'Withdrawn'},9)).snapshot().rows[8],b=(await receiver({seed,mode:'Opposed'},9)).snapshot().rows[8];
 expect(a.choice.mode).toBe('QuietRoll');expect(a.choice.probabilities).toEqual([{name:'idle',probability:'1/2'},{name:'practice',probability:'1/2'}]);
 expect(b.choice.chosen).toBe('idle');expect(a.historyBefore).toBe(b.historyBefore);expect(b.historyAfter).toBe(b.historyBefore);}
});
it('negative consequences can extinguish availability; repeated opportunities alone do not force practice',async()=>{
 const s=(await receiver()).snapshot();expect(s.rows[8].performed).toBe(true);expect(s.rows[9]).toMatchObject({strength:'63/128',available:false,performed:false});
 expect(s.rows.slice(9).every(x=>!x.performed)).toBe(true);
});
it('receiver rejects invalid operands and protects publication and atomic rollback',async()=>{
 const r=await receiver({},1),before=r.save();await expect(r.step(Q.of(2n))).rejects.toThrow('ROUTINE_STANDING');
 for(const fault of ['after-choice','before-commit'] as const){const pending=r.step(Q.of(0n),fault);expect(r.save).toThrow('ROUTINE_BUSY');expect(r.snapshot).toThrow('ROUTINE_BUSY');await expect(r.step(Q.of(0n))).rejects.toThrow('ROUTINE_CONCURRENT');await expect(pending).rejects.toThrow('ROUTINE_INJECTED');expect(r.save()).toEqual(before);}
 const view=r.snapshot();view.rows.length=0;expect(r.save()).toEqual(before);
});
it('native biography and acquired receiving history both survive the real episode-expiry gap',async()=>{
 const r=await create(profile);for(let i=0;i<8;i++)await r.step();const before=rec(decode(r.sourceView()),881n);
 expect(items(f(rec(f(before,5n),866n),1n),'list').length).toBeGreaterThan(0);
 const replay=await restore(profile,8,r.save());await r.step();await replay.step();expect(replay.save()).toEqual(r.save());const after=rec(decode(r.sourceView()),881n),row=r.snapshot().rows[8];
 expect(items(f(rec(f(after,5n),866n),1n),'list').length).toBe(0);expect(key(f(before,2n))).toBe(key(f(after,2n)));
 expect(row.standing).toBe('-100733/600733');expect(row.strength).toBe('63/64');expect(row.available).toBe(true);
 // Availability and a maintained goal do not guarantee enactment under contrary biography.
 expect(row.performed).toBe(false);expect(row.historyAfter).toBe(row.historyBefore);
});
it('a positive acquired biography permits actual goal-supported resumption after native episode expiry',async()=>{
 const r=await create({...profile,seed:1});for(let i=0;i<9;i++)await r.step();const row=r.snapshot().rows[8];
 expect(row.standing).toBe('163071/1163071');expect(row.available).toBe(true);expect(row.performed).toBe(true);
 expect(items(f(rec(f(rec(decode(r.sourceView()),881n),5n),866n),1n),'list').length).toBe(0);
});
it('joined fault/publication checks and original-prefix replay cover the real acquisition successor',async()=>{
 const r=await create(profile);await r.step();const original=r.save(),source=r.nativeSave();
 for(const fault of ['after-source','after-choice','before-commit'] as const){const pending=r.step(fault);for(const read of [r.save,r.snapshot,r.nativeSave,r.sourceView])expect(read).toThrow('ROUTINE_JOIN_BUSY');await expect(r.step()).rejects.toThrow('ROUTINE_JOIN_CONCURRENT');await expect(pending).rejects.toThrow('ROUTINE_INJECTED');expect(r.save()).toEqual(original);expect(r.nativeSave()).toEqual(source);}
 const restored=await restore(profile,1,original);await r.step();await restored.step();expect(restored.save()).toEqual(r.save());
 await expect(restore({...profile,law:'Stored'},1,original)).rejects.toThrow('ROUTINE_SAVE_MISMATCH');
});
