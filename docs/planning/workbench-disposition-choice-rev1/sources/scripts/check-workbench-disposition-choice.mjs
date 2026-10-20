import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync,gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-choice-rev1',prior='docs/planning/workbench-disposition-comparison-rev1',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const files=new Set();function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of ['src/workbench/DispositionComparisonPanel.tsx','src/workbench/DispositionWorkbench.tsx','scripts/check-workbench-disposition-choice.mjs',prior+'/receipt.json','package-lock.json'])visit(p);
const sources=[...files].sort().map(p=>{const b=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,b,{flag:'wx'});return{path:p,sha256:sha(b)};});fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {dispositionChoiceComparison:compare}=await server.ssrLoadModule('/src/workbench/dispositionChoiceComparison.ts'),{DISPOSITION_CONTRASTS:contrasts}=await server.ssrLoadModule('/src/workbench/dispositionComparison.ts');
 const artifacts=new Map(JSON.parse(fs.readFileSync(prior+'/receipt.json')).artifacts.map(a=>[a.path,a.sha256])),last=new Map(),reports=[];let snapshots=0,rows=0;const outcomes={};
 const direct=s=>s.timeline.filter(e=>e.stage==='decision').map(e=>{const out=JSON.parse(e.output);return {instant:e.instant,decisionEvent:e.id,emitted:out.length===1,candidate:out.length?JSON.stringify(out[0]['Resolution [3]']['Result [4]']['ChosenData [2]']['CandidateKey [1]']):null};});
 for(let prefix=0;prefix<=18;prefix++){
  const byName=new Map();for(let i=0;i<15;i++){const name=`snapshot-${i}-${prefix}.json.gz`,bytes=fs.readFileSync(prior+'/'+name);assert.equal(sha(bytes),artifacts.get(name));const s=JSON.parse(gunzipSync(bytes));byName.set(s.program,s);snapshots++;}
  for(const c of contrasts){
   const a=byName.get(c.a),b=byName.get(c.b),before=JSON.stringify([a,b]),r=compare(c.id,a,b),x=direct(a),y=direct(b);
   assert.equal(JSON.stringify([a,b]),before);assert.equal(r.rows.length,prefix);
   for(let j=0;j<prefix;j++){const row=r.rows[j];for(const [side,expected] of [['a',x[j]],['b',y[j]]]){assert.equal(row[side].instant,expected.instant);assert.equal(row[side].decisionEvent,expected.decisionEvent);assert.equal(row[side].emitted,expected.emitted);assert.equal(row[side].candidate,expected.candidate);}
    const expected=x[j].emitted!==y[j].emitted?'emission differs':!x[j].emitted?'neither emitted':x[j].candidate===y[j].candidate?'same choice':'different choice';assert.equal(row.outcome,expected);outcomes[expected]=(outcomes[expected]??0)+1;rows++;
   }
   assert.deepEqual(r.firstDifference,r.rows.find(v=>['different choice','emission differs'].includes(v.outcome))??null);
   if(last.has(c.id))assert.deepEqual(r.rows.slice(0,-1),last.get(c.id).rows);last.set(c.id,r);reports.push(r);
   if(prefix===1&&c.id==='model/0/13'){
    assert.throws(()=>compare(c.id,b,a),/ordered/);const bad=structuredClone(a);bad.timeline.find(e=>e.stage==='decision').parents=[];assert.throws(()=>compare(c.id,bad,b),/lineage/);
    const zero=structuredClone(b);zero.prefix=0;zero.clock='0';zero.timeline=[];const unequal=compare(c.id,a,zero);assert.equal(unequal.rows[0].outcome,'unaligned');assert.equal(unequal.firstDifference,null);
   }
  }
  console.log(`PASS choice contrasts prefix ${prefix}/18`);
 }
 assert.equal(reports.length,570);assert.equal(snapshots,285);const bytes=gzipSync(JSON.stringify(reports)+'\n');fs.writeFileSync(root+'/reports.json.gz',bytes,{flag:'wx'});
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS RECORDED DISPOSITION CHOICE COMPARISON',sources,counts:{snapshots,contrasts:contrasts.length,reports:reports.length,rows,outcomes},artifact:{path:'reports.json.gz',sha256:sha(bytes)},scope:'All30 declared contrasts at all19 authenticated original prefixes. Direct decision output comparison agrees with reason/decision/intent joins. Historical rows remain unchanged; reversed branches, malformed parent joins reject; missing instants withhold comparison. Recorded choice or emission difference is not successful execution, observer knowledge, psychological significance or independent causal necessity.'},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
