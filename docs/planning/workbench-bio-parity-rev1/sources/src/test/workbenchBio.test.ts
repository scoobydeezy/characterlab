import {it,expect} from 'vitest';
import {BioWorkbenchRun} from '../workbench/bioAdapter';
import {createBioComparison} from '../campaign3/bioComparison';
import plan from '../../docs/planning/BIO_COMPARISON_PLAN_REV3.json';
import {bytesToHex} from '../substrate/canonicalEncoding';
it('matches actual component bytes and restores across the shared-seed probe',async()=>{
 const a=await BioWorkbenchRun.create('Earned/6'),native=createBioComparison('Earned',{earlySeed:6,contrarySeeds:plan.contrarySeeds});
 for(let i=0;i<5;i++){expect(a.checkpoint().saveHex).toBe(bytesToHex(native.save()));await a.advance();await native.step();}
 expect(a.snapshot().records[4].summary.seed).toBe(255);expect(a.checkpoint().saveHex).toBe(bytesToHex(native.save()));
 const restored=await BioWorkbenchRun.restore(a.checkpoint());expect(restored.snapshot()).toEqual(a.snapshot());
 await a.advance();await restored.advance();expect(restored.checkpoint()).toEqual(a.checkpoint());
 const copy=a.snapshot();copy.records.length=0;expect(a.snapshot().records).toHaveLength(6);
},600000);
it('rejects forged case, identity, prefix and overlapping transitions',async()=>{
 const a=await BioWorkbenchRun.create(),pending=a.advance();await expect(a.advance()).rejects.toThrow('in flight');expect(()=>a.snapshot()).toThrow('advancing');await pending;
 const c=a.checkpoint();await expect(BioWorkbenchRun.restore({...c,name:'Earned/0'})).rejects.toThrow('identity');await expect(BioWorkbenchRun.restore({...c,prefix:0})).rejects.toThrow('prefix');await expect(BioWorkbenchRun.restore({...c,saveHash:'bad'})).rejects.toThrow('digest');await expect(BioWorkbenchRun.create('unknown')).rejects.toThrow('Unknown');
},600000);
