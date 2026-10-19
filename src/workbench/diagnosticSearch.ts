export const DIAGNOSTIC_SEARCH_VERSION='diagnostic-search/0.1';
export const DIAGNOSTIC_SEARCH_LIMITS={nodes:10000,text:1000000,results:100} as const;
export type DiagnosticField={path:string;kind:string;exact:string};
export type DiagnosticIndex={fields:DiagnosticField[];error?:string};
const escape=(key:string)=>key.replace(/~/g,'~0').replace(/\//g,'~1');
/** Detached JSON diagnostics only. Reject the entire index on limits: never hide
 * omitted fields behind an apparently complete search result.
 */
export function indexDiagnosticState(value:unknown):DiagnosticIndex{
 const fields:DiagnosticField[]=[];let size=0;
 const stack=[{value,path:''}];const seen=new Set<object>();
 try{
  while(stack.length){
   const item=stack.pop()!,v=item.value;
   if(fields.length>=DIAGNOSTIC_SEARCH_LIMITS.nodes)throw Error('Diagnostic search unavailable: field limit exceeded (10000). Exact state remains available.');
   const kind=v===null?'null':Array.isArray(v)?'array':typeof v;
   if(!['null','array','object','string','number','boolean'].includes(kind)||kind==='number'&&!Number.isFinite(v))throw Error('Diagnostic search requires finite JSON data.');
   if(v!==null&&typeof v==='object'){
    if(seen.has(v))throw Error('Diagnostic search requires an acyclic JSON tree.');seen.add(v);
    if(!Array.isArray(v)&&Object.getPrototypeOf(v)!==Object.prototype&&Object.getPrototypeOf(v)!==null)throw Error('Diagnostic search requires plain JSON objects.');
   }
   // Container summaries avoid repeatedly serializing entire subtrees.
   const entries=v!==null&&typeof v==='object'?Object.entries(v):[];
   const exact=kind==='array'?`Array (${entries.length} entries)`:kind==='object'?`Object (${entries.length} fields)`:JSON.stringify(v);
   size+=item.path.length+exact.length;
   if(size>DIAGNOSTIC_SEARCH_LIMITS.text)throw Error('Diagnostic search unavailable: index text limit exceeded (1000000 characters). Exact state remains available.');
   fields.push({path:item.path,kind,exact});
   if(fields.length+stack.length+entries.length>DIAGNOSTIC_SEARCH_LIMITS.nodes)throw Error('Diagnostic search unavailable: field limit exceeded (10000). Exact state remains available.');
   for(let i=entries.length-1;i>=0;i--){const [key,child]=entries[i];stack.push({value:child,path:item.path+'/'+escape(key)});}
  }
  return {fields};
 }catch(e){return {fields:[],error:e instanceof Error?e.message:String(e)};}
}
export function searchDiagnosticFields(index:DiagnosticIndex,query:string){
 const needle=query.trim().toLowerCase(),matches:DiagnosticField[]=[];let total=0;
 for(const field of index.fields)if(!needle||field.path.toLowerCase().includes(needle)||field.exact.toLowerCase().includes(needle)){
  total++;if(matches.length<DIAGNOSTIC_SEARCH_LIMITS.results)matches.push(field);
 }
 return {matches,total,limited:total>matches.length};
}
