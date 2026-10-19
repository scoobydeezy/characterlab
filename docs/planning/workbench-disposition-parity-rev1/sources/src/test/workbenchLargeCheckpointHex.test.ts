import {expect,it} from 'vitest';
import {encodeCheckpointHex,decodeCheckpointHex} from '../workbench/largeCheckpointHex';
import {bytesToHex} from '../substrate/canonicalEncoding';
it('preserves exact bytes across chunk boundaries and accepts either hex case',()=>{
 const bytes=Uint8Array.from({length:65539},(_,i)=>i%256),hex=encodeCheckpointHex(bytes,bytes.length);
 expect(hex).toBe(bytesToHex(bytes));expect(decodeCheckpointHex(hex,bytes.length)).toEqual(bytes);expect(decodeCheckpointHex(hex.toUpperCase(),bytes.length)).toEqual(bytes);
 expect(encodeCheckpointHex(new Uint8Array(),0)).toBe('');expect(decodeCheckpointHex('',0)).toEqual(new Uint8Array());
});
it('rejects malformed input and over-budget encoding/decoding without truncation',()=>{
 for(const hex of ['0','0g',' 0','0/','０0'])expect(()=>decodeCheckpointHex(hex,10)).toThrow();
 expect(()=>decodeCheckpointHex('0000',1)).toThrow('limit');expect(()=>encodeCheckpointHex(new Uint8Array(2),1)).toThrow('limit');
});
