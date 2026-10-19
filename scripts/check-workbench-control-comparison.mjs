import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-control-comparison-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const visited=new Set();function visit(file){file=file.replaceAll('\\','/');if(visited.has(file))return;visited.add(file);for(const m of fs.readFileSync(file,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(file),m[1].split('?')[0]),child=[stem,stem+'.ts',path.join(stem,'index.ts')].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());assert(child,stem);if(child.endsWith('.ts'))visit(child);else visited.add(child.replaceAll('\\','/'));}}
for(const f of ['src/workbench/controlAdapter.ts','src/workbench/controlComparison.ts','src/test/workbenchControlComparison.test.ts'])visit(f);for(const f of ['scripts/check-workbench-control-comparison.mjs','docs/planning/CONTROL_PUBLIC_RESULT_REV2.json'])visited.add(f);
const sources=[...visited].sort().map(path=>({path,sha256:sha(fs.readFileSync(path))}));for(const s of sources){const target=root+'/sources/'+s.path;fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,fs.readFileSync(s.path),{flag:'wx'});}
const catalog=read('src/workbench/controlCatalog.json'),historical=read('docs/planning/CONTROL_PUBLIC_RESULT_REV2.json');for(const s of catalog.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'}),trajectories=new Map(),results=[];let prefixes=0,aligned=0,unaligned=0,missing=0;
try{
 const {ControlWorkbenchRun}=await server.ssrLoadModule('/src/workbench/controlAdapter.ts'),{CONTROL_CONTRASTS,compareControl}=await server.ssrLoadModule('/src/workbench/controlComparison.ts');
 for(const p of catalog.programs){const run=await ControlWorkbenchRun.create(p.id),rows=[];do{rows.push(run.snapshot());}while(await run.advance());const old=historical.results.find(r=>r.candidate===p.candidate&&r.law===p.law&&r.name===p.name),end=rows.at(-1);assert.equal(rows.length,old.prefixes);for(const [k,v]of [['saveHash','saveSha256'],['stateHash','stateSha256'],['outputsHash','outputSha256']])assert.equal(end[k],old[v]);assert.equal(end.observerHash,old.observerSha256[0]);trajectories.set(p.id,rows);prefixes+=rows.length;console.log(`CONTROL comparison input ${trajectories.size}/17 ${p.id}`);}
 for(const [index,c]of CONTROL_CONTRASTS.entries()){
  const aa=trajectories.get(c.a),bb=trajectories.get(c.b),rows=[];
  for(let i=0;i<Math.max(aa.length,bb.length);i++){
   const a=aa[i],b=bb[i];if(!a||!b){rows.push({prefix:i,missing:!a?'a':'b'});missing++;continue;}
   const r=await compareControl(c.id,a,b),same=a.prefix===b.prefix&&a.clock===b.clock;assert.equal(r.aligned,same);
   if(same){aligned++;assert.equal(r.observerEqual,a.observerHex===b.observerHex);assert.equal(r.outputsEqual,a.researchOutputs===b.researchOutputs);assert.equal(r.stateEqual,JSON.stringify(a.fields)===JSON.stringify(b.fields));assert.equal(r.saveEqual,a.saveHash===b.saveHash);for(const f of r.fields){assert.equal(f.a,a.fields.find(x=>x.path===f.path)?.exact??null);assert.equal(f.b,b.fields.find(x=>x.path===f.path)?.exact??null);assert.equal(f.equal,f.a===f.b);}}
   else{unaligned++;for(const k of ['observerEqual','outputsEqual','stateEqual','saveEqual'])assert.equal(r[k],null);assert.deepEqual(r.fields,[]);}
   if(c.id==='privacy/hidden-absent'||c.id==='input/hiddenReward')assert.equal(r.observerEqual,true);
   rows.push(r);
  }
  const file=`pair-${String(index).padStart(2,'0')}.json.gz`;fs.writeFileSync(root+'/'+file,gzipSync(JSON.stringify({contrast:c,rows})+'\n'),{flag:'wx'});results.push({path:file,sha256:sha(fs.readFileSync(root+'/'+file)),id:c.id,rows:rows.length});
 }
 assert.equal(trajectories.size,17);assert.equal(prefixes,142);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS FULL DECLARED CONTROL COMPARISONS',sources,originals:catalog.sources,results,counts:{programs:17,prefixes,pairs:results.length,aligned,unaligned,missing},scope:'Every declared comparison over complete original adapter trajectories, historical terminal commitments, exact state/observer/output equality checks and explicit missing/unaligned prefixes. Same-seed does not prove matched draws. No browser, character language, all-factor causal attribution or Campaign4 entry acceptance.'},null,2)+'\n',{flag:'wx'});console.log(`PASS CONTROL ${results.length} pairs/${aligned} aligned/${unaligned} unaligned/${missing} missing`);
}finally{await server.close();}
