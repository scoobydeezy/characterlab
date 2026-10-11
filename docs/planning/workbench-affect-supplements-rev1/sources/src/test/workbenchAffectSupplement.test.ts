import {expect,it} from 'vitest';
import {AffectSupplementRun} from '../workbench/affectSupplementAdapter';
it('binds supplementary replay to its exact role and original input',async()=>{
 const a=await AffectSupplementRun.create('timing/vulnerability-relief/a');await a.advance();const c=a.checkpoint(),b=await AffectSupplementRun.restore(c);expect(b.snapshot()).toEqual(a.snapshot());
 await a.advance();await b.advance();expect(b.checkpoint()).toEqual(a.checkpoint());
 await expect(AffectSupplementRun.restore({...c,program:'timing/vulnerability-relief/b'})).rejects.toThrow('mismatch');
 await expect(AffectSupplementRun.restore({...c,prefix:18})).rejects.toThrow('Invalid');
 await expect(AffectSupplementRun.create('baseline')).rejects.toThrow('Unknown');
},600000);
