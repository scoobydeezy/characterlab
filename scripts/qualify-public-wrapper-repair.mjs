import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/public-wrapper-quiescence-rev1',p='docs/planning/';
const read=f=>JSON.parse(fs.readFileSync(f)),sha=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex'),bytes=s=>new Uint8Array(Buffer.from(s,'hex'));
const write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const priorIdentity=read(p+'IDENTITY_PUBLIC_PLAN_REV1.json'),priorBiology=read(p+'BIOLOGY_PUBLIC_PLAN_REV3.json');
const oldBiology=[0,1,2,3].flatMap(i=>read(p+`BIOLOGY_PUBLIC_RESULT_PART${i}_REV3.json`).results);
const planPath=root+'/REPAIR_PLAN.json';
if(process.argv.includes('--freeze')){
 const files=['scripts/qualify-public-wrapper-repair.mjs','src/campaign3/publicWrapperQuiescence.ts','src/test/publicWrapperQuiescence.test.ts',...['identityTask','identityBiology','biologyPublic'].map(n=>'src/campaign3/'+n+'Runtime.ts')];
 write(planPath,{status:'FROZEN BEFORE REPAIR QUALIFICATION',scope:'Exact prior 84 identity and 58 biology cases; ordinary byte equality and all 698 previously selected complete-prefix continuations. No expanded psychological qualification.',parents:['IDENTITY_PUBLIC_PLAN_REV1.json','BIOLOGY_PUBLIC_PLAN_REV3.json'].map(n=>({path:p+n,sha256:sha(fs.readFileSync(p+n))})),artifacts:files.map(path=>({path,sha256:sha(fs.readFileSync(path))})),runs:142,prefixes:698});
 console.log('Frozen 142 runs/698 prefixes');
}else{
 const plan=read(planPath);for(const a of [...plan.parents,...plan.artifacts])assert.equal(sha(fs.readFileSync(a.path)),a.sha256,a.path);
 const archived=new Map(read(root+'/PRESERVATION.json').artifacts.map(a=>[a.original,a]));
 for(const old of [priorIdentity,priorBiology])for(const a of old.artifacts){const saved=archived.get(a.path);assert.equal(sha(fs.readFileSync(saved?.archive??a.path)),a.sha256,a.path);}
 const part=Number(process.argv.find(x=>x.startsWith('--part='))?.split('=')[1]??0);assert(part>=0&&part<4);
 const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
 try{
  const im=await server.ssrLoadModule('/src/campaign3/identityPublicModel.ts'),ip=await server.ssrLoadModule('/src/campaign3/identityPublicFactory.ts'),bm=await server.ssrLoadModule('/src/campaign3/biologyPublicModel.ts'),bp=await server.ssrLoadModule('/src/campaign3/biologyPublicFactory.ts');
  const all=[...priorIdentity.runs.map(row=>({kind:'identity',row})),...priorBiology.runs.map((row,index)=>({kind:'biology',row:{...row,index}}))];
  for(const [index,{kind,row}] of all.entries())if(index%4===part){
   const out=root+'/REPAIR_RUN_'+index+'.json';if(fs.existsSync(out)){assert.equal(read(out).status,'PASS');continue;}
   const started=Date.now();
   let source,initialState,orderedInputs,expectedModel,expectedRun,count,create,prepare,restore,old;
   if(kind==='identity'){
    const m=priorIdentity.models[row.model];source=Object.fromEntries(Object.entries(m.source).map(([k,v])=>[k,bytes(v)]));initialState=bytes(row.initialState);orderedInputs=bytes(row.orderedInputs);expectedModel=m.modelIdentity;expectedRun=row.runIdentity;count=row.count;
    ({createIdentityPublicRun:create,prepareIdentityModel:prepare,restoreIdentityPublicRun:restore}=ip);old=read(p+'IDENTITY_PUBLIC_RUN_'+row.index+'_REV1.json');
   }else{
    source=bm.biologyRecipe(row.law,row.config);initialState=bm.initialBytes(row.config.initial);orderedInputs=bm.orderedBytes(row.frames);expectedModel=row.modelIdentity;expectedRun=row.runIdentity;count=row.frames.length;
    ({createBiologyPublicRun:create,prepareBiologyModel:prepare,restoreBiologyPublicRun:restore}=bp);old=oldBiology.find(r=>r.index===row.index);
   }
   const compiled=await (kind==='identity'?im.compileIdentityModel(source):bm.compileBiologyModel(source));assert.equal(hex(compiled.modelIdentity.canonicalBytes),expectedModel);
   const run=await create(await prepare(source),{initialState,orderedInputs,runSeed:new Uint8Array(32).fill(row.seed)});assert.equal(hex(run.runIdentity()),expectedRun);
   const needed=new Set(row.prefixes.flatMap(at=>[at,Math.min(at+1,count)])),saves=new Map();let at=0;
   if(needed.has(0))saves.set(0,run.save());while(await run.settleNextInstant()){at++;if(needed.has(at))saves.set(at,run.save());}assert.equal(at,count);
   const prefixes=[];
   for(const at of row.prefixes){
    const saved=saves.get(at),expected=kind==='identity'?old.prefixes.find(p=>p.at===at).sha256:old.prefixHashes[at];assert.equal(sha(saved),expected,kind+' '+row.index+' prefix '+at);
    const restored=await restore(source,{initialState,orderedInputs,save:saved});assert.deepEqual(restored.save(),saved);assert.equal(await restored.settleNextInstant(),at<count);assert.deepEqual(restored.save(),saves.get(Math.min(at+1,count)));
    if(kind==='identity')assert.equal(sha(restored.save()),old.prefixes.find(p=>p.at===at).nextSha256);
    else assert.equal(sha(restored.save()),old.prefixHashes[Math.min(at+1,count)]);
    prefixes.push({at,sha256:sha(saved),nextSha256:sha(restored.save())});
   }
   const snapshot=run.snapshot(),observerHash=sha(run.observerView());assert.equal(observerHash,kind==='identity'?old.observerSha256:old.observerHash);assert.equal(sha(snapshot.state),kind==='identity'?old.stateSha256:old.stateHash);if(kind==='biology')assert.equal(sha(snapshot.trace),old.traceHash);
   write(out,{status:'PASS',kind,index,priorIndex:row.index,modelIdentity:expectedModel,runIdentity:expectedRun,prefixes,observerHash,stateHash:sha(snapshot.state),traceHash:sha(snapshot.trace),elapsedMs:Date.now()-started,planSha256:sha(fs.readFileSync(planPath))});console.log(kind+' '+row.index+': '+prefixes.length+' prefixes byte-identical');
  }
  write(root+'/REPAIR_PART_'+part+'.json',{status:'PASS',part,planSha256:sha(fs.readFileSync(planPath))});
 }finally{await server.close();}
}
