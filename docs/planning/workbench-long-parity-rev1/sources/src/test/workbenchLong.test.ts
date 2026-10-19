import {it,expect} from 'vitest';
import {LongWorkbenchRun,longModelSource} from '../workbench/longAdapter';
import catalog from '../workbench/longCatalog.json';
import {prepareLongitudinalModel,createLongitudinalRun} from '../campaign3/longitudinalFactory';
import {OBSERVER} from '../campaign3/longitudinalModel';
import {fromHex} from '../workbench/canonical';
import {bytesToHex,canonicalEncode} from '../substrate/canonicalEncoding';
it('matches native learned source and closed observer bytes, restoring the next complete instant',async()=>{
 const p=catalog.programs[0],m=catalog.models.find(m=>m.name===p.model)!,a=await LongWorkbenchRun.create(p.name),native=await createLongitudinalRun(await prepareLongitudinalModel(longModelSource(p.model)),{initialState:fromHex(m.initialState),orderedInputs:fromHex(p.orderedInputs),runSeed:fromHex(p.runSeed)});
 for(let i=0;i<3;i++){expect(a.checkpoint().saveHex).toBe(bytesToHex(native.save()));expect(a.snapshot().observerHex).toBe(bytesToHex(native.observerView(canonicalEncode(OBSERVER))));await a.advance();await native.settleNextInstant();}
 expect(a.checkpoint().saveHex).toBe(bytesToHex(native.save()));const restored=await LongWorkbenchRun.restore(a.checkpoint());expect(restored.snapshot()).toEqual(a.snapshot());await a.advance();await restored.advance();expect(restored.checkpoint()).toEqual(a.checkpoint());const detached=a.snapshot();detached.fields.length=0;expect(a.snapshot().fields.length).toBeGreaterThan(0);
},600000);
it('rejects overlap, a false prefix and changed save digest',async()=>{const a=await LongWorkbenchRun.create('execution:retained'),pending=a.advance();await expect(a.advance()).rejects.toThrow('in flight');expect(()=>a.snapshot()).toThrow('advancing');await pending;const c=a.checkpoint();await expect(LongWorkbenchRun.restore({...c,prefix:0})).rejects.toThrow('prefix');await expect(LongWorkbenchRun.restore({...c,saveHash:'bad'})).rejects.toThrow('digest');await expect(LongWorkbenchRun.create('unfrozen')).rejects.toThrow('Unknown');},600000);
