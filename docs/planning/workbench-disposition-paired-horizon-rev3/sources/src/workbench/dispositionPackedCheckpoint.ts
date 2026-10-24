import {DISPOSITION_MAX_SAVE_BYTES,type DispositionCheckpoint} from './dispositionAdapter';
import {decodeCheckpointHex,encodeCheckpointHex} from './largeCheckpointHex';
export interface DispositionPackedCheckpoint {version:'disposition-packed-checkpoint/0.1';program:string;prefix:number;runHash:string;saveHash:string;saveBytes:number;compression:'gzip';blob:Blob;}
const CHUNK_BYTES=32768;
function metadata(c:{program:string;prefix:number;runHash:string;saveHash:string}){if(typeof c.program!=='string'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>18||! /^[0-9a-f]{64}$/.test(c.runHash)||! /^[0-9a-f]{64}$/.test(c.saveHash))throw Error('Invalid packed checkpoint metadata');return {program:c.program,prefix:c.prefix,runHash:c.runHash,saveHash:c.saveHash};}
/** Stream native save bytes from bounded hex chunks. Never constructs another complete byte array. */
export async function packDispositionCheckpoint(c:DispositionCheckpoint):Promise<DispositionPackedCheckpoint>{
 if(c.version!=='disposition-workbench/0.1'||typeof c.saveHex!=='string'||!c.saveHex.length||c.saveHex.length%2||c.saveHex.length>DISPOSITION_MAX_SAVE_BYTES*2)throw Error('Invalid checkpoint for packing');const fields=metadata(c),hex=c.saveHex,saveBytes=hex.length/2;let offset=0;
 const input=new ReadableStream<BufferSource>({pull(controller){if(offset===hex.length){controller.close();return;}const end=Math.min(offset+CHUNK_BYTES*2,hex.length);controller.enqueue(new Uint8Array(decodeCheckpointHex(hex.slice(offset,end),CHUNK_BYTES)));offset=end;}});
 const blob=await new Response(input.pipeThrough(new CompressionStream('gzip'))).blob();return {version:'disposition-packed-checkpoint/0.1',...fields,saveBytes,compression:'gzip',blob};
}
/** Bounded decompression; native restore remains responsible for save authentication. */
export async function unpackDispositionCheckpoint(c:DispositionPackedCheckpoint):Promise<DispositionCheckpoint>{
 if(!c||c.version!=='disposition-packed-checkpoint/0.1'||c.compression!=='gzip'||!(c.blob instanceof Blob)||!Number.isSafeInteger(c.saveBytes)||c.saveBytes<1||c.saveBytes>DISPOSITION_MAX_SAVE_BYTES||c.blob.size>DISPOSITION_MAX_SAVE_BYTES+1048576)throw Error('Invalid packed checkpoint');const fields=metadata(c),expectedBytes=c.saveBytes,reader=c.blob.stream().pipeThrough(new DecompressionStream('gzip')).getReader(),chunks:string[]=[];let total=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;total+=value.length;if(total>expectedBytes||total>DISPOSITION_MAX_SAVE_BYTES)throw Error('Packed checkpoint expanded beyond declared size');chunks.push(encodeCheckpointHex(value,DISPOSITION_MAX_SAVE_BYTES));}if(total!==expectedBytes)throw Error('Packed checkpoint byte count mismatch');return {version:'disposition-workbench/0.1',...fields,saveHex:chunks.join('')};}finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
}
