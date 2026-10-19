import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-substitution-search-rev1',parentRoot='docs/planning/workbench-substitution-parity-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),parent=JSON.parse(fs.readFileSync(parentRoot+'/receipt.json'));
assert(!fs.existsSync(root+'/receipt.json'));
const paths=['src/workbench/diagnosticSearch.ts','src/workbench/DiagnosticStateInspector.tsx','src/workbench/diagnosticInspector.css','src/workbench/SubstitutionWorkbench.tsx','src/test/workbenchDiagnosticSearch.test.ts','scripts/check-workbench-diagnostic-search.mjs'];
const sources=paths.map(p=>{const bytes=fs.readFileSync(p),target=root+'/sources/'+p;fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes,{flag:'wx'});return{path:p,sha256:sha(bytes)};});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});let prefixes=0,fields=0,maxFields=0;const results=[];
try{
 const {indexDiagnosticState,searchDiagnosticFields}=await server.ssrLoadModule('/src/workbench/diagnosticSearch.ts');
 for(const file of parent.results){
  const bytes=fs.readFileSync(parentRoot+'/'+file.path);assert.equal(sha(bytes),file.sha256);const data=JSON.parse(gunzipSync(bytes));
  for(const row of data.rows){
   const original=JSON.stringify(row.state),index=indexDiagnosticState(row.state);assert(!index.error,index.error);
   const expected=[];function visit(v,p){expected.push({path:p,kind:v===null?'null':Array.isArray(v)?'array':typeof v,exact:Array.isArray(v)?`Array (${v.length} entries)`:v!==null&&typeof v==='object'?`Object (${Object.keys(v).length} fields)`:JSON.stringify(v)});if(v!==null&&typeof v==='object')for(const [k,x]of Object.entries(v))visit(x,p+'/'+k.replace(/~/g,'~0').replace(/\//g,'~1'));}visit(row.state,'');
   assert.deepEqual(index.fields,expected);assert.equal(JSON.stringify(row.state),original);assert.equal(new Set(index.fields.map(f=>f.path)).size,expected.length);
   const all=searchDiagnosticFields(index,'');assert.equal(all.total,expected.length);assert.equal(all.matches.length,Math.min(100,expected.length));
   for(let n=0;n<row.state.rows.length;n++)assert.equal(index.fields.find(f=>f.path===`/rows/${n}/at`).exact,String(row.state.rows[n].at));
   results.push({program:file.program??data.program,prefix:row.state.at,fields:expected.length,stateHash:sha(original)});prefixes++;fields+=expected.length;maxFields=Math.max(maxFields,expected.length);
  }
 }
 assert.equal(prefixes,261);assert.equal(parent.results.length,29);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS FULL ORIGINAL SUBSTITUTION SEARCH INDEX',sources,parent:{path:parentRoot+'/receipt.json',sha256:sha(fs.readFileSync(parentRoot+'/receipt.json'))},programs:29,prefixes,fields,maxFields,results,scope:'Every field and exact leaf value independently enumerated from original qualified native snapshots; canonical escaped paths and row-at references checked, input unchanged. First100 result limit explicit. UI integration limited to research Experiment mode; broader filtering, cross-subsystem rollout and browser evidence are separate.'},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({status:'PASS',prefixes,fields,maxFields}));
}finally{await server.close();}
