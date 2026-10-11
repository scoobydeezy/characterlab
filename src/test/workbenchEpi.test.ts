import {expect,it} from 'vitest';
import {EpiWorkbenchRun} from '../workbench/epiAdapter';
it('keeps researcher truth separate while preserving the native safe character equality',async()=>{
 const a=await EpiWorkbenchRun.create('1/1/establishedA'),b=await EpiWorkbenchRun.create('1/1/establishedB');
 while(await a.advance()){} while(await b.advance()){}
 const av=a.snapshot(),bv=b.snapshot();
 expect(av.characterOutputs).toBe(bv.characterOutputs);expect(av.characterStateHash).toBe(bv.characterStateHash);
 expect(av.researchOutputs).not.toBe(bv.researchOutputs);expect(av.saveHash).not.toBe(bv.saveHash);
 expect(av.lawfulCharacterAccess).toBe(true);av.fields.length=0;expect(a.snapshot().fields.length).toBeGreaterThan(0);
},600000);
it('labels deliberate leakage and authenticates complete checkpoint continuation',async()=>{
 const a=await EpiWorkbenchRun.create('2/1/establishedA');await a.advance();
 expect(a.snapshot().lawfulCharacterAccess).toBe(false);expect(a.snapshot().projection).toContain('VIOLATING');
 const c=a.checkpoint(),b=await EpiWorkbenchRun.restore(c);
 let more=true;while(more){more=await a.advance();expect(await b.advance()).toBe(more);expect(b.checkpoint()).toEqual(a.checkpoint());}
 await expect(EpiWorkbenchRun.restore({...c,program:'1/1/establishedA'})).rejects.toThrow('mismatch');
},600000);
