import {it,expect} from 'vitest';
import {ControlWorkbenchRun} from '../workbench/controlAdapter';
import {captureControlPair,restoreControlPair} from '../workbench/controlPairCheckpoint';
import {compareControl} from '../workbench/controlComparison';
it('authenticates both native prefixes before replacement and disposes a partially restored pair',async()=>{
 const a=await ControlWorkbenchRun.create(),b=await ControlWorkbenchRun.create('1/1/noLoad');
 for(let n=0;n<5;n++){await a.advance();await b.advance();}
 const saved=await captureControlPair('input/noLoad',[a,b]),before=await compareControl(saved.comparison,a.snapshot(),b.snapshot());
 const pair=await restoreControlPair(saved,ControlWorkbenchRun.restore,()=>{});
 expect(await compareControl(saved.comparison,pair[0].snapshot(),pair[1].snapshot())).toEqual(before);
 await a.advance();await pair[0].advance();expect(pair[0].checkpoint()).toEqual(a.checkpoint());
 const disposed:unknown[]=[];await expect(restoreControlPair({...saved,b:{...saved.b,saveHash:'00'.repeat(32)}},ControlWorkbenchRun.restore,r=>disposed.push(r))).rejects.toThrow('digest');expect(disposed).toHaveLength(1);
 expect(b.checkpoint()).toEqual(saved.b);await expect(restoreControlPair({...saved,comparison:'privacy/hidden-absent'},ControlWorkbenchRun.restore,()=>{})).rejects.toThrow('declaration');
},600000);
