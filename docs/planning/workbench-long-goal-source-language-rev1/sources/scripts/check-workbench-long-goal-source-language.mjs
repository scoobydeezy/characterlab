import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-long-goal-source-language-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),planPath='docs/planning/LONGITUDINAL_GOAL_PLAN_REV1.json',planBytes=fs.readFileSync(planPath),plan=JSON.parse(planBytes);
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const paths=[planPath,'src/workbench/longGoalSourceObserver.ts','src/workbench/longExplanations.ts','src/workbench/canonical.ts','src/test/workbenchLongGoalSourceObserver.test.ts','src/test/longGoalHistoricalFixture.ts','scripts/check-workbench-long-goal-source-language.mjs',...fs.readdirSync('src/campaign3').filter(p=>/^longitudinal.*\.ts$/.test(p)).map(p=>'src/campaign3/'+p)];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));for(const s of sources){const target=root+'/sources/'+s.path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(s.path),{flag:'wx'});}
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'}),results=[];let descriptions=0;
try{const {describeLongGoalSource}=await server.ssrLoadModule('/src/workbench/longGoalSourceObserver.ts');
 for(const [index,p]of plan.runs.entries()){
  const originalPath=`docs/planning/longitudinal-goal-execution-rev1/${String(index).padStart(3,'0')}.json`,bytes=fs.readFileSync(originalPath),original=JSON.parse(bytes);assert.equal(original.planSha256,sha(planBytes));assert.equal(original.runIdentity,p.runIdentity);assert.equal(original.modelIdentity,p.modelIdentity);assert.equal(original.state.rows.length,16);
  const rows=[];
  for(let prefix=0;prefix<=16;prefix++){
   const input={prefix,rows:original.state.rows.slice(0,prefix).map(({at,sourceView})=>({at,sourceView}))},before=JSON.stringify(input),report=await describeLongGoalSource(input);assert.deepEqual(await describeLongGoalSource(input),report);assert.equal(JSON.stringify(input),before);
   if(prefix===0){assert.equal(report.status,'NO_RECORDED_SOURCE_OBSERVATION');assert(!('description'in report));}else{
    assert.equal(report.status,'RECORDED_NATIVE_OBSERVER');const native=original.state.rows[prefix-1];assert.equal(report.sourceClock,native.at);assert.equal(report.description.observerHash,sha(Buffer.from(native.sourceView,'hex')));assert.equal(report.description.rows.length,6);
    assert.equal(JSON.parse(report.description.rows.find(r=>r.id==='identity').exact),native.standing);
    const episodes=JSON.parse(report.description.rows.find(r=>r.id==='episodes').exact);assert(episodes);assert(report.description.rows.find(r=>r.id==='episodes').text.startsWith(`The current view exposes ${native.episodes} retained episodes.`));
    for(const r of report.description.rows)assert.equal(r.authority,'native-closed-observer');descriptions+=6;
   }
   rows.push({prefix,saveHash:original.prefixHashes[prefix],report});
  }
  const path=`case-${String(index).padStart(3,'0')}.json`;fs.writeFileSync(root+'/'+path,JSON.stringify({index,originalPath,originalSha256:sha(bytes),rows})+'\n',{flag:'wx'});results.push({path,sha256:sha(fs.readFileSync(root+'/'+path))});
  if((index+1)%20===0)console.log(`PASS source descriptions ${index+1}/120`);
 }
 assert.equal(descriptions,11520);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS HISTORICAL LONG GOAL SOURCE OBSERVER DESCRIPTIONS',sources,results,counts:{cases:120,prefixes:2040,noRecordedObservation:120,observations:1920,descriptions},scope:'Latest closed native observer bytes retained in each original goal component row. Exact observer digest, standing and episode count checked; deterministic descriptions exclude goal ledger/receiver/world state. Historical row projection only; current adapter full replay, browser display, component goal language and complete reason explanations remain separate.'},null,2)+'\n',{flag:'wx'});console.log('PASS LONG goal source language:11520 descriptions');
}finally{await server.close();}
