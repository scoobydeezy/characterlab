import {it,expect} from 'vitest';
import {GeneralWorkbenchRun,generalSeedBytes} from '../workbench/generalAdapter';
import {exportGeneral,importGeneral} from '../workbench/generalExport';
import freeze from '../../docs/planning/campaign3-general-attention-model-rev2/FREEZE.json';
import {digest,fromHex} from '../workbench/canonical';
it('preserves exact cohort seed identity and authenticates checkpoint/export continuation',async()=>{
 const run=await GeneralWorkbenchRun.create('baseline',freeze.seed),entry=freeze.models.find(m=>m.name==='baseline')!;
 expect(run.snapshot().runHash).toBe(await digest(fromHex(entry.runIdentity)));expect(run.snapshot().modelHash).toBe(await digest(fromHex(entry.modelIdentity)));
 await run.advance();const c=run.checkpoint();expect(c.version).toBe('general-workbench/0.2');expect(c.seed).toBe(freeze.seed);
 const restored=await importGeneral(JSON.stringify(await exportGeneral(run)));expect(restored.checkpoint()).toEqual(c);
 while(await run.advance()){expect(await restored.advance()).toBe(true);expect(restored.checkpoint()).toEqual(run.checkpoint());}expect(await restored.advance()).toBe(false);
 await expect(GeneralWorkbenchRun.restore({...c,seed:'00'.repeat(32)} as never)).rejects.toThrow('mismatch');
 await expect(GeneralWorkbenchRun.restore({...c,version:'general-workbench/0.1'} as never)).rejects.toThrow('checkpoint');
},600000);
it('retains legacy representation and rejects malformed seed domains',async()=>{
 for(const seed of [-1,256,1.5,NaN,'01','gg'.repeat(32),'AA'.repeat(32),null,{}])expect(()=>generalSeedBytes(seed as never)).toThrow();
 expect([...generalSeedBytes(freeze.seed)]).toEqual(Array.from({length:32},(_,i)=>i+1));expect([...generalSeedBytes(7)]).toEqual(Array(32).fill(7));
 const old=await GeneralWorkbenchRun.create(),c=old.checkpoint();expect(c.version).toBe('general-workbench/0.1');expect(c.seed).toBe(0);expect(Object.keys(c)).toEqual(['version','recipe','seed','prefix','saveHex','saveHash']);
 const hex=await GeneralWorkbenchRun.create('baseline','00'.repeat(32));expect(hex.checkpoint().saveHex).toBe(c.saveHex);
},600000);
