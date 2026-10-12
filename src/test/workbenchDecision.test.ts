import {expect,it} from 'vitest';
import {DecisionWorkbenchRun} from '../workbench/decisionAdapter';
it('authenticates exact continuation and returns detached research and character views',async()=>{
 const a=await DecisionWorkbenchRun.create('1/continued');const pending=a.advance();await expect(a.advance()).rejects.toThrow('in flight');await pending;const saved=a.checkpoint(),b=await DecisionWorkbenchRun.restore(saved);expect(b.snapshot()).toEqual(a.snapshot());
 const detached=a.snapshot();detached.characterView='edited';detached.fields.length=0;expect(a.snapshot().characterView).not.toBe('edited');
 while(await a.advance())expect(await b.advance()).toBe(true);expect(await b.advance()).toBe(false);expect(b.snapshot()).toEqual(a.snapshot());
 await expect(DecisionWorkbenchRun.restore({...saved,prefix:0})).rejects.toThrow('prefix mismatch');await expect(DecisionWorkbenchRun.restore({...saved,saveHash:'0'.repeat(64)})).rejects.toThrow('digest');await expect(DecisionWorkbenchRun.create('invented')).rejects.toThrow('Unknown');
},600000);
it('uses the native observer-safe view across hidden execution controls',async()=>{
 const a=await DecisionWorkbenchRun.create('1/invisibleAllowed'),b=await DecisionWorkbenchRun.create('1/invisibleBlocked');while(await a.advance())await b.advance();expect(a.snapshot().characterView).toEqual(b.snapshot().characterView);expect(a.snapshot().researchOutputs).not.toEqual(b.snapshot().researchOutputs);
},600000);
