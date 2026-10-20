export interface RecordedStateField {path:string;root:string;exact:string;}
export function searchRecordedState(fields:readonly RecordedStateField[],query:string,root:string='all'){
 if(query.length>256)throw Error('State query exceeds 256 characters; no results were silently truncated.');
 if(new Set(fields.map(f=>f.path)).size!==fields.length)throw Error('Duplicate canonical state path');
 const needle=query.trim().toLowerCase();
 return fields.filter(f=>(root==='all'||f.root===root)&&(!needle||f.root.toLowerCase().includes(needle)||f.path.toLowerCase().includes(needle)||f.exact.toLowerCase().includes(needle)));
}
