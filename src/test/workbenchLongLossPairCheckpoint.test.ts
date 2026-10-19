import {it,expect} from 'vitest';
import {LongLossWorkbenchRun} from '../workbench/longLossAdapter';
import {LONG_LOSS_COMPARISONS,compareLongLossSnapshots} from '../workbench/longLossComparison';
import {captureLongLossPair,restoreLongLossPair} from '../workbench/longLossPairCheckpoint';
it('restores report-boundary pairs atomically and rejects changed case or partial authentication',async()=>{
 const spec=LONG_LOSS_COMPARISONS.find(p=>p.id==='condition:Latest:NoLoss:0')!,a=await LongLossWorkbenchRun.create(spec.control),b=await LongLossWorkbenchRun.create(spec.candidate);for(let n=0;n<4;n++){await a.advance();await b.advance();}
 const saved=await captureLongLossPair(spec.id,[a,b]),report=await compareLongLossSnapshots(spec.id,a.snapshot(),b.snapshot()),restored=await restoreLongLossPair(saved,LongLossWorkbenchRun.restore,()=>{});expect(await compareLongLossSnapshots(spec.id,restored[0].snapshot(),restored[1].snapshot())).toEqual(report);
 await restored[0].advance();await restored[1].advance();expect(restored[0].snapshot().state.rows.at(-1)!.appraisal.likelihood).toBe('1/1');expect(restored[1].snapshot().state.rows.at(-1)!.appraisal.likelihood).toBe('0/1');
 let calls=0;await expect(restoreLongLossPair({...saved,candidate:{...saved.candidate,prefix:13}},async c=>{calls++;return c;},()=>{})).rejects.toThrow('prefix');expect(calls).toBe(0);
 await expect(restoreLongLossPair({...saved,comparison:'matched:Latest:HiddenLoss:NoLoss:0'},LongLossWorkbenchRun.restore,()=>{})).rejects.toThrow('declaration');
 const disposed:unknown[]=[];await expect(restoreLongLossPair({...saved,candidate:{...saved.candidate,saveHash:'bad'}},LongLossWorkbenchRun.restore,r=>disposed.push(r))).rejects.toThrow('digest');expect(disposed).toHaveLength(1);expect([a.checkpoint(),b.checkpoint()]).toEqual([saved.control,saved.candidate]);saved.control.saveHex='bad';expect(a.checkpoint().saveHex).not.toBe('bad');
},120000);
