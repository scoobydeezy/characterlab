// Read-only comparison of accepted allocation metadata; no runtime qualification.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const source='docs/formal/EVENT_SEMANTIC_NUMERIC_REGISTRY.md';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const rows=fs.readFileSync(source,'utf8').split(/\r?\n/).flatMap(line=>{
 const m=line.match(/^\| (2\d\d) \| `([^`]+)` \| (.+) \|$/);
 if(!m)return [];
 return [{typeId:m[1],schemaVersion:'1',name:m[2],fields:[...m[3].matchAll(/`(\d+) ([^`?]+)(\?)?`/g)].map(f=>({id:f[1],name:f[2],required:!f[3]}))}];
});
assert.equal(rows.length,50);
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try{
 const {SEMANTIC_RECORD_SCHEMAS}=await server.ssrLoadModule('/src/semanticBinding/semanticSchemaRegistry.ts');
 const actual=SEMANTIC_RECORD_SCHEMAS.map(s=>({typeId:String(s.typeId),schemaVersion:String(s.schemaVersion),name:s.name,fields:s.fields.map(f=>({id:String(f.id),name:f.name,required:f.required}))}));
 assert.deepEqual(actual,rows);
 const result={status:'PASS READ-ONLY SEMANTIC RECORD ALLOCATION PARITY',records:rows.length,fields:rows.reduce((n,r)=>n+r.fields.length,0),sources:[source,'src/semanticBinding/semanticSchemaRegistry.ts','scripts/check-history-semantic-allocation.mjs'].map(path=>({path,sha256:hash(path)})),scope:'All 50 accepted record names, schema versions, field numbers/names and required flags match exported metadata. Does not check namespace/union tables, execution, codec behavior or full semantic qualification.'};
 const dir='docs/planning/campaign3-history-semantic-allocation-rev1';fs.mkdirSync(dir,{recursive:true});const out=dir+'/packet-check.json';
 if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result));
}finally{await server.close();}
