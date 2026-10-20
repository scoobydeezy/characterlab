import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync,gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-calibration-rev1',prior='docs/planning/workbench-disposition-comparison-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const files=new Set();
function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of ['src/workbench/DispositionReasonPanel.tsx','src/campaign3/dispositionPublicMath.ts','docs/formal/DISPOSITIONAL_ADAPTATION_CONTRACT.md','scripts/check-workbench-disposition-calibration.mjs',prior+'/receipt.json','docs/planning/workbench-disposition-factors-rev1/receipt.json'])visit(p);
const sources=[...files].sort().map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return{path:p,sha256:sha(bytes)};});fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {dispositionCalibration:inspect}=await server.ssrLoadModule('/src/workbench/dispositionCalibration.ts'),artifacts=new Map(read(prior+'/receipt.json').artifacts.map(a=>[a.path,a.sha256]));
 let events=0,emitted=0,nuclei=0,learning=0,nonLearning=0,nonzeroModifiers=0,cappedModifiers=0;const results=[];
 for(let program=0;program<15;program++){
  const file=`snapshot-${program}-18.json.gz`,bytes=fs.readFileSync(prior+'/'+file);assert.equal(sha(bytes),artifacts.get(file));const s=JSON.parse(gunzipSync(bytes)),reports=[];
  for(const e of s.timeline.filter(e=>e.stage==='reasons')){
   const before=JSON.stringify(e),r=inspect(e,s.seamVersion);assert.equal(JSON.stringify(e),before);reports.push(r);events++;
   if(!r.emitted)continue;emitted++;r.learning?learning++:nonLearning++;
   const actual=JSON.parse(e.output)[1]['Reasons [5]']['ActiveNuclei [3]'];assert.equal(r.nuclei.length,actual.length);
   for(const [i,n]of r.nuclei.entries()){
    const a=actual[i],roles=a['RoleSummary [2]'];assert.equal(String(n.die),a['BaseDie [4]']);assert.equal(n.relevance,a['Relevance [3]']);
    assert.deepEqual(n.roles.map(r=>r.boundedNet),[roles['BaseNet [1]'],roles['StandingNet [2]'],roles['SituationalNet [3]']]);
    assert.equal(n.standingModifier,a['StandingModifier [5]']);assert.equal(n.situationalModifier,a['SituationalModifier [6]']);
    assert.deepEqual(new Map(n.masses.map(m=>[m.score,m.mass])),new Map(a['Distribution [7]']['Masses [1]']));
    for(const role of n.roles)if(role.modifier){if(role.modifier.result!=='0')nonzeroModifiers++;if(['3','-3'].includes(role.modifier.result))cappedModifiers++;}nuclei++;
   }
   if(program===0&&e.instant==='1'){
    assert.throws(()=>inspect(e,'disposition-public/other'),/version/);
    const bad=structuredClone(e),out=JSON.parse(bad.output);out[1]['Reasons [5]']['ActiveNuclei [3]'][0]['BaseDie [4]']='12';out[0]['Reasons [8]']=out[1];bad.output=JSON.stringify(out);assert.throws(()=>inspect(bad,s.seamVersion),/die-band/);
    const wrong=structuredClone(e),input=JSON.parse(wrong.input);input[0]['Learning [6]']=!input[0]['Learning [6]'];wrong.input=JSON.stringify(input);assert.throws(()=>inspect(wrong,s.seamVersion),/lineage/);
   }
  }
  assert.equal(reports.length,18);const filename=`program-${program}.json.gz`,saved=gzipSync(JSON.stringify(reports)+'\n');fs.writeFileSync(root+'/'+filename,saved,{flag:'wx'});results.push({program,path:filename,sha256:sha(saved),snapshot:{path:prior+'/'+file,sha256:sha(bytes)}});console.log(`PASS calibration ${program+1}/15`);
 }
 assert.equal(events,270);assert.equal(emitted,250);assert(nonLearning>0&&nonzeroModifiers>0&&cappedModifiers>0);
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS DISPOSITION SOURCE-BOUND CALIBRATION RECONSTRUCTION',sources,results,counts:{programs:15,events,emitted,nuclei,learning,nonLearning,nonzeroModifiers,cappedModifiers},scope:'All270 unique reasons events in15 authenticated terminal snapshots; inherited history-stability evidence covers their285 prefix occurrences. Reconstructs role signed totals/bounding, relevance, zero-base activation, fixed die bands, context-dependent truncation/capping and complete exact score distributions; results agree with recorded native outputs. Version/context/output mismatch negatives reject. This is diagnostic reconstruction, not a runtime quantization trace, observer narration or general calibration law selection.'},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({events,emitted,nuclei,learning,nonLearning,nonzeroModifiers,cappedModifiers}));
}finally{await server.close();}
