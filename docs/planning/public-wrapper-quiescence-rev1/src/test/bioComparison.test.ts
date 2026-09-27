import {describe,it,expect} from 'vitest';
import plan from '../../docs/planning/BIO_COMPARISON_PLAN_REV3.json';
import {createBioComparison,restoreBioComparison,bioSummary} from '../campaign3/bioComparison';
import {dataItems as items} from '../campaign2/canonicalData';
const input={earlySeed:plan.first,contrarySeeds:plan.contrarySeeds};
const summaries=(run:ReturnType<typeof createBioComparison>)=>items(items(run.snapshot(),'list')[3],'list').map(bioSummary);
async function prefix(law:Parameters<typeof createBioComparison>[0]='Earned',count=5,earlySeed=plan.first){const run=createBioComparison(law,{...input,earlySeed});for(let i=0;i<count;i++)await run.step();return run;}
describe('BIO composed component boundaries and counterfactuals',()=>{
 it('starts from zero and derives different history only after addressed choices',async()=>{
  const a=await prefix(),b=await prefix('Earned',5,plan.second),x=summaries(a),y=summaries(b);
  expect(x[0].context).toBe(y[0].context);expect(x[0].raw).toBe(y[0].raw);expect(x[0].reasons).toBe(y[0].reasons);
  expect(x[0].draws).not.toEqual(y[0].draws);expect(x[4].history).not.toBe(y[4].history);expect(x[4].modifiers).not.toEqual(y[4].modifiers);expect(x[4].probabilities).not.toEqual(y[4].probabilities);
  expect(x.map(v=>v.nondecision)).toEqual(y.map(v=>v.nondecision));expect(x[4].seed).toBe(255);expect(y[4].seed).toBe(255);
 },30000);
 it('holds acquired history fixed when ablating its probe feedback',async()=>{
  const a=summaries(await prefix())[4],display=summaries(await prefix('DisplayOnly'))[4],history=summaries(await prefix('HistoryOnly'))[4];
  expect(a.history).toBe(display.history);expect(a.history).toBe(history.history);expect(display.modifiers).toEqual(['0','0']);expect(history.probabilities).toEqual(display.probabilities);expect(history.display).not.toBe(display.display);
 },30000);
 it('does not treat a fixed authored trait as acquired divergence',async()=>{
  const a=summaries(await prefix('AuthoredTrait'))[4],b=summaries(await prefix('AuthoredTrait',5,plan.second))[4];expect(a.history).not.toBe(b.history);expect(a.modifiers).toEqual(b.modifiers);expect(a.probabilities).toEqual(b.probabilities);
 },30000);
 it('replays frozen qualifications equivalently without reinterpreting their meaning',async()=>{
  const a=summaries(await prefix()),b=summaries(await prefix('Refold'));expect(a).toEqual(b);
 },30000);
 it('does not commit a failed transition and retries exactly',async()=>{
  const a=await prefix('Earned',4),before=a.save(),normal=await prefix();await expect(a.step(true)).rejects.toThrow('injected');expect(a.save()).toEqual(before);await a.step();expect(a.save()).toEqual(normal.save());
 },30000);
 it('rejects changed input, profile and corrupted prefix snapshots',async()=>{
  const a=await prefix('Earned',2),saved=a.save();await expect(restoreBioComparison('Earned',{...input,earlySeed:plan.second},saved)).rejects.toThrow();await expect(restoreBioComparison('HistoryOnly',input,saved)).rejects.toThrow();const bad=saved.slice();bad[bad.length-1]^=1;await expect(restoreBioComparison('Earned',input,bad)).rejects.toThrow();
 },30000);
 it('restores the exact next transition with the fixed third probe seed',async()=>{
  const a=await prefix('Earned',4),b=await restoreBioComparison('Earned',input,a.save());await a.step();await b.step();expect(a.save()).toEqual(b.save());expect(summaries(b)[4].seed).toBe(255);
 },30000);
 it('copies original seed routing and returns detached canonical snapshots',async()=>{
  const supplied={earlySeed:plan.first,contrarySeeds:[...plan.contrarySeeds]},a=createBioComparison('Earned',supplied);supplied.earlySeed=plan.second;supplied.contrarySeeds.fill(253);await a.step();const before=a.save(),copy=a.save();copy.fill(0);expect(a.save()).toEqual(before);expect(a.snapshot()).not.toBe(a.snapshot());expect(a.save()).toEqual((await prefix('Earned',1)).save());
 },30000);
 it('rejects overlapping transitions and invalid profiles/seed rosters',async()=>{
  const a=createBioComparison('Earned',input),pending=a.step();await expect(a.step()).rejects.toThrow('concurrent');await pending;expect(summaries(a)).toHaveLength(1);expect(()=>createBioComparison('Earned',{...input,earlySeed:32})).toThrow();expect(()=>createBioComparison('Earned',{...input,contrarySeeds:[0]})).toThrow();
 },30000);
});
