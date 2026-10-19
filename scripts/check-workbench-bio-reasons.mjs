import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';import {gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-bio-reasons-rev1',parent='docs/planning/workbench-bio-parity-rev1';
const sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const files=new Set();function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(ts|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1]),child=[stem,stem+'.ts',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of ['src/workbench/bioReasonDiagnostics.ts','scripts/check-workbench-bio-reasons.mjs'])visit(p);
const sources=[...files].sort().map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return {path:p,sha256:sha(bytes)};});
fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {inspectBioReasons}=await server.ssrLoadModule('/src/workbench/bioReasonDiagnostics.ts');
 const {decodeReceiving}=await server.ssrLoadModule('/src/campaign3/receivingCodecs.ts');
 const {fromHex,exactKey,exactText}=await server.ssrLoadModule('/src/workbench/canonical.ts');
 const {list,unsigned}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const parity=read(parent+'/receipt.json'),results=[];let records=0,signals=0,nuclei=0,coverage=0,uncovered=0;
 const field=(value,n)=>{const matches=Object.entries(value).filter(([key])=>key.endsWith(` [${n}]`));assert.equal(matches.length,1);return matches[0][1];};
 for(const entry of parity.cases){
  const bytes=fs.readFileSync(parent+'/'+entry.path);assert.equal(sha(bytes),entry.sha256);
  const original=JSON.parse(bytes),reports=[];
  for(const record of original.finalRecords){
   const before=JSON.stringify(record),raw=JSON.parse(record.exact),r=inspectBioReasons(record.canonicalHex);
   assert.equal(r.ordinal,String(record.ordinal));assert.equal(r.signals.length,field(raw[3],3).length);
   assert.equal(r.nuclei.length,field(raw[4],3).length);
   for(const [i,s]of r.signals.entries()){
    const v=field(raw[3],3)[i];assert.deepEqual(JSON.parse(s.source),field(v,1));assert.equal(s.strength,field(v,2));assert.deepEqual(JSON.parse(s.basis),field(v,3));
    assert.equal(s.role,{'1':'base','2':'situational','3':'standing'}[field(field(v,1),3)]);
    const linked=r.nuclei.flatMap(n=>n.coverage).filter(c=>c.sourceKey===s.key);assert.equal(linked.length,s.coverage==='recorded'?1:0);if(!linked.length)uncovered++;signals++;
   }
   for(const [i,n]of r.nuclei.entries()){
    const v=field(raw[4],3)[i],role=field(v,2);
    assert.deepEqual(JSON.parse(n.identity),field(v,1));
    assert.deepEqual([n.baseNet,n.standingNet,n.situationalNet],[1,2,3].map(k=>field(role,k)));
    assert.deepEqual([n.relevance,n.baseDie,n.standingModifier,n.situationalModifier],[3,4,5,6].map(k=>field(v,k)));
    assert.deepEqual(JSON.parse(n.distribution),field(v,7));assert.equal(n.coverage.length,field(role,4).length);
    for(const [j,c]of n.coverage.entries()){
     const source=r.signals.find(s=>s.key===c.sourceKey),v=field(role,4)[j];assert(source);
     assert.deepEqual(JSON.parse(source.source),field(v,1));
     assert.deepEqual([c.magnitude,c.overlap,c.independent,c.effective],[2,3,4,5].map(k=>field(v,k)));coverage++;
    }nuclei++;
   }
   assert.deepEqual(inspectBioReasons(record.canonicalHex),r);assert.equal(JSON.stringify(record),before);
   reports.push(r);records++;
  }
  const first=decodeReceiving(fromHex(original.finalRecords[0].canonicalHex)).items;
  assert.throws(()=>inspectBioReasons(exactKey(list([unsigned(0),...first.slice(1)]))),/ordinal/);
  const second=decodeReceiving(fromHex(original.finalRecords[1].canonicalHex)).items;
  const mismatch=[...first];mismatch[4]=second[4];assert.throws(()=>inspectBioReasons(exactKey(list(mismatch))),/lineage/);
  const mismatchContext=[...first];mismatchContext[2]=second[2];assert.throws(()=>inspectBioReasons(exactKey(list(mismatchContext))),/lineage/);
  const path=entry.path+'.gz';fs.writeFileSync(root+'/'+path,gzipSync(JSON.stringify(reports),{level:9}),{flag:'wx'});
  results.push({name:entry.name,path,sha256:sha(fs.readFileSync(root+'/'+path)),original:parent+'/'+entry.path,originalSha256:entry.sha256});
 }
 assert.equal(records,247);assert.throws(()=>inspectBioReasons('00'.repeat(8_000_001)),/byte limit/);assert.throws(()=>inspectBioReasons('xx'));
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS FULL RETAINED BIO REASON FACTOR DIAGNOSTICS',sources,results,counts:{cases:13,records,signals,nuclei,coverage,uncovered,negativeChecks:41},scope:'Every original component record independently joins canonical raw factors, role nets, coverage entries and compiled nuclei to its frozen readable native record. Repeated reads preserve inputs. Invalid calendar, context/reason lineage, hex and size reject. This reads evaluation-time records only; no later history is consulted. No character-language, browser, complete choice attribution or Campaign4 entry qualification.'},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({status:'PASS',records,signals,nuclei,coverage,uncovered}));
}finally{await server.close();}
