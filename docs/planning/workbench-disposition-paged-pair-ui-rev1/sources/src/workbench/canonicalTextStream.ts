import {bytesToHex,type CanonicalValue} from '../substrate/canonicalEncoding';
/** Same JSON text as exactText, emitted without constructing its readable object tree. */
export function* canonicalTextChunks(value:CanonicalValue,depth=0):Generator<string>{
 const indent=(n:number)=>'  '.repeat(n),quoted=(s:string)=>JSON.stringify(s);
 function* object(entries:Iterable<readonly [string,CanonicalValue|string]>,strings=false):Generator<string>{
  let count=0;yield '{';for(const [key,v]of entries){yield `${count++?',':''}\n${indent(depth+1)}${quoted(key)}: `;if(strings||typeof v==='string')yield quoted(v as string);else yield* canonicalTextChunks(v,depth+1);}if(count)yield `\n${indent(depth)}`;yield '}';
 }
 function* array(values:readonly CanonicalValue[]):Generator<string>{yield '[';for(let i=0;i<values.length;i++){yield `${i?',':''}\n${indent(depth+1)}`;yield* canonicalTextChunks(values[i],depth+1);}if(values.length)yield `\n${indent(depth)}`;yield ']';}
 if(typeof value==='boolean'){yield String(value);return;}
 switch(value.kind){
  case 'unsigned':case 'signed':yield quoted(value.value.toString());break;
  case 'text':yield quoted(value.value);break;
  case 'rational':yield quoted(`${value.numerator}/${value.denominator}`);break;
  case 'bytes':yield* object([['bytes',bytesToHex(value.value)]],true);break;
  case 'typedIdentifier':yield* object([['namespace',String(value.namespaceId)],['identity',value.payload]]);break;
  case 'list':case 'set':yield* array(value.items);break;
  case 'map':yield* array(value.entries.map(([k,v])=>({kind:'list' as const,items:[k,v]})));break;
  case 'record':yield* object([['record',`${value.schema.name}#${value.schema.typeId}/${value.schema.schemaVersion}`],...[...value.fields].map(([id,v])=>[`${value.schema.fields.find(f=>f.id===id)?.name??'field'} [${id}]`,v] as const)]);break;
 }
}
export const EXACT_TEXT_PAGE_LIMIT=65536;
/** Offsets count UTF-16 code units, as String.slice does; joining consecutive pages is exact. */
export function canonicalTextPage(value:CanonicalValue,offset=0,limit=EXACT_TEXT_PAGE_LIMIT){
 if(!Number.isSafeInteger(offset)||offset<0||!Number.isSafeInteger(limit)||limit<1||limit>EXACT_TEXT_PAGE_LIMIT)throw Error('Invalid exact-text page bounds');
 let length=0,text='';for(const chunk of canonicalTextChunks(value)){const end=length+chunk.length;if(end>offset&&length<offset+limit)text+=chunk.slice(Math.max(0,offset-length),Math.min(chunk.length,offset+limit-length));length=end;}
 if(offset>length)throw Error('Exact-text offset exceeds document');
 return {offset,text,totalCodeUnits:length,nextOffset:offset+text.length<length?offset+text.length:null};
}
