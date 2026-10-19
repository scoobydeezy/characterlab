import {it,expect} from 'vitest';
import {FatigueWorkbenchRun} from '../workbench/fatigueAdapter';
const records=(r:FatigueWorkbenchRun)=>JSON.parse(r.snapshot().observerExact) as Record<string,unknown>[];
it('preserves sensor lag, hidden-reward privacy and exact native restore',async()=>{
 const a=await FatigueWorkbenchRun.create(),b=await FatigueWorkbenchRun.create('1/1/hiddenReward');for(let n=0;n<4;n++){await a.advance();await b.advance();expect(a.snapshot().observerHex).toBe(b.snapshot().observerHex);}
 const at4=records(a).filter(r=>r.record==='FatigueEvaluation#1339/1').at(-1)!;expect(at4['Grade [9]']).toBe('0');expect(at4['KnownFatigue [8]']).toBe(true);expect(at4['ControlImpaired [7]']).toBe(false);expect(at4['Inhibited [5]']).toBe(true);
 const saved=a.checkpoint(),restored=await FatigueWorkbenchRun.restore(saved);expect(restored.snapshot()).toEqual(a.snapshot());await a.advance();await restored.advance();expect(restored.checkpoint()).toEqual(a.checkpoint());
 const at5=records(a).filter(r=>r.record==='FatigueEvaluation#1339/1').at(-1)!;expect(at5['Grade [9]']).toBe('2');expect(at5['ControlImpaired [7]']).toBe(true);expect(at5['Card [4]']).toBe(false);expect(at5['Inhibited [5]']).toBe(false);
 await a.advance();expect(records(a).filter(r=>r.record==='FatigueEvaluation#1339/1').at(-1)!['Grade [9]']).toBe('2');
 const copy=a.snapshot();copy.fields.length=0;expect(a.snapshot().fields.length).toBeGreaterThan(0);await expect(FatigueWorkbenchRun.restore({...saved,prefix:3})).rejects.toThrow('program/prefix');await expect(FatigueWorkbenchRun.restore({...saved,saveHash:'00'.repeat(32)})).rejects.toThrow('digest');
},600000);
it('separates motor-only execution impairment from cognitive inhibition',async()=>{
 const normal=await FatigueWorkbenchRun.create('1/1/motorChallenge'),motor=await FatigueWorkbenchRun.create('3/1/motorChallenge');for(let n=0;n<4;n++){await normal.advance();await motor.advance();}
 for(const r of [normal,motor])expect(records(r).filter(v=>v.record==='FatigueEvaluation#1339/1').at(-1)!['ControlImpaired [7]']).toBe(false);
 expect(records(normal).filter(v=>v.record==='HabitObservation#836/1').at(-1)!['Performed [4]']).toBe(true);expect(records(motor).filter(v=>v.record==='HabitObservation#836/1').at(-1)!['Performed [4]']).toBe(false);
},600000);
it('rejects overlapping advancement and in-flight publication',async()=>{const a=await FatigueWorkbenchRun.create(),pending=a.advance();expect(()=>a.snapshot()).toThrow('advancing');expect(()=>a.checkpoint()).toThrow('advancing');await expect(a.advance()).rejects.toThrow('in flight');await pending;},600000);
