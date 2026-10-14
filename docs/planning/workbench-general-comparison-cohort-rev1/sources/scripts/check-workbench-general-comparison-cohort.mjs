import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gzipSync, gunzipSync} from 'node:zlib';
import {createServer} from 'vite';

const root='docs/planning/workbench-general-comparison-cohort-rev1';
const nativeRoot='docs/planning/workbench-general-cohort-rev1';
const sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const catalog=JSON.parse(fs.readFileSync('src/workbench/generalComparisonCatalog.json'));
const paths=['src/workbench/generalComparison.ts','src/workbench/generalComparisonCatalog.json','src/workbench/generalAdapter.ts','src/workbench/associationProjection.ts','src/workbench/nativeTimeline.ts','src/workbench/canonical.ts','src/campaign3/generalFactory.ts','scripts/check-workbench-general-comparison-cohort.mjs',catalog.freeze.path,catalog.source.path];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
function preserve(path){const target=root+'/sources/'+path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(path),{flag:'wx'});}
for(const s of sources)preserve(s.path);
assert.equal(sha(fs.readFileSync(catalog.freeze.path)),catalog.freeze.sha256);
assert.equal(sha(fs.readFileSync(catalog.source.path)),catalog.source.sha256);
for(const path of ['src/workbench/generalAdapter.ts','src/workbench/associationProjection.ts','src/workbench/nativeTimeline.ts','src/campaign3/generalFactory.ts'])assert.equal(sha(fs.readFileSync(path)),sha(fs.readFileSync(nativeRoot+'/sources/'+path)));
function archive(path,value){
 const bytes=Buffer.from(JSON.stringify(value)+'\n'),compressed=gzipSync(bytes,{level:9});assert(compressed.length<50_000_000);assert(gunzipSync(compressed).equals(bytes));
 fs.writeFileSync(root+'/'+path,compressed,{flag:'wx'});return {path,sha256:sha(compressed),decodedSha256:sha(bytes),decodedBytes:bytes.length};
}
const readArchive=a=>{const bytes=fs.readFileSync(root+'/'+a.path);assert.equal(sha(bytes),a.sha256);const decoded=gunzipSync(bytes);assert.equal(sha(decoded),a.decodedSha256);return JSON.parse(decoded);};
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {GeneralWorkbenchRun}=await server.ssrLoadModule('/src/workbench/generalAdapter.ts');
 const {compareGeneralSnapshots}=await server.ssrLoadModule('/src/workbench/generalComparison.ts');
 const models=[],pairs=[];
 for(const [index,entry] of catalog.models.entries()){
  const run=await GeneralWorkbenchRun.create(entry.recipe,catalog.seed),snapshots=[];let terminal=false;
  for(let prefix=0;prefix<=100;prefix++){
   const before=run.checkpoint(),snapshot=run.snapshot();assert.equal(snapshot.prefix,prefix);assert.equal(snapshot.modelHash,entry.modelHash);assert.equal(snapshot.runHash,entry.runHash);
   snapshots.push(snapshot);assert.deepEqual(run.checkpoint(),before);
   if(!await run.advance()){terminal=true;break;}
  }
  assert(terminal);assert(run.snapshot().complete);
  const artifact=archive(`model-${String(index).padStart(2,'0')}.json.gz`,snapshots);
  models.push({recipe:entry.recipe,prefixes:snapshots.length,events:snapshots.at(-1).timeline.length,...artifact});
  console.log(`CAPTURE ${index+1}/43 ${entry.recipe}: ${snapshots.length} prefixes`);
 }
 // Each unique native execution is captured once. Pair reports reuse the immutable
 // snapshots; they cannot advance either run or invent cross-run event identities.
 for(const spec of catalog.comparisons){
  const a=readArchive(models.find(m=>m.recipe===spec.control)),b=readArchive(models.find(m=>m.recipe===spec.candidate));
  const clocks=[...new Set([...a,...b].map(s=>s.clock))].sort((x,y)=>BigInt(x)<BigInt(y)?-1:BigInt(x)>BigInt(y)?1:0),reports=[];
  for(const clock of clocks){
   const left=a.filter(s=>s.clock===clock),right=b.filter(s=>s.clock===clock);assert(left.length<=1&&right.length<=1);
   if(!left.length||!right.length){reports.push({clock,status:'MISSING_COMMITTED_INSTANT',controlPresent:!!left.length,candidatePresent:!!right.length});continue;}
   const before=JSON.stringify([left[0],right[0]]),report=compareGeneralSnapshots(spec.id,left[0],right[0]);
   assert.equal(report.status,'ALIGNED_COMMITTED_INSTANT');assert.deepEqual(compareGeneralSnapshots(spec.id,left[0],right[0]),report);assert.equal(JSON.stringify([left[0],right[0]]),before);
   // Independent expected unions/counts ensure projection does not silently omit
   // paths, graph cells or event slots, including differences late in the run.
   const fieldMaps=[left[0],right[0]].map(s=>new Map(s.fields.map(f=>[f.path,f.exact])));
   assert.equal(report.fields.length,new Set([...fieldMaps[0].keys(),...fieldMaps[1].keys()]).size);
   for(const f of report.fields){assert.equal(f.before,fieldMaps[0].get(f.path)??null);assert.equal(f.after,fieldMaps[1].get(f.path)??null);assert.equal(f.changed,f.before!==f.after);}
   const graphs=[left[0].graph,right[0].graph];
   if(graphs.every(Boolean)){
    assert.equal(report.graph.status,'IDENTITY_ALIGNED');const ids=new Set(graphs.flatMap(g=>g.nodes.map(n=>n.id)));assert.equal(report.graph.cells.length,ids.size**2);
    for(const c of report.graph.cells){const values=graphs.map(g=>{const row=g.nodes.map(n=>n.id).indexOf(c.row),column=g.nodes.map(n=>n.id).indexOf(c.column);return row<0||column<0?null:g.weights[row][column].exact;});assert.deepEqual([c.before,c.after],values);assert.equal(c.changed,values[0]!==values[1]);}
   }
   const eventKeys=new Set([...left[0].timeline,...right[0].timeline].map(e=>JSON.stringify([e.instant,e.phase,e.stage])));assert.equal(report.events.length,eventKeys.size);
   for(const e of report.events){assert(eventKeys.has(e.key));if(e.status!=='UNIQUE_STAGE_SLOT')assert.equal(e.outputsEqual,null);}
   reports.push(report);
  }
  const artifact=archive(spec.id+'.json.gz',reports),aligned=reports.filter(r=>r.status==='ALIGNED_COMMITTED_INSTANT');
  pairs.push({id:spec.id,control:spec.control,candidate:spec.candidate,alignedPrefixes:aligned.length,missingInstants:reports.length-aligned.length,changedStatePrefixes:aligned.filter(r=>r.fields.some(f=>f.changed)).length,changedGraphPrefixes:aligned.filter(r=>r.graph.status==='IDENTITY_ALIGNED'&&r.graph.cells.some(c=>c.changed)).length,ambiguousSlots:aligned.reduce((n,r)=>n+r.events.filter(e=>e.status==='AMBIGUOUS_STAGE_SLOT').length,0),...artifact});
  console.log(`COMPARE ${spec.id}: ${aligned.length} aligned prefixes`);
 }
 // The separately running native parity audit is a prerequisite for final success.
 // If it is not complete, retain captures and fail explicitly; do not fabricate a
 // completed receipt or treat partial model files as whole-cohort acceptance.
 const nativeReceiptPath=nativeRoot+'/receipt.json',native=JSON.parse(fs.readFileSync(nativeReceiptPath));
 assert.equal(native.status,'PASS FROZEN GA COHORT NATIVE INSTRUMENT PARITY');assert.equal(native.counts.models,43);
 const nativeEvidence=[{path:nativeReceiptPath,sha256:sha(fs.readFileSync(nativeReceiptPath))}];preserve(nativeReceiptPath);
 for(const model of models){
  const artifact=native.artifacts.find(a=>a.recipe===model.recipe);assert(artifact);const path=nativeRoot+'/'+artifact.path;assert.equal(sha(fs.readFileSync(path)),artifact.sha256);preserve(path);nativeEvidence.push({path,sha256:artifact.sha256});
  const expected=JSON.parse(fs.readFileSync(path));const snapshots=readArchive(model);assert.equal(snapshots.length,expected.prefixes.length);
  for(const [i,s]of snapshots.entries())for(const key of ['prefix','clock','modelHash','runHash','stateHash','saveHash'])assert.equal(s[key],expected.prefixes[i][key]);
 }
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS FROZEN GENERAL COMPARISON COHORT',sources,nativeEvidence,models,pairs,counts:{models:models.length,pairs:pairs.length,modelPrefixes:models.reduce((n,m)=>n+m.prefixes,0),alignedPairPrefixes:pairs.reduce((n,p)=>n+p.alignedPrefixes,0)},scope:'Full original finite calendars at frozen seed; all36 retained declarations. Captures join every model prefix to the independent native save/hash parity audit. Detached comparisons repeat identically without mutating their inputs; union and exact field/cell checks cover late differences. Lossless gzip artifacts include decoded hashes. This qualifies bounded diagnostic comparison, not causal necessity, language explanations, all-pair browser behavior, save/restore comparison UI, resource scaling or Campaign4 entry completion.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS full frozen comparison cohort');
}finally{await server.close();}
