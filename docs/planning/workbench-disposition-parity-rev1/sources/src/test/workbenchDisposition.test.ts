import {it,expect} from 'vitest';
import {DispositionWorkbenchRun,DISPOSITION_PROGRAMS} from '../workbench/dispositionAdapter';
import first from '../../docs/planning/DISPOSITION_PUBLIC_RUN_0_REV1.json';
it('binds original native prefixes, detached state and authenticated continuation',async()=>{
 const run=await DispositionWorkbenchRun.create();expect(DISPOSITION_PROGRAMS).toHaveLength(15);
 expect(run.snapshot().saveHash).toBe(first.prefixes[0].saveSha256);
 const pending=run.advance();expect(()=>run.snapshot()).toThrow('in flight');await expect(run.advance()).rejects.toThrow('in flight');await pending;
 expect(run.snapshot().saveHash).toBe(first.prefixes[1].saveSha256);expect(run.snapshot().timeline).toHaveLength(10);
 const saved=run.checkpoint(),restored=await DispositionWorkbenchRun.restore(saved);expect(restored.snapshot()).toEqual(run.snapshot());
 const detached=run.snapshot();detached.fields.length=0;detached.timeline.length=0;expect(run.snapshot().fields.length).toBeGreaterThan(0);
 await run.advance();await restored.advance();expect(restored.checkpoint()).toEqual(run.checkpoint());expect(run.snapshot().saveHash).toBe(first.prefixes[2].saveSha256);
 await expect(DispositionWorkbenchRun.restore({...saved,prefix:0})).rejects.toThrow('prefix');
 await expect(DispositionWorkbenchRun.restore({...saved,saveHash:'00'.repeat(32)})).rejects.toThrow('digest');
 await expect(DispositionWorkbenchRun.restore({...saved,program:'Plastic/ConstitutionPositive'})).rejects.toThrow('identity');
 await expect(DispositionWorkbenchRun.create('Plastic/arbitrary')).rejects.toThrow('Unknown');
},600000);
it('exposes constitution controls as distinct original models, not mutable current state',async()=>{
 const negative=await DispositionWorkbenchRun.create('Plastic/ConstitutionNegative'),zero=await DispositionWorkbenchRun.create(),positive=await DispositionWorkbenchRun.create('Plastic/ConstitutionPositive');
 expect([negative,zero,positive].map(r=>r.snapshot().constitution)).toEqual(['-1/8','0/1','1/8']);
 expect(new Set([negative,zero,positive].map(r=>r.snapshot().modelHash)).size).toBe(3);
 for(const r of [negative,zero,positive]){const before=r.snapshot().fields.find(f=>f.root==='1457');await r.advance();expect(r.snapshot().fields.find(f=>f.root==='1457')).toEqual(before);}
},600000);
