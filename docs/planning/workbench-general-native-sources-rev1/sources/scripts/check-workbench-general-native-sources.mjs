import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync,gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-general-native-sources-rev1',parent='docs/planning/workbench-general-comparison-cohort-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const old=read(parent+'/receipt.json');assert.equal(old.status,'PASS FROZEN GENERAL COMPARISON COHORT');assert.equal(old.models.length,43);
const files=new Set();function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(ts|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of ['src/workbench/generalAdapter.ts','src/workbench/nativeReadSources.ts','src/test/workbenchNativeReadSources.test.ts','src/test/workbenchNativeReadDecoder.test.ts','scripts/check-workbench-general-native-sources.mjs'])visit(p);
const sources=[...files].sort().map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return {path:p,sha256:sha(bytes)};});fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources,parent:{path:parent+'/receipt.json',sha256:sha(fs.readFileSync(parent+'/receipt.json'))}},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});const results=[];let prefixes=0,reads=0,derived=0,sourceObservations=0;const sourceRelations={};
try{
 const {GeneralWorkbenchRun}=await server.ssrLoadModule('/src/workbench/generalAdapter.ts'),{inspectNativeReadSources}=await server.ssrLoadModule('/src/workbench/nativeReadSources.ts');
 const {canonicalDecode,RecordSchemaRegistry}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),{generalAttentionSupportedSchemas}=await server.ssrLoadModule('/src/campaign3/generalAttentionCodecs.ts'),{exactText,exactKey}=await server.ssrLoadModule('/src/workbench/canonical.ts');const registry=new RecordSchemaRegistry(generalAttentionSupportedSchemas());
 for(const [index,entry] of old.models.entries()){
  const originalBytes=fs.readFileSync(parent+'/'+entry.path);assert.equal(sha(originalBytes),entry.sha256);const decoded=gunzipSync(originalBytes);assert.equal(sha(decoded),entry.decodedSha256);const original=JSON.parse(decoded),run=await GeneralWorkbenchRun.create(entry.recipe,'0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20'),rows=[],stable=new Map();
  for(let prefix=0;prefix<original.length;prefix++){
   const s=run.snapshot(),{nativeReadMetadata,...legacy}=s;assert.deepEqual(legacy,original[prefix]);const checkpoint=run.checkpoint(),save=canonicalDecode(Uint8Array.from(Buffer.from(checkpoint.saveHex,'hex')),registry),trace=save.fields.get(11n).items;assert.equal(trace.length,nativeReadMetadata.length);
   const reports=[];
   for(let i=0;i<trace.length;i++){
    const rawReads=trace[i].fields.get(11n).items,projected=nativeReadMetadata[i].reads;assert.equal(projected.length,rawReads.length);
    for(let j=0;j<rawReads.length;j++){
     const f=rawReads[j].fields,p=projected[j];assert.equal(p.accessor,exactText(f.get(1n)));assert.equal(p.path,exactKey(f.get(2n)));assert.equal(p.presence,f.get(3n));assert.equal(p.exact,p.presence?exactText(f.get(4n)):'Absent');assert.equal(p.transformation,f.get(6n)===false?null:exactText(f.get(6n)));reads++;if(p.transformation)derived++;
     const rawSources=f.get(5n).items;assert.equal(p.sources.length,rawSources.length);for(let k=0;k<rawSources.length;k++){const [path,presence,value]=rawSources[k].items;assert.deepEqual(p.sources[k],{path:exactKey(path),label:exactText(path),presence,exact:presence?exactText(value):'Absent'});sourceObservations++;}
    }
    const h=inspectNativeReadSources(s.timeline,nativeReadMetadata,s.timeline[i].id);for(const r of h.reads)for(const source of r.sourceHistory)sourceRelations[source.relation]=(sourceRelations[source.relation]??0)+1;
    if(stable.has(h.selected))assert.deepEqual(h,stable.get(h.selected));stable.set(h.selected,h);reports.push(h);
   }
   assert.deepEqual(run.checkpoint(),checkpoint);rows.push({prefix,runHash:s.runHash,saveHash:s.saveHash,metadata:nativeReadMetadata,reports});prefixes++;if(prefix+1<original.length)assert(await run.advance());
  }
  assert(run.snapshot().complete);const filename=`model-${String(index).padStart(2,'0')}.json.gz`,bytes=gzipSync(JSON.stringify({recipe:entry.recipe,rows}),{level:9});assert(bytes.length<50000000);fs.writeFileSync(root+'/'+filename,bytes,{flag:'wx'});results.push({recipe:entry.recipe,path:filename,sha256:sha(bytes),original:parent+'/'+entry.path,originalSha256:sha(originalBytes)});console.log(`PASS native sources ${index+1}/43 ${entry.recipe}`);
 }
 assert.equal(prefixes,568);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS FULL GENERAL NATIVE READ SOURCES',sources,models:results.length,prefixes,readObservations:reads,derivedReadObservations:derived,sourceObservations,sourceRelations,results,scope:'Every original General snapshot preserved exactly after removing the new metadata property. Native saved trace independently verifies accessor, transformation and each source tuple; historical reports and checkpoints remain unchanged. Transformation mathematics are not reexecuted, and missing earlier mutations do not establish initial origin. Omniscient diagnostics only; no complete causal necessity, observer-language or Campaign4 entry claim.'},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({status:'PASS',models:results.length,prefixes,reads,derived,sourceObservations,sourceRelations}));
}finally{await server.close();}
