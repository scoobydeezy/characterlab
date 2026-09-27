import {describe,it,expect} from 'vitest';
import {createEligibilityRun,restoreEligibilityRun,eligibilitySummary,type EligibilityLaw} from '../campaign3/identityEligibility';
import {eligibilityInputs,type EligibilityScenario} from './identityEligibilityFixtures';
import {dataItems as items} from '../campaign2/canonicalData';
const rows=(r:ReturnType<typeof createEligibilityRun>)=>items(items(r.snapshot(),'list')[1],'list').map(eligibilitySummary);
async function run(s:EligibilityScenario='Meaningful',law:EligibilityLaw='Threshold',seed=6){const r=createEligibilityRun(law,seed,eligibilityInputs(s));while(await r.step()){}return r;}
describe('bounded identity eligibility, with actual choice and frozen meaning',()=>{
 it('keeps equal-frequency trivial choices out of identity without erasing expressions',async()=>{
  const a=rows(await run()),b=rows(await run('Trivial'));
  expect(a.slice(0,4).map(x=>x.chosen)).toEqual(b.slice(0,4).map(x=>x.chosen));
  expect(a.slice(0,4).every(x=>x.disposition==='Accepted')).toBe(true);
  expect(b.slice(0,4).every(x=>x.expression&&x.disposition==='Insignificant')).toBe(true);
  expect(b[4].strength).toBe('0/1');expect(a[4].probabilities).not.toEqual(b[4].probabilities);
 });
 it('uses distinct actual motive contexts while preserving a common bounded semantic channel',async()=>{
  const a=rows(await run()),w=rows(await run('WorkOnly')),h=rows(await run('HomeOnly'));
  expect(a[1].raw).not.toBe(w[1].raw);expect(a[0].raw).not.toBe(h[0].raw);
  for(const r of [a,w,h])expect(r.slice(0,4).every(x=>x.disposition==='Accepted')).toBe(true);
 });
 it('distinguishes ordinary instruction from admitted pressure without reassigning choice',async()=>{
  const a=rows(await run()),i=rows(await run('Instructed')),c=rows(await run('Constrained'));
  expect(i.map(x=>x.expression)).toEqual(a.map(x=>x.expression));expect(i[4].strength).toBe(a[4].strength);
  expect(c.slice(0,4).map(x=>x.expression)).toEqual(a.slice(0,4).map(x=>x.expression));
  expect(c.slice(0,4).every(x=>x.disposition==='Constrained')).toBe(true);expect(c[4].strength).toBe('0/1');
 });
 it('forced movement creates neither voluntary expression nor a random draw',async()=>{
  const x=rows(await run('Forced'));for(const r of x.slice(0,4)){expect(r.executed).toBe(1);expect(r.expression).toBeNull();expect(r.addresses).toEqual([]);}expect(x[4].strength).toBe('0/1');
 });
 it('execution failure cannot retrospectively change choice evidence or its later effect',async()=>{
  const a=rows(await run()),b=rows(await run('FailedExecution'));
  expect(b.map(x=>x.executed)).toEqual([0,0,0,0,0]);expect(a.map(x=>x.expression)).toEqual(b.map(x=>x.expression));
  expect(a.map(x=>x.strength)).toEqual(b.map(x=>x.strength));expect(a[4].probabilities).toEqual(b[4].probabilities);
 });
 it('retains frequency and pressure-blind countermodels',async()=>{
  expect(rows(await run('Trivial','Frequency'))[4].strength).not.toBe('0/1');
  expect(rows(await run('Constrained','IgnorePressure'))[4].strength).not.toBe('0/1');
 });
 it('retains a serious graded alternative with different intermediate predictions',async()=>{
  for(const s of ['PartialSignificance','PartialPressure'] as const){const a=rows(await run(s)),b=rows(await run(s,'Graded'));expect(a[4].strength).toBe('0/1');expect(b[4].strength).not.toBe('0/1');}
  for(const s of ['Trivial','Constrained'] as const)expect(rows(await run(s,'Graded'))[4].strength).toBe('0/1');
 });
 it('ablates later feedback independently of acquired eligibility',async()=>{
  const a=rows(await run()),b=rows(await run('Meaningful','NoFeedback'));expect(a[4].strength).toBe(b[4].strength);expect(a[4].probabilities).not.toEqual(b[4].probabilities);
 });
 it('refolds frozen qualifications exactly without reading present context into history',async()=>{
  expect(rows(await run('Meaningful','Refold'))).toEqual(rows(await run()));
  const r=createEligibilityRun('Threshold',6,eligibilityInputs('Meaningful'));await r.step();const first=rows(r)[0];while(await r.step()){}expect(rows(r)[0]).toEqual(first);
 });
 it('retries a failed transition with identical state and addressed draws',async()=>{
  const r=createEligibilityRun('Threshold',6,eligibilityInputs('Meaningful')),before=r.save();await expect(r.step(true)).rejects.toThrow('injected');expect(r.save()).toEqual(before);while(await r.step()){}expect(r.save()).toEqual((await run()).save());
 });
 it('restores every prefix and rejects changed context, candidate, seed and bytes',async()=>{
  const input=eligibilityInputs('Meaningful'),r=createEligibilityRun('Threshold',6,input);const saves=[r.save()];while(await r.step())saves.push(r.save());
  for(let i=0;i<6;i++){const restored=await restoreEligibilityRun('Threshold',6,input,saves[i]);await restored.step();expect(restored.save()).toEqual(saves[Math.min(i+1,5)]);}
  await expect(restoreEligibilityRun('Graded',6,input,saves[2])).rejects.toThrow();await expect(restoreEligibilityRun('Threshold',7,input,saves[2])).rejects.toThrow();await expect(restoreEligibilityRun('Threshold',6,eligibilityInputs('Constrained'),saves[2])).rejects.toThrow();
  const bad=saves[2].slice();bad[bad.length-1]^=1;await expect(restoreEligibilityRun('Threshold',6,input,bad)).rejects.toThrow();
 });
 it('copies original input and snapshots, rejects malformed inputs and concurrent transitions',async()=>{
  const input=eligibilityInputs('Meaningful'),r=createEligibilityRun('Threshold',6,input);input[0].pressure=4;const p=r.step();await expect(r.step()).rejects.toThrow('concurrent');await p;expect(rows(r)[0].disposition).toBe('Accepted');const saved=r.save(),copy=r.save();copy.fill(0);expect(r.save()).toEqual(saved);
  expect(()=>createEligibilityRun('Threshold',256,input)).toThrow();expect(()=>createEligibilityRun('Threshold',6,[])).toThrow();
  const malformed=eligibilityInputs('Meaningful');Object.defineProperty(malformed[0],'pressure',{get:()=>{throw Error('getter executed');}});expect(()=>createEligibilityRun('Threshold',6,malformed)).toThrow('shape');
 });
});
