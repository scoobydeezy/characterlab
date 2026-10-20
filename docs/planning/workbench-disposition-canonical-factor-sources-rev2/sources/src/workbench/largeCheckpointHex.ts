/** Bounded temporary arrays for large native saves. The returned string/bytes still
 * require their full declared size; this is not a global heap budget.
 */
export function encodeCheckpointHex(bytes:Uint8Array,maxBytes:number):string{
 if(bytes.length>maxBytes)throw Error('Checkpoint exceeds declared byte limit');
 const chunks:string[]=[];
 for(let start=0;start<bytes.length;start+=32768){const end=Math.min(bytes.length,start+32768),chunk:string[]=[];for(let i=start;i<end;i++)chunk.push(bytes[i].toString(16).padStart(2,'0'));chunks.push(chunk.join(''));}
 return chunks.join('');
}
export function decodeCheckpointHex(hex:string,maxBytes:number):Uint8Array{
 if(hex.length%2||hex.length>maxBytes*2)throw Error('Checkpoint hexadecimal length exceeds declared limit or is odd');
 const bytes=new Uint8Array(hex.length/2);
 const nibble=(code:number)=>code>=48&&code<=57?code-48:code>=65&&code<=70?code-55:code>=97&&code<=102?code-87:-1;
 for(let i=0;i<bytes.length;i++){const high=nibble(hex.charCodeAt(i*2)),low=nibble(hex.charCodeAt(i*2+1));if(high<0||low<0)throw Error('Invalid checkpoint hexadecimal bytes');bytes[i]=(high<<4)|low;}
 return bytes;
}
