import {expect,it} from 'vitest';
import {AffectWorkbenchRun} from '../workbench/affectAdapter';
import {compareAffect,affectPair} from '../workbench/affectComparison';
it('restricts comparisons to a declared pair and withholds unequal horizons',async()=>{
 const a=await AffectWorkbenchRun.create('baseline'),b=await AffectWorkbenchRun.create('hidden');
 expect(affectPair('feedback-2')).toBeNull();expect(compareAffect(a.snapshot(),b.snapshot()).aligned).toBe(true);
 await a.advance();const unequal=compareAffect(a.snapshot(),b.snapshot());expect(unequal.aligned).toBe(false);expect(unequal.outputsEqual).toBeNull();expect(unequal.stateEqual).toBeNull();
 await b.advance();const same=compareAffect(a.snapshot(),b.snapshot());expect(same.outputsEqual).toBe(true);expect(same.stateEqual).toBe(true);expect(same.exactSaveEqual).toBe(false);
 expect(()=>compareAffect(a.snapshot(),{...b.snapshot(),program:'feedback-2'})).toThrow('declared');
 expect(()=>compareAffect(a.snapshot(),{...b.snapshot(),modelHash:'different'})).toThrow('declared');
 same.a.fields.length=0;expect(a.snapshot().fields.length).toBeGreaterThan(0);
},600000);
