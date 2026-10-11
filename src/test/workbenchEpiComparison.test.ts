import {expect,it} from 'vitest';
import {EpiWorkbenchRun} from '../workbench/epiAdapter';
import {compareEpi,epiPair} from '../workbench/epiComparison';
it('compares the declared safe pair and withholds conclusions for unequal horizons',async()=>{
 const a=await EpiWorkbenchRun.create('1/1/establishedA'),b=await EpiWorkbenchRun.create('1/1/establishedB');
 await a.advance();expect(compareEpi(a.snapshot(),b.snapshot()).characterStateEqual).toBeNull();
 while(await a.advance()){}while(await b.advance()){}
 const c=compareEpi(a.snapshot(),b.snapshot());expect(c.characterStateEqual).toBe(true);expect(c.characterOutputsEqual).toBe(true);expect(c.researcherOutputsEqual).toBe(false);expect(c.exactSaveEqual).toBe(false);
 expect(c.originalInputs[0]).not.toBe(c.originalInputs[1]);
 expect(epiPair('1/1/zero')).toBeNull();expect(()=>compareEpi(a.snapshot(),a.snapshot())).toThrow('declared');
},600000);
it('does not present violating controls as lawful access or collapse their output divergence',async()=>{
 const a=await EpiWorkbenchRun.create('2/1/establishedA'),b=await EpiWorkbenchRun.create('2/1/establishedB');
 while(await a.advance()){}while(await b.advance()){}
 const c=compareEpi(a.snapshot(),b.snapshot());expect(c.lawfulCharacterAccess).toBe(false);expect(c.characterOutputsEqual).toBe(false);
},600000);
