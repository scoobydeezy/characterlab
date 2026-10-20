import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync,gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-factors-rev1',prior='docs/planning/workbench-disposition-comparison-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const files=new Set();
function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of ['src/workbench/DispositionReasonPanel.tsx','scripts/check-workbench-disposition-factors.mjs',prior+'/receipt.json',prior+'/verification.json'])visit(p);
const sources=[...files].sort().map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return{path:p,sha256:sha(bytes)};});fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {dispositionFactorSources:inspect}=await server.ssrLoadModule('/src/workbench/dispositionFactorSources.ts'),receipt=read(prior+'/receipt.json'),artifacts=new Map(receipt.artifacts.map(a=>[a.path,a.sha256]));
 let snapshots=0,events=0,emitted=0,signals=0,coverage=0,uncovered=0;const results=[];
 for(let program=0;program<15;program++){
  const reports=new Map(),eventHashes=new Map();
  for(let prefix=0;prefix<=18;prefix++){
   const file=`snapshot-${program}-${prefix}.json.gz`,bytes=fs.readFileSync(prior+'/'+file);assert.equal(sha(bytes),artifacts.get(file));const s=JSON.parse(gunzipSync(bytes));assert.equal(s.prefix,prefix);snapshots++;
   for(const e of s.timeline.filter(e=>e.stage==='reasons')){
    const before=JSON.stringify(e),report=inspect(e);assert.equal(JSON.stringify(e),before);
    if(reports.has(e.id)){assert.equal(sha(before),eventHashes.get(e.id));assert.deepEqual(report,reports.get(e.id));continue;}
    reports.set(e.id,report);eventHashes.set(e.id,sha(before));events++;
    if(!report.emitted)continue;emitted++;
    const original=JSON.parse(e.output)[1],raw=original['Raw [4]']['Signals [3]'];assert.equal(report.rows.length,raw.length);
    for(const row of report.rows){const match=raw.filter(x=>JSON.stringify(x['Key [1]'])===row.key);assert.equal(match.length,1);assert.equal(row.strength,match[0]['SignedStrength [2]']);assert.equal(row.basis,JSON.stringify(match[0]['EvidenceBasis [3]']));signals++;if(!row.coverage.length)uncovered++;}
    const nuclei=original['Reasons [5]']['ActiveNuclei [3]'];assert.equal(report.nuclei.length,nuclei.length);
    for(const [i,n]of nuclei.entries()){
     const cs=n['RoleSummary [2]']['CoverageResults [4]'],joined=report.rows.flatMap(row=>row.coverage.filter(c=>c.nucleus===i+1).map(c=>({key:row.key,...c})));assert.equal(joined.length,cs.length);
     for(const c of cs){const x=joined.find(x=>x.key===JSON.stringify(c['SourceKey [1]']));assert(x);assert.deepEqual([x.raw,x.overlap,x.independent,x.effective],[c['RawMagnitude [2]'],c['OverlapWithPrior [3]'],c['IndependentFraction [4]'],c['EffectiveMagnitude [5]']]);coverage++;}
     assert.deepEqual(report.nuclei[i].distribution,n['Distribution [7]']);
    }
    assert.deepEqual(report.reads,e.reads.map(r=>({path:r.path,exact:r.exact})));
    if(program===0&&prefix===1){
     const mutate=fn=>{const copy=structuredClone(e),o=JSON.parse(copy.output);fn(o);o[0]['Reasons [8]']=o[1];copy.output=JSON.stringify(o);return copy;};
     assert.throws(()=>inspect(mutate(o=>o[1]['Reasons [5]']['ActiveNuclei [3]'][0]['RoleSummary [2]']['CoverageResults [4]'][0]['EffectiveMagnitude [5]']='99/1')),/lineage|arithmetic/);
     assert.throws(()=>inspect({...e,stage:'decision'}),/reasons-stage/);
    }
   }
  }
  assert.equal(reports.size,18);const filename=`program-${program}.json.gz`,bytes=gzipSync(JSON.stringify([...reports.values()])+'\n');fs.writeFileSync(root+'/'+filename,bytes,{flag:'wx'});results.push({program,path:filename,sha256:sha(bytes),events:reports.size});console.log(`PASS factor sources ${program+1}/15`);
 }
 assert.equal(snapshots,285);assert.equal(events,270);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS RECORDED DISPOSITION FACTOR SOURCE JOIN',sources,results,counts:{snapshots,events,emitted,signals,coverage,uncovered},scope:'All15 original programs/285 authenticated archived snapshots.270 unique reasons events; exact raw source-key, evidence-basis, coverage, score-distribution and evaluation-read joins. Historical events/reports remain identical in every later prefix. No new native execution, observer narration, parameter-to-signal causal attribution, complete quantization proof or integrated-entry acceptance claim.'},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({snapshots,events,emitted,signals,coverage,uncovered}));
}finally{await server.close();}
