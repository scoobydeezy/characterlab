import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync,gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-provenance-rev1',prior='docs/planning/workbench-disposition-comparison-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const files=new Set();
function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of ['src/workbench/DispositionReasonPanel.tsx','src/campaign3/dispositionPublicMath.ts','src/campaign3/dispositionPublicRuntime.ts','src/campaign3/dispositionAdaptation.ts','docs/formal/DISPOSITIONAL_ADAPTATION_CONTRACT.md','scripts/check-workbench-disposition-provenance.mjs',prior+'/receipt.json','docs/planning/workbench-disposition-factors-rev1/receipt.json'])visit(p);
const sources=[...files].sort().map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return{path:p,sha256:sha(bytes)};});fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {dispositionProvenance:inspect}=await server.ssrLoadModule('/src/workbench/dispositionProvenance.ts'),artifacts=new Map(read(prior+'/receipt.json').artifacts.map(a=>[a.path,a.sha256]));
 let events=0,emitted=0,signals=0,historyEntries=0,batches=0,refoldEvents=0;const results=[],laws=new Set();
 for(let program=0;program<15;program++){
  const filename=`snapshot-${program}-18.json.gz`,bytes=fs.readFileSync(prior+'/'+filename);assert.equal(sha(bytes),artifacts.get(filename));const s=JSON.parse(gunzipSync(bytes)),reports=[];laws.add(s.law);
  for(const e of s.timeline.filter(e=>e.stage==='reasons')){
   const before=JSON.stringify(e),r=inspect(e,s.law,s.seamVersion);assert.equal(JSON.stringify(e),before);reports.push(r);events++;if(!r.emitted)continue;emitted++;
   const operands=JSON.parse(e.output)[0],journal=operands['QualifiedHistory [7]']['Qualifications [1]'];
   assert.deepEqual([r.plastic,r.standing,r.effective,r.feedback],[operands['Plastic [3]'],operands['Standing [4]'],operands['Effective [5]'],operands['Feedback [6]']]);
   assert.equal(r.constitution.value,operands['Constitution [2]']['Value [1]']);
   assert.equal(r.history.length,journal.length);assert.equal(r.batches.length,Math.floor(journal.length/4));assert.equal(r.incompleteBatchEntries,journal.length%4);
   for(const [i,h]of r.history.entries()){assert.equal(h.occurrence,JSON.stringify(journal[i]['Occurrence [1]']));assert.equal(h.contribution,journal[i]['Contribution [4]']);assert.equal(h.instant,journal[i]['Expression [2]']['At [8]']);}
   for(const [root,path]of [['1457',r.constitution.path],['1436',r.journalPath],['1458',r.plasticPath]]){const reads=e.reads.filter(x=>JSON.parse(x.label)['RootStateTypeId [1]']===root);assert.equal(reads.length,path===null?0:1);if(path!==null)assert.equal(reads[0].path,path);}
   if(s.law==='Refold'){refoldEvents++;assert.equal(r.plasticPath,null);}signals+=r.signals.length;historyEntries+=r.history.length;batches+=r.batches.length;
   if(program===13&&e.instant==='1'){
    assert.throws(()=>inspect(e,'Unknown',s.seamVersion),/profile/);
    const missing=structuredClone(e);missing.reads=missing.reads.filter(x=>JSON.parse(x.label)['RootStateTypeId [1]']!=='1457');assert.throws(()=>inspect(missing,s.law,s.seamVersion),/owned-state/);
    const changed=structuredClone(e),out=JSON.parse(changed.output);out[0]['Feedback [6]']='0/1';changed.output=JSON.stringify(out);assert.throws(()=>inspect(changed,s.law,s.seamVersion),/feedback law/);
   }
  }
  assert.equal(reports.length,18);const output=`program-${program}.json.gz`,saved=gzipSync(JSON.stringify(reports)+'\n');fs.writeFileSync(root+'/'+output,saved,{flag:'wx'});results.push({program,law:s.law,path:output,sha256:sha(saved),snapshot:{path:prior+'/'+filename,sha256:sha(bytes)}});console.log(`PASS provenance ${program+1}/15`);
 }
 assert.equal(events,270);assert.equal(emitted,250);assert.equal(laws.size,7);assert(refoldEvents>0);
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS DISPOSITION STATE-TO-STANDING-SIGNAL PROVENANCE',sources,results,counts:{programs:15,laws:7,events,emitted,signals,historyEntries,batches,refoldEvents},scope:'All unique reasons events from15 authenticated terminal snapshots. Source-bound owned-read/operand joins, identity support/opposition rounding, four-entry plastic learning, Refold absence, candidate-specific feedback and opposing standing signals match native records. History-entry and batch counts are cumulative across evaluations. Prior factor receipt establishes event stability across285 snapshots. No new native execution, general law selection, observer language, task-motive provenance or integrated-entry claim.'},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({events,emitted,signals,historyEntries,batches,refoldEvents}));
}finally{await server.close();}
