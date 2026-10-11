import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const dir='docs/planning/values-integration-matrix-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex'),write=(f,x)=>fs.writeFileSync(f,JSON.stringify(x,null,2)+'\n',{flag:'wx'});fs.mkdirSync(dir,{recursive:true});
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const factory=await server.ssrLoadModule('/src/campaign3/valuesIntegrationPublicFactory.ts'),model=await server.ssrLoadModule('/src/campaign3/valuesIntegrationPublicModel.ts'),component=await server.ssrLoadModule('/src/campaign3/valuesIntegration.ts');
 const base=()=>[1,2,3,4].map(instant=>({instant,opportunity:instant!==1,linked:true,need:0,direction:1,mode:'ValuesOnly',command:instant===1?'Adopt':'None',world:{permitted:true,outcome:1},observation:{visible:true,category:true,display:'Actual',goalVisible:true,goalDisplay:'Actual',forecast:1}}));
 const cases={success:base()};
 const add=(name,fn)=>{const xs=base();fn(xs);cases[name]=xs;};
 add('withheld',xs=>xs.forEach(x=>x.observation.visible=false));
 add('fixed-positive-success',xs=>xs.forEach(x=>{x.observation.display='Positive';x.observation.goalDisplay='Present';}));
 add('fixed-positive-failure',xs=>xs.forEach(x=>{x.world.permitted=false;x.world.outcome=-1;x.observation.display='Positive';x.observation.goalDisplay='Present';}));
 add('fixed-positive-negative-truth',xs=>xs.forEach(x=>{x.world.outcome=-1;x.observation.display='Positive';x.observation.goalDisplay='Present';}));
 add('neutral',xs=>xs.forEach(x=>x.observation.display='Neutral'));
 add('missing-category',xs=>xs.forEach(x=>x.observation.category=false));
 add('no-opportunity',xs=>xs.forEach(x=>{x.opportunity=false;x.observation.display='Positive';}));
 add('observed-failure',xs=>xs.forEach(x=>x.world.permitted=false));
 add('goal-open',xs=>xs.forEach(x=>x.observation.goalVisible=false));
 add('retired',xs=>{xs.forEach(x=>x.observation.goalVisible=false);xs[2].opportunity=false;xs[2].command='Retire';});
 add('retire-control',xs=>{xs.forEach(x=>x.observation.goalVisible=false);xs[2].opportunity=false;});
 add('contrary',xs=>xs[3].observation.display='Negative');
 add('unknown-forecast',xs=>xs.forEach(x=>x.observation.forecast=null));
 add('zero-forecast',xs=>xs.forEach(x=>x.observation.forecast=0));
 add('reverse-context',xs=>xs[3].direction=-1);
 add('need-only',xs=>xs.forEach(x=>{x.need=1;x.mode='NeedOnly';}));
 add('joint',xs=>xs.forEach(x=>{x.need=1;x.mode='Joint';}));
 const profiles=['Accumulated','Refold','Latest','NoConsolidation'].map(law=>({law,appraisal:'ValueRelative'}));profiles.push({law:'Accumulated',appraisal:'NoValueAppraisal'});
 const runs=[],models=[],graph=new Set();
 function visit(f){f=f.replaceAll('\\','/');if(graph.has(f))return;graph.add(f);if(!f.endsWith('.ts'))return;for(const hit of fs.readFileSync(f,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const base=path.resolve(path.dirname(f),hit[1].split('?')[0]),found=[base,base+'.ts',base+'.json',path.join(base,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(found);visit(path.relative(process.cwd(),found));}}
 ['src/campaign3/valuesIntegrationPublicFactory.ts','src/campaign3/valuesIntegration.ts','src/test/valuesIntegrationPublic.test.ts','src/test/valuesIntegration.test.ts'].forEach(visit);
 ['scripts/qualify-values-integration.mjs','docs/formal/VALUES_INTEGRATION_PUBLIC_CONTRACT.md','docs/formal/VALUES_INTEGRATION_COMPONENT_CONTRACT.md','docs/formal/VALUES_INTEGRATION_PUBLIC_ALLOCATION_TABLE.json'].forEach(f=>graph.add(f));
 for(const profile of profiles){const source=model.integrationRecipe(profile.law,profile.appraisal),handle=await factory.prepareIntegrationModel(source);models.push({...profile,identity:hex((await model.compileIntegrationModel(source)).modelIdentity.canonicalBytes)});
  for(const [name,frames] of Object.entries(cases))for(const seed of name==='success'?[0,1,2,3,4,5,6,7]:[0]){
   const initialState=model.integrationInitial(),orderedInputs=model.integrationOrdered(frames),run=await factory.createIntegrationPublicRun(handle,{initialState,orderedInputs,runSeed:new Uint8Array(32).fill(seed)});
   runs.push({index:runs.length,...profile,name,seed,frames,runIdentity:hex(run.runIdentity()),initialSha256:sha(initialState),inputsSha256:sha(orderedInputs)});
  }
 }
 const plan={status:'FROZEN BEFORE EXECUTION',version:model.VERSION,models,runs,prefixes:runs.reduce((n,r)=>n+r.frames.length+1,0),artifacts:[...graph].sort().map(path=>({path,sha256:sha(fs.readFileSync(path))})),scope:'Five model profiles; eight baseline seeds each, all seventeen interventions at seed0 for every profile. Every native row equals component; every original public prefix restores with one successor, terminal included. Controlled categories/forecast remain explicit.'};
 if(process.argv.includes('--freeze')){write(dir+'/plan.json',plan);console.log(`FROZEN ${models.length} models/${runs.length} runs/${plan.prefixes} prefixes`);}
 else{
  assert.deepEqual(JSON.parse(fs.readFileSync(dir+'/plan.json')),plan,'frozen plan mismatch');
  const selected=process.argv.find(x=>x.startsWith('--model='))?.split('=')[1];
  for(const row of runs.filter(r=>selected===undefined||profiles[Number(selected)].law===r.law&&profiles[Number(selected)].appraisal===r.appraisal)){
   const out=`${dir}/run-${row.index}.json`;if(fs.existsSync(out)){assert(process.argv.includes('--resume'));const old=JSON.parse(fs.readFileSync(out));assert.equal(old.status,'PASS');assert.equal(old.runIdentity,row.runIdentity);continue;}
   try{
    const source=model.integrationRecipe(row.law,row.appraisal),initialState=model.integrationInitial(),orderedInputs=model.integrationOrdered(row.frames),run=await factory.createIntegrationPublicRun(await factory.prepareIntegrationModel(source),{initialState,orderedInputs,runSeed:new Uint8Array(32).fill(row.seed)}),control=component.createValuesIntegration({law:row.law,appraisal:row.appraisal,seed:row.seed},row.frames),prefixes=[];
    for(let prefix=0;prefix<=row.frames.length;prefix++){
     const save=run.save(),restored=await factory.restoreIntegrationPublicRun(source,{initialState,orderedInputs,save});assert.deepEqual(restored.save(),save);assert.deepEqual(restored.characterProjection(),run.characterProjection());
     const p={prefix,saveSha256:sha(save),saveBytes:save.length};
     if(prefix<row.frames.length){assert(await restored.settleNextInstant());assert(await run.settleNextInstant());assert(await control.step());assert.deepEqual(restored.save(),run.save());assert.deepEqual(run.rows(),control.observerView().rows);p.successorSha256=sha(run.save());}
     else {assert.equal(await restored.settleNextInstant(),false);assert.deepEqual(restored.save(),save);p.terminal=true;}
     prefixes.push(p);
    }
    write(out,{status:'PASS',index:row.index,runIdentity:row.runIdentity,law:row.law,appraisal:row.appraisal,name:row.name,seed:row.seed,prefixes,rows:run.rows(),world:control.snapshot().world,traceSha256:sha(run.snapshot().trace),randomAddresses:run.snapshot().randomAddresses,nativeStages:row.frames.length*13});console.log(`PASS ${row.index} ${row.law}/${row.appraisal}/${row.name}/${row.seed}`);
   }catch(e){write(`${dir}/failure-${row.index}.json`,{index:row.index,error:String(e),stack:e.stack});throw e;}
  }
 }
}finally{await server.close();}
