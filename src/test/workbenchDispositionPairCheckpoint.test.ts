import {it,expect} from 'vitest';
import {DispositionWorkbenchRun} from '../workbench/dispositionAdapter';
import {captureDispositionPair,restoreDispositionPair} from '../workbench/dispositionPairCheckpoint';
import {compareDisposition} from '../workbench/dispositionComparison';
it('restores both constitutional models and reproduces both next native prefixes',async()=>{
 const a=await DispositionWorkbenchRun.create(),b=await DispositionWorkbenchRun.create('Plastic/ConstitutionPositive');
 await a.advance();await b.advance();
 const saved=await captureDispositionPair('model/0/13',[a,b]),before=await compareDisposition(saved.comparison,a.snapshot(),b.snapshot());
 const pair=await restoreDispositionPair(saved,DispositionWorkbenchRun.restore,()=>{});
 expect(await compareDisposition(saved.comparison,pair[0].snapshot(),pair[1].snapshot())).toEqual(before);
 for(const [original,restored] of [[a,pair[0]],[b,pair[1]]]){await original.advance();await restored.advance();expect(restored.checkpoint()).toEqual(original.checkpoint());}
 const disposed:unknown[]=[];
 await expect(restoreDispositionPair({...saved,b:{...saved.b,saveHash:'00'.repeat(32)}},DispositionWorkbenchRun.restore,r=>disposed.push(r))).rejects.toThrow('digest');expect(disposed).toHaveLength(1);
 expect(a.snapshot().prefix).toBe(2);expect(b.snapshot().prefix).toBe(2);
},600000);
it('rejects declaration and prefix errors before allocation and snapshots caller-owned data',async()=>{
 const a=await DispositionWorkbenchRun.create(),b=await DispositionWorkbenchRun.create('Plastic/ConstitutionPositive'),saved=await captureDispositionPair('model/0/13',[a,b]);
 let calls=0;const restore=async()=>{calls++;return {};};
 await expect(restoreDispositionPair({...saved,comparison:'model/0/14'},restore,()=>{})).rejects.toThrow('declaration');
 await expect(restoreDispositionPair({...saved,b:{...saved.b,prefix:19}},restore,()=>{})).rejects.toThrow('prefix');expect(calls).toBe(0);
 let release!:()=>void;const blocked=new Promise<void>(resolve=>{release=resolve;});const seen:string[]=[];
 const pending=restoreDispositionPair(saved,async c=>{seen.push(c.saveHash);if(seen.length===1)await blocked;return c;},()=>{});
 const originalB=saved.b.saveHash;saved.b.saveHash='mutated caller data';release();await pending;expect(seen[1]).toBe(originalB);
},600000);
