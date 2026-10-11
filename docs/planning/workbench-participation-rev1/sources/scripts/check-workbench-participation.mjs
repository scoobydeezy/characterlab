import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/workbench-participation-rev1';
assert(!fs.existsSync(`${root}/receipt.json`),'immutable receipt exists');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const paths=['src/workbench/participation.ts','src/workbench/ParticipationInspector.tsx','src/workbench/GeneralWorkbench.tsx','src/workbench/generalAdapter.ts','src/workbench/nativeTimeline.ts','scripts/check-workbench-participation.mjs'];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const prior=JSON.parse(fs.readFileSync('docs/planning/workbench-general-parity-rev1/receipt.json','utf8')).results.find(r=>r.recipe==='baseline');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const {GeneralWorkbenchRun}=await server.ssrLoadModule('/src/workbench/generalAdapter.ts');
 const {participationReport}=await server.ssrLoadModule('/src/workbench/participation.ts');
 const run=await GeneralWorkbenchRun.create(); const prefixes=[]; let finalReport;
 do {
  const s=run.snapshot(); const identity=Object.fromEntries(['modelHash','runHash','saveHash','stateHash','prefix'].map(k=>[k,s[k]]));
  const report=participationReport(identity,s.timeline,s.fields);
  assert.equal(s.saveHash,prior.prefixes[s.prefix].saveHash);
  const paths=new Set([...s.fields.map(f=>f.path),...s.timeline.flatMap(e=>[...e.reads,...e.diffs].map(d=>d.path))]);
  assert.deepEqual(report.rows.map(r=>r.path),[...paths].sort());
  for(const row of report.rows) {
   assert.equal(row.presentAtRevision,s.fields.some(f=>f.path===row.path));
   assert.equal(row.reads,s.timeline.flatMap(e=>e.reads).filter(r=>r.path===row.path).length);
   assert.equal(row.mutations,s.timeline.flatMap(e=>e.diffs).filter(r=>r.path===row.path).length);
   assert.equal(row.changes,s.timeline.flatMap(e=>e.diffs).filter(r=>r.path===row.path&&r.changed).length);
   assert.deepEqual(row.events.map(e=>e.id),s.timeline.filter(e=>[...e.reads,...e.diffs].some(r=>r.path===row.path)).map(e=>e.id));
  }
  assert.equal(run.checkpoint().saveHash,s.saveHash);
  prefixes.push({prefix:s.prefix,saveHash:s.saveHash,events:s.timeline.length,paths:report.rows.length,reads:report.rows.reduce((n,r)=>n+r.reads,0),mutations:report.rows.reduce((n,r)=>n+r.mutations,0),changes:report.rows.reduce((n,r)=>n+r.changes,0)});
  finalReport=report;
 } while(await run.advance());
 assert.equal(prefixes.length,prior.prefixes.length);
 for(const source of sources) assert.equal(sha(fs.readFileSync(source.path)),source.sha256);
 fs.mkdirSync(root,{recursive:true});
 for(const source of sources) {const target=`${root}/sources/${source.path}`;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(source.path),{flag:'wx'});}
 fs.writeFileSync(`${root}/report.json`,JSON.stringify(finalReport,null,2)+'\n',{flag:'wx'});
 fs.writeFileSync(`${root}/receipt.json`,JSON.stringify({status:'PASS BOUNDED STATE PARTICIPATION CENSUS',sources,prefixes,limitations:['Baseline seed0 only; no corpus aggregation or canonical subsystem mapping.','Actual-read/diff census, not causal necessity or intervention evidence.']},null,2)+'\n',{flag:'wx'});
 console.log(`PASS ${prefixes.length} prefixes; ${finalReport.events} events; ${finalReport.rows.length} exact state paths`);
} finally {await server.close();}
