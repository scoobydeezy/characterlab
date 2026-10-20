import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync,gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-canonical-architecture-rev1',prior='docs/planning/workbench-disposition-comparison-rev1',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const files=new Set();
function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of ['src/workbench/DispositionArchitectureInspector.tsx','src/workbench/DispositionWorkbench.tsx','CHARACTER_ARCHITECTURE.md','docs/formal/DISPOSITION_PUBLIC_CONTRACT.md','scripts/check-workbench-disposition-canonical-architecture.mjs',prior+'/receipt.json'])visit(p);
const sources=[...files].sort().map(p=>{const b=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,b,{flag:'wx'});return{path:p,sha256:sha(b)};});fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {dispositionArchitecture:inspect}=await server.ssrLoadModule('/src/workbench/dispositionArchitecture.ts'),artifacts=new Map(JSON.parse(fs.readFileSync(prior+'/receipt.json')).artifacts.map(a=>[a.path,a.sha256])),results=[];
 let prefixes=0,mapped=0,support=0;
 for(let program=0;program<15;program++){
  const reports=[];
  for(let prefix=0;prefix<=18;prefix++){
   const file=`snapshot-${program}-${prefix}.json.gz`,bytes=fs.readFileSync(prior+'/'+file);assert.equal(sha(bytes),artifacts.get(file));const s=JSON.parse(gunzipSync(bytes)),r=inspect(s);
   assert.deepEqual(r.unclassifiedPaths,[]);assert.equal(r.boxes.find(b=>b.box==='Disp').present,s.law==='Refold'?0:1);
   for(const row of r.rows){
    const reads=s.timeline.flatMap(e=>e.reads.filter(x=>x.path===row.path)),diffs=s.timeline.flatMap(e=>e.diffs.filter(x=>x.path===row.path));
    assert.equal(row.reads,reads.length);assert.equal(row.mutations,diffs.length);assert.equal(row.changes,diffs.filter(d=>d.changed).length);
    assert.deepEqual(row.events.map(e=>e.id),s.timeline.filter(e=>e.reads.some(x=>x.path===row.path)||e.diffs.some(x=>x.path===row.path)).map(e=>e.id));
    if(row.root==='1457')assert.equal(row.mutations,0);
    if(row.root==='1441'){assert.equal(row.binding,null);assert(row.support);support++;}else{assert(row.binding);mapped++;}
   }
   for(const b of r.boxes)assert(!b.paths.some(p=>r.rows.find(x=>x.path===p).root==='1441'));
   if(prefix===0){assert.throws(()=>inspect({...s,seamVersion:'other'}));const bad=structuredClone(s);bad.fields[0].root='0';assert.throws(()=>inspect(bad),/root\/path mismatch/);}
   reports.push(r);prefixes++;
  }
  const filename=`program-${program}.json.gz`,bytes=gzipSync(JSON.stringify(reports)+'\n');fs.writeFileSync(root+'/'+filename,bytes,{flag:'wx'});results.push({program,path:filename,sha256:sha(bytes)});console.log(`PASS canonical participation ${program+1}/15`);
 }
 assert.equal(prefixes,285);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS SCOPED DISPOSITION CANONICAL PARTICIPATION',sources,results,counts:{programs:15,prefixes,mapped,support},scope:'Three candidate state correspondences; physical execution outside character-box totals. Native-backed path identities, actual read/mutation/change/event counts verified for285 prefixes. No new edges, dimension irreducibility, causal necessity or full-architecture completion claim.'},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
