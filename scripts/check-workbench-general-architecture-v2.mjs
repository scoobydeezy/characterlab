import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync,gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-general-architecture-rev2',parent='docs/planning/workbench-general-comparison-cohort-rev1',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const prior=JSON.parse(fs.readFileSync(parent+'/receipt.json'));
const files=new Set();function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(ts|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1]),child=[stem,stem+'.ts',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of ['src/workbench/generalArchitecture.ts','CHARACTER_ARCHITECTURE.md','docs/formal/GENERAL_ATTENTION_WRITE_SCOPE_POLICY.json','src/campaign3/generalWriteScope.ts','docs/formal/CAMPAIGN2_PERMANENT_ALLOCATION.md','docs/formal/TASK_COMMITMENTS.md','docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json','scripts/check-workbench-general-architecture-v2.mjs'])visit(p);
const sources=[...files].sort().map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return {path:p,sha256:sha(bytes)};});fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {generalArchitectureParticipation,GENERAL_ARCHITECTURE_BINDINGS:bindings}=await server.ssrLoadModule('/src/workbench/generalArchitecture.ts');
 const architecture=fs.readFileSync('CHARACTER_ARCHITECTURE.md','utf8'),policy=JSON.parse(fs.readFileSync('docs/formal/GENERAL_ATTENTION_WRITE_SCOPE_POLICY.json'));
 assert.equal(bindings.length,10);
 const allocation=fs.readFileSync('docs/formal/CAMPAIGN2_PERMANENT_ALLOCATION.md','utf8'),commitment=fs.readFileSync('docs/formal/TASK_COMMITMENTS.md','utf8');
 for(const b of bindings){
  assert(architecture.includes(`${b.box}[`));
  if(b.root==='302'){assert.equal(b.box,'RegAdapt');assert.equal(b.schema,'RegulatoryAdaptationState');assert(allocation.includes('| 302 | ADAPT | RegulatoryAdaptationState |'));}
  else if(b.root==='373'){assert.equal(b.box,'Prospection');assert.equal(b.schema,'TaskCommitmentState');assert(commitment.includes('one authority/prospective-commitments owner'));}
  else assert(policy.stages.some(s=>s.roots.includes(b.schema)));
 }
 let prefixes=0,mapped=0,unmapped=0;const results=[],unknownRoots=new Set();
 for(const [index,model]of prior.models.entries()){
  const bytes=fs.readFileSync(parent+'/'+model.path);assert.equal(sha(bytes),model.sha256);const snapshots=JSON.parse(gunzipSync(bytes)),reports=[];
  for(const snapshot of snapshots){
   const before=JSON.stringify(snapshot),report=generalArchitectureParticipation(snapshot),counts=new Map();
   const touch=(path,root)=>{if(!counts.has(path))counts.set(path,{root,reads:0,mutations:0,changes:0,present:false,events:new Set()});return counts.get(path);};
   for(const f of snapshot.fields)touch(f.path,f.root).present=true;
   for(const event of snapshot.timeline){
    for(const [kind,entries]of [['reads',event.reads],['mutations',event.diffs]])for(const entry of entries){
     const label=JSON.parse(entry.label),root=Object.entries(label).find(([k])=>k.endsWith(' [1]'))[1],c=touch(entry.path,root);assert.equal(c.root,root);c[kind]++;if(kind==='mutations'&&entry.changed)c.changes++;c.events.add(event.id);
    }
   }
   assert.equal(report.rows.length,counts.size);
   for(const row of report.rows){const c=counts.get(row.path);assert(c);assert.equal(row.root,c.root);for(const k of ['reads','mutations','changes'])assert.equal(row[k],c[k]);assert.equal(row.presentAtRevision,c.present);assert.deepEqual(new Set(row.events.map(e=>e.id)),c.events);if(row.binding)mapped++;else{unmapped++;unknownRoots.add(row.root);}}
   for(const box of report.boxes){const roots=bindings.filter(b=>b.box===box.box).map(b=>b.root),selected=[...counts].filter(([,c])=>roots.includes(c.root));assert.equal(box.observedPaths,selected.length);for(const k of ['reads','mutations','changes'])assert.equal(box[k],selected.reduce((n,[,c])=>n+c[k],0));assert.equal(box.currentlyPresent,selected.filter(([,c])=>c.present).length);assert.deepEqual(new Set(box.eventIds),new Set(selected.flatMap(([,c])=>[...c.events])));}
   assert.deepEqual(report.unmappedPaths,report.rows.filter(r=>!bindings.some(b=>b.root===r.root)).map(r=>r.path));assert.equal(JSON.stringify(snapshot),before);assert.deepEqual(generalArchitectureParticipation(snapshot),report);reports.push(report);prefixes++;
  }
  const filename=`model-${String(index).padStart(2,'0')}.json.gz`;fs.writeFileSync(root+'/'+filename,gzipSync(JSON.stringify(reports),{level:9}),{flag:'wx'});results.push({recipe:model.recipe,path:filename,sha256:sha(fs.readFileSync(root+'/'+filename)),original:parent+'/'+model.path,originalSha256:model.sha256});
  if(index===0){const base=snapshots.at(-1);const bad=structuredClone(base);bad.fields[0].root='0';assert.throws(()=>generalArchitectureParticipation(bad),/root\/path/);const duplicate=structuredClone(base);duplicate.fields.push(duplicate.fields[0]);assert.throws(()=>generalArchitectureParticipation(duplicate),/duplicate/);assert.throws(()=>generalArchitectureParticipation({...base,seamVersion:'other'}),/profile/);}
 }
 assert.equal(prefixes,568);assert.equal(mapped,7284);assert.equal(unmapped,3364);assert.deepEqual([...unknownRoots].sort(),['268','362','581','649']);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS SCOPED GENERAL CANONICAL PARTICIPATION',sources,results,counts:{models:results.length,prefixes,mappedPathObservations:mapped,unmappedPathObservations:unmapped},unmappedRoots:[...unknownRoots].sort(),scope:'Ten source-bound root correspondences to five existing canonical boxes; every path and count independently joined across43 original General models/568 prefixes. Unmapped roots remain explicit, historical paths remain decoded, and input snapshots stay unchanged. No complete architecture coverage, behavioral contribution, observer-language or reduction claim.'},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({status:'PASS',prefixes,mapped,unmapped,unmappedRoots:[...unknownRoots]}));
}finally{await server.close();}
