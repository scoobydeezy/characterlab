import {it,expect} from 'vitest';
import {FatigueWorkbenchRun} from '../workbench/fatigueAdapter';
import {captureFatiguePair,restoreFatiguePair} from '../workbench/fatiguePairCheckpoint';
import {compareFatigue} from '../workbench/fatigueComparison';
it('authenticates both native prefixes before replacement and disposes a partially restored pair',async()=>{
 const a=await FatigueWorkbenchRun.create(),b=await FatigueWorkbenchRun.create('1/1/falseFatigue');
 for(let n=0;n<5;n++){await a.advance();await b.advance();}
 const saved=await captureFatiguePair('input/falseFatigue',[a,b]),before=await compareFatigue(saved.comparison,a.snapshot(),b.snapshot());
 const pair=await restoreFatiguePair(saved,FatigueWorkbenchRun.restore,()=>{});
 expect(await compareFatigue(saved.comparison,pair[0].snapshot(),pair[1].snapshot())).toEqual(before);
 await a.advance();await pair[0].advance();expect(pair[0].checkpoint()).toEqual(a.checkpoint());
 const disposed:unknown[]=[];await expect(restoreFatiguePair({...saved,b:{...saved.b,saveHash:'00'.repeat(32)}},FatigueWorkbenchRun.restore,r=>disposed.push(r))).rejects.toThrow('digest');expect(disposed).toHaveLength(1);
 expect(b.checkpoint()).toEqual(saved.b);await expect(restoreFatiguePair({...saved,comparison:'privacy/denied-absent'},FatigueWorkbenchRun.restore,()=>{})).rejects.toThrow('declaration');
},600000);
