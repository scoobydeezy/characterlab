export const DIAGNOSTIC_SEARCH_VERSION='diagnostic-search/0.2';
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

export type DiagnosticChange={path:string;before?:DiagnosticField;after?:DiagnosticField;status:'current'|'unchanged'|'added'|'removed'|'changed'};
export function compareDiagnosticIndexes(current:DiagnosticIndex,baseline?:DiagnosticIndex):DiagnosticChange[]{
 if(current.error||baseline?.error)throw Error('Cannot compare an incomplete diagnostic index.');
 if(!baseline)return current.fields.map(after=>({path:after.path,after,status:'current'}));
 const before=new Map(baseline.fields.map(f=>[f.path,f])),after=new Map(current.fields.map(f=>[f.path,f]));
 const changed=new Set<string>();
 const rows=[...new Set([...after.keys(),...before.keys()])].map(path=>{
  const a=after.get(path),b=before.get(path);
  const status:DiagnosticChange['status']=!b?'added':!a?'removed':a.kind!==b.kind||a.exact!==b.exact?'changed':'unchanged';
  if(status!=='unchanged'){
   let ancestor=path;changed.add(ancestor);
   while(ancestor){ancestor=ancestor.slice(0,ancestor.lastIndexOf('/'));changed.add(ancestor);}
  }
  return {path,before:b,after:a,status};
 });
 // Equal container counts do not imply equal contents.
 for(const row of rows)if(row.status==='unchanged'&&changed.has(row.path))row.status='changed';
 return rows;
}
export function filterDiagnosticChanges(rows:DiagnosticChange[],query:string,section='',changedOnly=false){
 const needle=query.trim().toLowerCase(),matches:DiagnosticChange[]=[];let total=0;
 for(const row of rows){
  if(section&&row.path!==section&&!row.path.startsWith(section+'/'))continue;
  if(changedOnly&&(row.status==='unchanged'||row.status==='current'))continue;
  if(needle&&![row.path,row.before?.exact??'',row.after?.exact??''].some(s=>s.toLowerCase().includes(needle)))continue;
  total++;if(matches.length<DIAGNOSTIC_SEARCH_LIMITS.results)matches.push(row);
 }
 return {matches,total,limited:total>matches.length};
}
