import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-bio-reason-history-rev1',parent='docs/planning/workbench-bio-parity-rev1',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const files=new Set();function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(ts|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1]),child=[stem,stem+'.ts',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
visit('src/workbench/bioReasonHistory.ts');visit('scripts/check-workbench-bio-reason-history.mjs');
const sources=[...files].sort().map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return {path:p,sha256:sha(bytes)};});
fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {inspectBioReasonHistory}=await server.ssrLoadModule('/src/workbench/bioReasonHistory.ts');
 const {decodeReceiving}=await server.ssrLoadModule('/src/campaign3/receivingCodecs.ts');
 const {fromHex,exactKey}=await server.ssrLoadModule('/src/workbench/canonical.ts');
 const {list}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const receipt=JSON.parse(fs.readFileSync(parent+'/receipt.json')),results=[];let reports=0,links=0,unavailable=0;
 const f=(v,n)=>{const xs=Object.entries(v).filter(([k])=>k.endsWith(` [${n}]`));assert.equal(xs.length,1);return xs[0][1];};
 for(const entry of receipt.cases){
  const bytes=fs.readFileSync(parent+'/'+entry.path);assert.equal(sha(bytes),entry.sha256);
  const original=JSON.parse(bytes),hexes=original.finalRecords.map(r=>r.canonicalHex),readable=original.finalRecords.map(r=>JSON.parse(r.exact)),rows=[];
  for(let selected=1;selected<=19;selected++){
   const report=inspectBioReasonHistory(hexes,selected);
   assert.deepEqual(report,inspectBioReasonHistory(hexes.slice(0,selected),selected));
   const rawSignals=f(readable[selected-1][3],3);assert.equal(report.sources.length,rawSignals.length);
   report.sources.forEach((source,i)=>{
    const atoms=f(f(rawSignals[i],3),1);assert.equal(source.atoms.length,atoms.length);
    source.atoms.forEach((atom,j)=>{
     assert.deepEqual(JSON.parse(atom.identity),atoms[j][0]);assert.equal(atom.weight,JSON.stringify(atoms[j][1],null,2));
     if(f(atoms[j][0],1)!=='2'){assert.equal(atom.status,'other-recorded-atom');return;}
     const earlier=readable.slice(0,selected-1).findIndex(r=>JSON.stringify(f(r[8],1))===JSON.stringify(f(atoms[j][0],3)));
     if(earlier<0){assert.equal(atom.status,'no-earlier-recorded-qualification');unavailable++;return;}
     assert.equal(atom.status,'earlier-recorded-qualification');assert.equal(atom.source.ordinal,earlier+1);
     const canonical=decodeReceiving(fromHex(hexes[earlier])).items;
     assert.equal(atom.source.qualification,exactKey(canonical[8]));assert.equal(atom.source.expression,exactKey(canonical[7]));
     assert.equal(atom.source.eligibility,f(f(readable[earlier][8],3),1));
     assert.equal(atom.source.evidence,atom.source.eligibility==='1'?JSON.stringify(f(f(readable[earlier][8],3),3),null,2):null);links++;
    });
   });rows.push(report);reports++;
  }
  assert.throws(()=>inspectBioReasonHistory(hexes,0),/selection/);
  assert.throws(()=>inspectBioReasonHistory([...hexes].reverse(),1),/order/);
  const row=decodeReceiving(fromHex(hexes[1])).items,changed=[...row];changed[7]=decodeReceiving(fromHex(hexes[0])).items[7];
  assert.throws(()=>inspectBioReasonHistory([hexes[0],exactKey(list(changed))],2),/lineage/);
  const filename=entry.path+'.gz';fs.writeFileSync(root+'/'+filename,gzipSync(JSON.stringify(rows),{level:9}),{flag:'wx'});results.push({name:entry.name,path:filename,sha256:sha(fs.readFileSync(root+'/'+filename)),original:parent+'/'+entry.path,originalSha256:entry.sha256});
 }
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS FULL RETAINED BIO REASON HISTORY',sources,results,counts:{cases:13,reports,links,unavailable,negativeChecks:39},scope:'All247 selected original records join basis atoms to earlier original qualifications/expressions. Independent readable-record lookup checks every source, and truncating at evaluation time leaves each report identical. RecomputedHistory current archive never replaces the original row source. Diagnostic provenance only; no browser navigation, observer-language, independent-evidence or causal-necessity qualification.'},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({status:'PASS',reports,links,unavailable}));
}finally{await server.close();}
