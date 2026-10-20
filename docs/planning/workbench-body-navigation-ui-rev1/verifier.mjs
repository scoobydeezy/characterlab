import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-body-navigation-ui-rev1',parent='docs/planning/workbench-body-navigation-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
if(process.argv.includes('--freeze')){
 assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const r=read(parent+'/receipt.json');assert.equal(r.status,'PASS BODY RECORDED NAVIGATION AND PARTICIPATION');for(const s of r.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 const script='scripts/check-workbench-body-navigation-ui.mjs',bytes=fs.readFileSync(script);fs.writeFileSync(root+'/verifier.mjs',bytes,{flag:'wx'});fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources:r.sources,parent:{path:parent+'/receipt.json',sha256:sha(fs.readFileSync(parent+'/receipt.json'))},verifier:{path:script,sha256:sha(bytes)}},null,2)+'\n',{flag:'wx'});console.log('FROZEN BODY navigation browser');
}else{
 const freeze=read(root+'/freeze.json'),b=read(root+'/browser.json');assert.equal(sha(fs.readFileSync(freeze.parent.path)),freeze.parent.sha256);assert.equal(sha(fs.readFileSync(freeze.verifier.path)),freeze.verifier.sha256);assert.equal(sha(fs.readFileSync(root+'/verifier.mjs')),freeze.verifier.sha256);
 for(const s of freeze.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(parent+'/sources/'+s.path)),s.sha256,s.path);}
 const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
 try{
  const {BodyWorkbenchRun}=await server.ssrLoadModule('/src/workbench/bodyAdapter.ts'),{bodyPressureEventLinks}=await server.ssrLoadModule('/src/workbench/bodyPressureHistory.ts'),{participationReport}=await server.ssrLoadModule('/src/workbench/participation.ts'),{recordedCausalHistory}=await server.ssrLoadModule('/src/workbench/causalNavigation.ts');
  const run=await BodyWorkbenchRun.create('baseline');await run.advance();const first=run.snapshot();await run.advance();const later=run.snapshot();
  const keys=['modelHash','runHash','stateHash','saveHash','outputsHash','traceHash'];
  const id=bodyPressureEventLinks(first.pressureRecords,first.timeline)[0].eventId;
  assert.equal(b.emptySelectorCount,0);assert.equal(b.first.selected,id);assert.deepEqual(JSON.parse(b.first.event),first.timeline.find(e=>e.id===id));assert.deepEqual(b.first.hashes,keys.map(k=>first[k]));
  assert.equal(b.later.selected,id);assert.deepEqual(JSON.parse(b.later.event),JSON.parse(b.first.event));assert.deepEqual(b.later.hashes,keys.map(k=>later[k]));
  const ancestor=first.timeline.find(e=>e.id===b.ancestor.selected);assert(ancestor);assert(recordedCausalHistory(first.timeline,id).nodes.some(n=>n.distance>0&&n.event.id===ancestor.id));assert.deepEqual(JSON.parse(b.ancestor.event),ancestor);assert.deepEqual(b.ancestor.hashes,b.first.hashes);
  const expected=participationReport({modelHash:later.modelHash,runHash:later.runHash,stateHash:later.stateHash,saveHash:later.saveHash,prefix:later.prefix},later.timeline,later.fields);assert.deepEqual(JSON.parse(b.participation),expected);assert.equal(b.filteredRows,1);
  assert(expected.rows.find(r=>r.root==='455').events.some(e=>e.id===b.stateLink.selected));assert.deepEqual(JSON.parse(b.stateLink.event),later.timeline.find(e=>e.id===b.stateLink.selected));assert.deepEqual(b.stateLink.hashes,b.later.hashes);assert.equal(b.resetSelectorCount,0);assert.equal(b.alerts,0);
  fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED BODY NAVIGATION BROWSER',sourceFreeze:freeze,pressureEvent:id,ancestor:b.ancestor.selected,stateEvent:b.stateLink.selected,artifacts:['browser.json','navigation.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),scope:'Original baseline prefixes0/1/2. Character pressure link, recorded ancestor link, historical event stability, exact participation export, root filter/state-event link and fresh-run reset verified against native execution. All six hashes preserved by inspection. Full browser cohort and canonical topology remain separate.'},null,2)+'\n',{flag:'wx'});console.log('PASS bounded BODY navigation browser');
 }finally{await server.close();}
}
