import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const dir='docs/planning/defining-public-matrix-rev1',p='docs/planning/',sha=b=>createHash('sha256').update(b).digest('hex'),hash=f=>sha(fs.readFileSync(f)),read=f=>JSON.parse(fs.readFileSync(f)),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const arg=n=>process.argv[process.argv.indexOf(n)+1];
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):e.name.endsWith('.ts')||e.name.endsWith('.json')?[d+'/'+e.name]:[]);
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const factory=await server.ssrLoadModule('/src/campaign3/definingPublicFactory.ts'),model=await server.ssrLoadModule('/src/campaign3/definingPublicModel.ts'),meaning=await server.ssrLoadModule('/src/campaign3/definingMeaning.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts');
 const cases=meaning.definingMeaningCases(),{canonicalEncode:enc}=canonical,{dataRecord:rec,dataField:f}=data;
 const files=[...walk('src'),...walk('docs/formal'),'scripts/qualify-defining-public-matrix.mjs',p+'DEFINING_PUBLIC_IMPLEMENTATION_CHECK_REV1.json',p+'DEFINING_NATIVE_COHORT_CHECK_REV1.json',...cases.map((_,i)=>p+'defining-native-cohort-rev1/CASE_'+String(i).padStart(2,'0')+'.json')].sort();
 const manifest={version:1,contract:'defining-public/0.1-candidate',scope:'68 real public programs; every S0/settled prefix restores through the frozen public API from original inputs. Exact Save132 and observer bytes, then one actual successor (or final exhaustion). Full-tail continuation at39 is separately preserved by the focused suite. No direct saved-state injection.',cases,expectedPrefixes:1680,files:files.map(path=>({path,sha256:hash(path)}))};
 if(process.argv.includes('--prepare')){fs.mkdirSync(dir);write(dir+'/MANIFEST.json',manifest);console.log('Prepared68 programs/1680 real public restores');}
 else{
  assert.deepEqual(read(dir+'/MANIFEST.json'),manifest,'Frozen matrix source changed');const manifestHash=hash(dir+'/MANIFEST.json');
  const worker=Number(arg('--worker')),workers=Number(arg('--workers'));assert(Number.isInteger(worker)&&Number.isInteger(workers)&&worker>=0&&worker<workers&&workers<=4);
  const bytesEqual=(a,b)=>assert(Buffer.from(a).equals(Buffer.from(b)),'Canonical bytes differ');
  for(let index=worker;index<cases.length;index+=workers){
   const caseDir=dir+'/CASE_'+String(index).padStart(2,'0'),done=caseDir+'/RESULT.json';
   if(fs.existsSync(done)){const r=read(done);assert.equal(r.status,'PASS');assert.equal(r.manifestHash,manifestHash);for(const f of r.files)assert.equal(hash(f.path),f.sha256);console.log(JSON.stringify({worker,index,status:'PRESERVED PASS',prefixes:r.prefixes}));continue;}
   fs.mkdirSync(caseDir,{recursive:true});const start=Date.now(),spec=cases[index];let phase='baseline',prefix=-1;
   try{
    const source=model.definingPublicRecipe(spec),handle=await factory.prepareDefiningPublicModel(source),originals=factory.definingPublicOriginals(handle),run=await factory.createDefiningPublicRun(handle,originals),native=read(p+'defining-native-cohort-rev1/CASE_'+String(index).padStart(2,'0')+'.json');
    const images=[],views=[],rows=[];
    function capture(){const save=run.save(),view=run.observerView(),s=rec(model.parseDefiningPublic(save),132n),at=f(s,4n);assert.equal(at.kind,'signed');const clock=String(at.value),old=native.stages.find(s=>s.clock===clock);if(old){assert.equal(sha(enc(f(s,5n))),old.state);assert.equal(sha(enc(f(s,12n))),old.outputs);}images.push(save);views.push(view);rows.push({clock,save:sha(save),saveBytes:save.length,observer:sha(view),nativeStageCompared:!!old});}
    capture();while(await run.settleNextInstant())capture();assert.deepEqual(rows.map(r=>r.clock),['0',...native.instants]);assert.equal(rows.filter(r=>r.nativeStageCompared).length,native.stages.length);
    const baseline={index,spec,manifestHash,modelIdentity:Buffer.from(run.modelIdentity()).toString('hex'),runIdentity:Buffer.from(run.runIdentity()).toString('hex'),source:sha(source.parameters),initialState:sha(originals.initialState),orderedInputs:sha(originals.orderedInputs),rows};
    const baselinePath=caseDir+'/BASELINE.json';if(fs.existsSync(baselinePath))assert.deepEqual(read(baselinePath),baseline);else write(baselinePath,baseline);const baselineHash=hash(baselinePath);
    console.log(JSON.stringify({worker,index,status:'BASELINE PASS',prefixes:rows.length}));
    for(prefix=0;prefix<images.length;prefix++){
     phase='restore';const path=caseDir+'/PREFIX_'+String(prefix).padStart(2,'0')+'.json',expected={index,prefix,clock:rows[prefix].clock,manifestHash,baselineHash,save:rows[prefix].save,observer:rows[prefix].observer,nextSave:rows[prefix+1]?.save??rows[prefix].save,nextObserver:rows[prefix+1]?.observer??rows[prefix].observer,exhausted:prefix===images.length-1};
     if(fs.existsSync(path)){const old=read(path);assert.equal(old.status,'PASS');for(const [k,v]of Object.entries(expected))assert.deepEqual(old[k],v);continue;}
     const began=Date.now(),restored=await factory.restoreDefiningPublicRun(source,{initialState:originals.initialState,orderedInputs:originals.orderedInputs,save:images[prefix]});bytesEqual(restored.save(),images[prefix]);bytesEqual(restored.observerView(),views[prefix]);
     phase='successor';assert.equal(await restored.settleNextInstant(),!expected.exhausted);const next=Math.min(prefix+1,images.length-1);bytesEqual(restored.save(),images[next]);bytesEqual(restored.observerView(),views[next]);
     write(path,{status:'PASS',...expected,elapsedMs:Date.now()-began});console.log(JSON.stringify({worker,index,prefix,clock:expected.clock,status:'RESTORE PASS',elapsedMs:Date.now()-began}));
    }
    const receipts=[baselinePath,...rows.map((_,i)=>caseDir+'/PREFIX_'+String(i).padStart(2,'0')+'.json')];write(done,{status:'PASS',index,spec,manifestHash,prefixes:rows.length,nativeStageComparisons:native.stages.length,elapsedMs:Date.now()-start,files:receipts.map(path=>({path,sha256:hash(path)}))});console.log(JSON.stringify({worker,index,status:'CASE PASS',prefixes:rows.length,elapsedMs:Date.now()-start}));
   }catch(e){const failure=caseDir+'/FAILURE_'+Date.now()+'.json';write(failure,{status:'FAIL',index,spec,phase,prefix,manifestHash,error:e.stack??String(e),elapsedMs:Date.now()-start});throw e;}
  }
 }
}finally{await server.close();}
