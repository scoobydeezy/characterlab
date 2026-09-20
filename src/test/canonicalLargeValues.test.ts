import {it,expect} from 'vitest';
import {canonicalEncode as enc,canonicalDecode as dec,bytes,text,set,map,unsigned as u} from '../substrate/canonicalEncoding';
it('encodes large byte/text values and canonical collection keys without argument-stack overflow',()=>{
 const source=Uint8Array.from({length:262144},(_,i)=>i%256),large=bytes(source);
 for(const value of [large,text('a'.repeat(source.length)),set([large]),map([[large,u(1)]])]){
  const encoded=enc(value),again=enc(dec(encoded));expect(again.length===encoded.length&&again.every((v,i)=>v===encoded[i])).toBe(true);
 }
 // Existing small wire encodings remain byte-for-byte unchanged.
 expect([...enc(bytes(Uint8Array.of(1,2,255)))]).toEqual([4,3,1,2,255]);
});
