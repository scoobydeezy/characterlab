import {DISPOSITION_MAX_SAVE_BYTES,type DispositionCheckpoint} from './dispositionAdapter';
import type {DispositionPackedCheckpoint} from './dispositionPackedCheckpoint';

export interface DispositionReplayRun {
 advance():Promise<boolean>;
 checkpoint():DispositionCheckpoint|Promise<DispositionCheckpoint>;
}

/** Workbench transport strategy only. Reproduce the frozen program, then compare
 * every original native save byte. No incoming canonical trace is decoded. */
export async function restoreDispositionPackedByReplay<T extends DispositionReplayRun>(
 input:DispositionPackedCheckpoint,create:(program:string)=>Promise<T>,dispose:(run:T)=>void,
):Promise<T>{
 if(!input||input.version!=='disposition-packed-checkpoint/0.1'||input.compression!=='gzip'||!(input.blob instanceof Blob)
  ||typeof input.program!=='string'||!Number.isInteger(input.prefix)||input.prefix<0||input.prefix>18
  ||!Number.isSafeInteger(input.saveBytes)||input.saveBytes<1||input.saveBytes>DISPOSITION_MAX_SAVE_BYTES
  ||input.blob.size>DISPOSITION_MAX_SAVE_BYTES+1048576
  ||!(/^[0-9a-f]{64}$/).test(input.runHash)||!(/^[0-9a-f]{64}$/).test(input.saveHash))throw Error('Invalid packed replay checkpoint');
 // Snapshot mutable metadata before awaiting. Blob bytes are immutable.
 const c={...input};
 const run=await create(c.program);
 try{
  for(let i=0;i<c.prefix;i++)if(!await run.advance())throw Error('Packed replay ended before declared prefix');
  const actual=await run.checkpoint();
  if(actual.version!=='disposition-workbench/0.1'||actual.program!==c.program||actual.prefix!==c.prefix
   ||actual.runHash!==c.runHash||actual.saveHash!==c.saveHash)throw Error('Packed replay identity mismatch');
  if(actual.saveHex.length!==c.saveBytes*2)throw Error('Packed replay byte count mismatch');
  const reader=c.blob.stream().pipeThrough(new DecompressionStream('gzip')).getReader();let offset=0;
  try{
   while(true){const {done,value}=await reader.read();if(done)break;
    if(offset+value.length>c.saveBytes)throw Error('Packed replay expanded beyond declared size');
    for(let i=0;i<value.length;i++){
     const hex=actual.saveHex.slice((offset+i)*2,(offset+i)*2+2);
     if(!/^[0-9a-f]{2}$/i.test(hex)||Number.parseInt(hex,16)!==value[i])throw Error('Packed replay whole-save byte mismatch');
    }
    offset+=value.length;
   }
   if(offset!==c.saveBytes)throw Error('Packed replay truncated save');
  }finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
  return run;
 }catch(error){dispose(run);throw error;}
}
