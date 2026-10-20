import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-branch-ui-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex'),sources=read(root+'/sources.json'),b=read(root+'/browser.json');
assert(!fs.existsSync(root+'/receipt.json'));for(const s of sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);assert.equal(sha(fs.readFileSync(root+'/sources/'+s.path)),s.sha256);}
assert.equal(b.sliderDraft,'1/8');assert.equal(b.pair0.contrast.id,'model/0/13');assert.equal(b.pair1.a.prefix,1);assert.equal(b.pair2.a.prefix,2);
assert.deepEqual(b.mainBefore,b.mainAfter);assert.equal(b.mainBefore.length,5);assert(b.mainBefore.every(x=>/^[0-9a-f]{64}$/.test(x)));
assert(b.mainControlsDisabled);assert(b.singleCheckpointHidden);assert(b.mainControlsRestored);assert.deepEqual(b.retainedBranch,b.branchB.hashes);assert.deepEqual(b.retainedReason,b.branchB.reason);
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {DispositionWorkbenchRun:Run}=await server.ssrLoadModule('/src/workbench/dispositionAdapter.ts'),{compareDisposition:compare}=await server.ssrLoadModule('/src/workbench/dispositionComparison.ts'),{inspectDispositionReasons:reason}=await server.ssrLoadModule('/src/workbench/dispositionReasonDiagnostics.ts'),{participationReport}=await server.ssrLoadModule('/src/workbench/participation.ts');
 const pair=[await Run.create('Plastic/Main'),await Run.create('Plastic/ConstitutionPositive')];
 for(let prefix=0;prefix<=2;prefix++){
  if(prefix)for(const r of pair)await r.advance();
  assert.deepEqual(await compare('model/0/13',pair[0].snapshot(),pair[1].snapshot()),b['pair'+prefix]);
  if(prefix===1)for(const [i,display] of [b.branchA,b.branchB].entries()){
   const s=pair[i].snapshot();assert.deepEqual(display.hashes,['modelHash','runHash','stateHash','saveHash','projectionHash'].map(k=>s[k]));assert.equal(display.projection,s.mechanismProjection);
   const e=s.timeline.find(e=>e.id===display.event.id);assert(e);assert.deepEqual(display.event,e);assert.deepEqual(display.reason,reason(e));
   const identity=Object.fromEntries(['modelHash','runHash','saveHash','stateHash','prefix'].map(k=>[k,s[k]]));assert.deepEqual(display.participation,participationReport(identity,s.timeline,s.fields));
   const original=read(`docs/planning/DISPOSITION_PUBLIC_RUN_${i===0?0:13}_REV1.json`);assert.equal(s.saveHash,original.prefixes.find(p=>p.at===1).saveSha256);
  }
 }
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED DISPOSITION BRANCH INSPECTION',sources,artifacts:['browser.json','branch.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),scope:'Slider draft+1/8 creates declared original model pair0/13. Fresh native reports at0/1/2 match browser; both committed prefix1 branches share exact projection, reason event and participation identities across modes. Main commands disabled during detached selection; independent main run unchanged after return. Pair advancement2 leaves selected branch1 and its historical reason unchanged until explicit reselection. No full corpus language, 3D, summary export or completed integrated16-step demonstration claim.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS slider→declared pair→both branch inspection→reason/timeline/architecture→historical stability→main-run return');
}finally{await server.close();}
