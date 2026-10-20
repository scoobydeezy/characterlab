import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync,gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-resolution-rev1',prior='docs/planning/workbench-disposition-comparison-rev1',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const files=new Set();
function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of ['src/workbench/DispositionReasonPanel.tsx','src/campaign2/cognitiveArbitration.ts','docs/formal/DISPOSITION_PUBLIC_CONTRACT.md','scripts/check-workbench-disposition-resolution.mjs',prior+'/receipt.json'])visit(p);
const sources=[...files].sort().map(p=>{const b=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,b,{flag:'wx'});return{path:p,sha256:sha(b)};});fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {dispositionResolution:inspect}=await server.ssrLoadModule('/src/workbench/dispositionResolution.ts'),artifacts=new Map(JSON.parse(fs.readFileSync(prior+'/receipt.json')).artifacts.map(a=>[a.path,a.sha256])),results=[];let events=0,emitted=0,draws=0,ties=0;const modes={};
 for(let program=0;program<15;program++){
  const file=`snapshot-${program}-18.json.gz`,bytes=fs.readFileSync(prior+'/'+file);assert.equal(sha(bytes),artifacts.get(file));const s=JSON.parse(gunzipSync(bytes)),reports=[];
  for(const reason of s.timeline.filter(e=>e.stage==='reasons')){
   const r=inspect(s.timeline,reason.id,s.seamVersion);reports.push(r);events++;
   const decision=s.timeline.find(e=>e.id===r.decisionEvent),intent=s.timeline.find(e=>e.id===r.intentEvent);assert.deepEqual(decision.parents,[reason.id]);assert.deepEqual(intent.parents,[decision.id]);
   if(!r.emitted)continue;emitted++;draws+=r.draws.length;modes[r.mode]=(modes[r.mode]??0)+1;
   const data=JSON.parse(decision.output)[0]['Resolution [3]']['Result [4]']['ChosenData [2]'];
   assert.equal(r.chosenCandidate,JSON.stringify(data['CandidateKey [1]']));assert.deepEqual(r.probabilities,data['Probabilities [2]']);assert.deepEqual(r.tie,data['TieBreak [10]']);if(r.tie['VariantTag [1]']==='2')ties++;
   for(const d of r.draws){const raw=data['ReasonDraws [9]'].find(x=>JSON.stringify(x['NucleusKey [1]'])===d.key);assert(raw);assert.equal(d.face,raw['Face [6]']);assert.equal(d.contribution,raw['SignedContribution [7]']);assert.deepEqual(d.random,raw['Draw [5]']);}
   if(program===0&&reason.instant==='1'){
    const bad=structuredClone(s.timeline);bad.find(e=>e.id===r.decisionEvent).parents=[];assert.throws(()=>inspect(bad,reason.id,s.seamVersion),/lineage/);
    const altered=structuredClone(s.timeline),target=altered.find(e=>e.id===r.decisionEvent),o=JSON.parse(target.output);o[0]['Resolution [3]']['Result [4]']['ChosenData [2]']['ReasonDraws [9]'][0]['Face [6]']='100';target.output=JSON.stringify(o);assert.throws(()=>inspect(altered,reason.id,s.seamVersion));
    assert.throws(()=>inspect(s.timeline,reason.id,'other'),/profile/);
   }
  }
  const filename=`program-${program}.json.gz`,saved=gzipSync(JSON.stringify(reports)+'\n');fs.writeFileSync(root+'/'+filename,saved,{flag:'wx'});results.push({program,path:filename,sha256:sha(saved)});console.log(`PASS resolution ${program+1}/15`);
 }
 assert.equal(events,270);assert.equal(emitted,250);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS DISPOSITION RECORDED RESOLUTION LINKAGE',sources,results,counts:{programs:15,events,emitted,draws,ties,modes},scope:'All unique reasons events from authenticated terminal snapshots. Parent links and exact reasons/decision/intent copies, nucleus/draw trace joins and face/modifier signed contributions verified. Original probabilities and tie records are exposed, not independently recalculated by this inspector. Chosen intent is not execution. No player disclosure or full-entry claim.'},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
