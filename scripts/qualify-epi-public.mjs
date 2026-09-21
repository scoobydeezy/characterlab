import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const planPath='docs/planning/EPI_PUBLIC_EXPERIMENT_PLAN_REV1.json',resultPath='docs/planning/EPI_PUBLIC_EXPERIMENT_REV1.json';
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const fx=await server.ssrLoadModule('/src/test/epiFixtures.ts'),model=await server.ssrLoadModule('/src/campaign3/epiModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/epiFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/epiCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts');
 const cases=fx.epiCases(),runs=[];
 for(const law of [1,2,3])for(const numeric of [1,2])for(const name of Object.keys(cases))runs.push({name,law,numeric});
 const contracts=['docs/formal/EPI_PUBLIC_CONTRACT.md','docs/formal/EPI_PUBLIC_ALLOCATION_TABLE.json','docs/planning/campaign3-epi-model-rev1/FREEZE.json'];
 if(process.argv.includes('--plan')){
  const rows=[];for(const row of runs){const source=model.epiRecipe(row.law,row.numeric),m=await model.compileEpiModel(source),orderedInputs=fx.originals(cases[row.name]),input=await model.compileEpiInputs(m,fx.initialState,orderedInputs,fx.seed);rows.push({...row,modelIdentity:hex(m.modelIdentity.canonicalBytes),runIdentity:hex(input.runIdentity.canonicalBytes),orderedInputs:hex(orderedInputs)});}
  fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE PUBLIC EXECUTION',contract:'epi-public/0.1-candidate',artifacts:contracts.map(path=>({path,sha256:hash(fs.readFileSync(path))})),gates:['exact19/20 physical pair; only potential changes','all six character output kinds and both retained state owners equal','potential and overflow leak controls detectable','permitted measurement control changes learning and encoding','missing and zero-information unknown distinct from retained encoding','prior130 frozen before both140 writers','every prefix byte-equal restore and next continuation'],runs:rows},null,2)+'\n',{flag:'wx'});console.log('Frozen '+rows.length+' runs');
 }else{
  assert(!fs.existsSync(resultPath),'immutable result exists');const plan=JSON.parse(fs.readFileSync(planPath));for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256);
  const results=[],views=new Map();let restores=0,advancing=0;
  for(const row of plan.runs){
   const source=model.epiRecipe(row.law,row.numeric),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createEpiRun(await factory.prepareEpiModel(source),{initialState:fx.initialState,orderedInputs,runSeed:fx.seed});assert.equal(hex(run.runIdentity()),row.runIdentity);
   const saves=[run.save()];while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++){const restored=await factory.restoreEpiRun(source,{initialState:fx.initialState,orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);const advanced=await restored.settleNextInstant();assert.equal(advanced,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advanced)advancing++;}
   const view=run.characterView(),outputs=data.dataItems(codec.decodeEpi(run.snapshot().outputs),'list'),id=`${row.law}/${row.numeric}/${row.name}`;views.set(id,{view,outputs,orderedInputs});
   results.push({...row,prefixes:saves.length,runIdentity:row.runIdentity,saveSha256:hash(run.save()),stateSha256:hash(view.state),characterOutputsSha256:hash(view.outputs),researchOutputsSha256:hash(run.snapshot().outputs),traceSha256:hash(run.snapshot().trace)});console.log('Executed '+id+' prefixes='+saves.length);
  }
  const f=data.dataField,rec=data.dataRecord;
  for(const law of [1,2,3])for(const numeric of [1,2]){
   const get=name=>views.get(`${law}/${numeric}/${name}`);
   for(const name of ['established','informative','fresh','missing']){
    const a=get(name+'A'),b=get(name+'B');
    // Compare input structure after replacing precisely the manipulated potential.
    const aa=data.dataItems(codec.decodeEpi(a.orderedInputs),'list'),bb=data.dataItems(codec.decodeEpi(b.orderedInputs),'list');let changes=0;
    for(let i=0;i<aa.length;i++){const af=data.dataItems(f(rec(aa[i],899n),2n),'list'),bf=data.dataItems(f(rec(bb[i],899n),2n),'list');assert.equal(af.length,bf.length);for(let j=0;j<af.length;j++){const ar=rec(af[j],898n),br=rec(bf[j],898n);for(const k of [1n,3n,4n])assert.deepEqual(f(ar,k),f(br,k));if(data.dataKey(f(ar,2n))!==data.dataKey(f(br,2n)))changes++;}}
    assert.equal(changes,1);
    if(law===1||name==='missing')assert.deepEqual(a.view,b.view);else assert.notDeepEqual(a.view,b.view);
   }
   if(law===1){const a=get('establishedA'),b=get('establishedB'),ta=fx.records(a.outputs,912n).at(-1),tb=fx.records(b.outputs,912n).at(-1);assert.deepEqual(f(ta,4n),f(tb,4n));assert.notDeepEqual(f(ta,3n),f(tb,3n));assert.notDeepEqual(f(ta,5n),f(tb,5n));assert.notDeepEqual(get('permittedA').view,get('permittedB').view);assert.deepEqual(get('missingA').view.state,fx.initialState);assert.equal(fx.records(get('zero').outputs,905n)[0].fields.has(4n),false);assert.equal(fx.records(get('zero').outputs,910n).length,1);}
  }
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),runs:results.length,restores,advancing,terminal:restores-advancing,results},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({status:'PASS',runs:results.length,restores,advancing}));
 }
}finally{await server.close();}
