import {it,expect} from 'vitest';
import {DispositionWorkbenchRun,DISPOSITION_PROGRAMS} from '../workbench/dispositionAdapter';
import {DISPOSITION_CONTRASTS,compareDisposition} from '../workbench/dispositionComparison';
it('declares all single-setting model controls and original input controls, with exact initial reports',async()=>{
 expect(DISPOSITION_CONTRASTS).toHaveLength(30);expect(DISPOSITION_CONTRASTS.filter(c=>c.kind==='model')).toHaveLength(24);
 const snapshots=new Map();for(const p of DISPOSITION_PROGRAMS)snapshots.set(p.id,(await DispositionWorkbenchRun.create(p.id)).snapshot());
 for(const c of DISPOSITION_CONTRASTS){const report=await compareDisposition(c.id,snapshots.get(c.a),snapshots.get(c.b));expect(report.aligned).toBe(true);expect(report.changedSettings.length).toBe(c.kind==='model'?1:0);expect(report.inputDifferences.length===0).toBe(c.kind==='model');if(c.changed==='constitution'){expect(report.stateEqual).toBe(false);expect(report.mechanismProjectionEqual).toBe(true);}}
},600000);
it('withholds unaligned conclusions and rejects wrong identities, ordered pairs and forged prefixes',async()=>{
 const a=await DispositionWorkbenchRun.create(),b=await DispositionWorkbenchRun.create('Plastic/ConstitutionPositive'),id='model/0/13';await a.advance();
 const report=await compareDisposition(id,a.snapshot(),b.snapshot());expect(report.aligned).toBe(false);expect(report.fields).toEqual([]);expect(report.stateEqual).toBeNull();expect(report.mechanismProjectionEqual).toBeNull();
 await expect(compareDisposition(id,b.snapshot(),a.snapshot())).rejects.toThrow('ordered pair');
 await expect(compareDisposition(id,{...a.snapshot(),runHash:'00'},b.snapshot())).rejects.toThrow('identity');
 await expect(compareDisposition(id,{...a.snapshot(),prefix:0},b.snapshot())).rejects.toThrow('prefix');
 await b.advance();const aligned=await compareDisposition(id,a.snapshot(),b.snapshot());expect(aligned.aligned).toBe(true);expect(aligned.fields.some(f=>f.root==='1457'&&!f.equal)).toBe(true);
},600000);
