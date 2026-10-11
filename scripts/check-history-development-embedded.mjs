// Structural review of embedded historical expression/journal bytes, no simulation.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const p='docs/planning/',out=p+'campaign3-history-development-embedded-rev1/';
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,watch:null},appType:'custom'});
try{
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),codec=await server.ssrLoadModule('/src/campaign3/identityPublicCodecs.ts');
 const registry=new c.RecordSchemaRegistry(codec.identityPublicSupportedSchemas());
 const cache=new Map(),texts=new Map(),sources=[],roots=new Map();let occurrences=0;
 function walk(v){
  if(typeof v==='boolean')return;
  if(v.kind==='text'){texts.set(v.value,(texts.get(v.value)??0)+1);return;}
  if(v.kind==='record'){for(const x of v.fields.values())walk(x);}
  else if(v.kind==='list'||v.kind==='set')v.items.forEach(walk);
  else if(v.kind==='map')v.entries.forEach(([k,x])=>{walk(k);walk(x);});
  else if(v.kind==='typedIdentifier')walk(v.payload);
 }
 for(const lane of ['COMPONENT','PUBLIC'])for(let i=0;i<36;i++){
  const path=p+`DEVELOPMENT_${lane}_RUN_${i}_REV${lane==='COMPONENT'?1:3}.json`,run=JSON.parse(fs.readFileSync(path));let fields=0;
  for(const row of run.rows)for(const key of ['expression','journal']){
   const hex=row[key];if(hex===null){assert.equal(key,'expression');continue;}
   assert.match(hex,/^(?:[0-9a-f]{2})+$/);occurrences++;fields++;
   const expected=key==='expression'?1433n:1435n;
   if(cache.has(hex)){assert.equal(cache.get(hex),expected);continue;}
   const bytes=new Uint8Array(Buffer.from(hex,'hex')),v=c.canonicalDecode(bytes,registry);
   assert.equal(v.kind,'record');assert.equal(v.schema.typeId,expected);assert.deepEqual(c.canonicalEncode(v),bytes);
   cache.set(hex,expected);roots.set(String(expected),(roots.get(String(expected))??0)+1);walk(v);
  }
  sources.push({path,sha256:sha(path),fields});
 }
 fs.mkdirSync(out,{recursive:true});const v={status:'EMBEDDED EXPRESSION/JOURNAL STRUCTURAL ACCOUNTING PASS',sources,fieldOccurrences:occurrences,uniqueCanonicalValues:cache.size,rootTypes:Object.fromEntries(roots),textValues:[...texts].sort(([a],[b])=>a.localeCompare(b)).map(([value,occurrences])=>({value,occurrences})),scope:'Canonical structure and text enumeration, not complete semantic refinement, current execution or whole run-schema qualification.',dependencies:['src/substrate/canonicalEncoding.ts','src/campaign3/identityPublicCodecs.ts'].map(path=>({path,sha256:sha(path)})),checkerSha256:sha('scripts/check-history-development-embedded.mjs')};
 const file=out+'check.json';if(fs.existsSync(file))assert.deepEqual(JSON.parse(fs.readFileSync(file)),v);else fs.writeFileSync(file,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({status:v.status,fieldOccurrences:occurrences,uniqueCanonicalValues:cache.size,rootTypes:v.rootTypes,textValues:v.textValues}));
}finally{await server.close();}
