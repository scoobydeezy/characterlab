import {it,expect} from 'vitest';
import {runRelapse} from './relapseFixtures';
it('all eight seeds preserve actual adjustment and recovery, with bounded load-triggered returns',async()=>{
 const returned:number[]=[];
 for(let seed=0;seed<8;seed++){
  const a=(await runRelapse('main',seed)).summary,b=(await runRelapse('noLoad',seed)).summary;
  expect(a.actions.slice(0,6)).toEqual([true,true,true,false,false,false]);expect(a.actions[7]).toBe(false);expect(b.actions.slice(3)).toEqual([false,false,false,false,false]);
  expect(a.retained.slice(3)).toEqual([true,true,true,true,true]);expect(a.maintained.slice(3)).toEqual([true,true,true,true,true]);expect(a.inhibited.slice(3)).toEqual([true,true,true,false,true]);
  expect(a.appraisals[6]).toBe(b.appraisals[6]);expect(a.distributions[6]).toHaveLength(2);expect(a.distributions[6][0]).toBe(a.distributions[6][1]);
  for(let i=3;i<8;i++)expect(a.historyBefore[i]).toBe(a.historyAfter[i]);
  if(a.actions[6])returned.push(seed);
 }
 expect(returned.length).toBeGreaterThan(0);
},120000);
it('cue, acquisition and admitted negative belief remain separate from load',async()=>{
 for(const name of ['otherCue','unseenTraining','negativeBelief','deniedCard'] as const)expect((await runRelapse(name)).summary.actions[6]).toBe(false);
 const negative=(await runRelapse('negativeBelief')).summary;expect(negative.historyBefore[6]).toBe(negative.historyAfter[6]);
},60000);
it('hidden reward changes preserve the whole later observer view',async()=>{
 const a=await runRelapse('main'),b=await runRelapse('hiddenReward');expect(a.safe).toEqual(b.safe);expect(a.summary.actions).toEqual(b.summary.actions);expect(a.summary.rewards).not.toEqual(b.summary.rewards);
},60000);
it('retirement and loss of maintenance are not a lapse against a maintained goal',async()=>{
 const retired=(await runRelapse('retired')).summary,lost=(await runRelapse('lost')).summary;
 expect(retired.retained[6]).toBe(false);expect(retired.actions.slice(6)).toEqual([true,true]);expect(lost.retained[6]).toBe(true);expect(lost.maintained[6]).toBe(false);expect(lost.maintained[7]).toBe(true);
},60000);
it('preserves serious learning and control competitors without selecting a universal rule',async()=>{
 const linear=(await runRelapse('main',7,1,2)).summary,blind=(await runRelapse('main',7,3)).summary,erased=(await runRelapse('main',7,5)).summary;
 expect(linear.actions.slice(3,6)).toEqual([false,false,false]);expect(blind.inhibited[6]).toBe(true);expect(blind.actions[6]).toBe(false);expect(erased.optionCounts[6]).toBe(1);
 expect((await runRelapse('lost',7,4)).summary.inhibited[6]).toBe(true);
},60000);
