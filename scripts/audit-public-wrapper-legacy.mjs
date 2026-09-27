import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/public-wrapper-quiescence-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'}),load=p=>server.ssrLoadModule('/'+p);
try{
 const {canonicalEncode:enc}=await load('src/substrate/canonicalEncoding.ts');
 const concurrency=process.argv.includes('--concurrent');
 for(const name of (concurrency?['embodied']:['multisource','receiving','longitudinal','embodied'])){
  let runtime;
  if(name==='multisource'){
   const {multisourceRecipe}=await load('src/campaign3/multisourceModelRecipe.ts'),{compileMultisourceModel}=await load('src/campaign3/multisourceModel.ts'),{compileMultisourceInputs}=await load('src/campaign3/multisourceInputs.ts'),{createMultisourceRuntime}=await load('src/campaign3/multisourceRuntime.ts'),c=multisourceRecipe('shared','GroundAggregate'),model=await compileMultisourceModel(c.source),input=await compileMultisourceInputs(model,c.initialState,c.orderedInputs,new Uint8Array(32).fill(7));runtime=createMultisourceRuntime(model,input,model.initialState(c.initialState));
  }else if(name==='receiving'){
   const fx=await load('src/test/receivingFixtures.ts'),{compileReceivingModel}=await load('src/campaign3/receivingModel.ts'),{compileReceivingInputs}=await load('src/campaign3/receivingInputs.ts'),{createReceivingRuntime}=await load('src/campaign3/receivingRuntime.ts'),model=await compileReceivingModel(fx.receivingSource),initial=model.initialState(enc(fx.initialReceiving().canonicalValue())),input=await compileReceivingInputs(enc(fx.receivingOriginals()),enc(initial.canonicalValue()),model.modelIdentity,new Uint8Array(32),fx.taskKey);runtime=createReceivingRuntime(model,input,initial);
  }else if(name==='longitudinal'){
   const fx=await load('src/test/longitudinalFixtures.ts'),m=await load('src/campaign3/longitudinalModel.ts'),r=await load('src/campaign3/longitudinalRuntime.ts'),model=await m.compileLongitudinalModel(m.longitudinalRecipe()),input=await m.compileLongitudinalInputs(model,enc(model.initial.canonicalValue()),fx.longitudinalInputs(fx.longitudinalScenario()),new Uint8Array(32));runtime=r.createLongitudinalRuntime(model,input);
  }else{
   const {embodiedFixtureBytes:bytes}=await load('src/test/embodiedFixtures.ts'),{compileEmbodiedModel}=await load('src/campaign3/embodiedModel.ts'),{compileEmbodiedInputs}=await load('src/campaign3/embodiedAdmission.ts'),{createEmbodiedRuntime}=await load('src/campaign3/embodiedRuntime.ts'),freeze=read('docs/planning/campaign3-embodied-model-rev2/FREEZE.json');
   const model=await compileEmbodiedModel({...freeze.versions,content:bytes('baseline/content.cenc.hex'),registry:bytes('baseline/registry.cenc.hex'),parameters:bytes('baseline/parameters.cenc.hex')}),initial=bytes('runs/baseline/initial-state.cenc.hex'),input=await compileEmbodiedInputs(bytes('runs/baseline/ordered-inputs.cenc.hex'),initial,model.modelIdentity,new Uint8Array(32));runtime=createEmbodiedRuntime(model,input,model.state.restoreState(initial));
  }
  const settle=runtime.settleForConformance??runtime.settleNextInstantForConformance,rows=[];
  if(concurrency){
   let second;
   await settle({onBoundary(b){if(b==='before-commit')queueMicrotask(()=>{second=runtime.settleNextInstant().then(x=>({accepted:true,advanced:!!x}),e=>({accepted:false,error:String(e)}));});}});
   const result=await second;
   const revision=process.argv.find(x=>x.startsWith('--revision='))?.split('=')[1]??'1';
   fs.writeFileSync(root+'/embodied-concurrent-rev'+revision+'.json',JSON.stringify({result,status:runtime.snapshot().status,clock:String(runtime.snapshot().clock)},null,2)+'\n',{flag:'wx'});console.log(result);continue;
  }
  for(let at=1;at<=64;at++){
   let observed;const result=await settle({onBoundary(b){if(b==='before-commit')queueMicrotask(()=>{
    observed={};try{observed.saveSha256=sha(runtime.save());observed.accepted=true;}catch(e){observed.accepted=false;observed.error=String(e);}
    try{runtime.snapshot();observed.snapshotAccepted=true;}catch(e){observed.snapshotAccepted=false;}
    if(runtime.committedRandomAddressKeys)try{runtime.committedRandomAddressKeys();observed.ledgerAccepted=true;}catch(e){observed.ledgerAccepted=false;}
   });}});if(!result)break;assert(observed);const final=sha(runtime.save());rows.push({at,observed,final,partialSave:observed.accepted&&observed.saveSha256!==final});
  }
  fs.writeFileSync(root+'/'+name+'-probe-rev1.json',JSON.stringify({name,status:'PROBED',rows,torn:rows.some(r=>r.partialSave)},null,2)+'\n',{flag:'wx'});console.log(name+': '+rows.length+' instants, torn='+rows.some(r=>r.partialSave));
 }
}finally{await server.close();}
