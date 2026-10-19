import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-long-habit-ui-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),ui=JSON.parse(fs.readFileSync(root+'/ui.json')),paths=['src/workbench/LongHabitWorkbench.tsx','src/workbench/LongHabitComparisonPanel.tsx','src/workbench/longHabitAdapter.ts','src/workbench/longHabitWorker.ts','src/workbench/longHabitWorkerClient.ts','src/workbench/longHabitComparison.ts','src/workbench/longHabitPairCheckpoint.ts','src/workbench/inspectionRegistry.ts','src/workbench/WorkbenchApp.tsx','src/test/workbenchInspectionRegistry.test.ts','docs/planning/LONGITUDINAL_HABIT_PLAN_REV2.json','scripts/check-workbench-long-habit-ui.mjs'];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));for(const s of sources){const out=root+'/sources/'+s.path;fs.mkdirSync(out.slice(0,out.lastIndexOf('/')),{recursive:true});fs.writeFileSync(out,fs.readFileSync(s.path),{flag:'wx'});}
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {LongHabitWorkbenchRun}=await server.ssrLoadModule('/src/workbench/longHabitAdapter.ts'),{compareLongHabitSnapshots}=await server.ssrLoadModule('/src/workbench/longHabitComparison.ts');
 const hashes=s=>['modelHash','runHash','saveHash','pairHash','reusedNativeSaveHash'].map(k=>s[k]);
 const a=await LongHabitWorkbenchRun.create(0),b=await LongHabitWorkbenchRun.create(96),original=[0,96].map(i=>JSON.parse(fs.readFileSync(`docs/planning/longitudinal-habit-execution-rev2/${String(i).padStart(3,'0')}.json`)));
 assert.deepEqual(ui.initial,{hashes:hashes(a.snapshot()),state:a.snapshot().state});assert.deepEqual(ui.restoredHashes,ui.initial.hashes);
 for(let n=1;n<=9;n++){
  await a.advance();await b.advance();for(const [i,r]of [a,b].entries()){assert.equal(r.snapshot().saveHash,original[i].prefixes[n].saveHash);assert.equal(r.snapshot().pairHash,original[i].prefixes[n].pairHash);}
  if(n===1){assert.deepEqual(ui.advanced,{hashes:hashes(a.snapshot()),state:a.snapshot().state});assert.deepEqual(ui.repeated,ui.advanced);}
  if(n===8||n===9)assert.deepEqual(ui['pair'+n],await compareLongHabitSnapshots('keepEpisodes:0:96',a.snapshot(),b.snapshot()));
 }
 assert.deepEqual(ui.pairRestored,ui.pair8);assert.deepEqual(ui.afterPairHashes,ui.advanced.hashes);assert.deepEqual(ui.routeHashes,ui.advanced.hashes);assert.deepEqual(ui.modes.map(m=>m.mode),['Reasoning','Timeline','Architecture']);for(const m of ui.modes)assert.deepEqual(m.hashes,ui.advanced.hashes);
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 const artifacts=['ui.json','habit.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))}));fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED LONG HABIT BROWSER',sources,artifacts,scope:'Main case0 exact state/five hashes at prefixes0/1; in-memory restore and repeated successor. Retention comparison0/96 complete report at prefixes8/9 and restore8 matches current direct receiver and original save/pair commitments. Comparison/mode/route work preserves main five hashes. No full960-case browser coverage, arbitrary import rejection, file download/roundtrip, resource qualification or observer-safe character narration claimed.'},null,2)+'\n',{flag:'wx'});console.log('PASS bounded habit browser state, comparison, replay and isolation');
}finally{await server.close();}
