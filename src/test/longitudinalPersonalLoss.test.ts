import {it,expect} from 'vitest';
import {createPersonalLossRun as create,restorePersonalLossRun as restore,type LossProfile} from '../campaign3/longitudinalPersonalLoss';
const profile:LossProfile={law:'Latest',condition:'ReportedLoss',seed:0};
async function run(change:Partial<LossProfile>={},prefix=12){const r=create({...profile,...change});for(let n=0;n<prefix;n++)await r.step();return r;}
const cognitive=(r:Awaited<ReturnType<typeof run>>)=>r.snapshot().rows.map(({physicalContact,contactCompleted,supportCompleted,...row})=>row);
it('acquires a particular valued relationship through actual admitted participation, and loss preserves its history and goal',async()=>{
 const s=(await run()).snapshot();expect(s.rows.slice(0,2).every(x=>x.participated&&x.admitted)).toBe(true);expect(s.rows[2].goalsAfter).toHaveLength(2);
 expect(s.rows[3].appraisal.coordinates).toEqual(['0/1','0/1']);expect(s.rows[4].appraisal.coordinates).toEqual(['1/1','1/1']);
 expect(s.rows.slice(2).every(x=>x.historyAfter===s.history)).toBe(true);expect(s.goals.every(x=>x.status==='Open')).toBe(true);
});
it('hidden physical loss and false reports discriminate truth from belief/appraisal/action across all seeds',async()=>{
 for(let seed=0;seed<8;seed++){expect(cognitive(await run({seed,condition:'HiddenLoss'}))).toEqual(cognitive(await run({seed,condition:'NoLoss'})));expect(cognitive(await run({seed,condition:'FalseLoss'}))).toEqual(cognitive(await run({seed})));}
});
it('correction changes only later appraisal and never rewrites acquired relationship history',async()=>{
 const a=(await run({condition:'Corrected'})).snapshot();expect(a.rows[7].appraisal.coordinates).toEqual(['1/1','1/1']);expect(a.rows[8].appraisal.coordinates).toEqual(['0/1','0/1']);expect(a.rows.slice(2).every(x=>x.historyAfter===a.history)).toBe(true);
 expect(cognitive(await run({condition:'Corrected'}))).toEqual(cognitive(await run({condition:'Recovered'})));
});
it('one or masked interaction cannot manufacture the acquired continuity goal',async()=>{
 for(const condition of ['OneInteraction','MaskedAcquisition'] as const){const s=(await run({condition})).snapshot();expect(s.goals.map(x=>x.id)).toEqual(['support']);expect(s.rows[4].appraisal.severity).toBe('0/1');expect(s.rows[4].appraisal.likelihood).toBe('1/1');}
});
it('explicit goal withdrawal and perceived control change current appraisal without changing belief or relationship',async()=>{
 const a=(await run()).snapshot(),w=(await run({condition:'WithdrawnGoal'})).snapshot(),c=(await run({condition:'HighControl'})).snapshot();expect(w.belief).toBe(a.belief);expect(w.history).toBe(a.history);expect(w.rows[4].appraisal.coordinates).toEqual(['0/1','0/1']);expect(c.rows[4].appraisal.coordinates).toEqual(['1/1','0/1']);
});
it('Mean, Latest, NoLearning and NoAffect retain distinct evidence and response roles',async()=>{
 const a=(await run()).snapshot(),m=(await run({law:'Mean',condition:'Corrected'})).snapshot(),n=(await run({law:'NoLearning'})).snapshot(),f=(await run({law:'NoAffect'})).snapshot();expect(m.rows[4].appraisal.likelihood).toBe('1/2');expect(m.rows[8].appraisal.likelihood).toBe('1/3');expect(n.belief).toBeNull();expect(n.rows[4].appraisal.coordinates).toEqual([]);expect(f.rows.map(x=>x.appraisal)).toEqual(a.rows.map(x=>x.appraisal));expect(f.rows[4].choice.probabilities).not.toEqual(a.rows[4].choice.probabilities);
});
it('competing goal strength changes action probabilities at fixed belief and affect',async()=>{
 const a=(await run()).snapshot(),b=(await run({condition:'StrongContinuity'})).snapshot();expect(b.rows.map(x=>x.appraisal)).toEqual(a.rows.map(x=>x.appraisal));expect(b.rows[4].choice.probabilities).not.toEqual(a.rows[4].choice.probabilities);
});
it('chosen support and independent failed execution stay distinct without manufacturing observational feedback',async()=>{
 for(let seed=0;seed<8;seed++){const a=await run({seed}),b=await run({seed,condition:'FailedSupport'});expect(cognitive(b)).toEqual(cognitive(a));expect(b.snapshot().rows.every(x=>!x.supportCompleted)).toBe(true);}
});
it('all original prefixes and immediate successors reproduce exact complete state; changed profile is rejected',async()=>{
 const r=create(profile),saves=[r.save()];for(let i=0;i<12;i++){await r.step();saves.push(r.save());}for(let i=0;i<=12;i++){const restored=await restore(profile,i,saves[i]);expect(await restored.step()).toBe(i<12);expect(restored.save()).toEqual(saves[Math.min(i+1,12)]);}await expect(restore({...profile,condition:'FalseLoss'},5,saves[5])).rejects.toThrow('LOSS_SAVE_MISMATCH');
});
it('all owners roll back at both fault sites; reads, overlapping work and caller mutation cannot publish partial state',async()=>{
 for(const prefix of [0,2,3,7])for(const fault of ['after-choice','before-commit'] as const){const r=await run({},prefix),saved=r.save(),pending=r.step(fault);expect(r.save).toThrow('LOSS_BUSY');expect(r.snapshot).toThrow('LOSS_BUSY');await expect(r.step()).rejects.toThrow('LOSS_CONCURRENT');await expect(pending).rejects.toThrow('LOSS_INJECTED');expect(r.save()).toEqual(saved);await r.step();}
 const r=await run(),saved=r.save();r.snapshot().rows.length=0;expect(r.save()).toEqual(saved);
});
