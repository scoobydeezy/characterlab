import {it,expect} from 'vitest';
import {packDispositionCheckpoint} from '../workbench/dispositionPackedCheckpoint';
import {restoreDispositionPackedByReplay} from '../workbench/dispositionPackedReplay';
import {DispositionPagedRun} from '../workbench/dispositionPagedAdapter';
import {restorePackedDispositionPairByReplay} from '../workbench/dispositionPackedPairCheckpoint';
const checkpoint={version:'disposition-workbench/0.1' as const,program:'Plastic/Main',prefix:2,runHash:'a'.repeat(64),saveHash:'b'.repeat(64),saveHex:'001122ff'.repeat(10000)};
it('compares every decompressed byte, freezes metadata and disposes partial reconstruction on failures',async()=>{
 const packed=await packDispositionCheckpoint(checkpoint);let advances=0,disposed=0;
 const create=async()=>({advance:async()=>{advances++;return true;},checkpoint:()=>({...checkpoint})});
 const pending=restoreDispositionPackedByReplay(packed,create,()=>disposed++);packed.prefix=18;
 await pending;expect(advances).toBe(2);expect(disposed).toBe(0);packed.prefix=2;
 const changed=await packDispositionCheckpoint({...checkpoint,saveHex:'ff'+checkpoint.saveHex.slice(2)});
 await expect(restoreDispositionPackedByReplay(changed,create,()=>disposed++)).rejects.toThrow('byte mismatch');
 await expect(restoreDispositionPackedByReplay({...packed,saveHash:'c'.repeat(64)},create,()=>disposed++)).rejects.toThrow('identity');
 await expect(restoreDispositionPackedByReplay({...packed,blob:packed.blob.slice(0,8)},create,()=>disposed++)).rejects.toThrow();
 await expect(restoreDispositionPackedByReplay(packed,async()=>({advance:async()=>false,checkpoint:()=>checkpoint}),()=>disposed++)).rejects.toThrow('ended');
 expect(disposed).toBe(4);
});
it('matches native restore and deterministic continuation for a real frozen program',async()=>{
 const original=await DispositionPagedRun.create('Plastic/Main');await original.advance();
 const checkpoint=original.checkpoint(),packed=await packDispositionCheckpoint(checkpoint);
 const replay=await restoreDispositionPackedByReplay(packed,p=>DispositionPagedRun.create(p),()=>{});
 const native=await DispositionPagedRun.restore(checkpoint);
 expect(replay.summary()).toEqual(native.summary());expect(replay.checkpoint()).toEqual(checkpoint);
 await replay.advance();await native.advance();expect(replay.summary()).toEqual(native.summary());
 expect(replay.checkpoint()).toEqual(native.checkpoint());
},600000);
it('reconstructs sequentially and disposes both branches if exact verification of B fails',async()=>{
 const a=await packDispositionCheckpoint(checkpoint),b=await packDispositionCheckpoint({...checkpoint,program:'Plastic/ConstitutionPositive'});
 const calls:string[]=[],disposed:string[]=[];
 await expect(restorePackedDispositionPairByReplay({version:'disposition-packed-pair/0.1',comparison:'model/0/13',a,b},async program=>{
  calls.push(program);return{program,advance:async()=>true,checkpoint:()=>({...checkpoint,program,saveHex:program==='Plastic/Main'?checkpoint.saveHex:'ff'+checkpoint.saveHex.slice(2)})};
 },run=>disposed.push(run.program))).rejects.toThrow('byte mismatch');
 expect(calls).toEqual(['Plastic/Main','Plastic/ConstitutionPositive']);
 expect(disposed).toEqual(['Plastic/ConstitutionPositive','Plastic/Main']);
});
