import {expect,it} from 'vitest';
import {LearnWorkbenchRun} from '../workbench/learnAdapter';
import {compareLearn,learnPair} from '../workbench/learnComparison';
it('compares only aligned declared same-model pairs and preserves original inputs',async()=>{
 const a=await LearnWorkbenchRun.create('1/1/repeated'),b=await LearnWorkbenchRun.create('1/1/hidden');
 await a.advance();expect(compareLearn(a.snapshot(),b.snapshot()).outputsEqual).toBeNull();
 await b.advance();const c=compareLearn(a.snapshot(),b.snapshot());
 expect(c.outputsEqual).toBe(true);expect(c.stateEqual).toBe(true);expect(c.exactSaveEqual).toBe(false);
 expect(c.originalInputs[0]).not.toBe(c.originalInputs[1]);c.a.fields.length=0;expect(a.snapshot().fields.length).toBe(1);
 expect(()=>compareLearn(a.snapshot(),{...b.snapshot(),modelHash:'different'})).toThrow('one model');
 expect(learnPair('1/1/zero')).toBeNull();expect(learnPair('invented/repeated')).toBeNull();
},600000);
