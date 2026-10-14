import {it,expect} from 'vitest';
import {BodyWorkbenchRun,bodyModelSource} from '../workbench/bodyAdapter';
import catalog from '../workbench/bodyCatalog.json';
import {prepareEmbodiedModel,createEmbodiedRun} from '../campaign3/embodiedFactory';
import {fromHex} from '../workbench/canonical';
import {bytesToHex} from '../substrate/canonicalEncoding';
it('matches actual public source saves through delivery and restores its continuation',async()=>{
 const p=catalog.programs.find(p=>p.name==='kinetic-fast')!,a=await BodyWorkbenchRun.create(p.name),native=await createEmbodiedRun(await prepareEmbodiedModel(bodyModelSource(p.model)),{initialState:fromHex(p.initialState),orderedInputs:fromHex(p.orderedInputs),runSeed:fromHex(p.runSeed)});
 for(let i=0;i<3;i++){expect(a.checkpoint().saveHex).toBe(bytesToHex(native.save()));await a.advance();await native.settleNextInstant();}
 expect(a.checkpoint().saveHex).toBe(bytesToHex(native.save()));const restored=await BodyWorkbenchRun.restore(a.checkpoint());expect(restored.snapshot()).toEqual(a.snapshot());await a.advance();await restored.advance();expect(restored.checkpoint()).toEqual(a.checkpoint());
 const detached=a.snapshot();detached.fields.length=0;expect(a.snapshot().fields.length).toBeGreaterThan(0);
},600000);
it('rejects overlapping commands and altered original identity or prefix',async()=>{
 const a=await BodyWorkbenchRun.create('alias41'),pending=a.advance();await expect(a.advance()).rejects.toThrow('in flight');expect(()=>a.snapshot()).toThrow('advancing');await pending;
 const c=a.checkpoint();await expect(BodyWorkbenchRun.restore({...c,program:'alias49'})).rejects.toThrow('prefix');await expect(BodyWorkbenchRun.restore({...c,prefix:0})).rejects.toThrow('prefix');await expect(BodyWorkbenchRun.restore({...c,saveHash:'bad'})).rejects.toThrow('digest');
},600000);
