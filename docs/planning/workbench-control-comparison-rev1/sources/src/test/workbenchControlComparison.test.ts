import {it,expect} from 'vitest';
import {ControlWorkbenchRun} from '../workbench/controlAdapter';
import {CONTROL_CONTRASTS,compareControl} from '../workbench/controlComparison';
import catalog from '../workbench/controlCatalog.json';

it('declares all identical-input single-setting model pairs and covers every original program',()=>{
 const covered=new Set(CONTROL_CONTRASTS.flatMap(c=>[c.a,c.b]));
 expect(catalog.programs.every(p=>covered.has(p.id))).toBe(true);
 expect(new Set(CONTROL_CONTRASTS.map(c=>c.id)).size).toBe(CONTROL_CONTRASTS.length);
 for(const a of catalog.programs)for(const b of catalog.programs){
  if(a.id===b.id||a.orderedInputs!==b.orderedInputs||Number(a.candidate!==b.candidate)+Number(a.law!==b.law)!==1)continue;
  expect(CONTROL_CONTRASTS.some(c=>c.kind==='model'&&((c.a===a.id&&c.b===b.id)||(c.b===a.id&&c.a===b.id)))).toBe(true);
 }
});
it('separates public privacy from research differences and rejects mismatched identity/alignment',async()=>{
 const a=await ControlWorkbenchRun.create(),b=await ControlWorkbenchRun.create('1/1/hiddenReward');
 for(let i=0;i<5;i++){await a.advance();await b.advance();}
 const result=await compareControl('input/hiddenReward',a.snapshot(),b.snapshot());
 expect(result.aligned).toBe(true);expect(result.observerEqual).toBe(true);expect(result.outputsEqual).toBe(false);expect(result.inputDifferences.length).toBeGreaterThan(0);
 await a.advance();const unaligned=await compareControl('input/hiddenReward',a.snapshot(),b.snapshot());
 expect(unaligned.aligned).toBe(false);expect(unaligned.observerEqual).toBeNull();expect(unaligned.stateEqual).toBeNull();expect(unaligned.fields).toEqual([]);
 await expect(compareControl('input/hiddenReward',b.snapshot(),a.snapshot())).rejects.toThrow('ordered pair');
 await expect(compareControl('input/hiddenReward',{...a.snapshot(),runHash:'00'.repeat(32)},b.snapshot())).rejects.toThrow('identity');
 await expect(compareControl('input/hiddenReward',a.snapshot(),{...b.snapshot(),observerHex:''})).rejects.toThrow('commitment');
},600000);
